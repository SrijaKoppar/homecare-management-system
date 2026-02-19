"""
Location request and response schemas.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class LocationBase(BaseModel):
    """Shared fields for location create/update."""

    organization_id: UUID
    name: str = Field(..., max_length=200)
    address_street: Optional[str] = Field(default=None, max_length=200)
    address_city: Optional[str] = Field(default=None, max_length=100)
    address_region: Optional[str] = Field(default=None, max_length=100)
    address_postal_code: Optional[str] = Field(default=None, max_length=20)
    address_country: Optional[str] = Field(default=None, max_length=2)
    timezone: Optional[str] = Field(default=None, max_length=50)
    is_default: bool = False


class LocationCreate(LocationBase):
    """Payload for creating a location."""

    pass


class LocationUpdate(BaseModel):
    """Payload for partial location update."""

    name: Optional[str] = Field(default=None, max_length=200)
    address_street: Optional[str] = Field(default=None, max_length=200)
    address_city: Optional[str] = Field(default=None, max_length=100)
    address_region: Optional[str] = Field(default=None, max_length=100)
    address_postal_code: Optional[str] = Field(default=None, max_length=20)
    address_country: Optional[str] = Field(default=None, max_length=2)
    timezone: Optional[str] = Field(default=None, max_length=50)
    is_default: Optional[bool] = None


class LocationResponse(LocationBase):
    """Location in API responses."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

