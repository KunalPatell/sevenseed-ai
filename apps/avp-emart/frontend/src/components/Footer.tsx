"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#050508] py-16 px-6 md:px-12 mt-20">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-[17px] tracking-tight">
            <span className="w-[36px] h-[36px] rounded-[11px] grid place-items-center text-white bg-gradient-to-br from-[#ea580c] to-[#10b981] shadow-[0_6px_16px_rgba(234,88,12,0.3)]">
              <ShoppingCart className="h-[18px] w-[18px]" />
            </span>
            <span className="text-white">AVP <span className="text-[#fdba74]">Emart</span></span>
          </Link>
          <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed">
            An AI-powered smart-shopping marketplace that compares live prices across Amazon, Flipkart, Reliance Digital, and Snapdeal, scores the best value with ML, and alerts you for price drops.
          </p>
          <div className="flex gap-4 text-[#9aa0b8]">
            <a href="#" className="hover:text-[#ea580c] transition-all"><i className="fab fa-linkedin-in text-lg"></i></a>
            <a href="#" className="hover:text-[#ea580c] transition-all"><i className="fab fa-instagram text-lg"></i></a>
            <a href="#" className="hover:text-[#ea580c] transition-all"><i className="fab fa-facebook-f text-lg"></i></a>
            <a href="mailto:care@avpemart.in" className="hover:text-[#ea580c] transition-all"><i className="fas fa-envelope text-lg"></i></a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Explore</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#9aa0b8]">
            <li><a href="#about" className="hover:text-[#eeeef8] transition-all">About Us</a></li>
            <li><a href="#services" className="hover:text-[#eeeef8] transition-all">AI Tools</a></li>
            <li><a href="#process" className="hover:text-[#eeeef8] transition-all">How it works</a></li>
            <li><a href="#faq" className="hover:text-[#eeeef8] transition-all">FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#eeeef8] transition-all">Contact Support</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">The AI Group</h5>
          <ul className="flex flex-col gap-2.5 text-sm text-[#9aa0b8]">
            <li><a href="/comonk-ai/" className="hover:text-[#eeeef8] transition-all">Comonk Technology</a></li>
            <li><a href="/" className="hover:text-[#eeeef8] transition-all">Sevenseed Studio</a></li>
            <li><a href="/avp-emart/" className="hover:text-[#eeeef8] transition-all">AVP Emart</a></li>
            <li><a href="/pharmacy/" className="hover:text-[#eeeef8] transition-all">Decode Forest Pharmacy</a></li>
            <li><a href="/breakdown/" className="hover:text-[#eeeef8] transition-all">Breakdown Factor</a></li>
            <li><a href="/trust/" className="hover:text-[#eeeef8] transition-all">AVP Charitable Trust</a></li>
            <li><a href="/avpu/" className="hover:text-[#eeeef8] transition-all">AVP University</a></li>
            <li><a href="/sevenforce/" className="hover:text-[#eeeef8] transition-all">Sevenforce</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-semibold text-sm text-white uppercase tracking-wider">Contact</h5>
          <ul className="flex flex-col gap-3 text-sm text-[#9aa0b8]">
            <li className="flex items-center gap-3"><i className="fas fa-envelope text-[#ea580c]"></i> care@avpemart.in</li>
            <li className="flex items-center gap-3"><i className="fas fa-phone text-[#ea580c]"></i> +91 84908 61586</li>
            <li className="flex items-center gap-3"><i className="fas fa-location-dot text-[#ea580c]"></i> Ahmedabad, Gujarat, India</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-[#5b5f78]">
        <span>© {year} AVP Emart. All rights reserved.</span>
        <span className="flex items-center gap-1.5"><i className="fas fa-seedling text-[#ea580c]"></i> A Sevenseed AI venture</span>
      </div>
    </footer>
  );
}
