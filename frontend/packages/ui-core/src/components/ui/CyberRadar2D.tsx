"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Radar, Shield, Cpu } from "lucide-react";

interface RadarBlip {
  id: string;
  name: string;
  category: string;
  angle: number; // in radians
  distance: number; // 0..1 from center
  strength: number; // 0..1
  pulse: number;
}

const BLIPS: RadarBlip[] = [
  { id: "agentic", name: "Multi-Agent Systems", category: "LangGraph · Sevenforce", angle: 0.85, distance: 0.68, strength: 0.96, pulse: 0 },
  { id: "vision", name: "Computer Vision", category: "YOLOv8 · Real-Time Edge", angle: 2.35, distance: 0.78, strength: 0.94, pulse: 0 },
  { id: "fastapi", name: "FastAPI & LLMs", category: "Async Microservices", angle: 3.95, distance: 0.62, strength: 0.98, pulse: 0 },
  { id: "automation", name: "Enterprise Automation", category: "n8n · Scaled Workflows", angle: 5.4, distance: 0.72, strength: 0.92, pulse: 0 },
  { id: "rag", name: "Hybrid RAG & Vectors", category: "Qdrant · Embeddings", angle: 1.6, distance: 0.48, strength: 0.90, pulse: 0 },
];

export function CyberRadar2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeBlip, setActiveBlip] = useState<RadarBlip | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let sweepAngle = 0;
    const sweepSpeed = 1.35; // radians per second
    let lastTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      sweepAngle = (sweepAngle + dt * sweepSpeed) % (Math.PI * 2);

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.44;

      ctx.clearRect(0, 0, width, height);

      // ── Radar Range Rings ──────────────────────────────────────────────────
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((rRatio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * rRatio, 0, Math.PI * 2);
        ctx.strokeStyle = rRatio === 1.0 ? "rgba(158, 216, 255, 0.25)" : "rgba(158, 216, 255, 0.08)";
        ctx.lineWidth = rRatio === 1.0 ? 1.5 : 1.0;
        ctx.stroke();
      });

      // ── Cardinal Axes & Degree Hash Marks ─────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.strokeStyle = "rgba(158, 216, 255, 0.12)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Degree tick marks
      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (radius - 5);
        const y1 = cy + Math.sin(rad) * (radius - 5);
        const x2 = cx + Math.cos(rad) * radius;
        const y2 = cy + Math.sin(rad) * radius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(158, 216, 255, 0.25)";
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // ── Rotating Sweep Beam with Fading Phosphor Fan ───────────────────────
      const fanSteps = 32;
      const fanSpread = 0.55; // radians of phosphor trail
      for (let i = 0; i < fanSteps; i++) {
        const a1 = sweepAngle - (i / fanSteps) * fanSpread;
        const a2 = sweepAngle - ((i + 1) / fanSteps) * fanSpread;
        const alpha = (1 - i / fanSteps) * 0.18;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, a2, a1);
        ctx.closePath();
        ctx.fillStyle = `rgba(158, 216, 255, ${alpha})`;
        ctx.fill();
      }

      // Leading beam line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * radius, cy + Math.sin(sweepAngle) * radius);
      ctx.strokeStyle = "rgba(158, 216, 255, 0.85)";
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // ── Draw & Illuminate Radar Blips ──────────────────────────────────────
      BLIPS.forEach((blip) => {
        const bx = cx + Math.cos(blip.angle) * radius * blip.distance;
        const by = cy + Math.sin(blip.angle) * radius * blip.distance;

        // Check if sweep beam just crossed blip angle
        const diff = (sweepAngle - blip.angle + Math.PI * 4) % (Math.PI * 2);
        if (diff < 0.12) {
          blip.pulse = 1.0;
        } else {
          blip.pulse = Math.max(0, blip.pulse - dt * 0.9);
        }

        const isPinged = blip.pulse > 0;
        const glowRadius = 4 + blip.pulse * 8;

        // Radiating pulse ring
        if (isPinged) {
          ctx.beginPath();
          ctx.arc(bx, by, glowRadius * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(158, 216, 255, ${blip.pulse * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Blip point
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isPinged ? "#ffffff" : "rgba(158, 216, 255, 0.75)";
        ctx.shadowColor = "#9ed8ff";
        ctx.shadowBlur = isPinged ? 12 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label annotation
        ctx.font = "9px monospace";
        ctx.fillStyle = isPinged ? "#ffffff" : "rgba(158, 216, 255, 0.6)";
        ctx.fillText(blip.name, bx + 7, by + 3);
      });

      // Center antenna hub
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#9ed8ff";
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[340px] aspect-square rounded-2xl border border-white/10 bg-[#07090e]/80 backdrop-blur-xl p-3 flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(158,216,255,0.06)]">
      {/* HUD Header */}
      <div className="flex items-center justify-between z-10 px-2">
        <div className="flex items-center gap-2">
          <Radar className="h-3.5 w-3.5 text-[#9ed8ff] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-wider">
            AI DISCIPLINE RADAR
          </span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
          SCANNING 360°
        </span>
      </div>

      {/* Radar Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Footer Readout */}
      <div className="z-10 flex items-center justify-between text-[9px] font-mono text-[#6471c4] px-2 pt-1 border-t border-white/5">
        <span>SWEEP: 1.35 rad/s</span>
        <span className="text-[#cfae6e]">5 ACTIVE TARGETS</span>
      </div>
    </div>
  );
}
