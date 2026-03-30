"""
app/services/auth_service.py
=============================
Business logic for authentication.
This layer owns all decisions — it does NOT know about HTTP or SQL.
"""

from fastapi import HTTPException, status

from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserSignupRequest, UserLoginRequest, TokenResponse, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.logger import logger


class AuthService:
    def __init__(self, repo: UserRepository) -> None:
        self._repo = repo

    def signup(self, data: UserSignupRequest) -> TokenResponse:
        # Check for duplicate email
        if self._repo.get_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with that email already exists.",
            )

        # Check for duplicate username
        if self._repo.get_by_username(data.username):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="That username is already taken.",
            )

        user = self._repo.create(
            username=data.username,
            email=data.email,
            hashed_password=hash_password(data.password),
        )

        logger.info("New user registered: id=%d email=%s", user.id, user.email)

        token = create_access_token({"user_id": user.id, "email": user.email})
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user),
        )

    def login(self, data: UserLoginRequest) -> TokenResponse:
        user = self._repo.get_by_email(data.email)

        # Use constant-time comparison to prevent user-enumeration attacks.
        # Always call verify_password even when user is None (dummy hash).
        _DUMMY_HASH = "$2b$12$KIXbX2kW5tLfOuvuXBm2cOHEh6Bkl4h5sEh1wBJMzQjxGfA9nY3KS"
        stored_hash = user.hashed_password if user else _DUMMY_HASH
        password_ok = verify_password(data.password, stored_hash)

        if not user or not password_ok or not user.is_active:
            # Generic message — never reveal whether email exists
            logger.warning("Failed login attempt for email=%s", data.email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        token = create_access_token({"user_id": user.id, "email": user.email})
        logger.info("User logged in: id=%d", user.id)
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user),
        )
