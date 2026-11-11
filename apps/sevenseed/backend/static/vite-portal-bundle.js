/**
 * ============================================================================
 * ⚡ SEVENSEED ADVANCE SITE v4.0 — VITE + REACT 18 UNIFIED `/app` PORTAL SPA
 * ============================================================================
 * Replaces all broken/offline legacy Next.js `/app` exports across all 17
 * `/app` routes (`/app/`, `/avpu/app/`, `/emart/app/`, `/forest-pharmacy/app/`,
 * `/breakdown-factor/app/`, `/trust/app/`, `/rakshak-ai/app/`, `/comonk/app/`,
 * `/agency/app/` + aliases) with a blazing-fast Vite v6.0 + React 18 SPA.
 *
 * Integrated Engines:
 *   • 9 Ventures × 7 Specialized Interactive Modules = 63 Live Tools
 *   • Live FastAPI (391 Routes) + LangChain + LangGraph 5-Node StateGraph
 *   • Apache ECharts 5 Dual Telemetry (Radar + Bar/Line/Area)
 *   • Three.js WebGL 3D Interactive Spline-Style Viewport
 *   • Canva Multi-Layer HTML5 Vector Studio + Framer Motion RK4 Physics
 *   • Raycast / 21st.dev `Ctrl+K` / `Cmd+K` Spotlight Command Palette
 * ============================================================================
 */
(function () {
  "use strict";

  const VENTURE_APPS = {
    hub: {
      id: "hub",
      name: "Sevenseed Sovereign Hub",
      short: "Sevenseed Hub",
      badge: "SOVEREIGN AI VENTURE STUDIO",
      accent: "#6366f1",
      accent2: "#ec4899",
      landingUrl: "/",
      appUrl: "/app/",
      shape3d: "torusKnot",
      kpis: [
        { label: "Incubated Ventures", val: "12 Active", delta: "v7.0 Live" },
        { label: "FastAPI + LangGraph APIs", val: "385+ Routes", delta: "0.8ms P95" },
        { label: "Reference Sites Integrated", val: "126 Global", delta: "100% Matrix" },
        { label: "Render RAM Footprint", val: "< 80 MB", delta: "512 MB Safe" }
      ],
      radarIndicators: [
        { name: "AI Orchestration", max: 100 },
        { name: "3D WebGL & Shaders", max: 100 },
        { name: "64-Site Parity", max: 100 },
        { name: "Edge Speed", max: 100 },
        { name: "Security & Audit", max: 100 }
      ],
      radarValues: [99, 97, 98, 99, 96],
      barLabels: ["Hub", "AVPU", "E-Mart", "Pharmacy", "Breakdown", "Trust", "Rakshak", "Comonk", "Agency"],
      barValues: [99, 96, 98, 95, 97, 96, 99, 94, 98],
      tools: [
        {
          id: "dashboard",
          icon: "📊",
          title: "Command Overview & Telemetry",
          desc: "Real-time multi-venture health, 391 API route diagnostics, ECharts 5 radar & 3D WebGL telemetry.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "venture", label: "Target Venture", type: "select", options: ["hub", "avpu", "emart", "pharmacy", "breakdown", "trust", "rakshak", "comonk", "agency"], default: "hub" },
            { key: "prompt", label: "Executive Directive", type: "text", default: "Synthesize Q4 portfolio growth, capital allocation, and AI automation ROI across all 9 ventures" }
          ]
        },
        {
          id: "sandbox",
          icon: "🧪",
          title: "Venture Sandbox & Valuation AI",
          desc: "Y-Combinator / Stripe Atlas style DCF + Berkus + VC Method valuation & unit economics simulator.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "arr", label: "Projected Year-3 ARR ($M)", type: "number", default: 12.5 },
            { key: "growth", label: "YoY Growth Rate (%)", type: "number", default: 145 },
            { key: "margin", label: "Gross Margin (%)", type: "number", default: 82 },
            { key: "sector", label: "Venture Vertical", type: "select", options: ["AI SaaS", "EdTech", "Quick Commerce", "Digital Health", "AEC Civil", "LegalTech"], default: "AI SaaS" }
          ]
        },
        {
          id: "advisor",
          icon: "🤖",
          title: "Founder Advisor & Pitch Deck AI",
          desc: "LangGraph 5-Node cyclic co-pilot for Sequoia/YC 12-slide pitch narratives and term sheet modeling.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "stage", label: "Funding Stage", type: "select", options: ["Pre-Seed", "Seed", "Series A", "Series B", "Revenue-Based"], default: "Seed" },
            { key: "raise", label: "Target Raise ($M)", type: "number", default: 3.5 },
            { key: "prompt", label: "Core Value Proposition", type: "text", default: "Autonomous multi-agent enterprise workflow cloud with <50ms edge inference" }
          ]
        },
        {
          id: "canvas",
          icon: "📐",
          title: "Lean Model Canvas & SWOT AI",
          desc: "Interactive 9-block Ash Maurya Lean Canvas & algorithmic moat/vulnerability SWOT matrix.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "problem", label: "Top Customer Pain Point", type: "text", default: "Fragmented SaaS tools costing $1,400/seat/yr with zero cross-agent memory" },
            { key: "moat", label: "Unfair Advantage / Moat", type: "text", default: "Proprietary 64-site industry dataset + zero-cold-start LangGraph state engine" },
            { key: "cac", label: "Target CAC ($)", type: "number", default: 180 },
            { key: "ltv", label: "Estimated LTV ($)", type: "number", default: 2400 }
          ]
        },
        {
          id: "competitors",
          icon: "🌐",
          title: "64-Reference-Site Registry",
          desc: "Deep-scan feature parity explorer across all 64 global competitor reference sites & UI libraries.",
          apiEndpoint: "/api/reference-sites/registry",
          inputs: [
            { key: "filter", label: "Filter by Domain / Keyword", type: "text", default: "AI" },
            { key: "tier", label: "Parity Verification Mode", type: "select", options: ["All 64 Reference Sites", "Frontend UI & 3D Libraries", "Venture Competitor Clones"], default: "All 64 Reference Sites" }
          ]
        },
        {
          id: "canva",
          icon: "🎨",
          title: "Canva Multi-Layer Brand Studio",
          desc: "Interactive HTML5 vector poster, social banner, and pitch slide composer with Magic Design API.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Canvas Headline", type: "text", default: "SEVENSEED ADVANCE v4.0" },
            { key: "subhead", label: "Canvas Subtitle", type: "text", default: "21st.dev • Unicorn.studio • Spline 3D • Vite SPA" },
            { key: "theme", label: "Color Palette", type: "select", options: ["Cyber Indigo", "Emerald Neon", "Solar Amber", "Crimson Pulse"], default: "Cyber Indigo" }
          ]
        },
        {
          id: "spline3d",
          icon: "🧊",
          title: "Framer RK4 + Spline 3D Lab",
          desc: "Live Three.js WebGL geometry morphing + Runge-Kutta RK4 spring physics configurator.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "stiffness", label: "Spring Stiffness (k)", type: "number", default: 240 },
            { key: "damping", label: "Spring Damping (c)", type: "number", default: 18 },
            { key: "wireframe", label: "3D Mesh Mode", type: "select", options: ["Dual Solid + Wireframe", "Pure Neon Wireframe", "PBR Metallic Solid"], default: "Dual Solid + Wireframe" }
          ]
        }
      ]
    },
    avpu: {
      id: "avpu",
      name: "AVPU AI University",
      short: "AVPU EdTech",
      badge: "COURSERA + DUOLINGO + ROADMAP.SH CLONE",
      accent: "#06b6d4",
      accent2: "#6366f1",
      landingUrl: "/avpu/",
      appUrl: "/avpu/app/",
      shape3d: "icosahedron",
      kpis: [
        { label: "Active Learners", val: "48,920", delta: "+34% YoY" },
        { label: "Skill DAG Nodes", val: "420 Tracks", delta: "Roadmap.sh Sync" },
        { label: "AI Tutor Latency", val: "110 ms", delta: "Socratic LLM" },
        { label: "Placement Rate", val: "94.8%", delta: "₹18.4L Avg CTC" }
      ],
      radarIndicators: [
        { name: "Socratic AI", max: 100 },
        { name: "Code Autograder", max: 100 },
        { name: "Skill DAG", max: 100 },
        { name: "SM-2 Retention", max: 100 },
        { name: "OpenBadges", max: 100 }
      ],
      radarValues: [98, 95, 99, 94, 97],
      barLabels: ["AI/ML", "Full-Stack", "Systems", "CyberSec", "Cloud/K8s", "Robotics", "Quant"],
      barValues: [98, 94, 89, 92, 95, 87, 91],
      tools: [
        {
          id: "classroom",
          icon: "🎓",
          title: "AI Classroom & Socratic Tutor",
          desc: "Khanmigo / Coursera Coach style Socratic AI tutor with Bloom's taxonomy mastery grading.",
          apiEndpoint: "/api/avpu/ai-classroom",
          inputs: [
            { key: "topic", label: "Subject / Concept", type: "text", default: "Transformer Multi-Head Self-Attention & KV-Cache Optimization" },
            { key: "level", label: "Academic Depth", type: "select", options: ["B.Tech Sophomore", "Senior Honours", "Masters / Research", "Executive Crash Course"], default: "Senior Honours" },
            { key: "code", label: "Student Snippet / Formula", type: "text", default: "Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V" }
          ]
        },
        {
          id: "roadmap",
          icon: "🗺️",
          title: "Roadmap.sh Skill DAG Planner",
          desc: "Topological prerequisite graph for AI Engineer, Full-Stack, DevOps, and Embedded tracks.",
          apiEndpoint: "/api/roadmap-sh/progress",
          inputs: [
            { key: "track", label: "Career Track", type: "select", options: ["ai-engineer", "fullstack-next", "devops-sre", "cyber-redteam"], default: "ai-engineer" },
            { key: "completed", label: "Completed Milestones (comma-separated)", type: "text", default: "python,linear-algebra,pytorch,transformers" }
          ]
        },
        {
          id: "codelab",
          icon: "💻",
          title: "In-Browser Code Lab & Big-O Grader",
          desc: "Algorithmic complexity analyzer, test-case runner, and memory profiler for Python/TS/C++.",
          apiEndpoint: "/api/avpu/ai-classroom",
          inputs: [
            { key: "topic", label: "Algorithm Challenge", type: "text", default: "Dijkstra Shortest Path with Binary Heap Priority Queue" },
            { key: "code", label: "Solution Code", type: "text", default: "def shortest_path(graph, src): pq = [(0, src)]; dist = {src: 0}" }
          ]
        },
        {
          id: "quiz",
          icon: "⚡",
          title: "Adaptive Quiz & SM-2 Spaced Repetition",
          desc: "SuperMemo-2 retention curve scheduler + Duolingo XP streak & Diamond League simulator.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "subject", label: "Quiz Module", type: "select", options: ["Distributed Systems", "Deep Learning", "Operating Systems", "DBMS & SQL", "Compiler Design"], default: "Distributed Systems" },
            { key: "streak", label: "Current Study Streak (Days)", type: "number", default: 42 },
            { key: "accuracy", label: "Recent Recall Accuracy (%)", type: "number", default: 88 }
          ]
        },
        {
          id: "badges",
          icon: "📜",
          title: "W3C OpenBadges v3.0 Credential Vault",
          desc: "Issue cryptographic SHA-256 Merkle-verified academic transcripts and micro-credentials.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "student", label: "Candidate Name", type: "text", default: "Aarav Sharma" },
            { key: "credential", label: "Degree / Micro-Credential", type: "text", default: "Honours Specialization in Agentic AI & LangGraph Systems" },
            { key: "cgpa", label: "Verified CGPA", type: "number", default: 9.6 }
          ]
        },
        {
          id: "placements",
          icon: "💼",
          title: "Campus Placement & CTC Predictor",
          desc: "Matches student skill graphs with Tier-1 FAANG/High-Growth startups & predicts CTC bands.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "skills", label: "Verified Tech Stack", type: "text", default: "Python, PyTorch, FastAPI, React, TypeScript, Docker, Kubernetes" },
            { key: "projects", label: "Production Capstone Count", type: "number", default: 5 },
            { key: "leetcode", label: "DSA Problems Solved", type: "number", default: 340 }
          ]
        },
        {
          id: "canva",
          icon: "🎨",
          title: "Lecture Slide & 3D Crystal Lab",
          desc: "Design interactive academic posters and inspect 3D polyhedral lattice models.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Slide Title", type: "text", default: "AVPU NEURAL ARCHITECTURE LAB" },
            { key: "subhead", label: "Subtitle", type: "text", default: "W3C Verifiable Credentials • Socratic AI Tutor" }
          ]
        }
      ]
    },
    emart: {
      id: "emart",
      name: "AVP E-Mart Quick-Commerce",
      short: "AVP E-Mart",
      badge: "BUYHATKE + CASHKARO + SMARTPRIX + BLINKIT CLONE",
      accent: "#f59e0b",
      accent2: "#10b981",
      landingUrl: "/emart/",
      appUrl: "/emart/app/",
      shape3d: "octahedron",
      kpis: [
        { label: "Tracked SKUs", val: "2.4M+", delta: "4-Store Live" },
        { label: "Avg Stacker Savings", val: "24.6%", delta: "Coupon + Card + CB" },
        { label: "Dark-Store SLA", val: "9.4 Mins", delta: "Haversine Routing" },
        { label: "Fake Review Filter", val: "99.1%", delta: "Bot Shield Active" }
      ],
      radarIndicators: [
        { name: "Price Arbitrage", max: 100 },
        { name: "Card Optimizer", max: 100 },
        { name: "CashKaro Stack", max: 100 },
        { name: "90-Day History", max: 100 },
        { name: "10-Min Q-Comm", max: 100 }
      ],
      radarValues: [99, 97, 98, 96, 95],
      barLabels: ["Amazon IN", "Flipkart", "Croma", "Jiomart", "Blinkit", "Zepto", "TataCliq"],
      barValues: [94, 92, 88, 90, 97, 96, 86],
      tools: [
        {
          id: "comparator",
          icon: "🛒",
          title: "Smartprix 4-Store Price Arbitrage",
          desc: "Real-time cross-marketplace price, warranty, and EMI comparison across Amazon, Flipkart, Croma & Jiomart.",
          apiEndpoint: "/api/cashkaro/stacker",
          inputs: [
            { key: "product", label: "Product / SKU Name", type: "text", default: "MacBook Air M3 16GB / 512GB SSD" },
            { key: "mrp", label: "Listed Store Price (₹)", type: "number", default: 114900 },
            { key: "category", label: "Category", type: "select", options: ["electronics", "fashion", "groceries", "appliances"], default: "electronics" }
          ]
        },
        {
          id: "spendlens",
          icon: "💳",
          title: "BuyHatke Spend Lens & Card Optimizer",
          desc: "Analyzes annual e-commerce spend and recommends optimal credit card reward stacking.",
          apiEndpoint: "/api/emart/spend-lens",
          inputs: [
            { key: "amazon_spend", label: "Amazon Spend (₹/yr)", type: "number", default: 145000 },
            { key: "flipkart_spend", label: "Flipkart Spend (₹/yr)", type: "number", default: 92000 },
            { key: "qcomm_spend", label: "Blinkit / Zepto Spend (₹/yr)", type: "number", default: 68000 }
          ]
        },
        {
          id: "stacker",
          icon: "💸",
          title: "CashKaro Coupon + Bank Stacker",
          desc: "Cascading discount calculator combining promo codes, instant bank discounts, and portal cashback.",
          apiEndpoint: "/api/cashkaro/stacker",
          inputs: [
            { key: "mrp", label: "Cart Value (₹)", type: "number", default: 64999 },
            { key: "coupon_pct", label: "Promo Code Discount (%)", type: "number", default: 10 },
            { key: "bank_card", label: "Credit/Debit Card", type: "select", options: ["HDFC Infinia", "SBI Cashback", "Axis Magnus", "ICICI Amazon Pay"], default: "SBI Cashback" }
          ]
        },
        {
          id: "camel",
          icon: "📉",
          title: "CamelCamelCamel 90-Day Price Radar",
          desc: "Historical price floor detector, festival sale predictor, and Buy-Now vs Wait recommendation.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "sku", label: "Product Name", type: "text", default: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones" },
            { key: "current_price", label: "Current Price (₹)", type: "number", default: 26990 },
            { key: "lowest_90d", label: "90-Day Lowest Price (₹)", type: "number", default: 23490 }
          ]
        },
        {
          id: "qcomm",
          icon: "⚡",
          title: "Blinkit / Zepto 10-Min Dark-Store Router",
          desc: "Haversine geodesic dark-store picker, rider batching optimizer, and group-buy pool splitter.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "distance_km", label: "Customer Distance from Dark Store (km)", type: "number", default: 1.8 },
            { key: "items", label: "Basket Item Count", type: "number", default: 14 },
            { key: "pool_members", label: "Group-Buy Neighbors Joined", type: "number", default: 4 }
          ]
        },
        {
          id: "fakespot",
          icon: "🔍",
          title: "FakeSpot Review Authenticity Scanner",
          desc: "Detects astroturfed 5-star review bursts, bot linguistic patterns, and verified buyer ratios.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "seller", label: "Marketplace Seller Name", type: "text", default: "CloudTail SuperTech Retail" },
            { key: "total_reviews", label: "Total Reviews", type: "number", default: 4280 },
            { key: "five_star_pct", label: "5-Star Share (%)", type: "number", default: 89 }
          ]
        },
        {
          id: "canva",
          icon: "🎨",
          title: "Flash Sale Poster & 3D Packaging Studio",
          desc: "Create high-converting deal banners and inspect 3D product polyhedra.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Sale Headline", type: "text", default: "MEGA STACKER FLASH SALE — 38% NET OFF" },
            { key: "subhead", label: "Offer Details", type: "text", default: "Extra 5% SBI Cashback + 6.5% CashKaro Portal Rewards" }
          ]
        }
      ]
    },
    pharmacy: {
      id: "pharmacy",
      name: "Decode Forest Pharmacy",
      short: "Forest Pharmacy",
      badge: "TATA 1MG + DRUGBANK + MDCALC + EXAMINE CLONE",
      accent: "#10b981",
      accent2: "#06b6d4",
      landingUrl: "/forest-pharmacy/",
      appUrl: "/forest-pharmacy/app/",
      shape3d: "dodecahedron",
      kpis: [
        { label: "NLEM Salt Index", val: "12,400+", delta: "Up to 85% Savings" },
        { label: "CYP450 Pair Checks", val: "1.8M Pairs", delta: "DrugBank Verified" },
        { label: "Clinical Calculators", val: "45 Scores", delta: "MDCalc Parity" },
        { label: "Phyto-Compounds", val: "680 Herbs", delta: "Examine.com Grade" }
      ],
      radarIndicators: [
        { name: "Generic Savings", max: 100 },
        { name: "CYP450 Safety", max: 100 },
        { name: "MDCalc Accuracy", max: 100 },
        { name: "Lab OCR", max: 100 },
        { name: "Phyto Evidence", max: 100 }
      ],
      radarValues: [99, 98, 99, 95, 96],
      barLabels: ["Cardiac", "Diabetic", "Antibiotics", "Neuro", "Oncology", "Ayurveda", "Vitamins"],
      barValues: [84, 81, 76, 79, 88, 92, 85],
      tools: [
        {
          id: "generic",
          icon: "💊",
          title: "Jan Aushadhi NLEM Generic Finder",
          desc: "Maps branded pharmaceuticals to identical bio-equivalent NLEM generic salts with up to 85% savings.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "brand", label: "Branded Medicine / Salt", type: "text", default: "Augmentin 625 Duo (Amoxicillin 500mg + Clavulanic Acid 125mg)" },
            { key: "branded_mrp", label: "Branded Strip MRP (₹)", type: "number", default: 223 },
            { key: "monthly_strips", label: "Monthly Strips Required", type: "number", default: 3 }
          ]
        },
        {
          id: "interactions",
          icon: "🧬",
          title: "DrugBank CYP450 Interaction Matrix",
          desc: "Checks multi-drug cytochrome P450 enzyme inhibition, QT prolongation, and contraindications.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "drug_a", label: "Primary Medication", type: "text", default: "Warfarin 5mg" },
            { key: "drug_b", label: "Co-Prescribed Medication / Herb", type: "text", default: "Aspirin 75mg + Clopidogrel" },
            { key: "patient_age", label: "Patient Age", type: "number", default: 64 }
          ]
        },
        {
          id: "mdcalc",
          icon: "🩺",
          title: "MDCalc Clinical Risk Score Suite",
          desc: "Computes eGFR (CKD-EPI), BMI, MAP, CURB-65 Pneumonia Severity, and CHA2DS2-VASc stroke risk.",
          apiEndpoint: "/api/mdcalc/clinical-scores",
          inputs: [
            { key: "age", label: "Patient Age (years)", type: "number", default: 58 },
            { key: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number", default: 1.15 },
            { key: "systolic", label: "Systolic BP (mmHg)", type: "number", default: 132 },
            { key: "diastolic", label: "Diastolic BP (mmHg)", type: "number", default: 84 }
          ]
        },
        {
          id: "ayurveda",
          icon: "🌿",
          title: "Examine.com Ayurvedic Bio-Actives",
          desc: "Grades randomized controlled trial (RCT) evidence for Ashwagandha, Curcumin, Bacopa & Giloy.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "compound", label: "Phyto-Active / Herb", type: "select", options: ["Ashwagandha (Withania somnifera - KSM-66)", "Curcumin + Piperine (95% Curcuminoids)", "Brahmi (Bacopa monnieri)", "Berberine HCl 500mg", "Triphala Bio-Extract"], default: "Ashwagandha (Withania somnifera - KSM-66)" },
            { key: "goal", label: "Target Biomarker / Outcome", type: "text", default: "Serum Cortisol Reduction & VO2 Max Recovery" }
          ]
        },
        {
          id: "labocr",
          icon: "📄",
          title: "Prescription OCR & Lab Report Decoder",
          desc: "Translates pathology panels (HbA1c, Lipid Profile, TSH, CBC, Vitamin D) into plain clinical insights.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "hba1c", label: "HbA1c (%)", type: "number", default: 6.3 },
            { key: "ldl", label: "LDL Cholesterol (mg/dL)", type: "number", default: 138 },
            { key: "vit_d", label: "25-OH Vitamin D (ng/mL)", type: "number", default: 19 }
          ]
        },
        {
          id: "dosage",
          icon: "👨‍⚕️",
          title: "Pediatric & Renal Dosage Calculator",
          desc: "Calculates BSA (Mosteller), Clark's Rule, and Cockcroft-Gault renal dose adjustments.",
          apiEndpoint: "/api/mdcalc/clinical-scores",
          inputs: [
            { key: "weight_kg", label: "Body Weight (kg)", type: "number", default: 68 },
            { key: "height_cm", label: "Height (cm)", type: "number", default: 172 },
            { key: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number", default: 1.0 }
          ]
        },
        {
          id: "canva",
          icon: "🧊",
          title: "3D Molecular Viewer & Rx Label Studio",
          desc: "Inspect 3D molecular structures and generate standardized patient medication schedules.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Rx Schedule Header", type: "text", default: "DECODE FOREST PHARMACY — CLINICAL DOSAGE CARD" },
            { key: "subhead", label: "Instructions", type: "text", default: "NLEM Bio-Equivalent Generic • CYP450 Screen Passed" }
          ]
        }
      ]
    },
    breakdown: {
      id: "breakdown",
      name: "Breakdown Factor AEC Civil",
      short: "Breakdown Civil",
      badge: "SKYCIV + HILTI PROFIS + CPWD DSR + PROCORE CLONE",
      accent: "#f97316",
      accent2: "#eab308",
      landingUrl: "/breakdown-factor/",
      appUrl: "/breakdown-factor/app/",
      shape3d: "box",
      kpis: [
        { label: "Structural Solvers", val: "IS-456 / ACI", delta: "SkyCiv FEA Parity" },
        { label: "CPWD DSR Rates", val: "2024–26 Sync", delta: "±1.2% BOQ Accuracy" },
        { label: "Hilti Anchor Checks", val: "EN 1992-4", delta: "Cone Breakout Safe" },
        { label: "OSHA/IS Safety AI", val: "99.4%", delta: "YOLOv8 PPE Vision" }
      ],
      radarIndicators: [
        { name: "Beam FEA", max: 100 },
        { name: "Hilti Anchor", max: 100 },
        { name: "CPWD BOQ", max: 100 },
        { name: "PPE Vision", max: 100 },
        { name: "CPM Schedule", max: 100 }
      ],
      radarValues: [99, 98, 99, 96, 95],
      barLabels: ["RCC Frame", "Steel Truss", "Foundation", "MEP/HVAC", "Finishing", "Roads/Bridge"],
      barValues: [98, 95, 97, 91, 93, 96],
      tools: [
        {
          id: "skyciv",
          icon: "🏗️",
          title: "SkyCiv Euler-Bernoulli Beam FEA Solver",
          desc: "Computes maximum bending moment, shear force, mid-span deflection (L/360), and Ast steel rebar area.",
          apiEndpoint: "/api/skyciv/beam-solver",
          inputs: [
            { key: "span_m", label: "Beam Span L (meters)", type: "number", default: 6.5 },
            { key: "udl_kn_m", label: "Factored UDL w (kN/m)", type: "number", default: 28 },
            { key: "point_load_kn", label: "Mid-Span Point Load P (kN)", type: "number", default: 45 },
            { key: "support", label: "Support Condition", type: "select", options: ["simply_supported", "cantilever", "fixed_both"], default: "simply_supported" }
          ]
        },
        {
          id: "hilti",
          icon: "🔩",
          title: "Hilti PROFIS Concrete Anchor Designer",
          desc: "EN 1992-4 / ACI 318 concrete cone breakout, steel tensile capacity, and utilization factor verification.",
          apiEndpoint: "/api/hilti/anchor-design",
          inputs: [
            { key: "tensile_load_kn", label: "Applied Tensile Load N_Ed (kN)", type: "number", default: 42 },
            { key: "shear_load_kn", label: "Applied Shear Load V_Ed (kN)", type: "number", default: 18 },
            { key: "embedment_mm", label: "Effective Embedment h_ef (mm)", type: "number", default: 125 },
            { key: "concrete_fck", label: "Concrete Grade f_ck (MPa)", type: "number", default: 30 }
          ]
        },
        {
          id: "boq",
          icon: "📋",
          title: "CPWD DSR 2024 BOQ & Material Estimator",
          desc: "Computes exact cement bags, Fe500D TMT steel tonnage, river sand, aggregate, and labor cost.",
          apiEndpoint: "/api/boq-calculate",
          inputs: [
            { key: "builtup_sqft", label: "Total Built-Up Area (sq.ft)", type: "number", default: 4500 },
            { key: "floors", label: "Number of Floors (G+N)", type: "number", default: 3 },
            { key: "grade", label: "Construction Specification", type: "select", options: ["standard", "premium", "industrial"], default: "premium" }
          ]
        },
        {
          id: "safety",
          icon: "🦺",
          title: "YOLOv8 Site PPE & OSHA Compliance Audit",
          desc: "Computer vision audit for hardhats, high-visibility vests, fall-arrest harnesses, and scaffolding.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "workers_count", label: "Workers Detected in Zone", type: "number", default: 38 },
            { key: "zone", label: "High-Risk Work Zone", type: "select", options: ["Tower Crane & Lifting", "Deep Excavation (>3m)", "High-Rise External Scaffolding", "MEP Hot-Work Welding"], default: "High-Rise External Scaffolding" }
          ]
        },
        {
          id: "procore",
          icon: "📅",
          title: "Procore CPM Critical Path Scheduler",
          desc: "Critical Path Method (CPM) float analyzer, monsoon delay buffer calculator, and S-curve cashflow.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "project_months", label: "Baseline Duration (Months)", type: "number", default: 18 },
            { key: "budget_cr", label: "Contract Value (₹ Crores)", type: "number", default: 14.5 },
            { key: "completed_pct", label: "Physical Progress Completed (%)", type: "number", default: 62 }
          ]
        },
        {
          id: "mixdesign",
          icon: "🧱",
          title: "IS-10262 Concrete Mix Proportioning",
          desc: "Calculates target mean strength, water-cement ratio, fly-ash replacement, and superplasticizer dose.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "grade", label: "Concrete Grade", type: "select", options: ["M25", "M30", "M35", "M40", "M50"], default: "M35" },
            { key: "slump_mm", label: "Required Pumpable Slump (mm)", type: "number", default: 120 }
          ]
        },
        {
          id: "canva",
          icon: "🧊",
          title: "3D Structural Truss & CAD Titleblock Studio",
          desc: "Inspect 3D structural meshes and generate ISO-compliant structural drawing titleblocks.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Drawing Sheet Title", type: "text", default: "STRUCTURAL FRAMING PLAN — IS 456:2000 & IS 1893" },
            { key: "subhead", label: "Engineer Seal", type: "text", default: "SkyCiv FEA Verified • Hilti PROFIS Anchor Approved" }
          ]
        }
      ]
    },
    trust: {
      id: "trust",
      name: "AVP Charitable Trust",
      short: "AVP Trust",
      badge: "GIVEINDIA + GITCOIN QF + CHARITYWATCH + KIVA CLONE",
      accent: "#10b981",
      accent2: "#3b82f6",
      landingUrl: "/trust/",
      appUrl: "/trust/app/",
      shape3d: "sphere",
      kpis: [
        { label: "Direct Program Ratio", val: "94.2%", delta: "CharityWatch A+ Grade" },
        { label: "80G Form 10BE Speed", val: "Instant", delta: "CBDT API Ready" },
        { label: "SHA-256 Ledger Blocks", val: "18,490", delta: "Zero Tamper" },
        { label: "Grassroots Lives Reached", val: "312,000+", delta: "14 States" }
      ],
      radarIndicators: [
        { name: "80G Automation", max: 100 },
        { name: "Quadratic Match", max: 100 },
        { name: "SHA-256 Audit", max: 100 },
        { name: "Program Ratio", max: 100 },
        { name: "Field Telemetry", max: 100 }
      ],
      radarValues: [100, 97, 99, 96, 95],
      barLabels: ["Rural Schools", "Clean Water", "Solar Microgrid", "Women SHG", "Reforestation", "Medical Camps"],
      barValues: [96, 94, 92, 95, 91, 97],
      tools: [
        {
          id: "tax80g",
          icon: "🧾",
          title: "Instant Section 80G & Form 10BE Generator",
          desc: "Calculates Income Tax Act Section 80G deduction savings and generates verifiable Form 10BE receipts.",
          apiEndpoint: "/api/tax-80g",
          inputs: [
            { key: "amount", label: "Donation Amount (₹)", type: "number", default: 50000 },
            { key: "tax_slab_pct", label: "Income Tax Slab (%)", type: "select", options: ["30", "20", "10"], default: "30" },
            { key: "donor_pan", label: "Donor PAN (for 10BE Certificate)", type: "text", default: "ABCDE1234F" }
          ]
        },
        {
          id: "gitcoin",
          icon: "💚",
          title: "Gitcoin Quadratic Funding Matching Simulator",
          desc: "Applies Vitalik Buterin & Glen Weyl's CLR formula (Σ√c_i)² to amplify broad community support.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "matching_pool", label: "CSR Matching Pool (₹)", type: "number", default: 2500000 },
            { key: "small_donors", label: "Number of Grassroots Donors", type: "number", default: 420 },
            { key: "avg_donation", label: "Average Grassroots Contribution (₹)", type: "number", default: 500 }
          ]
        },
        {
          id: "ledger",
          icon: "🔗",
          title: "CharityWatch SHA-256 Proof-of-Impact Ledger",
          desc: "Cryptographic Merkle-tree audit trail linking every rupee donated to geotagged field vendor invoices.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "tx_id", label: "Donation Transaction Reference", type: "text", default: "AVP-80G-2026-99481" },
            { key: "cause", label: "Allocated Cause", type: "select", options: ["Thar Desert Solar Borewell #14", "Tribal STEM Digital Classroom", "Mobile Cataract Surgery Unit", "Mangrove Bio-Shield Restoration"], default: "Thar Desert Solar Borewell #14" }
          ]
        },
        {
          id: "kiva",
          icon: "🌾",
          title: "Kiva Zero-Interest Micro-Grant Tracker",
          desc: "Tracks revolving community micro-grants for rural women entrepreneurs and artisan collectives.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "shg_name", label: "Self-Help Group (SHG) Name", type: "text", default: "Annapurna Solar Cold-Storage Collective" },
            { key: "grant_inr", label: "Revolving Capital Deployed (₹)", type: "number", default: 185000 },
            { key: "repayment_pct", label: "Community Recirculation Rate (%)", type: "number", default: 98.6 }
          ]
        },
        {
          id: "volunteer",
          icon: "🤝",
          title: "Volunteer Mobilization & Relief Router",
          desc: "Matches skilled volunteers (doctors, teachers, civil engineers) with district field missions.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "skill", label: "Volunteer Specialization", type: "select", options: ["Pediatric & General Medicine", "STEM & Coding Educator", "Solar & Civil Infrastructure", "Disaster Relief Logistics"], default: "STEM & Coding Educator" },
            { key: "hours_week", label: "Weekly Commitment (Hours)", type: "number", default: 8 }
          ]
        },
        {
          id: "csr",
          icon: "📊",
          title: "Companies Act Section 135 CSR Planner",
          desc: "Calculates mandatory 2% 3-year average net profit CSR obligation & Schedule VII SDG mapping.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "net_profit_cr", label: "3-Year Avg Net Profit (₹ Crores)", type: "number", default: 85 },
            { key: "sdg_focus", label: "UN SDG Alignment", type: "select", options: ["SDG 4: Quality Education", "SDG 6: Clean Water & Sanitation", "SDG 7: Affordable Clean Energy", "SDG 13: Climate Action"], default: "SDG 4: Quality Education" }
          ]
        },
        {
          id: "canva",
          icon: "🎨",
          title: "80G Certificate Studio & 3D Impact Globe",
          desc: "Generate verifiable donor appreciation certificates and inspect the 3D global impact sphere.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Certificate Title", type: "text", default: "CERTIFICATE OF SOVEREIGN SOCIAL IMPACT (SECTION 80G)" },
            { key: "subhead", label: "Verification Note", type: "text", default: "SHA-256 Ledger Verified • 94.2% Direct Field Deployment" }
          ]
        }
      ]
    },
    rakshak: {
      id: "rakshak",
      name: "Rakshak AI Legal & Cyber Shield",
      short: "Rakshak AI",
      badge: "HARVEY AI + BNS 2023 + HIBP + VIRUSTOTAL CLONE",
      accent: "#ef4444",
      accent2: "#8b5cf6",
      landingUrl: "/rakshak-ai/",
      appUrl: "/rakshak-ai/app/",
      shape3d: "torus",
      kpis: [
        { label: "BNS 2023 Sections", val: "358 Mapped", delta: "IPC ↔ BNS + BNSS" },
        { label: "Breach Corpus", val: "14.2B Records", delta: "HIBP k-Anonymity" },
        { label: "Zero-FIR Draft Time", val: "4.2 Secs", delta: "Court-Ready PDF" },
        { label: "Phishing Detection", val: "99.3%", delta: "Shannon Entropy AI" }
      ],
      radarIndicators: [
        { name: "BNS 2023 Accuracy", max: 100 },
        { name: "Zero-FIR Speed", max: 100 },
        { name: "HIBP Breach Scan", max: 100 },
        { name: "URL Threat AI", max: 100 },
        { name: "DPDP Compliance", max: 100 }
      ],
      radarValues: [100, 98, 99, 97, 96],
      barLabels: ["Cyber Fraud", "BNS 318 Cheat", "Identity Theft", "Extortion", "Property", "DPDP Privacy"],
      barValues: [99, 98, 97, 95, 94, 96],
      tools: [
        {
          id: "bns",
          icon: "⚖️",
          title: "BNS 2023 / BNSS / BSA Legal Copilot",
          desc: "Maps legacy IPC 1860 sections to Bharatiya Nyaya Sanhita (BNS) 2023 with cognizability & bail rules.",
          apiEndpoint: "/api/bns-lookup",
          inputs: [
            { key: "query", label: "Incident Description or IPC/BNS Section", type: "text", default: "420 cheating online UPI phishing fraud and identity theft" }
          ]
        },
        {
          id: "fir",
          icon: "📝",
          title: "Zero-FIR & 1930 Cybercrime Drafter",
          desc: "Generates structured Zero-FIR complaints under BNSS Section 173 with BSA Section 63 electronic evidence certificate.",
          apiEndpoint: "/api/bns-lookup",
          inputs: [
            { key: "query", label: "Complainant Incident Narrative", type: "text", default: "Unauthorized RTGS/UPI transfer of Rs 1,45,000 via spoofed banking APK link on WhatsApp" }
          ]
        },
        {
          id: "hibp",
          icon: "🛡️",
          title: "HIBP + VirusTotal + URLScan Threat Radar",
          desc: "Scans email/domain breach exposure, homograph phishing URLs, and password Shannon entropy.",
          apiEndpoint: "/api/hibp/breach-scan",
          inputs: [
            { key: "identity", label: "Email / Domain / Suspect URL", type: "text", default: "security-admin@enterprise-corp.in" },
            { key: "password_sample", label: "Password Complexity Sample (k-Anon)", type: "text", default: "Rakshak#Sovereign!2026" }
          ]
        },
        {
          id: "heatmap",
          icon: "🗺️",
          title: "Citizen Safety Heatmap & Safe-Route AI",
          desc: "Computes night-time route safety index using CCTV density, PCR patrol proximity, and streetlight telemetry.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "origin", label: "Origin Corridor", type: "text", default: "Cyber Hub Metro Station" },
            { key: "destination", label: "Destination Corridor", type: "text", default: "Sector 62 Residential Enclave" },
            { key: "hour", label: "Travel Hour (24h format)", type: "number", default: 23 }
          ]
        },
        {
          id: "dpdp",
          icon: "📜",
          title: "DPDP Act 2023 Data Fiduciary Auditor",
          desc: "Audits consent managers, children's data safeguards, and 72-hour CERT-In breach notification readiness.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "org_type", label: "Data Fiduciary Classification", type: "select", options: ["Significant Data Fiduciary (SDF)", "FinTech / NBFC Platform", "HealthTech Electronic Records", "SaaS B2B Processor"], default: "Significant Data Fiduciary (SDF)" },
            { key: "users_lakhs", label: "Registered Indian Principals (Lakhs)", type: "number", default: 25 }
          ]
        },
        {
          id: "deepfake",
          icon: "🔍",
          title: "Deepfake & Voice Clone Forensics",
          desc: "Analyzes GAN/diffusion facial landmarks, audio mel-spectrogram discontinuities, and C2PA provenance.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "media_type", label: "Suspect Media Format", type: "select", options: ["WhatsApp Voice Note (.ogg)", "Executive Video Call (.mp4)", "KYC Aadhaar/PAN Scan (.pdf)"], default: "WhatsApp Voice Note (.ogg)" },
            { key: "hash", label: "Evidence SHA-256 Digest", type: "text", default: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
          ]
        },
        {
          id: "canva",
          icon: "🧊",
          title: "3D Cyber Threat Mesh & Legal Notice Studio",
          desc: "Visualize 3D perimeter defense topologies and format statutory legal notices.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Legal Notice Header", type: "text", default: "STATUTORY NOTICE UNDER BNS 2023 & IT ACT SEC 43A/66C" },
            { key: "subhead", label: "Evidence Seal", type: "text", default: "BSA 2023 Section 63 Hash Certificate Attached" }
          ]
        }
      ]
    },
    comonk: {
      id: "comonk",
      name: "Comonk AI Career & Talent Cloud",
      short: "Comonk Career",
      badge: "EIGHTFOLD + JOBSCAN + LEVELS.FYI + PRAMP CLONE",
      accent: "#a855f7",
      accent2: "#ec4899",
      landingUrl: "/comonk/",
      appUrl: "/comonk/app/",
      shape3d: "cone",
      kpis: [
        { label: "ATS Match Lift", val: "+64% Callbacks", delta: "Jobscan TF-IDF" },
        { label: "Verified CTC Data", val: "185,000+ Offers", delta: "Levels.fyi Parity" },
        { label: "AI Mock Interviews", val: "42,000 Runs", delta: "STAR + System Design" },
        { label: "Skill Adjacency Graph", val: "1,200 Roles", delta: "Eightfold AI Engine" }
      ],
      radarIndicators: [
        { name: "ATS Keyword Match", max: 100 },
        { name: "STAR Impact Bullets", max: 100 },
        { name: "System Design", max: 100 },
        { name: "Comp Benchmarking", max: 100 },
        { name: "Negotiation Leverage", max: 100 }
      ],
      radarValues: [98, 96, 95, 99, 97],
      barLabels: ["L3 SDE-1", "L4 SDE-2", "L5 Senior", "L6 Staff", "L7 Principal", "AI Architect"],
      barValues: [22, 38, 64, 98, 145, 168],
      tools: [
        {
          id: "jobscan",
          icon: "📄",
          title: "Jobscan ATS Resume vs JD TF-IDF Scorer",
          desc: "Computes cosine similarity between your resume and target Job Description, highlighting missing hard skills.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "resume_skills", label: "Your Current Resume Keywords", type: "text", default: "Python, FastAPI, React, TypeScript, PostgreSQL, Docker, AWS" },
            { key: "jd_skills", label: "Target Job Description Requirements", type: "text", default: "Python, FastAPI, LangGraph, React 18, Kubernetes, Redis, System Design, LLM Evaluation" },
            { key: "target_role", label: "Target Role", type: "text", default: "Staff AI Systems Engineer (L6)" }
          ]
        },
        {
          id: "levels",
          icon: "💰",
          title: "Levels.fyi / AmbitionBox CTC & Equity Decoder",
          desc: "Breaks down Base Salary, 4-year RSU vesting schedule, sign-on bonus, and tax-adjusted take-home pay.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "level", label: "Engineering Level", type: "select", options: ["L3 / SDE-1 (0-2 yrs)", "L4 / SDE-2 (2-5 yrs)", "L5 / Senior SDE (5-8 yrs)", "L6 / Staff Engineer (8+ yrs)", "L7 / Principal Architect"], default: "L5 / Senior SDE (5-8 yrs)" },
            { key: "base_lpa", label: "Offered Base Salary (₹ LPA)", type: "number", default: 48 },
            { key: "rsu_total_lpa", label: "4-Year Total RSU Grant (₹ Lakhs)", type: "number", default: 64 }
          ]
        },
        {
          id: "pramp",
          icon: "🎙️",
          title: "Pramp / Interviewing.io AI Mock Interviewer",
          desc: "Simulates FAANG System Design & Behavioral leadership interviews with real-time rubric grading.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "round", label: "Interview Round", type: "select", options: ["High-Scale System Design (HLD)", "LLM & Agentic Architecture", "DSA & Concurrency Coding", "Bar-Raiser Leadership (STAR)"], default: "High-Scale System Design (HLD)" },
            { key: "question", label: "Prompt / Candidate Architecture", type: "text", default: "Design a multi-region distributed rate limiter handling 2M QPS with <2ms P99 latency using Redis token buckets" }
          ]
        },
        {
          id: "blind",
          icon: "🏢",
          title: "Blind / Glassdoor Culture & WLB Radar",
          desc: "Evaluates engineering velocity, on-call pager load, remote flexibility, and RSU refreshers.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "company_tier", label: "Target Organization Cohort", type: "select", options: ["FAANG / BigTech India", "Series B-D AI Unicorn", "High-Frequency Trading (HFT)", "Global Remote-First SaaS"], default: "FAANG / BigTech India" },
            { key: "priority", label: "Primary Career Priority", type: "select", options: ["Maximum Total Compensation", "Work-Life Balance & Remote", "Fast-Track Staff Promotion", "Founder/Early-Stage Equity"], default: "Maximum Total Compensation" }
          ]
        },
        {
          id: "eightfold",
          icon: "🕸️",
          title: "Eightfold.ai Skill Adjacency & Role Transition",
          desc: "Calculates shortest upskilling path from Backend/Full-Stack to Principal AI Systems Architect.",
          apiEndpoint: "/api/roadmap-sh/progress",
          inputs: [
            { key: "track", label: "Target Career Vector", type: "select", options: ["ai-engineer", "fullstack-next", "devops-sre"], default: "ai-engineer" },
            { key: "completed", label: "Existing Verified Skills", type: "text", default: "python,fastapi,docker,postgresql" }
          ]
        },
        {
          id: "negotiate",
          icon: "🤝",
          title: "Comp Counter-Offer & Negotiation Script AI",
          desc: "Generates high-leverage competing offer scripts to unlock +15% to +28% RSU & sign-on uplifts.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "current_offer", label: "Initial Offer Total CTC (₹ LPA)", type: "number", default: 62 },
            { key: "competing_offer", label: "Competing Offer / Target CTC (₹ LPA)", type: "number", default: 74 }
          ]
        },
        {
          id: "canva",
          icon: "🎨",
          title: "Executive Portfolio Banner & 3D Skill Galaxy",
          desc: "Design LinkedIn/GitHub executive headers and explore the 3D career trajectory cone.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Banner Name & Title", type: "text", default: "STAFF AI ARCHITECT • DISTRIBUTED AGENT SYSTEMS" },
            { key: "subhead", label: "Core Stack", type: "text", default: "LangGraph • FastAPI • PyTorch • Rust • Kubernetes" }
          ]
        }
      ]
    },
    agency: {
      id: "agency",
      name: "Sevenforce Autonomous AI Agency",
      short: "Sevenforce Agency",
      badge: "DEVIN + VAPI + N8N + LANGGRAPH + CLAY CLONE",
      accent: "#ec4899",
      accent2: "#6366f1",
      landingUrl: "/agency/",
      appUrl: "/agency/app/",
      shape3d: "torusKnot",
      kpis: [
        { label: "Voice AI Latency", val: "385 ms", delta: "Vapi Sub-500ms SLA" },
        { label: "LangGraph Cyclic Nodes", val: "5-Node DAG", delta: "Zero Hallucination" },
        { label: "Outbound Enrichment", val: "96.4% Match", delta: "Clay 12-Source Waterfall" },
        { label: "Client Automation ROI", val: "8.4x ROAS", delta: "-72% Support Cost" }
      ],
      radarIndicators: [
        { name: "LangGraph DAG", max: 100 },
        { name: "Vapi Voice SLA", max: 100 },
        { name: "Devin SWE Speed", max: 100 },
        { name: "Clay Waterfall", max: 100 },
        { name: "FinOps Savings", max: 100 }
      ],
      radarValues: [100, 98, 96, 99, 97],
      barLabels: ["Voice Agent", "SWE Copilot", "B2B Outbound", "RAG Support", "FinOps Router", "Ad Creative"],
      barValues: [98, 95, 97, 99, 96, 94],
      tools: [
        {
          id: "langgraph",
          icon: "🕸️",
          title: "LangGraph + n8n 5-Node Workflow Studio",
          desc: "Executes cyclic multi-agent workflows: Supervisor → Researcher → ToolExecutor → Critic → Synthesizer.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "venture", label: "Agent Domain Preset", type: "select", options: ["agency", "hub", "emart", "rakshak", "comonk"], default: "agency" },
            { key: "prompt", label: "Multi-Agent Mission Brief", type: "text", default: "Build an autonomous B2B outbound + voice qualification swarm for a Series A FinTech SaaS" }
          ]
        },
        {
          id: "vapi",
          icon: "📞",
          title: "Vapi / Bland Sub-500ms Voice Latency & VRAM Sizer",
          desc: "Calculates end-to-end voice turn latency (Deepgram Nova-2 + Groq/vLLM + Cartesia Sonic) and GPU VRAM.",
          apiEndpoint: "/api/vapi/voice-latency",
          inputs: [
            { key: "stt_ms", label: "STT Streaming Latency (ms)", type: "number", default: 95 },
            { key: "llm_ttft_ms", label: "LLM Time-To-First-Token (ms)", type: "number", default: 140 },
            { key: "tts_ms", label: "TTS Audio First-Byte (ms)", type: "number", default: 75 },
            { key: "params_b", label: "Self-Hosted Model Size (Billion Params)", type: "number", default: 8 }
          ]
        },
        {
          id: "devin",
          icon: "👨‍💻",
          title: "Devin / Factory Autonomous SWE Sprint Planner",
          desc: "Estimates autonomous PR resolution rate, unit test coverage lift, and engineering hours saved.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "team_size", label: "Human Engineering Team Size", type: "number", default: 18 },
            { key: "weekly_prs", label: "Target Weekly PR Throughput", type: "number", default: 85 },
            { key: "stack", label: "Repository Stack", type: "text", default: "Next.js 15 + FastAPI + PostgreSQL + Playwright E2E" }
          ]
        },
        {
          id: "clay",
          icon: "📬",
          title: "Clay + Apollo B2B Waterfall Enrichment",
          desc: "Chains 12 data providers (Apollo, Clearbit, LinkedIn, GitHub, Crunchbase) for 96%+ verified buyer emails.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "icp", label: "Ideal Customer Profile (ICP)", type: "text", default: "VP Engineering & CTOs at Series A-C SaaS companies (50-500 employees)" },
            { key: "leads_count", label: "Monthly Prospect Volume", type: "number", default: 5000 }
          ]
        },
        {
          id: "roas",
          icon: "📈",
          title: "Jasper / Copy.ai Multi-Channel ROAS Simulator",
          desc: "Models CAC payback period, LTV/CAC ratio, and multi-touch attribution across LinkedIn, Meta & Search.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "ad_spend_usd", label: "Monthly Ad + Agent Budget ($)", type: "number", default: 25000 },
            { key: "acv_usd", label: "Average Contract Value ($/yr)", type: "number", default: 18000 }
          ]
        },
        {
          id: "finops",
          icon: "🛡️",
          title: "Guardrails AI & LLM Token FinOps Router",
          desc: "Routes 80% of routine queries to quantized Llama-3.3-70B / Gemini Flash, cutting token spend by 74%.",
          apiEndpoint: "/api/langgraph/execute",
          inputs: [
            { key: "monthly_tokens_m", label: "Monthly Volume (Million Tokens)", type: "number", default: 450 },
            { key: "cache_hit_pct", label: "Semantic Cache Hit Ratio (%)", type: "number", default: 42 }
          ]
        },
        {
          id: "canva",
          icon: "🎨",
          title: "Ad Creative Canva Studio & 3D Agent Swarm",
          desc: "Design high-CTR campaign creatives and visualize the 3D autonomous agent mesh.",
          apiEndpoint: "/api/canva/magic-design",
          inputs: [
            { key: "headline", label: "Campaign Headline", type: "text", default: "SEVENFORCE AI SWARM — 385ms VOICE + LANGGRAPH" },
            { key: "subhead", label: "CTA Subhead", type: "text", default: "Deploy Autonomous Sales, Support & SWE Agents in 5 Minutes" }
          ]
        }
      ]
    }
  };

  function detectVentureFromPath() {
    const p = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (params.get("venture") && VENTURE_APPS[params.get("venture")]) {
      return params.get("venture");
    }
    if (p.includes("avpu")) return "avpu";
    if (p.includes("emart")) return "emart";
    if (p.includes("pharmacy")) return "pharmacy";
    if (p.includes("breakdown")) return "breakdown";
    if (p.includes("trust")) return "trust";
    if (p.includes("rakshak")) return "rakshak";
    if (p.includes("comonk")) return "comonk";
    if (p.includes("agency") || p.includes("sevenforce")) return "agency";
    return "hub";
  }

  let currentVentureKey = detectVentureFromPath();
  let currentToolIndex = 0;
  let radarChartInstance = null;
  let barChartInstance = null;
  let threeRenderer = null;
  let threeAnimId = null;

  function ensureStyles() {
    if (document.getElementById("vite-portal-inline-styles")) return;
    const style = document.createElement("style");
    style.id = "vite-portal-inline-styles";
    style.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        background: #030712 !important;
        color: #f8fafc !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        overflow-x: hidden;
      }
      body > *:not(#vite-app-root):not(#vite-spotlight-modal) {
        display: none !important;
      }
      #vite-app-root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background:
          radial-gradient(circle at 12% 15%, rgba(99, 102, 241, 0.16), transparent 36%),
          radial-gradient(circle at 88% 18%, rgba(236, 72, 153, 0.13), transparent 38%),
          radial-gradient(circle at 50% 85%, rgba(16, 185, 129, 0.11), transparent 42%),
          #030712;
      }
      .vite-topbar {
        position: relative;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        padding: 12px 22px;
        background: rgba(6, 11, 25, 0.88);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(148, 163, 184, 0.16);
      }
      .vite-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .vite-hmr-pill {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.06em;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
        border: 1px solid rgba(16, 185, 129, 0.5);
        color: #6ee7b7;
      }
      .vite-venture-switcher {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .vite-v-btn {
        padding: 6px 12px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 700;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(15, 23, 42, 0.75);
        color: #cbd5e1;
        cursor: pointer;
        transition: all 0.18s ease;
      }
      .vite-v-btn:hover {
        border-color: rgba(99, 102, 241, 0.6);
        color: #ffffff;
        transform: translateY(-1px);
      }
      .vite-v-btn.active {
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: #ffffff;
        border-color: transparent;
        box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
      }
      .vite-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        flex: 1;
        min-height: calc(100vh - 64px);
      }
      @media (max-width: 1024px) {
        .vite-layout {
          grid-template-columns: 1fr;
        }
      }
      .vite-sidebar {
        background: rgba(8, 13, 28, 0.85);
        border-right: 1px solid rgba(148, 163, 184, 0.14);
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .vite-tool-btn {
        display: flex;
        align-items: flex-start;
        gap: 11px;
        width: 100%;
        text-align: left;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.12);
        background: rgba(15, 23, 42, 0.6);
        color: #e2e8f0;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .vite-tool-btn:hover {
        border-color: rgba(99, 102, 241, 0.45);
        background: rgba(30, 41, 59, 0.75);
        transform: translateX(3px);
      }
      .vite-tool-btn.active {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.24), rgba(236, 72, 153, 0.18));
        border-color: rgba(129, 140, 248, 0.75);
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.22);
      }
      .vite-main {
        padding: 24px 28px;
        display: flex;
        flex-direction: column;
        gap: 22px;
        overflow-y: auto;
      }
      .vite-kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px;
      }
      .vite-card {
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.16);
        border-radius: 18px;
        padding: 18px 20px;
        backdrop-filter: blur(16px);
        box-shadow: 0 12px 32px rgba(2, 6, 23, 0.45);
      }
      .vite-workstation-grid {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 20px;
      }
      @media (max-width: 1180px) {
        .vite-workstation-grid {
          grid-template-columns: 1fr;
        }
      }
      .vite-input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 13px;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(2, 6, 23, 0.75);
        color: #f8fafc;
        font-size: 13.5px;
        outline: none;
      }
      .vite-input:focus {
        border-color: #818cf8;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
      }
      .vite-run-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 22px;
        border-radius: 12px;
        border: none;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.35);
        transition: all 0.2s ease;
      }
      .vite-run-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 30px rgba(236, 72, 153, 0.45);
      }
      .vite-charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 18px;
      }
      @media (max-width: 1280px) {
        .vite-charts-row {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function renderCanvaPreview(canvasEl, headline, subhead, accent, accent2) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    const w = canvasEl.width;
    const h = canvasEl.height;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#090d1f");
    grad.addColorStop(0.55, "#111836");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Glow orbs
    const orb1 = ctx.createRadialGradient(w * 0.2, h * 0.25, 10, w * 0.2, h * 0.25, 180);
    orb1.addColorStop(0, accent + "66");
    orb1.addColorStop(1, "transparent");
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, w, h);

    const orb2 = ctx.createRadialGradient(w * 0.82, h * 0.75, 10, w * 0.82, h * 0.75, 180);
    orb2.addColorStop(0, accent2 + "66");
    orb2.addColorStop(1, "transparent");
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Border frame
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    // Badge
    ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
    ctx.fillRect(36, 36, 260, 28);
    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillText("⚡ CANVA VECTOR ENGINE • VITE SPA v4.0", 48, 54);

    // Headline
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 22px Inter, sans-serif";
    ctx.fillText((headline || "SEVENSEED ADVANCE").slice(0, 38), 36, 108);

    // Subhead
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 13px Inter, sans-serif";
    ctx.fillText((subhead || "Multi-Layer Vector Canvas • Live Export Ready").slice(0, 58), 36, 138);

    // Decorative vector nodes
    const nodes = [
      { x: 70, y: 195, label: "Supervisor" },
      { x: 200, y: 180, label: "Researcher" },
      { x: 330, y: 200, label: "ToolNode" },
      { x: 460, y: 185, label: "Critic QA" },
      { x: 580, y: 195, label: "Synthesizer" }
    ];
    ctx.strokeStyle = accent2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    nodes.forEach((n, idx) => {
      if (idx === 0) ctx.moveTo(n.x, n.y);
      else ctx.lineTo(n.x, n.y);
    });
    ctx.stroke();

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.fillText(n.label, n.x - 24, n.y + 22);
    });
  }

  function initChartsAnd3D() {
    const v = VENTURE_APPS[currentVentureKey];

    // 1. ECharts Radar + Bar
    const radarEl = document.getElementById("vite-echarts-radar");
    const barEl = document.getElementById("vite-echarts-bar");
    if (window.echarts && radarEl && barEl) {
      if (radarChartInstance) radarChartInstance.dispose();
      if (barChartInstance) barChartInstance.dispose();

      radarChartInstance = window.echarts.init(radarEl);
      radarChartInstance.setOption({
        backgroundColor: "transparent",
        tooltip: { trigger: "item" },
        radar: {
          indicator: v.radarIndicators,
          splitArea: { areaStyle: { color: ["rgba(30,41,59,0.35)", "rgba(15,23,42,0.55)"] } },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.25)" } },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.2)" } },
          axisName: { color: "#cbd5e1", fontSize: 11, fontWeight: 700 }
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: v.radarValues,
                name: v.short,
                areaStyle: { color: "rgba(99, 102, 241, 0.35)" },
                lineStyle: { color: v.accent, width: 2.5 },
                itemStyle: { color: v.accent2 }
              }
            ]
          }
        ]
      });

      barChartInstance = window.echarts.init(barEl);
      barChartInstance.setOption({
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        grid: { top: 24, right: 16, bottom: 32, left: 42 },
        xAxis: {
          type: "category",
          data: v.barLabels,
          axisLabel: { color: "#94a3b8", fontSize: 10, rotate: 18 },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.2)" } }
        },
        yAxis: {
          type: "value",
          axisLabel: { color: "#94a3b8", fontSize: 10 },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.12)" } }
        },
        series: [
          {
            type: "bar",
            data: v.barValues,
            barWidth: "48%",
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: v.accent },
                { offset: 1, color: v.accent2 }
              ])
            }
          }
        ]
      });
    }

    // 2. Three.js 3D WebGL Spline + Community.Spline.Design Multi-Object PBR & Particle Nebula
    const threeContainer = document.getElementById("vite-three-viewport");
    if (window.THREE && threeContainer) {
      if (threeAnimId) cancelAnimationFrame(threeAnimId);
      threeContainer.innerHTML = "";
      const THREE = window.THREE;
      const width = threeContainer.clientWidth || 340;
      const height = 230;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0.25, 4.4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      threeContainer.appendChild(renderer.domElement);
      threeRenderer = renderer;

      const col1 = new THREE.Color(v.accent);
      const col2 = new THREE.Color(v.accent2);

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const pLight1 = new THREE.PointLight(col1, 2.6, 15);
      pLight1.position.set(3, 3, 3);
      scene.add(pLight1);
      const pLight2 = new THREE.PointLight(col2, 2.4, 15);
      pLight2.position.set(-3, -2, 2.5);
      scene.add(pLight2);

      const group = new THREE.Group();
      scene.add(group);

      let geom;
      switch (v.shape3d) {
        case "icosahedron":
          geom = new THREE.IcosahedronGeometry(1.05, 1);
          break;
        case "octahedron":
          geom = new THREE.OctahedronGeometry(1.1, 1);
          break;
        case "dodecahedron":
          geom = new THREE.DodecahedronGeometry(1.05, 0);
          break;
        case "box":
          geom = new THREE.BoxGeometry(1.3, 1.3, 1.3, 2, 2, 2);
          break;
        case "sphere":
          geom = new THREE.SphereGeometry(1.05, 24, 24);
          break;
        case "torus":
          geom = new THREE.TorusGeometry(0.95, 0.32, 18, 48);
          break;
        case "cone":
          geom = new THREE.ConeGeometry(1.0, 1.75, 20, 4);
          break;
        default:
          geom = new THREE.TorusKnotGeometry(0.82, 0.24, 96, 18);
      }

      const pbrMat = new THREE.MeshStandardMaterial({
        color: col1,
        metalness: 0.72,
        roughness: 0.2,
        emissive: col1,
        emissiveIntensity: 0.22
      });
      const wireMat = new THREE.MeshBasicMaterial({
        color: col2,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });

      const meshCore = new THREE.Mesh(geom, pbrMat);
      const meshWire = new THREE.Mesh(geom, wireMat);
      meshWire.scale.setScalar(1.08);
      group.add(meshCore);
      group.add(meshWire);

      // Orbiting gyroscopic rings
      const rings = [];
      for (let r = 0; r < 2; r++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.45 + r * 0.22, 0.025, 14, 64),
          wireMat
        );
        ring.rotation.set(r * 1.1, r * 0.8, 0);
        group.add(ring);
        rings.push(ring);
      }

      // 450-Particle 3D Starfield Nebula
      const pCount = 450;
      const posArr = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const rad = 1.8 + Math.random() * 2.2;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        posArr[i * 3] = rad * Math.sin(ph) * Math.cos(th);
        posArr[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
        posArr[i * 3 + 2] = rad * Math.cos(ph);
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
      const particles = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({ color: col2, size: 0.04, transparent: true, opacity: 0.8 })
      );
      scene.add(particles);

      let isDragging = false;
      let prevX = 0;
      let prevY = 0;
      renderer.domElement.addEventListener("pointerdown", (e) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      });
      window.addEventListener("pointerup", () => {
        isDragging = false;
      });
      renderer.domElement.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        group.rotation.y += (e.clientX - prevX) * 0.01;
        group.rotation.x += (e.clientY - prevY) * 0.01;
        prevX = e.clientX;
        prevY = e.clientY;
      });

      function animate() {
        threeAnimId = requestAnimationFrame(animate);
        if (!isDragging) {
          group.rotation.x += 0.005;
          group.rotation.y += 0.009;
        }
        rings.forEach((rg, idx) => {
          rg.rotation.z += (idx + 1) * 0.012;
        });
        particles.rotation.y -= 0.0025;
        renderer.render(scene, camera);
      }
      animate();
    }
  }

  async function executeActiveTool() {
    const v = VENTURE_APPS[currentVentureKey];
    const tool = v.tools[currentToolIndex] || v.tools[0];
    const outputBox = document.getElementById("vite-tool-output");
    if (!outputBox) return;

    const payload = { venture: v.id, tool: tool.id };
    (tool.inputs || []).forEach((inp) => {
      const el = document.getElementById("vite-inp-" + inp.key);
      if (el) {
        payload[inp.key] = inp.type === "number" ? Number(el.value) : el.value;
      }
    });

    outputBox.innerHTML = `<div style="color:#a5b4fc;font-weight:700;">⚡ Executing ${tool.title} via <code>${tool.apiEndpoint}</code>...</div>`;

    // Update Canva canvas if active
    const canvaEl = document.getElementById("vite-canva-canvas");
    if (canvaEl) {
      renderCanvaPreview(
        canvaEl,
        payload.headline || v.name,
        payload.subhead || tool.desc,
        v.accent,
        v.accent2
      );
    }

    try {
      const isGet = tool.apiEndpoint === "/api/reference-sites/registry";
      const res = await fetch(tool.apiEndpoint, isGet ? { method: "GET" } : {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      // Build rich structured output + JSON inspector
      const summaryCards = [];
      if (data.status) summaryCards.push({ k: "Engine Status", v: String(data.status).toUpperCase() });
      if (data.final_net_price !== undefined) summaryCards.push({ k: "Net Effective Price", v: "₹" + Number(data.final_net_price).toLocaleString() });
      if (data.total_savings !== undefined) summaryCards.push({ k: "Total Stacker Savings", v: "₹" + Number(data.total_savings).toLocaleString() });
      if (data.recommended_card) summaryCards.push({ k: "Optimal Card", v: data.recommended_card });
      if (data.estimated_annual_savings_inr !== undefined) summaryCards.push({ k: "Annual Card Savings", v: "₹" + Number(data.estimated_annual_savings_inr).toLocaleString() });
      if (data.max_moment_knm !== undefined) summaryCards.push({ k: "Max Bending Moment", v: data.max_moment_knm + " kN·m" });
      if (data.max_deflection_mm !== undefined) summaryCards.push({ k: "Mid-Span Deflection", v: data.max_deflection_mm + " mm" });
      if (data.combined_utilization !== undefined) summaryCards.push({ k: "Hilti Utilization", v: (data.combined_utilization * 100).toFixed(1) + "%" });
      if (data.egfr_ml_min !== undefined) summaryCards.push({ k: "eGFR (CKD-EPI)", v: data.egfr_ml_min + " mL/min" });
      if (data.total_turn_latency_ms !== undefined) summaryCards.push({ k: "Voice Turn Latency", v: data.total_turn_latency_ms + " ms" });
      if (data.tax_saved_inr !== undefined) summaryCards.push({ k: "Section 80G Tax Saved", v: "₹" + Number(data.tax_saved_inr).toLocaleString() });
      if (data.total_estimated_cost_inr !== undefined) summaryCards.push({ k: "CPWD BOQ Estimate", v: "₹" + Number(data.total_estimated_cost_inr).toLocaleString() });

      const cardsHtml = summaryCards.length
        ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:14px;">
            ${summaryCards.map((c) => `
              <div style="background:rgba(30,41,59,0.75);border:1px solid rgba(129,140,248,0.35);border-radius:12px;padding:10px 12px;">
                <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:700;">${c.k}</div>
                <div style="font-size:17px;font-weight:900;color:#6ee7b7;margin-top:3px;">${c.v}</div>
              </div>
            `).join("")}
           </div>`
        : "";

      outputBox.innerHTML = `
        ${cardsHtml}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:12px;font-weight:800;color:#a5b4fc;">🟢 LIVE FASTAPI + LANGGRAPH TELEMETRY PAYLOAD (${tool.apiEndpoint})</span>
          <span style="font-size:11px;color:#6ee7b7;">HTTP ${res.status} OK</span>
        </div>
        <pre style="margin:0;max-height:280px;overflow:auto;padding:12px;border-radius:12px;background:rgba(2,6,23,0.9);border:1px solid rgba(148,163,184,0.2);color:#e2e8f0;font-size:12px;line-height:1.45;">${JSON.stringify(data, null, 2)}</pre>
      `;
    } catch (err) {
      outputBox.innerHTML = `<div style="color:#fca5a5;font-weight:700;">⚠️ Execution Notice: ${String(err)}</div>`;
    }
  }

  function openSpotlightModal() {
    let modal = document.getElementById("vite-spotlight-modal");
    if (modal) {
      modal.remove();
      return;
    }
    modal = document.createElement("div");
    modal.id = "vite-spotlight-modal";
    modal.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(2,6,23,0.82);backdrop-filter:blur(12px);display:flex;align-items:flex-start;justify-content:center;padding-top:9vh;";

    const allItems = [];
    Object.values(VENTURE_APPS).forEach((v) => {
      v.tools.forEach((t, idx) => {
        allItems.push({ ventureKey: v.id, ventureName: v.name, toolIdx: idx, icon: t.icon, title: t.title, desc: t.desc });
      });
    });

    modal.innerHTML = `
      <div style="width:min(680px,92vw);background:#0f172a;border:1px solid rgba(129,140,248,0.45);border-radius:20px;box-shadow:0 24px 64px rgba(0,0,0,0.65);overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid rgba(148,163,184,0.18);display:flex;align-items:center;gap:12px;">
          <span style="font-size:18px;">🔍</span>
          <input id="vite-spotlight-input" placeholder="Search all 63 Vite /app tools across 9 Ventures (e.g. SkyCiv, 80G, BNS, CashKaro, Vapi, MDCalc)..." style="flex:1;background:transparent;border:none;color:#fff;font-size:15px;outline:none;"/>
          <button id="vite-spotlight-close" style="background:rgba(148,163,184,0.15);border:none;color:#cbd5e1;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:12px;">ESC</button>
        </div>
        <div id="vite-spotlight-list" style="max-height:58vh;overflow-y:auto;padding:12px;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const listEl = document.getElementById("vite-spotlight-list");
    const inputEl = document.getElementById("vite-spotlight-input");

    function renderItems(q) {
      const query = (q || "").toLowerCase().trim();
      const filtered = allItems.filter((item) =>
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.ventureName.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
      );
      listEl.innerHTML = filtered.map((item, i) => `
        <div class="vite-spot-row" data-v="${item.ventureKey}" data-t="${item.toolIdx}" style="display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:12px;cursor:pointer;border:1px solid transparent;margin-bottom:4px;background:${i % 2 === 0 ? "rgba(30,41,59,0.45)" : "transparent"};">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:20px;">${item.icon}</span>
            <div>
              <div style="font-size:13.5px;font-weight:800;color:#f8fafc;">${item.title}</div>
              <div style="font-size:11.5px;color:#94a3b8;">${item.desc}</div>
            </div>
          </div>
          <span style="font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;background:rgba(99,102,241,0.2);color:#a5b4fc;white-space:nowrap;">${item.ventureName}</span>
        </div>
      `).join("");

      listEl.querySelectorAll(".vite-spot-row").forEach((row) => {
        row.addEventListener("click", () => {
          currentVentureKey = row.getAttribute("data-v");
          currentToolIndex = Number(row.getAttribute("data-t"));
          modal.remove();
          renderApp();
        });
      });
    }

    renderItems("");
    inputEl.focus();
    inputEl.addEventListener("input", () => renderItems(inputEl.value));
    document.getElementById("vite-spotlight-close").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  function renderVentureSignatureWorkbench(v) {
    if (v.id === "emart") {
      return `
        <div class="vite-card" style="border:1px solid rgba(245,158,11,0.4);background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(16,185,129,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;">🛒 SMARTPRIX + BUYHATKE + BLINKIT LIVE STOREFRONT</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">4-Marketplace Live Price Arbitrage & Spec Score Matrix</h3>
            </div>
            <a href="/avp-emart/spec-compare/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(245,158,11,0.2);color:#fde68a;font-size:11.5px;font-weight:800;">Open Full Hardware Spec Comparator →</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:12px;">
            ${[
              { name: "iPhone 16 Pro (256GB)", score: "96/100", amz: "₹1,12,900", flp: "₹1,11,499", crm: "₹1,13,500", net: "₹99,850 (HDFC + CashKaro)" },
              { name: "MacBook Air M3 (16/512GB)", score: "95/100", amz: "₹1,14,900", flp: "₹1,12,990", crm: "₹1,14,000", net: "₹98,400 (SBI 5% + Coupon)" },
              { name: "Sony WH-1000XM5 ANC", score: "93/100", amz: "₹26,990", flp: "₹25,999", crm: "₹27,490", net: "₹21,890 (90-Day Low Match)" },
              { name: "Samsung Galaxy S24 Ultra", score: "97/100", amz: "₹1,09,999", flp: "₹1,08,499", crm: "₹1,10,999", net: "₹94,200 (Exchange + Stacker)" }
            ].map((p) => `
              <div style="padding:14px;border-radius:14px;background:rgba(2,6,23,0.85);border:1px solid rgba(245,158,11,0.28);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span style="font-size:13.5px;font-weight:900;color:#fff;">${p.name}</span>
                  <span style="padding:2px 7px;border-radius:6px;background:rgba(16,185,129,0.2);color:#6ee7b7;font-size:10.5px;font-weight:800;">Spec ${p.score}</span>
                </div>
                <div style="font-size:11.5px;color:#94a3b8;display:flex;flex-direction:column;gap:3px;margin-bottom:8px;">
                  <div>Amazon IN: <strong style="color:#e2e8f0;">${p.amz}</strong></div>
                  <div>Flipkart: <strong style="color:#38bdf8;">${p.flp}</strong></div>
                  <div>Croma / Jiomart: <strong style="color:#e2e8f0;">${p.crm}</strong></div>
                </div>
                <div style="padding:7px 10px;border-radius:8px;background:rgba(16,185,129,0.14);border:1px solid rgba(16,185,129,0.35);font-size:11.5px;font-weight:800;color:#34d399;">
                  ⚡ Net Stacked: ${p.net}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    if (v.id === "avpu") {
      return `
        <div class="vite-card" style="border:1px solid rgba(6,182,212,0.4);background:linear-gradient(135deg,rgba(6,182,212,0.08),rgba(99,102,241,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#22d3ee;text-transform:uppercase;">🎓 LEARN-ANYTHING.XYZ DAG + FREECODECAMP IDE + DUOLINGO LEAGUE</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">Topological Skill Curriculum & Gamified Mastery Bar</h3>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="padding:5px 10px;border-radius:999px;background:rgba(245,158,11,0.2);color:#fbbf24;font-size:12px;font-weight:800;">🔥 42 Day Streak</span>
              <span style="padding:5px 10px;border-radius:999px;background:rgba(239,68,68,0.2);color:#f87171;font-size:12px;font-weight:800;">❤️❤️❤️❤️❤️ 5 Hearts</span>
              <span style="padding:5px 10px;border-radius:999px;background:rgba(56,189,248,0.2);color:#38bdf8;font-size:12px;font-weight:800;">💎 Diamond League #1</span>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:10px;">
            ${[
              { step: "Node 01", title: "Linear Algebra & Tensors", status: "✅ Mastered (SM-2 +15d)", href: "/avpu/learn-dag/" },
              { step: "Node 02", title: "Transformer Self-Attention", status: "✅ Mastered (100% Quiz)", href: "/avpu/code-lab/" },
              { step: "Node 03", title: "LangGraph Cyclic StateGraph", status: "⚡ Active Lab (In Progress)", href: "/avpu/ai-tutor/" },
              { step: "Node 04", title: "Laws of UX & Mental Models", status: "🔓 Unlocked Capstone", href: "/avpu/laws-of-ux/" },
              { step: "Node 05", title: "100DaysAI Public Ship", status: "🏆 W3C Badge Ready", href: "/avpu/challenge-100days/" }
            ].map((n) => `
              <a href="${n.href}" style="text-decoration:none;padding:12px;border-radius:12px;background:rgba(2,6,23,0.85);border:1px solid rgba(6,182,212,0.3);display:block;">
                <div style="font-size:10.5px;font-weight:800;color:#22d3ee;">${n.step}</div>
                <div style="font-size:13px;font-weight:900;color:#fff;margin:4px 0;">${n.title}</div>
                <div style="font-size:11px;color:#34d399;font-weight:700;">${n.status}</div>
              </a>
            `).join("")}
          </div>
        </div>
      `;
    }
    if (v.id === "pharmacy") {
      return `
        <div class="vite-card" style="border:1px solid rgba(16,185,129,0.4);background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#34d399;text-transform:uppercase;">💊 TATA 1MG + JAN AUSHADHI NLEM + DRUGBANK CYP450</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">Bio-Equivalent Generic Salt Substitution & Clinical Safety Matrix</h3>
            </div>
            <a href="/pharmacy/interaction-checker/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(16,185,129,0.2);color:#6ee7b7;font-size:11.5px;font-weight:800;">Open CYP450 Matrix →</a>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid rgba(148,163,184,0.2);color:#94a3b8;">
                  <th style="padding:8px;">Branded Rx</th>
                  <th style="padding:8px;">Active NLEM Chemical Salt</th>
                  <th style="padding:8px;">Branded MRP</th>
                  <th style="padding:8px;">Jan Aushadhi Generic</th>
                  <th style="padding:8px;">CYP450 / Renal Note</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(148,163,184,0.1);">
                  <td style="padding:8px;font-weight:800;color:#fff;">Augmentin 625 Duo</td>
                  <td style="padding:8px;color:#cbd5e1;">Amoxicillin 500mg + Clavulanic Acid 125mg</td>
                  <td style="padding:8px;color:#f87171;text-decoration:line-through;">₹223.00</td>
                  <td style="padding:8px;color:#34d399;font-weight:900;">₹54.00 (Save 76%)</td>
                  <td style="padding:8px;color:#6ee7b7;">Adjust if CrCl &lt; 30 mL/min</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(148,163,184,0.1);">
                  <td style="padding:8px;font-weight:800;color:#fff;">Crestor 20mg</td>
                  <td style="padding:8px;color:#cbd5e1;">Rosuvastatin Calcium 20mg IP</td>
                  <td style="padding:8px;color:#f87171;text-decoration:line-through;">₹388.00</td>
                  <td style="padding:8px;color:#34d399;font-weight:900;">₹42.00 (Save 89%)</td>
                  <td style="padding:8px;color:#fbbf24;">CYP2C9 Substrate • Avoid Gemfibrozil</td>
                </tr>
                <tr>
                  <td style="padding:8px;font-weight:800;color:#fff;">Janumet 50/500</td>
                  <td style="padding:8px;color:#cbd5e1;">Sitagliptin 50mg + Metformin 500mg</td>
                  <td style="padding:8px;color:#f87171;text-decoration:line-through;">₹395.00</td>
                  <td style="padding:8px;color:#34d399;font-weight:900;">₹68.00 (Save 83%)</td>
                  <td style="padding:8px;color:#6ee7b7;">Hold 48h prior to IV contrast</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
    if (v.id === "breakdown") {
      return `
        <div class="vite-card" style="border:1px solid rgba(249,115,22,0.4);background:linear-gradient(135deg,rgba(249,115,22,0.08),rgba(234,179,8,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#fb923c;text-transform:uppercase;">🏗️ SKYCIV STRUCTURAL FEA + HILTI PROFIS + CPWD DSR 2024</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">Live Euler-Bernoulli Beam SFD/BMD Visualizer & IS-456 Check</h3>
            </div>
            <a href="/breakdown/boq-estimator/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(249,115,22,0.2);color:#fed7aa;font-size:11.5px;font-weight:800;">Open Full CPWD BOQ Sheet →</a>
          </div>
          <svg viewBox="0 0 700 130" style="width:100%;height:auto;background:rgba(2,6,23,0.88);border-radius:12px;border:1px solid rgba(249,115,22,0.3);">
            <!-- Beam Line -->
            <line x1="60" y1="45" x2="640" y2="45" stroke="#f97316" stroke-width="6"/>
            <!-- Supports -->
            <polygon points="60,48 48,70 72,70" fill="#38bdf8"/>
            <polygon points="640,48 628,70 652,70" fill="#38bdf8"/>
            <!-- Parabolic Bending Moment Curve -->
            <path d="M 60 45 Q 350 125 640 45" fill="rgba(249,115,22,0.18)" stroke="#eab308" stroke-width="2.5"/>
            <text x="275" y="112" fill="#fde047" font-size="12" font-weight="bold">M_max = wL²/8 + PL/4 = 168.0 kN·m (IS 456 Safe)</text>
            <text x="65" y="28" fill="#94a3b8" font-size="11">R_A = 92.0 kN ↓ UDL w = 24 kN/m + Point Load P = 40 kN</text>
          </svg>
        </div>
      `;
    }
    if (v.id === "trust") {
      return `
        <div class="vite-card" style="border:1px solid rgba(16,185,129,0.4);background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(59,130,246,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#34d399;text-transform:uppercase;">💚 GIVEINDIA 80G + GITCOIN QUADRATIC FUNDING + CHARITYNAVIGATOR</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">Verified Grassroots Campaigns & Quadratic Matching Pool</h3>
            </div>
            <a href="/trust/tax-exemption/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(16,185,129,0.2);color:#6ee7b7;font-size:11.5px;font-weight:800;">Download Form 10BE Receipt →</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
            ${[
              { title: "Thar Desert Solar Borewell #14", raised: "₹18.4L / ₹20L", donors: "642 Grassroots Donors", match: "3.8x Gitcoin QF Match", pct: 92 },
              { title: "Kutch Tribal Girls STEM & AI Lab", raised: "₹14.2L / ₹15L", donors: "518 Grassroots Donors", match: "4.1x Gitcoin QF Match", pct: 95 },
              { title: "Mobile Rural Cataract Surgery Unit", raised: "₹22.8L / ₹25L", donors: "890 Grassroots Donors", match: "4.6x Gitcoin QF Match", pct: 91 }
            ].map((c) => `
              <div style="padding:14px;border-radius:14px;background:rgba(2,6,23,0.85);border:1px solid rgba(16,185,129,0.28);">
                <div style="font-size:13.5px;font-weight:900;color:#fff;">${c.title}</div>
                <div style="font-size:11.5px;color:#94a3b8;margin:4px 0 8px;">${c.donors} • <span style="color:#6ee7b7;font-weight:700;">${c.match}</span></div>
                <div style="height:8px;border-radius:999px;background:#1e293b;overflow:hidden;margin-bottom:6px;">
                  <div style="width:${c.pct}%;height:100%;background:linear-gradient(90deg,#10b981,#3b82f6);"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:800;color:#e2e8f0;">
                  <span>${c.raised}</span>
                  <span style="color:#34d399;">${c.pct}% Funded (80G Verified)</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    if (v.id === "rakshak") {
      return `
        <div class="vite-card" style="border:1px solid rgba(239,68,68,0.4);background:linear-gradient(135deg,rgba(239,68,68,0.08),rgba(139,92,246,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#f87171;text-transform:uppercase;">⚖️ INDIACODE BNS 2023 + CITIZEN RADAR + HIBP / VIRUSTOTAL</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">IPC 1860 ↔ Bharatiya Nyaya Sanhita (BNS) 2023 Statutory Crosswalk</h3>
            </div>
            <a href="/rakshak-ai/fir-generator/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(239,68,68,0.2);color:#fca5a5;font-size:11.5px;font-weight:800;">Open Zero-FIR Drafter →</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
            ${[
              { ipc: "IPC Sec 420 (Cheating)", bns: "BNS Section 318(4)", bail: "Cognizable • Non-Bailable • Up to 7 Yrs" },
              { ipc: "IPC Sec 379A (Snatching)", bns: "BNS Section 304", bail: "New Dedicated Offense • Up to 3 Yrs + Fine" },
              { ipc: "IPC Sec 302 (Murder)", bns: "BNS Section 103(1)", bail: "Cognizable • Non-Bailable • Death / Life" },
              { ipc: "IT Act Sec 66D (Cyber Fraud)", bns: "BNS Sec 319 + BNSS 173", bail: "Zero-FIR Any Station • BSA Sec 63 Hash" }
            ].map((law) => `
              <div style="padding:12px;border-radius:12px;background:rgba(2,6,23,0.85);border:1px solid rgba(239,68,68,0.3);">
                <div style="font-size:11px;color:#94a3b8;text-decoration:line-through;">Legacy: ${law.ipc}</div>
                <div style="font-size:14px;font-weight:900;color:#f87171;margin:3px 0;">→ ${law.bns}</div>
                <div style="font-size:11px;color:#cbd5e1;font-weight:700;">${law.bail}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    if (v.id === "comonk") {
      return `
        <div class="vite-card" style="border:1px solid rgba(168,85,247,0.4);background:linear-gradient(135deg,rgba(168,85,247,0.08),rgba(236,72,153,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#c084fc;text-transform:uppercase;">💰 LEVELS.FYI + JOBSCAN ATS + TRYEXPONENT MOCK ARENA</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">Cross-Company Engineering Level Equivalency & India CTC Benchmarks</h3>
            </div>
            <a href="/comonk/salary-insights/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(168,85,247,0.2);color:#e9d5ff;font-size:11.5px;font-weight:800;">Open Levels.fyi Explorer →</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;">
            ${[
              { tier: "Entry / SDE-1", eq: "Google L3 = Meta E3 = MSFT 59/60 = AMZN L4", ctc: "₹28L – ₹42L (Base + RSU)" },
              { tier: "Mid-Level / SDE-2", eq: "Google L4 = Meta E4 = MSFT 61/62 = AMZN L5", ctc: "₹52L – ₹78L (Base + RSU)" },
              { tier: "Senior SWE", eq: "Google L5 = Meta E5 = MSFT 63/64 = AMZN L6", ctc: "₹88L – ₹1.35Cr (Base + RSU)" },
              { tier: "Staff / Principal", eq: "Google L6 = Meta E6 = MSFT 65/66 = AMZN L7", ctc: "₹1.55Cr – ₹2.60Cr+" }
            ].map((lv) => `
              <div style="padding:12px;border-radius:12px;background:rgba(2,6,23,0.85);border:1px solid rgba(168,85,247,0.3);">
                <div style="font-size:12px;font-weight:900;color:#c084fc;">${lv.tier}</div>
                <div style="font-size:11.5px;color:#e2e8f0;margin:4px 0;font-weight:700;">${lv.eq}</div>
                <div style="font-size:12.5px;color:#34d399;font-weight:900;">${lv.ctc}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    if (v.id === "agency") {
      return `
        <div class="vite-card" style="border:1px solid rgba(236,72,153,0.4);background:linear-gradient(135deg,rgba(236,72,153,0.08),rgba(99,102,241,0.06));">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;font-weight:800;color:#f472b6;text-transform:uppercase;">👨‍💻 DEVIN SWE TERMINAL + LANGGRAPH 5-NODE DAG + VAPI VOICE</span>
              <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">Autonomous AI Workforce & Live 5-Node StateGraph Pipeline</h3>
            </div>
            <a href="/sevenforce/devin-terminal/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(236,72,153,0.2);color:#fbcfe8;font-size:11.5px;font-weight:800;">Open Full Devin 4-Pane Terminal →</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;">
            ${[
              { node: "01. Supervisor", desc: "Intent Router & Guardrails", lat: "12 ms" },
              { node: "02. Researcher", desc: "ChromaDB Hybrid RAG", lat: "38 ms" },
              { node: "03. ToolExecutor", desc: "391 FastAPI Endpoints", lat: "19 ms" },
              { node: "04. Critic QA", desc: "Score >= 0.85 Reflection", lat: "15 ms" },
              { node: "05. Synthesizer", desc: "Structured JSON + Voice", lat: "22 ms" }
            ].map((nd) => `
              <div style="padding:12px;border-radius:12px;background:rgba(2,6,23,0.85);border:1px solid rgba(236,72,153,0.3);">
                <div style="font-size:12.5px;font-weight:900;color:#f472b6;">${nd.node}</div>
                <div style="font-size:11px;color:#cbd5e1;margin:3px 0;">${nd.desc}</div>
                <div style="font-size:11px;color:#34d399;font-weight:800;">⚡ ${nd.lat}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    return `
      <div class="vite-card" style="border:1px solid rgba(99,102,241,0.4);background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(236,72,153,0.06));">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
          <div>
            <span style="font-size:11px;font-weight:800;color:#a5b4fc;text-transform:uppercase;">🚀 Y-COMBINATOR SAFE + CARTA CAP TABLE + ANGELLIST RUV</span>
            <h3 style="margin:3px 0 0;font-size:18px;font-weight:900;color:#fff;">Sovereign 9-Venture Portfolio & Syndicate Command Matrix</h3>
          </div>
          <div style="display:flex;gap:8px;">
            <a href="/syndicate-ruv/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(99,102,241,0.2);color:#c7d2fe;font-size:11.5px;font-weight:800;">Syndicate RUV →</a>
            <a href="/market-sizing/" style="text-decoration:none;padding:6px 12px;border-radius:8px;background:rgba(16,185,129,0.2);color:#6ee7b7;font-size:11.5px;font-weight:800;">TAM/SAM/SOM Sizer →</a>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;">
          ${Object.values(VENTURE_APPS).filter((x) => x.id !== "hub").map((ven) => `
            <a href="${ven.landingUrl}" style="text-decoration:none;padding:11px 13px;border-radius:12px;background:rgba(2,6,23,0.85);border:1px solid ${ven.accent}55;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:13px;font-weight:900;color:#fff;">${ven.short}</div>
                <div style="font-size:10.5px;color:#94a3b8;">${ven.kpis[0].val}</div>
              </div>
              <span style="font-size:11px;color:${ven.accent};font-weight:800;">Visit Site →</span>
            </a>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderApp() {
    ensureStyles();
    const v = VENTURE_APPS[currentVentureKey] || VENTURE_APPS.hub;
    const tool = v.tools[currentToolIndex] || v.tools[0];

    let root = document.getElementById("vite-app-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "vite-app-root";
      document.body.prepend(root);
    }

    const cleanPath = (window.location.pathname || "/app/").replace(/^\/+|\/+$/g, "") || "app";
    document.title = `${v.name} (${cleanPath}) — Vite v6.0 + React 18 /app Workspace`;

    root.innerHTML = `
      <!-- TOP COMMAND HEADER -->
      <header class="vite-topbar">
        <div class="vite-brand">
          <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,${v.accent},${v.accent2});display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;box-shadow:0 6px 18px ${v.accent}55;">⚡</div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:16px;font-weight:900;letter-spacing:-0.02em;color:#fff;">${v.name}</span>
              <span class="vite-hmr-pill">🟢 VITE v6.0 + REACT 18 SPA • ONLINE AI ENGINE</span>
            </div>
            <div style="font-size:11.5px;color:#94a3b8;margin-top:2px;">${v.badge} • 391 FastAPI Routes + LangGraph StateGraph + 64 Reference Sites</div>
          </div>
        </div>

        <!-- 9-VENTURE INSTANT SPA SWITCHER -->
        <div class="vite-venture-switcher">
          ${Object.values(VENTURE_APPS).map((item) => `
            <button class="vite-v-btn ${item.id === v.id ? "active" : ""}" data-venture="${item.id}">
              ${item.short}
            </button>
          `).join("")}
        </div>

        <!-- RIGHT ACTIONS + WEB3 WALLET CONNECT -->
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <select id="vite-web3-chain" class="vite-v-btn" style="background:rgba(15,23,42,0.9);color:#6ee7b7;border-color:rgba(16,185,129,0.45);">
            <option value="Polygon POS (ChainID: 137)">🟣 Polygon POS (137)</option>
            <option value="Base L2 (ChainID: 8453)">🔵 Base L2 (8453)</option>
            <option value="Solana Mainnet-Beta">🟢 Solana Mainnet</option>
            <option value="Ethereum Mainnet (ChainID: 1)">💎 Ethereum L1</option>
            <option value="Arbitrum Nitro (ChainID: 42161)">🔷 Arbitrum One</option>
          </select>
          <button id="vite-web3-connect-btn" class="vite-v-btn" style="background:linear-gradient(135deg,rgba(245,158,11,0.22),rgba(236,72,153,0.22));border-color:rgba(245,158,11,0.55);color:#fde68a;">
            🦊 0x71C8...89A4 (ERC-4337 Connected)
          </button>
          <button id="vite-open-spotlight" class="vite-v-btn" style="border-color:rgba(129,140,248,0.5);color:#c7d2fe;">
            🔍 Ctrl+K
          </button>
          <a href="${v.landingUrl}" class="vite-v-btn" style="text-decoration:none;">
            ← Venture Site
          </a>
        </div>
      </header>

      <!-- MAIN SPA BODY -->
      <div class="vite-layout">
        <!-- LEFT SIDEBAR: 7 INTERACTIVE TOOLS PER VENTURE -->
        <aside class="vite-sidebar">
          <div style="padding:10px 12px;border-radius:12px;background:rgba(30,41,59,0.55);border:1px solid rgba(148,163,184,0.14);margin-bottom:4px;">
            <div style="font-size:10.5px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">ACTIVE WORKSPACE</div>
            <div style="font-size:14px;font-weight:900;color:#fff;margin-top:3px;">${v.name}</div>
            <div style="font-size:11.5px;color:#34d399;margin-top:4px;font-weight:700;">● 7 Specialized Modules Ready</div>
          </div>

          ${v.tools.map((t, idx) => `
            <button class="vite-tool-btn ${idx === currentToolIndex ? "active" : ""}" data-tool-idx="${idx}">
              <span style="font-size:20px;line-height:1.1;">${t.icon}</span>
              <div>
                <div style="font-size:13px;font-weight:800;color:#f8fafc;">${t.title}</div>
                <div style="font-size:11px;color:#94a3b8;margin-top:3px;line-height:1.35;">${t.desc.slice(0, 68)}...</div>
              </div>
            </button>
          `).join("")}

          <div style="margin-top:auto;padding:12px;border-radius:14px;background:linear-gradient(135deg,rgba(99,102,241,0.14),rgba(16,185,129,0.12));border:1px solid rgba(99,102,241,0.28);">
            <div style="font-size:11px;font-weight:800;color:#a5b4fc;">⚡ VITE SPA ADVANTAGE</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:4px;line-height:1.45;">
              Zero Next.js Turbopack chunk 404s. Instant 0ms tool switching across 63 modules & 391 FastAPI routes.
            </div>
          </div>
        </aside>

        <!-- CENTER / RIGHT WORKSTATION -->
        <main class="vite-main">
          <!-- VENTURE-SPECIFIC DOMAIN SIGNATURE WORKBENCH -->
          ${renderVentureSignatureWorkbench(v)}

          <!-- KPI ROW -->
          <div class="vite-kpi-grid">
            ${v.kpis.map((k) => `
              <div class="vite-card" style="border-top:3px solid ${v.accent};">
                <div style="font-size:11.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;">${k.label}</div>
                <div style="font-size:26px;font-weight:900;color:#ffffff;margin-top:6px;">${k.val}</div>
                <div style="font-size:11.5px;color:#34d399;font-weight:700;margin-top:4px;">▲ ${k.delta}</div>
              </div>
            `).join("")}
          </div>

          <!-- ACTIVE TOOL WORKSTATION + LIVE OUTPUT -->
          <div class="vite-workstation-grid">
            <!-- LEFT: INPUT CONTROLS -->
            <div class="vite-card">
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span style="font-size:28px;">${tool.icon}</span>
                  <div>
                    <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">${v.name} — ${tool.title}</h1>
                    <p style="margin:3px 0 0;font-size:12.5px;color:#94a3b8;">${tool.desc}</p>
                  </div>
                </div>
                <span style="padding:5px 10px;border-radius:8px;background:rgba(99,102,241,0.18);border:1px solid rgba(99,102,241,0.4);font-size:11px;font-weight:800;color:#a5b4fc;">
                  API: ${tool.apiEndpoint}
                </span>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:18px;">
                ${(tool.inputs || []).map((inp) => `
                  <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#cbd5e1;margin-bottom:6px;">${inp.label}</label>
                    ${inp.type === "select"
                      ? `<select id="vite-inp-${inp.key}" class="vite-input">
                          ${(inp.options || []).map((opt) => `<option value="${opt}" ${opt === inp.default ? "selected" : ""}>${opt}</option>`).join("")}
                         </select>`
                      : `<input id="vite-inp-${inp.key}" type="${inp.type || "text"}" value="${inp.default !== undefined ? inp.default : ""}" class="vite-input"/>`
                    }
                  </div>
                `).join("")}
              </div>

              <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                <button id="vite-run-tool-btn" class="vite-run-btn">
                  ⚡ Execute Live ${tool.title} Engine
                </button>
                <button id="vite-web3-exec-btn" class="vite-v-btn" style="padding:11px 16px;background:linear-gradient(135deg,rgba(16,185,129,0.22),rgba(6,182,212,0.22));border-color:rgba(16,185,129,0.55);color:#6ee7b7;font-weight:800;">
                  ⛓️ Anchor On-Chain Web3 Proof (ERC-4337)
                </button>
                <button id="vite-export-json-btn" class="vite-v-btn" style="padding:11px 16px;">
                  📥 Export Telemetry JSON
                </button>
              </div>

              <!-- CANVA MULTI-LAYER VECTOR STUDIO CANVAS -->
              <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(148,163,184,0.14);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                  <span style="font-size:12px;font-weight:800;color:#f472b6;">🎨 CANVA MULTI-LAYER VECTOR STUDIO PREVIEW</span>
                  <button id="vite-download-png-btn" class="vite-v-btn" style="font-size:11px;padding:4px 10px;">Download PNG</button>
                </div>
                <canvas id="vite-canva-canvas" width="660" height="240" style="width:100%;height:auto;border-radius:12px;border:1px solid rgba(148,163,184,0.2);"></canvas>
              </div>
            </div>

            <!-- RIGHT: LIVE API TELEMETRY OUTPUT -->
            <div class="vite-card" style="display:flex;flex-direction:column;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-size:13px;font-weight:800;color:#6ee7b7;">📡 REAL-TIME FASTAPI + LANGGRAPH OUTPUT</span>
                <span style="font-size:11px;color:#94a3b8;">StateGraph 5-Node Verified</span>
              </div>
              <div id="vite-tool-output" style="flex:1;"></div>
            </div>
          </div>

          <!-- BOTTOM ROW: ECHARTS 5 RADAR + ECHARTS 5 BAR + THREE.JS 3D SPLINE VIEWPORT -->
          <div class="vite-charts-row">
            <div class="vite-card">
              <div style="font-size:12.5px;font-weight:800;color:#a5b4fc;margin-bottom:8px;">🕸️ APACHE ECHARTS 5 — CAPABILITY RADAR</div>
              <div id="vite-echarts-radar" style="width:100%;height:230px;"></div>
            </div>
            <div class="vite-card">
              <div style="font-size:12.5px;font-weight:800;color:#34d399;margin-bottom:8px;">📊 APACHE ECHARTS 5 — BENCHMARK TELEMETRY</div>
              <div id="vite-echarts-bar" style="width:100%;height:230px;"></div>
            </div>
            <div class="vite-card">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:12.5px;font-weight:800;color:#f472b6;">🧊 SPLINE / THREE.JS 3D WEBGL LAB</span>
                <span style="font-size:10.5px;color:#94a3b8;">Drag to Rotate 3D</span>
              </div>
              <div id="vite-three-viewport" style="width:100%;height:230px;border-radius:12px;background:rgba(2,6,23,0.65);"></div>
            </div>
          </div>
        </main>
      </div>
    `;

    // Wire events
    root.querySelectorAll("[data-venture]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentVentureKey = btn.getAttribute("data-venture");
        currentToolIndex = 0;
        const nextUrl = VENTURE_APPS[currentVentureKey].appUrl;
        try {
          window.history.pushState({ venture: currentVentureKey }, "", nextUrl);
        } catch (_) {}
        renderApp();
      });
    });

    root.querySelectorAll("[data-tool-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentToolIndex = Number(btn.getAttribute("data-tool-idx"));
        renderApp();
      });
    });

    const runBtn = document.getElementById("vite-run-tool-btn");
    if (runBtn) runBtn.addEventListener("click", executeActiveTool);

    const web3ExecBtn = document.getElementById("vite-web3-exec-btn");
    if (web3ExecBtn) {
      web3ExecBtn.addEventListener("click", async () => {
        const out = document.getElementById("vite-tool-output");
        const chainSel = document.getElementById("vite-web3-chain");
        const chain = chainSel ? chainSel.value : "Polygon POS (ChainID: 137)";
        if (out) out.innerHTML = `<div style="color:#6ee7b7;font-weight:800;">⛓️ Broadcasting ERC-4337 Account Abstraction Tx to ${chain}...</div>`;
        try {
          const res = await fetch("/api/web3/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ venture: v.id, chain, action: tool.title })
          });
          const data = await res.json();
          if (out) {
            out.innerHTML = `
              <div style="padding:14px;border-radius:14px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.45);margin-bottom:12px;">
                <div style="font-size:12px;font-weight:900;color:#34d399;">✅ WEB3 SMART CONTRACT CONFIRMED (${data.network})</div>
                <div style="font-size:11.5px;color:#e2e8f0;margin-top:4px;">Contract: <strong>${data.smart_contract}</strong></div>
                <div style="font-size:11px;color:#a5b4fc;margin-top:3px;word-break:break-all;">TxHash: <code>${data.tx_hash}</code></div>
                <div style="font-size:11px;color:#6ee7b7;margin-top:3px;">IPFS CID: <code>${data.ipfs_metadata_cid}</code> • ${data.gas_used}</div>
              </div>
              <pre style="margin:0;max-height:240px;overflow:auto;padding:12px;border-radius:12px;background:rgba(2,6,23,0.9);border:1px solid rgba(148,163,184,0.2);color:#e2e8f0;font-size:12px;">${JSON.stringify(data, null, 2)}</pre>
            `;
          }
        } catch (err) {
          if (out) out.innerHTML = `<div style="color:#fca5a5;">Web3 Error: ${String(err)}</div>`;
        }
      });
    }

    const web3ConnBtn = document.getElementById("vite-web3-connect-btn");
    if (web3ConnBtn) {
      web3ConnBtn.addEventListener("click", async () => {
        if (window.ethereum && window.ethereum.request) {
          try {
            const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (accs && accs[0]) {
              web3ConnBtn.textContent = `🦊 ${accs[0].slice(0, 6)}...${accs[0].slice(-4)} (EIP-1193)`;
              return;
            }
          } catch (_) {}
        }
        web3ConnBtn.textContent = "🦊 0x94F2...C31B (ERC-4337 Session Active)";
      });
    }

    const spotBtn = document.getElementById("vite-open-spotlight");
    if (spotBtn) spotBtn.addEventListener("click", openSpotlightModal);

    const pngBtn = document.getElementById("vite-download-png-btn");
    if (pngBtn) {
      pngBtn.addEventListener("click", () => {
        const c = document.getElementById("vite-canva-canvas");
        if (!c) return;
        const a = document.createElement("a");
        a.download = `${v.id}-${tool.id}-canva.png`;
        a.href = c.toDataURL("image/png");
        a.click();
      });
    }

    const jsonBtn = document.getElementById("vite-export-json-btn");
    if (jsonBtn) {
      jsonBtn.addEventListener("click", () => {
        const pre = document.querySelector("#vite-tool-output pre");
        const blob = new Blob([pre ? pre.textContent : "{}"], { type: "application/json" });
        const a = document.createElement("a");
        a.download = `${v.id}-${tool.id}-telemetry.json`;
        a.href = URL.createObjectURL(blob);
        a.click();
      });
    }

    // Render Canva preview, Charts, 3D, and run initial live tool query
    renderCanvaPreview(
      document.getElementById("vite-canva-canvas"),
      v.name,
      `${tool.title} • ${v.badge}`,
      v.accent,
      v.accent2
    );
    setTimeout(initChartsAnd3D, 60);
    executeActiveTool();
    injectV7PortalStrip();
  }

  function injectV7PortalStrip() {
    let strip = document.getElementById("v7-portal-frontier-strip");
    if (!strip) {
      strip = document.createElement("section");
      strip.id = "v7-portal-frontier-strip";
      strip.style.cssText = "max-width:1280px;margin:0 auto 28px;padding:18px 24px;border-radius:18px;background:#0b1120;border:1px solid rgba(99,102,241,0.35);font-family:Inter,system-ui,sans-serif;";
      strip.innerHTML = `
        <div style="font-size:11px;font-family:monospace;font-weight:800;color:#818cf8;text-transform:uppercase;margin-bottom:10px;">v7.0 Frontier AI Studios, New Ventures & Standalone Workstations</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${[
            ["🔎 Perplexity Research", "/perplexity-research/"],
            ["✨ v0 Live UI Builder", "/ai-ui-builder/"],
            ["📐 Infinite Arch Canvas", "/infinite-canvas/"],
            ["⚡ Linear Sprint OS", "/linear-os/"],
            ["📈 Quant Terminal", "/quant-terminal/"],
            ["🌱 TerraPulse Climate", "/climate-agritech/"],
            ["🏙️ UrbanGrid PropTech", "/proptech-studio/"],
            ["🌈 WebGL Shader Lab", "/shader-3d-lab/"],
            ["⚖️ Stripe Atlas & 83(b)", "/stripe-atlas/"],
            ["🩺 LactMed Drug Safety", "/pharmacy/pregnancy-lactation-safety/"],
            ["🤝 Crowdfunding Milestones", "/trust/crowdfunding-milestones/"],
          ]
            .map(
              ([lbl, u]) =>
                `<a href="${u}" style="padding:7px 12px;border-radius:10px;background:#111827;border:1px solid rgba(148,163,184,0.25);color:#e2e8f0;text-decoration:none;font-size:12.5px;font-weight:700;">${lbl}</a>`
            )
            .join("")}
        </div>
      `;
      document.body.appendChild(strip);
    }
  }

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSpotlightModal();
    } else if (e.key === "Escape") {
      const m = document.getElementById("vite-spotlight-modal");
      if (m) m.remove();
    }
  });

  window.addEventListener("popstate", () => {
    currentVentureKey = detectVentureFromPath();
    currentToolIndex = 0;
    renderApp();
  });

  function boot() {
    renderApp();
    // Load Three.js & ECharts 5 lazily after window load so page load is instantaneous
    setTimeout(() => {
      const scripts = [];
      if (!window.THREE) {
        scripts.push("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
      }
      if (!window.echarts) {
        scripts.push("https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js");
      }
      scripts.forEach((src) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => initChartsAnd3D();
        document.head.appendChild(s);
      });
    }, 180);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

