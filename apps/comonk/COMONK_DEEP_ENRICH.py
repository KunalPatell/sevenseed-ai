# COMONK_DEEP_ENRICH.py
# Target-focused email and phone number harvester for Ahmedabad_IT_AIML_FINAL_MASTER.xlsx.
# Features search engine scraping fallbacks, domain pattern building, and asynchronous batch querying.

import sys, os, re, asyncio, openpyxl, httpx
from urllib.parse import urlparse, quote_plus
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

EXCEL = "Ahmedabad_IT_AIML_FINAL_MASTER.xlsx"
SHEET = "All Companies"
LOG = "deep_enrich_log.txt"

# 17-column layout mappings:
C_NO=1; C_COMP=2; C_CAT=3; C_ROLE=4
C_EMAILS=[5, 6, 7, 8, 9, 17] # Email 1 to 5, and Email 6 is at col 17
C_PHONE=10; C_WEB=11; C_LI=12; C_ADDR=13; C_CITY=14; C_PRIO=15; C_SRC=16

EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,7}\b')
PHONE_RE = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}')

SKIP_MAIL = {
    "gmail.com","yahoo.com","yahoo.co.in","outlook.com","hotmail.com",
    "rediffmail.com","sentry.io","example.com","googlemail.com",
    "facebook.com","twitter.com","instagram.com","youtube.com",
    "cloudflare.com","google.com","microsoft.com","w3.org","schema.org",
}

HR_PATTERNS = ["hr", "careers", "jobs", "info", "contact", "support", "hiring", "recruit", "talent"]

SEMAPHORE = asyncio.Semaphore(5)

def log(msg):
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        with open(LOG, 'a', encoding='utf-8') as f: f.write(line+"\n")
    except: pass

def clean_phone(p):
    if not p: return ""
    d = re.sub(r'[^\d]', '', str(p))
    
    # Toll-free check
    if d.startswith('1800') or d.startswith('1860') or d.startswith('1888'):
        if len(d) in (10, 11):
            return str(p).strip()
            
    # Leading country codes and 0 prefix cleanup
    if d.startswith('91') and len(d) >= 12:
        d = d[2:]
    elif d.startswith('0') and len(d) >= 11:
        d = d[1:]
        
    # Standard check: 10 or 11 digits (mobile/landlines)
    if len(d) in (10, 11):
        if len(set(d)) <= 2: return "" # Repeating digits block
        return str(p).strip()
    return ""

def safe_save(wb, filename):
    import time
    while True:
        try:
            wb.save(filename)
            return
        except PermissionError:
            log(f"  [⚠️ WARNING] Permission Denied: Cannot save '{filename}'. Please close the file if it is open in Microsoft Excel! Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            log(f"  [❌ ERROR] Failed to save: {e}")
            raise e

def domain_of(url):
    if not url: return ""
    url = str(url).strip()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        if netloc.startswith('www.'): netloc = netloc[4:]
        return netloc
    except: return ""

async def search(client, query):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}"
    try:
        res = await client.get(url, headers=headers, follow_redirects=True, timeout=6)
        if res.status_code == 200:
            return res.text
    except Exception as e:
        # Fallback to general lookup
        pass
    
    # Second fallback using fallback search domain
    url_google = f"https://www.google.com/search?q={quote_plus(query)}"
    try:
        res = await client.get(url_google, headers=headers, follow_redirects=True, timeout=6)
        if res.status_code == 200:
            return res.text
    except:
        pass
    return ""

async def enrich_one(client, name, city, web, dom):
    result = {"emails": [], "phone": ""}
    
    # 1. Search Query
    q = f'"{name}" {city} OR "contact" OR "email" OR "phone" OR "HR"'
    html = await search(client, q)
    
    # Extract emails
    for em in EMAIL_RE.findall(html):
        em = em.lower().strip()
        domain = em.split('@')[1] if '@' in em else ''
        if domain not in SKIP_MAIL and not any(x in domain for x in ['example','test','noreply','dummy']):
            if em not in result["emails"]:
                result["emails"].append(em)

    # Extract phones
    phones = PHONE_RE.findall(html)
    for ph in phones:
        cp = clean_phone(ph)
        if cp:
            result["phone"] = cp
            break

    # Fallback to pattern generation for matching domains
    if dom and len(result["emails"]) < 3:
        for pfx in HR_PATTERNS:
            candidate = f"{pfx}@{dom}"
            if candidate not in result["emails"]:
                result["emails"].append(candidate)
            if len(result["emails"]) >= 6: break

    return result

async def process_company(client, row_data):
    row_idx, name, city, web, dom, cur_emails, cur_phone = row_data
    async with SEMAPHORE:
        try:
            result = await enrich_one(client, name, city, web, dom)
            return row_idx, result
        except Exception as e:
            log(f"  [Error] {name}: {e}")
            return row_idx, None

async def main():
    log("\n" + "="*70)
    log("  COMONK DEEP ENRICH — Target-focused Email/Phone harvester")
    log("="*70 + "\n")

    wb = openpyxl.load_workbook(EXCEL)
    ws = wb[SHEET]
    
    headers = [c.value for c in next(ws.iter_rows(min_row=3, max_row=3))]
    hmap = {str(h).strip().lower(): i+1 for i, h in enumerate(headers) if h}
    
    # Identify rows needing enrichment
    targets = []
    for row in range(4, ws.max_row+1):
        name = str(ws.cell(row, C_COMP).value or "").strip()
        if not name: continue
        
        city = str(ws.cell(row, C_CITY).value or "Ahmedabad")
        web = str(ws.cell(row, C_WEB).value or "")
        dom = domain_of(web)
        
        cur_emails = [str(ws.cell(row, c).value or "").strip() for c in C_EMAILS if ws.cell(row, c).value]
        cur_emails = [e for e in cur_emails if e.lower() != 'none' and '@' in e]
        
        cur_phone = str(ws.cell(row, C_PHONE).value or "").strip()
        if cur_phone == 'None': cur_phone = ''
        
        # If emails < 3 OR phone is missing, enrich
        if len(cur_emails) < 3 or not cur_phone:
            targets.append((row, name, city, web, dom, cur_emails, cur_phone))

    log(f"  Found {len(targets)} companies missing contact data.")
    if not targets:
        log("  No enrichment targets found.")
        return

    # Process in batches of 15
    BATCH_SIZE = 15
    limits = httpx.Limits(max_connections=12, max_keepalive_connections=8)
    
    e_added = 0
    p_added = 0
    
    async with httpx.AsyncClient(limits=limits, verify=False, timeout=8) as client:
        for b_idx in range(0, len(targets), BATCH_SIZE):
            batch = targets[b_idx:b_idx+BATCH_SIZE]
            log(f"  Processing batch {b_idx//BATCH_SIZE + 1} ({b_idx + len(batch)}/{len(targets)})...")
            
            tasks = [process_company(client, (r, n, c, w, d, ems, ph)) for r, n, c, w, d, ems, ph in batch]
            results = await asyncio.gather(*tasks)
            
            # Write results back in real-time
            for res in results:
                if not res or not res[1]: continue
                row_idx, data = res
                
                # Update emails
                empty_cols = [c for c in C_EMAILS if not ws.cell(row_idx, c).value or str(ws.cell(row_idx, c).value).strip().lower() in ('none', '')]
                for em in data["emails"]:
                    existing_lower = [str(ws.cell(row_idx, c).value).strip().lower() for c in C_EMAILS if ws.cell(row_idx, c).value]
                    if em not in existing_lower:
                        if empty_cols:
                            col = empty_cols.pop(0)
                            ws.cell(row_idx, col).value = em
                            e_added += 1
                            
                # Update phone
                if data["phone"] and (not ws.cell(row_idx, C_PHONE).value or str(ws.cell(row_idx, C_PHONE).value).strip().lower() in ('none', '')):
                    cp = clean_phone(data["phone"])
                    if cp:
                        ws.cell(row_idx, C_PHONE).value = cp
                        p_added += 1
            
            safe_save(wb, EXCEL)
            log(f"  Batch complete. Total added so far: +{e_added} emails, +{p_added} phones.")
            await asyncio.sleep(1.0)

    safe_save(wb, EXCEL)
    log("\n  ✅ DEEP ENRICH COMPLETE!")

if __name__ == "__main__":
    asyncio.run(main())
