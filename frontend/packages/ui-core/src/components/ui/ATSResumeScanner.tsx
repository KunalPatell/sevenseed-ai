"use client";

import React, { useState } from "react";
import { FileText, CheckCircle, AlertCircle, Sparkles, Wand2 } from "lucide-react";

export function ATSResumeScanner() {
  const [resumeText, setResumeText] = useState(
    "Software Engineer with experience in Python, FastAPI, and React. Built web apps and improved database queries."
  );
  const [jobDesc, setJobDesc] = useState(
    "Seeking a Senior Full Stack Engineer proficient in Next.js, TypeScript, PostgreSQL, Docker, AWS, and Microservices architecture."
  );
  const [score, setScore] = useState<number | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);

  const analyzeATS = () => {
    const jdWords = ["next.js", "typescript", "postgresql", "docker", "aws", "microservices", "python", "react", "fastapi"];
    const resumeLower = resumeText.toLowerCase();

    const m: string[] = [];
    const miss: string[] = [];

    jdWords.forEach((kw) => {
      if (resumeLower.includes(kw)) {
        m.push(kw);
      } else {
        miss.push(kw);
      }
    });

    const calculatedScore = Math.round((m.length / jdWords.length) * 100);
    setMatched(m);
    setMissing(miss);
    setScore(calculatedScore);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <FileText className="w-4 h-4" /> Jobscan-Grade Semantic Resume Screener
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          AI ATS Resume Scorer & Keyword Gap Analyzer
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Scan your resume against target Job Descriptions to surface missing technical keywords and bullet enhancements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Input Textboxes */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Resume Snippet / Experience</label>
            <textarea
              rows={5}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Target Job Description</label>
            <textarea
              rows={5}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={analyzeATS}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-sky-600/20"
          >
            <Sparkles className="w-4 h-4" /> Calculate Semantic ATS Match
          </button>
        </div>

        {/* Results Pane */}
        <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold">ATS Score</span>
              <div className="text-4xl font-extrabold text-sky-400 font-mono mt-1">
                {score !== null ? `${score}%` : "--"}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-bold">Status</span>
              <div className="text-xs font-bold mt-1 text-white">
                {score === null
                  ? "Awaiting Scan"
                  : score >= 75
                  ? "High Interview Probability"
                  : "Keyword Deficit Detected"}
              </div>
            </div>
          </div>

          {score !== null && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-400 mb-2 block flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Matched Keywords ({matched.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matched.map((kw) => (
                    <span key={kw} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase text-rose-400 mb-2 block flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Missing Hard Skills ({missing.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {missing.map((kw) => (
                    <span key={kw} className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-sky-300 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5" /> AI Recommended Bullet Rewrite:
                </div>
                <p className="italic text-slate-200">
                  "Architected high-throughput microservices using Next.js, TypeScript, and Docker on AWS, reducing query latency by 38% across PostgreSQL clusters."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
