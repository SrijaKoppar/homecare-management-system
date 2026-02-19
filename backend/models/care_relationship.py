"""
Care relationship domain entity.

Links a caregiver to a care recipient with a role (e.g. primary contact, 24/7 caregiver).
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class CareRelationship(Entity):
    """
    Relationship between a caregiver and a care recipient.

    Role can be PrimaryContact, Backup, Nurse, Aide, or Caregiver24_7.
    Attributes:
        id: Unique identifier (UUID).
        recipient_id: ID of the care recipient (Person).
        caregiver_id: ID of the caregiver (Person).
        role: RelationshipRole enum value (e.g. primary_contact, caregiver_24_7).
        start_date: When the relationship started (date).
        end_date: When the relationship ended; None if active.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    recipient_id: str
    caregiver_id: str
    role: str  # RelationshipRole
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
