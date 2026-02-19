"""
Location endpoints.

Locations belong to an organization (typically agencies) and represent offices
or branches. Queries are scoped to the current organization.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_db_session,
)
from backend.apis.schemas.location import (
    LocationCreate,
    LocationUpdate,
    LocationResponse,
)
from backend.database.entities.location import Location


router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("", response_model=List[LocationResponse])
def list_locations(
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[LocationResponse]:
    """
    List locations for the current organization.
    """
    locations = (
        db.query(Location)
        .filter(Location.organization_id == organization_id)
        .order_by(Location.created_at.desc())
        .all()
    )
    return locations


@router.get("/{location_id}", response_model=LocationResponse)
def get_location(
    location_id: UUID,
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> LocationResponse:
    """Get a single location by ID, scoped to current organization."""
    location = (
        db.query(Location)
        .filter(
            Location.id == location_id,
            Location.organization_id == organization_id,
        )
        .first()
    )
    if not location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")
    return location


@router.post("", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def create_location(
    payload: LocationCreate,
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> LocationResponse:
    """
    Create a location for the current organization.

    The organization_id in the payload is ignored and overridden with the
    current organization context to avoid cross-tenant writes.
    """
    location = Location(
        organization_id=organization_id,
        name=payload.name,
        address_street=payload.address_street,
        address_city=payload.address_city,
        address_region=payload.address_region,
        address_postal_code=payload.address_postal_code,
        address_country=payload.address_country,
        timezone=payload.timezone,
        is_default=payload.is_default,
    )

    db.add(location)
    db.commit()
    db.refresh(location)
    return location


@router.patch("/{location_id}", response_model=LocationResponse)
def update_location(
    location_id: UUID,
    payload: LocationUpdate,
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> LocationResponse:
    """Partially update a location for the current organization."""
    location = (
        db.query(Location)
        .filter(
            Location.id == location_id,
            Location.organization_id == organization_id,
        )
        .first()
    )
    if not location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")

    if payload.name is not None:
        location.name = payload.name
    if payload.address_street is not None:
        location.address_street = payload.address_street
    if payload.address_city is not None:
        location.address_city = payload.address_city
    if payload.address_region is not None:
        location.address_region = payload.address_region
    if payload.address_postal_code is not None:
        location.address_postal_code = payload.address_postal_code
    if payload.address_country is not None:
        location.address_country = payload.address_country
    if payload.timezone is not None:
        location.timezone = payload.timezone
    if payload.is_default is not None:
        location.is_default = payload.is_default

    db.add(location)
    db.commit()
    db.refresh(location)
    return location

