import httpx, json

KEY = "eCItGCG1bp9yfTex_HPlEQ"
r = httpx.get("https://api.apollo.io/v1/organizations/enrich",
              headers={"X-Api-Key": KEY, "Cache-Control": "no-cache"},
              params={"domain": "tatvasoft.com"}, timeout=12)
org = r.json().get("organization", {})

fields = ["name", "phone", "primary_phone", "sanitized_phone",
          "linkedin_url", "founded_year", "estimated_num_employees",
          "industry", "city", "state", "country", "street_address",
          "postal_code", "raw_address", "website_url"]
print("APOLLO ORG ENRICH — available fields:")
for f in fields:
    v = org.get(f)
    if isinstance(v, dict):
        v = v.get("sanitized_number") or v.get("number") or str(v)[:60]
    print(f"  {f:28}: {v}")

pp = org.get("primary_phone")
print(f"\n  primary_phone (full): {pp}")
