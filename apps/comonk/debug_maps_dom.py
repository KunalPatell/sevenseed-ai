import asyncio
from urllib.parse import quote_plus
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(headless=True)
        pg=await (await b.new_context(user_agent="Mozilla/5.0")).new_page()
        await pg.goto(f"https://www.google.com/maps/search/{quote_plus('TatvaSoft Ahmedabad')}", wait_until="domcontentloaded", timeout=20000)
        await pg.wait_for_timeout(3500)
        f=await pg.query_selector('a.hfpxzc')
        if f: await f.click(); await pg.wait_for_timeout(3000)
        # dump all a[data-item-id] and buttons
        items=await pg.query_selector_all('[data-item-id]')
        print("--- elements with data-item-id ---")
        for el in items[:15]:
            did=await el.get_attribute('data-item-id')
            aria=await el.get_attribute('aria-label')
            href=await el.get_attribute('href')
            print(f"  did={did!r} aria={str(aria)[:50]!r} href={str(href)[:50]!r}")
        # links with aria-label containing website-ish
        print("--- a[aria-label] sample ---")
        links=await pg.query_selector_all('a[aria-label]')
        for el in links[:15]:
            aria=await el.get_attribute('aria-label'); href=await el.get_attribute('href')
            if href and 'google' not in href:
                print(f"  aria={str(aria)[:45]!r} href={str(href)[:55]!r}")
        await b.close()
asyncio.run(main())
