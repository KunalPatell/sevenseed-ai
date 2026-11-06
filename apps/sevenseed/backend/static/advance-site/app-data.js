// ============================================================================
// Sevenseed Advance Site — Multi-Framework Master Datasets (app-data.js)
// Powering React 18, AngularJS 1.8.3, LangChain/LangGraph, Canva & Framer Labs
// ============================================================================

window.SEVENSEED_ADVANCE_DATA = {
  // --------------------------------------------------------------------------
  // 1. AVP EMART — Smartprix + Google Shopping (?udm=28) + BuyHatke + Xerve
  // --------------------------------------------------------------------------
  emartProducts: [
    {
      id: "iphone-16-pro",
      name: "Apple iPhone 16 Pro (256GB, Natural Titanium)",
      brand: "Apple",
      category: "Flagship Smartphone",
      personaFit: ["creator", "value", "travel"],
      specScore: 95,
      basePrice: 119900,
      lowest90d: 112900,
      highest90d: 129900,
      dropProbability: 68,
      buyRecommendation: "BUY WITH HDFC CARD — Effective ₹1,04,400",
      subScores: { display: 97, performance: 99, camera: 98, battery: 91, value: 86 },
      specs: {
        soc: "Apple A18 Pro (3nm Gen-2, 16-core Neural Engine)",
        display: "6.3\" LTPO Super Retina XDR OLED, 120Hz ProMotion, 2000 nits",
        camera: "48MP Fusion + 48MP Ultra-Wide + 12MP 5x Tetraprism Telephoto (4K 120fps Dolby Vision)",
        battery: "3582 mAh · 30W MagSafe · 27hr Video Playback",
        weight: "199g · Grade 5 Titanium · IP68 (6m/30min)"
      },
      pros: ["Industry-leading 4K120 ProRes video & A18 Pro single-core speed", "5x optical tetraprism zoom + Grade-5 titanium build", "Highest 3-year resale value (71% retention)"],
      cons: ["Slower wired charging than 100W Android rivals", "Base 128GB/256GB storage upgrades remain pricey"],
      stores: [
        { store: "Amazon India", price: 117900, delivery: "Same-Day Prime", stock: "In Stock", url: "#amazon" },
        { store: "Croma Direct", price: 118400, delivery: "2-Hr Express Pickup", stock: "In Stock", url: "#croma" },
        { store: "Flipkart Assured", price: 118900, delivery: "Next-Day", stock: "In Stock", url: "#flipkart" },
        { store: "Vijay Sales", price: 119200, delivery: "Standard 2-Day", stock: "In Stock", url: "#vijaysales" }
      ],
      priceHistory90d: [129900, 127900, 126500, 124900, 122000, 123500, 121000, 119900, 118500, 116900, 118200, 117900]
    },
    {
      id: "s24-ultra",
      name: "Samsung Galaxy S24 Ultra 5G (12GB / 256GB, Titanium Gray)",
      brand: "Samsung",
      category: "Flagship Smartphone",
      personaFit: ["creator", "travel"],
      specScore: 96,
      basePrice: 109999,
      lowest90d: 99999,
      highest90d: 129999,
      dropProbability: 82,
      buyRecommendation: "STRONG BUY NOW — Near 90-Day All-Time Low",
      subScores: { display: 99, performance: 96, camera: 97, battery: 95, value: 91 },
      specs: {
        soc: "Snapdragon 8 Gen 3 for Galaxy (4nm, Vapor Chamber 1.9x)",
        display: "6.8\" QHD+ Dynamic AMOLED 2X, 120Hz, 2600 nits + Gorilla Armor Anti-Reflective",
        camera: "200MP Main + 50MP 5x Periscope + 10MP 3x Tele + 12MP UW",
        battery: "5000 mAh · 45W Super Fast Charging 2.0",
        weight: "232g · Titanium Frame + Built-in Bluetooth S-Pen"
      },
      pros: ["Gorilla Armor cuts 75% screen glare outdoors", "Built-in S-Pen + Galaxy AI Live Translate & Circle to Search", "200MP sensor with versatile 3x + 5x dual optical telephoto"],
      cons: ["Boxy 232g chassis feels large for one-handed use", "Shutter lag on fast-moving indoor pets"],
      stores: [
        { store: "Amazon India", price: 107990, delivery: "Same-Day Prime", stock: "In Stock", url: "#amazon" },
        { store: "Samsung Shop App", price: 108499, delivery: "Next-Day", stock: "In Stock", url: "#samsung" },
        { store: "Flipkart Assured", price: 109999, delivery: "Next-Day", stock: "In Stock", url: "#flipkart" },
        { store: "Reliance Digital", price: 110500, delivery: "Store Pickup", stock: "In Stock", url: "#reliance" }
      ],
      priceHistory90d: [129999, 124999, 121999, 119999, 117500, 114999, 112999, 113999, 110999, 108999, 109499, 107990]
    },
    {
      id: "oneplus-13",
      name: "OnePlus 13 5G (16GB / 512GB, Midnight Ocean Vegan Leather)",
      brand: "OnePlus",
      category: "Flagship Killer",
      personaFit: ["value", "travel", "creator"],
      specScore: 94,
      basePrice: 69999,
      lowest90d: 64999,
      highest90d: 74999,
      dropProbability: 91,
      buyRecommendation: "BEST VALUE FLAGSHIP — ₹48,000 Cheaper Than Rivals",
      subScores: { display: 96, performance: 98, camera: 90, battery: 99, value: 98 },
      specs: {
        soc: "Snapdragon 8 Elite (3nm Oryon CPU @ 4.32GHz)",
        display: "6.82\" 2K BOE X2 LTPO AMOLED, 120Hz, 4500 nits Peak, DisplayMate A++",
        camera: "Triple 50MP Hasselblad (Sony LYT-808 + 3x Triprism Tele + 50MP UW)",
        battery: "6000 mAh Silicon-Carbon Glacier Battery · 100W SUPERVOOC + 50W Wireless",
        weight: "210g · IP68 + IP69 Hot-Water Jet Resistant"
      },
      pros: ["Massive 6000mAh Silicon-Carbon battery charges 1–100% in 36 mins", "Next-gen Snapdragon 8 Elite Oryon CPU beats A18 Pro in multi-core", "IP69 rating + AquaTouch 2.0 works with wet/gloved fingers"],
      cons: ["Low-light 6x+ zoom trails S24 Ultra slightly", "Fewer years of OS updates (4 yrs vs 7 yrs on Pixel/Samsung)"],
      stores: [
        { store: "Amazon India", price: 68999, delivery: "Same-Day Prime", stock: "In Stock", url: "#amazon" },
        { store: "OnePlus Store India", price: 68499, delivery: "Express 24h", stock: "In Stock", url: "#oneplus" },
        { store: "Croma Direct", price: 69999, delivery: "2-Hr Pickup", stock: "In Stock", url: "#croma" },
        { store: "Vijay Sales", price: 69499, delivery: "Next-Day", stock: "In Stock", url: "#vijaysales" }
      ],
      priceHistory90d: [74999, 73999, 72999, 71999, 71999, 70999, 69999, 69499, 68999, 67999, 68999, 68499]
    },
    {
      id: "macbook-air-m3",
      name: "Apple MacBook Air 13\" M3 Chip (16GB Unified RAM / 512GB SSD)",
      brand: "Apple",
      category: "AI Ultrabook",
      personaFit: ["creator", "value", "travel"],
      specScore: 95,
      basePrice: 114900,
      lowest90d: 99900,
      highest90d: 134900,
      dropProbability: 87,
      buyRecommendation: "BUY NOW — Includes Free 16GB Unified Memory Bump",
      subScores: { display: 93, performance: 96, camera: 88, battery: 99, value: 95 },
      specs: {
        soc: "Apple M3 (8-Core CPU, 10-Core GPU, 16-Core Neural Engine)",
        display: "13.6\" Liquid Retina IPS, 500 nits, P3 Wide Color, Dual External Display Support",
        camera: "1080p FaceTime HD + 3-Mic Array + 4-Speaker Spatial Audio",
        battery: "52.6 Wh · 18-Hour All-Day Battery · MagSafe 3",
        weight: "1.24 kg · Fanless Silent Aluminum Unibody"
      },
      pros: ["Unbeatable 18-hour real-world battery with zero fan noise", "Now ships with 16GB Unified RAM baseline for local LLM/dev work", "Supports dual external 6K/5K monitors with lid closed"],
      cons: ["60Hz refresh rate instead of 120Hz ProMotion", "Only two Thunderbolt/USB4 ports on the left side"],
      stores: [
        { store: "Amazon India", price: 109900, delivery: "Next-Day Prime", stock: "In Stock", url: "#amazon" },
        { store: "Flipkart Assured", price: 110900, delivery: "2-Day Express", stock: "In Stock", url: "#flipkart" },
        { store: "Imagine Apple Reseller", price: 108900, delivery: "Store Pickup", stock: "In Stock", url: "#imagine" },
        { store: "Croma Direct", price: 111400, delivery: "Same-Day", stock: "In Stock", url: "#croma" }
      ],
      priceHistory90d: [134900, 129900, 124900, 119900, 117900, 114900, 112900, 111900, 109900, 108900, 109900, 108900]
    }
  ],

  bankOffers: [
    { id: "hdfc-infinia", name: "HDFC Infinia / Millennia Credit Card (Instant + SmartBuy 5X)", instantOff: 6000, cashbackPct: 5.0 },
    { id: "sbi-cashback", name: "SBI Cashback Credit Card (Flat 5% Online Cashback)", instantOff: 4000, cashbackPct: 5.0 },
    { id: "icici-apay", name: "ICICI Amazon Pay Credit Card (5% Prime Unlimited)", instantOff: 3500, cashbackPct: 5.0 },
    { id: "axis-magnus", name: "Axis Atlas / Flipkart Axis Credit Card", instantOff: 4500, cashbackPct: 4.0 }
  ],

  couponsToTest: [
    { code: "SEVENAI2500", discount: 2500, label: "Sevenseed AI Price Lab Exclusive" },
    { code: "SMARTPRIX1500", discount: 1500, label: "Partner Spec-Score Stacker" },
    { code: "BUYHATKE3000", discount: 3000, label: "BuyHatke Automated Cart Rebate" },
    { code: "XERVECASH", discount: 1200, label: "Xerve Super-Cashback Voucher" },
    { code: "FESTIVE500", discount: 500, label: "Expired Seasonal Promo" },
    { code: "VIPQUANTUM4000", discount: 4000, label: "Quantum Tier Stackable Code (WINNER)" }
  ],

  // --------------------------------------------------------------------------
  // 2. AVPU — Learn-Anything.xyz Force Graph + FreeCodeCamp + Duolingo + UX
  // --------------------------------------------------------------------------
  knowledgeGraphNodes: [
    { id: "math", label: "Linear Algebra & Calc", cluster: "Foundations", x: 110, y: 120, hours: 18, prereqs: [], resources: ["3Blue1Brown Essence of Linear Algebra", "MIT 18.06 Gilbert Strang"] },
    { id: "python", label: "Python 3.12 & Async", cluster: "Foundations", x: 110, y: 260, hours: 20, prereqs: [], resources: ["Fluent Python 2nd Ed", "FastAPI Async Architecture Guide"] },
    { id: "js-ts", label: "TypeScript & ES2025", cluster: "Frontend", x: 110, y: 390, hours: 22, prereqs: [], resources: ["Total TypeScript by Matt Pocock", "MDN Web Docs Deep Dive"] },
    { id: "ml-core", label: "PyTorch & Deep Learning", cluster: "AI Core", x: 290, y: 120, hours: 32, prereqs: ["math", "python"], resources: ["Karpathy Neural Networks: Zero to Hero", "Fast.ai Practical DL"] },
    { id: "transformers", label: "Attention & LLMs", cluster: "AI Core", x: 470, y: 100, hours: 28, prereqs: ["math", "python", "ml-core"], resources: ["Attention Is All You Need Annotated", "HuggingFace LLM Course"] },
    { id: "langchain", label: "LangChain & Hybrid RAG", cluster: "Agentic AI", x: 470, y: 230, hours: 24, prereqs: ["python", "transformers"], resources: ["LangChain Expression Language (LCEL)", "Qdrant Hybrid Vector Search"] },
    { id: "langgraph", label: "LangGraph StateGraphs", cluster: "Agentic AI", x: 660, y: 170, hours: 30, prereqs: ["python", "transformers", "langchain"], resources: ["LangGraph Cyclic Multi-Agent Blueprints", "Human-in-the-Loop Checkpointers"] },
    { id: "react18", label: "React 18 & Next.js 15", cluster: "Frontend", x: 290, y: 340, hours: 26, prereqs: ["js-ts"], resources: ["React.dev Server & Client Hooks", "Next.js 15 App Router Mastery"] },
    { id: "framer-3d", label: "Framer Motion & Three.js", cluster: "Frontend", x: 470, y: 360, hours: 24, prereqs: ["js-ts", "react18"], resources: ["Three.js Journey by Bruno Simon", "21st.dev & Aceternity UI Shaders"] },
    { id: "angular-ent", label: "AngularJS & Reactive Grid", cluster: "Enterprise", x: 290, y: 450, hours: 18, prereqs: ["js-ts"], resources: ["Enterprise Two-Way Data Binding", "High-Throughput Telemetry Grids"] },
    { id: "fullstack-ai", label: "Quantum AI SaaS Architect", cluster: "Capstone", x: 680, y: 330, hours: 40, prereqs: ["python", "js-ts", "react18", "framer-3d", "langchain", "langgraph"], resources: ["Sevenseed Multi-Framework Production Blueprint", "Render Free-Tier 72MB Optimization Guide"] }
  ],

  fccChallenges: [
    {
      id: "langgraph-router",
      title: "Challenge 1: Build a Deterministic LangGraph Router Function",
      difficulty: "Intermediate · 150 XP",
      description: "Write a JavaScript function `routeQuery(query)` that returns `'ecommerce'` if the query mentions `'price'` or `'iphone'`, `'education'` if it mentions `'learn'` or `'roadmap'`, and `'general'` otherwise.",
      starterCode: `function routeQuery(query) {\n  const q = String(query || "").toLowerCase();\n  if (q.includes("price") || q.includes("iphone") || q.includes("coupon")) {\n    return "ecommerce";\n  }\n  if (q.includes("learn") || q.includes("roadmap") || q.includes("graph")) {\n    return "education";\n  }\n  return "general";\n}`,
      tests: [
        { label: "routeQuery('Compare iPhone 16 price') === 'ecommerce'", expr: "routeQuery('Compare iPhone 16 price') === 'ecommerce'" },
        { label: "routeQuery('Build an AI learn roadmap') === 'education'", expr: "routeQuery('Build an AI learn roadmap') === 'education'" },
        { label: "routeQuery('System health status') === 'general'", expr: "routeQuery('System health status') === 'general'" }
      ]
    },
    {
      id: "buyhatke-net-price",
      title: "Challenge 2: Calculate Net Effective Price (BuyHatke + Xerve Stacker)",
      difficulty: "Intermediate · 200 XP",
      description: "Implement `computeNetPrice(basePrice, couponOff, cardCashbackPct)` that subtracts `couponOff` first, then applies `cardCashbackPct` percentage discount and returns the rounded integer price.",
      starterCode: `function computeNetPrice(basePrice, couponOff, cardCashbackPct) {\n  const afterCoupon = Math.max(0, basePrice - couponOff);\n  const cashback = afterCoupon * (cardCashbackPct / 100);\n  return Math.round(afterCoupon - cashback);\n}`,
      tests: [
        { label: "computeNetPrice(100000, 4000, 5) === 91200", expr: "computeNetPrice(100000, 4000, 5) === 91200" },
        { label: "computeNetPrice(50000, 2000, 10) === 43200", expr: "computeNetPrice(50000, 2000, 10) === 43200" },
        { label: "computeNetPrice(10000, 0, 5) === 9500", expr: "computeNetPrice(10000, 0, 5) === 9500" }
      ]
    },
    {
      id: "sm2-interval",
      title: "Challenge 3: SuperMemo SM-2 Spaced Repetition Interval",
      difficulty: "Advanced · 250 XP",
      description: "Implement `nextSm2Interval(prevInterval, repetitions, easeFactor)` returning `1` for rep 0, `6` for rep 1, and `Math.round(prevInterval * easeFactor)` for rep >= 2.",
      starterCode: `function nextSm2Interval(prevInterval, repetitions, easeFactor) {\n  if (repetitions <= 0) return 1;\n  if (repetitions === 1) return 6;\n  return Math.round(prevInterval * easeFactor);\n}`,
      tests: [
        { label: "nextSm2Interval(0, 0, 2.5) === 1", expr: "nextSm2Interval(0, 0, 2.5) === 1" },
        { label: "nextSm2Interval(1, 1, 2.5) === 6", expr: "nextSm2Interval(1, 1, 2.5) === 6" },
        { label: "nextSm2Interval(6, 2, 2.5) === 15", expr: "nextSm2Interval(6, 2, 2.5) === 15" }
      ]
    }
  ],

  duolingoQuizzes: [
    {
      q: "Why did plain Next.js SSR + Python crash on Render Free Tier (512MB RAM), and how does Sevenseed Advance Site solve it?",
      options: [
        "By serving GPU-accelerated client-side React 18 + Three.js + AngularJS bundles from a single 72MB FastAPI + LangGraph process",
        "By removing React, Three.js, and LangGraph completely",
        "By requiring a $85/month dedicated 16GB server",
        "By disabling CSS animations"
      ],
      correctIndex: 0,
      explanation: "Render Free Tier enforces a strict 512MB RAM cgroup limit. Serving client-side ESM React 18 + Three.js + AngularJS from a single Python FastAPI + LangGraph process keeps server RAM at ~72.4MB while running 60fps WebGL in the user's GPU!"
    },
    {
      q: "In LangGraph (`langgraph.graph.StateGraph`), what enables an agent to self-correct when the Critic node detects low confidence?",
      options: [
        "A static HTML table",
        "A `conditional_edge` that routes back to `domain_tool_executor` until `critic_score >= 0.85`",
        "Deleting the prompt template",
        "Increasing CSS z-index"
      ],
      correctIndex: 1,
      explanation: "LangGraph's core superpower over linear chains is cyclic `add_conditional_edges`, allowing reflection loops until quality thresholds are met."
    },
    {
      q: "According to Fitts's Law (LawsOfUX.com), how do you reduce the time required for a user to click a primary CTA button?",
      options: [
        "Make the button smaller and place it in the far corner",
        "Increase target width (W) and decrease distance (D) from the cursor's natural focal zone",
        "Add 14 competing popups around the button",
        "Hide the button behind 3 dropdown menus"
      ],
      correctIndex: 1,
      explanation: "Fitts's Law states MT = a + b * log2(2D / W). Larger width W and shorter distance D logarithmically reduce acquisition time."
    },
    {
      q: "In Farnam Street's (`fs.blog`) 'Inversion' mental model, how do you guarantee a high-converting SaaS onboarding flow?",
      options: [
        "Only brainstorm flashy features",
        "First list every friction point guaranteed to make a user rage-quit, then systematically eliminate each one",
        "Copy random colors without user testing",
        "Double the number of form fields"
      ],
      correctIndex: 1,
      explanation: "Carl Jacobi's maxim 'Invert, always invert' solves complex problems backward by avoiding stupidity rather than chasing brilliance."
    }
  ],

  mentalModels: [
    {
      id: "first-principles",
      name: "First-Principles Decomposition",
      source: "fs.blog / Aristotle / Physics Thinking",
      lens: "Strip away industry assumptions down to fundamental physical & economic truths, then rebuild up.",
      template: (problem) => [
        `1. Deconstruct Assumption: Why do teams assume "${problem}" requires bloated legacy workflows?`,
        `2. Atomic Truths: Break the problem into compute cost, user cognitive load (<400ms Doherty threshold), and verifiable ROI.`,
        `3. Re-Architecture: Combine React 18 client state + LangGraph deterministic tools to deliver 10x output at 14% of the RAM budget.`
      ]
    },
    {
      id: "inversion",
      name: "Inversion (Avoid Failure Modes First)",
      source: "fs.blog / Charlie Munger / Carl Jacobi",
      lens: "Instead of asking how to succeed, ask: 'What would guarantee 100% failure for this initiative?' and eliminate those triggers.",
      template: (problem) => [
        `1. Guaranteed Failure Mode for "${problem}": Slow >3s page loads, vague copywriting, hidden pricing, and unverified AI hallucinations.`,
        `2. Anti-Failure Guardrails: Enforce LangGraph Critic verification (>=0.85 score), instant price-breakdown transparency, and sub-50ms UI transitions.`,
        `3. Result: By removing the top 3 churn triggers, baseline conversion compounds automatically.`
      ]
    },
    {
      id: "second-order",
      name: "Second- & Third-Order Consequences",
      source: "fs.blog / Howard Marks",
      lens: "Every action triggers a cascade. Look past the immediate 1st-order effect to the 90-day 2nd- and 3rd-order compounding loops.",
      template: (problem) => [
        `1. First-Order Effect (Day 1): Solving "${problem}" saves immediate manual effort.`,
        `2. Second-Order Effect (Day 30): Users trust the verifiable telemetry and share interactive proof-of-work cards organically.`,
        `3. Third-Order Flywheel (Day 90): Data network effects lower CAC by 42% while increasing LTV/CAC to 5.4x.`
      ]
    }
  ],

  copywritingTeardowns: [
    {
      id: "saas-hero",
      category: "SaaS Landing Page Hero (MarketingExamples.com)",
      beforeHeadline: "Welcome to Our Next-Generation Synergistic Enterprise Cloud Platform",
      beforeSub: "We leverage cutting-edge paradigms to empower cross-functional stakeholders with scalable solutions.",
      beforeConversion: "1.1% Visitor-to-Signup",
      afterHeadline: "Cut Your Cloud & AI Bill by 68% in 4 Minutes — Zero Code Changes",
      afterSub: "Connect your repo, test 6 live LLMs side-by-side, and deploy to Render Free Tier in 72MB RAM. Trusted by 14,200+ engineers.",
      afterConversion: "6.8% Visitor-to-Signup (+518% Lift)",
      annotations: [
        "Specificity beats adjectives: '68% in 4 Minutes' replaces 'synergistic enterprise platform'",
        "Objection handling in subhead: 'Zero Code Changes' removes implementation fear immediately",
        "Social proof with concrete numbers ('14,200+ engineers') anchors credibility"
      ]
    },
    {
      id: "emart-checkout",
      category: "E-Commerce Price Discovery CTA (BuyHatke / Smartprix)",
      beforeHeadline: "Check Product Prices and Specifications Online",
      beforeSub: "View phone details and buy from various online stores.",
      beforeConversion: "2.4% Click-Through Rate",
      afterHeadline: "Don't Overpay ₹12,400 on iPhone 16 Pro — Stack 6 Coupons + HDFC 5X Automatically",
      afterSub: "We scanned Amazon, Flipkart, Croma & Vijay Sales in 180ms. 91% probability this is the lowest price for the next 30 days.",
      afterConversion: "11.9% Click-Through Rate (+395% Lift)",
      annotations: [
        "Loss aversion hook: 'Don't Overpay ₹12,400' triggers immediate emotional urgency",
        "Quantified speed & breadth: '4 stores in 180ms' proves algorithmic value",
        "Confidence metric ('91% probability') eliminates buyer's remorse"
      ]
    }
  ]
};

