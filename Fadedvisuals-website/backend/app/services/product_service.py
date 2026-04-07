"""
app/services/product_service.py
================================
Business logic for products.
Handles CRUD, image upload, and seeding from legacy JSON.
"""

import json
import math
import os
import shutil
import uuid
from typing import List, Optional

from fastapi import HTTPException, UploadFile, status

from app.models.product import Product
from app.repositories.product_repository import ProductRepository
from app.schemas.products import (
    FrameOption,
    ProductCreateRequest,
    ProductResponse,
    ProductUpdateRequest,
)
from app.utils.logger import logger

# Where uploaded images are stored on disk
UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "uploads",
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE_MB = 10


class ProductService:
    def __init__(self, repo: ProductRepository) -> None:
        self._repo = repo

    # ── Public read ───────────────────────────────────────────────────────────

    def list_products(self) -> List[ProductResponse]:
        return [ProductResponse.from_orm_product(p) for p in self._repo.get_all()]

    def get_product(self, product_id: int) -> ProductResponse:
        product = self._repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
        return ProductResponse.from_orm_product(product)

    def get_product_by_slug(self, slug: str) -> ProductResponse:
        product = self._repo.get_by_slug(slug)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
        return ProductResponse.from_orm_product(product)

    # ── Admin write ───────────────────────────────────────────────────────────

    def create_product(self, data: ProductCreateRequest) -> ProductResponse:
        if self._repo.get_by_slug(data.slug):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A product with slug '{data.slug}' already exists.",
            )
        product = self._repo.create(data)
        logger.info("Product created: id=%d slug=%s", product.id, product.slug)
        return ProductResponse.from_orm_product(product)

    def update_product(self, product_id: int, data: ProductUpdateRequest) -> ProductResponse:
        product = self._repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
        updated = self._repo.update(product, data)
        logger.info("Product updated: id=%d", product_id)
        return ProductResponse.from_orm_product(updated)

    async def upload_image(self, product_id: int, file: UploadFile) -> ProductResponse:
        product = self._repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

        # Validate extension
        ext = os.path.splitext(file.filename or "")[-1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}",
            )

        # Read and validate size
        contents = await file.read()
        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Max size is {MAX_FILE_SIZE_MB}MB.",
            )

        # Save with unique name to avoid collisions
        filename = f"{product.slug}-{uuid.uuid4().hex[:8]}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(contents)

        # Delete old file if it was a local upload
        if product.image_url and product.image_url.startswith("/static/uploads/"):
            old_filename = product.image_url.split("/")[-1]
            old_path = os.path.join(UPLOAD_DIR, old_filename)
            if os.path.exists(old_path):
                os.remove(old_path)

        image_url = f"/static/uploads/{filename}"
        updated = self._repo.set_image_url(product, image_url)
        logger.info("Image uploaded for product id=%d → %s", product_id, image_url)
        return ProductResponse.from_orm_product(updated)

    # ── Seed from legacy JSON ─────────────────────────────────────────────────

    def seed_from_json(self, json_path: str) -> int:
        """
        Populate the products table from the legacy products.json file.
        Only runs if the table is empty. Returns count of rows inserted.
        """
        if self._repo.count() > 0:
            logger.info("Products table already has data — skipping seed.")
            return 0

        if not os.path.exists(json_path):
            logger.warning("Seed file not found at %s", json_path)
            return 0

        with open(json_path, "r", encoding="utf-8") as f:
            raw = json.load(f)

        count = 0
        for item in raw:
        # 1. Handle Frames
            frames_raw = item.get("frames")
            frames = (
                [FrameOption(label=fr["label"], color=fr.get("color")) for fr in frames_raw]
                if frames_raw else [] # Use empty list instead of None for better compatibility
            )

            # 2. Map Image correctly
            # Check for 'image_url' first, then fall back to 'image'
            img = item.get("image_url") or item.get("image")

            req = ProductCreateRequest(
                # Use the string 'id' from JSON as the 'slug'
                slug=str(item["id"]), 
                title=item["title"],
                price=float(item["price"]),
                category=item.get("category", "prints"),
                image_url=img,
                description=item.get("description"),
                details=item.get("details"),
                shipping=item.get("shipping"),
                sizes=item.get("sizes", []),
                frames=frames,
                in_stock=True,
            )
            
            try:
                self._repo.create(req)
                count += 1
            except Exception as exc:
                # This will tell you EXACTLY why a row failed (e.g., "id must be int")
                logger.error("Failed to seed product '%s': %s", item.get("id"), exc)

        logger.info("Seeded %d products from %s", count, json_path)
        return count