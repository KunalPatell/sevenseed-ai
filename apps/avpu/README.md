---
title: AVPU AI University
emoji: 🎓
colorFrom: blue
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# AVPU — Alpaben Vipulbhai Patel University (AI Student Portal)

An end-to-end, AI-native university platform — the flagship reference build for the
Sevenseed group, mirroring the Comonk architecture (FastAPI + LangGraph + RAG,
single container, offline-capable).

**Landing page** (`/`) is the enterprise marketing site; **Student Portal** (`/app`)
is the functional AI app.

## 🤖 AI Tools (all working)
| Tool | What it does | AI |
|------|--------------|----|
| **AI Tutor** | Chat grounded in AVPU's knowledge base | LangGraph agent (intent → RAG → advisor) |
| **Placement Matcher** | Matches your skills to hiring partners + skill gaps | Vector RAG + skill scoring |
| **Smart Admissions** | Recommends your best-fit program | RAG + LLM advice |
| **Auto Assessment** | Grades your answer with feedback | LLM / offline rubric |
| **Research Copilot** | Summarize or outline any text | LLM / extractive summary |
| **Learning Roadmap** | Week-by-week study plan | LLM / knowledge-staged plan |

## 🧱 Architecture
- **Backend:** FastAPI (`backend/main.py`) serves the frontend + `/api/*`
- **Agents:** `backend/agents.py` — LLM factory (Groq → Gemini → OpenAI → **offline**) + LangGraph tutor
- **RAG:** `backend/rag.py` — MiniLM embeddings → TF-IDF → token-overlap (auto-degrades)
- **Data:** `backend/data.py` — 14 programs, 20 hiring partners, 20 knowledge topics
- **Frontend:** `frontend/` — marketing landing (`index.html`) + app (`app.html`, `app-ui.js`)

## ▶️ Run locally
```bash
cd backend
pip install -r requirements.txt
python main.py          # http://localhost:8000  (app at /app)
```
Works **fully offline** (no API keys). To enable full LLM answers, set any one key
(see `backend/.env.example`) — Groq is free at console.groq.com:
```bash
export GROQ_API_KEY=gsk_xxx
```

## 🚀 Deploy
- **Docker / Hugging Face Spaces:** this repo is a Docker Space (port 7860). `docker build -t avpu . && docker run -p 7860:7860 avpu`
- **Render:** `render.yaml` included — connect the repo, it builds and runs automatically.

Add `GROQ_API_KEY` as an environment variable/secret to switch from offline mode to full LLM mode.

*A Sevenseed AI venture.*
