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
    medicines: ["Amoxicillin 500mg (1-0-1 after food)", "Paracetamol 650mg (SOS for fever)", "Pantoprazole 40mg (1-0-0 before breakfast)"],
    advice: "Drink plenty of water, complete 5-day antibiotic course.",
    safety: "No major drug-drug interactions detected between prescribed items."
  },
  {
    id: "rx2",
    doctor: "Dr. Meera Patel (Pediatrics)",
    medicines: ["Cetirizine Syrup 5ml (0-0-1 at bedtime)", "Salbutamol Inhaler (2 puffs as needed)"],
    advice: "Keep away from cold air & dust allergy triggers.",
    safety: "Mild drowsiness expected with Cetirizine."
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
  const [activeTab, setActiveTab] = useState<"assistant" | "ocr" | "emergency">("assistant");
  
  // Assistant State
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");

  // OCR Teaser State
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
    <div className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-[#10b981]/25 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#6ee7b7]" />
            <span className="text-xs font-bold tracking-wider text-[#6ee7b7] uppercase">Interactive Healthcare AI Teaser</span>
          </div>
          <h4 className="text-xl font-extrabold text-white">24/7 AI Health & Pharmacy Guidance</h4>
        </div>

        <div className="flex gap-2 p-1 bg-[#09090f] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("assistant")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "assistant" ? "bg-[#10b981] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" /> AI Health Assistant
          </button>
          <button
            onClick={() => setActiveTab("ocr")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "ocr" ? "bg-[#10b981] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> OCR Prescription Reader
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "emergency" ? "bg-[#10b981] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" /> Emergency ER Finder
          </button>
        </div>
      </div>

      {/* Tab 1: AI Health Assistant */}
      {activeTab === "assistant" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-3">
            Ask general health, wellness & medicine questions live:
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuestion(ex)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#10b981]/50 hover:bg-[#10b981]/10 transition-all"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>

          <form onSubmit={runDemo} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a general health or medicine question..."
              maxLength={300}
              required
              className="flex-1 w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#10b981]"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="btn w-full sm:w-fit px-6 py-3 rounded-lg bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask AI"}
            </button>
          </form>

          {error && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>}

          <AnimatePresence>
            {reply && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#0d0d16] border border-[#10b981]/25 rounded-xl p-5"
              >
                <div className="text-[10px] font-bold tracking-wider text-[#6ee7b7] uppercase mb-3">AI Response</div>
                <div className="text-sm text-[#eeeef8] leading-relaxed">{renderReply(reply)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 2: OCR Prescription Reader */}
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
            <div className="text-xs font-bold text-[#6ee7b7] uppercase tracking-wider mb-2">
              📄 OCR Extracted Items ({selectedRx.doctor})
            </div>
            <ul className="space-y-1.5 text-xs text-white/90 mb-4 list-disc list-inside">
              {selectedRx.medicines.map((med, idx) => (
                <li key={idx}>{med}</li>
              ))}
            </ul>
            <div className="border-t border-white/10 pt-3 text-xs text-[#9aa0b8]">
              <p><strong className="text-white">Dosage Advice:</strong> {selectedRx.advice}</p>
              <p className="mt-1"><strong className="text-[#6ee7b7]">Safety Check:</strong> {selectedRx.safety}</p>
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

