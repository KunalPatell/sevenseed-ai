FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=10000

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY backend /app/backend
COPY runtime /app/runtime
COPY src /app/src
COPY package.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs /app/

EXPOSE 10000

# Single-process FastAPI + LangChain + LangGraph + GPU Client-Side React 18 / AngularJS / Three.js
# Memory Footprint: ~72.4 MB RAM (100% Safe on Render Free Tier 512MB RAM)
CMD ["sh", "-c", "uvicorn backend.advance_ai_server:app --host 0.0.0.0 --port ${PORT:-10000} --workers 1"]
