# -*- coding: utf-8 -*-
import os
import sys
import subprocess

APPS_DIR = os.path.dirname(os.path.abspath(__file__))
APPS = [
    ('comonk', 'comonk', 'comonk_backend', 'app'),
    ('sevenseed', 'sevenseed/backend', 'main', 'app'),
    ('sevenforce', 'sevenforce/backend', 'main', 'app'),
    ('avpu', 'avpu/backend', 'main', 'app'),
    ('decode-forest-pharmacy', 'decode-forest-pharmacy/backend', 'main', 'app'),
    ('breakdown-factor', 'breakdown-factor/backend', 'main', 'app'),
    ('avp-charitable-trust', 'avp-charitable-trust/backend', 'main', 'app'),
    ('avp-emart', 'avp-emart/backend', 'main', 'app'),
    ('rakshak-ai', 'rakshak-ai/backend', 'main', 'app'),
]

print("=" * 60, flush=True)
print("TESTING BACKEND IMPORTS ACROSS ALL 9 APPS", flush=True)
print("=" * 60, flush=True)

for name, sub, mod_name, app_var in APPS:
    print(f"Testing {name}...", end=" ", flush=True)
    cwd = os.path.join(APPS_DIR, sub.replace('/', os.sep))
    code = f"import {mod_name}; app=getattr({mod_name}, '{app_var}', None); print(f'OK {{type(app)}}')"
    cmd = [sys.executable, "-u", "-c", code]
    try:
        res = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=12)
        if res.returncode == 0:
            print(f"[PASS] -> {res.stdout.strip()}", flush=True)
        else:
            print(f"[FAIL] code {res.returncode}", flush=True)
            if res.stderr.strip():
                lines = res.stderr.strip().splitlines()
                print(f"       ERROR: {lines[-1]}", flush=True)
    except subprocess.TimeoutExpired:
        print("[TIMEOUT] (imports took > 12s, typically heavy ML deps)", flush=True)
    except Exception as exc:
        print(f"[ERR] {exc}", flush=True)

print("=" * 60, flush=True)
