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

print(f"Checking DOM getElementById in {len(all_html)} HTML files...")

missing_elements = []

for file_path in all_html:
    rel_path = os.path.relpath(file_path, sites_dir)
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    
    # Collect all element IDs present in this HTML
    present_ids = set()
    for el in soup.find_all(id=True):
        present_ids.add(el['id'])

    # Find all inline scripts
    for script in soup.find_all('script'):
        if not script.string:
            continue
        code = script.string
        
        # Find getElementById calls
        matches = re.findall(r'document\.getElementById\([\'"]([a-zA-Z0-9_-]+)[\'"]\)', code)
        for gid in matches:
            # ignore dynamically created or standard framework ids if any
            if gid not in present_ids:
                # check if it is checked with if(document.getElementById(...))
                pattern_safe = rf'if\s*\(\s*document\.getElementById\([\'"]{gid}[\'"]\)\s*\)'
                if not re.search(pattern_safe, code):
                    missing_elements.append((rel_path, gid))

print(f"Total potentially missing getElementById IDs: {len(missing_elements)}")
for r, gid in missing_elements[:30]:
    print(f"  [{r}] Missing ID: '{gid}'")
if len(missing_elements) > 30:
    print(f"  ... and {len(missing_elements) - 30} more")
