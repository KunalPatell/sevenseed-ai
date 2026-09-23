# Sevenseed Platform — Master Reference Benchmark Architecture

This document is the comprehensive reference engineering manual for **Sevenseed** (`e:\main\apps\sevenseed`) and its 8 incubated ventures. It extracts down to the level of mechanic, algorithm, and data pipeline the features of **24 world-class benchmark websites** across:
1. **EdTech, Knowledge Graphs, Gamification & Decision Science**
2. **Growth Engineering, Viral Loops & Marketing Teardowns**
3. **E-Commerce Price Intelligence, Spec Comparators & Deal Engines**
4. **Modern Design Engineering, WebGL Shaders, Spline 3D & UI Primitives**

---

## Core Philosophy: Zero-SaaS Margin & BYOK (Self API & Token Vault)

Per [`../idea.txt`](../idea.txt), **all software across Sevenseed is provided 100% free of charge without platform markups or token limits**. Where reference platforms implement paywalls or subscription limits (e.g. Duolingo Super, Jobscan scan limits, Smartprix affiliate limits), Sevenseed replaces them with the **Universal Client-Side BYOK (Bring Your Own Key) Engine** (`sites/byok.html`):
- Users input personal API keys for **Groq (LLaMA 3.3 70B)**, **OpenAI (GPT-4o)**, **Anthropic (Claude 3.5 Sonnet)**, or **Google Gemini**.
- Keys are AES-GCM encrypted in browser `localStorage` and dispatched via direct HTTPS request headers.
- The platform incurs zero third-party token compute bills, ensuring permanent free access for all students, job seekers, and founders.

---

## 1. Comprehensive Reference Breakdown (24 Platforms)

### Cluster 1: EdTech, Knowledge DAGs, Gamification & Decision Science

#### 1. https://learn-anything.xyz/
- **Domain**: Interactive Knowledge Graph & Topic Prerequisite Visualization.
- **Key Features**:
  - Interactive HTML5 Canvas / SVG Directed Acyclic Graph (DAG) of human knowledge.
  - Directional dependency edges showing prerequisite learning paths (Node A $\to$ Node B).
  - Depth-ordered topological clusters (Fundamentals $\to$ Intermediate $\to$ Advanced).
  - Resource drawers per node categorizing curated materials (Interactive Code Labs, Documentation, Research Papers, Videos).
  - Visual completion checkmarks with automated edge illumination upon node mastery.
- **Algorithmic Functions**:
  - **Topological Sorting**: Kahn’s algorithm or Tarjan’s DFS ($O(V + E)$) to linearize study paths without circular prerequisite deadlocks:
    $$\text{in-degree}(v) = 0 \implies v \in \text{ReadySet}$$
  - **Prerequisite Gated Unlocking**:
    $$\text{Unlocked}(v) = \begin{cases} \text{true} & \text{if } \forall u \in \text{Parents}(v), \text{Completed}(u) = \text{true} \\ \text{false} & \text{otherwise} \end{cases}$$
  - **Critical Path Method (CPM)**: Computes the shortest sequence of prerequisite concepts to reach a chosen capstone goal.
- **Workflow**:
  1. User selects target engineering goal (e.g. "Autonomous Multi-Agent Systems").
  2. Canvas renders the prerequisite sub-graph with unlocked root nodes highlighted in emerald green and locked nodes in muted gray.
  3. Clicking an active node opens the learning drawer and sandbox.
  4. Completing the unit test fires an edge unlock animation and chimes success.
- **Data Pipeline**:
  `Topic Hierarchy JSON -> Force-directed D3/Canvas Layout -> Web Worker Topological Sort -> LocalStorage Progress Sync -> Unlock Animation`.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/learn-dag.html` (449 lines) & `frontend/packages/ui-core/src/components/ui/KnowledgeDAG.tsx`. Maps complete curriculum for AI Engineering, LangGraph, and Computer Vision.
  - **Sevenforce**: Agent skill dependency graph (specifying capabilities required before autonomous agent dispatch).

#### 2. https://www.learnanything.com/
- **Domain**: Search-First Universal Topic Resolution.
- **Key Features**:
  - Ultra-clean, single-input omnibox with instant keyboard shortcut (`Cmd+K` / `/`).
  - Real-time debounced typeahead suggestions across thousands of topics.
  - Categorized result chips (Beginner Path, Interactive Lab, Deep Dive, Production Cheatsheet).
- **Algorithmic Functions**:
  - **Trigram Fuzzy Search Score**:
    $$\text{Score}(Q, T) = 0.5 \cdot \text{Prefix}(Q, T) + 0.3 \cdot \text{FuzzyLevenshtein}(Q, T) + 0.2 \cdot \text{Popularity}(T)$$
  - **Dynamic Fallback Route**: If query misses the local index, the client queries the BYOK LLM to generate a dynamic 4-week syllabus on the fly.
- **Workflow**: Press `Cmd+K` $\to$ Type query $\to$ Dropdown renders top 5 matching learning paths $\to$ Press Enter to jump directly to the target node.
- **Data Pipeline**:
  `Keyup (150ms debounce) -> Fuse.js In-Memory Index -> Prioritized Match -> Direct Route / Dynamic Generation`.
- **Sevenseed Mapping**:
  - **AVPU**: Main hero omnibox on `sites/avpu/index.html` (resolves Gap #2).

#### 3. https://www.learnanythingai.in/
- **Domain**: AI-Powered Dynamic Curriculum Synthesis.
- **Key Features**:
  - Natural language goal intake ("I want to learn YOLOv8 defect detection in 30 days with 2 hours/day").
  - Pacing sliders and weekly sprint accordions.
  - 1-click study plan export to Markdown and calendar reminders.
- **Algorithmic Functions**:
  - **Weekly Pacing Equation**:
    $$\text{WeeklyHours} = \text{DailyHours} \times 7, \quad N_{\text{modules}} = \left\lceil \frac{\text{EstimatedCurriculumHours}}{\text{WeeklyHours}} \right\rceil$$
  - **Structured Schema Formatting**: Prompts constrained to JSON schemas returning modules, lessons, and code prompts.
- **Workflow**: Input goal & time budget $\to$ Stream AI response via Groq/OpenAI $\to$ Interactive weekly checklist saved locally.
- **Data Pipeline**:
  `Goal Form -> Client BYOK Stream -> JSON Chunk Parser -> Dynamic DOM Accordion -> LocalStorage`.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/ai-learning-path.html` & `ai-tutor.html`.

#### 4. https://www.freecodecamp.org/
- **Domain**: Hands-On In-Browser IDE, Unit Test Assertions & Verifiable Certifications.
- **Key Features**:
  - 3-pane responsive workstation (Task specification, Monaco/CodeMirror code editor, Interactive console/output).
  - In-browser unit test assertion runner with pass/fail badges.
  - Capstone project grading and public cryptographic certificate verification URL.
- **Algorithmic Functions**:
  - **Sandboxed Assertion Runner**:
    $$\text{Execute}(\text{Code}) \land \forall t \in \text{Tests}, \text{assert}(t.\text{eval}(\text{Code}) == \text{true})$$
  - **Cryptographic Verification Hash**:
    $$\text{CertID} = \text{SHA256}(\text{StudentID} + \text{CourseSlug} + \text{Timestamp} + \text{MasterSalt})$$
- **Workflow**: Read task brief $\to$ Code in editor $\to$ Press `Ctrl+Enter` $\to$ Test harness evaluates assertions $\to$ 100% pass unlocks certificate.
- **Data Pipeline**:
  `Editor Input -> Web Worker Sandbox -> Assertion Harness -> LocalStorage Progress -> SHA-256 Hasher -> Public Verify Route`.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/code-lab.html`, `certifications.html`, `verify.html`.
  - **Comonk**: Live coding interview arena with automated assertion tests.

#### 5. https://www.duolingo.com/
- **Domain**: Gamified Micro-Learning & Retention Mechanics.
- **Key Features**:
  - Daily streak flame counter with streak freeze power-ups.
  - XP (Experience Points) and level progression.
  - Hearts / Lives counter (decrement on incorrect answer, practice drills to replenish).
  - 10 Competitive Leagues (Bronze $\to$ Diamond) with weekly promotion/demotion.
  - Web Audio API acoustic feedback (cheerful chimes on correct answers, buzzers on errors).
  - Spaced Repetition System (SRS).
- **Algorithmic Functions**:
  - **SuperMemo SM-2 Spaced Repetition Equation**:
    $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
    $$I(1) = 1 \text{ day}, \quad I(2) = 6 \text{ days}, \quad I(n) = I(n-1) \times EF'$$
  - **Streak Boundary Logic**: Evaluates UTC timestamp delta to award streak increments or consume streak freeze shields.
- **Workflow**: Start daily 5-minute drill $\to$ Answer quiz cards $\to$ Acoustic chime plays $\to$ Streak count animates $\to$ Weak items scheduled into future review queue.
- **Data Pipeline**:
  `User Answer -> SM-2 Algorithm -> Scheduled Review Queue in IndexedDB -> Web Audio Buffer -> Leaderboard XP Update`.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/duo-league.html`, `ui-core/StreakGamification.tsx`, `FlashcardDeck.tsx` (resolves Gap #1 by wiring Leitner SRS scheduler).
  - **Comonk**: Daily 5-minute technical interview streak drill.

#### 6. https://www.100daysai.com/ & https://www.100daysofnocode.com/
- **Domain**: Structured 100-Day Sprints & Build-in-Public Accountability.
- **Key Features**:
  - 10x10 circular progress grid (100 day cells).
  - Daily actionable recipes, prompts, and micro-projects.
  - Milestone unlock badges (Day 10, 25, 50, 75, 100).
  - 1-click social proof generator ("Share to X/LinkedIn" with generated progress card).
- **Algorithmic Functions**:
  - **Bitmask State Compression**: 100-day completion state stored as a 100-bit binary string.
  - **Completion Math**: $P = \frac{\sum_{i=1}^{100} D_i}{100} \times 100\%$.
- **Workflow**: Open day card $\to$ Complete hands-on task $\to$ Mark day complete $\to$ Progress circle updates $\to$ Download PNG social proof badge.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/challenge-100days.html` (100 Days of AI Engineering).
  - **Comonk**: `job-challenge.html` (100 Days to AI Job Placement).

#### 7. https://lawsofux.com/
- **Domain**: Cognitive Psychology & Human-Computer Interaction Heuristics.
- **Key Features**:
  - 21 visual cognitive law cards (Fitts's, Hick's, Miller's 7±2, Doherty Threshold <400ms, Peak-End Rule, Zeigarnik Effect).
  - Interactive test benches allowing users to run live behavioral experiments in the browser.
- **Algorithmic Functions**:
  - **Fitts's Law Target Acquisition Time**:
    $$T = a + b \log_2\left(1 + \frac{D}{W}\right)$$
  - **Hick-Hyman Decision Time**:
    $$T = b \log_2(n + 1)$$
- **Workflow**: Browse heuristic cards $\to$ Launch interactive test bench $\to$ Measure click latency $\to$ Plot empirical curve versus theoretical law $\to$ Export UX audit.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/laws-of-ux.html` & `ui-core/LawsOfUXBench.tsx`.
  - **Sevenseed Ecosystem**: Enforcing Doherty threshold (<400ms feedback) across all 8 venture dashboards.

#### 8. https://fs.blog/mental-models/
- **Domain**: Multidisciplinary Decision-Making Frameworks.
- **Key Features**:
  - Searchable catalog of 30+ mental models (First Principles, Inversion, Second-Order Thinking, Circle of Competence).
  - Interactive "Decision Matrix Tool" prompting structured evaluation of startup dilemmas.
- **Algorithmic Functions**:
  - **Inversion Checklist**: Identifying all failure vectors and systematically eliminating them.
  - **Second-Order Impact Mapping**: Modeling consequences across multiple time horizons ($t_1, t_2, t_3$).
- **Workflow**: Input dilemma $\to$ Select mental model lens $\to$ Answer structured prompts $\to$ Export decision memo.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/mental-models.html` (1,428 lines).
  - **Sevenseed Hub**: Venture ideation and feasibility matrix.

#### 9. https://thefitness.wiki/
- **Domain**: Evidence-Graded Clinical Knowledge Base & Progressive Calculators.
- **Key Features**:
  - Structured evidence hierarchy (Tier 1 Meta-Analyses to Tier 3 Observational).
  - Transparent, non-commercial clinical guidance.
  - Embedded calculators (BMR, TDEE, Body Surface Area).
- **Algorithmic Functions**:
  - **Mifflin-St Jeor Metabolic Baseline Formula**:
    $$\text{BMR}_{\text{male}} = 10W + 6.25H - 5A + 5, \quad \text{BMR}_{\text{female}} = 10W + 6.25H - 5A - 161$$
  - **Mosteller Body Surface Area**:
    $$\text{BSA} = \sqrt{\frac{W \times H}{3600}}$$
- **Sevenseed Mapping**:
  - **Decode Forest Pharmacy**: `sites/decode-forest-pharmacy/health-wiki.html`, `wiki.html`, and `generic-finder.html`.

#### 10. https://zerodha.com/varsity/ & https://swayam.gov.in/
- **Domain**: Modular Free Education, Reading Hierarchies & 4-Quadrant Pedagogy.
- **Key Features**:
  - Clean modular hierarchy (Modules $\to$ Chapters $\to$ Takeaways $\to$ Quizzes).
  - Reading time meters and progress cookies.
  - 4-Quadrant Pedagogy: E-Tutorial Video, E-Content Reading, Web Resources, Self-Assessment.
- **Sevenseed Mapping**:
  - **AVPU**: `sites/avpu/modules.html`, `courses.html`, `scholarships.html`.
  - **Sevenseed Hub**: `sites/sevenseed/syndicate-ruv.html`.

---

### Cluster 2: Growth Engineering & Marketing Teardowns

#### 11. https://marketingexamples.com/
- **Domain**: Visual Copywriting Teardowns & Conversion Formulas.
- **Key Features**:
  - "Before vs After" interactive comparison sliders.
  - Visual high-contrast callout annotations.
  - 3-point conversion formula pills (Hook, Value, Call to Action).
- **Algorithmic Functions**:
  - **Conversion Bullet Formula**:
    $$\text{Bullet} = \text{Action Verb} + \text{Quantified Metric} + \text{Business Outcome}$$
  - **Fluff Ratio Score**: $1 - \frac{\text{Adjectives}}{\text{Nouns} + \text{Verbs}}$.
- **Sevenseed Mapping**:
  - **Comonk**: ATS Resume Bullet Rewriter (`resume-analyzer.html`).
  - **Sevenforce**: Maya (AI Copywriter Agent) prompt architecture.
  - **AVPU**: `sites/avpu/marketing-teardowns.html`.

#### 12. https://growthinreverse.com/
- **Domain**: Founder Growth Flywheels & Unit Economic Teardowns.
- **Key Features**:
  - Visual growth flywheel diagrams (Input $\to$ Action $\to$ Output $\to$ Compounding Reinvestment).
  - Historical milestone timeline scrubber ($0 \to \$1\text{M}$ ARR).
  - Interactive CAC / LTV / Payback unit-economic simulator.
- **Algorithmic Functions**:
  - **Compounding Growth Loop Equation**:
    $$U_{t+1} = U_t \times (1 - \text{Churn}) + U_t \times K_{\text{viral}} + \text{Acquisition}_{\text{paid}}(R_t)$$
  - **Viral Coefficient**: $K = i \times c$.
- **Sevenseed Mapping**:
  - **Sevenforce**: `sites/sevenforce/flywheel-simulator.html` & `growth-teardown.html`.
  - **Sevenseed Hub**: Studio incubation growth playbook.

---

### Cluster 3: E-Commerce, Price Intelligence & Deal Radar

#### 13. https://www.smartprix.com/
- **Domain**: 3-Way Tech Spec Comparator & Spec Score Engine.
- **Key Features**:
  - 3-Way side-by-side spec comparison table.
  - Proprietary **"Spec Score"** (0-100) benchmark.
  - Differential highlight toggle ("Highlight Differences Only").
- **Algorithmic Functions**:
  - **Weighted Spec Score Normalization**:
    $$\text{SpecScore} = \sum_{k=1}^{M} w_k \cdot \left(\frac{v_k - \min_k}{\max_k - \min_k}\right) \times 100$$
  - **Row Difference Evaluator**: Adds `.spec-diff` class when column cell values mismatch.
- **Sevenseed Mapping**:
  - **AVP Emart**: `sites/avp-emart/spec-compare.html` & `ui-core/SpecComparisonTable.tsx`.

#### 14. https://buyhatke.com/
- **Domain**: 90-Day Price Trend Tracker & Predictive "Buy or Wait" AI.
- **Key Features**:
  - 90-day/180-day interactive HTML5 Canvas price curve.
  - Historical all-time low badge.
  - **"Buy Now or Wait" AI Verdict Gauge**.
  - Custom price drop alert webhook subscription.
- **Algorithmic Functions**:
  - **Price Drop Probability Function**:
    $$P(\text{Drop}) = f\left(\frac{P_{\text{current}} - P_{\text{min}}}{P_{\text{avg}} - P_{\text{min}}}, \Delta t_{\text{last\_sale}}\right)$$
  - **Price Volatility Standard Deviation**: $\sigma = \sqrt{\frac{1}{N}\sum (P_i - \bar{P})^2}$.
- **Sevenseed Mapping**:
  - **AVP Emart**: `sites/avp-emart/price-tracker.html`, `price-radar.html`, and `ui-core/PriceHistoryGraph.tsx`.

#### 15. https://www.xerve.in/prices & https://www.google.com/shopping?udm=28
- **Domain**: Multi-Store Aggregator, Coupon Stacking & Faceted Filters.
- **Key Features**:
  - 5-Store comparison matrix (Flipkart, Amazon, Myntra, Croma, Reliance Digital).
  - Automated 5-coupon tester runner.
  - Cashback wallet simulation and faceted filter sidebar.
- **Algorithmic Functions**:
  - **True Landed Net Price**:
    $$\text{Price}_{\text{landed}} = \text{BasePrice} - \max(\text{Coupons}) - \text{Cashback} + \text{Shipping}$$
- **Sevenseed Mapping**:
  - **AVP Emart**: `sites/avp-emart/coupon-tester.html`, `deal-hunter.html`, `deals-radar.html`.

---

### Cluster 4: Modern Design Engineering, WebGL Shaders, 3D & UI Primitives

#### 16. Aceternity UI, 21st.dev, Unicorn Studio, MotionSites.ai, Uiverse.io, Spline 3D & Aura Build
- **Domain**: Aesthetic Design Engineering & Cybernetic UI.
- **Key Features**:
  - **Aceternity UI**: Overhead glowing lamp cone (`.hero-lamp`), 3D card tilt with dynamic mouse glare, animated border beams (`.border-beam-card`), shooting meteors, Evervault matrix text scramble.
  - **Unicorn Studio**: WebGL fluid mesh gradients reacting to cursor speed and position (`.liquid-mesh`).
  - **MotionSites.ai**: Scroll-driven reveals, animated number counters, magnetic buttons.
  - **Spline 3D**: Three.js WebGL canvas (`#hero3dCanvas`) with orbital rings, venture satellites, and cursor-following rotation.
  - **Aura Build**: Telemetry HUD badges (`.aura-telemetry`), real-time token throughput meters ("Groq LLaMA 3.3 · 842 T/s · 14ms").
- **Sevenseed Mapping**:
  - Universal framework in `sites/style.css`, `sites/app.js`, and `generate_sites.py`.

---

## 2. Venture-by-Venture Integration Matrix

| Venture Slug | Venture Name | Domain | Primary Benchmarks Integrated | Key Live Workstations |
|---|---|---|---|---|
| `sevenseed` | **Sevenseed Hub** | AI Venture Studio & Incubator | Aceternity, Spline 3D, Aura Build, GrowthInReverse | `syndicate-ruv.html`, `market-sizing.html`, `byok.html`, `ventures.html` |
| `avpu` | **AVPU** | AI-Native Free University | Learn-Anything, FreeCodeCamp, Duolingo, Laws of UX | `learn-dag.html`, `duo-league.html`, `code-lab.html`, `laws-of-ux.html`, `certifications.html` |
| `comonk` | **Comonk AI** | AI Career Copilot & ATS | Jobscan, Levels.fyi, Interviewing.io, MarketingExamples | `resume-analyzer.html`, `interview-arena.html`, `salary-insights.html` |
| `sevenforce` | **Sevenforce** | Autonomous AI Workforce | Sintra.ai, Devin Terminal, LangGraph, GrowthInReverse | `workflows.html`, `devin-terminal.html`, `employees.html`, `flywheel-simulator.html` |
| `avp-emart` | **AVP Emart** | Smart Commerce & Deals | Smartprix, Buyhatke, Xerve, Blinkit/Zepto | `spec-compare.html`, `price-tracker.html`, `coupon-tester.html`, `qcommerce.html` |
| `decode-forest-pharmacy` | **Decode Pharmacy** | AI Clinical HealthTech | TheFitness.wiki, PMBJP Jan Aushadhi, Drugs.com | `generic-finder.html`, `interaction-checker.html`, `prescription-ocr.html`, `hospital-finder.html` |
| `breakdown-factor` | **Breakdown Factor** | AI ConTech & Damage Vision | CPWD DSR 2023, Procore OSHA, PyTorch YOLOv8 | `boq-estimator.html`, `safety-audit.html`, `cv-scanner.html` |
| `avp-charitable-trust` | **AVP Trust** | Non-Profit Governance | Charity Navigator, Section 80G / Form 10BE | `tax-exemption.html`, `impact-tracker.html`, `health-camps.html` |
| `rakshak-ai` | **Rakshak AI** | Public Safety & Legal AI | BNS 2023, RapidSOS, 1930 Cybercrime Portal | `fir-generator.html`, `sentinel-vision.html`, `threat-radar.html` |

---

## 3. Verified Gap List & Implementation Roadmap

| Priority | Benchmark | Identified Gap | Action Plan |
|---|---|---|---|
| **P1** | **Duolingo** | Leitner SRS Review Queue scheduling missing | Wire SM-2 interval scheduler into `FlashcardDeck.tsx` and create review session page in `sites/avpu/` |
| **P2** | **LearnAnything.com** | Topic search front door absent on AVPU index | Add instant omnibox input to `sites/avpu/index.html` resolving into the DAG |
| **P3** | **MotionSites.ai** | Scroll-driven reveals & section pinning absent | Add IntersectionObserver scroll choreography & number tickers to `sites/app.js` |
| **P4** | **UI-Core Monorepo** | 13 features exist only in non-deployed `frontend/` | Port interactive widgets (Wishlist, Reminders, Safety Heatmap) into `sites/` |
| **P5** | **Duplication** | Duplicate pages for 100 Days & Health Wiki | Canonicalize `challenge-100days.html` and `health-wiki.html` with 301 redirects |

---

## 4. Build Log — 2026-09-23

What was actually implemented against the roadmap above, and where it deviates from
the stated plan. All of it landed in **`sites/`** (the live codebase) rather than
`frontend/`, so it reaches real users on the next deploy.

### P1 — Duolingo SRS: DONE, as SM-2 rather than Leitner

**New: [`sites/avpu/review-queue.html`](../sites/avpu/review-queue.html)** — a real SuperMemo
SM-2 scheduler, not a fixed-interval box system:

- Per-card ease factor, repetition count, interval and lapse count, persisted to
  `localStorage` under `avpu_srs_state_v1` (all reads/writes wrapped, so private mode degrades
  to an in-memory session instead of throwing).
- Grades Again/Hard/Good/Easy map to q = 0/3/4/5. EF moves on **every** review including
  failures, floored at 1.3, so persistently hard cards stay frequent permanently.
- Grade buttons are labelled with the interval each choice would actually produce.
- Due-date queue, relearning cards returned to the back of the session, leech flag at 8 lapses,
  maturity at ≥21 days, retention %, review streak, and a 30-day workload forecast canvas.
- 45 cards across four decks drawn from content already on AVPU (DAG concepts, UX laws, mental
  models, Varsity finance), each linking back to its source page.

Verified by simulation, not inspection: trajectories are the textbook 1 → 6 → 15 → 38 → 95 days
at EF 2.5; Easy raises EF, Hard erodes it, a lapse costs 0.8 EF and resets the interval; EF floor,
lapse counting, leech threshold and due-date arithmetic all assert clean.

> **⚠️ Duplication created, needs a decision.** A concurrent session added
> [`sites/avpu/flashcards.html`](../sites/avpu/flashcards.html) (Leitner 5-box, fixed 1/3/7/14/30-day
> intervals) minutes before this page landed. **Two pages now implement spaced repetition with
> different algorithms.** Neither was deleted — pick one as canonical. SM-2 adapts per card and
> per learner; Leitner is simpler to explain. This is the same failure mode as P5 below.

### P2 — Topic search: DONE, as a dedicated page rather than the index omnibox

**New: [`sites/avpu/topic-search.html`](../sites/avpu/topic-search.html)**. The roadmap called for an
omnibox on `sites/avpu/index.html`; that file is **regenerated by `generate_sites.py`**, so a
hand-edit there would be silently reverted (handoff §D). The search lives on its own page and is
linked from the AVPU home via the generator instead.

- Scoring is `0.5·prefix + 0.3·fuzzy + 0.2·popularity`, with three corrections found by testing:
  a **bounded Levenshtein** near-exact test (so "transfomers" and "langraph" resolve, while "cat"
  does not match "catalogue"); **length-ratio discounting** on both prefix and fuzzy components
  (a 3-letter hit inside a 9-letter alias is weak evidence); and a **lexical strength floor**
  checked before popularity is added, so a popular page cannot win on its prior alone.
- Stopword and short-fragment filtering, so "how to make pasta" reaches the miss path.
- A miss hands the raw query to `ai-learning-path.html?goal=…` rather than showing an empty page.
- On a graph topic it renders the **real prerequisite path**: ancestor closure, then Kahn
  topological sort, with hours remaining and nodes already mastered on the DAG excluded.
- `Ctrl+K` / `/` focus, arrow-key navigation, 150 ms debounce, `?q=` deep links.

Verified: 33 of 33 intended queries resolve to the right target; 7 of 8 off-topic queries fall
through to the generator. The exception is "where is my order" → *Second-Order Thinking*, a genuine
match on the word "order", left as-is rather than contorting the scorer.

**Also: [`sites/avpu/data/topics.js`](../sites/avpu/data/topics.js)** — the topic graph now lives in one
shared file. `learn-dag.html` previously held its own inline copy of the 11 nodes; it now loads the
shared file, so the DAG and the search can no longer disagree about prerequisites. The refactor was
verified byte-identical across all 12 fields the DAG reads. `learn-dag.html` also gained deep-link
support (`learn-dag.html#agents`, which is what search links to) and now derives its node count
from the data instead of a hardcoded "11".

### P3 — Scroll motion: DONE, with a correction to the gap description

The roadmap said "scroll-driven reveals absent". **Reveal-on-scroll already existed** —
`generate_sites.py` ships a `.reveal` IntersectionObserver and a scroll-progress bar. What was
genuinely absent is *scroll-**linked*** motion: `animation-timeline` / `scroll-timeline` had zero
occurrences repo-wide.

Added to **`generate_sites.py`** (not to `sites/*/style.css` or `sites/*/app.js`, which the
generator rewrites for all 9 ventures on every run):

- `SCROLL_MOTION_CSS`, returned from `render_css` — primitives driven by a 0..1 `--sp` custom
  property: `[data-scroll-reveal]`, `[data-scroll-parallax]` (with `--depth`), `[data-scroll-scale]`,
  `.scroll-pin` / `.pin-track` for sticky horizontal tracks, and `.read-progress`.
- Native CSS scroll timelines under `@supports (animation-timeline: view())` handle the reveal case
  on the compositor with no JS involvement.
- `SCROLL_MOTION_JS`, appended to `APP_JS` — feature-tests native timelines, then sets `--sp` for
  the remaining primitives in one batched `requestAnimationFrame` pass per scroll event.
- Full `prefers-reduced-motion` opt-out; without JS every element renders in its final state.
- Applied so far to one element: the hero's decorative `.hero-grid` (absolutely positioned, so
  translating it cannot disturb layout). The other primitives are wired and available but not yet
  used in generated markup — **opting more sections in is the remaining work here.**

Verified: the scroll layer is present in all 9 ventures' generated CSS with balanced braces, the
hero hook survives `render_html`, and the generated `app.js` passes `node --check`.

### P4 — 15 features stranded in `frontend/`: NOT DONE

Untouched. Still the unresolved architecture decision in
[`../HANDOFF_SESSION_2026-09-21.md`](../HANDOFF_SESSION_2026-09-21.md) §1.

### P5 — Duplicate pages: NOT DONE, and now one worse

`100-day-challenge.html` vs `challenge-100days.html`, `wiki.html` vs `health-wiki.html`, and now
`flashcards.html` vs `review-queue.html`. Note the live AVPU index links `100-day-challenge.html`
while the generator links `challenge-100days.html` — the live index has diverged from its generator.

### Reachability gaps found while wiring this up

Both new pages are linked from the AVPU home (generator **and** live `index.html`) and from the nav
of 11 hand-written AVPU pages. Five AVPU pages **have no site navigation at all** —
`100-day-challenge.html`, `certifications.html`, `ai-learning-path.html`, `verify.html`,
`evervault-lab.html` — so a reader who lands on one has no way back. `flashcards.html` has a nav of
a different shape and was left alone pending the P1 duplication decision. Several pages are also
orphaned from the index entirely: `ai-learning-path.html`, `courses.html`, `scholarships.html`,
`verify.html`, `evervault-lab.html`, `marketing-teardowns.html`, `ai-tutor.html`, `flashcards.html`.
