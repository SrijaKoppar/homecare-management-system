"""
Person (user) request and response schemas.
"""

from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr

from backend.apis.schemas.membership import MembershipRole, MembershipStatus


class UserStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    INVITED = "invited"
    ARCHIVED = "archived"


class PersonBase(BaseModel):
    """Shared fields for person create/update."""

    email: EmailStr
    first_name: str
    last_name: str
    display_name: Optional[str] = None
    phone: Optional[str] = None


class PersonCreate(PersonBase):
    """Payload for creating a person (e.g. invite)."""

    organization_id: Optional[UUID] = None
    role: Optional[MembershipRole] = None
    title: Optional[str] = None
    location_id: Optional[UUID] = None
    password: Optional[str] = None


class PersonUpdate(BaseModel):
    """Payload for partial update. All fields optional."""

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[MembershipRole] = None
    title: Optional[str] = None
    location_id: Optional[UUID] = None
    membership_status: Optional[MembershipStatus] = None


class PersonResponse(PersonBase):
    """Person in API responses. Excludes password_hash and sensitive fields."""

    id: str | UUID
    status: UserStatus = UserStatus.ACTIVE
    membership_id: Optional[UUID] = None
    role: Optional[str] = None
    membership_status: Optional[str] = None
    title: Optional[str] = None
    location_id: Optional[UUID] = None

    model_config = {"from_attributes": True}
