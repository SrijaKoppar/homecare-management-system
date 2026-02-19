"""
Conversation and conversation_participant tables. Tables 2.11, 2.12 in data-model-mvp1.
"""

import uuid
from datetime import datetime
from uuid import UUID
from typing import Optional

from sqlalchemy import String, DateTime, func, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class Conversation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "conversation"

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    care_recipient_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=True,
    )
    title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    type: Mapped[str] = mapped_column(String(20), nullable=False)


class ConversationParticipant(Base):
    """No created_at/updated_at in spec; joined_at only."""

    __tablename__ = "conversation_participant"
    __table_args__ = (
        UniqueConstraint("conversation_id", "user_id", name="uq_conversation_participant"),
    )

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    conversation_id: Mapped[UUID] = mapped_column(
        ForeignKey("conversation.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="member")
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
