"""
Care plan domain entity.

Goals and focus areas for a care recipient; may reference a template.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

from backend.models.base import Entity


@dataclass
class CarePlan(Entity):
    """
    Care plan for a recipient: goals, focus areas, optional template.

    Attributes:
        id: Unique identifier (UUID).
        recipient_id: ID of the care recipient.
        goals: List of goal descriptions.
        focus_areas: List of focus area descriptions.
        template_id: Optional ID of a care plan template.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    recipient_id: str
    goals: List[str]
    focus_areas: List[str]
    template_id: Optional[str] = None
