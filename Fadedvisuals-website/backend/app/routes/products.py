"""
app/routes/products.py
=======================
Product catalog endpoints.

Public:
  GET  /products/          — paginated list
  GET  /products/{id}      — single product by DB id
  GET  /products/slug/{slug} — single product by slug

Admin-only (requires JWT + is_admin=True):
  POST   /products/                    — create product
  PUT    /products/{id}                — update product (title, price, stock, etc.)
  POST   /products/{id}/image          — upload product image
"""

from fastapi import APIRouter, Depends, File, HTTPException, Query, Request, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.limiter import limiter
from app.repositories.product_repository import ProductRepository
from app.schemas.products import ProductCreateRequest, ProductResponse, ProductUpdateRequest
from app.services.product_service import ProductService
from app.utils.security import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])


# ── Dependency helpers ────────────────────────────────────────────────────────

def _get_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(ProductRepository(db))


def _require_admin(current_user=Depends(get_current_user)):
    """Raises 403 if the authenticated user is not an admin."""
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return current_user


# ── Public endpoints ──────────────────────────────────────────────────────────

@router.get("/", response_model=list[ProductResponse], summary="List all products")
@limiter.limit("60/minute")
def list_products(
    request: Request,
    service: ProductService = Depends(_get_service),
):
    return service.list_products()


@router.get("/slug/{slug}", response_model=ProductResponse, summary="Get product by slug")
@limiter.limit("60/minute")
def get_product_by_slug(
    request: Request,
    slug: str,
    service: ProductService = Depends(_get_service),
):
    return service.get_product_by_slug(slug)


@router.get("/{product_id}", response_model=ProductResponse, summary="Get product by ID")
@limiter.limit("60/minute")
def get_product(
    request: Request,
    product_id: int,
    service: ProductService = Depends(_get_service),
):
    return service.get_product(product_id)


# ── Admin endpoints ───────────────────────────────────────────────────────────

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=201,
    summary="[Admin] Create a new product",
)
@limiter.limit("30/minute")
def create_product(
    request: Request,
    data: ProductCreateRequest,
    service: ProductService = Depends(_get_service),
    _admin=Depends(_require_admin),
):
    return service.create_product(data)


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    summary="[Admin] Update a product (including stock status)",
)
@limiter.limit("30/minute")
def update_product(
    request: Request,
    product_id: int,
    data: ProductUpdateRequest,
    service: ProductService = Depends(_get_service),
    _admin=Depends(_require_admin),
):
    return service.update_product(product_id, data)


@router.post(
    "/{product_id}/image",
    response_model=ProductResponse,
    summary="[Admin] Upload product image",
)
@limiter.limit("20/minute")
async def upload_product_image(
    request: Request,
    product_id: int,
    file: UploadFile = File(...),
    service: ProductService = Depends(_get_service),
    _admin=Depends(_require_admin),
):
    return await service.upload_image(product_id, file)