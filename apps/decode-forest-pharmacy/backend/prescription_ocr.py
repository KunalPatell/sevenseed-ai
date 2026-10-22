# -*- coding: utf-8 -*-
"""
Prescription OCR Processing Module.
Extracts text from prescription images using EasyOCR, and uses LLM to structure 
the output into patient names and drug entities.
"""
from __future__ import annotations
import os
import re
import json
import cv2
import numpy as np

try:
    import easyocr
    HAS_EASYOCR = True
except ImportError:
    HAS_EASYOCR = False

def parse_prescription_image(image_path: str) -> dict:
    """
    Reads the image, processes it with EasyOCR, and parses text into structured JSON.
    """
    text_lines = []
    if HAS_EASYOCR:
        try:
            import torch
            use_gpu = torch.cuda.is_available()
            # EasyOCR downloads models to ~/.EasyOCR/ model directory
            reader = easyocr.Reader(['en'], gpu=use_gpu)
            
            img = cv2.imread(image_path)
            if img is not None:
                # Denoise & enhance contrast as per the Sujit extractor project
                upscaled = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
                gray = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)
                denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
                processed = clahe.apply(denoised)
                
                # Perform extraction
                detections = reader.readtext(processed, detail=0)
                text_lines = [t.strip() for t in detections if t.strip()]
        except Exception as e:
            print(f"[OCR] EasyOCR runtime error: {e}")
            
    raw_text = "\n".join(text_lines) if text_lines else ""
    
    # If OCR returns nothing, say so. A made-up prescription here would show a
    # patient medicines they were never prescribed.
    if not raw_text:
        return {
            "patient": "Unknown",
            "drugs": [],
            "ocr_status": "no_text" if HAS_EASYOCR else "ocr_unavailable",
            "message": ("No readable text was found. Try a sharper, well-lit photo of the prescription."
                        if HAS_EASYOCR else "Prescription OCR is not installed on this server. Type the medicine names instead."),
        }
        
    # Use LLM to structure the prescription
    from agents import _llm_text
    sys_prompt = (
        "You are an AI pharmacy assistant. Parse the raw OCR text from a doctor's prescription "
        "and return a STRICT JSON object with keys: "
        '"patient" (string, the patient name or "Unknown"), '
        '"drugs" (a list of objects, each with key "name" representing the drug/medicine name). '
        "Return ONLY JSON, no other text."
    )
    
    structured_json = _llm_text(sys_prompt, f"Raw OCR Text:\n{raw_text}")
    
    if structured_json:
        try:
            clean = structured_json[structured_json.find("{"):structured_json.rfind("}")+1]
            return json.loads(clean)
        except Exception as parse_err:
            print(f"[OCR] JSON parse error: {parse_err}")
            
    # Simple regex fallback if LLM offline or fails
    patient = "Unknown"
    for line in raw_text.split("\n"):
        if any(w in line.lower() for w in ["patient", "name", "pt"]):
            parts = line.split(":")
            if len(parts) > 1:
                patient = parts[1].strip()
                break
                
    # Extract words that look like drugs
    drugs = []
    known_drugs = ["paracetamol", "ibuprofen", "aspirin", "amoxicillin", "atorvastatin", "metformin", "crocin", "combiflam"]
    for word in re.findall(r"\b[a-zA-Z]{3,}\b", raw_text.lower()):
        if word in known_drugs:
            name = word.capitalize()
            if not any(d["name"] == name for d in drugs):
                drugs.append({"name": name})
                
    return {
        "patient": patient,
        "drugs": drugs,
        "ocr_status": "ok" if drugs else "no_known_drugs",
        "raw_text": raw_text[:1000],
        **({} if drugs else {"message": "Text was read, but no medicine names were recognised. Please check and type them in."}),
    }

def check_interactions(drugs: list[dict]) -> dict:
    """
    Wrapper calling agents interaction checks.
    """
    from agents import check_interactions as check_int
    drug_names = [d["name"] for d in drugs if d.get("name")]
    return check_int(drug_names)
