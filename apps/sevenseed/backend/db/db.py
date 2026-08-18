# -*- coding: utf-8 -*-
"""
Sevenseed Hub - Database Connection & Session Management.

Supports PostgreSQL via DATABASE_URL environment variable, with a fail-safe
local SQLite fallback for development.
"""
import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

HERE = Path(__file__).resolve().parent
DEFAULT_SQLITE_PATH = HERE.parent / "db.sqlite3"

# DATABASE_URL from environment or fallback to SQLite
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Use SQLite fallback
    DATABASE_URL = f"sqlite:///{DEFAULT_SQLITE_PATH}"

# Configure engine connect args (SQLite needs check_same_thread=False)
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database schema tables with auto-migration for legacy SQLite tables."""
    from db.models import User, Workspace, WorkspaceMember, Subscription, UserAPIKey, TokenUsageLog  # noqa: F401
    from sqlalchemy import inspect, text
    
    inspector = inspect(engine)
    
    # Check users table
    if inspector.has_table("users"):
        cols = [c["name"] for c in inspector.get_columns("users")]
        if "password_hash" not in cols or "full_name" not in cols:
            with engine.connect() as conn:
                try:
                    conn.execute(text("DROP TABLE IF EXISTS users"))
                    conn.commit()
                except Exception:
                    pass

    # Check subscriptions table
    if inspector.has_table("subscriptions"):
        cols = [c["name"] for c in inspector.get_columns("subscriptions")]
        if "workspace_id" not in cols:
            with engine.connect() as conn:
                try:
                    conn.execute(text("DROP TABLE IF EXISTS subscriptions"))
                    conn.commit()
                except Exception:
                    pass

    Base.metadata.create_all(bind=engine)
