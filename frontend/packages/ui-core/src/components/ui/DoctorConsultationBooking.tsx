"use client";

import React, { useState } from "react";
import { Stethoscope, Video, Star, CheckCircle2, Calendar } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  fee: number;
  slots: string[];
};

const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Anjali Mehta", specialty: "General Physician", rating: 4.8, experience: "14 yrs", fee: 299, slots: ["10:30 AM", "12:00 PM", "4:15 PM"] },
  { id: "d2", name: "Dr. Rohan Kapadia", specialty: "Dermatologist", rating: 4.6, experience: "9 yrs", fee: 499, slots: ["11:00 AM", "2:30 PM"] },
  { id: "d3", name: "Dr. Sneha Iyer", specialty: "Pediatrician", rating: 4.9, experience: "17 yrs", fee: 349, slots: ["9:00 AM", "1:00 PM", "5:45 PM"] },
];

export function DoctorConsultationBooking() {
  const [booked, setBooked] = useState<Record<string, string>>({});

  const book = (docId: string, slot: string) => {
    setBooked((prev) => ({ ...prev, [docId]: slot }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-teal-900/40 bg-teal-950/10 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-teal-900/40 text-sm font-bold text-slate-100">
        <Stethoscope className="w-4 h-4 text-teal-400" />
        <span>Online Doctor Consultation</span>
        <span className="text-[10px] font-mono text-slate-500">(1mg/practo-style, video call)</span>
      </div>

      <div className="divide-y divide-teal-900/30">
        {DOCTORS.map((d) => {
          const bookedSlot = booked[d.id];
          return (
            <div key={d.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-100">{d.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{d.specialty} · {d.experience} experience</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-amber-400 justify-end"><Star className="w-3 h-3 fill-amber-400" /> {d.rating}</div>
                  <div className="text-[11px] font-mono text-slate-400">₹{d.fee} / consult</div>
                </div>
              </div>

              {bookedSlot ? (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Video call confirmed for {bookedSlot} today
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {d.slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => book(d.id, s)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-800/50 text-teal-300 hover:bg-teal-900/60 hover:border-teal-500/50 transition-colors"
                    >
                      <Calendar className="w-3 h-3" /> {s}
                    </button>
                  ))}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg text-slate-500">
                    <Video className="w-3 h-3" /> video call
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
