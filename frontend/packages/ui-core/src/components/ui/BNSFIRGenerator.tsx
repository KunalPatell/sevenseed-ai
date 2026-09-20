"use client";

import React, { useState } from "react";
import { ShieldAlert, Scale, Printer, CheckCircle } from "lucide-react";

export function BNSFIRGenerator() {
  const [complainant, setComplainant] = useState("Rahul Sharma, Resident of Gandhinagar");
  const [location, setLocation] = useState("September 18, 2026 at 20:30 hrs near Infocity Circle");
  const [incident, setIncident] = useState(
    "Two unknown persons on a black motorcycle intercepted my vehicle, threatened me with violence, and snatched my mobile phone and gold chain."
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Scale className="w-4 h-4" /> Bharatiya Nyaya Sanhita (BNS 2023) Legal Assistant
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          BNS Auto-FIR Legal Complaint Drafter
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Map incident narratives to modern BNS criminal clauses, classify cognizable status, and generate formal e-FIR drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Incident Narrative Form */}
        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Incident Statement</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Complainant Details</label>
            <input
              type="text"
              value={complainant}
              onChange={(e) => setComplainant(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Time & Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Factual Narrative</label>
            <textarea
              rows={4}
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Generated BNS Complaint */}
        <div className="bg-slate-950 border border-rose-500/40 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs uppercase font-bold text-rose-400">Formal Police Complaint</span>
              <div className="text-[11px] text-slate-400">Under Sec 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS)</div>
            </div>
            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 font-bold text-[10px] rounded-full uppercase">
              Cognizable Offense
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
            <div>
              <strong className="text-white">Applicable BNS 2023 Clauses:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300">
                <li><strong className="text-rose-400">Section 304 BNS:</strong> Snatching / Robbery with physical force.</li>
                <li><strong className="text-rose-400">Section 351 BNS:</strong> Criminal Intimidation threatening hurt.</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-800 font-sans">
              <strong className="text-white">Prayer to SHO:</strong>
              <p className="text-slate-400 mt-1">
                An FIR may kindly be registered immediately under Sections 304 & 351 of BNS 2023 and police investigation initiated.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4" /> Print Formal Complaint Draft
          </button>
        </div>
      </div>
    </div>
  );
}
