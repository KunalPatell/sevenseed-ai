import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LangGraphWorkflowCanvas } from "@main/ui-core";

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/sevenforce" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Sevenforce
        </Link>
      </div>
      <LangGraphWorkflowCanvas />
    </main>
  );
}
