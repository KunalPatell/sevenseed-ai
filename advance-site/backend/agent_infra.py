# -*- coding: utf-8 -*-
"""
Enterprise infrastructure for the Sevenseed agentic engine.

  * durable session store + tamper-evident (hash-chained) audit log   -> SQLite
  * API-key auth tiers and per-caller rate limiting
  * per-run context (models actually used, caller tier)
  * real tools: live web search, read-only portfolio SQL, HMAC-signed webhooks

Everything is configured through environment variables so the same code runs on
a laptop (open-dev mode) and in production (keys required).

  AGENT_DATA_DIR            directory for sqlite files          (default: ./data next to this file)
  AGENT_API_KEYS            "name:key,name2:key2" service keys  (unset => open-dev mode)
  AGENT_ADMIN_KEY           key allowed to read the audit log
  AGENT_RATE_PUBLIC_PER_MIN unauthenticated callers per IP      (default 20)
  AGENT_RATE_KEY_PER_MIN    authenticated callers per key       (default 120)
  AGENT_WEBHOOK_URL / AGENT_WEBHOOK_SECRET / AGENT_WEBHOOK_BACKOFF
  SLACK_WEBHOOK_URL         real Slack notifications
  PORTFOLIO_DB_PATH         read-only portfolio database for SQLQueryTool
  AGENT_OFFLINE=1           disable outbound network tools
"""
from __future__ import annotations
import os, re, json, time, hmac, hashlib, sqlite3, threading, uuid, datetime, contextvars
import urllib.request, urllib.parse, urllib.error
import ssl, socket
from collections import defaultdict, deque
from contextlib import contextmanager
from typing import Any, Dict, List, Optional

_HERE = os.path.dirname(os.path.abspath(__file__))
_INIT_LOCK = threading.Lock()
_INITIALISED: set[str] = set()


def _now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")


# ══════════════════════════════════════════════════════════════════════════════
# STORAGE
# ══════════════════════════════════════════════════════════════════════════════

def data_dir() -> str:
    d = os.environ.get("AGENT_DATA_DIR") or os.path.join(_HERE, "data")
    os.makedirs(d, exist_ok=True)
    return d


def state_db_path() -> str:
    return os.path.join(data_dir(), "agent_state.db")


def checkpoint_db_path() -> str:
    return os.path.join(data_dir(), "agent_checkpoints.db")


_SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY, mode TEXT, objective TEXT, status TEXT,
  hitl_required INTEGER DEFAULT 0, hitl_status TEXT DEFAULT 'none', hitl_reason TEXT DEFAULT '',
  created_at TEXT, updated_at TEXT, tokens INTEGER DEFAULT 0, latency_ms REAL DEFAULT 0,
  score INTEGER DEFAULT 0, model TEXT DEFAULT 'none', steps INTEGER DEFAULT 0,
  tool_calls INTEGER DEFAULT 0, guardrail_warnings INTEGER DEFAULT 0,
  actor_id TEXT DEFAULT '', result_json TEXT DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, event TEXT, session_id TEXT,
  actor TEXT, mode TEXT, detail TEXT, prev_hash TEXT, hash TEXT
);
CREATE TABLE IF NOT EXISTS outbox (
  event_id TEXT PRIMARY KEY, ts TEXT, kind TEXT, target TEXT, payload TEXT,
  status TEXT, attempts INTEGER DEFAULT 0, http_status INTEGER, error TEXT
);
"""


@contextmanager
def db():
    path = state_db_path()
    with _INIT_LOCK:
        if path not in _INITIALISED:
            c = sqlite3.connect(path, timeout=15)
            c.execute("PRAGMA journal_mode=WAL")
            c.executescript(_SCHEMA)
            c.commit(); c.close()
            _INITIALISED.add(path)
    conn = sqlite3.connect(path, timeout=15)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def upsert_session(session_id: str, **fields: Any) -> None:
    fields["updated_at"] = _now()
    with db() as c:
        row = c.execute("SELECT 1 FROM sessions WHERE session_id=?", (session_id,)).fetchone()
        if row is None:
            fields.setdefault("created_at", fields["updated_at"])
            cols = ["session_id"] + list(fields)
            c.execute(f"INSERT INTO sessions ({','.join(cols)}) VALUES ({','.join('?' * len(cols))})",
                      [session_id] + list(fields.values()))
        else:
            sets = ",".join(f"{k}=?" for k in fields)
            c.execute(f"UPDATE sessions SET {sets} WHERE session_id=?", list(fields.values()) + [session_id])


def claim_hitl(session_id: str) -> bool:
    """Atomically moves a pending HITL session to 'deciding' so two reviewers cannot both resume it."""
    with db() as c:
        cur = c.execute("UPDATE sessions SET hitl_status='deciding' WHERE session_id=? AND hitl_status='pending'", (session_id,))
        return cur.rowcount == 1


def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    with db() as c:
        r = c.execute("SELECT * FROM sessions WHERE session_id=?", (session_id,)).fetchone()
    return _session_dict(r) if r else None


def list_sessions(limit: int = 50) -> List[Dict[str, Any]]:
    with db() as c:
        rows = c.execute("SELECT * FROM sessions ORDER BY created_at DESC LIMIT ?", (max(1, min(limit, 500)),)).fetchall()
    out = []
    for r in rows:
        d = _session_dict(r)
        d.pop("result", None)
        out.append(d)
    return out


def _session_dict(r: sqlite3.Row) -> Dict[str, Any]:
    d = dict(r)
    try:
        d["result"] = json.loads(d.pop("result_json") or "{}")
    except Exception:
        d["result"] = {}
    return d


# ── audit log (append-only, hash-chained) ─────────────────────────────────────

def audit(event: str, session_id: str = "", actor: str = "", mode: str = "", detail: Optional[dict] = None) -> None:
    payload = json.dumps(detail or {}, sort_keys=True, default=str)
    ts = _now()
    with db() as c:
        c.execute("BEGIN IMMEDIATE")
        last = c.execute("SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1").fetchone()
        prev = last["hash"] if last else "GENESIS"
        digest = hashlib.sha256("|".join([prev, ts, event, session_id, actor, mode, payload]).encode()).hexdigest()
        c.execute("INSERT INTO audit_log (ts,event,session_id,actor,mode,detail,prev_hash,hash) VALUES (?,?,?,?,?,?,?,?)",
                  (ts, event, session_id, actor, mode, payload, prev, digest))


def read_audit(limit: int = 100, session_id: str = "") -> List[Dict[str, Any]]:
    q, args = "SELECT * FROM audit_log", []
    if session_id:
        q += " WHERE session_id=?"; args.append(session_id)
    q += " ORDER BY id DESC LIMIT ?"; args.append(max(1, min(limit, 1000)))
    with db() as c:
        return [dict(r) for r in c.execute(q, args).fetchall()]


def verify_audit_chain() -> Dict[str, Any]:
    with db() as c:
        rows = c.execute("SELECT * FROM audit_log ORDER BY id ASC").fetchall()
    prev = "GENESIS"
    for r in rows:
        expect = hashlib.sha256("|".join([prev, r["ts"], r["event"], r["session_id"], r["actor"], r["mode"], r["detail"]]).encode()).hexdigest()
        if r["prev_hash"] != prev or r["hash"] != expect:
            return {"valid": False, "broken_at_id": r["id"], "entries": len(rows)}
        prev = r["hash"]
    return {"valid": True, "entries": len(rows)}


# ── real observability numbers ────────────────────────────────────────────────

def monitor_stats() -> Dict[str, Any]:
    today = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    with db() as c:
        allr = c.execute("SELECT * FROM sessions").fetchall()
    rows = [dict(r) for r in allr]
    todays = [r for r in rows if (r["created_at"] or "").startswith(today)]
    done = [r for r in rows if r["status"] == "completed"]

    def avg(xs):
        return round(sum(xs) / len(xs), 1) if xs else 0

    by_mode: Dict[str, int] = defaultdict(int)
    by_model: Dict[str, int] = defaultdict(int)
    for r in rows:
        by_mode[r["mode"]] += 1
        by_model[r["model"] or "none"] += 1
    return {
        "sessions_total": len(rows),
        "active_sessions": sum(1 for r in rows if r["status"] == "awaiting_approval"),
        "completed_total": len(done),
        "completed_today": sum(1 for r in todays if r["status"] == "completed"),
        "avg_quality_score": avg([r["score"] for r in done]),
        "avg_latency_ms": avg([r["latency_ms"] for r in done]),
        "tool_call_volume_today": sum(r["tool_calls"] for r in todays),
        "tokens_estimated_today": sum(r["tokens"] for r in todays),
        "guardrail_blocks_today": sum(r["guardrail_warnings"] for r in todays),
        "hitl_triggers_today": sum(1 for r in todays if r["hitl_required"]),
        "hitl_pending": sum(1 for r in rows if r["hitl_status"] == "pending"),
        "model_routing": dict(by_model),
        "venture_swarm_breakdown": dict(by_mode),
        "data_source": "agent_state.db (measured, not synthetic)",
        "last_refreshed": _now(),
    }


# ══════════════════════════════════════════════════════════════════════════════
# PER-RUN CONTEXT
# ══════════════════════════════════════════════════════════════════════════════

_CTX: contextvars.ContextVar[Optional[dict]] = contextvars.ContextVar("sevenseed_agent_ctx", default=None)


def start_run(actor: Optional[dict]):
    ctx = {"models": [], "actor": actor or {}}
    return ctx, _CTX.set(ctx)


def end_run(token) -> None:
    try:
        _CTX.reset(token)
    except Exception:
        pass


def note_model(model_id: str) -> None:
    ctx = _CTX.get()
    if ctx is not None and model_id and model_id not in ctx["models"]:
        ctx["models"].append(model_id)


def external_allowed() -> bool:
    ctx = _CTX.get()
    return True if ctx is None else bool(ctx["actor"].get("can_external", True))


# ══════════════════════════════════════════════════════════════════════════════
# AUTH + RATE LIMIT
# ══════════════════════════════════════════════════════════════════════════════

def _service_keys() -> Dict[str, str]:
    keys: Dict[str, str] = {}
    raw = os.environ.get("AGENT_API_KEYS", "").strip()
    for i, item in enumerate([x.strip() for x in raw.split(",") if x.strip()]):
        name, key = item.split(":", 1) if ":" in item else (f"key{i + 1}", item)
        keys[key] = name
    return keys


def auth_mode() -> str:
    return "api-key" if (_service_keys() or os.environ.get("AGENT_ADMIN_KEY", "").strip()) else "open-dev"


def _match(candidate: str, table: Dict[str, str]) -> Optional[str]:
    found = None
    for k, name in table.items():
        if hmac.compare_digest(candidate.encode(), k.encode()):
            found = name
    return found


_LOOPBACK = {"127.0.0.1", "::1", "localhost", "testclient"}


def authenticate(api_key: Optional[str], client_ip: str) -> Dict[str, Any]:
    keys, admin = _service_keys(), os.environ.get("AGENT_ADMIN_KEY", "").strip()
    api_key = (api_key or "").strip()
    if not keys and not admin:
        return {"tier": "dev", "id": f"dev:{client_ip}", "auth_mode": "open-dev", "can_approve": True,
                "can_external": True, "can_read": True, "is_admin": client_ip in _LOOPBACK}
    if api_key and admin and hmac.compare_digest(api_key.encode(), admin.encode()):
        return {"tier": "admin", "id": "admin", "auth_mode": "api-key", "can_approve": True,
                "can_external": True, "can_read": True, "is_admin": True}
    name = _match(api_key, keys) if api_key else None
    if name:
        return {"tier": "service", "id": f"key:{name}", "auth_mode": "api-key", "can_approve": True,
                "can_external": True, "can_read": True, "is_admin": False}
    if api_key:
        return {"tier": "invalid", "id": f"ip:{client_ip}", "auth_mode": "api-key"}
    return {"tier": "public", "id": f"ip:{client_ip}", "auth_mode": "api-key", "can_approve": False,
            "can_external": False, "can_read": False, "is_admin": False}


_RATE: Dict[str, deque] = defaultdict(deque)
_RATE_LOCK = threading.Lock()


def rate_limit(actor: Dict[str, Any]) -> Optional[int]:
    """Returns None if allowed, else seconds until the caller may retry."""
    if actor["tier"] == "dev":
        return None
    per_min = int(os.environ.get("AGENT_RATE_KEY_PER_MIN", "120") if actor["tier"] in ("service", "admin")
                  else os.environ.get("AGENT_RATE_PUBLIC_PER_MIN", "20"))
    now = time.time()
    with _RATE_LOCK:
        q = _RATE[actor["id"]]
        while q and now - q[0] > 60:
            q.popleft()
        if len(q) >= per_min:
            return max(1, int(60 - (now - q[0])) + 1)
        q.append(now)
    return None


def reset_rate_limits() -> None:
    with _RATE_LOCK:
        _RATE.clear()


# ══════════════════════════════════════════════════════════════════════════════
# REAL TOOLS
# ══════════════════════════════════════════════════════════════════════════════

def _offline() -> bool:
    return os.environ.get("AGENT_OFFLINE", "").strip() == "1"


def web_search(query: str, max_results: int = 5, timeout: float = 6.0) -> Dict[str, Any]:
    """Live keyless web search (DuckDuckGo HTML). Never fabricates results."""
    base = {"query": query, "retrieved_at": _now(), "results": []}
    if _offline():
        return {**base, "status": "offline", "error": "AGENT_OFFLINE=1"}
    try:
        url = "https://html.duckduckgo.com/html/?" + urllib.parse.urlencode({"q": query[:200]})
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (SevenseedAgent/3.1)"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            html = r.read().decode("utf-8", "ignore")
    except Exception as e:
        return {**base, "status": "unavailable", "error": str(e)[:160]}

    results = []
    for m in re.finditer(r'<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>(.*?)(?=<a[^>]*class="result__a"|$)', html, re.S):
        href, title, tail = m.group(1), re.sub(r"<[^>]+>", "", m.group(2)).strip(), m.group(3)
        if "uddg=" in href:
            href = urllib.parse.unquote(urllib.parse.parse_qs(urllib.parse.urlparse(href).query).get("uddg", [href])[0])
        sn = re.search(r'class="result__snippet"[^>]*>(.*?)</a>', tail, re.S)
        snippet = re.sub(r"<[^>]+>", "", sn.group(1)).strip() if sn else ""
        if title and href.startswith("http"):
            results.append({"title": title[:160], "url": href, "snippet": snippet[:300]})
        if len(results) >= max_results:
            break
    return {**base, "status": "live" if results else "no_results", "source": "duckduckgo", "results": results}


# ── read-only portfolio SQL ───────────────────────────────────────────────────

_PORTFOLIO_TABLES = {"ventures", "kpis"}


def portfolio_db_path() -> str:
    return os.environ.get("PORTFOLIO_DB_PATH") or os.path.join(data_dir(), "portfolio.db")


def _seed_portfolio(path: str) -> None:
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return
    c = sqlite3.connect(path)
    c.executescript("""
    CREATE TABLE ventures (id INTEGER PRIMARY KEY, name TEXT, sector TEXT, stage TEXT, mrr_inr INTEGER, customers INTEGER);
    CREATE TABLE kpis (metric TEXT, value TEXT, trend TEXT);
    """)
    c.executemany("INSERT INTO ventures VALUES (?,?,?,?,?,?)", [
        (1, "Rakshak AI", "Cybersecurity", "Series A", 850000, 23),
        (2, "Decode Forest", "Healthtech", "Seed", 420000, 67),
        (3, "Comonk AI", "HRtech", "Pre-Seed", 180000, 12),
        (4, "AVPU", "Edtech", "Seed", 310000, 145),
        (5, "Sevenforce", "Sales Automation", "Seed", 620000, 34),
        (6, "AVP Emart", "Ecommerce", "Pre-Seed", 95000, 8),
        (7, "Breakdown Factor", "Proptech/EPC", "Pre-Seed", 270000, 5),
    ])
    c.executemany("INSERT INTO kpis VALUES (?,?,?)", [
        ("Total ARR", "28.5L", "+34% QoQ"), ("Portfolio NPS", "72", "+8 pts"),
        ("Avg CAC Payback", "4.2 months", "-0.8mo QoQ"), ("Gross Margin", "71%", "+3pp QoQ"),
    ])
    c.commit(); c.close()


_SQL_OK = {sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ, sqlite3.SQLITE_FUNCTION}


def portfolio_query(sql: str, limit: int = 200) -> Dict[str, Any]:
    s = (sql or "").strip().rstrip(";").strip()
    if not s:
        return {"status": "rejected", "error": "empty query"}
    if ";" in s:
        return {"status": "rejected", "error": "only a single statement is allowed"}
    if not re.match(r"(?is)^select\b", s):
        return {"status": "rejected", "error": "only SELECT statements are allowed"}
    path = portfolio_db_path()
    if path == os.path.join(data_dir(), "portfolio.db"):
        _seed_portfolio(path)
    if not os.path.exists(path):
        return {"status": "error", "error": "portfolio database not found"}

    def authorizer(action, arg1, arg2, dbname, source):
        if action == sqlite3.SQLITE_READ and (arg1 or "").lower() not in _PORTFOLIO_TABLES:
            return sqlite3.SQLITE_DENY
        return sqlite3.SQLITE_OK if action in _SQL_OK else sqlite3.SQLITE_DENY

    conn = sqlite3.connect("file:" + path.replace("\\", "/") + "?mode=ro", uri=True, timeout=5)
    try:
        conn.set_authorizer(authorizer)
        deadline = time.time() + 3
        conn.set_progress_handler(lambda: 1 if time.time() > deadline else 0, 10000)
        cur = conn.execute(s)
        cols = [d[0] for d in cur.description or []]
        rows = [dict(zip(cols, r)) for r in cur.fetchmany(limit)]
        return {"status": "success", "columns": cols, "rows": rows, "row_count": len(rows),
                "data_source": os.path.basename(path), "read_only": True}
    except sqlite3.Error as e:
        return {"status": "rejected", "error": str(e)[:200]}
    finally:
        conn.close()


# ── signed webhooks + notifications ───────────────────────────────────────────

def _post(url: str, body: bytes, headers: Dict[str, str], timeout: float = 8.0):
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read(512).decode("utf-8", "ignore")


def _deliver(kind: str, url: str, body: str, headers: Dict[str, str], event_id: str, target_label: str) -> Dict[str, Any]:
    backoff = float(os.environ.get("AGENT_WEBHOOK_BACKOFF", "1.0"))
    attempts, status, http_status, err = 0, "failed", None, ""
    for attempt in range(1, 4):
        attempts = attempt
        try:
            http_status, _ = _post(url, body.encode(), headers)
            status, err = "delivered", ""
            break
        except urllib.error.HTTPError as e:
            http_status, err = e.code, f"HTTP {e.code}"
            if e.code < 500:  # client errors are not retryable
                break
        except Exception as e:
            err = str(e)[:160]
        if attempt < 3:
            time.sleep(backoff * (2 ** (attempt - 1)))
    with db() as c:
        c.execute("UPDATE outbox SET status=?, attempts=?, http_status=?, error=? WHERE event_id=?",
                  (status, attempts, http_status, err, event_id))
    return {"event_id": event_id, "kind": kind, "status": status, "attempts": attempts,
            "http_status": http_status, "error": err, "delivered": status == "delivered", "target": target_label}


def _outbox(kind: str, target: str, payload: str, status: str) -> str:
    event_id = f"evt_{uuid.uuid4().hex[:12]}"
    with db() as c:
        c.execute("INSERT INTO outbox (event_id,ts,kind,target,payload,status,attempts) VALUES (?,?,?,?,?,?,0)",
                  (event_id, _now(), kind, target, payload, status))
    return event_id


def dispatch_webhook(action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Records every event in the outbox; delivers (HMAC-SHA256 signed, 3 tries) only when configured."""
    url = os.environ.get("AGENT_WEBHOOK_URL", "").strip()
    secret = os.environ.get("AGENT_WEBHOOK_SECRET", "").strip()
    envelope = {"event": action, "ts": _now(), "data": payload}
    body = json.dumps(envelope, sort_keys=True, separators=(",", ":"), default=str)
    signature = hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest() if secret else ""
    base = {"action": action, "signed": bool(signature), "dispatched_at": envelope["ts"],
            "payload_sha256": hashlib.sha256(body.encode()).hexdigest()[:16]}

    if not external_allowed():
        eid = _outbox("webhook", url or "-", body, "suppressed_public_tier")
        return {**base, "event_id": eid, "status": "SUPPRESSED_PUBLIC_TIER", "delivered": False, "attempts": 0}
    if _offline() or not url:
        eid = _outbox("webhook", url or "-", body, "not_configured")
        return {**base, "event_id": eid, "status": "NOT_CONFIGURED_LOGGED", "delivered": False, "attempts": 0}
    eid = _outbox("webhook", url, body, "pending")
    headers = {"Content-Type": "application/json", "X-Sevenseed-Event": action, "X-Sevenseed-Event-Id": eid}
    if signature:
        headers["X-Sevenseed-Signature"] = "sha256=" + signature
    res = _deliver("webhook", url, body, headers, eid, urllib.parse.urlparse(url).netloc)
    return {**base, **res, "status": "DELIVERED" if res["delivered"] else "FAILED"}


def send_notification(channel: str, message: str, recipients: Optional[List[str]] = None) -> Dict[str, Any]:
    url = os.environ.get("SLACK_WEBHOOK_URL", "").strip()
    recips = recipients or []
    base = {"channel": channel, "recipients": recips, "message_preview": message[:80] + ("..." if len(message) > 80 else "")}
    if not external_allowed():
        eid = _outbox("notification", "-", message, "suppressed_public_tier")
        return {**base, "message_id": eid, "status": "SUPPRESSED_PUBLIC_TIER"}
    if _offline() or not url or channel != "slack":
        eid = _outbox("notification", "-", message, "not_configured")
        return {**base, "message_id": eid, "status": "NOT_CONFIGURED_LOGGED"}
    eid = _outbox("notification", "slack", message, "pending")
    res = _deliver("notification", url, json.dumps({"text": message}), {"Content-Type": "application/json"}, eid, "slack")
    return {**base, "message_id": eid, "status": "SENT" if res["delivered"] else "FAILED", "attempts": res["attempts"]}


# ── passive recon (allow-listed hosts only) ───────────────────────────────────

def extract_host(text: str) -> str:
    m = re.search(r"(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?::\d+)?", text or "", re.I)
    return m.group(1).lower() if m else ""


def recon_allowed(host: str) -> bool:
    allow = [d.strip().lower() for d in os.environ.get("RECON_ALLOWED_DOMAINS", "sevenseed.onrender.com,sevenseed.in").split(",") if d.strip()]
    return any(host == d or host.endswith("." + d) for d in allow)


def passive_recon(target: str, timeout: float = 6.0) -> Dict[str, Any]:
    """TLS version/expiry and security-header check. Only for hosts in RECON_ALLOWED_DOMAINS."""
    host = extract_host(target)
    if not host:
        return {"status": "skipped", "reason": "no hostname found in target"}
    if not recon_allowed(host):
        return {"status": "not_authorized", "host": host, "reason": "host is not in RECON_ALLOWED_DOMAINS"}
    if _offline() or not external_allowed():
        return {"status": "skipped", "host": host, "reason": "outbound recon disabled for this caller or AGENT_OFFLINE=1"}

    findings: List[str] = []
    score = 100
    out: Dict[str, Any] = {"status": "completed", "host": host, "checked_at": _now()}
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, 443), timeout=timeout) as raw:
            with ctx.wrap_socket(raw, server_hostname=host) as tls:
                cert, version = tls.getpeercert(), tls.version()
        out["tls_version"] = version
        exp = datetime.datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z").replace(tzinfo=datetime.timezone.utc)
        days = (exp - datetime.datetime.now(datetime.timezone.utc)).days
        out["cert_days_remaining"] = days
        if version in ("TLSv1", "TLSv1.1"):
            score -= 25
            findings.append(f"Legacy protocol negotiated: {version}")
        if days < 14:
            score -= 20
            findings.append(f"Certificate expires in {days} days")
    except Exception as e:
        out.update({"status": "error", "error": str(e)[:160]})
        return out

    try:
        req = urllib.request.Request(f"https://{host}/", headers={"User-Agent": "SevenseedPassiveRecon/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            hdrs = {k.lower(): v for k, v in r.headers.items()}
        weights = {"strict-transport-security": 15, "content-security-policy": 10, "x-frame-options": 5,
                   "x-content-type-options": 5, "referrer-policy": 3}
        for h, w in weights.items():
            if h not in hdrs:
                score -= w
                findings.append(f"Missing security header: {h}")
        out["headers_present"] = [h for h in weights if h in hdrs]
    except Exception as e:
        findings.append(f"HTTP header check failed: {str(e)[:100]}")

    out.update({"security_score": max(0, score),
                "posture": "STRONG" if score >= 85 else "MODERATE" if score >= 60 else "WEAK",
                "findings": findings or ["No issues found by passive checks"],
                "method": "passive TLS + header checks only"})
    return out
