/*
 * Sevenseed Workstation Shell
 * ---------------------------------------------------------------------------
 * Single source of truth for every GitHub-derived workstation.
 *  - Renders one consistent top bar on every workstation page
 *    (<div id="ws-shell" data-ws="<slug>"></div>).
 *  - Renders the grouped workstation directory wherever
 *    <div id="ws-directory"></div> exists (workstations.html, index.html).
 * To add a workstation: add ONE entry to WORKSTATIONS below. Nothing else.
 */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'build',  label: 'Build & Engineering',  icon: 'fa-code',          color: '#38bdf8',
      blurb: 'Design systems, write and run code, and generate test coverage.' },
    { id: 'growth', label: 'Growth & Outreach',    icon: 'fa-bullhorn',      color: '#f472b6',
      blurb: 'Find, verify and reach customers across email, social and WhatsApp.' },
    { id: 'ops',    label: 'Operations & People',  icon: 'fa-people-group',  color: '#fbbf24',
      blurb: 'Query company data, summarise meetings and assess candidates.' },
    { id: 'telemetry', label: 'Telemetry & Hardware', icon: 'fa-satellite-dish', color: '#34d399',
      blurb: 'Decode sensor streams and run live timing for physical systems.' }
  ];

  var WORKSTATIONS = [
    // ── Build & Engineering ────────────────────────────────────────────────
    { slug: 'agentic-ai', cat: 'build', href: 'agentic-ai-studio.html', icon: 'fa-robot',
      title: 'Agentic AI Studio', source: 'AgenticOS · LangGraph', badge: 'AI Core',
      desc: 'Stateful multi-agent DAG workflow canvas with live execution trace.' },
    { slug: 'prd-architect', cat: 'build', href: 'prd-architect.html', icon: 'fa-file-code',
      title: 'PRD Architect', source: 'prd-architect', badge: 'New',
      desc: 'AI-assisted product requirements document generator with edge cases & API spec.' },
    { slug: 'architecture', cat: 'build', href: 'architecture-studio.html', icon: 'fa-sitemap',
      title: 'Architecture Studio', source: 'ba-document-with-ui',
      desc: 'Layered system architecture, directory trees and interactive wireframes.' },
    { slug: 'coding-agent', cat: 'build', href: 'coding-agent-studio.html', icon: 'fa-terminal',
      title: 'Coding Agent', source: 'CodingAgent2.0',
      desc: 'Multi-provider model picker, prompt skills and a local code runner.' },
    { slug: 'testable-qa', cat: 'build', href: 'testable-qa-studio.html', icon: 'fa-vial-circle-check',
      title: 'Testable QA Lab', source: 'testable-ai',
      desc: 'User stories, Gherkin acceptance criteria and a regression test matrix.' },
    { slug: 'spine', cat: 'build', href: 'spine-canvas.html', icon: 'fa-person-running',
      title: 'Spine 2D Rigging', source: 'spine_2d',
      desc: 'Forward-kinematics bone rigging with Spine JSON export.' },

    // ── Growth & Outreach ─────────────────────────────────────────────────
    { slug: 'market-sizing', cat: 'growth', href: 'market-sizing.html', icon: 'fa-chart-pie',
      title: 'Market Sizing Studio', source: 'market-sizing', badge: 'Live',
      desc: 'TAM, SAM, SOM calculations and Indian market sector projections.' },
    { slug: 'email-cleaner', cat: 'growth', href: 'email-cleaner.html', icon: 'fa-envelope-circle-check',
      title: 'Email Cleaner', source: 'Email-Existence-Validator',
      desc: 'Syntax, DNS MX, disposable-domain and SMTP checks for email lists.' },
    { slug: 'outreach', cat: 'growth', href: 'outreach-sequence-studio.html', icon: 'fa-paper-plane',
      title: 'Outreach Sequences', source: 'EmailAutomation',
      desc: 'Multi-step drip sequences, open tracking and reply classification.' },
    { slug: 'socialhub', cat: 'growth', href: 'socialhub-studio.html', icon: 'fa-share-nodes',
      title: 'SocialHub', source: 'socialhub',
      desc: 'Per-profile credentials, multi-platform copy and post scheduling.' },
    { slug: 'blog', cat: 'growth', href: 'ai-blog-studio.html', icon: 'fa-feather-pointed',
      title: 'AI Blog Studio', source: 'blogpost.ai',
      desc: 'Keyword topic discovery and long-form SEO article drafting.' },
    { slug: 'whatsway', cat: 'growth', href: 'whatsapp-crm-studio.html', icon: 'fa-comments',
      title: 'WhatsWay CRM', source: 'whatsway',
      desc: 'Shared WhatsApp inbox, journey flows and broadcast campaigns.' },
    { slug: 'price-comparator', cat: 'growth', href: 'price-comparator.html', icon: 'fa-cart-shopping',
      title: 'Price Comparator', source: 'price-com · bestseller-analytics',
      desc: 'Multi-store e-commerce price comparison, arbitrage savings and bestseller velocity.' },

    // ── Operations & People ───────────────────────────────────────────────
    { slug: 'startup-runway', cat: 'ops', href: 'startup-runway.html', icon: 'fa-calculator',
      title: 'Startup Runway & Burn', source: 'startup-runway', badge: 'New',
      desc: 'Cash runway modeling, burn rate simulation and hiring trajectory plans.' },
    { slug: 'syndicate-ruv', cat: 'ops', href: 'syndicate-ruv.html', icon: 'fa-coins',
      title: 'Syndicate RUV', source: 'syndicate-ruv', badge: 'Live',
      desc: 'Angel syndicate cap table and roll-up vehicle allocation modeler.' },
    { slug: 'operations', cat: 'ops', href: 'operations-intelligence.html', icon: 'fa-database',
      title: 'Operations Intelligence', source: 'ZohoAgent',
      desc: 'Plain-English questions over project and timesheet data.' },
    { slug: 'resume-matcher', cat: 'ops', href: 'resume-matcher.html', icon: 'fa-file-lines',
      title: 'Resume Matcher', source: 'resume-jd-matcher',
      desc: '50+ skill taxonomy ATS matcher, gap analysis and quantified bullets.' },
    { slug: 'pharmacy-studio', cat: 'ops', href: 'pharmacy-studio.html', icon: 'fa-heart-pulse',
      title: 'Pharmacy & SOS Hub', source: 'Decode Forest Pharmacy',
      desc: '24/7 emergency trauma hospitals, drug interaction matrix and free health camps.' },
    { slug: 'charitable-trust', cat: 'ops', href: 'charitable-trust.html', icon: 'fa-hand-holding-heart',
      title: 'Charitable Trust Ledger', source: 'AVP Charitable Trust',
      desc: 'Public transparency ledger of 100% free services and citizen emergency grants.' },
    { slug: 'meetbot', cat: 'ops', href: 'meeting-diarization-studio.html', icon: 'fa-headphones-simple',
      title: 'MeetBot', source: 'MeetBot_2.0',
      desc: 'Speaker-separated transcripts, summaries and transcript Q&A.' },
    { slug: 'interview', cat: 'ops', href: 'interview-radar.html', icon: 'fa-chart-pie',
      title: 'Interview Radar', source: 'ai-interview',
      desc: 'Five-axis competency scorecards for technical candidates.' },

    // ── Telemetry & Hardware ──────────────────────────────────────────────
    { slug: 'damage-vision', cat: 'telemetry', href: 'damage-vision.html', icon: 'fa-triangle-exclamation',
      title: 'YOLO Damage Vision', source: 'Breakdown Factor · best.onnx',
      desc: 'Native YOLOv8 property damage detection, bounding box canvas and IS 456 repair estimates.' },
    { slug: 'vision-security', cat: 'telemetry', href: 'vision-security.html', icon: 'fa-shield-halved',
      title: 'Vision Security Gate', source: 'Rakshak AI · lcb-face-matcher',
      desc: '1:N biometric facial verification attendance and OSHA safety PPE compliance scanner.' },
    { slug: 'edge-telemetry', cat: 'telemetry', href: 'edge-telemetry.html', icon: 'fa-microchip',
      title: 'IMU Telemetry Lab', source: 'vyro-admin-panel · bowling_admin_server',
      desc: 'Decode 6-DOF IMU packets, plot waveforms and classify motion.' },
    { slug: 'karting', cat: 'telemetry', href: 'karting-telemetry.html', icon: 'fa-flag-checkered',
      title: 'Race Timing Lab', source: 'Go_karting',
      desc: 'Lap timing, sector splits, checkpoint feed and track flags.' }
  ];

  // ── helpers ─────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function catById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return CATEGORIES[0];
  }
  function byCat(id) { return WORKSTATIONS.filter(function (w) { return w.cat === id; }); }
  function currentSlug(el) {
    var explicit = el && el.getAttribute('data-ws');
    if (explicit) return explicit;
    var file = (location.pathname.split('/').pop() || '').toLowerCase();
    for (var i = 0; i < WORKSTATIONS.length; i++) if (WORKSTATIONS[i].href === file) return WORKSTATIONS[i].slug;
    return null;
  }
  // Pages live at the site root; this keeps links working from nested paths too.
  var ROOT = (function () {
    var s = document.currentScript && document.currentScript.getAttribute('src');
    if (!s) return '';
    return s.replace(/ws-shell\.js.*$/, '');
  })();
  function link(href) { return ROOT + href; }

  // ── Top bar ─────────────────────────────────────────────────────────────
  function renderShell(el) {
    var slug = currentSlug(el);
    var idx = -1;
    for (var i = 0; i < WORKSTATIONS.length; i++) if (WORKSTATIONS[i].slug === slug) idx = i;
    var cur = idx >= 0 ? WORKSTATIONS[idx] : null;
    var prev = idx >= 0 ? WORKSTATIONS[(idx - 1 + WORKSTATIONS.length) % WORKSTATIONS.length] : null;
    var next = idx >= 0 ? WORKSTATIONS[(idx + 1) % WORKSTATIONS.length] : null;
    var cat = cur ? catById(cur.cat) : null;

    var menuCols = CATEGORIES.map(function (c) {
      var items = byCat(c.id).map(function (w) {
        var active = cur && w.slug === cur.slug;
        return '<a class="ws-menu-item' + (active ? ' is-active' : '') + '" href="' + link(w.href) + '"' +
               (active ? ' aria-current="page"' : '') + '>' +
               '<i class="fas ' + w.icon + '" style="color:' + c.color + '"></i>' +
               '<span><strong>' + esc(w.title) + '</strong><small>' + esc(w.desc) + '</small></span></a>';
      }).join('');
      return '<div class="ws-menu-col"><div class="ws-menu-head" style="color:' + c.color + '">' +
             '<i class="fas ' + c.icon + '"></i> ' + esc(c.label) + '</div>' + items + '</div>';
    }).join('');

    el.innerHTML =
      '<header class="ws-bar" role="banner">' +
        '<a class="ws-brand" href="' + link('index.html') + '" aria-label="Sevenseed home">' +
          '<span class="ws-brand-mark"><i class="fas fa-seedling"></i></span><span>Sevenseed</span></a>' +
        '<nav class="ws-crumbs" aria-label="Breadcrumb">' +
          '<a href="' + link('workstations.html') + '">Workstations</a>' +
          (cat ? '<i class="fas fa-chevron-right"></i><span style="color:' + cat.color + '">' + esc(cat.label) + '</span>' : '') +
          (cur ? '<i class="fas fa-chevron-right"></i><span class="ws-crumb-current">' + esc(cur.title) + '</span>' : '') +
        '</nav>' +
        '<div class="ws-actions">' +
          (prev ? '<a class="ws-icon-btn" href="' + link(prev.href) + '" title="Previous: ' + esc(prev.title) + '" aria-label="Previous workstation"><i class="fas fa-arrow-left"></i></a>' : '') +
          (next ? '<a class="ws-icon-btn" href="' + link(next.href) + '" title="Next: ' + esc(next.title) + '" aria-label="Next workstation"><i class="fas fa-arrow-right"></i></a>' : '') +
          '<button class="ws-menu-btn" id="wsMenuBtn" type="button" aria-expanded="false" aria-controls="wsMenu">' +
            '<i class="fas fa-grip"></i><span>All workstations</span></button>' +
          '<a class="ws-hub-btn" href="' + link('index.html') + '"><i class="fas fa-house"></i><span>Hub</span></a>' +
        '</div>' +
      '</header>' +
      '<div class="ws-menu" id="wsMenu" hidden><div class="ws-menu-grid">' + menuCols + '</div>' +
        '<div class="ws-menu-foot"><a href="' + link('workstations.html') + '">Open the full directory <i class="fas fa-arrow-right"></i></a>' +
        (cur ? '<span>Source repo: <code>' + esc(cur.source) + '</code></span>' : '') + '</div></div>';

    document.body.classList.add('ws-has-shell');

    var btn = el.querySelector('#wsMenuBtn');
    var menu = el.querySelector('#wsMenu');
    function setOpen(open) {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var first = menu.querySelector('.ws-menu-item');
        if (first) first.focus();
      }
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(menu.hidden); });
    document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
      if (!menu.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        var items = Array.prototype.slice.call(menu.querySelectorAll('.ws-menu-item'));
        if (!items.length) return;
        e.preventDefault();
        var curIdx = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          var nextIdx = (curIdx + 1) % items.length;
          items[nextIdx].focus();
        } else {
          var prevIdx = (curIdx - 1 + items.length) % items.length;
          items[prevIdx].focus();
        }
      }
    });
  }

  // ── Directory (workstations.html + hub section) ─────────────────────────
  function renderDirectory(el) {
    var compact = el.hasAttribute('data-compact');
    var html = '';
    if (!compact) {
      html += '<div class="ws-dir-toolbar">' +
        '<div class="ws-search"><i class="fas fa-magnifying-glass"></i>' +
        '<input id="wsSearch" type="search" placeholder="Search workstations or source repos…" aria-label="Search workstations">' +
        '<span class="ws-search-hint"><kbd>/</kbd></span></div>' +
        '<div class="ws-filters" role="tablist">' +
          '<button class="ws-filter is-active" data-cat="all" type="button">All <span>' + WORKSTATIONS.length + '</span></button>' +
          CATEGORIES.map(function (c) {
            return '<button class="ws-filter" data-cat="' + c.id + '" type="button">' + esc(c.label) +
                   ' <span>' + byCat(c.id).length + '</span></button>';
          }).join('') +
        '</div></div>';
    }
    html += CATEGORIES.map(function (c) {
      var cards = byCat(c.id).map(function (w) {
        var badgeHtml = w.badge ? '<span class="ws-badge ws-badge-' + (w.badge.toLowerCase().indexOf('new') !== -1 ? 'new' : (w.badge.toLowerCase().indexOf('live') !== -1 ? 'live' : 'beta')) + '">' + esc(w.badge) + '</span>' : '';
        return '<a class="ws-card" href="' + link(w.href) + '" data-cat="' + c.id + '" ' +
               'data-search="' + esc((w.title + ' ' + w.desc + ' ' + w.source + ' ' + c.label).toLowerCase()) + '" ' +
               'style="--ws-accent:' + c.color + '">' +
               '<div class="ws-card-top"><span class="ws-card-icon"><i class="fas ' + w.icon + '"></i></span>' +
               '<div style="display:flex;align-items:center;gap:6px;"><code class="ws-card-src">' + esc(w.source) + '</code>' + badgeHtml + '</div></div>' +
               '<h3>' + esc(w.title) + '</h3><p>' + esc(w.desc) + '</p>' +
               '<span class="ws-card-cta">Open <i class="fas fa-arrow-right"></i></span></a>';
      }).join('');
      return '<section class="ws-group" data-cat="' + c.id + '">' +
             '<div class="ws-group-head"><h2 style="color:' + c.color + '"><i class="fas ' + c.icon + '"></i> ' + esc(c.label) + '</h2>' +
             '<p>' + esc(c.blurb) + '</p></div><div class="ws-grid">' + cards + '</div></section>';
    }).join('');
    html += '<p class="ws-empty" hidden>No workstation matches that search.</p>';
    el.innerHTML = html;

    if (compact) return;
    var activeCat = 'all';
    var input = el.querySelector('#wsSearch');
    var selectedIndex = -1;

    function getVisibleCards() {
      return Array.prototype.slice.call(el.querySelectorAll('.ws-card:not([hidden])'));
    }
    function updateSelection(cards) {
      cards.forEach(function (c, i) {
        if (i === selectedIndex) c.classList.add('is-selected');
        else c.classList.remove('is-selected');
      });
      if (selectedIndex >= 0 && cards[selectedIndex]) {
        cards[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    function apply() {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      selectedIndex = -1;
      el.querySelectorAll('.ws-group').forEach(function (g) {
        var groupShown = 0;
        g.querySelectorAll('.ws-card').forEach(function (card) {
          var ok = (activeCat === 'all' || card.getAttribute('data-cat') === activeCat) &&
                   (!q || card.getAttribute('data-search').indexOf(q) !== -1);
          card.hidden = !ok;
          card.classList.remove('is-selected');
          if (ok) groupShown++;
        });
        g.hidden = groupShown === 0;
        shown += groupShown;
      });
      el.querySelector('.ws-empty').hidden = shown !== 0;
    }
    input.addEventListener('input', apply);

    input.addEventListener('keydown', function (e) {
      var cards = getVisibleCards();
      if (!cards.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % cards.length;
        updateSelection(cards);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + cards.length) % cards.length;
        updateSelection(cards);
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && cards[selectedIndex]) {
          e.preventDefault();
          location.href = cards[selectedIndex].href;
        } else if (cards.length > 0) {
          e.preventDefault();
          location.href = cards[0].href;
        }
      } else if (e.key === 'Escape') {
        input.value = '';
        selectedIndex = -1;
        apply();
        input.blur();
      }
    });

    document.addEventListener('keydown', function (e) {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });

    el.querySelectorAll('.ws-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        el.querySelectorAll('.ws-filter').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        activeCat = b.getAttribute('data-cat');
        apply();
      });
    });
  }

  function initSpotlight(root) {
    var targets = (root || document).querySelectorAll('.ws-card, .metric-card, .card-panel, .hosp-card, .tool-card, .stat-card, .glow-card');
    targets.forEach(function (card) {
      if (card._hasSpotlight) return;
      card._hasSpotlight = true;
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // ── Universal Glassmorphic Toast Notification Engine ───────────────────
  window.showToast = function (message, type, duration) {
    type = type || 'info';
    duration = duration || 3600;
    var container = document.getElementById('ss-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ss-toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    var iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    else if (type === 'error') iconClass = 'fa-circle-xmark';
    else if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    else if (type === 'ai') iconClass = 'fa-wand-magic-sparkles';

    var toast = document.createElement('div');
    toast.className = 'ss-toast ss-toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.innerHTML =
      '<span class="ss-toast-icon"><i class="fas ' + iconClass + '"></i></span>' +
      '<div class="ss-toast-msg">' + message + '</div>' +
      '<button type="button" class="ss-toast-close" aria-label="Dismiss"><i class="fas fa-xmark"></i></button>' +
      '<div class="ss-toast-progress" style="animation-duration:' + duration + 'ms;"></div>';

    container.appendChild(toast);

    function dismiss() {
      if (toast.classList.contains('ss-toast-closing')) return;
      toast.classList.add('ss-toast-closing');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }

    var timer = setTimeout(dismiss, duration);

    var closeBtn = toast.querySelector('.ss-toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearTimeout(timer);
        dismiss();
      });
    }

    toast.addEventListener('click', function () {
      clearTimeout(timer);
      dismiss();
    });
  };

  // Intercept window.alert to provide sleek, non-blocking toast notifications
  if (!window._ssOrigAlert) {
    window._ssOrigAlert = window.alert;
    window.alert = function (msg) {
      if (typeof msg === 'string' && (msg.toLowerCase().indexOf('error') !== -1 || msg.toLowerCase().indexOf('failed') !== -1)) {
        window.showToast(msg, 'error', 4500);
      } else if (typeof msg === 'string' && (msg.toLowerCase().indexOf('copied') !== -1 || msg.toLowerCase().indexOf('success') !== -1 || msg.toLowerCase().indexOf('saved') !== -1 || msg.toLowerCase().indexOf('exported') !== -1 || msg.toLowerCase().indexOf('dispatched') !== -1)) {
        window.showToast(msg, 'success', 3600);
      } else {
        window.showToast(msg, 'info', 3600);
      }
      console.log('[Sevenseed Notification]', msg);
    };
  }

  window.SevenseedWorkstations = { categories: CATEGORIES, list: WORKSTATIONS, initSpotlight: initSpotlight };

  function boot() {
    var shell = document.getElementById('ws-shell');
    if (shell) renderShell(shell);
    var dir = document.getElementById('ws-directory');
    if (dir) renderDirectory(dir);
    initSpotlight();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
