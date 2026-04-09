"""
app/config.py
=============
Centralised configuration loaded from environment variables.
Fails fast on startup if required values are missing.
"""

import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv

load_dotenv()


class Settings:
    # ── Security ────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_HOURS: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "24"))

    # ── Database ─────────────────────────────────────────────
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./faded_visuals.db")

    # ── CORS ────────────────────────────────────────────────
    # Parsed from comma-separated string in .env
    _raw_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
    ALLOWED_ORIGINS: List[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

    # ── Ollama / AI ─────────────────────────────────────────
    OLLAMA_API_URL: str = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    
    # Stripe Configuration
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")

    # ── Rate limiting ────────────────────────────────────────
    CHAT_RATE_LIMIT: str = os.getenv("CHAT_RATE_LIMIT", "10/minute")
    AUTH_RATE_LIMIT: str = os.getenv("AUTH_RATE_LIMIT", "5/minute")

    # ── Environment ──────────────────────────────────────────
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # ── Request limits ───────────────────────────────────────
    MAX_REQUEST_BODY_SIZE: int = 65 * 1024 * 1024  # 64 KB
    MAX_CHAT_MESSAGE_LENGTH: int = 1_000    # characters

    # ── Chatbot guardrails ───────────────────────────────────
    AI_MAX_TOKENS: int = 500

    def __post_init__(self) -> None:
        # Fail fast in production if SECRET_KEY is missing/weak
        if self.ENVIRONMENT == "production":
            if not self.SECRET_KEY or len(self.SECRET_KEY) < 32:
                raise RuntimeError(
                    "SECRET_KEY must be set and at least 32 characters in production."
                )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()
    # Warn loudly in dev if secret key is missing
    if not settings.SECRET_KEY:
        import warnings
        warnings.warn(
            "SECRET_KEY is not set — using insecure default. Set it in .env.",
            stacklevel=2,
        )
        settings.SECRET_KEY = "INSECURE-DEV-KEY-CHANGE-ME"
    return settings
