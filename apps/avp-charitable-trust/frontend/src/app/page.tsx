"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Heart, 
  Layers, 
  Lightbulb, 
  Rocket, 
  Cpu, 
  ChevronDown, 
  Search, 
  Star,
  Activity,
  Briefcase,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPct(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg("Sending message...");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeedbackMsg("Thank you! Your message has been sent successfully.");
      setContactName("");
      setContactEmail("");
      setContactMsg("");
    } catch (err) {
      setFeedbackMsg("Could not send message. Please try again.");
    }
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-24 overflow-hidden bg-[#070405]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.14),transparent_60%)]" />
        <div className="hero-grid" />
        
        <div className="relative z-10 max-w-[900px] w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#ffe4e6] bg-[#f43f5e]/10 border border-[#f43f5e]/25 mb-8">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Beneficiary Matcher · 80G Tax Exemption Receipts · CSR Impact Reporter</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            Empowering communities <br /><span className="grad">with transparent AI</span>
          </h1>

          <p className="text-sm md:text-lg text-[#c8bdc0] max-w-[670px] leading-relaxed mb-10">
            AVP Charitable Trust matches regional welfare needs to resources and generates transparent, audit-ready impact reports for corporate CSR donors.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/app/" className="btn bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] hover:scale-[1.02] text-white font-semibold text-sm md:text-base px-6 py-3 rounded-lg shadow-[0_6px_22px_rgba(244,63,94,0.3)] transition-all duration-200">
              <i className="fas fa-rocket mr-2"></i> Launch NGO Portal
            </Link>
            <a href="#programs" className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-[#220f15] hover:border-[#f43f5e]/50 text-sm md:text-base px-6 py-3 rounded-lg transition-all duration-200">
              <i className="fas fa-seedling mr-2"></i> View Our Programs
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center bg-[#180b0f]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md mb-12">
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#ffe4e6] to-[#fef3c7] bg-clip-text text-transparent">₹25L+</div>
              <div className="text-[10px] md:text-xs text-[#c8bdc0] uppercase tracking-wider font-semibold mt-1">Donations Disbursed</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#ffe4e6] to-[#fef3c7] bg-clip-text text-transparent">100%</div>
              <div className="text-[10px] md:text-xs text-[#c8bdc0] uppercase tracking-wider font-semibold mt-1">Audit Compliance</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#ffe4e6] to-[#fef3c7] bg-clip-text text-transparent">80G</div>
              <div className="text-[10px] md:text-xs text-[#c8bdc0] uppercase tracking-wider font-semibold mt-1">Tax-Exempt Approved</div>
            </div>
          </div>

          <div className="w-full max-w-[760px] mask-image-gradient overflow-hidden select-none opacity-50">
            <div className="marquee-track text-[#7c7073] text-xs font-mono font-semibold">
              <span>NGO Beneficiary Matching</span>
              <span>80G Receipt Issuance</span>
              <span>Needs Assessments API</span>
              <span>CSR Partnership Analytics</span>
              <span>Academic Scholarships at AVPU</span>
              <span>Transparent Fund Allocation Ledger</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#10080a] border-y border-white/5 py-8 px-6 md:px-12">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f43f5e]/15 text-[#ffe4e6] shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Beneficiary Matching</div>
              <p className="text-xs text-[#c8bdc0] mt-0.5">Matches community profiles against NGO grants.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f43f5e]/15 text-[#ffe4e6] shrink-0">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">80G Receipts</div>
              <p className="text-xs text-[#c8bdc0] mt-0.5">Instant tax deduction documents for donors.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f43f5e]/15 text-[#ffe4e6] shrink-0">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Needs Assessment</div>
              <p className="text-xs text-[#c8bdc0] mt-0.5">AI scores priority intervention sectors.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f43f5e]/15 text-[#ffe4e6] shrink-0">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">CSR Impact Reports</div>
              <p className="text-xs text-[#c8bdc0] mt-0.5">Exports quarterly utilization logs to PDF.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · AVP Charitable Trust</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Serving communities with absolute transparency.</h2>
          <p className="text-sm md:text-base text-[#c8bdc0] leading-relaxed mt-2">
            AVP Charitable Trust operates in Ahmedabad, dedicated to rural empowerment and social welfare. Through our synergy with **AVP University (AVPU)**, we disburse full tuition scholarships to meritorious students from economically weaker sections.
          </p>
          <p className="text-sm md:text-base text-[#c8bdc0] leading-relaxed">
            By deploying AI needs calculators and transparent funding ledgers, we ensure that every single rupee donated directly feeds the community or matches a student&apos;s need. Check our active programs or register as an NGO volunteer.
          </p>
        </div>
        <div className="lg:col-span-5 glow-card bg-gradient-to-br from-[#180b0f] to-[#10080a] border border-white/5 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-xl grid place-items-center text-white bg-gradient-to-br from-[#f43f5e] to-[#f59e0b] shadow-[0_8px_24px_rgba(244,63,94,0.3)] mb-6">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <h3 className="text-lg font-bold text-white mb-4">NGO Values</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-sm text-[#c8bdc0] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#f43f5e]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ffe4e6]"></i></span>
              <span>100% transparent funding audits</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#c8bdc0] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#f43f5e]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ffe4e6]"></i></span>
              <span>80G tax-exempt receipts emailed instantly</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#c8bdc0] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#f43f5e]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ffe4e6]"></i></span>
              <span>AI needs matcher connecting local requests</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#c8bdc0]">
              <span className="w-[20px] h-[20px] rounded bg-[#f43f5e]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ffe4e6]"></i></span>
              <span>Scholarships linked to AVPU campus registries</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-[#10080a] py-20 px-6 md:px-12" id="programs">
        <div className="max-w-[1180px] mx-auto">
          <span className="eyebrow center block">OUR PROGRAMS</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Active welfare divisions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#180b0f] border border-white/5 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
              <h4 className="text-base font-bold text-white mb-2">Gyan Sarovar (Education)</h4>
              <p className="text-xs md:text-sm text-[#c8bdc0] leading-relaxed">Providing computer labs, free textbooks, and scholarships for AVPU campus studies.</p>
            </div>

            <div className="bg-[#180b0f] border border-white/5 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
              <h4 className="text-base font-bold text-white mb-2">Arogya Path (Healthcare)</h4>
              <p className="text-xs md:text-sm text-[#c8bdc0] leading-relaxed">Mobile clinics in rural Ahmedabad, generic drug camps, and primary emergency care.</p>
            </div>

            <div className="bg-[#180b0f] border border-white/5 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
              <h4 className="text-base font-bold text-white mb-2">Gram Uday (Rural Growth)</h4>
              <p className="text-xs md:text-sm text-[#c8bdc0] leading-relaxed">Rainwater harvesting structure logs, vocational training, and self-help group setups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="impact">
        <span className="eyebrow center block">METRICS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Impact numbers that matter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tcard text-center flex flex-col gap-2">
            <div className="text-4xl font-black text-[#f43f5e]">1,200+</div>
            <div className="text-sm font-bold text-white">Students Supported</div>
            <p className="text-xs text-[#c8bdc0]">Tuition fee waivers and textbooks dispatched.</p>
          </div>
          <div className="tcard text-center flex flex-col gap-2">
            <div className="text-4xl font-black text-[#f43f5e]">4,500+</div>
            <div className="text-sm font-bold text-white">Patients Treated</div>
            <p className="text-xs text-[#c8bdc0]">Free diagnostics, mobile clinic visits, and medication.</p>
          </div>
          <div className="tcard text-center flex flex-col gap-2">
            <div className="text-4xl font-black text-[#f43f5e]">18+</div>
            <div className="text-sm font-bold text-white">Rural Districts</div>
            <p className="text-xs text-[#c8bdc0]">Clean drinking water systems installed.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="faq">
        <span className="eyebrow center block">FAQ</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">NGO questions, answered</h2>
        
        <div className="max-w-[760px] mx-auto faq-list">
          <details>
            <summary className="faq-summary">Are donations eligible for tax deductions? <ChevronDown className="h-4 w-4 text-[#ffe4e6]" /></summary>
            <p className="text-xs md:text-sm text-[#c8bdc0] mt-3 leading-relaxed">
              Yes, AVP Charitable Trust is registered under Section 80G. You will receive an email receipt acknowledging your contribution immediately.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Can we inspect how funds are spent? <ChevronDown className="h-4 w-4 text-[#ffe4e6]" /></summary>
            <p className="text-xs md:text-sm text-[#c8bdc0] mt-3 leading-relaxed">
              Yes! Our NGO portal houses a transparent, public funding ledger listing every single contribution and beneficiary allocation.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How can I volunteer? <ChevronDown className="h-4 w-4 text-[#ffe4e6]" /></summary>
            <p className="text-xs md:text-sm text-[#c8bdc0] mt-3 leading-relaxed">
              Go to our NGO portal dashboard, navigate to the Volunteers panel, enter your skills and availability, and we will email you matching events.
            </p>
          </details>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <div className="bg-[#180b0f] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(244,63,94,0.06),transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Support our mission today.</h2>
            <p className="text-xs md:text-sm text-[#c8bdc0] leading-relaxed mb-8">
              Become a CSR sponsor, verify beneficiary registrations, or ask donor assistant queries.
            </p>

            <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name" 
                  required
                  className="w-full px-4 py-3 bg-[#10080a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f43f5e]" 
                />
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email" 
                  required
                  className="w-full px-4 py-3 bg-[#10080a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f43f5e]" 
                />
              </div>
              <textarea 
                rows={4} 
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="How would you like to partner with AVP Charitable Trust?..." 
                required
                className="w-full px-4 py-3 bg-[#10080a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f43f5e] resize-none" 
              />
              <button 
                type="submit" 
                className="btn w-full bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] text-white font-semibold py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
              >
                Send Partnership Request
              </button>
              {feedbackMsg && <p className="text-xs text-[#f43f5e] font-semibold mt-2">{feedbackMsg}</p>}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
