"""Require authentication on endpoints that return personal data.

Found 2026-08-03: across six backends, the list endpoints were completely open.
`GET /api/donations` on avp-charitable-trust returned every donor's name, email,
amount and PAN number with no headers at all — confirmed by calling it. The same
pattern exposed prescriptions and medical records on decode-forest-pharmacy, and
grades and attendance on avpu.

The auth machinery already existed in every app (signup/login mint a signed token,
_verify checks it); it was simply never applied to anything but /api/auth/me.

This applies the app's own `require_user` dependency to the endpoints that return
personal, health or financial data. Reference data (health camps, course
catalogues, medicine lists, /api/health, tool metadata) is deliberately left open —
it is not about anybody.

Run once per app. Idempotent: skips routes that already have the dependency.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "apps"

# app -> the route paths whose responses describe an identifiable person.
PROTECT: dict[str, set[str]] = {
    "avp-charitable-trust": {
        "/api/donations", "/api/donors", "/api/pledges", "/api/ledger",
        "/api/ledger/sankey", "/api/volunteers", "/api/reminders",
        "/api/campaigns", "/api/events", "/api/analytics/overview",
    },
    "decode-forest-pharmacy": {
        "/api/records", "/api/prescriptions", "/api/appointments", "/api/refills",
        "/api/interactions-history", "/api/reminders", "/api/analytics/overview",
    },
    "avpu": {
        "/api/grades", "/api/attendance", "/api/reminders",
        "/api/analytics/overview",
    },
    "avp-emart": {
        "/api/orders", "/api/wishlist", "/api/alerts", "/api/searches",
        "/api/loyalty", "/api/subscriptions", "/api/reminders",
        "/api/analytics/overview",
    },
    "breakdown-factor": {
        "/api/projects", "/api/reminders", "/api/analytics/overview",
    },
    "sevenforce": {
        "/api/ideas", "/api/reminders", "/api/analytics/overview",
    },
}

DEP = "_user: dict = Depends(require_user)"


def patch_file(path: Path, paths: set[str]) -> int:
    src = original = path.read_text(encoding="utf-8")
    changed = 0

    # Match: @router.get("/api/x")\ndef name(args):   (args may be empty)
    pattern = re.compile(
        r'(@(?:router|app)\.get\("(?P<path>/api/[^"]+)"\)\s*\n'
        r'def (?P<fn>\w+)\((?P<args>[^)]*)\))'
    )

    def repl(m: re.Match) -> str:
        whole, route, args = m.group(1), m.group("path"), m.group("args")
        if route not in paths:
            return whole
        if "require_user" in args:
            return whole
        nonlocal changed
        changed += 1
        new_args = f"{args.rstrip()}, {DEP}" if args.strip() else DEP
        return whole[: whole.rindex("(" + args + ")")] + f"({new_args})"

    src = pattern.sub(repl, src)
    if src != original:
        path.write_text(src, encoding="utf-8")
    return changed


def ensure_imports(path: Path) -> None:
    """Make sure Depends and HTTPException are imported from fastapi."""
    src = path.read_text(encoding="utf-8")
    m = re.search(r"^from fastapi import (.+)$", src, re.M)
    if not m:
        return
    names = {n.strip() for n in m.group(1).split(",")}
    wanted = names | {"Depends", "Header", "HTTPException"}
    if wanted != names:
        src = src[: m.start()] + f"from fastapi import {', '.join(sorted(wanted))}" + src[m.end():]
        path.write_text(src, encoding="utf-8")


def main() -> int:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    total = 0
    for app, paths in PROTECT.items():
        if only and app != only:
            continue
        feat = ROOT / app / "backend" / "features.py"
        main_py = ROOT / app / "backend" / "main.py"
        n = 0
        for f in (feat, main_py):
            if not f.exists():
                continue
            ensure_imports(f)
            n += patch_file(f, paths)
        print(f"  {app:<24} {n} route(s) protected")
        total += n
    print(f"Total: {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
