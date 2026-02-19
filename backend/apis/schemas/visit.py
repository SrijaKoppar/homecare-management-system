"""
Visit request and response schemas.
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class VisitType(str, Enum):
    PERSONAL_CARE = "personal_care"
    NURSING = "nursing"
    COMPANIONSHIP = "companionship"
    RESPITE = "respite"
    OTHER = "other"


class VisitStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class VisitBase(BaseModel):
    """Shared fields for visit create/update."""

    organization_id: UUID
    care_recipient_id: UUID
    assigned_caregiver_id: Optional[UUID] = None
    visit_type: VisitType = Field(
        ...,
        description="personal_care | nursing | companionship | respite | other",
    )
    scheduled_start: datetime
    scheduled_end: datetime
    timezone: Optional[str] = None
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_region: Optional[str] = None
    address_postal_code: Optional[str] = None
    address_country: Optional[str] = None
    recurrence_rule: Optional[str] = None
    parent_visit_id: Optional[UUID] = None
    notes: Optional[str] = None

    @field_validator("scheduled_end")
    @classmethod
    def validate_time_window(cls, v: datetime, values: dict) -> datetime:
        start = values.get("scheduled_start")
        if start is not None and v <= start:
            raise ValueError("scheduled_end must be after scheduled_start")
        return v


class VisitCreate(VisitBase):
    """Payload for creating a visit."""

    status: VisitStatus = VisitStatus.SCHEDULED


class VisitUpdate(BaseModel):
    """Payload for partial visit update (not used for start/end)."""

    assigned_caregiver_id: Optional[UUID] = None
    visit_type: Optional[VisitType] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    timezone: Optional[str] = None
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_region: Optional[str] = None
    address_postal_code: Optional[str] = None
    address_country: Optional[str] = None
    recurrence_rule: Optional[str] = None
    parent_visit_id: Optional[UUID] = None
    status: Optional[VisitStatus] = None
    notes: Optional[str] = None


class VisitResponse(VisitBase):
    """Visit in API responses."""

    id: UUID
    status: VisitStatus
    checked_in_at: Optional[datetime] = None
    checked_out_at: Optional[datetime] = None
    created_by_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

