"""Check Hunter.io and Apollo.io API quota and connectivity."""
import httpx, os

HUNTER_KEY = ""
APOLLO_KEY = ""

for line in open(".env", encoding="utf-8"):
    if line.startswith("HUNTER_API_KEY"):
        HUNTER_KEY = line.split("=", 1)[1].strip()
    if line.startswith("APOLLO_API_KEY"):
        APOLLO_KEY = line.split("=", 1)[1].strip()

print("=== Hunter.io ===")
try:
    r = httpx.get("https://api.hunter.io/v2/account", params={"api_key": HUNTER_KEY}, timeout=8).json()
    s = r.get("data", {}).get("searches", {})
    used = s.get("used", "?")
    avail = s.get("available", "?")
    print(f"  Used: {used}  /  Available: {avail}")
    if str(avail).isdigit() and str(used).isdigit():
        print(f"  Remaining: {int(avail) - int(used)}")
except Exception as e:
    print(f"  Error: {e}")

print("\n=== Apollo.io ===")
try:
    r = httpx.get(
        "https://api.apollo.io/v1/organizations/enrich",
        headers={"X-Api-Key": APOLLO_KEY, "Cache-Control": "no-cache"},
        params={"domain": "zignuts.com"}, timeout=12
    )
    print(f"  Status: {r.status_code}")
    org = r.json().get("organization", {})
    if org:
        print(f"  Test company: {org.get('name')}")
        print(f"  Phone: {org.get('phone')}")
        print(f"  Employees: {org.get('estimated_num_employees')}")
        print(f"  LinkedIn: {org.get('linkedin_url')}")
        print("  Apollo API is WORKING!")
    else:
        print("  Response:", r.text[:200])
except Exception as e:
    print(f"  Error: {e}")
