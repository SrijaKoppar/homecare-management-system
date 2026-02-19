"""
Medication domain entity.

Medication prescribed for a care recipient.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

from backend.models.base import Entity


@dataclass
class Medication(Entity):
    """
    A medication for a care recipient.

    Attributes:
        id: Unique identifier (UUID).
        recipient_id: ID of the care recipient.
        name: Medication name.
        dose: Dose description (e.g. "10mg").
        route: Route of administration (e.g. oral, topical).
        frequency: How often (e.g. "twice daily").
        prescriber: Prescriber name or ID.
        reminder_times: Optional list of reminder times (e.g. ["08:00", "20:00"]).
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    recipient_id: str
    name: str
    dose: str
    route: str
    frequency: str
    prescriber: str
    reminder_times: Optional[List[str]] = None


@dataclass
class MedicationLog(Entity):
    """
    Log entry for medication administration (given, not given, skipped).

    Attributes:
        id: Unique identifier (UUID).
        medication_id: ID of the medication.
        given_at: When the log was recorded (ISO 8601).
        given_by: ID of the user who recorded (caregiver).
        status: given, not_given, skipped.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    medication_id: str
    given_at: datetime
    given_by: str
    status: str  # MedicationLogStatus
