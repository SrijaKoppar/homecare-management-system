"""
Conversation and message endpoints.

Manage chat threads, direct/group messages, and participants.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import (
    get_current_organization_id,
    get_current_user_id,
    get_db_session,
)
from backend.apis.schemas.message import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
    ConversationParticipantResponse,
)
from backend.database.entities.conversation import Conversation, ConversationParticipant
from backend.database.entities.message import Message

router = APIRouter(prefix="/conversations", tags=["Conversations & Messages"])


@router.get("", response_model=List[ConversationResponse])
def list_conversations(
    care_recipient_id: Optional[UUID] = Query(default=None),
    db: Session = Depends(get_db_session),
    organization_id: str = Depends(get_current_organization_id),
    current_user_id: str = Depends(get_current_user_id),
) -> List[ConversationResponse]:
    """
    List all conversations the user is a participant of in the organization.
    """
    user_uuid = UUID(current_user_id)
    
    # Query conversations where organization_id matches and current user is a participant
    # Join with ConversationParticipant
    q = (
        db.query(Conversation)
        .join(ConversationParticipant, Conversation.id == ConversationParticipant.conversation_id)
        .filter(
            Conversation.organization_id == organization_id,
            ConversationParticipant.user_id == user_uuid,
        )
    )
    
    if care_recipient_id is not None:
        q = q.filter(Conversation.care_recipient_id == care_recipient_id)
        
    return q.order_by(Conversation.updated_at.desc()).all()


@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> ConversationResponse:
    """
    Get a single conversation by ID (ensures user is a participant).
    """
    user_uuid = UUID(current_user_id)
    
    # Verify participant membership
    part = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_uuid,
        )
        .first()
    )
    if not part:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant of this conversation.",
        )

    conv = db.get(Conversation, conversation_id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found."
        )
    return conv


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    payload: ConversationCreate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> ConversationResponse:
    """
    Create a conversation and add participants.
    """
    # Create conversation
    conv = Conversation(
        organization_id=payload.organization_id,
        care_recipient_id=payload.care_recipient_id,
        title=payload.title,
        type=payload.type,
    )
    db.add(conv)
    db.flush()  # Populates conv.id

    # Add participants
    participants = list(set(payload.participants))  # deduplicate
    # Ensure current user is a participant
    curr_uuid = UUID(current_user_id)
    if curr_uuid not in participants:
        participants.append(curr_uuid)

    for user_uuid in participants:
        p = ConversationParticipant(
            conversation_id=conv.id,
            user_id=user_uuid,
            role="member",
        )
        db.add(p)

    db.commit()
    db.refresh(conv)
    return conv


@router.get("/{conversation_id}/participants", response_model=List[ConversationParticipantResponse])
def list_conversation_participants(
    conversation_id: UUID,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> List[ConversationParticipantResponse]:
    """
    List all participants in a conversation thread.
    """
    user_uuid = UUID(current_user_id)
    # Check access
    part = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_uuid,
        )
        .first()
    )
    if not part:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view participants of this conversation.",
        )

    return (
        db.query(ConversationParticipant)
        .filter(ConversationParticipant.conversation_id == conversation_id)
        .all()
    )


@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
def list_messages(
    conversation_id: UUID,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> List[MessageResponse]:
    """
    Get messages in a conversation thread.
    """
    user_uuid = UUID(current_user_id)
    # Verify participant membership
    part = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_uuid,
        )
        .first()
    )
    if not part:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to these messages.",
        )

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return messages


@router.post("/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    conversation_id: UUID,
    payload: MessageCreate,
    db: Session = Depends(get_db_session),
    current_user_id: str = Depends(get_current_user_id),
) -> MessageResponse:
    """
    Send a message in a conversation. Updates the conversation's `updated_at` time.
    """
    user_uuid = UUID(current_user_id)
    # Verify participant membership
    part = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_uuid,
        )
        .first()
    )
    if not part:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to send messages to this conversation.",
        )

    msg = Message(
        conversation_id=conversation_id,
        sender_id=user_uuid,
        body=payload.body,
        status="sent",
    )
    db.add(msg)

    # Touch conversation updated_at
    conv = db.get(Conversation, conversation_id)
    if conv:
        import datetime
        conv.updated_at = datetime.datetime.now(datetime.timezone.utc)
        db.add(conv)

    db.commit()
    db.refresh(msg)
    return msg
