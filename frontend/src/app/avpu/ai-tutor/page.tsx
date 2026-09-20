import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AITutorPage() {
  return (
    <main className="min-h-screen py-10 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/avpu" className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to AVPU
        </Link>
      </div>
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Adaptive Learning</span>
        <h1 className="text-3xl font-extrabold text-white">Socratic AI Tutor</h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Engage in interactive dialogue breakdowns of calculus, machine learning, and distributed systems.
        </p>
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs font-mono text-slate-300 max-w-lg mx-auto">
          AI: "What is the primary trade-off in the CAP theorem for distributed databases?"<br/><br/>
          Student: "Consistency vs Availability during network partitions."<br/><br/>
          AI: "Spot on. Now explain how Cassandra handles eventual consistency using vector clocks."
        </div>
      </div>
    </main>
  );
}
