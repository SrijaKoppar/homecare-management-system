"""
Visit endpoints.

Schedule, update, and manage visits for care recipients.
Includes explicit start and end actions to manage status and timestamps.
"""

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_current_user_id,
    get_db_session,
)
from backend.apis.schemas.visit import VisitCreate, VisitUpdate, VisitResponse
from backend.database.entities.visit import Visit


router = APIRouter(prefix="/visits", tags=["Visits"])


@router.get("", response_model=List[VisitResponse])
def list_visits(
    care_recipient_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[VisitResponse]:
    """
    List visits, optionally filtered by care recipient.
    """
    q = db.query(Visit).filter(Visit.organization_id == organization_id)
    if care_recipient_id is not None:
        q = q.filter(Visit.care_recipient_id == care_recipient_id)
    return q.order_by(Visit.scheduled_start.asc()).all()


@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(
    visit_id: UUID,
    db: Session = Depends(get_db_session),
) -> VisitResponse:
    """Get a single visit by ID."""
    visit = db.get(Visit, visit_id)
    if not visit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit not found")
    return visit


@router.post("", response_model=VisitResponse, status_code=status.HTTP_201_CREATED)
def create_visit(
    payload: VisitCreate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> VisitResponse:
    """
    Create a scheduled visit.
    """
    visit = Visit(
        organization_id=payload.organization_id,
        care_recipient_id=payload.care_recipient_id,
        assigned_caregiver_id=payload.assigned_caregiver_id,
        visit_type=payload.visit_type,
        scheduled_start=payload.scheduled_start,
        scheduled_end=payload.scheduled_end,
        timezone=payload.timezone,
        address_street=payload.address_street,
        address_city=payload.address_city,
        address_region=payload.address_region,
        address_postal_code=payload.address_postal_code,
        address_country=payload.address_country,
        recurrence_rule=payload.recurrence_rule,
        parent_visit_id=payload.parent_visit_id,
        status=payload.status,
        notes=payload.notes,
        created_by_id=current_user_id,
    )

    if visit.scheduled_end <= visit.scheduled_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="scheduled_end must be after scheduled_start",
        )

    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


@router.patch("/{visit_id}", response_model=VisitResponse)
def update_visit(
    visit_id: UUID,
    payload: VisitUpdate,
    db: Session = Depends(get_db_session),
) -> VisitResponse:
    """
    Partially update a visit (not including explicit start/end actions).
    """
    visit = db.get(Visit, visit_id)
    if not visit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit not found")

    if payload.assigned_caregiver_id is not None:
        visit.assigned_caregiver_id = payload.assigned_caregiver_id
    if payload.visit_type is not None:
        visit.visit_type = payload.visit_type
    if payload.scheduled_start is not None:
        visit.scheduled_start = payload.scheduled_start
    if payload.scheduled_end is not None:
        if payload.scheduled_start and payload.scheduled_end <= payload.scheduled_start:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="scheduled_end must be after scheduled_start",
            )
        if not payload.scheduled_start and payload.scheduled_end <= visit.scheduled_start:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="scheduled_end must be after scheduled_start",
            )
        visit.scheduled_end = payload.scheduled_end
    if payload.timezone is not None:
        visit.timezone = payload.timezone
    if payload.address_street is not None:
        visit.address_street = payload.address_street
    if payload.address_city is not None:
        visit.address_city = payload.address_city
    if payload.address_region is not None:
        visit.address_region = payload.address_region
    if payload.address_postal_code is not None:
        visit.address_postal_code = payload.address_postal_code
    if payload.address_country is not None:
        visit.address_country = payload.address_country
    if payload.recurrence_rule is not None:
        visit.recurrence_rule = payload.recurrence_rule
    if payload.parent_visit_id is not None:
        visit.parent_visit_id = payload.parent_visit_id
    if payload.status is not None:
        visit.status = payload.status
    if payload.notes is not None:
        visit.notes = payload.notes

    if visit.scheduled_end <= visit.scheduled_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="scheduled_end must be after scheduled_start",
        )

    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


@router.post("/{visit_id}/start", response_model=VisitResponse)
def start_visit(
    visit_id: UUID,
    db: Session = Depends(get_db_session),
) -> VisitResponse:
    """
    Start a visit: set status to in_progress and record checked_in_at.
    """
    visit = db.get(Visit, visit_id)
    if not visit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit not found")

    if visit.status not in {"scheduled", "in_progress"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visit can only be started from scheduled or in_progress status.",
        )

    if visit.checked_in_at is None:
        visit.checked_in_at = datetime.now(timezone.utc)
    visit.status = "in_progress"

    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


@router.post("/{visit_id}/end", response_model=VisitResponse)
def end_visit(
    visit_id: UUID,
    db: Session = Depends(get_db_session),
) -> VisitResponse:
    """
    End a visit: set status to completed and record checked_out_at.
    """
    visit = db.get(Visit, visit_id)
    if not visit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit not found")

    if visit.status not in {"in_progress", "scheduled"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visit can only be ended from scheduled or in_progress status.",
        )

    if visit.checked_in_at is None:
        visit.checked_in_at = datetime.now(timezone.utc)
    visit.checked_out_at = datetime.now(timezone.utc)
    visit.status = "completed"

    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit

