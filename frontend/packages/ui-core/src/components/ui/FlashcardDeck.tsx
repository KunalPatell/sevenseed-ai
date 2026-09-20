"use client";

import React, { useState } from "react";
import { Layers, RotateCw, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";

type Card = { id: string; front: string; back: string; box: number };

const SEED: Card[] = [
  { id: "c1", front: "CAP Theorem", back: "A distributed system can only guarantee 2 of 3: Consistency, Availability, Partition tolerance.", box: 1 },
  { id: "c2", front: "Big-O of binary search", back: "O(log n) — halves the search space each step.", box: 1 },
  { id: "c3", front: "Hick's Law", back: "Decision time increases logarithmically with the number of choices.", box: 1 },
  { id: "c4", front: "First derivative of sin(x)", back: "cos(x)", box: 1 },
  { id: "c5", front: "ACID (databases)", back: "Atomicity, Consistency, Isolation, Durability.", box: 1 },
];

const BOX_LABEL = ["", "New", "Learning", "Reviewing", "Mastered"];

export function FlashcardDeck() {
  const [cards, setCards] = useState<Card[]>(SEED);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);

  const current = cards[index % cards.length];

  const grade = (knewIt: boolean) => {
    setCards((prev) =>
      prev.map((c, i) =>
        i === index % cards.length
          ? { ...c, box: knewIt ? Math.min(4, c.box + 1) : 1 }
          : c
      )
    );
    setSessionDone((n) => n + 1);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const masteredCount = cards.filter((c) => c.box === 4).length;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-sky-900/40 bg-[#020617] backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-sky-900/40">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Spaced Repetition Flashcards</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">{masteredCount}/{cards.length} mastered · {sessionDone} reviewed this session</span>
      </div>

      <div className="p-6 sm:p-10 flex flex-col items-center gap-6">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full max-w-md aspect-[3/2] rounded-2xl bg-sky-950/40 border border-sky-800/50 flex flex-col items-center justify-center p-6 text-center hover:border-sky-500/50 transition-colors relative"
        >
          <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {BOX_LABEL[current.box]}
          </span>
          <span className="text-lg font-bold text-slate-100 leading-snug">
            {flipped ? current.back : current.front}
          </span>
          <span className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> tap to {flipped ? "hide" : "reveal"}
          </span>
        </button>

        {flipped ? (
          <div className="flex gap-3">
            <button
              onClick={() => grade(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> Didn&apos;t know it
            </button>
            <button
              onClick={() => grade(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Knew it
            </button>
          </div>
        ) : (
          <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Cards you know move up a box; cards you miss reset to New.
          </p>
        )}
      </div>
    </div>
  );
}
