# 🚀 Sevenseed AI Group — Website Build Plan & Understanding

> **My understanding of the task, written for your review before we finalise.**
> Tell me where I'm wrong and I'll adjust — everything below is generated from one
> file (`generate_sites.py`), so changes are fast and consistent across all sites.

---

## 1. What I understood

- You have **7 startups**, all under the **Sevenseed** umbrella (Sevenseed is the parent AI venture studio).
- **All 7 are AI startups** — every company uses AI for its core work. This is the current trade.
- **Comonk** is already **done** (live: https://comonk-ai.onrender.com) and is my design/AI reference.
- My task: build the **same enterprise-grade, AI-first website** for the **other 6**.
- **AVP Emart** additionally references your `price-com` project (E‑Commerce Product Comparator Pro, live at https://price-com-7.streamlit.app/) — so its AI angle is **live price comparison + best-value scoring**.

### The AI bar (copied from Comonk's real stack)
Comonk runs on: **LangGraph multi-agent** (StateGraph, 5 nodes, session memory) · **Groq LLaMA 3.3 70B** (Gemini/GPT‑4o fallback) · **ChromaDB RAG** + MiniLM embeddings · **FastAPI**.
Every one of the 6 sites is positioned at **that same depth** — real AI capabilities, not buzzwords, each tagged with the tech that powers it.

---

## 2. Shared design system (same for all, "like Comonk")

| Element | Spec |
|---|---|
| Theme | Dark, premium, animated (Comonk "Enterprise Design System") |
| Font | Inter + JetBrains Mono (for tech/AI tags) |
| Icons | Font Awesome 6 |
| Hero | Animated particle network + glow, AI pill, big gradient headline, animated stat counters, keyword marquee |
| Sections | Nav → Hero → **Value Pillars** → **AI Stack strip** → About → **AI Capabilities** → Process → Impact numbers → Testimonials → FAQ → CTA/Contact → Footer |
| Per company | Its **own accent colour**, icon, emoji favicon, content & AI tools |
| Tech | Self-contained `index.html + style.css + app.js` per company — deploy anywhere (HF, Vercel, Netlify, Render) |
| Cross-linking | Footer "The AI Group" links all 7 sites together; each marked "A Sevenseed AI venture" |

---

## 3. Per-company understanding

### 1️⃣ Sevenseed — *AI Venture Studio* 🌱  (accent: indigo→violet)
The parent. An **AI-native startup studio** that ideates, incubates and launches the other ventures on a **shared AI backbone**.
**AI tools:** AI Venture Ideation (LLM+RAG) · Shared AI Platform (LangGraph) · Multi-Agent Automation · RAG Knowledge Base (ChromaDB) · AI Talent & Tooling (MLOps) · Portfolio Intelligence (ML forecasting).

### 2️⃣ Alpaben Vipulbhai Patel University (AVPU) — *AI Education* 🎓  (accent: blue→gold)
An **AI-powered university** — personal AI tutor, adaptive learning, AI placement matching.
**AI tools:** AI Tutor & Doubt Solver (Groq LLaMA) · Adaptive Learning Paths (Adaptive ML) · AI Placement Matcher (RAG+Embeddings) · Automated Assessment (NLP) · Research Copilot (LLM+RAG) · Smart Admissions (AI Agent).

### 3️⃣ Decode Forest Pharmacy — *AI Pharmacy* 💊  (accent: emerald→teal)
An **AI pharmacy** — reads prescriptions, checks drug interactions, smart delivery.
**AI tools:** AI Prescription Reader (OCR+Vision) · Drug Interaction Checker (LLM Safety) · Smart Substitutes (Recommender) · AI Health Assistant (Groq LLaMA) · Refill Prediction (ML Forecasting) · Smart Delivery Routing (Optimisation).

### 4️⃣ Breakdown Factor Construction — *AI Construction* 🏗️  (accent: amber→orange)
**AI-driven construction** — computer-vision site safety, cost/schedule prediction, defect detection.
**AI tools:** AI Site Safety Monitor (Computer Vision) · Cost & Schedule Prediction (ML Forecasting) · Damage & Defect Detection (YOLO Vision) · AI Project Copilot (LangGraph) · Smart Estimation (LLM+Vision) · Quality Assurance AI (Computer Vision).
*(Note: this ties to the pipe-damage / structural datasets already on your PC — real CV use case.)*

### 5️⃣ AVP Charitable Trust — *AI for Social Impact* 🤝  (accent: rose→gold)
**AI for good** — finds where help is needed, matches beneficiaries, transparent impact reporting.
**AI tools:** AI Needs Assessment (ML Analytics) · Beneficiary Matching (RAG+Embeddings) · AI Impact Reporting (LLM Reports) · Donor Assistant (Groq LLaMA) · Transparency & Fraud AI (Anomaly Detection) · Volunteer Coordinator (AI Agent).

### 6️⃣ AVP Emart — *AI E-Commerce* 🛒  (accent: orange→emerald) — **links to your live price-com**
**AI smart-shopping** — compares live prices across Amazon/Flipkart/Reliance Digital/Snapdeal, ML best-value scoring, LLM shopping assistant.
**AI tools:** AI Price Comparison (Live Aggregation) · Best-Value Scoring (ML Scoring) · LLM Shopping Assistant (Groq LLaMA) · Smart Recommendations (Recommender) · Price-Trend Forecasting (ML Forecasting) · Review Intelligence (NLP Summarisation).
**Hero + CTA button → https://price-com-7.streamlit.app/**

### ✅ 7️⃣ Comonk Technology — *already done* (reference only, live on Render)

---

## 4. Assumptions I made (please confirm / correct)

1. **Placeholder details** — I used sample contact emails (e.g. `care@decodeforest.in`), your phone `+91 84908 61586`, and Ahmedabad/Anand locations. Give me the real ones per company.
2. **Metrics/numbers** (e.g. "90% placement", "₹1Cr GMV", "10k+ products") are aspirational marketing figures from the plan — replace with real targets if you have them.
3. **Logos** — I'm using icon + wordmark (Font Awesome). If you have the actual logo images from your screenshot, I'll swap them in.
4. **AI features are the intended product vision** — described as live/planned capabilities. Tell me which are already built vs. roadmap.
5. **Testimonials are illustrative** (placeholder names/quotes) — replace with real ones or I can mark them "coming soon".
6. **These are marketing sites** (like Comonk's landing), not the full functional apps. If you want any to be functional apps too (like Comonk/price-com), that's a separate, bigger build — tell me which.

---

## 5. Status

- [x] Design system + generator built (`generate_sites.py`)
- [x] All 6 AI-native sites generated (`sevenseed/`, `avpu/`, `decode-forest-pharmacy/`, `breakdown-factor/`, `avp-charitable-trust/`, `avp-emart/`)
- [x] Each has `index.html`, `style.css`, `app.js` — self-contained
- [ ] **Your review of this plan** ← we are here
- [ ] Swap in real contact info / numbers / logos
- [ ] (Optional) deploy each site

> **To regenerate after edits:** `python generate_sites.py` from this folder.
