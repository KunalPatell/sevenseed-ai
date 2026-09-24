import os
import re

SITES_DIR = r"e:\main\apps\sevenseed\sites"

pattern = re.compile(r'href=["\']([^"\']+)["\']')
links_summary = {}

for root, dirs, files in os.walk(SITES_DIR):
    for f in files:
        if not f.endswith(".html"):
            continue
        filepath = os.path.join(root, f)
        rel_path = os.path.relpath(filepath, SITES_DIR)
        with open(filepath, "r", encoding="utf-8", errors="ignore") as fp:
            content = fp.read()
        matches = pattern.findall(content)
        for m in matches:
            if any(k in m for k in ['pharmacy', 'breakdown', 'comonk', 'trust', 'sevenforce', 'avpu', 'avp-emart', 'rakshak']):
                links_summary.setdefault(m, []).append(rel_path)

print("--- COMMON VENTURE LINKS USAGE ---")
for lk, srcs in sorted(links_summary.items()):
    print(f"{lk} -> referenced in {len(srcs)} files (e.g. {srcs[0]})")
