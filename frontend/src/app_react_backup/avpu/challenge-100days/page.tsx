"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Calendar, Flame, CheckCircle2, Lock, Sparkles, Share2 } from "lucide-react";

interface DayPrompt {
  day: number;
  title: string;
  category: "Setup" | "Prompting" | "RAG" | "Fine-Tuning" | "Agents" | "Deployment";
  status: "completed" | "active" | "locked";
  deliverable: string;
}

const sampleDays: DayPrompt[] = [
  { day: 1, title: "Environment & Next.js Monorepo Setup", category: "Setup", status: "completed", deliverable: "Verified local dev server running on port 3001" },
  { day: 2, title: "Groq API & Fast LLaMA 3.3 Prompting", category: "Prompting", status: "completed", deliverable: "JSON mode structured output parser script" },
  { day: 3, title: "Vector Embeddings & Cosine Distance", category: "RAG", status: "completed", deliverable: "ChromaDB local vector store index" },
  { day: 4, title: "Contextual Chunking & ColBERT Reranking", category: "RAG", status: "active", deliverable: "Hybrid dense + sparse search engine" },
  { day: 5, title: "LangGraph StateGraph & Checkpointing", category: "Agents", status: "locked", deliverable: "Cyclic workflow with human-in-the-loop pause" },
  { day: 6, title: "Autonomous Tool Calling & Web Search", category: "Agents", status: "locked", deliverable: "Multi-tool calling agent with Tavily/DuckDuckGo" },
  { day: 7, title: "FastAPI Production Dockerization", category: "Deployment", status: "locked", deliverable: "Docker Compose image with healthcheck" },
];

export default function Challenge100DaysRoute() {
  const [selectedDay, setSelectedDay] = useState<DayPrompt>(sampleDays[3]);

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(245, 158, 11, 0.2)" />

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
              <div className="text-[11px] font-mono uppercase text-amber-400">AVPU Accountability Engine</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>100 Days of AI Challenge (100daysai.com)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-400 font-bold">
              <Flame className="w-4 h-4 fill-current" />
              <span>Day 4 of 100</span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold">Proof of Work Curriculum</span>
            <h2 className="text-2xl font-bold text-slate-100">Build 1 Real AI System Every Day for 100 Days</h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              No endless tutorials. Every single day demands a concrete code artifact or deployed workflow verified by automated test assertions.
            </p>
          </div>

          <button
            onClick={() => alert("Proof of Work card generated! Ready to post on X / LinkedIn.")}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Day 4 Milestone</span>
          </button>
        </div>

        {/* Days Horizontal Timeline / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleDays.map((d) => {
            const isSelected = selectedDay.day === d.day;
            return (
              <div
                key={d.day}
                onClick={() => setSelectedDay(d)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900 border-amber-400 shadow-lg shadow-amber-500/15"
                    : d.status === "completed"
                    ? "bg-slate-950/90 border-emerald-500/40 hover:border-emerald-400"
                    : d.status === "active"
                    ? "bg-slate-950/90 border-amber-500/50 hover:border-amber-400"
                    : "bg-slate-950/50 border-slate-800/60 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400">DAY {d.day}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {d.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{d.title}</h4>
                  <div className="mt-2 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Deliverable: </span>
                    {d.deliverable}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono">
                  {d.status === "completed" ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : d.status === "active" ? (
                    <span className="text-amber-400 flex items-center gap-1 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>Active Today</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                  <span className="text-sky-400 hover:underline">View Spec →</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
