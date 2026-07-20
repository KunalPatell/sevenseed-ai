# Comonk AI — Enterprise Career Platform · Master Plan

> **Purpose:** If this conversation runs out of context, paste this file to any AI to continue exactly where we left off.

---

## Project Overview

**Platform:** Comonk AI — 100% free enterprise career guidance for Ahmedabad/Gandhinagar IT/AI/ML market  
**Stack:** FastAPI + LangGraph (backend) · Vanilla JS + Chart.js (frontend) · ChromaDB RAG · Groq LLaMA 3.3 70B  
**Primary files:**
- `c:/Users/Capermint/Project/linkdin/comonk_backend.py` — FastAPI server (~2300+ lines)
- `c:/Users/Capermint/Project/linkdin/frontend/index.html` — Single-page app HTML
- `c:/Users/Capermint/Project/linkdin/frontend/app.js` — All frontend JS (~2900+ lines)
- `c:/Users/Capermint/Project/linkdin/frontend/style.css` — Enterprise dark design (~1600+ lines)
- `c:/Users/Capermint/Project/linkdin/.env` — All API keys (see Keys section below)
- `c:/Users/Capermint/Project/linkdin/comonk_agents.py` — LangGraph multi-agent
- `c:/Users/Capermint/Project/linkdin/data/companies.xlsx` — 541 Ahmedabad/Gandhinagar companies

**Run server:** `python comonk_backend.py` (starts at http://localhost:8000)

---

## ✅ COMPLETED FEATURES

### Backend Endpoints (all working at /api/...)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server status |
| `/api/parse-resume` | POST | Resume parsing via LangGraph |
| `/api/match` | POST | Company matching via ChromaDB |
| `/api/chat` | POST | AI career counselor (Groq) |
| `/api/ats` | POST | ATS resume analyzer |
| `/api/linkedin-optimize` | POST | LinkedIn profile optimizer |
| `/api/salary` | POST | Salary estimator |
| `/api/roadmap` | POST | Career roadmap generator |
| `/api/interview` | POST | Interview Q&A generator |
| `/api/jobs` | GET | Live jobs (RemoteOK, Remotive, Adzuna) |
| `/api/articles` | GET | Dev.to tech articles |
| `/api/youtube` | GET | YouTube tutorials (key needed) |
| `/api/news` | GET | Tech news (GNews/NewsAPI) |
| `/api/weather` | GET | Open-Meteo weather for city |
| `/api/grammar-check` | POST | LanguageTool grammar check |
| `/api/exchange-rates` | GET | Open ER-API currency rates |
| `/api/github-trending` | GET | GitHub trending repos |
| `/api/stackoverflow` | GET | Stack Overflow Q&A |
| `/api/hn-jobs` | GET | HackerNews jobs |
| `/api/reddit-feed` | GET | Reddit career feed |
| `/api/qrcode` | GET | QR code generator |
| `/api/company-logo` | GET | Clearbit logos |
| `/api/telegram-alert` | POST | Telegram bot alert |
| `/api/send-email` | POST | Brevo email |
| `/api/gemini-chat` | POST | Google Gemini Flash |
| `/api/wakatime-stats` | GET | WakaTime coding stats |
| `/api/product-hunt` | GET | Product Hunt trending |
| `/api/study-quote` | GET | Motivational study quote |
| `/api/wikipedia-info` | GET | Wikipedia company info |
| `/api/leetcode-stats/{username}` | GET | LeetCode profile stats |
| `/api/codeforces/{handle}` | GET | Codeforces rating |
| `/api/npm-stats` | GET | npm package download stats |
| `/api/greenhouse-jobs` | GET | Greenhouse job boards |
| `/api/internshala` | GET | India job boards (Internshala etc.) |
| `/api/discord-alert` | POST | Discord webhook alert |
| `/api/validate-email` | GET | Abstract API email validation |
| `/api/openrouter-chat` | POST | OpenRouter 50+ LLMs |
| `/api/cohere-chat` | POST | Cohere Command-R+ |
| `/api/calendar-link` | GET | Google Calendar event link |
| `/api/skill-demand` | GET | Skill demand heatmap (Adzuna) |
| `/api/avatar` | GET | DiceBear avatar |
| `/api/cheatsheets` | GET | Curated cheatsheet links |
| `/api/roadmaps` | GET | roadmap.sh catalog (31 roadmaps) |

### Frontend Panels (all implemented)
- **Overview** — profile stats, skills radar chart, application progress chart, weather card, interview countdown
- **AI Counselor** — chat with LangGraph agent
- **Company Targets** — RAG-matched Ahmedabad/Gandhinagar companies
- **ATS Optimizer** — grammar check + PDF export
- **LinkedIn Optimizer** — profile text optimization
- **Salary Intel** — salary estimate + FX rates (USD/EUR/GBP)
- **Career Roadmap** — AI roadmap + roadmap.sh official cards
- **Learning Hub** — Articles, YouTube, News, Cheat Sheets, Roadmaps, GitHub Trending, Product Hunt tabs
- **Live Jobs** — RemoteOK, Remotive, Adzuna India, HN Hiring, Reddit, Greenhouse, India Boards
- **Interview Prep** — AI Q&A + STAR method templates (6 behavioral questions, collapsible)
- **Application Tracker** — Kanban board + CSV export
- **Trending Repos** — GitHub trending panel
- **Stack Overflow** — SO questions by skill
- **Coding Stats** — LeetCode, Codeforces, npm, Wikipedia company info
- **Flashcards** — Spaced repetition cards for Python, ML, SQL, System Design, Git, Docker, JS, OS (8 topics, 4-6 cards each)
- **Network Contact Log** — Add/delete LinkedIn connections, stored in localStorage
- **Skill Heatmap** — Live demand visualization from Adzuna job listings
- **Focus Timer** — Pomodoro with SVG ring, WakaTime integration, tasks, quotes
- **Job Alerts Setup** — Telegram, Brevo, Gemini, WakaTime, QR Code, Product Hunt, Discord, OpenRouter, Cohere, Abstract API (email validation)

### Global Features
- Dark/light mode toggle (theme-toggle button in topbar)
- Weather pill widget in topbar (auto-loads on startup)
- DiceBear avatar auto-set from name
- Toast notifications
- Skill chips, company cards with Clearbit logos

---

## API Keys Status

Keys already working:
- `GROQ_API_KEY` — filled ✓
- `MISTRAL_API_KEY` — filled ✓
- `NEWSAPI_KEY` — filled ✓
- `GNEWS_API_KEY` — filled ✓
- `ADZUNA_APP_ID` + `ADZUNA_API_KEY` — filled ✓
- `HUNTER_API_KEY` — filled ✓
- `TWILIO_ACCOUNT_SID` — filled (but TWILIO_AUTH_TOKEN + TWILIO_FROM_NUMBER missing)

Keys needing signup (all free):
| Key | Signup URL |
|-----|-----------|
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Telegram → @BotFather |
| `BREVO_API_KEY` | https://app.brevo.com |
| `GEMINI_API_KEY` | https://aistudio.google.com |
| `WAKATIME_API_KEY` | https://wakatime.com/settings/api-key |
| `OPENROUTER_API_KEY` | https://openrouter.ai |
| `COHERE_API_KEY` | https://dashboard.cohere.com |
| `DISCORD_WEBHOOK_URL` | Discord → Server Settings → Webhooks |
| `ABSTRACT_API_KEY` | https://app.abstractapi.com/api/email-validation |
| `GITHUB_TOKEN` | https://github.com/settings/tokens |
| `YOUTUBE_API_KEY` | https://console.cloud.google.com → YouTube Data API v3 |

---

## Architecture

```
Browser (index.html + app.js + style.css)
  └─ fetch() → FastAPI (comonk_backend.py :8000)
       ├─ /api/parse-resume → LangGraph (comonk_agents.py) → Groq LLaMA 3.3 70B
       ├─ /api/match        → ChromaDB (541 Ahmedabad companies)
       ├─ /api/chat         → LangGraph multi-agent
       └─ /api/*            → External APIs (no-key or with .env key)
```

### JS Global State Object `S`
```js
S = {
  profile: { name, skills, experience, education, target_roles, seniority_level, ... },
  companies: [],   // matched companies
  allJobs: [],     // live jobs
  apps: [],        // kanban applications (also in localStorage 'comonk_apps')
  jobSrc: 'all',
  learnTab: 'articles',
  activePanel: 'overview',
  stats: {}
}
```

### Helper Functions
- `$(id)` → `document.getElementById(id)`
- `$$(sel)` → `document.querySelectorAll(sel)`
- `api(method, path, body)` → fetch wrapper returns JSON
- `escHtml(str)` → XSS-safe HTML escape
- `toast(msg, type)` → notification toast

---

## ✅ Auth + Test + Admin (COMPLETED)

### Backend endpoints added to comonk_backend.py
- `POST /api/auth/register` — name, email, phone, password, target_role, city → OTP via Resend
- `POST /api/auth/verify-otp` — 6-digit OTP → returns Bearer token
- `POST /api/auth/login` — email + password → Bearer token
- `GET /api/auth/me` — returns user profile (requires Bearer token)
- `POST /api/auth/logout` — deletes session
- `GET /api/test/questions` — 20 shuffled questions for user's role (24h cooldown, verified users skipped)
- `POST /api/test/submit` — scores answers, updates verified status if 14/20+ and strikes ≤ 3
- `GET /api/contacts/my-usage` — shows monthly quota (5 free, resets monthly)
- `POST /api/contacts/request` — auto-approves if within quota, else sends to admin queue
- `GET /api/admin/stats` — KPI dashboard (Authorization: Admin <ADMIN_PW>)
- `GET /api/admin/users` — paginated user list
- `GET /api/admin/requests` — pending contact requests
- `GET /api/admin/test-attempts` — last 50 test sessions with suspicious flag
- `POST /api/admin/approve` — approve + email contacts via Resend
- `POST /api/admin/reject` — reject with note
- `DELETE /api/admin/user/{id}` — delete user + all data

### Frontend added
- Login modal (login/register/OTP tabs) — triggered by Login button in topbar or locked panels
- `Auth` JS object — token/user in localStorage, `headers()`, `isLoggedIn()`
- `AntiCheat` JS engine — visibilitychange, window blur, fullscreen, DevTools detect, copy/paste block, keyboard shortcuts
- Aptitude test panel (`panel-test`) — intro screen, fullscreen enforcement, timer ring per question, strike counter
- Admin panel (`panel-admin`) — password wall, KPI cards, pending requests table, users table, attempts table
- Verified badge in topbar and sidebar
- Admin sidebar button (visible only for admin email)

### DB tables (SQLite: comonk.db)
- `users` — name, email, phone, password_hash, target_role, city, is_verified, is_email_verified, otp, otp_expires, contacts_used, contacts_month
- `sessions` — user_id, token, expires_at
- `test_attempts` — user_id, score, total, passed, role, tab_switches, time_taken, suspicious, ip
- `contact_requests` — user_id, company_ids (JSON), status, admin_note

### Tier system
- **Free** — no login needed, all public panels accessible
- **Verified** — passed aptitude test (14/20, no tab cheating) → 5 HR contacts/month free
- **Admin** — Kunal's email → full admin panel, approve/reject requests

## ✅ Enterprise Onboarding Flow (COMPLETED + E2E TESTED)

### Flow
`Landing → [Get Started Free] → Onboarding stepper → Dashboard`
Stepper: **1 Account → 2 Verify OTP → 3 Resume → 4 Ready → Enter Dashboard**
- Returning users: **[Login]** → if saved profile exists, auto-launch dashboard; else resume at step 3
- Landing resume upload/demo is GATED — non-logged-in users are routed into onboarding (file/demo stashed, auto-parsed after OTP)

### Backend additions
- `users.profile_json` column + `_migrate()` (ALTER TABLE for existing DBs)
- `POST /api/auth/save-profile` (Bearer auth) — persists parsed resume profile
- login / verify-otp / me responses now include `profile`
- `_db()` hardened: WAL mode + 15s busy_timeout
- **Bug fixed**: verify-otp called `_make_token()` (2nd connection) inside an open write txn → SQLite self-deadlock ("database is locked"). Moved token creation after the `with _db()` block closes.

### Frontend additions
- Landing nav: Login + Get Started Free buttons
- `#onboarding` overlay — left gradient brand panel + right stepper (enterprise SaaS look)
- 6-box OTP input with auto-advance / backspace / paste
- `initOnboarding()`, `startOnboarding()`, `obGoStep()`, `obHandleResume()`, `obLoadDemo()`, `obAfterProfile()`, `finishOnboarding()`, `afterLogin()` routing
- Profile saved server-side on completion; cached in `Auth.user.profile`

### E2E test result (all PASS)
register → verify-otp → save-profile → me(returns profile) → login(returns profile) → test/questions(20) → test/submit(20/20 → verified=1) → admin/stats

### CSS bug fixed this session
Auth/test/admin panels used `--s2/--b1/--text-1/--surface-2` tokens that ONLY exist in `body.light-mode`. In default DARK mode they rendered with broken/invisible backgrounds. Rewrote all to real design tokens (`--bg-2/--bg-3/--border/--text/--c-purple`) + added glass blur, depth, animations.

## ✅ ALL 4 Promised Features — COMPLETED

1. **AI Mock Interview** — `panel-mockvoice` · Web Speech API voice recording · 5 AI questions per role · per-answer scoring on clarity/STAR/confidence/relevance · results modal with radar scores
2. **SMS / WhatsApp alerts** — `POST /api/sms-alert` · Twilio REST · SMS + WhatsApp via channel toggle · graceful "not configured" if env vars missing · card in Alerts panel with setup steps + test button
3. **Calendar / scheduler** — `panel-calendar` · localStorage events · month grid · add/edit/delete events modal · upcoming events sidebar
4. **Resume rewriter + cover letter** — `POST /api/resume-rewrite` + `POST /api/cover-letter` · `panel-resumestudio` · ATS bullets/keywords/skills · tailored 220-300 word cover letter per company

## ✅ Enterprise Upgrade Pass (v5 — All Completed)

### Landing Page Revolution
- **Canvas particle system** (`initParticles()`) — 55 animated particles with connection lines, runs on `#hero-particles` canvas behind hero
- **Company name marquee** — 24-company auto-scrolling strip below hero stats (CSS `@keyframes marqueeScroll`)
- **"How It Works" section** — 4-step grid with numbered cards and hover animations (`how-works-sec`)
- **CTA section** — full-width bottom call-to-action with trust badges and gradient glow

### Dashboard Overview Revolution
- **AI Career Score Ring** — `computeCareerScore()` returns 0-100 from profile/skills/apps/interview pts; `renderScoreRing()` draws animated Canvas arc with gradient; grade label (Starting/Building/Good/Excellent); breakdown bars per dimension
- **Daily Career Tip** — `renderDailyTip()` — 12 rotating tips keyed by day-of-year; each tip has icon, text, and direct CTA button to the relevant panel
- **Activity Heatmap** — `renderActivityHeatmap()` — 30-cell GitHub-style grid; `trackActivity()` called on every `openPanel()` to record daily actions; streak counter
- **Achievement Badges** — `ACHIEVEMENTS` array with 8 badges; `renderAchievements()` checks unlock conditions and toasts new unlocks; persisted in `comonk_ach` localStorage

### Global Search (Cmd+K)
- `initGlobalSearch()` — wires Ctrl/Cmd+K keyboard shortcut, arrow navigation, Enter to select, Esc to close
- `SEARCH_INDEX` — 24 searchable panels with label, description, icon
- `openGSearch()` / `closeGSearch()` — overlay with blur backdrop, animated slide-in
- Topbar search box now triggers global search on click

## Pending / Optional Enhancements

1. **More Ahmedabad companies** — add more to `data/companies.xlsx`
2. **Resend verified domain** — currently sends to owner email only (Resend free tier limit); upgrade to send to any user
3. **ADMIN_PASSWORD in .env** — add `ADMIN_PASSWORD=comonk_admin_2026` to .env file

---

## Test Commands (run from project directory)

```bash
# Start server
python comonk_backend.py

# Quick API test (PowerShell)
Invoke-RestMethod http://localhost:8000/api/health
Invoke-RestMethod "http://localhost:8000/api/weather?city=ahmedabad"
Invoke-RestMethod "http://localhost:8000/api/skill-demand"

# Python batch test
python test_endpoints.py
```

---

## Continuation Instructions for Next AI

If you are reading this to continue the project:

1. **Start the server**: `cd c:/Users/Capermint/Project/linkdin && python comonk_backend.py`
2. **Open browser**: http://localhost:8000
3. **Current state**: All major features implemented and tested. Server passes health check.
4. **User preference**: Minimal token use, no unnecessary text, implement first then test at end.
5. **User goal**: AI/ML engineer job in Ahmedabad/Gandhinagar — this platform is to help with that job search.
6. **Key constraint**: Keep everything 100% free. If a feature needs an API key, provide the signup URL, don't skip the feature.

To verify everything works, run: `python test_endpoints.py` or test endpoints individually via PowerShell.
