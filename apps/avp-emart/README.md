---
title: AVP Emart AI Shopping
emoji: 🛒
colorFrom: orange
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# AVP Emart — AI Smart-Shopping Platform

An end-to-end AI shopping app for the Sevenseed group. Compares live prices across
**Amazon, Flipkart, Reliance Digital and Snapdeal**, scores the best value
(price 40% · rating 40% · reviews 20% — the price-com model), and helps you buy smart.

**Landing** (`/`) is the marketing site; **Shopping App** (`/app`) is the functional tool.

## 🛒 Tools (all working)
| Tool | What it does |
|------|--------------|
| **Compare Prices** | Live comparison across 4 platforms + best-value scoring + price chart |
| **Shopping Assistant** | Ask in plain language ("best earbuds under ₹2000") → AI picks the best deal |
| **Review Intelligence** | AI verdict with pros & cons (from ratings or pasted reviews) |
| **Price Trends** | 12-week price trend + buy-now/wait forecast |
| **Recommendations** | AI-curated best-value picks by category |

## 🧱 Architecture
- **Backend:** FastAPI (`backend/main.py`) serves frontend + `/api/*`
- **Engine:** `backend/comparator.py` — ports the price-com scoring; **sample data** offline, **SerpAPI** live when `SERPAPI_KEY` is set
- **AI:** `backend/agents.py` — LLM factory (Groq → Gemini → OpenAI → **offline**) for the assistant & review analysis
- **Frontend:** `frontend/` — marketing landing + shopping app

## ▶️ Run locally
```bash
cd backend && pip install -r requirements.txt && python main.py   # http://localhost:8000/app
```
Runs fully with **sample data + offline AI** (no keys). Add keys for more:
- `SERPAPI_KEY` → real live prices
- `GROQ_API_KEY` (free) → full LLM assistant/review analysis

## 🚀 Deploy
Docker Space (port 7860) or Render (`render.yaml` included — connect the repo).

*A Sevenseed AI venture.*
