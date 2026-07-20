# -*- coding: utf-8 -*-
"""
AVP Charitable Trust — Combined backend (RAG + Agents + FastAPI) with SQLite persistence.
Serves Next.js static site and handles NGO needs assessments, donor counseling, and volunteer logs.
"""
from __future__ import annotations
import os, sys, math, re, uuid
from typing import List, Dict, Any, TypedDict, Annotated
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
import main as backend_main

try: 
    from dotenv import load_dotenv; load_dotenv()
except: 
    pass

# ── RAG ───────────────────────────────────────────────────────────────────────
_WORD = re.compile(r"[a-z0-9+#.]+")
def _tokens(t): return _WORD.findall(t.lower())

_BACKEND="overlap"; _st=None
try:
    from sentence_transformers import SentenceTransformer  # type: ignore
    import numpy as _np; _st=SentenceTransformer("all-MiniLM-L6-v2"); _BACKEND="embeddings"
except:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
        from sklearn.metrics.pairwise import linear_kernel  # type: ignore
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

_kidx=_pidx=_midx=None
def _load():
    global _kidx,_pidx,_midx
    if _kidx is not None: return
    from trust_data import TRUST_KNOWLEDGE,PROGRAMS,IMPACT_METRICS
    _kidx=Index([f"{t}. {t}. {b}" for t,b in TRUST_KNOWLEDGE],[{"title":t,"body":b} for t,b in TRUST_KNOWLEDGE])
    _pidx=Index([f"{p['name']} {p['beneficiary']} {p.get('eligibility','')} {p.get('district','')}" for p in PROGRAMS],list(PROGRAMS))
    _midx=Index([f"{m['metric']} {m['value']} {m['unit']}" for m in IMPACT_METRICS],list(IMPACT_METRICS))
    print(f"[RAG] trust indexes ready via {backend_name()}")

def search_knowledge(q,n=4): _load(); return _kidx.search(q,n)
def search_programs(q,n=4): _load(); return _pidx.search(q,n)
def search_metrics(q,n=4): _load(); return _midx.search(q,n)
def counts():
    from trust_data import TRUST_KNOWLEDGE,PROGRAMS,IMPACT_METRICS
    return {"knowledge":len(TRUST_KNOWLEDGE),"programs":len(PROGRAMS),"metrics":len(IMPACT_METRICS)}

# ── LLM ───────────────────────────────────────────────────────────────────────
from app.api_keys import groq_key_var, gemini_key_var, openai_key_var


def _groq_key(): return groq_key_var.get().strip() or os.environ.get("GROQ_API_KEY", "").strip()
def _gemini_key(): return gemini_key_var.get().strip() or os.environ.get("GEMINI_API_KEY", "").strip()
def _openai_key(): return openai_key_var.get().strip() or os.environ.get("OPENAI_API_KEY", "").strip()


def _get_llm(t=0.4):
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
    if _groq_key(): return f"Groq ({os.environ.get('GROQ_MODEL','llama-3.3-70b-versatile')})"
    if _gemini_key(): return "Google Gemini 1.5 Flash"
    if _openai_key(): return "OpenAI GPT-4o-mini"
    return "offline"

def _llm(sys_prompt,user,t=0.4):
    llm=_get_llm(t)
    if not llm: return None
    try:
        from langchain_core.messages import SystemMessage,HumanMessage
        return llm.invoke([SystemMessage(content=sys_prompt),HumanMessage(content=user)]).content
    except Exception as e: print(f"[LLM] {e}"); return None

# ── Agents ────────────────────────────────────────────────────────────────────
_SYS_DONOR = """You are a helpful donor assistant for AVP Charitable Trust, a registered non-profit in Gujarat, India.
Answer questions about: donation process, 80G tax benefits, CSR partnerships, our programs, impact reports, volunteering.
Be warm, transparent, and factual. Keep responses under 250 words.
Always end with: "💚 Every rupee reaches the community — thank you for your generosity."
"""
def run_donor_assistant(message,session_id=""):
    results=search_knowledge(message,3)+search_programs(message,2)
    ctx="\n\n".join(f"[{r.get('title',r.get('name',''))}]\n{r.get('body',r.get('eligibility',''))}" for r in results[:4])
    ans=_llm(_SYS_DONOR,f"Context:\n{ctx}\n\nQuestion: {message}")
    if not ans:
        if results:
            r=results[0]; title=r.get("title") or r.get("name",""); body=r.get("body") or r.get("eligibility","")
            ans = f"**{title}**\n\n{body}\n\n💚 Every rupee reaches the community — thank you for your generosity."
        else:
            ans = "I'm here to help with information about donations, programs, tax benefits, and volunteering. What would you like to know?\n\n💚 Every rupee reaches the community — thank you for your generosity."
    return {"reply":ans,"session_id":session_id,"provider":active_provider()}

def assess_needs(location,population,issues,income_level):
    results=search_programs(f"{issues} {location}",4)
    ans=_llm("You are an AI Needs Assessment specialist for NGOs in Gujarat, India. "
             "Given community data, identify priority intervention areas, recommended programs, and estimated budget.",
             f"Location: {location}\nPopulation: {population}\nMain issues: {issues}\nIncome level: {income_level}")
    if not ans:
        matched=[r["name"] for r in results[:3]]
        ans = (f"**Needs assessment for {location}:**\n\n"
               f"Population: {population}\nKey issues: {issues}\nIncome level: {income_level}\n\n"
               f"**Recommended programs:** {', '.join(matched) if matched else 'General welfare programs'}\n\n"
               "💚 Our field officer will contact you within 3 days to conduct an on-ground assessment.")
    return {"result":ans,"programs":results,"provider":active_provider()}

def match_beneficiary(name,age,location,issues,income):
    results=search_programs(f"{issues} {location} {income}",4)
    ans=_llm("You are an AI Beneficiary Matcher for AVP Charitable Trust. "
             "Given beneficiary profile, identify the best matching programs with eligibility check.",
             f"Name: {name}\nAge: {age}\nLocation: {location}\nNeeds: {issues}\nFamily income: {income}")
    if not ans:
        if results:
            parts=[f"✅ **{r['name']}**\nBeneficiary: {r['beneficiary']}\nEligibility: {r.get('eligibility','')}" for r in results[:3]]
            ans = f"**Programs matched for {name}:**\n\n"+"\n\n".join(parts)+"\n\n💚 Our team will verify eligibility and process the application within 7 days."
        else:
            ans = f"No exact match found for '{issues}' in '{location}'. Our field team will conduct a personal interview to assess eligibility."
    return {"result":ans,"matched":results,"provider":active_provider()}

def generate_impact_report(period="2024-25"):
    from trust_data import IMPACT_METRICS,PROGRAMS
    ans=_llm("You are a professional NGO impact report writer. Generate a concise, compelling quarterly impact report in structured format including: executive summary, beneficiaries served, funds utilized, key achievements, and outlook.",
             f"Period: {period}\nMetrics: {[m for m in IMPACT_METRICS]}\nPrograms: {[p['name'] for p in PROGRAMS]}")
    if not ans:
        lines=[f"• {m['metric']}: **{m['value']} {m['unit']}**" for m in IMPACT_METRICS]
        ans = (f"**AVP Charitable Trust — Impact Report {period}**\n\n"
               "**At a glance:**\n" + "\n".join(lines) + "\n\n"
               "All funds received are utilized for direct program delivery. "
               "Audited accounts and utilization certificates available on request.\n\n"
               "💚 Thank you to all donors and volunteers who make this possible.")
    return {"report":ans,"provider":active_provider()}


# ── FastAPI setup ─────────────────────────────────────────────────────────────
app=FastAPI(title="AVP Charitable Trust AI",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def api_key_override_middleware(request, call_next):
    groq_key_var.set(request.headers.get("x-groq-api-key", ""))
    gemini_key_var.set(request.headers.get("x-gemini-api-key", ""))
    openai_key_var.set(request.headers.get("x-openai-api-key", ""))
    return await call_next(request)

# Initialize SQLite database
db.init()
try:
    from campaign_manager import init_campaign_db
    init_campaign_db()
except Exception as e:
    print(f"Error initializing campaign DB: {e}")

class DonorReq(BaseModel): 
    message:str
    session_id:str|None=None

class NeedsReq(BaseModel): 
    location:str
    population:str=""
    issues:str=""
    income_level:str="mixed"

class BeneficiaryReq(BaseModel): 
    name:str
    age:str=""
    location:str=""
    issues:str=""
    income:str=""

class ImpactReq(BaseModel): 
    period:str="2024-25"

class CampaignSendReq(BaseModel):
    email: str
    subject: str
    body: str


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

@app.get("/api/programs")
def get_programs():
    from trust_data import PROGRAMS,IMPACT_METRICS
    return {"programs":PROGRAMS,"metrics":IMPACT_METRICS}

@app.post("/api/donor")
def donor(req:DonorReq):
    sid = req.session_id or str(uuid.uuid4())
    result = run_donor_assistant(req.message, sid)
    
    # Save conversation state in SQLite
    curr = db.get_session(sid)
    msgs = curr["messages"] if curr else []
    msgs.append({"role": "user", "text": req.message})
    msgs.append({"role": "ai", "text": result.get("reply", "")})
    db.save_session(sid, msgs)
    
    return result

@app.post("/api/needs")
def needs(req:NeedsReq):
    result = assess_needs(req.location, req.population, req.issues, req.income_level)
    db.save_needs_assessment(req.location, req.population, req.issues, result.get("result", ""))
    return result

@app.post("/api/beneficiary")
def beneficiary(req:BeneficiaryReq):
    result = match_beneficiary(req.name, req.age, req.location, req.issues, req.income)
    db.save_beneficiary_match(req.name, req.age, req.location, req.issues, result.get("result", ""))
    return result

@app.post("/api/impact")
def impact(req:ImpactReq): 
    return generate_impact_report(req.period)

@app.post("/api/campaign/send")
def campaign_send(req: CampaignSendReq):
    try:
        import sqlite3
        from campaign_manager import send_donor_email
        msg_id = send_donor_email(req.email, req.subject, req.body)
        
        conn = sqlite3.connect("db.sqlite3")
        conn.execute(
            "INSERT INTO campaign_sent_logs (campaign_id, email, message_id, status, created_at) VALUES (?,?,?,?,?)",
            (1, req.email, msg_id, "sent", datetime.datetime.utcnow().isoformat())
        )
        conn.commit()
        conn.close()
        return {"status": "success", "message_id": msg_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/campaign/poll")
def campaign_poll():
    try:
        from campaign_manager import track_donor_replies
        track_donor_replies()
        return {"status": "success", "message": "Checked and logged replies."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── SQLite database history endpoints ─────────────────────────────────────────
@app.get("/api/history/donor")
def get_donor_sessions(limit: int = 50):
    return {"sessions": db.list_sessions(limit)}

@app.delete("/api/history/donor/{session_id}")
def delete_donor_session(session_id: str):
    success = db.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True}

@app.get("/api/history/needs")
def get_needs_assessments(limit: int = 50):
    return {"needs": db.list_needs_assessments(limit)}

@app.delete("/api/history/needs/{item_id}")
def delete_needs_assessment(item_id: int):
    success = db.delete_needs_assessment(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"success": True}

@app.get("/api/history/beneficiaries")
def get_beneficiary_matches(limit: int = 50):
    return {"matches": db.list_beneficiary_matches(limit)}

@app.delete("/api/history/beneficiaries/{item_id}")
def delete_beneficiary_match(item_id: int):
    success = db.delete_beneficiary_match(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Match not found")
    return {"success": True}


# Include custom features (auth, 80G receipts, volunteering, reminders)
from features import router as feat_router
app.include_router(feat_router)


# ── Static frontend mounting ──────────────────────────────────────────────────
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

if __name__=="__main__":
    import uvicorn
    port=int(os.environ.get("PORT",8000))
    print(f"[AVP Trust] provider={active_provider()} | db={config.DB_PATH}")
    uvicorn.run(app,host="0.0.0.0",port=port)
