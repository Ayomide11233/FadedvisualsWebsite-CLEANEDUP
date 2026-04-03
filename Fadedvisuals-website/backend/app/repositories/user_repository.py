"""
app/repositories/user_repository.py
=====================================
All database queries for the User model live here.
Routes and services never import SQLAlchemy directly.
"""

from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self._db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        # Case-insensitive lookup, parameterised query (no SQL injection risk)
        return (
            self._db.query(User)
            .filter(User.email == email.lower())
            .first()
        )

    def get_by_username(self, username: str) -> Optional[User]:
        return (
            self._db.query(User)
            .filter(User.username == username)
            .first()
        )

    def create(self, *, username: str, email: str, hashed_password: str) -> User:
        user = User(
            username=username,
            email=email.lower(),
            hashed_password=hashed_password,
        )
        self._db.add(user)
        self._db.commit()
        self._db.refresh(user)
        return user
    def set_admin(self, user: User, is_admin: bool) -> User:
        user.is_admin = is_admin
        self._db.commit()
        self._db.refresh(user)
        return user