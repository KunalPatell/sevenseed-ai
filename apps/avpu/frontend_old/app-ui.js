/* AVPU Student Portal — client logic */
"use strict";
const API = ""; // same origin

async function post(path, body){
  const r = await fetch(API + path, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
  if(!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}
async function get(path){ const r = await fetch(API + path); if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); }
const el = (id) => document.getElementById(id);
function esc(s){ return (s||"").replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }
function md(s){ return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
function scoreColor(v){ return v>=75 ? "rgba(16,185,129,.16);color:#6ee7b7" : v>=50 ? "rgba(245,158,11,.16);color:#fcd34d" : "rgba(239,68,68,.14);color:#fca5a5"; }

// ── Panel routing ────────────────────────────────────────────────────────────
const META = {
  dashboard:["Dashboard","Your AI-powered student portal"],
  tutor:["AI Tutor","Ask anything — grounded in AVPU's knowledge base"],
  placement:["Placement Matcher","AI-match your skills to hiring partners"],
  admissions:["Smart Admissions","Find your best-fit AVPU program"],
  assess:["Auto Assessment","Instant AI grading with feedback"],
  research:["Research Copilot","Summarize or outline any text"],
  roadmap:["Learning Roadmap","A week-by-week plan for your goal"],
};
function show(panel){
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.panel===panel));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id==="panel-"+panel));
  el("panelTitle").textContent = META[panel][0];
  el("panelDesc").textContent = META[panel][1];
  el("sidebar").classList.remove("open");
  location.hash = panel;
}
document.querySelectorAll(".nav-item").forEach(b => b.addEventListener("click", ()=>show(b.dataset.panel)));
el("menuBtn").addEventListener("click", ()=>el("sidebar").classList.toggle("open"));

// ── Health / status ──────────────────────────────────────────────────────────
async function loadHealth(){
  try{
    const h = await get("/api/health");
    const on = h.llm_enabled;
    el("sysBadge").className = "sysbadge" + (on?" on":"");
    el("sysBadge").innerHTML = `<i class="fas fa-circle"></i> ${on? h.provider : "offline mode"}`;
    el("provChip").innerHTML = `<i class="fas fa-microchip"></i> ${on? h.provider : "Offline AI"} · ${h.rag_backend.split(" ")[0]} RAG`;
    return h;
  }catch(e){
    el("sysBadge").innerHTML = `<i class="fas fa-triangle-exclamation"></i> API offline`;
    return {counts:{programs:0,companies:0,knowledge:0}};
  }
}

// ── Dashboard ────────────────────────────────────────────────────────────────
async function loadDashboard(){
  const h = await loadHealth();
  const c = h.counts || {programs:0,companies:0,knowledge:0};
  el("statTiles").innerHTML = [
    [c.programs,"Programs"],[c.companies,"Hiring Partners"],[c.knowledge,"Knowledge Topics"],[6,"AI Tools"]
  ].map(([n,l])=>`<div class="tile"><div class="tile-num">${n}</div><div class="tile-lbl">${l}</div></div>`).join("");

  const quick = [
    ["tutor","fa-robot","AI Tutor","Get instant help on any topic"],
    ["placement","fa-briefcase","Placement Matcher","Match your skills to jobs"],
    ["admissions","fa-user-graduate","Smart Admissions","Find your best-fit program"],
    ["assess","fa-clipboard-check","Auto Assessment","Grade your answers instantly"],
    ["research","fa-flask","Research Copilot","Summarize & outline text"],
    ["roadmap","fa-route","Learning Roadmap","Plan your learning journey"],
  ];
  el("quickGrid").innerHTML = quick.map(([p,i,t,d])=>
    `<div class="quick-card" data-go="${p}"><div class="quick-ic"><i class="fas ${i}"></i></div><h4>${t}</h4><p>${d}</p></div>`).join("");
  el("quickGrid").querySelectorAll(".quick-card").forEach(x=>x.addEventListener("click",()=>show(x.dataset.go)));

  try{
    const {programs} = await get("/api/programs");
    el("progGrid").innerHTML = programs.slice(0,6).map(p=>
      `<div class="prog-card"><div class="lvl">${p.level}</div><h4>${esc(p.name)}</h4><p>${esc(p.desc)}</p>
       <div class="prog-meta"><span><i class="fas fa-clock"></i> ${p.duration}</span><span><i class="fas fa-indian-rupee-sign"></i> ${esc(p.fees)}</span></div></div>`).join("");
  }catch(e){ el("progGrid").innerHTML = `<div class="empty">Programs unavailable</div>`; }
}

// ── AI Tutor ─────────────────────────────────────────────────────────────────
let tutorSession = null, tutorBusy = false;
const SUGGESTS = ["Explain how RAG works","What is a stack data structure?","How do I apply for admission?","Which companies hire for AI roles?"];
el("tutorSuggest").innerHTML = SUGGESTS.map(s=>`<span class="suggest-chip">${esc(s)}</span>`).join("");
el("tutorSuggest").querySelectorAll(".suggest-chip").forEach(c=>c.addEventListener("click",()=>{el("tutorInput").value=c.textContent;sendTutor();}));

function addMsg(role, html, sources){
  const wrap = document.createElement("div");
  wrap.className = "msg " + role;
  const ic = role==="ai" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
  let src = "";
  if(sources && sources.length) src = `<div class="msg-src">${sources.map(s=>`<span>📚 ${esc(s)}</span>`).join("")}</div>`;
  wrap.innerHTML = `<div class="msg-ic">${ic}</div><div class="msg-body">${html}${src}</div>`;
  el("chatScroll").appendChild(wrap);
  el("chatScroll").scrollTop = el("chatScroll").scrollHeight;
  return wrap;
}
async function sendTutor(){
  const input = el("tutorInput"); const q = input.value.trim();
  if(!q || tutorBusy) return;
  tutorBusy = true; input.value = "";
  addMsg("user", esc(q));
  const thinking = addMsg("ai", `<span class="loading" style="padding:0"><i class="fas fa-circle-notch fa-spin"></i> thinking…</span>`);
  try{
    const r = await post("/api/tutor", {message:q, session_id:tutorSession});
    tutorSession = r.session_id;
    thinking.querySelector(".msg-body").innerHTML = md(r.reply) +
      ((r.sources&&r.sources.length)?`<div class="msg-src">${r.sources.map(s=>`<span>📚 ${esc(s)}</span>`).join("")}</div>`:"");
  }catch(e){
    thinking.querySelector(".msg-body").innerHTML = `<span class="err">Could not reach the tutor. Is the server running?</span>`;
  }
  tutorBusy = false;
}
el("tutorSend").addEventListener("click", sendTutor);
el("tutorInput").addEventListener("keydown", e=>{ if(e.key==="Enter") sendTutor(); });

// ── Placement Matcher ────────────────────────────────────────────────────────
let skills = [];
const QUICK_SKILLS = ["Python","JavaScript","React","Node.js","SQL","Machine Learning","Java","AWS","Docker","Data Science"];
function renderSkills(){
  el("skillChips").innerHTML = skills.map((s,i)=>`<span class="chip">${esc(s)} <i class="fas fa-xmark" data-i="${i}"></i></span>`).join("");
  el("skillChips").querySelectorAll("i").forEach(x=>x.addEventListener("click",()=>{skills.splice(+x.dataset.i,1);renderSkills();}));
}
function addSkill(s){ s=s.trim(); if(s && !skills.some(k=>k.toLowerCase()===s.toLowerCase())){ skills.push(s); renderSkills(); } }
el("quickSkills").innerHTML = QUICK_SKILLS.map(s=>`<span class="qs">+ ${s}</span>`).join("");
el("quickSkills").querySelectorAll(".qs").forEach(x=>x.addEventListener("click",()=>addSkill(x.textContent.slice(2))));
el("skillInput").addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); addSkill(el("skillInput").value); el("skillInput").value=""; }});
el("placeBtn").addEventListener("click", async ()=>{
  if(!skills.length){ el("placeResults").innerHTML = `<div class="err">Add at least one skill first.</div>`; return; }
  const btn = el("placeBtn"); btn.disabled = true;
  el("placeResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Matching you to companies…</div>`;
  try{
    const r = await post("/api/placement", {skills, interests: el("placeInterests").value});
    let html = "";
    if(r.skill_gaps && r.skill_gaps.length)
      html += `<div class="advice-box"><strong>Skills to learn next:</strong> ${r.skill_gaps.map(g=>esc(g)).join(", ")} — these unlock more roles.</div>`;
    html += r.matches.map(m=>`
      <div class="res-card">
        <div class="res-head"><h4>${esc(m.name)}</h4><span class="score-badge" style="background:${scoreColor(m.match)}">${m.match}% match</span></div>
        <div class="res-sub">${esc(m.sector)} · ${esc(m.city)}</div>
        <div class="match-bar"><div class="match-fill" style="width:${m.match}%"></div></div>
        <div class="pill-list">${m.roles.map(x=>`<span class="pill role">${esc(x)}</span>`).join("")}</div>
        <div class="pill-list">${m.matched_skills.map(x=>`<span class="pill have"><i class="fas fa-check"></i> ${esc(x)}</span>`).join("")}
          ${m.missing_skills.map(x=>`<span class="pill gap">${esc(x)}</span>`).join("")}</div>
      </div>`).join("");
    el("placeResults").innerHTML = html || `<div class="empty">No matches — try different skills.</div>`;
  }catch(e){ el("placeResults").innerHTML = `<div class="err">Request failed. Is the server running?</div>`; }
  btn.disabled = false;
});

// ── Smart Admissions ─────────────────────────────────────────────────────────
el("admBtn").addEventListener("click", async ()=>{
  const interests = el("admInterests").value.trim();
  if(!interests){ el("admResults").innerHTML = `<div class="err">Tell us your interests first.</div>`; return; }
  const btn = el("admBtn"); btn.disabled = true;
  el("admResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Finding your best-fit program…</div>`;
  try{
    const r = await post("/api/admissions", {interests, background: el("admBackground").value, goal: el("admGoal").value});
    let html = `<div class="advice-box">${md(r.advice)}</div>`;
    html += r.recommendations.map(p=>`
      <div class="res-card">
        <div class="res-head"><h4>${esc(p.name)}</h4><span class="score-badge" style="background:${scoreColor(p.score)}">${p.score}% fit</span></div>
        <div class="res-sub">${esc(p.level)} · ${esc(p.duration)} · ${esc(p.fees)}</div>
        <p style="color:var(--text-2);font-size:13.5px;margin-bottom:8px">${esc(p.desc)}</p>
        <div class="pill-list">${p.skills.slice(0,5).map(s=>`<span class="pill role">${esc(s)}</span>`).join("")}</div>
      </div>`).join("");
    el("admResults").innerHTML = html;
  }catch(e){ el("admResults").innerHTML = `<div class="err">Request failed. Is the server running?</div>`; }
  btn.disabled = false;
});

// ── Auto Assessment ──────────────────────────────────────────────────────────
el("assessBtn").addEventListener("click", async ()=>{
  const question = el("assessQ").value.trim(), answer = el("assessA").value.trim();
  if(!question || !answer){ el("assessResults").innerHTML = `<div class="err">Enter both a question and your answer.</div>`; return; }
  const btn = el("assessBtn"); btn.disabled = true;
  el("assessResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Grading your answer…</div>`;
  try{
    const r = await post("/api/assess", {question, answer});
    const pills = (arr,cls)=>arr.map(x=>`<span class="pill ${cls}">${esc(x)}</span>`).join("");
    el("assessResults").innerHTML = `
      <div class="res-card">
        <div class="gauge">
          <div class="gauge-ring" style="--v:${r.score}"><span class="gauge-val">${r.score}</span></div>
          <div><h4 style="font-size:16px;margin-bottom:6px">Your score: ${r.score}/100</h4><p style="color:var(--text-2);font-size:14px">${md(r.feedback)}</p></div>
        </div>
        ${r.strengths&&r.strengths.length?`<div style="margin-top:14px"><div class="res-sub"><strong>Strengths</strong></div><div class="pill-list">${pills(r.strengths,"have")}</div></div>`:""}
        ${r.improvements&&r.improvements.length?`<div style="margin-top:10px"><div class="res-sub"><strong>To improve</strong></div><div class="pill-list">${pills(r.improvements,"gap")}</div></div>`:""}
      </div>`;
  }catch(e){ el("assessResults").innerHTML = `<div class="err">Request failed. Is the server running?</div>`; }
  btn.disabled = false;
});

// ── Research Copilot ─────────────────────────────────────────────────────────
let researchMode = "summarize";
el("researchMode").querySelectorAll(".seg-btn").forEach(b=>b.addEventListener("click",()=>{
  el("researchMode").querySelectorAll(".seg-btn").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); researchMode = b.dataset.mode;
}));
el("researchBtn").addEventListener("click", async ()=>{
  const text = el("researchText").value.trim();
  if(text.length < 30){ el("researchResults").innerHTML = `<div class="err">Paste a bit more text (30+ characters).</div>`; return; }
  const btn = el("researchBtn"); btn.disabled = true;
  el("researchResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Running copilot…</div>`;
  try{
    const r = await post("/api/research", {text, mode:researchMode});
    el("researchResults").innerHTML = `<div class="result-text">${md(r.result)}</div>`;
  }catch(e){ el("researchResults").innerHTML = `<div class="err">Request failed. Is the server running?</div>`; }
  btn.disabled = false;
});

// ── Learning Roadmap ─────────────────────────────────────────────────────────
el("roadBtn").addEventListener("click", async ()=>{
  const goal = el("roadGoal").value.trim();
  if(!goal){ el("roadResults").innerHTML = `<div class="err">Enter a goal first.</div>`; return; }
  const btn = el("roadBtn"); btn.disabled = true;
  el("roadResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Building your roadmap…</div>`;
  try{
    const r = await post("/api/roadmap", {goal, level: el("roadLevel").value, weeks: +el("roadWeeks").value});
    el("roadResults").innerHTML = `<div class="res-card"><div class="week-list">${
      r.plan.map((w,i)=>{ const m = w.match(/^week\s*\d+[:\-]?\s*/i); const body = m ? w.slice(m[0].length) : w;
        return `<div class="week"><span class="week-n">W${i+1}</span><span>${esc(body)}</span></div>`; }).join("")
    }</div></div>`;
  }catch(e){ el("roadResults").innerHTML = `<div class="err">Request failed. Is the server running?</div>`; }
  btn.disabled = false;
});

// ── Boot ─────────────────────────────────────────────────────────────────────
loadDashboard();
const start = (location.hash||"").replace("#","");
if(start && META[start]) show(start);
