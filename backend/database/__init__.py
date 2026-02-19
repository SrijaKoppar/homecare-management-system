"""
Database layer: SQLAlchemy engine, session, and ORM entities.

Entities map to the MVP-1 data model (see docs/data-model-mvp1.md).
Import Base and get_db for app wiring; import entity classes for repositories.
"""

from backend.database.base import Base
from backend.database.session import get_db, engine, SessionLocal
from backend.database.entities import (
    User,
    Organization,
    Location,
    Membership,
    CareRelationship,
    CareArrangement,
    Visit,
    Assignment24_7,
    CarePlan,
    Task,
    Conversation,
    ConversationParticipant,
    Message,
    VisitNote,
    CareNote,
)

__all__ = [
    "Base",
    "engine",
    "SessionLocal",
    "get_db",
    "User",
    "Organization",
    "Location",
    "Membership",
    "CareRelationship",
    "CareArrangement",
    "Visit",
    "Assignment24_7",
    "CarePlan",
    "Task",
    "Conversation",
    "ConversationParticipant",
    "Message",
    "VisitNote",
    "CareNote",
]
