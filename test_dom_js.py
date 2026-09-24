import os
import re

SITES_DIR = os.path.abspath(r"e:\main\apps\sevenseed\sites")

dom_issues = []

for root, dirs, files in os.walk(SITES_DIR):
    for f in files:
        if not f.endswith(".html"):
            continue
        filepath = os.path.join(root, f)
        rel_file = os.path.relpath(filepath, SITES_DIR)
        
        with open(filepath, "r", encoding="utf-8", errors="ignore") as fp:
            html = fp.read()
            
        # Collect all IDs defined in the HTML
        ids_in_html = set(re.findall(r'id=["\']([^"\']+)["\']', html))
        
        # Check inline scripts for getElementById calls
        inline_scripts = re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>', html, re.DOTALL)
        for s in inline_scripts:
            # find document.getElementById('...')
            get_ids = re.findall(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)', s)
            for gid in get_ids:
                # Check if it does addEventListener without checking existence
                # e.g. document.getElementById('gid').addEventListener
                dangerous_pattern = rf"document\.getElementById\(['\"]{re.escape(gid)}['\"]\)\.addEventListener"
                if re.search(dangerous_pattern, s):
                    if gid not in ids_in_html:
                        dom_issues.append({
                            "file": rel_file,
                            "type": "NULL_LISTENER",
                            "id": gid,
                            "desc": f"document.getElementById('{gid}').addEventListener called without checking if #{gid} exists in HTML"
                        })
                # Check simple document.getElementById('gid').value / innerText / innerHTML without check
                dangerous_prop = rf"document\.getElementById\(['\"]{re.escape(gid)}['\"]\)\.(?:value|innerText|innerHTML|style|classList|textContent)\b"
                if re.search(dangerous_prop, s):
                    if gid not in ids_in_html:
                        dom_issues.append({
                            "file": rel_file,
                            "type": "NULL_DEREFERENCE",
                            "id": gid,
                            "desc": f"document.getElementById('{gid}').... called but #{gid} does not exist in HTML"
                        })

print(f"Total DOM De-referencing Issues: {len(dom_issues)}")
for iss in dom_issues:
    print(f"[{iss['type']}] In {iss['file']}: #{iss['id']} -> {iss['desc']}")
