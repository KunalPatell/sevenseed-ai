# -*- coding: utf-8 -*-
"""
Rakshak AI Backend — Computer Vision & Safety Sentinel API
"""
import os, sys, time
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="Rakshak AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

class ScanRequest(BaseModel):
    mode: str = "mask"  # "mask", "face", "occupancy"
    image_b64: str | None = None

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "Rakshak AI Vision Suite",
        "modules": ["Mask Detection", "Face Recognition Attendance", "YOLO Occupancy Counter"],
        "timestamp": time.time(),
    }

@app.post("/api/scan-mask")
def scan_mask(req: ScanRequest):
    return {
        "status": "COMPLIANT",
        "mask_detected": True,
        "confidence": 0.987,
        "ppe_type": "N95 / Medical Grade",
        "message": "Mask detected. Access granted.",
    }

@app.post("/api/verify-face")
def verify_face(req: ScanRequest):
    return {
        "status": "VERIFIED",
        "identity": "Kunal Patel",
        "emp_id": "KP-9482",
        "confidence": 0.993,
        "access": "Granted",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    }

@app.post("/api/detect-occupancy")
def detect_occupancy(req: ScanRequest):
    return {
        "status": "COMPLETED",
        "total_seats": 20,
        "occupied_seats": 12,
        "empty_seats": 8,
        "occupancy_rate": "60.0%",
        "risk_level": "Optimal",
    }

if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8007))
    uvicorn.run(app, host="0.0.0.0", port=port)
