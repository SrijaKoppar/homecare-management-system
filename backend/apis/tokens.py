"""
HMAC-signed session token helpers for MVP-1 authentication.

A session token (`session:<payload>.<sig>`) is issued by
`POST /api/v1/auth/login` and `POST /api/v1/auth/signup` once email/password
(or new-account details) are validated. It identifies the authenticated
user, their organization, and their role for 8 hours.

Token format:
    session:<base64url(json_payload)>.<hex_hmac_sha256_signature>

The signature covers the base64url-encoded payload only. Tokens are
opaque to the frontend; only the backend signs and verifies them.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

SESSION_PREFIX = "session:"
SESSION_TTL_SECONDS = 8 * 60 * 60  # 8 hours

_LOCAL_DEV_FALLBACK_SECRET = "local-dev-only-insecure-secret-do-not-use-in-prod"


def _is_production() -> bool:
    env = os.environ.get("ENVIRONMENT", os.environ.get("ENV", "development")).lower()
    return env in ("production", "prod")


def _get_secret_key() -> bytes:
    """
    Resolve the HMAC signing secret from AUTH_SECRET_KEY.

    A fallback secret is only permitted outside production so local
    development works without extra setup. Production deployments must
    set AUTH_SECRET_KEY or token issuance/verification will fail loudly.
    """
    secret = os.environ.get("AUTH_SECRET_KEY")
    if secret:
        return secret.encode("utf-8")
    if _is_production():
        raise RuntimeError(
            "AUTH_SECRET_KEY is required outside local development. "
            "Set the AUTH_SECRET_KEY environment variable."
        )
    return _LOCAL_DEV_FALLBACK_SECRET.encode("utf-8")


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def _sign(payload_b64: str) -> str:
    return hmac.new(_get_secret_key(), payload_b64.encode("ascii"), hashlib.sha256).hexdigest()


def issue_session_token(user_id: str, organization_id: str, role: str) -> str:
    """Issue an 8-hour signed session token."""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(seconds=SESSION_TTL_SECONDS)
    payload = {
        "user_id": str(user_id),
        "organization_id": str(organization_id),
        "role": role,
        "issued_at": now.isoformat(),
        "expires_at": expires_at.isoformat(),
        "purpose": "session",
    }
    payload_json = json.dumps(payload, separators=(",", ":"), sort_keys=True)
    payload_b64 = _b64url_encode(payload_json.encode("utf-8"))
    signature = _sign(payload_b64)
    return f"{SESSION_PREFIX}{payload_b64}.{signature}"


def verify_session_token(token: Optional[str]) -> Optional[dict[str, Any]]:
    """
    Verify a session token's structure, signature, expiry, and purpose.

    Returns the decoded payload dict if valid, otherwise None. Never
    raises: any malformed input is treated as an invalid token.
    """
    if not token or not isinstance(token, str) or not token.startswith(SESSION_PREFIX):
        return None

    body = token[len(SESSION_PREFIX):]
    if "." not in body:
        return None
    payload_b64, _, signature = body.rpartition(".")
    if not payload_b64 or not signature:
        return None

    expected_signature = _sign(payload_b64)
    if not hmac.compare_digest(signature, expected_signature):
        return None

    try:
        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return None

    if not isinstance(payload, dict) or payload.get("purpose") != "session":
        return None

    expires_at = payload.get("expires_at")
    if not expires_at:
        return None
    try:
        expiry = datetime.fromisoformat(expires_at)
    except ValueError:
        return None
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) >= expiry:
        return None

    return payload
