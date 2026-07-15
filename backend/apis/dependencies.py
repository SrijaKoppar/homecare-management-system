"""
Shared API dependencies: DB session, current user, current organization, current role.

Session tokens are HMAC-signed and issued only by POST /api/v1/auth/login.
Protected routes fail closed:
    - missing, malformed, invalid, or expired token -> 401
    - unknown or inactive user -> 401
    - no active membership in the token's organization -> 403

Role is always taken from the verified membership at request time, never
from client-supplied headers (X-Role and friends are ignored for auth
purposes and only remain meaningful for local scripts that don't go
through a protected route).
"""

import uuid
from typing import Annotated, NamedTuple, Optional

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from backend.apis.tokens import verify_session_token
from backend.database.entities.membership import Membership
from backend.database.entities.user import User
from backend.database.session import get_db

INVALID_SESSION_DETAIL = "Missing or invalid session token."
NO_MEMBERSHIP_DETAIL = "No active membership in this organization."


class AuthenticatedSession(NamedTuple):
    user_id: uuid.UUID
    organization_id: uuid.UUID
    role: str


def get_db_session(db: Annotated[Session, Depends(get_db)]) -> Session:
    """
    Provide a SQLAlchemy Session to route handlers.

    This is a thin wrapper around `backend.database.session.get_db` so that
    routes can depend on a concrete `Session` type.
    """
    return db


def _authenticate(
    authorization: Annotated[Optional[str], Header(alias="Authorization")] = None,
    db: Session = Depends(get_db_session),
) -> AuthenticatedSession:
    """
    Verify the bearer session token and resolve it to a live, active
    user + membership. Cached per-request by FastAPI since every public
    dependency below depends on this same callable.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_SESSION_DETAIL)

    token = authorization[len("Bearer "):]
    payload = verify_session_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_SESSION_DETAIL)

    try:
        user_id = uuid.UUID(payload["user_id"])
        organization_id = uuid.UUID(payload["organization_id"])
    except (KeyError, ValueError, TypeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_SESSION_DETAIL)

    user = db.get(User, user_id)
    if not user or user.status != "active":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_SESSION_DETAIL)

    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == user_id,
            Membership.organization_id == organization_id,
            Membership.status == "active",
        )
        .first()
    )
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=NO_MEMBERSHIP_DETAIL)

    return AuthenticatedSession(user_id=user_id, organization_id=organization_id, role=membership.role)


def get_current_user_id(
    session: Annotated[AuthenticatedSession, Depends(_authenticate)],
) -> str:
    """Current authenticated user ID, resolved from a verified session token."""
    return str(session.user_id)


def get_current_organization_id(
    session: Annotated[AuthenticatedSession, Depends(_authenticate)],
) -> str:
    """Current organization context, resolved from a verified session token."""
    return str(session.organization_id)


def get_current_role(
    session: Annotated[AuthenticatedSession, Depends(_authenticate)],
) -> str:
    """Current role, resolved from the caller's active membership (not client headers)."""
    return session.role
