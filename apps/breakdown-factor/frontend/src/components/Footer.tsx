"use client";

import React from "react";
import Link from "next/link";
import { HardHat } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#050403] py-16 px-6 md:px-12 mt-20">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-[17px] tracking-tight">
            <span className="w-[36px] h-[36px] rounded-[11px] grid place-items-center text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] shadow-[0_6px_16px_rgba(245,158,11,0.3)]">
              <HardHat className="h-[18px] w-[18px]" />
            </span>
            <span className="text-white">Breakdown<span className="text-[#f59e0b]">Factor</span></span>
          </Link>
          <p className="text-xs md:text-sm text-[#c8c0b8] leading-relaxed">
            Breakdown Factor Construction delivers state-of-the-art building developments in India, integrated with safety checkers and defect analysis.
          </p>
          <div className="flex gap-4 text-[#c8c0b8]">
            <a href="#" className="hover:text-[#f59e0b] transition-all"><i className="fab fa-linkedin-in text-lg"></i></a>
            <a href="#" className="hover:text-[#f59e0b] transition-all"><i className="fab fa-instagram text-lg"></i></a>
            <a href="#" className="hover:text-[#f59e0b] transition-all"><i className="fab fa-facebook-f text-lg"></i></a>
            <a href="mailto:hello@breakdownfactor.com" className="hover:text-[#f59e0b] transition-all"><i className="fas fa-envelope text-lg"></i></a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Explore</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#c8c0b8]">
            <li><a href="#about" className="hover:text-[#faf8f5] transition-all">About Studio</a></li>
            <li><a href="#tools" className="hover:text-[#faf8f5] transition-all">Cost Index</a></li>
            <li><a href="#defects" className="hover:text-[#faf8f5] transition-all">YOLO Scan</a></li>
            <li><a href="#faq" className="hover:text-[#faf8f5] transition-all">FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#faf8f5] transition-all">Contact Us</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">The AI Group</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#c8c0b8]">
            <li><a href="/comonk-ai/" className="hover:text-[#faf8f5] transition-all">Comonk Technology</a></li>
            <li><a href="/" className="hover:text-[#faf8f5] transition-all">Sevenseed Studio</a></li>
            <li><a href="/avp-emart/" className="hover:text-[#faf8f5] transition-all">AVP Emart</a></li>
            <li><a href="/pharmacy/" className="hover:text-[#faf8f5] transition-all">Decode Forest Pharmacy</a></li>
            <li><a href="/breakdown/" className="hover:text-[#faf8f5] transition-all">Breakdown Factor</a></li>
            <li><a href="/trust/" className="hover:text-[#faf8f5] transition-all">AVP Charitable Trust</a></li>
            <li><a href="/avpu/" className="hover:text-[#faf8f5] transition-all">AVP University</a></li>
            <li><a href="/sevenforce/" className="hover:text-[#faf8f5] transition-all">Sevenforce</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Contact</h5>
          <ul className="flex flex-col gap-3 text-sm text-[#c8c0b8]">
            <li className="flex items-center gap-3"><i className="fas fa-envelope text-[#f59e0b]"></i> info@breakdownfactor.com</li>
            <li className="flex items-center gap-3"><i className="fas fa-phone text-[#f59e0b]"></i> +91 97241 12345</li>
            <li className="flex items-center gap-3"><i className="fas fa-location-dot text-[#f59e0b]"></i> Sanand Highway, Ahmedabad, India</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-[#7c7268]">
        <span>© {year} Breakdown Factor Construction. All rights reserved.</span>
        <span className="flex items-center gap-1.5"><i className="fas fa-hammer text-[#f59e0b]"></i> Building Securely</span>
      </div>
    </footer>
  );
}
