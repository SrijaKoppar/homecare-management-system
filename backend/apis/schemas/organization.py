"""
Organization request and response schemas.
"""

from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=200)
    primary_phone: Optional[str] = Field(default=None, max_length=50)
    primary_email: Optional[str] = Field(default=None, max_length=255)
    address_street: Optional[str] = Field(default=None, max_length=200)
    address_city: Optional[str] = Field(default=None, max_length=100)
    address_region: Optional[str] = Field(default=None, max_length=100)
    address_postal_code: Optional[str] = Field(default=None, max_length=20)
    address_country: Optional[str] = Field(default=None, max_length=2)
    timezone: Optional[str] = Field(default=None, max_length=50)


class OrganizationResponse(BaseModel):
    """Organization in API responses."""

    id: str | UUID
    name: str
    type: str  # household | agency
    slug: Optional[str] = None
    primary_phone: Optional[str] = None
    primary_email: Optional[str] = None
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_region: Optional[str] = None
    address_postal_code: Optional[str] = None
    address_country: Optional[str] = None
    timezone: str = "UTC"
    status: str = "active"

    model_config = {"from_attributes": True}
