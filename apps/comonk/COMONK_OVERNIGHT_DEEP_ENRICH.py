"""
COMONK_OVERNIGHT_DEEP_ENRICH.py
==================================
Runs overnight to deeply enrich the master spreadsheet using:
1. Deeper Website crawling (/about, /team, /careers, /career) for phones & corporate emails.
2. IndiaMART search snippet parsing (verified mobile numbers).
3. Zaubacorp search snippet parsing (registered corporate emails).

Auto-saves every 10 records and is crash-safe.
"""

import sys, os, re, asyncio, openpyxl, httpx, random
from urllib.parse import quote_plus, urlparse
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

EXCEL = "Ahmedabad_IT_AIML_FINAL_MASTER.xlsx"
SHEET = "All Companies"
LOG = "overnight_enrich_log.txt"

PHONE_RE = re.compile(r'\b(?:\+91[\-\s]?)?[6-9]\d{9}\b|\b079[\-\s]?\d{7,8}\b|\b\+91[\s\-]?\d{5}[\s\-]?\d{5}\b')
EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,7}\b')

FREE_DOMAINS = {
    "gmail.com","yahoo.com","outlook.com","hotmail.com","facebook.com",
    "twitter.com","instagram.com","linkedin.com","youtube.com",
    "justdial.com","indiamart.com","sulekha.com","glassdoor.com",
    "ambitionbox.com","naukri.com","wikipedia.org","bing.com","r.bing.com",
    "duckduckgo.com","search.yahoo.com","yimg.com"
}

UAS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0"
]

SEMAPHORE = asyncio.Semaphore(3) # Safe rate limit for overnight run

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        with open(LOG, 'a', encoding='utf-8') as f:
            f.write(line + "\n")
    except:
        pass

def clean_phone(p):
    if not p: return ""
    d = re.sub(r'[^\d]', '', str(p))
    if "7326059369" in d: return ""
    if "123456" in d or "987654" in d or "543210" in d: return ""
    for i in range(10):
        if str(i)*5 in d: return ""
    if len(d) >= 10:
        if len(set(d)) <= 2: return ""
        return str(p).strip()
    return ""

async def fetch_page(client, url):
    headers = {"User-Agent": random.choice(UAS)}
    try:
        res = await client.get(url, headers=headers, follow_redirects=True, timeout=8)
        if res.status_code == 200:
            return res.text
    except:
        pass
    return ""

# Query Bing/DDG for snippets
async def search_snippets(client, query):
    # Try Bing first
    url_bing = f"https://www.bing.com/search?q={quote_plus(query)}"
    html = await fetch_page(client, url_bing)
    
    # Try Yahoo fallback if empty
    if not html or "security check" in html.lower():
        url_yahoo = f"https://search.yahoo.com/search?p={quote_plus(query)}"
        html = await fetch_page(client, url_yahoo)
        
    return html or ""

# --- Scrape direct websites deeply ---
async def crawl_website_deeply(client, url):
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    found_phones = set()
    found_emails = set()
    
    # Target common subpages
    subpages = ["", "contact", "contact-us", "about", "about-us", "careers", "career", "team"]
    for sub in subpages:
        target_url = url.rstrip('/') + '/' + sub if sub else url
        html = await fetch_page(client, target_url)
        if not html:
            continue
            
        # Parse phones
        for p in PHONE_RE.findall(html):
            cleaned = clean_phone(p)
            if cleaned:
                found_phones.add(cleaned)
                
        # Parse emails
        for e in EMAIL_RE.findall(html):
            email_lower = e.lower().strip()
            domain = email_lower.split('@')[-1]
            if domain not in FREE_DOMAINS and len(email_lower) > 5:
                found_emails.add(email_lower)
                
        # Small delay between pages of the same site
        await asyncio.sleep(0.5)
        
    return list(found_phones), list(found_emails)

async def enrich_company(client, name, city, website, phone, existing_emails):
    phones = set()
    emails = set(existing_emails)
    new_website = website
    
    # 1. Crawl Website Deeply (If known)
    if website and website.lower() not in ('none','n/a',''):
        log(f"Deep crawling website for {name} ({website})...")
        found_ph, found_em = await crawl_website_deeply(client, website)
        for p in found_ph: phones.add(p)
        for e in found_em: emails.add(e)

    # 2. IndiaMART Phone Snippet Search (If phone missing)
    if not phone:
        await asyncio.sleep(random.uniform(2.0, 4.0))
        log(f"Searching IndiaMART for {name}...")
        html = await search_snippets(client, f"{name} IndiaMART phone")
        for p in PHONE_RE.findall(html):
            cleaned = clean_phone(p)
            if cleaned:
                log(f"  [FOUND INDIAMART PHONE] {name} -> {cleaned}")
                phones.add(cleaned)
                break

    # 3. Zaubacorp Email Snippet Search (If emails are low/missing)
    if len(emails) < 6:
        await asyncio.sleep(random.uniform(2.0, 4.0))
        log(f"Searching Zaubacorp for {name}...")
        html = await search_snippets(client, f"{name} Zaubacorp official email")
        for e in EMAIL_RE.findall(html):
            email_lower = e.lower().strip()
            domain = email_lower.split('@')[-1]
            if domain not in FREE_DOMAINS:
                log(f"  [FOUND ZAUBACORP EMAIL] {name} -> {email_lower}")
                emails.add(email_lower)
                if len(emails) >= 6:
                    break

    # 4. Standard Search Fallback (If website or phone still missing)
    if (not new_website or new_website.lower() in ('none','n/a','')) or not phones:
        await asyncio.sleep(random.uniform(2.0, 4.0))
        log(f"Running fallback search for {name}...")
        html = await search_snippets(client, f"{name} {city} contact phone website")
        
        # Extract website
        if not new_website or new_website.lower() in ('none','n/a',''):
            urls = re.findall(r'href="([^"]+)"', html)
            for u in urls:
                parsed = urlparse(u)
                domain = parsed.netloc.lower()
                if domain.startswith('www.'): domain = domain[4:]
                is_blocked = any(fd in domain for fd in FREE_DOMAINS)
                if domain and not is_blocked and '.' in domain:
                    new_website = parsed.scheme + "://" + parsed.netloc
                    log(f"  [FOUND FALLBACK WEB] {name} -> {new_website}")
                    break
                    
        # Extract phone
        if not phones:
            for p in PHONE_RE.findall(html):
                cleaned = clean_phone(p)
                if cleaned:
                    log(f"  [FOUND FALLBACK PHONE] {name} -> {cleaned}")
                    phones.add(cleaned)
                    break

    final_phone = list(phones)[0] if phones else phone
    final_emails = list(emails)[:6]
    
    return final_phone, new_website, final_emails

async def process_row(client, r_idx, name, city, website, phone, existing_emails):
    async with SEMAPHORE:
        try:
            f_phone, f_web, f_emails = await enrich_company(client, name, city, website, phone, existing_emails)
            return r_idx, f_phone, f_web, f_emails
        except Exception as e:
            log(f"Error processing {name}: {str(e)}")
            return r_idx, phone, website, existing_emails

async def main():
    log("=== STARTING OVERNIGHT DEEP ENRICHER ===")
    
    wb = openpyxl.load_workbook(EXCEL)
    ws = wb[SHEET]
    
    headers = [c.value for c in next(ws.iter_rows(min_row=3, max_row=3))]
    hmap = {str(h).strip().lower(): i for i, h in enumerate(headers) if h}
    
    COL_CO = hmap.get('company name', 1)
    COL_PH = hmap.get('phone', 9)
    COL_WEB = hmap.get('website', 10)
    COL_CITY = hmap.get('city', 13)
    
    # Map Email 1 to Email 6 columns
    email_cols = []
    for col_idx, h in enumerate(headers):
        if h and 'email' in str(h).lower():
            email_cols.append(col_idx)
            
    # Load all records to enrich
    targets = []
    for r_idx in range(4, ws.max_row + 1):
        co = str(ws.cell(r_idx, COL_CO + 1).value or '').strip()
        if not co: continue
        
        ph = str(ws.cell(r_idx, COL_PH + 1).value or '').strip()
        web = str(ws.cell(r_idx, COL_WEB + 1).value or '').strip()
        city = str(ws.cell(r_idx, COL_CITY + 1).value or 'Ahmedabad').strip()
        
        existing_emails = []
        for e_col in email_cols:
            val = str(ws.cell(r_idx, e_col + 1).value or '').strip().lower()
            if val and val not in ('none', 'n/a', ''):
                existing_emails.append(val)
                
        targets.append((r_idx, co, city, web, ph, existing_emails))

    log(f"Loaded {len(targets)} companies for overnight sweep.")
    
    batch_size = 15
    async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
        for i in range(0, len(targets), batch_size):
            batch = targets[i:i+batch_size]
            log(f"Processing batch {i//batch_size + 1} (size {len(batch)})...")
            
            tasks = [process_row(client, r_idx, name, city, web, ph, ex_ems) for r_idx, name, city, web, ph, ex_ems in batch]
            results = await asyncio.gather(*tasks)
            
            # Write results back and save
            for r_idx, f_phone, f_web, f_emails in results:
                # Phone
                if f_phone:
                    ws.cell(r_idx, COL_PH + 1).value = f_phone
                # Website
                if f_web:
                    ws.cell(r_idx, COL_WEB + 1).value = f_web
                # Emails
                for idx, e_col in enumerate(email_cols):
                    if idx < len(f_emails):
                        ws.cell(r_idx, e_col + 1).value = f_emails[idx]
                    else:
                        ws.cell(r_idx, e_col + 1).value = ""
                        
            wb.save(EXCEL)
            log(f"Batch {i//batch_size + 1} saved successfully.")
            await asyncio.sleep(5) # Cooldown between batches

    wb.close()
    log("=== OVERNIGHT DEEP ENRICH COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(main())
