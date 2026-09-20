# -*- coding: utf-8 -*-
"""
Audit all HTML files in static directory for valid titles, working relative links, and asset integrity.
"""
import re
from pathlib import Path

static_dir = Path(__file__).resolve().parent.parent / "apps" / "sevenseed" / "backend" / "static"
all_html = list(static_dir.rglob("*.html"))
print(f"Total HTML files scanned: {len(all_html)}")

missing_titles = []
broken_links = []
private_links = []

for h in all_html:
    txt = h.read_text(encoding="utf-8", errors="ignore")
    rel_path = str(h.relative_to(static_dir))
    
    # Check title
    m_title = re.search(r"<title>(.*?)</title>", txt, re.IGNORECASE)
    if not m_title or not m_title.group(1).strip():
        missing_titles.append(rel_path)
        
    # Check hrefs
    hrefs = re.findall(r'href=["\']([^"\'#]+?)["\']', txt)
    for hr in hrefs:
        if hr.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
            if "github.com/KunalPatell/sevenseed-platform" in hr:
                private_links.append((rel_path, hr))
            continue
            
        # Internal link check
        hr_clean = hr.split("?")[0].split("#")[0]
        if not hr_clean:
            continue
        if hr_clean.startswith("/"):
            target = static_dir / hr_clean.lstrip("/")
        else:
            target = (h.parent / hr_clean).resolve()
            
        if target.is_dir():
            target = target / "index.html"
        elif not target.suffix and (target.parent / (target.name + ".html")).is_file():
            target = target.parent / (target.name + ".html")
            
        if not target.exists():
            broken_links.append((rel_path, hr, str(target)))

print(f"Missing titles: {len(missing_titles)}")
if missing_titles:
    for m in missing_titles:
        print(f"  {m}")

print(f"Private GitHub links: {len(private_links)}")
if private_links:
    for p, hr in private_links:
        print(f"  {p} -> {hr}")

print(f"Broken relative links: {len(broken_links)}")
if broken_links:
    for src, href, target in broken_links[:25]:
        print(f"  {src} -> {href}")
    if len(broken_links) > 25:
        print(f"  ... and {len(broken_links) - 25} more")
