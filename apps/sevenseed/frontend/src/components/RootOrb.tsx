"use client";

/**
 * RootOrb — the visual identity of "Root", Sevenseed's studio AI.
 *
 * Root is the orchestrator that sits behind every venture: the shared LLM
 * gateway, the RAG index over the studio's playbook, and the ideation agent
 * used in the sandbox below. This component gives that system a face —
 * a morphing gradient blob with a minimal geometric expression — instead of
 * a generic icon-in-a-circle, so it reads as a character, not a UI ornament.
 *
 * Purely CSS/SVG/Framer Motion — no image assets. Reused anywhere Root
 * "speaks": the hero, the AI console header, and the contact section.
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const SIZES = {
  sm: 34,
  md: 76,
  lg: 148,
} as const;

type RootOrbSize = keyof typeof SIZES;

export function RootOrb({
  size = "md",
  speaking = false,
  className = "",
}: {
  size?: RootOrbSize;
  speaking?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const px = SIZES[size];
  const orbitOn = !reduceMotion && size !== "sm";

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: px, height: px }}
      role="img"
      aria-label="Root, Sevenseed's studio AI"
    >
      {/* Ambient glow behind the blob */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: -px * 0.22,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.5), rgba(16,185,129,0.22) 55%, transparent 72%)",
          filter: `blur(${Math.max(10, px * 0.22)}px)`,
        }}
      />

      {/* Orbiting agent nodes — a nod to the multi-agent backbone */}
      {orbitOn && (
        <>
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: "50% 50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute rounded-full bg-[#ddd6fe]"
              style={{
                width: Math.max(4, px * 0.09),
                height: Math.max(4, px * 0.09),
                top: -px * 0.05,
                left: "50%",
                marginLeft: -Math.max(2, px * 0.045),
                boxShadow: "0 0 8px rgba(139,92,246,0.85)",
              }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: "50% 50%" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute rounded-full bg-[#6ee7b7]"
              style={{
                width: Math.max(3, px * 0.065),
                height: Math.max(3, px * 0.065),
                bottom: -px * 0.02,
                left: "14%",
                boxShadow: "0 0 8px rgba(16,185,129,0.85)",
              }}
            />
          </motion.div>
        </>
      )}

      {/* The blob body */}
      <div
        className="root-orb-blob absolute inset-0 grid place-items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 48%, #10b981 100%)",
          boxShadow:
            "inset 0 0 22px rgba(0,0,0,0.28), inset 0 -6px 14px rgba(0,0,0,0.18), 0 10px 28px rgba(139,92,246,0.35)",
        }}
      >
        {/* Face: two eyes + a mouth, plain geometry, no icon library */}
        <svg
          viewBox="0 0 64 40"
          width={px * 0.52}
          height={(px * 0.52 * 40) / 64}
          className="relative"
        >
          <motion.g
            style={{ transformOrigin: "17px 16px" }}
            animate={
              reduceMotion
                ? undefined
                : { scaleY: [1, 1, 1, 0.12, 1, 1] }
            }
            transition={{
              duration: 4.6,
              repeat: Infinity,
              repeatDelay: 1.6,
              times: [0, 0.78, 0.84, 0.88, 0.92, 1],
              ease: "easeInOut",
            }}
          >
            <circle cx="17" cy="16" r="5.4" fill="#0b0b12" />
          </motion.g>
          <motion.g
            style={{ transformOrigin: "47px 16px" }}
            animate={
              reduceMotion
                ? undefined
                : { scaleY: [1, 1, 1, 0.12, 1, 1] }
            }
            transition={{
              duration: 4.6,
              repeat: Infinity,
              repeatDelay: 1.6,
              times: [0, 0.78, 0.84, 0.88, 0.92, 1],
              ease: "easeInOut",
              delay: 0.06,
            }}
          >
            <circle cx="47" cy="16" r="5.4" fill="#0b0b12" />
          </motion.g>

          <motion.g
            style={{ transformOrigin: "32px 29px" }}
            animate={
              speaking && !reduceMotion
                ? { scaleY: [1, 1.7, 0.6, 1.4, 1], scaleX: [1, 0.92, 1.05, 0.96, 1] }
                : { scaleY: 1, scaleX: 1 }
            }
            transition={
              speaking && !reduceMotion
                ? { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          >
            <path
              d="M20 26 Q32 38 44 26"
              stroke="#0b0b12"
              strokeWidth={4.2}
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
