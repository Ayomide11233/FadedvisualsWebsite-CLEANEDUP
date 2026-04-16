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
from fastapi.responses import RedirectResponse
from fastapi_sso.sso.google import GoogleSSO
from sqlalchemy.orm import Session
from app.limiter import limiter
from app.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserSignupRequest, UserLoginRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService
from app.utils.security import get_current_user
from dotenv import load_dotenv
import json
import os

from pathlib import Path
from dotenv import load_dotenv

# This finds the directory where auth.py is, then goes up to the 'backend' folder
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / '.env'

load_dotenv(dotenv_path=env_path, override=True)

# Verify again
client_id = os.getenv("YOUR_GOOGLE_ID")
print(f"--- PATH CHECK ---")
print(f"Looking for .env at: {env_path}")
print(f"File exists? {env_path.exists()}")
print(f"DEBUG: My Client ID is: {client_id}")
print(f"------------------")

router = APIRouter(prefix="/api/auth", tags=["Auth"])

google_sso = GoogleSSO(
    client_id=os.getenv("YOUR_GOOGLE_ID"),
    client_secret=os.getenv("YOUR_GOOGLE_SECRET"),
    redirect_uri="http://localhost:8000/api/auth/google/callback" 
)

def get_auth_service(db=Depends(get_db)):
    repo = UserRepository(db)
    return AuthService(repo)

# 2. Setup SSO


@router.get("/google/login")
async def google_login():
    return await google_sso.get_login_redirect()

@router.get("/google/callback")
async def google_callback(request: Request, service: AuthService = Depends(get_auth_service)):
    # Verify Google's response
    google_user = await google_sso.verify_and_process(request)
    
    # Use your Service to handle DB logic and Token generation
    auth_result = service.handle_social_login(
        email=google_user.email,
        username=google_user.display_name
    )
    
    # Redirect back to your React Frontend
    frontend_url = "http://localhost:5173/auth"
    # We turn the user object into JSON so React can parse it
    user_json = auth_result.user.model_dump_json()
    
    return RedirectResponse(
        url=f"{frontend_url}?token={auth_result.access_token}&user={user_json}"
    )

@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=201,
    summary="Register a new user account",
)
@limiter.limit("10/minute")
def signup(
    request: Request,
    data: UserSignupRequest,
    service: AuthService = Depends(get_auth_service),
):
    return service.signup(data)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and receive a JWT",
)
@limiter.limit("10/minute")
def login(
    request: Request,
    data: UserLoginRequest,
    service: AuthService = Depends(get_auth_service),
):
    return service.login(data)


@router.get(
    "/profile",
    response_model=UserResponse,
    summary="Return the authenticated user's profile",
)
@limiter.limit("30/minute")
def profile(
    request: Request,
    current_user=Depends(get_current_user)):
    return current_user
