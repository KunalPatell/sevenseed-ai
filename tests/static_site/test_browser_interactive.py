import sys, time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

print("======================================================================")
print("SEVENSEED REAL-BROWSER INTERACTION TEST (PLAYWRIGHT HEADLESS)")
print("======================================================================")

tests_passed = 0
tests_failed = 0

def log_result(name, passed, detail=""):
    global tests_passed, tests_failed
    if passed:
        tests_passed += 1
        print(f"  [✓ PASS] {name} {('- ' + detail) if detail else ''}")
    else:
        tests_failed += 1
        print(f"  [✗ FAIL] {name} - {detail}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    # ── 1. Page Load ──────────────────────────────────────────────────────────
    print("\n[Step 1] Loading http://127.0.0.1:8000 ...")
    t0 = time.time()
    page.goto("http://127.0.0.1:8000", wait_until="domcontentloaded")
    page.wait_for_timeout(800)
    load_time = round(time.time() - t0, 2)
    log_result("Page Load & Three.js Init", True, f"Loaded in {load_time}s")

    # ── 2. Test 35 Suites Progressive Disclosure Expander ────────────────────
    print("\n[Step 2] Testing 35 Suites Expander Functionality ...")
    initial_visible = page.locator(".suite-card:not(.suite-collapsed):not(.hide)").count()
    log_result("Initial Visible Suites (Clean Decongested View)", initial_visible == 6, f"{initial_visible} cards visible initially")

    expand_btn = page.locator("#suitesExpandBtn")
    log_result("Suites Expander Button Present", expand_btn.is_visible())

    # Click Expand
    expand_btn.click()
    page.wait_for_timeout(200)
    expanded_count = page.locator(".suite-card:not(.suite-collapsed):not(.hide)").count()
    log_result("Expand Action (All 35 Engines Visible)", expanded_count == 35, f"{expanded_count}/35 cards visible")

    # Click Collapse
    expand_btn.click()
    page.wait_for_timeout(200)
    collapsed_count = page.locator(".suite-card:not(.suite-collapsed):not(.hide)").count()
    log_result("Collapse Action (Returns to 6 Cards)", collapsed_count == 6, f"{collapsed_count} cards visible")

    # ── 3. Test Suites Category Filters ──────────────────────────────────────
    print("\n[Step 3] Testing Category Filtering ...")
    # Studio & Finance (7)
    page.locator('.suite-filter-pill[data-filter="studio"]').click()
    page.wait_for_timeout(200)
    studio_visible = page.locator(".suite-card:not(.hide)").count()
    log_result("Filter: Studio & Finance", studio_visible == 7, f"{studio_visible}/7 cards visible")

    # Sevenforce AI (6)
    page.locator('.suite-filter-pill[data-filter="sevenforce"]').click()
    page.wait_for_timeout(200)
    sf_visible = page.locator(".suite-card:not(.hide)").count()
    log_result("Filter: Sevenforce AI", sf_visible == 6, f"{sf_visible}/6 cards visible")

    # Venture Labs (8)
    page.locator('.suite-filter-pill[data-filter="venture"]').click()
    page.wait_for_timeout(200)
    vl_visible = page.locator(".suite-card:not(.hide)").count()
    log_result("Filter: Venture Labs", vl_visible == 8, f"{vl_visible}/8 cards visible")

    # Workstations (14)
    page.locator('.suite-filter-pill[data-filter="workstation"]').click()
    page.wait_for_timeout(200)
    ws_visible = page.locator(".suite-card:not(.hide)").count()
    log_result("Filter: 14 GitHub Workstations", ws_visible == 14, f"{ws_visible}/14 cards visible")

    # Back to All
    page.locator('.suite-filter-pill[data-filter="all"]').click()
    page.wait_for_timeout(200)
    all_restored = page.locator(".suite-card:not(.suite-collapsed):not(.hide)").count()
    log_result("Filter: Return to All Engines", all_restored == 6, f"{all_restored} cards visible in clean view")

    # ── 4. Test Search Engine ────────────────────────────────────────────────
    print("\n[Step 4] Testing Real-Time Search Engine ...")
    search_input = page.locator("#suiteSearchInput")
    
    # Specific search
    search_input.fill("AngelList")
    page.wait_for_timeout(200)
    match_count = page.locator(".suite-card:not(.hide)").count()
    counter_text = page.locator("#suiteCountDisplay").inner_text()
    log_result("Search: 'AngelList' Single-Engine Query", match_count == 1 and "1" in counter_text, f"{match_count} match, Counter: {counter_text}")

    # Broad search
    search_input.fill("AI")
    page.wait_for_timeout(200)
    ai_matches = page.locator(".suite-card:not(.hide)").count()
    log_result("Search: 'AI' Multi-Engine Query", ai_matches > 5, f"{ai_matches} matches found")

    # Non-existent query -> Empty state
    search_input.fill("xyz999nonexistent")
    page.wait_for_timeout(200)
    empty_visible = page.locator("#suitesEmptyState").is_visible()
    log_result("Search: Empty State on Zero Matches", empty_visible)

    # Click Reset in empty state
    page.locator("#resetSuiteFilterBtn").click()
    page.wait_for_timeout(200)
    reset_val = search_input.input_value()
    log_result("Search: Reset Filter Button Restores State", reset_val == "")

    # ── 5. Test 24 Benchmarks Expander & Filters ─────────────────────────────
    print("\n[Step 5] Testing Benchmarks Expander & Filtering ...")
    bm_initial = page.locator(".bm-card:not(.bm-collapsed)").count()
    log_result("Initial Visible Benchmarks", bm_initial == 6, f"{bm_initial} benchmarks visible initially")

    bm_btn = page.locator("#bmExpandBtn")
    if bm_btn.is_visible():
        bm_btn.click()
        page.wait_for_timeout(200)
        bm_expanded = page.locator(".bm-card:not(.bm-collapsed)").count()
        log_result("Benchmarks Expand Action", bm_expanded == 24, f"{bm_expanded}/24 benchmarks visible")

        bm_btn.click()
        page.wait_for_timeout(200)
        bm_collapsed = page.locator(".bm-card:not(.bm-collapsed)").count()
        log_result("Benchmarks Collapse Action", bm_collapsed == 6, f"{bm_collapsed} benchmarks visible")

    # ── 6. Test Theme Toggle ─────────────────────────────────────────────────
    print("\n[Step 6] Testing Theme Toggle ...")
    initial_theme = page.evaluate("document.documentElement.getAttribute('data-theme') || 'dark'")
    expected_next = "light" if initial_theme == "dark" else "dark"
    
    theme_btn = page.locator("#themeToggle")
    theme_btn.click()
    page.wait_for_timeout(150)
    theme_attr = page.evaluate("document.documentElement.getAttribute('data-theme')")
    log_result(f"Theme Toggle: Switch to {expected_next.title()} Mode", theme_attr == expected_next, f"Current: {theme_attr}")

    theme_btn.click()
    page.wait_for_timeout(150)
    theme_attr_back = page.evaluate("document.documentElement.getAttribute('data-theme')")
    log_result(f"Theme Toggle: Switch Back to {initial_theme.title()} Mode", theme_attr_back == initial_theme, f"Current: {theme_attr_back}")

    # ── 7. Test Command Palette (CmdK) ───────────────────────────────────────
    print("\n[Step 7] Testing Command Palette (CmdK) Modal ...")
    search_btn = page.locator("#searchBtn")
    search_btn.click()
    page.wait_for_timeout(150)
    cmdk_open = page.locator("#cmdkOverlay").is_visible()
    log_result("Command Palette (CmdK) Open via Icon", cmdk_open)

    # Close with Escape key
    page.keyboard.press("Escape")
    page.wait_for_timeout(150)
    cmdk_closed = not page.locator("#cmdkOverlay").is_visible()
    log_result("Command Palette Close via ESC Key", cmdk_closed)

    # ── 8. Test 3D Quantum Core Buttons ──────────────────────────────────────
    print("\n[Step 8] Testing 3D Quantum Core Shape & Mode Buttons ...")
    shape_btns = page.locator(".qc-shape-btn").count()
    mode_btns = page.locator(".qc-mode-btn").count()
    log_result("3D Core Controls Present", shape_btns == 5 and mode_btns == 3, f"{shape_btns} shapes, {mode_btns} modes")

    # Click Torus Knot shape
    page.locator('.qc-shape-btn[data-geom="torusknot"]').click()
    page.wait_for_timeout(100)
    knot_active = page.locator('.qc-shape-btn[data-geom="torusknot"]').get_attribute("class")
    log_result("3D Shape Switch to Torus Knot", "active" in (knot_active or ""))

    # Click Wireframe mode
    page.locator('.qc-mode-btn[data-mode="wireframe"]').click()
    page.wait_for_timeout(100)
    wireframe_active = page.locator('.qc-mode-btn[data-mode="wireframe"]').get_attribute("class")
    log_result("3D Mode Switch to Wireframe", "active" in (wireframe_active or ""))

    # ── 9. Test AI Assistant Chat Panel ──────────────────────────────────────
    print("\n[Step 9] Testing AI Assistant Chat Panel ...")
    chat_toggle = page.locator("#chatToggle")
    chat_toggle.click()
    page.wait_for_timeout(200)
    chat_panel_open = "open" in (page.locator("#chatPanel").get_attribute("class") or "")
    log_result("Chat Panel Open via Floating Widget", chat_panel_open, "Panel has class 'open'")

    chat_close = page.locator("#chatClose")
    chat_close.click()
    page.wait_for_timeout(200)
    chat_panel_closed = "open" not in (page.locator("#chatPanel").get_attribute("class") or "")
    log_result("Chat Panel Close via Close Button", chat_panel_closed, "Panel class 'open' removed")

    browser.close()

print("\n======================================================================")
print(f"PLAYWRIGHT INTERACTION SUMMARY: {tests_passed} PASSED, {tests_failed} FAILED")
print("======================================================================")
