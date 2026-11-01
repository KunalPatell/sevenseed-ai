import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CyberThreatRadar } from "@main/ui-core";

export default function ThreatRadarPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/rakshak-ai" className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Rakshak AI
        </Link>
      </div>
      <CyberThreatRadar />
    </main>
  );
}
