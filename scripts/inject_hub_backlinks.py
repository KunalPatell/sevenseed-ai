import os
import re

HUB_LINK_GHOST = '<a class="btn btn-ghost sm" href="/" style="display:inline-flex; align-items:center; gap:6px; padding:6px 12px; font-size:12px;"><i class="fas fa-seedling" style="color:#10b981;"></i> Sevenseed Hub</a>'
HUB_LINK_BADGE = '<a href="/" style="color:var(--text-2);font-size:12px;text-decoration:none;padding:6px 12px;border-radius:8px;background:var(--bg-2);border:1px solid var(--border);display:inline-flex;align-items:center;gap:6px;"><i class="fas fa-seedling" style="color:#10b981;"></i> Sevenseed Hub</a>'

def update_file(path):
    if not os.path.exists(path):
        print(f"Skipping missing: {path}")
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has link
    if 'Sevenseed Hub' in content or 'href="/"' in content:
        # Check if there is already a direct hub link
        if re.search(r'href=["\'](?:/|/index\.html)["\'][^>]*>.*?Sevenseed', content, re.IGNORECASE | re.DOTALL):
            print(f"Already has hub link: {path}")
            return

    # Handle ecosystem/news-summarizer.html specifically
    if 'news-summarizer.html' in path:
        content = content.replace('href="../sevenseed/index.html"', 'href="/"')
        content = content.replace('Studio Hub', 'Sevenseed Hub')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated news-summarizer: {path}")
        return

    # Case 1: has class="nav-right"
    if '<div class="nav-right">' in content:
        content = content.replace('<div class="nav-right">', f'<div class="nav-right">\n      {HUB_LINK_GHOST}', 1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected into nav-right: {path}")
        return

    # Case 2: has class="nav-actions"
    if '<div class="nav-actions">' in content:
        content = content.replace('<div class="nav-actions">', f'<div class="nav-actions">\n        {HUB_LINK_BADGE}', 1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected into nav-actions: {path}")
        return

    # Case 3: Rakshak style with style="display:flex;align-items:center;gap:8px;"
    target_needle = '<div style="display:flex;align-items:center;gap:8px;">'
    if target_needle in content:
        content = content.replace(target_needle, f'{target_needle}\n      {HUB_LINK_BADGE}', 1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected into flex-actions: {path}")
        return

    print(f"Could not match pattern for: {path}")

files = [
    'sites/avp-emart/smart-compare.html',
    'sites/avp-emart/product-writer.html',
    'sites/avp-emart/deal-radar.html',
    'sites/avpu/gyan-ai-tutor.html',
    'sites/avpu/quiz-generator.html',
    'sites/breakdown-factor/defect-scanner.html',
    'sites/breakdown-factor/site-visit-report.html',
    'sites/comonk/salary-insights.html',
    'sites/comonk/interview-coach.html',
    'sites/comonk/mock-interview.html',
    'sites/decode-forest-pharmacy/symptom-checker.html',
    'sites/decode-forest-pharmacy/medicine-reminder.html',
    'sites/decode-forest-pharmacy/body-map.html',
    'sites/decode-forest-pharmacy/drug-interaction.html',
    'sites/ecosystem/news-summarizer.html',
    'sites/rakshak-ai/threat-radar.html',
    'sites/rakshak-ai/legal-rights.html',
    'sites/rakshak-ai/crime-analytics.html',
    'sites/rakshak-ai/police-station-locator.html',
    'sites/rakshak-ai/cyber-complaint.html',
    'sites/sevenforce/agent-dispatch.html',
]

for f in files:
    update_file(f)
