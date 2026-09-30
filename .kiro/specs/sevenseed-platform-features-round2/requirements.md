# Requirements Document

## Introduction

Sevenseed Platform Features Round 2 extends the live AI venture studio at sevenseed.onrender.com with six new standalone feature pages across three ventures (Decode Forest Pharmacy, AVP Charitable Trust, Comonk AI), deep improvements to five existing pages (Gyan AI Tutor, Smart Comparator, Agent Dispatch Console, Defect Scanner, Venture Dashboard), and a cross-venture cold-start banner component. All output is static HTML + CSS + vanilla JS — no build step, no npm, no external JS frameworks. Simulated/demo data stands in for live API responses, and localStorage provides all persistence.

---

## Glossary

- **Venture**: One of the 8 AI product brands hosted under sevenseed.onrender.com (avpu, decode-forest-pharmacy, trust, comonk, sevenforce, breakdown, avp-emart, sevenseed hub).
- **Static page**: A self-contained `.html` file that imports `style.css`, `app.js`, and optional page-level `<style>` / `<script>` blocks; no server-side rendering.
- **site_builder**: The Python generator scripts in `site_builder/*.py` that regenerate each venture's `index.html`. New nav links must be registered there so the next `deploy.py` run does not overwrite them.
- **localStorage**: Browser-native key-value store used for all client-side persistence; keys are namespaced per venture (e.g. `ss_pharmacy_reminders`).
- **Cold-start banner**: An amber notification strip shown while the standalone-app backend is warming up on Render's free tier.
- **Print block**: A `@media print` CSS section that hides non-essential UI and formats data tables/cards cleanly for paper output.
- **Urgency level**: A triage classification for the Symptom Checker — one of Emergency, See Doctor, or Home Care.
- **ATS score**: Applicant Tracking System keyword-match score computed client-side from resume text against a predefined keyword dictionary.

---

## Requirements

### Requirement 1: Symptom Checker Page (Decode Forest Pharmacy)

**User Story:** As a user, I want to describe my symptoms and receive an AI triage response, so that I know whether I need emergency care, a doctor visit, or can manage at home.

#### Acceptance Criteria

1. THE Symptom_Checker SHALL render as a standalone page at `sites/decode-forest-pharmacy/symptom-checker.html` linked from the venture nav and registered in `site_builder/pharmacy_builder.py`.
2. WHEN a user submits one or more symptoms via the input form, THE Symptom_Checker SHALL display a triage urgency level badge of exactly one of: Emergency, See Doctor, or Home Care.
3. WHEN a triage result is shown, THE Symptom_Checker SHALL display a list of at least 2 condition suggestions relevant to the entered symptoms.
4. WHEN a triage result is shown, THE Symptom_Checker SHALL display a DO list and a DON'T list each containing at least 3 items.
5. WHEN the urgency level is Emergency, THE Symptom_Checker SHALL display a "Find Nearest Hospital" call-to-action button that links to `hospital-finder.html`.
6. IF the user submits the form with no symptoms entered, THEN THE Symptom_Checker SHALL display an inline validation error and SHALL NOT produce a triage result.
7. THE Symptom_Checker SHALL include a `@media print` block so a user can print the triage result without navigation chrome.

---

### Requirement 2: Medicine Reminder Page (Decode Forest Pharmacy)

**User Story:** As a patient, I want to add and track medicine schedules, so that I never miss a dose.

#### Acceptance Criteria

1. THE Medicine_Reminder SHALL render as a standalone page at `sites/decode-forest-pharmacy/medicine-reminder.html` (replacing or enhancing the existing stub if present), linked from the venture nav and registered in `site_builder/pharmacy_builder.py`.
2. WHEN a user fills in medicine name, dose, frequency, and time fields and submits, THE Medicine_Reminder SHALL persist the schedule entry to `localStorage` under key `ss_pharmacy_reminders` and render a visual reminder card without page reload.
3. THE Medicine_Reminder SHALL restore all previously saved reminder cards from `localStorage` on page load.
4. WHEN a user clicks "Mark as Taken" on a reminder card, THE Medicine_Reminder SHALL visually mark that card as taken for the current day and persist the taken state to `localStorage`.
5. WHEN the browser supports the Notifications API and the user grants permission, THE Medicine_Reminder SHALL schedule a browser notification for each saved reminder at its configured time.
6. IF the user submits the reminder form with any required field empty, THEN THE Medicine_Reminder SHALL display a field-level validation error and SHALL NOT save the entry.
7. WHEN a user clicks Delete on a reminder card, THE Medicine_Reminder SHALL remove the entry from `localStorage` and remove the card from the UI immediately.

---

### Requirement 3: Donation Ledger Page (AVP Charitable Trust)

**User Story:** As a donor or visitor, I want to see a transparent, public donation log with fund deployment progress, so that I can trust the organisation's financial accountability.

#### Acceptance Criteria

1. THE Donation_Ledger SHALL render as a standalone page at `sites/trust/donation-ledger.html`, linked from the venture nav and registered in `site_builder/trust_builder.py`.
2. THE Donation_Ledger SHALL display a table of at least 10 simulated donation entries with columns: Donor Name, Amount (₹), Category, Date, and Status.
3. WHEN the page loads, THE Donation_Ledger SHALL animate a running total counter from 0 to the sum of all displayed donations over a 1.5-second duration.
4. THE Donation_Ledger SHALL display a category breakdown section with a progress bar for each of the three categories: Education, Food Relief, and Medical Aid, showing the proportion of total funds allocated.
5. WHEN a user clicks "Download 80G Receipt" on a ledger row, THE Donation_Ledger SHALL trigger a `window.print()` of a receipt-formatted overlay containing donor name, amount, date, PAN reference, and an 80G certificate statement.
6. THE Donation_Ledger SHALL display a "Funds Deployed" section showing at least 3 project-level progress bars with percentage complete.
7. THE Donation_Ledger SHALL include a `@media print` block so the receipt overlay prints cleanly.

---

### Requirement 4: Volunteer Portal Page (AVP Charitable Trust)

**User Story:** As a prospective volunteer, I want to register my skills and availability, so that I can be matched to open opportunities.

#### Acceptance Criteria

1. THE Volunteer_Portal SHALL render as a standalone page at `sites/trust/volunteer-portal.html`, linked from the venture nav and registered in `site_builder/trust_builder.py`.
2. WHEN a user completes the registration form (name, email, skills checkboxes, availability select, location text) and submits, THE Volunteer_Portal SHALL persist the registration to `localStorage` under key `ss_trust_volunteers` and display a success confirmation card.
3. THE Volunteer_Portal SHALL display a list of at least 4 simulated open volunteer opportunities, each showing: role, required skills, location, and commitment hours.
4. WHEN a registration is saved, THE Volunteer_Portal SHALL highlight opportunities whose required skills overlap with the registered volunteer's selected skills.
5. WHEN a user clicks "Apply" on an opportunity, THE Volunteer_Portal SHALL add an application status entry to `localStorage` and update the opportunity card to show "Applied — Pending Review" status.
6. IF the user submits the registration form with name, email, or skills empty, THEN THE Volunteer_Portal SHALL display field-level validation errors and SHALL NOT save the entry.
7. THE Volunteer_Portal SHALL restore a previously saved registration from `localStorage` on page load and pre-fill the form fields.

---

### Requirement 5: Salary Insights Page (Comonk AI) — Full Build

**User Story:** As a job seeker or hiring manager, I want to query salary data by role, city, and experience, so that I can benchmark compensation and negotiate effectively.

#### Acceptance Criteria

1. THE Salary_Insights SHALL render as a complete feature page at `sites/comonk/salary-insights.html` (replacing the existing stub), linked from the venture nav and registered in `site_builder/comonk_builder.py`.
2. WHEN a user selects role, city, and years of experience and clicks "Get Insights", THE Salary_Insights SHALL display a salary range showing P10, P50, and P90 percentile values for that combination.
3. WHEN salary results are shown, THE Salary_Insights SHALL render an SVG bar or range chart visualising the P10–P90 spread for at least 4 companies.
4. WHEN salary results are shown, THE Salary_Insights SHALL display a skills-to-salary impact table listing at least 5 skills and the incremental salary premium each adds.
5. WHEN salary results are shown, THE Salary_Insights SHALL display a "Negotiation Script" text block with templated talking points personalised to the selected role and salary range.
6. WHEN salary results are shown, THE Salary_Insights SHALL render an SVG YoE-vs-salary curve showing the salary trajectory from 0 to 10 years of experience.
7. THE Salary_Insights SHALL include a `@media print` block that prints the results panel cleanly.
8. WHEN a user clicks "Get Insights", THE Salary_Insights SHALL display results within the same page without a full reload.

---

### Requirement 6: Resume Scorer Page (Comonk AI) — Full Build

**User Story:** As a job applicant, I want to paste my resume text and receive an ATS analysis, so that I can improve my chances of passing automated screening.

#### Acceptance Criteria

1. THE Resume_Scorer SHALL render as a complete feature page at `sites/comonk/resume-scorer.html`, linked from the venture nav and registered in `site_builder/comonk_builder.py`.
2. WHEN a user pastes resume text and clicks "Analyse", THE Resume_Scorer SHALL display an overall ATS score from 0 to 100 computed from keyword density against a built-in keyword dictionary.
3. WHEN analysis results are shown, THE Resume_Scorer SHALL display a section completeness checklist for: Contact Info, Professional Summary, Work Experience, Skills, and Education — each checked or flagged based on detected presence in the pasted text.
4. WHEN analysis results are shown, THE Resume_Scorer SHALL display a formatting checklist covering: bullet point usage, line length, special character avoidance, and date format consistency.
5. WHEN analysis results are shown, THE Resume_Scorer SHALL display a "Before / After" improvement suggestions panel with at least 3 specific, actionable rewrites.
6. IF the user clicks "Analyse" with an empty or fewer-than-50-character input, THEN THE Resume_Scorer SHALL display a validation error and SHALL NOT run the analysis.
7. THE Resume_Scorer SHALL include a `@media print` block so the analysis report prints cleanly.

---

### Requirement 7: Gyan AI Tutor Improvements

**User Story:** As a learner, I want my chat history and topic progress to persist across sessions and have convenient keyboard shortcuts, so that I can continue learning without losing context.

#### Acceptance Criteria

1. WHEN a user sends or receives a chat message, THE Gyan_Tutor SHALL persist the message to `localStorage` under key `ss_gyan_history` so that the conversation is restored on next page load.
2. THE Gyan_Tutor SHALL restore the full chat message list from `localStorage` on page load, displaying messages in the original order.
3. WHEN a user answers a quiz question incorrectly, THE Gyan_Tutor SHALL display an "Explain this answer" button on the results screen for each wrong answer.
4. WHEN a user clicks "Explain this answer" for a wrong question, THE Gyan_Tutor SHALL switch to Chat mode and pre-fill the input with a templated message: "Explain why [wrong answer choice] is wrong for: [question text]".
5. THE Gyan_Tutor SHALL display a topic progress tracker panel listing each topic that has been queried, alongside a message count for that topic.
6. WHEN a user presses `Enter` in the chat input, THE Gyan_Tutor SHALL send the message; WHEN a user presses `Shift+Enter`, THE Gyan_Tutor SHALL insert a newline without sending.
7. WHEN a user presses `Ctrl+/`, THE Gyan_Tutor SHALL move keyboard focus to the chat input field.

---

### Requirement 8: Smart Comparator Improvements

**User Story:** As a shopper, I want to save products to a wishlist and get price-drop alerts, so that I can track deals without re-entering searches.

#### Acceptance Criteria

1. WHEN a user clicks "Save to Wishlist" on a store row in the price matrix, THE Smart_Comparator SHALL persist that product entry (product name, store, price, timestamp) to `localStorage` under key `ss_emart_wishlist`.
2. THE Smart_Comparator SHALL display a Wishlist panel showing all saved products, each with the saved price, store, and a "Remove" button.
3. WHEN a user clicks "Remove" in the wishlist panel, THE Smart_Comparator SHALL remove that entry from `localStorage` and update the panel immediately.
4. WHEN a user clicks "Set Price Alert" on a store row, THE Smart_Comparator SHALL store the target product and current price in `localStorage` under key `ss_emart_alerts` and display a confirmation badge.
5. WHEN the page loads and `localStorage` contains saved price alert entries, THE Smart_Comparator SHALL display a "Price Alert Active" indicator for each matching product row.
6. THE Smart_Comparator SHALL animate the SVG trend chart using a stroke-dashoffset draw-on-load animation that completes within 1.2 seconds.

---

### Requirement 9: Agent Dispatch Console Improvements

**User Story:** As a Sevenforce user, I want real typewriter output streaming, an export feature, performance stats, and keyboard dispatch, so that the console feels like a real AI terminal.

#### Acceptance Criteria

1. WHEN an agent task completes in the terminal simulation, THE Agent_Dispatch SHALL render the final output section character-by-character at a rate of 18–22 characters per second, creating a typewriter effect.
2. WHEN a user clicks "Export as Markdown", THE Agent_Dispatch SHALL generate a `.md` file containing the full terminal session log and trigger a browser download without a page reload.
3. THE Agent_Dispatch SHALL display an agent performance stats panel showing, for each agent: tasks completed, average simulated time, and success rate — all persisted to and loaded from `localStorage` under key `ss_sevenforce_stats`.
4. WHEN a dispatch is completed, THE Agent_Dispatch SHALL increment the relevant agent's tasks completed counter and update the stats panel.
5. WHEN a user presses `Ctrl+Enter` with the brief textarea focused, THE Agent_Dispatch SHALL trigger the dispatch action.

---

### Requirement 10: Defect Scanner Improvements

**User Story:** As a construction professional, I want to share scan results and review recent scan history, so that I can communicate findings and track defect trends.

#### Acceptance Criteria

1. WHEN a user clicks "Share Report", THE Defect_Scanner SHALL encode the current scan summary (defect counts, severity, BOQ estimate) into a URL hash fragment and update `window.location.hash`, then display the shareable link in a copyable text field.
2. WHEN the page loads with a non-empty URL hash, THE Defect_Scanner SHALL decode and render the scan summary from the hash as a read-only results panel.
3. THE Defect_Scanner SHALL persist the last 5 scan summaries to `localStorage` under key `ss_breakdown_history` and display them in a severity history timeline panel, ordered newest-first.
4. WHEN a user runs a new scan, THE Defect_Scanner SHALL append the result to the history list, evicting the oldest entry if the list exceeds 5 items.
5. THE Defect_Scanner SHALL display a sample image gallery of 3 demo photos in the empty state; WHEN a user clicks a demo photo, THE Defect_Scanner SHALL load the corresponding pre-defined defect scenario (bounding boxes, compliance data, BOQ estimate) without requiring a file upload.

---

### Requirement 11: Venture Dashboard Improvements

**User Story:** As a visitor to the Sevenseed hub, I want to search and filter ventures, see ecosystem health, and revisit recent ventures, so that I can navigate efficiently.

#### Acceptance Criteria

1. THE Venture_Dashboard SHALL render a search/filter input above the venture grid; WHEN a user types in the filter input, THE Venture_Dashboard SHALL show only venture cards whose sector tag or name contains the query (case-insensitive), with non-matching cards hidden within 100ms.
2. THE Venture_Dashboard SHALL display an "Ecosystem Health" gauge showing the percentage of ventures currently reachable (simulated as a static value of 8 of 8 with a visual ring or meter).
3. WHEN a user clicks a venture card, THE Venture_Dashboard SHALL record that venture in `localStorage` under key `ss_hub_recents` (maximum 3 entries, newest-first).
4. THE Venture_Dashboard SHALL display a "Recently Visited" section showing up to 3 venture cards loaded from `localStorage` on page load.
5. IF `localStorage` contains no recent venture entries, THEN THE Venture_Dashboard SHALL NOT render the "Recently Visited" section.

---

### Requirement 12: Cold-Start Banner Component (Cross-Venture)

**User Story:** As a user launching a standalone venture app, I want a clear loading indicator during backend cold starts, so that I am not confused by an empty dashboard.

#### Acceptance Criteria

1. THE Cold_Start_Banner SHALL be implemented as a self-contained inline `<script>` block that can be pasted into any venture's `app/index.html` without external dependencies.
2. WHEN the Cold_Start_Banner script runs, THE Cold_Start_Banner SHALL issue a `fetch` to the venture's `/api/health` endpoint and, IF the response does not resolve within 3 seconds, SHALL display an amber banner with the message "Waking up the backend (free-tier cold start, up to ~30s)…".
3. WHEN the fetch fails or returns a non-ok status, THE Cold_Start_Banner SHALL retry the request up to 10 times with a 3-second delay between each attempt.
4. WHEN a retry succeeds with a 2xx response, THE Cold_Start_Banner SHALL hide the amber banner immediately and cancel any pending retries.
5. AFTER 10 failed attempts, THE Cold_Start_Banner SHALL update the banner message to "Backend may be unavailable. Please try refreshing." and stop retrying.
6. THE Cold_Start_Banner SHALL be added to the `app/index.html` of all 8 venture standalone app exports.

---

### Requirement 13: Print/Export on Data Pages

**User Story:** As a user, I want to print or export the data shown on results pages, so that I can share findings offline.

#### Acceptance Criteria

1. THE Print_Export_Button SHALL appear on the following pages: `salary-insights.html`, `donation-ledger.html`, `defect-scanner.html` (results panel), and `gyan-ai-tutor.html` (quiz results).
2. WHEN a user clicks the Print/Export button on any of those pages, THE Print_Export_Button SHALL call `window.print()`.
3. EACH of those pages SHALL include a `@media print` CSS block that hides the navigation, sidebars, input forms, and non-result UI elements, and renders the data output at full width with black text on white background.
