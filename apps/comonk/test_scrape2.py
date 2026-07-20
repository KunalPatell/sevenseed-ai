import re, asyncio
from urllib.parse import quote_plus, urlparse, unquote
from playwright.async_api import async_playwright
SKIP=("justdial","indiamart","linkedin","facebook","instagram","youtube","naukri","glassdoor","sulekha","wikipedia","google.","quora","zaubacorp","tofler")
def cdom(u):
    try:
        h=urlparse(u if "//" in u else "http://"+u).netloc.lower().replace("www.",""); return h if "." in h else None
    except: return None
def good(u):
    d=cdom(u) or ""; return d and not any(s in d for s in SKIP)
tests=[("TatvaSoft","Ahmedabad"),("Bacancy Technology","Ahmedabad"),("Hyperlink Infosystem","Ahmedabad"),("AddWeb Solution","Ahmedabad"),("Zeel Solutions","Ahmedabad")]
async def look(pg,co,city):
    ph=web=addr=None
    await pg.goto(f"https://www.google.com/maps/search/{quote_plus(co+' '+city+' Gujarat')}", wait_until="domcontentloaded", timeout=20000)
    await pg.wait_for_timeout(3000)
    f=await pg.query_selector('a.hfpxzc')
    if f: await f.click(); await pg.wait_for_timeout(2500)
    el=await pg.query_selector('[data-item-id="authority"]')
    if el:
        aria=await el.get_attribute('aria-label') or ""
        if ":" in aria:
            d=aria.split(":",1)[1].strip().replace("www.","")
            if "." in d and good(d): web="https://www."+d
    el=await pg.query_selector('[data-item-id^="phone:tel:"]')
    if el:
        did=await el.get_attribute('data-item-id')
        if did and "tel:" in did: ph=did.split("tel:")[1]
    el=await pg.query_selector('[data-item-id="address"]')
    if el:
        a=await el.get_attribute('aria-label'); addr=a.split(":",1)[1].strip() if a and ":" in a else a
    return ph,web,addr
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(headless=True)
        pg=await (await b.new_context(user_agent="Mozilla/5.0")).new_page()
        for co,city in tests:
            try:
                ph,web,addr=await look(pg,co,city)
                print(f"{co}: phone={ph} | web={web} | addr={str(addr)[:40]}")
            except Exception as e:
                print(f"{co}: ERR {repr(e)[:60]}")
        await b.close()
asyncio.run(main())
