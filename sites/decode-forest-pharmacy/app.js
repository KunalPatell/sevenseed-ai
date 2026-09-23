/* safety_code_injected */

document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); el.style.opacity = '1'; });
  document.querySelectorAll('[data-blur-in]').forEach(function(el){ el.classList.add('bin'); el.style.opacity = '1'; el.style.filter = 'none'; });
});
setTimeout(function(){
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); el.style.opacity = '1'; });
  document.querySelectorAll('[data-blur-in]').forEach(function(el){ el.classList.add('bin'); el.style.opacity = '1'; el.style.filter = 'none'; });
}, 50);

// Enterprise site interactions - Sevenseed AI portfolio
document.body.classList.add('js');

// Entrance orchestration: reveal blur-in elements + fire scramble
// Instant reveal entrance
function revealEntrance(){
  document.querySelectorAll('[data-blur-in]').forEach(function(el){ el.classList.add('bin'); el.style.opacity = '1'; el.style.filter = 'none'; });
  document.dispatchEvent(new Event('ss:entrance'));
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealEntrance);
} else {
  revealEntrance();
}

// Text-scramble ("decode") effect
(function(){
  var CHARS = "!<>-_\\/[]{}=+*^?#01ABCXYZ";
  function scramble(el){
    // Keep text crisp and intact
    var text = el.getAttribute('data-text') || el.textContent;
    el.textContent = text;
  }
  var els = document.querySelectorAll('.scramble');
  document.addEventListener('ss:entrance', function(){ els.forEach(scramble); });
  els.forEach(function(el){ el.addEventListener('mouseenter', function(){ scramble(el); }); });
})();

// Preloader
(function(){
  var pl = document.getElementById('preloader');
  if (!pl){ setTimeout(revealEntrance, 0); return; }
  var seen = false;
  try { seen = sessionStorage.getItem('ss-preloader-seen'); } catch(e){}
  if (seen){ if (pl.parentNode) pl.parentNode.removeChild(pl); setTimeout(revealEntrance, 0); return; }
  var bar = document.getElementById('plBar'), pct = document.getElementById('plPct');
  var start = Date.now(), dur = 200;
  var iv = setInterval(function(){
    var p = Math.min(100, Math.floor((Date.now() - start) / dur * 100));
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = p;
    if (p >= 100){
      clearInterval(iv);
      try { sessionStorage.setItem('ss-preloader-seen', '1'); } catch(e){}
      setTimeout(function(){ pl.classList.add('hide'); revealEntrance(); }, 200);
      setTimeout(function(){ if (pl.parentNode) pl.parentNode.removeChild(pl); }, 1200);
    }
  }, 16);
})();

document.querySelectorAll('[data-year]').forEach(function(e){ e.textContent = new Date().getFullYear(); });

// Universal Theme Toggle
(function() {
  var tBtn = document.getElementById('themeToggle');
  if (tBtn && !tBtn._ssBound) {
    tBtn._ssBound = true;
    function updateIcon(theme) {
      var ic = tBtn.querySelector('i');
      if (ic) {
        ic.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
    var cur = document.documentElement.getAttribute('data-theme') || 'dark';
    updateIcon(cur);
    tBtn.addEventListener('click', function() {
      var now = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = now === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ss-theme', next); } catch(e){}
      updateIcon(next);
    });
  }

  // Universal Cursor Ring
  var ring = document.getElementById('cursorRing');
  if (ring && !window._ssCursorInitialized && !window.matchMedia('(pointer: coarse)').matches) {
    window._ssCursorInitialized = true;
    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = 'translate3d(' + (ringX - 18) + 'px, ' + (ringY - 18) + 'px, 0)';
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }
})();



// Mobile nav with overlay backdrop & icon animation
var ham = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');
var navOverlay = document.getElementById('navOverlay');

function closeMobileNav() {
  if (navLinks) navLinks.classList.remove('open');
  if (navOverlay) navOverlay.classList.remove('open');
  if (ham) {
    ham.setAttribute('aria-expanded', 'false');
    var ic = ham.querySelector('i');
    if (ic) { ic.className = 'fas fa-bars'; }
  }
}

function toggleMobileNav() {
  if (!navLinks) return;
  var isOpen = navLinks.classList.toggle('open');
  if (navOverlay) navOverlay.classList.toggle('open', isOpen);
  if (ham) {
    ham.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    var ic = ham.querySelector('i');
    if (ic) { ic.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars'; }
  }
}

if (ham && navLinks) {
  ham.addEventListener('click', toggleMobileNav);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMobileNav);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileNav();
    }
  });
}

// Contact form → submits asynchronously to backend API (/api/contact) with mailto fallback
var cform = document.getElementById('contactForm');
if (cform) {
  cform.addEventListener('submit', async function(e){
    e.preventDefault();
    var to = cform.getAttribute('data-email') || 'hello@sevenseed.in';
    var company = cform.getAttribute('data-company') || 'Sevenseed';
    var name = (document.getElementById('cf-name').value || '').trim();
    var from = (document.getElementById('cf-email').value || '').trim();
    var orgEl = document.getElementById('cf-org');
    var sizeEl = document.getElementById('cf-size');
    var org = orgEl ? (orgEl.value || '').trim() : '';
    var size = sizeEl ? (sizeEl.value || '').trim() : '';
    var typeEl = document.getElementById('cf-type');
    var type = typeEl ? (typeEl.value || '').trim() : '';
    var subj = (document.getElementById('cf-subject').value || '').trim() || ('Enquiry for ' + company);
    if (type) subj = '[' + type + '] ' + subj;
    var msg = (document.getElementById('cf-msg').value || '').trim();
    var note = document.getElementById('cf-note');
    var sbtn = cform.querySelector('button[type="submit"]');
    var originalBtnHtml = sbtn ? sbtn.innerHTML : 'Send message';

    if (!name || !from || !msg) {
      if (note) {
        note.style.color = '#ef4444';
        note.textContent = 'Please fill out your name, email, and message.';
      }
      return;
    }

    if (sbtn) {
      sbtn.disabled = true;
      sbtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
    }
    if (note) {
      note.style.color = 'var(--text-muted, #94a3b8)';
      note.textContent = 'Connecting to studio server…';
    }

    var fullMsg = (type ? 'Enquiry Type: ' + type + '\n' : '') +
      (org ? 'Company: ' + org + '\n' : '') +
      (size ? 'Team Size: ' + size + '\n' : '') +
      (org || type || size ? '\n' : '') + msg;

    try {
      var res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: from,
          subject: subj,
          message: fullMsg
        })
      });

      var data = await res.json().catch(function(){ return {}; });

      if (res.ok && data.success !== false) {
        if (note) {
          note.style.color = '#10b981';
          note.innerHTML = '<i class="fas fa-circle-check"></i> Thank you! Your message has been saved and forwarded to our team.';
        }
        if (typeof toast === 'function') toast('Message submitted successfully!');
        cform.reset();
      } else {
        throw new Error(data.detail || data.error || 'Server error');
      }
    } catch (err) {
      console.warn('Contact API submission failed, falling back to mailto:', err);
      var body = 'Name: ' + name + '\nEmail: ' + from +
        (type ? '\nEnquiry type: ' + type : '') +
        (org ? '\nCompany: ' + org : '') +
        (size ? '\nTeam size: ' + size : '') +
        '\n\n' + msg;
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
      if (note) {
        note.style.color = '#38bdf8';
        note.textContent = 'Opening your email app to send this message directly…';
      }
      if (typeof toast === 'function') toast('Opening your email app to send this message…');
    } finally {
      if (sbtn) {
        sbtn.disabled = false;
        sbtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

// "Talk to our enterprise team" → jumps to contact and pre-selects the enquiry type
var entCta = document.getElementById('enterpriseCta');
if (entCta) entCta.addEventListener('click', function(e){
  var typeEl = document.getElementById('cf-type');
  var nameEl = document.getElementById('cf-name');
  if (typeEl){
    Array.prototype.forEach.call(typeEl.options, function(o){
      if (o.value === 'Enterprise / Government') typeEl.value = o.value;
    });
  }
  setTimeout(function(){ if (nameEl) nameEl.focus(); }, 500);
});

// Nav background on scroll
var nav = document.querySelector('.nav');
function onScroll(){ if (window.scrollY > 24) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
window.addEventListener('scroll', onScroll); onScroll();

// Count-up animation for numeric stats/metrics
function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
function animateCount(el){
  var raw = el.textContent.trim();
  var m = raw.match(/^(\d[\d,]*)(.*)$/);
  if (!m) return;                        // non-numeric (e.g. ₹1Cr, Zero) stays static
  var target = parseInt(m[1].replace(/,/g, ''), 10);
  var suffix = m[2];
  var dur = 1400, start = null;
  function tick(now){
    if (start === null) start = now;
    var p = Math.min((now - start) / dur, 1);
    var val = Math.floor(easeOut(p) * target);
    el.textContent = val.toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('en-IN') + suffix;
  }
  requestAnimationFrame(tick);
}
var countIO = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if (e.isIntersecting){ animateCount(e.target); countIO.unobserve(e.target); } });
}, { threshold: 0.4 });
document.querySelectorAll('.count').forEach(function(el){ countIO.observe(el); });

// Reveal on scroll
var revealIO = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); revealIO.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(function(el){ revealIO.observe(el); });
// Safety net: never leave content permanently hidden if the observer misfires.
setTimeout(function(){
  document.querySelectorAll('.reveal:not(.in)').forEach(function(el){ el.classList.add('in'); });
}, 2600);

// Scroll progress bar
var sp = document.getElementById('scrollProgress');
if (sp) window.addEventListener('scroll', function(){
  var h = document.documentElement.scrollHeight - window.innerHeight;
  sp.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
}, { passive: true });

var noHover = window.matchMedia('(hover:none)').matches || window.matchMedia('(pointer:coarse)').matches;
var reduceMo = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

// Custom cursor ring (smoothed follow)
(function(){
  var ring = document.getElementById('cursorRing');
  if (!ring || noHover) return;
  var tx = -100, ty = -100, cx = -100, cy = -100;
  window.addEventListener('mousemove', function(e){ tx = e.clientX; ty = e.clientY; }, { passive: true });
  window.addEventListener('mouseover', function(e){
    var hit = e.target.closest && e.target.closest('a,button,.glow,summary,input,textarea,[data-tilt]');
    ring.classList.toggle('hovering', !!hit);
  }, { passive: true });
  (function loop(){
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    ring.style.transform = 'translate(' + (cx - 15) + 'px,' + (cy - 15) + 'px)';
    requestAnimationFrame(loop);
  })();
})();

// Cursor-follow glow inside cards
document.addEventListener('mousemove', function(e){
  var card = e.target.closest && e.target.closest('.glow');
  if (!card) return;
  var r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, { passive: true });

// 3D tilt on cards
if (!noHover && !reduceMo) document.querySelectorAll('[data-tilt]').forEach(function(el){
  el.addEventListener('mousemove', function(e){
    var r = el.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - 0.5;
    var py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = 'perspective(820px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 7).toFixed(2) + 'deg)';
  });
  el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
});

// Magnetic primary buttons
if (!noHover) document.querySelectorAll('.btn-primary').forEach(function(el){
  el.addEventListener('mousemove', function(e){
    var r = el.getBoundingClientRect();
    el.style.transform = 'translate(' + ((e.clientX - (r.left + r.width/2)) * 0.28).toFixed(1) + 'px,' + ((e.clientY - (r.top + r.height/2)) * 0.28).toFixed(1) + 'px)';
  });
  el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
});

// Button ripple micro-interaction
document.querySelectorAll('.btn').forEach(function(btn){
  btn.addEventListener('click', function(e){
    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height);
    var span = document.createElement('span');
    span.className = 'btn-ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - r.left - size / 2) + 'px';
    span.style.top = (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(span);
    setTimeout(function(){ if (span.parentNode) span.parentNode.removeChild(span); }, 650);
  });
});

// Hero particle network (2D fallback when Three.js is unavailable)
(function(){
  var c = document.getElementById('particles');
  if (!c || typeof THREE === 'undefined') return;
  var ctx = c.getContext('2d');
  var w, h, parts;
  var rgb = (getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb') || '124,58,237').trim();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    w = c.width = c.offsetWidth; h = c.height = c.offsetHeight;
    var n = Math.max(24, Math.min(72, Math.floor(w / 18)));
    parts = [];
    for (var i = 0; i < n; i++) parts.push({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
      r: Math.random()*1.6 + .7
    });
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for (var i=0;i<parts.length;i++){
      var p = parts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>w) p.vx*=-1;
      if (p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba('+rgb+',.65)'; ctx.fill();
    }
    for (var a=0;a<parts.length;a++) for (var b=a+1;b<parts.length;b++){
      var dx=parts[a].x-parts[b].x, dy=parts[a].y-parts[b].y, d=dx*dx+dy*dy;
      if (d < 10000){
        ctx.beginPath(); ctx.moveTo(parts[a].x,parts[a].y); ctx.lineTo(parts[b].x,parts[b].y);
        ctx.strokeStyle = 'rgba('+rgb+','+(0.14*(1-d/10000))+')'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  if (!reduce) draw();
})();

// Sandbox Form Handler
(function(){
  var form = document.getElementById('sandboxForm');
  if (!form) return;
  var btn = document.getElementById('sandboxBtn');
  var output = document.getElementById('sandboxOutput');
  var endpoint = form.getAttribute('data-endpoint') || '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    try {
      var parsedUrl = new URL(endpoint);
      endpoint = parsedUrl.pathname + parsedUrl.search;
    } catch(e) {
      if (endpoint.includes('/api/')) {
        endpoint = endpoint.substring(endpoint.indexOf('/api/'));
      }
    }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (btn.disabled) return;
    btn.disabled = true;
    var btnText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    output.textContent = 'CONNECTING TO AI MODEL SERVER...\nEXECUTING PIPELINE...\nPLEASE WAIT...';
    
    var payload = {};
    var fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(function(f){
      if (!f.id) return;
      var key = f.id.replace('sb-', '');
      var val = f.value;
      if (f.type === 'number') {
        val = parseFloat(val);
      }
      payload[key] = val;
    });

    if (payload.drug1 || payload.drug2) {
      payload = { drugs: [payload.drug1 || '', payload.drug2 || ''].filter(Boolean) };
    }

    // Shared domain localStorage verification
    var token = localStorage.getItem('sevenforce_token') || localStorage.getItem('auth_token') || '';
    var hasKeys = localStorage.getItem('user_groq_key') || 
                  localStorage.getItem('user_gemini_key') || 
                  localStorage.getItem('user_openai_key') || 
                  localStorage.getItem('user_mistral_key') || 
                  localStorage.getItem('user_serpapi_key') || 
                  localStorage.getItem('user_huggingface_key');
    var isDemo = !token && !hasKeys;

    if (isDemo) {
      // Offline/Demo Preview Fallback
      setTimeout(function(){
        var data;
        if (endpoint.indexOf('/evaluate') !== -1) {
          data = { score: 90, evaluation: "Venture proposal successfully analyzed. Strong AI leverage. Recommendations: Implement unified local storage BYOK, scale RAG indexes." };
        } else if (endpoint.indexOf('/interview-generate') !== -1) {
          data = { questions: ["Tell me about a time you handled a resource starvation bug in Windows.", "How do you set reload=False dynamically in Uvicorn?", "Explain the difference between LangGraph and simple chain executors."] };
        } else if (endpoint.indexOf('/study-plan') !== -1) {
          data = { study_plan: ["Day 1: Basics of data structures (1hr study, 1hr practice)", "Day 2: Pandas dataframes and cleaning", "Day 3: Aggregations and groupby", "Day 4: Data visualization with Matplotlib", "Day 5: Real-world dataset analysis case study", "Day 6: Final project review", "Day 7: Performance profiling and optimization"] };
        } else if (endpoint.indexOf('/interactions') !== -1) {
          data = { interaction_found: true, severity: "High Danger", contraindication: "Aspirin combined with Warfarin significantly increases the risk of internal bleeding. Avoid co-administration without doctor review.", recommendation: "Consult a cardiologist immediately for safer alternatives." };
        } else if (endpoint.indexOf('/boq') !== -1) {
          data = { materials_required: { cement: "675 bags", sand: "1,800 cu ft", bricks: "33,750 pcs", steel: "4.5 tons" }, estimated_cost_inr: "₹ 27,00,000", duration_weeks: 24, quality_grade: payload.quality || "Premium" };
        } else if (endpoint.indexOf('/needs') !== -1) {
          data = { recommended_trust_aid: ["Deploying clean water filter plant (fluoride treatment)", "Initiating mobile primary school transport van", "Financing a local community health center weekly camp"] };
        } else if (endpoint.indexOf('/compare') !== -1) {
          data = { query: payload.query || "iPhone 15 Pro Max", results: [{ site: "Amazon India", price: "₹1,34,900", availability: "In Stock" }, { site: "Flipkart", price: "₹1,35,500", availability: "Out of Stock" }, { site: "Vijay Sales", price: "₹1,34,000", availability: "In Stock", best_value: true }, { site: "Croma", price: "₹1,36,000", availability: "In Stock" }] };
        } else {
          data = { success: true, mode: "Static Preview Mock Output" };
        }
        
        output.textContent = '💡 DEMO MODE (Preview Output):\n' + JSON.stringify(data, null, 2) + '\n\n💡 To run this live with real LLM inference, configure your free API Keys in BYOK or visit Sevenforce: /sevenforce/';
        btn.disabled = false;
        btn.innerHTML = btnText;
      }, 700);
      return;
    }

    // Live Execution headers
    var headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    
    var groq = localStorage.getItem("user_groq_key");
    if (groq) headers["X-Groq-API-Key"] = groq;
    var gemini = localStorage.getItem("user_gemini_key");
    if (gemini) headers["X-Gemini-API-Key"] = gemini;
    var openai = localStorage.getItem("user_openai_key");
    if (openai) headers["X-OpenAI-API-Key"] = openai;
    var serpapi = localStorage.getItem("user_serpapi_key");
    if (serpapi) headers["X-SerpAPI-Key"] = serpapi;
    var huggingface = localStorage.getItem("user_huggingface_key");
    if (huggingface) headers["X-HuggingFace-API-Key"] = huggingface;
    var mistral = localStorage.getItem("user_mistral_key");
    if (mistral) headers["X-Mistral-API-Key"] = mistral;

    fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    .then(function(res){
      if (!res.ok) {
        return res.text().then(function(t){ throw new Error(t || res.statusText) });
      }
      return res.json();
    })
    .then(function(data){
      output.textContent = JSON.stringify(data, null, 2);
    })
    .catch(function(err){
      output.textContent = '❌ ERROR EXECUTING MODEL:\n' + err.message + '\n\n💡 Ensure the backend server for this venture is running on its designated port.';
    })
    .finally(function(){
      btn.disabled = false;
      btn.innerHTML = btnText;
    });
  });

  var copyBtn = document.getElementById('sandboxCopy');
  if (copyBtn) copyBtn.addEventListener('click', function(){
    navigator.clipboard.writeText(output.textContent).then(function(){
      var origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      toast('Copied to clipboard');
      setTimeout(function(){ copyBtn.innerHTML = origHtml; }, 2000);
    });
  });
})();

// ── Enterprise UX layer ──────────────────────────────────────────────────

// Toast notifications
function toast(msg, type){
  var stack = document.getElementById('toastStack');
  if (!stack) return;
  var el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.textContent = msg;
  stack.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('show'); });
  setTimeout(function(){
    el.classList.remove('show');
    setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); }, 300);
  }, 4200);
}

// Theme toggle (applied synchronously in <head>; this just wires the button)
(function(){
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  var icon = btn.querySelector('i');
  function setIcon(theme){ if (icon) icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon'; }
  setIcon(root.getAttribute('data-theme') || 'dark');
  btn.addEventListener('click', function(){
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    setIcon(next);
    try { localStorage.setItem('ss-theme', next); } catch(e){}
  });
})();

// Back-to-top
(function(){
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function(){
    if (window.scrollY > 500) btn.classList.add('show'); else btn.classList.remove('show');
  }, { passive: true });
  btn.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();

// Testimonials carousel
(function(){
  var track = document.getElementById('tTrack');
  var prev = document.getElementById('tPrev');
  var next = document.getElementById('tNext');
  var dotsWrap = document.getElementById('tDots');
  if (!track) return;
  var cards = Array.prototype.slice.call(track.children);
  if (dotsWrap) cards.forEach(function(card, i){
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'tdot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to review ' + (i + 1));
    d.addEventListener('click', function(){ card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }); });
    dotsWrap.appendChild(d);
  });
  var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
  function scrollByCard(dir){
    var w = (cards[0] ? cards[0].getBoundingClientRect().width : 300) + 22;
    track.scrollBy({ left: dir * w, behavior: 'smooth' });
  }
  if (prev) prev.addEventListener('click', function(){ scrollByCard(-1); });
  if (next) next.addEventListener('click', function(){ scrollByCard(1); });
  if (dots.length) track.addEventListener('scroll', function(){
    var idx = 0, best = Infinity;
    cards.forEach(function(card, i){
      var d = Math.abs(card.offsetLeft - track.scrollLeft);
      if (d < best){ best = d; idx = i; }
    });
    dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
  }, { passive: true });
})();

// Command palette (Ctrl/Cmd+K) — searches sections, AI tools, FAQs and group ventures
(function(){
  var overlay = document.getElementById('cmdkOverlay');
  var input = document.getElementById('cmdkInput');
  var list = document.getElementById('cmdkList');
  var openBtn = document.getElementById('searchBtn');
  if (!overlay || !input || !list) return;

  var dataEl = document.getElementById('ssData');
  var data = {};
  try { data = JSON.parse(dataEl ? dataEl.textContent : '{}'); } catch(e){}

  var items = [];
  (data.sections || []).forEach(function(s){ items.push({ label: s.label, sub: 'Section', hash: s.hash }); });
  (data.services || []).forEach(function(s){ items.push({ label: s.name, sub: 'AI Tool', hash: '#services' }); });
  (data.faqs || []).forEach(function(f){ items.push({ label: f.q, sub: 'FAQ', hash: '#faq' }); });
  (data.ventures || []).forEach(function(v){ items.push({ label: v.label, sub: 'Sevenseed Venture', href: v.href }); });

  var active = 0, filtered = items.slice();

  function render(){
    list.innerHTML = '';
    if (!filtered.length){ list.innerHTML = '<div class="cmdk-empty">No results</div>'; return; }
    filtered.forEach(function(item, i){
      var row = document.createElement('div');
      row.className = 'cmdk-item' + (i === active ? ' active' : '');
      row.innerHTML = '<strong>' + item.label + '</strong><small>' + item.sub + '</small>';
      row.addEventListener('mouseenter', function(){ active = i; render(); });
      row.addEventListener('click', function(){ go(item); });
      list.appendChild(row);
    });
  }
  function go(item){
    close();
    if (item.href) window.location.href = item.href;
    else if (item.hash) {
      var target = document.querySelector(item.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', item.hash);
    }
  }
  function filter(){
    var q = input.value.trim().toLowerCase();
    filtered = !q ? items.slice() : items.filter(function(it){ return it.label.toLowerCase().indexOf(q) !== -1; });
    active = 0;
    render();
  }
  function open(){
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    filter();
    setTimeout(function(){ input.focus(); }, 30);
  }
  function close(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', open);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
  input.addEventListener('input', filter);
  document.addEventListener('keydown', function(e){
    var mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'k'){ e.preventDefault(); if (overlay.classList.contains('open')) close(); else open(); }
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape'){ close(); }
    else if (e.key === 'ArrowDown'){ e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); render(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); active = Math.max(active - 1, 0); render(); }
    else if (e.key === 'Enter'){ e.preventDefault(); if (filtered[active]) go(filtered[active]); }
  });

  render();
})();

// AI assistant — Gemini BYOK when a key is saved, keyword-matched fallback otherwise
(function(){
  var toggle = document.getElementById('chatToggle');
  var panel = document.getElementById('chatPanel');
  var closeBtn = document.getElementById('chatClose');
  var body = document.getElementById('chatBody');
  var form = document.getElementById('chatForm');
  var input = document.getElementById('chatInput');
  var keybar = document.getElementById('chatKeybar');
  var keyInput = document.getElementById('chatKeyInput');
  var keySave = document.getElementById('chatKeySave');
  if (!toggle || !panel || !form) return;

  var dataEl = document.getElementById('ssData');
  var ctx = {};
  try { ctx = JSON.parse(dataEl ? dataEl.textContent : '{}'); } catch(e){}

  function getKey(){ try { return localStorage.getItem('user_gemini_key') || ''; } catch(e){ return ''; } }
  function syncKeybar(){ if (keybar) keybar.classList.toggle('hide', !!getKey()); }
  syncKeybar();

  function open(){ panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); setTimeout(function(){ input.focus(); }, 30); }
  function close(){ panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
  toggle.addEventListener('click', function(){ if (panel.classList.contains('open')) close(); else open(); });
  if (closeBtn) closeBtn.addEventListener('click', close);

  if (keySave) keySave.addEventListener('click', function(){
    var v = (keyInput.value || '').trim();
    if (!v) return;
    try { localStorage.setItem('user_gemini_key', v); } catch(e){}
    keyInput.value = '';
    syncKeybar();
    toast('Gemini API key saved on this device');
  });

  function addMsg(text, cls){
    var el = document.createElement('div');
    el.className = 'chat-msg ' + cls;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function addTypingMsg(){
    var el = document.createElement('div');
    el.className = 'chat-msg bot typing';
    el.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function localAnswer(q){
    var ql = q.toLowerCase();
    var pool = [];
    (ctx.faqs || []).forEach(function(f){ pool.push({ text: f.a, hay: f.q + ' ' + f.a }); });
    (ctx.services || []).forEach(function(s){ pool.push({ text: s.name + ' — ' + s.desc, hay: s.name + ' ' + s.desc }); });
    if (ctx.about) pool.push({ text: ctx.about, hay: ctx.about });
    var words = ql.split(/\s+/).filter(function(w){ return w.length > 2; });
    var best = null, bestScore = 0;
    pool.forEach(function(p){
      var hay = p.hay.toLowerCase();
      var score = words.reduce(function(s, w){ return s + (hay.indexOf(w) !== -1 ? 1 : 0); }, 0);
      if (score > bestScore){ bestScore = score; best = p; }
    });
    if (best && bestScore > 0) return best.text;
    return "I couldn't find a specific answer to that. Reach out directly at " + (ctx.contact ? ctx.contact.email : 'our contact form') + ', or add a free Gemini API key above for open-ended answers.';
  }

  function askGemini(q, key){
    var sys = 'You are the AI assistant embedded on the ' + ctx.site + ' website (' + ctx.sector + '). ' +
      'Answer the visitor briefly and helpfully using only this information — if the answer is not in it, say so and suggest contacting ' + (ctx.contact ? ctx.contact.email : 'the team') + '.\n\n' +
      'SUMMARY: ' + ctx.summary + '\nABOUT: ' + ctx.about + '\nHIGHLIGHTS: ' + (ctx.highlights || []).join('; ') + '\n' +
      'SERVICES: ' + (ctx.services || []).map(function(s){ return s.name + ' - ' + s.desc; }).join('; ') + '\n' +
      'FAQ: ' + (ctx.faqs || []).map(function(f){ return f.q + ' -> ' + f.a; }).join('; ') + '\n' +
      'CONTACT: ' + (ctx.contact ? (ctx.contact.email + ', ' + ctx.contact.phone) : '');
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: sys + '\n\nVISITOR QUESTION: ' + q }] }] })
    })
    .then(function(res){ if (!res.ok) throw new Error('status ' + res.status); return res.json(); })
    .then(function(data){
      var text = data && data.candidates && data.candidates[0] && data.candidates[0].content &&
        data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (!text) throw new Error('empty response');
      return text.trim();
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var q = (input.value || '').trim();
    if (!q) return;
    addMsg(q, 'user');
    input.value = '';
    var pending = addTypingMsg();
    var key = getKey();
    if (key){
      askGemini(q, key).then(function(text){
        pending.textContent = text; pending.classList.remove('typing');
      }).catch(function(){
        pending.textContent = localAnswer(q); pending.classList.remove('typing');
      });
    } else {
      setTimeout(function(){ pending.textContent = localAnswer(q); pending.classList.remove('typing'); }, 350);
    }
  });
})();

// Download overview (print stylesheet)
(function(){
  var btn = document.getElementById('printBtn');
  if (!btn) return;
  btn.addEventListener('click', function(){ window.print(); });
})();

// Keyboard shortcuts modal ("?" or the footer link)
(function(){
  var overlay = document.getElementById('shortcutsModal');
  var openBtn = document.getElementById('shortcutsBtn');
  if (!overlay) return;
  function open(){ overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false'); }
  function close(){ overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); }
  if (openBtn) openBtn.addEventListener('click', open);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
  document.addEventListener('keydown', function(e){
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '');
    if (e.key === '?' && !typing){ e.preventDefault(); overlay.classList.contains('open') ? close() : open(); return; }
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();

// ── 3D Render & 3D Animation Engine (Three.js WebGL) ───────────────────
(function initHero3D(){
  var canvas = document.getElementById('particles');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var container = canvas.parentElement;
  if (!container) return;

  var width = container.clientWidth || window.innerWidth;
  var height = container.clientHeight || window.innerHeight;

  var style = getComputedStyle(document.documentElement);
  var primaryHex = (style.getPropertyValue('--primary') || '#6366f1').trim();
  var secondaryHex = (style.getPropertyValue('--secondary') || '#a855f7').trim();
  var primaryColor = new THREE.Color(primaryHex);
  var secondaryColor = new THREE.Color(secondaryHex);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 8.5);

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var variant = document.body.getAttribute('data-variant') || 'bold-centered';

  var coreGroup = new THREE.Group();
  scene.add(coreGroup);

  var isDesktop = window.innerWidth > 960;
  var targetCorePos = isDesktop ? new THREE.Vector3(2.4, 0.2, -1.2) : new THREE.Vector3(0, 0.8, -2.2);
  coreGroup.position.copy(targetCorePos);

  var geom;
  if (variant === 'tactical-alert') {
    geom = new THREE.DodecahedronGeometry(1.35, 0);
  } else if (variant === 'technical-mono') {
    geom = new THREE.TorusKnotGeometry(0.9, 0.28, 128, 16);
  } else if (variant === 'clinical-grid') {
    geom = new THREE.OctahedronGeometry(1.4, 1);
  } else if (variant === 'warm-commerce') {
    geom = new THREE.OctahedronGeometry(1.35, 0);
  } else if (variant === 'compassion-serif') {
    geom = new THREE.IcosahedronGeometry(1.35, 0);
  } else if (variant === 'industrial-blueprint') {
    geom = new THREE.BoxGeometry(1.8, 1.8, 1.8);
  } else {
    geom = new THREE.IcosahedronGeometry(1.35, 1);
  }

  var coreMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    emissive: primaryColor,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.8,
    wireframe: false,
    transparent: true,
    opacity: 0.85
  });
  var coreMesh = new THREE.Mesh(geom, coreMat);
  coreGroup.add(coreMesh);

  var wireMat = new THREE.MeshBasicMaterial({
    color: secondaryColor,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  var wireMesh = new THREE.Mesh(geom.clone(), wireMat);
  wireMesh.scale.set(1.08, 1.08, 1.08);
  coreGroup.add(wireMesh);

  // Concentric tilted orbital energy rings
  var ringGeom1 = new THREE.TorusGeometry(1.95, 0.022, 16, 100);
  var ringMat1 = new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.65 });
  var ring1 = new THREE.Mesh(ringGeom1, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  ring1.rotation.y = 0.25;
  coreGroup.add(ring1);

  var ringGeom2 = new THREE.TorusGeometry(2.35, 0.016, 16, 100);
  var ringMat2 = new THREE.MeshBasicMaterial({ color: secondaryColor, transparent: true, opacity: 0.5 });
  var ring2 = new THREE.Mesh(ringGeom2, ringMat2);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.y = -0.35;
  coreGroup.add(ring2);

  // Orbiting venture satellites
  var satelliteGroup = new THREE.Group();
  coreGroup.add(satelliteGroup);
  var numSatellites = 7;
  var satellites = [];
  var satGeom = new THREE.SphereGeometry(0.085, 16, 16);
  var ventureColors = [
    0x6366f1, 0x06b6d4, 0x38bdf8, 0x10b981, 0xf59e0b, 0xfb7185, 0xef4444
  ];

  for (var s = 0; s < numSatellites; s++) {
    var satMat = new THREE.MeshBasicMaterial({
      color: ventureColors[s % ventureColors.length],
      transparent: true,
      opacity: 0.95
    });
    var satMesh = new THREE.Mesh(satGeom, satMat);
    var angle = (s / numSatellites) * Math.PI * 2;
    satMesh.userData = { angle: angle, radius: 2.15, speed: 0.009 + (s % 3) * 0.003, ring: s % 2 };
    satelliteGroup.add(satMesh);
    satellites.push(satMesh);
  }

  // Cosmic 3D particle nebula
  var particleCount = 240;
  var particleGeom = new THREE.BufferGeometry();
  var particlePositions = new Float32Array(particleCount * 3);
  var particleColors = new Float32Array(particleCount * 3);

  for (var p = 0; p < particleCount; p++) {
    var pr = 2.4 + Math.random() * 6.5;
    var pTheta = Math.random() * Math.PI * 2;
    var pPhi = Math.acos(2 * Math.random() - 1);
    particlePositions[p * 3] = targetCorePos.x + pr * Math.sin(pPhi) * Math.cos(pTheta);
    particlePositions[p * 3 + 1] = targetCorePos.y + pr * Math.sin(pPhi) * Math.sin(pTheta);
    particlePositions[p * 3 + 2] = targetCorePos.z + pr * Math.cos(pPhi);

    var c = Math.random() > 0.5 ? secondaryColor : primaryColor;
    particleColors[p * 3] = c.r;
    particleColors[p * 3 + 1] = c.g;
    particleColors[p * 3 + 2] = c.b;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  var particleMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  var particleSystem = new THREE.Points(particleGeom, particleMat);
  scene.add(particleSystem);

  // Lighting
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  var pointLight1 = new THREE.PointLight(primaryColor, 2.5, 12);
  pointLight1.position.set(targetCorePos.x + 2, targetCorePos.y + 2, targetCorePos.z + 3);
  scene.add(pointLight1);

  var pointLight2 = new THREE.PointLight(secondaryColor, 2.0, 10);
  pointLight2.position.set(targetCorePos.x - 2, targetCorePos.y - 2, targetCorePos.z + 2);
  scene.add(pointLight2);

  // Smooth mouse tracking
  var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', function(e) {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // Speed boost on hover
  var speedMultiplier = 1.0;
  var targetSpeedMultiplier = 1.0;
  document.querySelectorAll('.hero-actions a, .btn-primary, .pillar, .hs, .ai-chip').forEach(function(el) {
    el.addEventListener('mouseenter', function() { targetSpeedMultiplier = 2.8; coreMat.emissiveIntensity = 0.85; });
    el.addEventListener('mouseleave', function() { targetSpeedMultiplier = 1.0; coreMat.emissiveIntensity = 0.45; });
  });

  // Intersection Observer
  var isVisible = true;
  var heroObserver = new IntersectionObserver(function(entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  heroObserver.observe(container);

  // Resize
  window.addEventListener('resize', function() {
    var nw = container.clientWidth || window.innerWidth;
    var nh = container.clientHeight || window.innerHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);

    var desk = window.innerWidth > 960;
    targetCorePos.set(desk ? 2.4 : 0, desk ? 0.2 : 0.8, desk ? -1.2 : -2.2);
    coreGroup.position.copy(targetCorePos);
  }, { passive: true });

  // Animation Loop
  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    var delta = clock.getDelta();
    var time = clock.getElapsedTime();

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    speedMultiplier += (targetSpeedMultiplier - speedMultiplier) * 0.08;

    coreMesh.rotation.x += 0.4 * delta * speedMultiplier;
    coreMesh.rotation.y += 0.6 * delta * speedMultiplier;
    wireMesh.rotation.x -= 0.3 * delta * speedMultiplier;
    wireMesh.rotation.y -= 0.5 * delta * speedMultiplier;

    coreGroup.position.y = targetCorePos.y + Math.sin(time * 1.4) * 0.12;

    ring1.rotation.z += 0.5 * delta * speedMultiplier;
    ring2.rotation.z -= 0.4 * delta * speedMultiplier;

    for (var i = 0; i < satellites.length; i++) {
      var sat = satellites[i];
      sat.userData.angle += sat.userData.speed * speedMultiplier;
      var r = sat.userData.radius;
      if (sat.userData.ring === 0) {
        sat.position.x = Math.cos(sat.userData.angle) * r;
        sat.position.y = Math.sin(sat.userData.angle) * r * Math.sin(Math.PI / 3);
        sat.position.z = Math.sin(sat.userData.angle) * r * Math.cos(Math.PI / 3);
      } else {
        sat.position.x = Math.cos(sat.userData.angle) * r * 1.1;
        sat.position.y = -Math.sin(sat.userData.angle) * r * 1.1 * Math.sin(Math.PI / 4);
        sat.position.z = Math.sin(sat.userData.angle) * r * 1.1 * Math.cos(Math.PI / 4);
      }
    }

    particleSystem.rotation.y = time * 0.03;
    particleSystem.rotation.x = Math.sin(time * 0.02) * 0.08;

    camera.position.x = mouse.x * 0.85;
    camera.position.y = mouse.y * 0.65;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();

// ── 3D Card Perspective Tilt & Specular Sheen Animation ──────
(function init3DTilt(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  var cards = document.querySelectorAll('[data-tilt], .glow, .svc-card, .proc-step, .metric, .about-card, .tcard');
  cards.forEach(function(card){
    var rect, cx, cy;
    var raf = null;
    var rx = 0, ry = 0;

    function updateRect(){
      rect = card.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    }

    card.addEventListener('mouseenter', function(){
      updateRect();
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    });

    card.addEventListener('mousemove', function(e){
      if (!rect) updateRect();
      var dx = (e.clientX - cx) / (rect.width / 2);
      var dy = (e.clientY - cy) / (rect.height / 2);
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));

      rx = -dy * 8;
      ry = dx * 8;

      var mx = ((e.clientX - rect.left) / rect.width) * 100;
      var my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');

      if (!raf) {
        raf = requestAnimationFrame(function(){
          card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
          raf = null;
        });
      }
    });

    card.addEventListener('mouseleave', function(){
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      rect = null;
    });
  });
})();


// ── Unicorn Studio Dynamic Interactive Fluid Canvas Background ──
(function initUnicornFluidCanvas(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'liquid-fluid-canvas';
  hero.insertBefore(canvas, hero.firstChild);

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var width, height;
  function resize(){
    width = canvas.width = hero.clientWidth;
    height = canvas.height = hero.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var style = getComputedStyle(document.documentElement);
  var prRgb = (style.getPropertyValue('--primary-rgb') || '99,102,241').trim();
  var scRgb = (style.getPropertyValue('--secondary-rgb') || '168,85,247').trim();

  var mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };
  window.addEventListener('mousemove', function(e){
    var rect = hero.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    }
  });

  var points = [];
  var count = 5;
  for (var i = 0; i < count; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.min(width, height) * (0.3 + Math.random() * 0.25),
      color: i % 2 === 0 ? prRgb : scRgb
    });
  }

  var time = 0;
  function drawFluid(){
    time += 0.012;
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    points.forEach(function(pt, idx){
      pt.x += pt.vx + Math.sin(time + idx) * 0.4;
      pt.y += pt.vy + Math.cos(time + idx * 1.5) * 0.4;
      if (pt.x < -100) pt.x = width + 100;
      if (pt.x > width + 100) pt.x = -100;
      if (pt.y < -100) pt.y = height + 100;
      if (pt.y > height + 100) pt.y = -100;

      var dx = mouse.x - pt.x;
      var dy = mouse.y - pt.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 320) {
        pt.x += (dx / dist) * 1.2;
        pt.y += (dy / dist) * 1.2;
      }

      var grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius);
      grad.addColorStop(0, 'rgba(' + pt.color + ', 0.18)');
      grad.addColorStop(0.5, 'rgba(' + pt.color + ', 0.06)');
      grad.addColorStop(1, 'rgba(' + pt.color + ', 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawFluid);
  }
  drawFluid();
})();

// ── Master Interactive 3D Quantum Core WebGL Controller ──
// Reference: Portfolio QuantumCore3DWebGL architecture
(function initQuantumCore3D() {
  if (typeof THREE === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var stage = document.getElementById('hero3dStage');
  var existingCanvas = document.getElementById('hero3dCanvas') || document.getElementById('particles');
  if (!stage && !existingCanvas) return;
  if (!stage && existingCanvas) stage = existingCanvas.parentElement;
  if (!stage) return;

  // 1. Prepare Cyber HUD container inside stage
  var card = stage.querySelector('.qc-card');
  if (!card) {
    // Dynamically build the Quantum Core Cyber HUD container
    stage.innerHTML = '';

    var aura = document.createElement('div');
    aura.className = 'qc-aura';
    stage.appendChild(aura);

    card = document.createElement('div');
    card.className = 'qc-card';
    card.innerHTML = 
      '<div class="qc-hud-top">' +
        '<div class="qc-title-wrap">' +
          '<span class="qc-status-dot"><span class="qc-ping"></span><span class="qc-solid"></span></span>' +
          '<span class="qc-title">3D QUANTUM CORE <i class="fas fa-sparkles qc-sparkle"></i></span>' +
        '</div>' +
        '<div class="qc-badges">' +
          '<span class="qc-badge-fps" id="qcFps">60 FPS</span>' +
          '<span class="qc-badge-webgl">HARDWARE WEBGL</span>' +
        '</div>' +
      '</div>' +
      '<div class="qc-viewport" id="qcViewport">' +
        '<canvas id="hero3dCanvas" class="qc-canvas"></canvas>' +
        '<div class="qc-hint-pill">✦ Drag to Orbit • Click to Pulse ✦</div>' +
      '</div>' +
      '<div class="qc-hud-bottom">' +
        '<div class="qc-row-shapes">' +
          '<div class="qc-shapes-btns" id="qcShapes">' +
            '<button type="button" class="qc-shape-btn active" data-geom="icosahedron">Seed</button>' +
            '<button type="button" class="qc-shape-btn" data-geom="torusknot">Torus Knot</button>' +
            '<button type="button" class="qc-shape-btn" data-geom="tesseract">Tesseract</button>' +
            '<button type="button" class="qc-shape-btn" data-geom="helix">DNA Helix</button>' +
            '<button type="button" class="qc-shape-btn" data-geom="octahedron">Crystal</button>' +
          '</div>' +
          '<div class="qc-edges-tag" id="qcEdges">30 Edges</div>' +
        '</div>' +
        '<div class="qc-row-modes">' +
          '<div class="qc-modes-group">' +
            '<span class="qc-modes-label">Mode:</span>' +
            '<button type="button" class="qc-mode-btn active" data-mode="crystal">Crystal Core</button>' +
            '<button type="button" class="qc-mode-btn" data-mode="wireframe">Wireframe</button>' +
            '<button type="button" class="qc-mode-btn" data-mode="synapse">Deep Synapse</button>' +
          '</div>' +
          '<div class="qc-satellites-status">' +
            '<span class="qc-sat-dot"></span>' +
            '<span>7 Satellites Online</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    stage.appendChild(card);
  }

  var canvas = document.getElementById('hero3dCanvas');
  var viewport = document.getElementById('qcViewport') || stage;
  var fpsElem = document.getElementById('qcFps');
  var edgesElem = document.getElementById('qcEdges');
  var shapeBtns = card.querySelectorAll('.qc-shape-btn');
  var modeBtns = card.querySelectorAll('.qc-mode-btn');

  var width = viewport.clientWidth || 460;
  var height = viewport.clientHeight || 460;

  // Scene & Camera
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 7.2);

  // WebGL Renderer
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if (THREE.ACESFilmicToneMapping) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
  }

  // Lighting
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  var cyanLight = new THREE.PointLight(0x9ed8ff, 3.5, 20);
  cyanLight.position.set(3, 4, 5);
  scene.add(cyanLight);

  var amberLight = new THREE.PointLight(0xcfae6e, 3.0, 20);
  amberLight.position.set(-4, -2, 4);
  scene.add(amberLight);

  var rimLight = new THREE.PointLight(0x38bdf8, 2.0, 15);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // Core Group
  var coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Geometry generator
  function createCoreGeometry(type) {
    switch (type) {
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(1.4, 1);
      case 'torusknot':
        return new THREE.TorusKnotGeometry(0.95, 0.32, 100, 16, 2, 3);
      case 'tesseract':
        return new THREE.BoxGeometry(1.6, 1.6, 1.6);
      case 'helix':
        return new THREE.CylinderGeometry(0.8, 0.8, 2.4, 16, 8, true);
      case 'octahedron':
        return new THREE.OctahedronGeometry(1.4, 0);
      default:
        return new THREE.IcosahedronGeometry(1.4, 1);
    }
  }

  var edgeCounts = {
    icosahedron: 30,
    torusknot: 120,
    tesseract: 32,
    helix: 64,
    octahedron: 12
  };

  // Determine starting geometry based on site variant if desirable, else 'icosahedron' (Seed)
  var variant = document.body.getAttribute('data-variant') || '';
  var currentGeometry = 'icosahedron';
  if (variant === 'editorial') currentGeometry = 'octahedron';
  else if (variant === 'technical-mono') currentGeometry = 'torusknot';
  else if (variant === 'clinical-clean') currentGeometry = 'helix';
  else if (variant === 'industrial') currentGeometry = 'tesseract';

  var currentShading = 'crystal';

  // Build Core Mesh
  var geom = createCoreGeometry(currentGeometry);
  var innerMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1424,
    emissive: 0x1d3d63,
    emissiveIntensity: 0.85,
    roughness: 0.15,
    metalness: 0.85,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.92,
    wireframe: false
  });
  var innerMesh = new THREE.Mesh(geom, innerMat);
  coreGroup.add(innerMesh);

  // Outer Wireframe Cage
  var wireGeom = new THREE.WireframeGeometry(geom);
  var wireMat = new THREE.LineBasicMaterial({
    color: 0x9ed8ff,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  var wireMesh = new THREE.LineSegments(wireGeom, wireMat);
  coreGroup.add(wireMesh);

  // 3 Concentric Orbital Rings
  var pulseRings = [];
  var ringConfigs = [
    { radius: 2.15, tube: 0.016, rot: [0.5, 0.2, 0], color: 0x9ed8ff },
    { radius: 2.45, tube: 0.018, rot: [-0.4, 0.8, 0.3], color: 0xcfae6e },
    { radius: 2.75, tube: 0.014, rot: [0.9, -0.3, 0.6], color: 0x38bdf8 }
  ];
  ringConfigs.forEach(function(cfg) {
    var rGeom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
    var rMat = new THREE.MeshBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    var rMesh = new THREE.Mesh(rGeom, rMat);
    rMesh.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    coreGroup.add(rMesh);
    pulseRings.push(rMesh);
  });

  // 7 Orbiting Satellites with custom glow halos
  var SATELLITES_DATA = [
    { name: 'LangGraph', color: 0x9ed8ff, orbitRadius: 2.7, speed: 0.65, tilt: 0.28, phase: 0 },
    { name: 'YOLOv8', color: 0xcfae6e, orbitRadius: 3.1, speed: 0.48, tilt: -0.35, phase: 0.9 },
    { name: 'ChromaDB', color: 0x60a5fa, orbitRadius: 3.4, speed: 0.38, tilt: 0.52, phase: 1.8 },
    { name: 'FastAPI', color: 0x34d399, orbitRadius: 3.8, speed: 0.32, tilt: -0.22, phase: 2.7 },
    { name: 'n8n', color: 0xf59e0b, orbitRadius: 4.1, speed: 0.25, tilt: 0.41, phase: 3.6 },
    { name: 'Groq', color: 0xf43f5e, orbitRadius: 4.4, speed: 0.22, tilt: -0.48, phase: 4.5 },
    { name: 'PyTorch', color: 0xec4899, orbitRadius: 4.7, speed: 0.18, tilt: 0.15, phase: 5.4 }
  ];

  var satellites = [];
  SATELLITES_DATA.forEach(function(sat) {
    var satGroup = new THREE.Group();
    var satMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8
      })
    );
    var haloMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.22, 24),
      new THREE.MeshBasicMaterial({
        color: sat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      })
    );
    haloMesh.rotation.x = Math.PI / 2;
    satGroup.add(satMesh);
    satGroup.add(haloMesh);
    scene.add(satGroup);
    satellites.push({ mesh: satGroup, halo: haloMesh, data: sat });
  });

  // Cosmic Dust Field (360 points)
  var starCount = 360;
  var starPositions = new Float32Array(starCount * 3);
  var starColors = new Float32Array(starCount * 3);
  for (var i = 0; i < starCount; i++) {
    var radius = 2.5 + Math.random() * 4.5;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(Math.random() * 2 - 1);
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
    var isGold = Math.random() > 0.65;
    starColors[i * 3] = isGold ? 0.81 : 0.62;
    starColors[i * 3 + 1] = isGold ? 0.68 : 0.85;
    starColors[i * 3 + 2] = isGold ? 0.43 : 1.0;
  }
  var starGeom = new THREE.BufferGeometry();
  starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  var starField = new THREE.Points(
    starGeom,
    new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    })
  );
  scene.add(starField);

  // Shockwave Pulses
  var shockwaves = [];
  var pulseIntensity = 0;
  function triggerPulse() {
    pulseIntensity = 1.0;
    var ringGeom = new THREE.RingGeometry(0.5, 0.65, 48);
    var ringMat = new THREE.MeshBasicMaterial({
      color: 0x9ed8ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    var shockRing = new THREE.Mesh(ringGeom, ringMat);
    shockRing.rotation.x = Math.PI / 2;
    scene.add(shockRing);
    shockwaves.push({ mesh: shockRing, life: 1.0 });
  }

  // Switch Geometry dynamically
  function setGeometry(type) {
    currentGeometry = type;
    var newGeom = createCoreGeometry(type);
    if (innerMesh) {
      innerMesh.geometry.dispose();
      innerMesh.geometry = newGeom;
    }
    if (wireMesh) {
      wireMesh.geometry.dispose();
      wireMesh.geometry = new THREE.WireframeGeometry(newGeom);
    }
    if (edgesElem) {
      edgesElem.textContent = (edgeCounts[type] || 30) + ' Edges';
    }
    shapeBtns.forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-geom') === type);
    });
    triggerPulse();
  }

  // Switch Shading Style dynamically
  function setShading(style) {
    currentShading = style;
    if (!innerMesh || !wireMesh) return;
    if (style === 'wireframe') {
      innerMat.wireframe = true;
      innerMat.opacity = 0.4;
      wireMat.opacity = 0.85;
    } else if (style === 'synapse') {
      innerMat.wireframe = false;
      innerMat.emissive.setHex(0x38bdf8);
      innerMat.emissiveIntensity = 1.4;
      innerMat.opacity = 0.75;
      wireMat.opacity = 0.95;
    } else {
      // crystal
      innerMat.wireframe = false;
      innerMat.emissive.setHex(0x1d3d63);
      innerMat.emissiveIntensity = 0.85;
      innerMat.opacity = 0.92;
      wireMat.opacity = 0.65;
    }
    modeBtns.forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-mode') === style);
    });
  }

  // Bind Switcher Buttons
  shapeBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var g = btn.getAttribute('data-geom');
      if (g) setGeometry(g);
    });
  });

  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var m = btn.getAttribute('data-mode');
      if (m) setShading(m);
    });
  });

  // Apply initial geometry UI
  setGeometry(currentGeometry);
  setShading(currentShading);

  // Interaction State
  var mousePos = { x: 0, y: 0 };
  var targetRot = { x: 0.2, y: 0.3 };
  var currentRot = { x: 0.2, y: 0.3 };
  var isDragging = false;
  var lastMouse = { x: 0, y: 0 };
  var isHovered = false;

  viewport.addEventListener('pointerdown', function(e) {
    isDragging = true;
    lastMouse = { x: e.clientX, y: e.clientY };
    try { viewport.setPointerCapture(e.pointerId); } catch(err){}
  });

  window.addEventListener('pointermove', function(e) {
    var rect = viewport.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }
    if (isDragging) {
      var dx = e.clientX - lastMouse.x;
      var dy = e.clientY - lastMouse.y;
      targetRot.y += dx * 0.012;
      targetRot.x += dy * 0.012;
      lastMouse = { x: e.clientX, y: e.clientY };
    }
  });

  function stopDrag(e) {
    if (isDragging) {
      isDragging = false;
      try { viewport.releasePointerCapture(e.pointerId); } catch(err){}
    }
  }
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);

  viewport.addEventListener('mouseenter', function() { isHovered = true; });
  viewport.addEventListener('mouseleave', function() {
    isHovered = false;
    isDragging = false;
    mousePos.x = 0; mousePos.y = 0;
  });

  viewport.addEventListener('click', function() {
    triggerPulse();
  });

  // Window resize
  window.addEventListener('resize', function() {
    var w = viewport.clientWidth || 460;
    var h = viewport.clientHeight || 460;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Animation Loop with FPS Tracking
  var lastTime = performance.now();
  var frameCount = 0;
  var fpsTimer = performance.now();
  var isVisible = true;

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { isVisible = e.isIntersecting; });
    }, { threshold: 0.05 });
    obs.observe(stage);
  }

  function animate(time) {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    var dt = (time - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1;
    lastTime = time;

    frameCount++;
    if (time - fpsTimer >= 1000) {
      if (fpsElem) fpsElem.textContent = frameCount + ' FPS';
      frameCount = 0;
      fpsTimer = time;
    }

    currentRot.x += (targetRot.x - currentRot.x) * 0.07;
    currentRot.y += (targetRot.y - currentRot.y) * 0.07;

    if (coreGroup) {
      var autoSpin = isHovered ? 0.45 : 0.25;
      coreGroup.rotation.y += dt * autoSpin;
      coreGroup.rotation.x = currentRot.x;
      coreGroup.rotation.z = currentRot.y * 0.4;
    }

    if (pulseIntensity > 0) {
      pulseIntensity = Math.max(0, pulseIntensity - dt * 1.5);
    }
    var breathe = 1 + Math.sin(time * 0.002) * 0.03 + pulseIntensity * 0.18;
    if (innerMesh) innerMesh.scale.set(breathe, breathe, breathe);
    if (wireMesh) {
      var wireScale = breathe * 1.05;
      wireMesh.scale.set(wireScale, wireScale, wireScale);
    }

    pulseRings.forEach(function(ring, idx) {
      var dir = idx % 2 === 0 ? 1 : -1;
      ring.rotation.z += dt * (0.35 + idx * 0.12) * dir;
    });

    satellites.forEach(function(sat) {
      var d = sat.data;
      var t = time * 0.001 * d.speed + d.phase;
      var x = Math.cos(t) * d.orbitRadius;
      var z = Math.sin(t) * d.orbitRadius;
      var y = Math.sin(t * 1.5) * (d.orbitRadius * d.tilt);
      sat.mesh.position.set(x, y, z);
      sat.halo.rotation.z += dt * 1.2;
    });

    for (var sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
      var sw = shockwaves[sIdx];
      sw.life -= dt * 1.6;
      var sScale = 1 + (1 - sw.life) * 4.5;
      sw.mesh.scale.set(sScale, sScale, sScale);
      sw.mesh.material.opacity = Math.max(0, sw.life * 0.85);
      if (sw.life <= 0) {
        scene.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        sw.mesh.material.dispose();
        shockwaves.splice(sIdx, 1);
      }
    }

    starField.rotation.y += dt * 0.04;

    camera.position.x += (mousePos.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (-mousePos.y * 1.0 + 1.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
})();

// ── Aceternity UI 3D Card Physics Tilt & Dynamic Specular Glare ──
(function initAceternity3DTiltAndSpotlight(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  var cards = document.querySelectorAll('.border-beam-card, .svc-card, .proc-step, .metric, .about-card');
  cards.forEach(function(card){
    if (!card.querySelector('.tilt-glare')) {
      var glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);
    }

    var rect = null, raf = null;
    function updateRect(){ rect = card.getBoundingClientRect(); }

    card.addEventListener('mouseenter', function(){
      updateRect();
      card.style.transition = 'transform 0.12s ease-out, box-shadow 0.2s ease';
    });

    card.addEventListener('mousemove', function(e){
      if (!rect) updateRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');

      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var dx = (x - cx) / cx;
      var dy = (y - cy) / cy;
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));

      var rx = -dy * 10;
      var ry = dx * 10;

      var gx = (x / rect.width) * 100;
      var gy = (y / rect.height) * 100;
      card.style.setProperty('--glare-x', gx + '%');
      card.style.setProperty('--glare-y', gy + '%');

      if (!raf) {
        raf = requestAnimationFrame(function(){
          card.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02) translateY(-3px)';
          raf = null;
        });
      }
    });

    card.addEventListener('mouseleave', function(){
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)';
      rect = null;
    });
  });
})();



// ═══════════════════════════════════════════════════════════════════════════
// ACETERNITY & 21ST.DEV INTERACTION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

// Aceternity UI Spotlight Mouse Tracker
document.addEventListener('mousemove', function(e) {
  var cards = document.querySelectorAll('.spotlight-card');
  for (var i = 0; i < cards.length; i++) {
    var rect = cards[i].getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    cards[i].style.setProperty('--mouse-x', x + 'px');
    cards[i].style.setProperty('--mouse-y', y + 'px');
  }
});

// 3D Perspective Tilt Tracker
(function() {
  document.querySelectorAll('[data-tilt]').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -7;
      var rotateY = ((x - centerX) / centerX) * 7;
      el.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
})();
