"""
Care arrangement domain entity.

Defines how care is delivered for a recipient: visits only, 24/7 caregiver only, or both.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class CareArrangement(Entity):
    """
    Per-recipient care arrangement type and optional 24/7 caregiver.

    Type: scheduled_visits_only | caregiver_24_7_only | caregiver_24_7_plus_visits.
    Attributes:
        id: Unique identifier (UUID).
        recipient_id: ID of the care recipient.
        care_arrangement_type: CareArrangementType enum value.
        caregiver_24_7_id: ID of the 24/7 caregiver; required if type includes 24/7.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    recipient_id: str
    care_arrangement_type: str  # CareArrangementType
    caregiver_24_7_id: Optional[str] = None
