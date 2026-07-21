# Sevenseed hub - high-speed single stage Docker container.
# Serves the pre-compiled Next.js production builds tracked in apps/sevenseed/backend/static/
# Fast <30s build time, avoids Render 512MB RAM memory limits & 10min build timeouts.

FROM python:3.12-slim AS runtime
RUN useradd -m -u 1000 user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH PYTHONUNBUFFERED=1
WORKDIR $HOME/app

# System build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install unified Python requirements
COPY --chown=user apps/sevenseed/backend/requirements.txt ./apps/sevenseed/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r ./apps/sevenseed/backend/requirements.txt

# Copy all backend services + pre-built static frontends
COPY --chown=user apps/sevenseed/backend/ $HOME/app/apps/sevenseed/backend/
COPY --chown=user apps/avp-emart/backend/ $HOME/app/apps/avp-emart/backend/
COPY --chown=user apps/avpu/backend/ $HOME/app/apps/avpu/backend/
COPY --chown=user apps/breakdown-factor/backend/ $HOME/app/apps/breakdown-factor/backend/
COPY --chown=user apps/avp-charitable-trust/backend/ $HOME/app/apps/avp-charitable-trust/backend/
COPY --chown=user apps/decode-forest-pharmacy/backend/ $HOME/app/apps/decode-forest-pharmacy/backend/
COPY --chown=user apps/sevenforce/backend/ $HOME/app/apps/sevenforce/backend/

WORKDIR $HOME/app/apps/sevenseed/backend
RUN chown -R user:user $HOME/app
USER user
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
