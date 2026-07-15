"""
Small password hashing helpers for MVP authentication.

Uses PBKDF2 from the Python standard library so local setup does not require
extra binary dependencies. Hash format:
pbkdf2_sha256$<iterations>$<salt_hex>$<hash_hex>
"""

import hashlib
import hmac
import os


HASH_ALGORITHM = "pbkdf2_sha256"
HASH_ITERATIONS = 260_000


def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-SHA256."""
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        HASH_ITERATIONS,
    )
    return f"{HASH_ALGORITHM}${HASH_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, password_hash: str | None) -> bool:
    """Verify a plaintext password against a stored PBKDF2 hash."""
    if not password_hash:
        return False
    try:
        algorithm, iterations_text, salt_hex, hash_hex = password_hash.split("$", 3)
        if algorithm != HASH_ALGORITHM:
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt_hex),
            int(iterations_text),
        )
        return hmac.compare_digest(digest.hex(), hash_hex)
    except (ValueError, TypeError):
        return False


# Generic secret hashing helpers (clearer naming for non-password secrets,
# e.g. organization access codes). Same PBKDF2 scheme as passwords.
hash_secret = hash_password
verify_secret = verify_password
