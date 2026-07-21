# -*- coding: utf-8 -*-
"""
Breakdown Factor Construction — Combined backend (AI tools + FastAPI + SQLite).
Serves Next.js static site and handles site-safety checklists, BOQ, EMI, and defects logs.
"""
from __future__ import annotations
import os, sys, uuid
_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path: 
    sys.path.insert(0, _HERE)

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import agents, rag
from app import config, db
from app.ratelimit import check_rate_limit

try: 
    from dotenv import load_dotenv; load_dotenv()
except: 
    pass

app = FastAPI(title="Breakdown Factor Construction AI", version="1.0.0")

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

# Initialize SQLite database
db.init()

class CopilotReq(BaseModel): 
    message: str
    session_id: str | None = None

class CostReq(BaseModel): 
    project_type: str
    area_sqft: float
    floors: int = 1
    quality: str = "standard"
    location: str = "Ahmedabad"
    extra: str = ""

class MaterialReq(BaseModel): 
    work_type: str
    quantity: float
    unit: str = "cum"

class SafetyReq(BaseModel): 
    description: str

class DefectReq(BaseModel):
    description: str

class CostDemoReq(BaseModel):
    project_type: str
    area_sqft: float
    location: str = "Ahmedabad"


# ── AI API Endpoints ──────────────────────────────────────────────────────────
@app.get("/api/health")
def health(): 
    return {
        "status": "ok",
        "provider": agents.active_provider(),
        "rag_backend": rag.backend_name(),
        "counts": rag.counts(),
        "llm_enabled": agents.active_provider() != "offline"
    }

@app.post("/api/copilot")
def copilot(req: CopilotReq):
    sid = req.session_id or str(uuid.uuid4())
    result = agents.run_copilot(req.message, sid)
    
    # Save conversation state in SQLite
    curr = db.get_session(sid)
    msgs = curr["messages"] if curr else []
    msgs.append({"role": "user", "text": req.message})
    msgs.append({"role": "ai", "text": result.get("reply", "")})
    db.save_session(sid, msgs)
    
    return result

@app.post("/api/cost")
def cost(req: CostReq):
    return agents.estimate_cost(req.project_type, req.area_sqft, req.floors, req.quality, req.location, req.extra)

@app.post("/api/cost/demo")
def cost_demo(req: CostDemoReq, request: Request):
    # Public, unauthenticated teaser widget on the landing page — stricter limits,
    # cheaper/faster model, and deliberately stateless (never written to the
    # project/session history that backs the real Project Portal). Never honors
    # BYOK headers — see agents._get_llm_demo.
    check_rate_limit(request, bucket="cost_demo", limit=5, window_s=3600, global_limit=200)
    if not req.project_type.strip():
        raise HTTPException(status_code=400, detail="Project type is required.")
    if len(req.project_type) > 80 or len(req.location) > 60:
        raise HTTPException(status_code=400, detail="Input too long.")
    if req.area_sqft <= 0 or req.area_sqft > 100000:
        raise HTTPException(status_code=400, detail="Enter a realistic area between 1 and 100,000 sqft.")
    return agents.estimate_cost_demo(req.project_type, req.area_sqft, req.location)

@app.post("/api/materials")
def materials(req: MaterialReq): 
    return agents.calc_materials(req.work_type, req.quantity, req.unit)

@app.post("/api/safety")
def safety(req: SafetyReq): 
    return agents.assess_safety(req.description)

@app.post("/api/defect")
def defect(req: DefectReq): 
    return agents.diagnose_defect(req.description)

@app.post("/api/defect/scan")
async def scan_defect(file: UploadFile = File(...)):
    content = await file.read()
    import tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        res = agents.diagnose_defect_image(tmp_path)
        # Log defect scan to SQLite history
        db.save_scan(
            filename=file.filename or "uploaded_frame.jpg",
            detected=res.get("detected_classes", []),
            cost_range=res.get("cost_range", "—"),
            guidance=res.get("guidance", "")
        )
    finally:
        try: 
            os.unlink(tmp_path)
        except: 
            pass
    return res

@app.post("/api/defect/scan/demo")
async def scan_defect_demo(request: Request, file: UploadFile = File(...)):
    # Public, unauthenticated teaser widget on the landing page - runs the same
    # real YOLO model (via cv2.dnn/ONNX, not ultralytics/torch) but with a
    # cheaper LLM summary, no persistence, and a hard file-size cap.
    check_rate_limit(request, bucket="defect_scan_demo", limit=5, window_s=3600, global_limit=200)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB).")
    import tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        res = agents.diagnose_defect_image(tmp_path, demo=True)
    finally:
        try:
            os.unlink(tmp_path)
        except:
            pass
    return res

@app.get("/api/cost-items")
def cost_items():
    from breakdown_data import COST_ITEMS
    return {"items": COST_ITEMS, "count": len(COST_ITEMS)}

@app.get("/api/safety-risks")
def safety_risks():
    from breakdown_data import SAFETY_RISKS
    return {"risks": SAFETY_RISKS, "count": len(SAFETY_RISKS)}


class BotJoinReq(BaseModel):
    platform: str
    meeting_url: str

@app.post("/api/bot/join")
async def bot_join(req: BotJoinReq):
    from meeting_listener import MeetingListenerBot
    bot = MeetingListenerBot(req.platform, req.meeting_url)
    res = await bot.start()
    if res.get("status") == "joined":
        return {"status": "success", "message": f"Bot successfully joined meeting: {req.meeting_url}"}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to join meeting: {res.get('error')}")


# ── SQLite Database History Endpoints ─────────────────────────────────────────
@app.get("/api/history/copilot")
def get_copilot_sessions(limit: int = 50):
    return {"sessions": db.list_sessions(limit)}

@app.delete("/api/history/copilot/{session_id}")
def delete_copilot_session(session_id: str):
    success = db.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True}

@app.get("/api/history/scans")
def get_defect_scans(limit: int = 50):
    return {"scans": db.list_scans(limit)}

@app.delete("/api/history/scans/{item_id}")
def delete_defect_scan(item_id: int):
    success = db.delete_scan(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"success": True}


# Include custom features (auth, calculators, export)
from features import router as feat_router
app.include_router(feat_router)


# ── Static Frontend Mounting ──────────────────────────────────────────────────
@app.get("/app")
def app_page():
    for _cand in ("app/index.html", "app.html", "app/page.html"):
        _f = os.path.join(config.STATIC_DIR, _cand)
        if os.path.exists(_f): 
            return FileResponse(_f)
    return JSONResponse({"error": "frontend app bundle not found"}, status_code=404)

if config.STATIC_DIR.exists(): 
    app.mount("/", StaticFiles(directory=str(config.STATIC_DIR), html=True), name="frontend")
else:
    @app.get("/")
    def _nf(): 
        return JSONResponse({
            "status": "API active",
            "frontend": "Next.js frontend not built yet. Run 'npm run build' inside frontend/",
            "docs": "/docs"
        })

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[BreakdownFactor] provider={agents.active_provider()} | db={config.DB_PATH}")
    uvicorn.run(app, host="0.0.0.0", port=port)
