"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from "lucide-react";
import { profile, experiences, projects, skillGroups } from "../../lib/data";

type OutputLine = {
  text: string;
  type?: "input" | "system" | "success" | "warning" | "highlight";
};

export function TerminalModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<OutputLine[]>([
    { text: "Kunal Patel Developer Terminal [Version 1.0.0]", type: "system" },
    { text: "Type 'help' to view all available commands.", type: "highlight" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  function handleCommand(cmdString: string) {
    const cmd = cmdString.trim().toLowerCase();
    if (!cmd) return;

    const newHistory: OutputLine[] = [...history, { text: `kunal-patel:~ $ ${cmdString}`, type: "input" }];

    switch (cmd) {
      case "help":
        newHistory.push(
          { text: "Available Commands:", type: "highlight" },
          { text: "  about       - Brief bio & summary" },
          { text: "  skills      - Full technical toolkit & proficiency" },
          { text: "  exp         - Career work experience timeline" },
          { text: "  projects    - Top AI & Automation projects" },
          { text: "  resume      - Open/Download V7 PDF resume" },
          { text: "  contact     - Contact information" },
          { text: "  clear       - Clear terminal screen" },
          { text: "  exit        - Close terminal" }
        );
        break;

      case "about":
        newHistory.push(
          { text: `${profile.name} - ${profile.title}`, type: "highlight" },
          { text: profile.subtitle }
        );
        break;

      case "skills":
        newHistory.push({ text: "=== Technical Stack ===", type: "highlight" });
        skillGroups.forEach((g) => {
          newHistory.push({ text: `[${g.category}]`, type: "system" });
          g.skills.forEach((s) => {
            newHistory.push({ text: `  • ${s.name} (${s.level}%) - Exp: ${s.experience}` });
          });
        });
        break;

      case "exp":
      case "experience":
        newHistory.push({ text: "=== Work Experience ===", type: "highlight" });
        experiences.forEach((e) => {
          newHistory.push(
            { text: `▶ ${e.role} @ ${e.company}`, type: "success" },
            { text: `  ${e.highlights.join(" | ")}` }
          );
        });
        break;

      case "projects":
        newHistory.push({ text: "=== Featured Projects ===", type: "highlight" });
        projects.forEach((p) => {
          newHistory.push({
            text: `★ ${p.title} [${p.category}] - ${p.description}`,
            type: "success",
          });
        });
        break;

      case "resume":
        newHistory.push({ text: "Opening V7 PDF resume...", type: "success" });
        window.open("/resume.pdf", "_blank");
        break;

      case "contact":
        newHistory.push(
          { text: `Email: ${profile.email}`, type: "success" },
          { text: `Phone: ${profile.phone}` },
          { text: `GitHub: ${profile.socials.github}` },
          { text: `LinkedIn: ${profile.socials.linkedin}` }
        );
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "exit":
        onClose();
        return;

      default:
        newHistory.push({
          text: `Command not recognized: '${cmd}'. Type 'help' for options.`,
          type: "warning",
        });
        break;
    }

    setHistory(newHistory);
    setInput("");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl rounded-xl border border-white/15 bg-[#080a0f] shadow-2xl z-10 overflow-hidden font-mono text-xs"
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0d111a] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <TerminalIcon className="h-3.5 w-3.5 text-[#9ed8ff]" />
                  kunal-patel-cli v1.0
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Terminal Screen Output */}
            <div className="h-96 overflow-y-auto p-4 space-y-2 bg-[#05070c]/90 scrollbar-thin">
              {history.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    line.type === "input"
                      ? "text-white font-semibold"
                      : line.type === "system"
                      ? "text-[#9ed8ff]"
                      : line.type === "highlight"
                      ? "text-[#cfae6e]"
                      : line.type === "success"
                      ? "text-emerald-400"
                      : line.type === "warning"
                      ? "text-amber-400"
                      : "text-white/70"
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Terminal Input Line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommand(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-[#0d111a] px-4 py-3"
            >
              <span className="text-emerald-400 font-bold">kunal-patel:~ $</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type 'help'..."
                className="flex-1 bg-transparent text-white outline-none font-mono text-xs placeholder:text-white/30"
              />
              <button
                type="submit"
                className="text-white/40 hover:text-[#9ed8ff] transition-colors"
              >
                <CornerDownLeft className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
