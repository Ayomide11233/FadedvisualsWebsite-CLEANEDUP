"""
app/models/user.py
==================
SQLAlchemy ORM model for the users table.
No business logic lives here — just column definitions.
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(254), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False) # this is for the admin user
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
