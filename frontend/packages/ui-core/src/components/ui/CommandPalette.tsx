"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Download,
  Terminal as TerminalIcon,
  Key,
  Bot,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  Briefcase,
  Code2,
} from "lucide-react";
import { projects, profile, navLinks } from "../../lib/data";
import { sound } from "../../lib/sound";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
  onOpenByok: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenTerminal,
  onOpenByok,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [soundActive, setSoundActive] = useState(sound.isEnabled());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSelectedIndex(0);
      sound.playScan();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSoundToggled = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setSoundActive(custom.detail !== undefined ? custom.detail : sound.isEnabled());
    };
    window.addEventListener("sound-toggled", handleSoundToggled);
    return () => window.removeEventListener("sound-toggled", handleSoundToggled);
  }, []);

  const toggleSound = () => {
    const newState = sound.toggle();
    setSoundActive(newState);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const items = [
    // Quick Actions
    {
      id: "action-resume",
      title: "Download Executive ATS Resume (PDF)",
      category: "Quick Action",
      icon: Download,
      action: () => {
        window.open(profile.resumeUrl, "_blank");
        onClose();
      },
    },
    {
      id: "action-terminal",
      title: "Launch Interactive Developer CLI Terminal",
      category: "Quick Action",
      icon: TerminalIcon,
      action: () => {
        onClose();
        onOpenTerminal();
      },
    },
    {
      id: "action-byok",
      title: "Configure Bring-Your-Own-Key (BYOK) APIs",
      category: "Quick Action",
      icon: Key,
      action: () => {
        onClose();
        onOpenByok();
      },
    },
    {
      id: "action-audio",
      title: soundActive ? "Mute Cyber Audio Feedback" : "Enable Cyber Audio Feedback",
      category: "Quick Action",
      icon: soundActive ? VolumeX : Volume2,
      action: () => {
        toggleSound();
      },
    },
    {
      id: "action-copy-email",
      title: copied ? "Copied Email Address!" : `Copy Email (${profile.email})`,
      category: "Quick Action",
      icon: copied ? Check : Copy,
      action: () => {
        copyEmail();
      },
    },
    // Navigation
    ...navLinks.map((link) => ({
      id: `nav-${link.label}`,
      title: `Jump to ${link.label} section`,
      category: "Navigation",
      icon: ArrowRight,
      action: () => {
        onClose();
        const el = document.querySelector(link.href);
        el?.scrollIntoView({ behavior: "smooth" });
      },
    })),
    // Projects
    ...projects.map((p) => ({
      id: `project-${p.id}`,
      title: `${p.title} — ${p.category}`,
      category: "Featured Project",
      icon: Layers,
      action: () => {
        onClose();
        if (p.liveUrl) {
          window.open(p.liveUrl, "_blank");
        } else {
          const el = document.querySelector("#projects");
          el?.scrollIntoView({ behavior: "smooth" });
        }
      },
    })),
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
        sound.playHover();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
        sound.playHover();
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        sound.playClick();
        filtered[selectedIndex].action();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#080a0f] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 font-mono"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-[#0d111a] px-4 py-3.5">
              <Search className="h-4 w-4 text-[#9ed8ff]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search commands, projects, skills, or navigation..."
                className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/30 focus:outline-none"
              />
              <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] font-mono text-white/40">
                ESC to close
              </span>
            </div>

            {/* Command Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">
                  No matching commands found.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        sound.playClick();
                        item.action();
                      }}
                      onMouseEnter={() => {
                        setSelectedIndex(idx);
                        sound.playHover();
                      }}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-[#9ed8ff]/15 border border-[#9ed8ff]/30 text-white shadow-[0_0_15px_rgba(158,216,255,0.1)]"
                          : "border border-transparent text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-lg border text-xs ${
                            isSelected
                              ? "border-[#9ed8ff]/50 bg-[#9ed8ff]/20 text-[#9ed8ff]"
                              : "border-white/10 bg-white/5 text-white/50"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="truncate text-xs tracking-wide">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest shrink-0 ml-2">
                        {item.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer status bar */}
            <div className="flex items-center justify-between border-t border-white/5 bg-[#06080d] px-4 py-2 text-[10px] text-white/40">
              <div className="flex items-center gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
              <span className="text-[#9ed8ff]/70">Kunal Patel AI Portfolio Core</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
