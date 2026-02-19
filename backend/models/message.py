"""
Conversation and message domain entities.

Secure messaging between family, caregivers, and agency.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

from backend.models.base import Entity


@dataclass
class Conversation(Entity):
    """
    A conversation thread (e.g. per recipient or care circle).

    Attributes:
        id: Unique identifier (UUID).
        title: Optional thread title.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    title: Optional[str] = None


@dataclass
class Message(Entity):
    """
    A single message in a conversation.

    Attributes:
        id: Unique identifier (UUID).
        conversation_id: ID of the conversation.
        sender_id: ID of the sender (Person).
        body: Message body (plain text or sanitized HTML).
        read_at: When the message was read by recipient(s); optional.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    conversation_id: str
    sender_id: str
    body: str
    read_at: Optional[datetime] = None


@dataclass
class ConversationParticipant:
    """
    Links a person to a conversation (many-to-many).

    Attributes:
        id: Unique identifier (UUID).
        conversation_id: ID of the conversation.
        person_id: ID of the participant.
        role: Optional role in the thread (e.g. family, caregiver).
    """

    id: str
    conversation_id: str
    person_id: str
    role: Optional[str] = None
