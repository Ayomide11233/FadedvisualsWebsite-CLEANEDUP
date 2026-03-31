"""
app/routes/chat.py
==================
Chat endpoint — public but rate-limited.
Rate limit: 10 requests/minute per IP (configured in .env).
"""

from fastapi import APIRouter, Depends, Request
from app.limiter import limiter
from app.config import get_settings
from app.repositories.catalog_repository import CatalogRepository
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService
from app.utils.logger import logger

settings = get_settings()
router = APIRouter(prefix="/chat", tags=["Chat"])




def _get_service() -> ChatService:
    return ChatService(CatalogRepository())


@router.post(
    "/",
    response_model=ChatResponse,
    summary="Chat with the Faded Visuals AI assistant",
)
@limiter.limit(settings.CHAT_RATE_LIMIT)
def chat(
    request: Request,          # Required by slowapi for IP extraction
    body: ChatRequest,
    service: ChatService = Depends(_get_service),
):
    """
    🔓 Public endpoint — no authentication required.
    Rate limited to prevent abuse.
    Input is validated and sanitised by ChatRequest schema before reaching here.
    """
    response_text = service.get_response(body.message)
    return ChatResponse(response=response_text, success=True)
