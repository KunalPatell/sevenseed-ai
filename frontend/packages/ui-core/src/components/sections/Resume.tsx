"use client";

import { Download, FileText, GraduationCap, Award, Briefcase, CheckCircle2 } from "lucide-react";
import { resume, resumeAction } from "../../lib/data";
import { SectionHeading } from "../ui";
import { CyberButton } from "../ui";
import { sound } from "../../lib/sound";

function getSectionIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("education") || t.includes("degree")) return GraduationCap;
  if (t.includes("experience") || t.includes("career")) return Briefcase;
  if (t.includes("cert")) return Award;
  return FileText;
}

export function Resume() {
  const action = resumeAction();

  return (
    <section id="resume" className="section bg-[#050505] border-t border-white/5 relative">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Resume &amp; Credentials"
            title={
              <>
                Executive <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">ATS Summary</span>
              </>
            }
            description="Verified record of MSc/BCA academic credentials, professional industry tenures, and advanced AI specializations."
          />
          <div data-blur-in="subtle">
            <CyberButton
              href={action.href}
              external={action.external}
              icon={Download}
            >
              {action.label}
            </CyberButton>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {resume.map((sec, i) => {
            const Icon = getSectionIcon(sec.title);
            return (
              <div
                key={sec.title}
                data-blur-in
                style={{ transitionDelay: `${i * 100}ms` }}
                className="glass-card h-full p-6 hover:border-[#9ed8ff]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6 flex items-center gap-2.5 border-b border-white/5 pb-4">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#9ed8ff]/30 bg-[#9ed8ff]/10 text-[#9ed8ff]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
                      {sec.title}
                    </h3>
                  </div>

                  <ul className="space-y-6">
                    {sec.items.map((item, j) => (
                      <li key={j} className="group/item">
                        <p className="text-xs font-mono font-bold uppercase tracking-wider text-white group-hover/item:text-[#9ed8ff] transition-colors duration-200">
                          {item.primary}
                        </p>
                        {item.secondary ? (
                          <p className="mt-1 text-xs text-[#cfae6e] font-mono">{item.secondary}</p>
                        ) : null}
                        {item.meta ? (
                          <p className="mt-1 text-[10px] text-white/40 font-mono uppercase tracking-widest">{item.meta}</p>
                        ) : null}

                        {item.badges && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.badges.map((b) => (
                              <span
                                key={b}
                                className="rounded bg-white/[0.03] border border-white/10 px-2 py-0.5 text-[9px] font-mono text-white/70"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.points ? (
                          <ul className="mt-3 space-y-1.5 text-xs text-white/70">
                            {item.points.map((pt) => (
                              <li key={pt} className="leading-relaxed flex items-start gap-2">
                                <span className="text-[#9ed8ff] font-mono text-xs mt-0.5">▸</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
