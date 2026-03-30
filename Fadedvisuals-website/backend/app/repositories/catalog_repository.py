"""
app/repositories/catalog_repository.py
========================================
Loads product and service data from JSON files on disk.
Caches after first load to avoid repeated I/O.
"""

import json
import os
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple

from app.utils.logger import logger

# Resolve path: this file is at app/repositories/, models/ is at project root
_BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_PRODUCTS_PATH = os.path.join(_BASE_DIR, "models", "products.json")
_SERVICES_PATH = os.path.join(_BASE_DIR, "models", "services.json")


@lru_cache(maxsize=1)
def _load_catalog() -> Tuple[List[Dict], List[Dict]]:
    """
    Load both JSON files once and cache the result in memory.
    Returns empty lists gracefully if files are missing.
    """
    products: List[Dict] = []
    services: List[Dict] = []

    try:
        if os.path.exists(_PRODUCTS_PATH):
            with open(_PRODUCTS_PATH, "r", encoding="utf-8") as f:
                products = json.load(f)
            logger.info("Loaded %d products from %s", len(products), _PRODUCTS_PATH)
        else:
            logger.warning("products.json not found at %s", _PRODUCTS_PATH)

        if os.path.exists(_SERVICES_PATH):
            with open(_SERVICES_PATH, "r", encoding="utf-8") as f:
                services = json.load(f)
            logger.info("Loaded %d services from %s", len(services), _SERVICES_PATH)
        else:
            logger.warning("services.json not found at %s", _SERVICES_PATH)

    except Exception as exc:
        logger.error("Failed to load catalog: %s", exc)

    return products, services


class CatalogRepository:
    def get_all_products(self) -> List[Dict]:
        products, _ = _load_catalog()
        return products

    def get_product_by_id(self, product_id: str) -> Optional[Dict]:
        products, _ = _load_catalog()
        return next((p for p in products if str(p.get("id")) == str(product_id)), None)

    def get_all_services(self) -> List[Dict]:
        _, services = _load_catalog()
        return services

    def get_services_by_package(self, package: str) -> List[Dict]:
        _, services = _load_catalog()
        return [s for s in services if s.get("package", "").lower() == package.lower()]

    def get_catalog_context(self) -> str:
        """
        Returns a compact text summary used as context for the AI prompt.
        """
        products, services = _load_catalog()
        lines = ["IMPORTANT: Use ONLY the catalog below when answering.\n"]

        if products:
            lines.append("PRODUCTS:")
            for p in products:
                lines.append(
                    f"- {p.get('title', 'N/A')} | ${p.get('base_price', 'N/A')} "
                    f"| {p.get('description', '')}"
                )

        if services:
            lines.append("\nSERVICES:")
            for s in services:
                price = s.get("price") or s.get("price_range") or "Contact for pricing"
                deliverables = s.get("deliverables", [])
                if isinstance(deliverables, list):
                    deliverables_str = ", ".join(str(d) for d in deliverables)
                else:
                    deliverables_str = str(deliverables)

                lines.append(
                    f"- {s.get('package', 'Package')} [{s.get('tier', 'Standard')}]: "
                    f"${price}\n"
                    f"  Description: {s.get('description', '')}\n"
                    f"  Includes: {deliverables_str}\n"
                    f"  Revisions: {s.get('revisions', 'N/A')}\n"
                )

        return "\n".join(lines)
