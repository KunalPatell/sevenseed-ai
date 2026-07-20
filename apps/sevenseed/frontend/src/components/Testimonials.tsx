"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "The shared AI backend saved us months of coding. We shipped AVP Emart price comparators in less than two weeks.",
    name: "Venture Founder",
    place: "Ahmedabad",
    initial: "V",
  },
  {
    quote: "Ideating with the Sevenseed sandbox drafted full architecture pitches. Moat and weekly sprint checklists are extremely clear.",
    name: "Incubated Partner",
    place: "Sanand",
    initial: "A",
  },
  {
    quote: "We share data vectors across companies. Recommenders can suggest campus pharmacy drugs directly to students.",
    name: "SaaS Developer",
    place: "Ahmedabad",
    initial: "M",
  },
  {
    quote: "Breakdown Factor's AI site-safety monitor flagged a hazard before it became an incident — the shared vision stack just worked out of the box.",
    name: "Operations Lead",
    place: "Gandhinagar",
    initial: "B",
  },
  {
    quote: "We replaced five disconnected tools with Sevenforce's AI workforce. Same studio backbone, completely different product — that's the leverage.",
    name: "Growth-Stage Founder",
    place: "Ahmedabad",
    initial: "S",
  },
];

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const t = TESTIMONIALS[idx];

  return (
    <div
      className="max-w-[720px] mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="tcard flex flex-col gap-4 items-center text-center"
          >
            <div className="text-[#ddd6fe] flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-sm md:text-base text-[#9aa0b8] italic leading-relaxed max-w-[560px]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#ddd6fe] text-xs">
                {t.initial}
              </div>
              <div className="text-xs text-left">
                <strong className="block text-white">{t.name}</strong>
                <span className="text-[#5b5f78]">{t.place}</span>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-[#8b5cf6]" : "w-1.5 bg-white/15 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
