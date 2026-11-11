import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, KeyRound, Sparkles, Building2 } from "lucide-react";

// Pricing model (from the founder): the tools are free when visitors bring their own AI
// key, because then the AI cost is theirs. Visitors who don't want to manage a key pay
// Sevenseed to provide the AI. The numbers below mirror llm_gateway.py's rate limits
// (15 shared requests an hour per visitor; 120 an hour with your own key).

const PLANS = [
  {
    name: "Free",
    icon: KeyRound,
    price: "₹0",
    cadence: "with your own AI key",
    desc: "Use every tool on the site. AI features run on your own key, so you pay your AI provider directly, and many providers offer a free key.",
    features: [
      "All tools across the nine companies",
      "Up to 120 AI requests an hour on your key",
      "Your key stays in your browser and is never stored on our servers",
      "Try AI features without a key: 15 requests an hour",
    ],
    cta: { label: "Add your AI key", href: "/byok/" },
  },
  {
    name: "Sevenseed AI",
    icon: Sparkles,
    featured: true,
    price: "Paid",
    cadence: "price on request",
    desc: "No key to manage. Sevenseed provides the AI and covers the AI costs, with higher limits for you or your team.",
    features: [
      "Everything in Free, no AI key needed",
      "AI provided and paid for by Sevenseed",
      "Higher usage limits, agreed with you",
      "Help from the Sevenseed team",
    ],
    cta: { label: "Ask about Sevenseed AI", href: "/#contact" },
  },
  {
    name: "For companies",
    icon: Building2,
    price: "Custom",
    cadence: "quoted per project",
    desc: "Custom tools, AI employees from Sevenforce, or a version of a Sevenseed product built for your business.",
    features: ["Scoped with you before any work starts", "Built on the same shared platform", "Can run on your own cloud account"],
    cta: { label: "Talk to us", href: "/#contact" },
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Sevenseed
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Pricing</h1>
        <p className="text-slate-300 text-base mt-3 max-w-2xl mx-auto">
          AI costs money to run. Bring your own AI key and every tool is free. Or let Sevenseed provide the AI for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div key={p.name} className={`p-6 rounded-2xl border flex flex-col justify-between ${p.featured ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10" : "bg-slate-950/60 border-slate-800"}`}>
            <div>
              <div className="flex items-center gap-2">
                <p.icon className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">{p.name}</h2>
              </div>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{p.desc}</p>
              <div className="my-6">
                <span className="text-4xl font-black text-white">{p.price}</span>
                <span className="text-sm text-slate-400 ml-2">{p.cadence}</span>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-300 border-t border-slate-800 pt-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> {f}</li>
                ))}
              </ul>
            </div>
            <Link href={p.cta.href} className={`block text-center w-full mt-8 py-3 rounded-xl font-bold text-sm transition ${p.featured ? "bg-amber-500 hover:bg-amber-400 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-white"}`}>
              {p.cta.label}
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-12 max-w-3xl mx-auto space-y-4 text-sm text-slate-300">
        <h2 className="text-xl font-bold text-white">Questions</h2>
        <details className="border-t border-slate-800 pt-3"><summary className="cursor-pointer font-semibold text-white">What is an AI key?</summary><p className="mt-2 text-slate-400">A key from an AI provider that lets Sevenseed's tools use that provider's AI on your account. You paste it once on the Your AI keys page; it stays in your browser.</p></details>
        <details className="border-t border-slate-800 pt-3"><summary className="cursor-pointer font-semibold text-white">Do tools without AI need a key?</summary><p className="mt-2 text-slate-400">No. Calculators, planners, checkers and trackers that don't use AI work for everyone, with no key and no limit.</p></details>
        <details className="border-t border-slate-800 pt-3"><summary className="cursor-pointer font-semibold text-white">What happens when I hit the free limit?</summary><p className="mt-2 text-slate-400">AI answers pause until the hour resets, and the page tells you. Add your own key, or ask about Sevenseed AI, to keep going.</p></details>
      </section>
    </main>
  );
}
