# -*- coding: utf-8 -*-
"""Sevenseed — enterprise feature router (auth, AI tools, analytics, export, reminders)."""
from __future__ import annotations
import os, json, datetime, hashlib, hmac, secrets, sqlite3, html as _html
from itsdangerous import URLSafeTimedSerializer
from fastapi import APIRouter, Header
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

_HERE = os.path.dirname(os.path.abspath(__file__))
try:
    from app import config as _cfg; DB_PATH = _cfg.DB_PATH
except Exception:
    DB_PATH = os.path.join(_HERE, "db.sqlite3")

BRAND = {"emoji": "🌱", "name": "Sevenseed", "sub": "AI Venture Studio", "p": "#6366f1", "s": "#a855f7"}

def _get_llm(t=0.5):
    if os.environ.get("GROQ_API_KEY", "").strip():
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(api_key=os.environ["GROQ_API_KEY"], model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"), temperature=t)
        except Exception: pass
    if os.environ.get("GEMINI_API_KEY", "").strip():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(google_api_key=os.environ["GEMINI_API_KEY"], model="gemini-1.5-flash", temperature=t)
        except Exception: pass
    if os.environ.get("OPENAI_API_KEY", "").strip():
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(api_key=os.environ["OPENAI_API_KEY"], model="gpt-4o-mini", temperature=t)
        except Exception: pass
    return None

def active_provider():
    for k, n in [("GROQ_API_KEY", f"Groq ({os.environ.get('GROQ_MODEL','llama-3.3-70b-versatile')})"),
                 ("GEMINI_API_KEY", "Google Gemini 1.5 Flash"), ("OPENAI_API_KEY", "OpenAI GPT-4o-mini")]:
        if os.environ.get(k, "").strip(): return n
    return "offline"

def _llm(system, user, t=0.5):
    from langchain_core.messages import SystemMessage, HumanMessage
    m = _get_llm(t)
    if m:
        try: return m.invoke([SystemMessage(content=system), HumanMessage(content=user)]).content
        except Exception as e: print(f"[llm] primary: {e}")
    key = os.environ.get("MISTRAL_API_KEY", "").strip()
    if not key: return None
    try:
        import json as _j, urllib.request as _u
        body = _j.dumps({"model": os.environ.get("MISTRAL_MODEL", "mistral-small-latest"),
                         "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}], "temperature": t}).encode()
        req = _u.Request("https://api.mistral.ai/v1/chat/completions", data=body,
                         headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"})
        with _u.urlopen(req, timeout=30) as resp:
            return _j.loads(resp.read())["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[llm] mistral: {e}")
    return None

_SER = URLSafeTimedSerializer(os.environ.get("AUTH_SECRET", "sevenseed-dev-secret"), salt="sevenseed-auth")
_MAXAGE = 60 * 60 * 24 * 30
def _c():
    c = sqlite3.connect(DB_PATH); c.row_factory = sqlite3.Row; return c
def _init():
    try:
        with _c() as c:
            c.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT UNIQUE, pw_hash TEXT, pw_salt TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, title TEXT, remind_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS ideas (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, title TEXT, sector TEXT, notes TEXT)")
    except Exception as e: print(f"[features] init {e}")
def _hash(pw, salt=None):
    salt = salt or secrets.token_hex(16)
    return hashlib.pbkdf2_hmac("sha256", pw.encode(), bytes.fromhex(salt), 200000).hex(), salt
def _signup(name, email, pw):
    email = (email or "").strip().lower()
    if "@" not in email: return {"error": "Enter a valid email."}
    if len(pw or "") < 6: return {"error": "Password must be 6+ characters."}
    h, s = _hash(pw)
    try:
        with _c() as c:
            uid = c.execute("INSERT INTO users (created_at,name,email,pw_hash,pw_salt) VALUES (?,?,?,?,?)",
                            (datetime.datetime.utcnow().isoformat(), (name or "Founder").strip(), email, h, s)).lastrowid
    except sqlite3.IntegrityError: return {"error": "Account already exists. Please log in."}
    return {"token": _SER.dumps({"uid": uid}), "user": {"id": uid, "name": (name or "Founder").strip(), "email": email}}
def _login(email, pw):
    email = (email or "").strip().lower()
    with _c() as c: r = c.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not r: return {"error": "No account with this email."}
    h, _ = _hash(pw, r["pw_salt"])
    if not hmac.compare_digest(h, r["pw_hash"]): return {"error": "Incorrect password."}
    return {"token": _SER.dumps({"uid": r["id"]}), "user": {"id": r["id"], "name": r["name"], "email": email}}
def _verify(tok):
    if not tok: return None
    try: d = _SER.loads(tok, max_age=_MAXAGE)
    except Exception: return None
    with _c() as c: r = c.execute("SELECT id,name,email FROM users WHERE id=?", (d.get("uid"),)).fetchone()
    return dict(r) if r else None

def _overview():
    with _c() as c:
        tables = [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
        counts, dates = {}, []
        for t in tables:
            try: counts[t] = c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            except Exception: counts[t] = 0
            try:
                cols = [x[1] for x in c.execute(f"PRAGMA table_info({t})")]
                if "created_at" in cols: dates += [r[0][:10] for r in c.execute(f"SELECT created_at FROM {t}") if r[0]]
            except Exception: pass
    today = datetime.date.today()
    timeline = [{"date": (today - datetime.timedelta(days=i)).isoformat(),
                 "count": dates.count((today - datetime.timedelta(days=i)).isoformat())} for i in range(13, -1, -1)]
    return {"counts": counts, "timeline": timeline, "total": sum(counts.values())}

# ── Domain tools ──────────────────────────────────────────────────────────────
def _pitch_deck(idea, sector=""):
    ans = _llm("You are a startup pitch coach. Draft a concise 8-slide pitch deck outline (Problem, Solution, Market, "
               "Product, Business Model, Traction, Team, Ask) with 1-2 bullet points per slide.", f"Idea: {idea}\nSector: {sector}")
    if ans: return {"result": ans, "provider": active_provider()}
    slides = [("Problem", "The core pain point your customers face today."),
              ("Solution", f"How {idea} solves it with AI at the core."),
              ("Market", f"The {sector or 'target'} market size and growth."),
              ("Product", "Key features and the AI that powers them."),
              ("Business Model", "How you make money (SaaS, marketplace, etc.)."),
              ("Traction", "Early signals: users, pilots, revenue."),
              ("Team", "Why this team wins — backed by Sevenseed's shared AI stack."),
              ("The Ask", "Funding sought and how it accelerates growth.")]
    return {"result": "**Pitch Deck Outline:**\n\n" + "\n\n".join(f"**{i+1}. {t}**\n• {d}" for i, (t, d) in enumerate(slides))
                       + "\n\nAdd a free GROQ_API_KEY for a fully written, tailored deck.", "provider": active_provider()}

def _canvas(idea):
    ans = _llm("You are a business strategist. Fill a Business Model Canvas as strict JSON with keys: "
               "key_partners, key_activities, key_resources, value_propositions, customer_relationships, channels, "
               "customer_segments, cost_structure, revenue_streams. Each value is a short string.", f"Idea: {idea}")
    if ans:
        try:
            data = json.loads(ans[ans.find("{"): ans.rfind("}") + 1])
            if data: return {"canvas": data, "provider": active_provider()}
        except Exception: pass
    canvas = {
        "key_partners": "Sevenseed studio, tech & data providers, industry partners",
        "key_activities": "AI product development, sales, customer success",
        "key_resources": "Shared AI stack (LangGraph, RAG), team, data",
        "value_propositions": f"{idea} — AI-native solution that saves time and money",
        "customer_relationships": "Self-serve + high-touch onboarding",
        "channels": "Web app, direct sales, group cross-referrals",
        "customer_segments": "Target users in the chosen sector",
        "cost_structure": "Engineering, cloud/LLM, GTM",
        "revenue_streams": "Subscriptions, transactions, or services",
    }
    return {"canvas": canvas, "provider": active_provider()}

def _market_research(sector):
    ans = _llm("You are a market analyst. Give a concise market snapshot: size & growth, key trends, main competitors, "
               "and the AI opportunity.", f"Sector: {sector}")
    if ans: return {"result": ans, "provider": active_provider()}
    return {"result": (f"**Market snapshot — {sector}:**\n\n"
                       "• **Size & growth:** A large, growing market in India ripe for AI disruption.\n"
                       "• **Trends:** Digital adoption, mobile-first users, demand for automation.\n"
                       "• **Competition:** Fragmented incumbents with limited AI.\n"
                       "• **AI opportunity:** Build an AI-native product to win on speed, cost and experience.\n\n"
                       "Add a free GROQ_API_KEY for a detailed, data-driven analysis."),
            "provider": active_provider()}

def _report_html(title, subtitle, sections):
    esc = _html.escape
    secs = "".join(f"<section><h2>{esc(str(s.get('heading','')))}</h2><div>{esc(str(s.get('body',''))).replace(chr(10),'<br>')}</div></section>" for s in sections)
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>{esc(title)}</title><style>
body{{font-family:'Segoe UI',system-ui,sans-serif;max-width:820px;margin:0 auto;padding:40px;color:#1a1a2e;line-height:1.6}}
.brand{{display:flex;align-items:center;gap:12px;border-bottom:3px solid {BRAND['p']};padding-bottom:16px}}
.logo{{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,{BRAND['p']},{BRAND['s']});color:#fff;display:grid;place-items:center;font-size:22px}}
h1{{font-size:22px;margin:0}} .sub{{color:#667;margin:6px 0 22px}}
h2{{color:{BRAND['p']};font-size:17px;margin:20px 0 6px;border-left:4px solid {BRAND['s']};padding-left:10px}}
section div{{background:#f6f7fb;border-radius:10px;padding:14px 16px}}
.foot{{margin-top:32px;padding-top:14px;border-top:1px solid #ddd;color:#889;font-size:13px;display:flex;justify-content:space-between}}
.print{{position:fixed;top:16px;right:16px;background:{BRAND['p']};color:#fff;border:0;border-radius:8px;padding:10px 16px;cursor:pointer}}
@media print{{.print{{display:none}}body{{padding:0}}}}</style></head><body>
<button class="print" onclick="window.print()">🖨 Save as PDF</button>
<div class="brand"><div class="logo">{BRAND['emoji']}</div><h1>{esc(title)}</h1></div>
<p class="sub">{esc(subtitle)}</p>{secs}
<div class="foot"><span>{BRAND['name']} · {BRAND['sub']}</span><span>{datetime.date.today().isoformat()}</span></div></body></html>"""

router = APIRouter()
_init()
class SignupReq(BaseModel): name: str = ""; email: str; password: str
class LoginReq(BaseModel): email: str; password: str
class PitchReq(BaseModel): idea: str; sector: str = ""
class CanvasReq(BaseModel): idea: str
class MarketReq(BaseModel): sector: str
class IdeaReq(BaseModel): email: str = ""; title: str; sector: str = ""; notes: str = ""
class ReportReq(BaseModel): title: str; subtitle: str = ""; sections: list[dict] = []
class ReminderReq(BaseModel): email: str; title: str; remind_at: str = ""

@router.post("/api/auth/signup")
def signup(r: SignupReq):
    res = _signup(r.name, r.email, r.password); return JSONResponse(res, status_code=400 if "error" in res else 200)
@router.post("/api/auth/login")
def login(r: LoginReq):
    res = _login(r.email, r.password); return JSONResponse(res, status_code=401 if "error" in res else 200)
@router.get("/api/auth/me")
def me(authorization: str = Header(None)):
    return {"user": _verify(authorization.replace("Bearer ", "").strip() if authorization else None)}

@router.post("/api/tools/pitch-deck")
def pitch_deck(r: PitchReq): return _pitch_deck(r.idea, r.sector)
@router.post("/api/tools/canvas")
def canvas(r: CanvasReq): return _canvas(r.idea)
@router.post("/api/tools/market-research")
def market_research(r: MarketReq): return _market_research(r.sector)

@router.post("/api/ideas")
def add_idea(r: IdeaReq):
    with _c() as c:
        c.execute("INSERT INTO ideas (created_at,email,title,sector,notes) VALUES (?,?,?,?,?)",
                  (datetime.datetime.utcnow().isoformat(), r.email, r.title, r.sector, r.notes))
    return {"saved": True}
@router.get("/api/ideas")
def list_ideas(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM ideas" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"ideas": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

@router.get("/api/analytics/overview")
def analytics(): return _overview()
@router.post("/api/export/report")
def export_report(r: ReportReq): return HTMLResponse(_report_html(r.title, r.subtitle, r.sections))

class DocxExportReq(BaseModel):
    markdown: str
    doc_type: str = "PRD"
    project_name: str = "Sevenseed Project"

@router.post("/api/tools/export-docx")
def export_docx(r: DocxExportReq):
    try:
        from docx_builder import build_docx
        from fastapi.responses import StreamingResponse
        
        buf = build_docx(r.markdown, r.doc_type, r.project_name)
        filename = f"{r.project_name.lower().replace(' ', '_')}_{r.doc_type.lower()}.docx"
        headers = {
            "Content-Disposition": f"attachment; filename={filename}"
        }
        return StreamingResponse(
            buf,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers=headers
        )
    except Exception as e:
        return JSONResponse({"error": f"Failed to build Word document: {e}"}, status_code=500)

@router.post("/api/reminders")
def add_reminder(r: ReminderReq):
    with _c() as c:
        c.execute("INSERT INTO reminders (created_at,email,title,remind_at) VALUES (?,?,?,?)",
                  (datetime.datetime.utcnow().isoformat(), r.email, r.title, r.remind_at))
    return {"saved": True}
@router.get("/api/reminders")
def list_reminders(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM reminders" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"reminders": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

# ── More AI tools (wave 2) ────────────────────────────────────────────────────
class SwotReq(BaseModel): idea: str
class CompetitorReq(BaseModel): idea: str; sector: str = ""
class NameReq(BaseModel): idea: str; sector: str = ""

@router.post("/api/tools/swot")
def swot(r: SwotReq):
    ans = _llm("You are a strategy consultant. Give a SWOT analysis as strict JSON with keys strengths, weaknesses, "
               "opportunities, threats — each a list of 3 short bullet strings.", r.idea)
    if ans:
        try:
            data = json.loads(ans[ans.find("{"): ans.rfind("}") + 1])
            if data: return {"swot": data, "provider": active_provider()}
        except Exception: pass
    return {"swot": {"strengths": ["AI-native & fast to ship", "Shared Sevenseed AI stack", "Lean, capital-efficient team"],
                     "weaknesses": ["Early stage / limited traction", "Brand awareness to build"],
                     "opportunities": ["Large underserved market", "Rising AI adoption in India"],
                     "threats": ["Slow-moving incumbents", "Regulatory shifts"]}, "provider": active_provider()}

@router.post("/api/tools/competitor")
def competitor(r: CompetitorReq):
    ans = _llm("You are a market analyst. Identify likely competitor types, their gaps, and how an AI-native startup can win. Concise.",
               f"Idea: {r.idea}\nSector: {r.sector}")
    return {"result": ans or ("Most incumbents in this space are non-AI and slow to adapt. An AI-native product wins on speed, "
                              "cost, and experience — automate what others do manually, and deliver instant intelligence."),
            "provider": active_provider()}

@router.post("/api/tools/name-generator")
def name_generator(r: NameReq):
    ans = _llm("You are a startup branding expert. Suggest 8 short, brandable startup names for the idea. Return comma-separated only.",
               f"Idea: {r.idea}\nSector: {r.sector}")
    names = [n.strip(" .-•") for n in (ans or "").replace("\n", ",").split(",") if n.strip()][:8] if ans else \
            ["Nexa", "Vanta", "OrbitAI", "Lumen", "Kavach", "Sarthi", "Vega", "BoltAI"]
    return {"names": names, "provider": active_provider()}


# ── Wave 3 ────────────────────────────────────────────────────────────────────
class ProjReq(BaseModel): users: int = 1000; price: float = 500; monthly_growth: float = 15
class GtmReq(BaseModel): idea: str; sector: str = ""
class ValReq(BaseModel): annual_revenue: float; multiple: float = 6

@router.post("/api/tools/projections")
def projections(r: ProjReq):
    u = r.users
    g = r.monthly_growth / 100
    months = []
    for m in range(1, 13):
        months.append({"month": m, "users": u, "revenue": round(u * r.price)})
        u = int(u * (1 + g))
    y1 = sum(x["revenue"] for x in months)
    return {"months": months, "year1_revenue": y1, "year3_estimate": round(y1 * (1 + g * 12) ** 2), "provider": active_provider()}

@router.post("/api/tools/gtm")
def gtm(r: GtmReq):
    ans = _llm("You are a go-to-market strategist. Give a concise GTM plan: target segment, channels, pricing model, and first-90-days actions.", f"Idea: {r.idea}\nSector: {r.sector}")
    return {"plan": ans or "Target: early adopters in the sector.\nChannels: content + direct sales + group cross-referrals.\nPricing: freemium to subscription.\nFirst 90 days: land 10 pilot customers, iterate, publish case studies.", "provider": active_provider()}

@router.post("/api/tools/valuation")
def valuation(r: ValReq):
    base = r.annual_revenue * r.multiple
    return {"annual_revenue": r.annual_revenue, "multiple": r.multiple, "valuation": round(base),
            "range_low": round(base * 0.8), "range_high": round(base * 1.25),
            "note": "Rough revenue-multiple estimate; real valuation depends on growth, margins and market.", "provider": active_provider()}


# ── Wave 4 (cap-table / runway / OKRs) ────────────────────────────────────────
class CapReq(BaseModel): stakeholders: list[dict] = []   # [{"name":..,"shares":..}]
class RunwayReq(BaseModel): cash: float; monthly_burn: float
class OkrReq(BaseModel): objective: str

@router.post("/api/tools/cap-table")
def cap_table(r: CapReq):
    total = sum(float(s.get("shares", 0)) for s in r.stakeholders) or 1
    table = [{"name": s.get("name", "?"), "shares": float(s.get("shares", 0)),
              "pct": round(float(s.get("shares", 0)) / total * 100, 2)} for s in r.stakeholders]
    table.sort(key=lambda x: x["shares"], reverse=True)
    return {"total_shares": total, "cap_table": table, "provider": active_provider()}

@router.post("/api/tools/runway")
def runway(r: RunwayReq):
    months = round(r.cash / r.monthly_burn, 1) if r.monthly_burn else 0
    import datetime as _dt
    zero = (_dt.date.today() + _dt.timedelta(days=int(months * 30))).isoformat() if months else "-"
    verdict = ("Healthy — plan your raise in ~6 months" if months >= 12
               else "Caution — start fundraising now" if months >= 6 else "Critical — raise immediately")
    return {"cash": r.cash, "monthly_burn": r.monthly_burn, "runway_months": months,
            "out_of_cash": zero, "verdict": verdict, "provider": active_provider()}

@router.post("/api/tools/okrs")
def okrs(r: OkrReq):
    ans = _llm("You are a startup coach. Given the objective, write 1 clear Objective and 3 measurable Key Results (OKRs).", r.objective)
    return {"okrs": ans or f"Objective: {r.objective}\nKR1: Reach 1,000 active users\nKR2: Achieve 20% MoM growth\nKR3: Hit target MRR", "provider": active_provider()}


# ── Wave 5 (live API integrations) ────────────────────────────────────────────
import json as _json, urllib.request as _ureq, urllib.parse as _uparse

def _http_get(url, headers=None, timeout=15):
    req = _ureq.Request(url, headers=headers or {})
    with _ureq.urlopen(req, timeout=timeout) as r:
        return _json.loads(r.read())

class NewsReq(BaseModel): query: str = "technology"; max: int = 6
class GithubReq(BaseModel): username: str
class YtReq(BaseModel): topic: str; max: int = 6
class EmailReq(BaseModel): to: str; subject: str; body: str; name: str = ""

@router.post("/api/tools/news")
def news(r: NewsReq):
    key = os.environ.get("GNEWS_API_KEY", "").strip()
    if not key: return {"articles": [], "error": "GNEWS_API_KEY not set"}
    try:
        data = _http_get(f"https://gnews.io/api/v4/search?q={_uparse.quote(r.query)}&lang=en&max={min(r.max, 10)}&apikey={key}")
        arts = [{"title": a.get("title"), "source": a.get("source", {}).get("name", ""), "url": a.get("url"),
                 "image": a.get("image", ""), "published": a.get("publishedAt", ""), "desc": a.get("description", "")}
                for a in data.get("articles", [])]
        return {"query": r.query, "count": len(arts), "articles": arts}
    except Exception as e:
        return {"articles": [], "error": str(e)}

@router.post("/api/tools/github")
def github(r: GithubReq):
    tok = os.environ.get("GITHUB_TOKEN", "").strip()
    h = {"User-Agent": "sevenseed-group"}
    if tok: h["Authorization"] = f"token {tok}"
    try:
        u = _http_get(f"https://api.github.com/users/{_uparse.quote(r.username)}", h)
        if u.get("message") == "Not Found": return {"error": "GitHub user not found"}
        repos = _http_get(f"https://api.github.com/users/{_uparse.quote(r.username)}/repos?per_page=100&sort=updated", h)
        stars = sum(x.get("stargazers_count", 0) for x in repos)
        langs = {}
        for x in repos:
            if x.get("language"): langs[x["language"]] = langs.get(x["language"], 0) + 1
        top_repos = sorted(repos, key=lambda x: x.get("stargazers_count", 0), reverse=True)[:5]
        return {"login": u.get("login"), "name": u.get("name"), "bio": u.get("bio"), "followers": u.get("followers"),
                "public_repos": u.get("public_repos"), "total_stars": stars, "avatar": u.get("avatar_url"),
                "top_languages": [l for l, _ in sorted(langs.items(), key=lambda k: k[1], reverse=True)[:6]],
                "top_repos": [{"name": x["name"], "stars": x.get("stargazers_count", 0), "url": x["html_url"], "desc": x.get("description", "")} for x in top_repos]}
    except Exception as e:
        return {"error": str(e)}

@router.post("/api/tools/youtube")
def youtube(r: YtReq):
    key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if not key: return {"videos": [], "error": "YOUTUBE_API_KEY not set"}
    try:
        data = _http_get(f"https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults={min(r.max, 10)}&q={_uparse.quote(r.topic + ' tutorial')}&key={key}")
        vids = [{"title": i["snippet"]["title"], "channel": i["snippet"]["channelTitle"], "video_id": i["id"]["videoId"],
                 "thumbnail": i["snippet"]["thumbnails"]["medium"]["url"], "url": "https://youtube.com/watch?v=" + i["id"]["videoId"]}
                for i in data.get("items", []) if i.get("id", {}).get("videoId")]
        return {"topic": r.topic, "videos": vids}
    except Exception as e:
        return {"videos": [], "error": str(e)}

def _brevo_email(to, subject, body, to_name=""):
    key = os.environ.get("BREVO_API_KEY", "").strip()
    if not key: return {"sent": False, "error": "BREVO_API_KEY not set"}
    try:
        payload = _json.dumps({
            "sender": {"name": "Sevenseed Group", "email": os.environ.get("BREVO_SENDER", "kunalpatel8702@gmail.com")},
            "to": [{"email": to, "name": to_name or to}],
            "subject": subject,
            "htmlContent": f"<div style='font-family:sans-serif;line-height:1.6;color:#222'>{body}</div>"
        }).encode()
        req = _ureq.Request("https://api.brevo.com/v3/smtp/email", data=payload,
                            headers={"api-key": key, "Content-Type": "application/json", "accept": "application/json"})
        with _ureq.urlopen(req, timeout=15) as r:
            return {"sent": True, "message_id": _json.loads(r.read()).get("messageId")}
    except Exception as e:
        return {"sent": False, "error": str(e)}

@router.post("/api/notify/email")
def notify_email(r: EmailReq):
    return _brevo_email(r.to, r.subject, r.body, r.name)


# ── Signature: live market intelligence + AI startup evaluator ────────────────
class MarketIntelReq(BaseModel): sector: str; max: int = 5
class EvaluateReq(BaseModel): idea: str; sector: str = ""; traction: str = ""

@router.post("/api/tools/market-intel")
def market_intel(r: MarketIntelReq):
    key = os.environ.get("GNEWS_API_KEY", "").strip()
    articles = []
    if key:
        try:
            data = _http_get(f"https://gnews.io/api/v4/search?q={_uparse.quote(r.sector + ' startup market India')}&lang=en&max={min(r.max, 10)}&apikey={key}")
            articles = [{"title": a.get("title"), "source": a.get("source", {}).get("name", ""), "url": a.get("url"),
                        "published": a.get("publishedAt", "")} for a in data.get("articles", [])]
        except Exception:
            pass
    headlines = "\n".join(f"- {a['title']}" for a in articles[:5]) or "(no live news available)"
    analysis = _llm("You are a venture analyst. From recent sector headlines, summarise the market opportunity, the key trend, and one risk in 4 concise sentences.",
                    f"Sector: {r.sector}\nHeadlines:\n{headlines}")
    return {"sector": r.sector, "articles": articles,
            "analysis": analysis or f"The {r.sector} sector shows rising AI adoption in India — a strong opportunity for an AI-native entrant to win on speed and cost.",
            "provider": active_provider()}

@router.post("/api/tools/evaluate")
def evaluate(r: EvaluateReq):
    txt = f"{r.idea} {r.sector} {r.traction}".lower()
    score = 55
    for kw, w in [("ai", 8), ("saas", 6), ("marketplace", 5), ("revenue", 8), ("users", 6),
                  ("pilot", 5), ("patent", 5), ("growth", 6), ("subscription", 5)]:
        if kw in txt: score += w
    score = min(95, score)
    rationale = _llm("You are a startup investor. Briefly rate the idea's strengths and risks (3-4 sentences) and suggest the single most important next step.",
                     f"Idea: {r.idea}\nSector: {r.sector}\nTraction: {r.traction}")
    verdict = ("Strong — worth incubating" if score >= 80 else "Promising — validate further" if score >= 65 else "Early — needs sharper focus")
    return {"score": score, "verdict": verdict,
            "rationale": rationale or "Validate demand with ~10 pilot customers and show early retention before scaling.",
            "provider": active_provider()}


# â”€â”€ Signature data: pitch-deck slides (for SVG slide preview) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
class SlidesReq(BaseModel): idea: str; sector: str = ""

@router.post("/api/tools/pitch-slides")
def pitch_slides(r: SlidesReq):
    out = _llm('You are a pitch coach. Return STRICT JSON {"slides":[{"title":"Problem","bullets":["..",".."]}]} '
               'covering the 8 standard slides: Problem, Solution, Market, Product, Business Model, Traction, Team, Ask.',
               f"Idea: {r.idea}\nSector: {r.sector}")
    if out:
        try:
            data = json.loads(out[out.find("{"): out.rfind("}") + 1])
            if data.get("slides"):
                return {"slides": data["slides"][:8], "provider": active_provider()}
        except Exception:
            pass
    titles = ["Problem", "Solution", "Market", "Product", "Business Model", "Traction", "Team", "Ask"]
    return {"slides": [{"title": t, "bullets": [f"{t} for {r.idea}", "Powered by Sevenseed's shared AI stack"]} for t in titles],
            "provider": active_provider()}


# == Business Document Studio (reused from ba-document-automation) ==============
# Discovery-Q&A -> full document -> branded Word (.docx) export, for the venture studio.
_DOC_SECTIONS = {
    "BRD": "Executive Summary, Business Objectives, Project Scope, Stakeholders, Functional Requirements, Non-Functional Requirements, Assumptions, Constraints, Risks, Success Metrics",
    "SRS": "Introduction, Overall Description, System Features, External Interface Requirements, Functional Requirements, Non-Functional Requirements, Data Model, Acceptance Criteria",
    "FRS": "Overview, Functional Requirements, System Behaviour, API Specifications, Data Flows, Acceptance Criteria, Edge Cases",
    "PRD": "Vision, Problem Statement, Goals & Success Metrics, Personas, User Stories, Features, Release Plan, Risks",
    "CHARTER": "Project Purpose, Objectives, Scope, Deliverables, Milestones, Stakeholders, Budget, Risks, Success Criteria",
    "BUSINESS_PLAN": "Executive Summary, Company Overview, Market Analysis, Product/Service, Go-to-Market Strategy, Operations, Team, Financial Projections, Funding Ask",
    "SOW": "Objectives, Scope of Work, Deliverables, Timeline & Milestones, Acceptance Criteria, Pricing, Assumptions",
}
_DEFAULT_SECTIONS = "Executive Summary, Objectives, Scope, Requirements, Timeline, Risks, Success Metrics"


class DocQReq(BaseModel):
    doc_type: str = "BRD"
    requirements: str


@router.post("/api/tools/doc-questions")
def doc_questions(r: DocQReq):
    sections = _DOC_SECTIONS.get(r.doc_type.upper(), _DEFAULT_SECTIONS)
    out = _llm(
        "You are a senior Business Analyst running a client discovery session. Ask only the questions strictly "
        "necessary to write a comprehensive document; make smart industry-standard assumptions for anything "
        "obvious or standard. Use simple, non-technical language a client can easily answer. "
        "Return ONLY a JSON array of 2-8 question strings. No markdown, no preamble.",
        f"Document type: {r.doc_type}\nTemplate sections to satisfy: {sections}\n\nProject brief:\n{r.requirements}",
        0.4)
    qs = []
    if out:
        import re as _re
        t = _re.sub(r"^```[a-z]*", "", out.strip()).strip("`").strip()
        try:
            qs = json.loads(t[t.find("["): t.rfind("]") + 1])
        except Exception:
            qs = _re.findall(r'"([^"]+?\?)"', t)
    qs = [q.strip() for q in qs if isinstance(q, str) and q.strip()][:8]
    if not qs:
        qs = [f"What is the primary goal of this {r.doc_type}?",
              "Who are the main users or stakeholders?",
              "Are there any technical, timeline, or budget constraints we should account for?"]
    return {"doc_type": r.doc_type, "questions": qs, "provider": active_provider()}


class DocGenReq(BaseModel):
    doc_type: str = "BRD"
    requirements: str
    project_name: str = "Project"
    answers: list = []
    extra: str = ""


@router.post("/api/tools/doc-generate")
def doc_generate(r: DocGenReq):
    sections = _DOC_SECTIONS.get(r.doc_type.upper(), _DEFAULT_SECTIONS)
    ctx = f"PROJECT: {r.project_name}\nBRIEF:\n{r.requirements}\n\nDISCOVERY Q&A:\n"
    for it in (r.answers or []):
        if isinstance(it, dict):
            q = str(it.get("question", "")).strip()
            a = str(it.get("answer", "")).strip()
            if q or a:
                ctx += f"Q: {q}\nA: {a}\n"
    if (r.extra or "").strip():
        ctx += f"\nADDITIONAL CONTEXT & REQUIREMENTS:\n{r.extra}\n"
    md = _llm(
        f"You are a senior consultant at Sevenseed Venture Studio. Write a complete, production-ready {r.doc_type}. "
        f"Suggested sections: {sections}. Rules: minimum 1500 words and never truncate a section; every requirement "
        "gets a user story + numbered measurable acceptance criteria + priority; use proper Markdown (H1 '#', H2 "
        "'##', H3 '###') and Markdown tables with headers; start with a Version History table, then a Table of "
        "Contents, then the sections; zero placeholders - make smart industry-standard assumptions to fill any gaps. "
        "Output ONLY the Markdown document, starting with '# Title'.",
        ctx, 0.55)
    md = (md or "").strip()
    if not md:
        md = f"# {r.doc_type}: {r.project_name}\n\n## Overview\n\n{r.requirements}\n"
    return {"doc_type": r.doc_type, "project_name": r.project_name, "markdown": md,
            "word_count": len(md.split()), "provider": active_provider()}


class DocxReq(BaseModel):
    markdown: str
    doc_type: str = "Document"
    project_name: str = "Project"


@router.post("/api/download/docx")
def download_docx(r: DocxReq):
    from fastapi.responses import StreamingResponse, JSONResponse
    import io as _io, re as _re
    if not (r.markdown or "").strip():
        return JSONResponse({"error": "No document content."}, status_code=400)
    try:
        from docx_builder import build_docx
    except Exception as e:
        return JSONResponse({"error": "DOCX engine unavailable (install python-docx).", "detail": str(e)}, status_code=503)
    try:
        buf = build_docx(r.markdown, r.doc_type, r.project_name)
    except Exception as e:
        return JSONResponse({"error": "Failed to build DOCX.", "detail": str(e)}, status_code=500)
    safe_type = _re.sub(r"[^A-Za-z0-9_]", "", r.doc_type.replace(" ", "_")) or "Document"
    safe_proj = (_re.sub(r"[^A-Za-z0-9_]", "", r.project_name.replace(" ", "_")).strip("_")[:30]) or "Project"
    fname = f"{safe_proj}_{safe_type}.docx"
    return StreamingResponse(
        _io.BytesIO(buf.getvalue()),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={fname}"})


# == AI Content Studio (reused from blogpost.ai) ===============================
# SEO topic ideation + long-form HTML article + meta description, for the ventures.
class ContentTopicsReq(BaseModel):
    name: str
    industry: str = ""
    audience: str = ""
    tone: str = "Professional"
    services: str = ""
    n: int = 5
    hint: str = ""


@router.post("/api/tools/content-topics")
def content_topics(r: ContentTopicsReq):
    n = max(3, min(10, r.n))
    out = _llm(
        "You are a world-class content strategist and SEO specialist. Generate compelling, high-converting, "
        "SEO-optimised blog topics spanning the buyer journey (awareness, consideration, decision); each must be "
        'unique and specific (not generic). Return EXACTLY a JSON array of objects with keys "title" (50-70 chars, '
        'keyword-rich) and "description" (100-150 words: the exact angle, 3-5 talking points, why it matters now, '
        "and a click hook). No markdown fences, no extra text.",
        f"Company: {r.name}\nIndustry: {r.industry}\nTarget audience: {r.audience}\nBrand tone: {r.tone}\n"
        f"Key services: {r.services}\nUser direction: {r.hint}\nNumber of topics: {n}", 0.7)
    topics = []
    if out:
        try:
            topics = json.loads(out[out.find("["): out.rfind("]") + 1])
        except Exception:
            topics = []
    topics = [t for t in topics if isinstance(t, dict) and t.get("title")][:n]
    if not topics:
        topics = [{"title": f"How {r.name} Is Reshaping {r.industry or 'the Market'}",
                   "description": f"A practical look at how {r.name} helps {r.audience or 'customers'} "
                                  f"with {r.services or 'its services'}, and why it matters now."}]
    return {"count": len(topics), "topics": topics, "provider": active_provider()}


class ContentBlogReq(BaseModel):
    name: str
    industry: str = ""
    audience: str = ""
    tone: str = "Professional"
    services: str = ""
    title: str
    angle: str = ""


@router.post("/api/tools/content-blog")
def content_blog(r: ContentBlogReq):
    import re as _re
    html = _llm(
        "You are a world-class SEO content writer and conversion copywriter. Write a publication-ready, long-form "
        "blog post (1500-2500 words) as clean HTML using <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, "
        "<blockquote>. Rules: a powerful hook in the first 2 sentences; 5-7 H2 sections of 250-400 words with H3 "
        "sub-sections where useful; support major claims with specific data, examples or case studies; put the "
        "primary keyword in the first sentence and in H2s; weave in 6-10 long-tail keywords naturally; finish with "
        "a strong CTA tied to the company's services; match the brand tone exactly. NEVER use <h1>. No markdown "
        "fences, no inline styles. Start directly with an opening <p> tag.",
        f"Company: {r.name}\nIndustry: {r.industry}\nTarget audience: {r.audience}\nBrand tone: {r.tone}\n"
        f"Key services: {r.services}\nBlog title: {r.title}\nAngle & description: {r.angle}", 0.6)
    html = (html or "").strip()
    if html.startswith("```"):
        html = _re.sub(r"^```[a-z]*\n?", "", html).rstrip("`").strip()
    meta = _llm(
        "You are an SEO expert. Write ONE meta description of 140-160 characters: the primary keyword in the first "
        "half, an action verb to open (Learn, Discover, See how...), curiosity without clickbait, ending with a "
        "clear value proposition. Return ONLY the meta description text - no quotes, no labels.",
        (html or r.title)[:3000], 0.5)
    plain = _re.sub(r"<[^>]+>", " ", html)
    return {"title": r.title, "html": html or f"<p>{r.angle or r.title}</p>",
            "meta_description": (meta or "").strip().strip('"')[:170],
            "word_count": len(plain.split()), "provider": active_provider()}




# == Brand profile from a URL (reused from blogpost.ai enrichment) =============
class BrandUrlReq(BaseModel):
    url: str


@router.post("/api/tools/brand-profile")
def brand_profile(r: BrandUrlReq):
    import re as _re
    url = (r.url or "").strip()
    if not url:
        return {"error": "Provide a website URL."}
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    try:
        req = _ureq.Request(url, headers={"User-Agent": "Mozilla/5.0 (SevenseedBot)"})
        with _ureq.urlopen(req, timeout=15) as resp:
            html = resp.read(200000).decode("utf-8", "ignore")
    except Exception as e:
        return {"error": f"Could not fetch the site: {e}", "url": url}
    text = _re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", html)
    text = _re.sub(r"(?s)<[^>]+>", " ", text)
    text = _re.sub(r"\s+", " ", text).strip()[:4000]
    out = _llm(
        "You are a business intelligence analyst. From the website text, return a brand profile as STRICT JSON with "
        "keys: name, description (120-180 words), industry, target_audience, tone, key_services (array of 3-6), "
        "primary_color_hex, secondary_color_hex. Use ONLY info present on the page; use an empty string or empty "
        "array where unknown. Hex colors must be 6-digit with a leading #. Return ONLY the JSON object.",
        f"Website URL: {url}\n\nWebsite text:\n{text}", 0.2)
    data = {}
    if out:
        try:
            data = json.loads(out[out.find('{'): out.rfind('}') + 1])
        except Exception:
            data = {}
    if not isinstance(data, dict) or not data:
        return {"error": "Could not extract a brand profile from that page.", "url": url}
    data["url"] = url
    data["provider"] = active_provider()
    return data


# == Meeting transcript summarizer (reused from MeetBot) =======================
class TranscriptReq(BaseModel):
    transcript: str
    context: str = ""


@router.post("/api/tools/summarize-transcript")
def summarize_transcript(r: TranscriptReq):
    text = (r.transcript or "").strip()
    if len(text) < 40:
        return {"error": "Please paste a longer transcript (at least a few sentences)."}
    out = _llm(
        "You are a meeting assistant. From the transcript produce STRICT JSON: "
        '{"summary":"3-5 sentence overview","key_points":["..."],"decisions":["..."],'
        '"action_items":[{"task":"...","owner":"","due":""}],"risks":["..."]}. '
        "Be specific and faithful to what was actually said. Return ONLY the JSON, no markdown.",
        f"Context: {r.context}\n\nTranscript:\n{text[:9000]}", 0.3)
    data = {}
    if out:
        try:
            data = json.loads(out[out.find('{'): out.rfind('}') + 1])
        except Exception:
            data = {}
    if not isinstance(data, dict) or not data.get("summary"):
        return {"summary": (out or "").strip()[:1200], "key_points": [], "decisions": [],
                "action_items": [], "risks": [], "provider": active_provider()}
    data["provider"] = active_provider()
    return data



# == URL content extractor (reused from socialhub url_extractor) ===============
class ExtractUrlReq(BaseModel):
    url: str
    summarize: bool = True


@router.post("/api/tools/extract-url")
def extract_url(r: ExtractUrlReq):
    import re as _re
    from html import unescape as _unescape
    url = (r.url or "").strip()
    if not url:
        return {"error": "Provide a URL."}
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    try:
        req = _ureq.Request(url, headers={"User-Agent": "Mozilla/5.0 (SevenseedBot)"})
        with _ureq.urlopen(req, timeout=15) as resp:
            html = resp.read(300000).decode("utf-8", "ignore")
    except Exception as e:
        return {"error": f"Could not fetch the URL: {e}", "url": url}
    tm = _re.search(r"(?is)<title[^>]*>(.*?)</title>", html)
    title = _unescape(_re.sub(r"\s+", " ", tm.group(1)).strip()) if tm else ""
    text = _re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", html)
    text = _unescape(_re.sub(r"(?s)<[^>]+>", " ", text))
    text = _re.sub(r"\s+", " ", text).strip()
    summary = ""
    if r.summarize and text:
        summary = _llm(
            "You are an editor. Summarise the page in 3-4 sentences, then list 3-5 key takeaways as bullet points.",
            f"Title: {title}\n\nContent:\n{text[:6000]}", 0.3) or ""
    return {"url": url, "title": title, "word_count": len(text.split()),
            "text": text[:8000], "summary": summary.strip(), "provider": active_provider()}


# == Test-case + acceptance-criteria generator (reused from testable-ai) =======
class TestCasesReq(BaseModel):
    feature: str
    context: str = ""


@router.post("/api/tools/test-cases")
def test_cases(r: TestCasesReq):
    spec = (r.feature or "").strip()
    if len(spec) < 8:
        return {"error": "Describe the feature or screen to generate tests for."}
    md = _llm(
        "You are a senior QA analyst. For the described feature produce Markdown with exactly three sections:\n"
        "## User Stories - 2-4 stories, each 'As a <role>, I want <goal>, so that <benefit>'.\n"
        "## Acceptance Criteria - specific, measurable bullet points grouped under each story.\n"
        "## Test Cases - a Markdown table with columns: Test Case ID | Scenario | Steps | Expected Result; "
        "8-15 rows, IDs TC-001 onward, covering happy path, edge cases, validation and error handling. "
        "Return ONLY the Markdown.",
        f"Feature: {spec}\nContext: {r.context}", 0.4)
    return {"feature": spec,
            "markdown": (md or "").strip() or f"## User Stories\n- As a user, I want {spec}.",
            "provider": active_provider()}



# ============================================================================
# Owl — generic LangGraph orchestrator + auto-building dashboard (enterprise).
# Brand-agnostic: introspects THIS app's /api/tools/* POST endpoints, routes a
# natural-language request to the best one via a LangGraph graph, runs it, and
# replies. Serves a self-building dashboard at /dashboard. Drop-in for any
# brand's features.py (uses local _llm/active_provider or agents.* fallback).
# ============================================================================
import json as _owl_json, inspect as _owl_inspect


def _owl_llm(system, user, t=0.4):
    fn = globals().get("_llm")
    if callable(fn):
        try:
            return fn(system, user, t)
        except Exception:
            pass
    try:
        from agents import _llm_text
        return _llm_text(system, user, t)
    except Exception:
        return None


def _owl_provider():
    fn = globals().get("active_provider")
    if callable(fn):
        try:
            return fn()
        except Exception:
            pass
    try:
        from agents import active_provider as _ap
        return _ap()
    except Exception:
        return "offline"


def _owl_brand():
    b = globals().get("BRAND")
    if isinstance(b, dict):
        return {"name": b.get("name", "AI Workforce"), "emoji": b.get("emoji", "🤖"),
                "sub": b.get("sub", "AI Tools"), "p": b.get("p", "#06b6d4"), "s": b.get("s", "#8b5cf6")}
    return {"name": "AI Workforce", "emoji": "🤖", "sub": "AI Tools", "p": "#06b6d4", "s": "#8b5cf6"}


def _owl_ftype(ann):
    if ann in (int,):
        return "int"
    if ann in (float,):
        return "float"
    if ann in (bool,):
        return "bool"
    if ann in (list,) or getattr(ann, "__origin__", None) in (list,):
        return "list"
    return "str"


def _owl_model_fields(model):
    out = []
    if model is None:
        return out
    try:
        for name, f in model.model_fields.items():
            try:
                req = f.is_required()
            except Exception:
                req = getattr(f, "default", None) is None
            out.append({"name": name, "type": _owl_ftype(getattr(f, "annotation", str)), "required": bool(req)})
    except Exception:
        pass
    return out


def _owl_discover():
    import typing as _owl_typing
    tools = {}
    for route in getattr(router, "routes", []):
        path = getattr(route, "path", "")
        methods = getattr(route, "methods", None) or set()
        if "POST" not in methods or not path.startswith("/api/tools/"):
            continue
        fn = getattr(route, "endpoint", None)
        if fn is None or _owl_inspect.iscoroutinefunction(fn):
            continue
        model = None
        try:
            hints = _owl_typing.get_type_hints(fn)
        except Exception:
            hints = {}
        for _hn, ann in hints.items():
            if _hn == "return":
                continue
            if isinstance(ann, type) and issubclass(ann, BaseModel):
                model = ann
                break
        if model is None:
            bf = getattr(route, "body_field", None)
            t = getattr(bf, "type_", None)
            if isinstance(t, type) and issubclass(t, BaseModel):
                model = t
        if model is None:
            continue
        key = path.rsplit("/", 1)[-1]
        doc = ((fn.__doc__ or "").strip().split("\n")[0] or key.replace("-", " ")).strip()[:130]
        tools[key] = {"path": path, "fn": fn, "model": model, "doc": doc}
    return tools


_OWL_TOOLS = None


def _owl_tools():
    global _OWL_TOOLS
    if _OWL_TOOLS is None:
        _OWL_TOOLS = _owl_discover()
    return _OWL_TOOLS


def _owl_route(message):
    tools = _owl_tools()
    if not tools:
        return None, {}, "no tools"
    catalog = "\n".join(f"- {k}: {v['doc']}" for k, v in tools.items())
    out = _owl_llm(
        "You are Owl, a router for a set of AI tools. Choose the single best tool for the user's request and extract "
        'its parameters from the message. Return STRICT JSON: {"tool":"<one key>","params":{...},"why":"short"}. '
        "Only use a key from the list. Return ONLY JSON.",
        f"Tools:\n{catalog}\n\nRequest: {message}", 0.1)
    if out:
        try:
            d = _owl_json.loads(out[out.find('{'): out.rfind('}') + 1])
            if d.get("tool") in tools:
                return d["tool"], (d.get("params") or {}), d.get("why", "")
        except Exception:
            pass
    m = (message or "").lower()
    for k in tools:
        if k.replace("-", " ") in m:
            return k, {}, "keyword match"
    first = next(iter(tools), None)
    return first, {}, "default route"


def _owl_fill(model, message, params):
    fill = {}
    try:
        for name, f in model.model_fields.items():
            if name in params:
                continue
            try:
                req = f.is_required()
            except Exception:
                req = getattr(f, "default", None) is None
            if req and getattr(f, "annotation", None) is str:
                fill[name] = message
    except Exception:
        pass
    return fill


def _owl_execute(tool, params, message):
    tools = _owl_tools()
    if tool not in tools:
        return {"error": "No suitable tool was found for that request."}
    model, fn = tools[tool]["model"], tools[tool]["fn"]
    try:
        req = model(**params)
    except Exception:
        try:
            req = model(**{**params, **_owl_fill(model, message, params)})
        except Exception as e:
            return {"error": f"Could not prepare inputs: {e}"}
    try:
        return fn(req)
    except Exception as e:
        return {"error": f"{tool} failed: {e}"}


_OWL_GRAPH = None


def _owl_graph():
    global _OWL_GRAPH
    if _OWL_GRAPH is not None:
        return _OWL_GRAPH
    try:
        from typing import TypedDict
        from langgraph.graph import StateGraph, END

        class _St(TypedDict):
            message: str
            tool: str
            params: dict
            why: str
            result: dict
            reply: str

        def n_route(s):
            t, p, why = _owl_route(s["message"])
            return {"tool": t, "params": p, "why": why}

        def n_exec(s):
            return {"result": _owl_execute(s["tool"], s.get("params") or {}, s["message"])}

        def n_respond(s):
            rep = _owl_llm(
                "You are Owl, an AI chief-of-staff. In 2-3 sentences tell the user what was done and the key outcome. "
                "Concise and friendly.",
                f"Request: {s['message']}\nTool: {s['tool']}\nResult: {_owl_json.dumps(s.get('result', {}))[:1400]}", 0.4)
            return {"reply": rep or f"Done via {s['tool']}."}

        g = StateGraph(_St)
        for nm, fnc in [("route", n_route), ("execute", n_exec), ("respond", n_respond)]:
            g.add_node(nm, fnc)
        g.set_entry_point("route")
        g.add_edge("route", "execute")
        g.add_edge("execute", "respond")
        g.add_edge("respond", END)
        _OWL_GRAPH = g.compile()
        print("[owl] LangGraph orchestrator compiled")
    except Exception as e:
        print(f"[owl] LangGraph unavailable ({e}); linear fallback")
        _OWL_GRAPH = False
    return _OWL_GRAPH


class _OwlReq(BaseModel):
    message: str
    session_id: str = ""


@router.post("/api/agent/run")
def owl_run(r: _OwlReq):
    msg = (r.message or "").strip()
    if not msg:
        return {"error": "Tell Owl what you need done."}
    g = _owl_graph()
    if g:
        try:
            s = g.invoke({"message": msg})
            return {"reply": s.get("reply"), "tool": s.get("tool"), "why": s.get("why"),
                    "result": s.get("result"), "engine": "langgraph", "provider": _owl_provider()}
        except Exception as e:
            print(f"[owl] graph error {e}")
    t, p, why = _owl_route(msg)
    result = _owl_execute(t, p, msg)
    reply = _owl_llm("You are Owl. In 2-3 sentences say what was done and the outcome.",
                     f"Request: {msg}\nTool: {t}\nResult: {_owl_json.dumps(result)[:1400]}", 0.4) or f"Done via {t}."
    return {"reply": reply, "tool": t, "why": why, "result": result, "engine": "linear", "provider": _owl_provider()}


@router.get("/api/agent/tools")
def owl_tools():
    return {"brand": _owl_brand(),
            "tools": [{"tool": k, "path": v["path"], "does": v["doc"], "fields": _owl_model_fields(v["model"])}
                      for k, v in _owl_tools().items()]}


_OWL_DASHBOARD_HTML = r"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>AI Dashboard</title><style>
:root{--a:#06b6d4;--b:#8b5cf6;--bg:#0b1020;--pan:#141b2e;--pan2:#1b2540;--ln:#26304d;--tx:#e5ecf7;--mut:#93a1bf}
*{box-sizing:border-box}body{margin:0;font-family:'Segoe UI',system-ui,sans-serif;background:
radial-gradient(1200px 600px at 80% -10%,rgba(139,92,246,.15),transparent),
radial-gradient(1000px 500px at -10% 10%,rgba(6,182,212,.13),transparent),var(--bg);color:var(--tx);min-height:100vh}
header{display:flex;align-items:center;gap:14px;padding:15px 22px;border-bottom:1px solid var(--ln);position:sticky;top:0;
background:rgba(11,16,32,.85);backdrop-filter:blur(8px);z-index:5}
.logo{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,var(--a),var(--b));display:grid;place-items:center;font-size:21px}
header h1{font-size:18px;margin:0;font-weight:800}header .sub{color:var(--mut);font-size:12px}
.prov{margin-left:auto;font-size:12px;color:var(--mut);border:1px solid var(--ln);padding:6px 11px;border-radius:20px}.prov b{color:var(--a)}
.wrap{display:flex}nav{width:230px;border-right:1px solid var(--ln);padding:12px 10px;flex-shrink:0;max-height:calc(100vh - 71px);overflow:auto}
nav .grp{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--mut);margin:14px 10px 6px}
nav button{display:flex;gap:9px;width:100%;text-align:left;background:none;border:0;color:var(--tx);padding:9px 11px;border-radius:9px;cursor:pointer;font-size:13.5px}
nav button:hover{background:var(--pan)}nav button.on{background:linear-gradient(135deg,rgba(6,182,212,.22),rgba(139,92,246,.22));box-shadow:inset 0 0 0 1px var(--ln)}
main{flex:1;padding:22px 26px;max-width:900px}h2{margin:0 0 3px;font-size:22px}.adesc{color:var(--mut);font-size:13.5px;margin:0 0 16px}
.card{background:var(--pan);border:1px solid var(--ln);border-radius:14px;padding:16px 18px;margin-bottom:15px}
.card h3{margin:0 0 3px;font-size:15px}.card .ep{color:var(--mut);font-size:11.5px;font-family:ui-monospace,Consolas,monospace;margin-bottom:11px}
label{display:block;font-size:12.5px;color:var(--mut);margin:9px 0 4px}
input,textarea,select{width:100%;background:var(--pan2);border:1px solid var(--ln);border-radius:8px;color:var(--tx);padding:9px 11px;font-size:13.5px;font-family:inherit}
textarea{min-height:72px;resize:vertical}button.run{margin-top:12px;background:linear-gradient(135deg,var(--a),var(--b));color:#06121f;border:0;padding:10px 18px;border-radius:9px;font-weight:800;cursor:pointer;font-size:13.5px}
button.run:disabled{opacity:.55;cursor:wait}.out{margin-top:12px;border-top:1px dashed var(--ln);padding-top:11px;display:none}.out.show{display:block}
pre{background:#0a1122;border:1px solid var(--ln);border-radius:8px;padding:12px;overflow:auto;font-size:12px;max-height:420px;white-space:pre-wrap;word-break:break-word}
.pill{display:inline-block;background:var(--pan2);border:1px solid var(--ln);border-radius:20px;padding:3px 10px;font-size:11.5px;margin:3px 4px 0 0}
.kv{font-size:13px;line-height:1.7}.kv b{color:var(--a)}table{border-collapse:collapse;width:100%;font-size:12.5px;margin-top:6px}
th,td{border:1px solid var(--ln);padding:6px 9px;text-align:left}th{background:var(--pan2)}.err{color:#fca5a5}
.score{font-size:32px;font-weight:800;background:linear-gradient(135deg,var(--a),var(--b));-webkit-background-clip:text;background-clip:text;color:transparent}
.note{color:var(--mut);font-size:12px;margin-top:7px}@media(max-width:760px){.wrap{flex-direction:column}nav{width:auto;max-height:none;border-right:0;border-bottom:1px solid var(--ln)}}
</style></head><body>
<header><div class="logo" id="emoji">🤖</div><div><h1 id="bname">AI Dashboard</h1><div class="sub" id="bsub">powered by Owl</div></div><div class="prov" id="prov">provider: <b>…</b></div></header>
<div class="wrap"><nav id="nav"></nav><main id="main"></main></div>
<script>
const $=(s,r=document)=>r.querySelector(s);let TOOLS=[],cur="__owl";
const LONG=/message|transcript|resume|requirements|body|lead|persona|feature|notes|angle|text|question|code|markdown|essay|profile|content|prompt|idea|symptom|description|jd|extra/i;
function longish(n){return LONG.test(n)}
async function boot(){
  let d={};try{d=await (await fetch("/api/agent/tools")).json();}catch(e){$("#prov").innerHTML='<span class="err">backend offline</span>';}
  const b=d.brand||{};document.title=(b.name||"AI")+" — Dashboard";$("#emoji").textContent=b.emoji||"🤖";$("#bname").textContent=b.name||"AI Dashboard";$("#bsub").textContent=(b.sub||"AI Tools")+" · powered by Owl";
  if(b.p){document.documentElement.style.setProperty('--a',b.p);}if(b.s){document.documentElement.style.setProperty('--b',b.s);}
  TOOLS=d.tools||[];buildNav();render();health();
}
function buildNav(){let h='<div class="grp">Orchestrator</div><button data-id="__owl" class="'+(cur==="__owl"?"on":"")+'">🦉 Owl — ask anything</button><div class="grp">Tools</div>';
  TOOLS.forEach(t=>{h+='<button data-id="'+t.tool+'" class="'+(cur===t.tool?"on":"")+'">⚡ '+t.tool.replace(/-/g," ")+'</button>';});
  $("#nav").innerHTML=h;$("#nav").querySelectorAll("button").forEach(b=>b.onclick=()=>{cur=b.dataset.id;buildNav();render();});}
function fieldHtml(f){const id="f_"+f.name,lab='<label>'+f.name.replace(/_/g," ")+(f.required?' *':'')+'</label>';
  if(f.type==="bool")return lab+'<select data-k="'+f.name+'" data-t="bool"><option value="false">no</option><option value="true">yes</option></select>';
  if(f.type==="int"||f.type==="float")return lab+'<input data-k="'+f.name+'" data-t="'+f.type+'" type="number">';
  if(f.type==="list")return lab+'<textarea data-k="'+f.name+'" data-t="list" placeholder="one per line or comma-separated"></textarea>';
  if(longish(f.name))return lab+'<textarea data-k="'+f.name+'" data-t="str"></textarea>';
  return lab+'<input data-k="'+f.name+'" data-t="str">';}
function render(){
  if(cur==="__owl"){$("#main").innerHTML='<h2>🦉 Owl — AI Chief of Staff</h2><p class="adesc">Describe any task in plain English. Owl (a LangGraph multi-agent graph) routes it to the right tool, runs it, and reports back.</p>'+
    '<div class="card"><h3>Ask Owl to do anything</h3><div class="ep">POST /api/agent/run</div><label>What do you need done?</label><textarea data-k="message" data-t="str"></textarea><button class="run">Run</button><div class="out"><div class="body"></div></div></div>';
    wire($("#main .card"),{path:"/api/agent/run"});return;}
  const t=TOOLS.find(x=>x.tool===cur);if(!t){$("#main").innerHTML="";return;}
  let h='<h2>⚡ '+t.tool.replace(/-/g," ")+'</h2><p class="adesc">'+esc(t.does||"")+'</p><div class="card"><div class="ep">POST '+t.path+'</div>'+
    (t.fields||[]).map(fieldHtml).join("")+'<button class="run">Run</button><div class="out"><div class="body"></div></div></div>';
  $("#main").innerHTML=h;wire($("#main .card"),t);}
function wire(card,t){card.querySelector(".run").onclick=()=>run(card,t);}
function collect(card){const b={};card.querySelectorAll("[data-k]").forEach(el=>{const k=el.dataset.k,tp=el.dataset.t,v=el.value.trim();
  if(tp==="int"){if(v!=="")b[k]=parseInt(v);}else if(tp==="float"){if(v!=="")b[k]=parseFloat(v);}
  else if(tp==="bool"){b[k]=v==="true";}else if(tp==="list"){b[k]=v?v.split(/[\n,]+/).map(x=>x.trim()).filter(Boolean):[];}
  else if(v!=="")b[k]=v;});return b;}
async function run(card,t){const btn=card.querySelector(".run"),out=card.querySelector(".out"),body=card.querySelector(".body");
  btn.disabled=true;btn.textContent="Running…";out.classList.add("show");body.innerHTML='<span class="note">Calling '+t.path+' …</span>';
  try{const res=await fetch(t.path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(collect(card))});
    const d=await res.json();body.innerHTML=rend(d);}catch(e){body.innerHTML='<div class="err">Error: '+e.message+'. Is the backend running?</div>';}
  btn.disabled=false;btn.textContent="Run";}
function esc(s){return String(s==null?"":s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function rend(d){if(d==null)return"<pre>(no response)</pre>";
  if(d.reply&&("tool"in d)){let o='<div class="kv"><b>🦉 Owl</b> <span class="pill">'+esc(d.tool)+'</span> <span class="pill">'+esc(d.engine)+' engine</span></div><div class="kv" style="margin:6px 0 10px;font-size:14px">'+esc(d.reply)+'</div>';if(d.result)o+=rend(d.result);return o;}
  if(d.error)return'<div class="err">'+esc(d.error)+'</div>'+(d.attempted_sql?'<pre>'+esc(d.attempted_sql)+'</pre>':"");
  let h="";
  if(d.captions&&typeof d.captions==="object"){for(const[k,v]of Object.entries(d.captions))h+='<div class="kv"><b>'+esc(k)+'</b></div><pre>'+esc(v)+'</pre>';return h;}
  if(Array.isArray(d.questions)){d.questions.forEach((q,i)=>h+='<div class="kv"><b>Q'+(i+1)+'</b> <span class="pill">'+esc(q.type||"")+'</span> '+esc(q.question||q)+(q.tip?'<br><span class="note">💡 '+esc(q.tip)+'</span>':"")+'</div>');return h;}
  if(d.scores){h+='<div class="score">'+(d.overall_score??"-")+'<span style="font-size:15px;color:var(--mut)">/100</span></div>'+Object.entries(d.scores).map(([k,v])=>'<span class="pill">'+esc(k)+': <b style="color:var(--a)">'+esc(v)+'</b></span>').join("");if(d.overall_recommendation)h+='<div class="kv" style="margin-top:8px"><b>Verdict:</b> '+esc(d.overall_recommendation)+'</div>';return h;}
  if(Array.isArray(d.rows)){if(d.summary)h+='<div class="kv"><b>Answer:</b> '+esc(d.summary)+'</div>';if(d.sql)h+='<div class="note">SQL: '+esc(d.sql)+'</div>';if(d.rows.length){const c=Object.keys(d.rows[0]);h+='<table><tr>'+c.map(x=>'<th>'+esc(x)+'</th>').join("")+'</tr>'+d.rows.slice(0,25).map(r=>'<tr>'+c.map(x=>'<td>'+esc(r[x])+'</td>').join("")+'</tr>').join("")+'</table>';}return h||'<pre>'+esc(JSON.stringify(d,null,2))+'</pre>';}
  if(Array.isArray(d.topics)){d.topics.forEach(t=>h+='<div class="kv"><b>'+esc(t.title||"")+'</b><br><span class="note">'+esc(t.description||"")+'</span></div>');return h;}
  if(Array.isArray(d.sequence)){d.sequence.forEach(s=>h+='<div class="kv"><b>Step '+esc(s.step)+'</b> (wait '+esc(s.wait_days??0)+'d)'+(s.subject?' · <i>'+esc(s.subject)+'</i>':"")+'<br>'+esc(s.message||"")+'</div>');return h;}
  if(d.tier){h+='<div class="score">'+(d.score??"-")+'</div><span class="pill">'+esc(d.tier)+'</span>';if(d.next_action)h+='<div class="kv" style="margin-top:6px"><b>Next:</b> '+esc(d.next_action)+'</div>';return h;}
  if(d.markdown)return'<pre>'+esc(d.markdown)+'</pre>';
  if(d.html)return'<pre>'+esc(d.html)+'</pre>'+(d.meta_description?'<div class="note">meta: '+esc(d.meta_description)+'</div>':"");
  if(d.summary){h+='<div class="kv">'+esc(d.summary)+'</div>';["key_points","decisions","risks"].forEach(k=>{if(d[k]&&d[k].length)h+='<div class="kv"><b>'+k.replace(/_/g," ")+':</b><ul>'+d[k].map(x=>'<li>'+esc(typeof x==="object"?JSON.stringify(x):x)+'</li>').join("")+'</ul></div>';});if(d.action_items&&d.action_items.length)h+='<div class="kv"><b>Actions:</b><ul>'+d.action_items.map(a=>'<li>'+esc(a.task||a)+(a.owner?" — "+esc(a.owner):"")+'</li>').join("")+'</ul></div>';return h;}
  if(d.answer)return'<div class="kv">'+esc(d.answer)+'</div>';
  if(d.result&&typeof d.result==="string")return'<pre>'+esc(d.result)+'</pre>';
  return'<pre>'+esc(JSON.stringify(d,null,2))+'</pre>';}
async function health(){try{const d=await(await fetch("/api/health")).json();$("#prov").innerHTML='provider: <b>'+esc(d.provider||"?")+'</b>';}catch(e){try{const d=await(await fetch("/api/agent/tools")).json();$("#prov").innerHTML='provider: <b>'+esc((d.tools&&d.tools[0]&&"ready")||"ready")+'</b>';}catch(_){$("#prov").innerHTML='<span class="err">offline</span>';}}}
boot();
</script></body></html>"""


@router.get("/dashboard")
def owl_dashboard():
    return HTMLResponse(_OWL_DASHBOARD_HTML)
