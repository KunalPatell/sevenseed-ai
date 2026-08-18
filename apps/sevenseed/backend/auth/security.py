# -*- coding: utf-8 -*-
"""
Sevenseed Hub - Auth Security, Password Hashing, JWT Tokens, & AES-256 BYOK Key Vault.
"""
import os
import base64
import hashlib
from datetime import datetime, timedelta
import bcrypt
import jwt
from cryptography.fernet import Fernet

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "sevenseed_super_secret_jwt_key_2026_change_in_prod")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# AES-256 Key Derivation for BYOK Encryption
def _get_fernet_key() -> bytes:
    """Derive 32-byte url-safe base64 key from JWT_SECRET."""
    digest = hashlib.sha256(JWT_SECRET.encode("utf-8")).digest()
    return base64.urlsafe_b64encode(digest)

fernet = Fernet(_get_fernet_key())


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    pw_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash (with sha256 legacy fallback)."""
    if not hashed_password or not plain_password:
        return False
    
    # Try bcrypt first
    if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            return False
            
    # Fallback legacy SHA-256
    legacy_hash = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return legacy_hash == hashed_password


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Generate JWT Access Token."""
    to_encode = data.copy()
    now = datetime.utcnow()
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Decode and validate JWT Access Token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        return None


def encrypt_api_key(raw_key: str) -> str:
    """Encrypt sensitive BYOK key using Fernet AES-256."""
    if not raw_key:
        return ""
    encrypted_bytes = fernet.encrypt(raw_key.strip().encode("utf-8"))
    return encrypted_bytes.decode("utf-8")


def decrypt_api_key(encrypted_key: str) -> str:
    """Decrypt sensitive BYOK key using Fernet AES-256."""
    if not encrypted_key:
        return ""
    try:
        decrypted_bytes = fernet.decrypt(encrypted_key.encode("utf-8"))
        return decrypted_bytes.decode("utf-8")
    except Exception:
        return ""
