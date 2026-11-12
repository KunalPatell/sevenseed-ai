import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";

export default function VenturesPage() {
  const VENTURES = [
    { name: "Comonk Technology", href: "/comonk", tag: "AI Career Intelligence", desc: "Multi-agent career platform, ATS scoring, and FAANG technical interview simulations." },
    { name: "Sevenforce", href: "/sevenforce", tag: "Autonomous Workforce", desc: "7 Autonomous AI employees executing marketing, engineering, and sales pipelines." },
    { name: "AVPU", href: "/avpu", tag: "AI University", desc: "Interactive DAG graphs, Duolingo arena, in-browser code labs, and Laws of UX." },
    { name: "Decode Forest Pharmacy", href: "/pharmacy", tag: "Clinical AI", desc: "Jan Aushadhi generic salt finder, contraindication matrix, and hospital bed radar." },
    { name: "Breakdown Factor", href: "/breakdown", tag: "Construction AI", desc: "CPWD DSR 2023 BOQ takeoff estimator and computer vision site safety monitoring." },
    { name: "AVP Charitable Trust", href: "/trust", tag: "Social Impact", desc: "Section 80G Form 10BE tax exemption and Charity Navigator 4-star financial ledger." },
    { name: "AVP E-Mart", href: "/avp-emart", tag: "AI Shopping", desc: "Smartprix 3-way smartphone specs, quick commerce cart optimizer, and price history." },
    { name: "Rakshak AI", href: "/rakshak-ai", tag: "Legal & Defense", desc: "Bharatiya Nyaya Sanhita (BNS 2023) auto-FIR drafter and threat radar." },
    { name: "AgenticOS", href: "/agenticos", tag: "Agent Kernel OS", desc: "Operating system kernel for coordinating autonomous enterprise multi-agent clusters." }
  ];

  return (
    <main className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </Link>
      </div>

      <div className="text-center mb-10">
        <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Sevenseed Venture Studio</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">Incubated Venture Portfolio</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Explore all 9 active ventures spanning Artificial Intelligence, Health, Education, Law, and Commerce.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VENTURES.map((v) => (
          <Link
            key={v.name}
            href={v.href}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition hover:-translate-y-1 block space-y-3"
          >
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">
              {v.tag}
            </span>
            <h3 className="text-xl font-bold text-white flex items-center justify-between">
              {v.name} <ExternalLink className="w-4 h-4 text-slate-500" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
