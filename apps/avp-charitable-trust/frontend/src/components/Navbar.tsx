"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";

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
      scrolled ? "bg-[#0a0507]/90 border-white/5" : "bg-transparent"
    }`}>
      <Link href="/" className="flex items-center gap-3 font-extrabold text-[17px] tracking-tight">
        <span className="w-[36px] h-[36px] rounded-[11px] grid place-items-center text-white bg-gradient-to-br from-[#f43f5e] to-[#f59e0b] shadow-[0_6px_16px_rgba(244,63,94,0.3)]">
          <Heart className="h-[18px] w-[18px] fill-current" />
        </span>
        <span className="text-white">AVP<span className="text-[#f43f5e]">Trust</span></span>
      </Link>

      <div className={`absolute top-[66px] left-0 right-0 bg-[#10080a]/95 border-b border-white/5 p-6 flex flex-col gap-4 md:static md:flex md:flex-row md:bg-transparent md:border-none md:p-0 md:gap-1 transition-all duration-300 ${
        menuOpen ? "block" : "hidden md:flex"
      }`}>
        <a href="#about" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#c8bdc0] hover:text-[#faf5f6] hover:bg-white/[0.04] rounded-lg transition-all duration-200">About</a>
        <a href="#programs" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#c8bdc0] hover:text-[#faf5f6] hover:bg-white/[0.04] rounded-lg transition-all duration-200">Our Programs</a>
        <a href="#impact" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#c8bdc0] hover:text-[#faf5f6] hover:bg-white/[0.04] rounded-lg transition-all duration-200">Our Impact</a>
        <a href="#faq" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#c8bdc0] hover:text-[#faf5f6] hover:bg-white/[0.04] rounded-lg transition-all duration-200">FAQ</a>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm text-[#c8bdc0] hover:text-[#faf5f6] hover:bg-white/[0.04] rounded-lg transition-all duration-200">Contact</a>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/app/" className="btn bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] hover:scale-[1.02] text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-[0_6px_18px_rgba(244,63,94,0.25)]">
          <i className="fas fa-heart mr-1.5"></i> NGO Portal
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-[40px] h-[40px] rounded-lg bg-[#180b0f] border border-white/10 flex items-center justify-center text-white cursor-pointer" aria-label="Toggle menu">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </nav>
  );
}
