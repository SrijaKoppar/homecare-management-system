"""
Membership domain entity.

Links a user to an organization with a role and optional location (agency).
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class Membership(Entity):
    """
    User–organization link with role and optional location.

    One membership per (user, organization). Role determines permissions
    (e.g. family_viewer, family_editor, caregiver, supervisor, agency_admin).
    Attributes:
        id: Unique identifier (UUID).
        user_id: ID of the user (Person).
        organization_id: ID of the organization.
        role: family_viewer, family_editor, caregiver, supervisor, agency_admin, system_admin.
        title: Optional display title (e.g. "RN", "Primary contact").
        location_id: Optional default location (agency staff).
        status: active, inactive, invited.
        joined_at: When the user joined (or invitation timestamp).
        invited_at: When invited; None if not invited.
        invited_by_id: ID of user who sent invite; None if not invited.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    user_id: str
    organization_id: str
    role: str  # MembershipRole
    title: Optional[str] = None
    location_id: Optional[str] = None
    status: str = "active"  # active | inactive | invited
    joined_at: Optional[datetime] = None
    invited_at: Optional[datetime] = None
    invited_by_id: Optional[str] = None
