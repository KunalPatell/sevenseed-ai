"use client";

import React, { useId, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

export function SparklesCore({
  id,
  className,
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.8,
  speed = 0.8,
  particleColor = "#9ed8ff",
  particleDensity = 60,
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const generatedId = useId();
  const canvasId = id || generatedId;

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
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
      isFadingIn: boolean;
    }

    let particles: Particle[] = [];
    const count = Math.floor((width * height) / (10000 / particleDensity));

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * speed * 0.4,
          speedY: (Math.random() - 0.5) * speed * 0.4,
          opacity: Math.random() * 0.8 + 0.2,
          fadeSpeed: Math.random() * 0.015 + 0.005,
          isFadingIn: Math.random() > 0.5,
        });
      }
    };

    initParticles();

    // Mouse proximity repulsion
    let mouseX = -1000;
    let mouseY = -1000;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Twinkle
        if (p.isFadingIn) {
          p.opacity += p.fadeSpeed;
          if (p.opacity >= 0.95) p.isFadingIn = false;
        } else {
          p.opacity -= p.fadeSpeed;
          if (p.opacity <= 0.15) p.isFadingIn = true;
        }

        // Slight mouse avoidance
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 80) {
          const angle = Math.atan2(dy, dx);
          const force = (80 - dist) * 0.03;
          p.x += Math.cos(angle) * force;
          p.y += Math.sin(angle) * force;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = particleColor;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      style={{ background }}
    >
      <canvas id={canvasId} ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
