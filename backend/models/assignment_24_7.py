"""
24/7 assignment domain entity.

Represents a caregiver assigned to a recipient around the clock (live-in or dedicated).
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class Assignment24_7(Entity):
    """
    A 24/7 (live-in or full-time) assignment of one caregiver to one recipient.

    Attributes:
        id: Unique identifier (UUID).
        recipient_id: ID of the care recipient.
        caregiver_id: ID of the assigned caregiver.
        start_date: Assignment start date (date or datetime).
        end_date: Assignment end date; None if ongoing.
        relief_notes: Optional notes about relief/rotation.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    recipient_id: str
    caregiver_id: str
    start_date: datetime
    end_date: Optional[datetime] = None
    relief_notes: Optional[str] = None
