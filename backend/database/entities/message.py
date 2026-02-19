"""
Message table. Table 2.13 in data-model-mvp1.
"""

from datetime import datetime
from uuid import UUID
from typing import Optional, Any

from sqlalchemy import String, DateTime, func, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin


class Message(Base, UUIDMixin):
    """Message has created_at only (no updated_at in spec)."""

    __tablename__ = "message"

    conversation_id: Mapped[UUID] = mapped_column(
        ForeignKey("conversation.id", ondelete="CASCADE"),
        nullable=False,
    )
    sender_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    attachments: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="sent")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
