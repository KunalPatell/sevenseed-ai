import os
import re
from bs4 import BeautifulSoup

sites_dir = 'sites'
all_html = []
for root, dirs, files in os.walk(sites_dir):
    for f in files:
        if f.endswith('.html'):
            all_html.append(os.path.join(root, f))

print(f"Total HTML files to inspect: {len(all_html)}")

broken_links = []
broken_assets = []

for file_path in all_html:
    rel_file = os.path.relpath(file_path, sites_dir)
    file_dir = os.path.dirname(file_path)
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Check <a> hrefs
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        if not href or href.startswith(('#', 'javascript:', 'mailto:', 'tel:', 'data:', 'http://', 'https://')):
            continue
        clean = href.split('?')[0].split('#')[0]
        if not clean:
            continue
        
        if clean.startswith('/'):
            target = os.path.normpath(os.path.join(sites_dir, clean.lstrip('/\\')))
        else:
            target = os.path.normpath(os.path.join(file_dir, clean))
            
        if os.path.isdir(target):
            index_path = os.path.join(target, 'index.html')
            if not os.path.exists(index_path):
                broken_links.append((rel_file, href, target))
        elif not os.path.exists(target):
            broken_links.append((rel_file, href, target))

    # Check <img>, <script>, <link>
    for tag in soup.find_all(['script', 'img', 'link'], src=True):
        src = tag.get('src', '').strip()
        if not src or src.startswith(('http://', 'https://', 'data:', '//', '${')):
            continue
        clean = src.split('?')[0].split('#')[0]
        if not clean:
            continue
        if clean.startswith('/'):
            target = os.path.normpath(os.path.join(sites_dir, clean.lstrip('/\\')))
        else:
            target = os.path.normpath(os.path.join(file_dir, clean))
        if not os.path.exists(target):
            broken_assets.append((rel_file, src, target))

    # Check <link href> for stylesheets and icons
    for tag in soup.find_all('link', href=True):
        href = tag.get('href', '').strip()
        rel = tag.get('rel', [])
        if isinstance(rel, list):
            rel = ' '.join(rel)
        if 'stylesheet' in rel or 'icon' in rel:
            if not href or href.startswith(('http://', 'https://', 'data:', '//')):
                continue
            clean = href.split('?')[0].split('#')[0]
            if not clean:
                continue
            if clean.startswith('/'):
                target = os.path.normpath(os.path.join(sites_dir, clean.lstrip('/\\')))
            else:
                target = os.path.normpath(os.path.join(file_dir, clean))
            if not os.path.exists(target):
                broken_assets.append((rel_file, href, target))

print(f"Total broken links: {len(broken_links)}")
for r, h, t in broken_links:
    print(f"  [LINK] {r} -> '{h}' (missing: {t})")

print(f"Total broken assets: {len(broken_assets)}")
for r, s, t in broken_assets:
    print(f"  [ASSET] {r} -> '{s}' (missing: {t})")
