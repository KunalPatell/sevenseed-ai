# Implementation Plan: Sevenseed Platform Features Round 2

## Overview

Implement 6 new standalone feature pages, 5 deep improvements to existing pages, a cross-venture cold-start banner component, and print/export support across data pages. All work is pure HTML + CSS + vanilla JS — no build step. Tasks are ordered so each builds on the last, and the site_builder nav registrations are always paired with the corresponding page creation.

---

## Tasks

- [x] 1. Implement Symptom Checker page (Decode Forest Pharmacy)
  - [x] 1.1 Create `sites/decode-forest-pharmacy/symptom-checker.html` with full triage engine
    - Build the symptom input form (textarea + submit button) with inline validation (Requirement 1.6)
    - Implement the `TRIAGE_DB` keyword lookup table with ≥ 20 symptom entries covering Emergency / See Doctor / Home Care levels
    - Implement the `triage(symptomsText)` function that tokenises input, resolves highest urgency, merges conditions and DO/DON'T lists (Design: Triage Engine)
    - Render urgency badge, condition suggestions (≥ 2), DO list (≥ 3 items), DON'T list (≥ 3 items) on submit
    - Show "Find Nearest Hospital" CTA linking to `hospital-finder.html` only when urgency is Emergency (Requirement 1.5)
    - Include `@media print` block hiding nav, form, and non-result content (Requirements 1.7, 13.3)
    - Add a Print button that calls `window.print()` (Requirement 13.1, 13.2)
    - Link to `style.css` and `app.js`; follow existing page structure (preloader pattern from `app.js`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 13.1, 13.2, 13.3_

  - [ ]* 1.2 Write property tests for triage engine
    - **Property 1: Triage urgency is always a valid level** — for any non-empty symptom string, result.level ∈ {Emergency, See Doctor, Home Care}
    - **Property 2: Triage results always contain sufficient output** — conditions.length ≥ 2, doList.length ≥ 3, dontList.length ≥ 3
    - Use fast-check `fc.string({ minLength: 1 })` as the arbitrary
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 1, Property 2`
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 1.3 Register nav link in `site_builder/pharmacy_builder.py`
    - Add `symptom-checker.html` to the nav links section in the builder (so redeploy won't remove it)
    - _Requirements: 1.1_

- [x] 2. Implement Medicine Reminder page (Decode Forest Pharmacy)
  - [x] 2.1 Create/replace `sites/decode-forest-pharmacy/medicine-reminder.html` with full reminder system
    - Build the add-reminder form: name, dose, frequency (select), time (time input), with per-field validation (Requirement 2.6)
    - Implement `loadReminders()` / `saveReminder()` / `deleteReminder()` / `markTaken()` functions using `localStorage` key `ss_pharmacy_reminders` (Design: Reminder Store schema)
    - On page load, call `loadReminders()` and render all stored reminder cards (Requirement 2.3)
    - Each reminder card shows name, dose, frequency, time, a "Mark as Taken" button, and a "Delete" button
    - "Mark as Taken" appends today's ISO date to `takenDates`, re-saves, and applies a visual taken state to the card (Requirement 2.4)
    - "Delete" removes entry from array, re-saves, and removes card from DOM (Requirement 2.7)
    - Implement Notification API opt-in: request permission on first save, schedule a `setTimeout` notification for each reminder's next occurrence (Requirement 2.5)
    - Link to `style.css` and `app.js`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 2.2 Write property tests for reminder store functions
    - **Property 3: Reminder round-trip** — for any valid reminder entry, save then read from mock localStorage returns equivalent object
    - **Property 4: Reminder deletion removes from store** — for any saved set, after delete the item is absent
    - Mock localStorage with a Map-based implementation
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 3, Property 4`
    - _Requirements: 2.2, 2.3, 2.7_

  - [x] 2.3 Register nav link in `site_builder/pharmacy_builder.py`
    - Add `medicine-reminder.html` to the nav links section
    - _Requirements: 2.1_

- [x] 3. Checkpoint — Decode Forest Pharmacy pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement Donation Ledger page (AVP Charitable Trust)
  - [x] 4.1 Create `sites/trust/donation-ledger.html` with animated ledger
    - Define static `DONATIONS` array with ≥ 10 entries (donorName, amount, category, date, status) compiled into the page
    - Render a `<table>` with columns: Donor Name, Amount (₹), Category, Date, Status (Requirement 3.2)
    - Implement `animateCounter(el, target, 1500)` using `requestAnimationFrame`; call on page load (Requirement 3.3)
    - Calculate and render category breakdown (Education / Food Relief / Medical Aid) as animated progress bars with percentage labels; implement `calcProportions(donations)` pure function (Requirement 3.4)
    - For each row, add a "Download 80G Receipt" button; implement `showReceipt(entry)` that populates a hidden `<div id="receipt-overlay">` with donor name, amount, date, PAN reference, 80G certificate statement, then calls `window.print()`; re-hide overlay in `window.onafterprint` (Requirement 3.5)
    - Add "Funds Deployed" section with ≥ 3 project-level progress bars (Requirement 3.6)
    - Include `@media print` CSS block that shows only `#receipt-overlay` and hides all other content (Requirements 3.7, 13.3)
    - Add Print button for the full ledger view (Requirement 13.1, 13.2)
    - Link to `style.css` and `app.js`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 13.1, 13.2, 13.3_

  - [ ]* 4.2 Write property test for category proportion calculation
    - **Property 5: Category proportions sum to 100%** — for any non-empty donations array, sum of proportions ≈ 100 (±0.5)
    - Use `fc.array(fc.record({ amount: fc.integer({min:1}), category: fc.constantFrom('Education','Food','Medical') }), { minLength: 1 })` as arbitrary
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 5`
    - _Requirements: 3.4_

  - [x] 4.3 Register nav link in `site_builder/trust_builder.py`
    - Add `donation-ledger.html` to the trust nav links section
    - _Requirements: 3.1_

- [x] 5. Implement Volunteer Portal page (AVP Charitable Trust)
  - [x] 5.1 Create `sites/trust/volunteer-portal.html` with registration and matching system
    - Build registration form: name (text), email (text), skills (checkboxes: teaching, medical, logistics, tech, admin, fundraising), availability (select), location (text); with per-field validation for name, email, skills (Requirement 4.6)
    - Implement `saveRegistration(data)` / `loadRegistration()` using key `ss_trust_volunteers`; on page load call `loadRegistration()` and pre-fill form fields (Requirements 4.2, 4.7)
    - On successful submit, persist and show a confirmation card (Requirement 4.2)
    - Define static `OPPORTUNITIES` array with ≥ 4 entries (role, requiredSkills[], location, commitmentHours) compiled into the page
    - Implement `matchOpportunities(registeredSkills, opportunities)` — returns opportunities where `requiredSkills.some(s => registeredSkills.includes(s))` (Design: Volunteer Portal; Requirement 4.4)
    - Render all opportunities; highlight matching ones after registration saves
    - "Apply" button: implement `applyToOpportunity(id)` that updates `applications[]` in localStorage and switches card to "Applied — Pending Review" state (Requirement 4.5)
    - Link to `style.css` and `app.js`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 5.2 Write property tests for volunteer store and skill matching
    - **Property 6: Volunteer skill-matching correctness** — for any skills set and opportunity catalogue, highlighted set equals intersection-matching set exactly
    - **Property 7: Volunteer registration round-trip** — for any valid registration, save to mock localStorage then loadRegistration() returns equivalent object
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 6, Property 7`
    - _Requirements: 4.2, 4.4, 4.7_

  - [x] 5.3 Register nav link in `site_builder/trust_builder.py`
    - Add `volunteer-portal.html` to the trust nav links section
    - _Requirements: 4.1_

- [x] 6. Checkpoint — AVP Charitable Trust pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Build Salary Insights page (Comonk AI) — full replacement
  - [x] 7.1 Create complete `sites/comonk/salary-insights.html` replacing the existing stub
    - Define `SALARY_DB` static lookup (≥ 5 roles × 4 cities × 3 YoE bands with P10/P50/P90 values) compiled into the page (Design: Salary Insights Engine)
    - Define `SKILLS_PREMIUM` map (≥ 8 skills with ₹ increment values)
    - Build input form: role (select), city (select), YoE (select); "Get Insights" button
    - Implement `getSalaryInsights(role, city, yoe)` that returns `{ p10, p50, p90, companies[], skillPremiums[], negotiationScript, yoeCurve[] }`
    - Render P10/P50/P90 salary range display inline without page reload (Requirement 5.8)
    - Draw company pay band SVG: `<svg>` with `<rect>` elements for ≥ 4 companies, labelled (Requirement 5.3)
    - Render skills-to-salary impact table (≥ 5 skills, ₹ premium per skill) (Requirement 5.4)
    - Render negotiation script text block templated with selected role and P50 value (Requirement 5.5)
    - Draw YoE-vs-salary curve SVG: `<polyline>` with computed points from 0–10 YoE (Requirement 5.6)
    - Include `@media print` block and Print button (Requirements 5.7, 13.1, 13.2, 13.3)
    - Link to `style.css` and `app.js`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 13.1, 13.2, 13.3_

  - [x] 7.2 Register updated nav link in `site_builder/comonk_builder.py`
    - Ensure `salary-insights.html` nav link is present (may already exist; verify it links correctly)
    - _Requirements: 5.1_

- [x] 8. Build Resume Scorer page (Comonk AI)
  - [x] 8.1 Create `sites/comonk/resume-scorer.html` with full ATS analysis engine
    - Define `ATS_KEYWORDS` dictionary (technical ≥ 30, soft ≥ 10, action verbs ≥ 20) compiled into page (Design: Resume Scorer Engine)
    - Define `SECTION_PATTERNS` regex map for 5 sections (contact, summary, experience, skills, education)
    - Build input UI: large `<textarea>` for resume paste, "Analyse" button; validation: block if < 50 chars (Requirement 6.6)
    - Implement `atsScore(text)` → number in [0, 100] (Requirement 6.2)
    - Implement `checkSections(text)` → object with 5 boolean fields (Requirement 6.3)
    - Implement `checkFormatting(text)` → checklist of formatting flags (Requirement 6.4)
    - Implement `getImprovements(text)` → array of ≥ 3 before/after suggestion pairs (Requirement 6.5)
    - Render: ATS score gauge/badge, section completeness checklist (✅/❌ per section), formatting checklist, Before/After suggestions panel
    - Include `@media print` block and Print button (Requirements 6.7, 13.1, 13.2, 13.3)
    - Link to `style.css` and `app.js`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 13.1, 13.2, 13.3_

  - [ ]* 8.2 Write property tests for ATS score and section detection
    - **Property 8: ATS score is always in valid range** — for any string, atsScore(s) ∈ [0, 100]
    - **Property 9: Section detection is always boolean** — for any string, each of the 5 section keys in checkSections() is a boolean
    - Use `fc.string()` as arbitrary; run 200 iterations each
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 8, Property 9`
    - _Requirements: 6.2, 6.3_

  - [x] 8.3 Register nav link in `site_builder/comonk_builder.py`
    - Add `resume-scorer.html` to the comonk nav links section
    - _Requirements: 6.1_

- [x] 9. Checkpoint — Comonk AI pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Improve Gyan AI Tutor (avpu/gyan-ai-tutor.html)
  - [x] 10.1 Add localStorage chat history persistence and restoration
    - Wrap message creation in `persistMessage(role, text)` that appends to `ss_gyan_history` in `localStorage`
    - On page load, call `restoreHistory()` that reads `ss_gyan_history` and renders each stored message into `#chatMessages` (do NOT re-trigger Gyan AI responses)
    - Wrap `clearChat()` to also clear the `ss_gyan_history` key
    - _Requirements: 7.1, 7.2_

  - [ ]* 10.2 Write property tests for chat history round-trip
    - **Property 10: Chat history round-trip** — for any sequence of messages saved to mock localStorage, restoreHistory() renders them in original order
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 10`
    - _Requirements: 7.1, 7.2_

  - [x] 10.3 Add "Explain this answer" button to quiz results and topic tracker panel
    - In `showResults()`, for each wrong-answer entry in `quizState.wrongTopics`, add a button `Explain this answer` alongside the weak topic item
    - Implement `explainAnswer(questionText, wrongChoice)` that calls `switchMode('chat', ...)` then sets `chatIn.value` to `"Explain why \"${wrongChoice}\" is wrong for: ${questionText}"` and focuses the input (Requirement 7.4)
    - Add a `topicCounts` object that is updated on each `sendToGyan()` call (extract topic from message using same keyword mapping as `gyanReply`)
    - Render topic progress tracker panel: a `<div id="topicTracker">` listing each topic and its message count, updated in real time (Requirement 7.5)
    - _Requirements: 7.3, 7.4, 7.5_

  - [ ]* 10.4 Write property tests for explain-answer template and topic counter
    - **Property 11: Explain-wrong-answer pre-fill is correctly templated** — for any (question, wrongChoice) pair, the resulting string contains both verbatim
    - **Property 12: Topic tracker count is non-decreasing** — for any topic, count increments by 1 per message; never decreases
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 11, Property 12`
    - _Requirements: 7.4, 7.5_

  - [x] 10.5 Add keyboard shortcuts
    - In the chat input `keydown` handler: `Enter` (without Shift) calls `sendToGyan()` (already partially exists — verify and complete); `Shift+Enter` inserts `\n` and resizes textarea if needed (Requirement 7.6)
    - Add a global `keydown` listener: `Ctrl+/` calls `document.getElementById('chatIn').focus()` (Requirement 7.7)
    - Add Print button to quiz results section; add `@media print` block hiding everything except `.quiz-results` (Requirement 13.1, 13.2, 13.3)
    - _Requirements: 7.6, 7.7, 13.1, 13.2, 13.3_

- [x] 11. Improve Smart Comparator (avp-emart/smart-compare.html)
  - [x] 11.1 Add Wishlist save/load and price-drop alert opt-in
    - Add "Save to Wishlist" button to each store row in the price matrix; implement `saveToWishlist(product)` using `ss_emart_wishlist` schema (Design: Wishlist & Alert Store; Requirement 8.1)
    - Implement `loadWishlist()` and render the Wishlist panel on page load with Remove buttons (Requirement 8.2)
    - Implement `removeFromWishlist(name, store)` that removes from localStorage and the panel (Requirement 8.3)
    - Add "Set Price Alert" button per row; implement `saveAlert(product)` using `ss_emart_alerts` (Requirement 8.4)
    - On page load, call `loadAlerts()` and apply "Price Alert Active" badge to matching product rows (Requirement 8.5)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 11.2 Write property tests for wishlist and alert store
    - **Property 13: Wishlist round-trip** — save entry to mock localStorage, loadWishlist() returns it
    - **Property 14: Wishlist removal is complete** — after removeFromWishlist(), item absent from storage
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 13, Property 14`
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 11.3 Animate SVG trend chart
    - On the existing SVG `<polyline>` (or `<path>`) element, calculate `stroke-dasharray` = total path length via `getTotalLength()`, set `stroke-dashoffset` = same value, then animate to 0 via CSS keyframe `@keyframes drawLine` with duration 1.2s ease (Requirement 8.6)
    - Call animation trigger after the chart is rendered/injected into the DOM
    - _Requirements: 8.6_

- [x] 12. Improve Agent Dispatch Console (sevenforce/agent-dispatch.html)
  - [x] 12.1 Add typewriter output streaming
    - After the existing terminal simulation completes, pipe the "final output" section through the `typewriter(el, text, onDone)` function (Design: Agent Stats Store) at 50ms/char interval (Requirement 9.1)
    - Ensure the dispatch button is re-enabled in the `onDone` callback
    - _Requirements: 9.1_

  - [x] 12.2 Add "Export as Markdown" download and agent performance stats panel
    - Implement `exportMarkdown()`: collect all `.t-*` spans from `#terminalBody`, format as fenced Markdown code block, create a data URI and programmatically click a hidden `<a>` to download as `<agentName>-<timestamp>.md` (Requirement 9.2)
    - Add "Export as Markdown" button to `.terminal-actions`
    - Define `ss_sevenforce_stats` localStorage schema; implement `loadStats()` / `updateStats(agentId, durationMs)` (Design: Agent Stats Store)
    - On page load, call `loadStats()` and render the agent performance stats panel showing tasks completed, avg time, success rate per agent (Requirement 9.3)
    - In the dispatch completion callback, call `updateStats(selectedAgentId, elapsedMs)` (Requirement 9.4)
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ]* 12.3 Write property tests for agent stats counter
    - **Property 15: Agent dispatch counter is monotonically increasing** — for any sequence of N dispatches, stats.tasksCompleted === N
    - Use `fc.integer({ min: 1, max: 50 })` for dispatch count; mock localStorage
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 15`
    - _Requirements: 9.3, 9.4_

  - [x] 12.4 Add Ctrl+Enter keyboard shortcut
    - Add a `keydown` listener on the brief `<textarea>`: when `e.ctrlKey && e.key === 'Enter'`, trigger the dispatch action (Requirement 9.5)
    - _Requirements: 9.5_

- [x] 13. Checkpoint — Improvements to existing pages (part 1) complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Improve Defect Scanner (breakdown/defect-scanner.html)
  - [x] 14.1 Add share-report URL hash encoding and scan history timeline
    - Implement `encodeReport(summary)` → `btoa(JSON.stringify(summary))` and `decodeReport(hash)` → summary object; wrap in try/catch (Design: Scan History & Share)
    - Add "Share Report" button in the results panel; on click: call `encodeReport`, set `window.location.hash`, show a copyable `<input>` with the full URL (Requirement 10.1)
    - On page load: if `window.location.hash` is non-empty, call `decodeReport` and render a read-only results panel from the decoded data (Requirement 10.2)
    - Implement `saveScanHistory(summary)` using `ss_breakdown_history` with max-5 eviction (Design: Scan History schema; Requirement 10.4)
    - Render a severity history timeline panel from `loadScanHistory()` on page load, ordered newest-first (Requirement 10.3)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 14.2 Write property tests for hash round-trip and history length invariant
    - **Property 16: Scan summary URL hash round-trip** — for any scan summary object, decodeReport(encodeReport(s)) produces structurally equivalent object
    - **Property 17: Scan history length invariant** — for any N scans (N ≥ 0), history.length === min(N, 5)
    - Use `fc.record({ defects: fc.array(fc.anything()), severity: fc.constantFrom('Critical','Moderate','Minor'), boq_estimate: fc.integer({min:0}) })` as scan summary arbitrary
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 16, Property 17`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 14.3 Add sample image gallery to empty state
    - Create 3 demo scenario objects in the page script (each with bounding box descriptions, compliance data, BOQ estimate), referenced as `DEMO_SCENARIOS[0..2]`
    - In the empty-state section, add 3 clickable demo photo cards (placeholder images or emoji-based cards)
    - WHEN a demo card is clicked, call `loadDemoScenario(index)` that populates the results panel with the pre-defined scenario data, bypassing the file upload path (Requirement 10.5)
    - _Requirements: 10.5_

- [x] 15. Improve Venture Dashboard (sevenseed/venture-dashboard.html)
  - [x] 15.1 Add search/filter, ecosystem health gauge, and recently visited section
    - Add `data-name` and `data-sector` attributes to each of the 8 venture cards in the HTML
    - Add a filter `<input>` above the grid; wire `input` event to `filterVentures(query)` which toggles `display` on cards within 100ms (Design: Venture Dashboard Patches; Requirement 11.1)
    - Implement the Ecosystem Health gauge: a circular SVG ring showing "8/8" with `stroke-dashoffset` set to represent 100% (Requirement 11.2)
    - Implement `pushRecent(venture)` / `loadRecents()` using `ss_hub_recents` with max-3, newest-first, no-duplicates logic (Design: Venture Dashboard Patches)
    - Wire venture card clicks to call `pushRecent(venture)` before navigating (Requirement 11.3)
    - On page load, call `loadRecents()` and render the "Recently Visited" section if the array is non-empty; hide the section if empty (Requirements 11.4, 11.5)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 15.2 Write property tests for venture filter and recents queue
    - **Property 18: Venture filter completeness** — for any query Q and catalogue, all visible cards match Q; no hidden cards match Q
    - **Property 19: Recents queue invariant** — for any N clicks, recents.length ≤ 3, ordered newest-first, no duplicate IDs
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 18, Property 19`
    - _Requirements: 11.1, 11.3_

- [x] 16. Checkpoint — Improvements to existing pages (part 2) complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Implement Cold-Start Banner Component and apply to all ventures
  - [x] 17.1 Write the cold-start banner inline script snippet
    - Implement the IIFE script as designed in "Cold-Start Banner Component" (Design section) with: single fetch attempt with 3s AbortController timeout, retry up to 10× with 3s delay, banner shown on first failure, hidden on success, message updated after 10 failures (Requirements 12.1, 12.2, 12.3, 12.4, 12.5)
    - Write the snippet to a reference file `sites/cold-start-banner.snippet.js` (not loaded directly — used as copy-paste source)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 17.2 Write property tests for cold-start banner retry logic
    - **Property 20: Cold-start banner retry never exceeds cap** — for any sequence of failures, fetch is called at most 10 times
    - **Property 21: Cold-start banner hides on first success** — for failures 1..N then success (1 ≤ N ≤ 9), banner is hidden after success
    - Mock `fetch` to return a controllable promise sequence
    - Tag: `// Feature: sevenseed-platform-features-round2, Property 20, Property 21`
    - _Requirements: 12.3, 12.4, 12.5_

  - [x] 17.3 Inject cold-start banner script into all 8 venture app/index.html files
    - For each of: `sites/avpu/app/index.html`, `sites/decode-forest-pharmacy/app/index.html`, `sites/trust/app/index.html`, `sites/comonk/app/index.html`, `sites/sevenforce/app/index.html`, `sites/breakdown/app/index.html`, `sites/avp-emart/app/index.html`, `sites/sevenseed/app/index.html` — paste the cold-start banner script immediately after `<body>` tag
    - Update the endpoint URL in each copy to match the venture's own `/api/health` path (Requirement 12.6)
    - _Requirements: 12.6_

- [x] 18. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for a faster MVP; core implementation tasks must all be completed.
- Every new HTML page must `<link rel="stylesheet" href="style.css">` and `<script src="app.js"></script>` (relative paths) — this gives it the preloader, theme toggle, nav scroll, and scramble effects automatically.
- The `site_builder/*.py` nav registration tasks (1.3, 2.3, 4.3, 5.3, 7.2, 8.3) must be done alongside their respective page tasks — skipping them means the next `deploy.py` run wipes the nav link.
- All `localStorage` keys are namespaced per-venture to prevent collisions (e.g. `ss_pharmacy_reminders` not just `reminders`).
- `try/catch` must wrap every `localStorage.setItem` and `JSON.parse` call.
- `@media print` blocks: every data page prints with `body { background: #fff; color: #000; }`, nav hidden via `display: none`, and results content at 100% width.
- The cold-start banner snippet in task 17.1 is the canonical source; the 8 copies in 17.3 each need their `/api/health` URL adjusted.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "4.1", "5.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.2", "2.3", "4.2", "4.3", "5.2", "5.3"] },
    { "id": 2, "tasks": ["7.1", "8.1"] },
    { "id": 3, "tasks": ["7.2", "8.2", "8.3"] },
    { "id": 4, "tasks": ["10.1", "10.3", "10.5", "11.1", "12.1", "12.2", "14.1", "14.3", "15.1"] },
    { "id": 5, "tasks": ["10.2", "10.4", "11.2", "11.3", "12.3", "12.4", "14.2", "15.2"] },
    { "id": 6, "tasks": ["17.1"] },
    { "id": 7, "tasks": ["17.2", "17.3"] }
  ]
}
```
