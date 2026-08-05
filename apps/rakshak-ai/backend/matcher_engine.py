"""
matcher_engine.py – LCB Face Matcher Core Engine (OpenCV YuNet + SFace ONNX)
==========================================================================
Uses OpenCV's native FaceDetectorYN (YuNet) and FaceRecognizerSF (SFace) ONNX runtimes.
This completely eliminates dependencies on compiler-heavy libraries like InsightFace,
allowing the app to install instantly and run natively on any platform/Python version.

Detection improvements (v2):
  • EXIF orientation correction for phone/browser uploads
  • Lower score thresholds (primary 0.45, fallback 0.15, rotation 0.35)
  • Multi-pass CLAHE + gamma correction for dark/overexposed frames
  • Unsharp-mask sharpening before detection (helps blurry webcam frames)
  • Minimum face-size filter to discard micro-face noise
  • YuNet setInputSize() called explicitly before every detect() call
  • _filter_upright() now integrated into detection cascade
"""
from __future__ import annotations

import csv
import io
import json
import os
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import requests


class _MissingDep:
    """Stands in for a dependency that is not installed here.

    faiss and pandas are used only by the bulk index/search half of this module
    (build_index, _load_raw_index, search_face, analyze_scene, get_audit_log).
    Rakshak uses the 1:1 path — extract_primary_face + compare_faces — which
    needs neither, and faiss is heavy against a 512MB container.

    Importing them at module scope would make the whole engine unimportable, so
    they are replaced by this: anything touching faiss or pd gets a clear message
    instead of a NameError, and the 1:1 path is unaffected.
    """

    def __init__(self, name):
        self._name = name

    def _fail(self, *_a, **_k):
        raise RuntimeError(
            f"{self._name} is not installed in this deployment. It is only needed for "
            "index search; the 1:1 verify path (extract_primary_face + compare_faces) "
            "works without it."
        )

    def __getattr__(self, _n):
        return self._fail()

    def __call__(self, *_a, **_k):
        return self._fail()


try:
    import faiss
except ImportError:
    faiss = _MissingDep("faiss")

try:
    import pandas as pd
except ImportError:
    pd = _MissingDep("pandas")

try:
    from PIL import Image as _PILImage
    from PIL.ExifTags import TAGS as _EXIF_TAGS
    _PIL_AVAILABLE = True
except ImportError:
    _PIL_AVAILABLE = False

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR       = Path(__file__).resolve().parent
KNOWN_FACES_DIR = BASE_DIR / "known_faces"
INDEX_DIR       = BASE_DIR / "index"
AUDIT_LOG_FILE  = BASE_DIR / "audit_log.csv"
MODELS_DIR     = BASE_DIR / "models"

YUNET_PATH     = MODELS_DIR / "face_detection_yunet_2023mar.onnx"
SFACE_PATH     = MODELS_DIR / "face_recognition_sface_2021dec.onnx"

YUNET_URL      = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
SFACE_URL      = "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"

EMBEDDING_DIM  = 128  # SFace features are 128-dimensional vectors
MODEL_EXPECTED_SIZES = {
    YUNET_PATH: 232589,
    SFACE_PATH: 38696353,
}
FACE_BACKEND = os.environ.get("FACE_BACKEND", "auto").strip().lower()
ACTIVE_BACKEND: str | None = None

# ── ONNX Model Downloader ────────────────────────────────────────────────────
def download_model_weights(url: str, dest: Path) -> None:
    expected_size = MODEL_EXPECTED_SIZES.get(dest)
    if dest.exists() and expected_size and dest.stat().st_size == expected_size:
        return
    if dest.exists() and not expected_size and dest.stat().st_size > 10000:
        return
    if dest.exists():
        print(
            f"[download] Replacing invalid {dest.name} "
            f"({dest.stat().st_size} bytes)."
        )
        dest.unlink()

    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"[download] Fetching {dest.name} from CDN ...")
    response = requests.get(url, stream=True, timeout=120)
    response.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

    if expected_size and dest.stat().st_size != expected_size:
        actual_size = dest.stat().st_size
        dest.unlink(missing_ok=True)
        raise RuntimeError(
            f"Downloaded {dest.name} has invalid size "
            f"{actual_size} bytes; expected {expected_size} bytes."
        )
    print(f"[download] Completed {dest.name}")


def ensure_models() -> None:
    download_model_weights(YUNET_URL, YUNET_PATH)
    download_model_weights(SFACE_URL, SFACE_PATH)


# ── Global OpenCV Model Cache ────────────────────────────────────────────────
_detector: cv2.FaceDetectorYN | None = None
_recognizer: cv2.FaceRecognizerSF | None = None
_buffalo_app: Any | None = None

def get_models() -> tuple[cv2.FaceDetectorYN, cv2.FaceRecognizerSF]:
    global _detector, _recognizer
    if _detector is None or _recognizer is None:
        ensure_models()
        # IMPORTANT: Initialize with score_threshold=0.1 (very permissive).
        # This ensures setScoreThreshold() calls in the detection cascade
        # actually work across all OpenCV versions (some versions only respect
        # the threshold set at creation time, not via setter).
        # We post-filter by score in our own cascade logic.
        _detector = cv2.FaceDetectorYN.create(
            str(YUNET_PATH), "", (320, 320),
            score_threshold=0.1, nms_threshold=0.3, top_k=5000,
        )
        _recognizer = cv2.FaceRecognizerSF.create(str(SFACE_PATH), "")
    return _detector, _recognizer


# Detection bounds: small webcams must be upscaled, huge phone photos
# (8 MP+) must be downscaled or YuNet runs slow / out-of-memory.
_MIN_DETECTOR_SHORT_EDGE = 320   # lowered from 480: aggressively upscale tiny webcam feeds
_MAX_DETECTOR_LONG_EDGE  = 1600

# Multi-pass score thresholds (lowered for better webcam & blurry image coverage).
# Order: primary → CLAHE fallback → sharpened → rotation retry.
_DETECT_SCORE_PRIMARY  = 0.4   # was 0.5 — catches compressed webcam faces
_DETECT_SCORE_FALLBACK = 0.15  # was 0.2 — catches dark/blurry frames
_DETECT_SCORE_SHARP    = 0.3   # new: sharpening pass threshold
_DETECT_SCORE_ROTATION = 0.35  # was 0.4 — catches sideways phone photos

# Minimum face dimension (pixels in detection space) to filter micro-faces.
_MIN_FACE_PIXELS = 40


def _ensure_bgr(img: np.ndarray) -> np.ndarray:
    """Accept RGB, RGBA, BGR, or grayscale numpy input; return BGR."""
    if img is None:
        raise ValueError("Image is None.")
    if img.ndim == 2:
        return cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if img.ndim == 3 and img.shape[2] == 4:
        return cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    if img.ndim == 3 and img.shape[2] == 3:
        # Gradio delivers RGB; convert to BGR for OpenCV models
        return cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    raise ValueError(f"Unsupported image shape {img.shape}")


def _fix_exif_orientation(img_bgr: np.ndarray, raw_bytes: bytes | None = None) -> np.ndarray:
    """
    Correct EXIF-based rotation in images uploaded from phones/browsers.
    The browser may display the image correctly but the raw JPEG pixels are
    rotated — OpenCV reads raw pixels, so YuNet sees a rotated face.

    Works either from raw bytes (for file uploads) or by trying PIL on the
    already-decoded numpy array (less reliable but a best-effort fallback).
    Returns a correctly oriented BGR image.
    """
    if not _PIL_AVAILABLE:
        return img_bgr

    try:
        if raw_bytes is not None:
            pil_img = _PILImage.open(io.BytesIO(raw_bytes))
        else:
            # Re-encode the numpy array to JPEG bytes so PIL can read EXIF
            ok, buf = cv2.imencode(".jpg", img_bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])
            if not ok:
                return img_bgr
            pil_img = _PILImage.open(io.BytesIO(buf.tobytes()))

        exif = pil_img._getexif() if hasattr(pil_img, "_getexif") else None
        if exif is None:
            return img_bgr

        orientation_tag = next(
            (k for k, v in _EXIF_TAGS.items() if v == "Orientation"), None
        )
        if orientation_tag is None:
            return img_bgr

        orientation = exif.get(orientation_tag, 1)
        # Map EXIF orientation to cv2 rotation
        # 1 = normal, 3 = 180°, 6 = 90° CW, 8 = 90° CCW
        rotate_map = {
            3: cv2.ROTATE_180,
            6: cv2.ROTATE_90_CLOCKWISE,
            8: cv2.ROTATE_90_COUNTERCLOCKWISE,
        }
        if orientation in rotate_map:
            rotated = cv2.rotate(img_bgr, rotate_map[orientation])
            print(f"[exif] Applied EXIF orientation {orientation} correction")
            return rotated
    except Exception as e:
        print(f"[exif] Could not apply EXIF correction: {e}")

    return img_bgr


def _prepare_for_detection(img_bgr: np.ndarray) -> tuple[np.ndarray, float]:
    """
    Resize so YuNet sees enough but not too much: downscale huge phone
    photos, upscale tiny webcams. Returns (resized_bgr, scale) — multiply box 
    coords by 1/scale to map back to the original.
    """
    h, w = img_bgr.shape[:2]
    short = min(h, w)
    long_ = max(h, w)
    if long_ > _MAX_DETECTOR_LONG_EDGE:
        scale = _MAX_DETECTOR_LONG_EDGE / float(long_)
    elif short < _MIN_DETECTOR_SHORT_EDGE:
        scale = _MIN_DETECTOR_SHORT_EDGE / float(short)
    else:
        return img_bgr, 1.0
        
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))
    interp = cv2.INTER_AREA if scale < 1 else cv2.INTER_LINEAR
    resized = cv2.resize(img_bgr, (new_w, new_h), interpolation=interp)
    return resized, scale


def _enhance_for_detection(img_bgr: np.ndarray) -> np.ndarray:
    """
    Apply CLAHE on the L-channel (LAB space) to even out low-light /
    high-contrast photos. Helps YuNet on phone-camera / CCTV-still inputs.
    """
    try:
        lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        l_eq = clahe.apply(l)
        return cv2.cvtColor(cv2.merge((l_eq, a, b)), cv2.COLOR_LAB2BGR)
    except Exception:
        return img_bgr


def _sharpen_for_detection(img_bgr: np.ndarray) -> np.ndarray:
    """
    Apply an unsharp mask to compensate for webcam blur / JPEG compression
    artifacts. This dramatically improves YuNet's landmark detection score
    on soft or compressed images by recovering high-frequency edge detail.
    """
    try:
        # Gaussian blur then weighted-add back (unsharp mask)
        blurred = cv2.GaussianBlur(img_bgr, (0, 0), sigmaX=2.0)
        sharpened = cv2.addWeighted(img_bgr, 1.5, blurred, -0.5, 0)
        return np.clip(sharpened, 0, 255).astype(np.uint8)
    except Exception:
        return img_bgr


def _filter_by_size(faces: np.ndarray | None) -> np.ndarray | None:
    """
    Discard detections where the face bounding box is smaller than
    _MIN_FACE_PIXELS in either dimension. Removes reflections, logos,
    and tiny background faces that would otherwise win as "primary" face.
    """
    if faces is None or len(faces) == 0:
        return None
    large_enough = [
        f for f in faces
        if float(f[2]) >= _MIN_FACE_PIXELS and float(f[3]) >= _MIN_FACE_PIXELS
    ]
    if not large_enough:
        return None
    return np.asarray(large_enough, dtype=np.float32)


def get_buffalo_model() -> Any:
    """Load InsightFace buffalo_l lazily when the optional backend is installed."""
    global _buffalo_app
    if _buffalo_app is None:
        try:
            from insightface.app import FaceAnalysis
        except ImportError as exc:
            raise RuntimeError(
                "InsightFace buffalo_l backend is not installed. "
                "Install optional packages with: pip install insightface onnxruntime"
            ) from exc

        try:
            _buffalo_app = FaceAnalysis(
                name="buffalo_l",
                providers=["CPUExecutionProvider"],
            )
            _buffalo_app.prepare(ctx_id=-1, det_size=(640, 640))
        except Exception as exc:
            _buffalo_app = None
            raise RuntimeError(f"Could not load InsightFace buffalo_l: {exc}") from exc

    return _buffalo_app


# ─────────────────────────────────────────────────────────────────────────────
# Data model
# ─────────────────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class FaceBox:
    x: int
    y: int
    w: int
    h: int
    confidence: float = 1.0


@dataclass(frozen=True)
class MatchResult:
    record_id: str
    name: str
    category: str
    age: str
    gender: str
    last_seen: str
    notes: str
    image_path: str
    similarity: float
    distance: float
    box: FaceBox | None = None
    confidence_label: str = ""
    confidence_color: str = ""
    fir_no: str = ""
    police_station: str = ""
    ipc_sections: str = ""
    status: str = "Under Investigation"


@dataclass
class SceneFace:
    """Represents one detected face in a multi-face CCTV scene."""
    face_index: int
    box: FaceBox
    embedding: np.ndarray
    matches: list[MatchResult] = field(default_factory=list)


# ─────────────────────────────────────────────────────────────────────────────
# Audit Logging
# ─────────────────────────────────────────────────────────────────────────────

_AUDIT_FIELDS = ["timestamp", "action", "record_id", "name", "similarity_pct", "model", "notes"]


def _write_audit(action: str, record_id: str = "", name: str = "",
                 similarity_pct: float = 0.0, model: str = "OpenCV-SFace",
                 notes: str = "") -> None:
    write_header = not AUDIT_LOG_FILE.exists()
    with AUDIT_LOG_FILE.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=_AUDIT_FIELDS)
        if write_header:
            writer.writeheader()
        writer.writerow({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "action": action,
            "record_id": record_id,
            "name": name,
            "similarity_pct": f"{similarity_pct:.2f}",
            "model": model,
            "notes": notes,
        })


def get_audit_log() -> pd.DataFrame:
    if not AUDIT_LOG_FILE.exists():
        return pd.DataFrame(columns=_AUDIT_FIELDS)
    return pd.read_csv(AUDIT_LOG_FILE)


# ─────────────────────────────────────────────────────────────────────────────
# Metadata helpers
# ─────────────────────────────────────────────────────────────────────────────

_META_DEFAULTS: dict[str, Any] = {
    "record_id": "",
    "name": "",
    "category": "Known Person",
    "age": "Unknown",
    "gender": "Unknown",
    "last_seen": "Unknown",
    "notes": "No notes available.",
    "fir_no": "",
    "police_station": "",
    "ipc_sections": "",
    "status": "Under Investigation",
}


def _read_metadata(image_path: Path) -> dict[str, Any]:
    meta_path = image_path.with_suffix(".json")
    data: dict[str, Any] = {}
    if meta_path.exists():
        try:
            with meta_path.open("r", encoding="utf-8") as fh:
                data = json.load(fh)
        except Exception:
            pass

    stem = image_path.stem
    if "_" in stem:
        parts = stem.split("_", 1)
        record_id = parts[0].upper()
        name = parts[1].replace("_", " ").title()
    else:
        record_id = stem.upper()
        name = stem.replace("_", " ").title()

    merged = dict(_META_DEFAULTS)
    merged["record_id"] = record_id
    merged["name"] = name
    for k, v in data.items():
        if v is not None and str(v).strip():
            merged[k] = v
    return merged


def _image_files(folder: Path) -> list[Path]:
    exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    return sorted(p for p in folder.iterdir() if p.suffix.lower() in exts)


# ─────────────────────────────────────────────────────────────────────────────
# Embedding extraction (OpenCV FaceDetectorYN + FaceRecognizerSF)
# ─────────────────────────────────────────────────────────────────────────────

def _normalize(v: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(v)
    return v / norm if norm > 0 else v


def _safe_str(value: Any, default: str = "") -> str:
    """Convert a value to string, treating pandas NaN / None / empty as default."""
    if value is None:
        return default
    try:
        if pd.isna(value):
            return default
    except (TypeError, ValueError):
        pass
    s = str(value).strip()
    if s.lower() == "nan" or not s:
        return default
    return s


def _landmarks_look_upright(face: np.ndarray) -> bool:
    """
    Sanity check that YuNet's detected face actually points up: the average
    eye y-coordinate must be ABOVE (smaller in image coords) the average
    mouth-corner y-coordinate. This rejects garbage detections on upside-down
    or sideways photos so the rotation-retry path can take over.

    YuNet face vector layout (indices into the 15-element face array):
      [0..3]  bbox xywh
      [4..5]  right eye x,y
      [6..7]  left  eye x,y
      [8..9]  nose tip x,y
      [10..11] right mouth corner x,y
      [12..13] left  mouth corner x,y
      [14]    score
    """
    eye_y   = (float(face[5])  + float(face[7]))  * 0.5
    mouth_y = (float(face[11]) + float(face[13])) * 0.5
    return eye_y < mouth_y


def _filter_upright(faces) -> np.ndarray | None:
    """Keep only faces whose landmarks look upright; return None if empty."""
    if faces is None or len(faces) == 0:
        return None
    upright = [f for f in faces if _landmarks_look_upright(f)]
    if not upright:
        return None
    return np.asarray(upright, dtype=np.float32)


def _untranslate_box_from_rotation(
    x_d: float, y_d: float, w_d: float, h_d: float,
    detect_w: int, detect_h: int, rotation_code: int | None,
) -> tuple[float, float, float, float]:
    """
    Translate a box from rotated-detection-space back to the original
    (pre-rotation) detect-image coordinates. `rotation_code` is the
    cv2.ROTATE_* code that was applied to obtain the rotated frame.
    """
    if rotation_code is None:
        return x_d, y_d, w_d, h_d
    if rotation_code == cv2.ROTATE_90_CLOCKWISE:
        return y_d, detect_w - 1 - x_d - w_d, h_d, w_d
    if rotation_code == cv2.ROTATE_180:
        return detect_w - 1 - x_d - w_d, detect_h - 1 - y_d - h_d, w_d, h_d
    if rotation_code == cv2.ROTATE_90_COUNTERCLOCKWISE:
        return detect_h - 1 - y_d - h_d, x_d, h_d, w_d
    return x_d, y_d, w_d, h_d


def extract_faces_opencv(img_bgr: np.ndarray) -> list[tuple[np.ndarray, FaceBox]]:
    """Return list of (normalized_128d_embedding, FaceBox) for every face.

    Detection cascade (escalating cost, descending quality bar):
      Pass 1 — primary score >= 0.40 on normalized image.
      Pass 2 — CLAHE enhancement + score >= 0.20 (dark/overexposed images).
      Pass 3 — Unsharp-mask sharpening + score >= 0.20 (blurry webcam).
      Pass 4 — 2x upsample + sharpen + score >= 0.15 (tiny/far-away faces).
      Pass 5 — Rotation retries 90/180/270 + score >= 0.20 (sideways photos).

    YuNet is initialized with threshold=0.1 so all setScoreThreshold() calls
    work correctly across all OpenCV versions. Post-pass filtering by score
    is done by _run_detect_pass().
    """
    detector, recognizer = get_models()

    # ── Pre-step: EXIF orientation fix ────────────────────────────────────
    img_bgr = _fix_exif_orientation(img_bgr)

    detect_img, scale = _prepare_for_detection(img_bgr)
    dh, dw = detect_img.shape[:2]

    used_img = detect_img
    rotation_code: int | None = None
    faces: np.ndarray | None = None

    def _run_detect_pass(
        frame: np.ndarray, min_score: float, upright_only: bool = True
    ) -> np.ndarray | None:
        """
        Run YuNet on `frame`. Return filtered face array or None.
        Explicitly sets input size and threshold before every call to
        ensure correctness across all OpenCV versions.
        min_score: minimum detection confidence score to keep.
        """
        fh, fw = frame.shape[:2]
        try:
            detector.setInputSize((fw, fh))
            detector.setScoreThreshold(min_score)
        except Exception:
            pass  # some OpenCV versions raise on setters

        try:
            _retval, raw = detector.detect(frame)
        except Exception as exc:
            print(f"[detector] detect() error: {exc}")
            return None

        if raw is None or len(raw) == 0:
            return None

        # Filter by score (in case setScoreThreshold was ignored)
        scored = np.asarray(
            [f for f in raw if float(f[14]) >= min_score], dtype=np.float32
        )
        if len(scored) == 0:
            return None

        # Filter out micro-faces (< _MIN_FACE_PIXELS in width or height)
        sized = np.asarray(
            [f for f in scored
             if float(f[2]) >= _MIN_FACE_PIXELS and float(f[3]) >= _MIN_FACE_PIXELS],
            dtype=np.float32,
        )
        if len(sized) == 0:
            return None

        if upright_only:
            upright = _filter_upright(sized)
            return upright

        return sized

    # ── Pass 1: primary threshold ──────────────────────────────────────────
    faces = _run_detect_pass(detect_img, _DETECT_SCORE_PRIMARY)
    
    # If we found a high-confidence upright face (score >= 0.90), we can skip rotation retries!
    if faces is not None:
        max_score = max(float(f[14]) for f in faces)
        if max_score >= 0.90:
            pass
        else:
            print(f"[detector] Pass 1 found face with score {max_score:.2f} < 0.90 — checking rotations...")
            best_score = max_score
            best_code = None
            best_faces = faces
            
            for code in (cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180,
                         cv2.ROTATE_90_COUNTERCLOCKWISE):
                rot = cv2.rotate(detect_img, code)
                rot_faces = _run_detect_pass(rot, _DETECT_SCORE_ROTATION)
                if rot_faces is not None:
                    rot_max = max(float(f[14]) for f in rot_faces)
                    if rot_max > best_score:
                        best_score = rot_max
                        best_code = code
                        best_faces = rot_faces
            
            if best_code is not None:
                faces = best_faces
                used_img = cv2.rotate(detect_img, best_code)
                rotation_code = best_code
                print(f"[detector] Selected better rotation ({best_code}) with score {best_score:.2f} (vs {max_score:.2f})")

    # ── Pass 2: CLAHE enhancement ──────────────────────────────────────────
    if faces is None:
        print("[detector] Pass 1 missed — trying CLAHE...")
        enhanced = _enhance_for_detection(detect_img)
        faces = _run_detect_pass(enhanced, _DETECT_SCORE_FALLBACK)
        if faces is not None:
            used_img = enhanced
            
            # Check if rotation on CLAHE is better
            max_score = max(float(f[14]) for f in faces)
            if max_score < 0.90:
                best_score = max_score
                best_code = None
                best_faces = faces
                for code in (cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180, cv2.ROTATE_90_COUNTERCLOCKWISE):
                    rot = cv2.rotate(enhanced, code)
                    rot_faces = _run_detect_pass(rot, _DETECT_SCORE_ROTATION)
                    if rot_faces is not None:
                        rot_max = max(float(f[14]) for f in rot_faces)
                        if rot_max > best_score:
                            best_score = rot_max
                            best_code = code
                            best_faces = rot_faces
                if best_code is not None:
                    faces = best_faces
                    used_img = cv2.rotate(enhanced, best_code)
                    rotation_code = best_code
                    print(f"[detector] CLAHE: Selected better rotation ({best_code}) with score {best_score:.2f}")

    # ── Pass 3: Unsharp-mask sharpening ───────────────────────────────────
    if faces is None:
        print("[detector] Pass 2 missed — trying sharpening...")
        sharpened = _sharpen_for_detection(detect_img)
        faces = _run_detect_pass(sharpened, _DETECT_SCORE_FALLBACK)
        if faces is not None:
            used_img = sharpened
            print("[detector] Pass 3 (sharpen) succeeded!")
            
            # Check if rotation on sharpened is better
            max_score = max(float(f[14]) for f in faces)
            if max_score < 0.90:
                best_score = max_score
                best_code = None
                best_faces = faces
                for code in (cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180, cv2.ROTATE_90_COUNTERCLOCKWISE):
                    rot = cv2.rotate(sharpened, code)
                    rot_faces = _run_detect_pass(rot, _DETECT_SCORE_ROTATION)
                    if rot_faces is not None:
                        rot_max = max(float(f[14]) for f in rot_faces)
                        if rot_max > best_score:
                            best_score = rot_max
                            best_code = code
                            best_faces = rot_faces
                if best_code is not None:
                    faces = best_faces
                    used_img = cv2.rotate(sharpened, best_code)
                    rotation_code = best_code
                    print(f"[detector] Sharpen: Selected better rotation ({best_code}) with score {best_score:.2f}")

    # ── Pass 4: 2x upsample + sharpen ─────────────────────────────────────
    if faces is None and min(dh, dw) < 640:
        print(f"[detector] Pass 3 missed — trying 2x upsample (short={min(dh,dw)})...")
        up_img = cv2.resize(detect_img, (dw * 2, dh * 2),
                            interpolation=cv2.INTER_LINEAR)
        up_img = _sharpen_for_detection(up_img)
        faces = _run_detect_pass(up_img, _DETECT_SCORE_FALLBACK)
        if faces is not None:
            used_img = up_img
            scale = scale * 2.0
            print("[detector] Pass 4 (2x upsample) succeeded!")
            
            # Check if rotation on upsampled is better
            max_score = max(float(f[14]) for f in faces)
            if max_score < 0.90:
                best_score = max_score
                best_code = None
                best_faces = faces
                for code in (cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180, cv2.ROTATE_90_COUNTERCLOCKWISE):
                    rot = cv2.rotate(up_img, code)
                    rot_faces = _run_detect_pass(rot, _DETECT_SCORE_ROTATION)
                    if rot_faces is not None:
                        rot_max = max(float(f[14]) for f in rot_faces)
                        if rot_max > best_score:
                            best_score = rot_max
                            best_code = code
                            best_faces = rot_faces
                if best_code is not None:
                    faces = best_faces
                    used_img = cv2.rotate(up_img, best_code)
                    rotation_code = best_code
                    print(f"[detector] Upsample: Selected better rotation ({best_code}) with score {best_score:.2f}")

    # ── Pass 5: Rotation retries ───────────────────────────────────────────
    if faces is None:
        print("[detector] Pass 4 missed — trying rotations...")
        for code in (cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180,
                     cv2.ROTATE_90_COUNTERCLOCKWISE):
            rot = cv2.rotate(detect_img, code)
            rot_faces = _run_detect_pass(rot, _DETECT_SCORE_ROTATION)
            if rot_faces is not None:
                faces = rot_faces
                used_img = rot
                rotation_code = code
                print(f"[detector] Pass 5 (rotation={code}) succeeded!")
                break

    # ── Pass 6: Last-resort nuclear pass ──────────────────────────────────
    if faces is None:
        print("[detector] Pass 5 missed — trying last-resort nuclear pass...")
        enhanced_nuclear = _enhance_for_detection(detect_img)
        enhanced_nuclear = _sharpen_for_detection(enhanced_nuclear)
        faces = _run_detect_pass(enhanced_nuclear, 0.10, upright_only=False)
        if faces is not None:
            used_img = enhanced_nuclear
            print("[detector] Pass 6 (nuclear) succeeded!")

    if faces is None or len(faces) == 0:
        print("[detector] All passes exhausted — no face found.")
        return []

    inv_scale = 1.0 / scale
    rh, rw = used_img.shape[:2]
    results: list[tuple[np.ndarray, FaceBox]] = []

    for face in faces:
        try:
            aligned = recognizer.alignCrop(used_img, face)
            feature = recognizer.feature(aligned)
            emb = _normalize(feature.flatten().astype("float32"))
        except Exception as exc:
            print(f"[detector] alignCrop/feature failed: {exc}")
            continue

        # Translate box back to original (un-rotated, un-scaled) coordinates
        x_d, y_d, w_d, h_d = _untranslate_box_from_rotation(
            float(face[0]), float(face[1]), float(face[2]), float(face[3]),
            rw, rh, rotation_code,
        )
        box = FaceBox(
            x=max(0, int(round(x_d * inv_scale))),
            y=max(0, int(round(y_d * inv_scale))),
            w=max(1, int(round(w_d * inv_scale))),
            h=max(1, int(round(h_d * inv_scale))),
            confidence=float(face[14]),
        )
        results.append((emb, box))

    return results


def extract_faces_buffalo_l(img_bgr: np.ndarray) -> list[tuple[np.ndarray, FaceBox]]:
    """Return normalized buffalo_l embeddings for every detected face."""
    app = get_buffalo_model()
    faces = app.get(img_bgr)
    results: list[tuple[np.ndarray, FaceBox]] = []

    for face in faces:
        x1, y1, x2, y2 = [int(v) for v in face.bbox]
        x1 = max(0, x1)
        y1 = max(0, y1)
        w = max(1, x2 - x1)
        h = max(1, y2 - y1)
        conf = float(getattr(face, "det_score", 1.0))

        embedding = getattr(face, "normed_embedding", None)
        if embedding is None:
            embedding = _normalize(np.asarray(face.embedding, dtype="float32"))
        else:
            embedding = np.asarray(embedding, dtype="float32")

        results.append((embedding, FaceBox(x=x1, y=y1, w=w, h=h, confidence=conf)))

    return results


def get_active_backend() -> str:
    global ACTIVE_BACKEND
    if ACTIVE_BACKEND is not None:
        return ACTIVE_BACKEND

    backend_cfg = os.environ.get("FACE_BACKEND", "auto").strip().lower()
    if backend_cfg in {"opencv", "sface", "yunet"}:
        ACTIVE_BACKEND = "OpenCV-SFace"
    elif backend_cfg in {"buffalo_l", "buffalo", "insightface"}:
        ACTIVE_BACKEND = "InsightFace-buffalo_l"
    else:
        # "auto" mode: try to load OpenCV, otherwise check if InsightFace is installed
        try:
            get_models()  # This will download and create OpenCV models
            ACTIVE_BACKEND = "OpenCV-SFace"
        except Exception as e:
            print(f"[backend] OpenCV initialization failed: {e}")
            try:
                get_buffalo_model()
                ACTIVE_BACKEND = "InsightFace-buffalo_l"
            except Exception as e2:
                print(f"[backend] InsightFace initialization failed: {e2}")
                ACTIVE_BACKEND = "OpenCV-SFace"
    return ACTIVE_BACKEND


def extract_faces(img_bgr: np.ndarray) -> list[tuple[np.ndarray, FaceBox]]:
    """Extract faces with configured backend, falling back to buffalo_l in auto mode."""
    backend = get_active_backend()
    if backend == "InsightFace-buffalo_l":
        return extract_faces_buffalo_l(img_bgr)
    return extract_faces_opencv(img_bgr)


def extract_faces_insightface(img_bgr: np.ndarray) -> list[tuple[np.ndarray, FaceBox]]:
    """Backward-compatible wrapper for older call sites."""
    return extract_faces(img_bgr)


def extract_primary_face(img_bgr: np.ndarray) -> tuple[np.ndarray, FaceBox]:
    """Extract the primary (largest) face. Raises ValueError if none found."""
    faces = extract_faces(img_bgr)
    if not faces:
        raise ValueError("No face detected in the image.")
    # Pick the face with the largest area as primary
    faces_sorted = sorted(faces, key=lambda t: t[1].w * t[1].h, reverse=True)
    return faces_sorted[0]


def compare_faces(
    img_a_rgb: np.ndarray,
    img_b_rgb: np.ndarray,
) -> tuple[float, FaceBox, FaceBox, float]:
    """
    1:1 face comparison. Returns (similarity_0_to_1, box_a, box_b, elapsed_ms).
    Raises ValueError if either image has no detectable face.
    """
    t0 = time.time()
    bgr_a = _ensure_bgr(img_a_rgb)
    bgr_b = _ensure_bgr(img_b_rgb)
    try:
        emb_a, box_a = extract_primary_face(bgr_a)
    except ValueError:
        raise ValueError("No face detected in Photo A. Use a clearer, front-facing photo.")
    try:
        emb_b, box_b = extract_primary_face(bgr_b)
    except ValueError:
        raise ValueError("No face detected in Photo B. Use a clearer, front-facing photo.")
    sim = float(np.dot(emb_a, emb_b))
    sim = max(0.0, min(sim, 1.0))
    elapsed_ms = (time.time() - t0) * 1000
    return sim, box_a, box_b, elapsed_ms


# ─────────────────────────────────────────────────────────────────────────────
# FAISS Index management
# ─────────────────────────────────────────────────────────────────────────────

INDEX_FILE    = INDEX_DIR / "faces_opencv.faiss"
METADATA_FILE = INDEX_DIR / "metadata_opencv.csv"


def build_index(known_faces_dir: Path = KNOWN_FACES_DIR) -> int:
    """Scan known_faces/, extract embeddings, build & save FAISS index."""
    known_faces_dir.mkdir(exist_ok=True)
    INDEX_DIR.mkdir(exist_ok=True)

    vectors: list[np.ndarray] = []
    records: list[dict[str, Any]] = []

    for img_path in _image_files(known_faces_dir):
        meta = _read_metadata(img_path)
        
        cached_emb = meta.get("embedding_cache")
        cached_box = meta.get("box_cache")
        cached_backend = meta.get("backend_cache")
        active_backend = get_active_backend()
        
        if (cached_emb is not None and cached_box is not None 
            and cached_backend == active_backend):
            emb = np.array(cached_emb, dtype="float32")
            box = FaceBox(
                x=int(cached_box["x"]),
                y=int(cached_box["y"]),
                w=int(cached_box["w"]),
                h=int(cached_box["h"]),
                confidence=float(cached_box.get("confidence", 1.0))
            )
            print(f"[index-cache] Loaded {meta['record_id']} - {meta['name']}")
        else:
            try:
                img_bgr = cv2.imread(str(img_path))
                if img_bgr is None:
                    raise ValueError("Cannot read image file.")
                emb, box = extract_primary_face(img_bgr)
                
                # Write to sidecar JSON to cache it
                meta_path = img_path.with_suffix(".json")
                json_data = {}
                if meta_path.exists():
                    try:
                        with meta_path.open("r", encoding="utf-8") as fh:
                            json_data = json.load(fh)
                    except Exception:
                        pass
                
                # Update json_data with original fields and cache keys
                for k, v in meta.items():
                    if k not in ["image_path", "file_name"]:
                        json_data[k] = v
                json_data["embedding_cache"] = emb.tolist()
                json_data["box_cache"] = {
                    "x": box.x, "y": box.y, "w": box.w, "h": box.h,
                    "confidence": box.confidence
                }
                json_data["backend_cache"] = active_backend
                
                with meta_path.open("w", encoding="utf-8") as fh:
                    json.dump(json_data, fh, indent=2, ensure_ascii=False)
                    
                print(f"[indexed & cached] {meta['record_id']} - {meta['name']}")
            except Exception as exc:
                print(f"[skip] {img_path.name}: {exc}")
                continue

        vectors.append(emb)
        records.append({
            **meta,
            "image_path": str(img_path),
            "file_name": img_path.name,
            "box_x": box.x,
            "box_y": box.y,
            "box_w": box.w,
            "box_h": box.h,
            "box_conf": box.confidence,
            "backend": active_backend,
        })

    if not vectors:
        # Clear old index if it exists
        for f in (INDEX_FILE, METADATA_FILE):
            if f.exists():
                f.unlink()
        return 0

    matrix = np.vstack(vectors).astype("float32")
    index  = faiss.IndexFlatIP(matrix.shape[1])
    index.add(matrix)

    faiss.write_index(index, str(INDEX_FILE))
    pd.DataFrame(records).to_csv(METADATA_FILE, index=False)
    print(f"[index] Built with {len(records)} records.")
    return len(records)


def _load_raw_index() -> tuple[faiss.IndexFlatIP | None, pd.DataFrame | None]:
    if not INDEX_FILE.exists() or not METADATA_FILE.exists():
        return None, None
    try:
        idx  = faiss.read_index(str(INDEX_FILE))
        meta = pd.read_csv(METADATA_FILE)
        return idx, meta
    except Exception as e:
        print(f"[error] Loading index: {e}")
        return None, None


def index_status() -> str:
    idx, meta = _load_raw_index()
    if idx is None or meta is None:
        return "Index not built yet. Run the launcher or click 'Rebuild Index'."
    backend = "OpenCV-SFace"
    if "backend" in meta.columns and not meta.empty:
        backend = str(meta["backend"].iloc[0])
    return f"Ready: {len(meta)} records indexed using {backend} (dim={idx.d})"


# ─────────────────────────────────────────────────────────────────────────────
# Confidence label helper
# ─────────────────────────────────────────────────────────────────────────────

def _confidence_label(sim: float) -> tuple[str, str]:
    pct = sim * 100
    if pct >= 75:
        return "HIGH CONFIDENCE", "#ef4444"     # red
    elif pct >= 55:
        return "MEDIUM CONFIDENCE", "#f59e0b"   # amber
    elif pct >= 35:
        return "LOW CONFIDENCE", "#9ca3af"      # grey
    else:
        return "UNLIKELY MATCH", "#6b7280"      # dark grey


# ─────────────────────────────────────────────────────────────────────────────
# Search (single face query)
# ─────────────────────────────────────────────────────────────────────────────

def search_face(
    query_image_rgb: np.ndarray,
    top_k: int = 3,
    threshold_pct: float = 30.0,
) -> tuple[list[MatchResult], FaceBox | None, float]:
    """
    Search for the primary face in query_image_rgb.

    Returns:
        results        – ranked MatchResult list
        query_box      – detected face box in the query image
        search_time_ms – elapsed milliseconds
    """
    if query_image_rgb is None:
        raise ValueError("No image provided.")

    t0 = time.time()

    img_bgr = _ensure_bgr(query_image_rgb)
    try:
        emb, query_box = extract_primary_face(img_bgr)
    except ValueError:
        raise ValueError(
            "No face detected. Tips: face the camera straight, "
            "improve lighting, and make sure the face is at least "
            "120 pixels across in the frame."
        )

    idx, meta_df = _load_raw_index()
    if idx is None or meta_df is None or idx.ntotal == 0:
        # Try auto-building
        build_index()
        idx, meta_df = _load_raw_index()
        if idx is None or meta_df is None or idx.ntotal == 0:
            return [], query_box, (time.time() - t0) * 1000

    query_vec = emb.reshape(1, -1).astype("float32")
    if idx.d != query_vec.shape[1]:
        print(
            f"[index] Embedding dimension changed "
            f"({idx.d} -> {query_vec.shape[1]}). Rebuilding index."
        )
        build_index()
        idx, meta_df = _load_raw_index()
        if idx is None or meta_df is None or idx.ntotal == 0:
            return [], query_box, (time.time() - t0) * 1000

    scores, idxs = idx.search(query_vec, min(top_k, idx.ntotal))

    results: list[MatchResult] = []
    for score, row_i in zip(scores[0], idxs[0]):
        if row_i < 0:
            continue
        sim = max(0.0, min(float(score), 1.0))
        if sim * 100 < threshold_pct:
            continue

        row = meta_df.iloc[int(row_i)]
        box: FaceBox | None = None
        if "box_x" in row and not pd.isna(row["box_x"]):
            box = FaceBox(
                x=int(row["box_x"]), y=int(row["box_y"]),
                w=int(row["box_w"]), h=int(row["box_h"]),
                confidence=float(row.get("box_conf", 1.0)),
            )
        label, color = _confidence_label(sim)
        results.append(MatchResult(
            record_id=str(row["record_id"]),
            name=str(row["name"]),
            category=str(row["category"]),
            age=str(row.get("age", "Unknown")),
            gender=str(row.get("gender", "Unknown")),
            last_seen=str(row.get("last_seen", "Unknown")),
            notes=str(row.get("notes", "—")),
            image_path=str(row["image_path"]),
            similarity=sim,
            distance=1.0 - sim,
            box=box,
            confidence_label=label,
            confidence_color=color,
            fir_no=_safe_str(row.get("fir_no")),
            police_station=_safe_str(row.get("police_station")),
            ipc_sections=_safe_str(row.get("ipc_sections")),
            status=_safe_str(row.get("status"), default="Under Investigation"),
        ))

    elapsed_ms = (time.time() - t0) * 1000

    if results:
        best = results[0]
        _write_audit(
            "SEARCH",
            best.record_id,
            best.name,
            best.similarity * 100,
            model=ACTIVE_BACKEND or "OpenCV-SFace",
        )

    return results, query_box, elapsed_ms


# ─────────────────────────────────────────────────────────────────────────────
# Multi-face CCTV scene analysis
# ─────────────────────────────────────────────────────────────────────────────

def analyze_scene(
    scene_image_rgb: np.ndarray,
    top_k: int = 1,
    threshold_pct: float = 30.0,
) -> tuple[list[SceneFace], np.ndarray, float]:
    """
    Detect ALL faces in a CCTV frame and match each against the database.

    Returns:
        scene_faces   – list of SceneFace with matches for each detected face
        annotated_img – the scene with bounding boxes and labels drawn
        elapsed_ms
    """
    if scene_image_rgb is None:
        raise ValueError("No image provided.")

    t0 = time.time()

    img_bgr = _ensure_bgr(scene_image_rgb)
    all_faces = extract_faces_insightface(img_bgr)

    if not all_faces:
        raise ValueError(
            "No faces detected in the scene. Try a clearer frame with "
            "front-facing faces; very small or heavily-rotated faces may be missed."
        )

    idx, meta_df = _load_raw_index()
    if idx is None or meta_df is None or idx.ntotal == 0:
        build_index()
        idx, meta_df = _load_raw_index()

    scene_faces: list[SceneFace] = []
    annotated = img_bgr.copy()

    for i, (emb, box) in enumerate(all_faces):
        matches: list[MatchResult] = []
        if idx is not None and meta_df is not None and idx.ntotal > 0:
            qv = emb.reshape(1, -1).astype("float32")
            if idx.d != qv.shape[1]:
                print(
                    f"[index] Embedding dimension changed "
                    f"({idx.d} -> {qv.shape[1]}). Rebuilding index."
                )
                build_index()
                idx, meta_df = _load_raw_index()
                if idx is None or meta_df is None or idx.ntotal == 0:
                    idx = None
                    meta_df = None

        if idx is not None and meta_df is not None and idx.ntotal > 0:
            qv = emb.reshape(1, -1).astype("float32")
            scores, row_ids = idx.search(qv, min(top_k, idx.ntotal))
            for score, row_i in zip(scores[0], row_ids[0]):
                if row_i < 0:
                    continue
                sim = max(0.0, min(float(score), 1.0))
                if sim * 100 < threshold_pct:
                    continue
                row = meta_df.iloc[int(row_i)]
                db_box: FaceBox | None = None
                if "box_x" in row and not pd.isna(row["box_x"]):
                    db_box = FaceBox(
                        x=int(row["box_x"]), y=int(row["box_y"]),
                        w=int(row["box_w"]), h=int(row["box_h"]),
                    )
                label, color = _confidence_label(sim)
                matches.append(MatchResult(
                    record_id=str(row["record_id"]),
                    name=str(row["name"]),
                    category=str(row["category"]),
                    age=str(row.get("age", "Unknown")),
                    gender=str(row.get("gender", "Unknown")),
                    last_seen=str(row.get("last_seen", "Unknown")),
                    notes=str(row.get("notes", "—")),
                    image_path=str(row["image_path"]),
                    similarity=sim,
                    distance=1.0 - sim,
                    box=db_box,
                    confidence_label=label,
                    confidence_color=color,
                    fir_no=str(row.get("fir_no", "") or ""),
                    police_station=str(row.get("police_station", "") or ""),
                    ipc_sections=str(row.get("ipc_sections", "") or ""),
                    status=str(row.get("status", "Under Investigation") or "Under Investigation"),
                ))

        sf = SceneFace(face_index=i, box=box, embedding=emb, matches=matches)
        scene_faces.append(sf)

        # Draw on annotated image
        x1, y1 = box.x, box.y
        x2, y2 = box.x + box.w, box.y + box.h

        if matches:
            best = matches[0]
            pct = best.similarity * 100
            if pct >= 75:
                bgr_color = (0, 0, 220)   # red  → high confidence
            elif pct >= 55:
                bgr_color = (0, 165, 255) # orange
            else:
                bgr_color = (255, 165, 0) # blue-green

            label_text = f"{best.name} | {pct:.0f}%"
            cat_tag = "SUSPECT" if best.category == "Suspect Watchlist" else "MISSING"
        else:
            bgr_color = (150, 150, 150)
            label_text = f"UNKNOWN #{i + 1}"
            cat_tag = ""

        cv2.rectangle(annotated, (x1, y1), (x2, y2), bgr_color, 3)

        # Label background box
        font = cv2.FONT_HERSHEY_DUPLEX
        font_scale = 0.65
        thickness = 1
        (tw, th), _ = cv2.getTextSize(label_text, font, font_scale, thickness)
        label_bg_y1 = max(0, y1 - th - 10)
        cv2.rectangle(annotated, (x1, label_bg_y1), (x1 + tw + 8, y1), bgr_color, -1)
        cv2.putText(annotated, label_text, (x1 + 4, y1 - 4), font, font_scale, (255, 255, 255), thickness)

        if cat_tag:
            cv2.putText(annotated, cat_tag, (x1, y2 + 20), font, 0.55, bgr_color, 1)

    # Audit log for scene analysis
    identified = sum(1 for sf in scene_faces if sf.matches)
    _write_audit(
        action="SCENE_ANALYSIS",
        notes=f"Detected {len(scene_faces)} faces, identified {identified}",
    )

    annotated_rgb = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)
    return scene_faces, annotated_rgb, (time.time() - t0) * 1000


# ─────────────────────────────────────────────────────────────────────────────
# CRUD helpers
# ─────────────────────────────────────────────────────────────────────────────

def get_all_records() -> list[dict[str, Any]]:
    """Read all records directly from JSON sidecar files (no index required)."""
    records: list[dict[str, Any]] = []
    if not KNOWN_FACES_DIR.exists():
        return records

    for json_path in KNOWN_FACES_DIR.glob("*.json"):
        try:
            with json_path.open("r", encoding="utf-8") as fh:
                data = json.load(fh)

            img_path: Path | None = None
            for ext in [".jpg", ".jpeg", ".png", ".webp", ".bmp"]:
                cand = json_path.with_suffix(ext)
                if cand.exists():
                    img_path = cand
                    break

            data["image_path"] = str(img_path) if img_path else ""
            data["file_name"]  = img_path.name if img_path else ""
            records.append(data)
        except Exception as e:
            print(f"[warn] Could not read {json_path.name}: {e}")

    records.sort(key=lambda r: str(r.get("record_id", "")))
    return records


def register_face(image_bgr: np.ndarray, metadata: dict[str, Any]) -> str:
    """Save image + JSON, rebuild index. Returns record_id."""
    # Validate that a face is detected before saving!
    emb, box = extract_primary_face(image_bgr)
    
    # Cache the embedding and bounding box in metadata
    active_backend = get_active_backend()
    metadata["embedding_cache"] = emb.tolist()
    metadata["box_cache"] = {
        "x": box.x, "y": box.y, "w": box.w, "h": box.h,
        "confidence": box.confidence
    }
    metadata["backend_cache"] = active_backend

    KNOWN_FACES_DIR.mkdir(exist_ok=True)

    record_id = str(metadata["record_id"]).strip().upper()
    name      = str(metadata["name"]).strip()
    stem      = f"{record_id}_{name.lower().replace(' ', '_')}"

    img_path  = KNOWN_FACES_DIR / f"{stem}.jpg"
    json_path = KNOWN_FACES_DIR / f"{stem}.json"

    cv2.imwrite(str(img_path), image_bgr)
    with json_path.open("w", encoding="utf-8") as fh:
        json.dump(metadata, fh, indent=2, ensure_ascii=False)

    build_index()
    _write_audit("REGISTER", record_id, name, notes=metadata.get("category", ""))
    return record_id



def delete_record(record_id: str) -> bool:
    """Delete image + JSON for record_id, rebuild index."""
    record_id = record_id.strip().upper()
    if not KNOWN_FACES_DIR.exists():
        return False

    found = False
    for path in list(KNOWN_FACES_DIR.iterdir()):
        if path.stem.startswith(record_id + "_"):
            if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".json"}:
                try:
                    path.unlink()
                    found = True
                except Exception as e:
                    print(f"[error] delete {path}: {e}")

    if found:
        build_index()
        _write_audit("DELETE", record_id)

    return found


# ─────────────────────────────────────────────────────────────────────────────
# CLI entry-point
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    count = build_index()
    print(f"Built FAISS index with {count} records.")
