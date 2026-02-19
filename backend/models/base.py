"""
Base types for domain entities.

Provides a common base with id and timestamps used across entities.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Entity:
    """
    Base domain entity with identity and audit timestamps.

    Attributes:
        id: Unique identifier (UUID string).
        created_at: When the entity was created (ISO 8601).
        updated_at: When the entity was last updated (ISO 8601).
    """

    id: str
    created_at: datetime
    updated_at: datetime


@dataclass
class EntityOptionalTimestamps:
    """
    Entity base with optional timestamps for creation/update.

    Attributes:
        id: Unique identifier (UUID string).
        created_at: When the entity was created; optional.
        updated_at: When the entity was last updated; optional.
    """

    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
