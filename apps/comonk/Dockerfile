# Sevenseed Super-Suite — one service that hosts BOTH the FastAPI microservices
# (85+ endpoints) and the static Next.js dashboard that drives them (webui/).
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc \
    && rm -rf /var/lib/apt/lists/*

# Python deps first for layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend code, the company database, and the pre-built dashboard.
COPY *.py ./
COPY comonk.db ./comonk.db
COPY webui/ ./webui/

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

# Render provides $PORT; default to 8000 locally.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
