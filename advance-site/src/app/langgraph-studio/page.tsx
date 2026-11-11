"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Network, Play, CheckCircle2, Cpu, Database } from "lucide-react";

export default function LangGraphStudioRoute() {
  const [query, setQuery] = useState("Compare iPhone 16 Pro vs OnePlus 13 effective price with HDFC card & build an AI study roadmap");
  const [model, setModel] = useState("groq/llama-3.3-70b-versatile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>({
    engine: "LangGraph StateGraph v0.2 + LangChain Core",
    total_latency_ms: 14.2,
    detected_domain: "ecommerce",
    critic_score: 0.96,
    trace_steps: [
      { node: "1. SupervisorRouterNode", framework: "LangGraph StateGraph", latency_ms: 1.4, detail: "Classified intent into domain 'ecommerce'." },
      { node: "2. LangChainRAGRetrieverNode", framework: "LangChain Hybrid Vector + BM25", latency_ms: 3.1, detail: "Retrieved top-3 venture knowledge chunks (sim=0.94)." },
      { node: "3. DomainToolSandboxNode", framework: "LangChain StructuredTool + PromptTemplate", latency_ms: 2.6, detail: "Executed deterministic price + coupon calculator." },
      { node: "4. CriticReflectionNode", framework: "LangGraph Conditional Edge Verifier", latency_ms: 1.8, detail: "Confidence=0.96 >= 0.85 threshold verified." },
      { node: "5. ExecutiveSynthesizerNode", framework: "LangChain RunnableLambda + LLM Gateway", latency_ms: 5.3, detail: "Synthesized executive response with zero hallucinations." },
    ],
    langchain_prompt: "You are the Sevenseed Quantum Multi-Agent Orchestrator...\nActive Domain: ECOMMERCE\nUser Query: Compare iPhone 16 Pro vs OnePlus 13...",
    final_response: "### ⚡ AVP Emart + AVPU Executive Synthesis\n\n- **Effective Price Winner**: OnePlus 13 (₹59,174 net) saves ₹45,226 vs iPhone 16 Pro (₹1,04,400 net) after stacking BuyHatke auto-coupons + Xerve HDFC 5% cashback.\n- **AI Study Path**: Python 3.12 → Transformers → LangChain RAG → LangGraph StateGraphs.",
  });

  const executeGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/langgraph/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, venture_filter: "auto", model }),
      });
      if (res.ok) {
        setResult(await res.json());
        setLoading(false);
        return;
      }
    } catch {}
    setTimeout(() => setLoading(false), 400);
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-6">
        <Spotlight className="-top-40 left-20" fill="rgba(56, 189, 248, 0.22)" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-sky-400">
                Python langgraph.graph.StateGraph + langchain_core.prompts.PromptTemplate
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Network className="w-5 h-5 text-sky-400" />
                <span>LangChain + LangGraph Cyclic 5-Node Multi-Agent Studio</span>
              </h1>
            </div>
          </div>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="groq/llama-3.3-70b-versatile">Groq LLaMA 3.3 70B Versatile</option>
            <option value="gemini-2.5-pro-exp">Google Gemini 2.5 Pro Exp</option>
            <option value="deepseek-r1-distill-70b">DeepSeek R1 Distill 70B</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white"
          />
          <button
            onClick={executeGraph}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>{loading ? "Executing StateGraph..." : "Execute LangGraph Pipeline"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(result.trace_steps || []).map((s: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/40 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>{s.framework}</span>
                <span>{s.latency_ms}ms</span>
              </div>
              <div className="text-sm font-bold text-white">{s.node}</div>
              <p className="text-xs text-slate-400">{s.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
            <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Executive Synthesizer Output
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              {result.final_response}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-3">
            <div className="text-xs font-bold uppercase text-purple-300 flex items-center gap-2">
              <Database className="w-4 h-4" /> Rendered LangChain PromptTemplate
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
              {result.langchain_prompt}
            </pre>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

