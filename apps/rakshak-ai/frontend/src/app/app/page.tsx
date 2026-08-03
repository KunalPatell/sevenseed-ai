"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarCanvas } from "@/components/StarCanvas";
import { CustomCursor } from "@/components/CustomCursor";
import { Shield, Scan, UserCheck, Armchair, Zap, CheckCircle, Lock } from "lucide-react";

export default function WorkstationApp() {
  const [activeTab, setActiveTab] = useState<"mask" | "face" | "occupancy">("mask");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const runScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      if (activeTab === "mask") {
        setScanResult({
          status: "COMPLIANT",
          maskDetected: true,
          confidence: "98.7%",
          compliance: "Pass",
          ppeType: "Surgical / N95 Respirator",
        });
      } else if (activeTab === "face") {
        setScanResult({
          status: "VERIFIED",
          identity: "Kunal Patel (AI/ML Engineer)",
          empId: "KP-9482",
          matchScore: "99.3%",
          time: new Date().toLocaleTimeString(),
        });
      } else {
        setScanResult({
          status: "COMPLETED",
          totalSeats: 20,
          occupiedSeats: 12,
          emptySeats: 8,
          capacityPercentage: "60.0%",
          occupancyRisk: "Optimal",
        });
      }
    }, 1200);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

          <button
            onClick={() => { setActiveTab("occupancy"); setScanResult(null); }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === "occupancy"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <Armchair className="h-6 w-6 text-emerald-400 mb-2" />
            <h3 className="font-bold text-white text-base">YOLO Chair Occupancy Counter</h3>
            <p className="text-xs text-[#7e6f73] mt-1">Seating capacity & room utilization monitoring.</p>
          </button>
        </div>

        {/* Console Box */}
        <div className="glow-card p-6 md:p-8 border border-[#ef4444]/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">
              {activeTab === "mask" && "Mask PPE Scanner Console"}
              {activeTab === "face" && "Facial Attendance Verification Console"}
              {activeTab === "occupancy" && "YOLO Room Occupancy Analytics Console"}
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
                    <span className="font-bold text-emerald-400">{scanResult.status}</span>
                  </div>
                  {scanResult.confidence && (
                    <div className="flex justify-between">
                      <span className="text-[#7e6f73]">Confidence:</span>
                      <span className="font-bold text-white">{scanResult.confidence}</span>
                    </div>
                  )}
                  {scanResult.identity && (
                    <div className="flex justify-between">
                      <span className="text-[#7e6f73]">Identity:</span>
                      <span className="font-bold text-white">{scanResult.identity}</span>
                    </div>
                  )}
                  {scanResult.totalSeats && (
                    <div className="flex justify-between">
                      <span className="text-[#7e6f73]">Capacity:</span>
                      <span className="font-bold text-white">{scanResult.occupiedSeats}/{scanResult.totalSeats} Seats</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] text-[#7e6f73]">
                <span>Status: OK</span>
                <span>Latency: 14ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
