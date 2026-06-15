"""
Assignment 24x7 request and response schemas.
"""

from datetime import date, time, datetime
from typing import Optional, Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class Assignment24x7Base(BaseModel):
    """Shared fields for 24/7 caregiver assignment."""

    care_recipient_id: UUID
    organization_id: UUID
    caregiver_id: UUID
    start_date: date
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    type: str = Field("primary", max_length=20)
    notes: Optional[str] = Field(None, max_length=500)
    status: str = Field("active", max_length=20)

    @field_validator("end_date")
    @classmethod
    def validate_date_range(cls, v: Optional[date], values: Any) -> Optional[date]:
        start = None
        if hasattr(values, "data"):
            start = values.data.get("start_date")
        elif isinstance(values, dict):
            start = values.get("start_date")
            
        if v is not None and start is not None and v < start:
            raise ValueError("end_date cannot be before start_date")
        return v


class Assignment24x7Create(Assignment24x7Base):
    """Payload for creating a 24/7 caregiver assignment."""

    pass


class Assignment24x7Update(BaseModel):
    """Payload for partial 24/7 caregiver assignment update."""

    caregiver_id: Optional[UUID] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    type: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field(None, max_length=20)

    @field_validator("end_date")
    @classmethod
    def validate_date_range(cls, v: Optional[date], values: Any) -> Optional[date]:
        start = None
        if hasattr(values, "data"):
            start = values.data.get("start_date")
        elif isinstance(values, dict):
            start = values.get("start_date")
            
        if v is not None and start is not None and v < start:
            raise ValueError("end_date cannot be before start_date")
        return v


class Assignment24x7Response(Assignment24x7Base):
    """24/7 caregiver assignment in API responses."""

    id: UUID
    created_by_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
