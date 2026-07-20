#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Run every Sevenseed-group app locally under one command — Sevenseed is the hub.

    cd "My Startups/apps" && python run_all.py

Each brand is an independent FastAPI service (own port/DB). Sevenseed (8001) is the
front door; each app also serves an AI dashboard. Ctrl+C stops them all.
Deploy note: in production each app is hosted separately and the Sevenseed hub links
to each deployed URL (subdomain per brand) — that keeps them isolated + collision-free.
"""
import os
import sys
import subprocess
import signal
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))

APPS = [
    ("comonk",                 8000, "Comonk Technology — AI Career Intelligence", "comonk_backend.py"),
    ("sevenseed",              8001, "Sevenseed — AI Venture Studio (HUB)", "main.py"),
    ("sevenforce",             8002, "Sevenforce — AI Workforce", "main.py"),
    ("avpu",                   8003, "AVPU — AI University", "main.py"),
    ("decode-forest-pharmacy", 8004, "Decode Forest Pharmacy — AI Pharmacy", "main.py"),
    ("breakdown-factor",       8005, "Breakdown Factor — AI Construction", "main.py"),
    ("avp-charitable-trust",   8006, "AVP Trust — AI for Social Impact", "main.py"),
    ("avp-emart",              8007, "AVP Emart — AI Shopping", "main.py"),
]

procs = []


def cleanup(*_a):
    print("\nStopping all apps...")
    for p in procs:
        try:
            p.terminate()
        except Exception:
            pass
    sys.exit(0)


signal.signal(signal.SIGINT, cleanup)
try:
    signal.signal(signal.SIGTERM, cleanup)
except Exception:
    pass

print("=" * 70)
print("  SEVENSEED GROUP -- launching all apps (Sevenseed is the hub)")
print("=" * 70)
started = []
skipped = []
for slug, port, label, main_file in APPS:
    if slug == "comonk":
        backend = os.path.join(HERE, "..", "comonk")
    else:
        backend = os.path.join(HERE, slug, "backend")
        
    if not os.path.isfile(os.path.join(backend, main_file)):
        print(f"  [SKIP]  {slug} -- no {main_file} found")
        skipped.append(slug)
        continue
    env = dict(os.environ, PORT=str(port))
    procs.append(subprocess.Popen([sys.executable, main_file], cwd=backend, env=env))
    dash = "app" if slug == "sevenforce" else "dashboard" if slug != "comonk" else ""
    print(f"  [OK]    {label}")
    print(f"          site:     http://localhost:{port}/")
    if dash:
        print(f"          dashboard: http://localhost:{port}/{dash}")
    started.append((slug, port))

print("=" * 70)
print(f"  Started {len(started)} apps | Skipped {len(skipped)}")
print("  --> Hub: http://localhost:8001/     (Ctrl+C to stop all)")
print("=" * 70)

for p in procs:
    p.wait()
