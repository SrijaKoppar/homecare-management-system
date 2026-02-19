"""
Visit note request and response schemas.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class VisitNoteBase(BaseModel):
    """Shared fields for visit note create/update."""

    visit_id: UUID
    summary: Optional[str] = None
    mood: Optional[str] = None
    incidents: Optional[str] = None
    next_steps: Optional[str] = None


class VisitNoteCreate(VisitNoteBase):
    """Payload for creating a visit note."""

    author_id: UUID


class VisitNoteUpdate(BaseModel):
    """Payload for partial visit note update."""

    summary: Optional[str] = None
    mood: Optional[str] = None
    incidents: Optional[str] = None
    next_steps: Optional[str] = None


class VisitNoteResponse(VisitNoteBase):
    """Visit note in API responses."""

    id: UUID
    author_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

