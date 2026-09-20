"use client";

import React, { useEffect, useRef } from "react";

interface TerminalScanlineBackgroundProps {
  className?: string;
}

export function TerminalScanlineBackground({ className = "" }: TerminalScanlineBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const chars = "01$>{}=;const async function devin agent void".split("");
    const fontSize = 13;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    const render = () => {
      ctx.fillStyle = "rgba(9, 9, 11, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(245, 158, 11, 0.4)"; // Amber gold code stream
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.85) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillText(char, x, y);
        }

        if (drops[i] * fontSize > height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Code matrix canvas */}
      <canvas ref={canvasRef} className="w-full h-full block opacity-30" />

      {/* CRT Scanline horizontal raster lines */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.8) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Amber Horizon Glow */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
