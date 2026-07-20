/* AVP Charitable Trust Portal — client logic */
"use strict";
const API="";
async function post(p,b){const r=await fetch(API+p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
async function get(p){const r=await fetch(API+p);if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
const el=id=>document.getElementById(id);
function esc(s){return(s||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
function md(s){return esc(s).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");}

const META={dashboard:["Dashboard","AI-powered social impact platform"],donor:["Donor Assistant","Ask about donations, 80G tax, CSR & volunteering"],needs:["Needs Assessment","AI identifies community priority interventions"],beneficiary:["Beneficiary Matcher","Match applicants to the right programs"],impact:["Impact Report","AI-generated impact reports for donors & CSR"],programs:["Our Programs","All active programs with eligibility details"]};
function show(panel){document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.panel===panel));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+panel));el("panelTitle").textContent=META[panel][0];el("panelDesc").textContent=META[panel][1];el("sidebar").classList.remove("open");location.hash=panel;if(panel==="programs")loadPrograms();}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>show(b.dataset.panel)));
el("menuBtn").addEventListener("click",()=>el("sidebar").classList.toggle("open"));

async function loadHealth(){try{const h=await get("/api/health");const on=h.llm_enabled;el("sysBadge").className="sysbadge"+(on?" on":"");el("sysBadge").innerHTML=`<i class="fas fa-circle"></i> ${on?h.provider:"offline mode"}`;el("provChip").innerHTML=`<i class="fas fa-microchip"></i> ${on?h.provider:"Offline AI"} · ${h.rag_backend.split(" ")[0]} RAG`;return h;}catch(e){el("sysBadge").innerHTML=`<i class="fas fa-triangle-exclamation"></i> API offline`;return{counts:{}};}}

async function loadDashboard(){
  const h=await loadHealth();const c=h.counts||{};
  el("statTiles").innerHTML=[[c.programs||0,"Programs"],[c.knowledge||0,"Knowledge Topics"],["80G","Tax Exempt"],[5,"AI Tools"]].map(([n,l])=>`<div class="tile"><div class="tile-num">${n}</div><div class="tile-lbl">${l}</div></div>`).join("");
  const quick=[["donor","fa-robot","Donor Assistant","Ask about donations & tax benefits"],["needs","fa-map-location-dot","Needs Assessment","Identify community priorities"],["beneficiary","fa-users","Beneficiary Matcher","Match applicants to programs"],["impact","fa-chart-bar","Impact Report","Generate donor/CSR reports"],["programs","fa-list-check","Our Programs","View all active programs"]];
  el("quickGrid").innerHTML=quick.map(([p,i,t,d])=>`<div class="quick-card" data-go="${p}"><div class="quick-ic"><i class="fas ${i}"></i></div><h4>${t}</h4><p>${d}</p></div>`).join("");
  el("quickGrid").querySelectorAll(".quick-card").forEach(x=>x.addEventListener("click",()=>show(x.dataset.go)));
  try{const d=await get("/api/programs");el("impactGrid").innerHTML=(d.metrics||[]).map(m=>`<div class="impact-card"><div class="impact-val">${esc(m.value)}</div><div class="impact-met">${esc(m.metric)}</div><div class="impact-per">${esc(m.period)}</div></div>`).join("");}catch(e){el("impactGrid").innerHTML="<div class='empty' style='grid-column:1/-1'>Loading…</div>";}
}

const SUGGESTIONS=["How do I donate to AVP Trust?","What is the 80G tax benefit?","How can my company do CSR with you?","What programs do you run?","How do I volunteer?","How are funds utilized?"];
let sid=null;
function appendMsg(role,html){const wrap=el("chatScroll");const div=document.createElement("div");div.className=`msg ${role}`;const icon=role==="ai"?`<i class="fas fa-heart"></i>`:`<i class="fas fa-user"></i>`;div.innerHTML=`<div class="msg-ic">${icon}</div><div class="msg-body">${html}</div>`;wrap.appendChild(div);wrap.scrollTop=wrap.scrollHeight;}
async function sendDonor(){const input=el("donorInput");const msg=input.value.trim();if(!msg)return;input.value="";appendMsg("user",esc(msg));appendMsg("ai",`<span class="loading"><i class="fas fa-circle-notch fa-spin"></i> Thinking…</span>`);try{const d=await post("/api/donor",{message:msg,session_id:sid});sid=d.session_id||sid;el("chatScroll").lastElementChild.querySelector(".msg-body").innerHTML=md(d.reply||"No response.");}catch(e){el("chatScroll").lastElementChild.querySelector(".msg-body").innerHTML=`<span class="err">${esc(e.message)}</span>`;}}
el("donorSend").addEventListener("click",sendDonor);el("donorInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendDonor();}});
el("donorSuggest").innerHTML=SUGGESTIONS.slice(0,4).map(s=>`<button class="suggest-chip">${esc(s)}</button>`).join("");
el("donorSuggest").querySelectorAll(".suggest-chip").forEach(b=>b.addEventListener("click",()=>{el("donorInput").value=b.textContent;sendDonor();}));

el("needsBtn").addEventListener("click",async()=>{const location=el("needsLocation").value.trim(),population=el("needsPop").value.trim(),issues=el("needsIssues").value.trim(),income_level=el("needsIncome").value;if(!location||!issues){el("needsResults").innerHTML=`<div class="err">Please fill in location and issues.</div>`;return;}el("needsResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Assessing needs…</div>`;try{const d=await post("/api/needs",{location,population,issues,income_level});el("needsResults").innerHTML=`<div class="result-text">${md(d.result)}</div>`;}catch(e){el("needsResults").innerHTML=`<div class="err">${esc(e.message)}</div>`;}});

el("benBtn").addEventListener("click",async()=>{const name=el("benName").value.trim(),age=el("benAge").value.trim(),location=el("benLocation").value.trim(),issues=el("benIssues").value.trim(),income=el("benIncome").value.trim();if(!name||!issues){el("benResults").innerHTML=`<div class="err">Please enter name and primary need.</div>`;return;}el("benResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Matching programs…</div>`;try{const d=await post("/api/beneficiary",{name,age,location,issues,income});el("benResults").innerHTML=`<div class="result-text">${md(d.result)}</div>`;}catch(e){el("benResults").innerHTML=`<div class="err">${esc(e.message)}</div>`;}});

el("impactBtn").addEventListener("click",async()=>{const period=el("impactPeriod").value;el("impactResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Generating report…</div>`;try{const d=await post("/api/impact",{period});el("impactResults").innerHTML=`<div class="result-text">${md(d.report)}</div>`;}catch(e){el("impactResults").innerHTML=`<div class="err">${esc(e.message)}</div>`;}});

async function loadPrograms(){if(el("progGrid").children.length>0)return;el("progGrid").innerHTML=`<div class="loading" style="grid-column:1/-1"><i class="fas fa-circle-notch fa-spin"></i> Loading…</div>`;try{const d=await get("/api/programs");el("progGrid").innerHTML=(d.programs||[]).map(p=>`<div class="prog-card"><div class="prog-cat">Program</div><h4>${esc(p.name)}</h4><p>${esc(p.beneficiary)}</p>${p.amount?`<span class="prog-tag"><i class="fas fa-indian-rupee-sign"></i> ${esc(p.amount)}</span>`:""}${p.duration?`<span class="prog-tag"><i class="fas fa-clock"></i> ${esc(p.duration)}</span>`:""}${p.district?`<span class="prog-tag"><i class="fas fa-location-dot"></i> ${esc(p.district)}</span>`:""}${p.eligibility?`<div style="font-size:12px;color:var(--text-2);margin-top:10px"><strong>Eligibility:</strong> ${esc(p.eligibility)}</div>`:""}</div>`).join("");}catch(e){el("progGrid").innerHTML=`<div class="empty" style="grid-column:1/-1">Could not load programs.</div>`;}}

const hash=location.hash.replace("#","");if(hash&&META[hash])show(hash);else show("dashboard");loadDashboard();
