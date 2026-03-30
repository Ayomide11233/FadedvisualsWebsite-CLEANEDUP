"""
app/services/catalog_service.py
================================
Business logic for products and services catalog.
Handles pagination and item lookup.
"""

from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status

from app.repositories.catalog_repository import CatalogRepository
from app.schemas.common import PaginatedResponse, PaginationParams
import math


class CatalogService:
    def __init__(self, repo: CatalogRepository) -> None:
        self._repo = repo

    def get_products(self, pagination: PaginationParams) -> PaginatedResponse:
        all_products = self._repo.get_all_products()
        return self._paginate(all_products, pagination)

    def get_product(self, product_id: str) -> Dict:
        product = self._repo.get_product_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found.",
            )
        return product

    def get_services(self, pagination: PaginationParams) -> PaginatedResponse:
        all_services = self._repo.get_all_services()
        return self._paginate(all_services, pagination)

    def get_services_by_package(self, package: str) -> List[Dict]:
        services = self._repo.get_services_by_package(package)
        if not services:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No services found for package '{package}'.",
            )
        return services

    @staticmethod
    def _paginate(items: List[Any], params: PaginationParams) -> PaginatedResponse:
        total = len(items)
        total_pages = max(1, math.ceil(total / params.page_size))
        start = (params.page - 1) * params.page_size
        end = start + params.page_size
        return PaginatedResponse(
            items=items[start:end],
            total=total,
            page=params.page,
            page_size=params.page_size,
            total_pages=total_pages,
        )
