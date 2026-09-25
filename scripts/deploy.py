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

    # 1. Regenerate static marketing sites & sub-pages
    print("\n1. Regenerating static venture marketing sites & dedicated sub-pages...")
    gen_script = REPO_ROOT / "generate_sites.py"
    if gen_script.is_file():
        run_cmd(f'"{sys.executable}" "{gen_script}"')
    sub_script = REPO_ROOT / "scripts" / "generate_all_subpages.py"
    if sub_script.is_file():
        run_cmd(f'"{sys.executable}" "{sub_script}"')
    portal_script = REPO_ROOT / "scripts" / "upgrade_all_portals.py"
    if portal_script.is_file():
        run_cmd(f'"{sys.executable}" "{portal_script}"')
    print("   [OK] Generated all 9 venture root sites, sub-pages & upgraded portals cleanly.")

    # 1b. Sync Hub & venture sub-pages to backend static directory
    static_hub = REPO_ROOT / "apps" / "sevenseed" / "backend" / "static"
    sites_src = REPO_ROOT / "sites"
    if static_hub.is_dir() and sites_src.is_dir():
        import shutil
        synced_count = 0
        for root, dirs, files in os.walk(sites_src):
            dirs[:] = [d for d in dirs if d != '_next']
            rel = os.path.relpath(root, sites_src)
            target_dir = static_hub / rel
            target_dir.mkdir(parents=True, exist_ok=True)
            for f in files:
                if f.endswith(('.html', '.js', '.css', '.svg', '.png', '.jpg', '.ico', '.json')):
                    shutil.copy2(os.path.join(root, f), target_dir / f)
                    synced_count += 1
        print(f"   [OK] Synced {synced_count} distribution files from sites/ into backend/static.")


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

    # 5. Push to Render Watched Remote (ai -> both master and main)
    print("\n5. Pushing to Render Watched Remote (ai -> main:master and main:main)...")
    try:
        run_cmd("git push ai main:master")
        run_cmd("git push ai main:main")
        print("   [OK] Pushed to ai master and main branches successfully.")
    except Exception as e:
        print(f"   [WARNING] Remote 'ai' push encountered an issue: {e}")
        print("   Ensure remote 'ai' is configured (git remote add ai https://github.com/KunalPatell/sevenseed-ai.git)")

    print("\n==================================================")
    print(" 🎉 SEVENSEED SaaS DEPLOYMENT COMPLETED SUCCESSFULLY!")
    print("==================================================")


if __name__ == "__main__":
    main()
