"""
Visit note endpoints.

One visit note per visit, authored by a caregiver.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import get_db_session, get_current_user_id
from backend.apis.schemas.visit_note import (
    VisitNoteCreate,
    VisitNoteUpdate,
    VisitNoteResponse,
)
from backend.database.entities.visit_note import VisitNote


router = APIRouter(prefix="/visit-notes", tags=["Visit notes"])


@router.get("", response_model=List[VisitNoteResponse])
def list_visit_notes(
    db: Session = Depends(get_db_session),
) -> List[VisitNoteResponse]:
    """
    List all visit notes.
    """
    notes = db.query(VisitNote).order_by(VisitNote.created_at.desc()).all()
    return notes


@router.get("/{note_id}", response_model=VisitNoteResponse)
def get_visit_note(
    note_id: UUID,
    db: Session = Depends(get_db_session),
) -> VisitNoteResponse:
    """Get a single visit note by ID."""
    note = db.get(VisitNote, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit note not found")
    return note


@router.post("", response_model=VisitNoteResponse, status_code=status.HTTP_201_CREATED)
def create_visit_note(
    payload: VisitNoteCreate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> VisitNoteResponse:
    """
    Create or replace a visit note for a visit.

    Enforces one note per visit by checking for an existing note first.
    """
    existing = db.query(VisitNote).filter(VisitNote.visit_id == payload.visit_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A visit note already exists for this visit.",
        )

    author_id = payload.author_id or current_user_id

    note = VisitNote(
        visit_id=payload.visit_id,
        author_id=author_id,
        summary=payload.summary,
        mood=payload.mood,
        incidents=payload.incidents,
        next_steps=payload.next_steps,
    )

    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.patch("/{note_id}", response_model=VisitNoteResponse)
def update_visit_note(
    note_id: UUID,
    payload: VisitNoteUpdate,
    db: Session = Depends(get_db_session),
) -> VisitNoteResponse:
    """Update an existing visit note."""
    note = db.get(VisitNote, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit note not found")

    if payload.summary is not None:
        note.summary = payload.summary
    if payload.mood is not None:
        note.mood = payload.mood
    if payload.incidents is not None:
        note.incidents = payload.incidents
    if payload.next_steps is not None:
        note.next_steps = payload.next_steps

    db.add(note)
    db.commit()
    db.refresh(note)
    return note

