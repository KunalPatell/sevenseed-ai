import os, sys
import re
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

sites_dir = 'sites'
ventures = [
    'sevenforce',
    'comonk',
    'avpu',
    'decode-forest-pharmacy',
    'breakdown-factor',
    'avp-charitable-trust',
    'avp-emart',
    'rakshak-ai'
]

print("=== AUDITING NAVIGATION IN ALL VENTURES ===")

for v in ventures:
    v_dir = os.path.join(sites_dir, v)
    if not os.path.isdir(v_dir):
        continue
    
    html_files = [f for f in os.listdir(v_dir) if f.endswith('.html')]
    print(f"\n==========================================")
    print(f"VENTURE: {v} ({len(html_files)} HTML files)")
    print(f"Files: {', '.join(html_files)}")
    print(f"==========================================")
    
    for f in html_files:
        fp = os.path.join(v_dir, f)
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f_obj:
            content = f_obj.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        nav = soup.find('nav')
        if not nav:
            print(f"  [NO NAV] {f}")
            continue
        
        # Check brand link
        brand = nav.find(['a'], class_=lambda c: c and any(x in c for x in ['logo', 'brand', 'nav-brand', 'nav-logo']))
        brand_href = brand['href'] if (brand and brand.has_attr('href')) else 'None'
        
        # Check links
        links = []
        has_hub_link = False
        has_byok_link = False
        for a in nav.find_all('a', href=True):
            h = a['href']
            text = a.get_text(strip=True)
            links.append(f"{text} -> {h}")
            if h in ('/', '/index.html', '../index.html', '../../index.html') or 'hub' in text.lower() or 'sevenseed' in text.lower():
                has_hub_link = True
            if 'byok' in h.lower() or 'vault' in h.lower() or 'token' in text.lower() or 'api' in text.lower():
                has_byok_link = True
                
        print(f"\n  Page: {f}")
        print(f"    Brand link: {brand_href}")
        print(f"    Has Hub link: {has_hub_link}")
        print(f"    Has BYOK/API link: {has_byok_link}")
        print(f"    Nav links ({len(links)}):")
        for l in links[:10]:
            print(f"      - {l}")
        if len(links) > 10:
            print(f"      ... and {len(links)-10} more")
