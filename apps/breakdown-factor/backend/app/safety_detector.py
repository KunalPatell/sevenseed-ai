# -*- coding: utf-8 -*-
"""
Safety gear detection helper.
Detects persons and checks if they are wearing safety helmets and face masks.
Supports YOLOv8 segmentation/pose models with robust simulation fallbacks.
"""
from __future__ import annotations
import os
try:
    import cv2
except Exception:
    cv2 = None
import numpy as np

def detect_safety_gear(image_path: str) -> dict:
    """
    Analyzes a site image for workers and safety gear compliance (helmets, masks).
    """
    detected_persons = 0
    wearing_helmets = 0
    wearing_masks = 0
    violations = []
    has_yolo = False
    
    # Search for local YOLO weights (model file next to the app, or env override)
    best_pt_path = os.environ.get("SAFETY_YOLO_PATH") or os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "yolov8s-seg.pt")

    if os.path.exists(best_pt_path):
        try:
            from ultralytics import YOLO
            model = YOLO(best_pt_path)
            results = model(image_path)
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0].item())
                    if cls_id == 0:  # COCO class 'person'
                        detected_persons += 1
            has_yolo = True
        except Exception as e:
            print(f"[YOLO Safety Error] {e}")

    # The bundled COCO model detects people, not helmets or masks, so PPE is
    # reported as not assessed instead of being guessed.
    if not has_yolo:
        return {
            "success": False,
            "workers_detected": None,
            "wearing_helmets": None,
            "wearing_masks": None,
            "violations": [],
            "compliance_score": None,
            "status": "MODEL_UNAVAILABLE",
            "yolo_active": False,
            "message": "The person-detection model is not installed on this server, so no scan was performed.",
        }

    return {
        "success": True,
        "workers_detected": detected_persons,
        "wearing_helmets": None,
        "wearing_masks": None,
        "violations": [],
        "compliance_score": None,
        "status": "PPE_NOT_ASSESSED",
        "yolo_active": True,
        "message": (f"Detected {detected_persons} person(s). Helmet and mask checks need a PPE-trained model, "
                    "which is not bundled yet, so PPE compliance was not assessed."),
    }
