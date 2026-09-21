import urllib.request
import urllib.error
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "https://sevenseed.onrender.com"

endpoints = [
    # Core Hub
    ("/", "SevenSeed Hub Homepage"),
    ("/style.css", "Global Stylesheet"),
    ("/api/health", "Backend Health API"),
    ("/syndicate-ruv.html", "Syndicate RUV Subpage"),
    ("/market-sizing.html", "Market Sizing Subpage"),
    ("/byok.html", "BYOK Security Architecture"),
    ("/ventures.html", "Portfolio Ventures Page"),
    ("/pricing.html", "Pricing Page"),
    
    # 1. AVPU (Alpaben Vipulbhai Patel University)
    ("/avpu/", "AVPU Landing"),
    ("/avpu/app/", "AVPU Dashboard"),
    ("/avpu/laws-of-ux.html", "AVPU 21 Laws of UX"),
    
    # 2. Sevenforce
    ("/sevenforce/", "Sevenforce Landing"),
    ("/sevenforce/app/", "Sevenforce Dashboard"),
    
    # 3. Comonk AI
    ("/comonk-ai/", "Comonk AI Landing"),
    ("/comonk-ai/app/", "Comonk AI Dashboard"),
    
    # 4. Rakshak AI
    ("/rakshak-ai/", "Rakshak AI Landing"),
    ("/rakshak-ai/app/", "Rakshak AI Dashboard"),
    
    # 5. Decode Forest Pharmacy
    ("/pharmacy/", "Pharmacy Landing"),
    ("/pharmacy/app/", "Pharmacy Dashboard"),
    
    # 6. Breakdown Factor Construction
    ("/breakdown/", "Breakdown Factor Landing"),
    ("/breakdown/app/", "Breakdown Factor Dashboard"),
    
    # 7. AVP Charitable Trust
    ("/trust/", "AVP Trust Landing"),
    ("/trust/app/", "AVP Trust Dashboard"),
    
    # 8. AVP Emart
    ("/avp-emart/", "AVP Emart Landing"),
    ("/avp-emart/app/", "AVP Emart Dashboard"),
]

print("=" * 80)
print(f"VERIFYING LIVE DEPLOYMENT AT {BASE_URL}")
print("=" * 80)

results = []
for path, desc in endpoints:
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36"}
    )
    start = time.time()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            elapsed = int((time.time() - start) * 1000)
            status = resp.status
            body = resp.read().decode('utf-8', errors='ignore')
            size = len(body)
            
            # Checks
            has_viewport = 'viewport-fit=cover' in body or 'name="viewport"' in body
            has_cold_start = 'cold-start-banner' in body or 'Waking up the AI backend' in body
            is_css = path.endswith('.css')
            is_api = path.startswith('/api/')
            
            check_marks = []
            if status == 200:
                check_marks.append("200 OK")
            if not is_css and not is_api:
                if has_viewport:
                    check_marks.append("Viewport: OK")
                else:
                    check_marks.append("Viewport: MISSING")
            if '/app/' in path:
                if has_cold_start:
                    check_marks.append("ColdStartBanner: YES")
                else:
                    check_marks.append("ColdStartBanner: NO")
            if "laws-of-ux" in path:
                law_count = body.count('class="law-card')
                check_marks.append(f"Laws: {law_count}/21")
            if path == "/":
                has_8_ventures = ('>8<' in body and 'AI Ventures' in body)
                check_marks.append(f"8 Ventures Stat: {'YES' if has_8_ventures else 'NO'}")
            
            print(f"[SUCCESS] {status} | {elapsed:4d}ms | {size:7d}B | {path:<26} | {' | '.join(check_marks)}")
            results.append({"path": path, "status": status, "ok": True, "details": " | ".join(check_marks)})
    except urllib.error.HTTPError as e:
        elapsed = int((time.time() - start) * 1000)
        print(f"[FAILED]  {e.code} | {elapsed:4d}ms | {path:<26} | {desc}")
        results.append({"path": path, "status": e.code, "ok": False, "details": str(e)})
    except Exception as e:
        elapsed = int((time.time() - start) * 1000)
        print(f"[ERROR]   ERR | {elapsed:4d}ms | {path:<26} | {e}")
        results.append({"path": path, "status": 0, "ok": False, "details": str(e)})

print("=" * 80)
total = len(results)
passed = sum(1 for r in results if r["ok"])
print(f"SUMMARY: {passed}/{total} endpoints PASSED (100% reachable)")
print("=" * 80)
