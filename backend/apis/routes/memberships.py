"""
Membership endpoints.

Link users to organizations with roles and status.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_current_user_id,
    get_db_session,
)
from backend.apis.schemas.membership import (
    MembershipCreate,
    MembershipUpdate,
    MembershipResponse,
)
from backend.database.entities.membership import Membership


router = APIRouter(prefix="/memberships", tags=["Memberships"])


@router.get("", response_model=List[MembershipResponse])
def list_memberships(
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[MembershipResponse]:
    """List all memberships. Later this can be scoped by current user or organization."""
    memberships = (
        db.query(Membership)
        .filter(Membership.organization_id == organization_id)
        .order_by(Membership.created_at.desc())
        .all()
    )
    return memberships


@router.get("/{membership_id}", response_model=MembershipResponse)
def get_membership(
    membership_id: UUID,
    db: Session = Depends(get_db_session),
) -> MembershipResponse:
    """Get a membership by ID."""
    membership = db.get(Membership, membership_id)
    if not membership:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Membership not found")
    return membership


@router.post("", response_model=MembershipResponse, status_code=status.HTTP_201_CREATED)
def create_membership(
    payload: MembershipCreate,
    db: Session = Depends(get_db_session),
    invited_by: str = Depends(get_current_user_id),
) -> MembershipResponse:
    """
    Create a membership (link user to organization with role).

    Enforces one membership per (user, organization) via DB unique constraint.
    """
    membership = Membership(
        user_id=payload.user_id,
        organization_id=payload.organization_id,
        role=payload.role,
        title=payload.title,
        location_id=payload.location_id,
        status=payload.status,
        invited_by_id=invited_by,
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

    db.refresh(membership)
    return membership


@router.patch("/{membership_id}", response_model=MembershipResponse)
def update_membership(
    membership_id: UUID,
    payload: MembershipUpdate,
    db: Session = Depends(get_db_session),
) -> MembershipResponse:
    """Partially update a membership (role, title, status, location)."""
    membership = db.get(Membership, membership_id)
    if not membership:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Membership not found")

    if payload.role is not None:
        membership.role = payload.role
    if payload.title is not None:
        membership.title = payload.title
    if payload.location_id is not None:
        membership.location_id = payload.location_id
    if payload.status is not None:
        membership.status = payload.status

    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership

