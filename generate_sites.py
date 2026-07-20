#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enterprise website generator for the Sevenseed portfolio — an AI-native group.

Every company is positioned as an AI-first venture, mirroring the depth of the
Comonk AI platform (LangGraph multi-agent, Groq LLaMA 3.3 70B, ChromaDB RAG,
MiniLM embeddings, FastAPI). Produces a standalone, self-contained marketing
site (index.html + style.css + app.js) per company on one premium design system.

Run:  python generate_sites.py
Output:  ./<slug>/index.html  (+ style.css, app.js) per company
"""

import os

BASE = os.path.dirname(os.path.abspath(__file__))
# Generated marketing sites live here, one folder per brand. Kept strictly apart
# from apps/<slug>/, which holds the real application code.
SITES = os.path.join(BASE, "sites")

# ── Group registry (footer cross-links). Comonk points to its live product. ──
GROUP = [
    ("comonk",                 "Comonk Technology",                  "../comonk/index.html"),
    ("sevenseed",              "Sevenseed",                          "../index.html"),
    ("sevenforce",             "Sevenforce",                         "../sevenforce/index.html"),
    ("avpu",                   "Alpaben Vipulbhai Patel University",  "../avpu/index.html"),
    ("decode-forest-pharmacy", "Decode Forest Pharmacy",             "../decode-forest-pharmacy/index.html"),
    ("breakdown-factor",       "Breakdown Factor Construction",      "../breakdown-factor/index.html"),
    ("avp-charitable-trust",   "AVP Charitable Trust",               "../avp-charitable-trust/index.html"),
    ("avp-emart",              "AVP Emart",                          "../avp-emart/index.html"),
]

# Shared, production-grade AI stack used across the whole group.
CORE_STACK = ["LangGraph Multi-Agent", "Groq LLaMA 3.3 70B", "ChromaDB RAG", "MiniLM Embeddings", "FastAPI"]

# Venture showcase metadata (icon, sector, one-line blurb) for the Sevenseed hub.
VENTURE_META = {
    "sevenforce":             ("fa-users-gear", "AI Workforce", "Hire a team of AI employees for marketing, sales, hiring, meetings, and data — one platform."),
    "comonk":                 ("fa-brain", "AI Career Intelligence", "Enterprise AI career platform — LangGraph agents, RAG job matching, and mock interviews."),
    "avpu":                   ("fa-graduation-cap", "AI Education", "An AI-powered university with a personal AI tutor and adaptive, career-ready learning."),
    "decode-forest-pharmacy": ("fa-mortar-pestle", "AI Pharmacy", "AI reads prescriptions, checks drug interactions, and delivers genuine medicines fast."),
    "breakdown-factor":       ("fa-helmet-safety", "AI Construction", "Computer-vision site safety and AI cost forecasting for builds that last."),
    "avp-charitable-trust":   ("fa-hand-holding-heart", "AI for Social Impact", "AI finds where help matters most and reports transparent, measurable impact."),
    "avp-emart":              ("fa-cart-shopping", "AI E-Commerce", "AI compares live prices across four platforms and finds you the best value."),
}

# ── Company content (AI-native positioning) ─────────────────────────────────
COMPANIES = [
    {
        "slug": "comonk", "emoji": "🧠", "icon": "fa-brain",
        "live_url": "https://comonk-ai.onrender.com",
        "logo_main": "Comonk", "logo_accent": "AI",
        "sector": "AI Career Intelligence Platform", "established": "Est. 2026",
        "accent": ("#0ea5e9", "#7dd3fc", "#8b5cf6", "#c4b5fd", "14,165,233", "139,92,246"),
        "pill": "AI Career Copilot · LangGraph Agents · 100% Free",
        "hero_title": 'Your AI-powered <span class="grad">career copilot</span><br>for landing the job you want',
        "hero_sub": "Comonk is a free, AI-native career platform for the Ahmedabad/Gandhinagar tech market — resume tailoring, an approval-gated AI application autopilot, mock interviews with real-time scoring, and a full application tracker, all in one place.",
        "badges": [("live", "fa-circle", "Live"), ("a", "fa-microchip", "AI-Native"), ("b", "fa-gift", "100% Free")],
        "stats": [("2,000+", "Companies Tracked"), ("40+", "AI Career Tools"), ("100%", "Free Forever"), ("24/7", "AI Copilot")],
        "marquee": ["Resume AI", "ATS Optimizer", "Mock Interviews", "Job Autopilot", "Salary Insights", "LinkedIn AI", "Application Tracker", "Cover Letters", "Skill Roadmaps", "RAG Job Matching"],
        "ai_stack": CORE_STACK,
        "about_title": "Free AI career intelligence, built for the Ahmedabad/Gandhinagar tech market.",
        "about_paras": [
            "Comonk is a 100% free AI career platform — resume parsing and RAG-based company matching, an ATS optimizer, LinkedIn profile optimization, salary intelligence, and AI-generated career roadmaps, all powered by a LangGraph multi-agent engine on Groq LLaMA 3.3 70B.",
            "Beyond search, Comonk runs your job hunt end-to-end: an approval-gated AI autopilot matches and drafts outreach to the best-fit companies, a full application tracker keeps every stage organised with automatic follow-ups, and voice/video mock interviews score your answers and generate a PDF report.",
        ],
        "highlights": ["Free RAG-based company matching", "Approval-gated AI application autopilot", "Voice & video mock interviews with PDF reports", "Full application tracker with follow-up automation"],
        "svc_eyebrow": "AI CAREER TOOLS", "svc_title": "Everything your job search needs, in one AI platform",
        "services": [
            ("fa-robot", "AI Application Autopilot", "Matches your resume against thousands of companies and drafts outreach for your approval — you stay in control.", "LangGraph Agent"),
            ("fa-file-circle-check", "ATS Resume Optimizer", "Rewrites and tailors your resume to beat applicant tracking systems and match any job description.", "LLM + RAG"),
            ("fa-microphone-lines", "Mock Interviews", "Practice with AI-generated questions via text, voice, or recorded video — get a scored PDF report.", "Groq LLaMA"),
            ("fa-money-bill-trend-up", "Salary Intelligence", "Real salary estimates and offer comparison so you know your worth before you negotiate.", "Market Data"),
            ("fa-diagram-project", "Application Tracker", "A kanban board for every application with automatic follow-up reminders and HR-reply detection.", "Automation"),
            ("fa-map", "AI Career Roadmap", "A personalised, AI-generated learning roadmap from your current skills to your target role.", "LLM Planning"),
        ],
        "proc_title": "How Comonk works",
        "process": [
            ("fa-file-arrow-up", "Upload your resume", "AI parses your skills, experience, and target role instantly."),
            ("fa-brain", "Get matched", "RAG-based matching ranks the best-fit companies for you."),
            ("fa-robot", "Let autopilot help", "Review and approve AI-drafted outreach to your top matches."),
            ("fa-chart-line", "Track & land the job", "Follow every application to offer from one dashboard."),
        ],
        "impact_title": "Built to actually get you hired",
        "metrics": [("2,000+", "Companies Tracked", "Ahmedabad/Gandhinagar focus"), ("40+", "AI Tools", "Free, no paywall"), ("100%", "Free Forever", "No subscription")],
        "cta_title": "Ready to land your next AI/ML role?",
        "cta_text": "Comonk is 100% free — no subscription, no paywall. Upload your resume and let your AI career copilot take it from there.",
        "cta_primary": "Launch Comonk",
        "contact": ("hello@comonk.ai", "+91 84908 61586", "Ahmedabad, Gujarat, India"),
    },
    {
        "slug": "sevenseed", "emoji": "🌱", "icon": "fa-seedling",
        "logo_main": "Seven", "logo_accent": "seed",
        "sector": "AI Venture Studio & Startup Incubator", "established": "Est. 2026",
        "accent": ("#6366f1", "#a5b4fc", "#a855f7", "#d8b4fe", "99,102,241", "168,85,247"),
        "pill": "AI-Native Studio · LangGraph Agents · Shared AI Infrastructure",
        "hero_title": 'We build <span class="grad">AI-native</span> companies<br>from seed to scale',
        "hero_sub": "An AI-first startup studio that ideates, incubates, and launches ventures powered by LLM agents, RAG, and computer vision — on a shared AI infrastructure used across the entire portfolio.",
        "badges": [("live", "fa-circle", "Active"), ("a", "fa-microchip", "AI-Native Studio"), ("b", "fa-layer-group", "7 AI Ventures")],
        "stats": [("7", "AI Ventures"), ("6", "Industries"), ("3", "New Ventures / Year"), ("1", "Shared AI Stack")],
        "marquee": ["LLM Agents", "RAG Pipelines", "Computer Vision", "MLOps", "Vector Search", "Automation", "Forecasting", "Fine-Tuning", "Prompt Engineering", "Shared AI Platform"],
        "ai_stack": CORE_STACK + ["Computer Vision", "MLOps"],
        "about_title": "One AI studio. Seven ventures. One shared brain.",
        "about_paras": [
            "Sevenseed is an AI-native startup studio behind a group of companies across technology, education, healthcare, construction, social impact, and e-commerce. We don't just fund ideas — we engineer them with AI from day one.",
            "Every venture plugs into a shared AI backbone — an LLM gateway, vector store, and multi-agent framework — so founders ship intelligent products in weeks, not years, and compound value across the whole portfolio.",
        ],
        "highlights": ["AI-first ventures from day one", "Shared LLM + RAG infrastructure", "Reusable multi-agent workflows", "Hands-on AI engineering support"],
        "svc_eyebrow": "AI CAPABILITIES", "svc_title": "The AI engine behind every venture",
        "services": [
            ("fa-lightbulb", "AI Venture Ideation", "LLM-driven market research and idea validation surface high-potential ventures fast.", "LLM + RAG"),
            ("fa-layer-group", "Shared AI Platform", "A common backbone — LLM gateway, vector store, and agent framework — reused by every company.", "LangGraph"),
            ("fa-robot", "Multi-Agent Automation", "Reusable agent workflows automate operations, support, and content across the group.", "Multi-Agent"),
            ("fa-database", "RAG Knowledge Base", "A shared retrieval-augmented knowledge base connecting data across all ventures.", "ChromaDB RAG"),
            ("fa-microchip", "AI Talent & Tooling", "Shared AI engineers, MLOps, and tooling so each startup ships AI features quickly.", "MLOps"),
            ("fa-chart-line", "Portfolio Intelligence", "AI dashboards forecast growth and surface cross-company synergies automatically.", "ML Forecasting"),
        ],
        "proc_title": "From seed to forest — the AI way",
        "process": [
            ("fa-lightbulb", "Ideate with AI", "LLM research validates the opportunity and shapes the product."),
            ("fa-seedling", "Incubate", "Stand up the team on our shared AI platform and infrastructure."),
            ("fa-robot", "Build with Agents", "Ship intelligent features fast with reusable multi-agent workflows."),
            ("fa-chart-line", "Scale", "Grow revenue and compound AI advantages across the group."),
        ],
        "impact_title": "The AI portfolio at a glance",
        "metrics": [("3", "Ventures / Year", "AI-native from scratch"), ("7", "Active Companies", "All AI-powered"), ("6", "Industries", "One shared AI stack")],
        "cta_title": "Have a bold AI idea? Let's build it together.",
        "cta_text": "We back founders with AI infrastructure, capital, and hands-on engineering. If you're building something intelligent and ambitious, we want to hear from you.",
        "cta_primary": "Partner with Sevenseed",
        "contact": ("hello@sevenseed.in", "+91 84908 61586", "Ahmedabad, Gujarat, India"),
    },
    {
        "slug": "sevenforce", "emoji": "🤖", "icon": "fa-users-gear",
        "app_url": "app",
        "logo_main": "Seven", "logo_accent": "force",
        "sector": "AI Workforce & Business Automation", "established": "Est. 2026",
        "accent": ("#06b6d4", "#67e8f9", "#8b5cf6", "#c4b5fd", "6,182,212", "139,92,246"),
        "pill": "7 AI Employees · Growth AI · Agency AI",
        "hero_title": 'Hire your <span class="grad">AI workforce</span><br>— seven experts, one platform',
        "hero_sub": "Sevenforce gives every business a team of specialised AI employees — for marketing, sales, hiring, meetings, documents, and data — all running on Sevenseed's shared AI stack.",
        "badges": [("live", "fa-circle", "Live"), ("a", "fa-microchip", "AI-Native"), ("b", "fa-users-gear", "7 AI Employees")],
        "stats": [("7", "AI Employees"), ("2", "AI Suites"), ("24/7", "Always On"), ("1", "Unified Dashboard")],
        "marquee": ["Content AI", "Social AI", "WhatsApp AI", "Proposals & BRD", "Meeting Notes", "AI Recruiter", "Ask-Your-Data", "Campaigns", "Test Cases", "Automation"],
        "ai_stack": CORE_STACK + ["Multi-Agent Orchestration", "NL-to-SQL"],
        "about_title": "Don't just use AI — hire an AI team.",
        "about_paras": [
            "Sevenforce turns AI into your team. Instead of juggling a dozen disconnected tools, you hire specialised AI employees — each an expert at one job — that work together from a single dashboard, around the clock.",
            "Two suites cover the whole business: Growth AI runs your content, social media, and campaigns, while Agency AI handles proposals, documents, meetings, hiring, and data — every agent powered by Sevenseed's shared AI backbone.",
        ],
        "highlights": ["7 specialised AI employees", "Growth AI: content, social & campaigns", "Agency AI: proposals, meetings & hiring", "One dashboard, always on"],
        "svc_eyebrow": "YOUR AI EMPLOYEES", "svc_title": "Meet the team that never sleeps",
        "services": [
            ("fa-pen-nib", "Maya — Content & SEO", "Builds a brand profile from any URL, then generates SEO topics and full long-form articles.", "Growth AI"),
            ("fa-hashtag", "Vibe — Social Media", "Writes platform-perfect captions and posts, schedules them, and tracks engagement.", "Growth AI"),
            ("fa-comment-dots", "Wave — Sales & Comms", "Runs WhatsApp broadcasts, an auto-reply chatbot, and personalised bulk-email campaigns.", "Growth AI"),
            ("fa-file-signature", "Nova — Business Analyst", "Turns a brief into proposals, BRD/PRD docs (Word export), user stories and test cases.", "Agency AI"),
            ("fa-microphone-lines", "Echo — Meeting Assistant", "Turns any transcript into a clean summary, decisions, and owner-tagged action items.", "Agency AI"),
            ("fa-user-tie", "Scout — AI Recruiter", "Screens resumes, generates interview questions, and scores answers on seven dimensions.", "Agency AI"),
            ("fa-chart-column", "Sage — Data Analyst", "Answers questions about your data in plain English with a safe, instant NL-to-SQL engine.", "Agency AI"),
        ],
        "proc_title": "How Sevenforce works",
        "process": [
            ("fa-user-plus", "Hire an AI employee", "Pick the agents your business needs — all from one dashboard."),
            ("fa-sliders", "Brief them once", "Give context once; they learn your brand, data, and goals."),
            ("fa-robot", "They do the work", "Content, campaigns, docs, meetings, hiring and analytics — automated."),
            ("fa-chart-line", "You scale", "Ship more with a lean team and an AI workforce that never sleeps."),
        ],
        "impact_title": "An AI team, at a fraction of the cost",
        "metrics": [("7", "AI Employees", "Across two suites"), ("2", "AI Suites", "Growth AI + Agency AI"), ("24", "Always On", "Hours a day, no downtime", "/7")],
        "cta_title": "Ready to hire your AI workforce?",
        "cta_text": "Give your business a team of AI employees for marketing, sales, hiring, meetings and data — all on Sevenseed's shared AI stack. Start with the agents you need most.",
        "cta_primary": "Hire Your AI Team",
        "contact": ("hello@sevenforce.ai", "+91 84908 61586", "Ahmedabad, Gujarat, India"),
    },
    {
        "slug": "avpu", "emoji": "🎓", "icon": "fa-graduation-cap",
        "logo_main": "AVP", "logo_accent": "University",
        "sector": "AI-Powered Higher Education", "established": "Est. 2026",
        "accent": ("#2563eb", "#93c5fd", "#f59e0b", "#fcd34d", "37,99,235", "245,158,11"),
        "pill": "AI Tutors · Adaptive Learning · LangGraph Agents",
        "hero_title": 'AI-powered education that adapts<br>to <span class="grad">every learner</span>',
        "hero_sub": "A future-ready university where AI tutors, adaptive learning paths, and intelligent placement engines help every student learn faster, build real skills, and graduate career-ready.",
        "badges": [("live", "fa-circle", "Admissions Open"), ("a", "fa-microchip", "AI-Powered"), ("b", "fa-robot", "24/7 AI Tutor")],
        "stats": [("20+", "AI-Enhanced Programs"), ("24/7", "AI Tutor"), ("90%", "Placement Goal"), ("100%", "Personalised")],
        "marquee": ["AI Tutors", "Adaptive Learning", "Auto-Grading", "Placement AI", "Research Copilot", "Skill Analytics", "Live Projects", "Scholarships", "Industry Links", "Innovation"],
        "ai_stack": CORE_STACK + ["Adaptive ML", "NLP"],
        "about_title": "A university with AI built into every classroom.",
        "about_paras": [
            "Alpaben Vipulbhai Patel University reimagines higher education for the AI era. Every learner gets a personal AI tutor, an adaptive curriculum, and instant feedback — so no one is left behind and no one is held back.",
            "We pair AI-driven learning with real industry projects and a semantic placement engine, so students graduate with the knowledge, skills, and job matches to launch their careers.",
        ],
        "highlights": ["Personal AI tutor for every student", "Adaptive, ML-personalised curriculum", "Semantic AI placement matching", "Research copilot for projects"],
        "svc_eyebrow": "AI CAPABILITIES", "svc_title": "AI tools that power your degree",
        "services": [
            ("fa-robot", "AI Tutor & Doubt Solver", "A 24/7 LLM tutor answers questions and explains concepts from your own course material.", "Groq LLaMA 3.3"),
            ("fa-route", "Adaptive Learning Paths", "ML models personalise each student's curriculum to their pace and performance.", "Adaptive ML"),
            ("fa-briefcase", "AI Placement Matcher", "Semantic vector search matches students to the right companies and roles.", "RAG + Embeddings"),
            ("fa-clipboard-check", "Automated Assessment", "AI grades assignments and returns instant, detailed, actionable feedback.", "NLP"),
            ("fa-flask", "Research Copilot", "An AI assistant for literature review, summarisation, and academic drafting.", "LLM + RAG"),
            ("fa-user-graduate", "Smart Admissions", "AI counselling guides every applicant to the program that fits them best.", "AI Agent"),
        ],
        "proc_title": "Your AI-assisted journey with AVPU",
        "process": [
            ("fa-user-graduate", "Apply", "AI counselling helps you choose the right program in minutes."),
            ("fa-robot", "Learn with AI", "Study with a personal AI tutor and an adaptive curriculum."),
            ("fa-diagram-project", "Build", "Ship live projects and research with an AI research copilot."),
            ("fa-briefcase", "Get Placed", "A semantic AI engine matches you to the right roles."),
        ],
        "impact_title": "AI education that delivers outcomes",
        "metrics": [("20+", "Programs", "AI-enhanced curricula"), ("90%", "Placement Target", "AI-matched roles"), ("100%", "Personalised", "One tutor per student")],
        "cta_title": "Ready to learn in the AI era?",
        "cta_text": "Join a university built around your success — with a personal AI tutor, adaptive learning, and intelligent placement support. Take the first step today.",
        "cta_primary": "Enquire About Admissions",
        "contact": ("admissions@avpu.edu.in", "+91 84908 61586", "Anand, Gujarat, India"),
    },
    {
        "slug": "decode-forest-pharmacy", "emoji": "💊", "icon": "fa-mortar-pestle",
        "logo_main": "Decode Forest", "logo_accent": "Pharmacy",
        "sector": "AI-Powered Pharmacy & Healthcare", "established": "Est. 2026",
        "accent": ("#10b981", "#6ee7b7", "#14b8a6", "#5eead4", "16,185,129", "20,184,166"),
        "pill": "AI Prescription Reading · Drug-Interaction AI · Smart Delivery",
        "hero_title": 'AI-powered pharmacy — <span class="grad">smarter, safer</span><br>healthcare for everyone',
        "hero_sub": "A modern pharmacy where AI reads prescriptions, checks drug interactions, and recommends affordable alternatives — with intelligent, on-time doorstep delivery you can trust.",
        "badges": [("live", "fa-circle", "Now Serving"), ("a", "fa-microchip", "AI-Powered"), ("b", "fa-shield-halved", "AI Safety Checks")],
        "stats": [("10k+", "Products"), ("24/7", "AI Assistant"), ("100%", "AI-Verified"), ("60min", "Smart Delivery")],
        "marquee": ["AI Prescription Reader", "Drug-Interaction AI", "Smart Substitutes", "Refill Prediction", "Health Assistant", "Route Optimisation", "Genuine Medicines", "Wellness", "Doorstep Delivery", "Lab Tests"],
        "ai_stack": CORE_STACK + ["OCR + Vision", "ML Forecasting"],
        "about_title": "Healthcare made smarter with AI.",
        "about_paras": [
            "Decode Forest Pharmacy blends genuine medicines with intelligent software. AI reads your prescription, checks for harmful drug interactions, and suggests affordable alternatives — so every order is safer and easier.",
            "With an AI health assistant, refill prediction, and route-optimised delivery, staying healthy has never been more convenient. Every product is 100% genuine and sourced from licensed distributors.",
        ],
        "highlights": ["AI reads & verifies prescriptions", "Automatic drug-interaction safety", "Smart affordable substitutes", "Route-optimised fast delivery"],
        "svc_eyebrow": "AI CAPABILITIES", "svc_title": "Intelligent tools for your health",
        "services": [
            ("fa-file-prescription", "AI Prescription Reader", "Computer vision and OCR read handwritten prescriptions and extract medicines instantly.", "OCR + Vision"),
            ("fa-triangle-exclamation", "Drug Interaction Checker", "An AI safety layer flags potentially harmful drug interactions before dispatch.", "LLM Safety"),
            ("fa-pills", "Smart Substitutes", "ML recommends genuine, affordable generic alternatives that save you more.", "Recommender"),
            ("fa-robot", "AI Health Assistant", "A 24/7 LLM assistant answers your medicine and wellness questions.", "Groq LLaMA 3.3"),
            ("fa-calendar-check", "Refill Prediction", "AI predicts when you'll run out and reminds you to reorder in time.", "ML Forecasting"),
            ("fa-truck-fast", "Smart Delivery Routing", "Route-optimisation AI ensures the fastest possible doorstep delivery.", "Optimisation"),
        ],
        "proc_title": "Get your medicines the smart way",
        "process": [
            ("fa-file-arrow-up", "Upload Prescription", "Snap it — AI reads and extracts your medicines in seconds."),
            ("fa-shield-halved", "AI Safety Check", "Our AI verifies interactions and suggests affordable options."),
            ("fa-box", "Pack & Dispatch", "Licensed pharmacists confirm and dispatch your order."),
            ("fa-house-medical", "Smart Delivery", "Route-optimised delivery brings it to your door, fast."),
        ],
        "impact_title": "AI care you can count on",
        "metrics": [("10000", "Products", "Medicines & wellness"), ("100", "AI-Verified", "Every order checked", "%"), ("60", "Delivery", "Minutes, route-optimised", "min")],
        "cta_title": "Your health, made smarter.",
        "cta_text": "Order genuine medicines with AI safety checks and fast, intelligent delivery. Smarter, safer healthcare — that's the Decode Forest promise.",
        "cta_primary": "Order Now",
        "contact": ("care@decodeforest.in", "+91 84908 61586", "Ahmedabad, Gujarat, India"),
    },
    {
        "slug": "breakdown-factor", "emoji": "🏗️", "icon": "fa-helmet-safety",
        "logo_main": "Breakdown Factor", "logo_accent": "Construction",
        "sector": "AI-Driven Construction & Infrastructure", "established": "Est. 2026",
        "accent": ("#f59e0b", "#fcd34d", "#f97316", "#fdba74", "245,158,11", "249,115,22"),
        "pill": "AI Site Safety · Cost Prediction · Computer-Vision QA",
        "hero_title": 'AI-driven construction —<br><span class="grad">on time, on budget</span>, built to last',
        "hero_sub": "A construction company where computer vision monitors site safety, AI forecasts cost and schedule, and intelligent project agents keep every residential, commercial, and industrial build on track.",
        "badges": [("live", "fa-circle", "Taking Projects"), ("a", "fa-microchip", "AI-Driven"), ("b", "fa-eye", "Vision Safety")],
        "stats": [("20+", "Projects"), ("98%", "On-Time"), ("Zero", "Safety Incidents"), ("24/7", "AI Monitoring")],
        "marquee": ["Vision Site Safety", "Cost Forecasting", "Defect Detection", "Project Copilot", "Smart Estimation", "Quality AI", "Residential", "Commercial", "Industrial", "Govt Tenders"],
        "ai_stack": CORE_STACK + ["YOLO Vision", "ML Forecasting"],
        "about_title": "Construction, engineered with AI.",
        "about_paras": [
            "Breakdown Factor Construction delivers residential, commercial, and industrial projects with an AI edge. Computer vision watches every site for safety, and ML forecasts budgets and timelines before problems appear.",
            "From AI-generated estimates to automated quality inspection, intelligent software keeps every phase on time, on budget, and built to last — with a relentless, zero-incident safety culture.",
        ],
        "highlights": ["Computer-vision site safety, 24/7", "AI cost & schedule forecasting", "Automated defect detection", "AI project copilot & reporting"],
        "svc_eyebrow": "AI CAPABILITIES", "svc_title": "AI on every site, every phase",
        "services": [
            ("fa-helmet-safety", "AI Site Safety Monitor", "Computer vision detects PPE, hazards, and unsafe zones in real time.", "Computer Vision"),
            ("fa-calculator", "Cost & Schedule Prediction", "ML models forecast budgets and timelines and flag overruns early.", "ML Forecasting"),
            ("fa-magnifying-glass", "Damage & Defect Detection", "Vision models inspect structures for cracks, pipe damage, and defects.", "YOLO Vision"),
            ("fa-robot", "AI Project Copilot", "An LLM agent tracks progress, drafts reports, and answers project queries.", "LangGraph Agent"),
            ("fa-file-invoice-dollar", "Smart Estimation", "AI generates material and labour estimates from your plans in minutes.", "LLM + Vision"),
            ("fa-clipboard-check", "Quality Assurance AI", "Automated visual QA checks work against ISO standards at every phase.", "Computer Vision"),
        ],
        "proc_title": "How AI delivers your project",
        "process": [
            ("fa-pencil-ruler", "Consult & Design", "We capture your vision; AI turns plans into instant estimates."),
            ("fa-calculator", "Plan & Predict", "ML forecasts budget and schedule before we break ground."),
            ("fa-eye", "Build & Monitor", "Computer vision watches safety and quality on site, 24/7."),
            ("fa-key", "Handover", "On-time delivery of a project built to stand the test of time."),
        ],
        "impact_title": "AI-built, on trust and results",
        "metrics": [("20", "Projects", "Targeted portfolio", "+"), ("98", "On-Time", "AI-forecast delivery", "%"), ("0", "Incidents", "Vision-monitored safety", "")],
        "cta_title": "Have a project in mind? Let's build it smart.",
        "cta_text": "From homes to industrial facilities and government infrastructure, our AI-driven team delivers quality on time and on budget. Tell us about your project.",
        "cta_primary": "Request a Quote",
        "contact": ("projects@breakdownfactor.in", "+91 84908 61586", "Ahmedabad, Gujarat, India"),
    },
    {
        "slug": "avp-charitable-trust", "emoji": "🤝", "icon": "fa-hand-holding-heart",
        "logo_main": "AVP", "logo_accent": "Charitable Trust",
        "sector": "AI for Social Impact · Non-Profit", "established": "Est. 2026",
        "accent": ("#f43f5e", "#fda4af", "#f59e0b", "#fcd34d", "244,63,94", "245,158,11"),
        "pill": "AI Needs Assessment · Impact Analytics · Donor AI",
        "hero_title": 'AI for good — turning generosity<br>into <span class="grad">measurable impact</span>',
        "hero_sub": "A non-profit that uses AI to identify community needs, match beneficiaries to the right programs, and report transparent, measurable impact for every rupee raised.",
        "badges": [("live", "fa-circle", "Active Programs"), ("a", "fa-microchip", "AI for Good"), ("b", "fa-chart-pie", "Impact Analytics")],
        "stats": [("4+", "Programs / Year"), ("1000+", "Lives Touched"), ("100%", "AI-Transparent"), ("24/7", "Donor AI")],
        "marquee": ["Needs Assessment AI", "Beneficiary Matching", "Impact Analytics", "Donor Assistant", "Anomaly Detection", "Volunteer Matching", "Scholarships", "Health Camps", "CSR", "Community"],
        "ai_stack": CORE_STACK + ["Anomaly Detection", "ML Analytics"],
        "about_title": "Compassion, amplified by AI.",
        "about_paras": [
            "The AVP Charitable Trust channels the success of our AI group back into communities. AI analyses real data to find where help matters most, then matches beneficiaries to scholarships, healthcare, and welfare programs.",
            "Every rupee is tracked with AI-powered transparency and anomaly detection, and every program's impact is measured and reported. Because giving back should be as intelligent as it is heartfelt.",
        ],
        "highlights": ["AI finds where help matters most", "Semantic beneficiary matching", "AI-powered transparent reporting", "Anomaly detection on every rupee"],
        "svc_eyebrow": "AI CAPABILITIES", "svc_title": "AI that maximises every rupee",
        "services": [
            ("fa-magnifying-glass-chart", "AI Needs Assessment", "ML analyses community data to pinpoint where support matters most.", "ML Analytics"),
            ("fa-people-group", "Beneficiary Matching", "Semantic matching connects beneficiaries to the right programs and scholarships.", "RAG + Embeddings"),
            ("fa-chart-pie", "AI Impact Reporting", "AI compiles transparent, real-time impact reports for every donor.", "LLM Reports"),
            ("fa-robot", "Donor Assistant", "An AI assistant answers donor questions and suggests where to give.", "Groq LLaMA 3.3"),
            ("fa-shield-halved", "Transparency & Fraud AI", "Anomaly detection keeps every disbursement transparent and accountable.", "Anomaly Detection"),
            ("fa-hands-helping", "Volunteer Coordinator", "AI matches volunteers to programs by their skills and availability.", "AI Agent"),
        ],
        "proc_title": "How AI turns your support into impact",
        "process": [
            ("fa-magnifying-glass", "AI Finds the Need", "ML analyses data to find communities that need us most."),
            ("fa-hand-holding-dollar", "Mobilize Resources", "Donations and CSR partnerships fund the right programs."),
            ("fa-hands-helping", "Deliver Programs", "Volunteers, matched by AI, bring programs to the ground."),
            ("fa-chart-line", "Report Impact", "AI publishes transparent reports on every rupee and life touched."),
        ],
        "impact_title": "Impact you can measure",
        "metrics": [("4", "Programs / Year", "AI-prioritised", "+"), ("1000", "Lives Touched", "Across communities", "+"), ("100", "Transparent", "AI-tracked funds", "%")],
        "cta_title": "Join us in creating measurable change.",
        "cta_text": "Whether you donate, partner, or volunteer, AI ensures your support reaches the right people — with full transparency on the impact you create. Be part of the change.",
        "cta_primary": "Donate or Volunteer",
        "contact": ("connect@avptrust.org", "+91 84908 61586", "Ahmedabad, Gujarat, India"),
    },
    {
        "slug": "avp-emart", "emoji": "🛒", "icon": "fa-cart-shopping",
        "logo_main": "AVP", "logo_accent": "Emart",
        "sector": "AI-Powered E-Commerce & Smart Shopping", "established": "Est. 2026",
        "accent": ("#f97316", "#fdba74", "#10b981", "#6ee7b7", "249,115,22", "16,185,129"),
        "pill": "AI Price Comparison · Best-Value Scoring · LLM Shopping Assistant",
        "hero_title": 'AI shopping that finds you the<br><span class="grad">best price</span>, every time',
        "hero_sub": "An AI-powered marketplace that compares live prices across Amazon, Flipkart, Reliance Digital, and Snapdeal, scores the best value with ML, and delivers it to your door.",
        "badges": [("live", "fa-circle", "Live"), ("a", "fa-microchip", "AI-Powered"), ("b", "fa-scale-balanced", "Price Compare AI")],
        "stats": [("4", "Platforms Compared"), ("10k+", "Products"), ("24/7", "AI Assistant"), ("₹1Cr", "GMV Year 1")],
        "marquee": ["AI Price Compare", "Best-Value Scoring", "Shopping Assistant", "Smart Recommendations", "Price Forecasting", "Review Intelligence", "Amazon", "Flipkart", "Reliance Digital", "Snapdeal"],
        "ai_stack": CORE_STACK + ["ML Scoring", "NLP Summarisation"],
        "about_title": "Shop smart. AI always finds the best price.",
        "about_paras": [
            "AVP Emart is a smart-shopping platform powered by AI. Our engine checks Amazon, Flipkart, Reliance Digital, and Snapdeal in real time, then a weighted ML algorithm scores each product by price, ratings, and reviews.",
            "Ask our LLM shopping assistant in plain language, get personalised recommendations, and let AI summarise thousands of reviews into a quick verdict — then we deliver your best-value pick to your door.",
        ],
        "highlights": ["Live AI price compare, 4 platforms", "Best-value ML scoring", "LLM shopping assistant", "AI review summaries & trends"],
        "svc_eyebrow": "AI CAPABILITIES", "svc_title": "AI that shops smarter than you",
        "services": [
            ("fa-scale-balanced", "AI Price Comparison", "Real-time AI compares prices, ratings, and reviews across four platforms at once.", "Live Aggregation"),
            ("fa-star-half-stroke", "Best-Value Scoring", "A weighted ML algorithm ranks products by price, ratings, and reviews.", "ML Scoring"),
            ("fa-robot", "LLM Shopping Assistant", "Ask in plain language — an AI assistant finds exactly the right product.", "Groq LLaMA 3.3"),
            ("fa-wand-magic-sparkles", "Smart Recommendations", "Personalised product recommendations tuned to your preferences.", "Recommender"),
            ("fa-chart-line", "Price-Trend Forecasting", "AI predicts price movements so you buy at exactly the right time.", "ML Forecasting"),
            ("fa-comments", "Review Intelligence", "NLP summarises thousands of reviews into a fast, trustworthy verdict.", "NLP Summarisation"),
        ],
        "proc_title": "From search to doorstep, powered by AI",
        "process": [
            ("fa-magnifying-glass", "Search or Ask", "Search a product or just ask our AI shopping assistant."),
            ("fa-scale-balanced", "AI Compares", "Live AI compares prices, ratings, and reviews across platforms."),
            ("fa-award", "Best-Value Pick", "Our ML scoring engine highlights the smartest buy for you."),
            ("fa-truck-fast", "Order & Deliver", "Check out and get it delivered fast to your door."),
        ],
        "impact_title": "AI built to save you money",
        "metrics": [("4", "Platforms", "Compared in real time", ""), ("10000", "Products", "And growing", "+"), ("1", "GMV Target", "Crore in Year 1", "Cr")],
        "cta_title": "Start shopping smarter with AI.",
        "cta_text": "Try the live AI price comparator — search any product and instantly see the best value across Amazon, Flipkart, Reliance Digital, and Snapdeal.",
        "cta_primary": "Try the AI Price Comparator",
        "live_url": "https://price-com-7.streamlit.app/",
        "contact": ("shop@avpemart.com", "+91 84908 61586", "Ahmedabad, Gujarat, India"),
    },
]

# ── Extra enterprise content (pillars / testimonials / FAQs) per company ─────
EXTRA = {
    "comonk": {
        "pillars": [
            ("fa-gift", "100% Free", "No subscription, no paywall, ever."),
            ("fa-robot", "AI Autopilot", "Matches and drafts outreach for your approval."),
            ("fa-diagram-project", "Application Tracker", "Every stage, every follow-up, one board."),
            ("fa-microphone-lines", "Real Interview Practice", "Voice, video, and scored PDF reports."),
        ],
        "testimonials": [
            ("The autopilot found companies I'd never have thought to apply to — and I stayed in control of every message it drafted.", "Job Seeker", "Ahmedabad"),
            ("The mock interview scoring told me exactly where I was losing points before the real thing.", "Candidate", "Gandhinagar"),
            ("Free, and genuinely more useful than tools I've paid for.", "Job Seeker", "Ahmedabad"),
        ],
        "faqs": [
            ("Is Comonk really free?", "Yes — 100% free, no subscription or paywall. It's built to help the Ahmedabad/Gandhinagar tech community find AI/ML and software roles."),
            ("What is the AI application autopilot?", "It matches your resume against thousands of tracked companies using RAG-based scoring, then drafts outreach — but never sends anything without your explicit approval."),
            ("Can I practice interviews with it?", "Yes — text, voice, or full video mock interviews, each scored with a detailed PDF report you can review afterward."),
            ("Does it track my applications?", "Yes — a full kanban-style tracker with automatic follow-up reminders and HR-reply detection, so nothing falls through the cracks."),
        ],
    },
    "sevenseed": {
        "pillars": [
            ("fa-brain", "AI-Native", "Every venture is built with AI from day one."),
            ("fa-shield-halved", "Shared AI Backbone", "One LLM + RAG stack across the group."),
            ("fa-users", "Founder-First", "Hands-on AI engineering, every week."),
            ("fa-layer-group", "Diversified", "Six industries, one intelligent ecosystem."),
        ],
        "testimonials": [
            ("Sevenseed's shared AI stack let us launch an intelligent product in weeks, not years.", "Portfolio Founder", "Comonk Technology"),
            ("Their multi-agent framework did the work of a whole engineering team.", "Operating Partner", "AVP Emart"),
            ("More than investors — they're AI builders in the trenches with you.", "Founder", "Decode Forest Pharmacy"),
        ],
        "faqs": [
            ("What makes Sevenseed AI-native?", "Every venture is engineered on a shared AI backbone — LangGraph multi-agent, Groq LLaMA 3.3 70B, and ChromaDB RAG — so AI isn't bolted on, it's the foundation."),
            ("Do you invest in external startups?", "We primarily build in-house, but we selectively partner with exceptional AI founders whose ideas fit the portfolio."),
            ("Which sectors do you operate in?", "Technology, education, healthcare, construction, social impact, and e-commerce — all AI-powered."),
            ("How can I pitch an idea?", "Reach out via our contact section or email — we review every serious AI proposal personally."),
        ],
    },
    "sevenforce": {
        "pillars": [
            ("fa-users-gear", "7 AI Employees", "A specialist for every core business job."),
            ("fa-rocket", "Growth AI Suite", "Content, social & campaigns that compound."),
            ("fa-building", "Agency AI Suite", "Proposals, meetings, hiring & delivery."),
            ("fa-plug", "One Platform", "Every agent on Sevenseed's shared AI stack."),
        ],
        "testimonials": [
            ("We replaced five disconnected tools with Sevenforce's AI team — and now move twice as fast.", "Founder", "Growth-Stage SaaS"),
            ("Nova drafted our client proposal and Echo handled the meeting notes. Unreal.", "Owner", "Digital Agency"),
            ("Sage answers our data questions in plain English — no analyst required.", "Operations Lead", "D2C Brand"),
        ],
        "faqs": [
            ("What is Sevenforce?", "An AI workforce platform — hire specialised AI employees for marketing, sales, hiring, meetings, documents and data, all from one dashboard."),
            ("What are the Growth AI and Agency AI suites?", "Growth AI covers content, social and campaigns (Maya, Vibe, Wave). Agency AI covers proposals & docs, meetings, hiring and data (Nova, Echo, Scout, Sage)."),
            ("Do I have to hire all seven?", "No — start with the AI employees you need most and add more anytime. Each works on its own or together with the rest."),
            ("What powers Sevenforce?", "Sevenseed's shared AI backbone — LangGraph multi-agent orchestration, Groq LLaMA 3.3 70B, RAG, and a safe NL-to-SQL engine."),
        ],
    },
    "avpu": {
        "pillars": [
            ("fa-robot", "Personal AI Tutor", "24/7 guidance for every student."),
            ("fa-route", "Adaptive Learning", "Curriculum that adjusts to you."),
            ("fa-briefcase", "AI Placements", "Semantic matching to real roles."),
            ("fa-award", "Scholarships", "Merit & need-based support."),
        ],
        "testimonials": [
            ("The AI tutor answered my doubts at midnight before exams — it's like having a mentor 24/7.", "Final-Year Student", "B.Tech, Computer Science"),
            ("Adaptive learning meant the course moved at exactly my pace.", "Alumna", "MBA, Class of 2026"),
            ("The AI placement engine matched me to a role I didn't even know existed.", "Graduate", "PG Diploma"),
        ],
        "faqs": [
            ("How does the AI tutor work?", "A Groq LLaMA-powered assistant, grounded in your course material via RAG, answers questions and explains concepts 24/7."),
            ("Are the programs accredited?", "We are actively pursuing accreditation and recognition from national education bodies."),
            ("Do you offer scholarships?", "Yes — merit and need-based scholarships, including support through the AVP Charitable Trust."),
            ("Is there placement support?", "A semantic AI placement engine plus a dedicated cell provide matching, training, and interview prep."),
        ],
    },
    "decode-forest-pharmacy": {
        "pillars": [
            ("fa-file-prescription", "AI Reads Scripts", "OCR + vision extract your medicines."),
            ("fa-shield-halved", "AI Safety Checks", "Drug-interaction alerts on every order."),
            ("fa-indian-rupee-sign", "Smart Savings", "AI finds affordable generics."),
            ("fa-truck-fast", "Smart Delivery", "Route-optimised, often within the hour."),
        ],
        "testimonials": [
            ("The app read my doctor's messy handwriting perfectly — and flagged an interaction my last pharmacy missed.", "Regular Customer", "Ahmedabad"),
            ("AI suggested a generic that cut my monthly bill in half.", "Customer", "Maninagar"),
            ("Quick, genuine, and genuinely smart. Exactly what a pharmacy should be.", "Customer", "Satellite"),
        ],
        "faqs": [
            ("How does the AI read my prescription?", "Computer vision and OCR extract the medicines from a photo, then our AI verifies them before a licensed pharmacist confirms the order."),
            ("Is the drug-interaction check reliable?", "Our AI safety layer flags potential interactions for review, and a licensed pharmacist always confirms before dispatch."),
            ("Are your medicines genuine?", "Yes — every product is 100% authentic and sourced only from licensed distributors."),
            ("How fast is delivery?", "Route-optimisation AI enables in-city delivery within 60 minutes to a few hours."),
        ],
    },
    "breakdown-factor": {
        "pillars": [
            ("fa-eye", "Vision Safety", "Computer vision watches every site."),
            ("fa-chart-line", "AI Forecasting", "Cost & schedule predicted early."),
            ("fa-medal", "Quality AI", "Automated ISO-aligned inspection."),
            ("fa-sack-dollar", "On-Budget", "AI estimates you can trust."),
        ],
        "testimonials": [
            ("Their AI safety monitoring flagged a hazard before it became an incident.", "Client", "Retail Developer"),
            ("The cost forecast was accurate to the rupee — no surprises.", "Client", "Homeowner"),
            ("The AI project copilot kept us updated at every milestone, automatically.", "Client", "Industrial Client"),
        ],
        "faqs": [
            ("How do you use AI on site?", "Computer vision monitors PPE and hazards in real time, while ML forecasts cost and schedule and AI agents track progress and draft reports."),
            ("What types of projects do you take on?", "Residential, commercial, and industrial construction, plus turnkey projects and government tenders."),
            ("Are you ISO certified?", "We follow ISO-aligned quality management with automated AI inspection, and are pursuing formal certification."),
            ("How do you ensure safety?", "A computer-vision safety monitor plus a strict, zero-incident safety culture across all sites."),
        ],
    },
    "avp-charitable-trust": {
        "pillars": [
            ("fa-magnifying-glass-chart", "AI Finds Need", "Data pinpoints where to help."),
            ("fa-eye", "AI Transparency", "Every rupee tracked and reported."),
            ("fa-graduation-cap", "Education-Focused", "Scholarships that change lives."),
            ("fa-hand-holding-heart", "Impact-Driven", "Measured by lives we touch."),
        ],
        "testimonials": [
            ("The scholarship changed my life — an AI match connected me to it when no one else did.", "Beneficiary", "Scholarship Recipient"),
            ("Their AI-driven health camp reached families who had nowhere else to turn.", "Volunteer", "Community Health Camp"),
            ("The AI impact reports show me exactly where my donation goes. Total trust.", "Donor", "Monthly Contributor"),
        ],
        "faqs": [
            ("How does AI help your cause?", "AI analyses community data to find where support matters most, matches beneficiaries to programs, and generates transparent impact reports for donors."),
            ("How is my donation used?", "Every contribution funds welfare, education, and healthcare programs — with AI-tracked, transparent reporting on impact."),
            ("Is my donation tax-exempt?", "We are applying for 80G tax-exempt status; updates will be shared with our donors as we progress."),
            ("Can I volunteer?", "Yes — our AI coordinator matches volunteers to programs by skills and availability. Reach out to get involved."),
        ],
    },
    "avp-emart": {
        "pillars": [
            ("fa-scale-balanced", "AI Compare", "Live prices across four platforms."),
            ("fa-piggy-bank", "Best-Value AI", "ML scoring on every product."),
            ("fa-robot", "Shopping Assistant", "Ask, and AI finds it for you."),
            ("fa-truck-fast", "Fast Delivery", "Quick, reliable fulfilment."),
        ],
        "testimonials": [
            ("The AI found me a price 20% lower than where I was about to buy.", "Shopper", "Ahmedabad"),
            ("I just asked the assistant and it compared everything for me — shopping finally makes sense.", "Shopper", "Vadodara"),
            ("The best-value score takes the guesswork out of every purchase.", "Shopper", "Surat"),
        ],
        "faqs": [
            ("How does the AI comparison work?", "Our engine aggregates live listings from Amazon, Flipkart, Reliance Digital, and Snapdeal, then a weighted ML algorithm scores each by price, ratings, and reviews."),
            ("What is the AI shopping assistant?", "A Groq LLaMA-powered assistant that understands plain-language requests and finds the right product and best price for you."),
            ("Is there a live demo?", "Yes — try our live AI price comparator to search any product and compare instantly across all four platforms."),
            ("Do you deliver?", "Yes — we integrate with delivery partners like Shiprocket and Delhivery for fast, reliable fulfilment."),
        ],
    },
}


# ── Renderers ───────────────────────────────────────────────────────────────
def render_badges(badges):
    return "\n        ".join(
        f'<span class="pill-badge {tone}"><i class="fas {icon}"></i>{text}</span>'
        for tone, icon, text in badges
    )


def render_stats(stats):
    cells = []
    for i, (val, label) in enumerate(stats):
        if i:
            cells.append('<div class="hs-sep"></div>')
        cells.append(f'<div class="hs"><div class="hs-num count">{val}</div><div class="hs-lbl">{label}</div></div>')
    return "\n        ".join(cells)


def render_marquee(items):
    row = "".join(f"<span>{x}</span>" for x in items)
    return row + row


def render_ai_chips(stack):
    return "".join(f'<span class="ai-chip"><i class="fas fa-microchip"></i>{t}</span>' for t in stack)


def render_highlights(items):
    return "\n          ".join(f'<li><i class="fas fa-check"></i>{x}</li>' for x in items)


def render_services(services):
    out = []
    for i, (icon, title, desc, tag) in enumerate(services):
        tone = "p" if i % 2 == 0 else "s"
        out.append(
            f'<article class="svc-card glow reveal" data-tilt>'
            f'<div class="svc-ic {tone}"><i class="fas {icon}"></i></div>'
            f"<h4>{title}</h4><p>{desc}</p>"
            f'<span class="svc-tag"><i class="fas fa-bolt"></i>{tag}</span></article>'
        )
    return "\n        ".join(out)


def render_process(process):
    out = []
    for i, (icon, title, desc) in enumerate(process, 1):
        out.append(
            f'<div class="proc-step glow reveal" data-tilt>'
            f'<div class="proc-num">{i:02d}</div>'
            f'<div class="proc-ic"><i class="fas {icon}"></i></div>'
            f"<h4>{title}</h4><p>{desc}</p></div>"
        )
    return "\n        ".join(out)


def render_metrics(metrics):
    out = []
    for m in metrics:
        val, label, sub = m[0], m[1], m[2]
        suffix = m[3] if len(m) > 3 else ""
        out.append(
            f'<div class="metric glow reveal" data-tilt><div class="metric-num count">{val}{suffix}</div>'
            f'<div class="metric-lbl">{label}</div><div class="metric-sub">{sub}</div></div>'
        )
    return "\n        ".join(out)


def render_testimonials(items):
    out = []
    for quote, name, role in items:
        initials = "".join(w[0] for w in name.split()[:2]).upper()
        out.append(
            f'<figure class="tcard glow reveal"><div class="tstars">'
            + ('<i class="fas fa-star"></i>' * 5)
            + f'</div><blockquote>&ldquo;{quote}&rdquo;</blockquote>'
            f'<figcaption><span class="tavatar">{initials}</span>'
            f'<span class="tmeta"><strong>{name}</strong><small>{role}</small></span></figcaption></figure>'
        )
    return "\n        ".join(out)


def render_faqs(items):
    out = []
    for q, a in items:
        out.append(
            f'<details class="faq reveal"><summary>{q}<i class="fas fa-plus"></i></summary>'
            f'<div class="faq-a">{a}</div></details>'
        )
    return "\n        ".join(out)


def render_pillars(pillars):
    return "\n        ".join(
        f'<div class="pillar reveal"><div class="pillar-ic"><i class="fas {icon}"></i></div>'
        f'<div class="pillar-txt"><strong>{title}</strong><span>{desc}</span></div></div>'
        for icon, title, desc in pillars
    )


def _link(current_slug, target_slug, target_href):
    """Resolve a cross-brand link. Sevenseed lives at the repo ROOT (it is the
    home/entry site); every other brand lives in its own subfolder."""
    if str(target_href).startswith("http"):
        return target_href  # external (e.g. Comonk live product)
    if current_slug == "sevenseed":                       # current page is the root
        return "index.html" if target_slug == "sevenseed" else f"{target_slug}/index.html"
    # current page is inside a subfolder
    return "../index.html" if target_slug == "sevenseed" else f"../{target_slug}/index.html"


def render_ventures_section(current_slug):
    """A portfolio showcase of every other venture — used on the Sevenseed hub."""
    cards = []
    for slug, name, href in GROUP:
        if slug == current_slug or slug not in VENTURE_META:
            continue
        icon, sector, blurb = VENTURE_META[slug]
        link = _link(current_slug, slug, href)
        ext = ' target="_blank" rel="noopener"' if href.startswith("http") else ""
        live = '<span class="vent-live"><i class="fas fa-circle"></i> Live</span>' if href.startswith("http") else ""
        cards.append(
            f'<a class="vent-card glow reveal" href="{link}"{ext} data-tilt>'
            f'<div class="vent-top"><span class="vent-ic"><i class="fas {icon}"></i></span>{live}</div>'
            f'<h4>{name}</h4><span class="vent-sector">{sector}</span>'
            f'<p>{blurb}</p><span class="vent-go">Visit site <i class="fas fa-arrow-right"></i></span></a>'
        )
    grid = "\n        ".join(cards)
    return f"""
<section class="section ventures" id="ventures">
  <div class="eyebrow center">THE PORTFOLIO</div>
  <h2 class="sec-title">Our AI ventures</h2>
  <div class="vent-grid">
        {grid}
  </div>
</section>
"""


def render_group_footer(current_slug):
    out = []
    for slug, name, href in GROUP:
        if slug == current_slug:
            out.append(f'<li><span class="foot-current">{name}</span></li>')
        else:
            ext = ' target="_blank" rel="noopener"' if href.startswith("http") else ""
            out.append(f'<li><a href="{_link(current_slug, slug, href)}"{ext}>{name}</a></li>')
    return "\n          ".join(out)


def render_sandbox(c):
    slug = c["slug"]
    if slug == "comonk":
        return ""
    
    fields_html = ""
    title = ""
    desc = ""
    endpoint = ""
    
    if slug == "sevenseed":
        title = "AI Venture Idea Evaluator"
        desc = "Validate your AI startup concept instantly. Our LLM-driven evaluation system checks viability, market potential, and alignment with the studio's portfolio."
        endpoint = "http://localhost:8001/api/tools/evaluate"
        fields_html = """
        <div class="sandbox-field">
          <label for="sb-name">Venture Name</label>
          <input type="text" id="sb-name" placeholder="e.g. EcoSphere" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-sector">Industry Sector</label>
          <input type="text" id="sb-sector" placeholder="e.g. ClimateTech / Carbon Reporting" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-description">Description & AI Angle</label>
          <textarea id="sb-description" rows="4" placeholder="Describe the problem, target audience, and how AI solves it..." required></textarea>
        </div>
        """
    elif slug == "sevenforce":
        title = "Scout — AI Recruiter Simulator"
        desc = "Simulate our Scout HR Agent. Input a target role and job description to automatically generate tailored interview questions and evaluation guidance."
        endpoint = "http://localhost:8002/api/tools/interview-generate"
        fields_html = """
        <div class="sandbox-field">
          <label for="sb-role">Target Role</label>
          <input type="text" id="sb-role" placeholder="e.g. Senior Python Engineer" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-jd">Job Description (Brief)</label>
          <textarea id="sb-jd" rows="3" placeholder="Core duties, technology stack, and requirements..." required></textarea>
        </div>
        <div class="sandbox-field">
          <label for="sb-resume">Candidate Profile (Optional)</label>
          <textarea id="sb-resume" rows="2" placeholder="Paste resume bullet points or skills summary..."></textarea>
        </div>
        """
    elif slug == "avpu":
        title = "Adaptive Study Planner"
        desc = "Personalize your learning path. Enter a topic you want to master, specify your availability, and generate a customized study curriculum."
        endpoint = "http://localhost:8003/api/tools/study-plan"
        fields_html = """
        <div class="sandbox-field">
          <label for="sb-goal">Learning Goal</label>
          <input type="text" id="sb-goal" placeholder="e.g. Learn Python Data Analysis from scratch" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-hours">Study Hours Per Day</label>
          <input type="number" id="sb-hours" value="2" min="0.5" max="8" step="0.5" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-days">Target Days</label>
          <input type="number" id="sb-days" value="7" min="1" max="30" required>
        </div>
        """
    elif slug == "decode-forest-pharmacy":
        title = "AI Drug Interaction Checker"
        desc = "Scan medicine lists for dangerous chemical interactions. Type in two drugs to run our LLM safety protocols."
        endpoint = "http://localhost:8004/api/interactions"
        fields_html = """
        <div class="sandbox-field">
          <label for="sb-drug1">Primary Medicine (Drug 1)</label>
          <input type="text" id="sb-drug1" placeholder="e.g. Aspirin" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-drug2">Secondary Medicine (Drug 2)</label>
          <input type="text" id="sb-drug2" placeholder="e.g. Warfarin" required>
        </div>
        """
    elif slug == "breakdown-factor":
        title = "AI BOQ & Material Cost Estimator"
        desc = "Calculate construction materials (cement, bricks, steel) and estimates. Enter the built-up area and quality grade."
        endpoint = "http://localhost:8005/api/tools/boq"
        fields_html = """
        <div class="sandbox-field">
          <label for="sb-area">Built-Up Area (sq ft)</label>
          <input type="number" id="sb-area" placeholder="e.g. 1500" min="100" max="50000" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-quality">Construction Quality</label>
          <select id="sb-quality">
            <option value="Standard">Standard (Quality local materials)</option>
            <option value="Premium">Premium (Branded modular fits)</option>
            <option value="Ultra-Premium">Ultra-Premium (Top international luxury imports)</option>
          </select>
        </div>
        """
    elif slug == "avp-charitable-trust":
        title = "Community Needs Assessor"
        desc = "Synthesize village demographics and issues to identify priority intervention strategies, recommended programs, and estimated budgets."
        endpoint = "http://localhost:8006/api/needs"
        fields_html = """
        <div class="sandbox-field">
          <label for="sb-location">Location / Village</label>
          <input type="text" id="sb-location" placeholder="e.g. Viramgam Rural Cluster, Gujarat" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-pop">Estimated Population</label>
          <input type="text" id="sb-pop" placeholder="e.g. 250 families" required>
        </div>
        <div class="sandbox-field">
          <label for="sb-issues">Key Community Issues</label>
          <textarea id="sb-issues" rows="3" placeholder="e.g. No high school within 10km, fluoride in water..." required></textarea>
        </div>
        <div class="sandbox-field">
          <label for="sb-income">Average Income Level</label>
          <select id="sb-income">
            <option value="low">Low (Below ₹1.5L p.a.)</option>
            <option value="medium">Medium (₹1.5L - ₹3L p.a.)</option>
            <option value="high">High (Above ₹3L p.a.)</option>
          </select>
        </div>
        """
    elif slug == "avp-emart":
        title = "AI Price Comparator & Value Scorer"
        desc = "Simulate live shopping queries across online platforms. Enter a product name to search Flipkart, Amazon, Reliance, and Snapdeal."
        endpoint = "http://localhost:8007/api/compare"
        fields_html = """
        <div class="sandbox-field">
          <label for="sb-query">Product Name</label>
          <input type="text" id="sb-query" placeholder="e.g. iPhone 15 Pro Max" required>
        </div>
        """
        
    return f"""
<section class="section sandbox-sec" id="sandbox">
  <div class="eyebrow center">AI PLAYGROUND</div>
  <h2 class="sec-title">Try the AI Live</h2>
  <p class="sandbox-subtitle center">{desc}</p>
  
  <div class="sandbox-container reveal">
    <div class="sandbox-card glow">
      <div class="sandbox-card-header">
        <div class="sandbox-dot red"></div>
        <div class="sandbox-dot yellow"></div>
        <div class="sandbox-dot green"></div>
        <span class="sandbox-card-title">{title}</span>
      </div>
      <div class="sandbox-card-body">
        <form class="sandbox-form" id="sandboxForm" data-endpoint="{endpoint}">
          {fields_html}
          <button type="submit" class="btn btn-primary lg" id="sandboxBtn">
            <i class="fas fa-play"></i> Run AI Model
          </button>
        </form>
        <div class="sandbox-result">
          <div class="sandbox-result-header">
            <span>Terminal Output</span>
            <button class="sandbox-copy-btn" id="sandboxCopy" type="button" aria-label="Copy output">
              <i class="far fa-copy"></i>
            </button>
          </div>
          <div class="sandbox-pre-wrap">
            <pre class="sandbox-pre" id="sandboxOutput">// Output will be displayed here after you execute the model...</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
"""


def render_html(c):
    email, phone, location = c["contact"]
    live_url = c.get("live_url")
    name = f'{c["logo_main"]} <span class="logo-accent">{c["logo_accent"]}</span>'
    full_name = f'{c["logo_main"]} {c["logo_accent"]}'
    favicon = (
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E"
        f"%3Ctext y='.9em' font-size='88'%3E{c['emoji']}%3C/text%3E%3C/svg%3E"
    )

    if live_url:
        hero_buttons = (
            f'<a class="btn btn-primary lg" href="{live_url}" target="_blank" rel="noopener"><i class="fas fa-rocket"></i> {c["cta_primary"]}</a>'
            f'<a class="btn btn-ghost lg" href="#services"><i class="fas fa-microchip"></i> See the AI</a>'
        )
        cta_primary_btn = f'<a class="btn btn-primary lg" href="{live_url}" target="_blank" rel="noopener"><i class="fas fa-rocket"></i> {c["cta_primary"]}</a>'
        nav_cta = f'<a class="btn btn-primary" href="{live_url}" target="_blank" rel="noopener"><i class="fas fa-rocket"></i> Launch</a>'
    else:
        hero_buttons = (
            f'<a class="btn btn-primary lg" href="#contact"><i class="fas fa-paper-plane"></i> {c["cta_primary"]}</a>'
            f'<a class="btn btn-ghost lg" href="#services"><i class="fas fa-microchip"></i> See the AI</a>'
        )
        cta_primary_btn = f'<a class="btn btn-primary lg" href="mailto:{email}"><i class="fas fa-paper-plane"></i> {c["cta_primary"]}</a>'
        nav_cta = f'<a class="btn btn-primary" href="#contact"><i class="fas fa-envelope"></i> Contact</a>'

    ventures_section = render_ventures_section(c["slug"]) if c["slug"] == "sevenseed" else ""
    ventures_nav = '<a href="#ventures">Ventures</a>' if c["slug"] == "sevenseed" else ""
    sandbox_section = render_sandbox(c)
    ports = {
        "sevenseed": "8001", "sevenforce": "8002", "avpu": "8003",
        "decode-forest-pharmacy": "8004", "breakdown-factor": "8005",
        "avp-charitable-trust": "8006", "avp-emart": "8007"
    }
    subpath = "app" if c["slug"] == "sevenforce" else "dashboard"
    app_url = f'http://localhost:{ports[c["slug"]]}/{subpath}' if c["slug"] in ports else "https://comonk-ai.onrender.com"
    app_btn = f'<a class="btn btn-ghost" href="{app_url}"><i class="fas fa-wand-magic-sparkles"></i> Launch App</a>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{full_name} — {c["sector"]}</title>
  <meta name="description" content="{c["hero_sub"]}">
  <link rel="icon" href="{favicon}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<span id="top"></span>

<div class="preloader" id="preloader">
  <div class="pl-glow pl-glow-1"></div>
  <div class="pl-glow pl-glow-2"></div>
  <div class="pl-content">
    <div class="pl-logo">
      <div class="pl-icon-wrap"><i class="fas {c["icon"]} pl-icon"></i><span class="pl-ring"></span></div>
      <div class="pl-name">{full_name}</div>
    </div>
    <div class="pl-progress">
      <div class="pl-bar-track"><div class="pl-bar" id="plBar"></div></div>
      <div class="pl-text">INITIALIZING SYSTEM… <span id="plPct">0</span>%</div>
    </div>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>
<div class="scroll-progress" id="scrollProgress"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<nav class="nav">
  <a class="logo" href="#top">
    <span class="logo-icon"><i class="fas {c["icon"]}"></i></span>
    <span class="logo-text">{name}</span>
  </a>
  <div class="nav-links" id="navLinks">
    <a href="#about">About</a>
    <a href="#services">AI Tools</a>
    {ventures_nav}
    <a href="#sandbox">Live Demo</a>
    <a href="#process">Process</a>
    <a href="#testimonials">Reviews</a>
    <a href="#faq">FAQ</a>
    <a href="#contact">Contact</a>
  </div>
  <div class="nav-right">
    {app_btn}
    {nav_cta}
    <button class="hamburger" id="hamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
  </div>
</nav>

<header class="hero">
  <div class="hero-glow"></div>
  <div class="hero-grid"></div>
  <div class="hero-orb orb-1"></div>
  <div class="hero-orb orb-2"></div>
  <canvas id="particles"></canvas>
  <div class="hero-content">
    <div class="hero-pill" data-blur-in style="--i:0"><i class="fas fa-microchip"></i> <span class="scramble">{c["pill"]}</span></div>
    <h1 class="hero-title" data-blur-in style="--i:1">{c["hero_title"]}</h1>
    <p class="hero-sub" data-blur-in style="--i:2">{c["hero_sub"]}</p>
    <div class="hero-actions" data-blur-in style="--i:3">
      {hero_buttons}
    </div>
    <div class="stats-row" data-blur-in style="--i:4">
        {render_stats(c["stats"])}
    </div>
    <div class="hero-marquee" data-blur-in style="--i:5"><div class="marquee-track">{render_marquee(c["marquee"])}</div></div>
  </div>
</header>

<section class="pillars-band">
  <div class="pillars-inner">
        {render_pillars(c["pillars"])}
  </div>
</section>

<section class="ai-strip">
  <span class="ai-strip-label"><i class="fas fa-bolt"></i> Powered by a production-grade AI stack</span>
  <div class="ai-chips">{render_ai_chips(c["ai_stack"])}</div>
</section>

<section class="section about" id="about">
  <div class="about-grid">
    <div class="about-copy reveal">
      <div class="eyebrow">{c["established"]} · {c["sector"]}</div>
      <h2 class="sec-title left">{c["about_title"]}</h2>
      {"".join(f'<p>{p}</p>' for p in c["about_paras"])}
    </div>
    <aside class="about-card glow reveal">
      <div class="about-card-ic"><i class="fas {c["icon"]}"></i></div>
      <h3>Why {c["logo_main"]}?</h3>
      <ul class="hl-list">
          {render_highlights(c["highlights"])}
      </ul>
    </aside>
  </div>
</section>

<section class="section" id="services">
  <div class="eyebrow center">{c["svc_eyebrow"]}</div>
  <h2 class="sec-title">{c["svc_title"]}</h2>
  <div class="svc-grid">
        {render_services(c["services"])}
  </div>
</section>
{ventures_section}
{sandbox_section}
<section class="section process" id="process">
  <div class="eyebrow center">THE PROCESS</div>
  <h2 class="sec-title">{c["proc_title"]}</h2>
  <div class="proc-grid">
        {render_process(c["process"])}
  </div>
</section>

<section class="impact" id="impact">
  <div class="impact-inner">
    <div class="eyebrow center">BY THE NUMBERS</div>
    <h2 class="sec-title">{c["impact_title"]}</h2>
    <div class="impact-grid">
        {render_metrics(c["metrics"])}
    </div>
  </div>
</section>

<section class="section" id="testimonials">
  <div class="eyebrow center">WHAT PEOPLE SAY</div>
  <h2 class="sec-title">Trusted by the people we serve</h2>
  <div class="tgrid">
        {render_testimonials(c["testimonials"])}
  </div>
</section>

<section class="section faq-sec" id="faq">
  <div class="eyebrow center">FAQ</div>
  <h2 class="sec-title">Questions, answered</h2>
  <div class="faq-list">
        {render_faqs(c["faqs"])}
  </div>
</section>

<section class="cta" id="contact">
  <div class="cta-glow"></div>
  <div class="cta-content reveal">
    <div class="cta-badge"><i class="fas fa-microchip"></i> {c["established"]} · {c["sector"]}</div>
    <h2>{c["cta_title"]}</h2>
    <p>{c["cta_text"]}</p>
    <div class="cta-actions">
      {cta_primary_btn}
      <a class="btn btn-ghost lg" href="tel:{phone.replace(' ', '')}"><i class="fas fa-phone"></i> {phone}</a>
    </div>
    <form class="contact-form" id="contactForm" data-email="{email}" data-company="{full_name}">
      <div class="cf-row">
        <input type="text" id="cf-name" placeholder="Your name" autocomplete="name" required>
        <input type="email" id="cf-email" placeholder="Your email" autocomplete="email" required>
      </div>
      <input type="text" id="cf-subject" placeholder="Subject">
      <textarea id="cf-msg" rows="4" placeholder="How can we help you?" required></textarea>
      <button type="submit" class="btn btn-primary lg"><i class="fas fa-paper-plane"></i> Send message</button>
      <p class="cf-note" id="cf-note" role="status"></p>
    </form>
    <div class="cta-contact">
      <span><i class="fas fa-envelope"></i> {email}</span>
      <span><i class="fas fa-location-dot"></i> {location}</span>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="logo" href="#top">
        <span class="logo-icon"><i class="fas {c["icon"]}"></i></span>
        <span class="logo-text">{name}</span>
      </a>
      <p>{c["hero_sub"]}</p>
      <div class="foot-social">
        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="mailto:{email}" aria-label="Email"><i class="fas fa-envelope"></i></a>
      </div>
    </div>
    <div class="foot-col">
      <h5>Explore</h5>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#services">AI Tools</a></li>
        <li><a href="#process">Process</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>The AI Group</h5>
      <ul>
          {render_group_footer(c["slug"])}
      </ul>
    </div>
    <div class="foot-col">
      <h5>Get in touch</h5>
      <ul class="foot-contact">
        <li><i class="fas fa-envelope"></i> {email}</li>
        <li><i class="fas fa-phone"></i> {phone}</li>
        <li><i class="fas fa-location-dot"></i> {location}</li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <span>© <span data-year></span> {full_name}. All rights reserved.</span>
    <span class="foot-venture"><i class="fas fa-seedling"></i> A Sevenseed AI venture</span>
  </div>
</footer>

<script src="app.js"></script>
</body>
</html>
"""


def render_css(c):
    primary, primary_l, secondary, secondary_l, primary_rgb, secondary_rgb = c["accent"]
    root = f""":root {{
  --bg:#060609; --bg-1:#0d0d16; --bg-2:#12121e; --bg-3:#18182a;
  --border:rgba(255,255,255,.07); --border-hi:rgba(255,255,255,.14);
  --text:#eeeef8; --text-2:#9aa0b8; --text-3:#5b5f78;
  --primary:{primary}; --primary-l:{primary_l};
  --secondary:{secondary}; --secondary-l:{secondary_l};
  --primary-rgb:{primary_rgb}; --secondary-rgb:{secondary_rgb};
  --radius:16px; --radius-sm:10px;
  --shadow:0 10px 40px rgba(0,0,0,.45); --shadow-lg:0 24px 70px rgba(0,0,0,.6);
  --maxw:1180px; --nav-h:66px; --t:.25s ease;
}}
"""
    return root + STATIC_CSS


# ── Static stylesheet (uses accent CSS variables above) ─────────────────────
STATIC_CSS = r"""
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:calc(var(--nav-h) + 10px)}
body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
ul{list-style:none}
img{max-width:100%;display:block}
::selection{background:rgba(var(--primary-rgb),.35)}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-track{background:var(--bg-1)}
::-webkit-scrollbar-thumb{background:var(--bg-3);border-radius:10px}
.grad{background:linear-gradient(115deg,var(--primary-l),var(--secondary-l));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:9px;padding:11px 20px;border-radius:var(--radius-sm);font-size:14px;font-weight:600;transition:all var(--t);white-space:nowrap;border:1px solid transparent;cursor:pointer}
.btn.lg{padding:14px 26px;font-size:15px}
.btn-primary{background:linear-gradient(120deg,var(--primary),var(--secondary));color:#fff;box-shadow:0 6px 22px rgba(var(--primary-rgb),.35)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 34px rgba(var(--primary-rgb),.5)}
.btn-ghost{background:rgba(255,255,255,.03);color:var(--text);border-color:var(--border-hi)}
.btn-ghost:hover{background:var(--bg-3);border-color:rgba(var(--primary-rgb),.5)}

/* Nav */
.nav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);z-index:100;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 clamp(18px,4vw,44px);background:rgba(8,8,14,.55);backdrop-filter:blur(14px);border-bottom:1px solid transparent;transition:all var(--t)}
.nav.scrolled{background:rgba(8,8,14,.9);border-bottom-color:var(--border)}
.logo{display:flex;align-items:center;gap:11px;font-weight:800;font-size:18px;letter-spacing:-.3px}
.logo-icon{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;color:#fff;font-size:17px;background:linear-gradient(135deg,var(--primary),var(--secondary));box-shadow:0 6px 18px rgba(var(--primary-rgb),.4);flex-shrink:0}
.logo-accent{color:var(--primary-l)}
.nav-links{display:flex;gap:4px}
.nav-links a{padding:8px 13px;border-radius:9px;color:var(--text-2);font-size:14px;font-weight:500;transition:all var(--t)}
.nav-links a:hover{color:var(--text);background:rgba(255,255,255,.05)}
.nav-right{display:flex;align-items:center;gap:12px}
.hamburger{display:none;width:42px;height:42px;border-radius:10px;background:var(--bg-2);border:1px solid var(--border);color:var(--text);font-size:17px;cursor:pointer}

/* Hero */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:calc(var(--nav-h) + 56px) 20px 72px;overflow:hidden}
.hero-glow{position:absolute;inset:0;z-index:0;background:
   radial-gradient(60% 55% at 50% 0%,rgba(var(--primary-rgb),.28),transparent 70%),
   radial-gradient(45% 45% at 85% 30%,rgba(var(--secondary-rgb),.18),transparent 70%),
   radial-gradient(45% 45% at 12% 40%,rgba(var(--primary-rgb),.14),transparent 70%)}
#particles{position:absolute;inset:0;z-index:0;width:100%;height:100%}
.hero-content{position:relative;z-index:1;max-width:900px;width:100%}
.hero-pill{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:30px;font-size:13px;font-weight:600;color:var(--primary-l);background:rgba(var(--primary-rgb),.1);border:1px solid rgba(var(--primary-rgb),.28);margin-bottom:26px}
.hero-title{font-size:clamp(34px,6.2vw,68px);font-weight:900;line-height:1.07;letter-spacing:-2px;margin-bottom:22px}
.hero-sub{font-size:clamp(15px,2.2vw,19px);color:var(--text-2);max-width:670px;margin:0 auto 32px;line-height:1.7}
.hero-actions{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;margin-bottom:46px}
.stats-row{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;background:rgba(18,18,30,.6);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;width:fit-content;max-width:100%;margin:0 auto 38px;backdrop-filter:blur(6px)}
.hs{padding:18px 30px;text-align:center;min-width:120px}
.hs-num{font-size:30px;font-weight:800;letter-spacing:-1px;background:linear-gradient(120deg,var(--primary-l),var(--secondary-l));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hs-lbl{font-size:12px;color:var(--text-2);margin-top:3px;text-transform:uppercase;letter-spacing:.6px}
.hs-sep{width:1px;align-self:stretch;background:var(--border)}
.hero-marquee{max-width:760px;margin:0 auto;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);overflow:hidden}
.marquee-track{display:flex;gap:14px;width:max-content;animation:marquee 34s linear infinite}
.marquee-track span{color:var(--text-3);font-size:13px;font-weight:600;white-space:nowrap;display:inline-flex;align-items:center;gap:14px}
.marquee-track span::before{content:'\f2db';font-family:'Font Awesome 6 Free';font-weight:900;color:rgba(var(--primary-rgb),.55);font-size:9px}
@keyframes marquee{to{transform:translateX(-50%)}}

/* AI stack strip */
.ai-strip{max-width:var(--maxw);margin:0 auto;padding:26px clamp(18px,4vw,40px);display:flex;align-items:center;justify-content:center;gap:18px 26px;flex-wrap:wrap;border-bottom:1px solid var(--border)}
.ai-strip-label{font-size:12.5px;font-weight:700;letter-spacing:.5px;color:var(--text-2);display:inline-flex;align-items:center;gap:8px}
.ai-strip-label i{color:var(--primary-l)}
.ai-chips{display:flex;flex-wrap:wrap;gap:9px;justify-content:center}
.ai-chip{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;color:var(--text);background:var(--bg-2);border:1px solid var(--border);padding:6px 12px;border-radius:8px}
.ai-chip i{color:var(--primary-l);font-size:10px}

/* Sections */
.section{max-width:var(--maxw);margin:0 auto;padding:clamp(60px,8vw,104px) clamp(18px,4vw,40px)}
.eyebrow{font-size:12px;font-weight:800;letter-spacing:2.2px;color:var(--primary-l);text-transform:uppercase;margin-bottom:14px}
.eyebrow.center{text-align:center}
.sec-title{font-size:clamp(26px,4.2vw,42px);font-weight:800;letter-spacing:-1px;text-align:center;margin-bottom:52px;line-height:1.15}
.sec-title.left{text-align:left;margin-bottom:22px}

/* About */
.about-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:44px;align-items:center}
.about-copy p{color:var(--text-2);margin-bottom:16px;font-size:16px;line-height:1.75}
.about-card{background:linear-gradient(160deg,var(--bg-2),var(--bg-1));border:1px solid var(--border);border-radius:var(--radius);padding:30px;box-shadow:var(--shadow)}
.about-card-ic{width:56px;height:56px;border-radius:15px;display:grid;place-items:center;font-size:24px;color:#fff;background:linear-gradient(135deg,var(--primary),var(--secondary));box-shadow:0 8px 24px rgba(var(--primary-rgb),.4);margin-bottom:18px}
.about-card h3{font-size:19px;font-weight:700;margin-bottom:16px}
.hl-list li{display:flex;align-items:flex-start;gap:11px;padding:9px 0;color:var(--text-2);font-size:14.5px;border-bottom:1px solid var(--border)}
.hl-list li:last-child{border-bottom:none}
.hl-list i{color:var(--primary-l);background:rgba(var(--primary-rgb),.14);width:22px;height:22px;border-radius:7px;display:grid;place-items:center;font-size:11px;flex-shrink:0;margin-top:1px}

/* Services */
.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:18px}
.svc-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:26px;transition:all .3s}
.svc-card:hover{transform:translateY(-4px);border-color:var(--border-hi);box-shadow:var(--shadow)}
.svc-ic{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;font-size:20px;margin-bottom:16px}
.svc-ic.p{color:var(--primary-l);background:rgba(var(--primary-rgb),.15)}
.svc-ic.s{color:var(--secondary-l);background:rgba(var(--secondary-rgb),.15)}
.svc-card h4{font-size:17px;font-weight:700;margin-bottom:9px}
.svc-card p{font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:15px}
.svc-tag{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:600;color:var(--primary-l);background:rgba(var(--primary-rgb),.1);border:1px solid rgba(var(--primary-rgb),.2);padding:4px 11px;border-radius:20px}
.svc-tag i{font-size:9px}

/* Process */
.process{position:relative}
.proc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}
.proc-step{position:relative;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:28px 24px;transition:all .3s}
.proc-step:hover{transform:translateY(-4px);border-color:rgba(var(--primary-rgb),.4)}
.proc-num{position:absolute;top:20px;right:22px;font-size:34px;font-weight:900;color:transparent;-webkit-text-stroke:1.4px rgba(var(--primary-rgb),.35);font-family:'JetBrains Mono',monospace}
.proc-ic{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;font-size:20px;color:#fff;background:linear-gradient(135deg,var(--primary),var(--secondary));box-shadow:0 8px 20px rgba(var(--primary-rgb),.35);margin-bottom:18px}
.proc-step h4{font-size:17px;font-weight:700;margin-bottom:8px}
.proc-step p{font-size:14px;color:var(--text-2);line-height:1.65}

/* Impact */
.impact{position:relative;padding:clamp(56px,8vw,92px) clamp(18px,4vw,40px);overflow:hidden;background:linear-gradient(180deg,transparent,rgba(var(--primary-rgb),.05),transparent)}
.impact-inner{max-width:var(--maxw);margin:0 auto}
.impact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
.metric{text-align:center;background:linear-gradient(160deg,var(--bg-2),var(--bg-1));border:1px solid var(--border);border-radius:var(--radius);padding:34px 22px}
.metric-num{font-size:clamp(38px,6vw,56px);font-weight:900;letter-spacing:-2px;line-height:1;background:linear-gradient(120deg,var(--primary-l),var(--secondary-l));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.metric-lbl{font-size:16px;font-weight:700;margin-top:10px}
.metric-sub{font-size:13px;color:var(--text-2);margin-top:4px}

/* Testimonials */
.tgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}
.tcard{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:28px;display:flex;flex-direction:column;gap:16px;transition:all .3s}
.tcard:hover{border-color:var(--border-hi);transform:translateY(-3px);box-shadow:var(--shadow)}
.tstars{color:var(--secondary-l);font-size:13px;letter-spacing:2px}
.tcard blockquote{font-size:15.5px;line-height:1.7;color:var(--text);font-style:italic}
.tcard figcaption{display:flex;align-items:center;gap:12px;margin-top:auto}
.tavatar{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:14px;color:#fff;background:linear-gradient(135deg,var(--primary),var(--secondary));flex-shrink:0}
.tmeta{display:flex;flex-direction:column}
.tmeta strong{font-size:14px;font-weight:700}
.tmeta small{font-size:12.5px;color:var(--text-2)}

/* FAQ */
.faq-sec{max-width:840px}
.faq-list{display:flex;flex-direction:column;gap:12px}
.faq{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:border-color var(--t)}
.faq[open]{border-color:rgba(var(--primary-rgb),.4)}
.faq summary{list-style:none;cursor:pointer;padding:20px 22px;font-size:15.5px;font-weight:600;display:flex;align-items:center;justify-content:space-between;gap:16px}
.faq summary::-webkit-details-marker{display:none}
.faq summary i{color:var(--primary-l);font-size:14px;transition:transform var(--t);flex-shrink:0}
.faq[open] summary i{transform:rotate(45deg)}
.faq-a{padding:0 22px 20px;color:var(--text-2);font-size:14.5px;line-height:1.7}

/* Ventures showcase (Sevenseed hub) */
.ventures{background:linear-gradient(180deg,rgba(var(--primary-rgb),.05),transparent)}
.vent-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}
.vent-card{display:flex;flex-direction:column;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:26px;transition:all .3s}
.vent-card:hover{transform:translateY(-4px);border-color:rgba(var(--primary-rgb),.5);box-shadow:var(--shadow)}
.vent-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.vent-ic{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;font-size:21px;color:#fff;background:linear-gradient(135deg,var(--primary),var(--secondary));box-shadow:0 8px 22px rgba(var(--primary-rgb),.4)}
.vent-live{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:var(--secondary-l);background:rgba(var(--secondary-rgb),.12);border:1px solid rgba(var(--secondary-rgb),.25);padding:4px 10px;border-radius:20px}
.vent-live i{font-size:7px}
.vent-card h4{font-size:18px;font-weight:700;margin-bottom:5px}
.vent-sector{font-size:12px;font-weight:600;color:var(--primary-l);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px}
.vent-card p{font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:18px;flex:1}
.vent-go{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;color:var(--primary-l);transition:gap var(--t)}
.vent-card:hover .vent-go{gap:12px}

/* Pillars band */
.pillars-band{border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:linear-gradient(180deg,rgba(var(--primary-rgb),.05),transparent)}
.pillars-inner{max-width:var(--maxw);margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:0;padding:0 clamp(18px,4vw,40px)}
.pillar{display:flex;align-items:center;gap:14px;padding:26px 22px;border-right:1px solid var(--border)}
.pillar:last-child{border-right:none}
.pillar-ic{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;font-size:19px;color:var(--primary-l);background:rgba(var(--primary-rgb),.13);flex-shrink:0}
.pillar-txt{display:flex;flex-direction:column;gap:2px}
.pillar-txt strong{font-size:15px;font-weight:700}
.pillar-txt span{font-size:12.5px;color:var(--text-2);line-height:1.5}

/* CTA + contact form */
.cta{position:relative;max-width:1080px;margin:clamp(40px,6vw,80px) auto;padding:clamp(48px,7vw,84px) clamp(24px,5vw,60px);text-align:center;border:1px solid var(--border);border-radius:26px;background:linear-gradient(160deg,var(--bg-2),var(--bg-1));overflow:hidden}
.cta-glow{position:absolute;inset:0;z-index:0;background:radial-gradient(50% 80% at 50% 0%,rgba(var(--primary-rgb),.22),transparent 70%),radial-gradient(45% 70% at 80% 100%,rgba(var(--secondary-rgb),.16),transparent 70%)}
.cta-content{position:relative;z-index:1}
.cta-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 15px;border-radius:30px;font-size:12.5px;font-weight:700;color:var(--primary-l);background:rgba(var(--primary-rgb),.1);border:1px solid rgba(var(--primary-rgb),.28);margin-bottom:20px}
.cta h2{font-size:clamp(24px,4vw,40px);font-weight:800;letter-spacing:-1px;margin-bottom:16px;line-height:1.2}
.cta p{color:var(--text-2);max-width:560px;margin:0 auto;font-size:16px;line-height:1.7}
.cta-actions{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;margin-top:30px}
.contact-form{max-width:560px;margin:34px auto 0;display:flex;flex-direction:column;gap:12px;text-align:left}
.cf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.contact-form input,.contact-form textarea{width:100%;padding:13px 15px;background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:14px;font-family:inherit;transition:border-color var(--t)}
.contact-form input::placeholder,.contact-form textarea::placeholder{color:var(--text-3)}
.contact-form input:focus,.contact-form textarea:focus{outline:none;border-color:var(--primary)}
.contact-form textarea{resize:vertical;line-height:1.6}
.contact-form .btn{justify-content:center;width:100%}
.cf-note{font-size:13px;color:var(--secondary-l);min-height:18px;text-align:center;margin:0}
.cta-contact{display:flex;gap:26px;justify-content:center;flex-wrap:wrap;margin-top:26px;font-size:13.5px;color:var(--text-2)}
.cta-contact span{display:inline-flex;align-items:center;gap:8px}
.cta-contact i{color:var(--primary-l)}

/* Footer */
.foot{border-top:1px solid var(--border);background:var(--bg-1);padding:64px clamp(18px,4vw,40px) 0}
.foot-grid{max-width:var(--maxw);margin:0 auto;display:grid;grid-template-columns:1.8fr 1fr 1fr 1.2fr;gap:40px}
.foot-brand .logo{margin-bottom:16px}
.foot-brand p{color:var(--text-2);font-size:14px;line-height:1.7;max-width:340px;margin-bottom:18px}
.foot-social{display:flex;gap:10px}
.foot-social a{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--bg-2);border:1px solid var(--border);color:var(--text-2);transition:all var(--t)}
.foot-social a:hover{color:#fff;background:linear-gradient(135deg,var(--primary),var(--secondary));border-color:transparent;transform:translateY(-2px)}
.foot-col h5{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;color:var(--text)}
.foot-col ul li{margin-bottom:11px}
.foot-col ul a{color:var(--text-2);font-size:14px;transition:color var(--t)}
.foot-col ul a:hover{color:var(--primary-l)}
.foot-current{color:var(--primary-l);font-size:14px;font-weight:600}
.foot-contact li{color:var(--text-2);font-size:13.5px;margin-bottom:11px;display:flex;align-items:flex-start;gap:9px}
.foot-contact i{color:var(--primary-l);margin-top:3px}
.foot-bottom{max-width:var(--maxw);margin:44px auto 0;padding:22px 0;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--text-3)}
.foot-venture{display:inline-flex;align-items:center;gap:7px;color:var(--text-2)}
.foot-venture i{color:var(--primary-l)}

/* ── Ported Portfolio effects ─────────────────────────────────── */
/* Preloader */
.preloader{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:var(--bg);overflow:hidden;transition:opacity .8s cubic-bezier(.77,0,.175,1),transform .8s cubic-bezier(.77,0,.175,1);animation:plFallback .6s ease 5s forwards}
.preloader.hide{opacity:0;pointer-events:none;transform:scale(1.05)}
@keyframes plFallback{to{opacity:0;visibility:hidden;pointer-events:none}}
.pl-glow{position:absolute;top:50%;left:50%;border-radius:50%;transform:translate(-50%,-50%)}
.pl-glow-1{width:400px;height:400px;background:radial-gradient(circle,rgba(var(--primary-rgb),.13),transparent 70%);animation:plPulse 4s infinite alternate}
.pl-glow-2{width:300px;height:300px;background:radial-gradient(circle,rgba(var(--secondary-rgb),.09),transparent 70%);animation:plPulse 5s infinite alternate-reverse}
@keyframes plPulse{0%{opacity:.5;transform:translate(-50%,-50%) scale(1)}100%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}}
.pl-content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:50px}
.pl-logo{display:flex;flex-direction:column;align-items:center;gap:20px;animation:plFloat 6s ease-in-out infinite}
@keyframes plFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.pl-icon-wrap{position:relative;width:82px;height:82px;display:grid;place-items:center}
.pl-icon{font-size:38px;color:var(--primary-l);filter:drop-shadow(0 0 15px rgba(var(--primary-rgb),.5));z-index:2;animation:plIcon 2s infinite alternate}
@keyframes plIcon{0%{filter:drop-shadow(0 0 12px rgba(var(--primary-rgb),.3));transform:scale(1)}100%{filter:drop-shadow(0 0 24px rgba(var(--primary-rgb),.8));transform:scale(1.1)}}
.pl-ring{position:absolute;inset:0;border:1px dashed rgba(var(--primary-rgb),.35);border-radius:50%;animation:plSpin 10s linear infinite}
@keyframes plSpin{to{transform:rotate(360deg)}}
.pl-name{font-size:19px;font-weight:800;letter-spacing:.26em;text-transform:uppercase;color:var(--text);white-space:nowrap;text-align:center;padding-left:.26em}
.pl-progress{display:flex;flex-direction:column;align-items:center;gap:14px}
.pl-bar-track{width:240px;height:2px;background:rgba(255,255,255,.1);border-radius:2px;position:relative;overflow:hidden}
.pl-bar{position:absolute;top:0;left:0;height:100%;width:0;background:linear-gradient(90deg,var(--primary),var(--secondary));box-shadow:0 0 10px rgba(var(--primary-rgb),.8)}
.pl-text{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.34em;color:var(--text-2);padding-left:.34em}

/* Film grain */
.grain{position:fixed;inset:0;pointer-events:none;z-index:150;opacity:.04;mix-blend-mode:soft-light;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Scroll progress bar */
.scroll-progress{position:fixed;top:0;left:0;height:2px;width:100%;transform:scaleX(0);transform-origin:0 50%;background:linear-gradient(90deg,var(--primary),var(--secondary));z-index:200;will-change:transform}

/* Custom cursor ring */
.cursor-ring{position:fixed;top:0;left:0;width:30px;height:30px;border:1.5px solid rgba(var(--primary-rgb),.45);border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-100px,-100px);transition:width .25s ease,height .25s ease,background .25s ease,border-color .25s ease;mix-blend-mode:screen}
.cursor-ring.hovering{width:46px;height:46px;background:rgba(var(--primary-rgb),.07);border-color:rgba(var(--primary-rgb),.75)}
@media (hover:none),(pointer:coarse){.cursor-ring{display:none}}

/* Cursor-follow glow on cards */
.glow{position:relative;overflow:hidden}
.glow::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(260px circle at var(--mx,50%) var(--my,50%),rgba(var(--primary-rgb),.11),transparent 72%);opacity:0;transition:opacity .4s ease;pointer-events:none;z-index:0}
.glow:hover::before{opacity:1}
.glow>*{position:relative;z-index:1}
[data-tilt]{transform-style:preserve-3d;will-change:transform}

/* Hero grid + drifting orbs */
.hero-grid{position:absolute;inset:0;z-index:0;opacity:.13;background-image:linear-gradient(to right,rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.06) 1px,transparent 1px);background-size:54px 54px;-webkit-mask-image:radial-gradient(ellipse 80% 62% at 50% 0%,#000,transparent 76%);mask-image:radial-gradient(ellipse 80% 62% at 50% 0%,#000,transparent 76%)}
.hero-orb{position:absolute;border-radius:50%;filter:blur(120px);z-index:0}
.orb-1{width:26rem;height:26rem;top:-8rem;left:16%;background:rgba(var(--primary-rgb),.20);animation:orbDrift1 19s ease-in-out infinite}
.orb-2{width:22rem;height:22rem;top:3rem;right:16%;background:rgba(var(--secondary-rgb),.17);animation:orbDrift2 23s ease-in-out infinite}
@keyframes orbDrift1{0%,100%{transform:translate(0,0)}50%{transform:translate(50px,32px)}}
@keyframes orbDrift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-46px,36px)}}

/* Blur-in entrance (JS-gated so no-JS shows content) */
body.js [data-blur-in]{opacity:0;filter:blur(10px) saturate(.75);transform:translateY(16px);transition:opacity .85s cubic-bezier(.22,1,.36,1),filter .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1);transition-delay:calc(var(--i,0)*90ms);will-change:opacity,filter,transform}
body.js [data-blur-in].bin{opacity:1;filter:blur(0) saturate(1);transform:none}

/* Reveal (only hides when JS is on) */
body.js .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
body.js .reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  body.js .reveal,body.js [data-blur-in]{opacity:1;transform:none;filter:none}
  .marquee-track,.hero-orb,.pl-logo,.pl-ring,.pl-icon,.pl-glow-1,.pl-glow-2{animation:none}
  .cursor-ring{display:none}
}

/* Responsive */
@media(max-width:860px){
  .nav-links{position:fixed;top:var(--nav-h);left:0;right:0;flex-direction:column;gap:0;background:rgba(8,8,14,.97);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);padding:10px 16px 18px;transform:translateY(-140%);transition:transform .3s ease;z-index:99}
  .nav-links.open{transform:translateY(0)}
  .nav-links a{padding:13px 12px;border-radius:10px}
  .hamburger{display:grid;place-items:center}
  .about-grid{grid-template-columns:1fr;gap:30px}
  .sec-title.left{text-align:left}
  .pillars-inner{grid-template-columns:1fr 1fr}
  .pillar:nth-child(2){border-right:none}
  .pillar:nth-child(1),.pillar:nth-child(2){border-bottom:1px solid var(--border)}
  .foot-grid{grid-template-columns:1fr 1fr;gap:32px}
  .foot-brand{grid-column:1/-1}
}
@media(max-width:520px){
  .hs{padding:14px 18px;min-width:50%}
  .hs-sep{display:none}
  .stats-row{border-radius:14px}
  .cf-row{grid-template-columns:1fr}
  .ai-strip{flex-direction:column;gap:14px}
  .pillars-inner{grid-template-columns:1fr}
  .pillar{border-right:none;border-bottom:1px solid var(--border)}
  .pillar:last-child{border-bottom:none}
  .foot-grid{grid-template-columns:1fr}
  .foot-bottom{justify-content:center;text-align:center}
  .btn.lg{padding:13px 20px}
}

/* AI Sandbox Styling */
.sandbox-sec {
  background: var(--bg-1);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 80px 0;
}
.sandbox-subtitle {
  max-width: 600px;
  margin: -10px auto 40px;
  color: var(--text-2);
  font-size: 14px;
}
.sandbox-container {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 20px;
}
.sandbox-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
.sandbox-card-header {
  background: rgba(0,0,0,.25);
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sandbox-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.sandbox-dot.red { background: #ef4444; }
.sandbox-dot.yellow { background: #f59e0b; }
.sandbox-dot.green { background: #10b981; }
.sandbox-card-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: var(--text-2);
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: .15em;
}
.sandbox-card-body {
  padding: 30px;
  display: grid;
  grid-template-columns: 4.5fr 5.5fr;
  gap: 30px;
}
@media (max-width: 860px) {
  .sandbox-card-body { grid-template-columns: 1fr; }
}
.sandbox-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sandbox-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sandbox-field label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-2);
  letter-spacing: .1em;
}
.sandbox-field input, .sandbox-field textarea, .sandbox-field select {
  background: var(--bg-3);
  border: 1px solid var(--border-hi);
  color: var(--text);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 14px;
  transition: all var(--t);
  outline: none;
}
.sandbox-field input:focus, .sandbox-field textarea:focus, .sandbox-field select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb),.15);
}
.sandbox-result {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  background: rgba(0,0,0,.2);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.sandbox-result-header {
  background: rgba(0,0,0,.15);
  border-bottom: 1px solid var(--border);
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: .1em;
}
.sandbox-copy-btn {
  background: transparent;
  border: none;
  color: var(--text-3);
  cursor: pointer;
  transition: color var(--t);
}
.sandbox-copy-btn:hover { color: var(--text-2); }
.sandbox-pre-wrap {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  max-height: 380px;
  min-height: 200px;
}
.sandbox-pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: var(--primary-l);
  white-space: pre-wrap;
  word-break: break-all;
}
"""

# ── App JS (identical for every site) ───────────────────────────────────────
APP_JS = r"""// Enterprise site interactions - Sevenseed AI portfolio
document.body.classList.add('js');

// Entrance orchestration: reveal blur-in elements + fire scramble
function revealEntrance(){
  document.querySelectorAll('[data-blur-in]').forEach(function(el){ el.classList.add('bin'); });
  document.dispatchEvent(new Event('ss:entrance'));
}

// Text-scramble ("decode") effect
(function(){
  var CHARS = "!<>-_\\/[]{}=+*^?#01ABCXYZ";
  function scramble(el){
    var text = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', text);
    var queue = text.split('').map(function(c){ return {c:c, s:Math.floor(Math.random()*16), e:Math.floor(Math.random()*16)+16}; });
    var f = 0;
    (function tick(){
      var out = '', done = 0;
      queue.forEach(function(q){
        if (q.c === ' '){ out += ' '; done++; }
        else if (f >= q.e){ out += q.c; done++; }
        else if (f >= q.s){ out += CHARS[Math.floor(Math.random()*CHARS.length)]; }
      });
      el.textContent = out;
      if (done >= queue.length) return;
      f++; requestAnimationFrame(tick);
    })();
  }
  var els = document.querySelectorAll('.scramble');
  document.addEventListener('ss:entrance', function(){ els.forEach(scramble); });
  els.forEach(function(el){ el.addEventListener('mouseenter', function(){ scramble(el); }); });
})();

// Preloader
(function(){
  var pl = document.getElementById('preloader');
  if (!pl){ setTimeout(revealEntrance, 0); return; }
  var seen = false;
  try { seen = sessionStorage.getItem('ss-preloader-seen'); } catch(e){}
  if (seen){ if (pl.parentNode) pl.parentNode.removeChild(pl); setTimeout(revealEntrance, 0); return; }
  var bar = document.getElementById('plBar'), pct = document.getElementById('plPct');
  var start = Date.now(), dur = 1500;
  var iv = setInterval(function(){
    var p = Math.min(100, Math.floor((Date.now() - start) / dur * 100));
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = p;
    if (p >= 100){
      clearInterval(iv);
      try { sessionStorage.setItem('ss-preloader-seen', '1'); } catch(e){}
      setTimeout(function(){ pl.classList.add('hide'); revealEntrance(); }, 200);
      setTimeout(function(){ if (pl.parentNode) pl.parentNode.removeChild(pl); }, 1200);
    }
  }, 16);
})();

document.querySelectorAll('[data-year]').forEach(function(e){ e.textContent = new Date().getFullYear(); });

// Mobile nav
var ham = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');
if (ham && navLinks) {
  ham.addEventListener('click', function(){ navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });
}

// Contact form → opens the visitor's email app (no backend required)
var cform = document.getElementById('contactForm');
if (cform) {
  cform.addEventListener('submit', function(e){
    e.preventDefault();
    var to = cform.getAttribute('data-email');
    var company = cform.getAttribute('data-company') || '';
    var name = (document.getElementById('cf-name').value || '').trim();
    var from = (document.getElementById('cf-email').value || '').trim();
    var subj = (document.getElementById('cf-subject').value || '').trim() || ('Enquiry for ' + company);
    var msg = (document.getElementById('cf-msg').value || '').trim();
    var body = 'Name: ' + name + '\nEmail: ' + from + '\n\n' + msg;
    var note = document.getElementById('cf-note');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
    if (note) note.textContent = 'Opening your email app to send this message…';
  });
}

// Nav background on scroll
var nav = document.querySelector('.nav');
function onScroll(){ if (window.scrollY > 24) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
window.addEventListener('scroll', onScroll); onScroll();

// Count-up animation for numeric stats/metrics
function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
function animateCount(el){
  var raw = el.textContent.trim();
  var m = raw.match(/^(\d[\d,]*)(.*)$/);
  if (!m) return;                        // non-numeric (e.g. ₹1Cr, Zero) stays static
  var target = parseInt(m[1].replace(/,/g, ''), 10);
  var suffix = m[2];
  var dur = 1400, start = null;
  function tick(now){
    if (start === null) start = now;
    var p = Math.min((now - start) / dur, 1);
    var val = Math.floor(easeOut(p) * target);
    el.textContent = val.toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('en-IN') + suffix;
  }
  requestAnimationFrame(tick);
}
var countIO = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if (e.isIntersecting){ animateCount(e.target); countIO.unobserve(e.target); } });
}, { threshold: 0.4 });
document.querySelectorAll('.count').forEach(function(el){ countIO.observe(el); });

// Reveal on scroll
var revealIO = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); revealIO.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(function(el){ revealIO.observe(el); });
// Safety net: never leave content permanently hidden if the observer misfires.
setTimeout(function(){
  document.querySelectorAll('.reveal:not(.in)').forEach(function(el){ el.classList.add('in'); });
}, 2600);

// Scroll progress bar
var sp = document.getElementById('scrollProgress');
if (sp) window.addEventListener('scroll', function(){
  var h = document.documentElement.scrollHeight - window.innerHeight;
  sp.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
}, { passive: true });

var noHover = window.matchMedia('(hover:none)').matches || window.matchMedia('(pointer:coarse)').matches;
var reduceMo = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

// Custom cursor ring (smoothed follow)
(function(){
  var ring = document.getElementById('cursorRing');
  if (!ring || noHover) return;
  var tx = -100, ty = -100, cx = -100, cy = -100;
  window.addEventListener('mousemove', function(e){ tx = e.clientX; ty = e.clientY; }, { passive: true });
  window.addEventListener('mouseover', function(e){
    var hit = e.target.closest && e.target.closest('a,button,.glow,summary,input,textarea,[data-tilt]');
    ring.classList.toggle('hovering', !!hit);
  }, { passive: true });
  (function loop(){
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    ring.style.transform = 'translate(' + (cx - 15) + 'px,' + (cy - 15) + 'px)';
    requestAnimationFrame(loop);
  })();
})();

// Cursor-follow glow inside cards
document.addEventListener('mousemove', function(e){
  var card = e.target.closest && e.target.closest('.glow');
  if (!card) return;
  var r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, { passive: true });

// 3D tilt on cards
if (!noHover && !reduceMo) document.querySelectorAll('[data-tilt]').forEach(function(el){
  el.addEventListener('mousemove', function(e){
    var r = el.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - 0.5;
    var py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = 'perspective(820px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 7).toFixed(2) + 'deg)';
  });
  el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
});

// Magnetic primary buttons
if (!noHover) document.querySelectorAll('.btn-primary').forEach(function(el){
  el.addEventListener('mousemove', function(e){
    var r = el.getBoundingClientRect();
    el.style.transform = 'translate(' + ((e.clientX - (r.left + r.width/2)) * 0.28).toFixed(1) + 'px,' + ((e.clientY - (r.top + r.height/2)) * 0.28).toFixed(1) + 'px)';
  });
  el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
});

// Hero particle network
(function(){
  var c = document.getElementById('particles');
  if (!c) return;
  var ctx = c.getContext('2d');
  var w, h, parts;
  var rgb = (getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb') || '124,58,237').trim();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    w = c.width = c.offsetWidth; h = c.height = c.offsetHeight;
    var n = Math.max(24, Math.min(72, Math.floor(w / 18)));
    parts = [];
    for (var i = 0; i < n; i++) parts.push({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
      r: Math.random()*1.6 + .7
    });
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for (var i=0;i<parts.length;i++){
      var p = parts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>w) p.vx*=-1;
      if (p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba('+rgb+',.65)'; ctx.fill();
    }
    for (var a=0;a<parts.length;a++) for (var b=a+1;b<parts.length;b++){
      var dx=parts[a].x-parts[b].x, dy=parts[a].y-parts[b].y, d=dx*dx+dy*dy;
      if (d < 10000){
        ctx.beginPath(); ctx.moveTo(parts[a].x,parts[a].y); ctx.lineTo(parts[b].x,parts[b].y);
        ctx.strokeStyle = 'rgba('+rgb+','+(0.14*(1-d/10000))+')'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  if (!reduce) draw();
})();

// Sandbox Form Handler
(function(){
  var form = document.getElementById('sandboxForm');
  if (!form) return;
  var btn = document.getElementById('sandboxBtn');
  var output = document.getElementById('sandboxOutput');
  var endpoint = form.getAttribute('data-endpoint');
  
  if (window.location.protocol !== 'file:' && endpoint.includes('/api/')) {
    var rawPath = endpoint.substring(endpoint.indexOf('/api/'));
    // Use relative path to avoid CORS issues when serving from the same host
    endpoint = rawPath;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (btn.disabled) return;
    btn.disabled = true;
    var btnText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    output.textContent = 'CONNECTING TO AI MODEL SERVER...\\nEXECUTING PIPELINE...\\nPLEASE WAIT...';
    
    var payload = {};
    var fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(function(f){
      if (!f.id) return;
      var key = f.id.replace('sb-', '');
      var val = f.value;
      if (f.type === 'number') {
        val = parseFloat(val);
      }
      payload[key] = val;
    });

    if (payload.drug1 || payload.drug2) {
      payload = { drugs: [payload.drug1 || '', payload.drug2 || ''].filter(Boolean) };
    }

    // Shared domain localStorage verification
    var token = localStorage.getItem('sevenforce_token');
    var isDemo = !token || token === 'demo_token';
    var hasKeys = localStorage.getItem('user_groq_key') || 
                  localStorage.getItem('user_gemini_key') || 
                  localStorage.getItem('user_openai_key') || 
                  localStorage.getItem('user_serpapi_key') || 
                  localStorage.getItem('user_huggingface_key') || 
                  localStorage.getItem('user_mistral_key');

    if (isDemo || !hasKeys) {
      // Offline/Demo Preview Fallback
      setTimeout(function(){
        var data;
        if (endpoint.indexOf('/evaluate') !== -1) {
          data = { score: 90, evaluation: "Venture proposal successfully analyzed. Strong AI leverage. Recommendations: Implement unified local storage BYOK, scale RAG indexes." };
        } else if (endpoint.indexOf('/interview-generate') !== -1) {
          data = { questions: ["Tell me about a time you handled a resource starvation bug in Windows.", "How do you set reload=False dynamically in Uvicorn?", "Explain the difference between LangGraph and simple chain executors."] };
        } else if (endpoint.indexOf('/study-plan') !== -1) {
          data = { study_plan: ["Day 1: Basics of data structures (1hr study, 1hr practice)", "Day 2: Pandas dataframes and cleaning", "Day 3: Aggregations and groupby", "Day 4: Data visualization with Matplotlib", "Day 5: Real-world dataset analysis case study", "Day 6: Final project review", "Day 7: Performance profiling and optimization"] };
        } else if (endpoint.indexOf('/interactions') !== -1) {
          data = { interaction_found: true, severity: "High Danger", contraindication: "Aspirin combined with Warfarin significantly increases the risk of internal bleeding. Avoid co-administration without doctor review.", recommendation: "Consult a cardiologist immediately for safer alternatives." };
        } else if (endpoint.indexOf('/boq') !== -1) {
          data = { materials_required: { cement: "675 bags", sand: "1,800 cu ft", bricks: "33,750 pcs", steel: "4.5 tons" }, estimated_cost_inr: "₹ 27,00,000", duration_weeks: 24, quality_grade: payload.quality || "Premium" };
        } else if (endpoint.indexOf('/needs') !== -1) {
          data = { recommended_trust_aid: ["Deploying clean water filter plant (fluoride treatment)", "Initiating mobile primary school transport van", "Financing a local community health center weekly camp"] };
        } else if (endpoint.indexOf('/compare') !== -1) {
          data = { query: payload.query || "iPhone 15 Pro Max", results: [{ site: "Amazon India", price: "₹1,34,900", availability: "In Stock" }, { site: "Flipkart", price: "₹1,35,500", availability: "Out of Stock" }, { site: "Vijay Sales", price: "₹1,34,000", availability: "In Stock", best_value: true }, { site: "Croma", price: "₹1,36,000", availability: "In Stock" }] };
        } else {
          data = { success: true, mode: "Static Preview Mock Output" };
        }
        
        output.textContent = '💡 DEMO MODE (Preview Output):\\n' + JSON.stringify(data, null, 2) + '\\n\\n💡 To run this live, sign in and add your API Keys at Sevenforce: https://kunalpatell.github.io/sevenseed/sevenforce/index.html';
        btn.disabled = false;
        btn.innerHTML = btnText;
      }, 700);
      return;
    }

    // Live Execution headers
    var headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    
    var groq = localStorage.getItem("user_groq_key");
    if (groq) headers["X-Groq-API-Key"] = groq;
    var gemini = localStorage.getItem("user_gemini_key");
    if (gemini) headers["X-Gemini-API-Key"] = gemini;
    var openai = localStorage.getItem("user_openai_key");
    if (openai) headers["X-OpenAI-API-Key"] = openai;
    var serpapi = localStorage.getItem("user_serpapi_key");
    if (serpapi) headers["X-SerpAPI-Key"] = serpapi;
    var huggingface = localStorage.getItem("user_huggingface_key");
    if (huggingface) headers["X-HuggingFace-API-Key"] = huggingface;
    var mistral = localStorage.getItem("user_mistral_key");
    if (mistral) headers["X-Mistral-API-Key"] = mistral;

    fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    .then(function(res){
      if (!res.ok) {
        return res.text().then(function(t){ throw new Error(t || res.statusText) });
      }
      return res.json();
    })
    .then(function(data){
      output.textContent = JSON.stringify(data, null, 2);
    })
    .catch(function(err){
      output.textContent = '❌ ERROR EXECUTING MODEL:\\n' + err.message + '\\n\\n💡 Ensure the backend server for this venture is running on its designated port.';
    })
    .finally(function(){
      btn.disabled = false;
      btn.innerHTML = btnText;
    });
  });

  var copyBtn = document.getElementById('sandboxCopy');
  if (copyBtn) copyBtn.addEventListener('click', function(){
    navigator.clipboard.writeText(output.textContent).then(function(){
      var origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(function(){ copyBtn.innerHTML = origHtml; }, 2000);
    });
  });
})();
"""


def main():
    for c in COMPANIES:
        c.update(EXTRA.get(c["slug"], {}))
        # Every brand's marketing site is generated into sites/<slug>/ — one uniform
        # rule, no special cases. This keeps generated output completely separate
        # from the real application code in apps/<slug>/, which is what the old
        # layout kept colliding with (writing to BASE/<slug> once clobbered files
        # at the root of the real Comonk product).
        #
        # DEPLOY NOTE: on GitHub Pages, Sevenseed must land at the repo ROOT (so the
        # group opens at /index.html, not /sevenseed/index.html) and each other brand
        # at /<slug>/. That remapping belongs to the deploy step which syncs into a
        # fresh clone of the Pages repo — not here.
        folder = os.path.join(SITES, c["slug"])
        os.makedirs(folder, exist_ok=True)
        with open(os.path.join(folder, "index.html"), "w", encoding="utf-8") as f:
            f.write(render_html(c))
        with open(os.path.join(folder, "style.css"), "w", encoding="utf-8") as f:
            f.write(render_css(c))
        with open(os.path.join(folder, "app.js"), "w", encoding="utf-8") as f:
            f.write(APP_JS)
        print(f"  [ok] {c['slug']:24s} -> {os.path.relpath(folder, BASE)}")

    print(f"\nGenerated {len(COMPANIES)} AI-native sites into sites/ — Sevenseed is the group home.")


if __name__ == "__main__":
    main()
