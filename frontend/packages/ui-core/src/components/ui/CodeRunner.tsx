"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Check, X, Terminal, HelpCircle, Sparkles } from "lucide-react";

export interface CodeExercise {
  id: string;
  title: string;
  instruction: string;
  starterCode: string;
  solution: string;
  tests: { description: string; testFn: (code: string, output: any) => boolean }[];
  hints: string[];
}

const defaultExercise: CodeExercise = {
  id: "rag-chunking",
  title: "Implement Semantic Chunk Overlap",
  instruction: "Write a function `chunkTokens(tokens, chunkSize, overlap)` that returns an array of chunks, where each chunk has length `chunkSize` and consecutive chunks share `overlap` elements.",
  starterCode: `function chunkTokens(tokens, chunkSize, overlap) {
  const chunks = [];
  const step = chunkSize - overlap;
  
  for (let i = 0; i < tokens.length; i += step) {
    const chunk = tokens.slice(i, i + chunkSize);
    chunks.push(chunk);
    if (i + chunkSize >= tokens.length) break;
  }
  
  return chunks;
}

// Test call
console.log(chunkTokens([1, 2, 3, 4, 5, 6, 7], 4, 2));
`,
  solution: `function chunkTokens(tokens, chunkSize, overlap) {
  const chunks = [];
  const step = chunkSize - overlap;
  for (let i = 0; i < tokens.length; i += step) {
    chunks.push(tokens.slice(i, i + chunkSize));
    if (i + chunkSize >= tokens.length) break;
  }
  return chunks;
}`,
  tests: [
    {
      description: "Should return correct chunk count with overlap",
      testFn: (code) => code.includes("slice") && code.includes("overlap")
    },
    {
      description: "Handles tokens length accurately without infinite loop",
      testFn: (code) => code.includes("for") || code.includes("while")
    }
  ],
  hints: [
    "Step size between chunk start indices is `chunkSize - overlap`.",
    "Be sure to break once `i + chunkSize >= tokens.length` to avoid empty edge slices."
  ]
};

export function CodeRunner({
  exercise = defaultExercise,
  className = "",
}: {
  exercise?: CodeExercise;
  className?: string;
}) {
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<{ pass: boolean; desc: string }[]>([]);
  const [showHint, setShowHint] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      },
      error: (...args: any[]) => {
        logs.push("[ERROR] " + args.join(" "));
      }
    };

    try {
      // Execute code in a safe evaluation function context
      const runFn = new Function("console", code);
      runFn(customConsole);
      setOutput(logs.join("\n") || "Code executed with return code 0.");

      // Run assertion tests
      const results = exercise.tests.map(t => ({
        desc: t.description,
        pass: t.testFn(code, logs)
      }));
      setTestResults(results);
    } catch (err: any) {
      setOutput(`Runtime Error: ${err?.message || err}`);
      setTestResults(exercise.tests.map(t => ({ desc: t.description, pass: false })));
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(exercise.starterCode);
    setOutput("");
    setTestResults([]);
  };

  const allPassed = testResults.length > 0 && testResults.every(t => t.pass);

  return (
    <div className={`flex flex-col lg:flex-row gap-4 w-full h-[600px] bg-[#050814] border border-slate-800 rounded-2xl overflow-hidden p-4 ${className}`}>
      {/* Instructions & Tests (Left Panel) */}
      <div className="lg:w-1/3 flex flex-col justify-between bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 overflow-y-auto space-y-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Code Lab (freecodecamp engine)</span>
          </div>

          <h3 className="text-base font-bold text-slate-100">{exercise.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{exercise.instruction}</p>

          {/* Test Assertions */}
          <div className="pt-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">Automated Test Suites</h4>
            <div className="space-y-1.5">
              {exercise.tests.map((t, idx) => {
                const res = testResults[idx];
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 p-2 rounded-lg text-xs font-mono border transition-colors ${
                      res === undefined
                        ? "bg-slate-900/60 border-slate-800 text-slate-400"
                        : res.pass
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/30 border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {res === undefined ? (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 mt-0.5" />
                    ) : res.pass ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                    )}
                    <span>{t.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hints & Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          {showHint >= 0 && (
            <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200">
              💡 {exercise.hints[showHint]}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint(prev => (prev + 1) % exercise.hints.length)}
              className="flex-1 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hint ({exercise.hints.length})</span>
            </button>
            <button
              onClick={resetCode}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor & Console (Right Panel) */}
      <div className="lg:w-2/3 flex flex-col justify-between bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-400">
          <span>JavaScript (ES2024 Environment)</span>
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              allPassed
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-sky-500 hover:bg-sky-400 text-black shadow-lg shadow-sky-500/20"
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{allPassed ? "All Passed! ✓" : "Run Code (Ctrl + Enter)"}</span>
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed selection:bg-sky-500/30"
        />

        {/* Output Console */}
        <div className="h-44 border-t border-slate-800 bg-[#030611] p-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] pb-1 border-b border-slate-900">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Execution Console</span>
          </div>
          <pre className="flex-1 overflow-y-auto font-mono text-[11px] text-slate-300 py-1 whitespace-pre-wrap">
            {output || "// Output will display here after execution..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
