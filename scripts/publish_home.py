#!/usr/bin/env python3
"""Publish only the hub homepage from a finished `next build` in frontend/.

Why not re-run the full assembler: it rewrites all 1,200+ generated pages. Next's
chunks are content-hashed, so new ones can sit beside the old ones. Every other page
keeps the build it was tested with, and navigating between builds falls back to a
normal page load because the build IDs differ.

Usage: cd frontend && npm run build && cd .. && python scripts/publish_home.py
"""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEXT = ROOT / "frontend" / ".next"
MEDIA = ROOT / "frontend" / "public" / "media"
TARGETS = [ROOT / "apps" / "sevenseed" / "backend" / "static", ROOT / "sites"]

TITLE = "Sevenseed Studio — AI-Native Venture Ecosystem & Multi-Agent Platform"
BUILD_TITLE = "Sevenseed | Ecosystem of Intelligent Ventures"
# Same tags the assembler adds to every page (advance-site/assemble_advance_site.py).
HEAD_TAGS = '<script>window.__next_f=window.__next_f||[];</script><link rel="stylesheet" href="/static/aura-21st-ui.css?v=6.3"/>'
BODY_TAG = '<script src="/static/quantum-enhancer.js?v=6.3" defer></script>\n'


def build_html() -> str:
    html = (NEXT / "server" / "app" / "index.html").read_text(encoding="utf-8")
    html = re.sub(r"<title>.*?</title>", f"<title>{TITLE.replace('&', '&amp;')}</title>", html, count=1, flags=re.S)
    html = html.replace(BUILD_TITLE, TITLE)
    html = html.replace("</head>", HEAD_TAGS + "</head>", 1)
    return html.replace("</body>", BODY_TAG + "</body>", 1)


def main() -> None:
    html = build_html()
    rsc = NEXT / "server" / "app" / "index.rsc"
    for target in TARGETS:
        (target / "index.html").write_text(html, encoding="utf-8", newline="")
        if rsc.exists():
            shutil.copy2(rsc, target / "index.rsc")
        shutil.copytree(NEXT / "static", target / "_next" / "static", dirs_exist_ok=True)
        shutil.copytree(MEDIA, target / "media", dirs_exist_ok=True)
        print(f"published homepage -> {target}")


if __name__ == "__main__":
    main()
