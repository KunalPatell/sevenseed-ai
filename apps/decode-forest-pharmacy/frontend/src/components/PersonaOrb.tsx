"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Sanjeevani — Decode Forest Pharmacy's named AI health guide.
 *
 * A calm, gradient-blob avatar with a simple geometric face and a small
 * leaf accent (nodding to the "Forest" in the brand, and to Sanjeevani —
 * the healing herb of Indian legend). Built entirely from inline SVG +
 * framer-motion, no image assets. Deliberately understated: a slow
 * "breathing" scale, an occasional blink, and a soft heartbeat line —
 * medical without feeling cold, friendly without feeling childish.
 */
export function PersonaOrb({
  size = 140,
  animated = true,
  className = "",
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Sanjeevani, the Decode Forest Pharmacy AI health guide"
    >
      {/* ambient glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.45), transparent 70%)",
        }}
        animate={animated ? { opacity: [0.45, 0.8, 0.45] } : undefined}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative z-10"
        animate={animated ? { scale: [1, 1.025, 1] } : undefined}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id="sanj-body" cx="35%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="42%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </radialGradient>
          <linearGradient id="sanj-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* outer ring */}
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="url(#sanj-ring)"
          strokeOpacity="0.25"
          strokeWidth="2"
        />

        {/* body */}
        <circle cx="100" cy="100" r="82" fill="url(#sanj-body)" />

        {/* leaf accent - forest / healing motif */}
        <path
          d="M136 56c11 13 12 32-1 45-13 13-32 12-45 1 7-25 21-40 46-46z"
          fill="#ecfeff"
          fillOpacity="0.28"
        />

        {/* calm face — blinking eyes */}
        <motion.g
          animate={
            animated
              ? { scaleY: [1, 1, 0.08, 1, 1, 1, 1] }
              : undefined
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            times: [0, 0.82, 0.87, 0.92, 1, 1, 1],
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "100px 96px" }}
        >
          <circle cx="82" cy="96" r="6" fill="#052e21" />
          <circle cx="118" cy="96" r="6" fill="#052e21" />
        </motion.g>

        {/* calm smile */}
        <path
          d="M80 120c8 9 32 9 40 0"
          stroke="#052e21"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* heartbeat / pulse line — medical, not clinical */}
        <path
          d="M36 150 h26 l7 -13 l10 21 l8 -29 l7 15 h68"
          fill="none"
          stroke="#ecfeff"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}
