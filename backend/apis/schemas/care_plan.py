"""
Care plan request and response schemas.
"""

from datetime import date, datetime
from typing import Optional, List, Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class CarePlanBase(BaseModel):
    """Shared fields for care plan create/update."""

    care_recipient_id: UUID
    organization_id: UUID
    name: str = Field(..., max_length=200)
    goals: Optional[str] = None
    focus_areas: Optional[List[str]] = None
    template_id: Optional[UUID] = None
    effective_from: date
    effective_to: Optional[date] = None
    status: str = Field("active", max_length=20)

    @field_validator("effective_to")
    @classmethod
    def validate_effective_range(cls, v: Optional[date], values: Any) -> Optional[date]:
        # Values might be a dict or validation context depending on pydantic version.
        # Support dict style field lookup:
        start = None
        if hasattr(values, "data"):
            start = values.data.get("effective_from")
        elif isinstance(values, dict):
            start = values.get("effective_from")
        
        if v is not None and start is not None and v < start:
            raise ValueError("effective_to cannot be before effective_from")
        return v


class CarePlanCreate(CarePlanBase):
    """Payload for creating a care plan."""

    pass


class CarePlanUpdate(BaseModel):
    """Payload for partial care plan update."""

    name: Optional[str] = Field(None, max_length=200)
    goals: Optional[str] = None
    focus_areas: Optional[List[str]] = None
    template_id: Optional[UUID] = None
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None
    status: Optional[str] = Field(None, max_length=20)

    @field_validator("effective_to")
    @classmethod
    def validate_effective_range(cls, v: Optional[date], values: Any) -> Optional[date]:
        start = None
        if hasattr(values, "data"):
            start = values.data.get("effective_from")
        elif isinstance(values, dict):
            start = values.get("effective_from")
            
        if v is not None and start is not None and v < start:
            raise ValueError("effective_to cannot be before effective_from")
        return v


class CarePlanResponse(CarePlanBase):
    """Care plan in API responses."""

    id: UUID
    created_by_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
