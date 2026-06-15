"""
Care note endpoints.

CRUD operations for daily care notes.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_current_user_id,
    get_db_session,
)
from backend.apis.schemas.care_note import (
    CareNoteCreate,
    CareNoteUpdate,
    CareNoteResponse,
)
from backend.database.entities.care_note import CareNote

router = APIRouter(prefix="/care-notes", tags=["Care Notes"])


@router.get("", response_model=List[CareNoteResponse])
def list_care_notes(
    care_recipient_id: Optional[UUID] = Query(default=None),
    assignment_24x7_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[CareNoteResponse]:
    """
    List daily care notes, optionally filtered by recipient or 24/7 assignment.
    """
    q = db.query(CareNote).filter(CareNote.organization_id == organization_id)
    if care_recipient_id is not None:
        q = q.filter(CareNote.care_recipient_id == care_recipient_id)
    if assignment_24x7_id is not None:
        q = q.filter(CareNote.assignment_24x7_id == assignment_24x7_id)
    return q.order_by(CareNote.note_date.desc()).all()


@router.get("/{care_note_id}", response_model=CareNoteResponse)
def get_care_note(
    care_note_id: UUID,
    db: Session = Depends(get_db_session),
) -> CareNoteResponse:
    """
    Get a single care note by ID.
    """
    note = db.get(CareNote, care_note_id)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Care note not found"
        )
    return note


@router.post("", response_model=CareNoteResponse, status_code=status.HTTP_201_CREATED)
def create_care_note(
    payload: CareNoteCreate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> CareNoteResponse:
    """
    Create a new care note.
    """
    note = CareNote(
        organization_id=payload.organization_id,
        care_recipient_id=payload.care_recipient_id,
        assignment_24x7_id=payload.assignment_24x7_id,
        author_id=current_user_id,  # Overwrite author with currently logged in user
        note_date=payload.note_date,
        summary=payload.summary,
        mood=payload.mood,
        next_steps=payload.next_steps,
    )

    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.patch("/{care_note_id}", response_model=CareNoteResponse)
def update_care_note(
    care_note_id: UUID,
    payload: CareNoteUpdate,
    db: Session = Depends(get_db_session),
) -> CareNoteResponse:
    """
    Partially update a care note.
    """
    note = db.get(CareNote, care_note_id)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Care note not found"
        )

    if payload.summary is not None:
        note.summary = payload.summary
    if payload.mood is not None:
        note.mood = payload.mood
    if payload.next_steps is not None:
        note.next_steps = payload.next_steps

    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{care_note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_care_note(
    care_note_id: UUID,
    db: Session = Depends(get_db_session),
) -> None:
    """
    Delete a care note.
    """
    note = db.get(CareNote, care_note_id)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Care note not found"
        )
    db.delete(note)
    db.commit()
