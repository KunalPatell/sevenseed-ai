# Master Implementation Plan: Sevenseed AI Venture Ecosystem

This document serves as the comprehensive technical specification and architectural blueprint for the **Sevenseed AI Venture Platform**. It incorporates deep research from benchmark platforms (**AutomationOwl**, **Sintra.ai**, **Automusk.ai**) and local reference repositories (`i:\Project\comonk`, `i:\Project\price-com`, `i:\Project\github project\*`).

---

## 1. Deep Research & Competitive Benchmark Synthesis

### A. Reference Site Analysis
| Platform | Key Value Proposition | Design & Architecture Lessons | Integrated Sevenseed Features |
|----------|----------------------|--------------------------------|------------------------------|
| **AutomationOwl.com** | Small business AI tools bundle (Lead Gen, Social Media, eCommerce, Product Photos). | High-converting Bento grids, single growth bundle pricing, tool dashboard dock. | **Sevenforce**: All-in-one growth & social automation agent dock. |
| **Sintra.ai** | Autonomous **AI Employees / AI Workers** (Buddy - BizDev, Cassie - Support, Commet - eCommerce, Dexter - Analytics). | Persona-based AI worker cards, skill tags, live agent execution preview. | **Sevenforce & Sevenseed Hub**: 7 specialized autonomous AI workers with real execution flows. |
| **Automusk.ai** | AI Agency Automation & Multi-Agent Workflow Engine. | Cyberpunk dark theme (`#09090b`), GSAP animations, connected node flow visualizers. | **Sevenseed Hub**: Interactive multi-agent workflow architecture canvas. |
| **Local Repositories** (`i:\Project\*`) | Production-ready Python backends (`comonk_backend.py`, `price-com`, `ai-interview/server.py`). | 250KB+ real backend logic, SQLite databases, PyTorch YOLOv8 weights (`best.pt`). | **All 8 Startups**: Full wiring of authentic local backend engines. |

---

## 2. Core Architectural System: Universal BYOK (Bring Your Own Key) Engine

To honor the core philosophy: *"All software provided 100% free of charge without platform token limits"*, every single platform incorporates a **Universal BYOK (Self API & Token Manager)**.

```
       [ User Enters Key in BYOK Modal ]
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[ Browser LocalStorage ]     [ Request Header ]
 (Client-side encrypted)      X-OpenAI-Key / X-Groq-Key
       │                               │
       └───────────────┬───────────────┘
                       ▼
         [ FastAPI Proxy Gateway ]
     (Passes key directly to Provider API)
                       │
   ┌───────────────────┼───────────────────┐
   ▼                   ▼                   ▼
OpenAI             Anthropic             Groq / DeepSeek
(GPT-4o)            (Claude 3.5)          (LLaMA 3.3 70B)
```

### Key Technical Rules for BYOK Engine:
1. **Zero Server Token Usage**: Requests utilize the user's provided API key.
2. **Encrypted Client Storage**: Keys stored securely in browser `localStorage` under `sevenseed_byok_keys`.
3. **Multi-Provider Support**: Supports **OpenAI**, **Anthropic**, **Google Gemini**, **Groq**, and **DeepSeek**.
4. **Instant Validation**: Modal includes live API key ping validation (`/api/v1/byok/validate`).

---

## 3. Comprehensive 8-Startup Platform Blueprint

---

### 1. Sevenseed Studio Hub (`apps/sevenseed/frontend` & `backend`)
- **Core Purpose**: Parent AI Venture Studio that ideates, incubates, and manages all 7 autonomous AI startups.
- **Frontend Features**:
  - Investor-Grade Venture Studio Portal with cosmic `StarCanvas` particle depth.
  - Interactive **8-Venture Matrix Grid** showing live status, sector, and 1-click launch button.
  - **AI Venture Ideator & Feasibility Generator**: Generates 90-day MVP roadmaps and architecture diagrams.
  - **Studio Knowledge Base RAG**: Interactive Q&A over studio incubation guidelines.
- **Backend Services**: Single-container reverse proxy supervisor (`child_processes.py`) managing subpaths `/`, `/comonk-ai/`, `/avp-emart/`, `/avpu/`, `/breakdown/`, `/sevenforce/`, `/trust/`, `/pharmacy/`.

---

### 2. Comonk Technology (`apps/comonk/frontend` & `backend`)
- **Core Purpose**: Enterprise AI Career & ATS Intelligence Platform (wired with `i:\Project\comonk` & `i:\Project\github project\ai-interview`).
- **Frontend Features**:
  - **BYOK Key Settings Banner**: User enters OpenAI/Claude/Groq key for free ATS & Mock Interview analysis.
  - **ATS Resume Scanner & JD Matcher**: Upload PDF resume -> extract skills, match score (0-100%), missing keywords, and formatting feedback.
  - **AI Mock Interview Simulator**: Audio/Video interactive interview session with real-time feedback.
  - **IT Company & HR Directory**: Searchable database of 500+ verified tech companies in Gujarat/India with HR contacts.
- **Backend Engines**: Full integration with `comonk_backend.py` (253 KB) and `questions.py`.

---

### 3. Sevenforce (`apps/sevenforce/frontend` & `backend`)
- **Core Purpose**: Autonomous AI Agent & Workforce Studio (inspired by Sintra.ai & AutomationOwl).
- **Frontend Features**:
  - **7 AI Worker Roster** (Hire your autonomous team):
    1. 🤝 **Buddy** — AI Business Development & Sales Outreach Specialist
    2. 🎧 **Cassie** — 24/7 AI Customer Support & Ticket Resolver
    3. ✍️ **Maya** — AI Copywriter & SEO Content Marketer
    4. 📊 **Dexter** — Data Analytics & Financial Insights AI
    5. 🛍️ **Commet** — E-Commerce Landing Page & Conversion Optimizer
    6. 👔 **RecruitAI** — Autonomous Candidate Sourcer & Screener
    7. 💻 **CodeRaven** — Full-Stack Code Reviewer & Bug Fixer
  - **Drag-and-Drop Workflow Canvas**: Connect triggers, agents, and outputs.
  - **Live Execution Console**: Real-time terminal output stream for running agent tasks.
- **Backend Engines**: Multi-agent graph orchestrator using LangGraph.

---

### 4. Breakdown Factor (`apps/breakdown-factor/frontend` & `backend`)
- **Core Purpose**: Industrial Property Damage & Defect Detection Platform.
- **Frontend Features**:
  - Cyberpunk Military-Grade Inspection Workspace.
  - **Live Image Defect Inspector**: Upload structural photos to trigger PyTorch YOLOv8 (`best.pt`) detection.
  - **Bounding Box Visualizer**: Overlays detected cracks, spalling, and rebar corrosion with confidence scores.
  - **IS 456 Compliance Audit & BOQ Cost Estimator**: Calculates estimated repair materials and cost breakdown in INR.
- **Backend Engines**: FastPyTorch inference pipeline loading `best.pt` (22.5 MB).

---

### 5. AVP Emart (`apps/avp-emart/frontend` & `backend`)
- **Core Purpose**: AI Price Comparison & Smart Shopping Engine (wired with `i:\Project\price-com`).
- **Frontend Features**:
  - Neo-Brutalist 4-Store Price Matrix Board comparing **Amazon**, **Flipkart**, **Reliance Digital**, and **Snapdeal**.
  - **ML Best-Value Index**: Weighted algorithm evaluating price, shipping speed, ratings, and return policy.
  - **30-Day Price Trend SVG Graph**: Interactive chart forecasting price drops over the next month.
  - **LLM Shopping Assistant**: Natural language query input (*"Find best 55-inch 4K TV under ₹45,000"*).
- **Backend Engines**: Integrated `enhanced_comparator.py` aggregation scrapers.

---

### 6. AVPU — AVP University (`apps/avpu/frontend` & `backend`)
- **Core Purpose**: AI-Native Digital Learning & University System.
- **Frontend Features**:
  - **3D Constellation Knowledge Graph**: Interactive node visualizer of semesters, courses, and skills.
  - **Personal AI Tutor (Gyan AI)**: BYOK-powered 24/7 concept explainer and code reviewer.
  - **Adaptive Quiz Engine**: Dynamically generates test questions based on student weak spots.
  - **Placement Matcher**: Matches student skill profile with recruiting companies.
- **Backend Engines**: RAG document QA and vector store index.

---

### 7. Decode Forest Pharmacy (`apps/decode-forest-pharmacy/frontend` & `backend`)
- **Core Purpose**: Free Health Advice, AI Emergency Help, & Pharmacy Services.
- **Frontend Features**:
  - **Free Health Consultation AI Chatbot**: Instant AI triage for symptoms, medicine dosages, and health advice.
  - **Emergency & Hospital Directory**: Near-me hospital finder with direct contact numbers, addresses, and emergency call buttons.
  - **OCR Prescription Scanner**: Upload doctor prescription photo to parse medicine names, usages, and side effects.
  - **Free Medicine & Blood Donation Tracker**: Find free health camps, blood donation drives, and subsidized medicines.
- **Backend Engines**: Tesseract / Vision OCR pipeline and medical knowledge embeddings.

---

### 8. AVP Charitable Trust (`apps/avp-charitable-trust/frontend` & `backend`)
- **Core Purpose**: AI Social Impact & Transparent Philanthropic Portal.
- **Frontend Features**:
  - **80G Tax Exemption Calculator**: Live slider showing tax savings under Section 80G for donations.
  - **Transparent Public Donation Ledger**: Real-time blockchain/hash-style log of received and utilized funds.
  - **Community Impact Map**: Regional map showing sponsored schools, food drives, and medical camps.
  - **Volunteer & Beneficiary Registration**: Quick forms for citizens seeking assistance or volunteering.
- **Backend Engines**: Philanthropic tracking database and PDF 80G receipt generator.

---

## 4. Verification & Deployment Roadmap

### Automated Verification
1. **Backend Syntax Check**: Verify 0 Python syntax errors across all `main.py` files.
2. **Static Site Build Verification**: Execute `python generate_sites.py` to compile static export bundles into `./sites/`.
3. **Container Uptime Test**: Run single-container Docker build locally to verify all 8 subpaths route cleanly.

### Live Deployment Verification
1. **GitHub Sync**: Commit and push changes to `github.com/KunalPatell/sevenseed-platform.git`.
2. **Render Trigger**: Trigger fresh deployment via Render API (`rnd_JIBxw4G9PYrqsfH2tbbyXQQ6OQSg`).
3. **Subpath Inspection**: Verify all 8 live endpoints respond on `sevenseed.onrender.com`.
