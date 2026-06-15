"""Unit tests for password hashing helpers."""

from backend.apis.security import hash_password, verify_password


def test_hash_password_produces_verifiable_hash():
    hashed = hash_password("secret-pass")
    assert hashed.startswith("pbkdf2_sha256$")
    assert verify_password("secret-pass", hashed) is True


def test_verify_password_rejects_wrong_password():
    hashed = hash_password("correct")
    assert verify_password("wrong", hashed) is False


def test_verify_password_rejects_empty_hash():
    assert verify_password("anything", None) is False
    assert verify_password("anything", "") is False
