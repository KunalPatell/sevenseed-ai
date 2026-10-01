#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
restore_stripped_pages.py
Restore all stripped/placeholder pages to their richest git versions.
Two strategies:
  1. Copy from existing rich alias (faster, same-tree)
  2. Extract from best historic commit via git show
"""

import os
import subprocess
import shutil

ROOT = os.path.dirname(os.path.abspath(__file__))

def git_show(sha, path):
    """Return bytes content of a file at a given commit, or None."""
    r = subprocess.run(
        ['git', 'show', f'{sha}:{path}'],
        capture_output=True, cwd=ROOT
    )
    if r.returncode == 0:
        return r.stdout
    return None

restored = []
skipped = []

# ─────────────────────────────────────────────────────────────────────
# STRATEGY 1: Copy from rich alias that already exists in the working tree
# ─────────────────────────────────────────────────────────────────────
alias_copies = [
    # (source_rich_path, dest_stripped_path)
    # Breakdown-Factor  ← rich versions live in sites/breakdown/
    ('sites/breakdown/boq-estimator.html',        'sites/breakdown-factor/boq-estimator.html'),
    ('sites/breakdown/cv-scanner.html',           'sites/breakdown-factor/cv-scanner.html'),
    ('sites/breakdown/safety-audit.html',         'sites/breakdown-factor/safety-audit.html'),

    # Comonk  ← rich versions live in sites/comonk-ai/
    ('sites/comonk-ai/interview-arena.html',      'sites/comonk/interview-arena.html'),
    ('sites/comonk-ai/resume-analyzer.html',      'sites/comonk/resume-analyzer.html'),

    # Decode-Forest-Pharmacy  ← rich versions live in sites/pharmacy/
    ('sites/pharmacy/hospital-finder.html',       'sites/decode-forest-pharmacy/hospital-finder.html'),
    ('sites/pharmacy/interaction-checker.html',   'sites/decode-forest-pharmacy/interaction-checker.html'),
    ('sites/pharmacy/prescription-ocr.html',      'sites/decode-forest-pharmacy/prescription-ocr.html'),

    # Trust  ← rich impact-tracker lives in sites/trust/ (already 11750 vs avp-charitable-trust 5706)
    ('sites/trust/impact-tracker.html',           'sites/avp-charitable-trust/impact-tracker.html'),
    ('sites/trust/health-camps.html',             'sites/avp-charitable-trust/health-camps.html'),
]

print("=" * 64)
print("STRATEGY 1: Alias copies")
print("=" * 64)
for src, dst in alias_copies:
    src_abs = os.path.join(ROOT, src.replace('/', os.sep))
    dst_abs = os.path.join(ROOT, dst.replace('/', os.sep))
    if not os.path.exists(src_abs):
        print(f"  [SKIP] source not found: {src}")
        skipped.append(dst)
        continue
    src_size = os.path.getsize(src_abs)
    dst_size = os.path.getsize(dst_abs) if os.path.exists(dst_abs) else 0
    if src_size <= dst_size:
        print(f"  [SKIP] already rich enough: {dst} ({dst_size} >= {src_size})")
        skipped.append(dst)
        continue
    shutil.copy2(src_abs, dst_abs)
    print(f"  [OK]   {src} ({src_size}) -> {dst} ({dst_size} -> {src_size})")
    restored.append(dst)

# Also sync into backend/static mirrors
print()
print("STRATEGY 1b: Backend/static mirror sync")
backend_static = os.path.join(ROOT, 'apps', 'sevenseed', 'backend', 'static')
for src, dst in alias_copies:
    src_abs = os.path.join(ROOT, src.replace('/', os.sep))
    # Compute backend-static equivalent of dst
    dst_rel = dst.replace('sites/', '', 1)   # e.g. breakdown-factor/boq-estimator.html
    dst_static = os.path.join(backend_static, dst_rel.replace('/', os.sep))
    if not os.path.exists(src_abs):
        continue
    src_size = os.path.getsize(src_abs)
    dst_size = os.path.getsize(dst_static) if os.path.exists(dst_static) else 0
    if src_size <= dst_size:
        print(f"  [SKIP] static already rich: {dst_rel} ({dst_size})")
        continue
    os.makedirs(os.path.dirname(dst_static), exist_ok=True)
    shutil.copy2(src_abs, dst_static)
    print(f"  [OK]   synced to backend/static/{dst_rel}")

# ─────────────────────────────────────────────────────────────────────
# STRATEGY 2: Restore from best historic git commit
# ─────────────────────────────────────────────────────────────────────
git_restores = [
    # (path_in_repo,                              best_sha)
    ('sites/rakshak-ai/fir-generator.html',       '06f9de8'),
    ('sites/rakshak-ai/sentinel-vision.html',     '06f9de8'),
    ('sites/sevenforce/employees.html',           'ff8ca4e'),
    ('sites/sevenforce/workflows.html',           'f90a05c'),
    ('sites/sevenforce/pricing.html',             'f90a05c'),
    ('sites/avpu/ai-tutor.html',                  '6e43ea4'),
    ('sites/avpu/courses.html',                   '6e43ea4'),
    ('sites/avpu/scholarships.html',              '6e43ea4'),
    ('sites/avp-emart/price-tracker.html',        'ff8ca4e'),
    ('sites/avp-emart/deals-radar.html',          '911833c'),
    ('sites/sevenseed/ventures.html',             '911833c'),
    ('sites/sevenseed/byok.html',                 '911833c'),
    ('sites/sevenseed/pricing.html',              '911833c'),
]

print()
print("=" * 64)
print("STRATEGY 2: Git historic restore")
print("=" * 64)
for path, sha in git_restores:
    abs_path = os.path.join(ROOT, path.replace('/', os.sep))
    current_size = os.path.getsize(abs_path) if os.path.exists(abs_path) else 0
    content = git_show(sha, path)
    if content is None:
        print(f"  [FAIL] git show {sha}:{path} returned nothing")
        skipped.append(path)
        continue
    new_size = len(content)
    if new_size <= current_size:
        print(f"  [SKIP] current already as good or better: {path} ({current_size} >= {new_size})")
        skipped.append(path)
        continue
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    with open(abs_path, 'wb') as f:
        f.write(content)
    print(f"  [OK]   {path}: {current_size} -> {new_size} bytes (from {sha})")
    restored.append(path)

    # Also sync to backend/static
    path_rel = path.replace('sites/', '', 1)
    static_path = os.path.join(backend_static, path_rel.replace('/', os.sep))
    if os.path.exists(static_path):
        static_size = os.path.getsize(static_path)
        if new_size > static_size:
            with open(static_path, 'wb') as f:
                f.write(content)
            print(f"         + synced backend/static/{path_rel}")

# ─────────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────────
print()
print("=" * 64)
print(f"DONE. Restored: {len(restored)}, Skipped: {len(skipped)}")
print("=" * 64)
for r in restored:
    print(f"  + {r}")
