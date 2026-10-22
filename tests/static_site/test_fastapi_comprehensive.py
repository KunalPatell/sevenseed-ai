import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')

backend_dir = r"E:\main\apps\sevenseed\apps\sevenseed\backend"
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from starlette.testclient import TestClient
from main import app

client = TestClient(app)

results = {
    "passed": 0,
    "failed": 0,
    "details": []
}

def log(name, passed, msg=""):
    status = "✓ PASS" if passed else "✗ FAIL"
    if passed:
        results["passed"] += 1
    else:
        results["failed"] += 1
    results["details"].append({"name": name, "passed": passed, "msg": msg})
    print(f"  [{status}] {name} {('- ' + msg) if msg else ''}", flush=True)

print("======================================================================", flush=True)
print("SEVENSEED FULL ECOSYSTEM VERIFICATION (FastAPI TestClient)", flush=True)
print("======================================================================", flush=True)

# 1. CORE PLATFORM ENDPOINTS
print("\n[1/7] Core Platform Endpoints", flush=True)
for path in ["/", "/api/health", "/api/ventures", "/api/ideas", "/api/portfolio"]:
    resp = client.get(path)
    log(f"GET {path}", resp.status_code == 200, f"Status: {resp.status_code}")

# 2. SEVENFORCE & OPERATIONS AI (ZohoAgent & CodingAgent)
print("\n[2/7] Sevenforce & Operations AI (ZohoAgent & CodingAgent)", flush=True)
r_ts = client.get("/api/power/operations/timesheets")
j_ts = r_ts.json()
log("GET /api/power/operations/timesheets", r_ts.status_code == 200 and j_ts.get("status") == "success", f"Logged: {j_ts.get('total_logged_hours')}h, Entries: {j_ts.get('entries_count')}")

r_log = client.post("/api/power/operations/log-time", json={
    "project": "CodingAgent2.0",
    "engineer": "Dev Patel",
    "task_desc": "TestClient automation verification",
    "hours": 3.5,
    "billable": True
})
j_log = r_log.json()
log("POST /api/power/operations/log-time", r_log.status_code == 200 and j_log.get("status") == "success", j_log.get("message", ""))

r_att = client.get("/api/power/operations/attendance")
j_att = r_att.json()
log("GET /api/power/operations/attendance", r_att.status_code == 200 and j_att.get("total_staff", 0) > 0, f"Total staff: {j_att.get('total_staff')}, Present: {j_att.get('present')}")

r_sp = client.get("/api/power/operations/sprints")
j_sp = r_sp.json()
log("GET /api/power/operations/sprints", r_sp.status_code == 200 and "sprint_name" in j_sp, f"Sprint: {j_sp.get('sprint_name')}, Velocity: {j_sp.get('velocity_pct')}%")

# 3. AVP EMART & COMMERCE AI (price-com & bestseller-analytics)
print("\n[3/7] AVP Emart & Commerce AI", flush=True)
r_cmp = client.post("/api/emart/compare-multistore", json={"query": "Sony WH-1000XM5"})
j_cmp = r_cmp.json()
best_store = j_cmp.get("best_store") or {}
best_price = best_store.get('price')
best_price_str = f"₹{best_price:,}" if isinstance(best_price, (int, float)) else "N/A"
is_valid_cmp = r_cmp.status_code == 200 and (j_cmp.get("status") in ("success", "no_live_data"))
log("POST /api/emart/compare-multistore", is_valid_cmp, f"Mode: {j_cmp.get('data_mode', j_cmp.get('status'))}, Best: {best_store.get('name', 'N/A')} at {best_price_str}")

r_bsr = client.post("/api/emart/bestseller-analytics", json={"asin_or_query": "Sony WH-1000XM5"})
j_bsr = r_bsr.json()
is_valid_bsr = r_bsr.status_code == 200 and "bsr_rank" in j_bsr
log("POST /api/emart/bestseller-analytics", is_valid_bsr, f"BSR: {j_bsr.get('bsr_rank')}, Units: {j_bsr.get('monthly_velocity_units')}")

# 4. COMONK CAREER SUITE (Resume-JD Matcher & Skill Taxonomy)
print("\n[4/7] Comonk Career Suite", flush=True)
r_tax = client.get("/api/comonk/skill-taxonomy")
j_tax = r_tax.json()
log("GET /api/comonk/skill-taxonomy", r_tax.status_code == 200 and j_tax.get("total_skills", 0) >= 30, f"Taxonomy skills: {j_tax.get('total_skills')}")

r_mat = client.post("/api/comonk/match-resume-jd", json={
    "resume_text": "Senior Python Backend Engineer with 5 years experience in FastAPI, Docker, PostgreSQL, Redis, and AWS. Built scalable microservices.",
    "jd_text": "Looking for Lead Backend Architect with Python, FastAPI, Kubernetes, Docker, Kafka, PostgreSQL, and GraphQL."
})
j_mat = r_mat.json()
log("POST /api/comonk/match-resume-jd", r_mat.status_code == 200 and j_mat.get("match_score", 0) > 0, f"Match: {j_mat.get('match_score')}%, Missing: {len(j_mat.get('missing_skills', []))} skills")

# 5. BREAKDOWN FACTOR & RAKSHAK AI (YOLOv8 & Biometric Security)
print("\n[5/7] Breakdown Factor & Rakshak AI", flush=True)
r_ppe = client.post("/api/rakshak/detect-safety-ppe", json={"image_base64": "dummy", "scenario_preset": "compliant_worker"})
j_ppe = r_ppe.json()
log("POST /api/rakshak/detect-safety-ppe", r_ppe.status_code == 200 and "compliance_rate_percent" in j_ppe, f"Compliance: {j_ppe.get('compliance_rate_percent')}%, Hazard: {j_ppe.get('hazard_level')}")

r_face = client.post("/api/rakshak/match-face", json={"face_image_base64": "dummy", "candidate_id": "EMP-001"})
j_face = r_face.json()
log("POST /api/rakshak/match-face", r_face.status_code == 200 and j_face.get("verified"), f"Matched: {j_face.get('name')} ({j_face.get('employee_id')}), Match: {j_face.get('match_confidence')}%")

# 6. DECODE FOREST PHARMACY & AVP TRUST
print("\n[6/7] Decode Forest Pharmacy & AVP Trust", flush=True)
r_med = client.post("/api/pharmacy/free-medicine-request", json={
    "citizen_name": "Ramesh Sharma",
    "phone": "+91 98765 43210",
    "city": "Ahmedabad",
    "prescription_details": "Telmisartan 40mg (BP maintenance) 30 tablets monthly",
    "income_tier": "BPL / Low Income (Under ₹2.5L/yr)"
})
j_med = r_med.json()
log("POST /api/pharmacy/free-medicine-request", r_med.status_code == 200 and j_med.get("status") == "success", f"Token: {j_med.get('token')}")

r_tr = client.get("/api/trust/transparency-ledger")
j_tr = r_tr.json()
log("GET /api/trust/transparency-ledger", r_tr.status_code == 200 and j_tr.get("total_beneficiaries_assisted") > 0, f"Beneficiaries: {j_tr.get('total_beneficiaries_assisted'):,}, Free Meds: ₹{j_tr.get('free_medicine_dispensed_inr'):,}")

r_gr = client.post("/api/trust/apply-grant", json={
    "applicant_name": "Sita Devi",
    "phone": "+91 91234 56789",
    "grant_type": "Emergency Medical Relief",
    "amount_requested": 45000.0,
    "justification": "Post-cardiac ICU admission support"
})
j_gr = r_gr.json()
log("POST /api/trust/apply-grant", r_gr.status_code == 200 and "token" in j_gr, f"Grant Token: {j_gr.get('token')}, Amount: {j_gr.get('amount_requested_inr')}")

# 7. WORKSTATION PAGES AVAILABILITY
print("\n[7/7] Workstations HTML Availability", flush=True)
workstations = [
    "/price-comparator.html",
    "/resume-matcher.html",
    "/damage-vision.html",
    "/vision-security.html",
    "/pharmacy-studio.html",
    "/charitable-trust.html",
    "/operations-intelligence.html",
    "/coding-agent-studio.html",
    "/interview-radar.html",
    "/workstations.html"
]
for ws in workstations:
    r = client.get(ws)
    log(f"Workstation {ws}", r.status_code == 200 and len(r.text) > 1000, f"{len(r.text)} bytes")

print("\n======================================================================", flush=True)
print(f"VERIFICATION SUMMARY: {results['passed']} PASSED, {results['failed']} FAILED", flush=True)
print("======================================================================", flush=True)
if results['failed'] > 0:
    sys.exit(1)
