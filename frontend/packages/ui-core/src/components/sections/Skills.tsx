"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BrainCircuit, ScanFace, Layers, Workflow } from "lucide-react";
import { skillGroups } from "../../lib/data";
import { SectionHeading } from "../ui";
import { CyberRadar2D } from "../ui";
import { sound } from "../../lib/sound";

const iconMap: Record<string, typeof BrainCircuit> = {
  BrainCircuit,
  ScanFace,
  Layers,
  Workflow,
};

export function Skills() {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredGroups = skillGroups
    .map((group) => ({
      ...group,
      skills: group.skills.filter(
        (s) =>
          s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(filterQuery.toLowerCase())))
      ),
    }))
    .filter((group) => group.skills.length > 0);

  return (
    <section id="skills" className="section bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <div className="container-px relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center mb-10">
          <div>
            <SectionHeading
              eyebrow="Technical Proficiency"
              title={
                <>
                  Engineered <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">Toolkit &amp; Radar</span>
                </>
              }
              description="Deep technical mastery across multi-agent orchestration, computer vision, FastAPI backends, and autonomous workflows."
            />

            {/* Quick Search Tool */}
            <div data-blur-in="subtle" className="w-full sm:w-80 mt-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  value={filterQuery}
                  onChange={(e) => {
                    setFilterQuery(e.target.value);
                    sound.playHover();
                  }}
                  placeholder="Filter skills (e.g. YOLO, LangGraph)..."
                  className="w-full rounded-xl border border-white/10 bg-[#080a0f] pl-10 pr-4 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#9ed8ff]/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div data-blur-in="subtle" className="flex justify-center">
            <CyberRadar2D />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {filteredGroups.map((group, i) => {
            const Icon = iconMap[group.iconName] || BrainCircuit;
            return (
              <div
                key={group.category}
                data-blur-in
                style={{ transitionDelay: `${i * 80}ms` }}
                className="glass-card flex flex-col justify-between p-6 hover:border-[#9ed8ff]/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#9ed8ff]/30 bg-[#9ed8ff]/10 text-[#9ed8ff]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#9ed8ff]">
                        {group.category}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 uppercase">
                      {group.skills.length} Items
                    </span>
                  </div>

                  <div className="space-y-4">
                    {group.skills.map((skill) => (
                      <div key={skill.name} className="group/item relative">
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span className="text-white/90 group-hover/item:text-[#9ed8ff] transition-colors duration-200">
                            {skill.name}
                          </span>
                          <span className="text-[#cfae6e] font-semibold text-[11px]">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Animated Progress Meter */}
                        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#cfae6e] via-[#9ed8ff] to-[#38bdf8] shadow-[0_0_10px_rgba(158,216,255,0.4)]"
                          />
                        </div>

                        {/* Meta tags */}
                        <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-white/40">
                          <span>Exp: {skill.experience}</span>
                          <span>Built: {skill.projectsBuilt}+ Apps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
