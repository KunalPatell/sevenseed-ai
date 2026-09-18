"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarCanvas } from "@/components/StarCanvas";
import { CustomCursor } from "@/components/CustomCursor";
import { Shield, Scan, UserCheck, Zap, CheckCircle, Lock, Radio, Crosshair, Search, Footprints, AlertTriangle, MapPin, Battery } from "lucide-react";

export default function WorkstationApp() {
  const [activeTab, setActiveTab] = useState<"mask" | "face" | "sos" | "threat" | "missing" | "safewalk">("mask");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Dedicated data states
  const [sosData, setSosData] = useState<any>(null);
  const [threatData, setThreatData] = useState<any>(null);
  const [missingData, setMissingData] = useState<any>(null);
  const [safewalkData, setSafewalkData] = useState<any>(null);
  const [missingQuery, setMissingQuery] = useState("");

  const runScan = async () => {
    setScanning(true);
    setScanResult(null);

    if (activeTab === "sos") {
      try {
        const res = await fetch("/rakshak-ai/api/sos/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: 23.0338,
            lon: 72.5467,
            address: "Near Alpha One Mall, Vastrapur, Ahmedabad",
            emergency_type: "Distress Alert / Immediate Threat",
            battery_level: 82
          })
        });
        const d = await res.json();
        setSosData(d);
      } catch {
        setSosData({ error: "Failed to broadcast SOS" });
      } finally {
        setScanning(false);
      }
      return;
    }

    if (activeTab === "threat") {
      try {
        const res = await fetch("/rakshak-ai/api/vision/threat-detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scene_description: "Perimeter CCTV feed frame 104" })
        });
        const d = await res.json();
        setThreatData(d);
      } catch {
        setThreatData({ error: "Threat analysis offline" });
      } finally {
        setScanning(false);
      }
      return;
    }

    if (activeTab === "missing") {
      try {
        const res = await fetch("/rakshak-ai/api/missing-persons/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: missingQuery, filter_status: "all" })
        });
        const d = await res.json();
        setMissingData(d);
      } catch {
        setMissingData({ error: "Missing registry offline" });
      } finally {
        setScanning(false);
      }
      return;
    }

    if (activeTab === "safewalk") {
      try {
        const res = await fetch("/rakshak-ai/api/safe-walk/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin: "Sindhu Bhavan Road", destination: "Prahlad Nagar", eta_mins: 20 })
        });
        const d = await res.json();
        setSafewalkData(d);
      } catch {
        setSafewalkData({ error: "Safe-Walk dispatch offline" });
      } finally {
        setScanning(false);
      }
      return;
    }

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
              <span>RAKSHAK AI · ENTERPRISE PUBLIC SAFETY SENTINEL</span>
            </div>
            <h1 className="text-3xl font-black text-white">Rakshak Vision & Emergency Sentinel</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              ● Police & Vision Dispatch Active
            </span>
          </div>
        </div>

        {/* Tab Selection Grid - 6 Workstations */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <button
            onClick={() => { setActiveTab("mask"); setScanResult(null); }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "mask"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <Shield className="h-5 w-5 text-[#ef4444] mb-1.5" />
            <h3 className="font-bold text-white text-xs">PPE Mask</h3>
            <p className="text-[10px] text-[#7e6f73] mt-0.5">Compliance check</p>
          </button>

          <button
            onClick={() => { setActiveTab("face"); setScanResult(null); }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "face"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <UserCheck className="h-5 w-5 text-[#f59e0b] mb-1.5" />
            <h3 className="font-bold text-white text-xs">Face ID</h3>
            <p className="text-[10px] text-[#7e6f73] mt-0.5">Touchless logs</p>
          </button>

          <button
            onClick={() => { setActiveTab("sos"); runScan(); }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "sos"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <Radio className="h-5 w-5 text-rose-500 mb-1.5 animate-pulse" />
            <h3 className="font-bold text-white text-xs">SOS Beacon</h3>
            <p className="text-[10px] text-[#7e6f73] mt-0.5">RapidSOS broadcast</p>
          </button>

          <button
            onClick={() => { setActiveTab("threat"); runScan(); }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "threat"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <Crosshair className="h-5 w-5 text-red-400 mb-1.5" />
            <h3 className="font-bold text-white text-xs">Weapon Scanner</h3>
            <p className="text-[10px] text-[#7e6f73] mt-0.5">Verkada vision</p>
          </button>

          <button
            onClick={() => { setActiveTab("missing"); runScan(); }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "missing"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <Search className="h-5 w-5 text-cyan-400 mb-1.5" />
            <h3 className="font-bold text-white text-xs">Amber Alert</h3>
            <p className="text-[10px] text-[#7e6f73] mt-0.5">Citizen face match</p>
          </button>

          <button
            onClick={() => { setActiveTab("safewalk"); runScan(); }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "safewalk"
                ? "bg-[#160f14] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                : "bg-black/40 border-white/10 hover:border-white/20"
            }`}
          >
            <Footprints className="h-5 w-5 text-emerald-400 mb-1.5" />
            <h3 className="font-bold text-white text-xs">Safe-Walk</h3>
            <p className="text-[10px] text-[#7e6f73] mt-0.5">Life360 guardian</p>
          </button>
        </div>

        {/* Console Box */}
        <div className="glow-card p-6 md:p-8 border border-[#ef4444]/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {activeTab === "mask" && "Mask PPE Compliance Console"}
              {activeTab === "face" && "Facial Attendance Verification Console"}
              {activeTab === "sos" && "1-Click SOS Beacon & Police Dispatch"}
              {activeTab === "threat" && "AI Weapon & Active Threat Scanner (Verkada)"}
              {activeTab === "missing" && "Missing Person ArcFace CCTV Matcher (Amber Alert)"}
              {activeTab === "safewalk" && "Safe-Walk Night Companion & Anomaly Monitor (Life360)"}
            </h3>
            <button
              onClick={runScan}
              disabled={scanning}
              className="btn-primary text-xs py-2 px-5 flex items-center gap-2 cursor-pointer"
            >
              {scanning ? <Zap className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
              {scanning ? "Triggering..." : "Run Inspection"}
            </button>
          </div>

          {/* SOS BEACON VIEW */}
          {activeTab === "sos" && (
            <div className="flex flex-col gap-4">
              {sosData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                        <Radio className="h-4 w-4 animate-ping" />
                        <span>Beacon Live</span>
                      </div>
                      <h4 className="text-xl font-black text-white mt-2">{sosData.beacon_id}</h4>
                      <p className="text-xs text-rose-200 mt-1">{sosData.emergency_type}</p>
                      <div className="mt-3 text-[11px] text-white/80">
                        <div>Location: <span className="font-semibold text-white">{sosData.address}</span></div>
                        <div>GPS: <span className="font-mono">{sosData.coordinates?.lat}, {sosData.coordinates?.lon}</span></div>
                        <div>Battery: <span className="text-emerald-300 font-bold">{sosData.battery_level}</span></div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-500/30 text-[11px] text-rose-300 font-bold">
                      {sosData.nearest_police_station}
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-black/60 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#7e6f73] mb-3">Live Dispatch Response Units (ETA)</h5>
                      <div className="space-y-2">
                        {(sosData.emergency_dispatch?.patrol_units || []).map((unit: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg text-xs">
                            <span className="font-bold text-white font-mono">{unit.unit_code}</span>
                            <span className="text-[#c9b8bc]">{unit.distance_km} km away</span>
                            <span className="text-emerald-400 font-bold">ETA {unit.eta_mins} mins</span>
                            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">{unit.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-400 flex items-center justify-between">
                      <span>✓ Dial-112 Dispatched</span>
                      <span>Audio Channel: {sosData.live_audio_channel}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-[#7e6f73]">Click "Run Inspection" to trigger emergency beacon broadcast.</div>
              )}
            </div>
          )}

          {/* WEAPON THREAT SCAN VIEW */}
          {activeTab === "threat" && (
            <div className="flex flex-col gap-4">
              {threatData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0" />
                      <div>
                        <h4 className="font-black text-white text-sm">THREAT LEVEL: {threatData.threat_level}</h4>
                        <p className="text-xs text-rose-200">{threatData.sop_protocol}</p>
                      </div>
                    </div>
                    <span className="bg-rose-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase">
                      {threatData.detected_count} Threats Flagged
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(threatData.threats || []).map((t: any, idx: number) => (
                      <div key={idx} className="bg-black/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{t.severity} SEVERITY</span>
                          <h5 className="font-bold text-white text-sm mt-1">{t.class}</h5>
                          <p className="text-xs text-[#c9b8bc] mt-2 leading-relaxed">{t.threat_action}</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-[#7e6f73]">
                          <span>Confidence: {(t.confidence * 100).toFixed(1)}%</span>
                          <span>BBox: [{t.bounding_box.join(",")}]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-[#7e6f73]">Click "Run Inspection" to analyze perimeter feed for concealed & open weapons.</div>
              )}
            </div>
          )}

          {/* MISSING PERSONS VIEW */}
          {activeTab === "missing" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={missingQuery}
                  onChange={(e) => setMissingQuery(e.target.value)}
                  placeholder="Search missing citizen by name, location, or physical description..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ef4444]"
                />
                <button
                  onClick={runScan}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Search CCTV
                </button>
              </div>

              {missingData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(missingData.registry || []).map((person: any) => (
                    <div key={person.id} className="bg-black/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{person.status}</span>
                          <span className="text-xs font-black text-emerald-400">{person.match_confidence}% Match</span>
                        </div>
                        <h5 className="font-bold text-white text-sm">{person.name}, {person.age}y</h5>
                        <p className="text-[11px] text-[#c9b8bc] mt-1">{person.description}</p>
                        <div className="mt-2 text-[10px] text-cyan-300 font-mono">CCTV: {person.cctv_sighting}</div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-[#7e6f73]">
                        <span>{person.contact_officer}</span>
                        <button onClick={() => alert(`Dialing emergency tip-line for ${person.name}...`)} className="text-rose-400 hover:underline font-bold">Report Sight</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-[#7e6f73]">Click "Run Inspection" to scan surveillance network for active Amber Alerts.</div>
              )}
            </div>
          )}

          {/* SAFE-WALK GUARDIAN VIEW */}
          {activeTab === "safewalk" && (
            <div className="flex flex-col gap-4">
              {safewalkData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Night Guardian Session</span>
                      <h4 className="text-lg font-black text-white mt-1">{safewalkData.origin} → {safewalkData.destination}</h4>
                      <p className="text-xs text-[#c9b8bc] mt-2 leading-relaxed">{safewalkData.message}</p>
                      
                      <div className="mt-4 space-y-1.5 text-xs">
                        <div className="flex justify-between text-[#c9b8bc]">
                          <span>ETA remaining:</span>
                          <span className="font-bold text-white">{safewalkData.eta_mins} minutes</span>
                        </div>
                        <div className="flex justify-between text-[#c9b8bc]">
                          <span>Heartbeat Check-In:</span>
                          <span className="font-bold text-emerald-300">{safewalkData.next_checkin_in}</span>
                        </div>
                        <div className="flex justify-between text-[#c9b8bc]">
                          <span>Route Deviation Alarm:</span>
                          <span className="font-bold text-amber-300">{safewalkData.route_deviation_threshold}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Safe-Walk Check-in confirmed! Timer reset.")}
                      className="mt-5 w-full py-2.5 bg-emerald-500 text-black font-black text-xs rounded-xl hover:brightness-110 cursor-pointer"
                    >
                      I'M SAFE (CHECK-IN)
                    </button>
                  </div>

                  <div className="bg-black/60 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#7e6f73] mb-3">Guardian Proximity Monitoring</h5>
                      <div className="space-y-2">
                        {(safewalkData.guardian_contacts || []).map((c: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg text-xs">
                            <div>
                              <div className="font-bold text-white">{c.name}</div>
                              <div className="text-[10px] text-[#7e6f73]">{c.phone}</div>
                            </div>
                            <span className="text-emerald-400 font-bold text-[11px]">{c.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-[#7e6f73]">
                      Fall & impact sensor calibrated: 3-Axis Gyroscope Active
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-[#7e6f73]">Click "Run Inspection" to launch Safe-Walk Guardian.</div>
              )}
            </div>
          )}

          {/* DEFAULT MASK & FACE VIEW */}
          {(activeTab === "mask" || activeTab === "face") && (
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

                <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] text-[#7e6f73]">
                  <span>{scanResult ? `Last run: ${scanResult.time}` : "No scan run yet"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
