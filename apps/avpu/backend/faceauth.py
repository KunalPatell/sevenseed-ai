# -*- coding: utf-8 -*-
"""
Biometric face authentication — reused from the user's `local-face-recognition`
project (InsightFace buffalo_l, ArcFace embeddings, cosine match).

Lazy-loads InsightFace so the app runs fine without it (endpoints report
"not available" until `insightface`+`onnxruntime`+`opencv` are installed —
they are in requirements.txt, so it activates in the Docker build).

Register a user's face embedding, then verify a live capture against it
(quiz-integrity / fraud-prevention / applicant identity).
"""
from __future__ import annotations
import json
import sqlite3
import datetime

_model = None


def available() -> bool:
    try:
        import insightface  # noqa: F401
        import cv2  # noqa: F401
        import numpy  # noqa: F401
        return True
    except Exception:
        return False


def _get_model():
    global _model
    if _model is None:
        from insightface.app import FaceAnalysis
        m = FaceAnalysis(name="buffalo_l", allowed_modules=["detection", "recognition"])
        m.prepare(ctx_id=-1, det_size=(640, 640))  # ctx_id=-1 → CPU
        _model = m
    return _model


def _embed(image_bytes: bytes):
    """Return an L2-normalized ArcFace embedding for the largest face, or None."""
    import cv2
    import numpy as np
    arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return None
    faces = _get_model().get(img) or []
    if not faces:
        return None
    face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    emb = np.asarray(face.embedding, dtype=np.float32)
    n = np.linalg.norm(emb)
    return emb / n if n else emb


def _conn(db_path: str):
    c = sqlite3.connect(db_path)
    c.execute("CREATE TABLE IF NOT EXISTS face_ids (email TEXT PRIMARY KEY, embedding TEXT, created_at TEXT)")
    return c


def register(db_path: str, email: str, image_bytes: bytes) -> dict:
    if not available():
        return {"registered": False, "error": "Face auth not available on this server."}
    emb = _embed(image_bytes)
    if emb is None:
        return {"registered": False, "error": "No face detected — please use a clear, front-facing photo."}
    c = _conn(db_path)
    c.execute("INSERT OR REPLACE INTO face_ids (email, embedding, created_at) VALUES (?,?,?)",
              (email, json.dumps(emb.tolist()), datetime.datetime.utcnow().isoformat()))
    c.commit(); c.close()
    return {"registered": True, "email": email}


def verify(db_path: str, email: str, image_bytes: bytes, threshold: float = 0.40) -> dict:
    if not available():
        return {"match": False, "error": "Face auth not available on this server."}
    import numpy as np
    emb = _embed(image_bytes)
    if emb is None:
        return {"match": False, "error": "No face detected."}
    c = _conn(db_path)
    row = c.execute("SELECT embedding FROM face_ids WHERE email=?", (email,)).fetchone()
    c.close()
    if not row:
        return {"match": False, "error": "No registered face for this user."}
    stored = np.asarray(json.loads(row[0]), dtype=np.float32)
    sim = float(np.dot(emb, stored))
    return {"match": sim >= threshold, "similarity": round(sim, 3), "threshold": threshold}
