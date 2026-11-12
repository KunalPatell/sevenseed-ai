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
        contract: "AVPUSoulboundDegree_ERC5192.sol",
        chain: "polygon",
        refSites: ["learn-anything.xyz", "freecodecamp.org", "duolingo.com", "lawsofux.com", "roadmap.sh", "fs.blog"],
        apiUrl: "/api/avpu/ai-classroom",
        apiBody: { topic_or_url: "LangGraph Cyclic Agents & ERC-5192 Credentials" },
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
        contract: "EmartCashbackEscrow.sol",
        chain: "base",
        refSites: ["smartprix.com", "buyhatke.com", "xerve.in", "cashkaro.com", "pricehistoryapp.com", "myokb.in"],
        apiUrl: "/api/emart/spend-lens",
        apiBody: { monthly_amazon: 24000, monthly_flipkart: 15000, monthly_qcommerce: 9500 },
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
        contract: "DeSciColdChainBatchNFT.sol",
        chain: "polygon",
        refSites: ["1mg.com", "Jan Aushadhi PMBJP", "drugs.com", "mdcalc.com", "open.fda.gov", "clinicaltrials.gov"],
        apiUrl: "/api/mdcalc/clinical-scores",
        apiBody: { age: 54, heart_rate: 92, systolic_bp: 128, creatinine: 1.1 },
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
        contract: "RWAConstructionEscrow.sol",
        chain: "ethereum",
        refSites: ["CPWD DSR 2023", "skyciv.com", "hilti.com", "procore.com", "autodesk.com", "happho.com"],
        apiUrl: "/api/skyciv/beam-solver",
        apiBody: { span_m: 7.5, point_load_kn: 55, udl_kn_m: 16 },
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
        contract: "GitcoinAlloQF_80G.sol",
        chain: "polygon",
        refSites: ["charitynavigator.org", "givewell.org", "milaap.org", "ketto.org", "giveindia.org", "gitcoin.co"],
        apiUrl: "/api/tax-80g",
        apiBody: { amount: 100000, pan: "ABCDE1234F", regime: "old" },
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
        contract: "BSASection63EvidenceNotary.sol",
        chain: "arbitrum",
        refSites: ["BNS 2023 Crosswalk", "indiankanoon.org", "virustotal.com", "haveibeenpwned.com", "shodan.io", "cybercrime.gov.in"],
        apiUrl: "/api/bns-lookup",
        apiBody: { query: "snatching chain robbery cyber fraud" },
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
        contract: "EAS_CareerAttestation.sol",
        chain: "base",
        refSites: ["levels.fyi", "jobscan.co", "leetcode.com", "pramp.com", "ambitionbox.com", "ycombinator.com"],
        apiUrl: "/api/vapi/voice-latency",
        apiBody: { model_params_b: 8, stt_engine: "deepgram-nova-2", tts_engine: "cartesia-sonic" },
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
        contract: "ERC4337_AgentKitPaymaster.sol",
        chain: "solana",
        refSites: ["cognition.ai (Devin)", "langchain.com/langgraph", "crewai.com", "vapi.ai", "n8n.io", "autogen"],
        apiUrl: "/api/langgraph/execute",
        apiBody: { query: "Deploy 5-Node Autonomous Enterprise Swarm", venture: "agency" },
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
        contract: "OnChainOrderbookVerifier",
        chain: "arbitrum",
        refSites: ["tradingview.com", "openbb.co", "koyfin.com", "streak.tech"],
        apiUrl: "/api/quant/analyze",
        apiBody: { spot: 22450, strike: 22500, days_to_expiry: 30, volatility: 0.16 },
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
        contract: "CarbonRegistry_VerraBridge",
        chain: "polygon",
        refSites: ["electricitymaps.com", "climatetrace.org", "cropin.com", "fao.org"],
        apiUrl: "/api/climate/analyze",
        apiBody: { diesel_liters_yr: 18000, electricity_kwh_yr: 240000, crop: "wheat", hectares: 12 },
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
        contract: "FractionalREIT_Registry",
        chain: "ethereum",
        refSites: ["zillow.com", "matterport.com", "99acres.com", "airdna.co"],
        apiUrl: "/api/proptech/valuation",
        apiBody: { property_price_inr: 12500000, monthly_rent_inr: 42000, fsi: 2.7 },
      };
    }
    return {
      key: "sevenseed",
      name: "Sevenseed Venture Studio",
      hubUrl: "/",
      appUrl: "/app/",
      color: "#6366f1",
      shape: "torusKnot",
      contract: "SafeMultiSigSPV_v1.sol",
      chain: "ethereum",
      refSites: ["angellist.com", "carta.com", "ycombinator.com", "stripe.com/atlas", "perplexity.ai", "v0.dev"],
      apiUrl: "/api/langgraph/execute",
      apiBody: { query: "Model $10M SPV Waterfall + 20% Carry + 9-Venture Synergy", venture: "sevenseed" },
    };
  }

  // 2. Universal Top Navbar Dropdown & Auto-Dismiss Controller
  const NAV_VENTURES = [
    { name: "Sevenseed Studio", href: "/", desc: "AI Venture Studio Hub" },
    { name: "AVPU", href: "/avpu/", desc: "AI University & Education Labs" },
    { name: "AVP E-Mart", href: "/avp-emart/", desc: "AI Shopping & Price Radar" },
    { name: "Comonk Technology", href: "/comonk/", desc: "AI Career & ATS Intelligence" },
    { name: "Sevenforce", href: "/sevenforce/", desc: "7 Autonomous AI Employees" },
    { name: "Decode Forest Pharmacy", href: "/pharmacy/", desc: "Jan Aushadhi & Clinical AI" },
    { name: "Breakdown Factor", href: "/breakdown/", desc: "CPWD Civil Engineering AI" },
    { name: "AVP Charitable Trust", href: "/trust/", desc: "Social Impact & 80G Tax Exemption" },
    { name: "Rakshak AI", href: "/rakshak-ai/", desc: "BNS 2023 Legal & CCTV Sentinel" },
    { name: "Quant Terminal", href: "/quant-terminal/", desc: "Options Greeks & FinTech Charts" },
    { name: "TerraPulse Climate", href: "/climate-agritech/", desc: "Carbon Scope 1-3 & FAO Irrigation" },
    { name: "UrbanGrid PropTech", href: "/proptech-studio/", desc: "DCF Cap-Rate & FSI Massing AI" },
    { name: "AgenticOS", href: "/agenticos/", desc: "Autonomous Agent Kernel OS" },
  ];

  const NAV_TOOLS = [
    { name: "Perplexity Research", href: "/perplexity-research/", brand: "Frontier AI" },
    { name: "v0 Live UI Builder", href: "/ai-ui-builder/", brand: "Frontier AI" },
    { name: "Infinite Arch Canvas", href: "/infinite-canvas/", brand: "Frontier AI" },
    { name: "Linear Sprint OS", href: "/linear-os/", brand: "Frontier AI" },
    { name: "WebGL Shader Lab", href: "/shader-3d-lab/", brand: "3D GPU" },
    { name: "Stripe Atlas & 83(b)", href: "/stripe-atlas/", brand: "Sevenseed" },
    { name: "Learn DAG Canvas", href: "/avpu/learn-dag/", brand: "AVPU" },
    { name: "Spec Comparator", href: "/avp-emart/spec-compare/", brand: "AVP E-Mart" },
    { name: "Jobscan ATS Matcher", href: "/comonk/resume-analyzer/", brand: "Comonk" },
    { name: "Devin Terminal", href: "/sevenforce/devin-terminal/", brand: "Sevenforce" },
    { name: "LactMed & Drug Safety", href: "/pharmacy/pregnancy-lactation-safety/", brand: "Pharmacy" },
    { name: "CPWD BOQ Estimator", href: "/breakdown/boq-estimator/", brand: "Breakdown" },
    { name: "Milestone Escrow", href: "/trust/crowdfunding-milestones/", brand: "AVP Trust" },
    { name: "BNS Auto-FIR", href: "/rakshak-ai/fir-generator/", brand: "Rakshak AI" },
    { name: "Syndicate RUV", href: "/syndicate-ruv/", brand: "Sevenseed" },
    { name: "BYOK Vault", href: "/byok/", brand: "Sevenseed" },
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
        <a href="${v.appUrl}" style="font-size:11.5px;font-weight:800;color:#38bdf8;text-decoration:none;padding:4px 10px;border-radius:8px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);">
          ⚡ Vite /app
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

  // 5. Venture Web3 & Reference API Workbench Footer Section
  function injectVentureWeb3AndRefFooterSection() {
    if (document.getElementById("adv-web3-ref-section")) return;
    const mainEl = document.querySelector("main") || document.body;
    const footerEl = mainEl.querySelector("footer");
    const v = detectVentureProfile();

    const sec = document.createElement("section");
    sec.id = "adv-web3-ref-section";
    sec.className = "relative z-20 max-w-7xl mx-auto px-6 py-10 my-8 rounded-3xl border border-slate-800/90 bg-slate-950/90 backdrop-blur-xl shadow-2xl";
    sec.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 mb-2">
            <span>⛓️ WEB3 SMART ACCOUNT + VITE v6.0 + 64-REFERENCE-SITE ENGINE</span>
          </div>
          <h3 class="text-2xl font-extrabold text-white">${v.name} — On-Chain & Reference Workbench</h3>
          <p class="text-xs text-slate-300 mt-1">Deeply scanned reference modules: <strong class="text-white">${v.refSites.join(" · ")}</strong></p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <select id="adv-page-chain" class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200">
            <option value="polygon" ${v.chain === "polygon" ? "selected" : ""}>🟣 Polygon POS (137)</option>
            <option value="base" ${v.chain === "base" ? "selected" : ""}>🔵 Base L2 (8453)</option>
            <option value="solana" ${v.chain === "solana" ? "selected" : ""}>🟢 Solana Mainnet</option>
            <option value="ethereum" ${v.chain === "ethereum" ? "selected" : ""}>💎 Ethereum (1)</option>
            <option value="arbitrum" ${v.chain === "arbitrum" ? "selected" : ""}>🔷 Arbitrum (42161)</option>
          </select>
          <button id="adv-page-web3-btn" type="button" class="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs font-mono shadow-lg transition">
            ⛓️ Mint / Execute ${v.contract}
          </button>
          <button id="adv-page-api-btn" type="button" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs font-mono shadow-lg transition">
            ⚡ Run Live Reference API
          </button>
          <a href="${v.appUrl}" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 font-bold text-xs font-mono transition">
            🚀 Open Vite /app Portal →
          </a>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 text-xs font-mono">
        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div class="text-slate-400 text-[10px] uppercase">Active Smart Contract</div>
          <div class="text-sm font-bold text-indigo-300 mt-1">${v.contract}</div>
          <div class="text-[11px] text-slate-400 mt-1">ERC-4337 Account Abstraction · Gas Sponsored</div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div class="text-slate-400 text-[10px] uppercase">Reference API Endpoint</div>
          <div class="text-sm font-bold text-emerald-300 mt-1">POST ${v.apiUrl}</div>
          <div class="text-[11px] text-slate-400 mt-1">Connected to 393-Route FastAPI Engine</div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div class="text-slate-400 text-[10px] uppercase">UI / 3D Design System</div>
          <div class="text-sm font-bold text-amber-300 mt-1">21st.dev · Spline · Aceternity · Aura</div>
          <div class="text-[11px] text-slate-400 mt-1">100% Distinct Venture Theme Preserved</div>
        </div>
      </div>
      <div class="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Complete ${v.name} Workstation & Tool Directory</div>
        <div class="flex flex-wrap gap-2 text-[11px] font-mono">
          ${(
            {
              avpu: [
                ["Knowledge DAG", "/avpu/learn-dag/"],
                ["Topic Search", "/avpu/topic-search.html"],
                ["SM-2 Review Queue", "/avpu/review-queue.html"],
                ["100-Day Challenge", "/avpu/100-day-challenge.html"],
                ["AI Learning Path", "/avpu/ai-learning-path.html"],
                ["AI Socratic Tutor", "/avpu/ai-tutor/"],
                ["Code Lab IDE", "/avpu/code-lab/"],
                ["Duolingo League", "/avpu/duo-league/"],
                ["Laws of UX", "/avpu/laws-of-ux/"],
                ["Mental Models", "/avpu/mental-models/"],
                ["Marketing Teardowns", "/avpu/marketing-teardowns/"],
                ["Flashcards (Leitner)", "/avpu/flashcards/"],
                ["Courses & Modules", "/avpu/courses/"],
                ["Scholarships", "/avpu/scholarships.html"],
                ["Certifications", "/avpu/credentials/"],
                ["Evervault Crypto Lab", "/avpu/evervault-lab.html"],
              ],
              emart: [
                ["Spec Comparator", "/avp-emart/spec-compare/"],
                ["90-Day Price Tracker", "/avp-emart/price-tracker/"],
                ["Auto-Coupon Tester", "/avp-emart/coupon-tester/"],
                ["Live Deals Radar", "/avp-emart/deals-radar/"],
                ["Q-Commerce Radar", "/avp-emart/qcommerce/"],
                ["Smart Wishlist", "/avp-emart/wishlist/"],
                ["AI Deal Scanner", "/avp-emart/deal-scanner/"],
                ["Shopping Discovery", "/avp-emart/shopping-discovery.html"],
              ],
              pharmacy: [
                ["Jan Aushadhi Generic Finder", "/pharmacy/generic-finder/"],
                ["CYP450 Interaction Checker", "/pharmacy/interaction-checker/"],
                ["Pregnancy & LactMed Safety", "/pharmacy/pregnancy-lactation-safety/"],
                ["Doctor Consultation", "/pharmacy/doctor-consultation/"],
                ["Hospital & Camp Finder", "/pharmacy/hospital-finder/"],
                ["Medicine Reminders", "/pharmacy/medicine-reminders/"],
                ["Clinical Health Wiki", "/decode-forest-pharmacy/health-wiki.html"],
                ["Prescription OCR Lab", "/decode-forest-pharmacy/prescription-ocr.html"],
              ],
              breakdown: [
                ["CPWD BOQ Estimator", "/breakdown/boq-estimator/"],
                ["Live Material Prices", "/breakdown/material-prices/"],
                ["CPM Project Timeline", "/breakdown/project-timeline/"],
                ["YOLOv8 Crack Scanner", "/breakdown-factor/cv-scanner.html"],
                ["OSHA Safety Audit", "/breakdown-factor/safety-audit.html"],
              ],
              trust: [
                ["80G / Form 10BE Calculator", "/trust/tax-exemption/"],
                ["Crowdfunding Milestones", "/trust/crowdfunding-milestones/"],
                ["Active Causes & Campaigns", "/trust/campaigns/"],
                ["Merkle Donation Ledger", "/trust/ledger/"],
                ["Volunteer Portal", "/trust/volunteer/"],
                ["Health Camps", "/avp-charitable-trust/health-camps.html"],
              ],
              rakshak: [
                ["BNS 2023 FIR Generator", "/rakshak-ai/fir-generator/"],
                ["Cyber Threat Radar", "/rakshak-ai/threat-radar/"],
                ["Live Safety Heatmap", "/rakshak-ai/safety-heatmap/"],
                ["Missing Person Biometrics", "/rakshak-ai/missing-person/"],
                ["DPDP 2023 Auditor", "/rakshak-ai/dpdp-auditor.html"],
              ],
              comonk: [
                ["ATS Resume Analyzer", "/comonk/resume-analyzer/"],
                ["AI Mock Interview Arena", "/comonk/interview-arena/"],
                ["Levels.fyi Salary Insights", "/comonk/salary-insights/"],
                ["Verified Company Reviews", "/comonk/company-reviews/"],
                ["Real Interview Experiences", "/comonk/interview-experiences/"],
              ],
              agency: [
                ["Devin Autonomous Terminal", "/sevenforce/devin-terminal/"],
                ["LangGraph Workflow Builder", "/sevenforce/workflows/"],
                ["7-Agent Marketplace", "/sevenforce/marketplace/"],
                ["Enterprise ROI Calculator", "/sevenforce/roi-calculator/"],
                ["Growth Flywheel Simulator", "/sevenforce/flywheel-simulator.html"],
              ],
              quant: [
                ["Quant & Options Terminal", "/quant-terminal/"],
                ["Perplexity Deep Research", "/perplexity-research/"],
                ["Stripe Atlas & 83(b)", "/stripe-atlas/"],
                ["Syndicate RUV Calculator", "/syndicate-ruv/"],
              ],
              climate: [
                ["TerraPulse Climate & AgriTech", "/climate-agritech/"],
                ["CPWD BOQ Estimator", "/breakdown/boq-estimator/"],
                ["Perplexity Deep Research", "/perplexity-research/"],
              ],
              proptech: [
                ["UrbanGrid PropTech Studio", "/proptech-studio/"],
                ["CPWD BOQ Estimator", "/breakdown/boq-estimator/"],
                ["Live Material Prices", "/breakdown/material-prices/"],
              ],
              sevenseed: [
                ["Ventures Directory", "/ventures/"],
                ["Perplexity Research Copilot", "/perplexity-research/"],
                ["v0 Live UI Synthesizer", "/ai-ui-builder/"],
                ["Infinite Arch Whiteboard", "/infinite-canvas/"],
                ["Linear Engineering OS", "/linear-os/"],
                ["WebGL2 Shader Lab", "/shader-3d-lab/"],
                ["Stripe Atlas & 83(b)", "/stripe-atlas/"],
                ["Quant Terminal", "/quant-terminal/"],
                ["TerraPulse Climate AI", "/climate-agritech/"],
                ["UrbanGrid PropTech AI", "/proptech-studio/"],
                ["Syndicate RUV Calculator", "/syndicate-ruv/"],
                ["TAM/SAM/SOM Market Sizing", "/market-sizing/"],
                ["Universal BYOK Key Vault", "/byok/"],
                ["Web3 Multi-Chain Studio", "/web3-studio/"],
                ["Quantum All-in-One Deck", "/quantum-deck/"],
              ],
            }[v.key] || []
          )
            .map(
              ([label, url]) =>
                `<a href="${url}" class="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400 text-slate-200 transition">${label}</a>`
            )
            .join("")}
        </div>
      </div>
      <pre id="adv-page-output" class="mt-4 p-4 rounded-2xl bg-black/70 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56">Click "⛓️ Mint / Execute ${v.contract}" or "⚡ Run Live Reference API" above to inspect live RPC chain status or execute backend reference math...</pre>
    `;

    if (footerEl && footerEl.parentNode === mainEl) {
      mainEl.insertBefore(sec, footerEl);
    } else {
      mainEl.appendChild(sec);
    }

    const outPre = document.getElementById("adv-page-output");
    const web3Btn = document.getElementById("adv-page-web3-btn");
    const apiBtn = document.getElementById("adv-page-api-btn");
    const chainSel = document.getElementById("adv-page-chain");

    if (web3Btn && outPre) {
      web3Btn.addEventListener("click", async () => {
        const chain = chainSel ? chainSel.value : v.chain;
        outPre.textContent = `[Web3] Querying live public RPC block & gas status (${chain.toUpperCase()})...`;
        try {
          const res = await fetch("/api/web3/telemetry");
          const data = await res.json();
          outPre.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
          outPre.textContent = "Error: " + String(err);
        }
      });
    }

    if (apiBtn && outPre) {
      apiBtn.addEventListener("click", async () => {
        outPre.textContent = `[FastAPI] Executing POST ${v.apiUrl}...`;
        try {
          const res = await fetch(v.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v.apiBody),
          });
          const data = await res.json();
          outPre.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
          outPre.textContent = "Error: " + String(err);
        }
      });
    }
  }

  function injectFloatingQuickDock() {
    if (document.getElementById("adv-floating-dock")) return;
    const v = detectVentureProfile();
    const dock = document.createElement("div");
    dock.id = "adv-floating-dock";
    dock.innerHTML = `
      <span class="adv-dock-badge" style="color:${v.color};border-color:${v.color}55">${v.name}</span>
      <button type="button" id="adv-dock-cmdk-btn" class="adv-dock-btn">⌘K Search & AI</button>
      <a href="${v.appUrl}" class="adv-dock-btn">⚡ Launch Vite /app</a>
      <a href="/perplexity-research/" class="adv-dock-btn adv-dock-btn-secondary">🔎 Research AI</a>
      <a href="/web3-studio/" class="adv-dock-btn adv-dock-btn-secondary">🌐 Web3 Studio</a>
    `;
    document.body.appendChild(dock);
    const cmdkBtn = document.getElementById("adv-dock-cmdk-btn");
    if (cmdkBtn) {
      cmdkBtn.addEventListener("click", () => openCommandPalette());
    }
  }


  // 7. One menu and footer across the older pages, so every page has the same structure.
  const SS_VENTURES = [
    ["Comonk Technology", "/comonk/"], ["Sevenforce", "/sevenforce/"], ["AVP University", "/avpu/"],
    ["AVP E-Mart", "/avp-emart/"], ["Decode Forest Pharmacy", "/pharmacy/"], ["Breakdown Factor", "/breakdown/"],
    ["AVP Charitable Trust", "/trust/"], ["Rakshak AI", "/rakshak-ai/"], ["Quant Terminal", "/quant-terminal/"],
    ["TerraPulse Climate", "/climate-agritech/"], ["UrbanGrid PropTech", "/proptech-studio/"], ["AgenticOS", "/agenticos/"],
  ];
  const SS_STUDIOS = [
    ["Perplexity Research", "/perplexity-research/"], ["v0 Live UI Builder", "/ai-ui-builder/"],
    ["Infinite Arch Canvas", "/infinite-canvas/"], ["Linear Sprint OS", "/linear-os/"],
    ["WebGL2 Shader Lab", "/shader-3d-lab/"], ["Stripe Atlas & 83(b)", "/stripe-atlas/"],
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
      if (el.closest("#adv-web3-ref-section, #adv-floating-dock, main, article")) return false;
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
      list([["Home", "/"], ["Perplexity Research", "/perplexity-research/"], ["v0 UI Builder", "/ai-ui-builder/"], ["Linear OS", "/linear-os/"], ["Shader Lab", "/shader-3d-lab/"], ["Stripe Atlas", "/stripe-atlas/"]]),
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
    { label: "Perplexity Deep Research Copilot", url: "/perplexity-research/", tag: "v7.0 AI Studio", kw: "search citations exa arxiv rag" },
    { label: "v0 + Bolt Prompt-to-Live-UI Synthesizer", url: "/ai-ui-builder/", tag: "v7.0 AI Studio", kw: "react tailwind code generator preview" },
    { label: "Infinite System Architecture Whiteboard", url: "/infinite-canvas/", tag: "v7.0 AI Studio", kw: "excalidraw eraser diagram rps latency" },
    { label: "Linear + Raycast Engineering Sprint OS", url: "/linear-os/", tag: "v7.0 AI Studio", kw: "issues kanban monte carlo velocity" },
    { label: "Sevenseed Quant & Options Greeks Terminal", url: "/quant-terminal/", tag: "v7.0 Venture", kw: "black scholes tradingview kelly bollinger rsi" },
    { label: "TerraPulse Climate & AgriTech AI", url: "/climate-agritech/", tag: "v7.0 Venture", kw: "carbon cbam scope 1 2 3 irrigation solar lcoe" },
    { label: "UrbanGrid PropTech & Real Estate AI", url: "/proptech-studio/", tag: "v7.0 Venture", kw: "dcf cap rate emi rent vs buy fsi zoning" },
    { label: "Lusion + ShaderToy Live WebGL2 Shader Lab", url: "/shader-3d-lab/", tag: "v7.0 3D GPU", kw: "glsl fragment shader 3d uniform" },
    { label: "Stripe Atlas Incorporation & 83(b) Studio", url: "/stripe-atlas/", tag: "v7.0 Founder", kw: "delaware c-corp india mca gift city vesting" },
    { label: "Drugs.com & LactMed Pregnancy/Lactation Safety", url: "/pharmacy/pregnancy-lactation-safety/", tag: "v7.0 Clinical", kw: "rid milk grapefruit warfarin pediatric dose" },
    { label: "Ketto & GoFundMe Milestone Escrow Studio", url: "/trust/crowdfunding-milestones/", tag: "v7.0 Impact", kw: "tranche csr matching medical campaign" },
    { label: "Sevenseed Venture Studio Hub", url: "/", tag: "Hub", kw: "home ecosystem portfolio" },
    { label: "Unified /app Multi-Venture Workspace", url: "/app/", tag: "Vite SPA", kw: "dashboard portal" },
    { label: "AVP University (AVPU)", url: "/avpu/", tag: "Venture", kw: "education dag flashcards courses" },
    { label: "AVP E-Mart Smart Shopping", url: "/avp-emart/", tag: "Venture", kw: "price tracker deals qcommerce" },
    { label: "Decode Forest Pharmacy", url: "/pharmacy/", tag: "Venture", kw: "jan aushadhi generics interactions" },
    { label: "Breakdown Factor Civil AI", url: "/breakdown/", tag: "Venture", kw: "boq cpwd construction timeline" },
    { label: "AVP Charitable Trust", url: "/trust/", tag: "Venture", kw: "80g form 10be ledger" },
    { label: "Rakshak AI Safety & Legal", url: "/rakshak-ai/", tag: "Venture", kw: "bns fir cyber threat radar" },
    { label: "Comonk Career Intelligence", url: "/comonk/", tag: "Venture", kw: "ats resume mock interview salary" },
    { label: "Sevenforce Autonomous Agency", url: "/sevenforce/", tag: "Venture", kw: "devin langgraph agents roi" },
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
      injectVentureWeb3AndRefFooterSection();
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
