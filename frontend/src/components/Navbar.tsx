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
  Search,
  Sprout
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

  if (pathname === "/") return <HomeNavbar ventures={VENTURES} tools={POPULAR_TOOLS} />;

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
                Ventures <ChevronDown className="w-3.5 h-3.5" />
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
                Tools <ChevronDown className="w-3.5 h-3.5" />
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

function HomeNavbar({ ventures, tools }: { ventures: { name: string; href: string; desc: string }[]; tools: { name: string; href: string; brand: string }[] }) {
  const [openMenu, setOpenMenu] = useState<"ventures" | "tools" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const linkClass = "text-sm font-medium text-[#344054] transition hover:text-[#6d28d9]";
  const listedVentures = ventures.filter((v) => v.href !== "/");

  return (
    <nav aria-label="Main" className="ss-home fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-white/80 bg-white pl-5 pr-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.25)]">
        <Link href="/" className="flex items-center gap-2.5 py-1">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0f172a] text-[#8ee07a]"><Sprout className="h-5 w-5" /></span>
          <span className="text-lg font-bold tracking-[-0.02em] text-[#0f172a]">Sevenseed</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <div className="relative">
            <button type="button" aria-expanded={openMenu === "ventures"} onClick={() => setOpenMenu(openMenu === "ventures" ? null : "ventures")} className={`flex items-center gap-1 py-2 ${linkClass}`}>
              Ventures <ChevronDown className="h-4 w-4" />
            </button>
            {openMenu === "ventures" && (
              <div onMouseLeave={() => setOpenMenu(null)} className="absolute left-0 top-full grid w-[420px] gap-1 rounded-xl border border-[#e4e7ec] bg-white p-2 shadow-xl">
                {listedVentures.map((v) => (
                  <Link key={v.name} href={v.href} onClick={() => setOpenMenu(null)} className="rounded-lg px-3 py-2 transition hover:bg-[#f5f3ff]">
                    <span className="block text-sm font-semibold text-[#0f172a]">{v.name}</span>
                    <span className="block text-[13px] text-[#475467]">{v.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button type="button" aria-expanded={openMenu === "tools"} onClick={() => setOpenMenu(openMenu === "tools" ? null : "tools")} className={`flex items-center gap-1 py-2 ${linkClass}`}>
              Products <ChevronDown className="h-4 w-4" />
            </button>
            {openMenu === "tools" && (
              <div onMouseLeave={() => setOpenMenu(null)} className="absolute left-0 top-full grid w-[480px] grid-cols-2 gap-1 rounded-xl border border-[#e4e7ec] bg-white p-2 shadow-xl">
                {tools.map((tool) => (
                  <Link key={tool.name} href={tool.href} onClick={() => setOpenMenu(null)} className="rounded-lg px-3 py-2 transition hover:bg-[#f5f3ff]">
                    <span className="block text-sm font-semibold text-[#0f172a]">{tool.name}</span>
                    <span className="block text-[13px] text-[#475467]">{tool.brand}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a href="#tour" className={linkClass}>See it in action</a>
          <a href="#how" className={linkClass}>For founders</a>
          <a href="#faq" className={linkClass}>FAQ</a>
        </div>

        <a href="#contact" className="ss-btn-primary !hidden !min-h-0 !py-2.5 !text-sm lg:!inline-flex">Contact us</a>

        <button type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[#344054] lg:hidden">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-6xl overflow-y-auto rounded-3xl bg-white p-4 shadow-xl lg:hidden">
          <div className="grid gap-1 text-[15px] font-medium text-[#344054]">
            {[["#team", "Meet the team"], ["#tour", "See it in action"], ["#platform", "How it works"], ["#how", "For founders"], ["#faq", "FAQ"]].map(([href, name]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-[#f5f3ff]">{name}</a>
            ))}
          </div>
          <a href="#contact" onClick={() => setMobileOpen(false)} className="ss-btn-primary mt-3 w-full">Contact us</a>
        </div>
      )}
    </nav>
  );
}
