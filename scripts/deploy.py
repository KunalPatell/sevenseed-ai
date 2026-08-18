# -*- coding: utf-8 -*-
"""
Sevenseed SaaS - Automated Dual-Remote Production Deployment Script.

Pushes code changes to BOTH Git remotes:
1. `origin` -> github.com/KunalPatell/sevenseed-platform (GitHub Primary)
2. `ai`     -> github.com/KunalPatell/sevenseed-ai (Render Watched Remote)
"""
import sys
import os
import io
import subprocess
import argparse
from pathlib import Path

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent


def run_cmd(cmd: str, cwd: Path = REPO_ROOT) -> str:
    """Execute shell command and return stdout."""
    print(f"  [RUN] {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"  [ERR] Command failed with exit code {res.returncode}")
        print(f"        Output: {res.stdout.strip()}")
        print(f"        Error:  {res.stderr.strip()}")
        sys.exit(res.returncode)
    return res.stdout.strip()


def main():
    parser = argparse.ArgumentParser(description="Sevenseed Dual-Remote Deployment Script")
    parser.add_argument("-m", "--message", default="Deploy SaaS transformation updates", help="Git commit message")
    parser.add_argument("--dry-run", action="store_true", help="Simulate deployment without pushing to remotes")
    args = parser.parse_args()

    print("==================================================")
    print(" 🚀 SEVENSEED SaaS DUAL-REMOTE DEPLOYMENT")
    print("==================================================")

    # 1. Regenerate static marketing sites
    print("\n1. Regenerating static venture marketing sites...")
    gen_script = REPO_ROOT / "generate_sites.py"
    if gen_script.is_file():
        run_cmd(f'"{sys.executable}" "{gen_script}"')
        print("   [OK] Generated venture sites cleanly.")

    # 2. Stage changes
    print("\n2. Staging Git changes...")
    run_cmd("git add .")

    # 3. Check status & commit
    print("\n3. Committing changes...")
    status_output = run_cmd("git status --porcelain")
    if not status_output:
        print("   [INFO] No new changes to commit.")
    else:
        run_cmd(f'git commit -m "{args.message}"')
        print(f'   [OK] Committed with message: "{args.message}"')

    if args.dry_run:
        print("\n[DRY RUN COMPLETE] Skipping remote git pushes.")
        sys.exit(0)

    # 4. Push to Primary GitHub Remote (origin)
    print("\n4. Pushing to Primary GitHub Remote (origin -> main)...")
    run_cmd("git push origin main")
    print("   [OK] Pushed to origin main successfully.")

    # 5. Push to Render Watched Remote (ai -> master)
    print("\n5. Pushing to Render Watched Remote (ai -> main:master)...")
    try:
        run_cmd("git push ai main:master")
        print("   [OK] Pushed to ai main:master successfully.")
    except Exception as e:
        print(f"   [WARNING] Remote 'ai' push encountered an issue: {e}")
        print("   Ensure remote 'ai' is configured (git remote add ai https://github.com/KunalPatell/sevenseed-ai.git)")

    print("\n==================================================")
    print(" 🎉 SEVENSEED SaaS DEPLOYMENT COMPLETED SUCCESSFULLY!")
    print("==================================================")


if __name__ == "__main__":
    main()
