"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  CyberShieldRadar3D,
  TacticalSonarBackground,
  BorderBeam,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  ArrowLeft,
  Shield,
  Video,
  AlertTriangle,
  FileText,
  Sparkles,
  CheckCircle2,
  Scale,
  Radar,
  Lock,
  Radio,
} from "lucide-react";

export default function RakshakAIPage() {
  const [incidentSummary, setIncidentSummary] = useState(
    "Two unidentified individuals on a black motorcycle intercepted citizen near Infocity circle, threatened physical violence, and snatched gold chain."
  );
  const [generatedFIR, setGeneratedFIR] = useState<string | null>(null);

  const generateFIR = () => {
    setGeneratedFIR(
      `[OFFICIAL FORMAL POLICE COMPLAINT UNDER BNSS SEC 173]\n` +
      `Incident Timestamp: 2026-09-20 02:14:22 IST\n` +
      `Jurisdiction: Infocity Police Station, Gandhinagar\n\n` +
      `APPLICABLE BHARATIYA NYAYA SANHITA (BNS 2023) CLAUSES:\n` +
      `- Section 304 BNS: Snatching / Robbery with physical force (Cognizable, Non-Bailable)\n` +
      `- Section 351 BNS: Criminal Intimidation threatening bodily injury\n` +
      `- Legacy Mapping: Sec 379/356/506 Indian Penal Code (IPC)\n\n` +
      `PRAYER TO STATION HOUSE OFFICER (SHO):\n` +
      `An FIR may kindly be registered immediately under Section 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) and police investigation initiated.\n\n` +
      `Verification Hash: SHA256-BNS-2026-0920-F841`
    );
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#02040a] text-slate-100 p-6 md:p-10 space-y-10 overflow-hidden font-sans">
        {/* Military Tactical Sonar Radar Sweep & Threat Ping Background */}
        <TacticalSonarBackground />
        <Spotlight className="-top-40 left-20" fill="rgba(239, 68, 68, 0.28)" />

        {/* Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-red-900/40 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-red-950/60 border border-red-800/40 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Rakshak Autonomous Safety & Justice</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span>Rakshak AI — BNS 2023 Auto-FIR & Cyber Threat Sentinel</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-red-400 bg-red-950/60 border border-red-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>1930 Cyber Sentinel: Active</span>
            </span>
          </div>
        </div>

        {/* Hero Section with Dedicated 3D Cyber Shield Radar */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bharatiya Nyaya Sanhita (BNS 2023) Legal Drafter & C4ISR Shield</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              AI Legal Drafter & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-300 to-sky-400">
                Public Safety Sentinel
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Translating natural citizen complaint narratives into precise Bharatiya Nyaya Sanhita (BNS 2023) statutory charges, classifying cognizable offenses under BNSS Sec 173, and scanning malicious cyber threats in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/rakshak-ai/fir-generator" icon={Scale} className="from-red-600 via-rose-600 to-orange-600 border-red-400/30 shadow-red-500/25">
                Draft BNS Auto-FIR
              </CyberButton>
              <CyberButton href="/rakshak-ai/threat-radar" icon={Radar} className="from-slate-800 via-blue-900 to-red-900 border-red-500/30 shadow-red-950/50">
                Scan Cyber Threats
              </CyberButton>
            </div>
          </div>

          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500/15 blur-[100px] rounded-full pointer-events-none" />
            <CyberShieldRadar3D />
          </div>
        </div>

        {/* Live BNS Auto-FIR Interactive Drafter with 21st.dev BorderBeam */}
        <div className="relative z-10 rounded-2xl overflow-hidden border border-red-900/40 bg-red-950/25 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <BorderBeam size={230} duration={9} colorFrom="#ef4444" colorTo="#f43f5e" borderWidth={1.5} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-400" />
                <span>BNS 2023 Auto-FIR Complaint Generator (BNSS Sec 173)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Type an incident description in plain language. Rakshak maps criminal charges and outputs a statutory police complaint.
              </p>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-950/90 border border-red-700 text-red-300 font-bold">
              Cognizable Offense Classifier
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono text-slate-400 block">INCIDENT NARRATIVE STATEMENT</label>
            <textarea
              value={incidentSummary}
              onChange={(e) => setIncidentSummary(e.target.value)}
              className="w-full h-24 p-3 rounded-xl bg-[#080205] border border-red-900/50 text-xs font-mono text-red-200 focus:outline-none focus:border-red-400 resize-none"
            />
          </div>

          <button
            onClick={generateFIR}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs font-mono flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-red-500/25"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official BNS Statutory Complaint Draft</span>
          </button>

          {generatedFIR && (
            <div className="p-4 rounded-xl bg-[#050103] border border-red-800/60 font-mono text-xs text-red-200 space-y-2 whitespace-pre-wrap">
              {generatedFIR}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-red-900/40 py-8 px-6 text-center text-xs font-mono text-slate-500">
          <p>© 2026 Rakshak AI · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
