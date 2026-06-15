"""
Leave request schemas.
"""

from datetime import date
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class LeaveRequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"


class LeaveRequestBase(BaseModel):
    """Shared fields for leave requests."""

    organization_id: UUID
    caregiver_id: UUID
    start_date: date
    end_date: date
    reason: Optional[str] = None


class LeaveRequestCreate(LeaveRequestBase):
    """Payload for creating a leave request."""

    pass


class LeaveRequestUpdate(BaseModel):
    """Payload for updating a leave request."""

    status: LeaveRequestStatus


class LeaveRequestResponse(LeaveRequestBase):
    """Leave request in API responses."""

    id: UUID
    status: LeaveRequestStatus
    caregiver_name: Optional[str] = None

    model_config = {"from_attributes": True}
