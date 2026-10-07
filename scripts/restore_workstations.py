import os
import json
import subprocess

REPO = r"e:\main\apps\sevenseed"
SITES = os.path.join(REPO, "sites")
transcript_path = r"C:\Users\Capermint\.gemini\antigravity-ide\brain\0474d40e-1f77-4986-96a4-4787690e1d17\.system_generated\logs\transcript_full.jsonl"

# 1. Restore from git HEAD~1
head_files = [
    "sites/avp-charitable-trust/tax-exemption.html",
    "sites/avpu/learn-dag.html",
    "sites/breakdown-factor/boq-estimator.html",
    "sites/breakdown/boq-estimator.html",
    "sites/rakshak-ai/threat-radar.html",
    "sites/sevenforce/devin-terminal.html",
    "sites/trust/tax-exemption.html"
]

for hf in head_files:
    full_path = os.path.join(REPO, hf)
    res = subprocess.run(["git", "show", f"HEAD~1:{hf}"], cwd=REPO, capture_output=True, text=True, encoding="utf-8")
    if res.returncode == 0 and len(res.stdout) > 500:
        content = res.stdout.replace('href="byok.html"', 'href="/byok.html"')
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Restored from git: {hf} ({len(content)} bytes)")
    else:
        print(f"Error restoring {hf}: {res.stderr}")

# 2. Restore from transcript
targets = ["mock-interview.html", "drug-interaction.html", "deal-radar.html"]
contents = {}

with open(transcript_path, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if "write_to_file" not in line:
            continue
        try:
            d = json.loads(line)
        except:
            continue
        for c in d.get("tool_calls", []):
            args = c.get("function", {}).get("arguments") or c.get("args") or {}
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except:
                    continue
            tf = args.get("TargetFile", "")
            cc = args.get("CodeContent", "")
            for t in targets:
                if t in tf and len(cc) > 500:
                    if t not in contents or len(cc) > len(contents[t]):
                        contents[t] = cc

for t, cc in contents.items():
    fixed = cc.replace('href="byok.html"', 'href="/byok.html"')
    if t == "deal-radar.html":
        dest = os.path.join(SITES, "avp-emart", "deal-radar.html")
        with open(dest, "w", encoding="utf-8") as f:
            f.write(fixed)
        print(f"Restored {dest} ({len(fixed)} bytes)")
    elif t == "mock-interview.html":
        for sub in ["comonk", "comonk-ai"]:
            dest = os.path.join(SITES, sub, "mock-interview.html")
            with open(dest, "w", encoding="utf-8") as f:
                f.write(fixed)
            print(f"Restored {dest} ({len(fixed)} bytes)")
    elif t == "drug-interaction.html":
        for sub in ["decode-forest-pharmacy", "pharmacy"]:
            dest = os.path.join(SITES, sub, "drug-interaction.html")
            with open(dest, "w", encoding="utf-8") as f:
                f.write(fixed)
            print(f"Restored {dest} ({len(fixed)} bytes)")

print("\nRestoration finished!")
