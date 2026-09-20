"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Puzzle,
  Zap,
  Search,
  ClipboardList,
} from "lucide-react";
import { SectionHeading } from "../ui";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Full-Stack AI Micro-Apps",
    description:
      "End-to-end AI applications with FastAPI backends, React/Next.js frontends, and LLM APIs (OpenAI, Claude, Gemini).",
    tags: ["FastAPI", "Next.js", "LLM APIs"],
    color: "#9ed8ff",
  },
  {
    icon: MessageSquare,
    title: "RAG Document Assistants",
    description:
      "PDF-ingesting chatbots with vector search (FAISS / Supabase) and LLM Q&A — context-aware answers from any document.",
    tags: ["LangChain", "FAISS", "Vector DBs"],
    color: "#cfae6e",
  },
  {
    icon: FileText,
    title: "Resume / JD Matching",
    description:
      "Semantic similarity scoring between resumes and job descriptions with skill-gap analysis and AI recommendations.",
    tags: ["Embeddings", "OpenAI API", "FastAPI"],
    color: "#9ed8ff",
  },
  {
    icon: LayoutDashboard,
    title: "AI Dashboards & Internal Tools",
    description:
      "Custom analytics dashboards and productivity tools powered by AI insights, built with Streamlit or Next.js.",
    tags: ["Streamlit", "Next.js", "Plotly"],
    color: "#cfae6e",
  },
  {
    icon: Zap,
    title: "Document Automation",
    description:
      "Automated proposal generation, report generation, and document processing pipelines using LLMs and workflow tools.",
    tags: ["LangGraph", "n8n", "Python"],
    color: "#9ed8ff",
  },
  {
    icon: ClipboardList,
    title: "Meeting Summary Tools",
    description:
      "Audio/transcript-to-structured-summary pipelines using Whisper + LLMs, with action-item extraction.",
    tags: ["Whisper", "OpenAI API", "LangChain"],
    color: "#cfae6e",
  },
  {
    icon: Search,
    title: "AI Agents & Flows",
    description:
      "Autonomous AI agents built with LangGraph that can search, reason, and take multi-step actions on real data.",
    tags: ["LangGraph", "AI Agents", "Tool Calling"],
    color: "#9ed8ff",
  },
  {
    icon: Puzzle,
    title: "API & Workflow Integrations",
    description:
      "Business process automation connecting AI models to third-party APIs, databases, and existing SaaS tools.",
    tags: ["REST APIs", "Supabase", "n8n"],
    color: "#cfae6e",
  },
];

export function WhatICanBuild() {
  return (
    <section
      id="capabilities"
      className="section bg-[#050505] border-t border-white/5"
    >
      <div className="container-px">
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <>
              What I can{" "}
              <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">
                build
              </span>
            </>
          }
          description="End-to-end AI products I'm ready to ship — from LLM micro-apps to RAG pipelines and document automation."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            const isBlue = cap.color === "#9ed8ff";
            return (
              <motion.div
                key={cap.title}
                data-blur-in
                style={{ transitionDelay: `${(i % 4) * 75}ms` }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group glass-card flex flex-col gap-4 p-5 hover:border-[#9ed8ff]/30 transition-all duration-300 cursor-default"
              >
                {/* icon */}
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl border transition-all duration-300 ${
                    isBlue
                      ? "border-[#9ed8ff]/20 bg-[#9ed8ff]/10 text-[#9ed8ff] group-hover:bg-[#9ed8ff]/20 group-hover:shadow-[0_0_12px_rgba(158,216,255,0.2)]"
                      : "border-[#cfae6e]/20 bg-[#cfae6e]/10 text-[#cfae6e] group-hover:bg-[#cfae6e]/20 group-hover:shadow-[0_0_12px_rgba(207,174,110,0.2)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                {/* content */}
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#9ed8ff] transition-colors duration-300">
                    {cap.title}
                  </h3>
                  <p className="flex-1 text-[11px] leading-relaxed text-white/50">
                    {cap.description}
                  </p>
                </div>

                {/* tags */}
                <ul className="flex flex-wrap gap-1.5">
                  {cap.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-white/40"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
