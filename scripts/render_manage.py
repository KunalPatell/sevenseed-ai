import urllib.request
import json
import sys

API_KEY = "rnd_pWDbPTS2u5TcPXpp3768mq2NyWG4"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def list_services():
    req = urllib.request.Request("https://api.render.com/v1/services?limit=50", headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def get_env_vars(service_id):
    req = urllib.request.Request(f"https://api.render.com/v1/services/{service_id}/env-vars", headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def update_env_vars(service_id, env_vars_list):
    # env_vars_list is a list of {"envVarKey": "...", "envVarValue": "..."}
    data = json.dumps(env_vars_list).encode()
    req = urllib.request.Request(
        f"https://api.render.com/v1/services/{service_id}/env-vars",
        headers=HEADERS,
        data=data,
        method="PUT"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def trigger_deploy(service_id, clear_cache=False):
    payload = {"clearCache": "clear" if clear_cache else "do_not_clear"}
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"https://api.render.com/v1/services/{service_id}/deploys",
        headers=HEADERS,
        data=data,
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def list_deploys(service_id, limit=5):
    req = urllib.request.Request(
        f"https://api.render.com/v1/services/{service_id}/deploys?limit={limit}",
        headers=HEADERS
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

if __name__ == "__main__":
    sid = sys.argv[1] if len(sys.argv) > 1 else "srv-d9d03pt8nd3s73cbd3og"
    deploys = list_deploys(sid)
    print(f"Recent deploys for {sid}:")
    for d in deploys:
        dep = d.get("deploy", {})
        print(f" - Deploy ID: {dep.get('id')} | Status: {dep.get('status')} | Trigger: {dep.get('trigger')} | Commit: {dep.get('commit', {}).get('id', '')[:7]}")

