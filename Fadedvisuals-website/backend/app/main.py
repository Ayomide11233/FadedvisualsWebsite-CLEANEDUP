"""
app/main.py
============
FastAPI application factory.
All middleware, routers, and exception handlers are registered here.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.limiter import limiter
from app.config import get_settings
from app.database import Base, engine, SessionLocal
from app.middleware.audit_log import AuditLogMiddleware
from app.middleware.request_size import RequestSizeLimitMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.routes import auth, chat, products, services
from app.routes.stripe_checkout import router as stripe_router
from app.utils.logger import logger

# ── 1. Import models so Base.metadata knows about them ──────────────────────
from app.models.user import User
from app.models.product import Product # noqa: F401

settings = get_settings()

# ── 2. Database & Seeding Logic ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    if settings.ENVIRONMENT == "development":
        # Create tables automatically in dev
        Base.metadata.create_all(bind=engine)
        
        # Seed products from JSON if the table is empty
        _BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # Note: Adjust path if your products.json is in a different subfolder
        json_path = os.path.join(_BASE_DIR, "models", "products.json")
        
        db = SessionLocal()
        try:
            from app.repositories.product_repository import ProductRepository
            from app.services.product_service import ProductService
            
            svc = ProductService(ProductRepository(db))
            seeded = svc.seed_from_json(json_path)
            if seeded:
                logger.info("Startup seed: inserted %d products", seeded)
        except Exception as e:
            logger.error("Failed to seed database during startup: %s", e)
        finally:
            db.close()
            
    yield
    # --- Shutdown ---
    logger.info("Faded Visuals API shutting down.")

# ── 3. App factory ────────────────────────────────────────────────────────────
app = FastAPI(
    title="Faded Visuals API",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
)

# ── 4. Static Files & Directories ───────────────────────────────────────────
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Attach limiter to app state
app.state.limiter = limiter

# ── 5. Exception handlers ─────────────────────────────────────────────────────
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     return JSONResponse(
#         status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#         content={"detail": exc.errors()},
#     )

# @app.exception_handler(HTTPException)
# async def http_exception_handler(request: Request, exc: HTTPException):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"detail": exc.detail},
#     )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception", extra={
        "method": request.method,
        "path": request.url.path,
    })
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred.", "code": "internal_error"},
    )

# ── 6. Middleware ─────────────────────────────────────────────────────────────
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(AuditLogMiddleware)
app.add_middleware(RequestSizeLimitMiddleware, max_bytes=settings.MAX_REQUEST_BODY_SIZE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# ── 7. Routers ────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(products.router)
app.include_router(services.router)
app.include_router(stripe_router)

# ── 8. Health check ───────────────────────────────────────────────────────────
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