# Comonk — Advanced Features: Detailed Implementation Plan

> AI career-guidance platform for AI/ML & IT job seekers in **Ahmedabad · Gandhinagar · Gujarat**.
> This document is build-ready: data models, endpoint contracts, logic, dependencies, UI, tests, and effort for every feature.

---

## Table of contents
1. [Context & architecture](#1-context--architecture)
2. [Roadmap & sequencing](#2-roadmap--sequencing)
3. [Shared foundations](#3-shared-foundations)
4. [Phase 1 — Application Tracker / CRM](#4-phase-1--application-tracker--crm)
5. [Phase 1 — Explainable Fit Score](#5-phase-1--explainable-fit-score)
6. [Phase 2 — Job-Hunt Autopilot (LangGraph)](#6-phase-2--job-hunt-autopilot-langgraph)
7. [Phase 2 — Reply detection & smart follow-up](#7-phase-2--reply-detection--smart-follow-up)
8. [Phase 2 — Referral / warm-intro finder](#8-phase-2--referral--warm-intro-finder)
9. [Phase 3 — Company-specific voice mock interview](#9-phase-3--company-specific-voice-mock-interview)
10. [Phase 3 — Resume ↔ JD gap analysis & auto-tailor](#10-phase-3--resume--jd-gap-analysis--auto-tailor)
11. [Phase 3 — Adaptive learning path](#11-phase-3--adaptive-learning-path)
12. [Phase 3 — Hindi / Gujarati mode](#12-phase-3--hindi--gujarati-mode)
13. [Full data model](#13-full-data-model)
14. [Compliance & safety](#14-compliance--safety)
15. [Testing strategy](#15-testing-strategy)
16. [Deployment notes](#16-deployment-notes)

---

## 1. Context & architecture

**Current stack**
| Layer | Tech |
|---|---|
| API | FastAPI — `comonk_backend.py` (~45 endpoints) |
| DB | SQLite — `comonk.db` (`companies`, `contacts`) |
| Vector search | ChromaDB — `comonk_rag.py` |
| LLM | Google Gemini + LangChain / LangGraph |
| Knowledge base | `Ahmedabad_IT_AIML_FINAL_MASTER.xlsx` — 2,008 companies, 1,837 LinkedIn HR profiles |
| Auth | OTP (email) + session |
| Infra | Docker → Render · rate-limit middleware · admin dashboard |

**Data flow today:** Excel → `db_setup.py` → `comonk.db` + ChromaDB index → API → frontend.
New layout (already wired into loaders): headers row 1, data row 2+, columns `No, Company, Category, City, Roles, Phone, Website, Address, LinkedIn, Priority, Source, Email 1..17`.

**Design principle:** add **depth + cohesion**. The app has breadth; these features connect the pieces into one outcome — *"get me hired"* — grounded in the HR database.

---

## 2. Roadmap & sequencing

| # | Feature | Phase | Effort | Value | Depends on |
|---|---|---|---|---|---|
| 4 | Application Tracker / CRM | 1 | M (3–4d) | ⭐⭐⭐⭐⭐ | — |
| 5 | Explainable Fit Score | 1 | S (1–2d) | ⭐⭐⭐⭐ | — |
| 8 | Referral / warm-intro finder | 2 | S–M (2–3d) | ⭐⭐⭐⭐ | LinkedIn profiles |
| 6 | Job-Hunt Autopilot | 2 | L (1–2w) | ⭐⭐⭐⭐⭐ | 4, 5, 8 |
| 7 | Reply detection & follow-up | 2 | M (4–5d) | ⭐⭐⭐⭐ | 4 |
| 9 | Voice mock interview | 3 | M–L (5–8d) | ⭐⭐⭐⭐ | RAG |
| 10 | JD gap analysis & auto-tailor | 3 | M (4–5d) | ⭐⭐⭐⭐ | resume parse |
| 11 | Adaptive learning path | 3 | M (3–5d) | ⭐⭐⭐ | 5 |
| 12 | Hindi / Gujarati mode | 3 | S (1–2d) | ⭐⭐⭐ | — |

**Ship milestone 1 =** #4 + #5 + #8 → Comonk becomes a *managed* job hunt.
**Ship milestone 2 =** #6 + #7 → autonomous agent.
**Ship milestone 3 =** #9–#12 → depth & differentiation.

---

## 3. Shared foundations

Add these once; every feature reuses them.

**3.1 User model** (if not already present)
```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, email TEXT UNIQUE, name TEXT,
  target_role TEXT, skills TEXT,           -- JSON array
  resume_text TEXT, created_at TEXT );
```

**3.2 Auth dependency** — a reusable FastAPI dependency:
```python
def current_user(session=Depends(get_session)) -> int:  # returns user_id
    if not session: raise HTTPException(401, "Login required")
    return session["user_id"]
```

**3.3 Helpers** — `now_iso()`, `json_col()` load/dump, a `record_event()` for audit rows.

**3.4 Conventions** — every user-scoped table has `user_id`; every list endpoint filters by it; timestamps are ISO-8601 UTC.

---

## 4. Phase 1 — Application Tracker / CRM

**Goal:** turn every drafted/sent email into a tracked application with a pipeline.

**User story:** *"I contacted 40 companies — show me who replied and who needs a follow-up."*

### 4.1 Data model
```sql
CREATE TABLE applications (
  id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, company_id INTEGER,
  company_name TEXT, status TEXT DEFAULT 'saved',      -- saved|applied|replied|interview|offer|rejected
  fit_score INTEGER, email_to TEXT, subject TEXT, body TEXT,
  applied_at TEXT, last_action_at TEXT, next_followup_at TEXT,
  followup_count INTEGER DEFAULT 0, notes TEXT, created_at TEXT );

CREATE TABLE application_events (
  id INTEGER PRIMARY KEY, application_id INTEGER NOT NULL,
  type TEXT,             -- draft|sent|opened|replied|status_change|followup
  detail TEXT, created_at TEXT );

CREATE INDEX idx_app_user ON applications(user_id, status);
```

### 4.2 Status machine
```
saved → applied → replied → interview → offer
                     ↘ rejected (from any)
```
Rules: `applied` sets `applied_at`, `next_followup_at = +5 days`. `replied` clears follow-up. Each transition writes an `application_events` row.

### 4.3 Endpoints
| Method | Path | Body / Query | Returns |
|---|---|---|---|
| POST | `/api/applications` | `{company_id, email_to, subject, body, fit_score}` | created app |
| GET | `/api/applications` | `?status=&q=` | `[app...]` |
| GET | `/api/applications/board` | — | `{saved:[], applied:[], ...}` |
| PATCH | `/api/applications/{id}` | `{status?, notes?}` | updated app |
| GET | `/api/applications/{id}/timeline` | — | `[events...]` |
| GET | `/api/applications/followups` | — | apps with `next_followup_at <= now` |
| DELETE | `/api/applications/{id}` | — | ok |

**Response shape (app):**
```json
{ "id": 12, "company_name": "TatvaSoft", "status": "applied",
  "fit_score": 82, "email_to": "hr@tatvasoft.com",
  "applied_at": "2026-07-03T09:00:00Z", "next_followup_at": "2026-07-08T09:00:00Z",
  "followup_count": 0 }
```

### 4.4 Integration hooks
- In `/api/send-email` success → `POST /api/applications` automatically (status `applied`).
- In `/api/draft-email` → create with status `saved`.

### 4.5 UI
- **Kanban board** tab (6 columns, drag to change status).
- **Company card:** logo (`/api/company-logo`), fit score chip, last action, "Follow up" button.
- **Follow-ups widget** on dashboard: count of due reminders.

### 4.6 Tests
- create → appears in board under `saved`
- send-email hook → status `applied`, follow-up date set
- PATCH to `replied` → follow-up cleared, event logged
- followups endpoint returns only overdue

---

## 5. Phase 1 — Explainable Fit Score

**Goal:** every match shows a 0–100 score **and the reasons**.

### 5.1 Scoring formula
```
score = round(
   0.45 * semantic_sim          # 1 - Chroma cosine distance (0..1)
 + 0.30 * skill_overlap         # |resume_skills ∩ company_roles| / |resume_skills|
 + 0.15 * location_match        # 1 if company city in user's target cities
 + 0.10 * has_contact           # 1 if company has HR email/phone
) * 100
```
Clamp 0–100. Tunable weights in a config dict.

### 5.2 Reasons builder
Emit human strings: `"7/9 skills match (Python, PyTorch, NLP…)"`, `"Located in Ahmedabad"`, `"AI/ML role match"`, `"HR email available"`.

### 5.3 Endpoint change
Extend `/api/match` response:
```json
{ "company_id": 218, "name": "Apexon", "fit_score": 88,
  "reasons": ["8/9 skills match", "Ahmedabad", "AI/ML role", "HR email available"],
  "breakdown": {"semantic":0.83,"skills":0.89,"location":1,"contact":1} }
```
No new tables. Pure function `score_fit(user, company, distance)`.

### 5.4 Tests
- identical skills → high skill component
- out-of-city company → location = 0
- deterministic given fixed inputs

---

## 6. Phase 2 — Job-Hunt Autopilot (LangGraph)

**Goal:** one action runs the whole pipeline autonomously, with a human gate before any send.

**User story:** *"Run my job hunt for AI/ML roles in Ahmedabad — show me drafts to approve."*

### 6.1 LangGraph node graph
```
START
 → load_profile        (resume_text, skills, target_role, target_cities)
 → rag_match(N)         (comonk_rag.search_companies)
 → score_and_rank      (score_fit per match; keep top K)
 → FOR each company:
       draft_email      (reuse draft-email logic, tailored)
       stage_for_review (status=saved, queued)
 → await_human_approval (PAUSE — persisted state)
 → send_approved        (reuse send-email; create applications)
 → schedule_followups   (next_followup_at)
 → summarize_run        (counts, response-rate baseline)
END
```
- Use LangGraph **checkpointer** to persist state so a run pauses at `await_human_approval` and resumes on approve.
- Each node is a thin wrapper over existing endpoint logic (DRY).

### 6.2 Data model
```sql
CREATE TABLE autopilot_runs (
  id INTEGER PRIMARY KEY, user_id INTEGER, status TEXT,   -- running|awaiting_approval|completed|failed
  params TEXT, state_json TEXT, summary TEXT, created_at TEXT, updated_at TEXT );

CREATE TABLE autopilot_drafts (
  id INTEGER PRIMARY KEY, run_id INTEGER, company_id INTEGER,
  company_name TEXT, fit_score INTEGER, email_to TEXT,
  subject TEXT, body TEXT, approved INTEGER DEFAULT 0, sent INTEGER DEFAULT 0 );
```

### 6.3 Endpoints
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/autopilot/run` | `{target_role, cities, n_companies, tone}` | `{run_id, status}` |
| GET | `/api/autopilot/{run_id}` | — | run + drafts |
| POST | `/api/autopilot/{run_id}/approve` | `{draft_ids:[...], reject_ids:[...]}` | send result |
| POST | `/api/autopilot/{run_id}/cancel` | — | ok |

### 6.4 Guardrails
- **Never auto-send** — always pause for approval (spam + DPDP compliance).
- Cap `n_companies` (e.g. ≤ 25/run) and enforce per-user daily send limit via existing rate-limiter.
- Deduplicate: skip companies already in `applications` for this user.

### 6.5 Tests
- run pauses at `awaiting_approval` with N drafts
- approve subset → only those sent, applications created
- resume after restart (checkpointer) works
- dedupe skips already-contacted companies

---

## 7. Phase 2 — Reply detection & smart follow-up

**Goal:** detect HR replies, auto-advance status, draft a context-aware response.

### 7.1 Two modes
1. **Connected inbox (opt-in):** Gmail API (OAuth) or IMAP. Poll for replies to `email_to` addresses of open applications.
2. **Manual fallback:** user clicks "Mark replied" → generate follow-up.

### 7.2 Logic
```
poll_inbox(user) → for each new message:
   match sender/subject → application → status=replied, log event
   → generate suggested reply (Gemini, using thread + company context)
```
Store OAuth tokens encrypted; scope = read-only + send.

### 7.3 Endpoints
- `POST /api/inbox/connect` (OAuth callback) · `POST /api/inbox/sync`
- `POST /api/applications/{id}/mark-replied`
- `POST /api/applications/{id}/followup` → returns drafted follow-up

### 7.4 Table
```sql
CREATE TABLE inbox_tokens (user_id INTEGER PRIMARY KEY, provider TEXT,
  access_token TEXT, refresh_token TEXT, expires_at TEXT);
```

### 7.5 Tests
- incoming reply flips status + logs event
- follow-up generator uses prior email + company context
- token refresh handled

---

## 8. Phase 2 — Referral / warm-intro finder

**Goal:** use the **1,837 LinkedIn HR profiles** already in the sheet for warm intros.

### 8.1 Data prep
- Index the `LinkedIn Profiles` sheet into a table:
```sql
CREATE TABLE hr_profiles (
  id INTEGER PRIMARY KEY, full_name TEXT, linkedin_url TEXT,
  company_norm TEXT, city TEXT, category TEXT, phone TEXT, notes TEXT );
```
- Add during `db_setup.py`. Match to companies by normalized name (reuse `match_linkedin_to_mnc.py` logic).

### 8.2 Endpoint
`GET /api/referrals/{company_id}` →
```json
{ "company": "Hexaware", "profiles": [
  {"name":"Prachi Hedau","linkedin":"...","role":"TA Manager",
   "suggested_message":"Hi Prachi, I'm an AI/ML engineer in Ahmedabad…"} ] }
```
- Generate the connection note with Gemini using the user's profile + the recruiter's role.

### 8.3 Tests
- returns matched profiles for a company that has them
- graceful empty state when none
- message ≤ LinkedIn 300-char connect-note limit

---

## 9. Phase 3 — Company-specific voice mock interview

**Goal:** realistic voice interview with questions specific to the matched company.

### 9.1 Flow
```
start(company_id, role) → pull company stack/roles from DB
 → generate N questions (Gemini, grounded in company + role)
 → loop: TTS question → browser STT captures answer
        → Gemini scores answer (relevance, depth, communication)
 → final report (per-answer feedback + overall score + tips)
```
- **STT:** browser Web Speech API (client) — no server audio needed.
- **TTS:** existing speech-synthesis feature.
- **Streaming:** WebSocket or SSE for turn-by-turn.

### 9.2 Endpoints
- `POST /api/mock-interview/voice/start` → `{session_id, first_question}`
- `POST /api/mock-interview/voice/answer` → `{score, feedback, next_question|done}`
- `GET  /api/mock-interview/voice/{session_id}/report`

### 9.3 Table
```sql
CREATE TABLE interview_sessions (
  id INTEGER PRIMARY KEY, user_id INTEGER, company_id INTEGER,
  questions TEXT, answers TEXT, scores TEXT, report TEXT, created_at TEXT );
```

### 9.4 Tests
- questions reference the company's real stack
- scoring returns structured feedback
- report aggregates correctly

---

## 10. Phase 3 — Resume ↔ JD gap analysis & auto-tailor

**Goal:** paste a JD → see gaps → auto-tailor resume + cover letter (PDF).

### 10.1 Flow
```
extract_jd_skills(jd) ∩/∖ resume_skills → gap heatmap
 → rewrite_bullets(resume, jd)          → tailored bullets
 → render_pdf(tailored_resume, cover)   → downloadable
```

### 10.2 Endpoints
- `POST /api/jd-gap` `{jd_text}` → `{have:[], missing:[], match_pct}`
- `POST /api/tailor-resume` `{jd_text}` → `{resume_md, cover_md, pdf_url}`

### 10.3 Deps
- PDF: `reportlab` or `weasyprint` (HTML→PDF).
- Reuse existing resume parse + ATS-optimize logic.

### 10.4 Tests
- missing-skills list is correct for a known JD
- PDF renders & downloads
- tailored bullets keep facts (no fabrication)

---

## 11. Phase 3 — Adaptive learning path

**Goal:** turn fit-score skill gaps into a tracked learning plan.

### 11.1 Flow
`gaps (from §5) → ordered plan → attach resources (/api/roadmaps, /api/learning-resources, /api/youtube-tutorials) → track completion`

### 11.2 Table
```sql
CREATE TABLE learning_progress (
  id INTEGER PRIMARY KEY, user_id INTEGER, skill TEXT,
  resource_url TEXT, status TEXT DEFAULT 'todo', updated_at TEXT );  -- todo|doing|done
```

### 11.3 Endpoints
- `GET /api/learning/plan` (generate from gaps)
- `PATCH /api/learning/{id}` `{status}`
- `GET /api/learning/progress` (% complete)

---

## 12. Phase 3 — Hindi / Gujarati mode

**Goal:** local-language guidance — a real edge for the Ahmedabad audience.

### 12.1 Implementation
- Add `lang` param (`en|hi|gu`) to chat/guidance/roadmap endpoints.
- Inject into Gemini system prompt: *"Respond in Gujarati."*
- Persist `users.pref_lang`; default from browser `Accept-Language`.
- UI: language switcher in header; keep labels in an i18n dict.

### 12.2 Tests
- `lang=gu` returns Gujarati text
- fallback to English on unsupported

---

## 13. Full data model

New tables introduced (all keyed by `user_id` where user-scoped):

| Table | Purpose | Feature |
|---|---|---|
| `users` | profile, skills, resume, pref_lang | shared |
| `applications` | outreach pipeline | 4 |
| `application_events` | audit timeline | 4 |
| `autopilot_runs` | agent runs + state | 6 |
| `autopilot_drafts` | queued emails for approval | 6 |
| `inbox_tokens` | Gmail/IMAP OAuth | 7 |
| `hr_profiles` | LinkedIn recruiter data | 8 |
| `interview_sessions` | voice interview logs | 9 |
| `learning_progress` | learning tracker | 11 |

`companies` and `contacts` are unchanged. All added in `db_setup.py` with `CREATE TABLE IF NOT EXISTS`.

---

## 14. Compliance & safety

- **DPDP Act 2023 (India):** only use first-party / publicly-listed business contacts already in the sheet. **No purchased/scraped personal lists.**
- **Anti-spam:** Autopilot **never** auto-sends — human approval gate on every email. Honor unsubscribe; include sender identity.
- **Rate limits:** per-user daily send cap; heavier limits on autopilot + email endpoints (reuse existing middleware).
- **Secrets:** OAuth/API tokens encrypted at rest; never in the repo.
- **PII:** resume text is user-owned; allow delete-my-data.

---

## 15. Testing strategy

- **Unit:** scoring (`score_fit`), status machine, slug/domain helpers.
- **Integration:** each endpoint with a seeded temp SQLite; assert DB side-effects + response shape.
- **Agent:** deterministic Autopilot run with a stubbed LLM → verify pause/approve/send/dedupe.
- **Regression:** the Excel→DB loader (`min_row=2`, new columns) — assert 2,008 rows, correct field alignment (guards against another layout break).
- **Smoke (pre-deploy):** `db_setup.py` rebuilds cleanly; `/api/stats` responds; one `/api/match` returns fit scores.

---

## 16. Deployment notes

- **Migrations:** since SQLite, run `CREATE TABLE IF NOT EXISTS` on startup (idempotent). Keep a `schema_version` row for future changes.
- **Excel/DB sync:** on deploy, run `db_setup.py` (or commit the rebuilt `comonk.db`); **clear the old ChromaDB dir** so it re-indexes with the new layout.
- **Env vars:** Gemini key, email provider key (Brevo/Resend), Gmail OAuth creds, encryption key.
- **Docker:** add `reportlab`/`weasyprint` to `requirements_comonk.txt` for PDF; ensure system deps for weasyprint if used.
- **Rollback:** keep `comonk.db.bak` and `..._PREFORMAT.xlsx` backups (already on disk).

---

### First sprint (recommended)
1. `users` + auth dependency (§3)
2. **Application Tracker** (§4) — schema, endpoints, send-email hook, Kanban UI
3. **Fit Score** (§5) — extend `/api/match`
4. **Referral finder** (§8) — index `hr_profiles`, endpoint

→ Ship. Comonk now *manages* the job hunt. Then build **Autopilot** (§6) on top.

---

> ## ✅ Status (2026-07): Phases 1–3 are ALREADY IMPLEMENTED
> `comonk_backend.py` ships **108 endpoints** covering every feature in §4–§12 (Tracker, Fit Score,
> Autopilot with approval gate, Referrals, Reply detection, Voice interview, JD-gap, Learning path,
> Hindi/Gujarati) plus enterprise extras (Company Intel, Outreach Analytics, Cold Email Scorer,
> Offer Comparator, Daily Briefing). The section below (**Phase 4**) is the *new* roadmap.

---

## 17. Phase 4 — New advanced features (roadmap)

New capabilities beyond what's already built. Ordered by impact; ⚡ = leverages a tool already installed.

| # | Feature | Effort | Value | Leverages |
|---|---|---|---|---|
| 17.1 | ⚡ WhatsApp Assistant | M | ⭐⭐⭐⭐⭐ | Twilio (already used) |
| 17.2 | ⚡ Auto-Apply Agent | L | ⭐⭐⭐⭐⭐ | Playwright (already installed) |
| 17.3 | Hiring-Signal Detector | M | ⭐⭐⭐⭐ | jobs APIs + news |
| 17.4 | Video Mock Interview Analysis | L | ⭐⭐⭐⭐ | webcam + Gemini vision |
| 17.5 | Smart Send-Time + Email A/B | S–M | ⭐⭐⭐⭐ | tracker + analytics |
| 17.6 | Skill-Demand Market Analytics | M | ⭐⭐⭐ | JD mining |
| 17.7 | Portfolio Project Generator | M | ⭐⭐⭐ | GitHub API |
| 17.8 | Recruiter Portal (two-sided) | L | ⭐⭐⭐⭐ | monetization |
| 17.9 | Spaced-repetition prep | S–M | ⭐⭐⭐ | questions bank |
| 17.10 | Calendar + Interview Scheduler | S | ⭐⭐⭐ | Google Calendar |

### 17.1 WhatsApp Assistant ⚡  *(build first)*
**Goal:** the whole Comonk agent inside WhatsApp — India's default channel.
- **Flow:** Twilio WhatsApp webhook → intent parse (Gemini) → route to existing endpoints (match, draft, autopilot-approve, interview prep) → reply. Session keyed by phone number → `users`.
- **Endpoints:** `POST /api/whatsapp/webhook` (Twilio inbound), `POST /api/whatsapp/send`.
- **Table:** `whatsapp_sessions(phone TEXT PRIMARY KEY, user_id INT, context_json TEXT, updated_at TEXT)`.
- **Commands:** `find <role>`, `apply`, `status`, `interview`, `stop`.
- **Compliance:** opt-in only; honor `stop`; WhatsApp template rules for outbound.

### 17.2 Auto-Apply Agent ⚡
**Goal:** actually submit applications on Naukri / company career pages, not just email.
- **Flow (Playwright, headless):** open career URL (from `companies.website`/careers) → detect form → fill from `users` profile + resume → **screenshot preview → human approve → submit** → log to `applications`.
- **Endpoints:** `POST /api/autoapply/run` (queues), `GET /api/autoapply/{id}` (preview + status), `POST /api/autoapply/{id}/approve`.
- **Table:** `autoapply_jobs(id, user_id, company_id, url, status, screenshot_path, result, created_at)`.
- **Guardrails:** never submit without approval; respect site ToS/robots; rate-limit; CAPTCHA → hand back to user.

### 17.3 Hiring-Signal Detector
**Goal:** prioritize companies **hiring right now**.
- Aggregate signals per company: recent job posts (Adzuna/Greenhouse/Internshala already integrated), funding/news mentions, LinkedIn activity → `hiring_score`.
- Endpoint: `GET /api/companies/{id}/signals`; boost `fit_score` and autopilot ranking by freshness.
- Table: `company_signals(company_id, hiring_score, last_seen, sources_json, updated_at)` (refreshed by a daily job).

### 17.4 Video Mock Interview Analysis
- Webcam in browser → sample frames + audio → Gemini vision/audio scoring: filler words, pace (WPM), eye-contact %, confidence. Extends voice interview.
- Endpoint: `POST /api/mock-interview/video/analyze` → per-metric feedback.

### 17.5 Smart Send-Time + Email A/B
- Store 2 subject variants per campaign; pick send window (e.g. Tue–Thu 10–11am IST); attribute replies → winning variant. Feeds Outreach Analytics.
- Tables: `email_variants`, `email_sends(variant_id, sent_at, opened, replied)`.

### 17.6 Skill-Demand Market Analytics
- Mine live JDs (jobs APIs) → extract skills → trend counts for Ahmedabad AI/ML. Endpoint `GET /api/market/skills?city=&role=` → ranked skills + trend. Powers learning-path prioritization.

### 17.7 Portfolio Project Generator
- Given target companies' stacks (from DB) + user gaps → propose 3 portfolio projects + a GitHub repo scaffold (README, structure). Endpoint `POST /api/portfolio/suggest`.

### 17.8 Recruiter Portal (two-sided marketplace)
- Recruiter role: post roles, semantic-search the candidate pool (opt-in profiles), shortlist. Monetization path. New `recruiters`, `job_posts`, `candidate_optin` tables + `/api/recruiter/*`.

### 17.9 Spaced-repetition interview prep
- Adaptive DSA/ML flashcards using SM-2 scheduling over the existing `questions.py` bank. Table `flashcard_reviews(user_id, card_id, ease, due_at)`.

### 17.10 Calendar + Interview Scheduler
- Google Calendar OAuth → create interview events from `applications` status=`interview`; reminders via WhatsApp/email. Endpoint `POST /api/calendar/schedule`.

### Recommended Phase 4 order
1. **17.1 WhatsApp Assistant** — biggest adoption lever, reuses Twilio.
2. **17.2 Auto-Apply Agent** — reuses Playwright; completes the autonomous loop.
3. **17.3 Hiring-Signal Detector** — makes every match/autopilot smarter.
4. Then 17.5 / 17.6 (analytics), 17.4 (video), 17.8 (marketplace) by demand.

_Compliance still applies: opt-in, human approval before any send/submit, DPDP-safe (no scraped personal lists), honor stop/unsubscribe._

