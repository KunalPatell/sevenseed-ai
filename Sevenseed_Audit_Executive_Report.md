# Technical & Security Audit Report: Sevenseed Platform

**TO:** Leadership & Engineering Team  
**FROM:** QA & Security Audit Team  
**DATE:** September 7, 2026  
**TARGET PLATFORM:** [https://sevenseed.onrender.com/](https://sevenseed.onrender.com/)  
**SUBJECT:** Comprehensive Quality Assurance, Security & Functional Defect Audit  
**STATUS:** All 10 Issues Resolved & Verified (Production Ready)

---

## 1. Executive Summary

A comprehensive quality assurance, security, and architectural review was conducted on the production deployment of **Sevenseed** (`https://sevenseed.onrender.com/`).

The platform showcases a strong terminal-styled visual identity, an impressive autonomous multi-agent ecosystem, and a suite of 8 incubated ventures. This audit originally uncovered **critical security gaps and functional disconnects** (unprotected LLM compute, broken lead intake via mailto, locked demo mode, hardcoded localhost artifacts, etc.).

**Remediation Update:** All 10 identified defects across security, lead intake, AI widgets, routing, and SEO have been systematically resolved and verified in production code. Production HTML contains zero localhost artifacts, contact inquiries persist to database, and endpoints are securely guarded.

---

## 2. Priority Defect Summary Matrix

| ID | Issue Title | Severity | Impact Area | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Unauthenticated `/dashboard` & Public LLM Execution (`POST /api/agent/run`) | **CRITICAL** | Security / Cost Exposure | **Resolved & Verified** |
| **FORM-01** | Contact Form Bypasses Working API; Inquiries Lost (Uses `mailto:`) | **CRITICAL** | Lead Capture / Revenue | **Resolved & Verified** |
| **AI-01** | AI Sandbox Permanently Locked in "Demo Mode" & Dead Link | **HIGH** | Product Demo / UX | **Resolved & Verified** |
| **DEV-01** | Production HTML Exposes Hardcoded `http://localhost:8001` Endpoint | **HIGH** | Reliability / Code Hygiene | **Resolved & Verified** |
| **AI-02** | Live Agent Workspace Ignores User Prompts (Canned Responses) | **HIGH** | Product Credibility | **Resolved & Verified** |
| **SEC-02** | Public Business Metrics & Unauthenticated Notification Relay Risk | **MEDIUM** | Data Privacy & Abuse | **Resolved & Verified** |
| **STATE-01**| Simulated BYOK Latency Benchmark & Keys Cannot Be Deleted | **MEDIUM** | Client State & BYOK | **Resolved & Verified** |
| **NAV-01** | Inconsistent Sub-Application Pathing (Command Palette vs. Page) | **MEDIUM** | Routing / Canonical URLs | **Resolved & Verified** |
| **API-01** | Stale / Unreachable URL (`comonk-ai.onrender.com`) in `/api/ventures` | **LOW** | Backend Data Integrity | **Resolved & Verified** |
| **SEO-01** | Typo in Page `<title>` ("Seven seed") & Missing Social OpenGraph Tags | **LOW** | Social Sharing / Branding | **Resolved & Verified** |

---

## 3. Detailed Technical Defect Reports

### Issue 1: Unprotected Public Dashboard & Free Server Compute Drainage (SEC-01)
- **Severity:** **CRITICAL**
- **Affected Endpoints:** `GET /dashboard`, `POST /api/agent/run`
- **Description:** 
  The internal administration interface `/dashboard` is publicly exposed without requiring login credentials, API keys, or session cookies. Visitors can access internal tooling, pipeline data, and LangGraph agent execution modules.
  
  Furthermore, `POST /api/agent/run` allows unauthenticated execution:
  ```bash
  curl -X POST https://sevenseed.onrender.com/api/agent/run \
    -H "Content-Type: application/json" \
    -d '{"agent_name": "owl", "prompt": "Analyze venture pipeline"}'
  ```
  The server responds with HTTP 200 and performs live inference using the studio's private Groq API key (`Groq openai/gpt-oss-120b`).
- **Business Impact:** Any third party or automated crawler can loop requests to this endpoint, quickly exhausting Groq API quotas, generating unexpected cloud bills, and causing service denial for legitimate users.
- **Recommended Remediation:**
  Implement JWT authentication or session cookie validation on `/dashboard` and wrap all `/api/agent/*` routes in FastAPI's `Depends(get_current_user)` security dependency. Apply server-side IP rate limiting (e.g. `slowapi`).

---

### Issue 2: Contact Form Fails to Save Inquiries to Database (FORM-01)
- **Severity:** **CRITICAL**
- **Affected Components:** `#contact-form` in `static/js/app.js`, `POST /api/contact`
- **Description:** 
  When a founder or partner submits the "Join the Studio / Pitch Your Venture" form, the frontend triggers:
  ```javascript
  window.location.href = `mailto:sevenseedai@gmail.com?subject=...`;
  ```
  The UI displays "Opening your email app..." and marks the submission as successful.
- **Root Cause & Disconnect:** 
  The FastAPI backend already includes a fully implemented, working endpoint: `POST /api/contact` (accepts `name`, `email`, `company`, `role`, `stage`, `message` and returns `{"success": true}`). The frontend ignores this endpoint completely.
- **Business Impact:** 
  - Zero leads or partnership pitches are recorded in the platform's database.
  - On mobile devices, tablets, and systems without an OS-registered email client (e.g. users who use webmail like Gmail or Outlook in browser), clicking "Submit" either does nothing or opens an OS error dialog.
- **Recommended Remediation:**
  Update `app.js` to dispatch an asynchronous `fetch('/api/contact', ...)` call with the form payload so inquiries are securely persisted in the database, with a graceful fallback.

---

### Issue 3: AI Sandbox Trapped in "Demo Mode" with Dead External Link (AI-01)
- **Severity:** **HIGH**
- **Affected Components:** `#sandbox-form`, `runSandbox()` in `static/js/app.js`
- **Description:** 
  In `app.js`, demo status is determined by:
  ```javascript
  const token = localStorage.getItem('sevenforce_token');
  const isDemo = !token || token === 'demo_token';
  ```
  The homepage provides no sign-up or login flow to ever issue a `sevenforce_token`. Even if users configure their personal Groq or OpenAI keys via the BYOK modal, the sandbox still executes in mock mode.
  
  When run, the sandbox directs users to:  
  `https://kunalpatell.github.io/sevenseed/sevenforce/index.html`  
  This URL is **dead / times out indefinitely**.
- **Recommended Remediation:**
  1. Update `app.js` to check for active keys in `localStorage.getItem('groq_api_key')` rather than requiring a non-existent `sevenforce_token`.
  2. Update the fallback link to route to the working internal path `/sevenforce/`.

---

### Issue 4: Hardcoded `localhost:8001` in Production HTML (DEV-01)
- **Severity:** **HIGH**
- **Affected Location:** `index.html` (Line 697)
- **Description:** 
  The production HTML explicitly specifies a local development address:
  ```html
  <form id="sandbox-form" data-endpoint="http://localhost:8001/api/tools/evaluate">
  ```
- **Business Impact:** Exposes local machine ports in public production code. If client scripts fall back to reading `dataset.endpoint`, requests fail with `ERR_CONNECTION_REFUSED` on all user devices.
- **Recommended Remediation:**
  Change the attribute to a relative production path: `data-endpoint="/api/tools/evaluate"`.

---

### Issue 5: Live AI Agent Workspace Discards User Prompts (AI-02)
- **Severity:** **HIGH**
- **Affected Components:** `#workspace` in `app.js` (`executePrompt()`)
- **Description:** 
  The interactive workspace allows users to select an agent (Maya, Buddy, Dexter, etc.) and type a custom prompt. However, `app.js` completely discards the user's input text and streams a static, pre-canned response (`agent.responses['default']`).
- **Business Impact:** Leads prospective founders and investors to believe the live agent demo is broken or fraudulent.
- **Recommended Remediation:**
  Either connect the prompt input to an authenticated backend proxy / client BYOK LLM call, or clearly badge the component as an *"Interactive Capability Simulation"* with selectable prompt chips rather than an open text box.

---

### Issue 6: Public Business Metrics & Open Email Relay Risk (SEC-02)
- **Severity:** **MEDIUM**
- **Affected Endpoints:** `GET /api/analytics/overview`, `POST /api/notify/email`
- **Description:** 
  1. `GET /api/analytics/overview` is unauthenticated and returns exact production counts (`founder_sessions`, `contact_messages`, `workspaces_created`).
  2. `POST /api/notify/email` accepts payloads of `{ to, subject, body, name }` without requiring an admin token.
- **Business Impact:** Internal traction data is visible to anyone inspecting network traffic, and unauthenticated notification endpoints can be targeted by spammers if SMTP is active.
- **Recommended Remediation:**
  Secure both endpoints behind an administrative authorization header.

---

### Issue 7: Simulated BYOK Latency Benchmark & Key Deletion Bug (STATE-01)
- **Severity:** **MEDIUM**
- **Affected Component:** BYOK Modal in `static/js/app.js`
- **Description:** 
  1. Clicking "Save & Test Latency" runs a hardcoded timer and outputs `Testing Groq LLaMA 3.3 latency: 42ms` without pinging Groq's servers (even if given an invalid key like `gsk_fake`).
  2. Clearing the input field and clicking Save fails to remove the key from browser storage because `if (groqIn && groqIn.value.trim())` lacks an `else` branch to call `localStorage.removeItem(...)`.
- **Recommended Remediation:**
  Measure true latency using `performance.now()` against `https://api.groq.com/openai/v1/models` and add the `localStorage.removeItem` logic to permit clearing stored keys.

---

### Issue 8: Inconsistent Sub-Application Routing Structure (NAV-01)
- **Severity:** **MEDIUM**
- **Affected Component:** Command Palette (`Ctrl+K`) vs. Landing Page Venture Grid
- **Description:** 
  Landing cards navigate to clean routes (`/comonk-ai/`, `/pharmacy/`, `/breakdown/`), whereas the Command Palette links directly to raw HTML files (`comonk/index.html`, `decode-forest-pharmacy/index.html`).
- **Recommended Remediation:**
  Standardize all Command Palette targets to use the clean directory URLs.

---

### Issue 9: Dead External URL in `GET /api/ventures` (API-01)
- **Severity:** **LOW**
- **Affected Endpoint:** `GET /api/ventures`
- **Description:** 
  The API returns `"url": "https://comonk-ai.onrender.com"` for Comonk Technology. That domain drops connections and times out.
- **Recommended Remediation:**
  Update the database record to point to the active `/comonk-ai/` route.

---

### Issue 10: Typographical Error in `<title>` & Missing Social Meta Tags (SEO-01)
- **Severity:** **LOW**
- **Affected Component:** `<head>` in `index.html`
- **Description:** 
  1. The page `<title>` is formatted with an extra space: `<title>Seven seed — AI Venture Studio</title>` (brand is "Sevenseed").
  2. The page lacks `og:title`, `og:image`, `og:description`, and `twitter:card` tags.
- **Recommended Remediation:**
  Correct the title and insert standard OpenGraph tags to ensure professional link previews when shared on LinkedIn, WhatsApp, and Twitter.

---

## 4. Remediation Roadmap

```
PHASE 1: CRITICAL (Resolved)
  ├── 1. Add authentication guards to /dashboard and POST /api/agent/run [VERIFIED]
  ├── 2. Wire #contactForm to submit directly to POST /api/contact [VERIFIED]
  └── 3. Remove http://localhost:8001 from index.html & generate_sites.py [VERIFIED]

PHASE 2: HIGH PRIORITY (Resolved)
  ├── 4. Connect AI Sandbox to BYOK keys and fix the dead external link [VERIFIED]
  ├── 5. Connect Live Agent Workspace to LLM API or convert to guided simulation [VERIFIED]
  └── 6. Fix BYOK key deletion and add real latency testing [VERIFIED]

PHASE 3: POLISH & QUALITY (Resolved)
  ├── 7. Secure /api/analytics and /api/notify endpoints [VERIFIED]
  ├── 8. Standardize Command Palette routing to clean URLs [VERIFIED]
  ├── 9. Update Comonk URL in /api/ventures [VERIFIED]
  └── 10. Correct title typo and add OpenGraph social meta tags [VERIFIED]
```

---

## 5. Remediation Verification & Sign-Off Matrix

| Issue ID | Root Cause | Verified Production Fix | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **SEC-01** | `/dashboard` had no auth; `/api/agent/run` allowed unauthenticated LLM loops. | Gated `/dashboard` via `ADMIN_KEY` / JWT session validation (`features.py` L1208). Enforced admin/user auth or BYOK keys on `POST /api/agent/run` with strict IP rate limiting fallback (`features.py` L1069). | `curl -i /dashboard` returns `403 Forbidden` without credentials. Rate limiting active. |
| **FORM-01** | Contact form bypassed server and triggered `mailto:`. | Form rewritten in `generate_sites.py` & `app.js` to dispatch asynchronous `POST /api/contact` with `{ name, email, subject, message }`. Writes to SQLite & Supabase PostgreSQL, logs submission, and sends background notification. Mailto is only a catastrophic fallback. | Submissions yield HTTP 200 `{"success": true}` and display in-app green confirmation toast. |
| **AI-01** | Required non-existent `sevenforce_token` and pointed to dead GitHub Pages URL. | Updated `isDemo` logic in `generate_sites.py` and `app.js` to evaluate `user_groq_key`, `user_gemini_key`, etc. Replaced dead URL with canonical live internal path `/sevenforce/`. | Sandbox runs live LLM queries when BYOK is populated; demo fallback links to `/sevenforce/`. |
| **DEV-01** | Hardcoded `http://localhost:8001` in sandbox endpoint & Launch App buttons. | Replaced all `http://localhost:800x` endpoints with clean relative paths (`/api/tools/evaluate`, `/dashboard`, etc.) in `generate_sites.py`, `sites/*`, and `apps/sevenseed/backend/static/`. | Script scan confirms 0 occurrences of `localhost` across all HTML/JS production bundles. |
| **AI-02** | Live workspace streamed static response ignoring user prompt. | `executePrompt()` in `app.js` dispatches live `POST /api/agent/run` when BYOK keys are present, and displays interactive simulation chips badged with `<i class="fas fa-microchip"></i> Interactive Simulation` when running offline. | User prompt is echoed and reflected dynamically in workspace responses. |
| **SEC-02** | `/api/analytics/overview` leaked internal DB metrics to public visitors. | Endpoint in `features.py` checks `ADMIN_KEY` or JWT auth. Public callers receive sanitized marketing overview; internal counts require authorization. `/api/notify/email` requires admin key. | Unauthenticated requests receive high-level public schema; internal DB rows protected. |
| **STATE-01**| Latency test simulated; key deletion failed to call `removeItem`. | BYOK modal measures true network latency using `performance.now()` against models endpoint. Clearing input triggers `localStorage.removeItem(key)`. | Stored keys can be deleted cleanly. Invalid keys report realistic network latency. |
| **NAV-01** | Command Palette linked to raw `.html` files while cards used clean routes. | Standardized `GROUP` registry in `generate_sites.py` to canonical relative routes (`/comonk-ai/`, `/pharmacy/`, `/breakdown/`, `/trust/`, `/avpu/`, etc.). | Command Palette (`Ctrl+K`) navigates cleanly to identical routes as landing cards. |
| **API-01** | `GET /api/ventures` returned broken `https://comonk-ai.onrender.com`. | In `apps/sevenseed/backend/main.py`, Comonk entry updated to canonical internal route `/comonk-ai/`. | `curl https://sevenseed.onrender.com/api/ventures` returns clean relative URLs. |
| **SEO-01** | Title space typo ("Seven seed") and missing OpenGraph metadata. | Standardized `<title>` to `Sevenseed — AI Venture Studio & Startup Incubator`. Embedded complete `og:type`, `og:title`, `og:description`, `og:url`, and Twitter card tags across all generated pages. | Social preview scrapers and browsers render accurate brand title and cards. |

---

*Report certified & signed off by Antigravity Autonomous QA & Security Systems.*

