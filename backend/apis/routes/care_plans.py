"""
Care plan endpoints.

CRUD operations for managing patient care plans.
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
from backend.apis.schemas.care_plan import (
    CarePlanCreate,
    CarePlanUpdate,
    CarePlanResponse,
)
from backend.database.entities.care_plan import CarePlan

router = APIRouter(prefix="/care-plans", tags=["Care Plans"])


@router.get("", response_model=List[CarePlanResponse])
def list_care_plans(
    care_recipient_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[CarePlanResponse]:
    """
    List all care plans, optionally filtered by care recipient.
    """
    q = db.query(CarePlan).filter(CarePlan.organization_id == organization_id)
    if care_recipient_id is not None:
        q = q.filter(CarePlan.care_recipient_id == care_recipient_id)
    return q.order_by(CarePlan.effective_from.desc()).all()


@router.get("/{care_plan_id}", response_model=CarePlanResponse)
def get_care_plan(
    care_plan_id: UUID,
    db: Session = Depends(get_db_session),
) -> CarePlanResponse:
    """
    Get a single care plan by ID.
    """
    plan = db.get(CarePlan, care_plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Care plan not found"
        )
    return plan


@router.post("", response_model=CarePlanResponse, status_code=status.HTTP_201_CREATED)
def create_care_plan(
    payload: CarePlanCreate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> CarePlanResponse:
    """
    Create a new care plan.
    """
    # Deactivate existing active plans for this recipient if new one is active
    if payload.status == "active":
        active_plans = (
            db.query(CarePlan)
            .filter(
                CarePlan.care_recipient_id == payload.care_recipient_id,
                CarePlan.organization_id == payload.organization_id,
                CarePlan.status == "active",
            )
            .all()
        )
        for p in active_plans:
            p.status = "archived"
            db.add(p)

    plan = CarePlan(
        organization_id=payload.organization_id,
        care_recipient_id=payload.care_recipient_id,
        name=payload.name,
        goals=payload.goals,
        focus_areas=payload.focus_areas,
        template_id=payload.template_id,
        effective_from=payload.effective_from,
        effective_to=payload.effective_to,
        status=payload.status,
        created_by_id=current_user_id,
    )

    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.patch("/{care_plan_id}", response_model=CarePlanResponse)
def update_care_plan(
    care_plan_id: UUID,
    payload: CarePlanUpdate,
    db: Session = Depends(get_db_session),
) -> CarePlanResponse:
    """
    Partially update a care plan.
    """
    plan = db.get(CarePlan, care_plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Care plan not found"
        )

    if payload.name is not None:
        plan.name = payload.name
    if payload.goals is not None:
        plan.goals = payload.goals
    if payload.focus_areas is not None:
        plan.focus_areas = payload.focus_areas
    if payload.template_id is not None:
        plan.template_id = payload.template_id
    if payload.effective_from is not None:
        plan.effective_from = payload.effective_from
    if payload.effective_to is not None:
        plan.effective_to = payload.effective_to
    if payload.status is not None:
        # If setting to active, archive other active plans
        if payload.status == "active" and plan.status != "active":
            active_plans = (
                db.query(CarePlan)
                .filter(
                    CarePlan.care_recipient_id == plan.care_recipient_id,
                    CarePlan.organization_id == plan.organization_id,
                    CarePlan.status == "active",
                )
                .all()
            )
            for p in active_plans:
                if p.id != plan.id:
                    p.status = "archived"
                    db.add(p)
        plan.status = payload.status

    # Validate date logic
    if plan.effective_to and plan.effective_to < plan.effective_from:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="effective_to cannot be before effective_from",
        )

    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/{care_plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_care_plan(
    care_plan_id: UUID,
    db: Session = Depends(get_db_session),
) -> None:
    """
    Archive a care plan.
    """
    plan = db.get(CarePlan, care_plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Care plan not found"
        )
    plan.status = "archived"
    db.add(plan)
    db.commit()
