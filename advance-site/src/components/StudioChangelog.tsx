"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

type ChangelogEntry = {
  date: string;
  venture: string;
  title: string;
  desc: string;
  href: string;
};

const CHANGELOG: ChangelogEntry[] = [
  { date: "2026-09-21", venture: "Sevenseed Hub", title: "AgenticOS surfaced as the 9th venture", desc: "It was built and linked from the Portfolio Directory, but missing from the homepage showcase grid — venture counts across the site were inconsistently showing 7, 8, and 9. Fixed everywhere.", href: "/agenticos" },
  { date: "2026-09-21", venture: "AVP-Emart", title: "Smart Deal Scanner", desc: "BuyHatke-style filter by budget/discount/category that flags inflated MRPs against the real pre-sale price.", href: "/avp-emart/deal-scanner" },
  { date: "2026-09-21", venture: "AVPU", title: "Laws of UX catalog: 8 → 30 laws", desc: "The tool claimed a '21 Laws Compendium' but only shipped 8. Now has all 30 real laws from lawsofux.com, correctly labeled, with search.", href: "/avpu/laws-of-ux" },
  { date: "2026-09-21", venture: "AVPU", title: "Mental Models expanded to all 7 categories", desc: "Added models covering Systems Thinking, Physics/Bio, Math, Art, and Military — the real fs.blog taxonomy — plus a category filter.", href: "/avpu/mental-models" },
  { date: "2026-09-21", venture: "AVPU", title: "Marketing Teardowns: 3 → 8 examples", desc: "Every category filter (Social, Ads, Retention, Referral, Cold Email) now has a real matching example instead of some showing zero results.", href: "/avpu/marketing-teardowns" },
  { date: "2026-09-21", venture: "AVPU", title: "Socratic AI Tutor went live", desc: "Real chat-based tutoring using your own Groq/Gemini/OpenAI key via the BYOK Vault — guides you to answers instead of giving them away.", href: "/avpu/ai-tutor" },
  { date: "2026-09-21", venture: "AVPU", title: "Spaced Repetition Flashcards", desc: "Leitner-box style review deck — cards you know move up a box, cards you miss reset.", href: "/avpu/flashcards" },
  { date: "2026-09-21", venture: "AVP-Emart", title: "Price Drop Wishlist & Alerts", desc: "Save products with a target price and get flagged when any tracked store hits it.", href: "/avp-emart/wishlist" },
  { date: "2026-09-21", venture: "Comonk", title: "Interview Experience Board", desc: "Crowd-sourced, Glassdoor-style writeups of real interview rounds — difficulty, outcome, and what to expect.", href: "/comonk/interview-experiences" },
  { date: "2026-09-21", venture: "Comonk", title: "Company Culture & Compensation Ratings", desc: "Glassdoor-style comp, work-life balance, and growth ratings by company.", href: "/comonk/company-reviews" },
  { date: "2026-09-21", venture: "Pharmacy", title: "Medicine Refill Reminders + Hospital Bed Finder surfaced", desc: "Practo-style dose scheduler, plus the hospital bed finder tool is now linked from the homepage.", href: "/pharmacy/medicine-reminders" },
  { date: "2026-09-21", venture: "Pharmacy", title: "Online Doctor Consultation Booking", desc: "1mg/Practo-style video consult booking across specialties.", href: "/pharmacy/doctor-consultation" },
  { date: "2026-09-21", venture: "Breakdown Factor", title: "Project Timeline & Milestone Tracker", desc: "Procore-style construction milestone board with live progress tracking.", href: "/breakdown/project-timeline" },
  { date: "2026-09-21", venture: "Breakdown Factor", title: "Live Material Price Index", desc: "Steel, cement, sand and RMC wholesale rates with daily movement.", href: "/breakdown/material-prices" },
  { date: "2026-09-21", venture: "Rakshak AI", title: "Missing Person & Lost Article Reporting", desc: "CitizenCOP-style structured report filing with instant case ID.", href: "/rakshak-ai/missing-person" },
  { date: "2026-09-21", venture: "Rakshak AI", title: "Neighborhood Safety Heatmap", desc: "Zone-by-zone risk levels based on filed reports.", href: "/rakshak-ai/safety-heatmap" },
  { date: "2026-09-21", venture: "Sevenforce", title: "AI Agent Template Marketplace", desc: "Browse and deploy pre-built agents across Marketing, Sales, Support, Recruiting, and Finance.", href: "/sevenforce/marketplace" },
  { date: "2026-09-21", venture: "Sevenforce", title: "Automation ROI Calculator", desc: "See weekly hours and annual cost saved from handing a task to an agent.", href: "/sevenforce/roi-calculator" },
  { date: "2026-09-21", venture: "AVP Trust", title: "Live Fundraising Campaigns", desc: "Ketto/Milaap-style donation progress tracking across active causes.", href: "/trust/campaigns" },
  { date: "2026-09-21", venture: "AVP Trust", title: "Volunteer Sign-Up", desc: "Browse and register for upcoming health camps and community events.", href: "/trust/volunteer" },
];

export function StudioChangelog() {
  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-6">
      <div className="flex items-center gap-2 text-sm font-bold text-white mb-5">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span>What&apos;s New Across the Studio</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {CHANGELOG.map((c, i) => (
          <Link
            key={i}
            href={c.href}
            className="group block p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 text-indigo-300">{c.venture}</span>
              <span className="text-[10px] font-mono text-slate-500">{c.date}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{c.title}</h4>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
