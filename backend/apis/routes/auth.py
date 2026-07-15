"""
Authentication endpoints: plain email/password login, plus self-service
signup that creates a new organization and its first admin user.
"""

import re
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.apis.dependencies import get_db_session
from backend.apis.schemas.auth import LoginPayload, LoginResponse, SignupPayload
from backend.apis.security import hash_password, verify_password
from backend.apis.tokens import issue_session_token
from backend.database.entities.membership import Membership
from backend.database.entities.organization import Organization
from backend.database.entities.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

INVALID_CREDENTIALS_DETAIL = "Invalid email or password."


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "org"


def _unique_org_slug(db: Session, organization_name: str) -> str:
    base = _slugify(organization_name)
    slug = base
    while db.query(Organization).filter(Organization.slug == slug).first() is not None:
        slug = f"{base}-{uuid.uuid4().hex[:6]}"
    return slug


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginPayload,
    db: Session = Depends(get_db_session),
) -> LoginResponse:
    """
    Authenticate a user by email and password.

    Fails closed: unknown email, wrong password, inactive user, or no
    active membership in any organization all reject the login attempt
    with the same generic error so the response doesn't reveal which
    part was wrong.
    """
    user = (
        db.query(User)
        .filter(User.email.ilike(payload.email.strip()))
        .first()
    )
    if not user or user.status != "active":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_CREDENTIALS_DETAIL)

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_CREDENTIALS_DETAIL)

    membership = (
        db.query(Membership)
        .filter(Membership.user_id == user.id, Membership.status == "active")
        .first()
    )
    if not membership:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_CREDENTIALS_DETAIL)

    token = issue_session_token(str(user.id), str(membership.organization_id), membership.role)

    return LoginResponse(
        token=token,
        user_id=user.id,
        organization_id=membership.organization_id,
        role=membership.role,
        email=user.email,
        display_name=user.display_name or f"{user.first_name} {user.last_name}",
    )


@router.post("/signup", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupPayload,
    db: Session = Depends(get_db_session),
) -> LoginResponse:
    """
    Self-service signup. Creates a brand-new organization along with the
    submitting user as its first admin, then logs them straight in.
    """
    email = payload.email.strip().lower()

    existing = db.query(User).filter(User.email.ilike(email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    org = Organization(
        name=payload.organization_name.strip(),
        type="agency",
        status="active",
        slug=_unique_org_slug(db, payload.organization_name),
    )
    db.add(org)

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        display_name=f"{payload.first_name.strip()} {payload.last_name.strip()}".strip(),
        status="active",
    )
    db.add(user)

    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    membership = Membership(
        user_id=user.id,
        organization_id=org.id,
        role="agency_admin",
        status="active",
    )
    db.add(membership)
    db.commit()
    db.refresh(user)
    db.refresh(org)
    db.refresh(membership)

    token = issue_session_token(str(user.id), str(org.id), membership.role)

    return LoginResponse(
        token=token,
        user_id=user.id,
        organization_id=org.id,
        role=membership.role,
        email=user.email,
        display_name=user.display_name,
    )
