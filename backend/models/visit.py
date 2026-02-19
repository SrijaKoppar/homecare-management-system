"""
Visit domain entity.

Represents a scheduled care visit with time window and type.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class Visit(Entity):
    """
    A scheduled care visit: recipient, caregiver, time window, and type.

    Attributes:
        id: Unique identifier (UUID).
        recipient_id: ID of the care recipient.
        caregiver_id: ID of the assigned caregiver.
        start_time: Visit start (ISO 8601 datetime).
        end_time: Visit end (ISO 8601 datetime).
        visit_type: VisitType enum (e.g. personal_care, nursing, companionship, respite).
        status: scheduled, in_progress, completed, cancelled, no_show.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    recipient_id: str
    caregiver_id: str
    start_time: datetime
    end_time: datetime
    visit_type: str  # VisitType
    status: str = "scheduled"  # scheduled | in_progress | completed | cancelled | no_show
