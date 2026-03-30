"""
app/schemas/chat.py
===================
Pydantic schemas for the chatbot endpoint.
MAX_MESSAGE_LENGTH is enforced here to prevent abuse.
"""

from pydantic import BaseModel, Field, field_validator

from app.config import get_settings

settings = get_settings()

# Characters stripped before the message reaches the AI
_FORBIDDEN_PATTERNS = [
    "ignore previous instructions",
    "ignore all previous",
    "disregard your instructions",
    "you are now",
    "pretend you are",
    "act as if",
    "jailbreak",
    "bypass",
    "your new instructions",
    "forget everything",
    "system prompt",
    "reveal your prompt",
    "print your instructions",
]


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=settings.MAX_CHAT_MESSAGE_LENGTH,
    )

    @field_validator("message")
    @classmethod
    def sanitise_message(cls, v: str) -> str:
        lower = v.lower()
        for pattern in _FORBIDDEN_PATTERNS:
            if pattern in lower:
                raise ValueError(
                    "Your message contains content that cannot be processed."
                )
        # Strip leading/trailing whitespace
        return v.strip()


class ChatResponse(BaseModel):
    response: str
    success: bool = True
