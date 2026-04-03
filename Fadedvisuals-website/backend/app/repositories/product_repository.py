"""
app/repositories/product_repository.py
========================================
All SQL operations for the products table.
No business logic — just DB reads and writes.
"""

import json
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.products import ProductCreateRequest, ProductUpdateRequest


class ProductRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    # ── Read ──────────────────────────────────────────────────────────────────

    def get_all(self) -> List[Product]:
        return self._db.query(Product).order_by(Product.created_at.desc()).all()

    def get_by_id(self, product_id: int) -> Optional[Product]:
        return self._db.query(Product).filter(Product.id == product_id).first()

    def get_by_slug(self, slug: str) -> Optional[Product]:
        return self._db.query(Product).filter(Product.slug == slug).first()

    def get_by_category(self, category: str) -> List[Product]:
        return self._db.query(Product).filter(Product.category == category).all()

    # ── Write ─────────────────────────────────────────────────────────────────

    def create(self, data: ProductCreateRequest) -> Product:
        product = Product(
            slug=data.slug,
            title=data.title,
            price=data.price,
            category=data.category,
            image_url=data.image_url,
            description=data.description,
            details=data.details,
            shipping=data.shipping,
            sizes_json=json.dumps(data.sizes) if data.sizes else None,
            frames_json=json.dumps([f.model_dump() for f in data.frames]) if data.frames else None,
            in_stock=data.in_stock,
        )
        self._db.add(product)
        self._db.commit()
        self._db.refresh(product)
        return product

    def update(self, product: Product, data: ProductUpdateRequest) -> Product:
        if data.title is not None:
            product.title = data.title
        if data.price is not None:
            product.price = data.price
        if data.category is not None:
            product.category = data.category
        if data.image_url is not None:
            product.image_url = data.image_url
        if data.description is not None:
            product.description = data.description
        if data.details is not None:
            product.details = data.details
        if data.shipping is not None:
            product.shipping = data.shipping
        if data.sizes is not None:
            product.sizes_json = json.dumps(data.sizes)
        if data.frames is not None:
            product.frames_json = json.dumps([f.model_dump() for f in data.frames])
        if data.in_stock is not None:
            product.in_stock = data.in_stock
        self._db.commit()
        self._db.refresh(product)
        return product

    def set_image_url(self, product: Product, image_url: str) -> Product:
        product.image_url = image_url
        self._db.commit()
        self._db.refresh(product)
        return product

    # ── Seed helper ───────────────────────────────────────────────────────────

    def count(self) -> int:
        return self._db.query(Product).count()