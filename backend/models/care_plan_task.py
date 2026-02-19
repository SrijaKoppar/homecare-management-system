"""
Care plan task domain entity.

A task linked to a care plan and optionally to a visit or 24/7 assignment.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from backend.models.base import Entity


@dataclass
class CarePlanTask(Entity):
    """
    A single task within a care plan, optionally tied to a visit or 24/7 assignment.

    Attributes:
        id: Unique identifier (UUID).
        care_plan_id: ID of the parent care plan.
        visit_id: ID of the visit this task is for; None if daily or 24/7.
        assignment_24_7_id: ID of the 24/7 assignment; None if visit-based.
        task_type: Description or code for task type (e.g. ADL, medication).
        frequency: Human-readable or code (e.g. daily, per_visit).
        status: pending, completed, skipped, declined.
        notes: Optional notes.
        completed_at: When the task was completed; None if not done.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    care_plan_id: str
    task_type: str
    frequency: str
    status: str  # TaskStatus: pending | completed | skipped | declined
    visit_id: Optional[str] = None
    assignment_24_7_id: Optional[str] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None
