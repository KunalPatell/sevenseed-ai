# -*- coding: utf-8 -*-
"""
Rakshak AI Backend — Full-Stack Citizen Assistant, Police Copilot & Vision Security Sentinel
-----------------------------------------------------------------------------------------
Combines NLP AI Chatbot, Automatic FIR Generator (BNS/IPC), Cybercrime Scam Analyzer,
Emergency SOS Dispatcher, Safety Mask PPE Scanner, Facial Attendance Matcher, and
YOLO Chair Occupancy Monitoring.
"""

import os
import re
import sys
import time
import base64
import logging

import faceauth
import datetime
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="Rakshak AI — Citizen Assistant & Vision Sentinel", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

# --- BNS (Bharatiya Nyaya Sanhita) & IPC Legal Mapping Database ---
BNS_LAWS = {
    "Vehicle Theft": [
        "BNS Section 303(2) — Theft of Motor Vehicle (Punishment: Imprisonment up to 3 years or fine)",
        "BNS Section 317 — Stolen Property Possession / Receipt"
    ],
    "Mobile / Electronics Theft": [
        "BNS Section 303(2) — Theft of Personal Property",
        "IT Act Section 66B — Punishment for dishonestly receiving stolen computer resource or communication device"
    ],
    "Personal Property Theft": [
        "BNS Section 303(2) — Theft in dwelling house / public place",
        "BNS Section 304 — Snatching with force / threat"
    ],
    "Burglary / House Break-in": [
        "BNS Section 331 — House-breaking by night in order to commit offense",
        "BNS Section 305 — Theft in a building, tent, or vessel"
    ],
    "Cyber Fraud": [
        "IT Act Section 66D — Cheating by personation using computer resource",
        "BNS Section 318(4) — Cheating and dishonestly inducing delivery of property",
        "BNS Section 319 — Cheating by Personation"
    ],
    "Assault / Harassment": [
        "BNS Section 115 — Voluntarily causing hurt",
        "BNS Section 351 — Criminal Intimidation / Threat",
        "BNS Section 74 — Sexual harassment / Outraging modesty of woman"
    ]
}

# --- Request Models ---
class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    user_location: str | None = "Ahmedabad, Gujarat"

class FIRRequest(BaseModel):
    complainant_name: str
    phone: str
    crime_category: str
    incident_details: str
    incident_location: str
    incident_time: str

class CybercrimeRequest(BaseModel):
    scam_type: str
    amount_lost: str | None = "0"
    incident_summary: str

class SOSRequest(BaseModel):
    lat: float = 23.0225
    lon: float = 72.5714
    address: str = "Ahmedabad Central"
    emergency_type: str = "SOS Attack / Threat"

class ScanRequest(BaseModel):
    mode: str = "mask"
    image_b64: str | None = None
    # Who the face is being matched against. Recognition is a 1:1 check against a
    # registered embedding — without this there is nothing to compare to, which is
    # how the old endpoint got away with always answering "Kunal Patel".
    person_id: str | None = None

# Face embeddings live in SQLite next to this file. Note Render's disk is
# ephemeral, so registrations are lost on redeploy — same caveat as every other
# app here; see docs/DEPLOY_TOPOLOGY_AND_WIP.md.
DB_PATH = os.environ.get("DB_PATH", str(Path(__file__).parent / "db.sqlite3"))

# --- In-Memory FIR Complaint Store ---
FIR_STORE = []

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "Rakshak AI — Citizen Safety, Police Copilot & Vision Sentinel",
        "version": "2.0.0",
        "modules": [
            "Multilingual AI Chatbot",
            "Automatic FIR Generator (BNS/IPC)",
            "Cybercrime Scam Analyzer & Evidence Checklist",
            "Emergency SOS Dispatcher",
            "Safety Mask PPE Scanner",
            "Facial Attendance Matcher",
            "YOLO Chair Occupancy Counter"
        ],
        "timestamp": time.time(),
    }

# ---------------------------------------------------------------------------
# 1. MULTILINGUAL CHATBOT & INTENT ENGINE
# ---------------------------------------------------------------------------
@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    msg = req.message.strip().lower()
    
    # Intent Detection logic
    if any(k in msg for k in ["sos", "help", "danger", "attack", "kill", "save me", "emergency", "बचाओ", "खतरा", "મદદ"]):
        return {
            "intent": "emergency",
            "priority": "HIGH_RISK",
            # Was: "Immediate assistance dispatched! ... Live location shared with
            # nearest police station." Neither happens — this app has no link to
            # any control room and shares no location. The /api/sos endpoint and
            # the SOS panel were corrected earlier; this reply was the third copy
            # of the same false claim and was missed then. Telling someone help is
            # already coming is the one thing that can stop them calling for it.
            "response": (
                "**Call 112 now** — police, fire and medical, from any phone. "
                "Women's helpline **1091**. "
                "Rakshak cannot contact the police for you and has not shared your location: "
                "you have to make the call."
            ),
            "sos_trigger": True
        }
    elif any(k in msg for k in ["fir", "complaint", "file", "register", "report", "शिकायत", "ફરિયાદ"]):
        return {
            "intent": "fir_help",
            "priority": "MEDIUM",
            "response": "📝 **FIR Registration Assistant**: I can generate a structured FIR draft automatically under the Bharatiya Nyaya Sanhita (BNS) & IPC laws. Please switch to the **FIR Generator Workstation** tab or type details of your incident.",
            "sos_trigger": False
        }
    elif any(k in msg for k in ["cyber", "otp", "upi", "scam", "bank", "fraud", "hacked", "पैसे", "फ्रॉड"]):
        return {
            "intent": "cybercrime",
            "priority": "MEDIUM",
            "response": "🛡️ **Cybercrime Incident Alert**: 1) Call National Cybercrime Helpline **1930** immediately to freeze funds. 2) Lodge complaint on cybercrime.gov.in. 3) Block your bank cards and save transaction screenshots.",
            "sos_trigger": False
        }
    else:
        return {
            "intent": "general_info",
            "priority": "NORMAL",
            "response": f"Hello! I am **Rakshak AI Citizen Safety Assistant**. I can help you register FIR drafts, report cybercrime scams, locate nearest police stations, check safety mask compliance, or trigger Emergency SOS. How can I assist you today in {req.user_location}?",
            "sos_trigger": False
        }

# ---------------------------------------------------------------------------
# 2. AUTOMATIC FIR GENERATOR WITH BNS/IPC SECTIONS
# ---------------------------------------------------------------------------
@app.post("/api/fir/generate")
def generate_fir(req: FIRRequest):
    fir_id = f"FIR-{int(time.time())}"
    category = req.crime_category
    # An unrecognised category used to fall back to theft and cheating sections
    # regardless of what was actually reported, so a complaint about assault could
    # be drafted citing BNS 303 (theft). Wrong sections on a police complaint are
    # worse than none: they misdirect the officer reading it. Say nothing instead.
    legal_sections = BNS_LAWS.get(category, [])
    sections_note = (
        "Suggested sections only — a duty officer must confirm them before filing."
        if legal_sections
        else "No sections suggested: this complaint type is not in our reference list. "
             "The duty officer will determine the applicable sections."
    )
    
    record = {
        "id": fir_id,
        "name": req.complainant_name,
        "phone": req.phone,
        "type": "Online Citizen Complaint Draft",
        "crime_type": category,
        "location": req.incident_location,
        "time": req.incident_time,
        "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "priority": "MEDIUM",
        "summary": req.incident_details,
        "legal_sections": legal_sections,
        "status": "Draft Generated (Pending Duty Officer Verification)"
    }
    
    record["sections_note"] = sections_note

    FIR_STORE.append(record)
    # sections_note was previously computed and then dropped on the floor — the
    # response never carried it, so the "no sections suggested, the duty officer
    # decides" case reached the caller as an empty list with no explanation. The
    # message likewise announced "recommended BNS legal codes" even when none
    # were found, which contradicted the empty list it shipped alongside.
    return {
        "success": True,
        "fir": record,
        "sections_note": sections_note,
        "message": (
            f"FIR draft {fir_id} generated with suggested BNS sections."
            if legal_sections
            else f"FIR draft {fir_id} generated. No BNS sections suggested for this category."
        ),
    }

ADMIN_KEY = os.environ.get("ADMIN_KEY", "")


@app.get("/api/fir/list")
def list_firs(x_admin_key: str = Header(default="")):
    """Every stored complaint. Admin only.

    This was open. FIR_STORE holds the complainant's name, phone number, the
    location and time of the incident and the full description of what happened —
    so an unauthenticated GET handed out crime complaints with victim contact
    details to anyone who knew the path. Nothing in the frontend calls it.

    404 rather than 401, matching the hub's /api/history/contacts, so the
    endpoint's existence is not advertised. There is no user login in this app;
    if one is added, scope this to the complainant's own records instead.
    """
    if not ADMIN_KEY or x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=404)
    return {"firs": FIR_STORE}


# Per-scam-type guidance, lifted from the original Rakshak project
# (E:/Project/chatbot/ai_engine.py). The analyzer here previously computed
# `scam = req.scam_type.lower()` and then never used it, so every scam type —
# OTP fraud, UPI, fake loan, phishing — got byte-identical advice. The 1930
# helpline and cybercrime.gov.in steps were right, but nothing was analysed.

CYBER_SCAMS = {
    "OTP Fraud": {
        "keywords": ["otp", "one time password", "verification code"],
        "actions": [
            "Call 1930 immediately to report and freeze the transaction.",
            "Inform your bank to block the card/account.",
            "Never share OTP — banks/police never ask for it.",
            "Change your net-banking & UPI PINs.",
        ],
        "evidence": ["Transaction SMS", "Caller's number", "Bank statement", "Screenshots"],
    },
    "UPI / Payment Scam": {
        "keywords": ["upi", "gpay", "phonepe", "paytm", "qr", "scan", "payment", "money deducted"],
        "actions": [
            "Do NOT scan unknown QR codes to 'receive' money.",
            "Call 1930 and report on cybercrime.gov.in.",
            "Raise a dispute in your UPI app.",
            "Block the UPI ID and inform your bank.",
        ],
        "evidence": ["UPI transaction ID", "Receiver VPA/UPI ID", "Chat screenshots"],
    },
    "Fake Loan / Investment": {
        "keywords": ["loan", "investment", "scheme", "double money", "trading", "crypto", "lottery"],
        "actions": [
            "Stop all payments immediately.",
            "Do not install any app they ask you to.",
            "Report on cybercrime.gov.in and call 1930.",
            "Verify any company on the SEBI/RBI portal.",
        ],
        "evidence": ["App name/link", "Payment proofs", "WhatsApp/Telegram chats"],
    },
    "Phishing / Account Hack": {
        "keywords": ["phishing", "link", "hacked", "hack", "password", "email", "facebook", "instagram", "whatsapp"],
        "actions": [
            "Reset passwords and enable 2-Factor Authentication.",
            "Do not click suspicious links.",
            "Report the hacked account to the platform.",
            "File a complaint on cybercrime.gov.in.",
        ],
        "evidence": ["Suspicious link/email", "Screenshots", "Login alerts"],
    },
}

# ---------------------------------------------------------------------------
# 3. CYBERCRIME SCAM ANALYZER & EVIDENCE CHECKLIST
# ---------------------------------------------------------------------------
def _match_scam(scam_type: str, summary: str) -> tuple[str, dict | None]:
    """Pick the closest entry in CYBER_SCAMS from the type, falling back to the
    incident text. Returns (matched_name, entry) or (given_name, None)."""
    haystack = f"{scam_type} {summary}".lower()
    for name, entry in CYBER_SCAMS.items():
        if name.lower() in haystack:
            return name, entry
        if any(k in haystack for k in entry.get("keywords", [])):
            return name, entry
    return scam_type, None


@app.post("/api/cybercrime/analyze")
def analyze_cybercrime(req: CybercrimeRequest):
    """Return the steps and evidence list for this kind of scam.

    This used to compute `scam = req.scam_type.lower()` and then ignore it, so an
    OTP fraud, a UPI scam, a fake loan and a phishing attack all received exactly
    the same four-line checklist. The advice itself was correct — 1930 within 24
    hours, cybercrime.gov.in — but nothing was analysed, and the generic answer
    missed the steps that actually differ (don't scan unknown QR codes, don't
    install the app they send you, verify the firm on SEBI/RBI).

    CYBER_SCAMS carries per-type actions and evidence. Where the type is not
    recognised, the general steps are returned and `matched` says so rather than
    implying a specific diagnosis.
    """
    matched_name, entry = _match_scam(req.scam_type, req.incident_summary or "")

    generic_actions = [
        "Call 1930 immediately — the first 24 hours decide whether funds can be frozen.",
        "File the complaint at https://cybercrime.gov.in under Financial Fraud.",
        "Tell your bank's nodal officer and request a chargeback.",
    ]
    generic_evidence = [
        "Bank SMS showing the debit",
        "UPI reference / transaction ID",
        "The fraudster's number or chat history",
        "Bank statement for that day",
    ]

    return {
        "scam_type": req.scam_type,
        "matched": matched_name if entry else None,
        "recognised": entry is not None,
        "risk_level": "HIGH FINANCIAL RISK",
        "recommended_helpline": "1930",
        "action_plan": entry["actions"] if entry else generic_actions,
        "evidence_checklist": entry["evidence"] if entry else generic_evidence,
        "legal_code": "IT Act Section 66D & BNS Section 318(4)",
        "note": (
            None if entry else
            "This scam type was not recognised, so these are the general steps. "
            "The 1930 operator will guide you on specifics."
        ),
    }

# ---------------------------------------------------------------------------
# 4. EMERGENCY SOS GEOLOCATION DISPATCHER
# ---------------------------------------------------------------------------
@app.post("/api/sos")
def trigger_sos(req: SOSRequest):
    """Record an SOS and hand back the real emergency numbers.

    THIS ENDPOINT DOES NOT CONTACT ANYONE, and must never claim it does. It used
    to return status "DISPATCHED", an assigned police control room, and an
    "estimated_arrival" of "4 - 7 Minutes", with the message "Emergency units
    notified. Remain in a safe area." None of that was real: there is no
    integration with any control room, no SMS, no call — just this dictionary.

    Someone in danger who is told a unit is seven minutes away may stop trying to
    get help. That is why the wording here is blunt.

    If real dispatch is ever added, it has to be an actual integration with an
    emergency service, and the status must reflect what that integration returns —
    never a hardcoded string.
    """
    logging.getLogger("rakshak").warning(
        "SOS_TRIGGERED | type=%s | lat=%s | lon=%s | address=%s",
        req.emergency_type, req.lat, req.lon, req.address,
    )
    return {
        "recorded_id": f"SOS-{int(time.time())}",
        "status": "NOT_DISPATCHED",
        "dispatch_available": False,
        "user_coordinates": {"lat": req.lat, "lon": req.lon},
        "helpline_numbers": [
            {"number": "112", "label": "National emergency"},
            {"number": "100", "label": "Police"},
            {"number": "1091", "label": "Women's helpline"},
        ],
        "message": (
            "Rakshak cannot contact emergency services. Call 112 now. "
            "This request has only been logged on this server."
        ),
    }

# ---------------------------------------------------------------------------
# 5. VISION SENTINEL MODULES (MASK, FACE ATTENDANCE, YOLO OCCUPANCY)
# ---------------------------------------------------------------------------
@app.post("/api/scan-mask")
def scan_mask(req: ScanRequest):
    """NOT IMPLEMENTED on this deployment — and it must not pretend otherwise.

    This returned status "COMPLIANT", mask_detected true, confidence 0.987 and
    "Access granted" for every request, including ones carrying no image. Wired to
    a door or a compliance log, it would pass everybody.

    A trained model exists (E:/Project/face mask/mask_model_final.h5) but it needs
    tensorflow-cpu + tf-keras, which are not in requirements.txt and will not fit:
    Render's free tier gives the whole container 512MB, three warm children
    already OOM-killed it once, and TensorFlow alone is several hundred MB.

    To make it real: run it as its own service on a paid instance, or swap the
    Keras model for a small ONNX one that can share the onnxruntime already here.
    """
    return {
        "status": "NOT_AVAILABLE",
        "implemented": False,
        "mask_detected": None,
        "message": (
            "Mask/PPE detection is not running on this deployment. "
            "No image was analysed and no compliance decision was made."
        ),
    }


@app.post("/api/verify-face")
def verify_face(req: ScanRequest):
    """Match a submitted face against a registered person.

    Real recognition, using the same InsightFace/ArcFace path already running in
    this container for avpu and avp-charitable-trust. Previously this returned
    "VERIFIED — Kunal Patel (KP-9482), Access: Granted" for anything at all, so
    every visitor was Kunal Patel and everyone was let in.
    """
    if not faceauth.available():
        return {
            "status": "NOT_AVAILABLE",
            "implemented": False,
            "message": "Face recognition is not installed on this server.",
        }
    if not req.image_b64:
        raise HTTPException(status_code=400, detail="An image is required (image_b64).")
    if not req.person_id:
        raise HTTPException(status_code=400, detail="person_id is required — who are we checking this against?")
    try:
        image_bytes = base64.b64decode(req.image_b64.split(",")[-1])
    except Exception:
        raise HTTPException(status_code=400, detail="image_b64 is not valid base64.")

    result = faceauth.verify(DB_PATH, req.person_id, image_bytes)
    matched = bool(result.get("match"))
    return {
        "status": "VERIFIED" if matched else "NO_MATCH",
        "implemented": True,
        "person_id": req.person_id,
        "match": matched,
        "similarity": result.get("similarity"),
        "error": result.get("error"),
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }


@app.post("/api/register-face")
def register_face(req: ScanRequest):
    """Enrol a face so /api/verify-face has something to compare against."""
    if not faceauth.available():
        return {"registered": False, "error": "Face recognition is not installed on this server."}
    if not req.image_b64 or not req.person_id:
        raise HTTPException(status_code=400, detail="person_id and image_b64 are both required.")
    try:
        image_bytes = base64.b64decode(req.image_b64.split(",")[-1])
    except Exception:
        raise HTTPException(status_code=400, detail="image_b64 is not valid base64.")
    return faceauth.register(DB_PATH, req.person_id, image_bytes)

@app.post("/api/detect-occupancy")
def detect_occupancy(req: ScanRequest):
    """NOT IMPLEMENTED on this deployment.

    This answered "20 seats, 12 occupied, 60.0%, Optimal Capacity" to every
    request regardless of the image — numbers precise enough to be believed and
    entirely invented. A capacity reading that is wrong is worse than absent if
    anyone uses it for crowd or safety decisions.

    Real occupancy needs YOLO (torch/ultralytics), which is not in
    requirements.txt and does not fit in the 512MB the free tier gives the whole
    container. Working code exists in E:/Project/local-face-recognition
    (src/chair_monitor.py, test_chair_detect.py) and can be lifted once this runs
    somewhere with room for it.
    """
    return {
        "status": "NOT_AVAILABLE",
        "implemented": False,
        "message": (
            "Occupancy detection is not running on this deployment. "
            "No image was analysed and no counts were produced."
        ),
    }

if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8007))
    uvicorn.run(app, host="0.0.0.0", port=port)
