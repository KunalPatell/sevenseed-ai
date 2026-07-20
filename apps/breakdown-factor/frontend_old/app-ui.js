/* Breakdown Factor Construction Portal — client logic */
"use strict";
const API = "";
async function post(p,b){const r=await fetch(API+p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
async function get(p){const r=await fetch(API+p);if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
const el=id=>document.getElementById(id);
function esc(s){return(s||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
function md(s){return esc(s).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");}

const META={
  dashboard:["Dashboard","Your AI-powered construction platform"],
  copilot:["AI Project Copilot","Ask anything about construction, costs & safety"],
  cost:["Cost Estimator","AI-generated project cost estimates (Gujarat 2025)"],
  materials:["Material Calculator","Quantities for any construction work item"],
  safety:["Safety Monitor","AI risk assessment based on BOCW Act & IS standards"],
  defect:["Defect Diagnosis","AI identifies defect cause, severity & repair method"],
  rates:["Rate Schedule","Current market rates — Gujarat 2025"],
};
function show(panel){
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.panel===panel));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+panel));
  el("panelTitle").textContent=META[panel][0]; el("panelDesc").textContent=META[panel][1];
  el("sidebar").classList.remove("open"); location.hash=panel;
  if(panel==="rates") loadRates();
  if(panel==="safety") loadSafetyRisks();
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>show(b.dataset.panel)));
el("menuBtn").addEventListener("click",()=>el("sidebar").classList.toggle("open"));

async function loadHealth(){
  try{const h=await get("/api/health");const on=h.llm_enabled;
    el("sysBadge").className="sysbadge"+(on?" on":"");
    el("sysBadge").innerHTML=`<i class="fas fa-circle"></i> ${on?h.provider:"offline mode"}`;
    el("provChip").innerHTML=`<i class="fas fa-microchip"></i> ${on?h.provider:"Offline AI"} · ${h.rag_backend.split(" ")[0]} RAG`;
    return h;
  }catch(e){el("sysBadge").innerHTML=`<i class="fas fa-triangle-exclamation"></i> API offline`;return{counts:{}};}
}

async function loadDashboard(){
  const h=await loadHealth(); const c=h.counts||{};
  el("statTiles").innerHTML=[[c.knowledge||0,"Knowledge Topics"],[c.cost_items||0,"Rate Items"],[c.safety_risks||0,"Safety Rules"],[5,"AI Tools"]].map(([n,l])=>`<div class="tile"><div class="tile-num">${n}</div><div class="tile-lbl">${l}</div></div>`).join("");
  const quick=[["copilot","fa-robot","AI Project Copilot","Ask any construction question"],["cost","fa-calculator","Cost Estimator","Instant project cost in ₹"],["materials","fa-cubes","Material Calculator","Quantities for any work item"],["safety","fa-shield-halved","Safety Monitor","AI risk assessment"],["defect","fa-magnifying-glass","Defect Diagnosis","Diagnose any site defect"],["rates","fa-list","Rate Schedule","Gujarat 2025 market rates"]];
  el("quickGrid").innerHTML=quick.map(([p,i,t,d])=>`<div class="quick-card" data-go="${p}"><div class="quick-ic"><i class="fas ${i}"></i></div><h4>${t}</h4><p>${d}</p></div>`).join("");
  el("quickGrid").querySelectorAll(".quick-card").forEach(x=>x.addEventListener("click",()=>show(x.dataset.go)));
}

// ── AI Copilot ────────────────────────────────────────────────────────────────
const SUGGESTIONS=["What is the cost per sqft for standard residential construction?","How do I calculate cement for M20 concrete?","What PPE is mandatory on construction sites?","What causes diagonal cracks in buildings?","What is the schedule for a G+2 house?"];
let sessionId=null;
function appendMsg(role,html){
  const wrap=el("chatScroll"); const div=document.createElement("div"); div.className=`msg ${role}`;
  const icon=role==="ai"?`<i class="fas fa-hard-hat"></i>`:`<i class="fas fa-user"></i>`;
  div.innerHTML=`<div class="msg-ic">${icon}</div><div class="msg-body">${html}</div>`;
  wrap.appendChild(div); wrap.scrollTop=wrap.scrollHeight;
}
async function sendCopilot(){
  const input=el("copilotInput"); const msg=input.value.trim(); if(!msg) return; input.value="";
  appendMsg("user",esc(msg)); appendMsg("ai",`<span class="loading"><i class="fas fa-circle-notch fa-spin"></i> Analysing…</span>`);
  try{const d=await post("/api/copilot",{message:msg,session_id:sessionId}); sessionId=d.session_id||sessionId;
    el("chatScroll").lastElementChild.querySelector(".msg-body").innerHTML=md(d.reply||"No response.");
  }catch(e){el("chatScroll").lastElementChild.querySelector(".msg-body").innerHTML=`<span class="err">${esc(e.message)}</span>`;}
}
el("copilotSend").addEventListener("click",sendCopilot);
el("copilotInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendCopilot();}});
el("copilotSuggest").innerHTML=SUGGESTIONS.slice(0,4).map(s=>`<button class="suggest-chip">${esc(s)}</button>`).join("");
el("copilotSuggest").querySelectorAll(".suggest-chip").forEach(b=>b.addEventListener("click",()=>{el("copilotInput").value=b.textContent;sendCopilot();}));

// ── Cost Estimator ─────────────────────────────────────────────────────────────
el("costBtn").addEventListener("click",async()=>{
  const project_type=el("costType").value, area_sqft=parseFloat(el("costArea").value), floors=parseInt(el("costFloors").value), quality=el("costQuality").value, location=el("costLocation").value.trim(), extra=el("costExtra").value.trim();
  if(!area_sqft){el("costResults").innerHTML=`<div class="err">Please enter the built-up area.</div>`;return;}
  el("costResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Generating estimate…</div>`;
  try{const d=await post("/api/cost",{project_type,area_sqft,floors,quality,location,extra});
    el("costResults").innerHTML=`<div class="result-text">${md(d.estimate)}</div>`;
  }catch(e){el("costResults").innerHTML=`<div class="err">${esc(e.message)}</div>`;}
});

// ── Material Calculator ────────────────────────────────────────────────────────
el("matBtn").addEventListener("click",async()=>{
  const work_type=el("matWork").value, quantity=parseFloat(el("matQty").value), unit=el("matUnit").value;
  if(!quantity){el("matResults").innerHTML=`<div class="err">Please enter the quantity.</div>`;return;}
  el("matResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Calculating…</div>`;
  try{const d=await post("/api/materials",{work_type,quantity,unit});
    el("matResults").innerHTML=`<div class="result-text">${md(d.result)}</div>`;
  }catch(e){el("matResults").innerHTML=`<div class="err">${esc(e.message)}</div>`;}
});

// ── Safety Monitor ─────────────────────────────────────────────────────────────
el("safetyBtn").addEventListener("click",async()=>{
  const desc=el("safetyDesc").value.trim();
  if(!desc){el("safetyResults").innerHTML=`<div class="err">Please describe the site situation.</div>`;return;}
  el("safetyResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Assessing risks…</div>`;
  try{const d=await post("/api/safety",{description:desc});
    el("safetyResults").innerHTML=`<div class="result-text">${md(d.result)}</div>`;
  }catch(e){el("safetyResults").innerHTML=`<div class="err">${esc(e.message)}</div>`;}
});

async function loadSafetyRisks(){
  if(el("safetyGrid").children.length>0) return;
  try{const d=await get("/api/safety-risks");
    el("safetyGrid").innerHTML=d.risks.map(r=>{
      const cls=r.severity==="CRITICAL"?"sev-critical":r.severity==="HIGH"?"sev-high":r.severity==="MODERATE"?"sev-moderate":"sev-low";
      return `<div class="safety-card"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><h4>${esc(r.risk)}</h4><span class="sev-badge ${cls}">${esc(r.severity)}</span></div><div class="cost-cat">${esc(r.category)}</div><div class="safety-mit">${esc(r.mitigation)}</div></div>`;
    }).join("");
  }catch(e){el("safetyGrid").innerHTML=`<div class="empty" style="grid-column:1/-1">Could not load risks.</div>`;}
}

// ── Defect Diagnosis ───────────────────────────────────────────────────────────
el("defectBtn").addEventListener("click",async()=>{
  const desc=el("defectDesc").value.trim();
  if(!desc){el("defectResults").innerHTML=`<div class="err">Please describe the defect.</div>`;return;}
  el("defectResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Diagnosing…</div>`;
  try{const d=await post("/api/defect",{description:desc});
    el("defectResults").innerHTML=`<div class="result-text">${md(d.result)}</div>`;
  }catch(e){el("defectResults").innerHTML=`<div class="err">${esc(e.message)}</div>`;}
});

// ── Rate Schedule ──────────────────────────────────────────────────────────────
let allRates=[];
async function loadRates(){
  if(el("ratesGrid").children.length>0) return;
  el("ratesGrid").innerHTML=`<div class="loading" style="grid-column:1/-1"><i class="fas fa-circle-notch fa-spin"></i> Loading rates…</div>`;
  try{const d=await get("/api/cost-items"); allRates=d.items; renderRates(allRates);}
  catch(e){el("ratesGrid").innerHTML=`<div class="empty" style="grid-column:1/-1">Could not load rates.</div>`;}
}
function renderRates(items){
  el("ratesGrid").innerHTML=items.map(c=>`<div class="cost-card"><div class="cost-cat">${esc(c.category)}</div><h4>${esc(c.item)}</h4><div class="cost-rate">₹${c.rate_low.toLocaleString()} – ₹${c.rate_high.toLocaleString()}</div><div class="cost-unit">per ${esc(c.unit)}</div></div>`).join("");
}
el("rateSearchBtn").addEventListener("click",()=>{
  const q=el("rateSearch").value.toLowerCase().trim();
  renderRates(q?allRates.filter(c=>c.item.toLowerCase().includes(q)||c.category.toLowerCase().includes(q)):allRates);
});
el("rateSearch").addEventListener("keydown",e=>{if(e.key==="Enter") el("rateSearchBtn").click();});

// ── Init ──────────────────────────────────────────────────────────────────────
const hash=location.hash.replace("#","");
if(hash&&META[hash]) show(hash); else show("dashboard");
loadDashboard();
