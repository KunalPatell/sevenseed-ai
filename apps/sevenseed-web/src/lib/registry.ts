// Curated map of the Super-Suite's tools, grouped by domain. Forms are generated
// from the live OpenAPI schema (see schema.ts) — this file only supplies the
// human framing: which endpoint, its friendly name, blurb, icon, and group.
//
// Every path here was verified reachable against the running backend (all
// return 200 or a 422 validation, never 500).

export interface Tool {
  path: string;
  method: "GET" | "POST";
  label: string;
  desc: string;
  icon: string; // Font Awesome 6 class (without the "fas ")
}

export interface Group {
  id: string;
  label: string;
  icon: string;
  accent: string; // hex
  tools: Tool[];
}

export const GROUPS: Group[] = [
  {
    id: "career",
    label: "Career Intelligence",
    icon: "fa-briefcase",
    accent: "#8b5cf6",
    tools: [
      { path: "/api/career-roadmap", method: "POST", label: "Career Roadmap", desc: "A personalised skill-by-skill roadmap to your target role.", icon: "fa-route" },
      { path: "/api/mock-interview", method: "POST", label: "Mock Interview", desc: "Role-specific interview questions to practise with.", icon: "fa-comments" },
      { path: "/api/ats-optimize", method: "POST", label: "ATS Optimizer", desc: "Rewrites a resume to pass applicant-tracking systems.", icon: "fa-file-circle-check" },
      { path: "/api/linkedin-optimize", method: "POST", label: "LinkedIn Optimizer", desc: "Sharpens your LinkedIn About section for a target role.", icon: "fa-linkedin" },
      { path: "/api/analyze-jd", method: "POST", label: "JD Analyzer", desc: "Matches your skills to a job description and flags gaps.", icon: "fa-magnifying-glass-chart" },
      { path: "/api/cover-letter", method: "POST", label: "Cover Letter Writer", desc: "Drafts a tailored cover letter for a specific role.", icon: "fa-envelope-open-text" },
      { path: "/api/cheat-sheet", method: "POST", label: "Tech Cheat Sheet", desc: "A quick-reference cheat sheet for any technology + level.", icon: "fa-layer-group" },
      { path: "/api/visual-roadmap", method: "POST", label: "Visual Learning Roadmap", desc: "A time-boxed learning plan for a role.", icon: "fa-diagram-project" },
      { path: "/api/grammar-check", method: "POST", label: "Grammar Check", desc: "Cleans up any text, in your chosen language.", icon: "fa-spell-check" },
      { path: "/api/salary-insights", method: "GET", label: "Salary Insights", desc: "Live salary benchmarks across roles.", icon: "fa-indian-rupee-sign" },
      { path: "/api/live-jobs", method: "GET", label: "Live Jobs", desc: "Current job openings feed.", icon: "fa-list-check" },
      { path: "/api/free-resources", method: "GET", label: "Free Learning Resources", desc: "Curated free courses & material.", icon: "fa-graduation-cap" },
    ],
  },
  {
    id: "growth",
    label: "Growth & Outreach",
    icon: "fa-rocket",
    accent: "#06b6d4",
    tools: [
      { path: "/api/outreach/verify-email", method: "POST", label: "Email Deliverability", desc: "MX + SMTP check before you send cold email.", icon: "fa-at" },
      { path: "/api/outreach/sequence", method: "POST", label: "Outreach Sequence", desc: "A 3-step multi-channel cold outreach drip.", icon: "fa-diagram-successor" },
      { path: "/api/ba/prd", method: "POST", label: "PRD / BRD Generator", desc: "Turns a concept into a structured product/requirements doc.", icon: "fa-file-lines" },
      { path: "/api/ads/campaign", method: "POST", label: "Ad Campaign Builder", desc: "Plans an ad campaign with impression & CTR estimates.", icon: "fa-bullhorn" },
      { path: "/api/ads/analytics", method: "GET", label: "Ad Analytics", desc: "Campaign impressions, CTR and revenue overview.", icon: "fa-chart-column" },
    ],
  },
  {
    id: "sales",
    label: "Sales & CRM",
    icon: "fa-chart-line",
    accent: "#22c55e",
    tools: [
      { path: "/api/crm/lead", method: "POST", label: "Capture Lead", desc: "Score and file a new lead into the pipeline.", icon: "fa-user-plus" },
      { path: "/api/crm/leads", method: "GET", label: "Pipeline Overview", desc: "Pipeline stages, deal count and forecast value.", icon: "fa-filter" },
      { path: "/api/deals/radar", method: "GET", label: "Deal Radar", desc: "Cloud credits, coupons and discount alerts.", icon: "fa-tags" },
    ],
  },
  {
    id: "hiring",
    label: "Hiring & HR",
    icon: "fa-user-tie",
    accent: "#f59e0b",
    tools: [
      { path: "/api/hiring/questions", method: "POST", label: "Interview Kit", desc: "Role + level based technical interview questions.", icon: "fa-clipboard-question" },
      { path: "/api/hiring/evaluate", method: "POST", label: "Answer Evaluator", desc: "Scores a candidate answer across 7 dimensions.", icon: "fa-ranking-star" },
      { path: "/api/jobs/match", method: "POST", label: "Urgent Job Matcher", desc: "Fast-track skill-to-job matching.", icon: "fa-bolt" },
      { path: "/api/exam/practice", method: "POST", label: "Exam Practice", desc: "Generates a practice section for any exam.", icon: "fa-pen-to-square" },
      { path: "/api/attendance/check-in", method: "POST", label: "Attendance Check-in", desc: "Log an employee check-in with location.", icon: "fa-clock" },
      { path: "/api/attendance/summary", method: "GET", label: "Attendance Summary", desc: "Team presence & monthly attendance rate.", icon: "fa-users" },
    ],
  },
  {
    id: "biz",
    label: "Meetings, Docs & Support",
    icon: "fa-file-signature",
    accent: "#a855f7",
    tools: [
      { path: "/api/meeting/summarize", method: "POST", label: "Meeting Notetaker", desc: "Summary + decisions + owner-tagged action items from a transcript.", icon: "fa-microphone-lines" },
      { path: "/api/meetair/create-room", method: "POST", label: "AI Meeting Room", desc: "Spin up a WebRTC room with an AI notetaker.", icon: "fa-video" },
      { path: "/api/quiz/generate", method: "POST", label: "Quiz Generator", desc: "Topic-based multiple-choice quiz with scoring.", icon: "fa-circle-question" },
      { path: "/api/support/ticket", method: "POST", label: "Support Ticket", desc: "File a ticket with auto category, priority & SLA.", icon: "fa-headset" },
      { path: "/api/support/tickets", method: "GET", label: "Support Dashboard", desc: "Open vs resolved tickets and avg resolution.", icon: "fa-life-ring" },
      { path: "/api/startup/pitch", method: "POST", label: "Pitch Builder", desc: "Turns your idea into an investor-ready pitch outline.", icon: "fa-lightbulb" },
    ],
  },
  {
    id: "fintech",
    label: "Fintech",
    icon: "fa-wallet",
    accent: "#14b8a6",
    tools: [
      { path: "/api/wallet/transact", method: "POST", label: "Wallet Transaction", desc: "Credit/debit against a micro-wallet ledger.", icon: "fa-money-bill-transfer" },
      { path: "/api/wallet/balance", method: "GET", label: "Wallet Balance", desc: "Current balance and recent activity.", icon: "fa-piggy-bank" },
      { path: "/api/rewards/redeem", method: "POST", label: "Redeem Rewards", desc: "Redeem loyalty points for value.", icon: "fa-gift" },
      { path: "/api/rewards/points", method: "GET", label: "Rewards Balance", desc: "Loyalty points and tier status.", icon: "fa-star" },
      { path: "/api/insurance/compare", method: "POST", label: "Insurance Compare", desc: "Side-by-side policy comparison.", icon: "fa-shield-halved" },
      { path: "/api/crypto/prices", method: "GET", label: "Crypto Prices", desc: "Live token price tracker.", icon: "fa-coins" },
    ],
  },
  {
    id: "commerce",
    label: "Commerce & Local",
    icon: "fa-store",
    accent: "#fb923c",
    tools: [
      { path: "/api/food/order", method: "POST", label: "Food Order", desc: "Place a food-delivery order.", icon: "fa-burger" },
      { path: "/api/grocery/order", method: "POST", label: "Grocery Order", desc: "Express grocery basket checkout.", icon: "fa-basket-shopping" },
      { path: "/api/beverage/search", method: "POST", label: "Beverage Catalog", desc: "Search a beverage catalogue.", icon: "fa-wine-bottle" },
      { path: "/api/tailor/order", method: "POST", label: "Custom Tailoring", desc: "Place a made-to-measure apparel order.", icon: "fa-scissors" },
      { path: "/api/beauty/book", method: "POST", label: "Salon Booking", desc: "Book a beauty / salon appointment.", icon: "fa-spa" },
      { path: "/api/merchant/inventory", method: "POST", label: "Merchant Inventory", desc: "Update local merchant stock.", icon: "fa-boxes-stacked" },
      { path: "/api/milk/subscribe", method: "POST", label: "Milk Subscription", desc: "Set up a recurring daily-milk plan.", icon: "fa-bottle-droplet" },
    ],
  },
  {
    id: "mobility",
    label: "Mobility & Logistics",
    icon: "fa-truck-fast",
    accent: "#38bdf8",
    tools: [
      { path: "/api/taxi/book", method: "POST", label: "Book a Taxi", desc: "Dispatch a ride between two points.", icon: "fa-taxi" },
      { path: "/api/fleet/route", method: "POST", label: "Fleet Routing", desc: "Optimise a delivery route across stops.", icon: "fa-route" },
      { path: "/api/courier/dispatch", method: "POST", label: "Courier Dispatch", desc: "Create and dispatch a courier job.", icon: "fa-box" },
      { path: "/api/hotel/reserve", method: "POST", label: "Hotel Reservation", desc: "Reserve a room for given dates.", icon: "fa-hotel" },
      { path: "/api/taxi/status", method: "GET", label: "Ride Status", desc: "Live status of active rides.", icon: "fa-location-crosshairs" },
    ],
  },
  {
    id: "health",
    label: "Health & Social Impact",
    icon: "fa-heart-pulse",
    accent: "#f43f5e",
    tools: [
      { path: "/api/bloodbank/request", method: "POST", label: "Blood Request", desc: "Raise a blood-availability request by group.", icon: "fa-droplet" },
      { path: "/api/bloodbank/inventory", method: "GET", label: "Blood Inventory", desc: "Current blood-group availability.", icon: "fa-vial" },
      { path: "/api/donor/match", method: "POST", label: "Donor Matcher", desc: "Match donors to a beneficiary need.", icon: "fa-hand-holding-heart" },
      { path: "/api/fitness/log", method: "POST", label: "Fitness Log", desc: "Log a workout / activity.", icon: "fa-dumbbell" },
      { path: "/api/carwash/book", method: "POST", label: "Car Wash Booking", desc: "Book a car wash / detailing slot.", icon: "fa-car" },
    ],
  },
  {
    id: "realestate",
    label: "Real Estate",
    icon: "fa-building",
    accent: "#eab308",
    tools: [
      { path: "/api/realestate/estimate", method: "POST", label: "Property Estimate", desc: "Estimate a property's value.", icon: "fa-house-chimney" },
      { path: "/api/realestate/properties", method: "GET", label: "Listings", desc: "Browse available property listings.", icon: "fa-map-location-dot" },
    ],
  },
  {
    id: "creative",
    label: "Creative AI",
    icon: "fa-wand-magic-sparkles",
    accent: "#e879f9",
    tools: [
      { path: "/api/ai3d/generate", method: "POST", label: "3D Asset Brief", desc: "Generate a spec/brief for a 3D game asset.", icon: "fa-cube" },
      { path: "/api/lobby/create", method: "POST", label: "Game Lobby", desc: "Create a multiplayer game lobby.", icon: "fa-gamepad" },
    ],
  },
];

export const TOTAL_TOOLS = GROUPS.reduce((n, g) => n + g.tools.length, 0);
