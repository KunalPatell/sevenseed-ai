# -*- coding: utf-8 -*-
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3, os, datetime, uuid as _uuid

router = APIRouter()

HERE = os.path.dirname(os.path.abspath(__file__))
try:
    from app import config as _cfg
    DB_PATH = _cfg.DB_PATH
except Exception:
    DB_PATH = os.path.join(HERE, "db.sqlite3")


def _now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


class CRMContactReq(BaseModel):
    first_name: str
    last_name: str = ""
    email: str
    phone: str = ""
    job_title: str = ""
    company_id: Optional[str] = None
    source: str = "website"
    status: str = "lead"
    tags: str = ""
    notes: str = ""


class CRMCompanyReq(BaseModel):
    name: str
    domain: str = ""
    industry: str = ""
    size: str = ""
    website: str = ""
    phone: str = ""
    address: str = ""
    notes: str = ""
    tags: str = ""


class CRMDealReq(BaseModel):
    title: str
    amount: int = 0
    currency: str = "USD"
    stage: str = "prospect"
    probability: int = 10
    contact_id: Optional[str] = None
    company_id: Optional[str] = None
    expected_close_date: Optional[str] = None
    source: str = ""
    description: str = ""
    tags: str = ""


class CRMDealUpdateReq(BaseModel):
    title: Optional[str] = None
    amount: Optional[int] = None
    stage: Optional[str] = None
    probability: Optional[int] = None
    description: Optional[str] = None


class CRMTaskReq(BaseModel):
    title: str
    description: str = ""
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[str] = None
    contact_id: Optional[str] = None
    deal_id: Optional[str] = None


class CRMTaskUpdateReq(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None


class CRMActivityReq(BaseModel):
    type: str = "note"
    subject: str
    description: str = ""
    contact_id: Optional[str] = None
    deal_id: Optional[str] = None


def _db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_crm():
    try:
        with _db() as c:
            c.execute("CREATE TABLE IF NOT EXISTS crm_companies (id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT, industry TEXT, size TEXT, website TEXT, phone TEXT, address TEXT, notes TEXT, tags TEXT, created_at TEXT, updated_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS crm_contacts (id TEXT PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT, email TEXT UNIQUE NOT NULL, phone TEXT, job_title TEXT, company_id TEXT, linkedin_url TEXT, twitter_url TEXT, avatar_url TEXT, source TEXT, status TEXT DEFAULT 'lead', tags TEXT, notes TEXT, created_at TEXT, updated_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS crm_deals (id TEXT PRIMARY KEY, title TEXT NOT NULL, amount INTEGER DEFAULT 0, currency TEXT DEFAULT 'USD', stage TEXT DEFAULT 'prospect', probability INTEGER DEFAULT 10, expected_close_date TEXT, contact_id TEXT, company_id TEXT, owner_id TEXT, source TEXT, description TEXT, tags TEXT, created_at TEXT, updated_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS crm_activities (id TEXT PRIMARY KEY, type TEXT NOT NULL, subject TEXT NOT NULL, description TEXT, contact_id TEXT, deal_id TEXT, user_id TEXT, activity_date TEXT, created_at TEXT)")
            c.execute("CREATE TABLE IF NOT EXISTS crm_tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'todo', priority TEXT DEFAULT 'medium', due_date TEXT, contact_id TEXT, deal_id TEXT, assigned_to TEXT, completed_at TEXT, created_at TEXT, updated_at TEXT)")
            
            # Auto-seed initial Sevenseed portfolio pipeline if empty
            deal_count = c.execute("SELECT COUNT(*) FROM crm_deals").fetchone()[0]
            if deal_count == 0:
                now = _now_iso()
                companies = [
                    ("comp-1", "Apex InfraBuild Ltd", "apexinfrabuild.in", "Construction", "500-1000", "https://apexinfrabuild.in", "+91-79-4001200", "Ahmedabad, GJ", "Breakdown Factor enterprise pilot", "construction,yolo,enterprise", now, now),
                    ("comp-2", "MedCare Hospital Chain", "medcareindia.com", "Healthcare", "1000+", "https://medcareindia.com", "+91-22-6600110", "Mumbai, MH", "Decode Forest Pharmacy OCR rollout", "pharmacy,ocr,healthcare", now, now),
                    ("comp-3", "FinEdge Global Technologies", "finedge.io", "FinTech", "200-500", "https://finedge.io", "+91-80-4112300", "Bengaluru, KA", "Sevenforce 7-Agent workforce license", "sevenforce,agents,saas", now, now),
                    ("comp-4", "Shree Vidya Engineering Campus", "shreevidya.edu.in", "Higher Education", "1000+", "https://shreevidya.edu.in", "+91-79-2630011", "Gandhinagar, GJ", "AVPU Socratic AI Tutor & LMS", "avpu,education,ai-tutor", now, now),
                ]
                c.executemany("INSERT OR IGNORE INTO crm_companies (id,name,domain,industry,size,website,phone,address,notes,tags,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", companies)

                contacts = [
                    ("cont-1", "Vikram", "Desai", "vikram.desai@apexinfrabuild.in", "+91-9825011223", "VP Engineering", "comp-1", "inbound", "qualified", "breakdown-factor,decision-maker", "Interested in CPWD BOQ & YOLO site safety", now, now),
                    ("cont-2", "Dr. Meera", "Kulkarni", "meera.k@medcareindia.com", "+91-9820144556", "Chief Medical Officer", "comp-2", "referral", "active", "decode-forest,clinical", "Evaluating prescription OCR & drug interaction API", now, now),
                    ("cont-3", "Rohan", "Nambiar", "rohan@finedge.io", "+91-9900122334", "Head of Growth", "comp-3", "outreach", "qualified", "sevenforce,comonk", "Running 14-day pilot of Maya, Wave, and Scout agents", now, now),
                    ("cont-4", "Prof. Kirit", "Patel", "dean@shreevidya.edu.in", "+91-9898077889", "Dean of Academics", "comp-4", "conference", "customer", "avpu,campus", "Signed annual campus license for 2,500 students", now, now),
                ]
                c.executemany("INSERT OR IGNORE INTO crm_contacts (id,first_name,last_name,email,phone,job_title,company_id,source,status,tags,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", contacts)

                deals = [
                    ("deal-1", "Apex InfraBuild — YOLO Safety & BOQ Suite", 42000, "USD", "prospect", 25, "2026-12-15", "cont-1", "comp-1", "Inbound", "Site safety vision + CPWD estimator for 6 active sites", "breakdown-factor", now, now),
                    ("deal-2", "MedCare — Prescription OCR & Triage API", 68000, "USD", "qualified", 50, "2026-11-30", "cont-2", "comp-2", "Referral", "Hospital-wide clinical triage & generic substitute engine", "decode-forest", now, now),
                    ("deal-3", "FinEdge — Sevenforce 7-Agent Enterprise Seat", 95000, "USD", "proposal", 70, "2026-11-20", "cont-3", "comp-3", "Outbound", "Full autonomous marketing, outreach & recruiting suite", "sevenforce", now, now),
                    ("deal-4", "Metro Civic Smart-City — Rakshak Sentinel", 54000, "USD", "negotiation", 85, "2026-11-10", "cont-1", "comp-1", "Gov Tender", "PPE mask, facial attendance & BNS FIR copilot deployment", "rakshak-ai", now, now),
                    ("deal-5", "Shree Vidya Campus — AVPU AI University", 26400, "USD", "won", 100, "2026-10-15", "cont-4", "comp-4", "Partner", "Campus-wide Socratic AI Tutor, Code Lab & Placement ATS", "avpu", now, now),
                ]
                c.executemany("INSERT OR IGNORE INTO crm_deals (id,title,amount,currency,stage,probability,expected_close_date,contact_id,company_id,source,description,tags,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", deals)

                tasks = [
                    ("task-1", "Send CPWD SOR repricing benchmark to Vikram", "Include Maharashtra & Gujarat state multipliers", "todo", "high", "2026-11-05", "cont-1", "deal-1", now, now),
                    ("task-2", "Schedule HIPAA/DPDP security review with Dr. Meera", "Review Rakshak DPDP compliance report", "in_progress", "high", "2026-11-08", "cont-2", "deal-2", now, now),
                    ("task-3", "Deliver Sevenforce custom LangGraph workflow demo", "Show Maya + Wave cold outreach sequence", "todo", "medium", "2026-11-12", "cont-3", "deal-3", now, now),
                ]
                c.executemany("INSERT OR IGNORE INTO crm_tasks (id,title,description,status,priority,due_date,contact_id,deal_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)", tasks)
            c.commit()
    except Exception as e:
        print(f"[CRM init] {e}")


init_crm()


@router.get('/api/crm/dashboard')
def crm_dashboard():
    try:
        with _db() as c:
            contacts = c.execute("SELECT COUNT(*) FROM crm_contacts").fetchone()[0]
            companies = c.execute("SELECT COUNT(*) FROM crm_companies").fetchone()[0]
            deals = c.execute("SELECT COUNT(*) FROM crm_deals").fetchone()[0]
            tasks = c.execute("SELECT COUNT(*) FROM crm_tasks WHERE status != 'done'").fetchone()[0]
            total_value = c.execute("SELECT COALESCE(SUM(amount),0) FROM crm_deals WHERE stage != 'lost'").fetchone()[0]
            won_value = c.execute("SELECT COALESCE(SUM(amount),0) FROM crm_deals WHERE stage = 'won'").fetchone()[0]
            pipeline = []
            for row in c.execute("SELECT stage, COUNT(*) as cnt, COALESCE(SUM(amount),0) as total FROM crm_deals GROUP BY stage"):
                pipeline.append(dict(row))
            return {
                "contacts": contacts,
                "companies": companies,
                "deals": deals,
                "tasks": tasks,
                "total_value": total_value,
                "won_value": won_value,
                "pipeline": pipeline,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/api/crm/contacts')
def crm_list_contacts():
    try:
        with _db() as c:
            rows = c.execute("SELECT * FROM crm_contacts ORDER BY created_at DESC").fetchall()
            return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/api/crm/contacts')
def crm_create_contact(r: CRMContactReq):
    try:
        cid = str(_uuid.uuid4())
        now = _now_iso()
        with _db() as c:
            existing = c.execute("SELECT id FROM crm_contacts WHERE email = ?", (r.email.strip(),)).fetchone()
            if existing:
                cid = existing["id"]
                c.execute(
                    "UPDATE crm_contacts SET first_name=?, last_name=?, phone=?, job_title=?, company_id=?, source=?, status=?, tags=?, notes=?, updated_at=? WHERE id=?",
                    (r.first_name, r.last_name, r.phone, r.job_title, r.company_id, r.source, r.status, r.tags, r.notes, now, cid),
                )
            else:
                c.execute(
                    "INSERT INTO crm_contacts (id,first_name,last_name,email,phone,job_title,company_id,source,status,tags,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (cid, r.first_name, r.last_name, r.email.strip(), r.phone, r.job_title, r.company_id, r.source, r.status, r.tags, r.notes, now, now),
                )
            c.commit()
        return {"id": cid, "ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete('/api/crm/contacts/{contact_id}')
def crm_delete_contact(contact_id: str):
    try:
        with _db() as c:
            cur = c.execute("DELETE FROM crm_contacts WHERE id = ?", (contact_id,))
            c.commit()
            return {"ok": True, "deleted": cur.rowcount > 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/api/crm/companies')
def crm_list_companies():
    try:
        with _db() as c:
            rows = c.execute("SELECT * FROM crm_companies ORDER BY created_at DESC").fetchall()
            return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/api/crm/companies')
def crm_create_company(r: CRMCompanyReq):
    try:
        cid = str(_uuid.uuid4())
        now = _now_iso()
        with _db() as c:
            c.execute(
                "INSERT INTO crm_companies (id,name,domain,industry,size,website,phone,address,notes,tags,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                (cid, r.name, r.domain, r.industry, r.size, r.website, r.phone, r.address, r.notes, r.tags, now, now),
            )
            c.commit()
        return {"id": cid, "ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete('/api/crm/companies/{company_id}')
def crm_delete_company(company_id: str):
    try:
        with _db() as c:
            cur = c.execute("DELETE FROM crm_companies WHERE id = ?", (company_id,))
            c.commit()
            return {"ok": True, "deleted": cur.rowcount > 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/api/crm/deals')
def crm_list_deals():
    try:
        with _db() as c:
            rows = c.execute("SELECT * FROM crm_deals ORDER BY created_at DESC").fetchall()
            return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/api/crm/deals')
def crm_create_deal(r: CRMDealReq):
    try:
        did = str(_uuid.uuid4())
        now = _now_iso()
        with _db() as c:
            c.execute(
                "INSERT INTO crm_deals (id,title,amount,currency,stage,probability,contact_id,company_id,expected_close_date,source,description,tags,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (did, r.title, r.amount, r.currency, r.stage, r.probability, r.contact_id, r.company_id, r.expected_close_date, r.source, r.description, r.tags, now, now),
            )
            c.commit()
        return {"id": did, "ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch('/api/crm/deals/{deal_id}')
@router.put('/api/crm/deals/{deal_id}')
def crm_update_deal(deal_id: str, r: CRMDealUpdateReq):
    try:
        now = _now_iso()
        stage_probs = {"prospect": 20, "qualified": 45, "proposal": 70, "negotiation": 85, "won": 100, "lost": 0}
        with _db() as c:
            row = c.execute("SELECT * FROM crm_deals WHERE id = ?", (deal_id,)).fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Deal not found")
            curr = dict(row)
            new_title = r.title if r.title is not None else curr["title"]
            new_amount = r.amount if r.amount is not None else curr["amount"]
            new_stage = r.stage if r.stage is not None else curr["stage"]
            new_prob = r.probability if r.probability is not None else stage_probs.get(new_stage, curr["probability"])
            new_desc = r.description if r.description is not None else curr["description"]
            c.execute(
                "UPDATE crm_deals SET title=?, amount=?, stage=?, probability=?, description=?, updated_at=? WHERE id=?",
                (new_title, new_amount, new_stage, new_prob, new_desc, now, deal_id),
            )
            c.commit()
            updated = c.execute("SELECT * FROM crm_deals WHERE id = ?", (deal_id,)).fetchone()
            return {"ok": True, "deal": dict(updated)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete('/api/crm/deals/{deal_id}')
def crm_delete_deal(deal_id: str):
    try:
        with _db() as c:
            cur = c.execute("DELETE FROM crm_deals WHERE id = ?", (deal_id,))
            c.commit()
            return {"ok": True, "deleted": cur.rowcount > 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/api/crm/tasks')
def crm_list_tasks():
    try:
        with _db() as c:
            rows = c.execute("SELECT * FROM crm_tasks ORDER BY created_at DESC").fetchall()
            return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/api/crm/tasks')
def crm_create_task(r: CRMTaskReq):
    try:
        tid = str(_uuid.uuid4())
        now = _now_iso()
        with _db() as c:
            c.execute(
                "INSERT INTO crm_tasks (id,title,description,status,priority,due_date,contact_id,deal_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
                (tid, r.title, r.description, r.status, r.priority, r.due_date, r.contact_id, r.deal_id, now, now),
            )
            c.commit()
        return {"id": tid, "ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch('/api/crm/tasks/{task_id}')
@router.put('/api/crm/tasks/{task_id}')
def crm_update_task(task_id: str, r: CRMTaskUpdateReq):
    try:
        now = _now_iso()
        with _db() as c:
            row = c.execute("SELECT * FROM crm_tasks WHERE id = ?", (task_id,)).fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Task not found")
            curr = dict(row)
            new_title = r.title if r.title is not None else curr["title"]
            new_status = r.status if r.status is not None else curr["status"]
            new_prio = r.priority if r.priority is not None else curr["priority"]
            completed_at = now if new_status == "done" else None
            c.execute(
                "UPDATE crm_tasks SET title=?, status=?, priority=?, completed_at=?, updated_at=? WHERE id=?",
                (new_title, new_status, new_prio, completed_at, now, task_id),
            )
            c.commit()
            updated = c.execute("SELECT * FROM crm_tasks WHERE id = ?", (task_id,)).fetchone()
            return {"ok": True, "task": dict(updated)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete('/api/crm/tasks/{task_id}')
def crm_delete_task(task_id: str):
    try:
        with _db() as c:
            cur = c.execute("DELETE FROM crm_tasks WHERE id = ?", (task_id,))
            c.commit()
            return {"ok": True, "deleted": cur.rowcount > 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/api/crm/activities')
def crm_list_activities():
    try:
        with _db() as c:
            rows = c.execute("SELECT * FROM crm_activities ORDER BY created_at DESC LIMIT 50").fetchall()
            return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/api/crm/activities')
def crm_create_activity(r: CRMActivityReq):
    try:
        aid = str(_uuid.uuid4())
        now = _now_iso()
        with _db() as c:
            c.execute(
                "INSERT INTO crm_activities (id,type,subject,description,contact_id,deal_id,activity_date,created_at) VALUES (?,?,?,?,?,?,?,?)",
                (aid, r.type, r.subject, r.description, r.contact_id, r.deal_id, now, now),
            )
            c.commit()
        return {"id": aid, "ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
