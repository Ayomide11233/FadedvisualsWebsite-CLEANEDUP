"""
app/schemas/auth.py
===================
Pydantic v2 schemas for authentication endpoints.
All validation rules are enforced here — never in routes or controllers.
"""

import re
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


# ── Request schemas ──────────────────────────────────────────────────────────

class UserSignupRequest(BaseModel):
    """
    Registration payload.
    Password policy: ≥8 chars, upper + lower + digit + special character.
    """
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_\-]+$", v):
            raise ValueError("Username may only contain letters, digits, underscores and hyphens.")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        errors = []
        if not re.search(r"[A-Z]", v):
            errors.append("one uppercase letter")
        if not re.search(r"[a-z]", v):
            errors.append("one lowercase letter")
        if not re.search(r"\d", v):
            errors.append("one digit")
        if not re.search(r'[@$!%*?&#^()_+=\-\[\]{}|\\:;"\'<>,./]', v):
            errors.append("one special character")
        if errors:
            raise ValueError(f"Password must contain at least: {', '.join(errors)}.")
        return v


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


# ── Response schemas ─────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """
    Safe user representation — NEVER exposes hashed_password.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
