"""
Authentication endpoints.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.apis.dependencies import get_db_session
from backend.apis.schemas.auth import LoginPayload, LoginResponse
from backend.apis.security import verify_password
from backend.database.entities.user import User
from backend.database.entities.membership import Membership

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginPayload,
    db: Session = Depends(get_db_session),
) -> LoginResponse:
    """
    Authenticate a user by email and password.
    For MVP-1, we look up the user by email. If found, we issue a token:
    `token:<user_id>:<organization_id>:<role>`
    """
    user = (
        db.query(User)
        .filter(User.email.ilike(payload.email.strip()))
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Use active membership to resolve organizational context.
    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == user.id,
            Membership.status == "active",
        )
        .first()
    )

    org_id = membership.organization_id if membership else uuid.UUID("00000000-0000-0000-0000-000000000000")
    role = membership.role if membership else "caregiver"

    # Issue simple custom session token
    token = f"token:{user.id}:{org_id}:{role}"

    return LoginResponse(
        token=token,
        user_id=user.id,
        organization_id=org_id,
        role=role,
        email=user.email,
        display_name=user.display_name or f"{user.first_name} {user.last_name}",
    )
