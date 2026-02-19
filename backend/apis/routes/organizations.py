"""
Organization endpoints.

List and manage organizations. In a later iteration these should be scoped by
membership and roles; for now they are global.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.apis.schemas.organization import OrganizationResponse
from backend.apis.dependencies import get_db_session
from backend.database.entities.organization import Organization

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.get("", response_model=List[OrganizationResponse])
def list_organizations(db: Session = Depends(get_db_session)) -> List[OrganizationResponse]:
    """List all organizations."""
    orgs = db.query(Organization).order_by(Organization.created_at.desc()).all()
    return orgs


@router.get("/{organization_id}", response_model=OrganizationResponse)
def get_organization(
    organization_id: UUID,
    db: Session = Depends(get_db_session),
) -> OrganizationResponse:
    """Get organization by ID."""
    org = db.get(Organization, organization_id)
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return org
