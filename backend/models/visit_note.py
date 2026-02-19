"""
Visit note domain entity.

Notes attached to a visit or 24/7 assignment (summary, incident, vital signs).
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class VisitNote(Entity):
    """
    A note attached to a visit or 24/7 assignment.

    Type: summary, incident, vital_signs.
    Attributes:
        id: Unique identifier (UUID).
        visit_id: ID of the visit; None if attached to assignment.
        assignment_24_7_id: ID of the 24/7 assignment; None if attached to visit.
        author_id: ID of the user who wrote the note.
        content: Note content (plain text).
        note_type: summary | incident | vital_signs.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    author_id: str
    content: str
    note_type: str  # NoteType
    visit_id: Optional[str] = None
    assignment_24_7_id: Optional[str] = None
