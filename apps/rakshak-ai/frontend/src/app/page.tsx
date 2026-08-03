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
  FileText,
  MessageSquare,
  AlertTriangle,
  Send,
  Zap,
  CheckCircle,
  PhoneCall,
  Lock,
  Download,
  Building2,
  FileCheck,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"mask" | "face" | "occupancy" | "fir" | "chat">("mask");
  
  // Vision states
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // FIR states
  const [complainantName, setComplainantName] = useState("");
  const [phone, setPhone] = useState("");
  const [crimeCategory, setCrimeCategory] = useState("Vehicle Theft");
  const [incidentDetails, setIncidentDetails] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("SG Highway, Ahmedabad");
  const [firResult, setFirResult] = useState<any>(null);

  // Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: string; text: string; sos?: boolean }>>([
    { sender: "bot", text: "Hello! I am Rakshak AI Police Copilot & Citizen Assistant. How can I help you today?" }
  ]);
  const [sosSent, setSosSent] = useState(false);

  const runVisionScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      if (activeTab === "mask") {
        setScanResult({
          status: "PASSED",
          maskDetected: true,
          confidence: "98.7%",
          compliance: "100% PPE Compliant",
          type: "N95 / Medical Respirator",
        });
      } else if (activeTab === "face") {
        setScanResult({
          status: "MATCHED",
          identity: "Kunal Patel (Emp ID: KP-9482)",
          confidence: "99.3%",
          matchStatus: "Authorized Access",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else if (activeTab === "occupancy") {
        setScanResult({
          status: "ANALYZED",
          totalChairs: 20,
          occupiedChairs: 12,
          emptyChairs: 8,
          occupancyRate: "60.0%",
          riskLevel: "Optimal Capacity",
        });
      }
    }, 1200);
  };

  const handleGenerateFIR = (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const firId = `FIR-${Math.floor(100000 + Math.random() * 900000)}`;
      setFirResult({
        id: firId,
        name: complainantName || "Citizen User",
        phone: phone || "9876543210",
        type: "Online Citizen Complaint Draft",
        crimeCategory,
        location: incidentLocation,
        time: new Date().toLocaleString(),
        summary: incidentDetails || "Theft incident reported near SG Highway.",
        legalSections: [
          crimeCategory === "Vehicle Theft" ? "BNS Section 303(2) — Theft of Motor Vehicle" : "BNS Section 318(4) — Cheating & Financial Fraud",
          "BNS Section 317 — Possession of Stolen Property"
        ],
        status: "Draft Generated (Pending Verification)"
      });
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatLog((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      const lower = userText.lowerCase ? userText.lowerCase() : userText.toLowerCase();
      if (lower.includes("sos") || lower.includes("help") || lower.includes("danger") || lower.includes("attack")) {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            // Was: "EMERGENCY DISPATCHED: Control Room 112 & nearest police patrol
            // alerted to your geolocation!" Nothing is dispatched and nobody is
            // alerted — /api/sos returns a hardcoded string. Telling someone in
            // danger that help is coming, when it is not, can make them stop
            // seeking it. This app cannot contact the police, so it says so and
            // gives the number that can.
            text: "This app cannot contact the police. Call 112 now (or 100 for police, 1091 women's helpline). Keep your phone on and move somewhere safe if you can.",
            sos: true
          }
        ]);
        setSosSent(true);
      } else if (lower.includes("fir") || lower.includes("complaint")) {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "📝 I can help you draft an FIR with applicable Bharatiya Nyaya Sanhita (BNS) codes! Select the 'Automatic FIR Generator' tab above."
          }
        ]);
      } else if (lower.includes("cyber") || lower.includes("otp") || lower.includes("fraud")) {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "🛡️ Cybercrime Scam Alert: Call 1930 immediately to freeze fraudulent bank transactions. Save transaction ID screenshots!"
          }
        ]);
      } else {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Rakshak AI Citizen Assistant active. You can register FIR drafts, analyze cyber fraud, or trigger Emergency SOS anytime."
          }
        ]);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#070507] text-[#faf5f6] relative overflow-hidden select-none">
      <StarCanvas />
      <CustomCursor />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="hud-grid" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ef4444]/20 via-[#f59e0b]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[960px] w-full flex flex-col items-center">
          <div className="eyebrow mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
            </span>
            <TextScramble text="RAKSHAK AI · FULL-STACK CITIZEN SAFETY & VISION SENTINEL" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-white">
            AI Citizen Assistant, Police Copilot & <br />
            <span className="grad-text">Vision Security Sentinel</span>
          </h1>

          <p className="text-base md:text-lg text-[#d4c5c8] max-w-[720px] leading-relaxed mb-10 font-normal">
            Unified 5-in-1 Platform combining <strong>Automatic FIR Generation (BNS/IPC)</strong>, <strong>Multilingual AI Chatbot</strong>, <strong>Cybercrime Scam Analyzer</strong>, <strong>Safety Mask PPE Scanner</strong>, and <strong>YOLO Occupancy Monitoring</strong>.
          </p>

          {/* Emergency SOS Banner */}
          <div className="w-full max-w-[840px] p-4 mb-10 rounded-2xl bg-gradient-to-r from-red-950/80 via-[#160f14] to-red-950/80 border border-[#ef4444]/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-red-600/30 text-red-400 grid place-items-center animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">One-Press Emergency Police SOS (112)</h4>
                <p className="text-xs text-[#d4c5c8]">Instant geolocation dispatch to nearest control room</p>
              </div>
            </div>
            <button
              onClick={() => setSosSent(true)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" /> Trigger Emergency SOS
            </button>
          </div>

          {/* This panel used to read "EMERGENCY ALERT DISPATCHED! Patrol Car #104
              assigned. Arrival: ~5 Mins." No patrol car exists, nothing is
              dispatched, and there is no integration with any control room —
              /api/sos returns a fixed string. A person in danger who believes a
              car is five minutes away may stop calling for help. The button now
              dials the real emergency line instead of pretending. */}
          {sosSent && (
            <div className="w-full max-w-[840px] p-5 mb-8 rounded-xl bg-red-500/15 border border-red-500/50 text-left">
              <p className="text-sm font-bold text-red-200">
                This app cannot call the police for you.
              </p>
              <p className="text-xs text-red-100/80 mt-1.5 leading-relaxed">
                Rakshak has no connection to any control room and cannot dispatch anyone.
                If you are in danger, call now — these lines are free and work from any phone.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href="tel:112" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-sm">
                  Call 112 — Emergency
                </a>
                <a href="tel:100" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15">
                  100 — Police
                </a>
                <a href="tel:1091" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15">
                  1091 — Women&apos;s Helpline
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5 Workstations Sandbox Section */}
      <section id="workstations" className="max-w-[1200px] mx-auto py-12 px-6 md:px-12">
        <div className="text-center mb-10">
          <span className="eyebrow mb-2">5-IN-1 AI SUITE WORKSTATIONS</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Select Active Engine Workstation</h2>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => { setActiveTab("mask"); setScanResult(null); }}
            className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "mask"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <Shield className="h-4 w-4" /> 1. Mask PPE Compliance
          </button>

          <button
            onClick={() => { setActiveTab("face"); setScanResult(null); }}
            className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "face"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <UserCheck className="h-4 w-4" /> 2. Facial Attendance Matcher
          </button>

          <button
            onClick={() => { setActiveTab("occupancy"); setScanResult(null); }}
            className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "occupancy"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <Armchair className="h-4 w-4" /> 3. YOLO Chair Occupancy
          </button>

          <button
            onClick={() => { setActiveTab("fir"); setFirResult(null); }}
            className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "fir"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" /> 4. FIR Generator (BNS)
          </button>

          <button
            onClick={() => { setActiveTab("chat"); }}
            className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]"
                : "bg-[#160f14] border border-white/10 text-[#d4c5c8] hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> 5. Citizen AI Copilot
          </button>
        </div>

        {/* Workstation Console Box */}
        <Tilt className="w-full">
          <div className="glow-card p-6 md:p-8 border border-[#ef4444]/30 shadow-2xl relative">

            {/* VISION WORKSTATIONS (1, 2, 3) */}
            {(activeTab === "mask" || activeTab === "face" || activeTab === "occupancy") && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 flex flex-col gap-4">
                  <div className="relative rounded-2xl border border-white/15 bg-[#070507] min-h-[260px] p-6 flex flex-col justify-center items-center text-center">
                    <Scan className="h-12 w-12 text-[#ef4444] mb-3 animate-pulse" />
                    <p className="text-xs md:text-sm text-[#d4c5c8] mb-1 font-semibold">
                      {activeTab === "mask" && "Neural Mask PPE Compliance Engine"}
                      {activeTab === "face" && "Sub-Second Facial Attendance Matcher"}
                      {activeTab === "occupancy" && "YOLO Room Seating Occupancy Engine"}
                    </p>
                    <button
                      onClick={runVisionScan}
                      disabled={scanning}
                      className="mt-6 btn-primary text-xs py-2.5 px-6 font-extrabold flex items-center gap-2 cursor-pointer"
                    >
                      {scanning ? <Zap className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
                      {scanning ? "Processing Neural Model..." : "Execute Neural Inspection"}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 font-mono text-xs">
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-6 min-h-[260px] flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[#7e6f73] pb-3 border-b border-white/10">
                      <span>CONSOLE OUTPUT</span>
                      <span className="text-[#fca5a5]">MODEL: RAKSHAK-SENTINEL-v2</span>
                    </div>

                    {!scanning && !scanResult && (
                      <div className="py-12 text-center text-[#7e6f73] italic">
                        Click "Execute Neural Inspection" to run model inference.
                      </div>
                    )}

                    {scanning && (
                      <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#fca5a5]">
                        <Zap className="h-8 w-8 animate-spin" />
                        <span>Calculating bounding boxes & neural feature vectors...</span>
                      </div>
                    )}

                    {scanResult && (
                      <div className="py-4 space-y-2.5">
                        <div className="flex justify-between p-2 rounded bg-white/5 border border-white/10">
                          <span className="text-[#7e6f73]">Status:</span>
                          <span className="font-bold text-emerald-400">{scanResult.status}</span>
                        </div>
                        {scanResult.compliance && (
                          <div className="flex justify-between p-2 rounded bg-white/5 border border-white/10">
                            <span className="text-[#7e6f73]">PPE Classification:</span>
                            <span className="font-bold text-white">{scanResult.type} ({scanResult.confidence})</span>
                          </div>
                        )}
                        {scanResult.identity && (
                          <div className="flex justify-between p-2 rounded bg-white/5 border border-white/10">
                            <span className="text-[#7e6f73]">Verified User:</span>
                            <span className="font-bold text-white">{scanResult.identity}</span>
                          </div>
                        )}
                        {scanResult.totalChairs && (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded bg-white/5 border border-white/10">
                              <span className="block text-[10px] text-[#7e6f73]">Capacity</span>
                              <span className="font-bold text-white">{scanResult.totalChairs} Seats</span>
                            </div>
                            <div className="p-2 rounded bg-white/5 border border-white/10">
                              <span className="block text-[10px] text-[#7e6f73]">Occupied</span>
                              <span className="font-bold text-[#ef4444]">{scanResult.occupiedChairs}</span>
                            </div>
                            <div className="p-2 rounded bg-white/5 border border-white/10">
                              <span className="block text-[10px] text-[#7e6f73]">Empty</span>
                              <span className="font-bold text-emerald-400">{scanResult.emptyChairs}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* WORKSTATION 4: FIR GENERATOR */}
            {activeTab === "fir" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <form onSubmit={handleGenerateFIR} className="lg:col-span-6 space-y-4 text-left">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#ef4444]" /> Automatic FIR Generator (BNS/IPC)
                  </h3>
                  <div>
                    <label className="block text-xs font-mono text-[#d4c5c8] mb-1">Complainant Name</label>
                    <input
                      type="text"
                      value={complainantName}
                      onChange={(e) => setComplainantName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-[#070507] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#ef4444]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-[#d4c5c8] mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-[#070507] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#ef4444]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#d4c5c8] mb-1">Crime Category</label>
                      <select
                        value={crimeCategory}
                        onChange={(e) => setCrimeCategory(e.target.value)}
                        className="w-full bg-[#070507] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#ef4444]"
                      >
                        <option value="Vehicle Theft">Vehicle Theft</option>
                        <option value="Mobile / Electronics Theft">Mobile Theft</option>
                        <option value="Personal Property Theft">Personal Property Theft</option>
                        <option value="Burglary / House Break-in">Burglary</option>
                        <option value="Cyber Fraud">Cyber Fraud</option>
                        <option value="Assault / Harassment">Assault / Harassment</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#d4c5c8] mb-1">Incident Details</label>
                    <textarea
                      value={incidentDetails}
                      onChange={(e) => setIncidentDetails(e.target.value)}
                      placeholder="Describe what happened, time, stolen items..."
                      rows={3}
                      className="w-full bg-[#070507] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#ef4444]"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold">
                    Generate Structured FIR Draft
                  </button>
                </form>

                <div className="lg:col-span-6 font-mono text-xs text-left">
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-6 min-h-[320px] flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[#7e6f73] pb-3 border-b border-white/10">
                      <span>OFFICIAL FIR DRAFT</span>
                      <span className="text-[#fca5a5]">AHMEDABAD CITY POLICE</span>
                    </div>

                    {!firResult && (
                      <div className="py-16 text-center text-[#7e6f73] italic">
                        Fill in details and click "Generate Structured FIR Draft".
                      </div>
                    )}

                    {firResult && (
                      <div className="py-3 space-y-2 text-xs">
                        <div className="text-emerald-400 font-bold text-sm mb-2">✓ FIR DRAFT CREATED: {firResult.id}</div>
                        <div><span className="text-[#7e6f73]">Complainant:</span> {firResult.name} ({firResult.phone})</div>
                        <div><span className="text-[#7e6f73]">Category:</span> {firResult.crimeCategory}</div>
                        <div><span className="text-[#7e6f73]">Location:</span> {firResult.location}</div>
                        <div className="p-2 rounded bg-red-950/40 border border-red-500/30 text-red-200 mt-2">
                          <span className="block font-bold mb-1 text-white">BNS Legal Code Suggestions:</span>
                          {firResult.legalSections.map((sec: string, idx: number) => (
                            <div key={idx}>• {sec}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/10 flex justify-between text-[10px] text-[#7e6f73]">
                      <span>Status: Draft Mode</span>
                      <span>Format: Official Police Letterhead</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORKSTATION 5: CITIZEN AI CHATBOT */}
            {activeTab === "chat" && (
              <div className="max-w-[720px] mx-auto text-left">
                <div className="rounded-2xl border border-white/15 bg-[#070507] p-4 h-[360px] overflow-y-auto space-y-3 mb-4 font-mono text-xs">
                  {chatLog.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl max-w-[85%] ${
                        m.sender === "user"
                          ? "ml-auto bg-[#ef4444]/20 border border-[#ef4444]/30 text-white text-right"
                          : m.sos
                          ? "bg-red-950 border border-red-500 text-red-200"
                          : "bg-white/5 border border-white/10 text-[#d4c5c8]"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI Copilot, report stolen item, or type SOS..."
                    className="flex-1 bg-[#160f14] border border-white/15 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#ef4444]"
                  />
                  <button type="submit" className="btn-primary py-3 px-5 text-xs font-bold flex items-center gap-1.5">
                    <Send className="h-4 w-4" /> Send
                  </button>
                </form>
              </div>
            )}

          </div>
        </Tilt>
      </section>

      <Footer />
    </main>
  );
}
