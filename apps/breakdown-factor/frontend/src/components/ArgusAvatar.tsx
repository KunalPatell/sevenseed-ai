"use client";

import React from "react";

/**
 * Argus — Breakdown Factor's on-site inspection agent.
 * A hand-built SVG persona (no image generation used): a visor/shield
 * silhouette with a hard-hat brim, LED-style eyes, and a scanning "mouth"
 * bar, styled to read as a technical inspection device rather than a
 * literal character illustration. Motion is pure CSS (see globals.css)
 * so the mark stays cheap to render at any size.
 */
export function ArgusAvatar({
  size = 96,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`argus-avatar-wrap relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Argus, Breakdown Factor's AI inspection agent"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} className="block">
        <defs>
          <linearGradient id="argusShieldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <radialGradient id="argusShieldFill" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#1c150f" />
            <stop offset="100%" stopColor="#0a0705" />
          </radialGradient>
        </defs>

        {/* slow-rotating calibration ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="#f59e0b"
          strokeOpacity="0.22"
          strokeWidth="1.5"
          strokeDasharray="3 8"
          className="argus-ring"
        />

        {/* hard-hat brim */}
        <path
          d="M32,27 Q60,4 88,27"
          fill="none"
          stroke="#fef3c7"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* visor / shield body */}
        <path
          d="M60,13 L97,30 L97,73 Q97,95 60,111 Q23,95 23,73 L23,30 Z"
          fill="url(#argusShieldFill)"
          stroke="url(#argusShieldStroke)"
          strokeWidth="3"
        />

        {/* reticle corner ticks */}
        <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.75">
          <path d="M17,35 L17,25 L27,25" fill="none" />
          <path d="M103,35 L103,25 L93,25" fill="none" />
          <path d="M17,87 L17,97 L27,97" fill="none" />
          <path d="M103,87 L103,97 L93,97" fill="none" />
        </g>

        {/* eyes */}
        <rect x="39" y="50" width="13" height="7" rx="2.5" fill="#fef3c7" className="argus-eye" />
        <rect
          x="68"
          y="50"
          width="13"
          height="7"
          rx="2.5"
          fill="#fef3c7"
          className="argus-eye"
          style={{ animationDelay: "0.18s" }}
        />

        {/* scanning mouth */}
        <rect x="39" y="74" width="42" height="4" rx="2" fill="#f59e0b" opacity="0.22" />
        <rect x="39" y="74" width="15" height="4" rx="2" fill="#fef3c7" className="argus-scan" />
      </svg>
    </div>
  );
}
