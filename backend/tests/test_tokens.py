"""Unit tests for HMAC-signed session token helpers."""

from unittest.mock import patch

from backend.apis import tokens


def test_issue_and_verify_session_token():
    token = tokens.issue_session_token(
        "11111111-1111-1111-1111-111111111111",
        "22222222-2222-2222-2222-222222222222",
        "agency_admin",
    )
    assert token.startswith("session:")

    payload = tokens.verify_session_token(token)
    assert payload is not None
    assert payload["user_id"] == "11111111-1111-1111-1111-111111111111"
    assert payload["organization_id"] == "22222222-2222-2222-2222-222222222222"
    assert payload["role"] == "agency_admin"
    assert payload["purpose"] == "session"


def test_session_token_rejected_after_expiry():
    with patch.object(tokens, "SESSION_TTL_SECONDS", -1):
        token = tokens.issue_session_token(
            "11111111-1111-1111-1111-111111111111",
            "22222222-2222-2222-2222-222222222222",
            "caregiver",
        )
    assert tokens.verify_session_token(token) is None


def test_session_token_rejects_tampered_payload():
    token = tokens.issue_session_token(
        "11111111-1111-1111-1111-111111111111",
        "22222222-2222-2222-2222-222222222222",
        "caregiver",
    )
    prefix, body = token.split(":", 1)
    payload_b64, sig = body.rsplit(".", 1)
    tampered = f"{prefix}:{payload_b64}x.{sig}"
    assert tokens.verify_session_token(tampered) is None


def test_session_token_rejects_tampered_signature():
    token = tokens.issue_session_token(
        "11111111-1111-1111-1111-111111111111",
        "22222222-2222-2222-2222-222222222222",
        "caregiver",
    )
    tampered = token[:-1] + ("0" if token[-1] != "0" else "1")
    assert tokens.verify_session_token(tampered) is None


def test_verify_rejects_none_and_garbage_tokens():
    assert tokens.verify_session_token(None) is None
    assert tokens.verify_session_token("") is None
    assert tokens.verify_session_token("not-a-token-at-all") is None
    assert tokens.verify_session_token("preauth:abc.def") is None
