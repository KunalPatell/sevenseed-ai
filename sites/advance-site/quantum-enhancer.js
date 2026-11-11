/**
 * ============================================================================
 * 🚀 SEVENSEED ADVANCE SITE v6.1 — NON-INTRUSIVE POST-HYDRATION ENHANCER
 * ============================================================================
 * • Preserves 100% of every Venture's unique frontend (all 61 distinct Next.js
 *   pages & 245+ Sevenseed tools look and work uniquely!).
 * • Universal Navbar Dropdown & Dismiss Controller (fixes stuck mega-menus that
 *   previously covered page buttons, and powers dropdowns on alias routes).
 * • Guarantees every page has a visible semantic `<h1>` and unique `document.title`.
 * • Lazy-loads Three.js WebGL ONLY on pages with a 3D hero container so page
 *   loads are fast and never block `window.onload`.
 * ============================================================================
 */
(function () {
  "use strict";

  const path = window.location.pathname.toLowerCase();
  if (
    document.getElementById("vite-app-root") ||
    path.endsWith("/app") ||
    path.endsWith("/app/")
  ) {
    return;
  }

  // 1. Capture-phase link guard: ensure all internal <a href="/..."> links navigate cleanly
  window.addEventListener(
    "click",
    function (e) {
      const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/#") &&
        !a.hasAttribute("download") &&
        a.target !== "_blank"
      ) {
        e.stopImmediatePropagation();
      }
    },
    true
  );

  function detectVentureProfile() {
    if (path.includes("avpu")) {
      return {
        key: "avpu",
        name: "AVPU University",
        hubUrl: "/avpu/",
        appUrl: "/avpu/app/",
        color: "#38bdf8",
        shape: "octahedron",
      };
    }
    if (path.includes("emart")) {
      return {
        key: "emart",
        name: "AVP E-Mart",
        hubUrl: "/avp-emart/",
        appUrl: "/avp-emart/app/",
        color: "#10b981",
        shape: "icosahedron",
      };
    }
    if (path.includes("pharmacy")) {
      return {
        key: "pharmacy",
        name: "Decode Forest Pharmacy",
        hubUrl: "/pharmacy/",
        appUrl: "/pharmacy/app/",
        color: "#14b8a6",
        shape: "dodecahedron",
      };
    }
    if (path.includes("breakdown")) {
      return {
        key: "breakdown",
        name: "Breakdown Factor Civil",
        hubUrl: "/breakdown/",
        appUrl: "/breakdown/app/",
        color: "#f59e0b",
        shape: "box",
      };
    }
    if (path.includes("trust")) {
      return {
        key: "trust",
        name: "AVP Charitable Trust",
        hubUrl: "/trust/",
        appUrl: "/trust/app/",
        color: "#eab308",
        shape: "sphere",
      };
    }
    if (path.includes("rakshak")) {
      return {
        key: "rakshak",
        name: "Rakshak AI Sentinel",
        hubUrl: "/rakshak-ai/",
        appUrl: "/rakshak-ai/app/",
        color: "#ef4444",
        shape: "torus",
      };
    }
    if (path.includes("comonk")) {
      return {
        key: "comonk",
        name: "Comonk Career AI",
        hubUrl: "/comonk/",
        appUrl: "/comonk/app/",
        color: "#a855f7",
        shape: "cone",
      };
    }
    if (path.includes("agency") || path.includes("sevenforce")) {
      return {
        key: "agency",
        name: "Sevenforce Agency",
        hubUrl: "/sevenforce/",
        appUrl: "/sevenforce/app/",
        color: "#f59e0b",
        shape: "torusKnot",
      };
    }
    if (path.includes("quant-terminal")) {
      return {
        key: "quant",
        name: "Sevenseed Quant Terminal",
        hubUrl: "/quant-terminal/",
        appUrl: "/app/",
        color: "#10b981",
        shape: "icosahedron",
      };
    }
    if (path.includes("climate-agritech")) {
      return {
        key: "climate",
        name: "TerraPulse Climate & AgriTech",
        hubUrl: "/climate-agritech/",
        appUrl: "/app/",
        color: "#22c55e",
        shape: "dodecahedron",
      };
    }
    if (path.includes("proptech-studio")) {
      return {
        key: "proptech",
        name: "UrbanGrid PropTech AI",
        hubUrl: "/proptech-studio/",
        appUrl: "/app/",
        color: "#f59e0b",
        shape: "box",
      };
    }
    return {
      key: "sevenseed",
      name: "Sevenseed Venture Studio",
      hubUrl: "/",
      appUrl: "/app/",
      color: "#6366f1",
      shape: "torusKnot",
    };
  }

  // 2. Universal Top Navbar Dropdown & Auto-Dismiss Controller
  const NAV_VENTURES = [
    { name: "Sevenseed Studio", href: "/", desc: "AI Venture Studio Hub" },
    { name: "AVPU", href: "/avpu/", desc: "AI University & Education Labs" },
    { name: "AVP E-Mart", href: "/avp-emart/", desc: "Shopping and price tools" },
    { name: "Comonk Technology", href: "/comonk/", desc: "AI Career & ATS Intelligence" },
    { name: "Sevenforce", href: "/sevenforce/", desc: "7 Autonomous AI Employees" },
    { name: "Decode Forest Pharmacy", href: "/pharmacy/", desc: "Medicines and health tools" },
    { name: "Breakdown Factor", href: "/breakdown/", desc: "Civil engineering tools" },
    { name: "AVP Charitable Trust", href: "/trust/", desc: "Social Impact & 80G Tax Exemption" },
    { name: "Rakshak AI", href: "/rakshak-ai/", desc: "Safety and legal help" },
    { name: "Quant Terminal", href: "/quant-terminal/", desc: "Options Greeks & FinTech Charts" },
    { name: "TerraPulse Climate", href: "/climate-agritech/", desc: "Carbon Scope 1-3 & FAO Irrigation" },
    { name: "UrbanGrid PropTech", href: "/proptech-studio/", desc: "DCF Cap-Rate & FSI Massing AI" },
    { name: "AgenticOS", href: "/agenticos/", desc: "Autonomous Agent Kernel OS" },
  ];

  const NAV_TOOLS = [
    { name: "Deep Research", href: "/perplexity-research/", brand: "Frontier AI" },
    { name: "Prompt-to-UI Builder", href: "/ai-ui-builder/", brand: "Frontier AI" },
    { name: "Infinite Arch Canvas", href: "/infinite-canvas/", brand: "Frontier AI" },
    { name: "Sprint OS", href: "/linear-os/", brand: "Frontier AI" },
    { name: "WebGL Shader Lab", href: "/shader-3d-lab/", brand: "3D GPU" },
    { name: "Incorporation & 83(b)", href: "/stripe-atlas/", brand: "Sevenseed" },
    { name: "Learn DAG Canvas", href: "/avpu/learn-dag/", brand: "AVPU" },
    { name: "Spec Comparator", href: "/avp-emart/spec-compare/", brand: "AVP E-Mart" },
    { name: "Resume Analyzer", href: "/comonk/resume-analyzer/", brand: "Comonk" },
    { name: "AI Dev Terminal", href: "/sevenforce/devin-terminal/", brand: "Sevenforce" },
    { name: "Pregnancy & Breastfeeding Medicine Safety", href: "/pharmacy/pregnancy-lactation-safety/", brand: "Pharmacy" },
    { name: "CPWD BOQ Estimator", href: "/breakdown/boq-estimator/", brand: "Breakdown" },
    { name: "Milestone Escrow", href: "/trust/crowdfunding-milestones/", brand: "AVP Trust" },
    { name: "FIR Draft Helper", href: "/rakshak-ai/fir-generator/", brand: "Rakshak AI" },
    { name: "Syndicate Calculator", href: "/syndicate-ruv/", brand: "Sevenseed" },
    { name: "Your AI Keys", href: "/byok/", brand: "Sevenseed" },
  ];

  let navAutoCloseTimer = null;

  function closeAllNavbarDropdowns() {
    if (navAutoCloseTimer) {
      clearTimeout(navAutoCloseTimer);
      navAutoCloseTimer = null;
    }
    // Remove fallback dropdowns injected on static/alias routes
    document.querySelectorAll(".adv-fallback-dropdown").forEach((el) => el.remove());
    // Close React-rendered dropdowns by clicking their toggle button if open
    document.querySelectorAll("nav div.relative").forEach((rel) => {
      const openMenu = rel.querySelector("div.absolute.top-full:not(.adv-fallback-dropdown)");
      const toggleBtn = rel.querySelector("button");
      if (openMenu && toggleBtn) {
        toggleBtn.click();
      }
    });
  }

  function scheduleNavbarAutoDismiss() {
    if (navAutoCloseTimer) clearTimeout(navAutoCloseTimer);
    // Automatically dismiss dropdown after 350ms if pointer is not actively hovering inside it
    navAutoCloseTimer = setTimeout(() => {
      const anyHovered = Array.from(document.querySelectorAll("nav div.absolute.top-full")).some((el) =>
        el.matches(":hover")
      );
      if (!anyHovered) {
        closeAllNavbarDropdowns();
      }
    }, 350);
  }

  function wireUniversalNavbar() {
    const nav = document.querySelector("nav.fixed.top-0");
    if (!nav || nav.dataset.advNavWired === "1") return;
    nav.dataset.advNavWired = "1";

    nav.querySelectorAll("div.relative > button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rel = btn.parentElement;
        const label = (btn.textContent || "").trim();
        setTimeout(() => {
          const existingReactMenu = rel.querySelector("div.absolute.top-full:not(.adv-fallback-dropdown)");
          const existingFallback = rel.querySelector(".adv-fallback-dropdown");
          if (existingReactMenu) {
            scheduleNavbarAutoDismiss();
            return;
          }
          if (existingFallback) {
            existingFallback.remove();
            return;
          }
          // Close any other fallback dropdown first
          document.querySelectorAll(".adv-fallback-dropdown").forEach((el) => el.remove());

          const menu = document.createElement("div");
          if (label.includes("Ventures")) {
            menu.className =
              "adv-fallback-dropdown absolute top-full left-0 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2.5 grid grid-cols-1 gap-1 z-50";
            menu.innerHTML = NAV_VENTURES.map(
              (v) => `
              <a href="${v.href}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 transition">
                <div>
                  <div class="text-xs font-bold text-white leading-tight">${v.name}</div>
                  <div class="text-[10px] text-slate-400">${v.desc}</div>
                </div>
              </a>
            `
            ).join("");
          } else {
            menu.className =
              "adv-fallback-dropdown absolute top-full -left-20 w-[420px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 grid grid-cols-2 gap-2 z-50";
            menu.innerHTML = NAV_TOOLS.map(
              (t) => `
              <a href="${t.href}" class="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition">
                <div class="text-[10px] text-amber-400 font-mono uppercase">${t.brand}</div>
                <div class="text-xs font-bold text-white mt-0.5">${t.name}</div>
              </a>
            `
            ).join("");
          }
          menu.addEventListener("mouseleave", () => menu.remove());
          rel.appendChild(menu);
          scheduleNavbarAutoDismiss();
        }, 15);
      });
    });

    // Dismiss open navbar dropdowns on outside pointerdown, Escape, or scroll
    document.addEventListener(
      "pointerdown",
      (e) => {
        if (!nav.contains(e.target)) {
          closeAllNavbarDropdowns();
        }
      },
      true
    );
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllNavbarDropdowns();
    });
    window.addEventListener(
      "scroll",
      () => {
        closeAllNavbarDropdowns();
      },
      { passive: true }
    );
  }

  // 3. Universal Semantic <h1> Header Guarantee (for subpages that only rendered <h2>/<h3>)
  function ensureSemanticH1Header() {
    const visibleH1s = Array.from(document.querySelectorAll("h1")).filter(
      (el) => el.offsetParent !== null && (el.textContent || "").trim().length > 0
    );
    if (visibleH1s.length > 0) return;

    const v = detectVentureProfile();
    const mainEl = document.querySelector("main");
    let pageHeading = "";
    if (mainEl) {
      const firstH2OrH3 = mainEl.querySelector("h2, h3");
      if (firstH2OrH3 && (firstH2OrH3.textContent || "").trim()) {
        pageHeading = (firstH2OrH3.textContent || "").trim();
      }
    }
    if (!pageHeading) {
      const slug = path.replace(/^\/+|\/+$/g, "").split("/").pop() || "workstation";
      pageHeading =
        v.name +
        " — " +
        slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
    }

    if (document.getElementById("adv-subpage-header")) return;
    const headerBar = document.createElement("div");
    headerBar.id = "adv-subpage-header";
    headerBar.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;font-family:monospace;background:rgba(15,23,42,0.9);border:1px solid ${v.color}55;color:${v.color};">
          ${v.name}
        </span>
        <h1 style="margin:0;font-size:18px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">
          ${pageHeading}
        </h1>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <a href="${v.hubUrl}" style="font-size:11.5px;font-weight:700;color:#94a3b8;text-decoration:none;padding:4px 10px;border-radius:8px;border:1px solid rgba(148,163,184,0.2);">
          ← ${v.name} Hub
        </a>

      </div>
    `;
    if (mainEl && mainEl.parentNode) {
      mainEl.parentNode.insertBefore(headerBar, mainEl);
    } else {
      document.body.prepend(headerBar);
    }
  }

  // 4. Lazy On-Demand Three.js 3D Hero Hydrator
  function mountThreeSceneOnCanvas(canvas, v) {
    if (!window.THREE || canvas.dataset.advHydrated === "1") return;
    canvas.dataset.advHydrated = "1";
    try {
      const THREE = window.THREE;
      const parent = canvas.parentElement;
      const w = (parent && parent.clientWidth) || canvas.clientWidth || 460;
      const h = (parent && parent.clientHeight) || canvas.clientHeight || 420;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.z = 4.3;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(1);

      const col = new THREE.Color(v.color);
      scene.add(new THREE.AmbientLight(0xffffff, 0.85));
      const pLight = new THREE.PointLight(col, 2.8, 18);
      pLight.position.set(3, 3, 3);
      scene.add(pLight);

      let geom;
      switch (v.shape) {
        case "icosahedron": geom = new THREE.IcosahedronGeometry(1.2, 1); break;
        case "octahedron": geom = new THREE.OctahedronGeometry(1.25, 1); break;
        case "dodecahedron": geom = new THREE.DodecahedronGeometry(1.2, 0); break;
        case "box": geom = new THREE.BoxGeometry(1.45, 1.45, 1.45, 2, 2, 2); break;
        case "sphere": geom = new THREE.SphereGeometry(1.2, 24, 24); break;
        case "torus": geom = new THREE.TorusGeometry(1.0, 0.34, 18, 52); break;
        case "cone": geom = new THREE.ConeGeometry(1.1, 1.85, 20, 4); break;
        default: geom = new THREE.TorusKnotGeometry(0.9, 0.26, 96, 18);
      }

      const group = new THREE.Group();
      const core = new THREE.Mesh(
        geom,
        new THREE.MeshStandardMaterial({ color: col, metalness: 0.72, roughness: 0.2, emissive: col, emissiveIntensity: 0.22 })
      );
      const wire = new THREE.Mesh(
        geom,
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.45 })
      );
      wire.scale.setScalar(1.07);
      group.add(core);
      group.add(wire);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.62, 0.022, 14, 64),
        new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.65 })
      );
      ring.rotation.x = 1.15;
      group.add(ring);
      scene.add(group);

      let dragging = false, lx = 0, ly = 0;
      canvas.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; });
      window.addEventListener("pointerup", () => { dragging = false; });
      canvas.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        group.rotation.y += (e.clientX - lx) * 0.01;
        group.rotation.x += (e.clientY - ly) * 0.01;
        lx = e.clientX;
        ly = e.clientY;
      });

      function tick() {
        setTimeout(() => requestAnimationFrame(tick), 45);
        if (document.hidden) return;
        if (!dragging) {
          group.rotation.y += 0.016;
          group.rotation.x += 0.008;
        }
        ring.rotation.z += 0.022;
        renderer.render(scene, camera);
      }
      tick();
    } catch (_) {}
  }

  function hydrateHero3DContainers() {
    const boxes = Array.from(document.querySelectorAll("div.cursor-grab")).filter(
      (b) => b.clientHeight >= 180 && !b.querySelector("canvas") && !b.querySelector("svg")
    );
    const uninitCanvases = Array.from(document.querySelectorAll("canvas.cursor-grab")).filter(
      (c) => c.width === 300 && c.height === 150
    );
    if (boxes.length === 0 && uninitCanvases.length === 0) return;

    const runHydration = () => {
      if (!window.THREE) return;
      const v = detectVentureProfile();
      boxes.forEach((box) => {
        if (!box.querySelector("canvas")) {
          const c = document.createElement("canvas");
          c.className = "w-full h-full block";
          box.appendChild(c);
          mountThreeSceneOnCanvas(c, v);
        }
      });
      uninitCanvases.forEach((c) => mountThreeSceneOnCanvas(c, v));
    };

    if (window.THREE) {
      runHydration();
    } else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s.async = true;
      s.onload = runHydration;
      document.head.appendChild(s);
    }
  }

  // 5. "Fingerprint a file" panel: a small, real Web3 tool on every venture page, plus the
  // venture's tool directory. The fingerprint is computed in the browser; signing or putting
  // it on chain happens in /web3-studio/ with the visitor's own wallet.
  const SS_PROOF_USE = {
    avpu: "Fingerprint a certificate or assignment so you can later prove it's the original.",
    emart: "Fingerprint an invoice or warranty card to settle a refund or warranty dispute.",
    pharmacy: "Fingerprint a prescription or lab report so you can show it wasn't altered.",
    breakdown: "Fingerprint inspection reports, drawings or bills of quantities at each milestone.",
    trust: "Fingerprint a donation receipt or report so anyone can check it wasn't changed.",
    rakshak: "Fingerprint photos, videos or screenshots as evidence, as soon as you have them.",
    comonk: "Fingerprint an offer letter or experience letter so it can be checked later.",
    agency: "Fingerprint a contract, spec or delivery so both sides keep the same version.",
    sevenseed: "Fingerprint any document so you can later prove it existed and hasn't changed.",
  };
  const SS_TOOL_DIRECTORY = {
    avpu: [
      ["Knowledge map", "/avpu/learn-dag/"], ["Topic search", "/avpu/topic-search.html"], ["Review queue", "/avpu/review-queue.html"],
      ["100-day challenge", "/avpu/100-day-challenge.html"], ["AI learning path", "/avpu/ai-learning-path.html"], ["AI tutor", "/avpu/ai-tutor/"],
      ["Code lab", "/avpu/code-lab/"], ["Learning league", "/avpu/duo-league/"], ["Laws of UX", "/avpu/laws-of-ux/"],
      ["Mental models", "/avpu/mental-models/"], ["Marketing teardowns", "/avpu/marketing-teardowns/"], ["Flashcards", "/avpu/flashcards/"],
      ["Courses", "/avpu/courses/"], ["Scholarships", "/avpu/scholarships.html"], ["Certificates", "/avpu/credentials/"],
    ],
    emart: [
      ["Spec comparison", "/avp-emart/spec-compare/"], ["Price log", "/avp-emart/price-tracker/"], ["Coupon tester", "/avp-emart/coupon-tester/"],
      ["Deal checker", "/avp-emart/deals-radar/"], ["Grocery basket comparer", "/avp-emart/qcommerce/"], ["Wishlist", "/avp-emart/wishlist/"],
      ["Fake discount detector", "/avp-emart/deal-scanner/"], ["Shopping discovery", "/avp-emart/shopping-discovery.html"],
    ],
    pharmacy: [
      ["Generic medicine finder", "/pharmacy/generic-finder/"], ["Drug interaction checker", "/pharmacy/interaction-checker/"],
      ["Doctor consultation", "/pharmacy/doctor-consultation/"], ["Hospital finder", "/pharmacy/hospital-finder/"],
      ["Medicine reminders", "/pharmacy/medicine-reminders/"], ["Health wiki", "/decode-forest-pharmacy/health-wiki.html"],
      ["Prescription reader", "/decode-forest-pharmacy/prescription-ocr.html"],
    ],
    breakdown: [
      ["BOQ estimator", "/breakdown/boq-estimator/"], ["Material rate sheet", "/breakdown/material-prices/"],
      ["Project timeline", "/breakdown/project-timeline/"], ["Crack scanner", "/breakdown-factor/cv-scanner.html"],
      ["Site safety audit", "/breakdown-factor/safety-audit.html"],
    ],
    trust: [
      ["80G deduction calculator", "/trust/tax-exemption/"], ["Support a cause", "/trust/campaigns/"],
      ["Donation records", "/trust/ledger/"], ["Volunteer", "/trust/volunteer/"], ["Health camps", "/avp-charitable-trust/health-camps.html"],
    ],
    rakshak: [
      ["FIR draft helper", "/rakshak-ai/fir-generator/"], ["Scam link checker", "/rakshak-ai/threat-radar/"],
      ["Personal safety planner", "/rakshak-ai/safety-heatmap/"], ["Missing person report", "/rakshak-ai/missing-person/"],
      ["Data protection check", "/rakshak-ai/dpdp-auditor.html"],
    ],
    comonk: [
      ["Resume analyzer", "/comonk/resume-analyzer/"], ["Mock interview", "/comonk/interview-arena/"], ["Salary insights", "/comonk/salary-insights/"],
      ["Company & offer scorecard", "/comonk/company-reviews/"], ["Interview experiences", "/comonk/interview-experiences/"],
    ],
    agency: [
      ["AI dev terminal", "/sevenforce/devin-terminal/"], ["Workflow builder", "/sevenforce/workflows/"],
      ["AI employees", "/sevenforce/marketplace/"], ["ROI calculator", "/sevenforce/roi-calculator/"],
      ["Growth flywheel", "/sevenforce/flywheel-simulator.html"],
    ],
    sevenseed: [
      ["All ventures", "/ventures/"], ["AgenticOS", "/agenticos/"], ["Syndicate calculator", "/syndicate-ruv/"],
      ["Market sizing", "/market-sizing/"], ["Your AI keys", "/byok/"], ["Web3 Studio", "/web3-studio/"],
    ],
  };

  function ssProofHex(buf) {
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function injectVentureProofSection() {
    if (document.getElementById("ss-proof") || path.indexOf("/web3-studio") === 0) return;
    const mainEl = document.querySelector("main") || document.body;
    const footerEl = mainEl.querySelector("footer");
    const v = detectVentureProfile();
    const tools = SS_TOOL_DIRECTORY[v.key] || [];

    const sec = document.createElement("section");
    sec.id = "ss-proof";
    sec.setAttribute("aria-labelledby", "ss-proof-h");
    sec.innerHTML = `
      <div class="ss-proof-grid">
        <div>
          <p class="ss-proof-eyebrow">Proof of file · Web3</p>
          <h2 id="ss-proof-h">Fingerprint a file</h2>
          <p class="ss-proof-text">${SS_PROOF_USE[v.key] || SS_PROOF_USE.sevenseed} The file stays on your device.</p>
          <label class="ss-proof-drop">
            <input type="file" id="ss-proof-file" />
            <span><strong>Choose a file</strong> to get its SHA-256 fingerprint</span>
          </label>
          <div id="ss-proof-out" aria-live="polite"></div>
        </div>
        ${tools.length ? `<nav aria-label="${v.name} tools"><p class="ss-proof-eyebrow">More ${v.name} tools</p><ul class="ss-proof-tools"></ul></nav>` : ""}
      </div>`;
    const list = sec.querySelector(".ss-proof-tools");
    tools.forEach(([label, href]) => {
      if (href.replace(/\/$/, "") === path.replace(/\/$/, "").replace(/\.html$/, "")) return;
      list.appendChild(ssEl("li", {}, [ssEl("a", { textContent: label, href })]));
    });

    if (footerEl && footerEl.parentNode === mainEl) mainEl.insertBefore(sec, footerEl);
    else mainEl.appendChild(sec);

    const out = sec.querySelector("#ss-proof-out");
    sec.querySelector("#ss-proof-file").addEventListener("change", async (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      out.textContent = "Working…";
      try {
        const hash = ssProofHex(await crypto.subtle.digest("SHA-256", await f.arrayBuffer()));
        out.innerHTML = "";
        out.appendChild(ssEl("p", { className: "ss-proof-name", textContent: f.name }));
        out.appendChild(ssEl("code", { className: "ss-proof-hash", textContent: hash }));
        const copy = ssEl("button", { type: "button", className: "ss-proof-btn", textContent: "Copy" });
        copy.addEventListener("click", () => {
          navigator.clipboard && navigator.clipboard.writeText(hash).then(() => { copy.textContent = "Copied"; });
        });
        const go = ssEl("a", { className: "ss-proof-btn ss-proof-primary", textContent: "Sign or record it on chain →", href: "/web3-studio/?hash=" + hash });
        out.appendChild(ssEl("div", { className: "ss-proof-actions" }, [copy, go]));
      } catch (err) {
        out.textContent = "Couldn't read that file: " + String(err && err.message ? err.message : err);
      }
    });
  }

  function injectFloatingQuickDock() {
    if (document.getElementById("adv-floating-dock") || path.indexOf("/web3-studio") === 0) return;
    const v = detectVentureProfile();
    const dock = document.createElement("div");
    dock.id = "adv-floating-dock";
    dock.innerHTML = `
      <a href="${v.hubUrl}" class="adv-dock-btn">${v.key === "sevenseed" ? "Sevenseed home" : v.name}</a>
      <a href="#ss-proof" class="adv-dock-btn adv-dock-btn-secondary">Fingerprint a file</a>
      <a href="/web3-studio/" class="adv-dock-btn adv-dock-btn-secondary">Web3 Studio</a>
    `;
    document.body.appendChild(dock);
  }


  // 7. One menu and footer across the older pages, so every page has the same structure.
  const SS_VENTURES = [
    ["Comonk Technology", "/comonk/"], ["Sevenforce", "/sevenforce/"], ["AVP University", "/avpu/"],
    ["AVP E-Mart", "/avp-emart/"], ["Decode Forest Pharmacy", "/pharmacy/"], ["Breakdown Factor", "/breakdown/"],
    ["AVP Charitable Trust", "/trust/"], ["Rakshak AI", "/rakshak-ai/"], ["Quant Terminal", "/quant-terminal/"],
    ["TerraPulse Climate", "/climate-agritech/"], ["UrbanGrid PropTech", "/proptech-studio/"], ["AgenticOS", "/agenticos/"],
  ];
  const SS_STUDIOS = [
    ["Deep Research", "/perplexity-research/"], ["Prompt-to-UI Builder", "/ai-ui-builder/"],
    ["Infinite Arch Canvas", "/infinite-canvas/"], ["Sprint OS", "/linear-os/"],
    ["WebGL2 Shader Lab", "/shader-3d-lab/"], ["Incorporation & 83(b)", "/stripe-atlas/"],
  ];
  const SS_SPROUT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>';

  function ssEl(tag, props, kids) {
    const el = Object.assign(document.createElement(tag), props || {});
    (kids || []).forEach((kid) => el.appendChild(kid));
    return el;
  }

  function ssIsNextPage() {
    return !!document.querySelector('script[src*="_next/static/chunks/main-app"]');
  }

  function ssFindLegacyNavs() {
    const vw = window.innerWidth;
    const found = Array.from(document.querySelectorAll('nav, .nav, .navbar, #mainNav, #navbar, [class*="topnav"], [class*="top-nav"]')).filter((el) => {
      if (el.closest("#ss-bar, #ss-proof, #adv-floating-dock, main, article")) return false;
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return style.display !== "none" && box.height > 0 && box.height < 170 && box.top < 130 && box.width > vw * 0.5 && !el.querySelector("h1");
    });
    return found.filter((el) => !found.some((other) => other !== el && other.contains(el)));
  }

  function injectSiteBar() {
    if (path === "/" || path === "/index.html" || ssIsNextPage() || document.getElementById("ss-bar")) return;

    // Keep each old menu's links, so hiding it loses no way around the section.
    const legacy = ssFindLegacyNavs();
    const seen = new Set();
    const sectionLinks = [];
    const hadFixedNav = legacy.some((el) => ["fixed", "sticky"].includes(getComputedStyle(el).position));
    legacy.forEach((el) => {
      el.querySelectorAll("a[href]").forEach((a) => {
        const label = (a.textContent || "").replace(/\s+/g, " ").trim();
        const href = a.getAttribute("href");
        if (!label || label.length > 34 || !href || href === "#" || seen.has(href)) return;
        seen.add(href);
        sectionLinks.push([label, href]);
      });
      el.classList.add("ss-legacy-nav");
    });

    const segment = path.split("/").filter(Boolean)[0] || "";
    const isSection = path.split("/").filter(Boolean).length > 1;
    const venture = isSection ? detectVentureProfile() : null;

    const makeList = (title, links) =>
      ssEl("div", {}, [ssEl("h2", { textContent: title })].concat(links.map(([label, href]) => ssEl("a", { textContent: label, href }))));

    const groups = [];
    if (sectionLinks.length) groups.push(makeList("In this section", sectionLinks.slice(0, 12)));
    groups.push(makeList("Ventures", SS_VENTURES));
    groups.push(makeList("Frontier Studios", SS_STUDIOS));
    const menu = ssEl("div", { id: "ss-menu", hidden: true }, groups);

    const toggle = ssEl("button", { type: "button", textContent: "Menu" });
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "ss-menu");
    const setOpen = (open) => {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(menu.hidden);
    });
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    const brand = ssEl("a", { className: "ss-brand", href: "/" });
    brand.innerHTML = '<span class="ss-mark">' + SS_SPROUT + "</span>Sevenseed";
    const parts = [brand];
    if (venture && venture.name) parts.push(ssEl("a", { className: "ss-crumb", textContent: venture.name, href: "/" + segment + "/" }));
    parts.push(ssEl("span", { className: "ss-push" }), toggle, ssEl("a", { className: "ss-cta", textContent: "Contact us", href: "/#contact" }), menu);
    const bar = ssEl("div", { id: "ss-bar" }, parts);
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Main");
    document.body.insertBefore(bar, document.body.firstChild);

    if (!hadFixedNav) {
      const current = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
      if (current < 76) document.body.style.paddingTop = "76px";
    }
  }

  function injectSiteFooter() {
    if (path === "/" || path === "/index.html" || document.getElementById("ss-foot")) return;
    const hasFooter = Array.from(document.querySelectorAll("footer")).some((el) => el.getBoundingClientRect().height > 0);
    if (hasFooter) return;

    const list = (links, className) =>
      ssEl("ul", { className: className || "" }, links.map(([label, href]) => ssEl("li", {}, [ssEl("a", { textContent: label, href })])));
    const about = ssEl("div", {}, [
      ssEl("p", { className: "ss-name", textContent: "Sevenseed" }),
      ssEl("p", { textContent: "An AI venture studio in Ahmedabad, building intelligent ventures and developer studios on one shared platform." }),
    ]);
    const ventures = ssEl("div", {}, [ssEl("h2", { textContent: "Ventures" }), list(SS_VENTURES, "ss-two")]);
    const company = ssEl("div", {}, [
      ssEl("h2", { textContent: "Frontier Studios" }),
      list([["Home", "/"], ["Deep Research", "/perplexity-research/"], ["Prompt-to-UI Builder", "/ai-ui-builder/"], ["Sprint OS", "/linear-os/"], ["Shader Lab", "/shader-3d-lab/"], ["Incorporation & 83(b)", "/stripe-atlas/"]]),
    ]);
    const legal = ssEl("p", { className: "ss-legal", textContent: "© " + new Date().getFullYear() + " Sevenseed. All rights reserved." });
    const foot = ssEl("footer", { id: "ss-foot" }, [ssEl("div", { className: "ss-grid" }, [about, ventures, company]), legal]);
    document.body.appendChild(foot);
  }

  // 8. v7.0 Scroll-Progress Laser & Cursor-Reactive Specular Cards
  function wireScrollLaserAndSpecularCards() {
    if (!document.getElementById("adv-scroll-laser")) {
      const laser = document.createElement("div");
      laser.id = "adv-scroll-laser";
      laser.setAttribute("aria-hidden", "true");
      document.body.appendChild(laser);
      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const pct = Math.min(100, Math.max(0, (window.scrollY / docH) * 100));
            laser.style.width = pct.toFixed(1) + "%";
            ticking = false;
          });
        },
        { passive: true }
      );
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll(".adv-v7-card").forEach((card) => {
      if (card.dataset.specWired === "1") return;
      card.dataset.specWired = "1";
      card.classList.add("adv-specular-card");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  // 9. v7.0 Global Cmd+K / Ctrl+K Command Palette & Inline Cited Research Omnibox
  const CMDK_ITEMS = [
    { label: "Deep Research Copilot", url: "/perplexity-research/", tag: "v7.0 AI Studio", kw: "search citations exa arxiv rag" },
    { label: "Prompt-to-UI Builder", url: "/ai-ui-builder/", tag: "v7.0 AI Studio", kw: "react tailwind code generator preview" },
    { label: "Infinite System Architecture Whiteboard", url: "/infinite-canvas/", tag: "v7.0 AI Studio", kw: "excalidraw eraser diagram rps latency" },
    { label: "Engineering Sprint OS", url: "/linear-os/", tag: "v7.0 AI Studio", kw: "issues kanban monte carlo velocity" },
    { label: "Sevenseed Quant & Options Greeks Terminal", url: "/quant-terminal/", tag: "v7.0 Venture", kw: "black scholes tradingview kelly bollinger rsi" },
    { label: "TerraPulse Climate & AgriTech AI", url: "/climate-agritech/", tag: "v7.0 Venture", kw: "carbon cbam scope 1 2 3 irrigation solar lcoe" },
    { label: "UrbanGrid PropTech & Real Estate AI", url: "/proptech-studio/", tag: "v7.0 Venture", kw: "dcf cap rate emi rent vs buy fsi zoning" },
    { label: "Live WebGL2 Shader Lab", url: "/shader-3d-lab/", tag: "v7.0 3D GPU", kw: "glsl fragment shader 3d uniform" },
    { label: "Incorporation & 83(b) Studio", url: "/stripe-atlas/", tag: "v7.0 Founder", kw: "delaware c-corp india mca gift city vesting" },
    { label: "Pregnancy & Breastfeeding Medicine Safety", url: "/pharmacy/pregnancy-lactation-safety/", tag: "v7.0 Clinical", kw: "rid milk grapefruit warfarin pediatric dose" },
    { label: "Crowdfunding Milestone Planner", url: "/trust/crowdfunding-milestones/", tag: "v7.0 Impact", kw: "tranche csr matching medical campaign" },
    { label: "Sevenseed Venture Studio Hub", url: "/", tag: "Hub", kw: "home ecosystem portfolio" },

    { label: "AVP University (AVPU)", url: "/avpu/", tag: "Venture", kw: "education dag flashcards courses" },
    { label: "AVP E-Mart Smart Shopping", url: "/avp-emart/", tag: "Venture", kw: "price tracker deals qcommerce" },
    { label: "Decode Forest Pharmacy", url: "/pharmacy/", tag: "Venture", kw: "jan aushadhi generics interactions" },
    { label: "Breakdown Factor Civil AI", url: "/breakdown/", tag: "Venture", kw: "boq cpwd construction timeline" },
    { label: "AVP Charitable Trust", url: "/trust/", tag: "Venture", kw: "80g form 10be ledger" },
    { label: "Rakshak AI Safety & Legal", url: "/rakshak-ai/", tag: "Venture", kw: "bns fir cyber threat radar" },
    { label: "Comonk Career Intelligence", url: "/comonk/", tag: "Venture", kw: "ats resume mock interview salary" },
    { label: "Sevenforce AI Employees", url: "/sevenforce/", tag: "Venture", kw: "agents automation roi coding assistant" },
    { label: "Web3 Live Chain & Proof Studio", url: "/web3-studio/", tag: "Web3", kw: "ethereum polygon base solana sha256" },
    { label: "Universal BYOK API Key Vault", url: "/byok/", tag: "Settings", kw: "groq gemini openai anthropic" },
  ];

  function openCommandPalette() {
    wireGlobalCommandPalette();
    const bd = document.getElementById("adv-cmdk-backdrop");
    const inp = document.getElementById("adv-cmdk-input");
    if (!bd) return;
    bd.classList.add("open");
    if (inp) {
      inp.value = "";
      inp.dispatchEvent(new Event("input"));
      setTimeout(() => inp.focus(), 20);
    }
  }

  function closeCommandPalette() {
    const bd = document.getElementById("adv-cmdk-backdrop");
    if (bd) bd.classList.remove("open");
  }

  function wireGlobalCommandPalette() {
    if (document.getElementById("adv-cmdk-backdrop")) return;
    const bd = document.createElement("div");
    bd.id = "adv-cmdk-backdrop";
    bd.setAttribute("role", "dialog");
    bd.setAttribute("aria-modal", "true");
    bd.setAttribute("aria-label", "Command Palette & Research Omnibox");
    bd.innerHTML = `
      <div id="adv-cmdk-dialog">
        <div id="adv-cmdk-header">
          <span style="font-size:15px;color:#38bdf8;font-weight:800;">⌘K</span>
          <input id="adv-cmdk-input" type="text" placeholder="Jump to any Venture/Studio, or type a question and click Ask AI..." autocomplete="off" />
          <button type="button" id="adv-cmdk-ask-btn" style="padding:6px 12px;border-radius:10px;border:1px solid rgba(16,185,129,0.5);background:rgba(16,185,129,0.18);color:#6ee7b7;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🔎 Ask Research AI</button>
          <button type="button" id="adv-cmdk-close-btn" style="padding:5px 10px;border-radius:8px;border:1px solid rgba(148,163,184,0.25);background:transparent;color:#94a3b8;font-size:11px;cursor:pointer;">Esc</button>
        </div>
        <div id="adv-cmdk-ai-out"></div>
        <div id="adv-cmdk-list"></div>
        <div id="adv-cmdk-foot">
          <span>↑↓ / Click to navigate · Enter opens top match</span>
          <span>126 Reference Sites · 13 Ventures & Frontier Studios</span>
        </div>
      </div>
    `;
    document.body.appendChild(bd);

    const inp = document.getElementById("adv-cmdk-input");
    const listEl = document.getElementById("adv-cmdk-list");
    const aiOut = document.getElementById("adv-cmdk-ai-out");
    const askBtn = document.getElementById("adv-cmdk-ask-btn");
    const closeBtn = document.getElementById("adv-cmdk-close-btn");

    function renderMatches(q) {
      const needle = (q || "").trim().toLowerCase();
      const filtered = !needle
        ? CMDK_ITEMS
        : CMDK_ITEMS.filter((it) => (it.label + " " + it.tag + " " + it.kw + " " + it.url).toLowerCase().includes(needle));
      listEl.innerHTML = filtered.length
        ? filtered
            .slice(0, 14)
            .map(
              (it, idx) => `
            <a href="${it.url}" class="adv-cmdk-item${idx === 0 ? " active" : ""}">
              <span>${it.label}</span>
              <span class="adv-cmdk-tag">${it.tag}</span>
            </a>`
            )
            .join("")
        : `<div style="padding:14px;color:#94a3b8;font-size:13px;">No direct route match for "${needle.replace(/[<>&"]/g, "")}" — click <strong>🔎 Ask Research AI</strong> above to run multi-source cited research.</div>`;
    }

    renderMatches("");
    inp.addEventListener("input", () => renderMatches(inp.value));
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = listEl.querySelector("a.adv-cmdk-item");
        if (first) {
          window.location.href = first.getAttribute("href");
        } else {
          askBtn.click();
        }
      }
    });

    askBtn.addEventListener("click", async () => {
      const q = (inp.value || "").trim() || "Compare Delaware C-Corp vs India Pvt Ltd for AI startups";
      aiOut.style.display = "block";
      aiOut.textContent = "Synthesizing cited multi-hop research for: " + q + " ...";
      try {
        const res = await fetch("/api/perplexity/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, focus: "all" }),
        });
        const data = await res.json();
        const cites = (data.sources || []).map((s) => `[${s.id}] ${s.title} (${s.url})`).join("\n");
        aiOut.textContent = (data.cited_answer_markdown || "") + "\nSources:\n" + cites;
      } catch (err) {
        aiOut.textContent = "Research request failed: " + String(err);
      }
    });

    closeBtn.addEventListener("click", closeCommandPalette);
    bd.addEventListener("click", (e) => {
      if (e.target === bd) closeCommandPalette();
    });
  }

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const bd = document.getElementById("adv-cmdk-backdrop");
      if (bd && bd.classList.contains("open")) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === "Escape") {
      closeCommandPalette();
    }
  });

  function boot() {
    wireUniversalNavbar();
    ensureSemanticH1Header();
    // The homepage has its own footer and calls to action; these bars belong on tool pages.
    if (path !== "/" && path !== "/index.html") {
      injectFloatingQuickDock();
      injectVentureProofSection();
    }
    injectSiteBar();
    injectSiteFooter();
    wireScrollLaserAndSpecularCards();
    wireGlobalCommandPalette();
    setTimeout(() => {
      hydrateHero3DContainers();
    }, 150);
  }

  function scheduleBoot() {
    const hasNextHydration = !!document.querySelector('script[src*="_next/static/chunks/main-app"]');
    if (!hasNextHydration) {
      boot();
      return;
    }
    const waitForReactHydration = () => {
      const t0 = performance.now();
      const poll = () => {
        const m = document.querySelector("main");
        const target = (m && m.lastElementChild) || m || document.body;
        const hydrated =
          target &&
          Object.keys(target).some((k) => k.startsWith("__reactFiber$") || k.startsWith("__reactProps$"));
        if (hydrated || performance.now() - t0 > 1500) {
          requestAnimationFrame(() => setTimeout(boot, 20));
        } else {
          setTimeout(poll, 25);
        }
      };
      poll();
    };
    if (document.readyState === "complete") {
      waitForReactHydration();
    } else {
      window.addEventListener("load", waitForReactHydration, { once: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleBoot);
  } else {
    scheduleBoot();
  }
})();
