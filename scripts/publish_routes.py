#!/usr/bin/env python3
"""Publish selected Next.js routes from a finished `next build` in frontend/.

Same idea as publish_home.py, for any route: Next's chunks are content-hashed, so the
new ones sit beside the old ones and every other page keeps the build it was tested
with. Each route is written to both URL forms the site serves (route/index.html and
route.html), keeping the page's existing <title> (the assembler gave each one a unique
title).

Usage: cd frontend && npm run build && cd .. && python scripts/publish_routes.py avp-emart/deals-radar [more routes]
"""
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEXT = ROOT / "frontend" / ".next"
TARGETS = [ROOT / "apps" / "sevenseed" / "backend" / "static", ROOT / "sites"]
BUILD_TITLE = "Sevenseed | Ecosystem of Intelligent Ventures"
HEAD_TAGS = '<script>window.__next_f=window.__next_f||[];</script><link rel="stylesheet" href="/static/aura-21st-ui.css?v=6.3"/>'
BODY_TAG = '<script src="/static/quantum-enhancer.js?v=6.3" defer></script>\n'

# Pages whose purpose changed when their invented data was removed get a new title
# instead of keeping the old one.
TITLES = {
    "pricing": "Pricing | Sevenseed",
    "trust": "AVP Charitable Trust | Sevenseed",
    "trust/tax-exemption": "80G Tax Saving Calculator — AVP Charitable Trust | Sevenseed",
    "comonk": "Comonk — Career Tools | Sevenseed",
    "comonk/salary-insights": "Take-Home Salary Calculator — Comonk | Sevenseed",
    "comonk/interview-experiences": "Interview Journal — Comonk | Sevenseed",
    "rakshak-ai/fir-generator": "Police Complaint Draft — Rakshak AI | Sevenseed",
    "pharmacy/medicine-reminders": "Medicine Reminders — Decode Forest Pharmacy | Sevenseed",
    "breakdown/project-timeline": "Project Timeline — Breakdown Factor | Sevenseed",
    "avp-emart": "AVP E-Mart — Shopping Tools | Sevenseed",
    "pharmacy": "Decode Forest Pharmacy — Jan Aushadhi Generics & Health Tools — Pharmacy | Sevenseed",
    "breakdown": "Breakdown Factor — CPWD DSR Civil BOQ & Safety Takeoff — Breakdown | Sevenseed",
    "avp-emart/coupon-tester": "Coupon & Cashback Calculator — AVP E-Mart | Sevenseed",
    "sevenforce": "Sevenforce — AI Employees | Sevenseed",
    "sevenforce/devin-terminal": "AI Coding Assistant — Sevenforce | Sevenseed",
    "sevenforce/marketplace": "AI Employees You Can Hire — Sevenforce | Sevenseed",
    "sevenforce/workflows": "How AI Agents Work Together — Sevenforce | Sevenseed",
}


def existing_title(target: Path, route: str) -> str | None:
    if route in TITLES:
        return TITLES[route].replace("&", "&amp;")
    for f in (target / route / "index.html", target / f"{route}.html"):
        if f.is_file():
            m = re.search(r"<title>(.*?)</title>", f.read_text(encoding="utf-8", errors="ignore"), re.S)
            if m:
                return m.group(1)
    return None


def publish(route: str) -> None:
    route = route.strip("/")
    src = NEXT / "server" / "app" / f"{route}.html"
    if not src.is_file():
        sys.exit(f"no built page for {route}: {src}")
    base = src.read_text(encoding="utf-8")
    rsc = NEXT / "server" / "app" / f"{route}.rsc"
    for target in TARGETS:
        html = base
        title = existing_title(target, route)
        if title:
            html = re.sub(r"<title>.*?</title>", lambda _: f"<title>{title}</title>", html, count=1, flags=re.S)
            html = html.replace(BUILD_TITLE, title.replace("&amp;", "&"))
        html = html.replace("</head>", HEAD_TAGS + "</head>", 1)
        html = html.replace("</body>", BODY_TAG + "</body>", 1)
        for out in (target / route / "index.html", target / f"{route}.html"):
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(html, encoding="utf-8", newline="")
        if rsc.is_file():
            shutil.copy2(rsc, target / route / "index.rsc")
            shutil.copy2(rsc, target / f"{route}.rsc")
        print(f"published {route} -> {target}")


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for target in TARGETS:
        shutil.copytree(NEXT / "static", target / "_next" / "static", dirs_exist_ok=True)
    for route in sys.argv[1:]:
        publish(route)


if __name__ == "__main__":
    main()
