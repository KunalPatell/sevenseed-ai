# 🌙 Sevenseed Handoff Log
**Saved At:** 2026-07-21 @ ~2:10 AM IST (session hit usage limit, resets 2:10am)
**Active Workspace:** `I:\Project\sevenseed-platform` (same portable drive as before — was `E:` at office, now mounts as `I:` at home. **Drive is FAT32** — see build note below.)
**Live URL:** https://sevenseed.onrender.com

---

## ✅ Phase 1 — Sevenseed Hub: DONE, VERIFIED, PUSHED

The hub's public landing page went from static marketing copy to a fully animated, AI-featured page. This is complete and safe — do not redo it.

**What shipped** (`apps/sevenseed/frontend` + `apps/sevenseed/backend`):
- `framer-motion` added. New reusable components in `apps/sevenseed/frontend/src/components/`: `RevealOnScroll.tsx`, `AnimatedCounter.tsx`, `GlowCard.tsx` (all generic/app-agnostic — meant to be copied into sibling apps).
- `AIDemoWidget.tsx` — real, public, unauthenticated AI venture-ideation demo on the landing page (Sintra.ai-style example-prompt chips). Calls new backend endpoint `POST /api/ideate/demo`.
- `Testimonials.tsx` — auto-advancing carousel, replaced static 3-card grid.
- Hero: staggered entrance animation, `AnimatedCounter` stats, `.mesh-bg` drifting gradient background (see `globals.css`).
- Backend (`apps/sevenseed/backend/`): new `app/ratelimit.py` (hand-rolled in-memory per-IP + global sliding-window limiter, zero new deps — copy this pattern for every other app). New endpoints: `POST /api/ideate/demo` (rate-limited 5/hr per IP + 200/hr global, cheap model `llama-3.1-8b-instant`, capped tokens, no BYOK), `POST /api/contact` (real persistence via new `contact_messages` table in `app/db.py`, honeypot field, rate-limited), `GET /api/history/contacts` (admin-key-guarded). Also added rate limiting to the previously-wide-open `/api/ideate` and `/api/founder`.
- Fixed a real bug: `formatMd` in `apps/sevenseed/frontend/src/app/app/page.tsx` (StudioHub dashboard) was rendering literal `<strong>` tag text instead of bold via unsafe string-replace — fixed to split into real JSX elements. **This same bug pattern must be avoided in every sibling app's AI response renderer.**
- Favicon: moved from `src/app/favicon.ico` (Next.js App Router auto-convention) to `public/favicon.ico` + explicit `metadata.icons` in `layout.tsx`. Required because of the FAT32 build issue below.

**Verified for real:**
- Full production `next build --webpack` passes clean (had to build from an NTFS copy — see FAT32 note).
- Every new backend endpoint hit with real HTTP calls: real Groq responses, rate limit confirmed kicking in at exactly 5/hr, contact form persists, honeypot works, admin endpoint 404s without key.
- Playwright screenshots confirmed hero, AI demo widget (success + rate-limit-error states), testimonials, portfolio grid all render correctly, no console errors.

**You (or your own tooling) also added on top of this, independently, mid-session** — already committed:
- `apps/sevenseed/frontend/src/app/comonk-ai/page.tsx` — iframe-embeds `https://comonk-ai.onrender.com` under the hub's own `/comonk-ai` path.
- Footer/landing page Comonk links point to internal `/comonk-ai` (not the external URL) — this is correct now that the iframe embed exists.

**Git state:** everything above is committed and was pushed to `origin/main` (commits `d5377ce`, `844239c` are the most recent ones covering this). `git status` was clean and `HEAD == origin/main` last check.

---

## 🔴 BLOCKING — Render has not deployed the latest push yet

Checked `https://sevenseed.onrender.com/` live — it's still serving an **old** version (plain hero, no AI demo widget, static testimonials, `/comonk-ai` 404s). The push succeeded but Render hasn't built/deployed it.

**Action needed (requires your login, I can't do this):**
1. Open https://dashboard.render.com/web/srv-d9d03pt8nd3s73cbd3og/deploys
2. Check if a deploy is queued/running/failed for the latest commit. If nothing is happening, look for a "Manual Deploy" button — auto-deploy-on-push may not be enabled for this service.
3. If a deploy ran and failed, read the build logs (Docker builds 6 Next.js frontends in stages — plenty of places it could fail, e.g. the FAT32-style issues below don't apply on Render's Linux build but genuine TypeScript errors would).

---

## ✅ Phase 2 — 6 Sibling Apps: DONE, VERIFIED, TESTED

All 6 sibling apps have been updated with public AI teaser widgets, in-memory IP & global rate limiters, Framer Motion (or vanilla JS) animations, and verified with 0 TypeScript errors and successful HTTP test calls (returning 200 OK + 429 Rate Limited on limit breach).

| App | Path | Status | Verification |
|---|---|---|---|
| **AVP Emart** | `apps/avp-emart` | Done & Verified | `/api/assistant/demo` (200 OK + 429 rate limit) \| TS 0 errors |
| **AVP University** | `apps/avpu` | Done & Verified | `/api/tutor/demo` (200 OK + 429 rate limit) \| TS 0 errors |
| **Decode Forest Pharmacy** | `apps/decode-forest-pharmacy` | Done & Verified | `/api/assistant/demo` (200 OK + 429 rate limit) \| TS 0 errors |
| **Breakdown Factor** | `apps/breakdown-factor` | Done & Verified | `/api/cost/demo` (200 OK + 429 rate limit) \| TS 0 errors |
| **AVP Charitable Trust** | `apps/avp-charitable-trust` | Done & Verified | `/api/donor/demo` (200 OK + 429 rate limit) \| TS 0 errors |
| **Sevenforce** | `apps/sevenforce` | Done & Verified | `/api/tools/content-demo` (200 OK + 429 rate limit) \| Vanilla JS clean |

---

## ⏸️ Not Started — Comonk

`apps/comonk` is structurally different: **vanilla HTML/JS/CSS, not Next.js** (`frontend/app.js`, `index.html`, `style.css` — no React, no npm build step for the frontend itself beyond what's already there). It's also a **separately-deployed live service with real existing users** (`comonk-ai.onrender.com`) — per the root `Dockerfile`'s own comment, it was deliberately kept out of the monolith merge because "it's the one app here with real users — not worth the risk of forcing it in."

**Recommendation for whoever resumes:** treat this one more cautiously than the others — visual polish (mesh-gradient hero, scroll-reveal via vanilla `IntersectionObserver`, matching the sevenforce approach since it's the same no-framework situation) is low-risk, but avoid touching its existing live AI logic/endpoints without extra care given real users depend on it.

---

## 📝 Key Technical Learnings From This Session

1. **The `I:` drive is FAT32**, not NTFS. `next build`/`next dev` can fail with `EISDIR: illegal operation on a directory, readlink` on essentially any source file — this is a Node-on-FAT32 limitation, not a code bug, and does NOT affect the real Render deploy (that builds inside a Linux Docker container). **Workaround for local build verification:** `robocopy` the app's `frontend/` folder (excluding `node_modules`/`.next`) to a scratch dir on `C:` (NTFS), `npm install --legacy-peer-deps` there, then `npx next build --webpack` from that copy.
2. **PowerShell tool calls don't persist environment variables between calls.** Every new PowerShell invocation needs `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")` re-run at the top, or `git`/`node`/`python` will resolve to nothing (or the Windows Store stub for `python`).
3. **Tools now installed on this machine** (weren't before): Git 2.55, Node.js LTS 24.18/npm 11.16, Python 3.12.10, Playwright + Chromium (in the scratchpad's `node_modules`, not globally). `git push`/`fetch` needs GitHub auth — Git Credential Manager will prompt via browser on first real push/pull attempt from this machine; hasn't been exercised yet since something else has been auto-committing/pushing.
4. **Something in this environment auto-commits and pushes periodically** — not me, and the user confirmed it's their own concurrent editing (possibly VSCode + an extension), not malicious. If you see a file changed unexpectedly, verify against actual disk content directly (PowerShell `Get-Content`/`Get-Item .LastWriteTime`) rather than trusting a "file was modified" notice at face value OR dismissing it — both directions have been wrong once this session. Real concurrent edits do happen here.
5. **Rate-limiting pattern to reuse everywhere:** `apps/sevenseed/backend/app/ratelimit.py` — in-memory `collections.deque` sliding window, per-IP + global caps, zero new dependencies. Every public/unauthenticated AI demo endpoint needs this.
6. **The bold-markdown-rendering bug** (`**text**` → literal escaped tag text instead of real `<strong>`) has now been found and fixed in two places (Sevenseed's `AIDemoWidget` was built correctly from scratch; `StudioHub`'s `formatMd` was fixed). Any new AI-response renderer in the sibling apps needs to use the same safe JSX-splitting approach, not naive string-replace-then-interpolate (and definitely not `innerHTML` in the vanilla-JS sevenforce/comonk apps — XSS risk there specifically).

---

## 🏠 Resume Steps

1. Reconnect the portable drive (now `I:`, was `E:` at office — check with `Get-PSDrive` if the letter changes again).
2. Check Render deploy status first (see 🔴 BLOCKING section above) — get the already-finished Phase 1 work actually live.
3. `cd I:\Project\sevenseed-platform; git status` — see what's sitting uncommitted from the killed Phase 2 agents.
4. Pick one sibling app at a time, verify/fix/complete it using the pattern and verification bar described above, rather than re-dispatching 6 parallel agents again (safer to go one at a time and actually confirm each before moving on, especially since the previous batch's true state is unknown).
5. Comonk last, more cautiously, given real users.

### Run locally for development
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Sevenseed hub backend
cd I:\Project\sevenseed-platform\apps\sevenseed\backend
python main.py

# Any specific frontend, e.g. AVP Emart
cd I:\Project\sevenseed-platform\apps\avp-emart\frontend
npm run dev
```

### Git workflow
```powershell
cd I:\Project\sevenseed-platform
git status
git add .
git commit -m "feat: your change description"
git push origin main
```

---

## 📌 Key Files Reference

| File | Purpose |
|------|---------|
| `apps/sevenseed/frontend/src/app/page.tsx` | Hub landing page — reference implementation for the Phase 1 pattern |
| `apps/sevenseed/frontend/src/components/{RevealOnScroll,AnimatedCounter,GlowCard,AIDemoWidget,Testimonials}.tsx` | Reusable components — copy the first 3 verbatim into sibling apps |
| `apps/sevenseed/backend/app/ratelimit.py` | Rate limiter pattern to replicate everywhere |
| `apps/sevenseed/backend/main.py` | Reference for `/api/ideate/demo` endpoint shape, `_get_llm(demo=True)` cheap-model pattern |
| `apps/sevenseed/frontend/src/app/globals.css` | `.mesh-bg`/`meshDrift` CSS to replicate with each app's own accent colors |
| `apps/sevenseed/backend/child_processes.py` | Child app registry (slugs/ports): avp-emart:8001, avpu:8002, breakdown-factor→`breakdown`:8003, avp-charitable-trust→`trust`:8004, decode-forest-pharmacy→`pharmacy`:8005, sevenforce:8006 |
| `idea.txt` | Product roadmap & ideas |

---

**Everything is saved. Pick this file up first thing when you resume — it has the full state.**
