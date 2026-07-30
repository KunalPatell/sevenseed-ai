# Deploy topology & WIP status — READ THIS before touching apps/

> Written 2026-07-22 after a full verification pass. Purpose: stop the very
> confusion this doc describes. The repo layout is misleading in two places.

## What is ACTUALLY live (verified against the Render API)

Eight Render services, all deployed from the `ai` remote
(`github.com/KunalPatell/sevenseed-ai`) **except comonk**:

| Live service (Render) | Serves | Source in this repo |
|---|---|---|
| `sevenseed` | the hub + all child sites at `/avpu/`, `/avp-emart/`, `/breakdown/`, `/trust/`, `/pharmacy/`, `/sevenforce/` | `apps/sevenseed/` (hub) with each child's build copied into `apps/sevenseed/backend/static/<prefix>/` |
| `avpu-ai`, `avp-emart`, `breakdown-factor`, `avp-charitable-trust`, `decode-forest-pharmacy`, `sevenforce-ai` | individual sites (also reachable via the hub) | `apps/<app>/` |
| `comonk-ai` | the live Comonk career site (comonk-ai.onrender.com) | **NOT this repo** — deploys from a separate repo `github.com/KunalPatell/comonk-ai` (= `E:\Project\My Startups\comonk`) |

All eight frontends are **Next.js static export** served by FastAPI. Render is
configured via the dashboard (individual services), **not** via `render.yaml`.

## What is NOT live (committed WIP — do not mistake for a live app)

A "Startup Founders Super-Suite" dashboard was built in a home session. It
works locally (verified end-to-end: backend boots, real 2008-company SQLite DB,
frontend renders, modules call the API) but is **deployed nowhere**:

- **`apps/sevenseed-web/`** — a Next.js dashboard frontend. It calls a backend at
  `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`). It is **SSR-style**
  (no `output: "export"`), unlike every live site. **No Render service exists for
  it.** The `render.yaml` entry naming `sevenseed-web` is **stale/unused**.
- **`apps/comonk/`** — despite the name this is **NOT** the live Comonk (that's the
  separate `comonk-ai` repo). It's the backend the super-suite talks to: 86
  FastAPI routes incl. the backup-mined feature endpoints (`/api/ba/prd`,
  `/api/hiring/*`, `/api/outreach/*`, `/api/meeting/summarize`, `/api/crm/*`,
  `/api/attendance/*`, …). Self-contained SQLite; **no dependency on the external
  `D:\Code-Commit-Backup` disk** (that disk only fed the markdown catalogs).

The header claims in the super-suite ("50+ Backup Features Live", "56 Unit Tests
Passed", "8 Full Web Apps") are **aspirational/inflated** — only ~6 modules are
actually wired. Fix those before ever making it public.

## Pushing a deploy: the `ai` remote uses `master`, not `main`

`ai/HEAD -> ai/master`, and every Render service watches **`master`**. The local
working branch is `main` (it tracks `origin/main`, a mirror). So:

```sh
git push ai HEAD:master                # correct — this deploys
git push ai HEAD                       # WRONG — creates a stray ai/main, deploys nothing
git ls-remote --heads ai               # confirm: master should be at your commit
```

The wrong form still prints a cheerful `* [new branch]` success. Nothing deploys.

Live hub: <https://sevenseed.onrender.com> (free tier — the first request after
an idle period can take a while to cold-start; a timeout is not an outage).

Rebuilding a frontend: `next build` in `apps/<app>/frontend`, then
`node scripts/fix-rsc-aliases.mjs <out>` and `node scripts/deploy-static.mjs <prefix>`.
Never copy a hub export over `backend/static/` by hand — that directory also holds
the six child sites, and commit `8ac663a` deleted all of them that way.

## Known gap: contact messages do not survive a redeploy

`POST /api/contact` persists to SQLite at `config.DB_PATH`, which defaults to a
path **inside the container**. Render's filesystem is ephemeral, so every deploy
or restart wipes the table — messages are collected, then lost. The forms are
real now (they were fake until 2026-07-30), but the storage behind them is not
durable. To fix, pick one:

1. Attach a Render disk and point `DB_PATH` at it (needs a paid instance type).
2. Forward each message to email/Slack on receipt, so the DB is only a cache.
3. Point `DB_PATH` at an external Postgres.

Read what has been collected so far with `GET /api/history/contacts`, which
requires the `ADMIN_KEY` env var in an `X-Admin-Key` header.

## To finish + ship the super-suite (if/when wanted)
1. Trim to only the modules that truly work; make the counts honest.
2. Polish it to the other 8 sites' visual bar.
3. Either give `output: "export"` + let `apps/comonk`'s FastAPI serve it (one
   service, same pattern as the rest) or run it as a Node service — then set
   `NEXT_PUBLIC_API_URL` to the real backend origin.
4. Decide whether it should be public at all (it overlaps heavily with the 8
   existing sites).

## Stale things worth cleaning later (not done here to avoid deleting your work)
- `render.yaml` references a `sevenseed-web` service that doesn't exist.
- `docs/HANDOFF_LOG.md` is from the pre-React era and points at old paths
  (`My Startups/apps/…`, `C:\Users\Capermint\Project\…`).
- `docs/analysis_results copy.md`, `implementation_plan copy.md`,
  `walkthrough copy.md` are exact duplicates of their non-"copy" siblings.
