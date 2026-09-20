"use client";

import React, { useState } from "react";
import { HandHeart, MapPin, CalendarDays, Users, Check } from "lucide-react";

type Event = {
  id: string;
  title: string;
  location: string;
  date: string;
  slotsTotal: number;
  slotsFilled: number;
};

const EVENTS: Event[] = [
  { id: "e1", title: "Mobile Health Camp — Rural Kutch", location: "Bhuj Taluka", date: "2026-10-04", slotsTotal: 20, slotsFilled: 14 },
  { id: "e2", title: "School Supply Drive", location: "Ahmedabad East", date: "2026-10-11", slotsTotal: 15, slotsFilled: 15 },
  { id: "e3", title: "Blood Donation Camp", location: "Gandhinagar Sector 21", date: "2026-10-18", slotsTotal: 30, slotsFilled: 8 },
];

export function VolunteerSignup() {
  const [signedUp, setSignedUp] = useState<Set<string>>(new Set());
  const [fills, setFills] = useState<Record<string, number>>({});

  const signUp = (id: string) => {
    setSignedUp((prev) => new Set(prev).add(id));
    setFills((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-amber-500/30 bg-emerald-950/20 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-amber-500/20 text-sm font-bold text-slate-100">
        <HandHeart className="w-4 h-4 text-amber-400" />
        <span>Volunteer for Upcoming Events</span>
      </div>

      <div className="divide-y divide-amber-500/10">
        {EVENTS.map((e) => {
          const filled = e.slotsFilled + (fills[e.id] ?? 0);
          const isFull = filled >= e.slotsTotal;
          const isSignedUp = signedUp.has(e.id);
          const pct = Math.min(100, Math.round((filled / e.slotsTotal) * 100));
          return (
            <div key={e.id} className="p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{e.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.location}</span>
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {e.date}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {filled}/{e.slotsTotal}
                </span>
              </div>

              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: `${pct}%` }} />
              </div>

              <button
                onClick={() => signUp(e.id)}
                disabled={isSignedUp || (isFull && !isSignedUp)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isSignedUp
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : isFull
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-emerald-500 text-black hover:opacity-90"
                }`}
              >
                {isSignedUp ? (
                  <><Check className="w-3.5 h-3.5" /> You&apos;re signed up</>
                ) : isFull ? (
                  "Fully booked"
                ) : (
                  "Sign Up to Volunteer"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
