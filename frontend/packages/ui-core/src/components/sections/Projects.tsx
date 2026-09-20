"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
  BarChart3,
} from "lucide-react";
import { projects, Project } from "../../lib/data";
import { SectionHeading, CardSpotlight } from "../ui";
import { HoloTilt3D } from "../motion";
import { sound } from "../../lib/sound";

const FILTERS = ["All", "Venture Startups", "AI & LLM", "Computer Vision", "Automation"];

function bucket(p: Project): string {
  if (p.isStartupVenture) return "Venture Startups";
  const c = p.category.toLowerCase();
  if (c.includes("vision") || c.includes("face") || c.includes("detection")) return "Computer Vision";
  if (c.includes("automation") || c.includes("workforce")) return "Automation";
  return "AI & LLM";
}

export function Projects() {
  const [active, setActive] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const shown =
    active === "All"
      ? projects
      : active === "Venture Startups"
      ? projects.filter((p) => p.isStartupVenture)
      : projects.filter((p) => bucket(p) === active);

  const handleOpenModal = (p: Project) => {
    setSelectedProject(p);
    sound.playClick();
  };

  const handleTabChange = (f: string) => {
    setActive(f);
    sound.playHover();
  };

  return (
    <section id="projects" className="section bg-[#050505] border-t border-white/5 relative">
      <div className="container-px">
        <SectionHeading
          eyebrow="Production AI Portfolio"
          title={
            <>
              Production <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">AI Systems</span> &amp; Platforms
            </>
          }
          description="9+ deployed production platforms — spanning public safety policing suites, computer vision workstations, multi-agent SaaS hubs, and automated business engines."
        />

        {/* Filter Tabs */}
        <div data-blur-in className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleTabChange(f)}
              className={`relative rounded-xl border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 ${
                active === f
                  ? "border-[#9ed8ff]/50 bg-[#9ed8ff]/15 text-[#9ed8ff] shadow-[0_0_15px_rgba(158,216,255,0.2)]"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-[#9ed8ff]/30 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((project, i) => (
            <motion.div
              layout
              key={project.id || project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              className="h-full"
            >
              <HoloTilt3D className="h-full" intensity={14} glareOpacity={0.3}>
                <CardSpotlight
                  radius={280}
                  color="rgba(158, 216, 255, 0.15)"
                  className="h-full cursor-pointer hover:border-[#9ed8ff]/50 transition-all duration-300 transform-gpu hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                  onClick={() => handleOpenModal(project)}
                >
                  <article
                    style={{ transformStyle: "preserve-3d" }}
                    className="group flex h-full flex-col overflow-hidden"
                  >
                    <div style={{ transformStyle: "preserve-3d" }} className={`relative h-44 overflow-hidden bg-gradient-to-br ${project.accent}`}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.title} project cover`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-background/40" />
                    <span
                      style={{ transform: "translateZ(28px)" }}
                      className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#080a0f]/90 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/90 backdrop-blur-sm shadow-md"
                    >
                      {project.category}
                    </span>
                    {project.status ? (
                      <span
                        style={{ transform: "translateZ(28px)" }}
                        className="absolute right-4 top-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300 backdrop-blur-sm shadow-md"
                      >
                        {project.status}
                      </span>
                    ) : null}
                    <ArrowUpRight
                      style={{ transform: "translateZ(24px)" }}
                      className="absolute bottom-3 right-3 h-5 w-5 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#9ed8ff]"
                    />
                  </div>

                  <div style={{ transformStyle: "preserve-3d" }} className="flex flex-1 flex-col p-6">
                    <h3
                      style={{ transform: "translateZ(20px)" }}
                      className="font-mono text-sm uppercase tracking-wider text-white group-hover:text-[#9ed8ff] transition-colors duration-300 flex items-center justify-between"
                    >
                      <span className="font-bold">{project.title}</span>
                      <span className="text-[10px] text-white/30 font-normal group-hover:text-[#cfae6e]">Inspect &rarr;</span>
                    </h3>
                    <p
                      style={{ transform: "translateZ(12px)" }}
                      className="mt-3 flex-1 text-xs leading-relaxed text-muted line-clamp-3"
                    >
                      {project.description}
                    </p>

                    {/* Impact metric pills */}
                    {project.impactMetrics && project.impactMetrics.length > 0 && (
                      <div
                        style={{ transform: "translateZ(16px)" }}
                        className="mt-3 flex flex-wrap gap-1.5 border-t border-white/5 pt-3"
                      >
                        {project.impactMetrics.slice(0, 2).map((m) => (
                          <span
                            key={m.label}
                            className="rounded bg-[#cfae6e]/10 border border-[#cfae6e]/20 px-2 py-0.5 text-[9px] font-mono text-[#cfae6e]"
                          >
                            {m.label}: {m.value}
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      style={{ transform: "translateZ(14px)" }}
                      className="mt-4 flex flex-wrap gap-x-2 gap-y-1 border-t border-white/5 pt-3"
                    >
                      {project.techStack.slice(0, 4).map((t) => (
                        <span key={t} className="font-mono text-[10px] text-[#9ed8ff]/80">
                          #{t.replace(/\s+/g, "")}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
                </CardSpotlight>
              </HoloTilt3D>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0d14] p-6 sm:p-8 shadow-2xl z-10 scrollbar-thin"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <span className="rounded-full border border-[#9ed8ff]/30 bg-[#9ed8ff]/10 px-3 py-1 font-mono text-xs text-[#9ed8ff]">
                  {selectedProject.category}
                </span>
                {selectedProject.status && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-400">
                    {selectedProject.status}
                  </span>
                )}
              </div>

              <h2 className="mt-4 font-mono text-2xl font-bold uppercase tracking-wider text-white">
                {selectedProject.title}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {selectedProject.description}
              </p>

              {/* Impact Metrics */}
              {selectedProject.impactMetrics && (
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
                  {selectedProject.impactMetrics.map((m) => (
                    <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                      <div className="font-display text-sm sm:text-base font-bold text-[#cfae6e]">{m.value}</div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-white/40 mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Architectural Highlights */}
              {selectedProject.architecture && (
                <div className="mt-6 border-t border-white/5 pt-6">
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff]">
                    <Cpu className="h-4 w-4 text-[#9ed8ff]" />
                    Architecture &amp; Engineering Decisions
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {selectedProject.architecture.map((arch) => (
                      <li key={arch} className="flex items-start gap-2.5 font-mono text-xs text-white/80">
                        <span className="text-[#9ed8ff] mt-0.5 shrink-0">▸</span>
                        <span>{arch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Features */}
              <div className="mt-6 border-t border-white/5 pt-6">
                <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Key System Features
                </h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 font-mono text-xs text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#cfae6e]" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mt-6 border-t border-white/5 pt-6">
                <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff]">
                  <Layers className="h-4 w-4 text-[#9ed8ff]" />
                  Technology Stack
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <span key={tech} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/90">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 border-t border-white/5 pt-6">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#9ed8ff]/50 bg-[#9ed8ff]/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#9ed8ff] transition-all hover:bg-[#9ed8ff]/20 hover:shadow-[0_0_15px_rgba(158,216,255,0.3)]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Launch Live System
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-all hover:bg-white/10"
                  >
                    <Github className="h-4 w-4" />
                    View Repository
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
