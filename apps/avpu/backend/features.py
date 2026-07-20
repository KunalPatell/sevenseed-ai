# -*- coding: utf-8 -*-
"""
AVPU — enterprise feature router.
Mounts on the existing FastAPI app via `app.include_router(router)`:
  • Auth        /api/auth/*
  • AI tools    /api/tools/*   (quiz, career, flashcards, code, study-plan)
  • Analytics   /api/analytics/overview
  • Export      /api/export/report (printable HTML), /api/export/ics (calendar)
  • Reminders   /api/reminders  (+ optional email)
"""
from __future__ import annotations
import datetime
import html as _html
import os
import smtplib
import sqlite3
from email.mime.text import MIMEText

from fastapi import APIRouter, Header
from fastapi.responses import HTMLResponse, PlainTextResponse, JSONResponse
from pydantic import BaseModel

from app import auth, analytics, config
import tools_ai

router = APIRouter()
auth.init()


def _init_extra():
    try:
        c = sqlite3.connect(config.DB_PATH)
        c.execute("CREATE TABLE IF NOT EXISTS quiz_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, topic TEXT, score INTEGER, total INTEGER)")
        c.execute("CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, title TEXT, remind_at TEXT, sent INTEGER DEFAULT 0)")
        c.commit(); c.close()
    except Exception as e:
        print(f"[features] init: {e}")


_init_extra()


def _bearer(authorization: str | None) -> str | None:
    return authorization.replace("Bearer ", "").strip() if authorization else None


# ── Auth ─────────────────────────────────────────────────────────────────────
class SignupReq(BaseModel):
    name: str = ""
    email: str
    password: str

class LoginReq(BaseModel):
    email: str
    password: str


@router.post("/api/auth/signup")
def signup(r: SignupReq):
    res = auth.signup(r.name, r.email, r.password)
    return JSONResponse(res, status_code=400 if "error" in res else 200)

@router.post("/api/auth/login")
def login(r: LoginReq):
    res = auth.login(r.email, r.password)
    return JSONResponse(res, status_code=401 if "error" in res else 200)

@router.get("/api/auth/me")
def me(authorization: str = Header(None)):
    return {"user": auth.verify_token(_bearer(authorization))}


# ── AI tools ─────────────────────────────────────────────────────────────────
class QuizReq(BaseModel):
    topic: str
    n: int = 5

class QuizSaveReq(BaseModel):
    topic: str
    score: int
    total: int

class CareerReq(BaseModel):
    interests: str
    skills: str = ""
    goal: str = ""

class FlashReq(BaseModel):
    topic: str = ""
    text: str = ""
    n: int = 6

class CodeReq(BaseModel):
    code: str
    question: str = ""

class PlanReq(BaseModel):
    goal: str
    hours_per_day: float = 3
    days: int = 7


@router.post("/api/tools/quiz")
def quiz(r: QuizReq):
    return tools_ai.generate_quiz(r.topic, r.n)

@router.post("/api/tools/quiz/save")
def quiz_save(r: QuizSaveReq):
    try:
        c = sqlite3.connect(config.DB_PATH)
        c.execute("INSERT INTO quiz_attempts (created_at, topic, score, total) VALUES (?,?,?,?)",
                  (datetime.datetime.utcnow().isoformat(), r.topic, r.score, r.total))
        c.commit(); c.close()
    except Exception as e:
        return {"saved": False, "error": str(e)}
    return {"saved": True}

@router.post("/api/tools/career")
def career(r: CareerReq):
    return tools_ai.career_path(r.interests, r.skills, r.goal)

@router.post("/api/tools/flashcards")
def flashcards(r: FlashReq):
    return tools_ai.flashcards(r.topic, r.text, r.n)

@router.post("/api/tools/code")
def code(r: CodeReq):
    return tools_ai.code_helper(r.code, r.question)

@router.post("/api/tools/study-plan")
def study_plan(r: PlanReq):
    return tools_ai.study_planner(r.goal, r.hours_per_day, r.days)

class InterviewReq(BaseModel):
    role: str
    n: int = 5

class EssayReq(BaseModel):
    essay: str
    topic: str = ""

@router.post("/api/tools/interview")
def interview(r: InterviewReq):
    return tools_ai.interview_sim(r.role, r.n)

@router.post("/api/tools/essay-grade")
def essay_grade(r: EssayReq):
    return tools_ai.essay_grade(r.essay, r.topic)


# ── Analytics ────────────────────────────────────────────────────────────────
@router.get("/api/analytics/overview")
def analytics_overview():
    return analytics.overview()


# ── Export ───────────────────────────────────────────────────────────────────
class ReportReq(BaseModel):
    title: str
    subtitle: str = ""
    sections: list[dict] = []   # [{"heading": "...", "body": "..."}]


@router.post("/api/export/report")
def export_report(r: ReportReq):
    esc = _html.escape
    secs = "".join(
        f"<section><h2>{esc(str(s.get('heading','')))}</h2>"
        f"<div>{esc(str(s.get('body',''))).replace(chr(10), '<br>')}</div></section>"
        for s in r.sections
    )
    page = f"""<!doctype html><html><head><meta charset="utf-8"><title>{esc(r.title)}</title>
<style>
body{{font-family:'Segoe UI',system-ui,sans-serif;max-width:820px;margin:0 auto;padding:40px;color:#1a1a2e;line-height:1.6}}
.brand{{display:flex;align-items:center;gap:12px;border-bottom:3px solid #2563eb;padding-bottom:16px;margin-bottom:8px}}
.brand .logo{{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#2563eb,#f59e0b);color:#fff;display:grid;place-items:center;font-size:22px;font-weight:800}}
.brand h1{{font-size:22px;margin:0}} .sub{{color:#667;margin:0 0 24px}}
h2{{color:#2563eb;font-size:17px;margin:22px 0 6px;border-left:4px solid #f59e0b;padding-left:10px}}
section div{{background:#f6f7fb;border-radius:10px;padding:14px 16px}}
.foot{{margin-top:34px;padding-top:14px;border-top:1px solid #ddd;color:#889;font-size:13px;display:flex;justify-content:space-between}}
.print{{position:fixed;top:16px;right:16px;background:#2563eb;color:#fff;border:0;border-radius:8px;padding:10px 16px;font-size:14px;cursor:pointer}}
@media print{{.print{{display:none}} body{{padding:0}}}}
</style></head><body>
<button class="print" onclick="window.print()">🖨 Save as PDF</button>
<div class="brand"><div class="logo">🎓</div><div><h1>{esc(r.title)}</h1></div></div>
<p class="sub">{esc(r.subtitle)}</p>
{secs}
<div class="foot"><span>Alpaben Vipulbhai Patel University · AI Student Portal</span><span>{datetime.date.today().isoformat()}</span></div>
</body></html>"""
    return HTMLResponse(page)


class IcsReq(BaseModel):
    title: str = "AVPU Study Plan"
    plan: list[dict] = []           # [{"day":1,"focus":"...","blocks":[...]}]
    start_date: str = ""            # YYYY-MM-DD


@router.post("/api/export/ics")
def export_ics(r: IcsReq):
    try:
        start = datetime.date.fromisoformat(r.start_date) if r.start_date else datetime.date.today()
    except Exception:
        start = datetime.date.today()
    now = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AVPU//StudyPlanner//EN", "CALSCALE:GREGORIAN"]
    for i, day in enumerate(r.plan):
        d = (start + datetime.timedelta(days=i)).strftime("%Y%m%d")
        nxt = (start + datetime.timedelta(days=i + 1)).strftime("%Y%m%d")
        focus = str(day.get("focus", f"Study day {i+1}"))
        blocks = day.get("blocks", [])
        desc = "\\n".join(f"{b.get('time','')}: {b.get('activity','')}" for b in blocks) if blocks else focus
        lines += ["BEGIN:VEVENT", f"UID:avpu-{now}-{i}@avpu", f"DTSTAMP:{now}",
                  f"DTSTART;VALUE=DATE:{d}", f"DTEND;VALUE=DATE:{nxt}",
                  f"SUMMARY:AVPU: {focus}", f"DESCRIPTION:{desc}", "END:VEVENT"]
    lines.append("END:VCALENDAR")
    return PlainTextResponse("\r\n".join(lines), media_type="text/calendar",
                             headers={"Content-Disposition": 'attachment; filename="avpu-study-plan.ics"'})


# ── Reminders / notifications ────────────────────────────────────────────────
class ReminderReq(BaseModel):
    email: str
    title: str
    remind_at: str = ""


def _send_email(to: str, subject: str, body: str) -> bool:
    host = os.environ.get("SMTP_HOST", "").strip()
    if not host:
        return False
    try:
        msg = MIMEText(body)
        msg["Subject"], msg["From"], msg["To"] = subject, os.environ.get("SMTP_FROM", os.environ.get("SMTP_USER", "no-reply@avpu.edu.in")), to
        with smtplib.SMTP(host, int(os.environ.get("SMTP_PORT", "587"))) as s:
            s.starttls()
            if os.environ.get("SMTP_USER"):
                s.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASS", ""))
            s.send_message(msg)
        return True
    except Exception as e:
        print(f"[email] {e}")
        return False


@router.post("/api/reminders")
def add_reminder(r: ReminderReq):
    try:
        c = sqlite3.connect(config.DB_PATH)
        c.execute("INSERT INTO reminders (created_at, email, title, remind_at) VALUES (?,?,?,?)",
                  (datetime.datetime.utcnow().isoformat(), r.email, r.title, r.remind_at))
        c.commit(); c.close()
    except Exception as e:
        return {"saved": False, "error": str(e)}
    emailed = _send_email(r.email, "AVPU Study Reminder", f"Reminder: {r.title}" + (f"\nWhen: {r.remind_at}" if r.remind_at else ""))
    return {"saved": True, "emailed": emailed}


@router.get("/api/reminders")
def list_reminders(email: str = ""):
    try:
        c = sqlite3.connect(config.DB_PATH); c.row_factory = sqlite3.Row
        q = "SELECT * FROM reminders" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        rows = c.execute(q, (email,) if email else ()).fetchall()
        c.close()
        return {"reminders": [dict(x) for x in rows]}
    except Exception as e:
        return {"reminders": [], "error": str(e)}


# ── Wave 3 ────────────────────────────────────────────────────────────────────
def _init3():
    try:
        c = sqlite3.connect(config.DB_PATH)
        c.execute("CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, subject TEXT, status TEXT)")
        c.commit(); c.close()
    except Exception as e:
        print(f"[features] init3: {e}")
_init3()

class CertReq(BaseModel):
    name: str
    course: str
    date: str = ""

class ScholarshipReq(BaseModel):
    profile: str

class AttendanceReq(BaseModel):
    email: str
    subject: str
    status: str = "present"

_CERT_TMPL = """<!doctype html><html><head><meta charset="utf-8"><title>AVPU Certificate</title><style>
body{font-family:'Georgia',serif;margin:0;background:#f0f2f8;display:grid;place-items:center;min-height:100vh}
.cert{width:900px;max-width:96vw;background:#fff;border:14px solid #2563eb;outline:3px solid #f59e0b;outline-offset:-24px;padding:56px 60px;text-align:center;position:relative}
.logo{width:60px;height:60px;border-radius:14px;background:linear-gradient(135deg,#2563eb,#f59e0b);color:#fff;display:inline-grid;place-items:center;font-size:30px;margin-bottom:10px}
h1{font-size:14px;letter-spacing:6px;color:#f59e0b;margin:8px 0 2px;text-transform:uppercase}
h2{font-size:34px;color:#1a2340;margin:2px 0 20px}
.sub{color:#556;font-size:15px}
.name{font-size:40px;color:#2563eb;margin:18px 0 6px;font-weight:700}
.line{width:340px;border-bottom:2px solid #ccd;margin:0 auto 18px}
.course{font-size:20px;color:#1a2340;margin:4px 0 26px}
.foot{display:flex;justify-content:space-between;margin-top:40px;font-size:13px;color:#556}
.sig{border-top:1.5px solid #445;padding-top:6px;width:200px}
.print{position:fixed;top:16px;right:16px;background:#2563eb;color:#fff;border:0;border-radius:8px;padding:10px 16px;cursor:pointer;font-family:sans-serif}
@media print{.print{display:none}body{background:#fff}}
</style></head><body>
<button class="print" onclick="window.print()">Save as PDF</button>
<div class="cert">
<div class="logo">&#127891;</div>
<h1>Certificate of Completion</h1>
<h2>Alpaben Vipulbhai Patel University</h2>
<div class="sub">This is proudly presented to</div>
<div class="name">__NAME__</div>
<div class="line"></div>
<div class="sub">for successfully completing</div>
<div class="course"><b>__COURSE__</b></div>
<div class="foot"><div class="sig">Date: __DATE__</div><div class="sig">Registrar, AVPU</div></div>
</div></body></html>"""

@router.post("/api/tools/certificate")
def certificate(r: CertReq):
    import datetime as _dt
    date = r.date or _dt.date.today().isoformat()
    page = (_CERT_TMPL.replace("__NAME__", _html.escape(r.name))
                      .replace("__COURSE__", _html.escape(r.course))
                      .replace("__DATE__", _html.escape(date)))
    return HTMLResponse(page)

@router.post("/api/tools/scholarship")
def scholarship(r: ScholarshipReq):
    from agents import _llm_text, active_provider
    ans = _llm_text("You are an AVPU scholarship counsellor. Suggest suitable scholarships and eligibility tips for this student profile. Be concise and encouraging.", r.profile, 0.5)
    return {"result": ans or ("Based on your profile, explore: Merit Scholarship (up to 50% for top scorers), Need-based Aid "
                              "(via AVP Charitable Trust), Sports and First-Generation-Learner scholarships. Apply with your "
                              "marksheet and income proof."), "provider": active_provider()}

@router.post("/api/attendance")
def mark_attendance(r: AttendanceReq):
    c = sqlite3.connect(config.DB_PATH)
    c.execute("INSERT INTO attendance (created_at,email,subject,status) VALUES (?,?,?,?)",
              (datetime.datetime.utcnow().isoformat(), r.email, r.subject, r.status))
    c.commit(); c.close()
    return {"saved": True}

@router.get("/api/attendance")
def get_attendance(email: str = ""):
    c = sqlite3.connect(config.DB_PATH); c.row_factory = sqlite3.Row
    q = "SELECT * FROM attendance" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 100"
    rows = [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]
    c.close()
    present = sum(1 for x in rows if x["status"] == "present")
    total = len(rows)
    return {"attendance": rows, "present": present, "total": total, "percentage": round(present / total * 100, 1) if total else 0}


# ── Wave 4 (LMS / grades) ─────────────────────────────────────────────────────
def _init4():
    try:
        c = sqlite3.connect(config.DB_PATH)
        c.execute("CREATE TABLE IF NOT EXISTS grades (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, subject TEXT, grade TEXT, credits REAL)")
        c.commit(); c.close()
    except Exception as e:
        print(f"[features] init4: {e}")
_init4()

_GP = {"A+": 10, "A": 9, "B+": 8, "B": 7, "C": 6, "D": 5, "E": 4, "F": 0}

class GradeReq(BaseModel):
    email: str
    subject: str
    grade: str
    credits: float = 4

class GpaReq(BaseModel):
    grades: list[dict] = []

class LessonReq(BaseModel):
    topic: str
    level: str = "undergraduate"

def _gpa(items):
    tc = sum(float(x.get("credits", 0)) for x in items)
    if not tc:
        return 0
    return round(sum(_GP.get(str(x.get("grade", "")).upper(), 0) * float(x.get("credits", 0)) for x in items) / tc, 2)

@router.post("/api/grades")
def add_grade(r: GradeReq):
    c = sqlite3.connect(config.DB_PATH)
    c.execute("INSERT INTO grades (created_at,email,subject,grade,credits) VALUES (?,?,?,?,?)",
              (datetime.datetime.utcnow().isoformat(), r.email, r.subject, r.grade.upper(), r.credits))
    c.commit(); c.close()
    return {"saved": True}

@router.get("/api/grades")
def list_grades(email: str = ""):
    c = sqlite3.connect(config.DB_PATH); c.row_factory = sqlite3.Row
    q = "SELECT * FROM grades" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 100"
    rows = [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]
    c.close()
    g = _gpa(rows)
    return {"grades": rows, "gpa": g, "percentage": round(g * 9.5, 1) if g else 0}

@router.post("/api/tools/gpa")
def gpa_calc(r: GpaReq):
    g = _gpa(r.grades)
    return {"gpa": g, "percentage": round(g * 9.5, 1), "scale": "10-point"}

@router.post("/api/tools/lesson-plan")
def lesson_plan(r: LessonReq):
    from agents import _llm_text, active_provider
    ans = _llm_text("You are a university instructor. Create a concise lesson plan (objectives, key topics, an activity, and an assessment) for the topic and level.",
                    f"Topic: {r.topic}\nLevel: {r.level}", 0.5)
    return {"plan": ans or f"Lesson plan for {r.topic}: 1) Objectives 2) Key concepts 3) Worked example 4) Hands-on activity 5) Quiz.", "provider": active_provider()}


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


# â”€â”€ Signature: biometric quiz integrity + upload-notes RAG tutor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
from fastapi import UploadFile as _UploadFile, File as _FileF, Form as _FormF
import io as _io2, re as _re2
import faceauth as _faceauth

@router.post("/api/face/register")
async def face_register(email: str = _FormF(...), file: _UploadFile = _FileF(...)):
    return _faceauth.register(config.DB_PATH, email, await file.read())

@router.post("/api/face/verify")
async def face_verify(email: str = _FormF(...), file: _UploadFile = _FileF(...)):
    return _faceauth.verify(config.DB_PATH, email, await file.read())

@router.get("/api/face/status")
def face_status():
    return {"available": _faceauth.available()}

def _extract_text(filename: str, data: bytes) -> str:
    if (filename or "").lower().endswith(".pdf"):
        try:
            import pypdf
            reader = pypdf.PdfReader(_io2.BytesIO(data))
            return "\n".join((pg.extract_text() or "") for pg in reader.pages)
        except Exception as e:
            print(f"[doc] pdf error: {e}")
            return ""
    return data.decode("utf-8", "ignore")

def _top_chunks(text: str, query: str, k: int = 4):
    chunks = [c.strip() for c in _re2.split(r"\n\s*\n", text) if len(c.strip()) > 40]
    if not chunks:
        chunks = [text[i:i + 800] for i in range(0, len(text), 800)]
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import linear_kernel
        v = TfidfVectorizer(stop_words="english")
        m = v.fit_transform(chunks)
        scores = linear_kernel(v.transform([query]), m).ravel()
        return [chunks[i] for i in scores.argsort()[::-1][:k]]
    except Exception:
        return chunks[:k]

@router.post("/api/tools/doc-tutor")
async def doc_tutor(question: str = _FormF(...), file: _UploadFile = _FileF(...)):
    from agents import _llm_text, active_provider
    text = _extract_text(file.filename, await file.read())
    if not text.strip():
        return {"answer": "I couldn't read that document â€” please upload a text-based PDF or .txt file.", "provider": active_provider()}
    ctx = "\n\n".join(_top_chunks(text, question, 4))[:4500]
    ans = _llm_text("You are the AVPU tutor. Answer the student's question using ONLY the provided notes. "
                    "If the notes don't cover it, say so briefly and add general guidance.",
                    f"Question: {question}\n\nStudent's notes:\n{ctx}", 0.3)
    return {"answer": ans or (ctx[:600] + "â€¦"), "grounded_in": file.filename,
            "chars_indexed": len(text), "provider": active_provider()}




# ── Feature reused from ai-interview: resume/JD-tailored interview generator ────
_IV_SYS = ('You are a senior technical interviewer. Generate exactly __N__ interview questions. '
           'Distribution: 50% Technical, 20% Situational, 20% Behavioral, 10% growth/culture-fit. '
           'Technical questions must align with the resume skills and the job description (if provided); '
           'match difficulty to the experience level (junior=fundamentals, mid=implementation+debugging, '
           'senior=architecture+trade-offs, lead=strategy+leadership). '
           'Return STRICT JSON: {"questions":[{"type":"technical","difficulty":"medium","question":"...","tip":"one-line answering tip"}]}. '
           'Return ONLY JSON, no markdown.')

class IvGenReq(BaseModel):
    role: str
    resume: str = ""
    jd: str = ""
    level: str = "mid"
    n: int = 10

@router.post("/api/tools/interview-generate")
def interview_generate(r: IvGenReq):
    import json as _j
    from agents import _llm_text, active_provider
    n = max(5, min(12, r.n))
    out = _llm_text(_IV_SYS.replace("__N__", str(n)),
                    f"Role: {r.role}\nExperience level: {r.level}\nResume:\n{(r.resume or '')[:2500]}\n"
                    f"Job description:\n{(r.jd or '')[:1500]}", 0.5)
    qs = []
    if out:
        try:
            data = _j.loads(out[out.find("{"): out.rfind("}") + 1])
            qs = data.get("questions", [])[:n]
        except Exception:
            pass
    if not qs:
        qs = [{"type": "technical", "difficulty": "medium",
               "question": f"Walk me through a core concept essential for a {r.role} role, with an example.",
               "tip": "Explain simply, then give a concrete real-world example."}]
    return {"role": r.role, "level": r.level, "count": len(qs), "questions": qs, "provider": active_provider()}


# ── Feature reused from testable-ai: AI unit-test generator ────────────────────
class TestGenReq(BaseModel):
    code: str
    language: str = "python"
    framework: str = ""


@router.post("/api/tools/generate-tests")
def generate_tests(r: TestGenReq):
    from agents import _llm_text, active_provider
    lang = (r.language or "python").strip()
    fw = r.framework.strip() or ("pytest" if lang.lower().startswith("py") else "the standard unit-test framework")
    tests = _llm_text(
        f"You are a senior test engineer. Write thorough {fw} unit tests for the given {lang} code. Cover happy "
        "paths, edge cases, boundary values, and error handling; use clear test names and arrange-act-assert. "
        "Return ONLY runnable test code, no prose, no markdown fences.",
        (r.code or "")[:6000], 0.3)
    tests = (tests or "").strip()
    if tests.startswith("```"):
        import re as _re
        tests = _re.sub(r"^```[a-z]*\n?", "", tests).rstrip("`").strip()
    return {"language": lang, "framework": fw,
            "tests": tests or "# Could not generate tests — please provide compilable code.",
            "provider": active_provider()}


# ── Feature reused from ai-interview: 7-dimension interview answer evaluator ────
_IV_EVAL_SYS = (
    "You are an expert interview coach. Evaluate the candidate's interview answers for the given role, experience "
    "level and (optional) job description. Score each dimension 0-10: communication, technical_knowledge, "
    "problem_solving, situational_reasoning, behavioral_fit, role_alignment, confidence. Then compute overall_score "
    "0-100 (weighted by what matters most for the role). Adjust expectations to the level (junior=fundamentals & "
    "learning; mid=practical implementation; senior=architecture & leadership; lead=strategy & mentorship). Give "
    "honest, specific, encouraging coaching. Return STRICT JSON only: "
    '{"scores":{"communication":0,"technical_knowledge":0,"problem_solving":0,"situational_reasoning":0,'
    '"behavioral_fit":0,"role_alignment":0,"confidence":0},"overall_score":0,"overall_recommendation":"...",'
    '"technical_feedback":"...","behavioral_feedback":"...","strengths":["..."],"areas_for_improvement":["..."],'
    '"suggested_followups":["..."]}. No markdown, no prose outside the JSON.')


class IvEvalReq(BaseModel):
    transcript: str
    role: str = "the role"
    level: str = "mid"
    jd: str = ""


@router.post("/api/tools/interview-evaluate")
def interview_evaluate(r: IvEvalReq):
    import json as _j
    from agents import _llm_text, active_provider
    out = _llm_text(
        _IV_EVAL_SYS,
        f"Role: {r.role}\nExperience level: {r.level}\n"
        f"Job description: {r.jd or 'Standard industry requirements for this role.'}\n\n"
        f"Interview transcript / answers:\n{(r.transcript or '')[:8000]}", 0.2)
    data = None
    if out:
        try:
            data = _j.loads(out[out.find('{'): out.rfind('}') + 1])
        except Exception:
            data = None
    if not isinstance(data, dict) or "scores" not in data:
        return {"error": "Could not evaluate — please provide the interview answers as text.",
                "raw": (out or "")[:400], "provider": active_provider()}
    scores = data.get("scores") or {}
    if not data.get("overall_score") and scores:
        try:
            data["overall_score"] = int(round(sum(float(v) for v in scores.values()) / len(scores) * 10))
        except Exception:
            data["overall_score"] = 0
    return {"role": r.role, "level": r.level, **data, "provider": active_provider()}



# ── Feature reused from ai-interview: resume analyzer + JD match ───────────────
class ResumeAnalyzeReq(BaseModel):
    resume: str
    jd: str = ""


@router.post("/api/tools/resume-analyze")
def resume_analyze(r: ResumeAnalyzeReq):
    import json as _j
    from agents import _llm_text, active_provider
    text = (r.resume or "").strip()
    if len(text) < 40:
        return {"error": "Please paste your resume text (at least a few lines)."}
    sys = ("You are an expert technical recruiter and resume analyst. From the RESUME (and the optional JOB "
           "DESCRIPTION) return STRICT JSON: "
           '{"skills":["..."],"technologies":["..."],"projects":["..."],"experience_years":"...",'
           '"seniority_level":"Junior|Mid-Level|Senior|Lead","summary":"2-3 sentence candidate profile",'
           '"jd_match":{"score":0,"matched_skills":["..."],"missing_skills":["..."],"suggestions":["..."]}}. '
           "jd_match.score is a 0-100 fit rating. If no job description is provided, set score to 0 and leave its "
           "arrays empty. Return ONLY the JSON, no markdown.")
    out = _llm_text(sys, f"RESUME:\n{text[:12000]}\n\nJOB DESCRIPTION:\n{(r.jd or 'None provided')[:3000]}", 0.1)
    data = None
    if out:
        try:
            data = _j.loads(out[out.find('{'): out.rfind('}') + 1])
        except Exception:
            data = None
    if not isinstance(data, dict):
        return {"error": "Could not analyze the resume.", "raw": (out or "")[:400], "provider": active_provider()}
    data["has_jd"] = bool((r.jd or "").strip())
    data["provider"] = active_provider()
    return data



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



# ── AI Tutor Chat (Signature Feature — Personal AI Tutor) ────────────────────
_COURSES = [
    {"id": "ml-101", "title": "Machine Learning Fundamentals", "category": "AI/ML", "level": "Beginner", "duration": "8 weeks", "modules": 12, "enrolled": 2847, "rating": 4.8, "instructor": "AI Faculty", "description": "Learn supervised, unsupervised and reinforcement learning from scratch with hands-on Python projects.", "skills": ["Python", "scikit-learn", "NumPy", "Pandas", "TensorFlow basics"]},
    {"id": "dl-201", "title": "Deep Learning with PyTorch", "category": "AI/ML", "level": "Intermediate", "duration": "10 weeks", "modules": 15, "enrolled": 1923, "rating": 4.9, "instructor": "AI Faculty", "description": "Build CNNs, RNNs and Transformers using PyTorch. Complete projects including image classification and NLP.", "skills": ["PyTorch", "CNNs", "RNNs", "Transformers", "CUDA"]},
    {"id": "llm-301", "title": "LLM Engineering & Prompt Design", "category": "AI/ML", "level": "Advanced", "duration": "6 weeks", "modules": 10, "enrolled": 3201, "rating": 4.9, "instructor": "AI Faculty", "description": "Master prompt engineering, RAG systems, fine-tuning LLMs, and deploying AI agents using LangChain and LangGraph.", "skills": ["LangChain", "RAG", "Fine-tuning", "Agents", "Groq/Gemini API"]},
    {"id": "web-101", "title": "Full Stack Web Development", "category": "Web Dev", "level": "Beginner", "duration": "12 weeks", "modules": 20, "enrolled": 4102, "rating": 4.7, "instructor": "AI Faculty", "description": "Build modern web apps from HTML/CSS to React, Node.js and databases. Deploy on cloud platforms.", "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js", "PostgreSQL"]},
    {"id": "ds-201", "title": "Data Science & Analytics", "category": "Data Science", "level": "Intermediate", "duration": "8 weeks", "modules": 14, "enrolled": 2655, "rating": 4.8, "instructor": "AI Faculty", "description": "Learn data wrangling, visualization, statistical analysis and building end-to-end data pipelines.", "skills": ["Python", "Pandas", "Matplotlib", "SQL", "Power BI", "Statistics"]},
    {"id": "cyber-201", "title": "Cybersecurity & Ethical Hacking", "category": "Security", "level": "Intermediate", "duration": "10 weeks", "modules": 16, "enrolled": 1489, "rating": 4.7, "instructor": "AI Faculty", "description": "Learn penetration testing, network security, web vulnerabilities, and defensive measures.", "skills": ["Kali Linux", "Wireshark", "Metasploit", "OWASP", "CTF challenges"]},
    {"id": "cloud-201", "title": "Cloud Architecture & DevOps", "category": "Cloud", "level": "Intermediate", "duration": "9 weeks", "modules": 14, "enrolled": 1876, "rating": 4.8, "instructor": "AI Faculty", "description": "Deploy and scale applications using AWS/GCP, Docker, Kubernetes and CI/CD pipelines.", "skills": ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"]},
    {"id": "mobile-101", "title": "Mobile App Development (Flutter)", "category": "Mobile Dev", "level": "Beginner", "duration": "8 weeks", "modules": 12, "enrolled": 2134, "rating": 4.7, "instructor": "AI Faculty", "description": "Build beautiful cross-platform iOS and Android apps using Flutter and Dart.", "skills": ["Flutter", "Dart", "Firebase", "REST APIs", "State Management"]},
    {"id": "biz-101", "title": "AI for Business & Entrepreneurship", "category": "Business", "level": "Beginner", "duration": "6 weeks", "modules": 10, "enrolled": 3455, "rating": 4.8, "instructor": "AI Faculty", "description": "Learn how to apply AI tools to business problems, build AI-powered startups, and understand the business landscape.", "skills": ["AI Strategy", "No-code AI", "Business Analysis", "Startup Fundamentals"]},
]

class TutorChatReq(BaseModel):
    message: str
    subject: str = ""  # optional subject context
    history: list[dict] = []  # [{"role":"student","content":"..."}]

@router.post("/api/tutor/chat")
def tutor_chat(r: TutorChatReq):
    """Personal AI Tutor — ask any academic question, get a patient, detailed answer."""
    from app.auth import _get_llm_fn
    system = (
        "You are Prof. AVP, an expert AI tutor at AVPU (Alpaben Vipulbhai Patel University). "
        "You are extremely knowledgeable, patient, and encouraging. "
        "Help students understand any concept — explain clearly with examples, analogies, and step-by-step breakdowns. "
        "If a topic has code, provide working code examples. "
        "For math, show step-by-step working. "
        "Encourage the student and celebrate their effort. "
        "You can teach: programming, AI/ML, data science, math, physics, chemistry, business, and general academic subjects."
        + (f" Subject context: {r.subject}" if r.subject else "")
    )
    # Build conversation context
    context_parts = []
    for msg in (r.history or [])[-8:]:
        role = "Student" if msg.get("role") == "student" else "Prof. AVP"
        context_parts.append(f"{role}: {msg.get('content', '')}")
    context = "\n".join(context_parts)
    full_query = f"{context}\nStudent: {r.message}" if context else r.message

    # Use the local _llm function from AVPU features.py
    from agents import _llm_text, active_provider as _ap
    reply = _llm_text(system, full_query, 0.5)
    if not reply:
        reply = f"That's a great question about '{r.message}'! Let me break this down for you step by step. Unfortunately, I'm currently offline — please add your Groq API key in Settings to get personalized AI tutoring."
    return {"reply": reply, "provider": _ap()}


@router.get("/api/courses/list")
def courses_list(category: str = "", level: str = "", search: str = ""):
    """Browse all available courses with optional filters."""
    results = _COURSES
    if category:
        results = [c for c in results if category.lower() in c["category"].lower()]
    if level:
        results = [c for c in results if level.lower() in c["level"].lower()]
    if search:
        s = search.lower()
        results = [c for c in results if s in c["title"].lower() or s in c["description"].lower() or any(s in skill.lower() for skill in c.get("skills", []))]
    categories = list({c["category"] for c in _COURSES})
    return {"courses": results, "count": len(results), "total": len(_COURSES), "categories": sorted(categories)}


@router.get("/api/courses/{course_id}")
def course_detail(course_id: str):
    """Get detailed info about a specific course."""
    course = next((c for c in _COURSES if c["id"] == course_id), None)
    if not course:
        from fastapi import HTTPException
        raise HTTPException(404, detail="Course not found")
    return course


class RoadmapReq(BaseModel):
    role: str  # e.g. "Machine Learning Engineer", "Full Stack Developer"
    experience: str = "beginner"  # beginner, intermediate, advanced
    timeline_months: int = 6

@router.post("/api/roadmap/generate")
def roadmap(r: RoadmapReq):
    """Generate a personalized career roadmap for a target role."""
    from agents import _llm_text, active_provider as _ap
    system = (
        "You are a career roadmap generator. Given a target tech role, experience level, and timeline, "
        "create a structured month-by-month learning roadmap. Include: "
        "- Key skills to learn (in order) "
        "- Recommended resources/topics per month "
        "- Milestones and projects "
        "- Job search strategy for the final month "
        "Format as a clear, motivating plan."
    )
    ans = _llm_text(system, f"Role: {r.role}\nExperience: {r.experience}\nTimeline: {r.timeline_months} months", 0.6)
    return {
        "role": r.role,
        "timeline_months": r.timeline_months,
        "roadmap": ans or f"Month 1-2: Learn Python basics and data structures\nMonth 3-4: Core {r.role} skills\nMonth 5: Projects and portfolio\nMonth 6: Job applications and interviews",
        "provider": _ap()
    }


@router.get("/dashboard")
def owl_dashboard():
    return HTMLResponse(_OWL_DASHBOARD_HTML)

