"""
app/middleware/request_size.py
================================
Rejects requests whose body exceeds MAX_REQUEST_BODY_SIZE bytes.
This prevents memory exhaustion from large payloads.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.config import get_settings
from app.utils.logger import logger

settings = get_settings()


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_bytes: int = None):
        super().__init__(app)
        self._max_bytes = max_bytes or settings.MAX_REQUEST_BODY_SIZE

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self._max_bytes:
            logger.warning(
                "Request body too large: %s bytes from %s",
                content_length,
                request.client.host if request.client else "unknown",
            )
            return JSONResponse(
                status_code=413,
                content={"detail": "Request body is too large.", "code": "payload_too_large"},
            )
        return await call_next(request)
