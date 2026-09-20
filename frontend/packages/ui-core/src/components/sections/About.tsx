"use client";

import { BrainCircuit, Workflow, ScanFace, MessagesSquare } from "lucide-react";
import { about } from "../../lib/data";
import { SectionHeading } from "../ui";

const pillars = [
  { icon: BrainCircuit, title: "Machine Learning", desc: "Models that learn from data and ship to production." },
  { icon: MessagesSquare, title: "LLM & NLP", desc: "Chatbots, assistants, and language understanding." },
  { icon: ScanFace, title: "Computer Vision", desc: "Detection, recognition, and image intelligence." },
  { icon: Workflow, title: "Automation", desc: "Agents and pipelines that remove manual work." },
];

export function About() {
  return (
    <section id="about" className="section bg-[#050505]">
      <div className="container-px">
        <SectionHeading eyebrow="About" title={about.headline} />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div data-blur-in="subtle" className="space-y-6 text-sm leading-relaxed text-white/70">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="grid grid-cols-3 gap-4 pt-4">
              {about.highlights.map((h) => (
                <div
                  key={h.label}
                  className="glass-card px-4 py-3 hover:border-[#9ed8ff]/30 transition-all duration-300"
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted font-mono">{h.label}</div>
                  <div className="text-xs font-semibold text-white mt-1">{h.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                data-blur-in
                className="glass-card h-full p-6 hover:border-[#9ed8ff]/30 transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p.icon className="mb-4 h-6 w-6 text-[#9ed8ff]" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
