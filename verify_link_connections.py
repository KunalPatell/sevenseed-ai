import os, sys
import re
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

sites_dir = 'sites'

def check_file(rel_path):
    fp = os.path.join(sites_dir, rel_path)
    if not os.path.exists(fp):
        return None
    with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    links = []
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        text = a.get_text(strip=True) or a.get('aria-label') or 'Link'
        # shorten long text
        if len(text) > 30:
            text = text[:28] + '..'
        links.append((text, href))
    return links

key_pages = {
    "Sevenseed Root Hub": "index.html",
    "Portfolio Showcase": "ventures.html",
    "Ecosystem 3000": "ecosystem/index.html",
    "Syndicate RUV": "syndicate-ruv.html",
    "TAM/SOM Calculator": "market-sizing.html",
    "BYOK Key Vault": "byok.html",
    "Sevenforce": "sevenforce/index.html",
    "Comonk AI": "comonk/index.html",
    "AVPU University": "avpu/index.html",
    "Decode Forest Pharmacy": "decode-forest-pharmacy/index.html",
    "Breakdown Factor": "breakdown-factor/index.html",
    "AVP Charitable Trust": "avp-charitable-trust/index.html",
    "AVP Emart": "avp-emart/index.html",
    "Rakshak AI": "rakshak-ai/index.html",
}

print("=== VERIFYING DESTINATIONS OF ALL PRIMARY HUBS & VENTURES ===")
for name, rel_path in key_pages.items():
    print(f"\n--- {name} ({rel_path}) ---")
    links = check_file(rel_path)
    if not links:
        print("  [FILE NOT FOUND]")
        continue
    # Show navigation and key destination links
    nav_links = []
    seen = set()
    for text, href in links:
        key = (text, href)
        if key not in seen:
            seen.add(key)
            nav_links.append(key)
    for text, href in nav_links[:15]:
        print(f"  • {text:<28} -> {href}")
    if len(nav_links) > 15:
        print(f"  ... plus {len(nav_links)-15} more links")
