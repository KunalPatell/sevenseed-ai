"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, ShieldCheck, Sparkles, X, Check, ExternalLink, Info } from "lucide-react";
import { getStoredApiKeys, setStoredApiKeys, UserApiKeys } from "../../lib/api";

interface APIKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APIKeyManager({ isOpen, onClose }: APIKeyManagerProps) {
  const [keys, setKeys] = useState<UserApiKeys>({ groqKey: "", geminiKey: "", openaiKey: "" });
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeys(getStoredApiKeys());
      setSavedStatus(false);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKeys(keys);
    setSavedStatus(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("byok-updated", { detail: keys }));
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const hasAnyKey = Boolean(keys.groqKey.trim() || keys.geminiKey.trim() || keys.openaiKey.trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#080a0f] p-6 shadow-[0_0_30px_rgba(158,216,255,0.1)]"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#9ed8ff]/10 text-[#9ed8ff] border border-[#9ed8ff]/20">
                <Key className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-mono text-base font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  Self API & Token Manager
                  {hasAnyKey && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" /> BYOK Active
                    </span>
                  )}
                </h3>
                <p className="text-xs text-white/50">Plug in your custom API keys for 100% free, un-throttled AI access across all 7 software.</p>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs text-blue-300 flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
              <p className="leading-relaxed">
                All 7 ventures (Sevenseed, Comonk, Sevenforce, AVPU, Decode Forest, Breakdown Factor, AVP Trust, AVP Emart) are completely free. Your API keys are stored <strong>strictly in your browser&apos;s localStorage</strong> and sent directly in HTTP headers to run models.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="flex items-center justify-between text-xs font-mono text-white/80 mb-1.5">
                  <span>Groq API Key (Recommended for high speed)</span>
                  <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-[10px] text-[#9ed8ff] hover:underline flex items-center gap-1">
                    Get Free Key <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  value={keys.groqKey}
                  onChange={(e) => setKeys({ ...keys, groqKey: e.target.value })}
                  placeholder="gsk_..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder-white/20 focus:border-[#9ed8ff]/50 focus:bg-white/[0.06] focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-mono text-white/80 mb-1.5">
                  <span>Google Gemini API Key</span>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-[#9ed8ff] hover:underline flex items-center gap-1">
                    Get Free Key <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  value={keys.geminiKey}
                  onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder-white/20 focus:border-[#9ed8ff]/50 focus:bg-white/[0.06] focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-mono text-white/80 mb-1.5">
                  <span>OpenAI API Key (Optional)</span>
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-[10px] text-[#9ed8ff] hover:underline flex items-center gap-1">
                    Get Key <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  value={keys.openaiKey}
                  onChange={(e) => setKeys({ ...keys, openaiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder-white/20 focus:border-[#9ed8ff]/50 focus:bg-white/[0.06] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedStatus ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <Check className="h-4 w-4" /> Keys saved to browser storage!
                  </span>
                ) : (
                  <span className="text-[10px] text-white/40 font-mono">Keys never leave your browser environment.</span>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-mono text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#9ed8ff] to-[#6366f1] px-5 py-2 font-mono text-xs font-semibold text-black shadow-[0_0_15px_rgba(158,216,255,0.3)] hover:opacity-90 transition-all"
                  >
                    Save Keys
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
