"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, Building2, TrendingUp, CheckCircle2 } from "lucide-react";
import { experiences } from "../../lib/data";
import { SectionHeading, CardSpotlight } from "../ui";

export function Experience() {
  return (
    <section id="experience" className="section bg-[#050505] border-t border-white/5 relative">
      <div className="container-px relative z-10">
        <SectionHeading
          eyebrow="Career Trajectory"
          title={
            <>
              Applied <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">AI Engineering</span> Experience
            </>
          }
          description="Proven industry track record building AI game engines, enterprise automation backends, and high-throughput production data pipelines."
        />

        <div className="relative ml-4 md:ml-8 border-l border-white/10 pl-6 md:pl-10 space-y-10">
          {/* Vertical glowing timeline bar */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-[#cfae6e] via-[#9ed8ff] to-[#38bdf8] shadow-[0_0_12px_rgba(158,216,255,0.6)]"
          />

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.role + exp.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {/* Glowing timeline node */}
              <span className="absolute -left-[35px] md:-left-[51px] top-1.5 grid h-7 w-7 md:h-8 md:w-8 place-items-center rounded-full border border-[#9ed8ff]/50 bg-[#080a0f] text-[#9ed8ff] shadow-[0_0_12px_rgba(158,216,255,0.5)] transition-all duration-300 hover:scale-110 hover:border-[#9ed8ff]">
                <Briefcase className="h-3.5 w-3.5" />
              </span>

              {/* Experience Card */}
              <CardSpotlight radius={320} color="rgba(158, 216, 255, 0.12)" className="p-6 transition-all duration-300 group border border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-mono text-base font-bold uppercase tracking-wider text-white group-hover:text-[#9ed8ff] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs font-mono text-[#cfae6e]">
                      <Building2 className="h-3.5 w-3.5 text-[#cfae6e]/70" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    {exp.metrics && (
                      <span className="rounded-full bg-[#cfae6e]/10 border border-[#cfae6e]/20 px-3 py-1 text-[11px] text-[#cfae6e] font-semibold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> {exp.metrics}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-white/70 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[11px]">
                      <Calendar className="h-3 w-3 text-[#9ed8ff]" />
                      <span>{exp.period}</span>
                    </span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-xs leading-relaxed text-white/80">
                      <span className="text-[#9ed8ff] font-mono mt-0.5 shrink-0">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
