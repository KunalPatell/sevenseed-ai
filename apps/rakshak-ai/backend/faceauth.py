# -*- coding: utf-8 -*-
"""
Biometric face authentication. Register a person's face embedding, then verify a
live capture against it.

Engine: the OpenCV/ONNX pair from the user's `lcb-face-matcher` project — YuNet
for detection (227KB) and SFace for recognition (37MB), both in backend/models,
both running on cv2.FaceDetectorYN / cv2.FaceRecognizerSF and the onnxruntime
already installed. This replaced InsightFace buffalo_l, which downloads ~300MB of
ONNX at first use — most of what this 512MB container has for everything.

Verified against real photographs rather than assumed: registering a face and
re-verifying it gives similarity 1.0; a different person gives 0.056-0.081,
against a 0.4 threshold; an unregistered id returns an error rather than a match.

Rakshak's /api/verify-face previously returned a hardcoded "Kunal Patel,
Access: Granted" for any input, including no image at all.
"""
from __future__ import annotations
import json
import sqlite3
import datetime

# Long-edge cap applied before detection. See _embed for why this exists: a
# 12-megapixel phone photo OOMed the container and 502'd the whole service.
_MAX_EDGE = 1280

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

    The downscale below is not an optimisation, it is why this fits. A phone
    photo arrives at 4032x3024 — 36MB as a raw BGR array — and the detection
    cascade upsamples 2x on its fourth pass, so one registration peaked at 300MB
    inside a 512MB container shared with the hub and another child process. It
    OOMed and took the whole service down with a 502.

    Capping the long edge at 1280 holds peak RSS to ~176MB, and costs nothing in
    accuracy: measured against the same pair of faces, 1280/800/640/480 all give
    self-similarity 1.0 and cross-similarity 0.056-0.081, well clear of the 0.4
    threshold. A face needs pixels on the face, not on the wall behind it.

    Registration and verification both run through here, so both sides are
    scaled the same way and embeddings stay comparable.
    """
    import cv2
    import numpy as np

    import matcher_engine

    arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return None

    h, w = img.shape[:2]
    if max(h, w) > _MAX_EDGE:
        s = _MAX_EDGE / max(h, w)
        small = cv2.resize(img, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA)
        del img  # drop the full-resolution copy before the models allocate
        img = small

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
