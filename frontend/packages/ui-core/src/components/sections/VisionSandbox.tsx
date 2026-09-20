"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  ShieldAlert,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "../ui";
import { sound } from "../../lib/sound";

type SimulationMode = "yolo_defect" | "face_biometrics" | "agent_trace";

export function VisionSandbox() {
  const [mode, setMode] = useState<SimulationMode>("yolo_defect");
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);

  const startSimulation = (selectedMode: SimulationMode) => {
    setMode(selectedMode);
    setIsRunning(true);
    setStep(0);
    sound.playScan();

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsRunning(false);
          sound.playSuccess();
          return 3;
        }
        sound.playHover();
        return prev + 1;
      });
    }, 700);
  };

  return (
    <section id="vision-sandbox" className="section bg-[#050505] border-t border-white/5 relative">
      <div className="container-px relative z-10">
        <SectionHeading
          eyebrow="Interactive AI Engineering Sandbox"
          title={
            <>
              Live Simulation: <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">Vision &amp; Multi-Agent</span> Pipelines
            </>
          }
          description="Test interactive simulations of Kunal's custom YOLOv8 defect detection, biometric face matching, and autonomous agent execution traces."
        />

        {/* Mode Selector Tabs */}
        <div data-blur-in className="mb-8 flex flex-wrap gap-3">
          {[
            { id: "yolo_defect" as const, label: "YOLOv8 Structural Defect Scanner (Breakdown Factor)" },
            { id: "face_biometrics" as const, label: "Face Biometrics & PPE Mask Scanner (Rakshak AI)" },
            { id: "agent_trace" as const, label: "LangGraph Multi-Agent Execution Trace (Sevenforce)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => startSimulation(tab.id)}
              className={`rounded-xl border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                mode === tab.id
                  ? "border-[#9ed8ff]/50 bg-[#9ed8ff]/10 text-[#9ed8ff] shadow-[0_0_15px_rgba(158,216,255,0.2)]"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#9ed8ff]" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Simulator Screen */}
        <div data-blur-in className="glass-card p-6 sm:p-8 overflow-hidden font-mono border border-white/10">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-white">
                Interactive Pipeline Monitor
              </span>
            </div>
            <button
              onClick={() => startSimulation(mode)}
              disabled={isRunning}
              className="inline-flex items-center gap-2 rounded-lg border border-[#9ed8ff]/40 bg-[#9ed8ff]/10 px-3.5 py-1.5 text-xs text-[#9ed8ff] transition-all hover:bg-[#9ed8ff]/20 disabled:opacity-40"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" /> Re-Run Pipeline
                </>
              )}
            </button>
          </div>

          {/* Mode 1: YOLOv8 Structural Defect Scanner */}
          {mode === "yolo_defect" && (
            <div className="grid gap-6 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative rounded-2xl border border-white/10 bg-[#080a0f] p-6 h-64 flex flex-col justify-center items-center overflow-hidden">
                {/* Simulated Camera Feed / Blueprint Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Simulated Bounding Box 1 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.8 }}
                  className="absolute top-12 left-16 border-2 border-amber-400 bg-amber-400/10 p-2 rounded text-[10px] text-amber-300 font-bold"
                >
                  [Wall Crack #01] 96.4% Conf
                  <div className="text-[8px] font-normal text-amber-200">Severity: Class-B Structural</div>
                </motion.div>

                {/* Simulated Bounding Box 2 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.8 }}
                  className="absolute bottom-12 right-20 border-2 border-red-500 bg-red-500/10 p-2 rounded text-[10px] text-red-300 font-bold"
                >
                  [Pipe Leak #03] 98.1% Conf
                  <div className="text-[8px] font-normal text-red-200">Severity: High Hydraulic</div>
                </motion.div>

                {/* Center scan line */}
                {isRunning && (
                  <motion.div
                    animate={{ y: [-100, 100, -100] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#9ed8ff] to-transparent shadow-[0_0_15px_#9ed8ff]"
                  />
                )}

                <div className="text-center z-10 text-white/40 text-xs">
                  {step === 0 && "Initializing PyTorch YOLOv8 Tensor..."}
                  {step === 1 && "Detected 1 structural surface crack..."}
                  {step === 2 && "Detected 1 hydraulic pipe anomaly..."}
                  {step >= 3 && "✓ Frame scan completed. Ingesting BOQ concrete metrics."}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Model Architecture</span>
                  <span className="text-white font-semibold">YOLOv8 best.pt (Custom 10-Class Weights)</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Inference Latency</span>
                  <span className="text-emerald-400 font-semibold">45.2ms per frame (CUDA / ONNX)</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Integrated BOQ Calculator</span>
                  <span className="text-[#cfae6e] font-semibold">IS-456 Concrete &amp; Steel Volume Output</span>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Face Biometrics & PPE Mask Scanner */}
          {mode === "face_biometrics" && (
            <div className="grid gap-6 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative rounded-2xl border border-white/10 bg-[#080a0f] p-6 h-64 flex flex-col justify-center items-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative grid place-items-center w-36 h-36 rounded-full border border-emerald-500/50 bg-emerald-500/5"
                >
                  <Scan className="h-16 w-16 text-emerald-400 animate-pulse" />
                  <span className="absolute bottom-2 rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300">
                    512-D VECTOR MATCH
                  </span>
                </motion.div>
                <div className="text-center mt-3 text-xs text-white/60">
                  {step >= 2 ? "Identity Verified: Match Confidence 99.4%" : "Extracting Facial Embeddings..."}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">PPE Compliance Status</span>
                  <span className="text-emerald-400 font-semibold">✓ Safety Mask Compliant (98.5%)</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Embedding Match Time</span>
                  <span className="text-[#9ed8ff] font-semibold">35ms Cosine Similarity</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Platform Integration</span>
                  <span className="text-white font-semibold">Rakshak AI Public Safety Station</span>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: LangGraph Multi-Agent Execution Trace */}
          {mode === "agent_trace" && (
            <div className="space-y-2 text-xs bg-[#05070c] p-4 rounded-xl border border-white/5 h-64 overflow-y-auto scrollbar-thin">
              <div className="text-[#9ed8ff]">[0.00s] &gt; INBOUND EVENT: Customer Webhook Trigger received.</div>
              {step >= 1 && (
                <div className="text-white/80">[0.24s] &gt; ROUTER AGENT: Dispatched payload to LangGraph qualification DAG.</div>
              )}
              {step >= 2 && (
                <div className="text-[#cfae6e]">[0.58s] &gt; VECTOR RAG: ChromaDB retrieved 4 historical customer interactions.</div>
              )}
              {step >= 3 && (
                <div className="text-emerald-400">[0.95s] &gt; AGENT ACTION: Lead scored 94/100 -&gt; Automated calendar invite sent via n8n.</div>
              )}
              {step >= 3 && (
                <div className="text-white/40 text-[10px] pt-2">// EXECUTION FINISHED: Status 200 OK | Latency: 950ms</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
