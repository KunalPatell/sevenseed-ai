import os
import re
from urllib.parse import urlparse, unquote

SITES_DIR = r"e:\main\apps\sevenseed\sites"

broken_links = []
broken_assets = []
scanned_files = 0
total_links = 0

for root, dirs, files in os.walk(SITES_DIR):
    for f in files:
        if not f.endswith(".html"):
            continue
        scanned_files += 1
        html_path = os.path.join(root, f)
        rel_html = os.path.relpath(html_path, SITES_DIR)
        
        with open(html_path, "r", encoding="utf-8", errors="ignore") as fp:
            content = fp.read()
            
        # Find hrefs
        hrefs = re.findall(r'href=["\']([^"\']+)["\']', content)
        for h in hrefs:
            h = h.strip()
            if not h or h.startswith("#") or h.startswith("javascript:") or h.startswith("mailto:") or h.startswith("tel:") or h.startswith("data:"):
                continue
            if h.startswith("http://") or h.startswith("https://"):
                continue
                
            total_links += 1
            # Remove query or hash
            clean_h = h.split("?")[0].split("#")[0]
            if not clean_h:
                continue
                
            # If absolute URL starting with /
            if clean_h.startswith("/"):
                target = os.path.join(SITES_DIR, clean_h.lstrip("/\\"))
            else:
                target = os.path.join(root, clean_h)
                
            # If target is directory, look for index.html
            target_file = target
            if os.path.isdir(target):
                target_file = os.path.join(target, "index.html")
                
            if not (os.path.exists(target_file) or os.path.exists(target)):
                broken_links.append((rel_html, h, os.path.relpath(target_file, SITES_DIR)))
                
        # Find src for scripts and images
        srcs = re.findall(r'src=["\']([^"\']+)["\']', content)
        for s in srcs:
            s = s.strip()
            if not s or s.startswith("data:") or s.startswith("http://") or s.startswith("https://") or s.startswith("${"):
                continue
            clean_s = s.split("?")[0].split("#")[0]
            if not clean_s:
                continue
            if clean_s.startswith("/"):
                target = os.path.join(SITES_DIR, clean_s.lstrip("/\\"))
            else:
                target = os.path.join(root, clean_s)
                
            if not os.path.exists(target):
                broken_assets.append((rel_html, s, os.path.relpath(target, SITES_DIR)))

print(f"Scanned {scanned_files} HTML files. Checked {total_links} links.")
print(f"\n--- BROKEN LINKS ({len(broken_links)}) ---")
for src_doc, href, target in broken_links[:60]:
    print(f"File: {src_doc} -> href='{href}' (Resolves to missing: {target})")

print(f"\n--- BROKEN ASSETS ({len(broken_assets)}) ---")
for src_doc, src, target in broken_assets[:60]:
    print(f"File: {src_doc} -> src='{src}' (Resolves to missing: {target})")
