import httpx, os

KEY = "eCItGCG1bp9yfTex_HPlEQ"

# Test 1: auth health check
print("Test 1: Auth health check")
try:
    r = httpx.get("https://api.apollo.io/v1/auth/health",
                  headers={"X-Api-Key": KEY, "Cache-Control": "no-cache"}, timeout=10)
    print(f"  Status: {r.status_code}")
    print(f"  Body: {r.text[:300]}")
except Exception as e:
    print(f"  Error: {e}")

# Test 2: people search with header auth
print("\nTest 2: People search (X-Api-Key header)")
try:
    r = httpx.post("https://api.apollo.io/api/v1/mixed_people/search",
                   headers={"Content-Type": "application/json", "X-Api-Key": KEY,
                            "Cache-Control": "no-cache"},
                   json={"q_organization_domains": "tcs.com",
                         "person_titles": ["HR", "Recruiter"], "page": 1, "per_page": 3},
                   timeout=15)
    print(f"  Status: {r.status_code}")
    print(f"  Body: {r.text[:400]}")
except Exception as e:
    print(f"  Error: {e}")

# Test 3: people search with api_key in body
print("\nTest 3: People search (api_key in body)")
try:
    r = httpx.post("https://api.apollo.io/v1/mixed_people/search",
                   headers={"Content-Type": "application/json", "Cache-Control": "no-cache"},
                   json={"api_key": KEY, "q_organization_domains": "tcs.com",
                         "person_titles": ["HR"], "page": 1, "per_page": 3},
                   timeout=15)
    print(f"  Status: {r.status_code}")
    print(f"  Body: {r.text[:400]}")
except Exception as e:
    print(f"  Error: {e}")

# Test 4: org enrichment (often allowed on free)
print("\nTest 4: Organization enrichment")
try:
    r = httpx.get("https://api.apollo.io/v1/organizations/enrich",
                  headers={"X-Api-Key": KEY, "Cache-Control": "no-cache"},
                  params={"domain": "tcs.com"}, timeout=12)
    print(f"  Status: {r.status_code}")
    print(f"  Body: {r.text[:300]}")
except Exception as e:
    print(f"  Error: {e}")
