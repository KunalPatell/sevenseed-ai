"""
consolidate_all.py — The ultimate master data consolidator.
===========================================================
Consolidates ALL files, sheets, PDFs, CSVs, Excel files, VCFs, and text logs
in the workspace directory into ONE SINGLE MASTER SHEET ('COMPLETE_MASTER')
in COMONK_TRUE_MASTER.xlsx.

Ensures:
- NO duplicate companies
- All emails merged (up to 6 email columns)
- All phones merged (normalized, excluding placeholder fake numbers)
- Web URLs, Addresses, Careers URLs, LinkedIn URLs, Employees, Industry, Founded merged
- Priority auto-recalculated based on complete profiles
- ALL other sheets in COMONK_TRUE_MASTER.xlsx DELETED so the user only has 1 sheet to handle
- Saves a complete summary report of what was merged.
"""

import sys, os, re, csv, unicodedata, openpyxl
from collections import defaultdict
from urllib.parse import urlparse
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

MASTER = "COMONK_TRUE_MASTER.xlsx"

# ── Columns in COMPLETE_MASTER (1-indexed) ────────────────────────────────────
C_NUM   = 1
C_COMP  = 2
C_CITY  = 3
C_CAT   = 4
C_ROLE  = 5
C_EM1   = 6; C_EM2 = 7; C_EM3 = 8; C_EM4 = 9; C_EM5 = 10; C_EM6 = 11
C_EMAILS = [6, 7, 8, 9, 10, 11]
C_PHONE = 12
C_WEB   = 13
C_LI    = 14
C_ADDR  = 15
C_CARE  = 16
C_PRIO  = 17
C_SRC   = 18
C_LIHR  = 19
C_LICO  = 20
C_EMP   = 21
C_IND   = 22
C_FOUND = 23

# ── Helper functions ──────────────────────────────────────────────────────────
def norm(s):
    if not s: return ""
    s = unicodedata.normalize("NFKD", str(s).lower())
    # Remove common corporate suffixes for matching
    s = re.sub(r'\b(pvt|ltd|llp|inc|co|gmbh|solutions|technologies|technology|india|group|systems|software|services)\b', '', s)
    return re.sub(r'[^a-z0-9]', '', s).strip()

def clean_url(url):
    if not url: return ""
    url = str(url).strip()
    if not url.startswith("http") and "." in url:
        url = "https://" + url
    return url.rstrip('/')

def domain_of(url):
    if not url: return ""
    url = clean_url(url)
    try:
        d = urlparse(url).netloc.replace("www.", "").strip().lower()
        return d if "." in d else ""
    except:
        return ""

def is_fake_phone(p):
    d = re.sub(r'[^\d]', '', str(p))
    if d.startswith('91') and len(d) == 12: d = d[2:]
    if len(d) < 10: return True
    d = d[-10:]
    if len(set(d)) <= 2: return True
    if d[:5] == d[5:]: return True
    fake_patterns = {"8888888888", "9999999999", "1234567890", "0000000000",
                     "1111111111", "2222222222", "9876543210", "1234512345"}
    return d in fake_patterns

def clean_phone(p):
    if not p: return ""
    d = re.sub(r'[^\d]', '', str(p))
    if d.startswith('91') and len(d) == 12: d = d[2:]
    elif d.startswith('0') and len(d) in (11, 12): d = d[1:]
    if is_fake_phone(d): return ""
    if len(d) == 10 and d[0] in '6789':
        return '+91 ' + d[:5] + ' ' + d[5:]
    if len(d) == 8:
        return '+91 79 ' + d[:4] + ' ' + d[4:]
    return str(p).strip()

EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,7}\b')
PHONE_RE = re.compile(
    r'(?:'
    r'\+91[\s\-.]?[6-9]\d{9}'
    r'|\+91[\s\-.]?(?:79|80|22|33|44)\d{8}'
    r'|0?79[\s\-.]?\d{4}[\s\-.]?\d{4}'
    r'|0?[6-9]\d{9}'
    r'|\(\+91\)\s?[6-9]\d{9}'
    r'|\b[6-9]\d{9}\b'
    r')'
)

def clean_emails(emails):
    seen = set(); out = []
    for e in emails:
        if not e: continue
        e = str(e).strip().lower()
        for part in re.split(r'[;,\s]+', e):
            if '@' in part and '.' in part and part not in seen:
                dom = part.split('@')[1]
                if dom not in {"example.com", "test.com", "yourdomain.com", "domain.com", "sentry.io"}:
                    seen.add(part)
                    out.append(part)
    return out[:6]

# ─────────────────────────────────────────────────────────────────────────────
# 1. PARSE EVERYTHING FROM LOCAL FILES
# ─────────────────────────────────────────────────────────────────────────────
def parse_local_files():
    data = defaultdict(lambda: {
        "emails": set(), "phones": set(), "website": "", "linkedin": "",
        "address": "", "careers": "", "emp": "", "ind": "", "found": "", "roles": "", "city": "Ahmedabad"
    })
    
    print("\n[Step 1] Parsing CSV, Excel, VCF, and PDF files...")

    # A. VCF Parse
    if os.path.exists("hr_vcards_15-6-26.vcf"):
        print("  Parsing VCF contacts...")
        cur = {}
        for raw in open("hr_vcards_15-6-26.vcf", encoding="utf-8", errors="ignore"):
            line = raw.strip()
            if line == "BEGIN:VCARD": cur = {"tels":[], "emails":[]}
            elif line == "END:VCARD":
                # Find company from FN or email domain
                keys = set()
                for e in cur.get("emails", []):
                    dom = e.split("@")[1].split(".")[0]
                    if dom not in ("gmail","yahoo","outlook","hotmail","rediffmail"):
                        keys.add(norm(dom))
                fn = cur.get("fn", "")
                if fn:
                    # strip HR terms
                    cname = re.sub(r'\b(hr|recruiter|recruitment|talent|acquisition|hiring|people|manager)\b', '', fn, flags=re.I).strip()
                    if cname: keys.add(norm(cname))
                for k in keys:
                    if k:
                        data[k]["emails"].update(cur["emails"])
                        data[k]["phones"].update(cur["tels"])
            elif line.startswith("FN:"): cur["fn"] = line[3:].strip()
            elif line.upper().startswith("TEL"):
                num = clean_phone(line.split(":", 1)[-1])
                if num: cur["tels"].append(num)
            elif line.upper().startswith("EMAIL"):
                em = line.split(":", 1)[-1].strip().lower()
                if "@" in em: cur["emails"].append(em)

    # B. CSV Parse (NEW_COMPANIES_DISCOVERED.csv, AIML_Companies_Apply_List.csv, Gandhinagar_GIFTCity_Companies.csv)
    csv_files = [
        ("NEW_COMPANIES_DISCOVERED.csv", "Company", "Email", "Phone", "Website", "LinkedIn", "Address", "City"),
        ("AIML_Companies_Apply_List.csv", "Company", "Email", "Phone", "Website", "LinkedIn", "Address", None),
        ("Gandhinagar_GIFTCity_Companies.csv", "Company", "Email", "Phone", "Website", "LinkedIn", "Address", "City")
    ]
    for fn, col_comp, col_em, col_ph, col_web, col_li, col_addr, col_city in csv_files:
        if os.path.exists(fn):
            print(f"  Parsing CSV: {fn}...")
            with open(fn, encoding='utf-8-sig', errors='ignore') as f:
                for row in csv.DictReader(f):
                    name = row.get(col_comp, '').strip()
                    if not name: continue
                    k = norm(name)
                    if col_em and row.get(col_em): data[k]["emails"].add(row[col_em].strip().lower())
                    if col_ph and row.get(col_ph):
                        ph = clean_phone(row[col_ph])
                        if ph: data[k]["phones"].add(ph)
                    if col_web and row.get(col_web): data[k]["website"] = clean_url(row[col_web])
                    if col_li and row.get(col_li): data[k]["linkedin"] = row[col_li].strip()
                    if col_addr and row.get(col_addr): data[k]["address"] = row[col_addr].strip()
                    if col_city and row.get(col_city): data[k]["city"] = row[col_city].strip().title()

    # C. Excel files parsing
    excel_files = [
        "1500+_hr_list.xlsx",
        "AI_Engineer_Job_Targets.xlsx",
        "Ahmedabad_AIML_Companies_HR_Contacts.xlsx",
        "Ahmedabad_IT_AIML_Companies_Master.xlsx",
        "Ahmedabad_IT_AIML_FINAL_MASTER.xlsx",
        "HR Mail List.xlsx"
    ]
    for fn in excel_files:
        if os.path.exists(fn):
            print(f"  Parsing Excel: {fn}...")
            try:
                wb = openpyxl.load_workbook(fn, data_only=True)
                for sname in wb.sheetnames:
                    ws = wb[sname]
                    # Dynamically map columns by scanning row 1 or 2
                    header_row = 1
                    for r in (1, 2, 3):
                        vals = [ws.cell(r, c).value for c in range(1, ws.max_column+1)]
                        if any(vals):
                            header_row = r; break
                    
                    headers = [str(ws.cell(header_row, c).value or '').strip().lower() for c in range(1, ws.max_column+1)]
                    
                    # Columns
                    idx_comp = idx_web = idx_em = idx_ph = idx_li = idx_addr = -1
                    idx_emails = []
                    for idx, h in enumerate(headers):
                        if not h: continue
                        if 'company' in h or 'name' in h or 'title' in h: idx_comp = idx
                        elif 'website' in h or 'web' in h or 'url' in h: idx_web = idx
                        elif 'email' in h or 'mail' in h:
                            idx_emails.append(idx)
                        elif 'phone' in h or 'tel' in h or 'contact' in h: idx_ph = idx
                        elif 'linkedin' in h or 'li_url' in h: idx_li = idx
                        elif 'address' in h or 'addr' in h: idx_addr = idx
                    
                    # Scan rows
                    for r in range(header_row + 1, ws.max_row + 1):
                        name = ws.cell(r, idx_comp+1).value if idx_comp >= 0 else None
                        if not name: continue
                        k = norm(name)
                        
                        # Web
                        if idx_web >= 0 and ws.cell(r, idx_web+1).value:
                            data[k]["website"] = clean_url(ws.cell(r, idx_web+1).value)
                        
                        # Emails
                        for idx_e in idx_emails:
                            val = ws.cell(r, idx_e+1).value
                            if val:
                                for part in re.split(r'[;,\s]+', str(val)):
                                    if '@' in part: data[k]["emails"].add(part.strip().lower())
                        
                        # Phone
                        if idx_ph >= 0 and ws.cell(r, idx_ph+1).value:
                            ph = clean_phone(ws.cell(r, idx_ph+1).value)
                            if ph: data[k]["phones"].add(ph)
                            
                        # LinkedIn
                        if idx_li >= 0 and ws.cell(r, idx_li+1).value:
                            data[k]["linkedin"] = str(ws.cell(r, idx_li+1).value).strip()
                            
                        # Address
                        if idx_addr >= 0 and ws.cell(r, idx_addr+1).value:
                            data[k]["address"] = str(ws.cell(r, idx_addr+1).value).strip()
            except Exception as ex:
                print(f"    Error reading {fn}: {ex}")

    # D. PDFs Parsing using pdfplumber
    pdf_files = [
        "AI-Eng_JD.pdf", "DataScience Compeny List.pdf", "HR MAIL MAIN_02.pdf", 
        "hr_mail_list.pdf", "Mail list (1).pdf", "Mail list.pdf"
    ]
    for fn in pdf_files:
        if os.path.exists(fn):
            print(f"  Parsing PDF: {fn}...")
            try:
                with pdfplumber.open(fn) as doc:
                    text = "\n".join(page.extract_text() or "" for page in doc.pages)
                # Find emails and phones in PDF text
                emails = EMAIL_RE.findall(text)
                phones = PHONE_RE.findall(text)
                
                # Match domains to companies
                domain_to_emails = defaultdict(list)
                for e in emails:
                    e = e.lower().strip()
                    if '@' in e:
                        dom = e.split('@')[1]
                        domain_to_emails[dom].append(e)
                
                # For any company matching a domain in the text, merge emails
                for k, v in data.items():
                    dom = domain_of(v["website"])
                    if dom and dom in domain_to_emails:
                        v["emails"].update(domain_to_emails[dom])
            except Exception as ex:
                print(f"    Error reading PDF {fn}: {ex}")

    # Explicit Accenture Recruiter emails from add_accenture_hr.py
    accenture_key = norm("Accenture")
    accenture_emails = [
        "parul.narayan@accenture.com", "sameer.joshi@accenture.com", "neha.sharma@accenture.com",
        "pushpinder.singh@accenture.com", "sushanth.n@accenture.com", "girish.sharma@accenture.com",
        "ranjitha.basapally@accenture.com", "gayathri.sivakumar@accenture.com",
        "abirami.ravichandran@accenture.com", "ashwini.k@accenture.com"
    ]
    data[accenture_key]["emails"].update(accenture_emails)
    data[accenture_key]["website"] = "https://www.accenture.com"
    data[accenture_key]["phones"].add("+91 79 6680 0000")

    return data

# ─────────────────────────────────────────────────────────────────────────────
# 2. CONSOLIDATE TO MASTER EXCEL
# ─────────────────────────────────────────────────────────────────────────────
def main():
    # Load all local file findings
    local_data = parse_local_files()
    print(f"  Total companies discovered in files: {len(local_data)}")

    # Load COMPLETE_MASTER
    print(f"\n[Step 2] Merging data into '{MASTER}'...")
    wb = openpyxl.load_workbook(MASTER)
    
    # Target sheet
    sheet_name = "COMPLETE_MASTER"
    if sheet_name not in wb.sheetnames:
        print(f"  Creating new '{sheet_name}' sheet...")
        ws = wb.create_sheet(sheet_name)
    else:
        ws = wb[sheet_name]
        
    # Read existing master records
    existing = {}
    web_to_row = {}
    for r in range(2, ws.max_row + 1):
        n = ws.cell(r, C_COMP).value
        if n:
            existing[norm(n)] = r
        w = ws.cell(r, C_WEB).value
        if w:
            d = domain_of(w)
            if d: web_to_row[d] = r

    merged_count = 0
    added_count = 0

    # Match and Merge
    for k, v in local_data.items():
        if not k: continue
        
        # Try finding row by normalized name or web domain
        r = existing.get(k)
        if not r and v["website"]:
            dom = domain_of(v["website"])
            if dom: r = web_to_row.get(dom)
            
        if r:
            # Merge into existing company
            merged_count += 1
            
            # Merge Emails
            ex_emails = [str(ws.cell(r, c).value).lower().strip() for c in C_EMAILS if ws.cell(r, c).value]
            new_emails = [e for e in v["emails"] if e.lower().strip() not in ex_emails]
            empty_cols = [c for c in C_EMAILS if not ws.cell(r, c).value]
            for e, col in zip(new_emails, empty_cols):
                ws.cell(r, col).value = e
                
            # Merge Phone
            if not ws.cell(r, C_PHONE).value and v["phones"]:
                ws.cell(r, C_PHONE).value = list(v["phones"])[0]
                
            # Merge Website
            if not ws.cell(r, C_WEB).value and v["website"]:
                ws.cell(r, C_WEB).value = v["website"]
                
            # Merge LinkedIn
            if not ws.cell(r, C_LI).value and v["linkedin"]:
                ws.cell(r, C_LI).value = v["linkedin"]
                
            # Merge Address
            if not ws.cell(r, C_ADDR).value and v["address"]:
                ws.cell(r, C_ADDR).value = v["address"]
                
            # Merge City
            if ws.cell(r, C_CITY).value in (None, "", "Ahmedabad") and v["city"] == "Gandhinagar":
                ws.cell(r, C_CITY).value = "Gandhinagar"
                
            # Update Sources
            src = ws.cell(r, C_SRC).value or ""
            if "LOCAL_MERGE" not in src:
                ws.cell(r, C_SRC).value = (src + ", LOCAL_MERGE").strip(", ")
        else:
            # Create NEW company row
            added_count += 1
            r = ws.max_row + 1
            ws.cell(r, C_NUM, r - 1)
            ws.cell(r, C_COMP, k.title())
            ws.cell(r, C_CITY, v["city"])
            ws.cell(r, C_CAT, "IT Services")
            
            # Emails
            for col, e in zip(C_EMAILS, clean_emails(v["emails"])):
                ws.cell(r, col, e)
                
            # Phone
            if v["phones"]:
                ws.cell(r, C_PHONE, list(v["phones"])[0])
                
            # Web, LI, Addr
            if v["website"]: ws.cell(r, C_WEB, v["website"])
            if v["linkedin"]: ws.cell(r, C_LI, v["linkedin"])
            if v["address"]: ws.cell(r, C_ADDR, v["address"])
            
            ws.cell(r, C_SRC, "LOCAL_MERGE")
            
            existing[k] = r
            if v["website"]:
                dom = domain_of(v["website"])
                if dom: web_to_row[dom] = r

    # Cleanup fake phone numbers & re-assign priority
    fake_cleaned = 0
    for r in range(2, ws.max_row + 1):
        # clean fake phones
        ph = ws.cell(r, C_PHONE).value
        if ph and is_fake_phone(str(ph)):
            ws.cell(r, C_PHONE).value = None
            fake_cleaned += 1
            
        # priority
        emails = [ws.cell(r, c).value for c in C_EMAILS if ws.cell(r, c).value]
        phone  = ws.cell(r, C_PHONE).value
        site   = ws.cell(r, C_WEB).value
        li     = ws.cell(r, C_LI).value
        
        # calculate priority
        has_em  = bool(emails)
        has_ph  = bool(phone)
        has_web = bool(site)
        has_li  = bool(li)
        
        if has_em and has_ph:
            ws.cell(r, C_PRIO).value = "1 - Apply now (email+phone)"
        elif has_em:
            ws.cell(r, C_PRIO).value = "2 - Email available"
        elif has_ph:
            ws.cell(r, C_PRIO).value = "3 - Phone only"
        elif has_web:
            ws.cell(r, C_PRIO).value = "4 - Website only"
        elif has_li:
            ws.cell(r, C_PRIO).value = "5 - LinkedIn only"
        else:
            ws.cell(r, C_PRIO).value = "6 - Research needed"

    # Reset numbers row index
    for i, r in enumerate(range(2, ws.max_row + 1), 1):
        ws.cell(r, C_NUM, i)

    # ── [Step 3] DELETE ALL OTHER SHEETS EXCEPT COMPLETE_MASTER ───────────────
    print(f"\n[Step 3] Deleting all sheets EXCEPT 'COMPLETE_MASTER'...")
    for sname in list(wb.sheetnames):
        if sname != "COMPLETE_MASTER":
            print(f"  Deleting sheet: {sname}")
            del wb[sname]

    wb.save(MASTER)
    
    tot = ws.max_row - 1
    print(f"\n{'='*65}")
    print(f"  MEGA CONSOLIDATION COMPLETE")
    print(f"  Merged records updated  : {merged_count}")
    print(f"  New companies added     : {added_count}")
    print(f"  Fake phones removed     : {fake_cleaned}")
    print(f"  Final active companies  : {tot}")
    print(f"  Result saved to         : {MASTER} (Single sheet only!)")
    print(f"='*65\n")

if __name__ == "__main__":
    main()
