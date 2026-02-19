"""
Person (user) request and response schemas.
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr


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


class PersonCreate(PersonBase):
    """Payload for creating a person (e.g. invite)."""

    pass


class PersonUpdate(BaseModel):
    """Payload for partial update. All fields optional."""

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None


class PersonResponse(PersonBase):
    """Person in API responses. Excludes password_hash and sensitive fields."""

    id: str
    status: UserStatus = UserStatus.ACTIVE

    model_config = {"from_attributes": True}
