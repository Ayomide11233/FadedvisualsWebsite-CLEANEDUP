"""
app/routes/products.py
=======================
Product catalog endpoints — public, paginated, rate-limited.
"""

from fastapi import APIRouter, Depends, Query, Request
from app.limiter import limiter
from app.repositories.catalog_repository import CatalogRepository
from app.schemas.common import PaginatedResponse, PaginationParams
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/products", tags=["Products"])


def _get_service() -> CatalogService:
    return CatalogService(CatalogRepository())


@router.get(
    "/",
    response_model=PaginatedResponse,
    summary="List all products (paginated)",
)
@limiter.limit("60/minute")
def list_products(
    request: Request,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    service: CatalogService = Depends(_get_service),
):
    return service.get_products(PaginationParams(page=page, page_size=page_size))


@router.get(
    "/{product_id}",
    summary="Get a single product by ID",
)
@limiter.limit("60/minute")
def get_product(
    request: Request,
    product_id: str,
    service: CatalogService = Depends(_get_service),
):
    return service.get_product(product_id)
