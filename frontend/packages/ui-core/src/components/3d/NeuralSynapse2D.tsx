"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

interface Node2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

function CanvasFallbackSynapse2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const ripples = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node2D[] = [];
    const NODE_COUNT = 90;
    const CONNECT_DIST = 115;
    const MOUSE_RADIUS = 160;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const initNodes = () => {
      nodes = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < NODE_COUNT; i++) {
        const isGold = Math.random() > 0.75;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: 1.2 + Math.random() * 1.6,
          baseRadius: 1.2 + Math.random() * 1.6,
          alpha: 0.25 + Math.random() * 0.55,
          color: isGold ? "207, 174, 110" : "158, 216, 255",
        });
      }
    };

    resize();
    initNodes();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    const onClick = (e: MouseEvent) => {
      // Spawn energy shockwave ripple
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 220,
        alpha: 0.8,
      });

      // Push particles outwards from click point
      nodes.forEach((node) => {
        const dx = node.x - e.clientX;
        const dy = node.y - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 200 && dist > 1) {
          const force = (1 - dist / 200) * 4;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      });
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick);

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Draw Expanding Shockwave Ripples ────────────────────────────────────
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += 4.5;
        r.alpha -= 0.018;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(158, 216, 255, ${r.alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Update and Draw Particles ──────────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Velocity damping back to natural speed
        node.vx *= 0.985;
        node.vy *= 0.985;
        if (Math.abs(node.vx) < 0.2) node.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(node.vy) < 0.2) node.vy += (Math.random() - 0.5) * 0.05;

        // Mouse attraction/excitation
        if (mx !== null && my !== null) {
          const mdx = mx - node.x;
          const mdy = my - node.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < MOUSE_RADIUS) {
            const pull = (1 - mdist / MOUSE_RADIUS) * 0.2;
            node.vx += (mdx / mdist) * pull;
            node.vy += (mdy / mdist) * pull;
            node.radius = node.baseRadius * 1.5;

            // Connect node to cursor
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mx, my);
            const cursorAlpha = (1 - mdist / MOUSE_RADIUS) * 0.45;
            ctx.strokeStyle = `rgba(158, 216, 255, ${cursorAlpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          } else {
            node.radius = node.baseRadius;
          }
        }

        node.x += node.vx;
        node.y += node.vy;

        // Screen boundary wrapping
        if (node.x < 0) node.x = w;
        if (node.x > w) node.x = 0;
        if (node.y < 0) node.y = h;
        if (node.y > h) node.y = 0;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${node.color}, ${node.alpha})`;
        ctx.fill();

        // ── Connect Neighboring Nodes (Synapses) ───────────────────────────────
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(158, 216, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
    />
  );
}

const WebGLSynapse3D = dynamic(
  () => import("./NeuralSynapse3D").then((mod) => mod.NeuralSynapse3D),
  {
    ssr: false,
    loading: () => <CanvasFallbackSynapse2D />,
  }
);

export function NeuralSynapse2D() {
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
    return <CanvasFallbackSynapse2D />;
  }

  return <WebGLSynapse3D />;
}

