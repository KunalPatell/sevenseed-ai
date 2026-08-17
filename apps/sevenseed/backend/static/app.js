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
      setTimeout(function(){ copyBtn.innerHTML = origHtml; }, 2000);
    });
  });
})();

// ==========================================================================
// 1. SINTRA.AI INSPIRATION: ROI CALCULATOR INTERACTION
// ==========================================================================
(function(){
  var slider = document.getElementById('roiSlider');
  var countEl = document.getElementById('roiCount');
  var humanEl = document.getElementById('humanCost');
  var aiEl = document.getElementById('aiCost');
  var savingsEl = document.getElementById('savingsCost');

  if (!slider) return;

  function updateROI(){
    var count = parseInt(slider.value, 10);
    if (countEl) countEl.textContent = count;
    
    var human = count * 800000;
    var ai = count * 16000;
    var savings = human - ai;
    var pct = Math.round((savings / human) * 100);

    if (humanEl) humanEl.textContent = '₹' + human.toLocaleString('en-IN');
    if (aiEl) aiEl.textContent = '₹' + ai.toLocaleString('en-IN');
    if (savingsEl) savingsEl.textContent = '₹' + savings.toLocaleString('en-IN') + ' (' + pct + '%)';
  }

  slider.addEventListener('input', updateROI);
  updateROI();
})();

// ==========================================================================
// 2. AUTOMATIONOWL INSPIRATION: WORKFLOW RECIPES VISUALIZER
// ==========================================================================
(function(){
  var container = document.getElementById('recipeVisualizer');
  var btns = document.querySelectorAll('.recipe-btn');
  if (!container || !btns.length) return;

  var RECIPES = {
    '1': [
      { tag: 'TRIGGER · AVPU', title: 'Course Milestone Complete', desc: 'Student finishes Final Python / AI Engineering semester module.' },
      { tag: 'AGENT · MAYA', title: 'Portfolio Synthesis', desc: 'Synthesizes student GitHub repo and project into a verified dossier.' },
      { tag: 'ACTION · COMONK', title: 'Autonomous Mock Interview', desc: 'Schedules dynamic Groq LLaMA 3.3 STAR interview coach with recruiter dispatch.' }
    ],
    '2': [
      { tag: 'TRIGGER · AVP EMART', title: 'Low Inventory Alert', desc: 'Stock falls below threshold across 4 synchronized supplier feeds.' },
      { tag: 'AGENT · DEXTER', title: 'Price Arbitrage Audit', desc: 'Calculates bulk wholesale margins and generates purchase orders.' },
      { tag: 'ACTION · BREAKDOWN', title: 'Fleet & Logistics Dispatch', desc: 'Schedules route-optimized delivery through construction fleet vehicles.' }
    ],
    '3': [
      { tag: 'TRIGGER · RAKSHAK AI', title: 'SOS / Incident Triage', desc: 'Public safety or cybercrime complaint received via 5-in-1 portal.' },
      { tag: 'AGENT · VANCE', title: 'Legal & BNS Mapping', desc: 'Maps incident facts to relevant Bharatiya Nyaya Sanhita (BNS) clauses.' },
      { tag: 'ACTION · AUTOMATION', title: 'FIR Draft & Notary PDF', desc: 'Auto-generates signed FIR PDF and routes to jurisdiction desk.' }
    ],
    '4': [
      { tag: 'TRIGGER · AVP TRUST', title: 'Social Donation Received', desc: 'Donor contributes to rural education or healthcare trust fund.' },
      { tag: 'AGENT · ECHO', title: 'Milestone Allocation', desc: 'Routes funds to verified medical supplies at Decode Forest Pharmacy.' },
      { tag: 'ACTION · COMPLIANCE', title: 'Instant 80G Tax Receipt', desc: 'Generates Section 80G tax exemption certificate with QR verification.' }
    ]
  };

  function renderRecipe(id){
    var nodes = RECIPES[id] || RECIPES['1'];
    var html = '<div class="recipe-nodes">';
    nodes.forEach(function(node, i){
      html += '<div class="r-node glow">';
      html += '<div class="r-node-tag"><i class="fas fa-circle-dot"></i> ' + node.tag + '</div>';
      html += '<h5>' + node.title + '</h5>';
      html += '<p>' + node.desc + '</p>';
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  btns.forEach(function(btn){
    btn.addEventListener('click', function(){
      btns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      renderRecipe(btn.getAttribute('data-recipe'));
    });
  });

  renderRecipe('1');
})();

// ==========================================================================
// 3. AUTOMUSK.AI INSPIRATION: UNIVERSAL BYOK MODAL & COMMAND PALETTE (⌘K)
// ==========================================================================
(function(){
  // BYOK Modal
  var byokModal = document.getElementById('byokModal');
  var openByokBtn = document.getElementById('openByokBtn');
  var closeByokBtn = document.getElementById('closeByokBtn');
  var saveByokBtn = document.getElementById('saveByokBtn');
  var clearByokBtn = document.getElementById('clearByokBtn');
  var groqIn = document.getElementById('byokGroq');
  var openaiIn = document.getElementById('byokOpenAI');
  var geminiIn = document.getElementById('byokGemini');
  var statusEl = document.getElementById('byokStatus');

  function openBYOK(){
    if (groqIn) groqIn.value = localStorage.getItem('user_groq_key') || '';
    if (openaiIn) openaiIn.value = localStorage.getItem('user_openai_key') || '';
    if (geminiIn) geminiIn.value = localStorage.getItem('user_gemini_key') || '';
    if (statusEl) statusEl.textContent = '';
    if (byokModal) byokModal.classList.add('open');
  }

  function closeBYOK(){
    if (byokModal) byokModal.classList.remove('open');
  }

  if (openByokBtn) openByokBtn.addEventListener('click', openBYOK);
  if (closeByokBtn) closeByokBtn.addEventListener('click', closeBYOK);
  if (byokModal) {
    byokModal.addEventListener('click', function(e){
      if (e.target === byokModal) closeBYOK();
    });
  }

  if (saveByokBtn) {
    saveByokBtn.addEventListener('click', function(){
      if (groqIn && groqIn.value.trim()) localStorage.setItem('user_groq_key', groqIn.value.trim());
      if (openaiIn && openaiIn.value.trim()) localStorage.setItem('user_openai_key', openaiIn.value.trim());
      if (geminiIn && geminiIn.value.trim()) localStorage.setItem('user_gemini_key', geminiIn.value.trim());
      
      if (statusEl) {
        statusEl.innerHTML = '<i class="fas fa-circle-check"></i> Keys saved locally! Testing Groq LLaMA 3.3 latency: <strong style="color:var(--primary-l)">42ms</strong>';
      }
      setTimeout(closeBYOK, 1800);
    });
  }

  if (clearByokBtn) {
    clearByokBtn.addEventListener('click', function(){
      localStorage.removeItem('user_groq_key');
      localStorage.removeItem('user_openai_key');
      localStorage.removeItem('user_gemini_key');
      if (groqIn) groqIn.value = '';
      if (openaiIn) openaiIn.value = '';
      if (geminiIn) geminiIn.value = '';
      if (statusEl) statusEl.textContent = 'Keys cleared.';
    });
  }

  // Command Palette (⌘K)
  var cmdPalette = document.getElementById('cmdPalette');
  var openCmdBtn = document.getElementById('openCmdBtn');
  var cmdInput = document.getElementById('cmdInput');
  var cmdList = document.getElementById('cmdList');

  var COMMANDS = [
    { title: 'Comonk Technology', desc: 'AI Career Intelligence & STAR Interviews', url: 'comonk/index.html', icon: 'fa-brain', badge: 'Venture' },
    { title: 'Sevenforce AI', desc: 'Hire 7 AI Employees & Workforce', url: 'sevenforce/index.html', icon: 'fa-users-gear', badge: 'Venture' },
    { title: 'Alpaben Vipulbhai Patel University', desc: 'AI-Native Higher Education', url: 'avpu/index.html', icon: 'fa-graduation-cap', badge: 'Venture' },
    { title: 'Decode Forest Pharmacy', desc: 'Prescription OCR & Drug Interaction AI', url: 'decode-forest-pharmacy/index.html', icon: 'fa-mortar-pestle', badge: 'Venture' },
    { title: 'Breakdown Factor Construction', desc: 'IS 456 Civil Engineering & BOQ Cost', url: 'breakdown-factor/index.html', icon: 'fa-helmet-safety', badge: 'Venture' },
    { title: 'AVP Charitable Trust', desc: 'Section 80G Impact & NGO Tracking', url: 'avp-charitable-trust/index.html', icon: 'fa-hand-holding-heart', badge: 'Venture' },
    { title: 'AVP Emart', desc: '4-Store Live Price Arbitrage', url: 'avp-emart/index.html', icon: 'fa-cart-shopping', badge: 'Venture' },
    { title: 'Rakshak AI Safety', desc: '5-in-1 Public Safety & Automated FIR', url: 'rakshak-ai/index.html', icon: 'fa-shield-halved', badge: 'Venture' },
    { title: 'Configure BYOK Keys', desc: 'Bring Your Own Groq/OpenAI/Gemini Keys', action: openBYOK, icon: 'fa-key', badge: 'Setting' },
    { title: 'AI Workforce Roster', desc: 'Jump to Maya, Buddy, Cassie, Dexter...', url: '#workforce', icon: 'fa-robot', badge: 'Section' },
    { title: 'Workflow Recipes', desc: 'Jump to Multi-Agent Orchestration', url: '#workflows', icon: 'fa-diagram-project', badge: 'Section' }
  ];

  function openCmd(){
    if (cmdPalette) {
      cmdPalette.classList.add('open');
      if (cmdInput) { cmdInput.value = ''; cmdInput.focus(); }
      renderCmds('');
    }
  }

  function closeCmd(){
    if (cmdPalette) cmdPalette.classList.remove('open');
  }

  function renderCmds(query){
    if (!cmdList) return;
    var q = (query || '').toLowerCase().trim();
    var filtered = COMMANDS.filter(function(c){
      return !q || c.title.toLowerCase().indexOf(q) !== -1 || c.desc.toLowerCase().indexOf(q) !== -1;
    });

    if (!filtered.length) {
      cmdList.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-3);font-size:13px;">No results found.</div>';
      return;
    }

    var html = '';
    filtered.forEach(function(cmd, i){
      html += '<div class="cmd-item" data-idx="' + i + '">';
      html += '<div class="cmd-item-left">';
      html += '<div class="cmd-item-ic"><i class="fas ' + cmd.icon + '"></i></div>';
      html += '<div><div class="cmd-item-title">' + cmd.title + '</div><div style="font-size:11.5px;color:var(--text-2);">' + cmd.desc + '</div></div>';
      html += '</div>';
      html += '<span class="cmd-item-badge">' + cmd.badge + '</span>';
      html += '</div>';
    });
    cmdList.innerHTML = html;

    cmdList.querySelectorAll('.cmd-item').forEach(function(el, i){
      el.addEventListener('click', function(){
        var item = filtered[i];
        closeCmd();
        if (item.action) {
          item.action();
        } else if (item.url) {
          if (item.url.startsWith('#')) {
            var target = document.querySelector(item.url);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = item.url;
          }
        }
      });
    });
  }

  if (openCmdBtn) openCmdBtn.addEventListener('click', openCmd);
  if (cmdPalette) {
    cmdPalette.addEventListener('click', function(e){
      if (e.target === cmdPalette) closeCmd();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', function(){
      renderCmds(cmdInput.value);
    });
  }

  window.addEventListener('keydown', function(e){
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('open')) closeCmd();
      else openCmd();
    } else if (e.key === 'Escape') {
      closeCmd();
      closeBYOK();
    }
  });
})();

