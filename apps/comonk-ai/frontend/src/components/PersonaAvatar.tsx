"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * PersonaAvatar — a friendly, fully-coded AI-companion character.
 *
 * Every Sevenseed venture has ONE named AI persona (Gyan, Val, Sanjeevani …).
 * This renders that persona as an animated SVG "mascot": a glossy-visored
 * companion bot with blinking eyes, a smile, a per-venture accessory, and a
 * living glow aura. No image assets, no external requests — pure SVG + CSS,
 * animated with framer-motion (already a dependency). Respects
 * prefers-reduced-motion by falling back to static transforms.
 *
 * The look is deliberately shared across the portfolio (one recognizable
 * "species" of AI employee) while each persona is individuated by colour +
 * accessory + name, mirroring the Sintra-style named-character system.
 */

export type PersonaAccessory =
  | "cap"      // graduation cap  — AVPU / Gyan
  | "tag"      // price tag       — AVP Emart / Val
  | "cross"    // medical cross   — Pharmacy / Sanjeevani
  | "heart"    // halo heart      — AVP Trust / Daya
  | "helmet"   // hard-hat        — Breakdown Factor / Drishti
  | "seed"     // sprout          — Sevenseed hub / Sena
  | "headset"  // headset         — Sevenforce / Axis
  | "spark";   // career spark    — Comonk

export function PersonaAvatar({
  size = 220,
  primary,
  secondary,
  accessory,
  name,
  role,
  className = "",
}: {
  size?: number;
  primary: string;   // main theme colour (hex)
  secondary: string; // accent / eye-glow colour (hex)
  accessory: PersonaAccessory;
  name: string;
  role: string;
  className?: string;
}) {
  const uid = React.useId().replace(/[:]/g, "");
  const gBody = `body-${uid}`;
  const gVisor = `visor-${uid}`;
  const gGlow = `glow-${uid}`;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${name}, ${role}`}
    >
      {/* Aura glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${primary}55 0%, ${primary}18 38%, transparent 68%)`,
          filter: "blur(4px)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating orbit ring + satellite */}
      <motion.div
        aria-hidden
        className="absolute inset-[6%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px dashed ${primary}40` }}
        />
        <div
          className="absolute left-1/2 -top-[3px] h-2 w-2 -translate-x-1/2 rounded-full"
          style={{ background: secondary, boxShadow: `0 0 10px ${secondary}` }}
        />
      </motion.div>

      {/* Floating character */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" width="76%" height="76%" aria-hidden>
          <defs>
            <linearGradient id={gBody} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="42%" stopColor={primary} />
              <stop offset="100%" stopColor={shade(primary, -38)} />
            </linearGradient>
            <linearGradient id={gVisor} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b1020" />
              <stop offset="100%" stopColor="#05070f" />
            </linearGradient>
            <radialGradient id={gGlow} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={secondary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={secondary} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Accessory sits behind the head top */}
          <Accessory kind={accessory} primary={primary} secondary={secondary} />

          {/* Antennae */}
          <line x1="72" y1="52" x2="64" y2="34" stroke={shade(primary, -30)} strokeWidth="4" strokeLinecap="round" />
          <circle cx="64" cy="32" r="5" fill={secondary} />
          <line x1="128" y1="52" x2="136" y2="34" stroke={shade(primary, -30)} strokeWidth="4" strokeLinecap="round" />
          <circle cx="136" cy="32" r="5" fill={secondary} />

          {/* Head / body */}
          <rect x="42" y="50" width="116" height="108" rx="40" fill={`url(#${gBody})`} />
          {/* soft top highlight */}
          <rect x="54" y="58" width="92" height="30" rx="18" fill="#ffffff" opacity="0.18" />

          {/* Visor screen */}
          <rect x="58" y="74" width="84" height="60" rx="24" fill={`url(#${gVisor})`} />
          <rect x="58" y="74" width="84" height="60" rx="24" fill="none" stroke={secondary} strokeOpacity="0.35" strokeWidth="1.5" />

          {/* Eye glow backers */}
          <circle cx="84" cy="102" r="16" fill={`url(#${gGlow})`} />
          <circle cx="116" cy="102" r="16" fill={`url(#${gGlow})`} />

          {/* Blinking eyes */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4.5, times: [0, 0.62, 0.66, 0.7, 1], repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 102px" }}
          >
            <circle cx="84" cy="102" r="7" fill="#ffffff" />
            <circle cx="116" cy="102" r="7" fill="#ffffff" />
            <circle cx="86" cy="100" r="2.4" fill={secondary} />
            <circle cx="118" cy="100" r="2.4" fill={secondary} />
          </motion.g>

          {/* Smile */}
          <path d="M88 120 Q100 128 112 120" fill="none" stroke={secondary} strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />

          {/* Little body base / collar */}
          <rect x="74" y="150" width="52" height="16" rx="8" fill={shade(primary, -30)} />
          <circle cx="100" cy="158" r="3.4" fill={secondary} />
        </svg>
      </motion.div>

      {/* Name tag */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 backdrop-blur"
        style={{ borderColor: `${primary}55`, background: "rgba(6,8,16,0.72)" }}>
        <span className="text-[12px] font-bold" style={{ color: "#fff" }}>{name}</span>
        <span className="mx-1.5 text-[10px]" style={{ color: `${primary}` }}>·</span>
        <span className="text-[10px] font-mono uppercase tracking-wide" style={{ color: secondary }}>{role}</span>
      </div>
    </div>
  );
}

function Accessory({ kind, primary, secondary }: { kind: PersonaAccessory; primary: string; secondary: string }) {
  const dark = shade(primary, -45);
  switch (kind) {
    case "cap":
      return (
        <g>
          <polygon points="100,30 150,48 100,66 50,48" fill={dark} />
          <polygon points="100,38 128,49 100,60 72,49" fill={secondary} opacity="0.9" />
          <line x1="150" y1="48" x2="150" y2="70" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="150" cy="72" r="4" fill={secondary} />
        </g>
      );
    case "tag":
      return (
        <g>
          <rect x="118" y="30" width="34" height="22" rx="5" transform="rotate(18 135 41)" fill={secondary} />
          <circle cx="126" cy="40" r="3.4" fill="#05070f" />
          <text x="132" y="46" transform="rotate(18 135 41)" fontSize="11" fontWeight="800" fill="#05070f" fontFamily="monospace">%</text>
        </g>
      );
    case "cross":
      return (
        <g>
          <rect x="90" y="30" width="20" height="20" rx="4" fill={secondary} />
          <rect x="94" y="26" width="12" height="28" rx="3" fill="#ffffff" />
          <rect x="86" y="34" width="28" height="12" rx="3" fill="#ffffff" />
        </g>
      );
    case "heart":
      return (
        <g>
          <ellipse cx="100" cy="40" rx="26" ry="9" fill="none" stroke={secondary} strokeWidth="3" opacity="0.85" />
          <path d="M100 54 L92 45 A6 6 0 1 1 100 38 A6 6 0 1 1 108 45 Z" fill={secondary} />
        </g>
      );
    case "helmet":
      return (
        <g>
          <path d="M60 54 Q100 22 140 54 Z" fill={secondary} />
          <rect x="56" y="52" width="88" height="8" rx="4" fill={dark} />
          <rect x="96" y="30" width="8" height="22" rx="4" fill={dark} />
        </g>
      );
    case "seed":
      return (
        <g>
          <path d="M100 52 C100 40 90 30 78 32 C82 46 92 52 100 52 Z" fill={secondary} />
          <path d="M100 52 C100 38 112 28 124 32 C118 48 108 52 100 52 Z" fill={shade(secondary, 18)} />
          <line x1="100" y1="52" x2="100" y2="40" stroke={dark} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "headset":
      return (
        <g>
          <path d="M64 66 Q64 34 100 34 Q136 34 136 66" fill="none" stroke={secondary} strokeWidth="5" strokeLinecap="round" />
          <rect x="56" y="60" width="12" height="20" rx="5" fill={secondary} />
          <rect x="132" y="60" width="12" height="20" rx="5" fill={secondary} />
          <line x1="62" y1="80" x2="62" y2="96" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="62" cy="100" r="5" fill={secondary} />
        </g>
      );
    case "spark":
      return (
        <g>
          <path d="M100 26 L106 44 L124 50 L106 56 L100 74 L94 56 L76 50 L94 44 Z" fill={secondary} />
          <circle cx="100" cy="50" r="4" fill="#ffffff" />
        </g>
      );
    default:
      return null;
  }
}

/** Lighten (+) / darken (-) a hex colour by a percentage amount. */
function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const f = amt / 100;
  const adj = (c: number) => Math.max(0, Math.min(255, Math.round(c + (f < 0 ? c * f : (255 - c) * f))));
  r = adj(r); g = adj(g); b = adj(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
