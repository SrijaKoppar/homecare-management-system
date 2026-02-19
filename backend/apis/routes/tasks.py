"""
Task endpoints.

Tasks can be scoped to a visit or to a 24/7 assignment + day.
"""

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_current_user_id,
    get_db_session,
)
from backend.apis.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from backend.database.entities.task import Task


router = APIRouter(prefix="/tasks", tags=["Tasks"])


def _validate_scope(
    visit_id: Optional[UUID],
    assignment_24x7_id: Optional[UUID],
) -> None:
    """
    Ensure either visit_id or (assignment_24x7_id) is set, but not both.
    """
    if visit_id and assignment_24x7_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task must be either visit-scoped or 24x7-scoped, not both.",
        )
    if not visit_id and not assignment_24x7_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task must be associated with a visit or a 24x7 assignment.",
        )


@router.get("", response_model=List[TaskResponse])
def list_tasks(
    care_recipient_id: Optional[UUID] = Query(default=None),
    visit_id: Optional[UUID] = Query(default=None),
    assignment_24x7_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
) -> List[TaskResponse]:
    """
    List tasks, optionally filtered by care recipient, visit, or 24x7 assignment.
    """
    q = db.query(Task).filter(Task.organization_id == organization_id)
    if care_recipient_id is not None:
        q = q.filter(Task.care_recipient_id == care_recipient_id)
    if visit_id is not None:
        q = q.filter(Task.visit_id == visit_id)
    if assignment_24x7_id is not None:
        q = q.filter(Task.assignment_24x7_id == assignment_24x7_id)
    return q.order_by(Task.task_date.asc(), Task.sort_order.asc().nulls_last()).all()


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: UUID,
    db: Session = Depends(get_db_session),
) -> TaskResponse:
    """Get a single task by ID."""
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> TaskResponse:
    """
    Create a task for a visit or for a 24/7 assignment.
    """
    _validate_scope(payload.visit_id, payload.assignment_24x7_id)

    task = Task(
        organization_id=payload.organization_id,
        care_recipient_id=payload.care_recipient_id,
        care_plan_id=payload.care_plan_id,
        visit_id=payload.visit_id,
        assignment_24x7_id=payload.assignment_24x7_id,
        task_date=payload.task_date,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        frequency=payload.frequency,
        status=payload.status,
        notes=payload.notes,
        sort_order=payload.sort_order,
        completed_by_id=None,
        completed_at=None,
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: UUID,
    payload: TaskUpdate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> TaskResponse:
    """
    Partially update a task.

    Enforces:
    - Either visit_id or assignment_24x7_id (not both).
    - status 'completed' requires completed_at and completed_by_id.
    """
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    if payload.care_plan_id is not None:
        task.care_plan_id = payload.care_plan_id
    if payload.visit_id is not None:
        task.visit_id = payload.visit_id
    if payload.assignment_24x7_id is not None:
        task.assignment_24x7_id = payload.assignment_24x7_id
    if payload.task_date is not None:
        task.task_date = payload.task_date
    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.category is not None:
        task.category = payload.category
    if payload.frequency is not None:
        task.frequency = payload.frequency
    if payload.notes is not None:
        task.notes = payload.notes
    if payload.sort_order is not None:
        task.sort_order = payload.sort_order

    # Handle status and completion fields
    if payload.status is not None:
        if payload.status == "completed":
            task.status = "completed"
            if task.completed_at is None:
                task.completed_at = datetime.now(timezone.utc)
            if task.completed_by_id is None:
                task.completed_by_id = current_user_id
        else:
            task.status = payload.status
            # For simplicity, do not automatically clear completed_at/completed_by_id here

    _validate_scope(task.visit_id, task.assignment_24x7_id)

    if task.status == "completed" and (task.completed_at is None or task.completed_by_id is None):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Completed tasks must have completed_at and completed_by_id set.",
        )

    db.add(task)
    db.commit()
    db.refresh(task)
    return task

