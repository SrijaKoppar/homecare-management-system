"""
Care note domain entity.

24/7 daily note: summary, mood, next steps for a care recipient on a given day.
"""

from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class CareNote(Entity):
    """
    A daily note for 24/7 care (one per recipient per day, optional per assignment).

    Attributes:
        id: Unique identifier (UUID).
        organization_id: ID of the organization.
        care_recipient_id: ID of the care recipient (Person).
        assignment_24_7_id: ID of the 24/7 assignment; optional.
        author_id: ID of the user who wrote the note.
        note_date: Date this note applies to.
        summary: Optional summary text.
        mood: Optional mood/condition note.
        next_steps: Optional next steps or follow-up.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    organization_id: str
    care_recipient_id: str
    author_id: str
    note_date: date
    assignment_24_7_id: Optional[str] = None
    summary: Optional[str] = None
    mood: Optional[str] = None
    next_steps: Optional[str] = None
