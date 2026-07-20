# -*- coding: utf-8 -*-
"""
Sevenseed — Combined backend (RAG + Agents + FastAPI) with SQLite persistence.
Serves Next.js static site and AI venture ideation + founder counseling APIs.
"""
from __future__ import annotations
import os, sys, math, re, uuid
from typing import List, Dict, Any
import operator

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
VENTURES = [
    {"name": "Comonk Technology", "sector": "AI Career Intelligence", "stage": "Live", "color": "indigo",
     "ai_stack": "LangGraph multi-agent, Groq LLaMA 3.3 70B, ChromaDB RAG, FastAPI",
     "url": "https://comonk-ai.onrender.com",
     "description": "Enterprise AI career platform — multi-agent counselors, ATS optimizer, mock interviews."},
    {"name": "Alpaben Vipulbhai Patel University", "sector": "AI Education", "stage": "Building", "color": "blue",
     "ai_stack": "Groq LLaMA, Adaptive ML, RAG Embeddings, NLP Assessment, AI Agent",
     "description": "AI-powered university — personal AI tutor, adaptive learning, AI placement matching."},
    {"name": "Decode Forest Pharmacy", "sector": "AI Healthcare", "stage": "Building", "color": "emerald",
     "ai_stack": "OCR+Vision (prescription), LLM drug interactions, Recommender, Groq LLaMA, ML Forecasting",
     "description": "AI pharmacy — reads prescriptions, checks drug interactions, predicts refills."},
    {"name": "Breakdown Factor Construction", "sector": "AI Construction", "stage": "Building", "color": "amber",
     "ai_stack": "Computer Vision (YOLO safety), ML Forecasting, LangGraph Copilot, LLM+Vision defect detection",
     "description": "AI-driven construction — site safety monitoring, cost forecasting, defect detection."},
    {"name": "AVP Charitable Trust", "sector": "AI Social Impact", "stage": "Building", "color": "rose",
     "ai_stack": "ML Analytics (needs), RAG Embeddings (beneficiary matching), LLM Reports, Anomaly Detection",
     "description": "AI for good — finds where help matters, matches beneficiaries, transparent impact reporting."},
    {"name": "AVP Emart", "sector": "AI E-Commerce", "stage": "Live", "color": "orange",
     "ai_stack": "Live price aggregation, ML scoring, Groq LLaMA shopping assistant, NLP reviews",
     "url": "https://price-com-7.streamlit.app/",
     "description": "AI smart-shopping — compares live prices, ML best-value scoring, LLM assistant."},
]

STUDIO_KNOWLEDGE = [
    ("Sevenseed — About", "Sevenseed is an AI-native startup studio that ideates, incubates, and launches AI ventures. All 7 ventures share a common AI backbone: LLM gateway, vector store, and multi-agent framework. Founded 2026 in Ahmedabad, Gujarat."),
    ("Shared AI Stack", "Every venture uses: Groq LLaMA 3.3 70B (primary LLM) with Gemini/GPT-4o-mini fallback, LangGraph multi-agent workflows, ChromaDB/FAISS vector RAG, MiniLM embeddings, FastAPI backend, React/Next.js or HTML frontend. Deployed on Render/HF Spaces via Docker."),
    ("Venture Ideation Process", "Step 1 — Market research: LLM scans industry pain points and whitespace opportunities. Step 2 — Feasibility: AI-assisted technical + business model assessment. Step 3 — Prototype: 2-week sprint to ship MVP. Step 4 — Incubate: join the Sevenseed shared AI platform. Step 5 — Launch & grow."),
    ("How to Pitch to Sevenseed", "We evaluate: (1) AI-first — AI must be the core product, not a feature. (2) Real problem — validated pain point with identifiable market. (3) Founder capability — technical or domain expertise. (4) Fit with portfolio — complementary, not competitive with existing ventures. Email: hello@sevenseed.in"),
    ("Cross-Portfolio Synergies", "AI stack shared → each new venture ships AI in weeks not months. Comonk → all ventures (IT services). Decode Forest → AVPU (pharmacy on campus). Breakdown Factor → AVPU (campus construction). AVP Trust → AVPU (scholarships). Emart → Decode Forest (medicine e-commerce)."),
    ("Business Model", "Revenue streams: (1) SaaS subscriptions from each venture product. (2) AI consulting/development for external companies via Comonk. (3) CSR partnerships via AVP Trust. (4) E-commerce GMV via AVP Emart. Studio-level: advisory fees + equity in incubated startups."),
    ("AI Ethics Policy", "Sevenseed commits to: transparent AI (no hallucination claims), offline-capable products (work without API keys), privacy-first data handling, human-in-the-loop for high-stakes decisions (medical, safety, financial), and bias audit before any ML model deployment."),
    ("Technology Investment Thesis", "We invest in AI applications, not AI infrastructure. Focus: industries underserved by AI in India — education, pharmacy, construction, social sector. Every product is live-deployable: Docker + Render/HF Spaces = global reach from day one."),
]

VENTURE_IDEAS = [
    {"name": "AgriAI — Smart Farming", "sector": "Agriculture", "market": "₹1.5T India agri sector",
     "ai_angle": "Crop disease detection (Computer Vision), weather-based planting AI, market price predictor, yield forecaster",
     "fit": "High — Gujarat agriculture base, aligns with AVP Trust rural programs"},
    {"name": "LegalAI — Document Automation", "sector": "Legal Tech", "market": "₹30,000 Cr India legal market",
     "ai_angle": "AI contract drafting, clause extractor, legal research RAG, court date tracker",
     "fit": "High — Comonk AI stack reusable, B2B SaaS model"},
    {"name": "FinBot — SME Finance AI", "sector": "FinTech", "market": "₹25L Cr India MSME credit gap",
     "ai_angle": "AI credit scoring (alternative data), cash flow predictor, tax assistant, GST analyzer",
     "fit": "Medium-High — complements Emart B2B sellers"},
    {"name": "TravelAI — Itinerary Planner", "sector": "Travel Tech", "market": "$1.5T global travel",
     "ai_angle": "LLM itinerary generation, RAG local knowledge base, price aggregation, visa AI assistant",
     "fit": "Medium — proven consumer AI pattern"},
    {"name": "HRBot — AI Recruitment", "sector": "HR Tech", "market": "₹8,000 Cr India HR tech",
     "ai_angle": "JD matching (Comonk tech reuse), interview AI, culture fit scorer, onboarding assistant",
     "fit": "Very High — can spin out of Comonk as standalone product"},
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
def _get_llm(t=0.5):
    if os.environ.get("GROQ_API_KEY","").strip():
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(api_key=os.environ["GROQ_API_KEY"],model=os.environ.get("GROQ_MODEL","llama-3.3-70b-versatile"),temperature=t)
        except: pass
    if os.environ.get("GEMINI_API_KEY","").strip():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(google_api_key=os.environ["GEMINI_API_KEY"],model="gemini-1.5-flash",temperature=t)
        except: pass
    if os.environ.get("OPENAI_API_KEY","").strip():
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(api_key=os.environ["OPENAI_API_KEY"],model="gpt-4o-mini",temperature=t)
        except: pass
    return None

def active_provider():
    if os.environ.get("GROQ_API_KEY","").strip(): return f"Groq ({os.environ.get('GROQ_MODEL','llama-3.3-70b-versatile')})"
    if os.environ.get("GEMINI_API_KEY","").strip(): return "Google Gemini 1.5 Flash"
    if os.environ.get("OPENAI_API_KEY","").strip(): return "OpenAI GPT-4o-mini"
    return "offline"

def _llm(sys_p,user,t=0.5):
    llm=_get_llm(t)
    if not llm: return None
    try:
        from langchain_core.messages import SystemMessage,HumanMessage
        return llm.invoke([SystemMessage(content=sys_p),HumanMessage(content=user)]).content
    except Exception as e: print(f"[LLM] {e}"); return None

# ── Agents ──────────────────────────────────────────────────────────────────────
_SYS_FOUNDER = """You are the Sevenseed Founder AI Assistant — an expert startup advisor for AI-first ventures.
You advise on: business models, AI product strategy, go-to-market, fundraising, team building, and technology choices.
Draw on the Sevenseed portfolio (Comonk, AVPU, Decode Forest, Breakdown Factor, AVP Trust, AVP Emart) as real-world examples.
Keep responses practical, India-context-aware, and under 300 words.
End with: "🌱 Sevenseed — planting AI seeds that grow into forests."
"""

def run_founder_assistant(message,session_id=""):
    results=search_knowledge(message,3)+search_ventures(message,2)
    ctx="\n\n".join(f"[{r.get('title',r.get('name',''))}]\n{r.get('body',r.get('description',''))}" for r in results[:4])
    ans=_llm(_SYS_FOUNDER,f"Context:\n{ctx}\n\nFounder question: {message}")
    if not ans:
        if results:
            r=results[0]; title=r.get("title") or r.get("name",""); body=r.get("body") or r.get("description","")
            ans = f"**{title}**\n\n{body}\n\n🌱 Sevenseed — planting AI seeds that grow into forests."
        else:
            ans = "I'm your Sevenseed Founder AI. Ask about: AI product strategy, building a startup, the Sevenseed portfolio, pitching to us, or our technology stack.\n\n🌱 Sevenseed — planting AI seeds that grow into forests."
    return {"reply":ans,"session_id":session_id,"provider":active_provider()}

def ideate_venture(domain, problem, target_market):
    ideas=search_ideas(f"{domain} {problem}",3)
    ans=_llm(
        "You are an AI Venture Ideation expert at Sevenseed — an AI-first startup studio. "
        "Given a domain and problem, generate 3 distinct AI-native venture ideas. "
        "For each: Name, Tagline, AI stack (specific models/tools), revenue model, "
        "estimated market size, competitive moat, and 90-day MVP plan. "
        "Focus on India market. Be specific and practical.",
        f"Domain: {domain}\nProblem: {problem}\nTarget market: {target_market}")
    if not ans:
        if ideas:
            parts=[f"**{i['name']}**\nSector: {i['sector']}\nMarket: {i['market']}\nAI angle: {i['ai_angle']}\nFit: {i['fit']}" for i in ideas]
            ans = "**Similar venture ideas from our pipeline:**\n\n"+"\n\n---\n\n".join(parts)+"\n\n🌱 Contact us to explore incubation."
        else:
            ans = f"For '{domain}' addressing '{problem}', AI can be applied to: automation of repetitive tasks, intelligent decision support, personalized user experiences, and predictive analytics. Contact hello@sevenseed.in with your idea and we'll assess fit within 48 hours.\n\n🌱 Sevenseed — planting AI seeds that grow into forests."
    return {"ideas":ans,"similar":ideas,"provider":active_provider()}

def portfolio_analysis():
    ans=_llm(
        "You are a venture studio analyst. Provide a structured portfolio overview.",
        f"Analyze this portfolio of AI ventures: {[{'name':v['name'],'sector':v['sector'],'stage':v['stage'],'description':v['description']} for v in VENTURES]}"
    )
    if not ans:
        lines=[f"**{v['name']}** ({v['sector']}) — {v['stage']}\n{v['description']}" for v in VENTURES]
        ans = "**Sevenseed Portfolio:**\n\n"+"\n\n".join(lines)
    return {"analysis":ans,"ventures":VENTURES}


# ── FastAPI setup ─────────────────────────────────────────────────────────────
app=FastAPI(title="Sevenseed AI Venture Studio",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Import child routers
from routers.comonk import router as comonk_router
from routers.avp_emart import router as avp_emart_router
from routers.avpu import router as avpu_router
from routers.breakdown import router as breakdown_router
from routers.trust import router as trust_router
from routers.pharmacy import router as pharmacy_router
from routers.sevenforce import router as sevenforce_router

# Include child routers with prefixes
app.include_router(comonk_router, prefix="/comonk")
app.include_router(avp_emart_router, prefix="/avp-emart")
app.include_router(avpu_router, prefix="/avpu")
app.include_router(breakdown_router, prefix="/breakdown")
app.include_router(trust_router, prefix="/trust")
app.include_router(pharmacy_router, prefix="/pharmacy")
app.include_router(sevenforce_router, prefix="/sevenforce")

if config.STATIC_DIR.exists():
    # Mount child static folders first
    for path_prefix, folder_name in [
        ("/comonk", "comonk"),
        ("/avp-emart", "avp-emart"),
        ("/avpu", "avpu"),
        ("/breakdown", "breakdown"),
        ("/trust", "trust"),
        ("/pharmacy", "pharmacy"),
        ("/sevenforce", "sevenforce"),
    ]:
        static_sub = config.STATIC_DIR / folder_name
        if static_sub.exists():
            app.mount(path_prefix, StaticFiles(directory=str(static_sub), html=True), name=folder_name)
    
    # Mount root landing page last
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
    print(f"[Sevenseed] provider={active_provider()} | db={config.DB_PATH}")
    uvicorn.run(app,host="0.0.0.0",port=port)
