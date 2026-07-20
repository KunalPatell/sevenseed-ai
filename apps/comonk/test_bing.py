import re, asyncio, httpx
from urllib.parse import urlparse
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
SKIP=("justdial","indiamart","linkedin","facebook","instagram","youtube","naukri","glassdoor","sulekha","wikipedia","google.","bing.","microsoft.","msn.","quora","tofler","yelp","ambitionbox","goodfirms","clutch","zaubacorp")
def cdom(u):
    try:
        h=urlparse(u if "//" in u else "http://"+u).netloc.lower().replace("www.",""); return h if "." in h else None
    except: return None
def good(u):
    d=cdom(u) or ""; return d and not any(s in d for s in SKIP)

async def bing(client, q):
    r=await client.get("https://www.bing.com/search", params={"q":q}, timeout=12)
    # multiple extraction strategies
    cites=re.findall(r'<cite[^>]*>(.*?)</cite>', r.text)
    algo_links=re.findall(r'<h2><a[^>]*href="(https?://[^"]+)"', r.text)
    all_links=re.findall(r'href="(https?://[^"]+)"', r.text)
    good_algo=[u for u in algo_links if good(u)]
    good_all=[u for u in all_links if good(u)]
    # phone from snippets
    phones=re.findall(r'(?:\+91[\s\-]?)?(?:0)?[6-9]\d{9}', r.text)
    print(f"  q={q[:40]!r}")
    print(f"    cites(first5)={cites[:5]}")
    print(f"    h2-links good={good_algo[:3]}")
    print(f"    any good link={good_all[:3]}")
    print(f"    phones(first3)={phones[:3]}")

async def main():
    async with httpx.AsyncClient(headers={"User-Agent":UA}, follow_redirects=True) as c:
        for co in ["Zeel Solutions Ahmedabad", "TatvaSoft Ahmedabad", "Silver Touch Technologies Ahmedabad"]:
            await bing(c, co+" official website")
            await bing(c, co+" contact phone number")
asyncio.run(main())
