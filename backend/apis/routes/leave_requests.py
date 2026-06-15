"""
Leave request endpoints.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_db_session,
)
from backend.apis.schemas.leave_request import (
    LeaveRequestCreate,
    LeaveRequestUpdate,
    LeaveRequestResponse,
    LeaveRequestStatus,
)
from backend.database.entities.leave_request import LeaveRequest
from backend.database.entities.user import User

router = APIRouter(prefix="/leave-requests", tags=["Leave Requests"])


@router.get("", response_model=List[LeaveRequestResponse])
def list_leave_requests(
    status_filter: Optional[LeaveRequestStatus] = Query(default=None, alias="status"),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[LeaveRequestResponse]:
    """
    List all leave requests for the organization, optionally filtered by status.
    """
    # Join User to fetch caregiver names
    query = db.query(LeaveRequest, User).join(User, LeaveRequest.caregiver_id == User.id)
    query = query.filter(LeaveRequest.organization_id == UUID(organization_id))

    if status_filter is not None:
        query = query.filter(LeaveRequest.status == status_filter.value)

    results = query.order_by(LeaveRequest.created_at.desc()).all()

    responses = []
    for lr, user in results:
        caregiver_name = user.display_name or f"{user.first_name} {user.last_name}"
        responses.append(
            LeaveRequestResponse(
                id=lr.id,
                organization_id=lr.organization_id,
                caregiver_id=lr.caregiver_id,
                caregiver_name=caregiver_name,
                start_date=lr.start_date,
                end_date=lr.end_date,
                reason=lr.reason,
                status=LeaveRequestStatus(lr.status),
            )
        )
    return responses


@router.post("", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
def create_leave_request(
    payload: LeaveRequestCreate,
    db: Session = Depends(get_db_session),
) -> LeaveRequestResponse:
    """
    Create a new leave request.
    """
    # Verify caregiver exists
    caregiver = db.get(User, payload.caregiver_id)
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    lr = LeaveRequest(
        organization_id=payload.organization_id,
        caregiver_id=payload.caregiver_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        reason=payload.reason,
        status="pending",
    )
    db.add(lr)
    db.commit()
    db.refresh(lr)

    caregiver_name = caregiver.display_name or f"{caregiver.first_name} {caregiver.last_name}"
    return LeaveRequestResponse(
        id=lr.id,
        organization_id=lr.organization_id,
        caregiver_id=lr.caregiver_id,
        caregiver_name=caregiver_name,
        start_date=lr.start_date,
        end_date=lr.end_date,
        reason=lr.reason,
        status=LeaveRequestStatus(lr.status),
    )


@router.patch("/{leave_request_id}", response_model=LeaveRequestResponse)
def update_leave_request(
    leave_request_id: UUID,
    payload: LeaveRequestUpdate,
    db: Session = Depends(get_db_session),
) -> LeaveRequestResponse:
    """
    Approve or deny a leave request.
    """
    lr = db.get(LeaveRequest, leave_request_id)
    if not lr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found",
        )

    lr.status = payload.status.value
    db.add(lr)
    db.commit()
    db.refresh(lr)

    # Fetch caregiver name
    caregiver = db.get(User, lr.caregiver_id)
    caregiver_name = (
        caregiver.display_name or f"{caregiver.first_name} {caregiver.last_name}"
        if caregiver
        else "Unknown Caregiver"
    )

    return LeaveRequestResponse(
        id=lr.id,
        organization_id=lr.organization_id,
        caregiver_id=lr.caregiver_id,
        caregiver_name=caregiver_name,
        start_date=lr.start_date,
        end_date=lr.end_date,
        reason=lr.reason,
        status=LeaveRequestStatus(lr.status),
    )
