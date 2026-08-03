"use client";
import React, { useState, useEffect } from "react";
import { Shield, Key, Menu, X, Rocket, Cpu, Lock } from "lucide-react";

export function Navbar() {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [groqKey, setGroqKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setGroqKey(localStorage.getItem("user_groq_key") || "");
    setGeminiKey(localStorage.getItem("user_gemini_key") || "");
    setOpenaiKey(localStorage.getItem("user_openai_key") || "");
  }, []);

  const saveKeys = () => {
    localStorage.setItem("user_groq_key", groqKey);
    localStorage.setItem("user_gemini_key", geminiKey);
    localStorage.setItem("user_openai_key", openaiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[68px] z-[100] flex items-center justify-between px-6 md:px-12 backdrop-blur-md bg-[#070507]/80 border-b border-[#ef4444]/15">
        <a href="/rakshak-ai/" className="flex items-center gap-3 font-extrabold text-[17px] tracking-tight">
          <span className="w-[38px] h-[38px] rounded-[11px] grid place-items-center text-white bg-gradient-to-br from-[#ef4444] to-[#dc2626] shadow-[0_4px_16px_rgba(239,68,68,0.35)]">
            <Shield className="h-5 w-5 text-white" />
          </span>
          <span className="text-white">
            Rakshak <span className="text-[#fca5a5]">AI</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm text-[#d4c5c8]">
          <a href="#workstations" className="hover:text-white transition-colors">Vision Suite</a>
          <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#160f14] border border-[#ef4444]/30 text-[#fca5a5] hover:bg-[#ef4444]/10 transition-all cursor-pointer"
          >
            <Key className="h-3.5 w-3.5 text-[#ef4444]" />
            <span>BYOK Keys</span>
          </button>

          <a
            href="/rakshak-ai/app/"
            className="btn-primary text-xs md:text-sm py-2 px-4 flex items-center gap-2"
          >
            <Rocket className="h-4 w-4" />
            <span>Launch Suite</span>
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white bg-[#160f14] rounded-lg border border-white/10"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* BYOK Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e0a0d] border border-[#ef4444]/30 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-[#7e6f73] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ef4444]/15 grid place-items-center text-[#ef4444]">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Bring Your Own Key (BYOK)</h3>
                <p className="text-xs text-[#7e6f73]">Keys are stored locally in your browser only.</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <label className="block text-xs font-mono text-[#d4c5c8] mb-1">Groq API Key</label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-[#160f14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#ef4444] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#d4c5c8] mb-1">Google Gemini Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#160f14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#ef4444] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#d4c5c8] mb-1">OpenAI Key</label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-[#160f14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#ef4444] outline-none"
                />
              </div>
            </div>

            {saved && (
              <div className="p-2 mb-3 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono text-center">
                ✓ Keys saved successfully!
              </div>
            )}

            <button
              onClick={saveKeys}
              className="w-full btn-primary py-2.5 text-xs font-bold"
            >
              Save Keys Local & Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
