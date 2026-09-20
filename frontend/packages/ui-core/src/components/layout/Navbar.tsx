"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  Terminal as TerminalIcon,
  Key,
  Command,
  Volume2,
  VolumeX,
} from "lucide-react";
import { navLinks, profile } from "../../lib/data";
import { cn } from "../../lib/utils";
import { TerminalModal, APIKeyManager, CommandPalette } from "../ui";
import { sound } from "../../lib/sound";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [byokOpen, setByokOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    setSoundEnabled(sound.isEnabled());

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleSoundToggled = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setSoundEnabled(custom.detail !== undefined ? custom.detail : sound.isEnabled());
    };
    window.addEventListener("sound-toggled", handleSoundToggled);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("sound-toggled", handleSoundToggled);
    };
  }, []);

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-white/5 bg-[#050505]/85 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <nav className="container-px flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#home"
            className="group flex items-center gap-2.5 font-mono text-sm font-bold shrink-0"
            onClick={() => sound.playClick()}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#9ed8ff]/30 bg-[#9ed8ff]/15 text-[#9ed8ff] font-mono text-xs shadow-[0_0_10px_rgba(158,216,255,0.2)]">
              KP
            </span>
            <span className="hidden text-white/90 sm:block tracking-wider">
              {profile.name}
            </span>
          </a>

          {/* Navigation Links */}
          <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => sound.playHover()}
                  className="rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-white/70 transition-all duration-200 hover:bg-[#9ed8ff]/10 hover:text-[#9ed8ff]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Interactive Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Command Palette Button */}
            <button
              onClick={() => {
                sound.playClick();
                setCmdOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-white/70 hover:border-[#9ed8ff]/40 hover:text-white transition-all"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="h-3.5 w-3.5 text-[#9ed8ff]" />
              <span className="text-[11px]">Ctrl+K</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:border-[#9ed8ff]/40 hover:text-white transition-all"
              title={soundEnabled ? "Mute Cyber Audio Feedback" : "Enable Cyber Audio Feedback"}
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-white/40" />
              )}
            </button>

            {/* BYOK Key Manager */}
            <button
              onClick={() => {
                sound.playClick();
                setByokOpen(true);
              }}
              className="grid h-8 w-8 place-items-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/50 transition-all"
              title="Add personal API keys (Groq, Gemini, OpenAI) for zero-cost un-throttled AI access"
            >
              <Key className="h-3.5 w-3.5 text-violet-400" />
            </button>

            {/* Terminal CLI */}
            <button
              onClick={() => {
                sound.playClick();
                setTerminalOpen(true);
              }}
              className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
              title="Open Developer Terminal CLI"
            >
              <TerminalIcon className="h-3.5 w-3.5" />
            </button>

            {/* Ask AI */}
            <a
              href="#ask-ai"
              onClick={() => sound.playClick()}
              className="rounded-lg border border-[#9ed8ff]/30 bg-[#9ed8ff]/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#9ed8ff] hover:bg-[#9ed8ff]/20 hover:border-[#9ed8ff]/50 transition-all shadow-[0_0_10px_rgba(158,216,255,0.15)] flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#9ed8ff] animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle menu"
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white lg:hidden"
              onClick={() => {
                sound.playClick();
                setOpen((v) => !v);
              }}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl lg:hidden"
            >
              <ul className="container-px flex flex-col py-4 space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => {
                        sound.playClick();
                        setOpen(false);
                      }}
                      className="block rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-white/80 hover:bg-[#9ed8ff]/10 hover:text-[#9ed8ff]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <CommandPalette
          isOpen={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenByok={() => setByokOpen(true)}
        />
        <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
        <APIKeyManager isOpen={byokOpen} onClose={() => setByokOpen(false)} />
      </header>
    </>
  );
}
