import urllib.request
import urllib.error

pages = [
    # Hub pages
    "/",
    "/index.html",
    "/ecosystem/",
    "/syndicate-ruv.html",
    "/market-sizing.html",
    "/ventures.html",
    "/pricing.html",
    "/byok.html",
    # Sevenforce
    "/sevenforce/",
    "/sevenforce/employees.html",
    "/sevenforce/workflows.html",
    "/sevenforce/devin-terminal.html",
    "/sevenforce/pricing.html",
    "/sevenforce/growth-teardown.html",
    "/sevenforce/company-intel.html",
    "/sevenforce/flywheel-simulator.html",
    # Comonk
    "/comonk/",
    "/comonk/interview-arena.html",
    "/comonk/salary-insights.html",
    "/comonk/resume-analyzer.html",
    "/comonk/marketing-examples.html",
    "/comonk/job-challenge.html",
    # Comonk-ai mirror
    "/comonk-ai/",
    "/comonk-ai/interview-arena.html",
    "/comonk-ai/salary-insights.html",
    # AVPU
    "/avpu/",
    "/avpu/ai-learning-path.html",
    "/avpu/certifications.html",
    "/avpu/100-day-challenge.html",
    "/avpu/code-lab.html",
    "/avpu/learn-dag.html",
    "/avpu/flashcards.html",
    "/avpu/evervault-lab.html",
    "/avpu/verify.html",
    # Decode Forest Pharmacy
    "/decode-forest-pharmacy/",
    "/decode-forest-pharmacy/interaction-checker.html",
    "/decode-forest-pharmacy/prescription-ocr.html",
    "/decode-forest-pharmacy/medicine-reminders.html",
    "/decode-forest-pharmacy/health-wiki.html",
    "/decode-forest-pharmacy/generic-finder.html",
    # Pharmacy mirror
    "/pharmacy/",
    "/pharmacy/interaction-checker.html",
    "/pharmacy/prescription-ocr.html",
    "/pharmacy/medicine-reminders.html",
    "/pharmacy/health-wiki.html",
    # Breakdown Factor
    "/breakdown-factor/",
    "/breakdown-factor/boq-estimator.html",
    "/breakdown-factor/safety-audit.html",
    "/breakdown-factor/cv-scanner.html",
    # Breakdown mirror
    "/breakdown/",
    "/breakdown/boq-estimator.html",
    "/breakdown/safety-audit.html",
    # AVP Charitable Trust
    "/avp-charitable-trust/",
    "/avp-charitable-trust/impact-tracker.html",
    "/avp-charitable-trust/health-camps.html",
    "/avp-charitable-trust/tax-exemption.html",
    # Trust mirror
    "/trust/",
    "/trust/impact-tracker.html",
    "/trust/health-camps.html",
    # AVP Emart
    "/avp-emart/",
    "/avp-emart/deal-hunter.html",
    "/avp-emart/price-radar.html",
    "/avp-emart/price-tracker.html",
    "/avp-emart/spec-compare.html",
    "/avp-emart/qcommerce.html",
    "/avp-emart/coupon-tester.html",
    "/avp-emart/wishlist.html",
    # Rakshak AI
    "/rakshak-ai/",
    "/rakshak-ai/fir-generator.html",
    "/rakshak-ai/sentinel-vision.html",
    "/rakshak-ai/threat-radar.html",
    # Sevenseed mirror
    "/sevenseed/",
    "/sevenseed/index.html",
    "/sevenseed/ventures.html"
]

base = "http://localhost:8080"
passed = 0
failed = []

for p in pages:
    url = base + p
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        if res.status == 200:
            passed += 1
        else:
            failed.append((p, res.status))
    except urllib.error.HTTPError as e:
        failed.append((p, e.code))
    except Exception as e:
        failed.append((p, str(e)))

print(f"HTTP Test Results: {passed}/{len(pages)} PASSED (200 OK)")
if failed:
    print(f"FAILED Pages ({len(failed)}):")
    for p, status in failed:
        print(f"  [FAIL] {p} -> {status}")
else:
    print("ALL TESTED PAGES ARE SERVING 200 OK WITH ZERO ERRORS!")
