# -*- coding: utf-8 -*-
"""Breakdown Factor Construction — enterprise feature router (auth, AI tools, analytics, export, reminders)."""
from __future__ import annotations
import os, datetime, hashlib, hmac, secrets, sqlite3, html as _html
from itsdangerous import URLSafeTimedSerializer
from fastapi import APIRouter, Header
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

_HERE = os.path.dirname(os.path.abspath(__file__))
try:
    from app import config as _cfg; DB_PATH = _cfg.DB_PATH
except Exception:
    DB_PATH = os.path.join(_HERE, "db.sqlite3")

BRAND = {"emoji": "🏗️", "name": "Breakdown Factor Construction", "sub": "AI Construction", "p": "#f59e0b", "s": "#f97316"}

def _get_llm(t=0.4):
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

def _llm(system, user, t=0.4):
    m = _get_llm(t)
    if not m: return None
    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        return m.invoke([SystemMessage(content=system), HumanMessage(content=user)]).content
    except Exception as e: print(f"[llm] {e}"); return None

_SER = URLSafeTimedSerializer(os.environ.get("AUTH_SECRET", "breakdown-dev-secret"), salt="breakdown-auth")
_MAXAGE = 60 * 60 * 24 * 30
def _c():
    c = sqlite3.connect(DB_PATH); c.row_factory = sqlite3.Row; return c
def _init():
    try:
        with _c() as c:
            c.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT UNIQUE, pw_hash TEXT, pw_salt TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, title TEXT, remind_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, name TEXT, ptype TEXT, area REAL, status TEXT, notes TEXT)")
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
                            (datetime.datetime.utcnow().isoformat(), (name or "Client").strip(), email, h, s)).lastrowid
    except sqlite3.IntegrityError: return {"error": "Account already exists. Please log in."}
    return {"token": _SER.dumps({"uid": uid}), "user": {"id": uid, "name": (name or "Client").strip(), "email": email}}
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
def _inr(n): return "₹" + f"{int(n):,}"

def _boq(area, quality="standard"):
    area = float(area or 0)
    mult = {"economy": 0.85, "standard": 1.0, "premium": 1.3}.get((quality or "standard").lower(), 1.0)
    items = [
        ("Cement (OPC 53)", round(area * 0.4), "bags", 400),
        ("Steel (TMT)", round(area * 4), "kg", 65),
        ("Bricks", round(area * 8), "nos", 9),
        ("Sand", round(area * 0.045, 2), "cum", 2200),
        ("Aggregate (20mm)", round(area * 0.045, 2), "cum", 1600),
        ("Flooring tiles", round(area * 1.1), "sqft", 55),
        ("Paint", round(area * 0.18), "litre", 260),
    ]
    rows, total = [], 0
    for name, qty, unit, rate in items:
        cost = round(qty * rate * mult)
        total += cost
        rows.append({"item": name, "qty": qty, "unit": unit, "rate": rate, "cost": cost, "cost_str": _inr(cost)})
    return {"area": area, "quality": quality, "items": rows, "total": total, "total_str": _inr(total),
            "per_sqft": _inr(round(total / area)) if area else "—", "provider": active_provider()}

def _timeline(ptype, area):
    area = float(area or 1000)
    scale = max(1.0, area / 1000)
    phases = [("Design & Approvals", round(3 * scale)), ("Foundation & Plinth", round(4 * scale)),
              ("Superstructure (RCC)", round(8 * scale)), ("Brickwork & Plaster", round(5 * scale)),
              ("MEP (Elec/Plumbing)", round(4 * scale)), ("Flooring & Finishes", round(5 * scale)),
              ("Painting & Handover", round(3 * scale))]
    weeks, out = 0, []
    for name, dur in phases:
        out.append({"phase": name, "weeks": dur, "start_week": weeks + 1, "end_week": weeks + dur})
        weeks += dur
    return {"project_type": ptype, "area": area, "total_weeks": weeks, "total_months": round(weeks / 4.3, 1),
            "phases": out, "provider": active_provider()}

def _tender(scope, budget=""):
    ans = _llm("You are a construction tender/bid specialist in India. Draft a concise, professional bid summary: "
               "approach, key strengths, timeline note, and 3 differentiators.",
               f"Scope: {scope}\nBudget: {budget}")
    if ans: return {"result": ans, "provider": active_provider()}
    return {"result": ("**Bid summary (template):**\n\n"
                       f"**Scope:** {scope}\n\n"
                       "**Our approach:** Phased delivery with software-driven project management, ISO-aligned QA, and computer-vision site-safety monitoring.\n\n"
                       "**Key strengths:** On-time delivery record, transparent costing, zero-incident safety culture.\n\n"
                       "**Differentiators:** AI cost forecasting · automated quality inspection · real-time progress dashboards.\n\n"
                       "Add a free GROQ_API_KEY for a fully drafted, tailored tender response."),
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
class BoqReq(BaseModel): area: float; quality: str = "standard"
class TimelineReq(BaseModel): project_type: str = "residential"; area: float = 1000
class TenderReq(BaseModel): scope: str; budget: str = ""
class ProjectReq(BaseModel): email: str; name: str; ptype: str = ""; area: float = 0; status: str = "planning"; notes: str = ""
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

@router.post("/api/tools/boq")
def boq(r: BoqReq): return _boq(r.area, r.quality)
@router.post("/api/tools/timeline")
def timeline(r: TimelineReq): return _timeline(r.project_type, r.area)
@router.post("/api/tools/tender")
def tender(r: TenderReq): return _tender(r.scope, r.budget)

@router.post("/api/projects")
def add_project(r: ProjectReq):
    with _c() as c:
        c.execute("INSERT INTO projects (created_at,email,name,ptype,area,status,notes) VALUES (?,?,?,?,?,?,?)",
                  (datetime.datetime.utcnow().isoformat(), r.email, r.name, r.ptype, r.area, r.status, r.notes))
    return {"saved": True}
@router.get("/api/projects")
def list_projects(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM projects" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"projects": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

@router.get("/api/analytics/overview")
def analytics(): return _overview()
@router.post("/api/export/report")
def export_report(r: ReportReq): return HTMLResponse(_report_html(r.title, r.subtitle, r.sections))
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
class EmiReq(BaseModel): principal: float; rate: float = 8.5; years: float = 20
class RoiReq(BaseModel): cost: float; monthly_rent: float
class ChecklistReq(BaseModel): site_type: str = "residential"

@router.post("/api/tools/emi")
def emi(r: EmiReq):
    p = r.principal; n = int(r.years * 12); mr = (r.rate / 100) / 12
    emi_val = round(p * mr * (1 + mr) ** n / ((1 + mr) ** n - 1)) if mr and n else round(p / max(n, 1))
    total = emi_val * n
    return {"emi": emi_val, "emi_str": _inr(emi_val), "months": n, "total_payable": total,
            "total_str": _inr(total), "total_interest": _inr(total - p), "provider": active_provider()}

@router.post("/api/tools/roi")
def roi(r: RoiReq):
    annual = r.monthly_rent * 12
    yield_pct = round(annual / r.cost * 100, 2) if r.cost else 0
    payback = round(r.cost / annual, 1) if annual else 0
    return {"annual_rent": _inr(annual), "gross_yield_pct": yield_pct, "payback_years": payback,
            "verdict": ("Strong yield" if yield_pct >= 4 else "Moderate yield" if yield_pct >= 2.5 else "Low yield — negotiate price or rent"),
            "provider": active_provider()}

@router.post("/api/tools/safety-checklist")
def safety_checklist(r: ChecklistReq):
    ans = _llm("You are a construction site-safety officer. Produce a concise site-safety checklist (8-10 items) for the site type.", r.site_type)
    return {"checklist": ans or ("• PPE (helmet, boots, harness) enforced\n• Scaffolding inspected & tagged\n• Edge protection & barricades\n"
                                 "• Fire extinguishers on site\n• First-aid kit & emergency numbers\n• Electrical safety / earthing\n"
                                 "• Excavation shoring\n• Housekeeping & debris removal\n• Toolbox talks daily\n• Trained flagmen for machinery"),
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
