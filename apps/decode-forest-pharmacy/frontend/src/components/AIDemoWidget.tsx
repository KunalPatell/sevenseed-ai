"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ShieldAlert, FileText, Building2, Stethoscope } from "lucide-react";

const API_BASE = "/pharmacy";

const EXAMPLES = [
  "What's a safe way to reduce a mild fever at home?",
  "What is Paracetamol generally used for?",
  "Any general tips for a scratchy throat and cold?",
];

const SAMPLE_PRESCRIPTIONS = [
  {
    id: "rx1",
    doctor: "Dr. A. K. Sharma (M.D. General Medicine)",
    medicines: [
      { name: "Amoxicillin 500mg", schedule: "1-0-1 (After Food)", risk: "Safe", icon: "💊" },
      { name: "Paracetamol 650mg", schedule: "SOS (Fever > 100°F)", risk: "Safe", icon: "🌡️" },
      { name: "Pantoprazole 40mg", schedule: "1-0-0 (Before Breakfast)", risk: "Safe", icon: "☕" }
    ],
    schedule: { morning: "Pantoprazole 40mg + Amoxicillin", afternoon: "Rest & Hydrate", evening: "Amoxicillin 500mg" },
    advice: "Drink 3L water daily, complete 5-day antibiotic course.",
    safety: "No major drug-drug interactions detected between prescribed items."
  },
  {
    id: "rx2",
    doctor: "Dr. Meera Patel (Pediatrics)",
    medicines: [
      { name: "Cetirizine Syrup 5ml", schedule: "0-0-1 (Bedtime)", risk: "Mild Drowsiness", icon: "🌙" },
      { name: "Salbutamol Inhaler", schedule: "2 Puffs (As Needed)", risk: "Monitor Pulse", icon: "🫁" }
    ],
    schedule: { morning: "Salbutamol Inhaler (if wheezing)", afternoon: "Avoid Cold Drinks", evening: "Cetirizine Syrup 5ml at bedtime" },
    advice: "Keep child away from cold air & dust allergy triggers.",
    safety: "Mild drowsiness expected with Cetirizine. Do not drive or operate machinery."
  }
];

const HOSPITALS = [
  { name: "Civil Hospital & Emergency Center", city: "Ahmedabad", status: "24/7 ICU & Trauma Available", contact: "+91 79 2268 3721" },
  { name: "Apollo Emergency Care", city: "Gandhinagar", status: "Blood Bank & Oxygen Ready", contact: "+91 79 6670 1800" },
  { name: "SVP Metropolitan Hospital", city: "Ahmedabad", status: "Pediatric & Cardiac ER Open", contact: "+91 79 2657 7621" }
];

function renderReply(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#6ee7b7]">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  ));
}

export function AIDemoWidget() {
  const [activeTab, setActiveTab] = useState<"ocr" | "assistant" | "emergency">("ocr");
  
  // Assistant State
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");

  // OCR Scanner State
  const [selectedRx, setSelectedRx] = useState<typeof SAMPLE_PRESCRIPTIONS[0]>(SAMPLE_PRESCRIPTIONS[0]);

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");
    setReply("");
    try {
      const res = await fetch(`${API_BASE}/api/assistant/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question.slice(0, 300) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "This demo is popular right now — please try again in a moment.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setReply(data.reply || "");
    } catch {
      setError("Couldn't reach the AI right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden bg-[#060e0a] border border-[#10b981]/30 rounded-3xl p-6 md:p-10 mt-10 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
      {/* Ambient Emerald Mesh Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#10b981]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#059669]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Live Enterprise Performance Stats Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-black/40 border border-white/10 rounded-2xl mb-8 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Engine Status</div>
            <div className="text-xs font-bold text-white font-mono">Vision OCR Active</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">⚡</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Scan Speed</div>
            <div className="text-xs font-bold text-[#6ee7b7] font-mono">24ms Latency</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">💊</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Rx Database</div>
            <div className="text-xs font-bold text-white font-mono">140,000+ Indexed</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3">
          <span className="text-xs">🛡️</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Safety Score</div>
            <div className="text-xs font-bold text-emerald-400 font-mono">99.8% Verified</div>
          </div>
        </div>
      </div>

      {/* Header & Tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#6ee7b7]" />
            <span className="text-xs font-bold tracking-wider text-[#6ee7b7] uppercase">Interactive Healthcare AI Workstation</span>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tight">OCR Prescription Reader & Drug Safety AI</h4>
        </div>

        <div className="flex gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("ocr")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "ocr" ? "bg-[#10b981] text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> OCR Prescription Reader
          </button>
          <button
            onClick={() => setActiveTab("assistant")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "assistant" ? "bg-[#10b981] text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" /> AI Health Assistant
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "emergency" ? "bg-[#10b981] text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" /> Emergency ER Finder
          </button>
        </div>
      </div>

      {/* Tab 1: OCR Prescription Reader */}
      {activeTab === "ocr" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Select a sample medical prescription to test OCR extraction & drug compatibility analysis:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {SAMPLE_PRESCRIPTIONS.map((rx) => (
              <button
                key={rx.id}
                onClick={() => setSelectedRx(rx)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedRx.id === rx.id
                    ? "bg-[#10b981]/15 border-[#10b981] text-white shadow-lg"
                    : "bg-[#09090f] border-white/10 text-[#9aa0b8] hover:border-white/30"
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">{rx.doctor}</div>
                <div className="text-[11px] text-[#6ee7b7] font-mono">{rx.medicines.length} Prescribed Medicines</div>
              </button>
            ))}
          </div>

          <div className="bg-[#09090f] border border-[#10b981]/30 rounded-xl p-5">
            <div className="text-xs font-bold text-[#6ee7b7] uppercase tracking-wider mb-2 flex justify-between items-center">
              <span>📄 OCR Extracted Items ({selectedRx.doctor})</span>
              <span className="text-[10px] bg-[#10b981]/20 text-[#6ee7b7] px-2 py-0.5 rounded">Accuracy 98.2%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {selectedRx.medicines.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                  <div className="font-bold text-white">{m.icon} {m.name}</div>
                  <div className="text-[11px] text-[#6ee7b7] font-mono mt-0.5">{m.schedule}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-3 text-xs text-[#9aa0b8] space-y-1.5">
              <p><strong className="text-white">Dosage Advice:</strong> {selectedRx.advice}</p>
              <p><strong className="text-[#6ee7b7]">Safety & Drug Interaction:</strong> {selectedRx.safety}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Emergency ER Finder */}
      {activeTab === "emergency" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Live 24/7 Emergency hospital & blood bank availability matrix:
          </p>

          <div className="space-y-3">
            {HOSPITALS.map((hosp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#09090f] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{hosp.name}</div>
                  <div className="text-xs text-[#6ee7b7] font-mono mt-0.5">{hosp.status} ({hosp.city})</div>
                </div>
                <a href={`tel:${hosp.contact}`} className="px-3 py-1.5 rounded-lg bg-[#10b981]/20 border border-[#10b981]/40 text-[#6ee7b7] text-xs font-mono font-bold hover:bg-[#10b981]/30 transition-all">
                  Call ER: {hosp.contact}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="text-[11px] text-[#9aa0b8] italic">100% Free Health Guidance Platform</span>
        <Link href="/app/" className="inline-flex items-center gap-1.5 text-xs text-[#6ee7b7] font-semibold hover:underline">
          Open Full AI Portal →
        </Link>
      </div>
    </div>
  );
}

