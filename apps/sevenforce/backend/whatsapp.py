# -*- coding: utf-8 -*-
"""Sevenforce — WhatsApp Business workspace (Wave).

Everything here talks to the real Meta WhatsApp Cloud API with the visitor's
OWN credentials. Nothing is simulated: if a call fails, the Graph API error is
returned as-is, and every number on the dashboard is counted from rows in the
message log.

Pieces:
  * workspace      — created from the browser, identified by "<id>.<secret>"
                     sent in the X-SF-Workspace header. Only a hash of the
                     secret is stored.
  * connection     — WhatsApp access token + phone number id (+ WABA id for
                     templates, + app secret for webhook signature checks).
                     These ARE stored server-side, because incoming webhooks
                     arrive with no browser attached; the UI says so.
  * contacts       — opt-in / opt-out (STOP / START keywords handled here).
  * send/broadcast — free-form text inside the 24h service window, approved
                     templates outside it. Broadcasts only reach opted-in
                     contacts and run in batches the browser drives.
  * webhook        — GET verification + POST messages/statuses, signature
                     checked with the app secret when one is saved.
  * flows          — keyword-triggered step lists: text, ask (save answer),
                     buttons (branch), AI answer, hand off to a human.
  * knowledge/bot  — BM25 search over the workspace's own documents; the LLM
                     may only answer from what was retrieved, otherwise the
                     chat is handed to a human.
"""
from __future__ import annotations

import datetime as _dt
import hashlib
import hmac
import html as _html
import ipaddress
import json
import math
import os
import re
import secrets
import socket
import sqlite3
from collections import Counter
from typing import Any, Optional
from urllib.parse import urlparse

import requests
from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Request
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

_HERE = os.path.dirname(os.path.abspath(__file__))
try:
    from app import config as _cfg
    DB_PATH = _cfg.DB_PATH
except Exception:  # pragma: no cover
    DB_PATH = os.path.join(_HERE, "db.sqlite3")

GRAPH = "https://graph.facebook.com/" + os.environ.get("WA_GRAPH_VERSION", "v23.0")
BROADCAST_BATCH = 25          # recipients per /broadcast call (browser loops)
MAX_FLOW_STEPS_PER_MESSAGE = 20
STOP_WORDS = {"STOP", "UNSUBSCRIBE", "STOP ALL", "CANCEL", "OPT OUT", "OPTOUT"}
START_WORDS = {"START", "SUBSCRIBE", "OPT IN", "OPTIN"}

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])


# ── storage ────────────────────────────────────────────────────────────────
def _c() -> sqlite3.Connection:
    con = sqlite3.connect(DB_PATH, timeout=15)
    con.row_factory = sqlite3.Row
    return con


def _init() -> None:
    with _c() as con:
        con.executescript("""
        CREATE TABLE IF NOT EXISTS wa_workspaces(
            id TEXT PRIMARY KEY, name TEXT, secret_hash TEXT, created TEXT,
            token TEXT DEFAULT '', phone_id TEXT DEFAULT '', waba_id TEXT DEFAULT '',
            app_secret TEXT DEFAULT '', verify_token TEXT,
            display_phone TEXT DEFAULT '', verified_name TEXT DEFAULT '',
            bot_enabled INTEGER DEFAULT 0, bot_instructions TEXT DEFAULT '',
            handoff_text TEXT DEFAULT 'Thanks for your message. A team member will reply here shortly.',
            ai_provider TEXT DEFAULT 'groq', ai_key TEXT DEFAULT '', min_score REAL DEFAULT 1.0);
        CREATE TABLE IF NOT EXISTS wa_contacts(
            ws TEXT, phone TEXT, name TEXT DEFAULT '', tags TEXT DEFAULT '',
            opted_in INTEGER DEFAULT 0, opted_out INTEGER DEFAULT 0,
            consent_source TEXT DEFAULT '', consent_at TEXT DEFAULT '',
            last_inbound TEXT DEFAULT '', needs_human INTEGER DEFAULT 0,
            bot_paused INTEGER DEFAULT 0, flow_state TEXT DEFAULT '',
            PRIMARY KEY(ws, phone));
        CREATE TABLE IF NOT EXISTS wa_messages(
            id INTEGER PRIMARY KEY AUTOINCREMENT, ws TEXT, phone TEXT, direction TEXT,
            kind TEXT, body TEXT, wa_msg_id TEXT DEFAULT '', status TEXT DEFAULT '',
            error TEXT DEFAULT '', source TEXT DEFAULT '', ts TEXT);
        CREATE INDEX IF NOT EXISTS ix_wa_msg_ws_phone ON wa_messages(ws, phone, id);
        CREATE INDEX IF NOT EXISTS ix_wa_msg_wamid ON wa_messages(wa_msg_id);
        CREATE TABLE IF NOT EXISTS wa_docs(
            id INTEGER PRIMARY KEY AUTOINCREMENT, ws TEXT, title TEXT, source TEXT,
            chars INTEGER, created TEXT);
        CREATE TABLE IF NOT EXISTS wa_chunks(
            id INTEGER PRIMARY KEY AUTOINCREMENT, ws TEXT, doc_id INTEGER, text TEXT);
        CREATE TABLE IF NOT EXISTS wa_flows(
            id INTEGER PRIMARY KEY AUTOINCREMENT, ws TEXT, name TEXT, keywords TEXT,
            active INTEGER DEFAULT 1, steps TEXT, created TEXT);
        """)


_init()


def _now() -> str:
    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _hash(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()


def _mask(v: str) -> str:
    return "" if not v else ("•" * 6 + v[-4:])


def _phone(raw: str) -> str:
    d = re.sub(r"\D", "", str(raw or ""))
    if len(d) == 10:          # bare Indian mobile number
        d = "91" + d
    if len(d) < 8 or len(d) > 15:
        raise HTTPException(400, f"'{raw}' is not a valid phone number (use country code, e.g. 919812345678).")
    return d


# ── workspace auth ─────────────────────────────────────────────────────────
def _ws(cred: Optional[str]) -> sqlite3.Row:
    if not cred or "." not in cred:
        raise HTTPException(401, "Missing workspace credential (X-SF-Workspace header).")
    wid, sec = cred.split(".", 1)
    with _c() as con:
        row = con.execute("SELECT * FROM wa_workspaces WHERE id=?", (wid,)).fetchone()
    if not row or not hmac.compare_digest(row["secret_hash"], _hash(sec)):
        raise HTTPException(401, "Workspace not found or credential is wrong.")
    return row


def _ws_public(w: sqlite3.Row) -> dict:
    return {
        "id": w["id"], "name": w["name"], "created": w["created"],
        "connected": bool(w["token"] and w["phone_id"]),
        "phone_number_id": w["phone_id"], "waba_id": w["waba_id"],
        "display_phone": w["display_phone"], "verified_name": w["verified_name"],
        "token": _mask(w["token"]), "app_secret_set": bool(w["app_secret"]),
        "verify_token": w["verify_token"],
        "webhook_path": f"/sevenforce/api/whatsapp/webhook/{w['id']}",
        "bot": {"enabled": bool(w["bot_enabled"]), "instructions": w["bot_instructions"],
                "handoff_text": w["handoff_text"], "ai_provider": w["ai_provider"],
                "ai_key": _mask(w["ai_key"]), "min_score": w["min_score"]},
    }


# ── Graph API ──────────────────────────────────────────────────────────────
def _graph(w, method: str, path: str, **kw) -> tuple[bool, dict]:
    if not (w["token"] and w["phone_id"]):
        return False, {"error": "WhatsApp is not connected yet. Add your access token and phone number id in Setup."}
    try:
        r = requests.request(method, f"{GRAPH}/{path}", timeout=20,
                             headers={"Authorization": f"Bearer {w['token']}"}, **kw)
        data = r.json() if r.content else {}
    except Exception as e:
        return False, {"error": f"Could not reach Meta: {e}"}
    if r.status_code >= 400:
        err = (data or {}).get("error") or {}
        return False, {"error": err.get("message") or r.text[:300], "code": err.get("code"),
                       "details": (err.get("error_data") or {}).get("details", "")}
    return True, data


def _log(ws: str, phone: str, direction: str, kind: str, body: str, wa_id: str = "",
         status: str = "", error: str = "", source: str = "") -> None:
    with _c() as con:
        con.execute("INSERT INTO wa_messages(ws,phone,direction,kind,body,wa_msg_id,status,error,source,ts)"
                    " VALUES(?,?,?,?,?,?,?,?,?,?)",
                    (ws, phone, direction, kind, body, wa_id, status, error, source, _now()))


def _send(w, to: str, payload: dict, kind: str, body_text: str, source: str) -> dict:
    ok, data = _graph(w, "POST", f"{w['phone_id']}/messages",
                      json={"messaging_product": "whatsapp", "recipient_type": "individual", "to": to, **payload})
    wa_id = ((data.get("messages") or [{}])[0].get("id", "")) if ok else ""
    err = "" if ok else (data.get("error", "") + (f" ({data['details']})" if data.get("details") else ""))
    _log(w["id"], to, "out", kind, body_text, wa_id, "sent" if ok else "failed", err, source)
    return {"ok": ok, "to": to, "message_id": wa_id, "error": err}


def _send_text(w, to, text, source="manual"):
    return _send(w, to, {"type": "text", "text": {"preview_url": True, "body": text[:4096]}}, "text", text, source)


def _send_buttons(w, to, text, titles: list[str], source="flow"):
    titles = [t.strip() for t in titles if t.strip()]
    if len(titles) <= 3:
        action = {"buttons": [{"type": "reply", "reply": {"id": f"b{i}", "title": t[:20]}} for i, t in enumerate(titles)]}
        inter = {"type": "button", "body": {"text": text[:1024]}, "action": action}
    else:
        rows = [{"id": f"b{i}", "title": t[:24]} for i, t in enumerate(titles[:10])]
        inter = {"type": "list", "body": {"text": text[:1024]},
                 "action": {"button": "Choose", "sections": [{"title": "Options", "rows": rows}]}}
    return _send(w, to, {"type": "interactive", "interactive": inter}, "buttons",
                 text + "\n" + " | ".join(titles), source)


def _template_payload(name: str, language: str, params: list[str]) -> dict:
    tpl: dict[str, Any] = {"name": name, "language": {"code": language or "en"}}
    if params:
        tpl["components"] = [{"type": "body", "parameters": [{"type": "text", "text": str(p)} for p in params]}]
    return {"type": "template", "template": tpl}


def _in_window(contact: Optional[sqlite3.Row]) -> bool:
    if not contact or not contact["last_inbound"]:
        return False
    try:
        t = _dt.datetime.fromisoformat(contact["last_inbound"].rstrip("Z"))
    except ValueError:
        return False
    return _dt.datetime.utcnow() - t < _dt.timedelta(hours=24)


def _contact(ws: str, phone: str) -> Optional[sqlite3.Row]:
    with _c() as con:
        return con.execute("SELECT * FROM wa_contacts WHERE ws=? AND phone=?", (ws, phone)).fetchone()


def _upsert_contact(ws: str, phone: str, **fields) -> None:
    with _c() as con:
        con.execute("INSERT OR IGNORE INTO wa_contacts(ws,phone) VALUES(?,?)", (ws, phone))
        if fields:
            cols = ",".join(f"{k}=?" for k in fields)
            con.execute(f"UPDATE wa_contacts SET {cols} WHERE ws=? AND phone=?", (*fields.values(), ws, phone))


# ── LLM (BYOK) ─────────────────────────────────────────────────────────────
_LLM_MODELS = {"groq": "llama-3.3-70b-versatile", "openai": "gpt-4o-mini", "gemini": "gemini-2.0-flash"}


def _llm_call(provider: str, key: str, system: str, user: str) -> Optional[str]:
    if not key:
        return None
    try:
        if provider == "gemini":
            r = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{_LLM_MODELS['gemini']}:generateContent",
                params={"key": key}, timeout=30,
                json={"systemInstruction": {"parts": [{"text": system}]},
                      "contents": [{"role": "user", "parts": [{"text": user}]}],
                      "generationConfig": {"temperature": 0.2, "maxOutputTokens": 600}})
            r.raise_for_status()
            return r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        url = ("https://api.groq.com/openai/v1/chat/completions" if provider == "groq"
               else "https://api.openai.com/v1/chat/completions")
        r = requests.post(url, timeout=30, headers={"Authorization": f"Bearer {key}"},
                          json={"model": _LLM_MODELS.get(provider, _LLM_MODELS["groq"]), "temperature": 0.2,
                                "max_tokens": 600, "messages": [{"role": "system", "content": system},
                                                                {"role": "user", "content": user}]})
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[whatsapp] llm {provider}: {e}")
        return None


def _key_for(w, request: Optional[Request]) -> tuple[str, str]:
    """Workspace's saved key first (needed for webhooks); else the browser's BYOK headers."""
    if w["ai_key"]:
        return w["ai_provider"] or "groq", w["ai_key"]
    if request is not None:
        for prov, hdr in (("groq", "x-groq-api-key"), ("openai", "x-openai-api-key"), ("gemini", "x-gemini-api-key")):
            v = request.headers.get(hdr, "").strip()
            if v:
                return prov, v
    return "", ""


# ── knowledge base (BM25, pure Python) ────────────────────────────────────
_TOK = re.compile(r"[a-z0-9ऀ-ॿ]+")
_STOP = set("a an the is are was were be to of and or in on for with at by from this that it as your you we our i me my do does can".split())


def _tokens(t: str) -> list[str]:
    return [x for x in _TOK.findall(t.lower()) if x not in _STOP and len(x) > 1]


def _chunk(text: str, size: int = 700, overlap: int = 120) -> list[str]:
    text = re.sub(r"[ \t]+", " ", text).strip()
    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    out, cur = [], ""
    for p in paras:
        while len(p) > size:                       # very long paragraph: hard split
            out.append((cur + " " + p[:size]).strip()); cur = ""; p = p[size - overlap:]
        if len(cur) + len(p) + 1 > size and cur:
            out.append(cur.strip()); cur = cur[-overlap:]
        cur += "\n" + p
    if cur.strip():
        out.append(cur.strip())
    return out


def _search(ws: str, query: str, k: int = 4) -> list[dict]:
    with _c() as con:
        rows = con.execute("SELECT c.id, c.text, d.title FROM wa_chunks c JOIN wa_docs d ON d.id=c.doc_id"
                           " WHERE c.ws=?", (ws,)).fetchall()
    if not rows:
        return []
    q = _tokens(query)
    docs = [_tokens(r["text"]) for r in rows]
    n, avg = len(docs), (sum(map(len, docs)) / len(docs)) or 1
    df = Counter(t for d in docs for t in set(d))
    scored = []
    for r, d in zip(rows, docs):
        tf, s = Counter(d), 0.0
        for t in q:
            if t in tf:
                idf = math.log(1 + (n - df[t] + 0.5) / (df[t] + 0.5))
                s += idf * tf[t] * 2.2 / (tf[t] + 1.2 * (0.25 + 0.75 * len(d) / avg))
        if s > 0:
            scored.append({"score": round(s, 3), "title": r["title"], "text": r["text"]})
    return sorted(scored, key=lambda x: -x["score"])[:k]


def _answer(w, question: str, request: Optional[Request] = None) -> dict:
    hits = _search(w["id"], question)
    best = hits[0]["score"] if hits else 0.0
    if not hits or best < (w["min_score"] or 0):
        return {"handoff": True, "reason": "No matching passage in your knowledge base.", "hits": hits}
    prov, key = _key_for(w, request)
    if not key:
        return {"handoff": True, "reason": "No AI key saved for the bot (Bot settings).", "hits": hits}
    ctx = "\n\n".join(f"[{i+1}] ({h['title']}) {h['text']}" for i, h in enumerate(hits))
    system = ("You are the WhatsApp assistant for this business. Answer ONLY from the CONTEXT passages. "
              "Be short (under 80 words), friendly, plain text, no markdown. If the context does not "
              "contain the answer, reply with exactly HANDOFF and nothing else.\n"
              + (f"Business instructions: {w['bot_instructions']}\n" if w["bot_instructions"] else ""))
    out = _llm_call(prov, key, system, f"CONTEXT:\n{ctx}\n\nCUSTOMER: {question}")
    if not out:
        return {"handoff": True, "reason": f"The AI call failed ({prov}). Check the key.", "hits": hits}
    if out.strip().upper().startswith("HANDOFF"):
        return {"handoff": True, "reason": "The AI found no answer in your documents.", "hits": hits}
    return {"handoff": False, "answer": out, "provider": prov, "hits": hits}


# ── flows ──────────────────────────────────────────────────────────────────
def _fill(text: str, contact: Optional[sqlite3.Row], vars_: dict) -> str:
    vals = {"name": (contact["name"] if contact and contact["name"] else "there"),
            "phone": contact["phone"] if contact else "", **vars_}
    return re.sub(r"\{\{\s*(\w+)\s*\}\}", lambda m: str(vals.get(m.group(1), m.group(0))), text or "")


def _handoff(w, phone: str, text: str = "") -> None:
    _upsert_contact(w["id"], phone, needs_human=1, bot_paused=1, flow_state="")
    msg = text or w["handoff_text"]
    if msg:
        _send_text(w, phone, msg, "handoff")


def _run_flow(w, phone: str, state: dict, last_text: str) -> None:
    with _c() as con:
        f = con.execute("SELECT * FROM wa_flows WHERE id=? AND ws=?", (state["flow"], w["id"])).fetchone()
    if not f:
        _upsert_contact(w["id"], phone, flow_state=""); return
    steps = json.loads(f["steps"] or "[]")
    i = state.get("step", 0)
    for _ in range(MAX_FLOW_STEPS_PER_MESSAGE):
        if i < 0 or i >= len(steps):
            _upsert_contact(w["id"], phone, flow_state=""); return
        s, c = steps[i], _contact(w["id"], phone)
        typ = s.get("type")
        text = _fill(s.get("text", ""), c, state.get("vars", {}))
        nxt = (int(s["goto"]) - 1) if str(s.get("goto") or "").strip().isdigit() else i + 1
        if typ == "text":
            _send_text(w, phone, text, "flow")
        elif typ == "ask":
            _send_text(w, phone, text, "flow")
            state.update(step=i, waiting="ask")
            _upsert_contact(w["id"], phone, flow_state=json.dumps(state)); return
        elif typ == "buttons":
            _send_buttons(w, phone, text, [o.get("title", "") for o in s.get("options", [])])
            state.update(step=i, waiting="buttons")
            _upsert_contact(w["id"], phone, flow_state=json.dumps(state)); return
        elif typ == "ai":
            res = _answer(w, last_text)
            if res["handoff"]:
                _handoff(w, phone); return
            _send_text(w, phone, res["answer"], "bot")
        elif typ == "handoff":
            _handoff(w, phone, text); return
        elif typ == "end":
            _upsert_contact(w["id"], phone, flow_state=""); return
        i = nxt
    _upsert_contact(w["id"], phone, flow_state="")


def _resume_flow(w, phone: str, state: dict, text: str, button_id: str) -> bool:
    """Consume a reply for a waiting step. Returns False if the reply didn't fit."""
    with _c() as con:
        f = con.execute("SELECT * FROM wa_flows WHERE id=? AND ws=?", (state["flow"], w["id"])).fetchone()
    if not f:
        return False
    steps = json.loads(f["steps"] or "[]")
    i = state.get("step", 0)
    if i >= len(steps):
        return False
    s = steps[i]
    if state.get("waiting") == "ask":
        key = (s.get("save_as") or f"answer{i+1}").strip()
        state.setdefault("vars", {})[key] = text
        nxt = (int(s["goto"]) - 1) if str(s.get("goto") or "").strip().isdigit() else i + 1
    else:
        opts = s.get("options", [])
        idx = int(button_id[1:]) if re.fullmatch(r"b\d+", button_id or "") else next(
            (k for k, o in enumerate(opts) if o.get("title", "").strip().lower() == text.strip().lower()), -1)
        if not (0 <= idx < len(opts)):
            _send_buttons(w, phone, "Please pick one of the options:", [o.get("title", "") for o in opts]); return True
        state.setdefault("vars", {})[s.get("save_as") or f"choice{i+1}"] = opts[idx].get("title", "")
        g = str(opts[idx].get("goto") or "").strip()
        nxt = int(g) - 1 if g.isdigit() else i + 1
    state.update(step=nxt, waiting=None)
    _run_flow(w, phone, state, text)
    return True


def _match_flow(ws: str, text: str) -> Optional[sqlite3.Row]:
    words = set(_TOK.findall(text.lower()))
    low = text.strip().lower()
    with _c() as con:
        flows = con.execute("SELECT * FROM wa_flows WHERE ws=? AND active=1 ORDER BY id", (ws,)).fetchall()
    fallback = None
    for f in flows:
        for kw in [k.strip().lower() for k in (f["keywords"] or "").split(",") if k.strip()]:
            if kw == "*":
                fallback = fallback or f
            elif kw == low or (" " not in kw and kw in words) or (" " in kw and kw in low):
                return f
    return fallback


# ── inbound processing ─────────────────────────────────────────────────────
def _handle_inbound(ws_id: str, msg: dict, profile_name: str) -> None:
    with _c() as con:
        w = con.execute("SELECT * FROM wa_workspaces WHERE id=?", (ws_id,)).fetchone()
    if not w:
        return
    phone = re.sub(r"\D", "", msg.get("from", ""))
    typ = msg.get("type", "")
    button_id, text = "", ""
    if typ == "text":
        text = msg.get("text", {}).get("body", "")
    elif typ == "interactive":
        it = msg.get("interactive", {})
        rep = it.get("button_reply") or it.get("list_reply") or {}
        button_id, text = rep.get("id", ""), rep.get("title", "")
    elif typ == "button":
        text = msg.get("button", {}).get("text", "")
    else:
        text = f"[{typ} message]"
    with _c() as con:
        dup = con.execute("SELECT 1 FROM wa_messages WHERE wa_msg_id=? AND direction='in'", (msg.get("id", ""),)).fetchone()
    if dup:                                   # Meta retries webhooks; process each message once
        return
    _upsert_contact(ws_id, phone)
    c = _contact(ws_id, phone)
    _upsert_contact(ws_id, phone, last_inbound=_now(), **({"name": profile_name} if profile_name and not c["name"] else {}))
    _log(ws_id, phone, "in", typ, text, msg.get("id", ""), "received")

    up = text.strip().upper()
    if up in STOP_WORDS:
        _upsert_contact(ws_id, phone, opted_out=1, opted_in=0, flow_state="")
        _send_text(w, phone, "You have been unsubscribed and won't get promotional messages from us. Reply START to subscribe again.", "optout")
        return
    if up in START_WORDS:
        _upsert_contact(ws_id, phone, opted_out=0, opted_in=1, consent_source="Replied START on WhatsApp", consent_at=_now())
        _send_text(w, phone, "You're subscribed again. Reply STOP any time to opt out.", "optin")
        return

    c = _contact(ws_id, phone)
    if c["bot_paused"]:
        _upsert_contact(ws_id, phone, needs_human=1)
        return
    if c["flow_state"]:
        try:
            state = json.loads(c["flow_state"])
            if state.get("waiting") and _resume_flow(w, phone, state, text, button_id):
                return
        except Exception as e:
            print(f"[whatsapp] flow resume: {e}")
    f = _match_flow(ws_id, text)
    if f:
        _run_flow(w, phone, {"flow": f["id"], "step": 0, "vars": {}}, text)
        return
    if w["bot_enabled"] and typ in ("text", "interactive", "button"):
        res = _answer(w, text)
        if res["handoff"]:
            _handoff(w, phone)
        else:
            _send_text(w, phone, res["answer"], "bot")
        return
    _upsert_contact(ws_id, phone, needs_human=1)


def _handle_status(ws_id: str, st: dict) -> None:
    err = "; ".join(e.get("title", "") + (": " + e.get("message", "") if e.get("message") else "")
                    for e in st.get("errors", []) or [])
    with _c() as con:
        con.execute("UPDATE wa_messages SET status=?, error=CASE WHEN ?<>'' THEN ? ELSE error END"
                    " WHERE wa_msg_id=? AND ws=?", (st.get("status", ""), err, err, st.get("id", ""), ws_id))


# ── request models ─────────────────────────────────────────────────────────
class WorkspaceReq(BaseModel):
    name: str = "My business"


class ConnectionReq(BaseModel):
    access_token: str = ""
    phone_number_id: str = ""
    waba_id: str = ""
    app_secret: str = ""


class BotReq(BaseModel):
    enabled: bool = False
    instructions: str = ""
    handoff_text: str = ""
    ai_provider: str = "groq"
    ai_key: str = ""                 # empty = keep the saved one
    clear_ai_key: bool = False
    min_score: float = 1.0


class ContactReq(BaseModel):
    phone: str
    name: str = ""
    tags: str = ""
    opted_in: bool = False
    consent_source: str = ""


class ImportReq(BaseModel):
    csv: str
    opted_in: bool = False
    consent_source: str = ""


class ContactPatch(BaseModel):
    name: Optional[str] = None
    tags: Optional[str] = None
    opted_in: Optional[bool] = None
    opted_out: Optional[bool] = None
    bot_paused: Optional[bool] = None
    needs_human: Optional[bool] = None
    consent_source: Optional[str] = None


class SendReq(BaseModel):
    to: str
    text: str = ""
    template: str = ""
    language: str = "en"
    params: list[str] = []


class BroadcastReq(BaseModel):
    template: str
    language: str = "en"
    params: list[str] = []           # may use {{name}}
    tag: str = ""
    offset: int = 0
    dry_run: bool = False


class FlowReq(BaseModel):
    name: str
    keywords: str = ""
    active: bool = True
    steps: list[dict] = []


class DocReq(BaseModel):
    title: str
    text: str


class UrlReq(BaseModel):
    url: str


class AskReq(BaseModel):
    question: str


# ── workspace endpoints ────────────────────────────────────────────────────
@router.post("/workspaces")
def create_workspace(r: WorkspaceReq):
    wid, sec = secrets.token_hex(6), secrets.token_urlsafe(24)
    with _c() as con:
        con.execute("INSERT INTO wa_workspaces(id,name,secret_hash,created,verify_token) VALUES(?,?,?,?,?)",
                    (wid, (r.name or "My business")[:80], _hash(sec), _now(), secrets.token_urlsafe(18)))
    return {"credential": f"{wid}.{sec}", "workspace": _ws_public(_ws(f"{wid}.{sec}"))}


@router.get("/workspace")
def get_workspace(x_sf_workspace: str = Header(None)):
    return _ws_public(_ws(x_sf_workspace))


@router.delete("/workspace")
def delete_workspace(x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    with _c() as con:
        for t in ("wa_contacts", "wa_messages", "wa_chunks", "wa_docs", "wa_flows"):
            con.execute(f"DELETE FROM {t} WHERE ws=?", (w["id"],))
        con.execute("DELETE FROM wa_workspaces WHERE id=?", (w["id"],))
    return {"deleted": True}


@router.put("/workspace/connection")
def save_connection(r: ConnectionReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    upd = {k: v.strip() for k, v in (("token", r.access_token), ("phone_id", r.phone_number_id),
                                     ("waba_id", r.waba_id), ("app_secret", r.app_secret)) if v.strip()}
    if upd:
        with _c() as con:
            con.execute(f"UPDATE wa_workspaces SET {','.join(k + '=?' for k in upd)} WHERE id=?", (*upd.values(), w["id"]))
    w = _ws(x_sf_workspace)
    ok, data = _graph(w, "GET", w["phone_id"], params={"fields": "display_phone_number,verified_name,quality_rating,code_verification_status"})
    if ok:
        with _c() as con:
            con.execute("UPDATE wa_workspaces SET display_phone=?, verified_name=? WHERE id=?",
                        (data.get("display_phone_number", ""), data.get("verified_name", ""), w["id"]))
        w = _ws(x_sf_workspace)
    return {"verified": ok, "meta": data, "workspace": _ws_public(w)}


@router.put("/workspace/bot")
def save_bot(r: BotReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    key = "" if r.clear_ai_key else (r.ai_key.strip() or w["ai_key"])
    prov = r.ai_provider if r.ai_provider in _LLM_MODELS else "groq"
    with _c() as con:
        con.execute("UPDATE wa_workspaces SET bot_enabled=?, bot_instructions=?, handoff_text=?, ai_provider=?,"
                    " ai_key=?, min_score=? WHERE id=?",
                    (int(r.enabled), r.instructions[:2000], (r.handoff_text.strip() or w["handoff_text"])[:500], prov, key,
                     max(0.0, min(r.min_score, 20.0)), w["id"]))
    return _ws_public(_ws(x_sf_workspace))


@router.get("/stats")
def stats(x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    since = (_dt.datetime.utcnow() - _dt.timedelta(days=30)).isoformat()
    with _c() as con:
        out = {r["status"] or "unknown": r["n"] for r in con.execute(
            "SELECT status, COUNT(*) n FROM wa_messages WHERE ws=? AND direction='out' AND ts>=? GROUP BY status",
            (w["id"], since))}
        inbound = con.execute("SELECT COUNT(*) FROM wa_messages WHERE ws=? AND direction='in' AND ts>=?",
                              (w["id"], since)).fetchone()[0]
        c = con.execute("SELECT COUNT(*) total, SUM(opted_in AND NOT opted_out) optin, SUM(opted_out) optout,"
                        " SUM(needs_human) waiting FROM wa_contacts WHERE ws=?", (w["id"],)).fetchone()
        docs = con.execute("SELECT COUNT(*) FROM wa_docs WHERE ws=?", (w["id"],)).fetchone()[0]
        flows = con.execute("SELECT COUNT(*) FROM wa_flows WHERE ws=? AND active=1", (w["id"],)).fetchone()[0]
    return {"outbound_by_status_30d": out, "inbound_30d": inbound, "contacts": c["total"] or 0,
            "opted_in": c["optin"] or 0, "opted_out": c["optout"] or 0, "waiting_for_human": c["waiting"] or 0,
            "documents": docs, "active_flows": flows}


# ── contacts ───────────────────────────────────────────────────────────────
@router.get("/contacts")
def list_contacts(x_sf_workspace: str = Header(None), q: str = "", tag: str = ""):
    w = _ws(x_sf_workspace)
    with _c() as con:
        rows = con.execute("SELECT * FROM wa_contacts WHERE ws=? ORDER BY last_inbound DESC, phone LIMIT 2000",
                           (w["id"],)).fetchall()
    out = [dict(r) for r in rows]
    if q:
        out = [r for r in out if q.lower() in (r["name"] + r["phone"]).lower()]
    if tag:
        out = [r for r in out if tag.lower() in [t.strip().lower() for t in r["tags"].split(",")]]
    for r in out:
        r.pop("ws", None); r["in_window"] = _in_window(r if r["last_inbound"] else None)  # type: ignore[arg-type]
    return {"contacts": out}


@router.post("/contacts")
def add_contact(r: ContactReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    p = _phone(r.phone)
    fields = {"name": r.name[:80], "tags": r.tags[:200]}
    if r.opted_in:
        if not r.consent_source.strip():
            raise HTTPException(400, "Say how this person opted in (e.g. 'checkout checkbox 2026-11-01').")
        fields.update(opted_in=1, opted_out=0, consent_source=r.consent_source[:200], consent_at=_now())
    _upsert_contact(w["id"], p, **fields)
    return {"phone": p}


@router.post("/contacts/import")
def import_contacts(r: ImportReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    if r.opted_in and not r.consent_source.strip():
        raise HTTPException(400, "Say how these contacts opted in before marking them as opted in.")
    added, bad = 0, []
    for line in r.csv.splitlines()[:5000]:
        parts = [x.strip() for x in line.split(",")]
        if not parts or not parts[0] or parts[0].lower() in ("phone", "number", "mobile"):
            continue
        try:
            p = _phone(parts[0])
        except HTTPException:
            bad.append(parts[0]); continue
        fields: dict[str, Any] = {}
        if len(parts) > 1 and parts[1]:
            fields["name"] = parts[1][:80]
        if len(parts) > 2 and parts[2]:
            fields["tags"] = ",".join(parts[2:])[:200]
        if r.opted_in:
            c = _contact(w["id"], p)
            if not (c and c["opted_out"]):        # never re-subscribe someone who said STOP
                fields.update(opted_in=1, consent_source=r.consent_source[:200], consent_at=_now())
        _upsert_contact(w["id"], p, **fields)
        added += 1
    return {"imported": added, "invalid": bad[:50], "invalid_count": len(bad)}


@router.patch("/contacts/{phone}")
def patch_contact(phone: str, r: ContactPatch, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    p = _phone(phone)
    f = {k: (int(v) if isinstance(v, bool) else v) for k, v in r.model_dump().items() if v is not None}
    if f.get("opted_in") == 1:
        f["consent_at"] = _now()
    if f.get("bot_paused") == 0:
        f.setdefault("needs_human", 0)
    _upsert_contact(w["id"], p, **f)
    return {"ok": True}


@router.delete("/contacts/{phone}")
def delete_contact(phone: str, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    p = _phone(phone)
    with _c() as con:
        con.execute("DELETE FROM wa_contacts WHERE ws=? AND phone=?", (w["id"], p))
        con.execute("DELETE FROM wa_messages WHERE ws=? AND phone=?", (w["id"], p))
    return {"deleted": True}


# ── templates, send, broadcast ─────────────────────────────────────────────
@router.get("/templates")
def templates(x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    if not w["waba_id"]:
        return {"templates": [], "error": "Add your WhatsApp Business Account (WABA) id in Setup to list templates."}
    ok, data = _graph(w, "GET", f"{w['waba_id']}/message_templates",
                      params={"fields": "name,status,language,category,components", "limit": 200})
    if not ok:
        return {"templates": [], "error": data.get("error")}
    out = []
    for t in data.get("data", []):
        body = next((c.get("text", "") for c in t.get("components", []) if c.get("type") == "BODY"), "")
        out.append({"name": t.get("name"), "status": t.get("status"), "language": t.get("language"),
                    "category": t.get("category"), "body": body,
                    "variables": len(set(re.findall(r"\{\{(\d+)\}\}", body)))})
    return {"templates": out}


@router.post("/send")
def send(r: SendReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    to = _phone(r.to)
    c = _contact(w["id"], to)
    if r.template:
        if c and c["opted_out"]:
            raise HTTPException(400, "This contact replied STOP. They can't be sent templates until they reply START.")
        res = _send(w, to, _template_payload(r.template, r.language, r.params), "template",
                    f"[template {r.template}] " + " | ".join(r.params), "manual")
    else:
        if not r.text.strip():
            raise HTTPException(400, "Message text is empty.")
        if not _in_window(c):
            raise HTTPException(400, "Free-form messages only work within 24 hours of the customer's last message. "
                                     "Use an approved template instead.")
        res = _send_text(w, to, r.text, "manual")
    _upsert_contact(w["id"], to)
    return res


@router.post("/broadcast")
def broadcast(r: BroadcastReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    with _c() as con:
        rows = con.execute("SELECT * FROM wa_contacts WHERE ws=? AND opted_in=1 AND opted_out=0 ORDER BY phone",
                           (w["id"],)).fetchall()
    if r.tag:
        rows = [x for x in rows if r.tag.lower() in [t.strip().lower() for t in (x["tags"] or "").split(",")]]
    total = len(rows)
    if r.dry_run:
        return {"eligible": total, "sample": [dict(phone=x["phone"], name=x["name"]) for x in rows[:5]]}
    batch = rows[r.offset:r.offset + BROADCAST_BATCH]
    results = []
    for c in batch:
        params = [_fill(p, c, {}) for p in r.params]
        results.append(_send(w, c["phone"], _template_payload(r.template, r.language, params), "template",
                             f"[template {r.template}] " + " | ".join(params), "broadcast"))
    nxt = r.offset + len(batch)
    return {"eligible": total, "processed": nxt, "done": nxt >= total,
            "sent": sum(1 for x in results if x["ok"]), "failed": [x for x in results if not x["ok"]]}


# ── inbox ──────────────────────────────────────────────────────────────────
@router.get("/conversations")
def conversations(x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    with _c() as con:
        rows = con.execute("""
            SELECT m.phone, m.body, m.direction, m.ts, c.name, c.needs_human, c.bot_paused, c.last_inbound,
                   c.opted_out, c.opted_in
            FROM wa_messages m
            JOIN (SELECT phone, MAX(id) mid FROM wa_messages WHERE ws=? GROUP BY phone) l ON l.mid=m.id
            LEFT JOIN wa_contacts c ON c.ws=m.ws AND c.phone=m.phone
            WHERE m.ws=? ORDER BY m.id DESC LIMIT 300""", (w["id"], w["id"])).fetchall()
    out = []
    for r in rows:
        d = dict(r); d["in_window"] = _in_window(r)
        out.append(d)
    return {"conversations": out}


@router.get("/conversations/{phone}")
def conversation(phone: str, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    p = _phone(phone)
    with _c() as con:
        msgs = [dict(x) for x in con.execute(
            "SELECT direction,kind,body,status,error,source,ts FROM wa_messages WHERE ws=? AND phone=? ORDER BY id DESC LIMIT 200",
            (w["id"], p)).fetchall()][::-1]
    c = _contact(w["id"], p)
    contact = dict(c) if c else {"phone": p}
    contact.pop("ws", None)
    contact["in_window"] = _in_window(c)
    return {"contact": contact, "messages": msgs}


# ── flows CRUD ─────────────────────────────────────────────────────────────
_STEP_TYPES = {"text", "ask", "buttons", "ai", "handoff", "end"}


def _clean_steps(steps: list[dict]) -> list[dict]:
    out = []
    for s in steps[:40]:
        t = s.get("type")
        if t not in _STEP_TYPES:
            raise HTTPException(400, f"Unknown step type '{t}'.")
        if t in ("text", "ask", "buttons") and not str(s.get("text", "")).strip():
            raise HTTPException(400, f"Step {len(out)+1} ({t}) needs message text.")
        if t == "buttons":
            opts = [o for o in s.get("options", []) if str(o.get("title", "")).strip()]
            if not 1 <= len(opts) <= 10:
                raise HTTPException(400, f"Step {len(out)+1}: buttons need 1–10 options (3 or fewer show as buttons, more as a list).")
            s["options"] = [{"title": str(o["title"])[:24], "goto": str(o.get("goto") or "")} for o in opts]
        out.append({k: s[k] for k in ("type", "text", "save_as", "goto", "options") if k in s})
    return out


@router.get("/flows")
def list_flows(x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    with _c() as con:
        rows = con.execute("SELECT * FROM wa_flows WHERE ws=? ORDER BY id", (w["id"],)).fetchall()
    return {"flows": [{"id": r["id"], "name": r["name"], "keywords": r["keywords"], "active": bool(r["active"]),
                       "steps": json.loads(r["steps"] or "[]")} for r in rows]}


@router.post("/flows")
def create_flow(r: FlowReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    steps = _clean_steps(r.steps)
    with _c() as con:
        cur = con.execute("INSERT INTO wa_flows(ws,name,keywords,active,steps,created) VALUES(?,?,?,?,?,?)",
                          (w["id"], r.name[:80], r.keywords[:300], int(r.active), json.dumps(steps), _now()))
    return {"id": cur.lastrowid}


@router.put("/flows/{fid}")
def update_flow(fid: int, r: FlowReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    steps = _clean_steps(r.steps)
    with _c() as con:
        n = con.execute("UPDATE wa_flows SET name=?, keywords=?, active=?, steps=? WHERE id=? AND ws=?",
                        (r.name[:80], r.keywords[:300], int(r.active), json.dumps(steps), fid, w["id"])).rowcount
    if not n:
        raise HTTPException(404, "Flow not found.")
    return {"id": fid}


@router.delete("/flows/{fid}")
def delete_flow(fid: int, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    with _c() as con:
        con.execute("DELETE FROM wa_flows WHERE id=? AND ws=?", (fid, w["id"]))
    return {"deleted": True}


# ── knowledge ──────────────────────────────────────────────────────────────
def _add_doc(ws: str, title: str, source: str, text: str) -> dict:
    text = text.strip()
    if len(text) < 20:
        raise HTTPException(400, "Not enough text to learn from.")
    text = text[:300_000]
    chunks = _chunk(text)
    with _c() as con:
        cur = con.execute("INSERT INTO wa_docs(ws,title,source,chars,created) VALUES(?,?,?,?,?)",
                          (ws, title[:120], source[:300], len(text), _now()))
        con.executemany("INSERT INTO wa_chunks(ws,doc_id,text) VALUES(?,?,?)", [(ws, cur.lastrowid, ch) for ch in chunks])
    return {"id": cur.lastrowid, "chunks": len(chunks), "chars": len(text)}


def _public_url(url: str) -> str:
    u = urlparse(url if "://" in url else "https://" + url)
    if u.scheme not in ("http", "https") or not u.hostname:
        raise HTTPException(400, "Use an http(s) URL.")
    try:
        for info in socket.getaddrinfo(u.hostname, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
                raise HTTPException(400, "That address is not a public website.")
    except socket.gaierror:
        raise HTTPException(400, "Could not resolve that website.")
    return u.geturl()


def _html_text(raw: str) -> tuple[str, str]:
    title = _html.unescape((re.search(r"<title[^>]*>(.*?)</title>", raw, re.S | re.I) or [None, ""])[1]).strip()
    raw = re.sub(r"(?is)<(script|style|noscript|svg|nav|footer|header)[^>]*>.*?</\1>", " ", raw)
    raw = re.sub(r"(?i)<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>", "\n\n", raw)
    text = _html.unescape(re.sub(r"<[^>]+>", " ", raw))
    text = re.sub(r"[ \t\r\f\v]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    return title, text.strip()


@router.get("/knowledge")
def list_docs(x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    with _c() as con:
        rows = con.execute("SELECT id,title,source,chars,created FROM wa_docs WHERE ws=? ORDER BY id DESC", (w["id"],)).fetchall()
    return {"documents": [dict(r) for r in rows]}


@router.post("/knowledge")
def add_doc(r: DocReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    return _add_doc(w["id"], r.title or "Untitled", "pasted text", r.text)


@router.post("/knowledge/url")
def add_url(r: UrlReq, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    url = _public_url(r.url.strip())
    try:
        resp = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0 (Sevenforce knowledge fetch)"},
                            allow_redirects=True)
        resp.raise_for_status()
    except Exception as e:
        raise HTTPException(400, f"Could not fetch the page: {e}")
    _public_url(resp.url)                                   # re-check after redirects
    ctype = resp.headers.get("content-type", "")
    if "html" in ctype:
        title, text = _html_text(resp.text)
    elif ctype.startswith("text/"):
        title, text = url, resp.text
    else:
        raise HTTPException(400, f"Only web pages and plain text are supported (got {ctype or 'unknown'}). Paste PDF text instead.")
    return {**_add_doc(w["id"], title or url, url, text), "title": title or url}


@router.delete("/knowledge/{doc_id}")
def delete_doc(doc_id: int, x_sf_workspace: str = Header(None)):
    w = _ws(x_sf_workspace)
    with _c() as con:
        con.execute("DELETE FROM wa_chunks WHERE doc_id=? AND ws=?", (doc_id, w["id"]))
        con.execute("DELETE FROM wa_docs WHERE id=? AND ws=?", (doc_id, w["id"]))
    return {"deleted": True}


@router.post("/knowledge/ask")
def ask(r: AskReq, request: Request, x_sf_workspace: str = Header(None)):
    """Test the bot from the dashboard: same retrieval + same rules as live replies."""
    w = _ws(x_sf_workspace)
    return _answer(w, r.question, request)


# ── webhook ────────────────────────────────────────────────────────────────
@router.get("/webhook/{ws_id}")
def webhook_verify(ws_id: str, request: Request):
    q = request.query_params
    with _c() as con:
        w = con.execute("SELECT verify_token FROM wa_workspaces WHERE id=?", (ws_id,)).fetchone()
    if w and q.get("hub.mode") == "subscribe" and hmac.compare_digest(q.get("hub.verify_token", ""), w["verify_token"]):
        return PlainTextResponse(q.get("hub.challenge", ""))
    raise HTTPException(403, "Verification failed.")


@router.post("/webhook/{ws_id}")
async def webhook_receive(ws_id: str, request: Request, bg: BackgroundTasks):
    raw = await request.body()
    with _c() as con:
        w = con.execute("SELECT app_secret FROM wa_workspaces WHERE id=?", (ws_id,)).fetchone()
    if not w:
        raise HTTPException(404)
    if w["app_secret"]:
        sig = request.headers.get("x-hub-signature-256", "")
        good = "sha256=" + hmac.new(w["app_secret"].encode(), raw, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, good):
            raise HTTPException(401, "Bad signature.")
    try:
        payload = json.loads(raw or b"{}")
    except ValueError:
        raise HTTPException(400, "Invalid JSON.")
    for entry in payload.get("entry", []) or []:
        for ch in entry.get("changes", []) or []:
            v = ch.get("value", {}) or {}
            names = {c.get("wa_id"): (c.get("profile") or {}).get("name", "") for c in v.get("contacts", []) or []}
            for m in v.get("messages", []) or []:
                bg.add_task(_handle_inbound, ws_id, m, names.get(m.get("from"), ""))
            for st in v.get("statuses", []) or []:
                bg.add_task(_handle_status, ws_id, st)
    return {"received": True}
