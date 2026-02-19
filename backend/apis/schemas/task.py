"""
Task request and response schemas.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TaskCategory(str, Enum):
    ADL = "adl"
    MEDICATION = "medication"
    EXERCISE = "exercise"
    HOUSEHOLD = "household"
    OTHER = "other"


class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    SKIPPED = "skipped"
    DECLINED = "declined"


class TaskBase(BaseModel):
    """Shared fields for task create/update."""

    organization_id: UUID
    care_recipient_id: UUID
    care_plan_id: Optional[UUID] = None
    visit_id: Optional[UUID] = None
    assignment_24x7_id: Optional[UUID] = None
    task_date: date
    title: str = Field(..., max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    category: Optional[TaskCategory] = Field(
        default=None,
        description="adl | medication | exercise | household | other",
    )
    frequency: Optional[str] = None
    notes: Optional[str] = Field(default=None, max_length=500)
    sort_order: Optional[int] = None


class TaskCreate(TaskBase):
    """Payload for creating a task."""

    status: TaskStatus = TaskStatus.PENDING


class TaskUpdate(BaseModel):
    """Payload for partial task update."""

    care_plan_id: Optional[UUID] = None
    visit_id: Optional[UUID] = None
    assignment_24x7_id: Optional[UUID] = None
    task_date: Optional[date] = None
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[TaskCategory] = None
    frequency: Optional[str] = None
    status: Optional[TaskStatus] = None
    notes: Optional[str] = None
    sort_order: Optional[int] = None


class TaskResponse(TaskBase):
    """Task in API responses."""

    id: UUID
    status: TaskStatus
    completed_at: Optional[datetime] = None
    completed_by_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

