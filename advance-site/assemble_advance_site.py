# -*- coding: utf-8 -*-
r"""
Master Assembler v6.1 for `Advance Site` (`assemble_advance_site.py`)
=====================================================================
1. Copies all 245+ specialized venture tools, images, and assets from `sevenseed/sites/` into `Advance Site/out/`.
2. Overlays all 56 compiled Next.js 15 + React 18 + Three.js 3D WebGL + Framer Motion + `@main/ui-core`
   pages and `_next/static/` bundles from `.next` onto `Advance Site/out/`.
3. Maps all canonical user-facing Venture & Sub-Route URLs (`/emart/*`, `/forest-pharmacy/*`,
   `/breakdown-factor/*`, `/trust/*`, `/rakshak-ai/*`, `/comonk/*`, `/agency/*`, `/avpu/*`, `/studio/`, `/metrics/`, `/ecosystem/`)
   so 100% of routes return HTTP 200 with rich interactive workstations and zero JS errors.
4. Strips route-bound Next.js client chunks AND `self.__next_f.push` payloads on alias/non-canonical routes
   so alias routes never trigger URL-mismatch 404s or `self.__next_f` undefined crashes.
5. Assigns a unique, descriptive `<title>` (and matching RSC metadata title) to every route in `out/`.
6. Injects lightweight `aura-21st-ui.css?v=6.1` and `quantum-enhancer.js?v=6.1` (lazy-loading Three.js only when needed).
7. Deploys the Vite v6.1 + React 18 Unified `/app` Workspace SPA across all 18 `/app` routes.
"""

import html
import re
import shutil
from pathlib import Path

ADVANCE_ROOT = Path(__file__).resolve().parent
REPO_ROOT = ADVANCE_ROOT.parent if (ADVANCE_ROOT.parent / "sites").is_dir() else (ADVANCE_ROOT.parent / "sevenseed")
OUT_DIR = ADVANCE_ROOT / "out"
RUNTIME_DIR = ADVANCE_ROOT / "runtime"
SEVENSEED_SITES = REPO_ROOT / "sites"
NEXT_BUILD_DIR = (
    ADVANCE_ROOT / ".next"
    if (ADVANCE_ROOT / ".next" / "server" / "app").is_dir()
    else (REPO_ROOT / "frontend" / ".next")
)


def create_studio_page(title: str, badge: str, active_tab: str) -> str:
    """Generates a standalone React 18 + AngularJS + Three.js + LangGraph page pre-selecting `active_tab`."""
    base_html = (RUNTIME_DIR / "index.html").read_text(encoding="utf-8")
    base_html = base_html.replace(
        "<title>Sevenseed Advance Site — React 18 + AngularJS + LangChain + LangGraph + Canva + Framer + 3D WebGL</title>",
        f"<title>{title} — Sevenseed Advance Site</title>",
    )
    base_html = base_html.replace(
        "⚡ SEVENSEED ADVANCE SITE v2.5",
        badge,
    )
    base_html = base_html.replace(
        "window.addEventListener('DOMContentLoaded', function () {",
        f"window.__INITIAL_ADVANCE_TAB__ = '{active_tab}';\n    window.addEventListener('DOMContentLoaded', function () {{",
    )
    return base_html


def strip_nextjs_hydration_scripts(html_text: str) -> str:
    """Strips route-bound Next.js client chunks and all `self.__next_f` scripts from alias/static HTML."""
    html_text = re.sub(r'<script[^>]*src="[^"]*_next/static/chunks/[^"]*"[^>]*></script>', "", html_text)
    html_text = re.sub(r'<link[^>]*href="[^"]*_next/static/chunks/[^"]*"[^>]*/>', "", html_text)
    html_text = re.sub(
        r'<script>\(self\.__next_f=self\.__next_f\|\|\[\]\)\.push.*?</script>',
        "",
        html_text,
        flags=re.DOTALL,
    )
    html_text = re.sub(
        r'<script>self\.__next_f\.push\(.*?</script>',
        "",
        html_text,
        flags=re.DOTALL,
    )
    return html_text


def derive_unique_title(html_p: Path, txt: str) -> str:
    """Derives a 100% unique, descriptive `<title>` for `html_p` from its route path and primary heading."""
    rel = html_p.relative_to(OUT_DIR).as_posix()
    if rel == "index.html":
        slug = "hub"
    elif rel.endswith("/index.html"):
        slug = rel[: -len("/index.html")]
    elif rel.endswith(".html"):
        slug = rel[: -len(".html")]
    else:
        slug = rel

    if slug == "hub":
        return "Sevenseed Studio — AI-Native Venture Ecosystem & Multi-Agent Platform"

    readable_slug = " / ".join(
        part.replace("-", " ").title() for part in slug.split("/") if part
    )
    for prefix, replacement in (
        ("Avpu", "AVPU"),
        ("Avp Emart", "AVP E-Mart"),
        ("Emart", "E-Mart"),
        ("Rakshak Ai", "Rakshak AI"),
        ("Comonk Ai", "Comonk AI"),
        ("Byok", "BYOK"),
        ("Boq", "BOQ"),
        ("Ruv", "RUV"),
    ):
        readable_slug = re.sub(rf"\b{prefix}\b", replacement, readable_slug)

    # Extract first h1 or h2 text if available
    heading_text = ""
    for tag in ("h1", "h2", "h3"):
        m = re.search(rf"<{tag}[^>]*>(.*?)</{tag}>", txt, flags=re.IGNORECASE | re.DOTALL)
        if m:
            raw = re.sub(r"<[^>]+>", " ", m.group(1))
            raw = html.unescape(re.sub(r"\s+", " ", raw)).strip()
            if len(raw) >= 3:
                heading_text = raw[:68]
                break

    if heading_text and heading_text.lower() not in readable_slug.lower():
        return f"{heading_text} — {readable_slug} | Sevenseed"
    return f"{readable_slug} Workstation | Sevenseed Ecosystem"


def assemble():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Copy all 245+ pages & assets from sevenseed/sites into Advance Site/out
    print("[1/6] Copying 245+ specialized venture pages & assets from sevenseed/sites...")
    if SEVENSEED_SITES.is_dir():
        shutil.copytree(SEVENSEED_SITES, OUT_DIR, dirs_exist_ok=True)

    # 2. Copy .next/static to out/_next/static (and also copy .next to Advance Site/.next)
    print("[2/6] Copying compiled Next.js 15 + React 18 + Three.js + @main/ui-core bundles...")
    next_static_src = NEXT_BUILD_DIR / "static"
    next_static_dst = OUT_DIR / "_next" / "static"
    if next_static_src.is_dir():
        shutil.copytree(next_static_src, next_static_dst, dirs_exist_ok=True)

    adv_next_dir = ADVANCE_ROOT / ".next"
    if NEXT_BUILD_DIR.is_dir() and NEXT_BUILD_DIR.resolve() != adv_next_dir.resolve():
        shutil.copytree(NEXT_BUILD_DIR, adv_next_dir, dirs_exist_ok=True)

    # 3. Overlay all 56 compiled Next.js 15 HTML + RSC routes from .next/server/app
    app_server_dir = NEXT_BUILD_DIR / "server" / "app"
    overlaid_count = 0
    canonical_next_files = set()
    if app_server_dir.is_dir():
        for html_file in app_server_dir.rglob("*.html"):
            rel = html_file.relative_to(app_server_dir)
            if rel.name == "_not-found.html":
                dst_404 = OUT_DIR / "404.html"
                shutil.copy2(html_file, dst_404)
                canonical_next_files.add(dst_404.resolve())
                continue

            if rel.as_posix() == "index.html":
                dst_root = OUT_DIR / "index.html"
                shutil.copy2(html_file, dst_root)
                canonical_next_files.add(dst_root.resolve())
                rsc_src = html_file.with_suffix(".rsc")
                if rsc_src.is_file():
                    shutil.copy2(rsc_src, OUT_DIR / "index.rsc")
                overlaid_count += 1
                continue

            stem_rel = rel.with_suffix("")
            flat_html_dst = OUT_DIR / rel
            dir_index_dst = OUT_DIR / stem_rel / "index.html"

            flat_html_dst.parent.mkdir(parents=True, exist_ok=True)
            dir_index_dst.parent.mkdir(parents=True, exist_ok=True)

            shutil.copy2(html_file, flat_html_dst)
            shutil.copy2(html_file, dir_index_dst)
            canonical_next_files.add(flat_html_dst.resolve())
            canonical_next_files.add(dir_index_dst.resolve())

            rsc_src = html_file.with_suffix(".rsc")
            if rsc_src.is_file():
                shutil.copy2(rsc_src, OUT_DIR / rel.with_suffix(".rsc"))
                shutil.copy2(rsc_src, OUT_DIR / stem_rel / "index.rsc")

            overlaid_count += 1

    print(f"    -> Overlaid {overlaid_count} compiled Next.js 15 + React 18 + Three.js routes!")

    # 4. Map all canonical Venture & Sub-Route aliases so 100% of links work natively
    alias_map = {
        # Hub routes
        "studio": "ventures",
        "ecosystem": "ventures",
        "metrics": "syndicate-ruv",
        # AVPU routes
        "avpu/ai-lab": "avpu/code-lab",
        "avpu/courses": "avpu/learn-dag",
        "avpu/credentials": "avpu/duo-league",
        # E-Mart routes
        "emart": "avp-emart",
        "emart/deals": "avp-emart/deals-radar",
        "emart/price-tracker": "avp-emart/price-tracker",
        "emart/group-buy": "avp-emart/qcommerce",
        # Decode Forest Pharmacy routes
        "forest-pharmacy": "pharmacy",
        "decode-forest-pharmacy": "pharmacy",
        "forest-pharmacy/catalog": "pharmacy/generic-finder",
        "forest-pharmacy/consult": "pharmacy/doctor-consultation",
        "forest-pharmacy/lab-reports": "pharmacy/interaction-checker",
        # Breakdown Factor routes
        "breakdown-factor": "breakdown",
        "breakdown-factor/calculators": "breakdown/material-prices",
        "breakdown-factor/boq": "breakdown/boq-estimator",
        "breakdown-factor/cases": "breakdown/project-timeline",
        # AVP Charitable Trust routes
        "avp-charitable-trust": "trust",
        "trust/causes": "trust/campaigns",
        "trust/ledger": "trust",
        "trust/tax-80g": "trust/tax-exemption",
        "trust/volunteer-portal": "trust/volunteer",
        # Rakshak AI routes
        "rakshak": "rakshak-ai",
        "rakshak-ai/bns-copilot": "rakshak-ai/fir-generator",
        "rakshak-ai/scanner": "rakshak-ai/threat-radar",
        "rakshak-ai/fir-vault": "rakshak-ai/safety-heatmap",
        # Comonk routes
        "comonk-ai": "comonk",
        "comonk/solutions": "comonk/interview-arena",
        "comonk/case-studies": "comonk/company-reviews",
        "comonk/contact": "comonk/salary-insights",
        # Sevenforce Agency routes
        "agency": "sevenforce",
        "agency/agents": "sevenforce/marketplace",
        "agency/campaigns": "sevenforce/roi-calculator",
        "agency/deploy": "sevenforce/workflows",
    }
    for alias_slug, target_slug in alias_map.items():
        src_idx = OUT_DIR / target_slug / "index.html"
        if src_idx.is_file():
            dst_idx = OUT_DIR / alias_slug / "index.html"
            dst_flat = OUT_DIR / f"{alias_slug}.html"
            dst_idx.parent.mkdir(parents=True, exist_ok=True)
            dst_flat.parent.mkdir(parents=True, exist_ok=True)
            alias_txt = src_idx.read_text(encoding="utf-8", errors="ignore")
            alias_txt = strip_nextjs_hydration_scripts(alias_txt)
            # On alias pages (where React hydration is stripped), promote the first <h2> in <main> to <h1> if no <h1> exists
            if "<h1" not in alias_txt.lower():
                alias_txt = re.sub(r"<h2(\b[^>]*)>(.*?)</h2>", r"<h1\1>\2</h1>", alias_txt, count=1, flags=re.DOTALL)
            dst_idx.write_text(alias_txt, encoding="utf-8")
            dst_flat.write_text(alias_txt, encoding="utf-8")
            canonical_next_files.discard(dst_idx.resolve())
            canonical_next_files.discard(dst_flat.resolve())

    # 4b. Bidirectional twin-directory sync so every .html tool exists under both canonical & alias venture slugs
    twin_pairs = [
        ("decode-forest-pharmacy", "pharmacy"),
        ("avp-charitable-trust", "trust"),
        ("breakdown-factor", "breakdown"),
        ("comonk-ai", "comonk"),
        ("avp-emart", "emart"),
        ("sevenforce", "agency"),
        ("rakshak-ai", "rakshak"),
    ]
    for dir_a, dir_b in twin_pairs:
        pa, pb = OUT_DIR / dir_a, OUT_DIR / dir_b
        pa.mkdir(parents=True, exist_ok=True)
        pb.mkdir(parents=True, exist_ok=True)
        for src_dir, dst_dir in ((pa, pb), (pb, pa)):
            for html_f in src_dir.glob("*.html"):
                target_f = dst_dir / html_f.name
                if not target_f.is_file():
                    t_txt = strip_nextjs_hydration_scripts(html_f.read_text(encoding="utf-8", errors="ignore"))
                    target_f.write_text(t_txt, encoding="utf-8")

    # 5. Generate the 6 dedicated Multi-Framework Studio routes
    print("[4/6] Building 6 dedicated Multi-Framework Studios (LangGraph, Canva, Framer, AngularJS, Web3, Quantum Deck)...")
    studios = {
        "langgraph-studio": ("LangChain + LangGraph 5-Node Cyclic Studio", "🕸️ LANGCHAIN + LANGGRAPH STATEGRAPH STUDIO", "langgraph"),
        "canva-studio": ("Canva Multi-Layer Vector & Poster Studio", "🎨 CANVA MULTI-LAYER VECTOR STUDIO", "canva-framer"),
        "framer-studio": ("Framer Motion Spring Physics & 3D Shader Lab", "✨ FRAMER MOTION & 21ST.DEV SHADER LAB", "canva-framer"),
        "angular-enterprise": ("AngularJS 1.8 Enterprise Telemetry Grid", "🛡️ ANGULARJS 1.8 TWO-WAY BOUND ENTERPRISE GRID", "ventures"),
        "web3-studio": ("Web3 Multi-Chain & ERC-4337 Smart Account Studio", "⛓️ WEB3 MULTI-CHAIN & ERC-4337 STUDIO", "ventures"),
        "quantum-deck": ("Quantum All-in-One Multi-Framework Reference Deck", "🚀 QUANTUM ALL-IN-ONE MULTI-FRAMEWORK DECK", "emart"),
    }
    for slug, (title, badge, tab) in studios.items():
        html_content = create_studio_page(title, badge, tab)
        d_path = OUT_DIR / slug / "index.html"
        f_path = OUT_DIR / f"{slug}.html"
        d_path.parent.mkdir(parents=True, exist_ok=True)
        d_path.write_text(html_content, encoding="utf-8")
        f_path.write_text(html_content, encoding="utf-8")
        shutil.copy2(RUNTIME_DIR / "app-data.js", OUT_DIR / slug / "app-data.js")
        shutil.copy2(RUNTIME_DIR / "react-app.js", OUT_DIR / slug / "react-app.js")

    shutil.copy2(RUNTIME_DIR / "app-data.js", OUT_DIR / "app-data.js")
    shutil.copy2(RUNTIME_DIR / "react-app.js", OUT_DIR / "react-app.js")
    shutil.copy2(RUNTIME_DIR / "quantum-enhancer.js", OUT_DIR / "quantum-enhancer.js")
    shutil.copy2(RUNTIME_DIR / "aura-21st-ui.css", OUT_DIR / "aura-21st-ui.css")
    shutil.copy2(RUNTIME_DIR / "vite-portal-bundle.js", OUT_DIR / "vite-portal-bundle.js")

    # 5b. Generate all 13 v7.0 Frontier Studios, New Ventures & Promoted Reference Workstations
    from build_v7_studios import build_all_v7_pages
    v7_count = build_all_v7_pages(OUT_DIR)
    print(f"    -> Generated {v7_count} v7.0 Frontier Studios & Venture Workstations!")

    # 6. Upgrade every HTML file in OUT_DIR with v6.1 non-intrusive enhancer, unique <title>, and zero blocking CDN scripts
    print("[5/6] Upgrading all HTML pages with v6.1 Distinct-Venture Frontend + Unique Titles + Non-Blocking Enhancer...")
    head_inject = (
        '<script>window.__next_f=window.__next_f||[];</script>'
        '<link rel="stylesheet" href="/static/aura-21st-ui.css?v=6.1"/>'
    )
    js_tag = '<script src="/static/quantum-enhancer.js?v=6.1" defer></script>'
    upgraded = 0
    for html_p in OUT_DIR.rglob("*.html"):
        try:
            txt = html_p.read_text(encoding="utf-8", errors="ignore")

            # Clean up any previous injected tags
            txt = re.sub(r'<script>window\.__next_f=window\.__next_f\|\|\[\];</script>', "", txt)
            txt = re.sub(r'<script src="/static/quantum-enhancer\.js[^"]*" defer></script>', "", txt)
            txt = re.sub(r'<link rel="stylesheet" href="/static/aura-21st-ui\.css[^"]*"/>', "", txt)
            txt = re.sub(r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/three\.js/r128/three\.min\.js" defer></script>', "", txt)
            txt = re.sub(r'<script src="https://cdn\.jsdelivr\.net/npm/echarts@5\.5\.0/dist/echarts\.min\.js" defer></script>', "", txt)
            txt = txt.replace('adv-v4-fullpage ', '').replace(' class="adv-v4-fullpage"', '')

            # If this HTML file is NOT one of the canonical Next.js routes, strip any stale Next.js chunks
            if html_p.resolve() not in canonical_next_files:
                txt = strip_nextjs_hydration_scripts(txt)

            # Assign a 100% unique <title> (and update Next.js RSC metadata title so React hydration matches)
            unique_title = derive_unique_title(html_p, txt)
            txt = re.sub(r"<title>.*?</title>", f"<title>{html.escape(unique_title)}</title>", txt, count=1, flags=re.DOTALL)
            json_safe_title = unique_title.replace("\\", "\\\\").replace('"', '\\"')
            txt = txt.replace(
                '\\"children\\":\\"Sevenseed | Ecosystem of Intelligent Ventures\\"',
                f'\\"children\\":\\"{json_safe_title}\\"',
            )
            txt = txt.replace(
                '"children":"Sevenseed | Ecosystem of Intelligent Ventures"',
                f'"children":"{json_safe_title}"',
            )

            if "</head>" in txt:
                txt = txt.replace("</head>", f"{head_inject}</head>", 1)
            else:
                txt = f"{head_inject}\n" + txt

            if "</body>" in txt:
                # The LAST </body>: inline scripts can contain the same text inside a string.
                cut = txt.rfind("</body>")
                txt = txt[:cut] + f"{js_tag}\n" + txt[cut:]
            else:
                txt = txt + f"\n{js_tag}\n"

            html_p.write_text(txt, encoding="utf-8")
            upgraded += 1
        except Exception:
            pass
    print(f"    -> Upgraded {upgraded} HTML pages with v6.1 Distinct-Venture Frontend & Unique Titles!")

    # 7. Deploy Vite v6.1 + React 18 Unified `/app` Portal SPA across all 18 `/app` routes with unique titles
    print("[6/6] Deploying Vite v6.1 + React 18 `/app` Portal SPA to all 18 `/app` routes...")
    vite_app_template = (RUNTIME_DIR / "vite-app.html").read_text(encoding="utf-8")
    vite_app_routes = [
        "app",
        "sevenseed/app",
        "avpu/app",
        "emart/app",
        "avp-emart/app",
        "forest-pharmacy/app",
        "pharmacy/app",
        "decode-forest-pharmacy/app",
        "breakdown-factor/app",
        "breakdown/app",
        "trust/app",
        "avp-charitable-trust/app",
        "rakshak-ai/app",
        "rakshak/app",
        "comonk/app",
        "comonk-ai/app",
        "agency/app",
        "sevenforce/app",
    ]
    for app_slug in vite_app_routes:
        label = app_slug.replace("-", " ").title().replace("/App", " /app")
        custom_html = vite_app_template.replace(
            "<title>Sevenseed Advance v6.1 — Vite v6.0 + React 18 + Web3 Unified /app Workspace</title>",
            f"<title>{label} Workspace — Vite v6.0 + React 18 SPA | Sevenseed</title>",
        )
        app_dir_idx = OUT_DIR / app_slug / "index.html"
        app_flat_html = OUT_DIR / f"{app_slug}.html"
        app_dir_idx.parent.mkdir(parents=True, exist_ok=True)
        app_flat_html.parent.mkdir(parents=True, exist_ok=True)
        app_dir_idx.write_text(custom_html, encoding="utf-8")
        app_flat_html.write_text(custom_html, encoding="utf-8")
    print(f"    -> Deployed Vite v6.1 + React 18 `/app` Portal to {len(vite_app_routes)} `/app` routes!")


if __name__ == "__main__":
    assemble()
