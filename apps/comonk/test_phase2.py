import re, asyncio, httpx
from urllib.parse import quote_plus, urlparse
from playwright.async_api import async_playwright

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
SKIP=("justdial","indiamart","linkedin","facebook","instagram","youtube","naukri","glassdoor","sulekha","wikipedia","google.","bing.","microsoft.","quora","tofler","yelp","ambitionbox","goodfirms","clutch","mapsofindia","zaubacorp")
def cdom(u):
    try:
        h=urlparse(u if "//" in u else "http://"+u).netloc.lower().replace("www.",""); return h if "." in h else None
    except: return None
def good(u):
    d=cdom(u) or ""; return d and not any(s in d for s in SKIP)

async def test_bing_httpx(client, q):
    try:
        r=await client.get("https://www.bing.com/search", params={"q":q}, timeout=12)
        links=re.findall(r'<li class="b_algo".*?<a href="(https?://[^"]+)"', r.text, re.S)
        site=next((u for u in links if good(u)), None)
        return f"status={r.status_code} len={len(r.text)} firstsite={site}"
    except Exception as e:
        return f"ERR {repr(e)[:60]}"

async def test_zauba_httpx(client, company):
    try:
        r=await client.get("https://www.zaubacorp.com/companysearchresults/"+quote_plus(company), timeout=12, headers={"User-Agent":UA})
        return f"status={r.status_code} len={len(r.text)} hasEmail={'@' in r.text}"
    except Exception as e:
        return f"ERR {repr(e)[:60]}"

async def test_google_browser(company, city):
    try:
        async with async_playwright() as pw:
            b=await pw.chromium.launch(headless=True)
            pg=await (await b.new_context(user_agent=UA)).new_page()
            await pg.goto(f"https://www.google.com/search?q={quote_plus(company+' '+city+' official website contact')}", wait_until="domcontentloaded", timeout=20000)
            await pg.wait_for_timeout(2500)
            title=await pg.title()
            # extract result links
            hrefs=await pg.eval_on_selector_all('a[href^="http"]', 'els => els.map(e=>e.href)')
            site=next((u for u in hrefs if good(u)), None)
            body=await pg.inner_text('body')
            phones=re.findall(r'(?:\+91[\s\-]?)?[6-9]\d{9}', body)
            await b.close()
            return f"title={title[:30]!r} firstsite={site} phones_found={len(phones)} sample={phones[:2]}"
    except Exception as e:
        return f"ERR {repr(e)[:80]}"

async def main():
    async with httpx.AsyncClient(headers={"User-Agent":UA}, follow_redirects=True) as client:
        print("BING httpx:   ", await test_bing_httpx(client, "Zeel Solutions Ahmedabad official website"))
        print("ZAUBA httpx:  ", await test_zauba_httpx(client, "Tatvasoft"))
    print("GOOGLE browser:", await test_google_browser("Zeel Solutions", "Ahmedabad"))
asyncio.run(main())
