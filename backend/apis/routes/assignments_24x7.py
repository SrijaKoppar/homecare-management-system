"""
Assignment 24x7 endpoints.

CRUD operations and validation for 24/7 caregiver assignments.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_current_user_id,
    get_db_session,
)
from backend.apis.schemas.assignment_24_7 import (
    Assignment24x7Create,
    Assignment24x7Update,
    Assignment24x7Response,
)
from backend.database.entities.assignment_24_7 import Assignment24_7

router = APIRouter(prefix="/assignments-24x7", tags=["Assignments 24/7"])


def _check_primary_overlap(
    db: Session,
    organization_id: str,
    care_recipient_id: UUID,
    start_date,
    end_date,
    exclude_id: Optional[UUID] = None,
) -> None:
    """
    Ensure no overlapping primary 24/7 assignments for the same care recipient.
    """
    q = db.query(Assignment24_7).filter(
        Assignment24_7.organization_id == organization_id,
        Assignment24_7.care_recipient_id == care_recipient_id,
        Assignment24_7.status == "active",
        Assignment24_7.type == "primary",
    )
    if exclude_id:
        q = q.filter(Assignment24_7.id != exclude_id)

    existing = q.all()
    for assg in existing:
        # Overlap check
        # (StartA <= EndB) and (EndA >= StartB)
        # If end_date is None, treat it as open-ended (e.g. far future date)
        s_a = assg.start_date
        e_a = assg.end_date or start_date  # If open ended, assume overlap if started
        
        # If either is open-ended and we are trying to add another, we check if start dates conflict
        # Simple check: if start_date is within the range of any existing active primary
        overlap = False
        if assg.end_date is None:
            # Existing is open-ended. Overlaps with any new assignment that starts after or before it.
            if end_date is None or end_date >= s_a:
                overlap = True
        else:
            # Existing has end date
            if end_date is None:
                if start_date <= assg.end_date:
                    overlap = True
            else:
                if start_date <= assg.end_date and end_date >= s_a:
                    overlap = True
                    
        if overlap:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"An active primary 24/7 assignment already exists for this recipient in this date range (existing: {s_a} to {assg.end_date or 'ongoing'}).",
            )


@router.get("", response_model=List[Assignment24x7Response])
def list_assignments_24x7(
    care_recipient_id: Optional[UUID] = Query(default=None),
    caregiver_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[Assignment24x7Response]:
    """
    List all 24/7 assignments for the organization.
    """
    q = db.query(Assignment24_7).filter(Assignment24_7.organization_id == organization_id)
    if care_recipient_id is not None:
        q = q.filter(Assignment24_7.care_recipient_id == care_recipient_id)
    if caregiver_id is not None:
        q = q.filter(Assignment24_7.caregiver_id == caregiver_id)
    return q.order_by(Assignment24_7.start_date.desc()).all()


@router.get("/{assignment_id}", response_model=Assignment24x7Response)
def get_assignment_24x7(
    assignment_id: UUID,
    db: Session = Depends(get_db_session),
) -> Assignment24x7Response:
    """
    Get a single 24/7 assignment by ID.
    """
    assg = db.get(Assignment24_7, assignment_id)
    if not assg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )
    return assg


@router.post("", response_model=Assignment24x7Response, status_code=status.HTTP_201_CREATED)
def create_assignment_24x7(
    payload: Assignment24x7Create,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
    organization_id: str = Depends(get_current_organization_id),
) -> Assignment24x7Response:
    """
    Create a 24/7 caregiver assignment.
    """
    if payload.type == "primary" and payload.status == "active":
        _check_primary_overlap(
            db,
            organization_id,
            payload.care_recipient_id,
            payload.start_date,
            payload.end_date,
        )

    assg = Assignment24_7(
        organization_id=payload.organization_id,
        care_recipient_id=payload.care_recipient_id,
        caregiver_id=payload.caregiver_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        type=payload.type,
        notes=payload.notes,
        status=payload.status,
        created_by_id=current_user_id,
    )

    db.add(assg)
    db.commit()
    db.refresh(assg)
    return assg


@router.patch("/{assignment_id}", response_model=Assignment24x7Response)
def update_assignment_24x7(
    assignment_id: UUID,
    payload: Assignment24x7Update,
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> Assignment24x7Response:
    """
    Update a 24/7 caregiver assignment.
    """
    assg = db.get(Assignment24_7, assignment_id)
    if not assg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )

    if payload.caregiver_id is not None:
        assg.caregiver_id = payload.caregiver_id
    if payload.start_date is not None:
        assg.start_date = payload.start_date
    if payload.end_date is not None:
        assg.end_date = payload.end_date
    if payload.start_time is not None:
        assg.start_time = payload.start_time
    if payload.end_time is not None:
        assg.end_time = payload.end_time
    if payload.type is not None:
        assg.type = payload.type
    if payload.notes is not None:
        assg.notes = payload.notes
    if payload.status is not None:
        assg.status = payload.status

    # Validate range
    if assg.end_date and assg.end_date < assg.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_date cannot be before start_date",
        )

    # Re-validate primary overlaps
    if assg.type == "primary" and assg.status == "active":
        _check_primary_overlap(
            db,
            organization_id,
            assg.care_recipient_id,
            assg.start_date,
            assg.end_date,
            exclude_id=assg.id,
        )

    db.add(assg)
    db.commit()
    db.refresh(assg)
    return assg


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment_24x7(
    assignment_id: UUID,
    db: Session = Depends(get_db_session),
) -> None:
    """
    Soft-delete / end an assignment.
    """
    assg = db.get(Assignment24_7, assignment_id)
    if not assg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )
    assg.status = "cancelled"
    db.add(assg)
    db.commit()
