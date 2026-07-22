# 🔴 HANDOFF LOG — READ THIS FIRST (session cut off, ~2 min warning)

**Saved at:** 2026-07-21, mid-session cutoff (previous session ran out of tokens)

This replaces all older handoff content. Old entries below this point are historical/superseded — trust this section first.

---

## ✅ DONE THIS SESSION (verified live)

### sevenseed-platform (hub + 6 sibling apps: avp-emart, avpu, breakdown-factor, avp-charitable-trust, decode-forest-pharmacy, sevenforce)
- Fixed a real OOM crash-loop on Render free tier (512MB): children now **lazy-start** on first request + **LRU-evict** (max 2 concurrently warm) instead of all 6 booting at once. File: `apps/sevenseed/backend/child_processes.py`.
- Added BYOK (bring-your-own-key) backend support to the 5 apps that lacked it (avp-emart, avpu, breakdown-factor, avp-charitable-trust, decode-forest-pharmacy) — pattern copied from sevenforce's working `app/api_keys.py` + middleware. 4 of these 5 apps' *frontends* already had a working BYOK UI (monkey-patched `window.fetch`, localStorage `user_*_key` keys, headers `X-Groq-API-Key` etc) built by another session — do NOT re-add a frontend BYOK layer, it already exists and works.
- Verified/fixed another session's in-progress "Phase 2" work (AI demo widgets, rate limiters, framer-motion animations) — found and fixed 2 real bugs where the widget's fetch calls hit the wrong URL (missing the app's own subpath prefix, e.g. `/breakdown`, `/trust`).
- **Found and fixed a fake credibility claim**: a "AWWWARDS SITE OF THE YEAR NOMINEE" badge appeared on all 7 marketing pages (6 Next.js apps' `src/app/page.tsx` + sevenforce's `backend/static/index.html`) — this award does not exist, it was fabricated. Replaced with an honest "100% FREE · NO CREDIT CARD REQUIRED" claim everywhere. **If you see this fake-award text reappear anywhere, remove it again — do not let it ship.**
- Confirmed via **actual screenshots** (Playwright, see below) that the real problem behind repeated "still not satisfied" feedback is that **all 8 sites share one literal template** (same section order/components, just palette-swapped), not a lack of visual effort. Founder wants genuine per-brand distinctiveness: named AI personas (Sintra.ai-style, SVG/CSS since no image-gen tool available), non-generic copy, structurally different layouts per app, mobile-checked.
- The `.marquee-track` scrolling ticker in each app's `globals.css` is **intentional** (continuously scrolls right-to-left), NOT a bug — a static screenshot just catches it mid-scroll and can look like cut-off text. Don't "fix" it by removing it — but see IN PROGRESS section, one agent found `.mask-image-gradient` (used to fade the marquee's edges) was never actually defined in CSS, that's a real bug worth checking/fixing.

### comonk-ai (separate repo/service — `E:\Project\My Startups\comonk`, NOT under sevenseed-platform)
- Fixed 4 real security issues in `comonk_backend.py`: weak SHA-256 password hashing → bcrypt (with legacy-hash fallback + auto-migrate-on-login, no forced resets), OTP/notification emails were hardcoded to the *owner's* address instead of the real user's (Resend free-tier limitation — fixed to send to the actual user, OTP-in-response fallback kept but now conditional on email genuinely failing), hardcoded admin password removed (was a public secret in source), removed a dead duplicate `/api/github-profile` route.
- **Full frontend rebuild**: replaced the old vanilla HTML/JS/CSS (5518-line `app.js`) with a real Next.js app — all **32 panels** (Overview, Daily Briefing, AI Counselor, Job Targets, Live Jobs, App Tracker, Autopilot, Outreach Analytics, Mock Interview, Resume Studio, Calendar, Interview Q&A, ATS Optimizer, LinkedIn, Learning Hub, Career Roadmap, Cheat Sheets, Resources Hub, Salary Insights, GitHub Analyzer, Email Scorer, Offer Comparator, Aptitude Test w/ real anti-cheat, Admin, API Keys, Trending Repos, StackOverflow, Coding Stats, Flashcards, Network Log, Skill Heatmap, Focus Timer, Job Alerts). Built via 4 parallel agents, each verified real endpoint shapes against the actual `comonk_backend.py` source (not guessed).
- Old vanilla frontend backed up (not deleted) at `E:\Project\My Startups\comonk\frontend-vanilla-backup\` (gitignored, local only).
- Fixed backend serving: `_FRONTEND_DIR` now points at `frontend/out` (the Next export), and fixed a real routing bug where `/app` (no trailing slash) would have silently served the landing page instead of the dashboard (Next's `trailingSlash: true` means routes export to `<path>/index.html`, not `<path>.html` — catch-all now checks both).
- Dockerfile: added a `node:20-alpine` build stage, final image only ships `frontend/out`.
- **Verified locally end-to-end before pushing** (ran the real backend against the real build) and **verified live after deploy** — this all actually works, not just "should work."
- Committed as `caf3181` (security) then `47f9fb2` (full rebuild) — **both pushed and LIVE** on Render.

---

## ⏳ IN PROGRESS — INTERRUPTED, NOT COMMITTED (pick this up first)

**4 background agents were dispatched** to redesign the Sevenseed hub + all 6 sibling apps for genuine per-brand distinctiveness (the real fix for the "not satisfied" feedback). **All 4 hit the session's own usage limit mid-task and were cut off before finishing/verifying/reporting.** Their last known status, from partial progress messages:
1. **Sevenseed hub** — was mid-fix on two real CSS bugs it found: `.eyebrow` class used but never defined, and `.mask-image-gradient` (used to fade the marquee's edges) also never defined. Unknown if it finished before cutoff.
2. **AVP Emart + AVPU** — was at the verification step (`tsc`/`next build`) when cut off. Unknown if it passed.
3. **Breakdown Factor + AVP Charitable Trust** — was mid-edit on AVP Trust's `page.tsx` (imports + HERO_STATS cleanup) when cut off — **likely left this file in a broken/half-edited state**, check carefully before trusting it compiles.
4. **Decode Forest Pharmacy + Sevenforce** — Decode Forest Pharmacy **did finish and pass verification** (`tsc --noEmit` and `next build` both exit 0, confirmed). Sevenforce was not started yet when cut off.

**Next steps, in order:**
1. Run `git status` in `E:\Project\sevenseed-platform` — expect uncommitted changes in some/all of `apps/sevenseed/frontend`, `apps/avp-emart/frontend`, `apps/avpu/frontend`, `apps/breakdown-factor/frontend`, `apps/avp-charitable-trust/frontend`, `apps/decode-forest-pharmacy/frontend`. Sevenforce's static files may or may not be touched.
2. **Do not trust any of it blindly** — re-run `tsc --noEmit` + `next build` yourself for every app with changes, especially AVP Trust (agent 3 was mid-edit when cut off, real risk of a syntax error or half-applied change).
3. **The user also said "i do some changes by myself at home, check that"** right as this cutoff happened — there may be ADDITIONAL local changes from the user directly, on top of the agents' work. Diff everything carefully before assuming what's there is only the agents' output.
4. Watch for the same class of bug already caught twice this session: hardcoded fetch URLs missing the app's own subpath prefix (`/breakdown`, `/trust`, `/pharmacy`, `/avpu`, `/avp-emart` — sevenseed and sevenforce have no prefix, they're not proxied).
5. Once verified: commit, then **push to BOTH remotes** (see Git section below — this is the #1 mistake to avoid, a whole session already lost hours because a push only went to `origin` and never reached the repo Render actually watches).
6. Take fresh Playwright screenshots after deploy to confirm the redesign actually shipped and looks distinctive (see Screenshot tooling below) — don't just trust build success.

---

## 🚨 STILL PENDING — NEEDS THE USER DIRECTLY (I cannot do these)

1. **Rotate the leaked GitHub token** — `comonk-ai`'s old git remote had a personal access token embedded in plaintext in the URL. Flagged multiple times across sessions, still not rotated as of this writing. GitHub → Settings → Developer settings → Personal access tokens → revoke the old one.
2. **Rotate the Render API key** — `rnd_DEBOFFOvZzKvH6ob7yy6C04qfZZ5` was pasted directly in chat by the user (twice). It's been used all session for legitimate Render API calls (checking deploys, logs, metrics) but having been pasted in a chat transcript, it should be rotated: Render dashboard → Account Settings → API Keys.

---

## 🔑 Key facts for whoever resumes

### Repo / drive locations
- Portable drive letter changes between office (`E:`) and home (`I:`) — same physical drive, same git repos. Check with a drive listing if paths don't resolve.
- `sevenseed-platform` monorepo: hub + 6 sibling apps (NOT comonk).
- `comonk` is a **separate repo/service**, at `<drive>:\Project\My Startups\comonk` — not part of the sevenseed-platform monorepo. There's also a stale, disconnected copy at `sevenseed-platform/apps/comonk/` left over from an abandoned "merge comonk into the monolith" experiment (tried and reverted) — **do not edit that copy**, it's not live anywhere, edit the real one at `My Startups\comonk`.

### Git remotes — the #1 thing to get right
`sevenseed-platform` has **two remotes**: `origin` → `github.com/KunalPatell/sevenseed-platform` and `ai` → `github.com/KunalPatell/sevenseed-ai`. **Render's `sevenseed` service watches the `ai` remote (`sevenseed-ai`), not `origin`.** Pushing only to `origin` silently does nothing on Render — this exact mistake already cost a previous session hours (4 commits sat unpushed-to-Render for hours before it was caught). Always: `git push ai main:master && git push origin main`.

`comonk`'s repo (`My Startups\comonk`) has a single remote `origin` → `github.com/KunalPatell/comonk-ai`, already fixed to NOT have an embedded token (uses the stored Windows Credential Manager credential instead) — just `git push origin main`.

### Render service IDs (for the Render API, key currently `rnd_DEBOFFOvZzKvH6ob7yy6C04qfZZ5` — rotate per above)
- Sevenseed hub: `srv-d9d03pt8nd3s73cbd3og` → https://sevenseed.onrender.com
- Comonk: `srv-d95lt5q8qa3s73e60e2g` → https://comonk-ai.onrender.com
- Both already grouped under one Render **Project** called "Sevenseed" (`prj-d8ub86e8bjmc73dkl330`) — this was already done, no action needed.
- To check deploy status: `GET https://api.render.com/v1/services/<id>/deploys?limit=5` with `Authorization: Bearer <key>`.
- To check logs: `GET https://api.render.com/v1/logs?ownerId=<owner>&resource=<id>&startTime=...&endTime=...` — owner ID is `tea-d8ub463eo5us73dommkg`.

### Environment gotchas
- **This shell has a recurring quirk**: a file written by `curl -o` in one Bash call sometimes isn't visible to a `python -c` in the same or next call (path-timing issue, not a real missing-file). Fix: write output to a small standalone `.py` script file with a hardcoded absolute path and run that, rather than inline `python -c` with a shell variable — this reliably works every time it's been tried.
- **PowerShell tool times out/deadlocks under load** — prefer the Bash tool for anything file-related in this environment.
- `git` commands need `-c safe.directory=*` (or `git config --global --add safe.directory <path>` once, but that's a config change — ask before doing it) — the drive is FAT32/network-mounted and git refuses to trust it by default otherwise.
- This `lucide-react` version (in comonk's new frontend, and possibly others) **has no brand/logo icons** — `Github`, `Linkedin`, etc. don't exist as exports. Verify any icon name with `node -e "console.log(!!require('lucide-react').IconName)"` before using it; substitutes already used: `GitBranch` for Github, `Share2` for Linkedin.
- Local `npm install` in this environment is very slow (~15-20 min per app) — when verifying a build, it's often faster to just push and let Render's own (much faster) build be the real test, *if* the change is low-risk (e.g. a proven, copy-pasted pattern). For anything touching auth/payment/security-sensitive logic, verify locally first regardless of speed.
- **This session hit its own usage limit multiple times** (resets shown as ~11:30am and ~9:30pm Asia/Calcutta at different points — it's a rolling/session-based limit, not a fixed daily reset). When background agents fail with "You've hit your session limit," that's this limit, not a bug — just wait for the stated reset time and retry the same dispatch.

### Screenshot tooling (for visual verification — use this, don't just trust "the build passed")
Playwright + Chromium already installed at `C:\Users\CAPERM~1\AppData\Local\Temp\claude\e--Project\41db268e-64dc-46cc-9065-48c6d1364910\scratchpad\pw` (has its own `package.json`/`node_modules`, chromium browser at `C:\Users\Capermint\AppData\Local\ms-playwright\`) — **note this scratchpad path is session-specific and may not exist in a fresh session; if missing, recreate**: `mkdir` a folder, `npm init -y`, `npm install playwright`, `npx playwright install chromium`. A working screenshot script pattern: launch chromium, `page.goto(url, {waitUntil either "domcontentloaded" or "networkidle" with a timeout, some Render free-tier cold-starts take 60s+})`, `page.waitForTimeout(1500)`, `page.screenshot({path, fullPage:false})`. Then `Read` the resulting `.png` to actually look at it. This caught two real, important findings this session (the shared-template problem, the fake award badge) that pure code-reading missed.

### Design direction (from the founder directly, verbatim intent)
- Wants **world-class, distinctive** UI per app — explicitly named gap: persona/characters per AI tool, better/less-generic copy, mobile polish.
- Reference sites given: automationowl.com, sintra.ai (fetched and analyzed — rich reference, character personas + conversational examples + FAQ accordion + testimonial carousel + comparison table), automusk.ai (JS-only SPA, couldn't be analyzed via WebFetch — would need a screenshot to actually see it).
- Explicitly do NOT fabricate credibility claims (see the Awwwards incident above) — stats/awards/claims must be real or clearly aspirational, never invented.
- Sevenseed = the parent "handles all 7 startups" studio. The 7 ventures: Comonk (career AI, the one with real users — kept as its own separately-deployed service, never merged into the monolith, an earlier attempt to merge it in was tried and explicitly reverted), Sevenforce (AI workforce, 7 named agents), AVPU (AI university), Decode Forest Pharmacy (free health advice/OCR/hospital finder), Breakdown Factor (construction safety CV), AVP Charitable Trust (welfare/donor AI), AVP Emart (price comparison shopping AI).
- Everything is meant to be **100% free for end users** — the founder's own stated model, and now also the honest replacement claim on every hero badge.

---

## Historical entries below (older sessions, may be stale — cross-check before trusting)

*(Older content from previous HANDOFF_LOG.md versions has been superseded by the sections above. If you need deep history — e.g. the original Comonk feature inventory, the exact sequence of the comonk-merge-then-revert experiment, or earlier Phase 1/2 build details — check git log messages in both repos, they're detailed and accurate: `git log --oneline` in each repo tells the real story better than a stale doc would.)*
