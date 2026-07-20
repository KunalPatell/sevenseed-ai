# -*- coding: utf-8 -*-
"""AVP Charitable Trust — enterprise feature router (auth, AI tools, analytics, 80G receipts, reminders)."""
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

BRAND = {"emoji": "🤝", "name": "AVP Charitable Trust", "sub": "AI for Social Impact", "p": "#f43f5e", "s": "#f59e0b"}

from app.api_keys import groq_key_var, gemini_key_var, openai_key_var


def _groq_key(): return groq_key_var.get().strip() or os.environ.get("GROQ_API_KEY", "").strip()
def _gemini_key(): return gemini_key_var.get().strip() or os.environ.get("GEMINI_API_KEY", "").strip()
def _openai_key(): return openai_key_var.get().strip() or os.environ.get("OPENAI_API_KEY", "").strip()


def _get_llm(t=0.4):
    if _groq_key():
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(api_key=_groq_key(), model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"), temperature=t)
        except Exception: pass
    if _gemini_key():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(google_api_key=_gemini_key(), model="gemini-1.5-flash", temperature=t)
        except Exception: pass
    if _openai_key():
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(api_key=_openai_key(), model="gpt-4o-mini", temperature=t)
        except Exception: pass
    return None

def active_provider():
    for k, n in [("GROQ_API_KEY", f"Groq ({os.environ.get('GROQ_MODEL','llama-3.3-70b-versatile')})"),
                 ("GEMINI_API_KEY", "Google Gemini 1.5 Flash"), ("OPENAI_API_KEY", "OpenAI GPT-4o-mini")]:
        if os.environ.get(k, "").strip(): return n
    return "offline"

def _llm(system, user, t=0.4):
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

_SER = URLSafeTimedSerializer(os.environ.get("AUTH_SECRET", "trust-dev-secret"), salt="trust-auth")
_MAXAGE = 60 * 60 * 24 * 30
def _c():
    c = sqlite3.connect(DB_PATH); c.row_factory = sqlite3.Row; return c
def _init():
    try:
        with _c() as c:
            c.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT UNIQUE, pw_hash TEXT, pw_salt TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, title TEXT, remind_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS donations (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, donor TEXT, email TEXT, amount REAL, pan TEXT, purpose TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS volunteers (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT, skills TEXT, availability TEXT)")
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
                            (datetime.datetime.utcnow().isoformat(), (name or "Donor").strip(), email, h, s)).lastrowid
    except sqlite3.IntegrityError: return {"error": "Account already exists. Please log in."}
    return {"token": _SER.dumps({"uid": uid}), "user": {"id": uid, "name": (name or "Donor").strip(), "email": email}}
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
        try: total_raised = c.execute("SELECT COALESCE(SUM(amount),0) FROM donations").fetchone()[0]
        except Exception: total_raised = 0
    today = datetime.date.today()
    timeline = [{"date": (today - datetime.timedelta(days=i)).isoformat(),
                 "count": dates.count((today - datetime.timedelta(days=i)).isoformat())} for i in range(13, -1, -1)]
    return {"counts": counts, "timeline": timeline, "total": sum(counts.values()), "funds_raised": total_raised}

# ── Domain tools ──────────────────────────────────────────────────────────────
def _grant_writer(program, funder="", amount=""):
    ans = _llm("You are an NGO grant proposal writer. Draft a concise proposal with: summary, need, objectives, "
               "activities, budget outline, and expected impact.", f"Program: {program}\nFunder: {funder}\nAmount sought: {amount}")
    if ans: return {"result": ans, "provider": active_provider()}
    return {"result": ("**Grant Proposal (template):**\n\n"
                       f"**Program:** {program}\n\n"
                       "**Summary:** AVP Charitable Trust seeks support to expand this program to underserved communities in Gujarat.\n\n"
                       "**Need:** Documented gaps in access to education/healthcare for low-income families.\n\n"
                       "**Objectives:** Reach measurable beneficiaries with transparent, AI-tracked reporting.\n\n"
                       "**Activities:** Community outreach, direct delivery, monitoring & evaluation.\n\n"
                       "**Impact:** Lives touched, with utilization certificates and audited accounts.\n\n"
                       "Add a free GROQ_API_KEY for a fully tailored proposal."),
            "provider": active_provider()}

def _receipt_html(donor, amount, pan, purpose, receipt_no):
    esc = _html.escape
    amt = f"₹{int(float(amount or 0)):,}"
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>80G Receipt</title><style>
body{{font-family:'Segoe UI',system-ui,sans-serif;max-width:720px;margin:0 auto;padding:44px;color:#1a1a2e}}
.brand{{display:flex;align-items:center;gap:12px;border-bottom:3px solid {BRAND['p']};padding-bottom:16px}}
.logo{{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,{BRAND['p']},{BRAND['s']});color:#fff;display:grid;place-items:center;font-size:24px}}
h1{{font-size:20px;margin:0}} .tag{{color:#667;font-size:13px}}
.rc{{margin:28px 0;background:#f6f7fb;border-radius:12px;padding:24px}}
.row{{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #ccd}}
.row b{{color:#334}} .amt{{font-size:30px;font-weight:800;color:{BRAND['p']};text-align:center;margin:10px 0}}
.note{{font-size:12.5px;color:#667;margin-top:18px;line-height:1.6}}
.print{{position:fixed;top:16px;right:16px;background:{BRAND['p']};color:#fff;border:0;border-radius:8px;padding:10px 16px;cursor:pointer}}
@media print{{.print{{display:none}}body{{padding:6px}}}}</style></head><body>
<button class="print" onclick="window.print()">🖨 Save as PDF</button>
<div class="brand"><div class="logo">{BRAND['emoji']}</div><div><h1>AVP Charitable Trust</h1><div class="tag">Donation Receipt · Eligible for deduction u/s 80G</div></div></div>
<div class="amt">{amt}</div>
<div class="rc">
<div class="row"><b>Receipt No.</b><span>{esc(receipt_no)}</span></div>
<div class="row"><b>Date</b><span>{datetime.date.today().isoformat()}</span></div>
<div class="row"><b>Received from</b><span>{esc(donor)}</span></div>
<div class="row"><b>PAN</b><span>{esc(pan or '—')}</span></div>
<div class="row"><b>Purpose</b><span>{esc(purpose or 'General Fund')}</span></div>
<div class="row"><b>Amount</b><span>{amt}</span></div>
</div>
<div class="note">This receipt acknowledges your generous contribution to AVP Charitable Trust. Donations are eligible for
50% deduction under Section 80G of the Income Tax Act, 1961 (subject to applicable limits). 80G registration details
available on request. 💚 Thank you — every rupee reaches the community.</div>
</body></html>"""

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
class GrantReq(BaseModel): program: str; funder: str = ""; amount: str = ""
class DonationReq(BaseModel): donor: str; email: str = ""; amount: float; pan: str = ""; purpose: str = ""
class VolunteerReq(BaseModel): name: str; email: str = ""; skills: str = ""; availability: str = ""
class ReceiptReq(BaseModel): donor: str; amount: float; pan: str = ""; purpose: str = ""
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

@router.post("/api/tools/grant-writer")
def grant_writer(r: GrantReq): return _grant_writer(r.program, r.funder, r.amount)

@router.post("/api/donations")
def add_donation(r: DonationReq):
    with _c() as c:
        rid = c.execute("INSERT INTO donations (created_at,donor,email,amount,pan,purpose) VALUES (?,?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.donor, r.email, r.amount, r.pan, r.purpose)).lastrowid
    return {"saved": True, "receipt_no": f"AVP-80G-{rid:05d}"}
@router.get("/api/donations")
def list_donations():
    with _c() as c:
        rows = c.execute("SELECT * FROM donations ORDER BY id DESC LIMIT 100").fetchall()
        total = c.execute("SELECT COALESCE(SUM(amount),0) FROM donations").fetchone()[0]
    return {"donations": [dict(x) for x in rows], "total": total}
@router.post("/api/export/receipt")
def export_receipt(r: ReceiptReq):
    with _c() as c:
        rid = c.execute("INSERT INTO donations (created_at,donor,email,amount,pan,purpose) VALUES (?,?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.donor, "", r.amount, r.pan, r.purpose)).lastrowid
    return HTMLResponse(_receipt_html(r.donor, r.amount, r.pan, r.purpose, f"AVP-80G-{rid:05d}"))

@router.post("/api/volunteers")
def add_volunteer(r: VolunteerReq):
    with _c() as c:
        c.execute("INSERT INTO volunteers (created_at,name,email,skills,availability) VALUES (?,?,?,?,?)",
                  (datetime.datetime.utcnow().isoformat(), r.name, r.email, r.skills, r.availability))
    return {"saved": True, "message": "Thank you for volunteering! Our team will reach out."}
@router.get("/api/volunteers")
def list_volunteers():
    with _c() as c:
        return {"volunteers": [dict(x) for x in c.execute("SELECT * FROM volunteers ORDER BY id DESC LIMIT 100").fetchall()]}

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
class TaxReq(BaseModel): amount: float
class CampaignReq(BaseModel): cause: str; target: str = ""
class StoryReq(BaseModel): program: str

@router.post("/api/tools/tax-saving")
def tax_saving(r: TaxReq):
    ded = round(r.amount * 0.5)  # 80G: 50% of donation deductible
    return {"donation": r.amount, "deduction_80g": ded,
            "tax_saved": {"5%": round(ded * 0.05), "20%": round(ded * 0.20), "30%": round(ded * 0.30)},
            "note": "Under Section 80G, 50% of your donation is deductible (subject to qualifying limits). Actual tax saved depends on your income-tax slab.",
            "provider": active_provider()}

@router.post("/api/tools/campaign")
def campaign(r: CampaignReq):
    ans = _llm("You are a fundraising copywriter for an Indian NGO. Write a compelling campaign: a title, a short emotional story, and a clear ask.",
               f"Cause: {r.cause}\nTarget: {r.target}")
    return {"campaign": ans or (f"**Support {r.cause}**\n\nYour contribution brings real, lasting change to families who need it most. "
                                f"Every rupee is transparently tracked and reaches the community. Join us — together we can reach {r.target or 'our goal'}. 💚"),
            "provider": active_provider()}

@router.post("/api/tools/impact-story")
def impact_story(r: StoryReq):
    ans = _llm("You are an NGO storyteller. Write a short, heartfelt 150-word impact story for donors about this program.", r.program)
    return {"story": ans or (f"Thanks to our donors, the **{r.program}** program changed lives this year — scholarships kept children in school, "
                             "and health camps reached remote families. Every contribution made it possible. 💚 Thank you for being part of the change."),
            "provider": active_provider()}


# ── Wave 3 ────────────────────────────────────────────────────────────────────
def _init3():
    with _c() as c:
        c.execute("CREATE TABLE IF NOT EXISTS campaigns (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, title TEXT, goal REAL, raised REAL DEFAULT 0, cause TEXT)")
        c.execute("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, title TEXT, date TEXT, location TEXT, volunteers_needed INTEGER)")
_init3()

class CampaignReq2(BaseModel): title: str; goal: float; cause: str = ""
class EventReq(BaseModel): title: str; date: str = ""; location: str = ""; volunteers_needed: int = 10
class ThankReq(BaseModel): donor: str; amount: float = 0

@router.post("/api/campaigns")
def create_campaign(r: CampaignReq2):
    with _c() as c:
        cid = c.execute("INSERT INTO campaigns (created_at,title,goal,raised,cause) VALUES (?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.title, r.goal, 0, r.cause)).lastrowid
    return {"campaign_id": cid, "title": r.title, "goal": r.goal}

@router.get("/api/campaigns")
def list_campaigns():
    with _c() as c:
        rows = [dict(x) for x in c.execute("SELECT * FROM campaigns ORDER BY id DESC LIMIT 50").fetchall()]
    for x in rows:
        x["progress_pct"] = round((x.get("raised", 0) / x["goal"]) * 100, 1) if x.get("goal") else 0
    return {"campaigns": rows}

@router.post("/api/events")
def create_event(r: EventReq):
    with _c() as c:
        eid = c.execute("INSERT INTO events (created_at,title,date,location,volunteers_needed) VALUES (?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.title, r.date, r.location, r.volunteers_needed)).lastrowid
    return {"event_id": eid}

@router.get("/api/events")
def list_events():
    with _c() as c:
        return {"events": [dict(x) for x in c.execute("SELECT * FROM events ORDER BY id DESC LIMIT 50").fetchall()]}

@router.post("/api/tools/thank-you")
def thank_you(r: ThankReq):
    ans = _llm("You are an NGO. Write a warm, personal 3-sentence thank-you note to the donor for their contribution.", f"Donor: {r.donor}\nAmount: {r.amount}")
    return {"note": ans or f"Dear {r.donor}, thank you for your generous contribution of {int(r.amount)}. Your kindness directly changes lives in our community. With heartfelt gratitude, AVP Charitable Trust.", "provider": active_provider()}


# ── Wave 4 (donor CRM) ────────────────────────────────────────────────────────
def _init4():
    with _c() as c:
        c.execute("CREATE TABLE IF NOT EXISTS donors (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT, phone TEXT, total_given REAL DEFAULT 0)")
        c.execute("CREATE TABLE IF NOT EXISTS pledges (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, donor TEXT, amount REAL, frequency TEXT)")
_init4()

class DonorReq(BaseModel): name: str; email: str = ""; phone: str = ""; total_given: float = 0
class PledgeReq(BaseModel): donor: str; amount: float; frequency: str = "monthly"
class AppealReq(BaseModel): cause: str; donor: str = "Friend"

@router.post("/api/donors")
def add_donor(r: DonorReq):
    with _c() as c:
        did = c.execute("INSERT INTO donors (created_at,name,email,phone,total_given) VALUES (?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.name, r.email, r.phone, r.total_given)).lastrowid
    return {"donor_id": did}

@router.get("/api/donors")
def list_donors():
    with _c() as c:
        rows = [dict(x) for x in c.execute("SELECT * FROM donors ORDER BY total_given DESC LIMIT 100").fetchall()]
        total = c.execute("SELECT COALESCE(SUM(total_given),0) FROM donors").fetchone()[0]
    return {"donors": rows, "count": len(rows), "lifetime_total": total}

@router.post("/api/pledges")
def add_pledge(r: PledgeReq):
    with _c() as c:
        pid = c.execute("INSERT INTO pledges (created_at,donor,amount,frequency) VALUES (?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.donor, r.amount, r.frequency)).lastrowid
    annual = r.amount * {"monthly": 12, "quarterly": 4, "yearly": 1, "weekly": 52}.get(r.frequency, 12)
    return {"pledge_id": pid, "annual_value": round(annual)}

@router.get("/api/pledges")
def list_pledges():
    with _c() as c:
        return {"pledges": [dict(x) for x in c.execute("SELECT * FROM pledges ORDER BY id DESC LIMIT 100").fetchall()]}

@router.post("/api/tools/appeal-letter")
def appeal_letter(r: AppealReq):
    ans = _llm("You are an NGO fundraiser. Write a warm, personal donation appeal letter (about 120 words) for the cause, addressed to the donor.", f"Donor: {r.donor}\nCause: {r.cause}")
    return {"letter": ans or f"Dear {r.donor},\n\nYour support for {r.cause} can transform lives in our community. A small contribution goes a long way, and every rupee is tracked transparently. Will you join us today?\n\nWith gratitude,\nAVP Charitable Trust", "provider": active_provider()}


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


# == WhatsApp Cloud API donor outreach (reused from whatsway) ==================
def _whatsapp_send(to, body):
    token = os.environ.get("WHATSAPP_ACCESS_TOKEN", "").strip()
    phone_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID", "").strip()
    ver = os.environ.get("WHATSAPP_API_VERSION", "v21.0").strip()
    to_num = "".join(ch for ch in str(to) if ch.isdigit())
    if not token or not phone_id:
        return {"sent": False, "error": "WhatsApp not configured (set WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID).", "preview": body}
    if not to_num:
        return {"sent": False, "error": "Invalid recipient phone number."}
    try:
        payload = _json.dumps({"messaging_product": "whatsapp", "to": to_num,
                               "type": "text", "text": {"body": body[:4000]}}).encode()
        req = _ureq.Request(f"https://graph.facebook.com/{ver}/{phone_id}/messages", data=payload,
                            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
        with _ureq.urlopen(req, timeout=15) as resp:
            data = _json.loads(resp.read())
        mid = ((data.get("messages") or [{}])[0]).get("id", "")
        return {"sent": True, "message_id": mid, "to": to_num}
    except Exception as e:
        return {"sent": False, "error": str(e)}


class WaReq(BaseModel):
    to: str
    body: str


@router.post("/api/notify/whatsapp")
def notify_whatsapp(r: WaReq):
    return _whatsapp_send(r.to, r.body)


# == Zoho CRM donor push (reused from ZohoAgent) ==============================
def _zoho_access_token():
    cid = os.environ.get("ZOHO_CLIENT_ID", "").strip()
    sec = os.environ.get("ZOHO_CLIENT_SECRET", "").strip()
    ref = os.environ.get("ZOHO_REFRESH_TOKEN", "").strip()
    acc = os.environ.get("ZOHO_ACCOUNTS_BASE_URL", "https://accounts.zoho.in").strip().rstrip("/")
    if not (cid and sec and ref):
        return None, "Zoho not configured (set ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET / ZOHO_REFRESH_TOKEN)."
    try:
        data = _uparse.urlencode({"refresh_token": ref, "client_id": cid, "client_secret": sec,
                                  "grant_type": "refresh_token"}).encode()
        req = _ureq.Request(f"{acc}/oauth/v2/token", data=data)
        with _ureq.urlopen(req, timeout=15) as resp:
            tok = _json.loads(resp.read())
        return tok.get("access_token"), (None if tok.get("access_token") else str(tok.get("error", "token error")))
    except Exception as e:
        return None, str(e)


class LeadReq(BaseModel):
    last_name: str
    first_name: str = ""
    email: str = ""
    phone: str = ""
    company: str = ""
    description: str = ""


@router.post("/api/crm/push-lead")
def crm_push_lead(r: LeadReq):
    token, err = _zoho_access_token()
    if not token:
        return {"pushed": False, "error": err, "lead": r.dict()}
    api = os.environ.get("ZOHO_API_DOMAIN", "https://www.zohoapis.in").strip().rstrip("/")
    try:
        rec = {"Last_Name": r.last_name or "Donor", "First_Name": r.first_name, "Email": r.email,
               "Phone": r.phone, "Company": r.company or "AVP Charitable Trust", "Description": r.description,
               "Lead_Source": "AVP Charitable Trust"}
        payload = _json.dumps({"data": [rec]}).encode()
        req = _ureq.Request(f"{api}/crm/v3/Leads", data=payload,
                            headers={"Authorization": f"Zoho-oauthtoken {token}", "Content-Type": "application/json"})
        with _ureq.urlopen(req, timeout=15) as resp:
            data = _json.loads(resp.read())
        rec0 = (data.get("data") or [{}])[0]
        return {"pushed": rec0.get("code") == "SUCCESS", "id": (rec0.get("details") or {}).get("id", ""), "raw": rec0}
    except Exception as e:
        return {"pushed": False, "error": str(e)}


# ── Signature: public transparent ledger + auto-emailed 80G receipt ───────────
@router.get("/api/ledger")
def ledger():
    with _c() as c:
        rows = c.execute("SELECT id,created_at,donor,amount,purpose FROM donations ORDER BY id DESC LIMIT 200").fetchall()
        total = c.execute("SELECT COALESCE(SUM(amount),0) FROM donations").fetchone()[0]
    entries = [{"id": x["id"], "date": (x["created_at"] or "")[:10], "donor": (x["donor"] or "Anonymous"),
                "amount": x["amount"], "purpose": x["purpose"] or "General Fund", "receipt_no": f"AVP-80G-{x['id']:05d}"} for x in rows]
    return {"total_raised": total, "count": len(entries), "ledger": entries,
            "note": "Every donation is publicly logged for full transparency."}

class ReceiptEmailReq(BaseModel): donor: str; email: str; amount: float; pan: str = ""; purpose: str = ""

@router.post("/api/donations/email-receipt")
def email_receipt(r: ReceiptEmailReq):
    with _c() as c:
        rid = c.execute("INSERT INTO donations (created_at,donor,email,amount,pan,purpose) VALUES (?,?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.donor, r.email, r.amount, r.pan, r.purpose)).lastrowid
    rc = f"AVP-80G-{rid:05d}"
    body = (f"<h2 style='color:#f43f5e'>Thank you, {r.donor}! 💚</h2>"
            f"<p>We gratefully acknowledge your donation of <b>₹{int(r.amount):,}</b> to AVP Charitable Trust.</p>"
            f"<p><b>Receipt No:</b> {rc}<br><b>PAN:</b> {r.pan or '-'}<br><b>Purpose:</b> {r.purpose or 'General Fund'}</p>"
            f"<p>This donation is eligible for 50% deduction under Section 80G of the Income Tax Act.</p>"
            f"<p style='color:#667'>Every rupee reaches the community — with full transparency.</p>")
    sent = _brevo_email(r.email, f"AVP Trust — 80G Receipt {rc}", body, r.donor)
    return {"receipt_no": rc, "emailed": sent.get("sent", False), "email_result": sent}


# â”€â”€ Signature: biometric beneficiary verification (fraud prevention) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
from fastapi import UploadFile as _UploadFile, File as _FileF, Form as _FormF
import faceauth as _faceauth

@router.post("/api/face/register")
async def face_register(email: str = _FormF(...), file: _UploadFile = _FileF(...)):
    return _faceauth.register(DB_PATH, email, await file.read())

@router.post("/api/face/verify")
async def face_verify(email: str = _FormF(...), file: _UploadFile = _FileF(...)):
    return _faceauth.verify(DB_PATH, email, await file.read())

@router.get("/api/face/status")
def face_status():
    return {"available": _faceauth.available()}



# â”€â”€ Signature data: Sankey fund-flow ledger (for SVG viz) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
@router.get("/api/ledger/sankey")
def ledger_sankey():
    with _c() as c:
        rows = c.execute("SELECT COALESCE(NULLIF(purpose,''),'General Fund') AS p, COALESCE(SUM(amount),0) AS s FROM donations GROUP BY p").fetchall()
    total = sum(x["s"] for x in rows)
    names = ["All Donations"] + [x["p"] for x in rows] + ["Community Impact"]
    nodes = [{"name": n} for n in dict.fromkeys(names)]
    links = []
    for x in rows:
        if x["s"] > 0:
            links.append({"source": "All Donations", "target": x["p"], "value": x["s"]})
            links.append({"source": x["p"], "target": "Community Impact", "value": round(x["s"] * 0.92)})
    return {"nodes": nodes, "links": links, "total_raised": total,
            "note": "Transparent fund flow â€” from donations to community programs."}




# == Ask Your Data - safe NL->SQL analytics (reused from ZohoAgent query_engine) ==
import re as _re_sql

_FORBIDDEN_SQL = _re_sql.compile(
    r"\b(insert|update|delete|drop|alter|create|replace|truncate|attach|detach|pragma|vacuum|reindex|analyze|grant|revoke)\b",
    _re_sql.IGNORECASE)
_TABLE_REF = _re_sql.compile(r"\b(?:from|join)\s+[`\"\[]?([A-Za-z_][A-Za-z0-9_]*)", _re_sql.IGNORECASE)
_PARAM_NAME = _re_sql.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
_ASK_ROW_LIMIT = 50


def _db_schema():
    with _c() as c:
        tabs = [r[0] for r in c.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchall()]
        lines, allowed = [], set()
        for t in tabs:
            allowed.add(t.lower())
            cols = [row[1] for row in c.execute(f"PRAGMA table_info({t})").fetchall()]
            lines.append(f"- {t}({', '.join(cols)})")
    return "\n".join(lines), allowed


def _validate_select(sql, allowed):
    s = (sql or "").strip().rstrip(";").strip()
    if not s:
        raise ValueError("Empty SQL.")
    if "--" in s or "/*" in s or "*/" in s:
        raise ValueError("SQL comments are not allowed.")
    if ";" in s:
        raise ValueError("Only one statement is allowed.")
    if not _re_sql.match(r"^select\b", s, _re_sql.IGNORECASE):
        raise ValueError("Only SELECT statements are allowed.")
    if _FORBIDDEN_SQL.search(s):
        raise ValueError("SQL contains a forbidden keyword.")
    refs = {m.group(1).lower() for m in _TABLE_REF.finditer(s)}
    if not refs:
        raise ValueError("Query must read from a known table.")
    bad = refs - allowed
    if bad:
        raise ValueError(f"Unknown or disallowed table(s): {', '.join(sorted(bad))}")
    return s


class AskDataReq(BaseModel):
    question: str


@router.post("/api/tools/ask-data")
def ask_data(r: AskDataReq):
    q = (r.question or "").strip()
    if not q:
        return {"error": "Ask a question about your data."}
    try:
        schema, allowed = _db_schema()
    except Exception as e:
        return {"error": f"Could not read the database schema: {e}"}
    if not allowed:
        return {"error": "No data tables found yet - add some records first."}
    out = _llm(
        "You convert a user question into ONE safe SQLite SELECT query for the given schema. Return JSON ONLY: "
        '{"title":"short human title","sql":"a single SELECT statement, no semicolon, no SELECT *","params":{}}. '
        "Use named parameters like :name for any user-provided value; for text search use LOWER(col) LIKE :p with "
        "percent wildcards and a lower-cased value. Prefer grouped aggregates for counts/summaries. Never invent "
        "tables or columns, never use SELECT *, never write or mutate data.",
        f"Schema (table(columns)):\n{schema}\n\nMax rows: {_ASK_ROW_LIMIT}\nQuestion: {q}", 0.0)
    plan = {}
    if out:
        try:
            plan = _json.loads(out[out.find('{'): out.rfind('}') + 1])
        except Exception:
            plan = {}
    raw_params = plan.get("params") or {}
    params = {}
    if isinstance(raw_params, dict):
        for k, v in raw_params.items():
            if _PARAM_NAME.match(str(k)) and (isinstance(v, (str, int, float, bool)) or v is None):
                params[str(k)] = v
    try:
        sql = _validate_select(plan.get("sql") or "", allowed)
    except Exception as e:
        return {"error": f"Could not build a safe query: {e}", "attempted_sql": plan.get("sql") or ""}
    wrapped = f"SELECT * FROM ({sql}) AS _q LIMIT {_ASK_ROW_LIMIT + 1}"
    try:
        with _c() as c:
            cur = c.execute(wrapped, params)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    except Exception as e:
        return {"error": f"Query failed: {e}", "sql": sql}
    truncated = len(rows) > _ASK_ROW_LIMIT
    rows = rows[:_ASK_ROW_LIMIT]
    summary = ""
    if rows:
        summary = _llm(
            "You are a data analyst. In 1-2 concrete sentences, answer the user's question from the result rows. "
            "Quote key numbers. Do not invent data.",
            f"Question: {q}\nResult rows (JSON):\n{_json.dumps(rows)[:2500]}", 0.3) or ""
    else:
        summary = "No matching rows were found."
    return {"question": q, "title": plan.get("title") or "Result", "sql": sql,
            "columns": list(rows[0].keys()) if rows else [], "rows": rows,
            "row_count": len(rows), "truncated": truncated,
            "summary": summary.strip(), "provider": active_provider()}



# == Bulk email campaign with personalization (reused from EmailAutomation) ====
class CampaignReq(BaseModel):
    subject: str
    body: str
    recipients: list = []


@router.post("/api/campaigns/send")
def campaign_send(r: CampaignReq):
    subj = (r.subject or "").strip()
    if not subj or not (r.body or "").strip():
        return {"error": "subject and body are required."}
    recips = []
    for item in (r.recipients or []):
        if isinstance(item, dict):
            email = str(item.get("email", "")).strip()
            name = str(item.get("name", "")).strip()
        else:
            email = str(item).strip()
            name = ""
        if "@" in email:
            recips.append({"email": email, "name": name})
    recips = recips[:50]
    if not recips:
        return {"error": "Provide at least one recipient as {email, name}."}
    results, sent = [], 0
    for rc in recips:
        who = rc["name"] or "there"
        personalized = r.body.replace("{{name}}", who).replace("{name}", who)
        res = _brevo_email(rc["email"], subj, personalized, rc["name"])
        ok = bool(res.get("sent"))
        sent += 1 if ok else 0
        results.append({"email": rc["email"], "sent": ok, "error": res.get("error", "")})
    return {"subject": subj, "total": len(recips), "sent": sent, "failed": len(recips) - sent,
            "results": results, "provider": active_provider()}



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
