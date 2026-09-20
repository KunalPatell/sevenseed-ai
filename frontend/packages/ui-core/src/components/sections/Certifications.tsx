import { BadgeCheck } from "lucide-react";
import { certifications } from "../../lib/data";
import { SectionHeading } from "../ui";

export function Certifications() {
  return (
    <section id="certifications" className="section bg-[#050505] border-t border-white/5">
      <div className="container-px">
        <SectionHeading
          eyebrow="Certifications"
          title={<>Continuous learning</>}
          description="Foundations and specializations across AI, ML, and data."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <div
              key={cert.title}
              data-blur-in
              style={{ transitionDelay: `${i * 60}ms` }}
              className="glass-card flex items-center gap-4 p-5 hover:border-[#9ed8ff]/30 transition-all duration-300"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#cfae6e]/10 text-[#cfae6e] border border-[#cfae6e]/20 shadow-[0_0_10px_rgba(207,174,110,0.15)]">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-white">
                  {cert.title}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[#9ed8ff]/70">
                  {cert.tag}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

