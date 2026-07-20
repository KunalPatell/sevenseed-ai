---
title: Comonk AI — Enterprise Career Intelligence Platform
emoji: 🧠
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: Free AI career platform for Gujarat IT/AI/ML job seekers
---

# Comonk AI 🧠

**Enterprise-grade, 100% free AI career intelligence platform for Ahmedabad & Gandhinagar IT/AI/ML job seekers.**

## Features

- 🏢 **541 Gujarat IT/AI/ML companies** with verified HR contacts (ChromaDB RAG)
- 🤖 **AI Career Counselor** — LangGraph multi-agent with Groq LLaMA 3.3 70B
- 🎤 **AI Mock Interview** — voice-powered simulation with scoring
- 📄 **Resume Studio** — ATS rewriter + tailored cover letter generator
- 📊 **ATS Optimizer** — score and fix your resume before applying
- 💼 **Live Jobs** — RemoteOK, Adzuna India, HN Hiring, and more
- 🗓️ **Calendar & Scheduler** — interview deadlines and prep reminders
- 📈 **Salary Intelligence** — Ahmedabad market rates with negotiation tips
- 🗺️ **90-Day Career Roadmap** — AI-generated with weekly milestones
- 🏆 **AI Career Score** — 0–100 score with gamification badges
- 🔔 **Alerts** — Telegram, SMS, WhatsApp, Discord, Email job notifications

## Setup (Hugging Face Spaces Secrets)

Go to **Settings → Variables and secrets** in your Space and add:

| Secret | Description | Required |
|--------|-------------|----------|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) — free LLaMA 3.3 70B | ✅ Yes |
| `ADMIN_PASSWORD` | Password for the admin panel | ✅ Yes |
| `RESEND_API_KEY` | [resend.com](https://resend.com) — email OTP for registration | Optional |
| `ADZUNA_APP_ID` + `ADZUNA_API_KEY` | [developer.adzuna.com](https://developer.adzuna.com) — India jobs | Optional |
| `NEWSAPI_KEY` | [newsapi.org](https://newsapi.org) — tech news | Optional |
| `GNEWS_API_KEY` | [gnews.io](https://gnews.io) — tech news | Optional |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Telegram job alerts | Optional |
| `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_FROM_NUMBER` | SMS/WhatsApp alerts | Optional |
| `DISCORD_WEBHOOK_URL` | Discord job alerts | Optional |
| `YOUTUBE_API_KEY` | YouTube tutorial search | Optional |
| `GITHUB_TOKEN` | GitHub trending (raises rate limit) | Optional |
| `HUNTER_API_KEY` | HR email finder | Optional |
| `MISTRAL_API_KEY` | Fallback LLM | Optional |

## Local Development

```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/comonk-ai
cd comonk-ai
cp .env.example .env   # fill in your keys
pip install -r requirements_comonk.txt
python comonk_backend.py
# open http://localhost:8000
```

## Tech Stack

- **Backend**: FastAPI + LangGraph + ChromaDB + Groq LLaMA 3.3 70B
- **Frontend**: Vanilla JS + Chart.js (zero framework, zero bloat)
- **Database**: SQLite (WAL mode) for auth + session management
- **AI**: Multi-provider fallback (Groq → Mistral → OpenAI)
- **RAG**: ChromaDB with all-MiniLM-L6-v2 embeddings over 541 companies

## Notes

- User accounts and sessions reset on container restart (SQLite is ephemeral on free tier)
- ChromaDB re-indexes from the Excel file on every cold start (~5 seconds)
- All AI features degrade gracefully when API keys are not set
