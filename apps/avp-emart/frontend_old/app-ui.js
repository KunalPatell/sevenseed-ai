/* AVP Emart — shopping app client */
"use strict";
const API = "";
async function post(p,b){const r=await fetch(API+p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
async function get(p){const r=await fetch(API+p);if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
const el=id=>document.getElementById(id);
const esc=s=>(s||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
const inr=n=>"₹"+Number(n).toLocaleString("en-IN");

const META={
  dashboard:["Dashboard","AI smart-shopping across Amazon, Flipkart, Reliance & Snapdeal"],
  compare:["Compare Prices","Live price comparison + best-value scoring"],
  assistant:["Shopping Assistant","Ask in plain language — AI finds the best deal"],
  reviews:["Review Intelligence","AI verdict with pros & cons"],
  trends:["Price Trends","See the trend — should you buy now?"],
  recommend:["Recommendations","AI-curated best-value picks by category"],
};
function show(panel){
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.panel===panel));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+panel));
  el("panelTitle").textContent=META[panel][0]; el("panelDesc").textContent=META[panel][1];
  el("sidebar").classList.remove("open"); location.hash=panel;
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>show(b.dataset.panel)));
el("menuBtn").addEventListener("click",()=>el("sidebar").classList.toggle("open"));

// Health
async function loadHealth(){
  try{
    const h=await get("/api/health"); const on=h.llm_enabled;
    el("sysBadge").className="sysbadge"+(on?" on":"");
    el("sysBadge").innerHTML=`<i class="fas fa-circle"></i> ${on?h.provider:"offline mode"}`;
    el("provChip").innerHTML=`<i class="fas fa-microchip"></i> ${on?h.provider:"Offline AI"} · ${esc(h.mode)}`;
    return h;
  }catch(e){ el("sysBadge").innerHTML=`<i class="fas fa-triangle-exclamation"></i> API offline`; return {platforms:[],mode:""}; }
}

// Shared: render a comparison result
function cardHTML(p){
  return `<div class="cmp-card ${p.best_value?"best":""}">
    ${p.best_value?`<span class="best-tag"><i class="fas fa-award"></i> Best value</span>`:""}
    <div class="plat">${esc(p.platform)}</div>
    <div class="cmp-name">${esc(p.name)}</div>
    <div class="cmp-price">${inr(p.price)}</div>
    <div class="cmp-meta"><span class="star"><i class="fas fa-star"></i> ${p.rating}</span><span>${Number(p.reviews).toLocaleString("en-IN")} reviews</span></div>
    <div class="val-row"><span>Value ${p.value_score??"—"}</span><div class="val-bar"><div class="val-fill" style="width:${p.value_score||0}%"></div></div></div>
    <a class="buy-btn" href="${esc(p.link)}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> View on ${esc(p.platform)}</a>
  </div>`;
}
function chartHTML(products){
  const max=Math.max(...products.map(p=>p.price))||1;
  const min=Math.min(...products.map(p=>p.price));
  return `<div class="chart">${products.map(p=>{
    const h=Math.max(8,Math.round(p.price/max*100));
    return `<div class="bar-col"><span class="bar-val">${inr(p.price)}</span><div class="bar ${p.price===min?"min":""}" style="height:${h}%"></div><span class="bar-lbl">${esc(p.platform)}</span></div>`;
  }).join("")}</div>`;
}
function renderCompare(container,data){
  const P=data.products||[];
  if(!P.length){ container.innerHTML=`<div class="empty">No results for that product. Try another search.</div>`; return; }
  const hl=`<div class="hl-row">
    <div class="hl-tile best-h"><div class="k"><i class="fas fa-award"></i> Best value</div><div class="v">${esc(data.best.platform)} · ${inr(data.best.price)}</div></div>
    <div class="hl-tile"><div class="k"><i class="fas fa-tag"></i> Cheapest</div><div class="v">${esc(data.cheapest.platform)} · ${inr(data.cheapest.price)}</div></div>
    <div class="hl-tile"><div class="k"><i class="fas fa-star"></i> Top rated</div><div class="v">${data.top_rated.rating}★ · ${esc(data.top_rated.platform)}</div></div>
  </div>`;
  container.innerHTML = hl + `<h3 class="block-title">Price by platform</h3>` + chartHTML(P)
    + `<h3 class="block-title" style="margin-top:20px">All listings (${P.length})</h3>`
    + `<div class="cmp-grid">${P.map(cardHTML).join("")}</div>`;
}

// Compare panel
const SUGGEST=["iPhone 15","boAt earbuds","air fryer","Samsung TV","gaming laptop","smartwatch"];
el("cmpSuggest").innerHTML=SUGGEST.map(s=>`<span class="qs">${s}</span>`).join("");
el("cmpSuggest").querySelectorAll(".qs").forEach(x=>x.addEventListener("click",()=>{el("cmpSearch").value=x.textContent;runCompare();}));
async function runCompare(){
  const q=el("cmpSearch").value.trim(); if(!q){el("cmpResults").innerHTML=`<div class="err">Enter a product to compare.</div>`;return;}
  const btn=el("cmpBtn"); btn.disabled=true;
  el("cmpResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Comparing across 4 platforms…</div>`;
  try{ renderCompare(el("cmpResults"), await post("/api/compare",{query:q,n:6})); }
  catch(e){ el("cmpResults").innerHTML=`<div class="err">Request failed. Is the server running?</div>`; }
  btn.disabled=false;
}
el("cmpBtn").addEventListener("click",runCompare);
el("cmpSearch").addEventListener("keydown",e=>{if(e.key==="Enter")runCompare();});

// Dashboard
async function loadDashboard(){
  const h=await loadHealth();
  el("statTiles").innerHTML=[
    [(h.platforms||[]).length||4,"Platforms"],["AI","Best-Value Scoring"],[h.llm_enabled?"LLM":"Offline","AI Mode"],[6,"Tools"]
  ].map(([n,l])=>`<div class="tile"><div class="tile-num">${n}</div><div class="tile-lbl">${l}</div></div>`).join("");
  const quick=[
    ["compare","fa-scale-balanced","Compare Prices","Across 4 platforms"],
    ["assistant","fa-robot","Shopping Assistant","Ask in plain language"],
    ["reviews","fa-comments","Review Intelligence","Pros & cons verdict"],
    ["trends","fa-chart-line","Price Trends","Buy now or wait?"],
    ["recommend","fa-wand-magic-sparkles","Recommendations","Best-value picks"],
  ];
  el("quickGrid").innerHTML=quick.map(([p,i,t,d])=>`<div class="quick-card" data-go="${p}"><div class="quick-ic"><i class="fas ${i}"></i></div><h4>${t}</h4><p>${d}</p></div>`).join("");
  el("quickGrid").querySelectorAll(".quick-card").forEach(x=>x.addEventListener("click",()=>show(x.dataset.go)));
}
function dashCompare(){ const q=el("dashSearch").value.trim(); if(!q)return; el("cmpSearch").value=q; show("compare"); runCompare(); }
el("dashSearchBtn").addEventListener("click",dashCompare);
el("dashSearch").addEventListener("keydown",e=>{if(e.key==="Enter")dashCompare();});

// Assistant
const ASK=["best earbuds under ₹2000","5G phone under ₹20000","cheapest air fryer","best laptop for students"];
el("askSuggest").innerHTML=ASK.map(s=>`<span class="suggest-chip">${esc(s)}</span>`).join("");
el("askSuggest").querySelectorAll(".suggest-chip").forEach(c=>c.addEventListener("click",()=>{el("askInput").value=c.textContent;sendAsk();}));
let askBusy=false;
function addMsg(role,html){
  const w=document.createElement("div"); w.className="msg "+role;
  w.innerHTML=`<div class="msg-ic"><i class="fas fa-${role==="ai"?"robot":"user"}"></i></div><div class="msg-body">${html}</div>`;
  el("chatScroll").appendChild(w); el("chatScroll").scrollTop=el("chatScroll").scrollHeight; return w;
}
async function sendAsk(){
  const q=el("askInput").value.trim(); if(!q||askBusy)return; askBusy=true; el("askInput").value="";
  addMsg("user",esc(q));
  const t=addMsg("ai",`<span class="loading" style="padding:0"><i class="fas fa-circle-notch fa-spin"></i> comparing…</span>`);
  try{
    const r=await post("/api/assistant",{message:q});
    let html=md(r.reply);
    if(r.products&&r.products.length) html+=`<div class="ask-picks">${r.products.slice(0,4).map(p=>`
      <a class="ask-pick ${p.best_value?"best":""}" href="${esc(p.link)}" target="_blank" rel="noopener">
        <span class="ap-plat">${esc(p.platform)}</span><span class="ap-price">${inr(p.price)}</span>
        <span class="ap-meta">${p.rating}★ · value ${p.value_score}${p.best_value?' · <span class="ap-best">best</span>':""}</span>
      </a>`).join("")}</div>`;
    t.querySelector(".msg-body").innerHTML=html;
    el("chatScroll").scrollTop=el("chatScroll").scrollHeight;
  }catch(e){ t.querySelector(".msg-body").innerHTML=`<span class="err">Could not reach the assistant.</span>`; }
  askBusy=false;
}
el("askSend").addEventListener("click",sendAsk);
el("askInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendAsk();});

// Reviews
el("revBtn").addEventListener("click",async()=>{
  const product=el("revProduct").value.trim();
  if(!product && !el("revText").value.trim()){ el("revResults").innerHTML=`<div class="err">Enter a product or paste reviews.</div>`; return; }
  const btn=el("revBtn"); btn.disabled=true;
  el("revResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Analyzing reviews…</div>`;
  try{
    const r=await post("/api/reviews",{product,reviews_text:el("revText").value});
    el("revResults").innerHTML=`<div class="res-card">
      <div class="advice-box">${md(r.verdict)}</div>
      <div class="prcon">
        <div class="pros"><h5><i class="fas fa-thumbs-up"></i> Pros</h5><ul>${r.pros.map(p=>`<li><i class="fas fa-check"></i> ${esc(p)}</li>`).join("")}</ul></div>
        <div class="cons"><h5><i class="fas fa-thumbs-down"></i> Cons</h5><ul>${r.cons.map(c=>`<li><i class="fas fa-xmark"></i> ${esc(c)}</li>`).join("")}</ul></div>
      </div></div>`;
  }catch(e){ el("revResults").innerHTML=`<div class="err">Request failed.</div>`; }
  btn.disabled=false;
});

// Trends
function sparkline(points){
  const w=560,h=90,pad=6, max=Math.max(...points),min=Math.min(...points),rng=(max-min)||1;
  const step=(w-pad*2)/(points.length-1);
  const pts=points.map((v,i)=>`${(pad+i*step).toFixed(1)},${(h-pad-(v-min)/rng*(h-pad*2)).toFixed(1)}`).join(" ");
  const last=pts.split(" ").slice(-1)[0].split(",");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline fill="none" stroke="url(#g)" stroke-width="2.5" points="${pts}"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="4" fill="var(--secondary-l)"/>
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="var(--primary)"/><stop offset="1" stop-color="var(--secondary)"/></linearGradient></defs>
  </svg>`;
}
el("trendBtn").addEventListener("click",async()=>{
  const q=el("trendSearch").value.trim(); if(!q){el("trendResults").innerHTML=`<div class="err">Enter a product.</div>`;return;}
  const btn=el("trendBtn"); btn.disabled=true;
  el("trendResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Analyzing price history…</div>`;
  try{
    const r=await post("/api/trend",{query:q,weeks:12});
    const dir=r.direction==="falling";
    el("trendResults").innerHTML=`<div class="res-card">
      <div class="res-head"><h4>${esc(r.query)}</h4><span class="score-badge" style="background:${dir?"rgba(16,185,129,.16);color:#6ee7b7":"rgba(239,68,68,.14);color:#fca5a5"}">${r.change_pct}%</span></div>
      <div class="res-sub">Best on ${esc(r.best_platform)} · current ${inr(r.current)}</div>
      ${sparkline(r.points)}
      <div class="advice-box" style="margin-top:12px"><i class="fas fa-${dir?"arrow-trend-down":"arrow-trend-up"}"></i> ${esc(r.summary)}</div>
    </div>`;
  }catch(e){ el("trendResults").innerHTML=`<div class="err">Request failed.</div>`; }
  btn.disabled=false;
});

// Recommendations
let recCats=[];
async function loadRec(cat){
  el("recResults").innerHTML=`<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Curating best-value picks…</div>`;
  try{
    const r=await get("/api/recommend"+(cat?`?category=${encodeURIComponent(cat)}`:""));
    if(!recCats.length){ recCats=r.categories;
      el("catSeg").innerHTML=recCats.map((c,i)=>`<button class="seg-btn ${c===r.category?"active":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
      el("catSeg").querySelectorAll(".seg-btn").forEach(b=>b.addEventListener("click",()=>{
        el("catSeg").querySelectorAll(".seg-btn").forEach(x=>x.classList.remove("active")); b.classList.add("active"); loadRec(b.dataset.cat);
      }));
    }
    el("recResults").innerHTML=`<div class="cmp-grid">${r.items.map((it,i)=>`
      <div class="cmp-card ${i===0?"best":""}">${i===0?`<span class="best-tag"><i class="fas fa-crown"></i> Top pick</span>`:""}
        <div class="plat">${esc(it.platform)}</div><div class="cmp-name">${esc(it.name)}</div>
        <div class="cmp-price">${inr(it.price)}</div>
        <div class="cmp-meta"><span class="star"><i class="fas fa-star"></i> ${it.rating}</span><span>value ${it.value_score}</span></div>
        <a class="buy-btn" href="${esc(it.link)}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> View</a>
      </div>`).join("")}</div>`;
  }catch(e){ el("recResults").innerHTML=`<div class="err">Request failed.</div>`; }
}

// Boot
loadDashboard();
loadRec("");
const start=(location.hash||"").replace("#","");
if(start&&META[start]) show(start);
