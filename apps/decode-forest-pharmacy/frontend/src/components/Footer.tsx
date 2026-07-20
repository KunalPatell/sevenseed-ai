"use client";

import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#050508] py-16 px-6 md:px-12 mt-20">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-[17px] tracking-tight">
            <span className="w-[36px] h-[36px] rounded-[11px] grid place-items-center text-white bg-gradient-to-br from-[#10b981] to-[#14b8a6] shadow-[0_6px_16px_rgba(16,185,129,0.3)]">
              <Activity className="h-[18px] w-[18px]" />
            </span>
            <span className="text-white">Decode Forest <span className="text-[#6ee7b7]">Pharmacy</span></span>
          </Link>
          <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed">
            A modern pharmacy where AI reads prescriptions, checks drug interactions, and recommends affordable alternatives — with intelligent, on-time doorstep delivery you can trust.
          </p>
          <div className="flex gap-4 text-[#9aa0b8]">
            <a href="#" className="hover:text-[#6ee7b7] transition-all"><i className="fab fa-linkedin-in text-lg"></i></a>
            <a href="#" className="hover:text-[#6ee7b7] transition-all"><i className="fab fa-instagram text-lg"></i></a>
            <a href="#" className="hover:text-[#6ee7b7] transition-all"><i className="fab fa-facebook-f text-lg"></i></a>
            <a href="mailto:care@decodeforest.in" className="hover:text-[#6ee7b7] transition-all"><i className="fas fa-envelope text-lg"></i></a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Explore</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#9aa0b8]">
            <li><a href="#about" className="hover:text-[#eeeef8] transition-all">About Us</a></li>
            <li><a href="#services" className="hover:text-[#eeeef8] transition-all">AI Capabilities</a></li>
            <li><a href="#process" className="hover:text-[#eeeef8] transition-all">How it works</a></li>
            <li><a href="#faq" className="hover:text-[#eeeef8] transition-all">FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#eeeef8] transition-all">Contact Support</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">The AI Group</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#9aa0b8]">
            <li><a href="https://comonk-ai.onrender.com" target="_blank" className="hover:text-[#eeeef8] transition-all">Comonk Technology</a></li>
            <li><a href="https://sevenseed-ai.onrender.com" target="_blank" className="hover:text-[#eeeef8] transition-all">Sevenseed Studio</a></li>
            <li><a href="https://avpu-ai.onrender.com" target="_blank" className="hover:text-[#eeeef8] transition-all">AVP University</a></li>
            <li><span className="text-[#6ee7b7] font-semibold">Decode Forest Pharmacy</span></li>
            <li><a href="https://breakdown-factor-ai.onrender.com" target="_blank" className="hover:text-[#eeeef8] transition-all">Breakdown Factor</a></li>
            <li><a href="https://avp-trust-ai.onrender.com" target="_blank" className="hover:text-[#eeeef8] transition-all">AVP Charitable Trust</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Contact</h5>
          <ul className="flex flex-col gap-3 text-sm text-[#9aa0b8]">
            <li className="flex items-center gap-3"><i className="fas fa-envelope text-[#6ee7b7]"></i> care@decodeforest.in</li>
            <li className="flex items-center gap-3"><i className="fas fa-phone text-[#6ee7b7]"></i> +91 84908 61586</li>
            <li className="flex items-center gap-3"><i className="fas fa-location-dot text-[#6ee7b7]"></i> Ahmedabad, Gujarat, India</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-[#5b5f78]">
        <span>© {year} Decode Forest Pharmacy. All rights reserved.</span>
        <span className="flex items-center gap-1.5"><i className="fas fa-seedling text-[#10b981]"></i> A Sevenseed AI venture</span>
      </div>
    </footer>
  );
}
