import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

export default function PricingPage() {
  const TIERS = [
    {
      name: "Founder Sandbox",
      price: "$0",
      cadence: "Free Forever",
      desc: "Access basic ideation tools, DAG knowledge graphs, and open-source simulators.",
      features: ["All 10 venture web demos", "BYOK client-side key storage", "Basic ATS resume check", "Community Discord access"]
    },
    {
      name: "Studio Incubator",
      price: "$4,999",
      cadence: "/ venture / quarter",
      featured: true,
      desc: "Comprehensive venture incubation with autonomous LangGraph agents and cloud infra.",
      features: ["7 Dedicated AI Employees", "Custom LLM fine-tuning", "Production Next.js monorepo", "Full legal BNS + 80G integrations", "Weekly founder counseling"]
    },
    {
      name: "Enterprise Sovereign",
      price: "$19,500",
      cadence: "/ year",
      desc: "Self-hosted private deployment on your AWS or GCP VPC with air-gapped models.",
      features: ["Air-gapped model hosting", "Multi-tenant RBAC", "Unlimited token throughput", "99.99% SLA uptime guarantee", "Dedicated solutions architect"]
    }
  ];

  return (
    <main className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </Link>
      </div>

      <div className="text-center mb-12">
        <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Predictable Investment</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">Studio Incubation & SaaS Tiers</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Transparent pricing backed by zero-margin BYOK architecture and enterprise SLA terms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`p-6 rounded-2xl border flex flex-col justify-between ${
              tier.featured
                ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10"
                : "bg-slate-950/60 border-slate-800"
            }`}
          >
            <div>
              <h3 className="text-lg font-bold text-white">{tier.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{tier.desc}</p>
              <div className="my-6">
                <span className="text-4xl font-black text-white font-mono">{tier.price}</span>
                <span className="text-xs text-slate-400 ml-1">{tier.cadence}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button className={`w-full mt-8 py-2.5 rounded-xl font-bold text-xs transition ${
              tier.featured ? "bg-amber-500 hover:bg-amber-400 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-white"
            }`}>
              Select {tier.name}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
