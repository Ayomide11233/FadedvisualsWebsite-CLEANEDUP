"""
app/main.py
============
FastAPI application factory.
All middleware, routers, and exception handlers are registered here.
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import get_settings
from app.database import Base, engine
from app.middleware.audit_log import AuditLogMiddleware
from app.middleware.request_size import RequestSizeLimitMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.routes import auth, chat, products, services
from app.routes.stripe_checkout import router as stripe_router
from app.utils.logger import logger

settings = get_settings()

# ── Database ─────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── Rate limiter (shared instance) ───────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

# ── App factory ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Faded Visuals API",
    version="2.0.0",
    # Disable docs in production to avoid leaking schema information
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
)

# Attach limiter to app state (required by slowapi)
app.state.limiter = limiter

# ── Exception handlers ────────────────────────────────────────────────────────

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler.
    Never expose stack traces to clients — log internally only.
    """
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred.", "code": "internal_error"},
    )


# ── Middleware (applied in reverse order — last added = outermost) ────────────

# 1. Security headers on every response
app.add_middleware(SecurityHeadersMiddleware)

# 2. Audit logging
app.add_middleware(AuditLogMiddleware)

# 3. Request body size limit (64 KB)
app.add_middleware(RequestSizeLimitMiddleware)

# 4. CORS — restricted to explicit allow-list
#    VULNERABILITY FIX: was allow_origins=["*"] which allows any site to make
#    credentialed cross-origin requests to this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,   # ← explicit list, never "*"
    allow_credentials=True,
    allow_methods=["GET", "POST"],             # only what we actually use
    allow_headers=["Authorization", "Content-Type"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(products.router)
app.include_router(services.router)
app.include_router(stripe_router)

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"], include_in_schema=False)
def health():
    return {
        "status": "ok",
        "service": "Faded Visuals API",
        "version": "2.0.0",
    }


logger.info(
    "Faded Visuals API started | env=%s | allowed_origins=%s",
    settings.ENVIRONMENT,
    settings.ALLOWED_ORIGINS,
)
