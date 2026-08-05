"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarCanvas } from "@/components/StarCanvas";
import { CustomCursor } from "@/components/CustomCursor";
import { Shield, Scan, UserCheck, Zap, CheckCircle, Lock } from "lucide-react";

export default function WorkstationApp() {
  const [activeTab, setActiveTab] = useState<"mask" | "face">("mask");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // This used to be a setTimeout with hardcoded results and no network call at
  // all: mask always "COMPLIANT / 98.7%", face always "VERIFIED — Kunal Patel
  // (KP-9482) / 99.3%". Nothing was analysed, and the numbers were precise
  // enough to be believed. It now calls the backend and shows what comes back.
  const runScan = async () => {
    setScanning(true);
    setScanResult(null);

    const endpoint = activeTab === "mask" ? "/api/scan-mask" : "/api/verify-face";

    try {
      const res = await fetch(`/rakshak-ai${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: activeTab }),
      });
      const data = await res.json();
      setScanResult({
        status: data.status ?? "ERROR",
        implemented: data.implemented !== false,
        message: data.message ?? data.detail ?? null,
        identity: data.person_id ?? null,
        confidence:
          typeof data.similarity === "number"
            ? `${(data.similarity * 100).toFixed(1)}%`
            : null,
        time: new Date().toLocaleTimeString(),
      });
    } catch {
      setScanResult({
        status: "ERROR",
        implemented: false,
        message: "Could not reach the Rakshak service.",
        time: new Date().toLocaleTimeString(),
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070507] text-[#faf5f6] relative overflow-hidden">
      <StarCanvas />
      <CustomCursor />
      <Navbar />

      <div className="pt-28 pb-16 px-6 md:px-12 max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="eyebrow mb-2">
              <Shield className="h-3.5 w-3.5 text-[#ef4444]" />
              <span>RAKSHAK AI · FULL SUITE WORKSTATION</span>
            </div>
            <h1 className="text-3xl font-black text-white">Rakshak Vision Security Portal</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              ● Neural Engines Active
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => { setActiveTab("mask"); setScanResult(null); }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === "mask"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <Shield className="h-6 w-6 text-[#ef4444] mb-2" />
            <h3 className="font-bold text-white text-base">Mask & PPE Compliance</h3>
            <p className="text-xs text-[#7e6f73] mt-1">Real-time mask classification & entry scanner.</p>
          </button>

          <button
            onClick={() => { setActiveTab("face"); setScanResult(null); }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === "face"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <UserCheck className="h-6 w-6 text-[#f59e0b] mb-2" />
            <h3 className="font-bold text-white text-base">Facial Attendance Matcher</h3>
            <p className="text-xs text-[#7e6f73] mt-1">Touchless attendance logging & identity check.</p>
          </button>

        </div>

        {/* Console Box */}
        <div className="glow-card p-6 md:p-8 border border-[#ef4444]/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">
              {activeTab === "mask" && "Mask PPE Scanner Console"}
              {activeTab === "face" && "Facial Attendance Verification Console"}
            </h3>
            <button
              onClick={runScan}
              disabled={scanning}
              className="btn-primary text-xs py-2 px-5 flex items-center gap-2 cursor-pointer"
            >
              {scanning ? <Zap className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
              {scanning ? "Processing..." : "Run Inspection"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-xl bg-black/60 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
              <Scan className="h-10 w-10 text-[#ef4444] mb-2 animate-pulse" />
              <p className="text-xs text-[#d4c5c8] font-semibold">Webcam / Image Processing Frame</p>
              <p className="text-[10px] text-[#7e6f73] font-mono mt-1">Frame resolution: 1280x720 · FPS: 60</p>
            </div>

            <div className="border border-white/10 rounded-xl bg-black/60 p-6 font-mono min-h-[220px] flex flex-col justify-between text-xs">
              <div className="text-[#7e6f73] pb-2 border-b border-white/10 flex justify-between">
                <span>INFERENCE REPORT</span>
                <span className="text-[#fca5a5]">RAKSHAK-SENTINEL</span>
              </div>

              {!scanning && !scanResult && (
                <div className="py-8 text-center text-[#7e6f73] italic">
                  Press "Run Inspection" to test model output.
                </div>
              )}

              {scanning && (
                <div className="py-8 text-center text-[#fca5a5] animate-pulse">
                  Extracting feature vectors & bounding boxes...
                </div>
              )}

              {scanResult && (
                <div className="space-y-2 py-2">
                  <div className="flex justify-between">
                    <span className="text-[#7e6f73]">Status:</span>
                    <span className={`font-bold ${scanResult.implemented ? "text-emerald-400" : "text-amber-400"}`}>
                      {scanResult.status}
                    </span>
                  </div>
                  {scanResult.identity && (
                    <div className="flex justify-between">
                      <span className="text-[#7e6f73]">Checked against:</span>
                      <span className="font-bold text-white">{scanResult.identity}</span>
                    </div>
                  )}
                  {scanResult.confidence && (
                    <div className="flex justify-between">
                      <span className="text-[#7e6f73]">Similarity:</span>
                      <span className="font-bold text-white">{scanResult.confidence}</span>
                    </div>
                  )}
                  {scanResult.message && (
                    <p className="text-[11px] text-[#c9b8bc] leading-relaxed pt-1">
                      {scanResult.message}
                    </p>
                  )}
                </div>
              )}

              {/* Was a fixed "Status: OK · Latency: 14ms" that never reflected
                  anything. Shows the time of the actual call instead. */}
              <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] text-[#7e6f73]">
                <span>{scanResult ? `Last run: ${scanResult.time}` : "No scan run yet"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
