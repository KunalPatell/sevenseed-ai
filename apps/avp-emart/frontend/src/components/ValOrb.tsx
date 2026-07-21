"use client";

import React from "react";

/**
 * Val — AVP Emart's AI value scout.
 *
 * Named after the product's real scoring metric: comparator.py weighs every
 * listing 40% price / 40% rating / 20% reviews into a single "value_score".
 * Val is the persona wrapped around that scoring function and the assistant()
 * agent in backend/agents.py — four orbiting dots stand in for the four
 * stores Val checks (Amazon, Flipkart, Reliance Digital, Snapdeal), and the
 * one that lands on the ring glows to show which store just won.
 *
 * Pure SVG/CSS, no image assets. Respects prefers-reduced-motion via the
 * .val-orb rules added to globals.css.
 */
export function ValOrb({ size = 96, className = "" }: { size?: number; className?: string }) {
  const orbitR = `${Math.round(size * 0.62)}px`;
  return (
    <div
      className={`val-orb relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Val, the AVP Emart AI value scout"
    >
      {/* Orbiting store dots — one per compared platform */}
      <div className="val-orb-orbit" style={{ "--orbit-r": orbitR } as React.CSSProperties} aria-hidden>
        <span className="val-orb-dot val-orb-dot-1" />
        <span className="val-orb-dot val-orb-dot-2" />
        <span className="val-orb-dot val-orb-dot-3" />
        <span className="val-orb-dot val-orb-dot-4 val-orb-dot-best" />
      </div>

      {/* Gradient blob body */}
      <div className="val-orb-blob">
        <svg viewBox="0 0 100 100" className="w-[58%] h-[58%]" aria-hidden>
          {/* Scan sweep */}
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <g className="val-orb-sweep" style={{ transformOrigin: "50px 50px" }}>
            <path d="M50 50 L50 20 A30 30 0 0 1 76 35 Z" fill="rgba(255,255,255,0.28)" />
          </g>
          {/* Magnifier "eye" — Val is always looking for the better price */}
          <circle cx="46" cy="46" r="14" fill="none" stroke="#fff" strokeWidth="4.5" />
          <line x1="56" y1="56" x2="68" y2="68" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          {/* checkmark inside the lens once a winner is found */}
          <path
            d="M40 46 L44.5 51 L53 41"
            fill="none"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="val-orb-check"
          />
        </svg>
      </div>
    </div>
  );
}
