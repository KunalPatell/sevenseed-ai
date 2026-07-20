# -*- coding: utf-8 -*-
"""
Site document / signage OCR module (ported from Desktop/Sujit/OCR-Text-Extractor).
Extracts text from photos of site documents, delivery notes, safety signage,
measurement tags etc., then uses the LLM to summarize and flag anything safety-relevant.
"""
from __future__ import annotations
import cv2
import numpy as np

try:
    import easyocr
    HAS_EASYOCR = True
except ImportError:
    HAS_EASYOCR = False

_reader = None


def _get_reader():
    global _reader
    if _reader is None and HAS_EASYOCR:
        import torch
        use_gpu = torch.cuda.is_available()
        _reader = easyocr.Reader(['en'], gpu=use_gpu)
    return _reader


def extract_text(image_path: str) -> dict:
    """
    Reads a site-document image and returns detected text lines with confidence + bbox.
    """
    if not HAS_EASYOCR:
        return {"success": False, "error": "OCR module unavailable (install easyocr).", "lines": []}

    reader = _get_reader()
    img = cv2.imread(image_path)
    if img is None:
        return {"success": False, "error": "Could not read image.", "lines": []}

    upscaled = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    processed = clahe.apply(denoised)

    detections = reader.readtext(processed, detail=1, paragraph=False, min_size=5,
                                  text_threshold=0.5, low_text=0.3, link_threshold=0.3,
                                  canvas_size=2800, mag_ratio=1.5)

    lines = []
    for bbox, text, conf in detections:
        text = text.strip()
        if not text:
            continue
        conf_val = float(conf)
        if conf_val > 1.0:
            conf_val = conf_val / 100.0
        if conf_val < 0.5:
            continue
        points = np.array(bbox, dtype=np.int32) // 2
        x, y = int(np.min(points[:, 0])), int(np.min(points[:, 1]))
        w, h = int(np.max(points[:, 0]) - x), int(np.max(points[:, 1]) - y)
        lines.append({
            "text": text,
            "confidence": round(conf_val, 4),
            "bbox": {"x": x, "y": y, "width": w, "height": h},
        })

    return {"success": True, "lines": lines, "raw_text": "\n".join(l["text"] for l in lines)}


def summarize_site_document(image_path: str, llm_fn) -> dict:
    """
    Extracts text then asks the LLM to classify the document and flag anything
    safety- or compliance-relevant (permit numbers, load limits, expiry dates, warnings).
    """
    ocr = extract_text(image_path)
    if not ocr.get("success"):
        return ocr

    raw_text = ocr.get("raw_text", "").strip()
    if not raw_text:
        return {"success": False, "error": "No readable text found in the image.", "lines": []}

    summary = llm_fn(
        "You are a construction site documentation assistant. Given raw OCR text from a photo of a "
        "site document, signage, delivery note, or measurement tag, identify: (1) what kind of "
        "document/sign this is, (2) any safety-critical details (load limits, expiry/inspection "
        "dates, permit numbers, warnings), (3) a one-line plain-language summary. Be concise.",
        f"Raw OCR text:\n{raw_text}"
    )

    return {
        "success": True,
        "raw_text": raw_text,
        "lines": ocr["lines"],
        "summary": summary or "LLM unavailable — raw extracted text above.",
    }
