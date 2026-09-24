# -*- coding: utf-8 -*-
import os
import sys
import time
import subprocess
import urllib.request
import urllib.error

HUB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sevenseed", "backend")
PORT = 8001

print(f"Starting Sevenseed Hub on port {PORT}...")
env = dict(os.environ, PORT=str(PORT))
proc = subprocess.Popen([sys.executable, "main.py"], cwd=HUB_DIR, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

try:
    # Wait for server to bind
    ready = False
    for attempt in range(25):
        time.sleep(1)
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/api/health", timeout=2) as resp:
                if resp.status == 200:
                    ready = True
                    print(f"Hub ready in {attempt+1}s!")
                    break
        except Exception:
            pass

    if not ready:
        print("[FAIL] Hub did not start in 25s")
        out, err = proc.communicate(timeout=2)
        print("STDOUT:", out[-500:])
        print("STDERR:", err[-500:])
        sys.exit(1)

    # Test key endpoints
    endpoints = [
        ("/", 200, "Root landing page"),
        ("/byok.html", 200, "BYOK page"),
        ("/pricing.html", 200, "Pricing page"),
        ("/ventures.html", 200, "Ventures page"),
        ("/api/health", 200, "Health API"),
        ("/api/ventures", 200, "Ventures API"),
        ("/api/ideas", 200, "Ideas API"),
        ("/dashboard", 200, "Dashboard redirect to /app/"),
        ("/sevenforce/", 200, "Sevenforce mounted static"),
        ("/avpu/", 200, "AVPU mounted static"),
        ("/pharmacy/", 200, "Decode Forest Pharmacy mounted static"),
        ("/breakdown/", 200, "Breakdown Factor mounted static"),
        ("/trust/", 200, "AVP Trust mounted static"),
        ("/avp-emart/", 200, "AVP Emart mounted static"),
        ("/rakshak-ai/", 200, "Rakshak AI mounted static"),
        ("/comonk/", 200, "Comonk mounted static"),
    ]

    print("\nVerifying Hub Routes:")
    print("-" * 65)
    passed = 0
    for path, exp_code, desc in endpoints:
        url = f"http://127.0.0.1:{PORT}{path}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "HubTester/1.0"})
            with urllib.request.urlopen(req, timeout=5) as r:
                code = r.status
                if code == exp_code:
                    print(f"[PASS] {code} {path:30} ({desc})")
                    passed += 1
                else:
                    print(f"[FAIL] {code} (expected {exp_code}) {path:30}")
        except urllib.error.HTTPError as e:
            if e.code == exp_code:
                print(f"[PASS] {e.code} {path:30} ({desc})")
                passed += 1
            else:
                print(f"[FAIL] HTTP {e.code} {path:30} ({desc})")
        except Exception as exc:
            print(f"[ERR ] {path:30} -> {exc}")

    print("-" * 65)
    print(f"Summary: {passed}/{len(endpoints)} passed.")

finally:
    print("Terminating Hub process...")
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except Exception:
        proc.kill()
    print("Hub stopped.")
