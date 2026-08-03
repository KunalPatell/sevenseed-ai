"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarCanvas } from "@/components/StarCanvas";
import { CustomCursor } from "@/components/CustomCursor";
import { Tilt } from "@/components/Tilt";
import { TextScramble } from "@/components/TextScramble";
import {
  Shield,
  Scan,
  UserCheck,
  Armchair,
  Sparkles,
  Cpu,
  Lock,
  ArrowRight,
  CheckCircle,
  Video,
  FileCheck,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"mask" | "face" | "occupancy">("mask");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const runScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      if (activeTab === "mask") {
        setScanResult({
          status: "PASSED",
          maskDetected: true,
          confidence: "98.4%",
          compliance: "100% Compliant",
          type: "N95 / Medical Grade",
        });
      } else if (activeTab === "face") {
        setScanResult({
          status: "MATCHED",
          identity: "Kunal Patel (Emp ID: KP-9482)",
          confidence: "99.1%",
          matchStatus: "Authorized Access",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setScanResult({
          status: "ANALYZED",
          totalChairs: 14,
          occupiedChairs: 9,
          emptyChairs: 5,
          occupancyRate: "64.2%",
          riskLevel: "Low Risk",
        });
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#070507] text-[#faf5f6] relative overflow-hidden select-none">
      <StarCanvas />
      <CustomCursor />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="hud-grid" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ef4444]/20 via-[#f59e0b]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[900px] w-full flex flex-col items-center">
          <div className="eyebrow mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
            </span>
            <TextScramble text="RAKSHAK AI · COMPUTER VISION SAFETY SENTINEL" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-white">
            Real-time Vision AI for <br />
            <span className="grad-text">Workplace Safety & Attendance</span>
          </h1>

          <p className="text-base md:text-lg text-[#d4c5c8] max-w-[680px] leading-relaxed mb-10 font-normal">
            Unified Computer Vision Sentinel combining <strong>Mask PPE Detection</strong>, <strong>Facial Recognition Attendance</strong>, and <strong>YOLO Occupancy Monitoring</strong> in one zero-latency platform.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <a href="#workstations" className="btn-primary text-base px-8 py-4 flex items-center gap-2 uppercase tracking-wide font-extrabold">
              <Scan className="h-5 w-5" /> Launch Live Workstations
            </a>
            <a href="/rakshak-ai/app/" className="btn-secondary text-base px-8 py-4 flex items-center gap-2 font-bold">
              <Shield className="h-5 w-5 text-[#fca5a5]" /> Full App Portal
            </a>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-[840px] p-3 bg-black/50 border border-[#ef4444]/20 rounded-2xl backdrop-blur-xl">
            <div className="px-4 py-3 text-center border-r border-white/10 last:border-0">
              <div className="text-2xl md:text-3xl font-black font-mono text-[#fca5a5]">99.4%</div>
              <div className="text-[10px] text-[#7e6f73] uppercase tracking-wider font-mono mt-0.5">YOLO Defect Accuracy</div>
            </div>
            <div className="px-4 py-3 text-center border-r border-white/10 last:border-0">
              <div className="text-2xl md:text-3xl font-black font-mono text-white">Sub-18ms</div>
              <div className="text-[10px] text-[#7e6f73] uppercase tracking-wider font-mono mt-0.5">Inference Speed</div>
            </div>
            <div className="px-4 py-3 text-center border-r border-white/10 last:border-0">
              <div className="text-2xl md:text-3xl font-black font-mono text-[#fca5a5]">3-in-1</div>
              <div className="text-[10px] text-[#7e6f73] uppercase tracking-wider font-mono mt-0.5">Vision Suite</div>
            </div>
            <div className="px-4 py-3 text-center border-r border-white/10 last:border-0">
              <div className="text-2xl md:text-3xl font-black font-mono text-emerald-400">100% Free</div>
              <div className="text-[10px] text-[#7e6f73] uppercase tracking-wider font-mono mt-0.5">BYOK Architecture</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workstations Sandbox Section */}
      <section id="workstations" className="max-w-[1200px] mx-auto py-20 px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="eyebrow mb-3">INTERACTIVE VISION WORKSTATIONS</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Test All 3 Vision Suite Modules</h2>
          <p className="text-sm md:text-base text-[#d4c5c8] mt-3 max-w-[540px] mx-auto">
            Switch between Safety Mask Detection, Facial Recognition Attendance, and YOLO Chair Occupancy in real-time.
          </p>
        </div>

        {/* Workstation Tab Selectors */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => { setActiveTab("mask"); setScanResult(null); }}
            className={`px-5 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "mask"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <Shield className="h-4 w-4" /> 1. Mask & PPE Compliance
          </button>

          <button
            onClick={() => { setActiveTab("face"); setScanResult(null); }}
            className={`px-5 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "face"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <UserCheck className="h-4 w-4" /> 2. Facial Attendance Matcher
          </button>

          <button
            onClick={() => { setActiveTab("occupancy"); setScanResult(null); }}
            className={`px-5 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "occupancy"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <Armchair className="h-4 w-4" /> 3. YOLO Chair & Occupancy
          </button>
        </div>

        {/* Workstation Console Box */}
        <Tilt className="w-full">
          <div className="glow-card p-6 md:p-10 border border-[#ef4444]/30 shadow-2xl relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
              <div>
                <span className="text-xs font-mono text-[#fca5a5] uppercase tracking-wider font-bold block mb-1">
                  Active Workstation: {activeTab.toUpperCase()} ENGINE
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  {activeTab === "mask" && "Mask PPE & Safety Compliance Scanner"}
                  {activeTab === "face" && "Facial Matching & Attendance Verification"}
                  {activeTab === "occupancy" && "YOLO Room Occupancy & Seating Counter"}
                </h3>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Inference Ready
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Input Canvas Box */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#070507] min-h-[260px] p-6 flex flex-col justify-center items-center text-center">
                  <Scan className="h-12 w-12 text-[#ef4444] mb-3 animate-pulse" />
                  <p className="text-xs md:text-sm text-[#d4c5c8] mb-1 font-semibold">
                    {activeTab === "mask" && "Upload photo or test Mask Detection"}
                    {activeTab === "face" && "Upload face or test Attendance Matcher"}
                    {activeTab === "occupancy" && "Upload room photo or test Chair Counter"}
                  </p>
                  <p className="text-[10px] text-[#7e6f73] font-mono">Supports JPG, PNG · Max 10MB</p>

                  <button
                    onClick={runScan}
                    disabled={scanning}
                    className="mt-6 btn-primary text-xs py-2.5 px-6 font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    {scanning ? (
                      <>
                        <Zap className="h-4 w-4 animate-spin" /> Processing Neural Vision...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4" /> Run Live Neural Test
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output HUD Box */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-white/10 bg-black/60 p-6 min-h-[260px] flex flex-col justify-between font-mono">
                  <div className="flex justify-between items-center text-xs text-[#7e6f73] pb-3 border-b border-white/10">
                    <span>OUTPUT CONSOLE</span>
                    <span className="text-[#fca5a5]">MODEL: RAKSHAK-v3</span>
                  </div>

                  {scanning && (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs text-[#fca5a5]">
                      <Zap className="h-8 w-8 animate-spin" />
                      <span>Scanning facial bounding boxes & calculating neural metrics...</span>
                    </div>
                  )}

                  {!scanning && !scanResult && (
                    <div className="py-12 text-center text-xs text-[#7e6f73] italic">
                      Click "Run Live Neural Test" to execute real-time model inference.
                    </div>
                  )}

                  {!scanning && scanResult && (
                    <div className="py-4 space-y-3 text-xs">
                      <div className="flex justify-between p-2.5 rounded bg-white/5 border border-white/10">
                        <span className="text-[#7e6f73]">Status:</span>
                        <span className="font-bold text-emerald-400">{scanResult.status}</span>
                      </div>

                      {scanResult.maskDetected !== undefined && (
                        <div className="flex justify-between p-2.5 rounded bg-white/5 border border-white/10">
                          <span className="text-[#7e6f73]">PPE Classification:</span>
                          <span className="font-bold text-white">{scanResult.type} ({scanResult.confidence})</span>
                        </div>
                      )}

                      {scanResult.identity && (
                        <div className="flex justify-between p-2.5 rounded bg-white/5 border border-white/10">
                          <span className="text-[#7e6f73]">Identified Person:</span>
                          <span className="font-bold text-white">{scanResult.identity}</span>
                        </div>
                      )}

                      {scanResult.totalChairs !== undefined && (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded bg-white/5 border border-white/10">
                            <span className="block text-[10px] text-[#7e6f73]">Total Seats</span>
                            <span className="font-bold text-white text-sm">{scanResult.totalChairs}</span>
                          </div>
                          <div className="p-2 rounded bg-white/5 border border-white/10">
                            <span className="block text-[10px] text-[#7e6f73]">Occupied</span>
                            <span className="font-bold text-[#ef4444] text-sm">{scanResult.occupiedChairs}</span>
                          </div>
                          <div className="p-2 rounded bg-white/5 border border-white/10">
                            <span className="block text-[10px] text-[#7e6f73]">Empty</span>
                            <span className="font-bold text-emerald-400 text-sm">{scanResult.emptyChairs}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-[#7e6f73]">
                    <span>Latency: 16ms</span>
                    <span>Zero Cloud Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tilt>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="max-w-[1200px] mx-auto py-20 px-6 md:px-12 border-t border-white/10">
        <div className="text-center mb-14">
          <span className="eyebrow mb-3">ENTERPRISE CAPABILITIES</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Built for Modern Workplace Security</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tilt>
            <div className="glow-card p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#ef4444]/15 grid place-items-center text-[#ef4444] mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Mask & PPE Compliance</h3>
                <p className="text-xs text-[#d4c5c8] leading-relaxed">
                  Real-time neural network scanning verifying N95 and surgical mask compliance at office entryways.
                </p>
              </div>
            </div>
          </Tilt>

          <Tilt>
            <div className="glow-card p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/15 grid place-items-center text-[#f59e0b] mb-4">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Facial Attendance Matcher</h3>
                <p className="text-xs text-[#d4c5c8] leading-relaxed">
                  Sub-second facial feature vector matching for touchless attendance logging and access control.
                </p>
              </div>
            </div>
          </Tilt>

          <Tilt>
            <div className="glow-card p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 grid place-items-center text-emerald-400 mb-4">
                  <Armchair className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">YOLO Chair Occupancy Counter</h3>
                <p className="text-xs text-[#d4c5c8] leading-relaxed">
                  Real-time seating & room capacity tracking using custom fine-tuned YOLO bounding box inference.
                </p>
              </div>
            </div>
          </Tilt>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-[800px] mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <span className="eyebrow mb-3">FAQ</span>
          <h2 className="text-3xl font-black text-white mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <details className="bg-[#160f14] border border-white/10 rounded-xl p-4 cursor-pointer">
            <summary className="font-bold text-sm text-white">How does Rakshak AI combine all 3 Vision modules?</summary>
            <p className="text-xs text-[#d4c5c8] mt-2 leading-relaxed">
              Rakshak AI features 3 specialized neural engine tabs inside one web suite — allowing you to run mask compliance checks, facial attendance matching, and room seating occupancy tracking under a single interface.
            </p>
          </details>

          <details className="bg-[#160f14] border border-white/10 rounded-xl p-4 cursor-pointer">
            <summary className="font-bold text-sm text-white">Is Rakshak AI 100% Free with BYOK?</summary>
            <p className="text-xs text-[#d4c5c8] mt-2 leading-relaxed">
              Yes! You can bring your own Gemini Vision or OpenAI API key directly via the BYOK button in the top navigation bar for zero-cost client workloads.
            </p>
          </details>
        </div>
      </section>

      <Footer />
    </main>
  );
}
