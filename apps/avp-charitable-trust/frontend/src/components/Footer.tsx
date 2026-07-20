"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#050304] py-16 px-6 md:px-12 mt-20">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-[17px] tracking-tight">
            <span className="w-[36px] h-[36px] rounded-[11px] grid place-items-center text-white bg-gradient-to-br from-[#f43f5e] to-[#f59e0b] shadow-[0_6px_16px_rgba(244,63,94,0.3)]">
              <Heart className="h-[18px] w-[18px] fill-current" />
            </span>
            <span className="text-white">AVP<span className="text-[#f43f5e]">Trust</span></span>
          </Link>
          <p className="text-xs md:text-sm text-[#c8bdc0] leading-relaxed">
            AVP Charitable Trust is a registered non-profit organization in Gujarat, India, delivering transparent education, healthcare, and community welfare programs.
          </p>
          <div className="flex gap-4 text-[#c8bdc0]">
            <a href="#" className="hover:text-[#f43f5e] transition-all"><i className="fab fa-linkedin-in text-lg"></i></a>
            <a href="#" className="hover:text-[#f43f5e] transition-all"><i className="fab fa-instagram text-lg"></i></a>
            <a href="#" className="hover:text-[#f43f5e] transition-all"><i className="fab fa-facebook-f text-lg"></i></a>
            <a href="mailto:hello@avptrust.org" className="hover:text-[#f43f5e] transition-all"><i className="fas fa-envelope text-lg"></i></a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Explore</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#c8bdc0]">
            <li><a href="#about" className="hover:text-[#faf5f6] transition-all">About NGO</a></li>
            <li><a href="#programs" className="hover:text-[#faf5f6] transition-all">Our Programs</a></li>
            <li><a href="#impact" className="hover:text-[#faf5f6] transition-all">Impact Reports</a></li>
            <li><a href="#faq" className="hover:text-[#faf5f6] transition-all">FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#faf5f6] transition-all">Contact Us</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Synergies</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#c8bdc0]">
            <li><a href="https://avpu-ai.onrender.com" target="_blank" className="hover:text-[#faf5f6] transition-all">AVP University (Scholarships)</a></li>
            <li><a href="https://comonk-ai.onrender.com" target="_blank" className="hover:text-[#faf5f6] transition-all">Comonk Tech (Shared IT platform)</a></li>
            <li><a href="https://breakdown-factor-ai.onrender.com" target="_blank" className="hover:text-[#faf5f6] transition-all">Breakdown Factor (Infrastructure work)</a></li>
            <li><a href="https://sevenseed-ai.onrender.com" target="_blank" className="hover:text-[#faf5f6] transition-all">Sevenseed Studio (Incubator hub)</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Contact</h5>
          <ul className="flex flex-col gap-3 text-sm text-[#c8bdc0]">
            <li className="flex items-center gap-3"><i className="fas fa-envelope text-[#f43f5e]"></i> info@avptrust.org</li>
            <li className="flex items-center gap-3"><i className="fas fa-phone text-[#f43f5e]"></i> +91 79265 12345</li>
            <li className="flex items-center gap-3"><i className="fas fa-location-dot text-[#f43f5e]"></i> Ashram Road, Ahmedabad, India</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-[#7c7073]">
        <span>© {year} AVP Charitable Trust. All rights reserved.</span>
        <span className="flex items-center gap-1.5"><i className="fas fa-seedling text-[#f43f5e]"></i> Serving Gujarat</span>
      </div>
    </footer>
  );
}
