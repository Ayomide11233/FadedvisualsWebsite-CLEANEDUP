"""
app/schemas/product.py
=======================
Pydantic v2 schemas for product endpoints.
"""

from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict, field_validator
import json


# ── Shared frame shape ────────────────────────────────────────────────────────

class FrameOption(BaseModel):
    label: str
    color: Optional[str] = None


# ── Request schemas ───────────────────────────────────────────────────────────

class ProductCreateRequest(BaseModel):
    slug: str
    title: str
    price: float
    category: str
    description: Optional[str] = None
    details: Optional[str] = None
    shipping: Optional[str] = None
    sizes: Optional[List[str]] = None
    frames: Optional[List[FrameOption]] = None
    in_stock: bool = True
    image_url: Optional[str] = None   # set after upload, or passed directly


class ProductUpdateRequest(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    details: Optional[str] = None
    shipping: Optional[str] = None
    sizes: Optional[List[str]] = None
    frames: Optional[List[FrameOption]] = None
    in_stock: Optional[bool] = None
    image_url: Optional[str] = None


# ── Response schema ───────────────────────────────────────────────────────────

class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    price: float
    category: str
    image_url: Optional[str]
    description: Optional[str]
    details: Optional[str]
    shipping: Optional[str]
    sizes: Optional[List[str]] = None
    frames: Optional[List[FrameOption]] = None
    in_stock: bool

    @classmethod
    def from_orm_product(cls, p: Any) -> "ProductResponse":
        """Convert ORM Product (with JSON strings) → response dict."""
        sizes = json.loads(p.sizes_json) if p.sizes_json else None
        frames_raw = json.loads(p.frames_json) if p.frames_json else None
        frames = [FrameOption(**f) for f in frames_raw] if frames_raw else None
        return cls(
            id=p.id,
            slug=p.slug,
            title=p.title,
            price=p.price,
            category=p.category,
            image_url=p.image_url,
            description=p.description,
            details=p.details,
            shipping=p.shipping,
            sizes=sizes,
            frames=frames,
            in_stock=p.in_stock,
        )