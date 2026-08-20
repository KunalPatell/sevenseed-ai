// Enterprise site interactions - Sevenseed AI portfolio
document.body.classList.add('js');

// Entrance orchestration: reveal blur-in elements + fire scramble
function revealEntrance(){
  document.querySelectorAll('[data-blur-in]').forEach(function(el){ el.classList.add('bin'); });
  document.dispatchEvent(new Event('ss:entrance'));
}

// Text-scramble ("decode") effect
(function(){
  var CHARS = "!<>-_\\/[]{}=+*^?#01ABCXYZ";
  function scramble(el){
    var text = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', text);
    var queue = text.split('').map(function(c){ return {c:c, s:Math.floor(Math.random()*16), e:Math.floor(Math.random()*16)+16}; });
    var f = 0;
    (function tick(){
      var out = '', done = 0;
      queue.forEach(function(q){
        if (q.c === ' '){ out += ' '; done++; }
        else if (f >= q.e){ out += q.c; done++; }
        else if (f >= q.s){ out += CHARS[Math.floor(Math.random()*CHARS.length)]; }
      });
      el.textContent = out;
      if (done >= queue.length) return;
      f++; requestAnimationFrame(tick);
    })();
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
  var start = Date.now(), dur = 1500;
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

// Mobile nav
var ham = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');
if (ham && navLinks) {
  ham.addEventListener('click', function(){ navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });
}

// Contact form → opens the visitor's email app (no backend required)
var cform = document.getElementById('contactForm');
if (cform) {
  cform.addEventListener('submit', function(e){
    e.preventDefault();
    var to = cform.getAttribute('data-email');
    var company = cform.getAttribute('data-company') || '';
    var name = (document.getElementById('cf-name').value || '').trim();
    var from = (document.getElementById('cf-email').value || '').trim();
    var subj = (document.getElementById('cf-subject').value || '').trim() || ('Enquiry for ' + company);
    var msg = (document.getElementById('cf-msg').value || '').trim();
    var body = 'Name: ' + name + '\nEmail: ' + from + '\n\n' + msg;
    var note = document.getElementById('cf-note');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
    if (note) note.textContent = 'Opening your email app to send this message…';
    toast('Opening your email app to send this message…');
  });
}

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

// Hero particle network
(function(){
  var c = document.getElementById('particles');
  if (!c) return;
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
  var endpoint = form.getAttribute('data-endpoint');
  
  if (window.location.protocol !== 'file:' && endpoint.includes('/api/')) {
    var rawPath = endpoint.substring(endpoint.indexOf('/api/'));
    // Use relative path to avoid CORS issues when serving from the same host
    endpoint = rawPath;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (btn.disabled) return;
    btn.disabled = true;
    var btnText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    output.textContent = 'CONNECTING TO AI MODEL SERVER...\\nEXECUTING PIPELINE...\\nPLEASE WAIT...';
    
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
    var token = localStorage.getItem('sevenforce_token');
    var isDemo = !token || token === 'demo_token';
    var hasKeys = localStorage.getItem('user_groq_key') || 
                  localStorage.getItem('user_gemini_key') || 
                  localStorage.getItem('user_openai_key') || 
                  localStorage.getItem('user_serpapi_key') || 
                  localStorage.getItem('user_huggingface_key') || 
                  localStorage.getItem('user_mistral_key');

    if (isDemo || !hasKeys) {
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
        
        output.textContent = '💡 DEMO MODE (Preview Output):\\n' + JSON.stringify(data, null, 2) + '\\n\\n💡 To run this live, sign in and add your API Keys at Sevenforce: https://kunalpatell.github.io/sevenseed/sevenforce/index.html';
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
      output.textContent = '❌ ERROR EXECUTING MODEL:\\n' + err.message + '\\n\\n💡 Ensure the backend server for this venture is running on its designated port.';
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
    var pending = addMsg('Thinking…', 'bot typing');
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
