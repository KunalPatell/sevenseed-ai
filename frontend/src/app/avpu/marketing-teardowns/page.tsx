"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Megaphone, ArrowRight, Check, X, Sparkles, Filter } from "lucide-react";

interface Teardown {
  id: string;
  brand: string;
  category: "Copywriting" | "Cold Email" | "Landing Page" | "Pricing" | "Social" | "Ads" | "Retention" | "Referral";
  headline: string;
  before: string;
  after: string;
  whyItWorks: string;
  liftMetric: string;
}

const teardowns: Teardown[] = [
  {
    id: "td-1",
    brand: "Basecamp / 37signals",
    category: "Landing Page",
    headline: "Specificity Beats Vague Grandeur",
    before: "The all-in-one powerful productivity tool for modern high-performance teams.",
    after: "Before Basecamp: Projects scattered across Slack, Email, and Google Docs. After Basecamp: Everything in one clean place.",
    whyItWorks: "Contrasts current painful chaos directly against future clarity rather than bragging about feature counts.",
    liftMetric: "+34% Signup Conversion",
  },
  {
    id: "td-2",
    brand: "Stripe",
    category: "Copywriting",
    headline: "Speak Directly to the Actual Implementer",
    before: "Enterprise-grade scalable multi-currency payment transaction gateway infrastructure.",
    after: "Financial infrastructure for the internet. Payments, billing, and global payouts in 7 lines of code.",
    whyItWorks: "Developers build the product. Proving simplicity ('7 lines of code') wins developer trust instantaneously.",
    liftMetric: "De-Facto Market Standard",
  },
  {
    id: "td-3",
    brand: "Superhuman",
    category: "Pricing",
    headline: "Reverse Risk Reversal (Premium VIP Positioning)",
    before: "$9.99/mo standard email client with spam filtering and calendar sync.",
    after: "$30/mo invite-only experience with 1-on-1 VIP onboarding call to achieve Inbox Zero in half the time.",
    whyItWorks: "Charging 3x higher combined with human concierge onboarding signals luxury and ultra-high efficiency.",
    liftMetric: "100k+ Waitlist",
  },
  {
    id: "td-4",
    brand: "Duolingo",
    category: "Social",
    headline: "Post as an Unhinged Mascot, Not a Brand Account",
    before: "Learn a new language today! Download Duolingo and start your streak. #LanguageLearning #EdTech",
    after: "A TikTok of the owl mascot 'threatening' users who broke their streak — millions of organic shares from the bit alone.",
    whyItWorks: "Brand-safe corporate voice gets scrolled past. A recurring, slightly unhinged character people can quote is what actually spreads.",
    liftMetric: "4M+ TikTok Followers",
  },
  {
    id: "td-5",
    brand: "Notion",
    category: "Referral",
    headline: "Give Credits, Not Cash, for Referrals",
    before: "Refer a friend and get $10 off your next invoice.",
    after: "Invite a friend, you both get free workspace credit — spendable only inside the product you already love.",
    whyItWorks: "Product credit keeps the reward inside the ecosystem and reinforces continued usage, instead of leaking value out as cash.",
    liftMetric: "2x Referral Redemption Rate",
  },
  {
    id: "td-6",
    brand: "Headspace",
    category: "Retention",
    headline: "Re-engage With a Question, Not a Reminder",
    before: "Push notification: 'You haven't meditated in 5 days. Open the app now!'",
    after: "Push notification: 'What's on your mind today?' — leads straight into a 1-tap 3-minute session matched to the answer.",
    whyItWorks: "A guilt-trip reminder gets dismissed. A question invites a reply and removes the decision of 'which session do I even pick.'",
    liftMetric: "+19% Reactivation Rate",
  },
  {
    id: "td-7",
    brand: "Ahrefs",
    category: "Ads",
    headline: "Show the Product Screenshot, Not a Stock Photo",
    before: "A generic image of a diverse team smiling around a laptop, captioned 'Grow Your Business Today.'",
    after: "A cropped screenshot of the actual keyword-gap report, captioned 'Your competitor ranks for 4,200 keywords you don't.'",
    whyItWorks: "A specific, slightly uncomfortable number the viewer can verify beats generic aspiration — it reads as proof, not promotion.",
    liftMetric: "3.1x Click-Through Rate",
  },
  {
    id: "td-8",
    brand: "Loom",
    category: "Cold Email",
    headline: "Send a Video Instead of More Text",
    before: "Hi {{first_name}}, I wanted to reach out because I think our product could really help your team save time...",
    after: "A 47-second Loom recording of the sender using the prospect's own website, with a one-line text: 'Recorded this for you, 47 sec.'",
    whyItWorks: "A cold email with a real, personalized video proves effort no template can fake, so it survives the 2-second delete decision.",
    liftMetric: "+62% Reply Rate",
  }
];

export default function MarketingTeardownsRoute() {
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? teardowns : teardowns.filter((t) => t.category === filter);

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(56, 189, 248, 0.2)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/avpu"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-sky-400">AVPU Growth Engine</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-sky-400" />
                <span>Visual Marketing Teardowns (marketingexamples.com)</span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex flex-wrap items-center gap-2 justify-end max-w-lg">
            {["All", "Landing Page", "Copywriting", "Cold Email", "Pricing", "Social", "Ads", "Retention", "Referral"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  filter === cat ? "bg-sky-500 text-black font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Teardowns Grid */}
        <div className="space-y-6">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {t.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{t.brand}</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  {t.liftMetric}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-100">{t.headline}</h3>

              {/* Before vs After Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase">
                    <X className="w-4 h-4" />
                    <span>Before (Weak / Vague)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">"{t.before}"</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
                    <Check className="w-4 h-4" />
                    <span>After (Sharpened / High Conversion)</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-semibold">"{t.after}"</p>
                </div>
              </div>

              <div className="pt-2 text-xs font-mono text-slate-400">
                <span className="text-sky-400 font-bold">Why It Converts: </span>
                {t.whyItWorks}
              </div>
            </div>
          ))}
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
