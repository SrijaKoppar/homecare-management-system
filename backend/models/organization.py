"""
Organization domain entity.

Represents a household (family) or a care agency.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class Organization(Entity):
    """
    An organization: household (family) or care agency.

    Attributes:
        id: Unique identifier (UUID).
        name: Display name of the organization.
        type: One of: household, agency.
        description: Optional description.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    name: str
    type: str  # "household" | "agency"
    description: Optional[str] = None
