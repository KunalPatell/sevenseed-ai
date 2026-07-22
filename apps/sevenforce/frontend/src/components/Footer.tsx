"use client";

import React from "react";

// Sibling ventures are served by the same FastAPI orchestrator under their own
// prefixes, so link to those paths directly (not relative ../ hops, which broke
// once the sites moved behind the hub).
const GROUP = [
  { label: "Comonk Technology", href: "/comonk-ai/" },
  { label: "Sevenseed", href: "/" },
  { label: "Sevenforce", current: true },
  { label: "Alpaben Vipulbhai Patel University", href: "/avpu/" },
  { label: "Decode Forest Pharmacy", href: "/pharmacy/" },
  { label: "Breakdown Factor Construction", href: "/breakdown/" },
  { label: "AVP Charitable Trust", href: "/trust/" },
  { label: "AVP Emart", href: "/avp-emart/" },
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="foot-brand">
          <a className="logo" href="#top">
            <span className="logo-icon"><i className="fas fa-users-gear" /></span>
            <span className="logo-text">Seven <span className="logo-accent">force</span></span>
          </a>
          <p>
            Sevenforce gives every business a team of specialised AI employees — for
            marketing, sales, hiring, meetings, documents, and data — all running on
            Sevenseed&apos;s shared AI stack.
          </p>
          <div className="foot-social">
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
            <a href="mailto:hello@sevenforce.ai" aria-label="Email"><i className="fas fa-envelope" /></a>
          </div>
        </div>

        <div className="foot-col">
          <h5>Explore</h5>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#services">AI Tools</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="foot-col">
          <h5>The AI Group</h5>
          <ul>
            {GROUP.map((g) =>
              g.current ? (
                <li key={g.label}><span className="foot-current">{g.label}</span></li>
              ) : (
                <li key={g.label}><a href={g.href}>{g.label}</a></li>
              )
            )}
          </ul>
        </div>

        <div className="foot-col">
          <h5>Get in touch</h5>
          <ul className="foot-contact">
            <li><i className="fas fa-envelope" /> hello@sevenforce.ai</li>
            <li><i className="fas fa-phone" /> +91 84908 61586</li>
            <li><i className="fas fa-location-dot" /> Ahmedabad, Gujarat, India</li>
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <span>© {new Date().getFullYear()} Seven force. All rights reserved.</span>
        <span className="foot-venture"><i className="fas fa-seedling" /> A Sevenseed AI venture</span>
      </div>
    </footer>
  );
}
