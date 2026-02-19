"""
Care relationship request and response schemas.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class CareRelationshipRole(str, Enum):
    PRIMARY_CONTACT = "primary_contact"
    BACKUP_CONTACT = "backup_contact"
    FAMILY_VIEWER = "family_viewer"
    NURSE = "nurse"
    AIDE = "aide"
    COMPANION = "companion"
    OTHER = "other"


class CareRelationshipStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ENDED = "ended"


class CareRelationshipBase(BaseModel):
    """Shared fields for care relationship create/update."""

    care_recipient_id: UUID
    related_user_id: UUID
    organization_id: UUID
    role: CareRelationshipRole = Field(
        ...,
        description="Relationship role "
        "(primary_contact, backup_contact, family_viewer, nurse, aide, companion, other)",
    )
    is_24x7_caregiver: bool = False
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None

    @field_validator("end_date")
    @classmethod
    def validate_date_range(cls, v: Optional[date], values: dict) -> Optional[date]:
        start = values.get("start_date")
        if v is not None and start is not None and v < start:
            raise ValueError("end_date cannot be before start_date")
        return v


class CareRelationshipCreate(CareRelationshipBase):
    """Payload for creating a care relationship."""

    status: CareRelationshipStatus = CareRelationshipStatus.ACTIVE


class CareRelationshipUpdate(BaseModel):
    """Payload for partial care relationship update."""

    role: Optional[CareRelationshipRole] = None
    is_24x7_caregiver: Optional[bool] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None
    status: Optional[CareRelationshipStatus] = None

    @field_validator("end_date")
    @classmethod
    def validate_date_range(cls, v: Optional[date], values: dict) -> Optional[date]:
        start = values.get("start_date")
        if v is not None and start is not None and v < start:
            raise ValueError("end_date cannot be before start_date")
        return v


class CareRelationshipResponse(CareRelationshipBase):
    """Care relationship in API responses."""

    id: UUID
    status: CareRelationshipStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

