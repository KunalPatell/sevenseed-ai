# -*- coding: utf-8 -*-
"""
Decode Forest Pharmacy — FastAPI backend.
Serves the frontend static files and the AI API, backed by SQLite database.
"""
from __future__ import annotations
import os, sys, uuid

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import config, db
import agents
import rag

try:
    from dotenv import load_dotenv; load_dotenv()
except Exception:
    pass

app = FastAPI(title="Decode Forest Pharmacy AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api_keys import groq_key_var, gemini_key_var, openai_key_var

@app.middleware("http")
async def api_key_override_middleware(request, call_next):
    groq_key_var.set(request.headers.get("x-groq-api-key", ""))
    gemini_key_var.set(request.headers.get("x-gemini-api-key", ""))
    openai_key_var.set(request.headers.get("x-openai-api-key", ""))
    return await call_next(request)

# Initialize Database
db.init()


# ── Request models ────────────────────────────────────────────────────────────
class AssistantReq(BaseModel):
    message: str
    session_id: str | None = None

class PrescriptionReq(BaseModel):
    text: str

class InteractionReq(BaseModel):
    drugs: list[str]

class SubstituteReq(BaseModel):
    medicine: str

class RefillReq(BaseModel):
    medicine: str
    quantity: int
    dose_per_day: float
    start_date: str  # YYYY-MM-DD

class SymptomReq(BaseModel):
    symptom: str

class MedicineSearchReq(BaseModel):
    query: str

class HospitalReq(BaseModel):
    city: str
    radius_km: float | None = 20.0


# ── API ───────────────────────────────────────────────────────────────────────
@app.post("/api/hospitals/nearby")
def get_nearby_hospitals(req: HospitalReq):
    from pharmacy_data import HOSPITALS
    city_lower = req.city.strip().lower()
    matches = [h for h in HOSPITALS if h["city"].lower() == city_lower]
    return {"hospitals": matches, "count": len(matches)}

@app.get("/api/health-camps")
def get_health_camps():
    from pharmacy_data import CAMPS
    return {"camps": CAMPS, "count": len(CAMPS)}

@app.get("/api/free-schemes")
def get_free_schemes():
    from pharmacy_data import SCHEMES
    return {"schemes": SCHEMES, "count": len(SCHEMES)}

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "provider": agents.active_provider(),
        "rag_backend": rag.backend_name(),
        "counts": rag.counts(),
        "llm_enabled": agents.active_provider() != "offline",
    }

@app.get("/api/medicines")
def list_medicines():
    from pharmacy_data import MEDICINES
    return {"medicines": MEDICINES, "count": len(MEDICINES)}

@app.post("/api/assistant")
def assistant(req: AssistantReq):
    sid = req.session_id or str(uuid.uuid4())
    result = agents.run_assistant(req.message, sid)
    result["session_id"] = sid
    return result

@app.post("/api/prescription")
def prescription(req: PrescriptionReq):
    data = agents.read_prescription(req.text)
    db.save_prescription(req.text, data.get("result", ""))
    return data

@app.post("/api/prescription/scan")
async def scan_prescription(file: UploadFile = File(...)):
    content = await file.read()
    import tempfile, json
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        from prescription_ocr import parse_prescription_image, check_interactions
        parsed = parse_prescription_image(tmp_path)
        safety = check_interactions(parsed.get("drugs", []))
        text_summary = f"Patient: {parsed.get('patient', 'Unknown')}, Drugs: {', '.join([d['name'] for d in parsed.get('drugs', [])])}"
        db.save_prescription(text_summary, json.dumps(safety))
        return {
            "parsed": parsed,
            "safety": safety
        }
    finally:
        try:
            os.unlink(tmp_path)
        except:
            pass

@app.post("/api/interactions")
def interactions(req: InteractionReq):
    data = agents.check_interactions(req.drugs)
    db.save_interaction(req.drugs, data.get("result", ""))
    return data

@app.post("/api/substitutes")
def substitutes(req: SubstituteReq):
    return agents.find_substitutes(req.medicine)

@app.post("/api/refill")
def refill(req: RefillReq):
    data = agents.predict_refill(req.medicine, req.quantity, req.dose_per_day, req.start_date)
    if "refill_date" in data:
        db.save_refill(
            medicine=req.medicine,
            quantity=req.quantity,
            dose_per_day=req.dose_per_day,
            start_date=req.start_date,
            refill_date=data["refill_date"],
            reminder_date=data["reminder_date"]
        )
    return data

@app.post("/api/symptoms")
def symptoms(req: SymptomReq):
    return agents.symptom_guide(req.symptom)

@app.post("/api/search")
def search(req: MedicineSearchReq):
    results = rag.search_medicines(req.query, 6)
    return {"results": results, "count": len(results)}


# ── Database History Endpoints ───────────────────────────────────────────────
@app.get("/api/prescriptions")
def get_prescriptions(limit: int = 50):
    return {"prescriptions": db.list_prescriptions(limit)}

@app.get("/api/interactions-history")
def get_interactions_history(limit: int = 50):
    return {"interactions": db.list_interactions(limit)}

@app.get("/api/refills")
def get_refills(limit: int = 50):
    return {"refills": db.list_refills(limit)}

@app.delete("/api/refills/{item_id}")
def remove_refill(item_id: int):
    success = db.delete_refill(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Refill record not found")
    return {"success": True}


# ── Static frontend ───────────────────────────────────────────────────────────
# If the compiled frontend/out directory exists, mount it, else display error message
# Enterprise features: auth, AI tools, analytics, export, reminders
from features import router as _feat_router
app.include_router(_feat_router)

if config.STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(config.STATIC_DIR), html=True), name="frontend")
else:
    @app.get("/")
    def _no_frontend():
        return JSONResponse({
            "status": "API is running",
            "frontend": "Next.js frontend not built yet. Build with 'npm run build' inside frontend/",
            "docs": "/docs"
        })

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[Decode Forest] provider={agents.active_provider()} | db={config.DB_PATH}")
    uvicorn.run(app, host="0.0.0.0", port=port)
