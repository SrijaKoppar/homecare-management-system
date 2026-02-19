"""
Database engine and session factory.

Uses environment or default connection string. Replace with your config.
"""

from collections.abc import Generator
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.database.base import Base

# Default for local dev; override with DATABASE_URL env
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://localhost:5432/homecare",
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields a DB session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
