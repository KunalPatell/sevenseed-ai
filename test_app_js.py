import os
import re

SITES_DIR = os.path.abspath(r"e:\main\apps\sevenseed\sites")

app_files = []
for root, dirs, files in os.walk(SITES_DIR):
    if "app.js" in files:
        app_files.append(os.path.join(root, "app.js"))

print(f"Found {len(app_files)} app.js files:")
for af in app_files:
    rel = os.path.relpath(af, SITES_DIR)
    dir_name = os.path.dirname(af)
    html_files = [f for f in os.listdir(dir_name) if f.endswith(".html")]
    
    with open(af, "r", encoding="utf-8", errors="ignore") as fp:
        js = fp.read()
        
    # Check for direct calls on getElementById without null guard
    calls = re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)\.(addEventListener|onclick|value|innerText|innerHTML|style|classList)", js)
    unprotected = set()
    for cid, meth in calls:
        # Check if protected by if (document.getElementById(...)) or if (el)
        # Search for pattern: var el = ... if (el)
        # If it's a raw call:
        raw_call = f"document.getElementById('{cid}').{meth}"
        raw_call2 = f'document.getElementById("{cid}").{meth}'
        if raw_call in js or raw_call2 in js:
            unprotected.add((cid, meth))
            
    if unprotected:
        print(f"  {rel}: Unprotected getElementById calls: {unprotected}")
