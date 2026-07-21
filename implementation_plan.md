# Sevenseed Platform — Master Implementation Plan
> Based on `idea.txt` + current monolith status

## Current Status

| URL | Frontend | Backend API | Notes |
|-----|----------|-------------|-------|
| `sevenseed.onrender.com/` | ✅ Live | ✅ Live | Hub landing page |
| `sevenseed.onrender.com/avp-emart` | ✅ Live | ✅ Live | Cold start ~60s |
| `sevenseed.onrender.com/avpu` | ✅ Live | ✅ Live | Cold start ~60s |
| `sevenseed.onrender.com/breakdown` | ✅ Live | ✅ Live | Cold start ~60s |
| `sevenseed.onrender.com/sevenforce` | ✅ Live | ✅ Live | Cold start ~60s |
| `sevenseed.onrender.com/trust` | 🔄 Building | 🔄 Building | |
| `sevenseed.onrender.com/pharmacy` | 🔄 Building | 🔄 Building | |
| `sevenseed.onrender.com/comonk-ai` | 🔄 Deploying | 🔄 Deploying | New child process |
| `comonk-ai.onrender.com` | ✅ Live | ✅ Live | Old separate service, keep |

---

## Priority 1 — Self API & Token Section (ALL 7 Apps)

> idea.txt: *"I hoped a person would use their own API & token — self API & token add ka section dal do"*

Every app needs a **BYOK (Bring Your Own Key)** settings panel where user can enter:
- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `OPENROUTER_API_KEY`
- App-specific keys (YouTube, GitHub, etc.)

Keys stored in `localStorage` and sent as request headers. Backend reads from header first, falls back to env var.

**Apps needing this:**
- [ ] Comonk AI → `/comonk-ai` (priority — idea.txt mentions specifically)
- [ ] Sevenforce AI
- [ ] AVPU University
- [ ] AVP Emart
- [ ] Breakdown Factor
- [ ] Decode Forest Pharmacy
- [ ] AVP Trust

---

## Priority 2 — Comonk AI Upgrade
> idea.txt: *"Comonk me bhaji self API & token add ka section dal do. bahot sari abhi tak baki he, wo tum think karke add kro"*

**Missing features to add:**
- [ ] BYOK settings modal (GROQ, Gemini, YouTube, GitHub, Adzuna, Hunter keys)
- [ ] Resume ATS scorer with AI feedback
- [ ] Mock interview (voice/text based)
- [ ] Job alert subscription (email/SMS via Twilio/Brevo)
- [ ] Salary benchmark tool (India market)
- [ ] HR email finder per company
- [ ] LinkedIn profile analyzer
- [ ] Career roadmap generator (role → skills → timeline)
- [ ] Interview question bank (role-specific)
- [ ] GitHub portfolio AI reviewer

---

## Priority 3 — AVP Emart Upgrade
> idea.txt: *"Take all files from that price-com folder and add those features + new features"*
> Reference: `https://price-com-7.streamlit.app/`

**Features from price-com + new:**
- [ ] Product price comparison engine
- [ ] AI-powered product recommendation
- [ ] Smart search with NLP
- [ ] Price history charts
- [ ] Wishlist & saved products
- [ ] Seller registration portal
- [ ] AI chatbot for product help
- [ ] Order tracking simulation
- [ ] BYOK for AI features

---

## Priority 4 — Decode Forest Pharmacy (Full Build)
> idea.txt: *"main goal — free health advice, health tips, chatbot, emergency help, hospital list, free medicines, free treatment, health camps, blood donation camps"*

**Build from scratch:**
- [ ] AI health chatbot (symptom checker, free advice)
- [ ] Emergency help button (nearest hospital finder via Maps API)
- [ ] Hospital directory (city-wise, with address + contact)
- [ ] Free medicine availability tracker
- [ ] Free treatment camp calendar
- [ ] Blood donation camp calendar & registration
- [ ] Health tips feed (AI-generated daily)
- [ ] Medicine dosage guide
- [ ] BYOK for AI features

---

## Priority 5 — AVPU (AI University)
> idea.txt: *"in short, it's an AI university"*

**Build:**
- [ ] AI personal tutor (subject-wise chat)
- [ ] Adaptive learning path generator
- [ ] Course catalog (free + premium tracks)
- [ ] AI quiz & assessment engine
- [ ] Certificate generation (PDF)
- [ ] AI placement matching (uses Comonk tech)
- [ ] Study group rooms
- [ ] BYOK for AI features

---

## Priority 6 — Breakdown Factor Upgrade
> idea.txt: *"Taking an idea from the 50 projects — best.pt file for detection of property damage"*

**Build:**
- [ ] Upload property image → AI damage detection (YOLOv8 best.pt)
- [ ] Damage severity report (PDF export)
- [ ] Repair cost estimator
- [ ] Insurance claim helper
- [ ] Contractor directory
- [ ] BYOK for AI features

---

## Priority 7 — AVP Charitable Trust
> idea.txt: *"we provide all services free of cost — trust manages finance + many more things"*

**Build:**
- [ ] About trust / mission page
- [ ] Donation portal (UPI, bank transfer info)
- [ ] Beneficiary registration form
- [ ] Free services directory (links to other 6 apps)
- [ ] Impact dashboard (lives helped, camps organized)
- [ ] Volunteer registration
- [ ] CSR partnership enquiry form
- [ ] Annual report download

---

## Priority 8 — Sevenforce AI Upgrade
> idea.txt: *"I give three website references, autonomous file and 50 projects for AI agent building"*
> Reference sites: `automationowl.com`, `sintra.ai`, `automusk.ai`

**Build (Automation Agency style):**
- [ ] AI agent marketplace / directory
- [ ] Autonomous workflow builder (no-code drag & drop)
- [ ] Pre-built agent templates (email, research, data, social)
- [ ] Agent deployment dashboard
- [ ] Client project portal
- [ ] BYOK for all AI providers
- [ ] Usage analytics per agent

---

## Reference Sites to Follow
From idea.txt:
1. **[automationowl.com](https://automationowl.com/)** → Sevenforce design reference
2. **[sintra.ai](https://sintra.ai/)** → Sevenforce AI agent design
3. **[automusk.ai](https://automusk.ai/)** → Sevenforce automation reference
4. **[price-com-7.streamlit.app](https://price-com-7.streamlit.app/)** → AVP Emart features reference

---

## Immediate Next Steps (After All URLs Live)

1. **Add BYOK to Comonk** (idea.txt top priority)
2. **Pull price-com features into AVP Emart**
3. **Build Pharmacy full frontend**
4. **Upgrade Sevenforce** using automationowl/sintra references
5. **AVPU full AI university pages**
