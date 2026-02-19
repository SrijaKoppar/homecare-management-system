"""
Location domain entity.

A physical location belonging to an organization (agency-only in MVP).
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class Location(Entity):
    """
    A location belonging to an organization (e.g. agency branch).

    Attributes:
        id: Unique identifier (UUID).
        organization_id: ID of the owning organization.
        name: Display name (e.g. "North Branch").
        address_street: Street address; optional.
        address_city: City; optional.
        address_region: Region/state; optional.
        address_postal_code: Postal code; optional.
        address_country: Country code (e.g. US); optional.
        timezone: IANA timezone for this location; optional.
        is_default: Whether this is the org's default location.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    organization_id: str
    name: str
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_region: Optional[str] = None
    address_postal_code: Optional[str] = None
    address_country: Optional[str] = None
    timezone: Optional[str] = None
    is_default: bool = False
