"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Shield, Activity, Server, Zap } from "lucide-react";

export default function AngularEnterpriseRoute() {
  const [filterText, setFilterText] = useState("");
  const [ramMb, setRamMb] = useState(72.4);
  const [ventures, setVentures] = useState([
    { code: "EMART", name: "AVP Emart", stack: "Google Shopping (?udm=28) + Smartprix 0-100 + BuyHatke Spend Lens + Xerve NEFT", rps: 420, p99_ms: 18, arr_cr: 4.8, status: "HEALTHY" },
    { code: "AVPU", name: "AVP University", stack: "Learn-Anything.xyz DAG + Obsidian + FreeCodeCamp + Duolingo + LawsOfUX + Fs.blog", rps: 310, p99_ms: 22, arr_cr: 3.6, status: "HEALTHY" },
    { code: "PHARM", name: "Decode Forest Pharmacy", stack: "DrugBank CYP450/ADMET + Tata 1mg + Jan Aushadhi + NEWS2", rps: 195, p99_ms: 14, arr_cr: 2.9, status: "HEALTHY" },
    { code: "CIVIL", name: "Breakdown Factor", stack: "SkyCiv Beam SFD/BMD Solver + Autodesk Tandem 3D BIM + IS 456", rps: 140, p99_ms: 29, arr_cr: 5.2, status: "HEALTHY" },
    { code: "TRUST", name: "AVP Charitable Trust", stack: "GiveIndia 80G Form 10BE + Charity Navigator + Polygon Merkle Audit", rps: 110, p99_ms: 12, arr_cr: 1.8, status: "VERIFIED" },
    { code: "RAKSHAK", name: "Rakshak AI Safety", stack: "Citizen App Radar + Amber Alert + BNS 2023 + 128-D Biometrics", rps: 260, p99_ms: 24, arr_cr: 3.1, status: "GUARDING" },
    { code: "COMONK", name: "Comonk Career AI", stack: "Levels.fyi Total Comp Percentiles + TryExponent STAR Grader", rps: 285, p99_ms: 19, arr_cr: 2.4, status: "HEALTHY" },
    { code: "7FORCE", name: "Sevenforce Swarm", stack: "Devin.ai Autonomous Engineer + LangGraph Studio 5-Node StateGraph", rps: 510, p99_ms: 21, arr_cr: 6.4, status: "SCALING" },
  ]);

  const filtered = ventures.filter(
    (v) =>
      !filterText ||
      v.name.toLowerCase().includes(filterText.toLowerCase()) ||
      v.stack.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-6">
        <Spotlight className="-top-40 left-20" fill="rgba(244, 63, 94, 0.22)" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-rose-400">
                AngularJS 1.8 Reactive Enterprise Telemetry + Render 512MB RAM Safe Architecture
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-400" />
                <span>Enterprise Two-Way Data Binding & Render Free-Tier Memory Guard</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter ventures or reference sites..."
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button
              onClick={() => {
                setVentures(ventures.map((v) => ({ ...v, rps: v.rps + Math.floor(Math.random() * 40) + 15 })));
                setRamMb(+(72.4 + Math.random() * 2.5).toFixed(1));
              }}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Simulate Traffic Spike
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
            <div className="text-xs text-slate-400">Render Free Tier RAM Footprint</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{ramMb} MB / 512 MB (14.1%)</div>
            <div className="text-xs text-slate-400 mt-1">Pre-compiled static export + single Python FastAPI worker</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-sky-500/30">
            <div className="text-xs text-slate-400">Aggregate Cluster Throughput</div>
            <div className="text-2xl font-extrabold text-sky-400 mt-1">
              {ventures.reduce((s, v) => s + v.rps, 0)} req/sec
            </div>
            <div className="text-xs text-slate-400 mt-1">Across all 8 Sevenseed Ventures</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30">
            <div className="text-xs text-slate-400">Reference Platforms Replicated</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">23+ Reference Sites</div>
            <div className="text-xs text-slate-400 mt-1">100% Frontend + Backend Parity</div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Venture</th>
                <th className="p-3.5">Integrated Reference Sites & Tech Stack</th>
                <th className="p-3.5">Throughput</th>
                <th className="p-3.5">P99 Latency</th>
                <th className="p-3.5">ARR</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/80">
              {filtered.map((v) => (
                <tr key={v.code} className="hover:bg-slate-800/70">
                  <td className="p-3.5 font-bold text-white">{v.name}</td>
                  <td className="p-3.5 text-sky-300">{v.stack}</td>
                  <td className="p-3.5 font-mono text-emerald-400">{v.rps} rps</td>
                  <td className="p-3.5 font-mono text-amber-300">{v.p99_ms} ms</td>
                  <td className="p-3.5 font-mono font-bold text-white">₹{v.arr_cr} Cr</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

