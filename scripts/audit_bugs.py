import os
import sys
import io
import re
import subprocess
import tempfile
from pathlib import Path
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

REPO_ROOT = Path("e:/main/apps/sevenseed")
SITES_DIR = REPO_ROOT / "sites"

print("=" * 60)
print("[AUDIT] COMPREHENSIVE STATIC CODE & ASSET AUDIT")
print("=" * 60)

bugs = []

html_files = [p for p in SITES_DIR.glob("*/*.html") if "_next" not in p.parts]
print(f"Targeting {len(html_files)} top-level venture HTML files (skipping _next/ bundles)...", flush=True)

for html_path in html_files:
    rel_path = html_path.relative_to(REPO_ROOT)
    dir_path = html_path.parent

    try:
        content = html_path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        bugs.append(f"[{rel_path}] Could not read file: {e}")
        continue

    soup = BeautifulSoup(content, "html.parser")

    # 1. Check all elements with ID for duplicate IDs
    all_ids = [tag.get("id") for tag in soup.find_all(id=True)]
    seen_ids = set()
    for el_id in all_ids:
        if el_id in seen_ids:
            bugs.append(f"[{rel_path}] Duplicate ID found: '{el_id}'")
        seen_ids.add(el_id)

    # 2. Check internal links (href)
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:") or href.startswith("javascript:"):
            continue
        if href.startswith("http://") or href.startswith("https://"):
            continue
        if href.startswith("/"):
            # Root path relative to domain
            target = REPO_ROOT / "sites" / href.lstrip("/")
            # Also check if it targets root index or app/
            if not target.exists() and not (REPO_ROOT / href.lstrip("/")).exists():
                # Check if it's an alias like /avpu/app/ or /pharmacy/app/
                if not ("app" in href or href == "/"):
                    bugs.append(f"[{rel_path}] Broken root-relative link: href='{href}' (Target does not exist: {target})")
        else:
            # Relative to current directory
            clean_href = href.split("?")[0].split("#")[0]
            if clean_href:
                target = (dir_path / clean_href).resolve()
                if not target.exists():
                    bugs.append(f"[{rel_path}] Broken relative link: href='{href}' (File not found: {target.name})")

    # 3. Check JS syntax in script tags using node -c
    scripts = soup.find_all("script")
    for i, sc in enumerate(scripts):
        if sc.get("src"):
            src = sc["src"].strip()
            if not src.startswith("http") and not src.startswith("//"):
                target = (dir_path / src).resolve() if not src.startswith("/") else (REPO_ROOT / "sites" / src.lstrip("/"))
                if not target.exists():
                    bugs.append(f"[{rel_path}] Missing script src: '{src}'")
            continue
        
        js_code = sc.string
        if js_code and js_code.strip():
            with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as tf:
                tf.write(js_code)
                tf_name = tf.name
            
            res = subprocess.run(["node", "-c", tf_name], capture_output=True, text=True)
            if res.returncode != 0:
                err_msg = res.stderr.strip().split("\n")[0]
                bugs.append(f"[{rel_path}] JS Syntax Error in script #{i+1}: {err_msg}")
            try:
                os.remove(tf_name)
            except:
                pass

        # 4. Check document.getElementById calls in JS against existing IDs
        if js_code:
            get_id_calls = re.findall(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)', js_code)
            for target_id in get_id_calls:
                if target_id not in seen_ids:
                    # Ignore dynamically generated IDs or conditional elements
                    bugs.append(f"[{rel_path}] JS calls document.getElementById('{target_id}') but element #{target_id} does NOT exist in HTML!")

    # 5. Check inline onclick / onchange handlers
    for tag in soup.find_all(lambda t: any(attr.startswith("on") for attr in t.attrs)):
        for attr, val in tag.attrs.items():
            if attr.startswith("on"):
                func_match = re.match(r'^\s*([a-zA-Z0-9_$]+)\s*\(', val)
                if func_match:
                    func_name = func_match.group(1)
                    # Check if func_name is declared in any script
                    found_func = False
                    for sc in scripts:
                        if sc.string and (f"function {func_name}" in sc.string or f"{func_name} =" in sc.string or f"{func_name}=" in sc.string or f"window.{func_name}" in sc.string):
                            found_func = True
                            break
                    if not found_func and func_name not in ["print", "alert", "confirm", "prompt"]:
                        bugs.append(f"[{rel_path}] Inline handler {attr}='{val}' calls undefined function '{func_name}()'!")

print(f"\nAudit complete. Total issues detected: {len(bugs)}")
print("-" * 60)
for b in bugs:
    print(f"❌ {b}")
print("-" * 60)
