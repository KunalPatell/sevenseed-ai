import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FlashcardDeck } from "@main/ui-core";

export default function FlashcardsPage() {
  return (
    <main className="min-h-screen bg-[#020617] py-10 px-4">
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/avpu" className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to AVPU
        </Link>
      </div>
      <FlashcardDeck />
    </main>
  );
}
