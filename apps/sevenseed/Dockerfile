# Sevenseed hub - one Render service, one container.
#
# Runtime shape: the hub (apps/sevenseed/backend/main.py) is the only process
# Render talks to. On startup it launches six children as their own OS
# subprocesses (apps/sevenseed/backend/child_processes.py) - each runs its real,
# unmodified main.py exactly as it does standalone - and reverse-proxies
# /<slug>/api/* to whichever one owns that prefix. Static frontends for all six
# are pre-built below and served directly by the hub, no proxy needed for those.
#
# Comonk is intentionally NOT part of this image. It stays its own separately
# deployed, already-live Render service; the hub only links out to it. Its
# frontend was never built with "living under a subpath" in mind, and it's the
# one app here with real users - not worth the risk of forcing it in.

# ── Stage 1: Build sevenseed landing page ──
FROM node:20-alpine AS sevenseed-frontend
WORKDIR /app/sevenseed
COPY apps/sevenseed/frontend/package.json apps/sevenseed/frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY apps/sevenseed/frontend/ ./
RUN npm run build

# ── Stage 2: Build avp-emart ──
FROM node:20-alpine AS emart-frontend
WORKDIR /app/emart
COPY apps/avp-emart/frontend/package.json apps/avp-emart/frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY apps/avp-emart/frontend/ ./
RUN npm run build

# ── Stage 3: Build avpu ──
FROM node:20-alpine AS avpu-frontend
WORKDIR /app/avpu
COPY apps/avpu/frontend/package.json apps/avpu/frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY apps/avpu/frontend/ ./
RUN npm run build

# ── Stage 4: Build breakdown-factor ──
FROM node:20-alpine AS breakdown-frontend
WORKDIR /app/breakdown
COPY apps/breakdown-factor/frontend/package.json apps/breakdown-factor/frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY apps/breakdown-factor/frontend/ ./
RUN npm run build

# ── Stage 5: Build avp-charitable-trust ──
FROM node:20-alpine AS trust-frontend
WORKDIR /app/trust
COPY apps/avp-charitable-trust/frontend/package.json apps/avp-charitable-trust/frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY apps/avp-charitable-trust/frontend/ ./
RUN npm run build

# ── Stage 6: Build decode-forest-pharmacy ──
FROM node:20-alpine AS pharmacy-frontend
WORKDIR /app/pharmacy
COPY apps/decode-forest-pharmacy/frontend/package.json apps/decode-forest-pharmacy/frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY apps/decode-forest-pharmacy/frontend/ ./
RUN npm run build

# ── Stage 7: runtime - hub + six child backends as subprocesses ──
FROM python:3.12-slim AS runtime
RUN useradd -m -u 1000 user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH PYTHONUNBUFFERED=1
WORKDIR $HOME/app

# Install system dependencies if any are needed for wheels compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# One shared Python environment for the hub and all six children - this is why
# sevenseed/backend/requirements.txt is a union of every child's own deps
# (verified: nothing in any child's requirements.txt is missing from it).
COPY --chown=user apps/sevenseed/backend/requirements.txt ./apps/sevenseed/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r ./apps/sevenseed/backend/requirements.txt

# Each child's own backend source, unmodified - copied individually (not the
# whole apps/ tree) so comonk and every child's frontend/ source stay out of
# this image entirely.
COPY --chown=user apps/sevenseed/backend/ $HOME/app/apps/sevenseed/backend/
COPY --chown=user apps/avp-emart/backend/ $HOME/app/apps/avp-emart/backend/
COPY --chown=user apps/avpu/backend/ $HOME/app/apps/avpu/backend/
COPY --chown=user apps/breakdown-factor/backend/ $HOME/app/apps/breakdown-factor/backend/
COPY --chown=user apps/avp-charitable-trust/backend/ $HOME/app/apps/avp-charitable-trust/backend/
COPY --chown=user apps/decode-forest-pharmacy/backend/ $HOME/app/apps/decode-forest-pharmacy/backend/
COPY --chown=user apps/sevenforce/backend/ $HOME/app/apps/sevenforce/backend/
# Comonk: flat layout (backend source IS the app root), copy whole folder minus heavy backup files
COPY --chown=user apps/comonk/comonk_backend.py $HOME/app/apps/comonk/comonk_backend.py
COPY --chown=user apps/comonk/comonk_agents.py $HOME/app/apps/comonk/comonk_agents.py
COPY --chown=user apps/comonk/comonk_rag.py $HOME/app/apps/comonk/comonk_rag.py
COPY --chown=user apps/comonk/questions.py $HOME/app/apps/comonk/questions.py
COPY --chown=user apps/comonk/requirements_comonk.txt $HOME/app/apps/comonk/requirements_comonk.txt
COPY --chown=user apps/comonk/comonk.db $HOME/app/apps/comonk/comonk.db

# Unified static tree the hub serves directly (prefixes match child_processes.CHILDREN)
COPY --chown=user --from=sevenseed-frontend /app/sevenseed/out $HOME/app/apps/sevenseed/backend/static
COPY --chown=user --from=emart-frontend /app/emart/out $HOME/app/apps/sevenseed/backend/static/avp-emart
COPY --chown=user --from=avpu-frontend /app/avpu/out $HOME/app/apps/sevenseed/backend/static/avpu
COPY --chown=user --from=breakdown-frontend /app/breakdown/out $HOME/app/apps/sevenseed/backend/static/breakdown
COPY --chown=user --from=trust-frontend /app/trust/out $HOME/app/apps/sevenseed/backend/static/trust
COPY --chown=user --from=pharmacy-frontend /app/pharmacy/out $HOME/app/apps/sevenseed/backend/static/pharmacy
COPY --chown=user apps/sevenforce/backend/static/ $HOME/app/apps/sevenseed/backend/static/sevenforce/
# Comonk frontend: plain HTML/JS (no Next.js build needed)
COPY --chown=user apps/comonk/frontend/ $HOME/app/apps/sevenseed/backend/static/comonk-ai/

WORKDIR $HOME/app/apps/sevenseed/backend
RUN chown -R user:user $HOME/app
USER user
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
