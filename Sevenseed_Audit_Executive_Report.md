# Technical & Security Audit Report: Sevenseed Platform

**TO:** Leadership & Engineering Team  
**FROM:** QA & Security Audit Team  
**DATE:** September 7, 2026  
**TARGET PLATFORM:** [https://sevenseed.onrender.com/](https://sevenseed.onrender.com/)  
**SUBJECT:** Comprehensive Quality Assurance, Security & Functional Defect Audit  
**STATUS:** Action Required (10 Issues Identified: 2 Critical, 3 High, 3 Medium, 2 Low)

---

## 1. Executive Summary

A comprehensive quality assurance, security, and architectural review was conducted on the production deployment of **Sevenseed** (`https://sevenseed.onrender.com/`).

The platform showcases a strong terminal-styled visual identity, an impressive autonomous multi-agent ecosystem, and a suite of 8 incubated ventures. However, this audit uncovered **critical security gaps and functional disconnects** that directly jeopardize infrastructure costs, business lead capture, and brand credibility:

1. **Unprotected LLM Compute Engine:** The internal operations dashboard (`/dashboard`) and the LangGraph agent runner (`POST /api/agent/run`) have **no authentication barriers**. Anyone can send arbitrary prompts to the backend, executing live Groq LLM inferences (`Groq openai/gpt-oss-120b`) on the company's private credentials without restriction.
2. **Broken Lead Intake (Data Loss):** While a robust lead ingestion API (`POST /api/contact`) exists on the server, the frontend completely bypasses it and attempts a client-side `mailto:` launch. Inquiries are **never saved to the database**, and mobile/webmail users experience silent submission failures.
3. **AI Sandbox Permanently Locked in "Mock Demo":** The venture evaluation sandbox requires an unobtainable `sevenforce_token`, leaving the interactive evaluation permanently locked in demo mode and pointing users to a dead external GitHub Pages link.
4. **Hardcoded Development Artifacts:** Production HTML contains explicit references to `http://localhost:8001`, and the Live AI Agent Workspace simulates dynamic intelligence with hardcoded static strings that ignore visitor inputs.

Immediate remediation is strongly advised before driving further investor or user traffic to the site.

---

## 2. Priority Defect Summary Matrix

| ID | Issue Title | Severity | Impact Area | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Unauthenticated `/dashboard` & Public LLM Execution (`POST /api/agent/run`) | **CRITICAL** | Security / Cost Exposure | Open |
| **FORM-01** | Contact Form Bypasses Working API; Inquiries Lost (Uses `mailto:`) | **CRITICAL** | Lead Capture / Revenue | Open |
| **AI-01** | AI Sandbox Permanently Locked in "Demo Mode" & Dead Link | **HIGH** | Product Demo / UX | Open |
| **DEV-01** | Production HTML Exposes Hardcoded `http://localhost:8001` Endpoint | **HIGH** | Reliability / Code Hygiene | Open |
| **AI-02** | Live Agent Workspace Ignores User Prompts (Canned Responses) | **HIGH** | Product Credibility | Open |
| **SEC-02** | Public Business Metrics & Unauthenticated Notification Relay Risk | **MEDIUM** | Data Privacy & Abuse | Open |
| **STATE-01**| Simulated BYOK Latency Benchmark & Keys Cannot Be Deleted | **MEDIUM** | Client State & BYOK | Open |
| **NAV-01** | Inconsistent Sub-Application Pathing (Command Palette vs. Page) | **MEDIUM** | Routing / Canonical URLs | Open |
| **API-01** | Stale / Unreachable URL (`comonk-ai.onrender.com`) in `/api/ventures` | **LOW** | Backend Data Integrity | Open |
| **SEO-01** | Typo in Page `<title>` ("Seven seed") & Missing Social OpenGraph Tags | **LOW** | Social Sharing / Branding | Open |

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
PHASE 1: CRITICAL (Day 1 - 2)
  ├── 1. Add authentication guards to /dashboard and POST /api/agent/run
  ├── 2. Wire #contact-form to submit directly to POST /api/contact
  └── 3. Remove http://localhost:8001 from index.html

PHASE 2: HIGH PRIORITY (Days 3 - 5)
  ├── 4. Connect AI Sandbox to BYOK keys and fix the dead external link
  ├── 5. Connect Live Agent Workspace to LLM API or convert to guided simulation
  └── 6. Fix BYOK key deletion and add real latency testing

PHASE 3: POLISH & QUALITY (Week 2)
  ├── 7. Secure /api/analytics and /api/notify endpoints
  ├── 8. Standardize Command Palette routing to clean URLs
  ├── 9. Update Comonk URL in /api/ventures
  └── 10. Correct title typo and add OpenGraph social meta tags
```

---

*Report prepared by Antigravity Autonomous QA & Security Systems.*
