"""
app/routes/auth.py
==================
Auth HTTP endpoints. This file ONLY handles:
- Parsing requests
- Calling the service layer
- Returning responses

No business logic lives here.
"""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserSignupRequest, UserLoginRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def _get_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db))


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=201,
    summary="Register a new user account",
)
def signup(
    data: UserSignupRequest,
    service: AuthService = Depends(_get_service),
):
    return service.signup(data)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and receive a JWT",
)
def login(
    data: UserLoginRequest,
    service: AuthService = Depends(_get_service),
):
    return service.login(data)


@router.get(
    "/profile",
    response_model=UserResponse,
    summary="Return the authenticated user's profile",
)
def profile(current_user=Depends(get_current_user)):
    return current_user
