import os, sys
import re
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

sites_dir = 'sites'
all_html = []
for root, dirs, files in os.walk(sites_dir):
    for f in files:
        if f.endswith('.html'):
            all_html.append(os.path.join(root, f))

missing_hub = []

for file_path in all_html:
    rel_path = os.path.relpath(file_path, sites_dir)
    # Skip root files and ecosystem if already at root
    if os.path.dirname(rel_path) == '':
        continue
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    
    # Look for any link to root hub in the nav or header
    has_hub = False
    for a in soup.find_all('a', href=True):
        h = a['href'].strip()
        text = a.get_text(strip=True).lower()
        if h in ('/', '/index.html', 'https://sevenseed.onrender.com', 'https://sevenseed.onrender.com/'):
            has_hub = True
            break
        if 'sevenseed' in text or 'hub' in text:
            if h in ('/', '/index.html', '../index.html', '../../index.html', '/ventures.html', '/ecosystem/'):
                has_hub = True
                break

    if not has_hub:
        missing_hub.append(rel_path)

print(f"Total pages missing a Sevenseed Hub backlink: {len(missing_hub)}")
for m in missing_hub:
    print(f"  - {m}")
