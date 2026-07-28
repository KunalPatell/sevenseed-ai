# NOTE: Render does NOT build this file. Every service is configured with
# dockerfilePath "./Dockerfile", i.e. the one at the REPO ROOT — this is a
# duplicate of it, kept in sync by hand. Editing only this file changes nothing
# in production (that mistake is how the breakdown-factor libxcb fix initially
# appeared to do nothing). Change the root Dockerfile; mirror it here.
#
# Sevenseed hub - high-speed single stage Docker container.
# Serves the pre-compiled Next.js production builds tracked in apps/sevenseed/backend/static/
# Fast <30s build time, avoids Render 512MB RAM memory limits & 10min build timeouts.

FROM python:3.12-slim AS runtime
RUN useradd -m -u 1000 user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH PYTHONUNBUFFERED=1
WORKDIR $HOME/app

# System dependencies.
#
# The X11/GL libs are not optional: requirements.txt pins
# opencv-python-headless, but insightface (used by avpu + avp-charitable-trust
# face auth) hard-depends on the FULL opencv-python, so pip installs that too
# and it's the one that ends up loaded. Without these, importing cv2 dies with
# "ImportError: libxcb.so.1: cannot open shared object file" — which is exactly
# what was killing the breakdown-factor child at startup (its YOLO defect
# scanner imports cv2), leaving its API returning 503 while its page still
# loaded fine.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libxcb1 libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 \
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
