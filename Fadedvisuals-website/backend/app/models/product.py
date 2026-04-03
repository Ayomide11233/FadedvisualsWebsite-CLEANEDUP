"""
app/models/product.py
======================
SQLAlchemy ORM model for the products table.
Replaces the flat products.json file.

Column notes:
  - sizes_json   : JSON-encoded list e.g. '["S","M","L"]'
  - frames_json  : JSON-encoded list of {label, color} objects, or null for apparel
  - image_url    : relative path served by /static/uploads/, e.g. "play-boy.png"
  - in_stock     : False = "Sold Out" badge shown on card
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id          = Column(Integer, primary_key=True, index=True)
    slug        = Column(String(100), unique=True, nullable=False, index=True)   # e.g. "play-boy"
    title       = Column(String(200), nullable=False)
    price       = Column(Float, nullable=False)
    category    = Column(String(50), nullable=False, index=True)                 # prints | apparel | collectibles
    image_url   = Column(String(500), nullable=True)                             # relative or absolute URL
    description = Column(Text, nullable=True)
    details     = Column(Text, nullable=True)
    shipping    = Column(Text, nullable=True)
    sizes_json  = Column(Text, nullable=True)                                    # JSON list
    frames_json = Column(Text, nullable=True)                                    # JSON list or null
    in_stock    = Column(Boolean, default=True, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)