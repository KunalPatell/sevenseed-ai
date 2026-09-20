"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Download,
  Mail,
  RefreshCw,
  Layers,
  ArrowRight,
  Zap,
} from "lucide-react";
import { atsPresets, profile } from "../../lib/data";
import { analyzeJobDescription, AtsMatchResult } from "../../lib/api";
import { SectionHeading } from "../ui";
import { sound } from "../../lib/sound";

export function AtsMatcher() {
  const [jobText, setJobText] = useState(atsPresets[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AtsMatchResult | null>(() =>
    analyzeJobDescription(atsPresets[0].text)
  );

  const handleAnalyze = () => {
    if (!jobText.trim()) return;
    setIsAnalyzing(true);
    sound.playScan();
    setTimeout(() => {
      const res = analyzeJobDescription(jobText);
      setResult(res);
      setIsAnalyzing(false);
      sound.playSuccess();
    }, 600);
  };

  const loadPreset = (text: string) => {
    setJobText(text);
    sound.playClick();
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(analyzeJobDescription(text));
      setIsAnalyzing(false);
      sound.playSuccess();
    }, 400);
  };

  return (
    <section id="ats-matcher" className="section bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-px relative z-10">
        <SectionHeading
          eyebrow="Interactive ATS Matcher"
          title={
            <>
              Instant <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">Job-to-Resume</span> Fit Evaluation
            </>
          }
          description="Paste any Job Description or select a role preset to evaluate real-time skill matching, ATS compatibility score, and project relevance."
        />

        {/* Role Presets */}
        <div data-blur-in className="mb-6 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 mr-1">
            Role Presets:
          </span>
          {atsPresets.map((p) => (
            <button
              key={p.title}
              onClick={() => loadPreset(p.text)}
              className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[11px] text-white/70 transition-all hover:border-[#9ed8ff]/40 hover:bg-[#9ed8ff]/10 hover:text-white"
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Input Box */}
          <div data-blur-in className="lg:col-span-6 glass-card p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white">
                  <FileCheck2 className="h-4 w-4 text-[#9ed8ff]" />
                  Job Description / Role Requirements
                </span>
                <span className="font-mono text-[10px] text-white/30">
                  {jobText.length} Characters
                </span>
              </div>

              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste Job Description requirements here..."
                rows={9}
                className="w-full rounded-xl border border-white/10 bg-[#080a0f] p-4 font-mono text-xs text-white/90 placeholder:text-white/20 focus:border-[#9ed8ff]/40 focus:bg-[#0b0e14] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setJobText("")}
                className="font-mono text-[11px] text-white/40 hover:text-white transition-colors"
              >
                Clear input
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9ed8ff] to-[#38bdf8] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(158,216,255,0.3)] transition-all hover:scale-[1.02] hover:brightness-110 disabled:opacity-40"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-black" />
                    Scanning ATS...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-black" />
                    Analyze Match
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div data-blur-in className="lg:col-span-6 glass-card p-6">
            {result ? (
              <div className="space-y-6">
                {/* Score Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                      ATS Match Confidence
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-4xl font-bold text-[#cfae6e] drop-shadow-[0_0_12px_rgba(207,174,110,0.3)]">
                        {result.score}%
                      </span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
                        {result.grade}
                      </span>
                    </div>
                  </div>

                  <div className="w-36">
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/10 p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#cfae6e] via-[#9ed8ff] to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Matched Core Skills */}
                <div>
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff] mb-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Matched Core Competencies ({result.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 font-mono text-[10px] text-emerald-300"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Relevant Projects */}
                <div>
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff] mb-2.5">
                    <Layers className="h-3.5 w-3.5 text-[#9ed8ff]" />
                    Directly Relevant Production Projects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.relevantProjects.map((proj) => (
                      <span
                        key={proj}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/90"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bonus Competencies */}
                {result.bonusSkills.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#cfae6e] mb-2">
                      <Zap className="h-3.5 w-3.5 text-[#cfae6e]" />
                      Bonus Value-Add Competencies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.bonusSkills.map((b) => (
                        <span
                          key={b}
                          className="rounded-md border border-[#cfae6e]/20 bg-[#cfae6e]/5 px-2.5 py-0.5 font-mono text-[10px] text-[#cfae6e]"
                        >
                          + {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hiring Verdict */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs font-mono text-white/80 leading-relaxed">
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">// AI EVALUATION VERDICT:</p>
                  {result.verdict}
                </div>

                {/* CTA Action Bar */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#9ed8ff]/40 bg-[#9ed8ff]/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#9ed8ff] transition-all hover:bg-[#9ed8ff]/20 hover:shadow-[0_0_15px_rgba(158,216,255,0.2)]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Resume
                  </a>
                  <a
                    href={`mailto:${profile.email}?subject=Interview%20Invitation%20-%20Kunal%20Patel`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-all hover:bg-white/10"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Interview Kunal
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-white/40 font-mono">
                Click &quot;Analyze Match&quot; to inspect role compatibility.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
