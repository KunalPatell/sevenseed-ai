"use client";

import React from "react";

/**
 * Asha — AVP Charitable Trust's donor & welfare assistant.
 * A hand-built SVG persona (no image generation used): a soft rounded
 * orb with a simple face, deliberately warm and organic — the opposite
 * silhouette language of Breakdown Factor's angular Argus mark, since
 * the two products sit at opposite emotional registers. Motion is pure
 * CSS (see globals.css): a gentle breathing scale, a slow blink, and a
 * twinkling companion spark.
 */
export function AshaAvatar({
  size = 96,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`asha-breathe relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Asha, AVP Charitable Trust's donor and welfare assistant"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} className="block">
        <defs>
          <radialGradient id="ashaGlow" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="45%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#b91c3f" />
          </radialGradient>
        </defs>

        {/* soft orb body */}
        <path
          d="M60,14 C82,14 101,33 101,56 C101,78 86,98 60,106 C34,98 19,78 19,56 C19,33 38,14 60,14 Z"
          fill="url(#ashaGlow)"
        />

        {/* warm cheeks */}
        <circle cx="38" cy="66" r="7" fill="#fff" opacity="0.16" />
        <circle cx="82" cy="66" r="7" fill="#fff" opacity="0.16" />

        {/* eyes */}
        <circle cx="46" cy="54" r="5.5" fill="#3a0a17" className="asha-eye" />
        <circle
          cx="74"
          cy="54"
          r="5.5"
          fill="#3a0a17"
          className="asha-eye"
          style={{ animationDelay: "0.22s" }}
        />

        {/* smile */}
        <path
          d="M45,70 Q60,82 75,70"
          fill="none"
          stroke="#3a0a17"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* companion spark */}
        <circle cx="94" cy="30" r="4" fill="#fef3c7" className="asha-spark" />
      </svg>
    </div>
  );
}
