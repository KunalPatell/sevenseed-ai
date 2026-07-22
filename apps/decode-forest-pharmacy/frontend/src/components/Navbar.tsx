"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Activity } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 h-[66px] z-[100] flex items-center justify-between px-6 md:px-12 backdrop-blur-md transition-all duration-300 border-b border-transparent ${
      scrolled ? "bg-[#08080e]/90 border-white/5" : "bg-transparent"
    }`}>
      <Link href="/" className="flex items-center gap-3 font-extrabold text-[17px] tracking-tight">
        <span className="w-[36px] h-[36px] rounded-[11px] grid place-items-center text-white bg-gradient-to-br from-[#10b981] to-[#14b8a6] shadow-[0_6px_16px_rgba(16,185,129,0.3)]">
          <Activity className="h-[18px] w-[18px]" />
        </span>
        <span className="text-white whitespace-nowrap">Decode Forest <span className="text-[#6ee7b7]">Pharmacy</span></span>
      </Link>

      <div className={`absolute top-[66px] left-0 right-0 bg-[#0d0d16] backdrop-blur-xl shadow-2xl border-b border-white/5 p-6 flex flex-col gap-4 md:static md:flex md:flex-row md:bg-transparent md:border-none md:p-0 md:gap-1 transition-all duration-300 ${
        menuOpen ? "block" : "hidden md:flex"
      }`}>
        <a href="#about" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#9aa0b8] hover:text-[#eeeef8] hover:bg-white/[0.04] rounded-lg transition-all duration-200">About</a>
        <a href="#services" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#9aa0b8] hover:text-[#eeeef8] hover:bg-white/[0.04] rounded-lg transition-all duration-200">AI Tools</a>
        <a href="#process" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#9aa0b8] hover:text-[#eeeef8] hover:bg-white/[0.04] rounded-lg transition-all duration-200">Process</a>
        <a href="#testimonials" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#9aa0b8] hover:text-[#eeeef8] hover:bg-white/[0.04] rounded-lg transition-all duration-200">Reviews</a>
        <a href="#faq" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#9aa0b8] hover:text-[#eeeef8] hover:bg-white/[0.04] rounded-lg transition-all duration-200">FAQ</a>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#9aa0b8] hover:text-[#eeeef8] hover:bg-white/[0.04] rounded-lg transition-all duration-200">Contact</a>
        <Link href="/app/" onClick={() => setMenuOpen(false)} className="md:hidden px-4 py-2 text-sm font-semibold text-white bg-white/[0.06] border border-white/10 rounded-lg text-center">AI Portal</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/app/" className="hidden md:inline-flex btn bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:scale-[1.02] text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-[0_6px_18px_rgba(16,185,129,0.25)]">
          <i className="fas fa-file-prescription mr-1.5"></i> AI Portal
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-[40px] h-[40px] rounded-lg bg-[#12121e] border border-white/10 flex items-center justify-center text-white cursor-pointer" aria-label="Toggle menu">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </nav>
  );
}
