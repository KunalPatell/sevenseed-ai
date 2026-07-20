import re, asyncio, httpx
from urllib.parse import quote_plus, urlparse
from playwright.async_api import async_playwright

EMAIL_RE=re.compile(r'[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}')
SKIP=("justdial","indiamart","linkedin","facebook","instagram","youtube","naukri","glassdoor","sulekha","wikipedia","google.","quora","zaubacorp","tofler")
def cdom(u):
    try:
        h=urlparse(u if "//" in u else "http://"+u).netloc.lower().replace("www.","")
        return h if "." in h else None
    except: return None
def good(u):
    d=cdom(u) or ""; return d and not any(s in d for s in SKIP)

tests=[("TatvaSoft","Ahmedabad"),("Bacancy Technology","Ahmedabad"),("Hyperlink Infosystem","Ahmedabad")]

async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(headless=True)
        pg=await (await b.new_context(user_agent="Mozilla/5.0")).new_page()
        for co,city in tests:
            phone=website=None
            try:
                await pg.goto(f"https://www.google.com/maps/search/{quote_plus(co+' '+city)}", wait_until="domcontentloaded", timeout=20000)
                await pg.wait_for_timeout(3000)
                f=await pg.query_selector('a.hfpxzc')
                if f: await f.click(); await pg.wait_for_timeout(2500)
                el=await pg.query_selector('a[data-item-id="authority"]')
                if el:
                    h=await el.get_attribute('href')
                    if h and good(h): website=h
                el=await pg.query_selector('button[data-item-id^="phone:tel:"]')
                if el:
                    did=await el.get_attribute('data-item-id')
                    if did and "tel:" in did: phone=did.split("tel:")[1]
            except Exception as e:
                print("  maps err", e)
            print(f"{co}: MAPS phone={phone} website={website}")
        await b.close()

asyncio.run(main())
