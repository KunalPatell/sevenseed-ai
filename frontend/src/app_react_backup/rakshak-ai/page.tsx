"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Shield, Video, AlertTriangle, FileText, Sparkles, CheckCircle2 } from "lucide-react";

export default function RakshakAIPage() {
  const [incidentSummary, setIncidentSummary] = useState(
    "Unidentified intruder scaled perimeter fence at Sector 4 at 02:14 AM. Facial anomaly detected with concealed weapon profile."
  );
  const [generatedFIR, setGeneratedFIR] = useState<string | null>(null);

  const generateFIR = () => {
    setGeneratedFIR(
      `[OFFICIAL INCIDENT REPORT & STATUTORY FIR DRAFT]\n` +
      `Incident Timestamp: 2026-09-20 02:14:22 IST\n` +
      `Location: Perimeter Sector 4 (Geofenced Node 18B)\n` +
      `Applicable Statutory Sections:\n` +
      `- Bharatiya Nyaya Sanhita (BNS) Section 329: Criminal Trespass & House Breaking by Night\n` +
      `- Arms Act Section 25(1B): Possession of Unlicensed Weapon Profile\n` +
      `Telemetry Forensic Evidence:\n` +
      `- 30 FPS Edge Camera Stream SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n` +
      `- Confidence Score: 98.6% Computer Vision Verification\n` +
      `Recommended Action: Immediate Dispatch of Mobile Response Unit #3.`
    );
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(6, 182, 212, 0.25)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-cyan-400">Rakshak Autonomous Security</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span>Rakshak AI — 30 FPS Edge Vision & Legal FIR Generator (Verkada & Nyaya AI)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Edge Vision: 30 FPS Active
            </span>
          </div>
        </div>

        {/* Live Surveillance Simulator & FIR Drafter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edge Camera Feed Simulator */}
          <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-400 flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Camera Stream: CAM-04 (Sector Perimeter)</span>
              </span>
              <span className="text-xs font-mono text-emerald-400">1080p · 30 FPS</span>
            </div>

            <div className="relative w-full aspect-video bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              {/* Simulated Bounding Box */}
              <div className="absolute top-12 left-16 w-36 h-48 border-2 border-rose-500 bg-rose-500/10 rounded flex flex-col justify-between p-1.5 font-mono text-[10px] text-rose-400">
                <span className="bg-rose-950/80 px-1 py-0.5 rounded border border-rose-500/40">Anomaly (98.6%)</span>
                <span className="bg-rose-950/80 px-1 py-0.5 rounded">ID: #4092 · TRACKING</span>
              </div>

              <div className="z-10 text-center font-mono text-xs text-slate-500">
                [LIVE EDGE INFERENCE WEBCAM TELEMETRY]
              </div>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>High Threat Intrusion Detected</span>
              </span>
              <span className="font-bold">SECTOR 4</span>
            </div>
          </div>

          {/* Legal FIR Agent Generator */}
          <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Statutory Legal FIR Drafter (BNS Sections)</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  Bharatiya Nyaya Sanhita (BNS)
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Transforms computer vision telemetry into legally compliant FIR drafts mapped to statutory criminal sections.
              </p>

              <textarea
                value={incidentSummary}
                onChange={(e) => setIncidentSummary(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none"
              />

              <button
                onClick={generateFIR}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-500/20"
              >
                Generate Legal FIR Draft
              </button>
            </div>

            {generatedFIR && (
              <pre className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-cyan-300 whitespace-pre-wrap overflow-y-auto max-h-48 leading-relaxed">
                {generatedFIR}
              </pre>
            )}
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
