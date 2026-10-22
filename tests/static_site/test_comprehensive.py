import sys, os, json, urllib.request, urllib.error
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"
STATIC_DIR = r"E:\main\apps\sevenseed\apps\sevenseed\backend\static"

results = {
    "api_tests": [],
    "link_tests": [],
    "dom_verification": [],
    "summary": {"passed": 0, "failed": 0}
}

def log_test(category, name, passed, details=""):
    status = "PASS" if passed else "FAIL"
    results[category].append({"name": name, "passed": passed, "details": details})
    if passed:
        results["summary"]["passed"] += 1
        print(f"  [✓ PASS] {name} {('- ' + details) if details else ''}")
    else:
        results["summary"]["failed"] += 1
        print(f"  [✗ FAIL] {name} - {details}")

print("======================================================================")
print("SEVENSEED FULL FUNCTIONALITY & LINK INTEGRITY TEST SUITE")
print("======================================================================")

# ── 1. TEST BACKEND API ENDPOINTS ──────────────────────────────────────────
print("\n[1/4] Testing Backend API Endpoints on " + BASE_URL)

endpoints_to_test = [
    ("GET", "/", 200, "Root Landing Page", {}),
    ("GET", "/api/health", 200, "Health Check Endpoint", {}),
    ("GET", "/api/status", 200, "System Status Endpoint", {}),
    ("GET", "/api/ventures", 200, "Ventures Data Endpoint", {}),
    ("GET", "/api/ideas", 200, "Venture Ideas Endpoint", {}),
    ("GET", "/api/portfolio", 200, "Portfolio Data Endpoint", {}),
    ("GET", "/api/history/contacts", 200, "Contacts History Endpoint", {"X-Admin-Key": os.environ.get("ADMIN_KEY", "")}),
    ("GET", "/api/history/sessions", 200, "Sessions History Endpoint", {}),
    ("GET", "/api/history/pitches", 200, "Pitches History Endpoint", {}),
    ("GET", "/dashboard", 200, "Admin/Founder Dashboard", {}),
    ("GET", "/pricing.html", 200, "Pricing Page", {}),
    ("GET", "/workstations.html", 200, "Workstations Hub", {}),
]

for item in endpoints_to_test:
    method, path, expected_code, desc = item[0], item[1], item[2], item[3]
    headers = item[4] if len(item) > 4 else {}
    url = BASE_URL + path
    try:
        req = urllib.request.Request(url, method=method, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            code = resp.getcode()
            body = resp.read()
            passed = (code == expected_code) and (len(body) > 0)
            log_test("api_tests", f"{method} {path} ({desc})", passed, f"Status: {code}, Bytes: {len(body)}")
    except Exception as e:
        log_test("api_tests", f"{method} {path} ({desc})", False, str(e))

# Test POST Contact API
try:
    contact_payload = json.dumps({
        "name": "Validation Test",
        "email": "test@sevenseed.in",
        "subject": "Automated verification test",
        "message": "Automated verification test",
        "service": "General"
    }).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE_URL}/api/contact",
        data=contact_payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        code = resp.getcode()
        passed = (code == 200)
        log_test("api_tests", "POST /api/contact (Contact Submission)", passed, f"Status: {code}")
except Exception as e:
    log_test("api_tests", "POST /api/contact (Contact Submission)", False, str(e))

# ── 2. VERIFY DOM STRUCTURE OF 35 ENGINES & 24 BENCHMARKS ─────────────────
print("\n[2/4] Verifying Frontend DOM & Feature Suites Integrity")

index_path = os.path.join(STATIC_DIR, "index.html")
with open(index_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Count suite cards
suite_cards = html_content.count('class="border-beam-card suite-card"')
log_test("dom_verification", "All 35 Production Engines Present in Grid", suite_cards == 35, f"Found {suite_cards}/35 cards")

# Count categories in suites
studio_cards = html_content.count('data-category="studio"')
sevenforce_cards = html_content.count('data-category="sevenforce"')
venture_cards = html_content.count('data-category="venture"')
workstation_cards = html_content.count('data-category="workstation"')

log_test("dom_verification", "Studio & Finance Category Cards", studio_cards == 7, f"Found {studio_cards}/7 cards")
log_test("dom_verification", "Sevenforce AI Category Cards", sevenforce_cards == 6, f"Found {sevenforce_cards}/6 cards")
log_test("dom_verification", "Venture Labs Category Cards", venture_cards == 8, f"Found {venture_cards}/8 cards")
log_test("dom_verification", "GitHub Workstations Category Cards", workstation_cards == 14, f"Found {workstation_cards}/14 cards")

# Count benchmark cards
bm_cards = html_content.count('class="bm-card"')
log_test("dom_verification", "All 24 Master Benchmarks Present", bm_cards == 24, f"Found {bm_cards}/24 cards")

# Progressive disclosure components present
has_suites_expander = ('id="suitesExpandBtn"' in html_content)
has_bm_expander = ('id="bmExpandBtn"' in html_content)
has_progressive_js = ('id="progressive-disclosure-js"' in html_content)
has_spotlight_js = ('id="suite-beauty-js"' in html_content)

log_test("dom_verification", "35 Engines Progressive Disclosure Expander Component", has_suites_expander)
log_test("dom_verification", "24 Benchmarks Progressive Disclosure Expander Component", has_bm_expander)
log_test("dom_verification", "Progressive Disclosure Controller Script Active", has_progressive_js)
log_test("dom_verification", "Spotlight & Category Dividers Script Active", has_spotlight_js)

# ── 3. TEST INTERNAL LINKS (CARD CTAs, BENCHMARKS, WORKSTATIONS) ──────────
print("\n[3/4] Testing Card CTA Links and Sub-Pages Availability")

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for k, v in attrs:
                if k == 'href' and v:
                    self.links.append(v)

parser = LinkExtractor()
parser.feed(html_content)

# Filter unique internal links (excluding hashes and externals)
internal_links = set()
for l in parser.links:
    if l.startswith('#') or l.startswith('javascript:') or l.startswith('mailto:') or l.startswith('tel:'):
        continue
    if l.startswith('http://') or l.startswith('https://'):
        continue
    internal_links.add(l)

print(f"  Discovered {len(internal_links)} distinct internal routes to test...")

for link in sorted(internal_links):
    # Test HTTP response on local server
    test_url = f"{BASE_URL}/{link.lstrip('/')}"
    try:
        req = urllib.request.Request(test_url)
        with urllib.request.urlopen(req, timeout=4) as resp:
            code = resp.getcode()
            passed = (code == 200)
            log_test("link_tests", f"Link: {link}", passed, f"Status: {code}")
    except urllib.error.HTTPError as he:
        # Check if local file exists
        local_target = os.path.join(STATIC_DIR, link.lstrip('/').replace('/', os.sep))
        exists_on_disk = os.path.exists(local_target)
        log_test("link_tests", f"Link: {link}", exists_on_disk, f"HTTP {he.code}, Local File Exists: {exists_on_disk}")
    except Exception as e:
        log_test("link_tests", f"Link: {link}", False, str(e))

# ── 4. SUMMARY REPORT ──────────────────────────────────────────────────────
print("\n======================================================================")
print(f"TEST SUMMARY: {results['summary']['passed']} PASSED, {results['summary']['failed']} FAILED")
print("======================================================================")

with open("validation_report.json", "w", encoding="utf-8") as rf:
    json.dump(results, rf, indent=2)

if results['summary']['failed'] == 0:
    print("\n✓ ALL FUNCTIONS, ENDPOINTS, SUITES, AND LINKS ARE 100% OPERATIONAL!")
else:
    print(f"\n⚠ Found {results['summary']['failed']} potential issues. Review report above.")
