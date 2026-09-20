"use client";

import React, { useState, useEffect } from "react";
import { Brain, Timer, CheckCircle, Lightbulb, Zap, RefreshCw } from "lucide-react";

const UX_LAWS = [
  { name: "Aesthetic-Usability Effect", desc: "Users often perceive aesthetically pleasing designs as more usable, even when they aren't." },
  { name: "Choice Overload", desc: "The tendency for people to get overwhelmed when presented with a large number of options." },
  { name: "Chunking", desc: "A process by which individual pieces of information are grouped into larger, more meaningful units." },
  { name: "Cognitive Bias", desc: "A systematic error in thinking that affects the decisions and judgments people make." },
  { name: "Cognitive Load", desc: "The amount of mental resources needed to understand and interact with an interface." },
  { name: "Doherty Threshold", desc: "Productivity soars when a computer and its users interact at a pace (<400ms) that ensures neither has to wait." },
  { name: "Fitts's Law", desc: "The time to acquire a target is a function of the distance to and width of the target." },
  { name: "Flow", desc: "The mental state in which a person is fully immersed in an activity, feeling energized focus and enjoyment." },
  { name: "Goal-Gradient Effect", desc: "The tendency to approach a goal increases with proximity to it." },
  { name: "Hick's Law", desc: "The time it takes to make a decision increases with the number and complexity of choices." },
  { name: "Jakob's Law", desc: "Users spend most of their time on other sites. They expect your site to work the same way." },
  { name: "Law of Common Region", desc: "Elements tend to be perceived into groups if they share a clearly defined boundary." },
  { name: "Law of Proximity", desc: "Objects that are near or proximate to each other tend to be grouped together." },
  { name: "Law of Prägnanz", desc: "People perceive and interpret ambiguous images as the simplest form possible." },
  { name: "Law of Similarity", desc: "Elements that visually resemble each other are perceived as more related than elements that do not." },
  { name: "Law of Uniform Connectedness", desc: "Elements connected visually are perceived as more related than elements with no connection." },
  { name: "Mental Model", desc: "A compressed model based on what people believe to know about a system based on past interactions." },
  { name: "Miller's Law", desc: "The average person can only keep 7 (plus or minus 2) items in their working memory." },
  { name: "Occam's Razor", desc: "Among competing hypotheses that predict equally well, the one with the fewest assumptions should be selected." },
  { name: "Paradox of the Active User", desc: "Users almost never invest time to learn a tool up-front, instead preferring to muddle through." },
  { name: "Pareto Principle", desc: "For many outcomes, roughly 80% of consequences come from 20% of causes." },
  { name: "Parkinson's Law", desc: "Any task will inflate its apparent importance and complexity in relation to the time allotted for its completion." },
  { name: "Peak-End Rule", desc: "People judge an experience largely based on how they felt at its peak and at its end." },
  { name: "Postel's Law", desc: "Be liberal in what you accept, and conservative in what you send." },
  { name: "Selective Attention", desc: "The process of focusing attention selectively on parts of the environment while ignoring others." },
  { name: "Serial Position Effect", desc: "Users have a propensity to best remember the first and last items in a series." },
  { name: "Tesler's Law", desc: "For any system there is a certain amount of complexity which cannot be reduced, only moved." },
  { name: "Von Restorff Effect", desc: "When multiple similar objects are present, the one that differs from the rest is most likely to be remembered." },
  { name: "Working Memory", desc: "The cognitive system responsible for temporary holding and processing information for complex tasks." },
  { name: "Zeigarnik Effect", desc: "People remember uncompleted or interrupted tasks better than completed tasks." }
];

export function LawsOfUXBench() {
  const [activeTab, setActiveTab] = useState<"fitts" | "hick" | "miller" | "catalog">("fitts");
  const [catalogSearch, setCatalogSearch] = useState("");

  // Fitts Bench State
  const [fittsTarget, setFittsTarget] = useState({ size: 40, x: 200, y: 150 });
  const [fittsStartTime, setFittsStartTime] = useState(0);
  const [fittsScore, setFittsScore] = useState<number | null>(null);
  const [fittsRunning, setFittsRunning] = useState(false);

  // Hick's Bench State
  const [choiceCount, setChoiceCount] = useState(4);
  const [targetChoice, setTargetChoice] = useState<number | null>(null);
  const [hickStartTime, setHickStartTime] = useState(0);
  const [hickScore, setHickScore] = useState<number | null>(null);

  const startFitts = () => {
    const size = Math.floor(Math.random() * 50) + 25;
    const x = Math.floor(Math.random() * 300) + 50;
    const y = Math.floor(Math.random() * 150) + 50;
    setFittsTarget({ size, x, y });
    setFittsStartTime(Date.now());
    setFittsRunning(true);
  };

  const hitFittsTarget = () => {
    if (fittsRunning) {
      const elapsed = Date.now() - fittsStartTime;
      setFittsScore(elapsed);
      setFittsRunning(false);
    }
  };

  const startHick = () => {
    const pick = Math.floor(Math.random() * choiceCount);
    setTargetChoice(pick);
    setHickStartTime(Date.now());
    setHickScore(null);
  };

  const chooseHick = (idx: number) => {
    if (targetChoice !== null) {
      if (idx === targetChoice) {
        setHickScore(Date.now() - hickStartTime);
        setTargetChoice(null);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Brain className="w-4 h-4" /> Cognitive Psychology & UI Principles
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Laws of UX Interactive Laboratory
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Experience behavioral science in action with live interactive test benches for Fitts's Law, Hick's Law, and Miller's 7±2 Rule.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-6">
        {[
          { id: "fitts", label: "Fitts's Law Bench" },
          { id: "hick", label: "Hick's Law Choice Simulator" },
          { id: "miller", label: "Miller's 7±2 Memory Test" },
          { id: "catalog", label: "30 Laws Compendium" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "fitts" && (
        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-bold text-white">Fitts's Law Stopwatch Test</h4>
              <p className="text-xs text-slate-400">Target acquisition time = f(Distance, Width). Smaller or farther buttons take longer.</p>
            </div>
            <button
              onClick={startFitts}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5" /> Spawn Target
            </button>
          </div>

          <div className="relative w-full h-64 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
            {fittsRunning ? (
              <button
                onClick={hitFittsTarget}
                style={{
                  position: "absolute",
                  left: `${fittsTarget.x}px`,
                  top: `${fittsTarget.y}px`,
                  width: `${fittsTarget.size}px`,
                  height: `${fittsTarget.size}px`
                }}
                className="rounded-full bg-purple-500 hover:bg-purple-400 border-2 border-white shadow-lg shadow-purple-500/50 cursor-crosshair animate-pulse"
              />
            ) : (
              <div className="text-center text-slate-500 text-xs">
                {fittsScore ? (
                  <div className="space-y-1">
                    <span className="text-2xl font-mono font-bold text-purple-400">{fittsScore} ms</span>
                    <p className="text-slate-300">Target Acquired! Spawn another to test varying sizes.</p>
                  </div>
                ) : (
                  "Click 'Spawn Target' to measure reaction time."
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "hick" && (
        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-bold text-white">Hick's Law Choice Simulator</h4>
              <p className="text-xs text-slate-400">Decision time T = b · log2(n+1). More choices exponentially slow decision speed.</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-slate-400">Choices:</span>
              {[2, 4, 8, 12].map((num) => (
                <button
                  key={num}
                  onClick={() => { setChoiceCount(num); setTargetChoice(null); setHickScore(null); }}
                  className={`px-2.5 py-1 text-xs rounded font-mono ${choiceCount === num ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400"}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-4">
            <button
              onClick={startHick}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg inline-flex items-center gap-2"
            >
              <Timer className="w-3.5 h-3.5" /> Start Test (Target: Choice #{targetChoice !== null ? targetChoice + 1 : "?"})
            </button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
              {Array.from({ length: choiceCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => chooseHick(idx)}
                  className={`py-3 px-4 rounded-lg font-mono text-sm font-bold border transition ${
                    targetChoice === idx
                      ? "border-purple-500 bg-purple-500/20 text-purple-300 animate-bounce"
                      : "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  Option {idx + 1}
                </button>
              ))}
            </div>

            {hickScore !== null && (
              <div className="text-sm font-mono text-emerald-400 font-bold">
                Decision Latency: {hickScore} ms for {choiceCount} options
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "miller" && (
        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-xl text-center space-y-4">
          <h4 className="text-lg font-bold text-white">Miller's 7±2 Digit Span Bench</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Working memory capacity caps at 7 chunks of information. Clean UI hierarchy groups information into digestible clusters.</p>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl inline-block font-mono text-xl tracking-widest text-purple-400">
            4 · 8 · 1 · 9 · 2 · 7 · 5
          </div>
          <p className="text-xs text-slate-500">Notice how grouping digits into 3-digit chunks improves recall retention by 40%.</p>
        </div>
      )}

      {activeTab === "catalog" && (
        <div className="space-y-4">
          <input
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            placeholder={`Search all ${UX_LAWS.length} laws...`}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UX_LAWS.filter(
              (law) =>
                law.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                law.desc.toLowerCase().includes(catalogSearch.toLowerCase())
            ).map((law, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Lightbulb className="w-4 h-4" /> {law.name}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{law.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
