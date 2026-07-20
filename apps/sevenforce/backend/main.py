# -*- coding: utf-8 -*-
"""
Sevenseed — Combined backend (RAG + Agents + FastAPI) with SQLite persistence.
Serves Next.js static site and AI venture ideation + founder counseling APIs.
"""
from __future__ import annotations
import os, sys, math, re, uuid
from typing import List, Dict, Any
import operator
from app.api_keys import groq_key_var, gemini_key_var, openai_key_var

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path: 
    sys.path.insert(0, _HERE)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import config, db

try: 
    from dotenv import load_dotenv; load_dotenv()
except: 
    pass

# ── Knowledge base ──────────────────────────────────────────────────────────
# Sevenforce's own AI employees (its actual product), not the sister Sevenseed
# ventures — this file was a copy of the Sevenseed studio backend and had the
# studio's venture-pitching content here. Cleaned up 2026-07-16, re-applied
# 2026-07-17 after a revert (concurrent session activity).
VENTURES = [
    {"name": "Maya", "sector": "Growth AI — Content & SEO", "stage": "Live", "color": "indigo",
     "ai_stack": "Groq LLaMA 3.3 70B, brand-profile extraction, SEO topic + long-form article generation",
     "description": "Brand profiling from a URL, SEO topic ideation, and full long-form blog articles."},
    {"name": "Vibe", "sector": "Growth AI — Social Media", "stage": "Live", "color": "blue",
     "ai_stack": "Groq LLaMA, multi-platform caption generation, real publish via Facebook/Instagram/LinkedIn/Twitter APIs",
     "description": "Writes platform-tuned captions and can publish directly to Facebook, Instagram, LinkedIn, or Twitter/X given an access token."},
    {"name": "Wave", "sector": "Growth AI — Outreach & Lead-Gen", "stage": "Live", "color": "emerald",
     "ai_stack": "WhatsApp Cloud API, Brevo email campaigns, ICP + lead scoring, outreach sequences, support-reply drafting",
     "description": "WhatsApp/email campaigns, ideal-customer-profile building, lead scoring, cold outreach sequences, and customer-support reply drafting."},
    {"name": "Nova", "sector": "Agency AI — Documents & QA", "stage": "Live", "color": "amber",
     "ai_stack": "LLM document generation, python-docx export, test-case + acceptance-criteria generation",
     "description": "Drafts BRDs/PRDs/proposals with real .docx export, and generates test cases + acceptance criteria for a feature."},
    {"name": "Echo", "sector": "Agency AI — Meetings", "stage": "Live", "color": "rose",
     "ai_stack": "LLM transcript summarisation",
     "description": "Turns a raw meeting transcript into structured notes and action items."},
    {"name": "Scout", "sector": "Agency AI — Recruiting", "stage": "Live", "color": "orange",
     "ai_stack": "Interview question generation, candidate answer evaluation, resume/JD matching",
     "description": "Generates role-specific interview questions, evaluates candidate answers, and matches resumes against a job description."},
    {"name": "Sage", "sector": "Agency AI — Data", "stage": "Live", "color": "violet",
     "ai_stack": "Safe NL→SQL over the platform's own SQLite data",
     "description": "Answers plain-English questions about your own Sevenforce data (\"how many leads this week?\") with real SQL underneath."},
    {"name": "Atlas", "sector": "Game Dev AI — Design", "stage": "Live", "color": "cyan",
     "ai_stack": "Groq LLaMA, game-design brief generation",
     "description": "Game mechanic ideation, level/progression structure, and difficulty-balance notes from a one-line concept."},
    {"name": "Pixel", "sector": "Game Dev AI — 2D Art", "stage": "Live", "color": "pink",
     "ai_stack": "Groq LLaMA style briefs + Hugging Face Stable Diffusion XL image generation",
     "description": "Visual style briefs for characters/UI/assets, plus real concept-art image generation when a Hugging Face key is set."},
    {"name": "Forge", "sector": "Game Dev AI — 3D Art", "stage": "Live", "color": "lime",
     "ai_stack": "Groq LLaMA, poly/texture/greybox planning",
     "description": "3D asset specs — poly-count/LOD guidance, PBR texture plans, and greybox prototyping checklists."},
]

STUDIO_KNOWLEDGE = [
    ("Sevenforce — About", "Sevenforce gives any business a full AI workforce: 10 specialised AI employees across three suites — Growth AI (Maya, Vibe, Wave), Agency AI (Nova, Echo, Scout, Sage), and Game Dev AI (Atlas, Pixel, Forge). A Sevenseed AI venture, launched 2026."),
    ("How it works", "Talk to Owl, the AI chief-of-staff, in plain English (e.g. 'write me a cold outreach sequence' or 'design a tower-defense game'). Owl routes the request to the right AI employee's tool via LangGraph, runs it, and replies — or call any employee's tool directly via the API."),
    ("Getting started — which employee first?", "Selling a product or service → start with Wave (lead-gen + outreach) and Vibe (social presence). Building internal docs/process → start with Nova (BRD/PRD/test cases). Hiring → Scout. Running a game studio → Atlas/Pixel/Forge. Need answers from your own data → Sage."),
    ("Pricing philosophy", "Every employee works offline/degrades gracefully with zero API keys configured, so you can trial the whole workforce before adding any keys (Groq, HuggingFace, WhatsApp, Brevo, etc.) for full capability. You can also bring your own API keys instead of using ours."),
    ("Positioning vs competitors", "Similar 'AI employee' products: Sintra.ai (12 generalist agents, consumer+business mixed), AutomationOwl (lead-gen/social/ecommerce tagline, no named agents), automusk.ai (game-studio AI employees only, frontend-only mockup). Sevenforce's edge: real working backends for every agent, not just marketing pages, and both business-agency AND game-dev coverage in one workforce."),
    ("AI Ethics Policy", "Sevenforce commits to: transparent AI (no hallucination claims), offline-capable products (work without API keys), privacy-first data handling, human-in-the-loop for high-stakes actions (e.g. real social posts, outbound emails), and clear escalation flags (e.g. support_reply's needs_human_escalation field)."),
    ("Technology stack", "Groq LLaMA 3.3 70B (primary) with Gemini/OpenAI fallback, LangGraph multi-agent orchestration (Owl), FastAPI backend, SQLite persistence, python-docx export, direct REST integration with WhatsApp Cloud API, Brevo, Zoho CRM, and the Facebook/Instagram/LinkedIn/Twitter/HuggingFace APIs."),
]

VENTURE_IDEAS = [
    {"name": "Start with Growth AI", "sector": "Sales & Marketing", "market": "Any business that needs pipeline",
     "ai_angle": "Wave builds your ICP and outreach sequences; Vibe writes and publishes social content; Maya builds your content/SEO engine.",
     "fit": "High — most new Sevenforce customers start here"},
    {"name": "Start with Agency AI", "sector": "Ops & Delivery", "market": "Agencies, consultancies, internal teams",
     "ai_angle": "Nova drafts BRDs/PRDs and test cases; Echo turns meetings into action items; Scout speeds up hiring; Sage answers data questions instantly.",
     "fit": "High — for teams drowning in documentation and process"},
    {"name": "Start with Game Dev AI", "sector": "Game Studios", "market": "Indie studios and small game teams",
     "ai_angle": "Atlas designs mechanics, Pixel briefs/generates concept art, Forge specs 3D assets — a full pre-production team.",
     "fit": "High — same niche as automusk.ai, but with working backends"},
]

# ── RAG ────────────────────────────────────────────────────────────────────────
_WORD=re.compile(r"[a-z0-9+#.]+")
def _tokens(t): return _WORD.findall(t.lower())
_BACKEND="overlap"; _st=None
try:
    from sentence_transformers import SentenceTransformer  # type: ignore
    import numpy as _np; _st=SentenceTransformer("all-MiniLM-L6-v2"); _BACKEND="embeddings"
except:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer,linear_kernel  # type: ignore
        import numpy as _np; _BACKEND="tfidf"
    except: pass

def backend_name(): return {"embeddings":"MiniLM embeddings","tfidf":"TF-IDF","overlap":"token-overlap"}[_BACKEND]

class Index:
    def __init__(self,docs,metas): self.docs,self.metas=docs,metas; self._matrix=self._vectorizer=self._emb=self._tok_sets=None; self._build()
    def _build(self):
        if _BACKEND=="embeddings": self._emb=_st.encode(self.docs,normalize_embeddings=True)
        elif _BACKEND=="tfidf":
            from sklearn.feature_extraction.text import TfidfVectorizer
            self._vectorizer=TfidfVectorizer(stop_words="english",ngram_range=(1,2),min_df=1); self._matrix=self._vectorizer.fit_transform(self.docs)
        else: self._tok_sets=[set(_tokens(d)) for d in self.docs]
    def search(self,query,n=4):
        if not query.strip() or not self.docs: return []
        if _BACKEND=="embeddings":
            import numpy as np; q=_st.encode([query],normalize_embeddings=True)[0]; scores=self._emb@q
        elif _BACKEND=="tfidf":
            from sklearn.metrics.pairwise import linear_kernel; scores=linear_kernel(self._vectorizer.transform([query]),self._matrix).ravel()
        else:
            qset=set(_tokens(query)); scores=[len(qset&ts)/(math.sqrt(len(qset)*len(ts)) or 1) for ts in self._tok_sets]
        ranked=sorted(range(len(self.docs)),key=lambda i:scores[i],reverse=True)[:n]
        return [{**self.metas[i],"score":round(max(0.,min(1.,float(scores[i])))*100,1)} for i in ranked]

_kidx=_vidx=_iidx=None
def _load():
    global _kidx,_vidx,_iidx
    if _kidx is not None: return
    _kidx=Index([f"{t}. {t}. {b}" for t,b in STUDIO_KNOWLEDGE],[{"title":t,"body":b} for t,b in STUDIO_KNOWLEDGE])
    _vidx=Index([f"{v['name']} {v['sector']} {v['ai_stack']} {v['description']}" for v in VENTURES],list(VENTURES))
    _iidx=Index([f"{i['name']} {i['sector']} {i['ai_angle']} {i['fit']}" for i in VENTURE_IDEAS],list(VENTURE_IDEAS))
    print(f"[RAG] sevenseed indexes ready via {backend_name()}")

def search_knowledge(q,n=4): _load(); return _kidx.search(q,n)
def search_ventures(q,n=4): _load(); return _vidx.search(q,n)
def search_ideas(q,n=3): _load(); return _iidx.search(q,n)
def counts(): return {"knowledge":len(STUDIO_KNOWLEDGE),"ventures":len(VENTURES),"ideas":len(VENTURE_IDEAS)}

# ── LLM ────────────────────────────────────────────────────────────────────────
def _groq_key(): return groq_key_var.get().strip() or os.environ.get("GROQ_API_KEY","").strip()
def _gemini_key(): return gemini_key_var.get().strip() or os.environ.get("GEMINI_API_KEY","").strip()
def _openai_key(): return openai_key_var.get().strip() or os.environ.get("OPENAI_API_KEY","").strip()

def _get_llm(t=0.5):
    if _groq_key():
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(api_key=_groq_key(),model=os.environ.get("GROQ_MODEL","llama-3.3-70b-versatile"),temperature=t)
        except: pass
    if _gemini_key():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(google_api_key=_gemini_key(),model="gemini-1.5-flash",temperature=t)
        except: pass
    if _openai_key():
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(api_key=_openai_key(),model="gpt-4o-mini",temperature=t)
        except: pass
    return None

def active_provider():
    if _groq_key(): return f"Groq ({os.environ.get('GROQ_MODEL','llama-3.3-70b-versatile')})" + (" (your key)" if groq_key_var.get().strip() else "")
    if _gemini_key(): return "Google Gemini 1.5 Flash" + (" (your key)" if gemini_key_var.get().strip() else "")
    if _openai_key(): return "OpenAI GPT-4o-mini" + (" (your key)" if openai_key_var.get().strip() else "")
    return "offline"

def _llm(sys_p,user,t=0.5):
    llm=_get_llm(t)
    if not llm: return None
    try:
        from langchain_core.messages import SystemMessage,HumanMessage
        return llm.invoke([SystemMessage(content=sys_p),HumanMessage(content=user)]).content
    except Exception as e: print(f"[LLM] {e}"); return None

# ── Agents ──────────────────────────────────────────────────────────────────────
_SYS_FOUNDER = """You are the Sevenforce Concierge — the guide to an AI Workforce platform.
Sevenforce gives any business seven specialised AI employees across two suites:
Growth AI — Maya (content & SEO), Vibe (social media), Wave (WhatsApp & email campaigns).
Agency AI — Nova (proposals, BRD/PRD & test cases), Echo (meeting notes & action items), Scout (AI recruiter), Sage (ask-your-data analytics).
Help the user pick the right AI employee for their goal and explain what each one can do. Keep answers practical, India-context-aware, and under 250 words.
End with: "🤖 Sevenforce — hire your AI workforce."
"""

def run_founder_assistant(message,session_id=""):
    results=search_knowledge(message,3)+search_ventures(message,2)
    ctx="\n\n".join(f"[{r.get('title',r.get('name',''))}]\n{r.get('body',r.get('description',''))}" for r in results[:4])
    ans=_llm(_SYS_FOUNDER,f"Context:\n{ctx}\n\nFounder question: {message}")
    if not ans:
        if results:
            r=results[0]; title=r.get("title") or r.get("name",""); body=r.get("body") or r.get("description","")
            ans = f"**{title}**\n\n{body}\n\n🤖 Sevenforce — hire your AI workforce."
        else:
            ans = "I'm your Sevenforce Concierge. Ask about: AI product strategy, building a startup, the Sevenseed portfolio, pitching to us, or our technology stack.\n\n🤖 Sevenforce — hire your AI workforce."
    return {"reply":ans,"session_id":session_id,"provider":active_provider()}

def ideate_venture(domain, problem, target_market):
    """Recommends which Sevenforce AI employee(s) to start with for a given business goal."""
    ideas=search_ideas(f"{domain} {problem}",3)
    ans=_llm(
        "You are the Sevenforce onboarding guide. Given a business domain and problem, recommend which "
        "1-3 of Sevenforce's 10 AI employees (Maya/content, Vibe/social, Wave/outreach+support, "
        "Nova/docs+QA, Echo/meetings, Scout/recruiting, Sage/data, Atlas/game-design, Pixel/2D-art, "
        "Forge/3D-art) to start with and why, plus a concrete first task for each. Be specific and practical.",
        f"Domain: {domain}\nProblem: {problem}\nTarget market: {target_market}")
    if not ans:
        if ideas:
            parts=[f"**{i['name']}**\nSector: {i['sector']}\nMarket: {i['market']}\nAI angle: {i['ai_angle']}\nFit: {i['fit']}" for i in ideas]
            ans = "**Recommended starting points:**\n\n"+"\n\n---\n\n".join(parts)+"\n\n🤖 Sevenforce — hire your AI workforce."
        else:
            ans = f"For '{domain}' addressing '{problem}', start with Wave for outreach/lead-gen or Nova for internal docs, depending on whether the goal is sales or ops. Talk to Owl at /api/agent/run for a tailored recommendation.\n\n🤖 Sevenforce — hire your AI workforce."
    return {"ideas":ans,"similar":ideas,"provider":active_provider()}

def portfolio_analysis():
    """Narrative overview of Sevenforce's own AI-employee roster (not the sister Sevenseed ventures)."""
    ans=_llm(
        "You are a workforce analyst. Provide a structured overview of this AI-employee roster, grouped by suite.",
        f"Analyze this AI workforce: {[{'name':v['name'],'sector':v['sector'],'stage':v['stage'],'description':v['description']} for v in VENTURES]}"
    )
    if not ans:
        lines=[f"**{v['name']}** ({v['sector']}) — {v['stage']}\n{v['description']}" for v in VENTURES]
        ans = "**Sevenforce AI Workforce:**\n\n"+"\n\n".join(lines)
    return {"analysis":ans,"ventures":VENTURES}


# ── FastAPI setup ─────────────────────────────────────────────────────────────
app=FastAPI(title="Sevenforce — AI Workforce",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def api_key_override_middleware(request, call_next):
    # Header names match what static/app.html's runTool() already sends.
    groq_key_var.set(request.headers.get("x-groq-api-key", ""))
    gemini_key_var.set(request.headers.get("x-gemini-api-key", ""))
    openai_key_var.set(request.headers.get("x-openai-api-key", ""))
    return await call_next(request)

# Initialize SQLite database
db.init()

class FounderReq(BaseModel): 
    message:str
    session_id:str|None=None

class IdeateReq(BaseModel): 
    domain:str
    problem:str=""
    target_market:str=""


# ── API endpoints ─────────────────────────────────────────────────────────────
@app.get("/api/health")
def health(): 
    return {
        "status":"ok",
        "provider":active_provider(),
        "rag_backend":backend_name(),
        "counts":counts(),
        "llm_enabled":active_provider()!="offline"
    }

@app.get("/api/ventures")
def get_ventures(): 
    return {"ventures":VENTURES,"count":len(VENTURES)}

@app.get("/api/ideas")
def get_ideas(): 
    return {"ideas":VENTURE_IDEAS,"count":len(VENTURE_IDEAS)}

@app.post("/api/founder")
def founder(req:FounderReq):
    sid = req.session_id or str(uuid.uuid4())
    result = run_founder_assistant(req.message, sid)
    
    # Save session conversation
    curr = db.get_session(sid)
    msgs = curr["messages"] if curr else []
    msgs.append({"role": "user", "text": req.message})
    msgs.append({"role": "ai", "text": result.get("reply", "")})
    db.save_session(sid, msgs)
    
    return result

@app.post("/api/ideate")
def ideate(req:IdeateReq):
    result = ideate_venture(req.domain, req.problem, req.target_market)
    db.save_pitch(req.domain, req.problem, req.target_market, result.get("ideas", ""))
    return result

@app.get("/api/portfolio")
def portfolio(): 
    return portfolio_analysis()


# ── SQLite database history endpoints ─────────────────────────────────────────
@app.get("/api/history/sessions")
def get_sessions(limit: int = 50):
    return {"sessions": db.list_sessions(limit)}

@app.delete("/api/history/sessions/{session_id}")
def delete_session(session_id: str):
    success = db.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True}

@app.get("/api/history/pitches")
def get_pitches(limit: int = 50):
    return {"pitches": db.list_pitches(limit)}

@app.delete("/api/history/pitches/{item_id}")
def delete_pitch(item_id: int):
    success = db.delete_pitch(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Pitch not found")
    return {"success": True}


# ── Static frontend mounting ──────────────────────────────────────────────────
# Enterprise features: auth, AI tools, analytics, export, reminders
from features import router as _feat_router
app.include_router(_feat_router)

@app.get("/app")
def _sf_dashboard():
    return FileResponse(str(config.STATIC_DIR / "app.html"))

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

if __name__=="__main__":
    import uvicorn
    port=int(os.environ.get("PORT",8000))
    print(f"[Sevenforce] provider={active_provider()} | db={config.DB_PATH}")
    uvicorn.run(app,host="0.0.0.0",port=port)
