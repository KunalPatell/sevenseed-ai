import os
import re

SITES_DIR = os.path.abspath(r"e:\main\apps\sevenseed\sites")

all_errors = []

for root, dirs, files in os.walk(SITES_DIR):
    for f in files:
        if not f.endswith(".html"):
            continue
        filepath = os.path.join(root, f)
        rel_file = os.path.relpath(filepath, SITES_DIR)
        
        with open(filepath, "r", encoding="utf-8", errors="ignore") as fp:
            html = fp.read()
            
        # 1. Check all href links
        links = re.findall(r'href=["\']([^"\']+)["\']', html)
        for link in links:
            raw = link.strip()
            if not raw or raw.startswith("#") or raw.startswith("javascript:") or raw.startswith("mailto:") or raw.startswith("tel:") or raw.startswith("data:"):
                continue
            if raw.startswith("http://") or raw.startswith("https://"):
                continue
            
            clean = raw.split("?")[0].split("#")[0]
            if not clean:
                continue
                
            if clean == "/":
                target = os.path.join(SITES_DIR, "index.html")
            elif clean.startswith("/"):
                # Relative to SITES_DIR
                target = os.path.join(SITES_DIR, clean.lstrip("/\\"))
            else:
                target = os.path.join(root, clean)
                
            if os.path.isdir(target):
                target = os.path.join(target, "index.html")
                
            if not os.path.exists(target):
                all_errors.append({
                    "file": rel_file,
                    "type": "BROKEN_LINK",
                    "link": raw,
                    "resolved": os.path.relpath(target, SITES_DIR) if os.path.isabs(target) else target
                })
                
        # 2. Check all onclick navigations like location.href = '...'
        onclicks = re.findall(r'location(?:\.href)?\s*=\s*[\'"]([^\'"]+)[\'"]', html)
        for dest in onclicks:
            raw = dest.strip()
            if not raw or raw.startswith("http://") or raw.startswith("https://") or raw.startswith("#"):
                continue
            clean = raw.split("?")[0].split("#")[0]
            if not clean:
                continue
            if clean == "/":
                target = os.path.join(SITES_DIR, "index.html")
            elif clean.startswith("/"):
                target = os.path.join(SITES_DIR, clean.lstrip("/\\"))
            else:
                target = os.path.join(root, clean)
            if os.path.isdir(target):
                target = os.path.join(target, "index.html")
            if not os.path.exists(target):
                all_errors.append({
                    "file": rel_file,
                    "type": "BROKEN_ONCLICK",
                    "link": raw,
                    "resolved": os.path.relpath(target, SITES_DIR) if os.path.isabs(target) else target
                })

print(f"Total Broken Links Found: {len(all_errors)}")
for err in all_errors:
    print(f"[{err['type']}] In {err['file']}: '{err['link']}' -> Missing: '{err['resolved']}'")
