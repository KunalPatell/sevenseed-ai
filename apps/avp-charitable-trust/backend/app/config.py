# -*- coding: utf-8 -*-
"""
AVP Charitable Trust — Configuration Settings.
"""
from __future__ import annotations
import os
from pathlib import Path

# Paths
HERE = Path(__file__).resolve().parent.parent
_static_candidates = [HERE / "static", HERE.parent / "frontend" / "out"]
STATIC_DIR = next((p for p in _static_candidates if p.exists()), _static_candidates[0])
DB_PATH = os.environ.get("DB_PATH", str(HERE / "db.sqlite3"))

# CORS origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]
