"""
Care relationship endpoints.

Link care recipients to related people (family, caregivers) within an organization.
Enforces one 24/7 caregiver per recipient per organization.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_db_session,
)
from backend.apis.schemas.care_relationship import (
    CareRelationshipCreate,
    CareRelationshipUpdate,
    CareRelationshipResponse,
)
from backend.database.entities.care_relationship import CareRelationship


router = APIRouter(prefix="/care-relationships", tags=["Care relationships"])


@router.get("", response_model=List[CareRelationshipResponse])
def list_care_relationships(
    care_recipient_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[CareRelationshipResponse]:
    """
    List care relationships, optionally filtered by care recipient and/or organization.
    """
    q = db.query(CareRelationship).filter(CareRelationship.organization_id == organization_id)
    if care_recipient_id is not None:
        q = q.filter(CareRelationship.care_recipient_id == care_recipient_id)
    return q.order_by(CareRelationship.created_at.desc()).all()


@router.get("/{relationship_id}", response_model=CareRelationshipResponse)
def get_care_relationship(
    relationship_id: UUID,
    db: Session = Depends(get_db_session),
) -> CareRelationshipResponse:
    """Get a single care relationship by ID."""
    rel = db.get(CareRelationship, relationship_id)
    if not rel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Care relationship not found")
    return rel


@router.post("", response_model=CareRelationshipResponse, status_code=status.HTTP_201_CREATED)
def create_care_relationship(
    payload: CareRelationshipCreate,
    db: Session = Depends(get_db_session),
) -> CareRelationshipResponse:
    """
    Create a care relationship.

    If `is_24x7_caregiver` is true, enforce that there is at most one active 24/7
    caregiver per (care_recipient_id, organization_id). Any existing active 24/7
    relationship is set to `is_24x7_caregiver = False`.
    """
    if payload.is_24x7_caregiver:
        # Clear existing 24/7 caregiver for this recipient/org
        existing_24x7 = (
            db.query(CareRelationship)
            .filter(
                CareRelationship.care_recipient_id == payload.care_recipient_id,
                CareRelationship.organization_id == payload.organization_id,
                CareRelationship.is_24x7_caregiver.is_(True),
                CareRelationship.status == "active",
            )
            .all()
        )
        for rel in existing_24x7:
            rel.is_24x7_caregiver = False

    rel = CareRelationship(
        care_recipient_id=payload.care_recipient_id,
        related_user_id=payload.related_user_id,
        organization_id=payload.organization_id,
        role=payload.role,
        is_24x7_caregiver=payload.is_24x7_caregiver,
        start_date=payload.start_date,
        end_date=payload.end_date,
        notes=payload.notes,
        status=payload.status,
    )

    db.add(rel)
    db.commit()
    db.refresh(rel)
    return rel


@router.patch("/{relationship_id}", response_model=CareRelationshipResponse)
def update_care_relationship(
    relationship_id: UUID,
    payload: CareRelationshipUpdate,
    db: Session = Depends(get_db_session),
) -> CareRelationshipResponse:
    """
    Partially update a care relationship.

    When setting `is_24x7_caregiver` to true, enforce the single 24/7 caregiver
    rule by clearing it for other active relationships for the same recipient/org.
    """
    rel = db.get(CareRelationship, relationship_id)
    if not rel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Care relationship not found")

    if payload.role is not None:
        rel.role = payload.role
    if payload.start_date is not None:
        rel.start_date = payload.start_date
    if payload.end_date is not None:
        rel.end_date = payload.end_date
    if payload.notes is not None:
        rel.notes = payload.notes
    if payload.status is not None:
        rel.status = payload.status

    if payload.is_24x7_caregiver is not None:
        if payload.is_24x7_caregiver:
            existing_24x7 = (
                db.query(CareRelationship)
                .filter(
                    CareRelationship.care_recipient_id == rel.care_recipient_id,
                    CareRelationship.organization_id == rel.organization_id,
                    CareRelationship.is_24x7_caregiver.is_(True),
                    CareRelationship.status == "active",
                    CareRelationship.id != rel.id,
                )
                .all()
            )
            for other in existing_24x7:
                other.is_24x7_caregiver = False
        rel.is_24x7_caregiver = payload.is_24x7_caregiver

    db.add(rel)
    db.commit()
    db.refresh(rel)
    return rel

