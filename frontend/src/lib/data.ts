"?"/**
 * Centralized portfolio content and knowledge store.
 * Master data file for Kunal Patel - AI Engineer & Automation Specialist.
 */

export const profile = {
  name: "Kunal Patel",
  title: "AI Engineer & Automation Specialist",
  tagline: "Building production multi-agent systems, computer vision models, and enterprise automation pipelines.",
  subtitle:
    "AI Engineer with an MSc in AI & Machine Learning. Specialized in multi-agent LLM orchestration (LangGraph, Groq LLaMA 3.3 70B, OpenAI, Gemini), RAG vector search pipelines, custom YOLOv8 computer vision models, and automated FastAPI backends with 40%+ efficiency gains.",
  email: "websitekunal@gmail.com",
  phone: "+91 84908 61586",
  location: "Ahmedabad, Gujarat, India",
  resumeUrl: "/resume.pdf",
  resumeAvailable: true,
  executiveSummary:
    "AI Engineer with proven track record of architecting 9+ production AI applications and SaaS platforms. Experienced in designing autonomous agent workforces, real-time computer vision workstations (PyTorch, YOLOv8, OpenCV), high-throughput FastAPI backends, and low-latency LLM inference architectures.",
  socials: {
    github: "https://github.com/KunalPatell",
    linkedin: "https://linkedin.com/in/kunalpatell",
    huggingface: "https://huggingface.co/Kunalptl777",
    portfolio: "https://kunal-portfolio-kunalpatells-projects.vercel.app",
  },
  metrics: [
    { value: "9+", label: "Production AI Platforms", detail: "End-to-end SaaS & AI apps" },
    { value: "40%+", label: "Manual Effort Reduction", detail: "Across enterprise operations" },
    { value: "120+", label: "Engineering Hours / Mo Saved", detail: "Through automated agents" },
    { value: "98%", label: "OCR & Extraction Accuracy", detail: "Sub-second turnaround" },
    { value: "-35%", label: "Model Inference Latency", detail: "Optimized FastAPI endpoints" },
    { value: "99.8%", label: "Workflow Reliability", detail: "Background task uptime" },
  ],
};

export const about = {
  headline: "AI Engineer who builds end-to-end systems, not just prompts.",
  paragraphs: [
    "I'm an AI Engineer with a Master of Science in Artificial Intelligence & Machine Learning from Sardar Patel University. My work focuses on shipping real, dependable AI products that automate high-friction workflows and solve complex enterprise problems.",
    "My technical portfolio spans autonomous multi-agent systems (LangGraph), vector-indexed RAG pipelines, real-time computer vision models (custom YOLOv8 defect detectors and OpenCV face recognition), and high-throughput FastAPI backends connecting to Next.js frontends.",
    "I architect systems from the ground up: designing data ingestion schemas, vector embeddings, tool-calling agent loops, zero-cost Bring-Your-Own-Key (BYOK) gateways, and enterprise webhooks that operate 24/7 with 99.8% reliability."
  ],
  highlights: [
    { label: "Degree", value: "MSc AI & ML" },
    { label: "Specialty", value: "Multi-Agent & CV" },
    { label: "Backbone", value: "FastAPI + Next.js" },
    { label: "Model Gateways", value: "Groq · OpenAI · Gemini" },
  ],
};

export type ResumeSection = {
  title: string;
  items: {
    primary: string;
    secondary?: string;
    meta?: string;
    badges?: string[];
    points?: string[];
  }[];
};

export const resume: ResumeSection[] = [
  {
    title: "Experience",
    items: [
      {
        primary: "AI-ML Engineer",
        secondary: "Capermint Technology, Ahmedabad",
        meta: "May 2026 – Present",
        badges: ["FastAPI", "Real-time AI", "Inference Optimization"],
        points: [
          "Architected real-time AI/ML game engines & dynamic NPC interaction behaviors, reducing inference latency by 35% on mobile and web platforms.",
          "Engineered telemetry-driven data pipelines and automated user engagement scoring models, increasing D1 user retention by 22%.",
          "Integrated high-throughput REST API microservices in FastAPI, seamlessly connecting ML inference endpoints with front-end game loops.",
        ],
      },
      {
        primary: "AI Engineer",
        secondary: "Elite Workforces Services, Ahmedabad",
        meta: "Dec 2025 – May 2026",
        badges: ["n8n", "LangChain", "LLM Gateways", "Python"],
        points: [
          "Spearheaded end-to-end enterprise process automation using Python, REST APIs, and n8n, saving 120+ manual engineering hours/month (~40% efficiency boost).",
          "Integrated multi-provider LLM fallback gateways (OpenAI, Groq) with automated retry handling and real-time dashboard analytics.",
          "Built custom performance analytics dashboards, translating raw workflow execution logs into actionable operational insights for client stakeholders.",
        ],
      },
      {
        primary: "AI Automation Engineer",
        secondary: "Sevenseed Technology, Ahmedabad",
        meta: "Dec 2024 – Nov 2025",
        badges: ["JSON Pipelines", "API Orchestration", "OCR & NLP", "n8n"],
        points: [
          "Engineered JSON API-driven automation engines compatible with n8n, Make, and Zapier, orchestrating micro-app workflows across 7+ SaaS platforms.",
          "Designed high-throughput AI automation pipelines and automated OCR/NLP data extraction tools using Python and n8n webhooks, processing 5,000+ daily operational requests.",
          "Standardized workflow error-handling protocols and API webhooks, ensuring 99.8% uptime across all automated background tasks.",
        ],
      },
    ],
  },
  {
    title: "Education",
    items: [
      {
        primary: "MSc in Artificial Intelligence & Machine Learning",
        secondary: "Sardar Patel University (SPU), Anand, Gujarat",
        meta: "Aug 2024 – Apr 2026",
        badges: ["Master's Degree", "Deep Learning", "CV & NLP"],
        points: [
          "Specialized coursework in deep learning architectures, computer vision, autonomous agents, predictive analytics, and real-world AI deployment."
        ],
      },
      {
        primary: "Bachelor of Computer Applications (BCA)",
        secondary: "Dharmsinh Desai University (DDU), Nadiad, Gujarat",
        meta: "Jun 2020 – Apr 2023",
        badges: ["Bachelor's Degree", "Software Engineering"],
        points: [
          "Rigorous foundational training in data structures, algorithms, database management systems (DBMS), software engineering, and web development."
        ],
      },
    ],
  },
  {
    title: "Certifications & Core Training",
    items: [
      {
        primary: "Artificial Intelligence & Machine Learning Specialization",
        secondary: "Advanced Deep Learning & Neural Architectures",
        meta: "Verified Specialization",
        badges: ["PyTorch", "TensorFlow"],
      },
      {
        primary: "Python for Data Science & Advanced Automation",
        secondary: "FastAPI, Data Pipelines & REST Orchestration",
        meta: "Professional Certificate",
        badges: ["FastAPI", "n8n"],
      },
      {
        primary: "Natural Language Processing & Cloud Foundations",
        secondary: "LLM Fine-Tuning, RAG & Vector Embeddings",
        meta: "Cloud & Vector Systems",
        badges: ["RAG", "ChromaDB"],
      },
    ],
  },
];

export type SkillItem = {
  name: string;
  level: number;
  experience: string;
  projectsBuilt: number;
  tags?: string[];
};

export type SkillCategoryGroup = {
  category: string;
  iconName: string;
  skills: SkillItem[];
};

export const skillGroups: SkillCategoryGroup[] = [
  {
    category: "LLM & Multi-Agent AI",
    iconName: "BrainCircuit",
    skills: [
      { name: "LangGraph (Multi-Agent)", level: 94, experience: "2 Yrs", projectsBuilt: 8, tags: ["Autonomous Agents", "Workflows"] },
      { name: "Groq LLaMA 3.3 70B", level: 96, experience: "2 Yrs", projectsBuilt: 9, tags: ["Low Latency", "Inference"] },
      { name: "OpenAI / GPT-4o API", level: 95, experience: "2.5 Yrs", projectsBuilt: 12, tags: ["Tool Calling", "Embeddings"] },
      { name: "Google Gemini API", level: 92, experience: "2 Yrs", projectsBuilt: 8, tags: ["Multimodal", "BYOK"] },
      { name: "RAG & Vector Search", level: 95, experience: "2 Yrs", projectsBuilt: 10, tags: ["ChromaDB", "FAISS"] },
      { name: "LangChain", level: 92, experience: "2 Yrs", projectsBuilt: 9, tags: ["Chains", "Memory"] },
      { name: "Prompt Engineering", level: 98, experience: "3 Yrs", projectsBuilt: 18, tags: ["Structured JSON", "Few-Shot"] },
    ],
  },
  {
    category: "Computer Vision & ML",
    iconName: "ScanFace",
    skills: [
      { name: "YOLOv8 Custom Models", level: 94, experience: "2 Yrs", projectsBuilt: 6, tags: ["Defect Scanner", "Occupancy"] },
      { name: "PyTorch & Deep Learning", level: 88, experience: "2 Yrs", projectsBuilt: 7, tags: ["Model Tuning", "CNNs"] },
      { name: "OpenCV", level: 95, experience: "2.5 Yrs", projectsBuilt: 8, tags: ["Face Recognition", "Mask Detection"] },
      { name: "Image Segmentation", level: 90, experience: "2 Yrs", projectsBuilt: 5, tags: ["Bounding Boxes", "Masks"] },
      { name: "OCR & Document AI", level: 96, experience: "2 Yrs", projectsBuilt: 8, tags: ["Prescription OCR", "PDFs"] },
      { name: "Scikit-Learn / ML", level: 92, experience: "3 Yrs", projectsBuilt: 12, tags: ["Classification", "Regression"] },
    ],
  },
  {
    category: "Full-Stack AI & Backend",
    iconName: "Layers",
    skills: [
      { name: "Python", level: 98, experience: "3.5 Yrs", projectsBuilt: 20, tags: ["Core Language", "AsyncIO"] },
      { name: "FastAPI", level: 95, experience: "2.5 Yrs", projectsBuilt: 14, tags: ["REST APIs", "Microservices"] },
      { name: "Next.js 15 & React", level: 92, experience: "2 Yrs", projectsBuilt: 10, tags: ["App Router", "SSR"] },
      { name: "TypeScript", level: 90, experience: "2 Yrs", projectsBuilt: 9, tags: ["Type Safety", "Interfaces"] },
      { name: "Tailwind CSS", level: 94, experience: "2.5 Yrs", projectsBuilt: 12, tags: ["Cyberpunk UI", "Glassmorphism"] },
      { name: "SQL & PostgreSQL", level: 90, experience: "3 Yrs", projectsBuilt: 11, tags: ["Relational DBs", "Queries"] },
      { name: "ChromaDB / Vector DBs", level: 92, experience: "2 Yrs", projectsBuilt: 8, tags: ["Cosine Search", "Embeddings"] },
    ],
  },
  {
    category: "Automation & Orchestration",
    iconName: "Workflow",
    skills: [
      { name: "n8n Workflow Automation", level: 96, experience: "2 Yrs", projectsBuilt: 15, tags: ["Webhooks", "JSON Nodes"] },
      { name: "API & Webhook Integrations", level: 96, experience: "3 Yrs", projectsBuilt: 18, tags: ["REST", "OAuth"] },
      { name: "Make / Zapier Automation", level: 92, experience: "2 Yrs", projectsBuilt: 10, tags: ["SaaS Pipelines", "ETL"] },
      { name: "Git / GitHub DevOps", level: 94, experience: "3.5 Yrs", projectsBuilt: 22, tags: ["Version Control", "CI/CD"] },
      { name: "Docker & Deployment", level: 88, experience: "2 Yrs", projectsBuilt: 8, tags: ["Containers", "Render / Vercel"] },
      { name: "Cursor & AI Coding", level: 98, experience: "2 Yrs", projectsBuilt: 20, tags: ["Rapid Prototyping", "Speed"] },
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  architecture: string[];
  impactMetrics: { label: string; value: string }[];
  features: string[];
  techStack: string[];
  status: "Live" | "Production" | "Prototype";
  liveUrl?: string;
  githubUrl?: string;
  huggingFaceUrl?: string;
  image: string;
  accent: string;
  isStartupVenture?: boolean;
};

export const projects: Project[] = [
  {
    id: "rakshak-ai",
    title: "Rakshak AI",
    category: "AI Public Safety & Vision Suite",
    description:
      "5-in-1 AI public safety and smart policing platform designed for citizen assistance and law enforcement operations. Combines automatic FIR generation with Bharatiya Nyaya Sanhita (BNS/IPC) legal code recommendations, multilingual AI chatbot, cybercrime scam analyzer, emergency SOS geolocation dispatch, and Computer Vision workstations for PPE mask scanning, facial attendance verification, and YOLO chair/occupancy detection.",
    architecture: [
      "BNS/IPC Legal Vector RAG indexing complete Indian Penal Code & Sanhita laws",
      "Real-time PyTorch & OpenCV Computer Vision workstation pipelines",
      "FastAPI asynchronous backend with sub-second legal query resolution",
      "Multilingual natural language translation and speech synthesis interface"
    ],
    impactMetrics: [
      { label: "Legal Recommendation Time", value: "< 1.2s" },
      { label: "Vision Processing Rate", value: "30+ FPS" },
      { label: "Integrated Modules", value: "5 in 1" },
    ],
    features: [
      "Automatic FIR (BNS/IPC Legal Codes)",
      "Multilingual AI Citizen Chatbot",
      "Cybercrime & Scam URL Analyzer",
      "Emergency Geolocation Dispatch",
      "PPE Mask Scanner & Face Recognition",
      "YOLO Chair Occupancy Detection"
    ],
    techStack: ["Python", "FastAPI", "BNS Legal RAG", "YOLOv8", "OpenCV", "PyTorch", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/rakshak-ai/",
    githubUrl: "https://github.com/KunalPatell/rakshak-ai",
    huggingFaceUrl: "https://huggingface.co/Kunalptl777",
    accent: "from-red-500/20 to-amber-400/10",
    image: "/projects/rakshak-ai.svg",
  },
  {
    id: "sevenseed-platform",
    title: "Sevenseed Ecosystem",
    category: "AI Venture Studio & Multi-Agent Hub",
    description:
      "AI-native venture studio platform orchestrating 9 autonomous startup ventures across edtech, healthtech, contech, career guidance, and social impact. Features a shared vector RAG + multi-agent LangGraph backend, sub-second Groq LLaMA 3.3 70B inference, and Bring-Your-Own-Key (BYOK) zero-cost architecture.",
    architecture: [
      "LangGraph stateful multi-agent DAG engine orchestrating cross-venture tools",
      "ChromaDB persistent vector store for unified knowledge retrieval",
      "Client-side encrypted BYOK key manager for Groq, Gemini & OpenAI",
      "Dockerized microservice deployment with 99.8% background uptime"
    ],
    impactMetrics: [
      { label: "Integrated Startups", value: "9 Ventures" },
      { label: "Inference Latency", value: "< 800ms" },
      { label: "Client Cost Overhead", value: "$0 (BYOK)" },
    ],
    features: [
      "Multi-Agent Venture Orchestration",
      "Shared Vector RAG Backbone",
      "Zero-Cost BYOK Key Integration",
      "2-Week MVP Sprint Architecture",
      "Stateful Session Recovery"
    ],
    techStack: ["LangGraph", "Groq LLaMA 3.3 70B", "FastAPI", "ChromaDB", "Next.js 15", "Docker"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com",
    githubUrl: "https://github.com/KunalPatell/sevenforce-ai",
    accent: "from-violet-500/20 to-emerald-400/10",
    image: "/projects/rag-assistant.svg",
    isStartupVenture: true,
  },
  {
    id: "comonk-ai",
    title: "Comonk Technology",
    category: "AI Career Intelligence",
    description:
      "Enterprise 32-panel AI career guidance ecosystem — multi-agent LangGraph counselors, ATS semantic resume optimizer, real-time voice & video mock interview simulator with PDF scoring feedback, salary intelligence, and corporate skill gap matching.",
    architecture: [
      "Multi-Agent LangGraph committee (CV Parser, Tone Polisher, JD Matcher)",
      "Cosine similarity vector scoring matching applicant profiles to job listings",
      "Web Audio & Speech API integration for interactive mock interviewer voice loops",
      "Instant printable evaluation PDF report generator"
    ],
    impactMetrics: [
      { label: "ATS Resume Parse Speed", value: "< 2s" },
      { label: "Mock Interview Dimensions", value: "8 Criteria" },
      { label: "UI Feature Panels", value: "32 Panels" },
    ],
    features: [
      "Multi-Agent LangGraph Counseling",
      "ATS Semantic Resume Optimizer",
      "Interactive Mock Interview Simulator",
      "Printable PDF Feedback Reports",
      "Salary & Career Tree Intelligence"
    ],
    techStack: ["Python", "FastAPI", "LangGraph", "ChromaDB", "Groq API", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/comonk-ai/",
    githubUrl: "https://github.com/KunalPatell/comonk-ai",
    accent: "from-purple-500/20 to-indigo-400/10",
    image: "/projects/rag-assistant.svg",
    isStartupVenture: true,
  },
  {
    id: "sevenforce",
    title: "Sevenforce Automation",
    category: "AI Autonomous Workforce",
    description:
      "Autonomous 7-agent AI workforce dock and enterprise sales CRM. Features autonomous agent personas (Maya, Sales Bot, Lead Qualification Agent, Meeting Transcriber, Email Dispatcher) automating B2B customer pipelines and operational task flows.",
    architecture: [
      "7-agent autonomous state machine handling scheduled lead qualification",
      "Webhook-driven CRM data synchronization across n8n, Make, and PostgreSQL",
      "Real-time event streaming pipeline logging agent decisions transparently"
    ],
    impactMetrics: [
      { label: "Autonomous Agent Roles", value: "7 Agents" },
      { label: "Lead Response Time", value: "< 15s" },
      { label: "Hours Saved / Month", value: "120+ Hrs" },
    ],
    features: [
      "7-Agent Autonomous Workforce Dock",
      "Automated Lead Scoring CRM",
      "AI Email & Meeting Dispatcher",
      "Business Process Intelligence",
      "Real-time Decision Telemetry"
    ],
    techStack: ["Python", "FastAPI", "LangGraph", "n8n", "PostgreSQL", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/sevenforce/",
    githubUrl: "https://github.com/KunalPatell/sevenforce-ai",
    accent: "from-blue-500/20 to-cyan-400/10",
    image: "/projects/ai-automation-agents.svg",
    isStartupVenture: true,
  },
  {
    id: "breakdown-factor",
    title: "Breakdown Factor",
    category: "AI Construction & Defect Vision",
    description:
      "AI construction technology platform featuring custom-trained YOLOv8 computer vision model (best.pt) for real-time 10+ category structural defect detection (wall cracks, pipe leaks, tile damages, spalling), OSHA safety compliance auditor, and automated BOQ material cost estimator.",
    architecture: [
      "Custom fine-tuned YOLOv8 PyTorch model (best.pt) for defect segmentation",
      "IS-456 compliant structural BOQ mathematical engine for concrete/steel volume",
      "Interactive blueprint diagnostic overlay generator in OpenCV"
    ],
    impactMetrics: [
      { label: "Defect Classes Detected", value: "10+ Types" },
      { label: "Inference Speed", value: "45ms/frame" },
      { label: "BOQ Estimation Speed", value: "Instant" },
    ],
    features: [
      "YOLOv8 Structural Defect Detection",
      "Wall Crack & Pipe Leak Classifier",
      "Smart BOQ Concrete & Steel Calculator",
      "OSHA Safety Compliance Auditor",
      "Printable Inspection PDF Reports"
    ],
    techStack: ["YOLOv8 (best.pt)", "PyTorch", "OpenCV", "FastAPI", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/breakdown/",
    githubUrl: "https://github.com/KunalPatell/breakdown-factor-ai",
    accent: "from-amber-500/20 to-orange-400/10",
    image: "/projects/lcb-face-matcher.svg",
    isStartupVenture: true,
  },
  {
    id: "avpu",
    title: "AVP University (AVPU)",
    category: "AI EdTech & Cognitive Tutor",
    description:
      "AI-native digital university platform — personal AI cognitive tutor offering adaptive 1-on-1 tutoring, syllabus Q&A over loaded course curricula, automated assessment engine with weakness targeting, and corporate placement matcher.",
    architecture: [
      "RAG document indexing university course syllabi and textbook chapters",
      "Dynamic quiz generator adapting question difficulty based on student error history",
      "Cosine distance matcher sorting student profiles to corporate job requisitions"
    ],
    impactMetrics: [
      { label: "Syllabus Retrieval Accuracy", value: "96%" },
      { label: "Assessment Index", value: "0-10 Scale" },
      { label: "Cost Per Student", value: "$0 (BYOK)" },
    ],
    features: [
      "Personal AI Cognitive Tutor",
      "Adaptive Assessment Quiz Engine",
      "Curriculum RAG Assistant",
      "Corporate Placement Matcher",
      "Personalized Study Roadmap"
    ],
    techStack: ["Python", "FastAPI", "LangChain", "ChromaDB", "Groq LLaMA 3.3", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/avpu/",
    githubUrl: "https://github.com/KunalPatell/avp-charitable-trust-ai",
    accent: "from-sky-500/20 to-blue-400/10",
    image: "/projects/bestseller-analytics.svg",
    isStartupVenture: true,
  },
  {
    id: "decode-forest-pharmacy",
    title: "Decode Forest Pharmacy",
    category: "AI HealthTech & OTC Guidance",
    description:
      "Free 24/7 AI pharmacy and health guidance platform — prescription OCR reader extracting medication regimens, drug-to-drug contraindication safety checker, emergency 24/7 hospital & blood bank geolocation finder, and generic medicine cost optimizer.",
    architecture: [
      "Tesseract & NLP OCR data extraction converting prescription images to structured doses",
      "Drug interaction rules engine checking dangerous pharmacological contraindications",
      "Geo-spatial distance lookup for emergency healthcare facilities"
    ],
    impactMetrics: [
      { label: "Prescription OCR Time", value: "< 1.8s" },
      { label: "Contraindication Coverage", value: "Comprehensive" },
      { label: "Availability", value: "24/7 Free" },
    ],
    features: [
      "OCR Prescription Regimen Scanner",
      "Drug Interaction & Safety Checker",
      "Emergency Hospital & Blood Bank Finder",
      "Lower-Cost Generic Medicine Recommender",
      "Dosage Refill Calendar Predictor"
    ],
    techStack: ["Python", "FastAPI", "OCR", "NLP", "ChromaDB", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/pharmacy/",
    githubUrl: "https://github.com/KunalPatell/decode-forest-pharmacy-ai",
    accent: "from-emerald-500/20 to-teal-400/10",
    image: "/projects/face-mask-detection.svg",
    isStartupVenture: true,
  },
  {
    id: "avp-charitable-trust",
    title: "AVP Charitable Trust",
    category: "AI Social Impact",
    description:
      "100% free non-profit AI social welfare platform — matches citizen welfare needs to active community welfare programs, generates verified 80G tax-exempt PDF donation receipts with PAN verification, detects funding allocation anomalies, and delivers transparent public ledger reporting.",
    architecture: [
      "Semantic distance matcher pairing beneficiary applications to NGO relief funds",
      "Automated PDF tax receipt generator with digital signature verification",
      "Public fund disbursement transparency ledger"
    ],
    impactMetrics: [
      { label: "Service Cost to Citizens", value: "100% Free" },
      { label: "80G Tax Receipt Output", value: "Instant PDF" },
      { label: "Beneficiary Matching", value: "Semantic" },
    ],
    features: [
      "AI Citizen Beneficiary Matching",
      "Instant 80G Tax PDF Receipt Generator",
      "Transparent Public Ledger Dashboard",
      "CSR Grant Proposal Assistant",
      "Community Welfare Needs Anomaly Detector"
    ],
    techStack: ["Python", "FastAPI", "LangGraph", "ChromaDB", "Groq LLaMA 3.3", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/trust/",
    githubUrl: "https://github.com/KunalPatell/avp-charitable-trust-ai",
    accent: "from-pink-500/20 to-rose-400/10",
    image: "/projects/avp-charitable-trust.svg",
    isStartupVenture: true,
  },
  {
    id: "avp-emart",
    title: "AVP Emart & Price Comparator",
    category: "AI E-Commerce & Price Intelligence",
    description:
      "Multi-source e-commerce price comparison and market intelligence engine — cross-references real-time pricing across Amazon, Flipkart, Reliance Digital, and Snapdeal with ML deal valuation scoring, automated price drop alert notifications, and historical trend analysis.",
    architecture: [
      "Asynchronous web scraping pipelines gathering multi-retailer inventory",
      "Z-score statistical positioning model evaluating true discount values",
      "SQLite price history persistence engine triggering webhook notifications"
    ],
    impactMetrics: [
      { label: "Tracked E-Commerce Stores", value: "4 Retailers" },
      { label: "Price Comparison Delay", value: "< 2s" },
      { label: "Deal Scoring Precision", value: "ML-Ranked" },
    ],
    features: [
      "4-Store Live Price Comparison",
      "ML Deal Value Scoring & Ranking",
      "Automated Price Drop Alert Alarms",
      "Review Sentiment & Pros/Cons Parser",
      "Historical Price Trend Analysis"
    ],
    techStack: ["Python", "FastAPI", "Web Scraping", "ML Scoring", "SQLite", "Next.js"],
    status: "Live",
    liveUrl: "https://sevenseed.onrender.com/avp-emart/",
    githubUrl: "https://github.com/KunalPatell/price-comparator",
    accent: "from-orange-500/20 to-yellow-400/10",
    image: "/projects/ai-price-comparator.svg",
    isStartupVenture: true,
  },
  {
    id: "lcb-face-matcher",
    title: "LCB Face Matcher",
    category: "Biometric Computer Vision",
    description:
      "AI-assisted facial similarity matching and biometric verification system engineered for investigation support workflows. Utilizes deep face embeddings and cosine metric distance to identify matched suspect profiles with high confidence.",
    architecture: [
      "Deep convolutional embedding extractor generating 512-dim facial vectors",
      "High-speed cosine distance comparator indexing target suspect databases",
      "Interactive threshold sensitivity controller"
    ],
    impactMetrics: [
      { label: "Embedding Extraction Speed", value: "35ms" },
      { label: "Face Vector Dimension", value: "512-D" },
      { label: "Deployment Platform", value: "Hugging Face" },
    ],
    features: [
      "Biometric Face Similarity Matching",
      "Deep Facial Feature Embeddings",
      "Threshold & Confidence Scoring",
      "Batch Image Investigation Search"
    ],
    techStack: ["Python", "OpenCV", "PyTorch", "Streamlit", "Hugging Face"],
    status: "Live",
    liveUrl: "https://huggingface.co/spaces/Kunalptl777/lcb-face-matcher",
    huggingFaceUrl: "https://huggingface.co/spaces/Kunalptl777/lcb-face-matcher",
    githubUrl: "https://github.com/KunalPatell/lcb-face-matcher",
    accent: "from-cyan-500/20 to-blue-400/10",
    image: "/projects/lcb-face-matcher.svg",
  },
  {
    id: "face-mask-detection",
    title: "Face Mask & PPE Detection",
    category: "Real-Time Computer Vision",
    description:
      "Real-time PPE safety compliance and face mask detection suite using deep convolutional networks. Processes live webcam feeds and CCTV video streams with bounding box classification and compliance alarms.",
    architecture: [
      "Two-phase detector: Haar/SSD face region localization + CNN mask classifier",
      "Frame-level compliance analytics logger with anomaly alarm triggers"
    ],
    impactMetrics: [
      { label: "Detection Frame Rate", value: "30+ FPS" },
      { label: "Classification Accuracy", value: "98.5%" },
      { label: "Deployment Platform", value: "Hugging Face" },
    ],
    features: [
      "Live Webcam Video Stream Processing",
      "Dual-Class (Mask / No-Mask) Classification",
      "Real-time Visual Bounding Boxes",
      "PPE Compliance Alert Logger"
    ],
    techStack: ["PyTorch", "OpenCV", "Deep Learning", "Streamlit", "Hugging Face"],
    status: "Live",
    liveUrl: "https://huggingface.co/spaces/Kunalptl777/face-mask-detection",
    huggingFaceUrl: "https://huggingface.co/spaces/Kunalptl777/face-mask-detection",
    githubUrl: "https://github.com/KunalPatell/mask-detection",
    accent: "from-teal-500/20 to-emerald-400/10",
    image: "/projects/face-mask-detection.svg",
  },
  {
    id: "bestseller-analytics",
    title: "Bestseller Analytics Dashboard",
    category: "Business Intelligence & ML",
    description:
      "Interactive data analytics and predictive insights dashboard analyzing bestseller consumer products, sales distributions, pricing elasticity, and customer rating trends.",
    architecture: [
      "Pandas & NumPy data aggregation engine processing multi-thousand product records",
      "Interactive Plotly visualization charts with automated correlation insights"
    ],
    impactMetrics: [
      { label: "Processed Data Records", value: "50,000+" },
      { label: "Interactive Visualizations", value: "12 Charts" },
      { label: "Deployment Platform", value: "Hugging Face" },
    ],
    features: [
      "Interactive Sales & Price Distributions",
      "Product Rating Correlation Charts",
      "Pricing Elasticity & Margin Insights",
      "Real-time Filter & Export System"
    ],
    techStack: ["Python", "Pandas", "Plotly", "Streamlit", "Hugging Face"],
    status: "Live",
    liveUrl: "https://huggingface.co/spaces/Kunalptl777/bestseller-analytics",
    huggingFaceUrl: "https://huggingface.co/spaces/Kunalptl777/bestseller-analytics",
    githubUrl: "https://github.com/KunalPatell/bestseller-analytics",
    accent: "from-indigo-500/20 to-purple-400/10",
    image: "/projects/bestseller-analytics.svg",
  },
];

export const certifications: { title: string; tag: string; issuer?: string }[] = [
  { title: "Artificial Intelligence & Deep Learning", tag: "AI / Deep Learning", issuer: "Specialization" },
  { title: "Machine Learning & Statistical Modeling", tag: "ML / Algorithms", issuer: "Specialization" },
  { title: "Python for Data Science & Automation", tag: "Python / FastAPI", issuer: "Certification" },
  { title: "Natural Language Processing & RAG", tag: "NLP / Vector DBs", issuer: "Foundations" },
  { title: "Computer Vision & Object Detection", tag: "YOLO / OpenCV", issuer: "Practical AI" },
  { title: "Cloud Architecture & Workflow Automation", tag: "n8n / Docker / Cloud", issuer: "DevOps & Cloud" },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Ventures", href: "#ventures" },
  { label: "Projects", href: "#projects" },
  { label: "ATS Matcher", href: "#ats-matcher" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const aiSuggestions = [
  "Explain Kunal's 9-startup Sevenseed multi-agent architecture",
  "How does Rakshak AI generate FIR legal codes with BNS?",
  "What was Kunal's impact at Capermint and Elite Workforce?",
  "Show Computer Vision and YOLOv8 defect detection projects",
  "Why hire Kunal Patel as an AI / Automation Engineer?",
];

// ATS Matcher Presets
export const atsPresets = [
  {
    title: "Senior AI Engineer (LLM & Agents)",
    text: "We are seeking a Senior AI Engineer experienced in building production LLM applications, autonomous multi-agent systems using LangGraph or LangChain, RAG vector pipelines with ChromaDB or FAISS, and high-performance FastAPI backends. Strong proficiency in Python, prompt engineering, OpenAI/Gemini/LLaMA APIs, and deploying production AI systems is required.",
  },
  {
    title: "Computer Vision & ML Developer",
    text: "Looking for an AI/ML Engineer with deep expertise in Computer Vision, OpenCV, PyTorch, and YOLO object detection models. Experience fine-tuning custom YOLO models, image segmentation, biometric face recognition, PPE safety monitoring, and building real-time inference microservices.",
  },
  {
    title: "AI Automation & Workflow Architect",
    text: "Hiring an AI Automation Specialist skilled in building autonomous workflows, n8n, Make, REST API webhooks, JSON data extraction, OCR pipelines, and connecting enterprise software with intelligent LLM fallback systems to eliminate manual effort and increase operational efficiency.",
  },
  {
    title: "Full-Stack AI Software Engineer",
    text: "Seeking a Full-Stack AI Developer comfortable across the entire stack: Python, FastAPI REST microservices, Next.js 15, TypeScript, React, Tailwind CSS, PostgreSQL, Vector Databases, and containerized Docker deployments with modern UI/UX design.",
  },
];

export function isPlaceholderUrl(url?: string) {
  if (!url) return true;
  return url === "https://github.com/" || url === "https://kunalpatel.dev";
}

export function resumeAction() {
  if (profile.resumeAvailable) {
    return {
      href: profile.resumeUrl,
      label: "Download V7 Resume",
      external: true,
      note: "Executive ATS-optimized PDF resume.",
    };
  }

  return {
    href: `mailto:${profile.email}?subject=Resume%20request%20-%20Kunal%20Patel`,
    label: "Request Resume",
    external: false,
    note: "Email Kunal for the latest copy.",
  };
}

export const experiences = [
  {
    role: "AI-ML Engineer",
    company: "Capermint Technology, Ahmedabad",
    period: "May 2026 – Present",
    metrics: "-35% Inference Latency | +22% Retention",
    highlights: [
      "Architected real-time AI/ML game engines & dynamic NPC interaction behaviors, reducing inference latency by 35% on mobile and web platforms.",
      "Engineered telemetry-driven data pipelines and automated user engagement scoring models, increasing D1 user retention by 22%.",
      "Integrated high-throughput REST API microservices in FastAPI, seamlessly connecting ML inference endpoints with front-end game loops.",
    ],
  },
  {
    role: "AI Engineer",
    company: "Elite Workforces Services, Ahmedabad",
    period: "Dec 2025 – May 2026",
    metrics: "40%+ Processes Automated | 120+ Hrs/Mo Saved",
    highlights: [
      "Spearheaded end-to-end enterprise process automation using Python, REST APIs, and n8n, saving 120+ manual engineering hours/month (~40% efficiency boost).",
      "Integrated multi-provider LLM fallback gateways (OpenAI, Groq) with automated retry handling and real-time dashboard analytics.",
      "Built custom performance analytics dashboards, translating raw workflow execution logs into actionable operational insights for client stakeholders.",
    ],
  },
  {
    role: "AI Automation Engineer",
    company: "Sevenseed Technology, Ahmedabad",
    period: "Dec 2024 – Nov 2025",
    metrics: "5,000+ Daily Requests | 99.8% Reliability",
    highlights: [
      "Engineered JSON API-driven automation engines compatible with n8n, Make, and Zapier, orchestrating micro-app workflows across 7+ SaaS platforms.",
      "Designed high-throughput AI automation pipelines and automated OCR/NLP data extraction tools using Python and n8n webhooks, processing 5,000+ daily operational requests.",
      "Standardized workflow error-handling protocols and API webhooks, ensuring 99.8% uptime across all automated background tasks.",
    ],
  },
];
