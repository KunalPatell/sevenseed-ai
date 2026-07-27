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
