"""
Person domain entity.

Represents a user or contact: care recipient, family member, or caregiver.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class Person(Entity):
    """
    A person in the system: care recipient, family member, or caregiver.

    Role is indicated by association (e.g. care_relationship) or a role flag.
    Attributes:
        id: Unique identifier (UUID).
        email: Primary email; unique per user.
        first_name: Given name.
        last_name: Family name.
        display_name: Optional display name.
        phone: Primary phone.
        phone_secondary: Optional secondary phone.
        avatar_url: Optional profile image URL.
        timezone: IANA timezone (e.g. America/New_York).
        locale: Locale code (e.g. en-US).
        status: active, suspended, invited, archived.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    email: str
    first_name: str
    last_name: str
    display_name: Optional[str] = None
    phone: Optional[str] = None
    phone_secondary: Optional[str] = None
    avatar_url: Optional[str] = None
    timezone: str = "UTC"
    locale: str = "en-US"
    status: str = "active"
