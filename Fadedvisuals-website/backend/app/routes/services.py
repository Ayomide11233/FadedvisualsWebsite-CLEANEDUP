"""
app/routes/services.py
=======================
Service catalog endpoints — public, paginated, rate-limited.
"""

from fastapi import APIRouter, Depends, Query, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.repositories.catalog_repository import CatalogRepository
from app.schemas.common import PaginatedResponse, PaginationParams
from app.services.catalog_service import CatalogService

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/services", tags=["Services"])


def _get_service() -> CatalogService:
    return CatalogService(CatalogRepository())


@router.get(
    "/",
    response_model=PaginatedResponse,
    summary="List all services (paginated)",
)
@limiter.limit("60/minute")
def list_services(
    request: Request,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    service: CatalogService = Depends(_get_service),
):
    return service.get_services(PaginationParams(page=page, page_size=page_size))


@router.get(
    "/{package}",
    summary="Get services filtered by package name",
)
@limiter.limit("60/minute")
def get_services_by_package(
    request: Request,
    package: str,
    service: CatalogService = Depends(_get_service),
):
    return service.get_services_by_package(package)
