# mega_merge_folder_contacts.py
# MERGES ALL CONTACT DATA FROM ALL FILES (Spreadsheets, PDFs text extracts, CSVs, VCFs, TXTs)
# inside the folder into COMONK_TRUE_MASTER.xlsx.

import os, re, csv, openpyxl
from urllib.parse import urlparse
from datetime import datetime

EXCEL_MASTER = "COMONK_TRUE_MASTER.xlsx"
SHEET_NAME = "COMPLETE_MASTER"
LOG_FILE = "mega_merge_log.txt"

EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,7}\b')
PHONE_RE = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}')

SKIP_MAIL = {
    "gmail.com","yahoo.com","yahoo.co.in","outlook.com","hotmail.com",
    "rediffmail.com","sentry.io","example.com","googlemail.com",
    "facebook.com","twitter.com","instagram.com","youtube.com",
    "cloudflare.com","google.com","microsoft.com","w3.org","schema.org",
}

GUJARAT_CITIES = {"ahmedabad", "gandhinagar", "surat", "vadodara", "rajkot",
                  "anand", "bharuch", "mehsana", "morbi", "gift city",
                  "gift", "sanand", "naroda", "vatva", "koba", "infocity"}

C_NO=1; C_COMP=2; C_CITY=3; C_CAT=4; C_ROLE=5
C_EMAILS=[6,7,8,9,10,11]
C_PHONE=12; C_WEB=13; C_LI=14; C_ADDR=15; C_CARE=16; C_PRIO=17; C_SRC=18

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def clean_phone(p):
    if not p: return ""
    d = re.sub(r'[^\d]', '', str(p))
    if d.startswith('1800') or d.startswith('1860') or d.startswith('1888'):
        if len(d) in (10, 11): return str(p).strip()
    if d.startswith('91') and len(d) >= 12: d = d[2:]
    elif d.startswith('0') and len(d) >= 11: d = d[1:]
    if len(d) in (10, 11):
        if len(set(d)) <= 2: return ""
        return str(p).strip()
    return ""

def valid_email(em):
    if not em or '@' not in em or len(em)>80: return False
    dom = em.split('@')[1].lower()
    return dom not in SKIP_MAIL and not any(x in dom for x in ['example','test','noreply','no-reply','dummy'])

def normalize_name(n):
    if not n: return ""
    # Strip common company tags to match names properly
    s = str(n).strip().lower()
    s = re.sub(r'\b(pvt|ltd|private|limited|inc|corporation|corp|solutions|technologies|services|tech|india)\b', '', s)
    s = re.sub(r'[^\w\s]', '', s)
    return " ".join(s.split())

def is_gujarat(city_raw):
    city = normalize_name(city_raw)
    return any(g in city for g in GUJARAT_CITIES)

def main():
    log("\n" + "="*80)
    log("  MEGA MASTER FOLDER MERGE ENGINE STARTED")
    log("="*80 + "\n")

    # Storage for aggregated contacts: {normalized_name: {"name": original, "emails": [], "phones": [], "web": "", "cat": ""}}
    data_pool = {}

    def add_to_pool(co_name, email_list=None, phone_list=None, web="", cat="", city=""):
        if not co_name: return
        norm = normalize_name(co_name)
        if not norm or len(norm) < 2: return
        
        if norm not in data_pool:
            data_pool[norm] = {
                "name": co_name.strip(),
                "emails": set(),
                "phones": set(),
                "web": web.strip(),
                "cat": cat.strip(),
                "city": city.strip()
            }
        
        # Merge values
        if email_list:
            for em in email_list:
                em = str(em).strip().lower()
                if valid_email(em):
                    data_pool[norm]["emails"].add(em)
        if phone_list:
            for ph in phone_list:
                ph = clean_phone(ph)
                if ph:
                    data_pool[norm]["phones"].add(ph)
        if web and not data_pool[norm]["web"]:
            data_pool[norm]["web"] = web.strip()
        if cat and not data_pool[norm]["cat"]:
            data_pool[norm]["cat"] = cat.strip()
        if city and not data_pool[norm]["city"]:
            data_pool[norm]["city"] = city.strip()

    # ─── PART 1: PARSE ALL DIRECTORY FILES ───────────────────────────────────
    for file in os.listdir('.'):
        if file == EXCEL_MASTER or file == LOG_FILE or file.startswith("mega_merge"):
            continue

        # A. Parse XLSX Files
        if file.endswith('.xlsx') and not file.startswith('~$'):
            log(f"Scanning XLSX file: {file}")
            try:
                wb = openpyxl.load_workbook(file, data_only=True)
                ws = wb.active
                
                # Check for standard columns or search dynamically
                row_iter = ws.iter_rows(values_only=True)
                header_row = next(row_iter, None)
                if not header_row: continue
                
                headers = [str(h).strip().lower() for h in header_row if h]
                
                # Match column indices
                idx_co = next((i for i, h in enumerate(header_row) if h and any(x in str(h).lower() for x in ["company name", "company", "co_name"])), -1)
                idx_em = [i for i, h in enumerate(header_row) if h and any(x in str(h).lower() for x in ["email", "mail", "hr email"])]
                idx_ph = next((i for i, h in enumerate(header_row) if h and any(x in str(h).lower() for x in ["phone", "tel", "contact", "mobile"])), -1)
                idx_web = next((i for i, h in enumerate(header_row) if h and any(x in str(h).lower() for x in ["website", "web", "domain"])), -1)
                
                # Default fallbacks if header lookup fails
                if idx_co == -1: idx_co = 0
                
                for row_vals in row_iter:
                    if not row_vals or idx_co >= len(row_vals): continue
                    co = row_vals[idx_co]
                    if not co or str(co).strip().lower() in ("none", "company name"): continue
                    
                    emails = []
                    for col in idx_em:
                        if col < len(row_vals) and row_vals[col]:
                            emails.append(str(row_vals[col]))
                    
                    phone = str(row_vals[idx_ph]) if idx_ph != -1 and idx_ph < len(row_vals) and row_vals[idx_ph] else ""
                    web = str(row_vals[idx_web]) if idx_web != -1 and idx_web < len(row_vals) and row_vals[idx_web] else ""
                    
                    add_to_pool(str(co), emails, [phone] if phone else None, web)
                wb.close()
            except Exception as e:
                log(f"  [Error parsing {file}] {e}")

        # B. Parse CSV Files
        elif file.endswith('.csv'):
            log(f"Scanning CSV file: {file}")
            try:
                with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                    reader = csv.reader(f)
                    header = next(reader, None)
                    if not header: continue
                    
                    idx_co = next((i for i, h in enumerate(header) if h and any(x in str(h).lower() for x in ["company", "name"])), 0)
                    idx_em = [i for i, h in enumerate(header) if h and any(x in str(h).lower() for x in ["email", "mail"])]
                    idx_ph = next((i for i, h in enumerate(header) if h and any(x in str(h).lower() for x in ["phone", "contact"])), -1)
                    
                    for row in reader:
                        if not row or idx_co >= len(row): continue
                        co = row[idx_co]
                        if not co or str(co).strip().lower() in ("none", "company"): continue
                        
                        emails = []
                        for col in idx_em:
                            if col < len(row) and row[col]:
                                emails.append(row[col])
                        
                        phone = row[idx_ph] if idx_ph != -1 and idx_ph < len(row) and row[idx_ph] else ""
                        add_to_pool(str(co), emails, [phone] if phone else None)
            except Exception as e:
                log(f"  [Error parsing {file}] {e}")

        # C. Parse TXT / PDF Text Extracts
        elif file.endswith('.txt'):
            log(f"Scanning text extract file: {file}")
            try:
                with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    
                # Scan lines for patterns like: "CompanyName - email@domain.com"
                lines = content.split('\n')
                for line in lines:
                    line = line.strip()
                    if not line: continue
                    
                    found_emails = EMAIL_RE.findall(line)
                    found_phones = PHONE_RE.findall(line)
                    
                    if found_emails or found_phones:
                        # Extract company name by stripping emails/phones/delimiters
                        clean_line = re.sub(EMAIL_RE, '', line)
                        clean_line = re.sub(PHONE_RE, '', clean_line)
                        clean_line = re.sub(r'[\-\:\,\;\(\)]', ' ', clean_line).strip()
                        
                        # Use the first 2-4 words as company name if valid
                        words = clean_line.split()
                        if words and len(words) <= 5:
                            co = " ".join(words)
                            add_to_pool(co, found_emails, found_phones)
            except Exception as e:
                log(f"  [Error parsing {file}] {e}")

        # D. Parse VCF Files
        elif file.endswith('.vcf'):
            log(f"Scanning VCF file: {file}")
            try:
                with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Split vcards
                vcards = content.split("BEGIN:VCARD")
                for card in vcards:
                    if not card.strip(): continue
                    fn = re.search(r'^FN:(.*)$', card, re.M)
                    email = re.search(r'^EMAIL.*:(.*)$', card, re.M)
                    tel = re.search(r'^TEL.*:(.*)$', card, re.M)
                    org = re.search(r'^ORG:(.*)$', card, re.M)
                    
                    co = ""
                    if org: co = org.group(1).split(';')[0].strip()
                    elif fn: co = fn.group(1).strip()
                    
                    em = email.group(1).strip() if email else ""
                    ph = tel.group(1).strip() if tel else ""
                    
                    if co and (em or ph):
                        add_to_pool(co, [em] if em else None, [ph] if ph else None)
            except Exception as e:
                log(f"  [Error parsing {file}] {e}")

    log(f"Total unique companies loaded from directory pool: {len(data_pool)}")

    # ─── PART 2: MERGE DIRECTORY POOL INTO MASTER EXCEL ──────────────────────
    log("Loading master spreadsheet...")
    wb = openpyxl.load_workbook(EXCEL_MASTER)
    ws = wb[SHEET_NAME]

    headers = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1))]
    hmap = {str(h).strip().lower(): i+1 for i, h in enumerate(headers) if h}
    total_cols = len(headers)

    COL_CO   = hmap.get("company name", 2)
    COL_CITY = hmap.get("city", 3)
    COL_CAT  = hmap.get("category", 4)
    COL_ROLE = hmap.get("target role", 5)
    COL_PH   = hmap.get("phone", 12)
    COL_WEB  = hmap.get("website", 13)
    COL_ADDR = hmap.get("address", 15)
    COL_CAR  = hmap.get("careers url", 16)
    COL_PRI  = hmap.get("priority", 17)
    email_cols = [hmap.get(f"email {i}") for i in range(1, 7)]
    email_cols = [ec for ec in email_cols if ec and ec <= total_cols]

    # Map current records
    master_records = {} # {normalized_name: row_index}
    for row in range(2, ws.max_row+1):
        co_name = str(ws.cell(row, COL_CO).value or "").strip()
        norm = normalize_name(co_name)
        if norm:
            master_records[norm] = row

    merged_updates = 0
    new_rows_added = 0

    for norm, info in data_pool.items():
        if norm in master_records:
            # Company exists -> merge emails and phones
            row = master_records[norm]
            
            # Merge emails
            existing_emails = set()
            for ec in email_cols:
                v = str(ws.cell(row, ec).value or "").strip().lower()
                if v and v != "none" and "@" in v:
                    existing_emails.add(v)
            
            empty_cols = [ec for ec in email_cols if not ws.cell(row, ec).value or str(ws.cell(row, ec).value).strip().lower() in ('none', '')]
            for em in info["emails"]:
                if em not in existing_emails:
                    if empty_cols:
                        col = empty_cols.pop(0)
                        ws.cell(row, col).value = em
                        existing_emails.add(em)
                        merged_updates += 1
            
            # Merge phone
            cur_ph = str(ws.cell(row, COL_PH).value or "").strip()
            if not cur_ph or cur_ph.lower() == "none":
                for ph in info["phones"]:
                    ws.cell(row, COL_PH).value = ph
                    merged_updates += 1
                    break
        else:
            # New company -> Append row
            new_row_vals = [""] * total_cols
            new_row_vals[COL_CO-1] = info["name"]
            
            # Detect city
            city_val = info["city"] if info["city"] else "Ahmedabad"
            new_row_vals[COL_CITY-1] = city_val
            
            # Detect category
            cat_val = info["cat"] if info["cat"] else ("MNC" if "mnc" in info["name"].lower() else "IT Company")
            new_row_vals[COL_CAT-1] = cat_val
            
            # Emails
            idx = 0
            for em in list(info["emails"])[:6]:
                if idx < len(email_cols):
                    col_idx = email_cols[idx]
                    new_row_vals[col_idx-1] = em
                    idx += 1
            
            # Phone
            if info["phones"]:
                new_row_vals[COL_PH-1] = list(info["phones"])[0]
                
            # Website
            if info["web"]:
                new_row_vals[COL_WEB-1] = info["web"]
                
            ws.append(new_row_vals)
            new_rows_added += 1

    wb.save(EXCEL_MASTER)
    log(f"Merged Updates Applied: {merged_updates}")
    log(f"New Companies Appended: {new_rows_added}")

    # Re-run master polisher to sort and style everything correctly
    log("Applying master formatting and sorting to COMONK_TRUE_MASTER.xlsx...")
    try:
        import final_sheet_polish
        final_sheet_polish.main()
        log("✅ Formatting and sorting complete.")
    except Exception as e:
        log(f"⚠️ Formatting script skipped: {e}")

    log("\n" + "="*80)
    log("  MEGA MASTER FOLDER MERGE ENGINE COMPLETED")
    log("="*80 + "\n")

if __name__ == "__main__":
    main()
