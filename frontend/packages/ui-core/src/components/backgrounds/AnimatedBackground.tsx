"use client";

import React from "react";
import { motion } from "framer-motion";
import { Spotlight } from "./Spotlight";
import { SparklesCore } from "./SparklesCore";

interface AnimatedBackgroundProps {
  showSpotlight?: boolean;
  showSparkles?: boolean;
  spotlightFill?: string;
  particleColor?: string;
}

/**
 * World-class cinematic background (Unicorn Studio & Aceternity UI hybrid).
 * Combines an overhead ambient Spotlight, dynamic SparklesCore particle field,
 * reactive glowing fluid mesh orbs, and perspective cyber grid lines.
 */
export function AnimatedBackground({
  showSpotlight = true,
  showSparkles = true,
  spotlightFill = "#9ed8ff",
  particleColor = "#9ed8ff",
}: AnimatedBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* 1. Aceternity Cinematic Spotlight */}
      {showSpotlight && (
        <Spotlight
          className="-top-40 left-0 md:left-48 md:-top-20"
          fill={spotlightFill}
        />
      )}

      {/* 2. Interactive Sparkles particle nebula */}
      {showSparkles && (
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.6}
          particleDensity={45}
          particleColor={particleColor}
          speed={0.6}
        />
      )}

      {/* 3. Cyber Matrix Perspective Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 15%, black 40%, transparent 80%)",
        }}
      />

      {/* 4. Unicorn Studio Fluid Gradient Mesh Orbs */}
      <motion.div
        className="absolute -top-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-[#9ed8ff]/12 blur-[140px]"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-20 right-1/4 h-[28rem] w-[28rem] rounded-full bg-[#4f46e5]/15 blur-[150px]"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.92, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#cfae6e]/10 blur-[130px]"
        animate={{
          x: [0, 40, -40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
