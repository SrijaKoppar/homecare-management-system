"""Pytest configuration and shared fixtures for API tests."""

import os
import uuid
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.apis.main import create_app
from backend.apis.dependencies import get_db_session
from backend.apis.security import hash_password
from backend.database.base import Base
from backend.database.entities import Organization, User, Membership


TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    os.getenv("DATABASE_URL", "postgresql://localhost:5432/homecare"),
)


def _db_available() -> bool:
    try:
        engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
        with engine.connect() as conn:
            conn.execute(__import__("sqlalchemy").text("SELECT 1"))
        engine.dispose()
        return True
    except Exception:
        return False


pytestmark = pytest.mark.skipif(
    not _db_available(),
    reason="PostgreSQL test database is not available",
)


@pytest.fixture(scope="module")
def db_engine():
    engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
    yield engine
    engine.dispose()


@pytest.fixture
def db_session(db_engine) -> Generator[Session, None, None]:
    connection = db_engine.connect()
    transaction = connection.begin()
    TestingSession = sessionmaker(bind=connection)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    app = create_app()

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db_session] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def seed_org_and_admin(db_session: Session) -> dict:
    org_id = uuid.UUID("00000000-0000-0000-0000-000000000000")
    email = f"pytest-admin-{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"

    org = db_session.get(Organization, org_id)
    if not org:
        org = Organization(id=org_id, name="Test Org", type="agency", status="active")
        db_session.add(org)
        db_session.flush()

    user = User(
        email=email,
        first_name="Test",
        last_name="Admin",
        display_name="Test Admin",
        password_hash=hash_password(password),
        status="active",
    )
    db_session.add(user)
    db_session.flush()

    membership = Membership(
        user_id=user.id,
        organization_id=org_id,
        role="agency_admin",
        status="active",
    )
    db_session.add(membership)
    db_session.commit()
    db_session.refresh(user)

    return {
        "org_id": str(org_id),
        "user_id": str(user.id),
        "email": email,
        "password": password,
    }


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}
