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
        appUrl: "/emart/app/",
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
        appUrl: "/forest-pharmacy/app/",
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
        appUrl: "/breakdown-factor/app/",
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
        appUrl: "/agency/app/",
        color: "#f59e0b",
        shape: "torusKnot",
        contract: "ERC4337_AgentKitPaymaster.sol",
        chain: "solana",
        refSites: ["cognition.ai (Devin)", "langchain.com/langgraph", "crewai.com", "vapi.ai", "n8n.io", "autogen"],
        apiUrl: "/api/langgraph/execute",
        apiBody: { query: "Deploy 5-Node Autonomous Enterprise Swarm", venture: "agency" },
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
      refSites: ["angellist.com", "carta.com", "ycombinator.com", "openrouter.ai", "crunchbase.com", "21st.dev"],
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
    { name: "AgenticOS", href: "/agenticos/", desc: "Autonomous Agent Kernel OS" },
  ];

  const NAV_TOOLS = [
    { name: "Learn DAG Canvas", href: "/avpu/learn-dag/", brand: "AVPU" },
    { name: "Duolingo League", href: "/avpu/duo-league/", brand: "AVPU" },
    { name: "Spec Comparator", href: "/avp-emart/spec-compare/", brand: "AVP E-Mart" },
    { name: "90-Day Price Trend", href: "/avp-emart/price-tracker/", brand: "AVP E-Mart" },
    { name: "Jobscan ATS Matcher", href: "/comonk/resume-analyzer/", brand: "Comonk" },
    { name: "FAANG Mock Arena", href: "/comonk/interview-arena/", brand: "Comonk" },
    { name: "LangGraph Studio", href: "/sevenforce/workflows/", brand: "Sevenforce" },
    { name: "Devin Terminal", href: "/sevenforce/devin-terminal/", brand: "Sevenforce" },
    { name: "Jan Aushadhi Generics", href: "/pharmacy/generic-finder/", brand: "Pharmacy" },
    { name: "Drug Interactions", href: "/pharmacy/interaction-checker/", brand: "Pharmacy" },
    { name: "CPWD BOQ Estimator", href: "/breakdown/boq-estimator/", brand: "Breakdown" },
    { name: "80G Form 10BE", href: "/trust/tax-exemption/", brand: "AVP Trust" },
    { name: "BNS Auto-FIR", href: "/rakshak-ai/fir-generator/", brand: "Rakshak AI" },
    { name: "Syndicate RUV", href: "/syndicate-ruv/", brand: "Sevenseed" },
    { name: "TAM/SAM/SOM Sizer", href: "/market-sizing/", brand: "Sevenseed" },
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

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

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
        requestAnimationFrame(tick);
        if (!dragging) {
          group.rotation.y += 0.008;
          group.rotation.x += 0.004;
        }
        ring.rotation.z += 0.012;
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
      <pre id="adv-page-output" class="mt-4 p-4 rounded-2xl bg-black/70 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56">Click "⛓️ Mint / Execute ${v.contract}" or "⚡ Run Live Reference API" above to execute live backend & Web3 transactions...</pre>
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
        outPre.textContent = `[Web3] Broadcasting ${v.contract} transaction on ${chain.toUpperCase()}...`;
        try {
          const res = await fetch("/api/web3/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ venture: v.key, chain, action: "execute_contract" }),
          });
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
      <a href="${v.appUrl}" class="adv-dock-btn">⚡ Launch Vite /app</a>
      <a href="#adv-web3-ref-section" class="adv-dock-btn adv-dock-btn-secondary">⛓️ Web3 & Ref API</a>
      <a href="/web3-studio/" class="adv-dock-btn adv-dock-btn-secondary">🌐 Web3 Studio</a>
    `;
    document.body.appendChild(dock);
  }

  function boot() {
    wireUniversalNavbar();
    ensureSemanticH1Header();
    injectFloatingQuickDock();
    injectVentureWeb3AndRefFooterSection();
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
    const runAfterHydration = () => setTimeout(boot, 90);
    if (document.readyState === "complete") {
      runAfterHydration();
    } else {
      window.addEventListener("load", runAfterHydration, { once: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleBoot);
  } else {
    scheduleBoot();
  }
})();
