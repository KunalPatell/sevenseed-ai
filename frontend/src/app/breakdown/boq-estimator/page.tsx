import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BOQTakeoffCalculator } from "@main/ui-core";

export default function BOQEstimatorPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/breakdown" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Breakdown Factor
        </Link>
      </div>
      <BOQTakeoffCalculator />
    </main>
  );
}
