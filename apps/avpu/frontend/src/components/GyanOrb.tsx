"use client";

import React from "react";

/**
 * Gyan — AVPU's AI tutor persona.
 *
 * "Gyan" (ज्ञान) is Gujarati/Hindi for knowledge — a deliberately local name
 * for a university based in Ahmedabad, rather than an invented English brand
 * word. The three nodes visualize the real pipeline in backend/agents.py:
 * a LangGraph graph of intent_classifier -> rag_retriever -> tutor_advisor.
 * The traveling pulse shows a question moving through that pipeline before
 * Gyan answers, grounded in AVPU's syllabus knowledge base (rag.py).
 *
 * Pure SVG/CSS, no image assets. Respects prefers-reduced-motion via the
 * .gyan-orb rules added to globals.css.
 */
export function GyanOrb({ size = 96, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`gyan-orb relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Gyan, the AVPU AI tutor"
    >
      <div className="gyan-orb-blob">
        <svg viewBox="0 0 100 100" className="w-[68%] h-[68%]" aria-hidden>
          {/* Triangle pipeline: intent -> rag -> advisor */}
          <line x1="50" y1="22" x2="76" y2="70" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <line x1="76" y1="70" x2="24" y2="70" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <line x1="24" y1="70" x2="50" y2="22" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />

          <circle cx="50" cy="22" r="7" fill="#fff" />
          <circle cx="76" cy="70" r="7" fill="rgba(255,255,255,0.85)" />
          <circle cx="24" cy="70" r="7" fill="rgba(255,255,255,0.85)" />

          {/* traveling pulse — a question moving through the graph */}
          <circle cx="50" cy="22" r="4" fill="#fff" className="gyan-orb-pulse" />
        </svg>
      </div>
    </div>
  );
}
