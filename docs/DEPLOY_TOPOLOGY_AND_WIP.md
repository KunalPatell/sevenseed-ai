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

## Contact messages: SQLite here is not durable, so there are two other copies

`POST /api/contact` persists to SQLite at `config.DB_PATH`, which defaults to a
path **inside the container**. Render's filesystem is ephemeral: every deploy or
restart wipes the table. The DB alone is therefore a cache, not storage.

`app/notify.py` adds two delivery paths so a submission survives that:

1. **Always on** — every submission is written to the application log at INFO
   (`CONTACT_SUBMISSION | name=… | email=… | message=…`). Render retains logs
   beyond the container, so this is the recoverable copy. Note it puts inbound
   personal data in the logs by design.
2. **Optional email forwarding** — set these and it turns on by itself:

   | Variable | Notes |
   |---|---|
   | `SMTP_HOST` | e.g. `smtp.gmail.com` — required to enable |
   | `SMTP_PORT` | default `587` (STARTTLS); `465` uses implicit TLS |
   | `SMTP_USER` | login, and the From address unless `SMTP_FROM` is set |
   | `SMTP_PASSWORD` | an app password, never the account password |
   | `SMTP_FROM` | optional explicit From |
   | `CONTACT_TO` | destination; defaults to `SMTP_USER` |

   The startup log always states which mode is active, so "enquiries aren't
   arriving" is diagnosable from the logs alone.

Design rules worth keeping if you touch this: the email goes out as a FastAPI
**background task** (SMTP can block for its whole timeout and the visitor must
not wait), and both paths swallow their exceptions — a message that reached the
database is a success even if forwarding fails.

**Untested path:** real SMTP delivery has never been exercised, because that
needs live credentials. What was verified is the disabled no-op, an unresolvable
host, and a blackholed host that hangs: in every case the form returned 200 in
~10ms, the row was written, and the failure was logged with a traceback. Send
yourself one message after configuring it.

Still worth doing if this data matters: attach a Render disk and point `DB_PATH`
at it (paid instance types only), or move `DB_PATH` to an external Postgres.

Read what is currently stored with `GET /api/history/contacts`, which requires
the `ADMIN_KEY` env var passed in an `X-Admin-Key` header.

Note that `LOG_LEVEL` (default `INFO`) controls the app's own logger; setting it
above INFO turns off the durable copy described above.

## Known gap: the hub's history endpoints are still open

Fixed 2026-08-03 across all six child backends: every endpoint returning personal
data now requires a signed-in user. `GET /api/donations` on avp-charitable-trust
had been returning donor names, emails and **PAN numbers** to anyone who called it.

Four routes on the hub could not be fixed the same way and are **still open**:

| Route | Holds |
|---|---|
| `GET /api/history/sessions` | what visitors typed into the ideation demo |
| `DELETE /api/history/sessions/{id}` | destructive |
| `GET /api/history/pitches` | generated pitches from the demo |
| `DELETE /api/history/pitches/{id}` | destructive |

Why not fixed: the Studio dashboard at `/app/` calls these and has **no login**,
and unlike the child apps this backend has no signup/login to hook into — only
`ADMIN_KEY`, which cannot go into frontend JavaScript without publishing it.
Gating them would break a working dashboard with no way to sign in.

The fix is a user login for the hub, matching the pattern now used by all six
child apps (`require_user` in `features.py`, token in the portal). The genuinely
sensitive endpoint, `/api/history/contacts`, **is** already gated by `ADMIN_KEY`.

Two other apps had the same shape of problem and were fixed by building the
missing login UI — `decode-forest-pharmacy` and `avp-emart` both had working
auth backends their portals never used. The hub needs the backend half too.

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
