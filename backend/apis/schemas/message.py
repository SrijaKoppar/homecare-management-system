"""
Conversation and message request and response schemas.
"""

from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID

from pydantic import BaseModel, Field


# =====================================================================
# Conversation Participant
# =====================================================================

class ConversationParticipantBase(BaseModel):
    user_id: UUID
    role: str = Field("member", max_length=20)


class ConversationParticipantCreate(ConversationParticipantBase):
    pass


class ConversationParticipantResponse(ConversationParticipantBase):
    id: UUID
    conversation_id: UUID
    joined_at: datetime

    model_config = {"from_attributes": True}


# =====================================================================
# Conversation
# =====================================================================

class ConversationBase(BaseModel):
    organization_id: UUID
    care_recipient_id: Optional[UUID] = None
    title: Optional[str] = Field(None, max_length=200)
    type: str = Field(..., max_length=20, description="care_circle | direct | group")


class ConversationCreate(ConversationBase):
    participants: List[UUID] = Field(
        ...,
        description="List of user IDs to include as participants on creation.",
    )


class ConversationUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    type: Optional[str] = Field(None, max_length=20)


class ConversationResponse(ConversationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# =====================================================================
# Message
# =====================================================================

class MessageBase(BaseModel):
    body: str


class MessageCreate(MessageBase):
    pass


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    body: str
    attachments: Optional[dict[str, Any]] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
