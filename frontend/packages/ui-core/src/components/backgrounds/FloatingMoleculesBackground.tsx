"use client";

import React, { useEffect, useRef } from "react";

interface FloatingMoleculesBackgroundProps {
  className?: string;
}

export function FloatingMoleculesBackground({ className = "" }: FloatingMoleculesBackgroundProps) {
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

    const colors = ["#06b6d4", "#10b981", "#14b8a6", "#38bdf8"];
    // Chemical molecules (clusters of bonded atoms)
    const molecules = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      angle: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.01,
      atoms: [
        { dx: 0, dy: 0, r: 4, color: colors[0] },
        { dx: 22, dy: -12, r: 2.5, color: colors[1] },
        { dx: -18, dy: 16, r: 2.5, color: colors[2] },
        { dx: 34, dy: 14, r: 2, color: colors[3] },
      ],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      molecules.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.angle += m.vRot;

        if (m.x < -50) m.x = width + 50;
        if (m.x > width + 50) m.x = -50;
        if (m.y < -50) m.y = height + 50;
        if (m.y > height + 50) m.y = -50;

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);

        // Draw bonds
        ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
        ctx.lineWidth = 1;
        for (let i = 1; i < m.atoms.length; i++) {
          ctx.beginPath();
          ctx.moveTo(m.atoms[0].dx, m.atoms[0].dy);
          ctx.lineTo(m.atoms[i].dx, m.atoms[i].dy);
          ctx.stroke();
        }

        // Draw atoms
        m.atoms.forEach((atom) => {
          ctx.beginPath();
          ctx.arc(atom.dx, atom.dy, atom.r, 0, Math.PI * 2);
          ctx.fillStyle = atom.color;
          ctx.globalAlpha = 0.5;
          ctx.fill();
        });

        ctx.restore();
      });

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
      <canvas ref={canvasRef} className="w-full h-full block opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-950/20 via-transparent to-slate-950 pointer-events-none" />
    </div>
  );
}
