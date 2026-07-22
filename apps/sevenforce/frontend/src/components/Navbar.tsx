"use client";

import React, { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "AI Tools" },
  { href: "#try-maya", label: "Live Demo" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a className="logo" href="#top">
        <span className="logo-icon"><i className="fas fa-users-gear" /></span>
        <span className="logo-text whitespace-nowrap">Seven <span className="logo-accent">force</span></span>
      </a>

      {/* Desktop links / mobile dropdown. Mirrors the sibling sites: below the
          hamburger breakpoint this becomes a solid dropdown panel. */}
      <div className={`nav-links${open ? " open" : ""}`} id="navLinks">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        {/* The portal CTA is hidden on mobile in .nav-right, so surface it here
            instead — otherwise it would be unreachable on a phone. */}
        <a className="nav-mobile-cta" href="/sevenforce/app/" onClick={() => setOpen(false)}>
          <i className="fas fa-wand-magic-sparkles" /> Launch App
        </a>
      </div>

      <div className="nav-right">
        <a className="btn btn-ghost nav-cta" href="/sevenforce/app/">
          <i className="fas fa-wand-magic-sparkles" /> Launch App
        </a>
        <a className="btn btn-primary nav-cta" href="#contact">
          <i className="fas fa-envelope" /> Contact
        </a>
        <button
          className="hamburger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i className={open ? "fas fa-times" : "fas fa-bars"} />
        </button>
      </div>
    </nav>
  );
}
