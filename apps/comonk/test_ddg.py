import re, asyncio, httpx
from urllib.parse import urlparse
SKIP=("justdial","indiamart","linkedin","facebook","instagram","youtube","naukri","glassdoor","sulekha","wikipedia","google.","quora","zaubacorp","tofler","duckduckgo","ambitionbox","tradeindia","goodfirms","clutch")
def cdom(u):
    try:
        h=urlparse(u if "//" in u else "http://"+u).netloc.lower().replace("www.","")
        return h if "." in h else None
    except: return None
def good(u):
    d=cdom(u) or ""; return d and not any(s in d for s in SKIP)

tests=[("TatvaSoft","Ahmedabad"),("Bacancy Technology","Ahmedabad"),("Hyperlink Infosystem","Ahmedabad"),("AddWeb Solution","Ahmedabad")]
async def main():
    async with httpx.AsyncClient(headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}) as c:
        for co,city in tests:
            site=None
            try:
                r=await c.post("https://html.duckduckgo.com/html/", data={"q":f"{co} {city} official website"}, timeout=12)
                links=re.findall(r'class="result__url"[^>]*>([^<]+)<', r.text)
                # also uddg redirect links
                raw=re.findall(r'href="(https?://[^"]+)"', r.text)
                cand=None
                for u in raw:
                    if "duckduckgo.com" in u:
                        m=re.search(r'uddg=([^&]+)', u)
                        if m:
                            from urllib.parse import unquote
                            u=unquote(m.group(1))
                    if good(u): cand=u; break
                site=cand
            except Exception as e:
                print("  err", e)
            print(f"{co}: DDG website={site}")
asyncio.run(main())
