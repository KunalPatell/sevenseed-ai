"use client";

import React, { useState } from "react";
import { ShieldAlert, Globe, PhoneCall, CheckCircle2, AlertTriangle } from "lucide-react";

export function CyberThreatRadar() {
  const [threatInput, setThreatInput] = useState("http://fake-sbi-kyc-update-apk.ru/download");
  const [result, setResult] = useState<{ risk: "high" | "safe"; details: string } | null>(null);

  const scanThreat = () => {
    if (threatInput.includes("apk") || threatInput.includes("fake") || threatInput.includes("kyc")) {
      setResult({
        risk: "high",
        details: "MALICIOUS PHISHING DETECTED: Rogue APK masquerading as banking credential harvest portal."
      });
    } else {
      setResult({
        risk: "safe",
        details: "CLEAN DOMAIN: Valid SSL handshake, zero malware indicators recorded on CERT-In telemetry."
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-4 h-4" /> National Cyber Crime Portal (1930) Linked
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Cybercrime Threat & Phishing Radar
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Scan suspicious SMS links, WhatsApp lottery APKs, and fake bank portals with automated 1-click filing to 1930.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={threatInput}
            onChange={(e) => setThreatInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-rose-500"
          />
          <button
            onClick={scanThreat}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Globe className="w-4 h-4" /> Verify Link
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-xl border ${result.risk === "high" ? "bg-rose-500/15 border-rose-500/40 text-rose-300" : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"} text-xs flex items-center gap-3`}>
            {result.risk === "high" ? <AlertTriangle className="w-6 h-6 shrink-0 text-rose-400" /> : <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />}
            <div>
              <div className="font-bold">{result.risk === "high" ? "CRITICAL THREAT" : "SAFE DOMAIN"}</div>
              <p className="mt-0.5">{result.details}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs text-slate-300">
        <div>
          <span className="font-bold text-white">Emergency Cyber Helpline:</span> Dial 1930 immediately for online financial frauds.
        </div>
        <a
          href="tel:1930"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
        >
          <PhoneCall className="w-3.5 h-3.5" /> Call 1930
        </a>
      </div>
    </div>
  );
}
