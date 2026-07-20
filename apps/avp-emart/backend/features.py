# -*- coding: utf-8 -*-
"""AVP Emart — enterprise feature router (auth, AI tools, analytics, export, alerts)."""
from __future__ import annotations
import os, json, datetime, hashlib, hmac, secrets, sqlite3, html as _html
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from fastapi import APIRouter, Header
from fastapi.responses import HTMLResponse, PlainTextResponse, JSONResponse
from pydantic import BaseModel

_HERE = os.path.dirname(os.path.abspath(__file__))
try:
    from app import config as _cfg; DB_PATH = _cfg.DB_PATH
except Exception:
    DB_PATH = os.path.join(_HERE, "db.sqlite3")

BRAND = {"emoji": "🛒", "name": "AVP Emart", "sub": "AI Smart Shopping", "p": "#f97316", "s": "#10b981"}

# ── LLM factory ───────────────────────────────────────────────────────────────
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

# ── DB + auth ─────────────────────────────────────────────────────────────────
_SER = URLSafeTimedSerializer(os.environ.get("AUTH_SECRET", "emart-dev-secret"), salt="emart-auth")
_MAXAGE = 60 * 60 * 24 * 30

def _c():
    c = sqlite3.connect(DB_PATH); c.row_factory = sqlite3.Row; return c

def _init():
    try:
        with _c() as c:
            c.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, name TEXT, email TEXT UNIQUE, pw_hash TEXT, pw_salt TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, title TEXT, remind_at TEXT)")
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
                            (datetime.datetime.utcnow().isoformat(), (name or "Shopper").strip(), email, h, s)).lastrowid
    except sqlite3.IntegrityError: return {"error": "Account already exists. Please log in."}
    return {"token": _SER.dumps({"uid": uid}), "user": {"id": uid, "name": (name or "Shopper").strip(), "email": email}}

def _login(email, pw):
    email = (email or "").strip().lower()
    with _c() as c:
        r = c.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not r: return {"error": "No account with this email."}
    h, _ = _hash(pw, r["pw_salt"])
    if not hmac.compare_digest(h, r["pw_hash"]): return {"error": "Incorrect password."}
    return {"token": _SER.dumps({"uid": r["id"]}), "user": {"id": r["id"], "name": r["name"], "email": email}}

def _verify(tok):
    if not tok: return None
    try: d = _SER.loads(tok, max_age=_MAXAGE)
    except Exception: return None
    with _c() as c:
        r = c.execute("SELECT id,name,email FROM users WHERE id=?", (d.get("uid"),)).fetchone()
    return dict(r) if r else None

# ── Generic analytics (counts every table + activity timeline) ────────────────
def _overview():
    with _c() as c:
        tables = [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
        counts, dates = {}, []
        for t in tables:
            try: counts[t] = c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            except Exception: counts[t] = 0
            try:
                cols = [x[1] for x in c.execute(f"PRAGMA table_info({t})")]
                if "created_at" in cols:
                    dates += [r[0][:10] for r in c.execute(f"SELECT created_at FROM {t}") if r[0]]
            except Exception: pass
    today = datetime.date.today()
    timeline = [{"date": (today - datetime.timedelta(days=i)).isoformat(),
                 "count": dates.count((today - datetime.timedelta(days=i)).isoformat())} for i in range(13, -1, -1)]
    return {"counts": counts, "timeline": timeline, "total": sum(counts.values())}

# ── Domain AI tools ───────────────────────────────────────────────────────────
_POPULAR = {"Electronics": ["wireless earbuds", "smartwatch", "power bank"],
            "Home": ["air fryer", "mixer grinder", "vacuum cleaner"],
            "Mobiles": ["5G smartphone", "phone case", "fast charger"]}

def _deal_finder(category):
    try: import comparator
    except Exception: comparator = None
    cat = next((k for k in _POPULAR if k.lower() == (category or "").lower()), "Electronics")
    deals = []
    if comparator:
        for item in _POPULAR[cat]:
            r = comparator.compare(item, 5); b = r.get("best")
            if b: deals.append({"item": item, "platform": b["platform"], "price": b["price"], "rating": b["rating"], "value": b.get("value_score"), "link": b["link"]})
    return {"category": cat, "categories": list(_POPULAR), "deals": deals, "provider": active_provider()}

def _budget_shop(budget, items):
    try: import comparator
    except Exception: comparator = None
    picks, total = [], 0
    for it in [i.strip() for i in items if i.strip()][:8]:
        if comparator:
            r = comparator.compare(it, 5); ps = [p for p in r["products"] if p["price"] <= budget] or r["products"]
            if ps:
                best = min(ps, key=lambda p: p["price"]); total += best["price"]
                picks.append({"item": it, "platform": best["platform"], "price": best["price"], "link": best["link"]})
    within = total <= budget
    note = _llm("You are a budget shopping assistant. In 2 short sentences, comment on this shopping cart vs budget.",
                f"Budget ₹{budget}. Cart total ₹{total}. Items: {[p['item'] for p in picks]}") or \
           (f"Your cart totals ₹{total:,} — {'within' if within else 'over'} your ₹{budget:,} budget.")
    return {"budget": budget, "total": total, "within_budget": within, "picks": picks, "note": note, "provider": active_provider()}

# ── Export + reminders (shared) ───────────────────────────────────────────────
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

# ── Router ────────────────────────────────────────────────────────────────────
router = APIRouter()
_init()

class SignupReq(BaseModel): name: str = ""; email: str; password: str
class LoginReq(BaseModel): email: str; password: str
class DealReq(BaseModel): category: str = "Electronics"
class BudgetReq(BaseModel): budget: float; items: list[str] = []
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

@router.post("/api/tools/deal-finder")
def deal_finder(r: DealReq): return _deal_finder(r.category)
@router.post("/api/tools/budget-shop")
def budget_shop(r: BudgetReq): return _budget_shop(r.budget, r.items)

@router.get("/api/analytics/overview")
def analytics(): return _overview()

@router.post("/api/export/report")
def export_report(r: ReportReq): return HTMLResponse(_report_html(r.title, r.subtitle, r.sections))

@router.post("/api/reminders")
def add_reminder(r: ReminderReq):
    try:
        with _c() as c:
            c.execute("INSERT INTO reminders (created_at,email,title,remind_at) VALUES (?,?,?,?)",
                      (datetime.datetime.utcnow().isoformat(), r.email, r.title, r.remind_at))
    except Exception as e: return {"saved": False, "error": str(e)}
    return {"saved": True}
@router.get("/api/reminders")
def list_reminders(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM reminders" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"reminders": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

# ── More AI tools (wave 2) ────────────────────────────────────────────────────
class ProductQAReq(BaseModel): product: str; question: str
class CompareTwoReq(BaseModel): a: str; b: str
class SavingsReq(BaseModel): category: str = ""

@router.post("/api/tools/product-qa")
def product_qa(r: ProductQAReq):
    ans = _llm("You are a shopping expert. Answer the buyer's question about the product concisely, honestly, in 3-4 sentences.",
               f"Product: {r.product}\nQuestion: {r.question}")
    return {"answer": ans or f"For **{r.product}**: compare specs, ratings, warranty and return policy across platforms before buying.", "provider": active_provider()}

@router.post("/api/tools/compare-two")
def compare_two(r: CompareTwoReq):
    try: import comparator
    except Exception: return {"error": "comparator unavailable"}
    ra, rb = comparator.compare(r.a, 4), comparator.compare(r.b, 4)
    ba, bb = ra.get("best"), rb.get("best")
    winner = None
    if ba and bb: winner = r.a if ba["value_score"] >= bb["value_score"] else r.b
    verdict = _llm("You are a product comparison expert. In 2 sentences, say which is the better buy and why.",
                   f"A={r.a}: {ba}\nB={r.b}: {bb}") if (ba and bb) else None
    return {"a": ba, "b": bb, "winner": winner, "verdict": verdict, "provider": active_provider()}

@router.post("/api/tools/savings-tips")
def savings_tips(r: SavingsReq):
    ans = _llm("You are a money-saving shopping coach. Give 4 concise, practical tips for buying in this category in India.", r.category or "electronics")
    return {"tips": ans or "• Compare live prices across platforms\n• Time purchases with sale events\n• Stack bank/card offers & coupons\n• Consider last-gen or refurbished models", "provider": active_provider()}


# ── Wave 3 ────────────────────────────────────────────────────────────────────
def _init3():
    with _c() as c:
        c.execute("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, item TEXT, platform TEXT, price REAL, status TEXT)")
_init3()
_ORDER_FLOW = ["Placed", "Packed", "Shipped", "Out for delivery", "Delivered"]

class OrderReq(BaseModel): item: str; email: str = ""; platform: str = ""; price: float = 0
class GiftReq(BaseModel): occasion: str; budget: float = 5000; recipient: str = ""
class NegotiateReq(BaseModel): item: str; quoted_price: float = 0

@router.post("/api/orders")
def place_order(r: OrderReq):
    with _c() as c:
        oid = c.execute("INSERT INTO orders (created_at,email,item,platform,price,status) VALUES (?,?,?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.email, r.item, r.platform, r.price, "Placed")).lastrowid
    return {"order_id": oid, "status": "Placed", "flow": _ORDER_FLOW}

@router.get("/api/orders")
def list_orders(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM orders" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"orders": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

@router.post("/api/tools/gift-finder")
def gift_finder(r: GiftReq):
    try:
        import comparator
    except Exception:
        comparator = None
    ideas = _llm("You are a gift expert. Suggest 5 gift ideas (names only) for the occasion/recipient within budget. Comma separated.",
                 f"Occasion: {r.occasion}\nRecipient: {r.recipient}\nBudget: {r.budget}")
    names = [n.strip() for n in (ideas or "").replace("\n", ",").split(",") if n.strip()][:5] if ideas else ["gift hamper", "smartwatch", "perfume", "wireless earbuds", "gift card"]
    picks = []
    if comparator:
        for n in names[:4]:
            b = comparator.compare(n, 3).get("best")
            if b and b["price"] <= r.budget * 1.25:
                picks.append({"item": n, "platform": b["platform"], "price": b["price"], "link": b["link"]})
    return {"occasion": r.occasion, "ideas": names, "picks": picks, "provider": active_provider()}

@router.post("/api/tools/negotiate")
def negotiate(r: NegotiateReq):
    ans = _llm("You are a savvy negotiator. Give 4 concise tips to get a better price on this item.", f"Item: {r.item}\nQuoted: {r.quoted_price}")
    return {"tips": ans or "- Ask for bank/card offers and coupons\n- Compare across platforms\n- Look for exchange/bundle deals\n- Time it with a sale event", "provider": active_provider()}


# ── Wave 4 (loyalty / subscriptions) ──────────────────────────────────────────
def _init4():
    with _c() as c:
        c.execute("CREATE TABLE IF NOT EXISTS loyalty (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, points INTEGER)")
        c.execute("CREATE TABLE IF NOT EXISTS subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, email TEXT, item TEXT, frequency TEXT, active INTEGER DEFAULT 1)")
_init4()

def _tier(p):
    return "Platinum" if p >= 5000 else "Gold" if p >= 2000 else "Silver" if p >= 500 else "Bronze"

class LoyaltyReq(BaseModel): email: str; points: int = 0
class SubReq(BaseModel): email: str; item: str; frequency: str = "monthly"
class CouponReq(BaseModel): cart_value: float = 0

@router.post("/api/loyalty")
def add_points(r: LoyaltyReq):
    with _c() as c:
        c.execute("INSERT INTO loyalty (created_at,email,points) VALUES (?,?,?)", (datetime.datetime.utcnow().isoformat(), r.email, r.points))
    return {"saved": True}

@router.get("/api/loyalty")
def loyalty_balance(email: str):
    with _c() as c:
        total = c.execute("SELECT COALESCE(SUM(points),0) FROM loyalty WHERE email=?", (email,)).fetchone()[0]
    return {"email": email, "points": total, "tier": _tier(total),
            "next_tier_at": {"Bronze": 500, "Silver": 2000, "Gold": 5000, "Platinum": None}[_tier(total)]}

@router.post("/api/subscriptions")
def subscribe(r: SubReq):
    with _c() as c:
        sid = c.execute("INSERT INTO subscriptions (created_at,email,item,frequency) VALUES (?,?,?,?)",
                        (datetime.datetime.utcnow().isoformat(), r.email, r.item, r.frequency)).lastrowid
    return {"subscription_id": sid, "item": r.item, "frequency": r.frequency}

@router.get("/api/subscriptions")
def list_subs(email: str = ""):
    with _c() as c:
        q = "SELECT * FROM subscriptions" + (" WHERE email=?" if email else "") + " ORDER BY id DESC LIMIT 50"
        return {"subscriptions": [dict(x) for x in c.execute(q, (email,) if email else ()).fetchall()]}

@router.post("/api/tools/coupon")
def coupon(r: CouponReq):
    disc = 5 if r.cart_value < 1000 else 10 if r.cart_value < 5000 else 15
    code = "AVP" + secrets.token_hex(3).upper()
    return {"code": code, "discount_pct": disc, "min_cart": r.cart_value, "savings": round(r.cart_value * disc / 100)}


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


# == WhatsApp Cloud API notifications (reused from whatsway) ====================
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


# == Zoho CRM lead push (reused from ZohoAgent) ================================
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
        rec = {"Last_Name": r.last_name or "Lead", "First_Name": r.first_name, "Email": r.email,
               "Phone": r.phone, "Company": r.company or "AVP Emart", "Description": r.description,
               "Lead_Source": "AVP Emart"}
        payload = _json.dumps({"data": [rec]}).encode()
        req = _ureq.Request(f"{api}/crm/v3/Leads", data=payload,
                            headers={"Authorization": f"Zoho-oauthtoken {token}", "Content-Type": "application/json"})
        with _ureq.urlopen(req, timeout=15) as resp:
            data = _json.loads(resp.read())
        rec0 = (data.get("data") or [{}])[0]
        return {"pushed": rec0.get("code") == "SUCCESS", "id": (rec0.get("details") or {}).get("id", ""), "raw": rec0}
    except Exception as e:
        return {"pushed": False, "error": str(e)}


# == AI social captions (reused from socialhub) ================================
_PLATFORM_SPECS = {
    "instagram": {"label": "Instagram", "limit": 2200, "style": "visual, warm, scannable, with line breaks and 8-12 relevant hashtags at the end"},
    "facebook": {"label": "Facebook", "limit": 6000, "style": "conversational, community-focused, easy to read, 1-3 hashtags only if useful"},
    "x": {"label": "X", "limit": 280, "style": "short, sharp, hook-first, 0-2 hashtags, no wasted words"},
    "linkedin": {"label": "LinkedIn", "limit": 3000, "style": "professional, outcome-focused, credible, 3-5 industry hashtags at the end"},
}


class CaptionReq(BaseModel):
    topic: str
    platforms: list = ["instagram", "facebook", "linkedin"]
    brand: str = "AVP Emart"


@router.post("/api/tools/social-captions")
def social_captions(r: CaptionReq):
    plats = [str(p).strip().lower() for p in (r.platforms or []) if str(p).strip().lower() in _PLATFORM_SPECS] or ["instagram"]
    out = {}
    for p in plats:
        spec = _PLATFORM_SPECS[p]
        cap = _llm(
            f"You are an expert {spec['label']} copywriter for an e-commerce brand. Write ONE complete caption for "
            f"{spec['label']} (hard limit {spec['limit']} characters). Style: {spec['style']}. Open with a hook, "
            "include 2-3 tasteful emojis, add a clear shopping CTA, and finish cleanly with no mid-sentence cut-off. "
            "Return ONLY the caption text, no labels, no markdown.",
            f"Brand: {r.brand}\nProduct / topic: {r.topic}", 0.75)
        out[p] = (cap or "").strip()[:spec["limit"]]
    return {"topic": r.topic, "platforms": plats, "captions": out, "provider": active_provider()}



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
    attempts = 3
    current_error = None
    prompt_modifier = ""
    plan = {}
    rows = []
    sql = ""
    
    for attempt in range(attempts):
        out = _llm(
            "You convert a user question into ONE safe SQLite SELECT query for the given schema. Return JSON ONLY: "
            '{"title":"short human title","sql":"a single SELECT statement, no semicolon, no SELECT *","params":{}}. '
            "Use named parameters like :name for any user-provided value; for text search use LOWER(col) LIKE :p with "
            "percent wildcards and a lower-cased value. Prefer grouped aggregates for counts/summaries. Never invent "
            "tables or columns, never use SELECT *, never write or mutate data." + prompt_modifier,
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
            current_error = f"Validation failed: {e}"
            prompt_modifier = f"\n\nCRITICAL FIX: Your previous query '{plan.get('sql')}' was invalid: {current_error}. Please correct the SQL statement."
            continue
            
        wrapped = f"SELECT * FROM ({sql}) AS _q LIMIT {_ASK_ROW_LIMIT + 1}"
        try:
            with _c() as c:
                cur = c.execute(wrapped, params)
                cols = [d[0] for d in cur.description]
                rows = [dict(zip(cols, row)) for row in cur.fetchall()]
            break
        except Exception as e:
            current_error = f"Database error: {e}"
            prompt_modifier = f"\n\nCRITICAL FIX: Your previous query '{sql}' failed in SQLite: {current_error}. Fix table/column names or parameters."
            continue
    else:
        return {"error": f"Query failed after {attempts} attempts. Last error: {current_error}", "sql": sql}
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
