"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  ShoppingCart,
  Briefcase,
  Users,
  Pill,
  HardHat,
  Heart,
  Shield,
  Layers,
  Search
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [ventureMenuOpen, setVentureMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const VENTURES = [
    { name: "Sevenseed Studio", href: "/", icon: Sparkles, desc: "AI Venture Studio Hub", color: "text-amber-400" },
    { name: "AVPU", href: "/avpu", icon: GraduationCap, desc: "AI University & Education Labs", color: "text-blue-400" },
    { name: "AVP E-Mart", href: "/avp-emart", icon: ShoppingCart, desc: "AI Shopping & Price Radar", color: "text-purple-400" },
    { name: "Comonk Technology", href: "/comonk", icon: Briefcase, desc: "AI Career & ATS Intelligence", color: "text-sky-400" },
    { name: "Sevenforce", href: "/sevenforce", icon: Users, desc: "7 Autonomous AI Employees", color: "text-indigo-400" },
    { name: "Decode Forest Pharmacy", href: "/pharmacy", icon: Pill, desc: "Jan Aushadhi & Clinical AI", color: "text-emerald-400" },
    { name: "Breakdown Factor", href: "/breakdown", icon: HardHat, desc: "CPWD Civil Engineering AI", color: "text-amber-400" },
    { name: "AVP Charitable Trust", href: "/trust", icon: Heart, desc: "Social Impact & 80G Tax Exemption", color: "text-pink-400" },
    { name: "Rakshak AI", href: "/rakshak-ai", icon: Shield, desc: "BNS 2023 Legal & CCTV Sentinel", color: "text-rose-400" },
    { name: "AgenticOS", href: "/agenticos", icon: Layers, desc: "Autonomous Agent Kernel OS", color: "text-teal-400" }
  ];

  const POPULAR_TOOLS = [
    { name: "Learn DAG Canvas", href: "/avpu/learn-dag", brand: "AVPU" },
    { name: "Duolingo League", href: "/avpu/duo-league", brand: "AVPU" },
    { name: "Spec Comparator", href: "/avp-emart/spec-compare", brand: "AVP E-Mart" },
    { name: "90-Day Price Trend", href: "/avp-emart/price-tracker", brand: "AVP E-Mart" },
    { name: "Jobscan ATS Matcher", href: "/comonk/resume-analyzer", brand: "Comonk" },
    { name: "FAANG Mock Arena", href: "/comonk/interview-arena", brand: "Comonk" },
    { name: "LangGraph Studio", href: "/sevenforce/workflows", brand: "Sevenforce" },
    { name: "Devin Terminal", href: "/sevenforce/devin-terminal", brand: "Sevenforce" },
    { name: "Jan Aushadhi Generics", href: "/pharmacy/generic-finder", brand: "Pharmacy" },
    { name: "Drug Interactions", href: "/pharmacy/interaction-checker", brand: "Pharmacy" },
    { name: "CPWD BOQ Estimator", href: "/breakdown/boq-estimator", brand: "Breakdown" },
    { name: "80G Form 10BE", href: "/trust/tax-exemption", brand: "AVP Trust" },
    { name: "BNS Auto-FIR", href: "/rakshak-ai/fir-generator", brand: "Rakshak AI" },
    { name: "Syndicate RUV", href: "/syndicate-ruv", brand: "Sevenseed" },
    { name: "TAM/SAM/SOM Sizer", href: "/market-sizing", brand: "Sevenseed" },
    { name: "BYOK Vault", href: "/byok", brand: "Sevenseed" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight leading-none">
                SEVENSEED
              </div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Venture Platform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`text-xs font-bold transition ${pathname === "/" ? "text-amber-400" : "text-slate-300 hover:text-white"}`}
            >
              Hub
            </Link>

            {/* Ventures Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setVentureMenuOpen(!ventureMenuOpen); setToolsMenuOpen(false); }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition py-2"
              >
                All 10 Ventures <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {ventureMenuOpen && (
                <div
                  onMouseLeave={() => setVentureMenuOpen(false)}
                  className="absolute top-full left-0 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2.5 grid grid-cols-1 gap-1"
                >
                  {VENTURES.map((v) => {
                    const Icon = v.icon;
                    return (
                      <Link
                        key={v.name}
                        href={v.href}
                        onClick={() => setVentureMenuOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 transition"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center ${v.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">{v.name}</div>
                          <div className="text-[10px] text-slate-400">{v.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Interactive Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setToolsMenuOpen(!toolsMenuOpen); setVentureMenuOpen(false); }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition py-2"
              >
                Feature Workstations <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {toolsMenuOpen && (
                <div
                  onMouseLeave={() => setToolsMenuOpen(false)}
                  className="absolute top-full -left-20 w-[420px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 grid grid-cols-2 gap-2"
                >
                  {POPULAR_TOOLS.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      onClick={() => setToolsMenuOpen(false)}
                      className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition"
                    >
                      <div className="text-[10px] text-amber-400 font-mono uppercase">{tool.brand}</div>
                      <div className="text-xs font-bold text-white mt-0.5">{tool.name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/syndicate-ruv"
              className={`text-xs font-bold transition ${pathname === "/syndicate-ruv" ? "text-amber-400" : "text-slate-300 hover:text-white"}`}
            >
              Syndicate RUV
            </Link>

            <Link
              href="/market-sizing"
              className={`text-xs font-bold transition ${pathname === "/market-sizing" ? "text-amber-400" : "text-slate-300 hover:text-white"}`}
            >
              TAM Calculator
            </Link>

            <Link
              href="/byok"
              className={`text-xs font-bold transition ${pathname === "/byok" ? "text-amber-400" : "text-slate-300 hover:text-white"}`}
            >
              BYOK Vault
            </Link>
          </div>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/#contact"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition"
            >
              Contact Studio
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">All 10 Ventures</div>
          <div className="grid grid-cols-2 gap-2">
            {VENTURES.map((v) => (
              <Link
                key={v.name}
                href={v.href}
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg bg-slate-900 text-xs font-bold text-white border border-slate-800 flex items-center gap-2"
              >
                <span>{v.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Popular Workstations
          </div>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_TOOLS.slice(0, 8).map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg bg-slate-900 text-[11px] text-slate-300 border border-slate-800"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
