"""
Membership (user-organization-role) request and response schemas.
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MembershipRole(str, Enum):
    FAMILY_VIEWER = "family_viewer"
    FAMILY_EDITOR = "family_editor"
    CAREGIVER = "caregiver"
    SUPERVISOR = "supervisor"
    AGENCY_ADMIN = "agency_admin"
    SYSTEM_ADMIN = "system_admin"


class MembershipStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    INVITED = "invited"


class MembershipBase(BaseModel):
    """Shared fields for membership create/update."""

    user_id: UUID
    organization_id: UUID
    role: MembershipRole = Field(
        ...,
        description="Role within the organization "
        "(family_viewer, family_editor, caregiver, supervisor, agency_admin, system_admin)",
    )
    title: Optional[str] = None
    location_id: Optional[UUID] = None


class MembershipCreate(MembershipBase):
    """Payload for creating a membership."""

    status: MembershipStatus = MembershipStatus.INVITED


class MembershipUpdate(BaseModel):
    """Payload for partial membership update."""

    role: Optional[MembershipRole] = None
    title: Optional[str] = None
    location_id: Optional[UUID] = None
    status: Optional[MembershipStatus] = None


class MembershipResponse(MembershipBase):
    """Membership in API responses."""

    id: UUID
    status: MembershipStatus
    joined_at: datetime
    invited_at: Optional[datetime] = None
    invited_by_id: Optional[UUID] = None

    model_config = {"from_attributes": True}

