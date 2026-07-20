# Sevenforce serves its dashboard from backend/static/app.html directly —
# no separate Next.js frontend to build (unlike the other apps in this group).
FROM python:3.12-slim AS runtime
RUN useradd -m -u 1000 user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH PYTHONUNBUFFERED=1
WORKDIR $HOME/app

COPY --chown=user backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY --chown=user backend/ ./

RUN chown -R user:user $HOME/app
USER user
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
