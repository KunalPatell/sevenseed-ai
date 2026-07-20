"""
match_linkedin_to_mnc.py — Match existing 1839 LinkedIn HR profiles to MNC companies
Reads linkedin_profiles.csv and maps HR people to MNCs in COMONK_TRUE_MASTER.xlsx
"""
import sys, re, csv, unicodedata, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

EXCEL   = "COMONK_TRUE_MASTER.xlsx"
SHEET   = "COMPLETE_MASTER"
LI_CSV  = "linkedin_profiles.csv"

MNC_KEYWORDS = [
    "tcs","tata consultancy","infosys","wipro","accenture","ibm","capgemini",
    "deloitte","cognizant","hcl","tech mahindra","pwc","ernst","ey ","bosch",
    "siemens","oracle","ntt","fujitsu","mphasis","hexaware","persistent","kpit",
    "ltts","l&t","larsen","mindtree","apexon","infostretch","exl","mastech",
    "syntel","zensar","cyient","niit","firstsource","wns","polaris","conduent",
    "amazon","google","microsoft","cisco","sap","salesforce","adobe","vmware",
    "dell","hp","intel","qualcomm","nvidia","reliance","adani","tata elxsi",
    "tata digital","mahindra","bajaj","airtel","jio","vodafone","birla",
    "axis bank","hdfc","icici","kotak","sbi","samsung","philips","honeywell",
    "allegis","randstad","manpower","ltimindtree","lti mindtree",
]

def norm(s):
    if not s: return ""
    s = unicodedata.normalize("NFKD", str(s).lower())
    return re.sub(r"[^a-z0-9 ]", " ", s).strip()

def company_match(profile_text, mnc_name):
    """Check if profile text mentions the MNC."""
    pt = norm(profile_text)
    mn = norm(mnc_name)
    # exact match or partial
    if mn in pt: return True
    # try each word > 4 chars
    for word in mn.split():
        if len(word) > 4 and word in pt:
            return True
    return False

# ── Load LinkedIn profiles CSV ────────────────────────────────────────────────
print(f"Loading {LI_CSV}...")
li_profiles = []
try:
    with open(LI_CSV, encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            li_profiles.append(row)
    print(f"  Loaded {len(li_profiles)} profiles")
    print(f"  Columns: {list(li_profiles[0].keys()) if li_profiles else 'none'}")
except Exception as e:
    print(f"  ERROR: {e}")
    li_profiles = []

# ── Load MNCs from Excel ──────────────────────────────────────────────────────
print(f"\nLoading MNCs from {EXCEL}...")
wb = openpyxl.load_workbook(EXCEL)
ws = wb[SHEET]

C_EMAILS = list(range(6, 12))
C_PHONE  = 12
C_WEB    = 13
C_LI     = 14
C_LIHR   = 19
C_LICO   = 20

mncs = {}
for r in range(2, ws.max_row + 1):
    name = str(ws.cell(r, 2).value or "").strip()
    if not name: continue
    name_lower = name.lower()
    if any(k in name_lower for k in MNC_KEYWORDS):
        mncs[r] = {
            "name": name,
            "row": r,
            "matches": [],
        }
print(f"  Found {len(mncs)} MNCs")

# ── Match profiles to MNCs ────────────────────────────────────────────────────
print(f"\nMatching {len(li_profiles)} profiles to {len(mncs)} MNCs...")
matched_total = 0

for r, mnc in mncs.items():
    for profile in li_profiles:
        # Check all fields in profile for company name
        profile_str = " ".join(str(v) for v in profile.values())
        if company_match(profile_str, mnc["name"]):
            mnc["matches"].append(profile)

    if mnc["matches"]:
        matched_total += len(mnc["matches"])

# ── Print results ─────────────────────────────────────────────────────────────
print(f"\n{'='*70}")
print(f"  LINKEDIN HR MATCH RESULTS")
print(f"{'='*70}")

all_matched_mncs = {r: m for r, m in mncs.items() if m["matches"]}
print(f"  MNCs with LinkedIn HR matches: {len(all_matched_mncs)}/{len(mncs)}")
print(f"  Total HR profile matches: {matched_total}\n")

for r, mnc in sorted(all_matched_mncs.items(), key=lambda x: -len(x[1]["matches"])):
    print(f"\n  [{len(mnc['matches'])} profiles] {mnc['name']}")
    for p in mnc["matches"][:5]:  # show max 5 per company
        vals = list(p.values())
        print(f"    -> {' | '.join(str(v)[:60] for v in vals[:4] if v)}")

# ── Write matches to new Excel sheet ─────────────────────────────────────────
MATCH_SHEET = "LinkedIn_MNC_HR"
if MATCH_SHEET in wb.sheetnames:
    del wb[MATCH_SHEET]
ws2 = wb.create_sheet(MATCH_SHEET)

# Header
headers_out = ["Company (MNC)", "Row in Master"] + (list(li_profiles[0].keys()) if li_profiles else ["Profile Data"])
for c, h in enumerate(headers_out, 1):
    ws2.cell(1, c, h)

row2 = 2
for r, mnc in sorted(all_matched_mncs.items()):
    for profile in mnc["matches"]:
        ws2.cell(row2, 1, mnc["name"])
        ws2.cell(row2, 2, r)
        for c, key in enumerate(profile.keys(), 3):
            ws2.cell(row2, c, profile[key])
        row2 += 1

wb.save(EXCEL)
print(f"\n  Sheet '{MATCH_SHEET}' saved with {row2-2} rows -> {EXCEL}")
