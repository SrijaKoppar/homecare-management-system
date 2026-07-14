"""
Person (user) endpoints.

CRUD and listing for people, scoped by organization membership.
"""

from typing import List
from uuid import UUID
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.apis.schemas.person import PersonResponse, PersonCreate, PersonUpdate
from backend.apis.schemas.membership import MembershipRole
from backend.apis.dependencies import get_current_organization_id, get_db_session
from backend.apis.security import hash_password
from backend.database.entities.membership import Membership
from backend.database.entities.user import User

router = APIRouter(prefix="/persons", tags=["Persons"])
logger = logging.getLogger(__name__)

MAX_PAGE_SIZE = 100


def _person_response(user: User, membership: Membership | None = None) -> PersonResponse:
    return PersonResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        display_name=user.display_name,
        phone=user.phone,
        status=user.status,
        membership_id=membership.id if membership else None,
        role=membership.role if membership else None,
        membership_status=membership.status if membership else None,
        title=membership.title if membership else None,
        location_id=membership.location_id if membership else None,
    )


@router.get("", response_model=List[PersonResponse])
def list_persons(
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
    role: MembershipRole | None = Query(default=None),
    search: str | None = Query(default=None),
    limit: int = Query(50, ge=1, le=MAX_PAGE_SIZE),
    offset: int = Query(0, ge=0),
) -> List[PersonResponse]:
    """
    List persons (users) scoped by organization membership.
    """
    query = (
        db.query(User, Membership)
        .join(Membership, Membership.user_id == User.id)
        .filter(
            User.status != "archived",
            Membership.organization_id == UUID(organization_id),
            Membership.status != "inactive",
        )
    )
    if role:
        query = query.filter(Membership.role == role.value)
    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.first_name.ilike(term),
                User.last_name.ilike(term),
                User.display_name.ilike(term),
                User.email.ilike(term),
                User.phone.ilike(term),
            )
        )

    rows = (
        query.order_by(User.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [_person_response(user, membership) for user, membership in rows]


@router.post("", response_model=PersonResponse, status_code=status.HTTP_201_CREATED)
def create_person(
    payload: PersonCreate,
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> PersonResponse:
    """
    Create a person (user).

    For now this creates a User row with status `invited` and no password;
    a real invite flow can later attach tokens and email.
    """
    org_id = payload.organization_id or UUID(organization_id)
    existing = db.query(User).filter(User.email.ilike(payload.email)).first()
    if existing and db.query(Membership).filter(
        Membership.user_id == existing.id,
        Membership.organization_id == org_id,
    ).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already belongs to this organization.",
        )

    user = existing or User(
        email=payload.email.strip().lower(),
        first_name=payload.first_name,
        last_name=payload.last_name,
        display_name=payload.display_name,
        phone=payload.phone,
        password_hash=hash_password(payload.password) if payload.password else None,
        status="invited",
    )
    if existing:
        user.first_name = payload.first_name
        user.last_name = payload.last_name
        user.display_name = payload.display_name
        user.phone = payload.phone
        if payload.password:
            user.password_hash = hash_password(payload.password)
    db.add(user)
    db.flush()

    membership = Membership(
        user_id=user.id,
        organization_id=org_id,
        role=(payload.role or "family_viewer").value if hasattr(payload.role, "value") else (payload.role or "family_viewer"),
        title=payload.title,
        location_id=payload.location_id,
        status=(payload.status.value if hasattr(payload.status, "value") else payload.status) if payload.status else "invited",
    )
    db.add(membership)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Membership for this user and organization already exists.",
        )
    db.refresh(user)
    db.refresh(membership)
    logger.info("Created user %s (%s)", user.id, user.email)
    return _person_response(user, membership)


@router.get("/{person_id}", response_model=PersonResponse)
def get_person(
    person_id: UUID,
    db: Session = Depends(get_db_session),
    org_id: str = Depends(get_current_organization_id),
) -> PersonResponse:
    """Get a person by ID."""
    user = db.get(User, person_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Person not found")
    
    membership = None
    if org_id:
        membership = (
            db.query(Membership)
            .filter(Membership.user_id == person_id, Membership.organization_id == org_id)
            .first()
        )
    return _person_response(user, membership)


@router.patch("/{person_id}", response_model=PersonResponse)
def update_person(
    person_id: UUID,
    payload: PersonUpdate,
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> PersonResponse:
    """Partially update a person."""
    user = db.get(User, person_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Person not found")

    if payload.first_name is not None:
        user.first_name = payload.first_name
    if payload.last_name is not None:
        user.last_name = payload.last_name
    if payload.display_name is not None:
        user.display_name = payload.display_name
    if payload.phone is not None:
        user.phone = payload.phone

    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == person_id,
            Membership.organization_id == UUID(organization_id),
        )
        .first()
    )
    if membership:
        if payload.role is not None:
            membership.role = payload.role.value
        if payload.title is not None:
            membership.title = payload.title
        if payload.location_id is not None:
            membership.location_id = payload.location_id
        if payload.membership_status is not None:
            membership.status = payload.membership_status.value
        db.add(membership)

    db.add(user)
    db.commit()
    db.refresh(user)
    if membership:
        db.refresh(membership)
    return _person_response(user, membership)


@router.delete("/{person_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_person(
    person_id: UUID,
    db: Session = Depends(get_db_session),
    org_id: str = Depends(get_current_organization_id),
) -> None:
    """Soft delete a person by marking membership inactive or user archived."""
    user = db.get(User, person_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Person not found")

    membership = (
        db.query(Membership)
        .filter(Membership.user_id == person_id, Membership.organization_id == UUID(org_id))
        .first()
    )

    if membership:
        membership.status = "inactive"
        db.add(membership)

    # Check if there are any other active memberships for this user
    other_memberships_count = (
        db.query(Membership)
        .filter(Membership.user_id == person_id, Membership.status != "inactive")
        .count()
    )

    if other_memberships_count == 0:
        user.status = "archived"
        db.add(user)

    db.commit()
