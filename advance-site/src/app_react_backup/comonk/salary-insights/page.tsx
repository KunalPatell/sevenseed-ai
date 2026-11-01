import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SalaryInsightsBenchmark } from "@main/ui-core";

export default function SalaryInsightsPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/comonk" className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Comonk
        </Link>
      </div>
      <SalaryInsightsBenchmark />
    </main>
  );
}
