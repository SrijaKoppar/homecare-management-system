"""
Care arrangement request and response schemas.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class CareArrangementMode(str, Enum):
    VISITS_ONLY = "visits_only"
    CAREGIVER_24X7_ONLY = "caregiver_24x7_only"
    CAREGIVER_24X7_PLUS_VISITS = "caregiver_24x7_plus_visits"


class CareArrangementBase(BaseModel):
    """Shared fields for care arrangement create/update."""

    care_recipient_id: UUID
    organization_id: UUID
    mode: CareArrangementMode = Field(
        ...,
        description="visits_only | caregiver_24x7_only | caregiver_24x7_plus_visits",
    )
    effective_from: date
    effective_to: Optional[date] = None
    notes: Optional[str] = None

    @field_validator("effective_to")
    @classmethod
    def validate_effective_range(cls, v: Optional[date], values: dict) -> Optional[date]:
        start = values.get("effective_from")
        if v is not None and start is not None and v < start:
            raise ValueError("effective_to cannot be before effective_from")
        return v


class CareArrangementCreate(CareArrangementBase):
    """Payload for creating a care arrangement."""

    pass


class CareArrangementUpdate(BaseModel):
    """Payload for partial care arrangement update."""

    mode: Optional[CareArrangementMode] = None
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None
    notes: Optional[str] = None

    @field_validator("effective_to")
    @classmethod
    def validate_effective_range(cls, v: Optional[date], values: dict) -> Optional[date]:
        start = values.get("effective_from")
        if v is not None and start is not None and v < start:
            raise ValueError("effective_to cannot be before effective_from")
        return v


class CareArrangementResponse(CareArrangementBase):
    """Care arrangement in API responses."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

