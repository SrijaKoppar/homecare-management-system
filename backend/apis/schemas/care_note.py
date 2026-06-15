"""
Care note request and response schemas.
"""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CareNoteBase(BaseModel):
    """Shared fields for daily care notes."""

    care_recipient_id: UUID
    organization_id: UUID
    assignment_24x7_id: Optional[UUID] = None
    author_id: UUID
    note_date: date
    summary: Optional[str] = Field(None, max_length=2000)
    mood: Optional[str] = Field(None, max_length=100)
    next_steps: Optional[str] = Field(None, max_length=500)


class CareNoteCreate(CareNoteBase):
    """Payload for creating a daily care note."""

    pass


class CareNoteUpdate(BaseModel):
    """Payload for partial daily care note update."""

    summary: Optional[str] = Field(None, max_length=2000)
    mood: Optional[str] = Field(None, max_length=100)
    next_steps: Optional[str] = Field(None, max_length=500)


class CareNoteResponse(CareNoteBase):
    """Daily care note in API responses."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
