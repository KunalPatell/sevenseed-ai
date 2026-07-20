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

# ── Stage 7: FastAPI runtime serving API + static sites ──
FROM python:3.12-slim AS runtime
RUN useradd -m -u 1000 user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH PYTHONUNBUFFERED=1
WORKDIR $HOME/app

# Install system dependencies if any are needed for wheels compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=user apps/sevenseed/backend/requirements.txt ./apps/sevenseed/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r ./apps/sevenseed/backend/requirements.txt

# Copy all child backend code for router imports
COPY --chown=user apps/ $HOME/app/apps/

# Setup unified static directory tree
COPY --chown=user --from=sevenseed-frontend /app/sevenseed/out $HOME/app/apps/sevenseed/backend/static
COPY --chown=user --from=emart-frontend /app/emart/out $HOME/app/apps/sevenseed/backend/static/avp-emart
COPY --chown=user --from=avpu-frontend /app/avpu/out $HOME/app/apps/sevenseed/backend/static/avpu
COPY --chown=user --from=breakdown-frontend /app/breakdown/out $HOME/app/apps/sevenseed/backend/static/breakdown
COPY --chown=user --from=trust-frontend /app/trust/out $HOME/app/apps/sevenseed/backend/static/trust
COPY --chown=user --from=pharmacy-frontend /app/pharmacy/out $HOME/app/apps/sevenseed/backend/static/pharmacy

# Copy static frontend HTML folders directly (no node build required)
COPY --chown=user apps/comonk/frontend/ $HOME/app/apps/sevenseed/backend/static/comonk/
COPY --chown=user apps/sevenforce/backend/static/ $HOME/app/apps/sevenseed/backend/static/sevenforce/

WORKDIR $HOME/app/apps/sevenseed/backend
RUN chown -R user:user $HOME/app
USER user
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
