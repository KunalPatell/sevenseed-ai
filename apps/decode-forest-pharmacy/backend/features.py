# -*- coding: utf-8 -*-
"""Decode Forest Pharmacy — enterprise feature router (auth, AI tools, analytics, export, reorder reminders)."""
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

BRAND = {"emoji": "💊", "name": "Decode Forest Pharmacy", "sub": "AI Pharmacy", "p": "#10b981", "s": "#14b8a6"}

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

_SER = URLSafeTimedSerializer(os.environ.get("AUTH_SECRET", "decode-dev-secret"), salt="decode-auth")
_MAXAGE = 60 * 60 * 24 * 30
def _c():
    c = sqlite3.connect(DB_PATH); c.row_factory = sqlite3.Row; return c
def _init():
    try:
        with _c() as c:
            c.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT UNIQUE, pw_hash TEXT, pw_salt TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, title TEXT, remind_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS health_records (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, condition TEXT, medicines TEXT, notes TEXT)")
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
                            (datetime.datetime.utcnow().isoformat(), (name or "Patient").strip(), email, h, s)).lastrowid
    except sqlite3.IntegrityError: return {"error": "Account already exists. Please log in."}
    return {"token": _SER.dumps({"uid": uid}), "user": {"id": uid, "name": (name or "Patient").strip(), "email": email}}
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
def _dosage(medicine, weight_kg, age):
    weight_kg = float(weight_kg or 0)
    med = (medicine or "").lower()
    if "paracetamol" in med or "crocin" in med or "dolo" in med or "calpol" in med:
        per = round(weight_kg * 15); mx = round(weight_kg * 60)
        rec = f"Paracetamol: **{per} mg per dose** (15 mg/kg) every 4-6 hours. Max **{mx} mg/day** (60 mg/kg)."
    elif "ibuprofen" in med or "brufen" in med or "combiflam" in med:
        per = round(weight_kg * 10); mx = round(weight_kg * 30)
        rec = f"Ibuprofen: **{per} mg per dose** (10 mg/kg) every 6-8 hours after food. Max **{mx} mg/day** (30 mg/kg)."
    else:
        rec = "Weight-based dosing is available for Paracetamol and Ibuprofen. For other medicines, follow the label or ask a pharmacist."
    warn = "⚠️ For children under 3 months, pregnancy, or chronic illness, always consult a doctor before dosing."
    return {"medicine": medicine, "weight_kg": weight_kg, "recommendation": rec, "warning": warn, "provider": active_provider()}

def _health_tips(topic):
    ans = _llm("You are a friendly pharmacist. Give 4-5 practical, safe wellness tips for the topic. Not a substitute for medical advice.", topic or "general wellness", 0.5)
    if ans: return {"topic": topic, "tips": ans, "provider": active_provider()}
    tips = {"diabetes": ["Monitor blood sugar regularly", "Eat low-GI foods and avoid sugary drinks", "30 min daily walk", "Take medicines on time", "Regular eye & foot checks"],
            "bp": ["Cut down salt", "Exercise 30 min/day", "Manage stress & sleep well", "Take BP meds daily", "Limit alcohol & quit smoking"],
            "immunity": ["Balanced diet rich in fruits & veg", "Vitamin C & zinc if deficient", "7-8 hrs sleep", "Stay hydrated", "Regular exercise"]}
    key = next((k for k in tips if k in (topic or "").lower()), "immunity")
    return {"topic": topic, "tips": "\n".join(f"• {t}" for t in tips[key]), "provider": active_provider()}

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
class DosageReq(BaseModel): medicine: str; weight_kg: float; age: str = ""
class TipsReq(BaseModel): topic: str
class RecordReq(BaseModel): email: str; condition: str; medicines: str = ""; notes: str = ""
class ReportReq(BaseModel): title: str; subtitle: str = ""; sections: list[dict] = []
class ReminderReq(BaseModel): email: str; title: str; remind_at: str = ""


# ── Gujarat Health Camps & Free Treatment Schemes ────────────────────────────
CAMPS = [
    {"title": "Ahmedabad Free Eye Checkup & Surgery Camp", "category": "Eye Checkup", "date": "2026-08-05", "time": "9:00 AM - 4:00 PM", "venue": "Civil Hospital, Asarwa", "city": "Ahmedabad", "organizer": "Red Cross & Civil Eye Dept", "description": "Free refractive checkup, cataract screening, and referral for free surgical treatment."},
    {"title": "Surat Mega Blood Donation Drive", "category": "Blood Donation", "date": "2026-08-12", "time": "10:00 AM - 5:00 PM", "venue": "Community Hall, Adajan", "city": "Surat", "organizer": "Surat Youth Welfare Trust", "description": "Annual blood donation camp. All donors receive a donor card, certificate, and health drink."},
    {"title": "Rajkot Preventive Cardiac Care Camp", "category": "Cardiac Care", "date": "2026-08-20", "time": "8:00 AM - 2:00 PM", "venue": "Rotary Club Hall, Near Race Course", "city": "Rajkot", "organizer": "UN Mehta Institute & Rotary Club", "description": "Free ECG, BP check, cardiologist consultations, and diet guidance for cardiac health."},
    {"title": "Vadodara Maternal & Pediatrics Checkup", "category": "Pediatrics & Maternal", "date": "2026-08-27", "time": "9:00 AM - 3:00 PM", "venue": "Akota Stadium Hall", "city": "Vadodara", "organizer": "Baroda Medical College", "description": "Free health screening for infants and pregnant women, iron supplements, and vaccination advice."},
    {"title": "Bhavnagar Free Dental & Diabetes Screening", "category": "Dental & Diabetes", "date": "2026-09-02", "time": "9:00 AM - 4:00 PM", "venue": "Town Hall, Bhavnagar", "city": "Bhavnagar", "organizer": "Bhavnagar Dentists Association", "description": "Free sugar level tests, general dental cleanups, oral health advice, and free toothpaste distribution."}
]

SCHEMES = [
    {"name": "PM-JAY (Ayushman Bharat Yojana)", "coverage": "₹5,00,000 / family / year", "benefits": ["Cashless secondary and tertiary hospitalization", "Pre & post hospitalization expenses up to 15 days", "Covers major critical illnesses, heart procedures, cancer therapy"], "eligibility": "BPL families, low-income rural households, and identified urban workers", "contact": "Helpline: 14555 | Nearest CHC/PHC"},
    {"name": "Mukhyamantri Amrutam (MA) Yojana Gujarat", "coverage": "₹5,00,000 / family / year", "benefits": ["Covers tertiary care for serious illness (cardiovascular, renal, neurosurgery, burns, cancer)", "No registration charge or premium", "Includes transport expenses of ₹300 per visit"], "eligibility": "Families in Gujarat with annual income less than ₹4,00,000", "contact": "Helpline: 1800-233-1022 | District Hospital"},
    {"name": "Pradhan Mantri Bhartiya Janaushadhi Pariyojana", "coverage": "50% - 90% discount on generic medicines", "benefits": ["High-quality bioequivalent generic medicines at low cost", "Surgical items and devices at discounted prices", "Kendras easily accessible across Gujarat cities"], "eligibility": "Open to all citizens without any income criteria", "contact": "Find stores: janaushadhi.gov.in"},
    {"name": "Bal Sakha Yojana (Gujarat Government)", "coverage": "Free neonatal treatment in private hospitals", "benefits": ["Partnership with private pediatricians for newborn care", "Free treatment for low birth weight, respiratory distress, neonatal sepsis", "Covers up to 10 days of ICU hospitalisation"], "eligibility": "All infants born to BPL and SC/ST families in Gujarat", "contact": "District health office | Taluka Health Officer"},
    {"name": "Gujarat Free Diagnostic Services Scheme", "coverage": "100% Free medical lab tests", "benefits": ["Free basic lab tests (CBC, Blood Sugar, Liver & Renal Panel)", "Free ECG, basic X-rays, and obstetric ultrasounds", "Available at all PHCs, CHCs, and sub-district hospitals"], "eligibility": "All residents of Gujarat visiting government hospitals", "contact": "Visit any government Primary/Community Health Center"}
]

@router.get("/api/health-camps")
def list_camps(query: str = ""):
    if not query.strip():
        return {"camps": CAMPS}
    q = query.lower()
    filtered = [c for c in CAMPS if q in c["title"].lower() or q in c["city"].lower() or q in c["category"].lower()]
    return {"camps": filtered}

@router.get("/api/free-schemes")
def list_schemes(query: str = ""):
    if not query.strip():
        return {"schemes": SCHEMES}
    q = query.lower()
    filtered = [s for s in SCHEMES if q in s["name"].lower() or q in s["eligibility"].lower()]
    return {"schemes": filtered}

@router.post("/api/auth/signup")
def signup(r: SignupReq):
    res = _signup(r.name, r.email, r.password); return JSONResponse(res, status_code=400 if "error" in res else 200)
@router.post("/api/auth/login")
def login(r: LoginReq):
    res = _login(r.email, r.password); return JSONResponse(res, status_code=401 if "error" in res else 200)
@router.get("/api/auth/me")
def me(authorization: str = Header(None)):
    return {"user": _verify(authorization.replace("Bearer ", "").strip() if authorization else None)}

@router.post("/api/tools/dosage")
def dosage(r: DosageReq): return _dosage(r.medicine, r.weight_kg, r.age)
@router.post("/api/tools/health-tips")
def health_tips(r: TipsReq): return _health_tips(r.topic)

@router.post("/api/records")
def add_record(r: RecordReq):
    with _c() as c:
        c.execute("INSERT INTO health_records (created_at,email,condition,medicines,notes) VALUES (?,?,?,?,?)",
                  (datetime.datetime.utcnow().isoformat(), r.email, r.condition, r.medicines, r.notes))
    return {"saved": True}
@router.get("/api/records")
def list_records(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM health_records" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"records": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

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
class BmiReq(BaseModel): weight_kg: float; height_cm: float
class DietReq(BaseModel): goal: str
class FirstAidReq(BaseModel): situation: str

@router.post("/api/tools/bmi")
def bmi(r: BmiReq):
    h = (r.height_cm or 0) / 100
    val = round(r.weight_kg / (h * h), 1) if h else 0
    cat = ("Underweight" if val < 18.5 else "Normal" if val < 25 else "Overweight" if val < 30 else "Obese") if val else "—"
    advice = {"Underweight": "Increase nutrient-dense calories & protein; consult a doctor if persistent.",
              "Normal": "Great! Maintain a balanced diet and regular activity.",
              "Overweight": "Aim for a modest calorie deficit, more activity and whole foods.",
              "Obese": "Consult a doctor; focus on gradual, sustainable diet & exercise changes."}.get(cat, "")
    return {"bmi": val, "category": cat, "advice": advice, "provider": active_provider()}

@router.post("/api/tools/diet-plan")
def diet_plan(r: DietReq):
    ans = _llm("You are a nutritionist. Give a simple 1-day Indian diet plan (breakfast, lunch, snack, dinner) for the goal. Keep it practical and healthy.", r.goal)
    return {"plan": ans or "Breakfast: oats + fruit · Lunch: dal, sabzi, roti, salad · Snack: nuts/fruit · Dinner: light protein + veg. Stay hydrated.", "provider": active_provider()}

@router.post("/api/tools/first-aid")
def first_aid(r: FirstAidReq):
    ans = _llm("You are a first-aid guide. Give clear step-by-step first-aid for the situation, and say when to call emergency (108). Be careful and safe.", r.situation)
    return {"steps": ans or "Keep the person calm and safe. For any serious symptom (bleeding, breathing difficulty, unconsciousness), call 108 immediately.", "disclaimer": "Informational only — call 108 in emergencies.", "provider": active_provider()}


# ── Wave 3 ────────────────────────────────────────────────────────────────────
def _init3():
    with _c() as c:
        c.execute("CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT, doctor TEXT, slot TEXT, reason TEXT, status TEXT)")
_init3()

class ApptReq(BaseModel): name: str; email: str = ""; doctor: str = "General Physician"; slot: str = ""; reason: str = ""
class LabReq(BaseModel): concern: str
class MedSchedReq(BaseModel): medicines: list[str] = []

@router.post("/api/appointments")
def book_appt(r: ApptReq):
    with _c() as c:
        aid = c.execute("INSERT INTO appointments (created_at,name,email,doctor,slot,reason,status) VALUES (?,?,?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.name, r.email, r.doctor, r.slot, r.reason, "Confirmed")).lastrowid
    return {"appointment_id": aid, "status": "Confirmed", "message": f"Teleconsult with {r.doctor} booked. We will share a video link before your slot."}

@router.get("/api/appointments")
def list_appts(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM appointments" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"appointments": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

@router.post("/api/tools/lab-tests")
def lab_tests(r: LabReq):
    ans = _llm("You are a diagnostics advisor. Recommend relevant lab tests for the concern with a 1-line prep note each. This is not a diagnosis.", r.concern)
    return {"recommendations": ans or "- CBC (Complete Blood Count): no prep\n- Fasting Blood Sugar: 8-12h fasting\n- Lipid Profile: 12h fasting\n- Thyroid (TSH): no prep", "disclaimer": "Informational only - consult a doctor.", "provider": active_provider()}

@router.post("/api/tools/med-schedule")
def med_schedule(r: MedSchedReq):
    times = ["8:00 AM", "2:00 PM", "8:00 PM"]
    sched = []
    for i, m in enumerate([x for x in r.medicines if x.strip()][:10]):
        for t in (times[:2] if i % 2 == 0 else times[:1]):
            sched.append({"time": t, "medicine": m, "note": "after food"})
    sched.sort(key=lambda x: x["time"])
    return {"schedule": sched, "tip": "Set reminders and never skip a dose. Complete antibiotic courses fully.", "provider": active_provider()}


# ── Wave 4 (e-prescription) ───────────────────────────────────────────────────
def _init4():
    with _c() as c:
        c.execute("CREATE TABLE IF NOT EXISTS eprescriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, patient TEXT, doctor TEXT, medicines TEXT, notes TEXT)")
_init4()

class RxReq(BaseModel): patient: str; doctor: str = "Dr. Decode Forest"; medicines: str; notes: str = ""
class PillReq(BaseModel): description: str

@router.post("/api/prescriptions")
def create_rx(r: RxReq):
    with _c() as c:
        rid = c.execute("INSERT INTO eprescriptions (created_at,patient,doctor,medicines,notes) VALUES (?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.patient, r.doctor, r.medicines, r.notes)).lastrowid
    return {"prescription_id": rid, "rx_no": f"DFP-RX-{rid:05d}"}

@router.get("/api/prescriptions")
def list_rx(patient: str = ""):
    with _c() as c:
        q = "SELECT * FROM eprescriptions" + (" WHERE patient=?" if patient else "") + " ORDER BY id DESC LIMIT 50"
        return {"prescriptions": [dict(x) for x in c.execute(q, (patient,) if patient else ()).fetchall()]}

@router.post("/api/export/prescription")
def export_rx(r: RxReq):
    sections = [{"heading": "Patient", "body": r.patient}, {"heading": "Prescribed by", "body": r.doctor},
                {"heading": "Medicines (Rx)", "body": r.medicines}, {"heading": "Notes", "body": r.notes or "-"}]
    return HTMLResponse(_report_html("e-Prescription", "Digitally issued - a licensed pharmacist will verify before dispensing", sections))

@router.post("/api/tools/pill-identifier")
def pill_identifier(r: PillReq):
    ans = _llm("You are a pharmacist. From the pill/tablet description (colour, shape, imprint), suggest the most likely medicines. Always stress a pharmacist must confirm before use.", r.description)
    return {"result": ans or "I can't safely identify a medicine from a description alone. Please show the strip/packaging to a pharmacist.", "disclaimer": "Never take an unidentified medicine.", "provider": active_provider()}


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


# == WhatsApp Cloud API reminders (reused from whatsway) =======================
# Appointment + medication reminders over WhatsApp.
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


class MedReminderReq(BaseModel):
    to: str
    patient: str = ""
    medicine: str
    time: str = ""


@router.post("/api/notify/med-reminder")
def med_reminder(r: MedReminderReq):
    body = (f"Hi {r.patient or 'there'}, this is a reminder from Decode Forest Pharmacy "
            f"to take your medicine: {r.medicine}" + (f" at {r.time}." if r.time else ".") +
            " Please take it with water as advised. Reply STOP to opt out.")
    return _whatsapp_send(r.to, body)


# ── Signature: real drug database (OpenFDA — free, live) ──────────────────────
class DrugInfoReq(BaseModel): drug: str

_DRUG_SYN = {"paracetamol": "acetaminophen", "adrenaline": "epinephrine", "salbutamol": "albuterol",
             "frusemide": "furosemide", "glyceryl trinitrate": "nitroglycerin"}

@router.post("/api/tools/drug-info")
def drug_info(r: DrugInfoReq):
    name = _DRUG_SYN.get((r.drug or "").strip().lower(), (r.drug or "").strip())
    term = _uparse.quote(name)
    res = None
    for field in ("generic_name", "brand_name", "substance_name"):
        try:
            data = _http_get(f"https://api.fda.gov/drug/label.json?search=openfda.{field}:{term}&limit=1")
            res = (data.get("results") or [None])[0]
            if res:
                break
        except Exception:
            res = None
    if not res:
        return {"found": False, "message": f"No FDA label found for '{r.drug}'. Try the generic/salt name (e.g. 'paracetamol')."}
    o = res.get("openfda", {})
    def _f(k):
        v = res.get(k) or []
        return (v[0] if v else "").strip()
    return {
        "found": True,
        "brand": (o.get("brand_name") or [r.drug])[0],
        "generic": (o.get("generic_name") or [""])[0],
        "manufacturer": (o.get("manufacturer_name") or [""])[0],
        "purpose": _f("purpose")[:400],
        "usage": _f("indications_and_usage")[:600],
        "dosage": _f("dosage_and_administration")[:400],
        "warnings": _f("warnings")[:600],
        "source": "U.S. FDA (openFDA)",
        "disclaimer": "US FDA labelling — always confirm India-specific dosing with your doctor/pharmacist.",
    }


# â”€â”€ Signature data: drug-interaction network graph (for SVG viz) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
class InteractionGraphReq(BaseModel): drugs: list[str] = []

def _find_interaction(a, b):
    try:
        from pharmacy_data import INTERACTIONS
    except Exception:
        return None
    al, bl = a.lower(), b.lower()
    for i in INTERACTIONS:
        da = str(i.get("drug_a", "")).lower()
        db = str(i.get("drug_b", "")).lower()
        if not da or not db:
            continue
        if ((da in al or al in da) and (db in bl or bl in db)) or ((da in bl or bl in da) and (db in al or al in db)):
            return i
    return None

@router.post("/api/tools/interaction-graph")
def interaction_graph(r: InteractionGraphReq):
    drugs = [d.strip() for d in r.drugs if d.strip()][:12]
    nodes = [{"id": d, "label": d} for d in drugs]
    edges = []
    for i in range(len(drugs)):
        for j in range(i + 1, len(drugs)):
            it = _find_interaction(drugs[i], drugs[j])
            if it:
                edges.append({"source": drugs[i], "target": drugs[j],
                              "severity": it.get("severity", "moderate"),
                              "effect": (it.get("effect") or it.get("advice") or "")[:160]})
    return {"nodes": nodes, "edges": edges, "has_interactions": bool(edges),
            "summary": (f"{len(edges)} interaction(s) found â€” review with a pharmacist." if edges
                        else "No known interactions among these medicines.")}




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



# ── Hospital Locator (ported from Sujit's Nearby-Hospital-Locator) ─────────────
# Uses Indian hospital dataset bundled in data/. Falls back to a curated static
# list of major Gujarat hospitals when the CSV is not present.
_INDIA_HOSPITALS = [
    {"name": "Civil Hospital Ahmedabad", "address": "Asarwa, Ahmedabad", "city": "Ahmedabad", "state": "Gujarat", "type": "Government", "beds": 1200, "phone": "079-22681500", "lat": 23.0500, "lng": 72.6000, "maps": "https://maps.google.com/?q=Civil+Hospital+Ahmedabad"},
    {"name": "UN Mehta Institute of Cardiology", "address": "Civil Hospital Campus, Ahmedabad", "city": "Ahmedabad", "state": "Gujarat", "type": "Government - Cardiac Specialty", "beds": 450, "phone": "079-22681200", "lat": 23.0504, "lng": 72.6012, "maps": "https://maps.google.com/?q=UN+Mehta+Institute+Ahmedabad"},
    {"name": "VS Hospital (Vadilal Sarabhai)", "address": "Ellis Bridge, Ahmedabad", "city": "Ahmedabad", "state": "Gujarat", "type": "Government", "beds": 600, "phone": "079-26579900", "lat": 23.0225, "lng": 72.5714, "maps": "https://maps.google.com/?q=VS+Hospital+Ahmedabad"},
    {"name": "Sterling Hospital", "address": "Gurukul Road, Ahmedabad", "city": "Ahmedabad", "state": "Gujarat", "type": "Private Multi-specialty", "beds": 300, "phone": "079-40018000", "lat": 23.0733, "lng": 72.5345, "maps": "https://maps.google.com/?q=Sterling+Hospital+Ahmedabad"},
    {"name": "Apollo Hospitals Ahmedabad", "address": "Plot 1A, Bhat GIDC, Ahmedabad", "city": "Ahmedabad", "state": "Gujarat", "type": "Private Multi-specialty", "beds": 350, "phone": "079-66701800", "lat": 23.0975, "lng": 72.6167, "maps": "https://maps.google.com/?q=Apollo+Hospital+Ahmedabad"},
    {"name": "Surat Municipal Institute of Medical Education", "address": "Umarwada, Surat", "city": "Surat", "state": "Gujarat", "type": "Government Teaching", "beds": 800, "phone": "0261-2244000", "lat": 21.2003, "lng": 72.8302, "maps": "https://maps.google.com/?q=SMIMER+Surat"},
    {"name": "New Civil Hospital Surat", "address": "Majura Gate, Surat", "city": "Surat", "state": "Gujarat", "type": "Government", "beds": 1500, "phone": "0261-2454600", "lat": 21.1833, "lng": 72.8167, "maps": "https://maps.google.com/?q=New+Civil+Hospital+Surat"},
    {"name": "Sir Sayajirao General Hospital Vadodara", "address": "RC Dutt Road, Vadodara", "city": "Vadodara", "state": "Gujarat", "type": "Government Teaching", "beds": 1700, "phone": "0265-2416640", "lat": 22.3147, "lng": 73.1812, "maps": "https://maps.google.com/?q=SSG+Hospital+Vadodara"},
    {"name": "PDU Medical College Hospital Rajkot", "address": "Pandit Deen Dayal Upadhyay, Rajkot", "city": "Rajkot", "state": "Gujarat", "type": "Government Teaching", "beds": 1000, "phone": "0281-2382502", "lat": 22.3029, "lng": 70.8028, "maps": "https://maps.google.com/?q=PDU+Hospital+Rajkot"},
    {"name": "Bhavnagar General Hospital", "address": "Sir T Hospital, Bhavnagar", "city": "Bhavnagar", "state": "Gujarat", "type": "Government", "beds": 700, "phone": "0278-2514300", "lat": 21.7645, "lng": 72.1519, "maps": "https://maps.google.com/?q=Bhavnagar+General+Hospital"},
    {"name": "AIIMS Rajkot", "address": "Paddhari, Rajkot District", "city": "Rajkot", "state": "Gujarat", "type": "Government – AIIMS", "beds": 750, "phone": "02822-220000", "lat": 22.4862, "lng": 70.6295, "maps": "https://maps.google.com/?q=AIIMS+Rajkot"},
    {"name": "Kiran Multi Super Speciality Hospital", "address": "Kalanala Road, Bhavnagar", "city": "Bhavnagar", "state": "Gujarat", "type": "Private Multi-specialty", "beds": 200, "phone": "0278-2417000", "lat": 21.7700, "lng": 72.1504, "maps": "https://maps.google.com/?q=Kiran+Hospital+Bhavnagar"},
    {"name": "Anand Civil Hospital", "address": "Anand, Gujarat", "city": "Anand", "state": "Gujarat", "type": "Government", "beds": 300, "phone": "02692-240651", "lat": 22.5645, "lng": 72.9289, "maps": "https://maps.google.com/?q=Civil+Hospital+Anand"},
    {"name": "AIIMS Gandhinagar", "address": "Lekavada, Gandhinagar", "city": "Gandhinagar", "state": "Gujarat", "type": "Government – AIIMS", "beds": 960, "phone": "079-23969000", "lat": 23.1765, "lng": 72.6388, "maps": "https://maps.google.com/?q=AIIMS+Gandhinagar"},
    {"name": "Gandhinagar Civil Hospital", "address": "Sector-12, Gandhinagar", "city": "Gandhinagar", "state": "Gujarat", "type": "Government", "beds": 400, "phone": "079-23222000", "lat": 23.2156, "lng": 72.6369, "maps": "https://maps.google.com/?q=Civil+Hospital+Gandhinagar"},
]

def _haversine_km(lat1, lng1, lat2, lng2):
    import math
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(a))

# City lat/lng lookup (major Indian cities)
_CITY_COORDS = {
    "ahmedabad": (23.0225, 72.5714), "surat": (21.1702, 72.8311), "vadodara": (22.3072, 73.1812),
    "rajkot": (22.3039, 70.8022), "bhavnagar": (21.7645, 72.1519), "gandhinagar": (23.2156, 72.6369),
    "anand": (22.5645, 72.9289), "nadiad": (22.6916, 72.8634), "bharuch": (21.7051, 72.9959),
    "jamnagar": (22.4707, 70.0577), "junagadh": (21.5222, 70.4579), "gandhidham": (23.0833, 70.1333),
    "mumbai": (19.0760, 72.8777), "delhi": (28.7041, 77.1025), "bangalore": (12.9716, 77.5946),
    "pune": (18.5204, 73.8567), "hyderabad": (17.3850, 78.4867), "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639), "jaipur": (26.9124, 75.7873),
}

class HospitalReq(BaseModel):
    city: str = ""
    lat: float = 0.0
    lng: float = 0.0
    radius_km: float = 50.0

@router.post("/api/hospitals/nearby")
def hospitals_nearby(r: HospitalReq):
    """Find nearby hospitals by city name or lat/lng. Uses India hospital dataset."""
    city_key = (r.city or "").strip().lower()
    user_lat, user_lng = r.lat, r.lng

    # Resolve city to coordinates if lat/lng not given
    if (not user_lat and not user_lng) and city_key:
        coords = _CITY_COORDS.get(city_key)
        if not coords:
            # Try partial match
            for k, v in _CITY_COORDS.items():
                if city_key in k or k in city_key:
                    coords = v
                    break
        if coords:
            user_lat, user_lng = coords
        else:
            return {"hospitals": [], "error": f"City '{r.city}' not found. Try: Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Bhavnagar, Anand, Nadiad, Mumbai, Delhi…"}

    if not user_lat and not user_lng:
        # Return all Gujarat hospitals if no location given
        return {"hospitals": _INDIA_HOSPITALS, "mode": "all_hospitals", "count": len(_INDIA_HOSPITALS)}

    # Try loading CSV from Sujit's dataset if available
    try:
        import csv, os
        csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "hospitals.csv")
        if os.path.exists(csv_path):
            results = []
            with open(csv_path, newline="", encoding="utf-8-sig") as f:
                for row in csv.DictReader(f):
                    try:
                        hlat = float(row.get("LATITUDE") or row.get("lat") or 0)
                        hlng = float(row.get("LONGITUDE") or row.get("lng") or 0)
                        if hlat and hlng:
                            d = _haversine_km(user_lat, user_lng, hlat, hlng)
                            if d <= r.radius_km:
                                results.append({**{k.lower(): v for k, v in row.items()}, "distance_km": round(d, 2),
                                                "maps": f"https://www.google.com/maps/dir/?api=1&origin={user_lat},{user_lng}&destination={hlat},{hlng}&travelmode=driving"})
                    except Exception:
                        pass
            results.sort(key=lambda x: x.get("distance_km", 999))
            return {"hospitals": results[:20], "count": len(results), "mode": "csv_dataset", "radius_km": r.radius_km}
    except Exception:
        pass

    # Fallback: static India hospitals with distance calculation
    results = []
    for h in _INDIA_HOSPITALS:
        d = _haversine_km(user_lat, user_lng, h["lat"], h["lng"])
        if d <= max(r.radius_km, 100):  # Show at least some results
            results.append({**h, "distance_km": round(d, 2),
                            "route": f"https://www.google.com/maps/dir/?api=1&origin={user_lat},{user_lng}&destination={h['lat']},{h['lng']}&travelmode=driving"})
    results.sort(key=lambda x: x.get("distance_km", 999))
    return {"hospitals": results[:15], "count": len(results), "mode": "static_dataset", "radius_km": r.radius_km,
            "note": "Showing major government & private hospitals. Add your SerpAPI/Maps key for real-time results."}


# ── Health Chatbot ──────────────────────────────────────────────────────────────
class HealthChatReq(BaseModel):
    message: str
    history: list[dict] = []  # [{"role":"user","content":"..."}]

@router.post("/api/chat/health")
def health_chat(r: HealthChatReq):
    """Dedicated health chatbot — free AI health advice, medication queries, wellness tips."""
    system = (
        "You are Dr. Decode, a knowledgeable and empathetic health assistant for Decode Forest Pharmacy. "
        "You help users with: health advice, understanding symptoms, medication queries, wellness tips, "
        "understanding test results, diet suggestions, and mental health. "
        "Always remind users to consult a licensed doctor for diagnosis or treatment. "
        "For emergencies (chest pain, breathing difficulty, unconsciousness, severe bleeding), say 'CALL 108 NOW' clearly. "
        "Be warm, concise, and evidence-based. Respond in the same language as the user (Hindi or English)."
    )
    # Build conversation context from history
    context_parts = []
    for msg in (r.history or [])[-6:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        context_parts.append(f"{role.upper()}: {content}")
    context = "\n".join(context_parts)
    full_query = f"{context}\nUSER: {r.message}" if context else r.message

    reply = _llm(system, full_query, 0.5)
    if not reply:
        # Offline fallback responses
        msg_lower = r.message.lower()
        if any(w in msg_lower for w in ["fever", "bukhar", "temperature"]):
            reply = "For fever: Rest, stay hydrated (ORS/water), take Paracetamol 500mg-1g every 6 hours if above 38°C. If fever is above 103°F or lasts more than 3 days, please consult a doctor. Call 108 if there are seizures or very high fever in children."
        elif any(w in msg_lower for w in ["headache", "sir dard", "migraine"]):
            reply = "For headache: Rest in a quiet, dark room. You can take Paracetamol or Ibuprofen (with food). Stay hydrated. If it's sudden and severe (thunderclap headache), or accompanied by fever + stiff neck, call 108 immediately."
        elif any(w in msg_lower for w in ["emergency", "chest pain", "heart attack", "stroke"]):
            reply = "🚨 CALL 108 NOW! For chest pain — have the person sit or lie down, loosen tight clothing. If available and the person is not allergic, give Aspirin 325mg to chew. Do not leave the person alone. Call 108 immediately."
        elif any(w in msg_lower for w in ["diabetes", "blood sugar", "sugar"]):
            reply = "For diabetes management: Monitor blood sugar regularly (target: 80-130 mg/dL fasting). Eat low-GI foods, avoid sugary drinks. Exercise 30 min daily. Take medicines on time. Regular HbA1c tests every 3 months. Stay hydrated and check feet daily."
        else:
            reply = "I'm currently offline but here to help! For any health concern, please consult a licensed doctor. For emergencies, call 108. You can also visit your nearest government hospital for free consultations."
    return {"reply": reply, "provider": active_provider(), "disclaimer": "Not a substitute for professional medical advice."}


# ── SOS Emergency Guide ─────────────────────────────────────────────────────────
class SOSReq(BaseModel):
    situation: str
    location: str = ""

@router.post("/api/emergency/sos")
def emergency_sos(r: SOSReq):
    """Emergency SOS guidance — step-by-step first-aid + when to call 108."""
    system = (
        "You are an emergency first-aid expert. Given an emergency situation, provide: "
        "1) IMMEDIATE ACTION in 2-3 bullet points "
        "2) Step-by-step first aid guidance "
        "3) When to call 108 "
        "4) What NOT to do "
        "Be extremely clear, concise, and calm. This could save a life."
    )
    query = f"Emergency: {r.situation}" + (f" Location: {r.location}" if r.location else "")
    steps = _llm(system, query, 0.3)
    if not steps:
        steps = "🚨 CALL 108 IMMEDIATELY\n\n1. Keep the person calm and still\n2. Do not move if spinal injury suspected\n3. Check breathing — if not breathing, start CPR\n4. Control bleeding with firm pressure\n5. Do not give food/water\n\nWait for ambulance — stay on the line with 108."
    return {
        "emergency_number": "108",
        "guide": steps,
        "provider": active_provider(),
        "disclaimer": "Informational only. Always call 108 for life-threatening emergencies.",
        "maps_search": f"https://www.google.com/maps/search/hospital+near+me" if not r.location else f"https://www.google.com/maps/search/hospital+near+{r.location.replace(' ', '+')}",
    }


@router.get("/dashboard")
def owl_dashboard():
    return HTMLResponse(_OWL_DASHBOARD_HTML)

