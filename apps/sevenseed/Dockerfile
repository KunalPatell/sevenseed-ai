# ── Stage 1: build the Next.js frontend (static export -> /out) ──
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# ── Stage 2: FastAPI runtime serving API + static site ──
FROM python:3.12-slim AS runtime
RUN useradd -m -u 1000 user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH PYTHONUNBUFFERED=1
WORKDIR $HOME/app

COPY --chown=user backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY --chown=user backend/ ./
COPY --chown=user --from=frontend /app/frontend/out ./static

RUN chown -R user:user $HOME/app
USER user
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
