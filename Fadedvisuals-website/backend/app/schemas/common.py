"""
app/schemas/common.py
=====================
Shared response envelopes and pagination helpers.
"""

from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int


class ErrorResponse(BaseModel):
    """
    Consistent error envelope — never leaks stack traces or internal details
    in production.
    """
    detail: str
    code: str = "error"


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
