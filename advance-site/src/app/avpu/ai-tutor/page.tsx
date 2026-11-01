"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SocraticTutor } from "@main/ui-core";

export default function AITutorPage() {
  return (
    <main className="min-h-screen bg-[#020617] py-10 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/avpu" className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to AVPU
        </Link>
      </div>
      <div className="text-center space-y-2 mb-6">
        <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Adaptive Learning · learnanythingai.in</span>
        <h1 className="text-3xl font-extrabold text-white">Socratic AI Tutor</h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Ask about calculus, distributed systems, or anything else — the tutor guides you to the answer with questions instead of spoon-feeding it.
        </p>
      </div>
      <SocraticTutor />
    </main>
  );
}
