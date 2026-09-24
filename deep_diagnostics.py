import os
import re

SITES_DIR = os.path.abspath(r"e:\main\apps\sevenseed\sites")

ventures = [
    "sevenforce",
    "comonk",
    "avpu",
    "decode-forest-pharmacy",
    "breakdown-factor",
    "avp-charitable-trust",
    "avp-emart",
    "rakshak-ai"
]

print("=== CHECKING VENTURES PAGES & NAV LINKS ===")

for v in ventures:
    v_dir = os.path.join(SITES_DIR, v)
    if not os.path.exists(v_dir):
        print(f"[MISSING VENTURE DIR] {v}")
        continue
    pages = [f for f in os.listdir(v_dir) if f.endswith(".html")]
    print(f"\n--- {v} ({len(pages)} HTML pages) ---")
    for p in pages:
        p_path = os.path.join(v_dir, p)
        with open(p_path, "r", encoding="utf-8", errors="ignore") as fp:
            content = fp.read()
        
        # Check nav
        nav_match = re.search(r'<nav[^>]*>(.*?)</nav>', content, re.DOTALL)
        if not nav_match:
            print(f"  [NO <nav>] {p}")
            continue
            
        nav_content = nav_match.group(1)
        nav_links = re.findall(r'href=["\']([^"\']+)["\']', nav_content)
        
        # Check if hub link exists
        has_hub = ('href="/"' in nav_content or 'href="/index.html"' in nav_content or 'href="../"' in nav_content or 'Sevenseed Hub' in nav_content or 'Hub' in nav_content)
        
        # Check validity of each nav link
        broken = []
        for nl in nav_links:
            clean = nl.strip().split("?")[0].split("#")[0]
            if not clean or clean.startswith("http") or clean.startswith("javascript:") or clean.startswith("mailto:"):
                continue
            if clean == "/":
                target = os.path.join(SITES_DIR, "index.html")
            elif clean.startswith("/"):
                target = os.path.join(SITES_DIR, clean.lstrip("/\\"))
            else:
                target = os.path.join(v_dir, clean)
            if os.path.isdir(target):
                target = os.path.join(target, "index.html")
            if not os.path.exists(target):
                broken.append((nl, target))
                
        status = "OK" if not broken else f"BROKEN NAV LINKS: {broken}"
        hub_status = "Has Hub link" if has_hub else "MISSING HUB LINK"
        if broken or not has_hub:
            print(f"  {p}: {status} | {hub_status}")
