"""Browser check for the venture sites.

Loads each page against a locally running hub, captures console errors, checks
for horizontal overflow at phone width, and — for the hub — actually fills in
and submits the contact form, then confirms the row landed in SQLite. A build
that compiles proves nothing about any of that.

Usage: python scripts/verify_sites.py <base_url> <db_path>
"""

from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

PAGES = [
    ("hub", "/"),
    ("breakdown", "/breakdown/"),
    ("avpu", "/avpu/"),
    ("avp-emart", "/avp-emart/"),
    ("pharmacy", "/pharmacy/"),
    ("trust", "/trust/"),
    ("sevenforce", "/sevenforce/"),
]

PHONE = {"width": 390, "height": 844}
DESKTOP = {"width": 1440, "height": 900}

# Noise we cannot fix from here: children are lazily started by the
# orchestrator, so their /api probes 503 until the subprocess is warm.
IGNORE = ("503", "Failed to load resource", "favicon")


def check(page, base: str, name: str, path: str, viewport: dict) -> list[str]:
    problems: list[str] = []
    errors: list[str] = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.set_viewport_size(viewport)
    page.goto(base + path, wait_until="networkidle", timeout=45_000)
    page.wait_for_timeout(1200)  # let entry animations settle

    if page.title().strip() == "":
        problems.append("empty <title>")

    doc_w = page.evaluate("document.documentElement.scrollWidth")
    if doc_w > viewport["width"] + 1:
        problems.append(f"horizontal overflow: {doc_w}px wide at {viewport['width']}px")

    real = [e for e in errors if not any(s in e for s in IGNORE)]
    problems.extend(f"console error: {e[:120]}" for e in real[:3])
    return problems


def submit_contact(page, base: str) -> list[str]:
    """Fill the hub's contact form for real and confirm the success state."""
    page.set_viewport_size(DESKTOP)
    page.goto(base + "/", wait_until="networkidle", timeout=45_000)
    page.locator("#contact").scroll_into_view_if_needed()
    page.fill('#contact input[type="text"]:not([aria-hidden="true"])', "Playwright Check")
    page.fill('#contact input[type="email"]', "verify@sevenseed.in")
    page.fill("#contact textarea", "Automated end-to-end check of the contact pipeline.")
    page.click('#contact button[type="submit"]')
    try:
        page.wait_for_selector("#contact p[role=status]", timeout=15_000)
    except Exception:
        return ["contact form: no status message appeared after submit"]
    page.wait_for_timeout(2000)
    text = page.inner_text("#contact p[role=status]")
    if "Thank you" not in text:
        return [f"contact form did not report success: {text!r}"]
    return []


def main() -> int:
    base = sys.argv[1].rstrip("/")
    db_path = sys.argv[2]
    failures: dict[str, list[str]] = {}

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, path in PAGES:
            for label, vp in (("desktop", DESKTOP), ("phone", PHONE)):
                ctx = browser.new_context(viewport=vp)
                page = ctx.new_page()
                try:
                    found = check(page, base, name, path, vp)
                except Exception as e:  # navigation/timeout
                    found = [f"load failed: {type(e).__name__}: {str(e)[:120]}"]
                if found:
                    failures[f"{name} ({label})"] = found
                print(f"  {'FAIL' if found else 'ok  '}  {name:<12} {label}")
                ctx.close()

        ctx = browser.new_context(viewport=DESKTOP)
        page = ctx.new_page()
        found = submit_contact(page, base)
        print(f"  {'FAIL' if found else 'ok  '}  contact form submit")
        if found:
            failures["contact form"] = found
        ctx.close()
        browser.close()

    # The submit above must have produced a real row.
    if Path(db_path).exists():
        con = sqlite3.connect(db_path)
        rows = con.execute(
            "SELECT name, email, subject FROM contact_messages WHERE email='verify@sevenseed.in'"
        ).fetchall()
        print(f"\n  DB rows from the browser submit: {len(rows)}")
        for r in rows:
            print("   ", r)
        if not rows:
            failures["contact persistence"] = ["form reported success but no row was written"]
    else:
        failures["contact persistence"] = [f"db not found at {db_path}"]

    print()
    if failures:
        print("PROBLEMS:")
        for where, items in failures.items():
            for i in items:
                print(f"  - {where}: {i}")
        return 1
    print("All checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
