import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MissingPersonReporter } from "@main/ui-core";

export default function MissingPersonPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto mb-6">
        <Link href="/rakshak-ai" className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Rakshak AI
        </Link>
      </div>
      <MissingPersonReporter />
    </main>
  );
}
