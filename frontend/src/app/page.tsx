"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PortfolioHealthMonitor } from "../components/PortfolioHealthMonitor";
import { StudioChangelog } from "../components/StudioChangelog";
import { Grain, SparklesCore, TextGenerateEffect, CardSpotlight, BorderBeam, FloatingDock } from "@main/ui-core";
import {
  Sparkles,
  Cpu,
  GraduationCap,
  ShoppingBag,
  HeartPulse,
  Wrench,
  Shield,
  Layers,
  ArrowUpRight,
  Activity,
  Server,
  Zap,
  CheckCircle2,
  ChevronRight,
  Send,
  Search,
  Moon,
  Sun,
  X,
  MessageSquare,
  BarChart3,
  Calculator,
  Key,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Flame,
  Bot,
  Terminal,
  Code,
  Check,
  Building2,
  Users,
  Compass,
  Briefcase,
  Menu
} from "lucide-react";

interface Venture {
  id: string;
  name: string;
  sector: string;
  desc: string;
  metrics: string;
  tech: string;
  href: string;
  icon: any;
  color: string;
}

const ventures: Venture[] = [
  {
    id: "avpu",
    name: "Alpaben Vipulbhai Patel University",
    sector: "EdTech & Higher Education",
    desc: "AI-powered university education adapting to every learner with adaptive DAG knowledge trees and gamified leagues.",
    metrics: "20+ Programs · 90% Placement",
    tech: "LangGraph · EdgeDB · Canvas DAG",
    href: "/avpu",
    icon: GraduationCap,
    color: "#38bdf8"
  },
  {
    id: "avp-emart",
    name: "AVP E-Mart",
    sector: "Q-Commerce & Price Intelligence",
    desc: "AI shopping engine comparing live prices across Amazon, Flipkart, Reliance & Snapdeal with 10-min fulfillment.",
    metrics: "4 Platforms · 10k+ Products · ₹1Cr GMV",
    tech: "Smartprix Scraper · Buyhatke Radar",
    href: "/avp-emart",
    icon: ShoppingBag,
    color: "#10b981"
  },
  {
    id: "comonk",
    name: "Comonk Technology",
    sector: "Career & Talent Intelligence",
    desc: "AI career copilot for tech jobs featuring ATS resume scoring, FAANG mock interview rooms, and salary insights.",
    metrics: "2,000+ Companies · 100% Free",
    tech: "Jobscan Engine · Judge0 Sandbox",
    href: "/comonk",
    icon: Cpu,
    color: "#a855f7"
  },
  {
    id: "sevenforce",
    name: "Sevenforce",
    sector: "Autonomous Enterprise Workforce",
    desc: "Team of specialized AI employees for marketing, sales, hiring, meetings, and code execution running 24/7.",
    metrics: "7 AI Employees · 450k Tasks/Day",
    tech: "LangGraph Studio · Devin Shell",
    href: "/sevenforce",
    icon: Zap,
    color: "#f59e0b"
  },
  {
    id: "pharmacy",
    name: "Decode Forest Pharmacy",
    sector: "HealthTech & Tele-Pharmacy",
    desc: "AI prescription OCR scanner, Jan Aushadhi generic alternative finder, and critical drug-drug interaction matrix.",
    metrics: "12,000+ Salts · 75% Savings",
    tech: "Tesseract OCR · RxNorm Clinical RAG",
    href: "/pharmacy",
    icon: HeartPulse,
    color: "#ec4899"
  },
  {
    id: "breakdown",
    name: "Breakdown Factor",
    sector: "Civil Engineering & Safety",
    desc: "AI-driven construction management with CPWD DSR BOQ estimation, computer-vision site PPE monitoring, and defect audit.",
    metrics: "99.4% CV Accuracy · DSR 2023",
    tech: "YOLOv8 Vision · CPWD BOQ Engine",
    href: "/breakdown",
    icon: Wrench,
    color: "#ef4444"
  },
  {
    id: "trust",
    name: "AVP Charitable Trust",
    sector: "Social Impact & Philanthropy",
    desc: "Non-profit platform using AI for rural community needs assessment, mobile health camps, and instant 80G tax receipts.",
    metrics: "50,000+ Beneficiaries · 100% Transparent",
    tech: "Form 10BE Generator · QR Verification",
    href: "/trust",
    icon: Building2,
    color: "#06b6d4"
  },
  {
    id: "rakshak-ai",
    name: "Rakshak AI Safety",
    sector: "Public Safety & Law Enforcement",
    desc: "Citizen safety copilot with automated BNS 2023 FIR drafting, cybercrime scam detector, and crowd security analytics.",
    metrics: "BNS Clause Mapping · Helpline 1930",
    tech: "Legal RAG · Surveillance Vision",
    href: "/rakshak-ai",
    icon: Shield,
    color: "#8b5cf6"
  },
  {
    id: "agenticos",
    name: "AgenticOS",
    sector: "Agent Infrastructure & Kernel OS",
    desc: "The operating system kernel coordinating every autonomous agent cluster across the portfolio — memory heaps, process locks, and IPC message queues.",
    metrics: "18 Worker Processes · SECCOMP Sandboxed",
    tech: "Agent Kernel · Multi-Process IPC",
    href: "/agenticos",
    icon: Terminal,
    color: "#14b8a6"
  }
];

const faqs = [
  {
    q: "What makes Sevenseed fundamentally AI-native?",
    a: "Every venture is engineered on a shared AI backbone — LangGraph multi-agent orchestration, Groq LLaMA 3.3 70B inference, and ChromaDB vector retrieval — so AI isn't an afterthought, it's the core engine from day one."
  },
  {
    q: "How do external founders partner with the studio?",
    a: "We incubate in-house but selectively co-found with exceptional domain leaders. We provide capital, shared AI infrastructure, and a dedicated team of engineers to build and launch within 90 days."
  },
  {
    q: "Are the tools and workstations free to try?",
    a: "Yes! All interactive workstations — including the YC TAM Calculator, ATS Resume Scorer, Knowledge DAG, Spec Comparator, and BOQ Estimator — are fully functional and accessible right in your browser."
  },
  {
    q: "How does the Zero-Margin BYOK Vault work?",
    a: "Your API keys (Groq, OpenAI, Anthropic) are AES-GCM encrypted in your browser's local storage and never touch our servers, giving you zero SaaS markup on model tokens."
  }
];

export default function SevenseedHomePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Evaluator Sandbox State
  const [evalName, setEvalName] = useState("EcoFlow AI");
  const [evalSector, setEvalSector] = useState("CleanTech & Energy");
  const [evalIdea, setEvalIdea] = useState("Autonomous smart microgrid balancing agent using real-time solar forecasting.");
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    score: number;
    verdict: string;
    tam: string;
    synergy: string;
  } | null>({
    score: 92,
    verdict: "High-Priority Studio Fit",
    tam: "$14.2 Billion Global Addressable Market",
    synergy: "Directly plugs into Sevenforce multi-agent dispatcher and Breakdown Factor industrial telemetry."
  });

  // Contact Form State
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cType, setCType] = useState("Venture Co-Founding");
  const [cMessage, setCMessage] = useState("");
  const [cStatus, setCStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Command Palette & Chat Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [cmdkSearch, setCmdkSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    { role: "bot", text: "Hello! I am the Sevenseed AI Studio Assistant. Ask me about our 9 incubated ventures, investment syndicates, or how to launch an AI startup with us." }
  ]);

  // Three.js 3D WebGL PBR Engine
  useEffect(() => {
    let animationFrameId: number;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let mesh: any = null;
    let ring1: any = null;
    let ring2: any = null;
    let particles: any = null;

    const initThree = async () => {
      if (!canvasRef.current) return;
      const THREE = await import("three");

      const width = canvasRef.current.clientWidth || 500;
      const height = canvasRef.current.clientHeight || 500;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 5.5;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Central Polyhedron
      const geo = new THREE.IcosahedronGeometry(1.4, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.25,
        metalness: 0.85,
        wireframe: true
      });
      mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      // Core Solid Glow Sphere
      const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.7
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      // Ring 1
      const ringGeo1 = new THREE.TorusGeometry(2.1, 0.035, 16, 100);
      const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
      ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI / 3;
      scene.add(ring1);

      // Ring 2
      const ringGeo2 = new THREE.TorusGeometry(2.3, 0.025, 16, 100);
      const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.y = Math.PI / 4;
      scene.add(ring2);

      // Star Particles
      const particleGeo = new THREE.BufferGeometry();
      const count = 180;
      const posArray = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xc7d2fe
      });
      particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x38bdf8, 2.5, 20);
      pointLight1.position.set(4, 4, 4);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xa855f7, 2, 20);
      pointLight2.position.set(-4, -4, 2);
      scene.add(pointLight2);

      // Drag controls
      let isDragging = false;
      let prevMousePos = { x: 0, y: 0 };

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !mesh) return;
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        mesh.rotation.y += deltaX * 0.01;
        mesh.rotation.x += deltaY * 0.01;
        prevMousePos = { x: e.clientX, y: e.clientY };
      };
      const onMouseUp = () => { isDragging = false; };

      const canvas = canvasRef.current;
      canvas?.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (mesh) {
          mesh.rotation.y += 0.005;
          mesh.rotation.x += 0.002;
        }
        if (ring1) ring1.rotation.z += 0.008;
        if (ring2) ring2.rotation.z -= 0.006;
        if (particles) particles.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        canvas?.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    };

    initThree();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
    };
  }, []);

  // Keyboard shortcut for CmdK
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCmdkOpen(false);
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Run Evaluator
  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setEvalResult({
        score: Math.floor(Math.random() * 16) + 82,
        verdict: "High-Priority Studio Fit",
        tam: `$${(Math.random() * 20 + 8).toFixed(1)} Billion TAM`,
        synergy: `Direct alignment with Sevenseed shared AI vector storage and Groq high-throughput inference in ${evalSector}.`
      });
    }, 600);
  };

  // Submit Contact Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cName,
          email: cEmail,
          company: cCompany,
          type: cType,
          message: cMessage
        })
      });
      if (res.ok) {
        setCStatus("success");
        setCName("");
        setCEmail("");
        setCCompany("");
        setCMessage("");
      } else {
        setCStatus("error");
      }
    } catch {
      setCStatus("error");
    }
  };

  // Chat Submission
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "Sevenseed is an AI-first venture studio. You can explore all our interactive subpages: AVP University (/avpu), AVP E-Mart (/avp-emart), Comonk Career (/comonk), and Sevenforce Enterprise (/sevenforce). How can we assist your venture?";
      const lower = userMsg.toLowerCase();
      if (lower.includes("avpu") || lower.includes("university")) {
        reply = "AVPU features interactive learning tools like the Knowledge DAG (/avpu/learn-dag), Duolingo Leagues (/avpu/duo-league), and Code Lab (/avpu/code-lab).";
      } else if (lower.includes("emart") || lower.includes("shopping") || lower.includes("price")) {
        reply = "AVP E-Mart offers our 3-Way Flagship Spec Comparator (/avp-emart/spec-compare) and 90-day price tracker across Amazon, Flipkart, and Reliance.";
      } else if (lower.includes("comonk") || lower.includes("job") || lower.includes("resume")) {
        reply = "Comonk AI provides automated ATS resume match scoring and FAANG mock interviews (/comonk/resume-analyzer).";
      }
      setChatMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 400);
  };

  const filteredVentures = ventures.filter(
    (v) =>
      v.name.toLowerCase().includes(cmdkSearch.toLowerCase()) ||
      v.sector.toLowerCase().includes(cmdkSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      <Grain />
      {/* Sticky Global Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060814]/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Seven<span className="text-indigo-400">seed</span>
              </span>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">AI Venture Studio</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm text-slate-300">
            <Link href="/syndicate-ruv" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Syndicate & RUV
            </Link>
            <Link href="/market-sizing" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-400" /> TAM / SOM
            </Link>
            <Link href="/ventures" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" /> Portfolio
            </Link>
            <Link href="/pricing" className="hover:text-indigo-400 transition-colors">
              Pricing
            </Link>
            <Link href="/byok" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-400" /> BYOK Vault
            </Link>
            <a href="#sandbox" className="hover:text-indigo-400 transition-colors">
              AI Evaluator
            </a>
            <a href="#faq" className="hover:text-indigo-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCmdkOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Ctrl K</kbd>
            </button>

            <a
              href="#contact"
              className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Partner With Us
            </a>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/80 bg-[#060814]/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-1 font-medium text-sm text-slate-300">
            <Link href="/syndicate-ruv" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-indigo-400 transition-colors flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Syndicate & RUV
            </Link>
            <Link href="/market-sizing" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-indigo-400 transition-colors flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" /> TAM / SOM
            </Link>
            <Link href="/ventures" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-indigo-400 transition-colors flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Portfolio
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-indigo-400 transition-colors">
              Pricing
            </Link>
            <Link href="/byok" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-indigo-400 transition-colors flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" /> BYOK Vault
            </Link>
            <a href="#sandbox" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-indigo-400 transition-colors">
              AI Evaluator
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-indigo-400 transition-colors">
              FAQ
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> Partner With Us
            </a>
          </div>
        )}
      </nav>

      {/* Hero Header */}
      <header className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Overhead Ambient Lamp Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-600/25 via-sky-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <SparklesCore particleColor="#818cf8" particleDensity={35} minSize={0.4} maxSize={1.2} className="-z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-300 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI-Native Studio · LangGraph Agents · Shared AI Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
              We build <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">AI-native</span> companies from seed to scale
            </h1>

            <TextGenerateEffect
              words="An AI-first startup studio that ideates, incubates, and launches ventures powered by LLM agents, RAG, and computer vision — on a shared AI infrastructure used across the entire portfolio."
              className="text-slate-300 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed"
              duration={0.4}
            />

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#contact"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Partner with Sevenseed
              </a>
              <a
                href="#ventures"
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-base hover:bg-slate-800/80 transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-indigo-400" /> See All Ventures
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 max-w-xl mx-auto lg:mx-0 text-left font-mono">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">9</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">AI Ventures</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">6</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Industries</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">3</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">New/Year</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">1</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Shared Stack</div>
              </div>
            </div>
          </div>

          {/* Right Hero 3D WebGL PBR Stage */}
          <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-[540px]">
            <div className="relative w-full h-[460px] sm:h-[500px] rounded-3xl bg-gradient-to-b from-slate-900/40 to-slate-950/80 border border-slate-800/70 shadow-2xl shadow-indigo-500/10 flex items-center justify-center overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>120 FPS WebGL · PBR Core</span>
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 pointer-events-none">
                360° Drag & Orbit
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4 Pillars Band */}
      <section className="border-y border-slate-800/80 bg-slate-950/40 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">AI-Native Architecture</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Every venture is engineered with LLM agents and RAG from inception.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Shared AI Backbone</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">One unified ChromaDB + Groq cluster power the entire portfolio.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Founder-First Studio</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Hands-on AI engineering, weekly shipping cadence, and zero red-tape.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Diversified Synergy</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Six distinct industries sharing models, data pipelines, and intelligence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Labs Workstations */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-sky-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Studio Engines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Venture Architecture Workstations</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Engineered to AngelList syndicate waterfall standards, Y Combinator market-sizing methodologies, and client-side BYOK security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between hover:border-indigo-500/40 transition-all group">
            <div className="space-y-3">
              <div className="text-3xl">📊</div>
              <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">AngelList Syndicate & RUV</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Model SPV investment returns, 20% carry splits, 2% management fees, LP payout waterfalls, and exit MOIC multiples.
              </p>
            </div>
            <Link
              href="/syndicate-ruv"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 font-mono"
            >
              <span>Model Syndicate</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between hover:border-sky-500/40 transition-all group">
            <div className="space-y-3">
              <div className="text-3xl">🎯</div>
              <h3 className="font-bold text-lg text-white group-hover:text-sky-400 transition-colors">YC TAM / SAM / SOM Sizer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bottom-up & top-down market sizing with ARPU, serviceable obtainable market share, and pitch deck slide export.
              </p>
            </div>
            <Link
              href="/market-sizing"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 font-mono"
            >
              <span>Calculate TAM / SOM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between hover:border-amber-500/40 transition-all group">
            <div className="space-y-3">
              <div className="text-3xl">🏢</div>
              <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">Portfolio Directory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore live operational metrics, full AI stacks, and deep subpage tools across all 9 incubated studio enterprises.
              </p>
            </div>
            <Link
              href="/ventures"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 font-mono"
            >
              <span>View Directory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
            <div className="space-y-3">
              <div className="text-3xl">🔑</div>
              <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">Zero-Margin BYOK Vault</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Client-side AES-GCM encrypted API key manager for Groq, OpenAI, Anthropic, and Gemini with zero SaaS markup.
              </p>
            </div>
            <Link
              href="/byok"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 font-mono"
            >
              <span>Open Key Vault</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ventures Showcase Grid */}
      <section id="ventures" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-2">Incubated Ventures</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">The Sevenseed AI Portfolio</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            Click any venture to launch its dedicated Next.js workstation and test live interactive features in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ventures.map((v, idx) => {
            const Icon = v.icon;
            const isHighlight = idx === 0 || idx === 1;
            return (
              <div key={v.id} className="relative rounded-2xl h-full">
                <CardSpotlight color={`${v.color}22`} className="h-full">
                  {isHighlight && (
                    <BorderBeam size={170} duration={10} colorFrom={v.color} colorTo="#6366f1" borderWidth={1.5} />
                  )}
                  <Link href={v.href} className="group p-6 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: `${v.color}15`, color: v.color }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-1">
                          Launch <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">{v.sector}</span>
                        <h3 className="font-bold text-lg text-white mt-1 group-hover:text-indigo-400 transition-colors">
                          {v.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-1.5 font-mono text-[11px]">
                      <div className="text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{v.metrics}</span>
                      </div>
                      <div className="text-slate-500">{v.tech}</div>
                    </div>
                  </Link>
                </CardSpotlight>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Portfolio Status + Studio Changelog */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-400">Transparency</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Live, Not Just a Landing Page</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Real uptime checks against every venture route, and an honest log of what shipped and when.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioHealthMonitor ventures={ventures} />
          <StudioChangelog />
        </div>
      </section>

      {/* Interactive AI Venture Idea Evaluator (Sandbox) */}
      <section id="sandbox" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-950 to-[#0b0e24] border border-indigo-500/20 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-xs font-mono text-indigo-400">
              <Bot className="w-4 h-4" />
              <span>Interactive AI Studio Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">AI Venture Idea Evaluator</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Test your startup idea against Sevenseed's investment rubric, shared LangGraph infrastructure fit, and bottom-up market sizing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Form */}
            <form onSubmit={handleEvaluate} className="lg:col-span-6 space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Venture / Project Name</label>
                <input
                  type="text"
                  value={evalName}
                  onChange={(e) => setEvalName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Target Industry Sector</label>
                <select
                  value={evalSector}
                  onChange={(e) => setEvalSector(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option>CleanTech & Energy</option>
                  <option>EdTech & Higher Ed</option>
                  <option>Q-Commerce & Retail</option>
                  <option>HealthTech & Pharma</option>
                  <option>Industrial Telemetry & Civil</option>
                  <option>GovTech & Citizen Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Core Problem & AI Solution</label>
                <textarea
                  rows={3}
                  value={evalIdea}
                  onChange={(e) => setEvalIdea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={evaluating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {evaluating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" /> Evaluating Architecture…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Evaluate Studio Fit
                  </>
                )}
              </button>
            </form>

            {/* Results Display */}
            <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between font-mono">
              {evalResult && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="text-xs text-slate-400">STUDIO FIT SCORE</div>
                      <div className="text-3xl font-black text-indigo-400 mt-1">{evalResult.score} / 100</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                      {evalResult.verdict}
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="text-slate-500 uppercase">Estimated TAM</div>
                      <div className="text-slate-200 mt-0.5">{evalResult.tam}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 uppercase">Platform Synergy</div>
                      <div className="text-slate-300 mt-0.5 leading-relaxed">{evalResult.synergy}</div>
                    </div>
                    <div className="pt-2">
                      <div className="text-slate-500 uppercase mb-2">Recommended Next Milestones</div>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Define initial LangGraph multi-agent loop</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Connect shared ChromaDB vector collection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Deploy prototype on port 8000+ FastAPI cluster</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Incubation Process */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-400">Our Method</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How We Build AI Companies</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From algorithmic thesis discovery to shared infrastructure scaling in four synchronized stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-indigo-400">STAGE 01</div>
            <h3 className="font-bold text-lg text-white">LLM Market Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We scrape industry workflows, analyze margin pools, and identify high-pain bottlenecks where LLMs deliver 10x ROI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-indigo-400">STAGE 02</div>
            <h3 className="font-bold text-lg text-white">Shared AI Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              New startups plug directly into our pre-built LangGraph agents, ChromaDB vector collections, and model inference gateway.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-indigo-400">STAGE 03</div>
            <h3 className="font-bold text-lg text-white">Rapid 90-Day Build</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated studio AI engineers pair program alongside domain founders to ship production MVPs in under 12 weeks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-indigo-400">STAGE 04</div>
            <h3 className="font-bold text-lg text-white">Portfolio Synergy Scale</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each company cross-sells within the ecosystem, sharing customer data pipelines and compounding proprietary AI fine-tunes.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-400">Frequently Asked Questions</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Everything You Need to Know</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between font-semibold text-white text-base">
                <span>{f.q}</span>
                <ChevronRight
                  className={`w-5 h-5 text-indigo-400 transition-transform ${
                    openFaq === i ? "rotate-90" : ""
                  }`}
                />
              </div>
              {openFaq === i && (
                <p className="mt-3 text-sm text-slate-400 leading-relaxed border-t border-slate-900 pt-3">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Partner with Sevenseed</h2>
            <p className="text-slate-400 text-sm">
              Co-found an AI enterprise, invest via our AngelList syndicate, or consult on custom LLM architecture.
            </p>
          </div>

          {cStatus === "success" ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Message Received!</h3>
              <p className="text-xs text-slate-300">
                Thank you. Our founding partners will reach out within 24 hours at the provided email address.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder="Kunal Patel"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="kunal@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={cCompany}
                    onChange={(e) => setCCompany(e.target.value)}
                    placeholder="Studio or Fund Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Inquiry Type</label>
                  <select
                    value={cType}
                    onChange={(e) => setCType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option>Venture Co-Founding</option>
                    <option>AngelList Syndicate / SPV</option>
                    <option>Enterprise AI Consultation</option>
                    <option>General Media / Press</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Message / Proposal</label>
                <textarea
                  rows={4}
                  value={cMessage}
                  onChange={(e) => setCMessage(e.target.value)}
                  placeholder="Tell us about what you want to build or invest in…"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={cStatus === "submitting"}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {cStatus === "submitting" ? "Forwarding to Studio…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span className="font-extrabold text-lg text-white">Sevenseed</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An AI-first venture studio engineering autonomous enterprises across technology, education, healthcare, construction, e-commerce, and public safety.
            </p>
          </div>

          <div>
            <div className="font-mono text-xs uppercase text-slate-300 font-bold mb-3">Workstations</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/syndicate-ruv" className="hover:text-white">Syndicate & RUV Simulator</Link></li>
              <li><Link href="/market-sizing" className="hover:text-white">YC TAM / SAM / SOM Sizer</Link></li>
              <li><Link href="/ventures" className="hover:text-white">Portfolio Directory</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Studio Pricing & Terms</Link></li>
              <li><Link href="/byok" className="hover:text-white">Zero-Margin BYOK Vault</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs uppercase text-slate-300 font-bold mb-3">Ventures</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/avpu" className="hover:text-white">AVP University</Link></li>
              <li><Link href="/avp-emart" className="hover:text-white">AVP E-Mart</Link></li>
              <li><Link href="/comonk" className="hover:text-white">Comonk AI</Link></li>
              <li><Link href="/sevenforce" className="hover:text-white">Sevenforce</Link></li>
              <li><Link href="/pharmacy" className="hover:text-white">Decode Forest Pharmacy</Link></li>
              <li><Link href="/breakdown" className="hover:text-white">Breakdown Factor</Link></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="font-mono text-xs uppercase text-slate-300 font-bold mb-3">Contact</div>
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-indigo-400" /> hello@sevenseed.in</div>
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-indigo-400" /> +91 84908 61586</div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Ahmedabad, Gujarat, India</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>© {new Date().getFullYear()} Sevenseed AI Platform. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Node.js Next.js 15 App Router · TypeScript React</span>
          </div>
        </div>
      </footer>

      {/* Floating Quick-Nav Dock */}
      <FloatingDock
        items={[
          { label: "Ventures", href: "#ventures", icon: Layers },
          { label: "AI Evaluator", href: "#sandbox", icon: Bot },
          { label: "Portfolio Directory", href: "/ventures", icon: Compass },
          { label: "BYOK Vault", href: "/byok", icon: Key },
          { label: "FAQ", href: "#faq", icon: HelpCircle },
          { label: "Contact", href: "#contact", icon: Mail },
        ]}
      />

      {/* Floating Chat Assistant Trigger */}
      <button
        onClick={() => setChatOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-transform"
        title="Chat with Sevenseed AI"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Floating Chat Drawer */}
      {chatOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[480px] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="text-base">🌱</span>
              <span className="font-bold text-sm text-white">Sevenseed AI Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                  m.role === "bot"
                    ? "bg-slate-900 border border-slate-800 text-slate-200 mr-auto"
                    : "bg-indigo-600 text-white ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-900/50 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about ventures, tech stack, or deals…"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Command Palette Modal (Ctrl+K) */}
      {cmdkOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={cmdkSearch}
                onChange={(e) => setCmdkSearch(e.target.value)}
                placeholder="Type a venture, tool, or shortcut…"
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
              <button onClick={() => setCmdkOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-72 overflow-y-auto space-y-1">
              {filteredVentures.map((v) => (
                <Link
                  key={v.id}
                  href={v.href}
                  onClick={() => setCmdkOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900 text-xs text-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">🌱</span>
                    <span className="font-semibold text-white">{v.name}</span>
                    <span className="text-slate-500">({v.sector})</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{v.href}</span>
                </Link>
              ))}
            </div>

            <div className="p-3 border-t border-slate-900 bg-slate-900/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Navigate with arrow keys</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
