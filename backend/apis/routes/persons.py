"""
Person (user) endpoints.

CRUD and listing for people. For MVP we treat `User` as global (not yet
scoped by organization membership in these endpoints).
"""

from typing import List
from uuid import UUID
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.schemas.person import PersonResponse, PersonCreate, PersonUpdate
from backend.apis.dependencies import get_db_session
from backend.database.entities.user import User

router = APIRouter(prefix="/persons", tags=["Persons"])
logger = logging.getLogger(__name__)

MAX_PAGE_SIZE = 100


@router.get("", response_model=List[PersonResponse])
def list_persons(
    db: Session = Depends(get_db_session),
    limit: int = Query(50, ge=1, le=MAX_PAGE_SIZE),
    offset: int = Query(0, ge=0),
) -> List[PersonResponse]:
    """
    List all persons (users).

    In a future iteration this should be scoped by organization membership
    and the current authenticated user.
    """
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return users


@router.post("", response_model=PersonResponse, status_code=status.HTTP_201_CREATED)
def create_person(
    payload: PersonCreate,
    db: Session = Depends(get_db_session),
) -> PersonResponse:
    """
    Create a person (user).

    For now this creates a User row with status `invited` and no password;
    a real invite flow can later attach tokens and email.
    """
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    user = User(
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        display_name=payload.display_name,
        status="invited",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("Created user %s (%s)", user.id, user.email)
    return user


@router.get("/{person_id}", response_model=PersonResponse)
def get_person(person_id: UUID, db: Session = Depends(get_db_session)) -> PersonResponse:
    """Get a person by ID."""
    user = db.get(User, person_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Person not found")
    return user


@router.patch("/{person_id}", response_model=PersonResponse)
def update_person(
    person_id: UUID,
    payload: PersonUpdate,
    db: Session = Depends(get_db_session),
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

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
