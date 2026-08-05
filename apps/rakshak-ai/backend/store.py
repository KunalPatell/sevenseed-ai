# -*- coding: utf-8 -*-
"""
Rakshak AI - Relational SQLite Database Store
--------------------------------------------
Implements persistent storage for complaints, telemetry data, custom RAG chunks,
and a cryptographically chained, tamper-proof audit trail for police operations.
"""

import os
import json
import sqlite3
import datetime
import random
import hashlib
import threading
import functools

# Lock to ensure thread-safe concurrent SQLite access in Python
_lock = threading.Lock()

DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
DB_PATH = os.path.join(DB_DIR, "complaints.db")

OFFICERS = [
    "Insp. R. Patel", "Insp. M. Shah", "SI K. Desai", "SI A. Chauhan",
    "Insp. P. Solanki", "SI N. Rathod",
]

STATUS_FLOW = ["Registered", "Under Review", "Officer Assigned", "Investigating", "Resolved"]

PRIORITY_BY_RISK = {
    "CRITICAL": "P1 · Critical",
    "HIGH": "P2 · High",
    "NORMAL": "P3 · Normal",
}

def _now():
    return datetime.datetime.now()

def _fmt(dt):
    return dt.strftime("%d-%b %I:%M %p")

def _build_timeline(created, status):
    """Create a plausible timeline up to the current status."""
    idx = STATUS_FLOW.index(status) if status in STATUS_FLOW else 0
    timeline = []
    t = created
    notes = {
        "Registered": "Complaint registered via Rakshak AI.",
        "Under Review": "Reviewed by duty officer; details verified.",
        "Officer Assigned": "Case assigned to investigating officer.",
        "Investigating": "Investigation in progress; evidence being collected.",
        "Resolved": "Case closed / resolved.",
    }
    for i in range(idx + 1):
        s = STATUS_FLOW[i]
        timeline.append({"time": _fmt(t), "status": s, "note": notes[s]})
        t = t + datetime.timedelta(hours=random.randint(2, 20))
    return timeline

# --- SQLite Database Initialization ---
def init_db():
    os.makedirs(DB_DIR, exist_ok=True)
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Complaints table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS complaints (
                id TEXT PRIMARY KEY,
                type TEXT,
                crime_type TEXT,
                summary TEXT,
                location TEXT,
                time TEXT,
                name TEXT,
                phone TEXT,
                email TEXT,
                risk TEXT,
                priority TEXT,
                status TEXT,
                officer TEXT,
                created_at TEXT,
                fir_text TEXT,
                legal_sections TEXT,
                timeline TEXT,
                coordinates TEXT,
                subscribed INTEGER,
                email_logs TEXT
            )
        """)
        
        # Telemetry table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS telemetry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time TEXT,
                action TEXT,
                provider TEXT,
                duration_ms INTEGER,
                input_tokens INTEGER,
                output_tokens INTEGER,
                status TEXT,
                cost REAL
            )
        """)
        
        # Custom uploaded chunks for RAG search
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS custom_chunks (
                id TEXT PRIMARY KEY,
                filename TEXT,
                text TEXT,
                chunk_index INTEGER
            )
        """)
        
        # Cryptographically chained tamper-evident audit log ledger
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time TEXT,
                action TEXT,
                record_id TEXT,
                payload_hash TEXT,
                chain_hash TEXT
            )
        """)
        
        conn.commit()
        conn.close()

# --- Tamper-evident Cryptographic Log Chaining ---
def _log_audit_chain(action, record_id, record_dict):
    """Computes a SHA-256 hash chaining this audit event back to the previous log hash."""
    import hashlib
    # Stable, key-sorted JSON serialization of the payload for deterministic hashing
    payload_str = json.dumps(record_dict, sort_keys=True)
    payload_hash = hashlib.sha256(payload_str.encode("utf-8")).hexdigest()
    
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Retrieve the hash from the last audit ledger entry
    cursor.execute("SELECT chain_hash FROM audit_log ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    prev_chain_hash = row[0] if row else "0000000000000000000000000000000000000000000000000000000000000000"
    
    # Calculate new chained hash linking current event and prior state
    chain_input = f"{timestamp}|{action}|{record_id}|{payload_hash}|{prev_chain_hash}"
    chain_hash = hashlib.sha256(chain_input.encode("utf-8")).hexdigest()
    
    cursor.execute(
        "INSERT INTO audit_log (time, action, record_id, payload_hash, chain_hash) VALUES (?, ?, ?, ?, ?)",
        (timestamp, action, record_id, payload_hash, chain_hash)
    )
    conn.commit()
    conn.close()

# --- Database Seeding ---
def _seed_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]
    conn.close()
    
    if count > 0:
        return
        
    seeds = [
        ("AHM-20260528-4471", "FIR", "Two-wheeler stolen from parking near SG Highway around midnight.",
         "Vehicle Theft", "SG Highway", "Last Night", "Rahul Mehta", "98250xxxxx", "HIGH", "Investigating"),
        ("AHM-20260528-2210", "Cybercrime", "Victim shared OTP on a fake bank call; Rs. 48,000 debited.",
         "Cyber Fraud", "Online", "Yesterday", "Sneha Joshi", "90999xxxxx", "HIGH", "Officer Assigned"),
        ("AHM-20260529-1003", "Emergency", "Woman reported being followed near Law Garden at night.",
         "Harassment", "Law Garden", "Today", "Anonymous", "Not provided", "CRITICAL", "Under Review"),
        ("AHM-20260527-8890", "FIR", "House break-in at Maninagar; jewellery and cash missing.",
         "Burglary / House Break-in", "Maninagar", "27-May", "Kiran Patel", "97120xxxxx", "HIGH", "Resolved"),
        ("AHM-20260529-3345", "Cybercrime", "UPI QR-code scam on PhonePe; Rs. 12,500 lost.",
         "Cyber Fraud", "Online", "Today", "Amit Shah", "99780xxxxx", "NORMAL", "Registered"),
        ("AHM-20260526-5567", "FIR", "Mobile phone snatched near CG Road bus stop.",
         "Mobile / Electronics Theft", "CG Road", "26-May", "Pooja Nair", "93270xxxxx", "NORMAL", "Investigating"),
    ]
    base = datetime.datetime.now()
    for i, s in enumerate(seeds):
        cid, ctype, summary, crime, loc, time, name, phone, risk, status = s
        created = base - datetime.timedelta(days=random.randint(0, 3), hours=random.randint(1, 12))
        email = f"{name.lower().replace(' ', '')}@example.com" if name != "Anonymous" else "Not provided"
        priority = PRIORITY_BY_RISK.get(risk, "P3 · Normal")
        officer = random.choice(OFFICERS) if status != "Registered" else "Pending assignment"
        created_at_str = _fmt(created)
        
        timeline = _build_timeline(created, status)
        email_logs = [
            {
                "time": _fmt(created + datetime.timedelta(minutes=5)),
                "subject": f"Simulated Status Update: Complaint {cid} - {status}",
                "recipient": email if name != "Anonymous" else "citizen@example.com"
            }
        ]
        
        add_complaint(
            cid, ctype, summary, crime_type=crime, location=loc, time=time,
            name=name, phone=phone, email=email, risk=risk, status=status,
            legal_sections=[], coordinates={}, subscribed=False
        )
        
        # Override initial timestamps and details to preserve seed timeline properties
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE complaints SET email_logs = ?, officer = ?, created_at = ? WHERE id = ?", 
                       (json.dumps(email_logs), officer, created_at_str, cid))
        conn.commit()
        conn.close()

def _seed_telemetry():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM telemetry")
    count = cursor.fetchone()[0]
    
    if count == 0:
        providers = ["Groq (Llama 3.3)", "Mistral", "OpenAI (GPT-4o)", "Offline Fallback"]
        actions = ["Chatbot Reply", "FIR Generation", "Cybercrime Analysis", "Legal RAG Search", "Agent Investigator"]
        base_time = datetime.datetime.now()
        for i in range(12):
            prov = random.choice(providers)
            act = random.choice(actions)
            dur = random.randint(50, 250) if prov == "Offline Fallback" else random.randint(600, 1800)
            status = "SUCCESS" if random.random() > 0.05 else "FAILED"
            itok = random.randint(150, 600) if prov != "Offline Fallback" else 0
            otok = random.randint(100, 450) if prov != "Offline Fallback" else 0
            cost = (itok * 0.00015 + otok * 0.0006) / 1000 if prov == "OpenAI (GPT-4o)" else (itok * 0.00005 + otok * 0.0001) / 1000 if prov != "Offline Fallback" else 0.0
            log_time = (base_time - datetime.timedelta(minutes=i*12 + random.randint(1, 10))).strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("""
                INSERT INTO telemetry (time, action, provider, duration_ms, input_tokens, output_tokens, status, cost)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (log_time, act, prov, dur, itok, otok, status, cost))
        conn.commit()
    conn.close()





# --- Database Interface Operations ---

def add_complaint(cid, ctype, summary, crime_type="", location="", time="",
                  name="", phone="", email="", risk="NORMAL", fir_text="", status="Registered",
                  legal_sections=None, coordinates=None, subscribed=False):
    created = _now()
    officer = random.choice(OFFICERS) if status != "Registered" else "Pending assignment"
    priority = PRIORITY_BY_RISK.get(risk, "P3 · Normal")
    timeline = _build_timeline(created, status)
    
    record = {
        "id": cid,
        "type": ctype,
        "crime_type": crime_type or ctype,
        "summary": summary,
        "location": location or "Not specified",
        "time": time or "Not specified",
        "name": name or "Anonymous",
        "phone": phone or "Not provided",
        "email": email or "Not provided",
        "risk": risk,
        "priority": priority,
        "status": status,
        "officer": officer,
        "created_at": _fmt(created),
        "fir_text": fir_text,
        "legal_sections": legal_sections or [],
        "timeline": timeline,
        "coordinates": coordinates or {},
        "subscribed": subscribed,
        "email_logs": [],
    }
    
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO complaints (
                id, type, crime_type, summary, location, time, name, phone, email, risk,
                priority, status, officer, created_at, fir_text, legal_sections, timeline,
                coordinates, subscribed, email_logs
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record["id"], record["type"], record["crime_type"], record["summary"],
            record["location"], record["time"], record["name"], record["phone"],
            record["email"], record["risk"], record["priority"], record["status"],
            record["officer"], record["created_at"], record["fir_text"],
            json.dumps(record["legal_sections"]), json.dumps(record["timeline"]),
            json.dumps(record["coordinates"]), 1 if record["subscribed"] else 0,
            json.dumps(record["email_logs"])
        ))
        conn.commit()
        conn.close()
        
        # Write cryptographic chain block log
        _log_audit_chain("REGISTER_COMPLAINT", cid, record)
        
    get_complaint.cache_clear()
    return record

def log_email_sent(cid, subject, recipient):
    """Log a simulated or sent email notification to the complaint's history."""
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT email_logs FROM complaints WHERE id = ?", (cid,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return False
            
        email_logs = json.loads(row[0]) if row[0] else []
        log_entry = {
            "time": _fmt(_now()),
            "subject": subject,
            "recipient": recipient
        }
        email_logs.append(log_entry)
        
        cursor.execute("UPDATE complaints SET email_logs = ? WHERE id = ?", (json.dumps(email_logs), cid))
        conn.commit()
        conn.close()
        
        _log_audit_chain("EMAIL_DISPATCH", cid, log_entry)
        
    get_complaint.cache_clear()
    return True

def update_subscription(cid, email, subscribed=True):
    """Subscribe a citizen email to status updates for a complaint."""
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT name, phone FROM complaints WHERE id = ?", (cid,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return False
            
        cursor.execute(
            "UPDATE complaints SET email = ?, subscribed = ? WHERE id = ?",
            (email, 1 if subscribed else 0, cid)
        )
        conn.commit()
        conn.close()
        
        _log_audit_chain("SUBSCRIBE_UPDATES", cid, {"email": email, "subscribed": subscribed})
        
    get_complaint.cache_clear()
    return True

def find_linked(crime_type, location, exclude_id=None):
    """Serial/pattern detection: other cases of the same crime type in the same area."""
    if not location or location == "Not specified":
        return []
    
    out = []
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        if exclude_id:
            cursor.execute(
                "SELECT id, location, created_at, status, crime_type FROM complaints WHERE crime_type = ? AND LOWER(location) = LOWER(?) AND id != ?",
                (crime_type, location, exclude_id)
            )
        else:
            cursor.execute(
                "SELECT id, location, created_at, status, crime_type FROM complaints WHERE crime_type = ? AND LOWER(location) = LOWER(?)",
                (crime_type, location)
            )
        rows = cursor.fetchall()
        conn.close()
        
    for r in rows:
        out.append({
            "id": r[0],
            "location": r[1],
            "created_at": r[2],
            "status": r[3],
            "crime_type": r[4]
        })
    return out

@functools.lru_cache(maxsize=128)
def get_complaint(cid):
    if not cid:
        return None
    cid = cid.strip().upper()
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM complaints WHERE UPPER(id) = ?", (cid,))
        row = cursor.fetchone()
        conn.close()
        
    if not row:
        return None
        
    # Translate DB row to dict mapping
    return {
        "id": row[0],
        "type": row[1],
        "crime_type": row[2],
        "summary": row[3],
        "location": row[4],
        "time": row[5],
        "name": row[6],
        "phone": row[7],
        "email": row[8],
        "risk": row[9],
        "priority": row[10],
        "status": row[11],
        "officer": row[12],
        "created_at": row[13],
        "fir_text": row[14],
        "legal_sections": json.loads(row[15]) if row[15] else [],
        "timeline": json.loads(row[16]) if row[16] else [],
        "coordinates": json.loads(row[17]) if row[17] else {},
        "subscribed": bool(row[18]),
        "email_logs": json.loads(row[19]) if row[19] else []
    }

def list_complaints(priority=None, ctype=None, status=None):
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        query = "SELECT * FROM complaints WHERE 1=1"
        params = []
        if priority:
            query += " AND priority LIKE ?"
            params.append(priority + "%")
        if ctype:
            query += " AND LOWER(type) = LOWER(?)"
            params.append(ctype)
        if status:
            query += " AND LOWER(status) = LOWER(?)"
            params.append(status)
            
        query += " ORDER BY rowid DESC"
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
    out = []
    for row in rows:
        record = {
            "id": row[0],
            "type": row[1],
            "crime_type": row[2],
            "summary": row[3],
            "location": row[4],
            "time": row[5],
            "name": row[6],
            "phone": row[7],
            "email": row[8],
            "risk": row[9],
            "priority": row[10],
            "status": row[11],
            "officer": row[12],
            "created_at": row[13],
            "fir_text": row[14],
            "legal_sections": json.loads(row[15]) if row[15] else [],
            "timeline": json.loads(row[16]) if row[16] else [],
            "coordinates": json.loads(row[17]) if row[17] else {},
            "subscribed": bool(row[18]),
            "email_logs": json.loads(row[19]) if row[19] else []
        }
        linked = find_linked(record["crime_type"], record["location"], exclude_id=record["id"])
        record["linked_count"] = len(linked)
        out.append(record)
    return out

def stats():
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM complaints")
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM complaints WHERE priority LIKE 'P1%'")
        p1 = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM complaints WHERE status != 'Resolved'")
        open_cases = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM complaints WHERE status = 'Resolved'")
        resolved = cursor.fetchone()[0]
        
        conn.close()
        
    return {
        "total": total,
        "p1": p1,
        "open": open_cases,
        "resolved": resolved
    }

# --- Telemetry Database Operations ---

def add_telemetry(action, provider, duration_ms, input_tokens, output_tokens, status="SUCCESS", cost=0.0):
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            INSERT INTO telemetry (time, action, provider, duration_ms, input_tokens, output_tokens, status, cost)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (timestamp, action, provider, duration_ms, input_tokens, output_tokens, status, cost))
        conn.commit()
        
        # Enforce maximum logs queue size to avoid disk bloating
        cursor.execute("SELECT COUNT(*) FROM telemetry")
        count = cursor.fetchone()[0]
        if count > 100:
            cursor.execute("DELETE FROM telemetry WHERE id IN (SELECT id FROM telemetry ORDER BY id ASC LIMIT ?)", (count - 100,))
            conn.commit()
        conn.close()

def get_telemetry():
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT time, action, provider, duration_ms, input_tokens, output_tokens, status, cost FROM telemetry ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        
    logs = []
    for r in rows:
        logs.append({
            "time": r[0],
            "action": r[1],
            "provider": r[2],
            "duration_ms": r[3],
            "input_tokens": r[4],
            "output_tokens": r[5],
            "status": r[6],
            "cost": round(r[7], 6)
        })
    return logs

# --- RAG Uploaded Custom Chunks Operations ---

def add_custom_chunk(text, filename=""):
    """Splits custom uploaded text into ~150-word chunks and indexes them in the SQLite DB."""
    words = text.split()
    chunk_size = 150
    chunks = [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    added_count = 0
    
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        for idx, chunk in enumerate(chunks):
            chunk_id = f"CST-{datetime.datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
            cursor.execute(
                "INSERT OR REPLACE INTO custom_chunks (id, filename, text, chunk_index) VALUES (?, ?, ?, ?)",
                (chunk_id, filename or "Custom Upload", chunk, idx)
            )
            added_count += 1
        conn.commit()
        conn.close()
    return added_count

def clear_custom_chunks():
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM custom_chunks")
        conn.commit()
        conn.close()

def search_custom_chunks(query, limit=3):
    """Simple keyword scoring RAG search over custom chunks stored in SQLite."""
    import re as re_local
    query_words = set(re_local.findall(r"\b\w+\b", query.lower()))
    
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, filename, text, chunk_index FROM custom_chunks")
        rows = cursor.fetchall()
        conn.close()
        
    scored = []
    for r in rows:
        chunk_words = set(re_local.findall(r"\b\w+\b", r[2].lower()))
        overlap = len(query_words.intersection(chunk_words))
        score = int((overlap / max(1, len(query_words))) * 100)
        if score > 0:
            scored.append({
                "id": r[0],
                "filename": r[1],
                "text": r[2],
                "chunk_index": r[3],
                "score": score
            })
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:limit]

def verify_audit_trail():
    """Verify the integrity of the cryptographic audit log.
    Traverses the ledger from ID 1 to the end, verifying the SHA-256 chain links.
    Returns: (is_valid, logs_list, tamper_info)
    """
    import hashlib
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, time, action, record_id, payload_hash, chain_hash FROM audit_log ORDER BY id ASC")
        rows = cursor.fetchall()
        conn.close()
        
    is_valid = True
    verified_logs = []
    tamper_info = None
    
    prev_chain_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    
    for r in rows:
        row_id, timestamp, action, record_id, payload_hash, stored_chain_hash = r
        
        # Calculate expected hash
        chain_input = f"{timestamp}|{action}|{record_id}|{payload_hash}|{prev_chain_hash}"
        expected_chain_hash = hashlib.sha256(chain_input.encode("utf-8")).hexdigest()
        
        match = (expected_chain_hash == stored_chain_hash)
        
        verified_logs.append({
            "id": row_id,
            "time": timestamp,
            "action": action,
            "record_id": record_id,
            "payload_hash": payload_hash,
            "stored_hash": stored_chain_hash,
            "expected_hash": expected_chain_hash,
            "verified": match
        })
        
        if not match:
            is_valid = False
            if not tamper_info:
                tamper_info = {
                    "tampered_id": row_id,
                    "action": action,
                    "record_id": record_id,
                    "expected": expected_chain_hash,
                    "stored": stored_chain_hash
                }
                
        prev_chain_hash = stored_chain_hash
        
    return is_valid, verified_logs, tamper_info

# Initialize schema and seed data
init_db()
_seed_db()
_seed_telemetry()




def add_audit_entry(action: str, details: str = "", record_id: str = "") -> None:
    """Public wrapper over the hash-chained audit log.

    main.py calls add_audit_entry(action=..., details=...) in several places, but
    store only exposed the private _log_audit_chain(action, record_id, record_dict) —
    so every one of those calls raised AttributeError. Rather than rewriting the
    call sites, this adapts to them and keeps the chaining behaviour intact.
    Failures are swallowed: an audit write must not take down the request that
    triggered it.
    """
    try:
        _log_audit_chain(action, record_id or "-", {"details": details})
    except Exception:
        pass
