"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles, Compass, Eye, Shield, Activity, RefreshCw } from "lucide-react";

type GeometryType = "icosahedron" | "sphere" | "tesseract" | "helix";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Spark {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  color: string;
}

// Generate golden ratio icosahedron vertices
function getIcosahedron(): { vertices: Point3D[]; edges: [number, number][] } {
  const phi = (1 + Math.sqrt(5)) / 2;
  const s = 1.0;
  const v: Point3D[] = [
    { x: -s, y: phi * s, z: 0 },
    { x: s, y: phi * s, z: 0 },
    { x: -s, y: -phi * s, z: 0 },
    { x: s, y: -phi * s, z: 0 },
    { x: 0, y: -s, z: phi * s },
    { x: 0, y: s, z: phi * s },
    { x: 0, y: -s, z: -phi * s },
    { x: 0, y: s, z: -phi * s },
    { x: phi * s, y: 0, z: -s },
    { x: phi * s, y: 0, z: s },
    { x: -phi * s, y: 0, z: -s },
    { x: -phi * s, y: 0, z: s },
  ];

  const edges: [number, number][] = [];
  for (let i = 0; i < v.length; i++) {
    for (let j = i + 1; j < v.length; j++) {
      const d = Math.hypot(v[i].x - v[j].x, v[i].y - v[j].y, v[i].z - v[j].z);
      if (Math.abs(d - 2 * s) < 0.2) {
        edges.push([i, j]);
      }
    }
  }
  return { vertices: v, edges };
}

// Generate Fibonacci spiral sphere nodes
function getSphere(count = 42): { vertices: Point3D[]; edges: [number, number][] } {
  const v: Point3D[] = [];
  const offset = 2 / count;
  const inc = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * inc;
    const x = Math.cos(phi) * r * 1.5;
    const z = Math.sin(phi) * r * 1.5;
    v.push({ x, y: y * 1.5, z });
  }

  const edges: [number, number][] = [];
  for (let i = 0; i < v.length; i++) {
    for (let j = i + 1; j < v.length; j++) {
      const d = Math.hypot(v[i].x - v[j].x, v[i].y - v[j].y, v[i].z - v[j].z);
      if (d < 0.9) {
        edges.push([i, j]);
      }
    }
  }
  return { vertices: v, edges };
}

// Generate 4D Tesseract (Hypercube) projection
function getTesseract(): { vertices: Point3D[]; edges: [number, number][] } {
  const v: Point3D[] = [];
  const s1 = 1.4; // outer cube
  const s2 = 0.7; // inner cube

  // Outer cube (0..7)
  for (const x of [-s1, s1]) {
    for (const y of [-s1, s1]) {
      for (const z of [-s1, s1]) {
        v.push({ x, y, z });
      }
    }
  }
  // Inner cube (8..15)
  for (const x of [-s2, s2]) {
    for (const y of [-s2, s2]) {
      for (const z of [-s2, s2]) {
        v.push({ x, y, z });
      }
    }
  }

  const edges: [number, number][] = [];
  // Cube edges
  for (let offset of [0, 8]) {
    edges.push([offset + 0, offset + 1], [offset + 2, offset + 3], [offset + 4, offset + 5], [offset + 6, offset + 7]);
    edges.push([offset + 0, offset + 2], [offset + 1, offset + 3], [offset + 4, offset + 6], [offset + 5, offset + 7]);
    edges.push([offset + 0, offset + 4], [offset + 1, offset + 5], [offset + 2, offset + 6], [offset + 3, offset + 7]);
  }
  // Cross-dimensional connecting edges
  for (let i = 0; i < 8; i++) {
    edges.push([i, i + 8]);
  }

  return { vertices: v, edges };
}

// Generate Double Helix strands
function getHelix(turns = 2.5, pointsPerTurn = 16): { vertices: Point3D[]; edges: [number, number][] } {
  const v: Point3D[] = [];
  const total = Math.floor(turns * pointsPerTurn);
  const radius = 1.1;
  const height = 3.2;

  for (let i = 0; i < total; i++) {
    const t = i / total;
    const y = (t - 0.5) * height;
    const angle = t * turns * Math.PI * 2;
    // Strand A
    v.push({ x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius });
    // Strand B (offset by PI)
    v.push({ x: Math.cos(angle + Math.PI) * radius, y, z: Math.sin(angle + Math.PI) * radius });
  }

  const edges: [number, number][] = [];
  for (let i = 0; i < total - 1; i++) {
    const idxA1 = i * 2;
    const idxB1 = i * 2 + 1;
    const idxA2 = (i + 1) * 2;
    const idxB2 = (i + 1) * 2 + 1;

    // Strand backbones
    edges.push([idxA1, idxA2]);
    edges.push([idxB1, idxB2]);

    // Base pair rungs every 2 points
    if (i % 2 === 0) {
      edges.push([idxA1, idxB1]);
    }
  }

  return { vertices: v, edges };
}

function CanvasFallbackCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geometry, setGeometry] = useState<GeometryType>("icosahedron");
  const [fps, setFps] = useState(60);
  const [synapseCount, setSynapseCount] = useState(30);

  // Rotation angles & mouse tracking
  const rotX = useRef(0.2);
  const rotY = useRef(0.3);
  const rotZ = useRef(0);
  const targetRotX = useRef(0.2);
  const targetRotY = useRef(0.3);
  const isHovered = useRef(false);
  const pulsePhase = useRef(0);
  const sparks = useRef<Spark[]>([]);

  // Trigger energy pulse
  const triggerPulse = useCallback(() => {
    pulsePhase.current = 1.0;
    // Spawn outward radiating sparks
    for (let i = 0; i < 28; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.04 + Math.random() * 0.08;
      sparks.current.push({
        x: 0,
        y: 0,
        z: 0,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed,
        vz: Math.sin(phi) * Math.sin(theta) * speed,
        life: 1.0,
        maxLife: 1.0,
        color: Math.random() > 0.4 ? "#9ed8ff" : "#cfae6e",
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Get active geometry model
    let model = geometry === "sphere" ? getSphere()
      : geometry === "tesseract" ? getTesseract()
      : geometry === "helix" ? getHelix()
      : getIcosahedron();

    setSynapseCount(model.edges.length);

    const render = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      frameCounter++;
      if (now - fpsTimer >= 1000) {
        setFps(frameCounter);
        frameCounter = 0;
        fpsTimer = now;
      }

      // Smooth mouse rotation lerp
      const autoSpeed = isHovered.current ? 0.35 : 0.65;
      targetRotY.current += dt * autoSpeed;
      rotX.current += (targetRotX.current - rotX.current) * 0.08;
      rotY.current += (targetRotY.current - rotY.current) * 0.08;
      rotZ.current += dt * 0.2;

      // Pulse decay
      if (pulsePhase.current > 0) {
        pulsePhase.current = Math.max(0, pulsePhase.current - dt * 1.8);
      }

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.26 * (1 + pulsePhase.current * 0.18);
      const distance = 4.2;

      ctx.clearRect(0, 0, width, height);

      // Rotation trigonometric pre-computations
      const cosX = Math.cos(rotX.current);
      const sinX = Math.sin(rotX.current);
      const cosY = Math.cos(rotY.current);
      const sinY = Math.sin(rotY.current);
      const cosZ = Math.cos(rotZ.current * 0.5);
      const sinZ = Math.sin(rotZ.current * 0.5);

      const project = (p: Point3D): { x: number; y: number; z: number; scaleFactor: number } => {
        // Y-axis rotation (yaw)
        let x1 = p.x * cosY + p.z * sinY;
        let y1 = p.y;
        let z1 = -p.x * sinY + p.z * cosY;

        // X-axis rotation (pitch)
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Z-axis subtle roll
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        const fov = distance / (distance + z3);
        return {
          x: cx + x3 * scale * fov,
          y: cy + y3 * scale * fov,
          z: z3,
          scaleFactor: fov,
        };
      };

      // ── Orbiting Holographic Rings ──────────────────────────────────────────
      const drawRing = (rScale: number, tiltAngle: number, color: string, ringRotSpeed: number) => {
        ctx.beginPath();
        const steps = 64;
        const ringRot = now * 0.0008 * ringRotSpeed;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const rx = Math.cos(theta + ringRot) * rScale;
          const rz = Math.sin(theta + ringRot) * rScale;
          // Apply tilt
          const ry = rz * Math.sin(tiltAngle);
          const rzTilted = rz * Math.cos(tiltAngle);
          const proj = project({ x: rx, y: ry, z: rzTilted });
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      };

      drawRing(1.95, 0.45, "rgba(158, 216, 255, 0.16)", 1.2);
      drawRing(2.25, -0.65, "rgba(207, 174, 110, 0.14)", -0.8);
      drawRing(1.65, 1.15, "rgba(52, 211, 153, 0.12)", 0.6);

      // Project vertices
      const projected = model.vertices.map((v) => project(v));

      // ── Draw Synaptic Edges ────────────────────────────────────────────────
      for (const [i, j] of model.edges) {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;
        // Depth-based opacity & line width
        const depthAlpha = Math.max(0.12, Math.min(0.85, (avgZ + 1.8) / 3.2));
        const pulseBoost = pulsePhase.current * 0.4;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(158, 216, 255, ${depthAlpha + pulseBoost})`;
        ctx.lineWidth = Math.max(0.8, (p1.scaleFactor + p2.scaleFactor) * 0.9);
        ctx.stroke();
      }

      // ── Draw Energy Nucleus Glow ──────────────────────────────────────────
      const nucleus = project({ x: 0, y: 0, z: 0 });
      const nucleusGlow = ctx.createRadialGradient(
        nucleus.x, nucleus.y, 2,
        nucleus.x, nucleus.y, scale * 0.55 * (1 + pulsePhase.current * 0.5)
      );
      nucleusGlow.addColorStop(0, "rgba(158, 216, 255, 0.65)");
      nucleusGlow.addColorStop(0.3, "rgba(207, 174, 110, 0.25)");
      nucleusGlow.addColorStop(1, "rgba(158, 216, 255, 0)");
      ctx.fillStyle = nucleusGlow;
      ctx.beginPath();
      ctx.arc(nucleus.x, nucleus.y, scale * 0.55 * (1 + pulsePhase.current * 0.5), 0, Math.PI * 2);
      ctx.fill();

      // Core Singularity Node
      ctx.beginPath();
      ctx.arc(nucleus.x, nucleus.y, 4 + pulsePhase.current * 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#9ed8ff";
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // ── Draw Vertex Nodes ─────────────────────────────────────────────────
      projected.forEach((p, idx) => {
        const radius = Math.max(2, 3.5 * p.scaleFactor + pulsePhase.current * 1.5);
        const depthAlpha = Math.max(0.25, Math.min(1, (p.z + 2.0) / 3.5));

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0
          ? `rgba(158, 216, 255, ${depthAlpha})`
          : `rgba(207, 174, 110, ${depthAlpha})`;
        ctx.shadowColor = idx % 2 === 0 ? "#9ed8ff" : "#cfae6e";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner vertex specular point
        if (p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.x - 0.8, p.y - 0.8, radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        }
      });

      // ── Update & Draw Sparks ──────────────────────────────────────────────
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.z += s.vz;
        s.life -= dt * 1.5;

        if (s.life <= 0) {
          sparks.current.splice(i, 1);
          continue;
        }

        const sp = project(s);
        const alpha = s.life / s.maxLife;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2 * sp.scaleFactor, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [geometry]);

  // Mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotY.current = x * 2.2;
    targetRotX.current = -y * 1.8;
  };

  return (
    <div
      className="relative w-full aspect-square max-w-[440px] mx-auto select-none group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => {
        isHovered.current = false;
        targetRotX.current = 0.2;
      }}
      onClick={triggerPulse}
    >
      {/* Outer Holographic Ambient Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#9ed8ff]/10 via-[#cfae6e]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Scanning Coordinate Grid Frame */}
      <div className="absolute inset-2 rounded-3xl border border-white/10 bg-[#07090e]/70 backdrop-blur-xl p-3 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(158,216,255,0.08)]">
        {/* Top HUD Telemetry Ribbon */}
        <div className="flex items-center justify-between z-10 px-2 py-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-widest flex items-center gap-1">
              QUANTUM CORE <Sparkles className="h-2.5 w-2.5 text-[#cfae6e]" />
            </span>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-mono text-[#9ed8ff]">
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              {fps} FPS
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-400">
              OPTIMAL
            </span>
          </div>
        </div>

        {/* The Real-Time 3D Projection Canvas */}
        <div className="relative flex-1 w-full flex items-center justify-center cursor-pointer">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Center Click Hint */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="text-[9px] font-mono px-2.5 py-1 rounded-full bg-black/80 border border-[#9ed8ff]/40 text-[#9ed8ff] uppercase tracking-wider backdrop-blur-md">
              ✦ Click to Pulse Energy ✦
            </span>
          </div>
        </div>

        {/* Bottom Geometry Switcher Controls */}
        <div className="z-10 flex flex-wrap items-center justify-between gap-1.5 px-2 pt-2 border-t border-white/5">
          <div className="flex gap-1">
            {(
              [
                { id: "icosahedron", label: "Icosahedron" },
                { id: "sphere", label: "Neural Sphere" },
                { id: "tesseract", label: "Tesseract" },
                { id: "helix", label: "Double Helix" },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGeometry(g.id);
                  triggerPulse();
                }}
                className={`text-[9px] font-mono px-2 py-1 rounded-lg border transition-all ${
                  geometry === g.id
                    ? "bg-[#9ed8ff]/20 border-[#9ed8ff] text-white shadow-[0_0_12px_rgba(158,216,255,0.3)] font-bold"
                    : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="text-[9px] font-mono text-[#cfae6e] hidden sm:block">
            {synapseCount} Synapses
          </div>
        </div>
      </div>
    </div>
  );
}

const WebGLCore = dynamic(
  () => import("./QuantumCore3DWebGL").then((mod) => mod.QuantumCore3DWebGL),
  {
    ssr: false,
    loading: () => <CanvasFallbackCore />,
  }
);

export function QuantumCore3D() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <CanvasFallbackCore />;
  }

  return <WebGLCore />;
}

