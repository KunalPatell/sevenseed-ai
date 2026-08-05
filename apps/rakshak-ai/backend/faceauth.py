# -*- coding: utf-8 -*-
"""
Biometric face authentication — reused from the user's `local-face-recognition`
project (InsightFace buffalo_l, ArcFace embeddings, cosine match).

Lazy-loads InsightFace so the app runs fine without it (endpoints report
"not available" until `insightface`+`onnxruntime`+`opencv` are installed —
they are in requirements.txt, so it activates in the Docker build).

Register a person's face embedding, then verify a live capture against it.

Copied from apps/avpu/backend/faceauth.py, which is the same code already running
in this container for avpu and avp-charitable-trust — so the model pack, the
memory profile and the CPU settings are known to work on the 512MB free tier.
Rakshak's /api/verify-face previously returned a hardcoded "Kunal Patel,
Access: Granted" for any input, including no image at all.
"""
from __future__ import annotations
import json
import sqlite3
import datetime

_model = None


def available() -> bool:
    """True when the ONNX face models can actually be loaded."""
    try:
        import cv2  # noqa: F401
        import numpy  # noqa: F401
        import matcher_engine  # noqa: F401

        # The classes below arrived in OpenCV 4.5.4; headless builds have them.
        return hasattr(cv2, "FaceDetectorYN") and hasattr(cv2, "FaceRecognizerSF")
    except Exception:
        return False


def _embed(image_bytes: bytes):
    """Return an L2-normalized 128-d SFace embedding for the largest face, or None.

    Switched from InsightFace buffalo_l to the OpenCV/ONNX pair shipped in
    backend/models — YuNet for detection (227KB) and SFace for recognition
    (37MB). buffalo_l downloads roughly 300MB of ONNX at first use, which is most
    of what this 512MB container has for everything; these two are on disk and
    run on the onnxruntime that is already installed.

    matcher_engine.extract_primary_face does the work: it retries with contrast
    enhancement, sharpening, upsampling and rotation before giving up, which
    matters for phone photos.
    """
    import cv2
    import numpy as np

    import matcher_engine

    arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return None
    try:
        emb, _box = matcher_engine.extract_primary_face(img)
    except ValueError:
        return None  # no detectable face
    emb = np.asarray(emb, dtype=np.float32)
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
