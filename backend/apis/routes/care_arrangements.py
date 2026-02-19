"""
Care arrangement endpoints.

Define how care is delivered for a recipient within an organization:
visits only, 24/7 caregiver only, or both.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_db_session,
)
from backend.apis.schemas.care_arrangement import (
    CareArrangementCreate,
    CareArrangementUpdate,
    CareArrangementResponse,
)
from backend.database.entities.care_arrangement import CareArrangement


router = APIRouter(prefix="/care-arrangements", tags=["Care arrangements"])


@router.get("", response_model=List[CareArrangementResponse])
def list_care_arrangements(
    care_recipient_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[CareArrangementResponse]:
    """
    List care arrangements, optionally filtered by care recipient and/or organization.
    """
    q = db.query(CareArrangement).filter(CareArrangement.organization_id == organization_id)
    if care_recipient_id is not None:
        q = q.filter(CareArrangement.care_recipient_id == care_recipient_id)
    return q.order_by(CareArrangement.created_at.desc()).all()


@router.get("/{arrangement_id}", response_model=CareArrangementResponse)
def get_care_arrangement(
    arrangement_id: UUID,
    db: Session = Depends(get_db_session),
) -> CareArrangementResponse:
    """Get a care arrangement by ID."""
    arr = db.get(CareArrangement, arrangement_id)
    if not arr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Care arrangement not found")
    return arr


@router.post("", response_model=CareArrangementResponse, status_code=status.HTTP_201_CREATED)
def create_care_arrangement(
    payload: CareArrangementCreate,
    db: Session = Depends(get_db_session),
) -> CareArrangementResponse:
    """
    Create a care arrangement.

    Enforces at most one active arrangement per (care_recipient_id, organization_id)
    by ending any existing open-ended arrangement when a new one is created.
    """
    # Close existing open-ended arrangements for this recipient/org
    existing = (
        db.query(CareArrangement)
        .filter(
            CareArrangement.care_recipient_id == payload.care_recipient_id,
            CareArrangement.organization_id == payload.organization_id,
            CareArrangement.effective_to.is_(None),
        )
        .all()
    )
    for arr in existing:
        arr.effective_to = payload.effective_from

    arr = CareArrangement(
        care_recipient_id=payload.care_recipient_id,
        organization_id=payload.organization_id,
        mode=payload.mode,
        effective_from=payload.effective_from,
        effective_to=payload.effective_to,
        notes=payload.notes,
    )

    db.add(arr)
    db.commit()
    db.refresh(arr)
    return arr


@router.patch("/{arrangement_id}", response_model=CareArrangementResponse)
def update_care_arrangement(
    arrangement_id: UUID,
    payload: CareArrangementUpdate,
    db: Session = Depends(get_db_session),
) -> CareArrangementResponse:
    """
    Partially update a care arrangement.

    Does not attempt to manage history; callers should create a new arrangement
    record when changing modes from a specific date.
    """
    arr = db.get(CareArrangement, arrangement_id)
    if not arr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Care arrangement not found")

    if payload.mode is not None:
        arr.mode = payload.mode
    if payload.effective_from is not None:
        arr.effective_from = payload.effective_from
    if payload.effective_to is not None:
        arr.effective_to = payload.effective_to
    if payload.notes is not None:
        arr.notes = payload.notes

    db.add(arr)
    db.commit()
    db.refresh(arr)
    return arr

