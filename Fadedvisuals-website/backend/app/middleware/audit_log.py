"""
app/middleware/audit_log.py
============================
Logs every request with method, path, status code, and client IP.
Emits WARNING-level logs for 4xx/5xx responses so they are easy to alert on.
"""

import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.utils.logger import logger


class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()
        client_ip = request.client.host if request.client else "unknown"

        response = await call_next(request)

        duration_ms = (time.perf_counter() - start) * 1000
        msg = (
            f"{request.method} {request.url.path} "
            f"status={response.status_code} "
            f"ip={client_ip} "
            f"duration={duration_ms:.1f}ms"
        )

        if response.status_code >= 500:
            logger.error(msg)
        elif response.status_code >= 400:
            logger.warning(msg)
        else:
            logger.info(msg)

        return response
