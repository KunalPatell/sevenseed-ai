# -*- coding: utf-8 -*-
"""
AVPU — Alpaben Vipulbhai Patel University FastAPI backend.
Serves Next.js static site, AI Tutoring, placements, admissions, roadmapping, and assessments.
Stores student state and study logs in SQLite.
"""
from __future__ import annotations
import os, sys, uuid

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import config, db
import agents
import rag
from avpu_data import PROGRAMS

try:
    from dotenv import load_dotenv; load_dotenv()
except Exception:
    pass

app = FastAPI(title="AVPU AI — Alpaben Vipulbhai Patel University", version="1.0.0")

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

# Enterprise features: auth, extra AI tools, analytics, export, reminders
from features import router as features_router
app.include_router(features_router)

from whatsapp_tutor import router as whatsapp_router
app.include_router(whatsapp_router)


# ── Request models ────────────────────────────────────────────────────────────
class TutorReq(BaseModel):
    message: str
    session_id: str | None = None
    subject: str | None = ""

class PlacementReq(BaseModel):
    skills: list[str] = []
    interests: str | None = ""

class AdmissionsReq(BaseModel):
    interests: str
    background: str | None = ""
    goal: str | None = ""

class AssessReq(BaseModel):
    question: str
    answer: str

class ResearchReq(BaseModel):
    text: str
    mode: str | None = "summarize"

class RoadmapReq(BaseModel):
    goal: str
    level: str | None = "beginner"
    weeks: int | None = 8


# ── Core AI Endpoints ─────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "provider": agents.active_provider(),
        "rag_backend": rag.backend_name(),
        "counts": rag.counts(),
        "llm_enabled": agents.active_provider() != "offline"
    }

@app.get("/api/programs")
def programs():
    return {"programs": PROGRAMS, "count": len(PROGRAMS)}

@app.post("/api/tutor")
def tutor(req: TutorReq):
    sid = req.session_id or str(uuid.uuid4())
    result = agents.run_tutor(req.message, sid, req.subject or "")
    result["session_id"] = sid

    # Persistence of tutor session
    curr = db.get_session(sid)
    msgs = curr["messages"] if curr else []
    
    # Append human and AI messages
    msgs.append({"role": "user", "text": req.message})
    msgs.append({
        "role": "ai", 
        "text": result.get("reply", ""), 
        "sources": result.get("sources", []),
        "traces": result.get("traces", [])
    })
    
    db.save_session(sid, req.subject or "AI Tutor Chat", msgs)
    return result

@app.post("/api/placement")
def placement(req: PlacementReq):
    return agents.match_placement(req.skills, req.interests or "")

@app.post("/api/admissions")
def admissions(req: AdmissionsReq):
    return agents.recommend_programs(req.interests, req.background or "", req.goal or "")

@app.post("/api/assess")
def assess(req: AssessReq):
    result = agents.assess(req.question, req.answer)
    db.save_assessment(req.question, req.answer, result)
    return result

@app.post("/api/research")
def research(req: ResearchReq):
    return agents.research(req.text, req.mode or "summarize")

@app.post("/api/roadmap")
def roadmap(req: RoadmapReq):
    result = agents.roadmap(req.goal, req.level or "beginner", req.weeks or 8)
    db.save_roadmap(req.goal, req.level or "beginner", req.weeks or 8, result)
    return result


# ── Student Database History API ──────────────────────────────────────────────
@app.get("/api/history/sessions")
def get_sessions(limit: int = 50):
    return {"sessions": db.list_sessions(limit)}

@app.delete("/api/history/sessions/{session_id}")
def delete_session(session_id: str):
    success = db.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True}

@app.get("/api/history/roadmaps")
def get_roadmaps(limit: int = 50):
    return {"roadmaps": db.list_roadmaps(limit)}

@app.delete("/api/history/roadmaps/{item_id}")
def delete_roadmap(item_id: int):
    success = db.delete_roadmap(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return {"success": True}

@app.get("/api/history/assessments")
def get_assessments(limit: int = 50):
    return {"assessments": db.list_assessments(limit)}

@app.delete("/api/history/assessments/{item_id}")
def delete_assessment(item_id: int):
    success = db.delete_assessment(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"success": True}


# ── Static frontend mounting ──────────────────────────────────────────────────
if config.STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(config.STATIC_DIR), html=True), name="frontend")
else:
    @app.get("/")
    def _nf():
        return JSONResponse({
            "status": "API running",
            "frontend": "Next.js frontend not built yet. Build with 'npm run build' inside frontend/",
            "docs": "/docs"
        })

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[AVPU] provider={agents.active_provider()} | rag={rag.backend_name()} | db={config.DB_PATH}")
    uvicorn.run(app, host="0.0.0.0", port=port)
