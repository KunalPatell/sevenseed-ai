/* Decode Forest Pharmacy Portal — client logic */
"use strict";
const API = "";

async function post(path, body) {
  const r = await fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}
async function get(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}
const el = (id) => document.getElementById(id);
function esc(s) { return (s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function md(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^(#{1,3})\s+(.+)$/gm, (_, h, t) => `<strong>${t}</strong>`)
    .replace(/\n/g, "<br>");
}

// ── Panel routing ─────────────────────────────────────────────────────────────
const META = {
  dashboard:     ["Dashboard",            "Your AI-powered pharmacy portal"],
  assistant:     ["AI Health Assistant",  "Ask anything about medicines & health"],
  prescription:  ["Prescription Reader",  "AI explains your prescription"],
  interactions:  ["Drug Interactions",    "Check for dangerous drug combinations"],
  substitutes:   ["Smart Substitutes",    "Find safe, affordable generic alternatives"],
  refill:        ["Refill Predictor",     "Never run out of your medicines"],
  symptoms:      ["Symptom Guide",        "Responsible OTC guidance for your symptoms"],
  medicines:     ["Medicine Search",      "Search our pharmacy knowledge base"],
};

function show(panel) {
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.panel === panel));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + panel));
  el("panelTitle").textContent = META[panel][0];
  el("panelDesc").textContent = META[panel][1];
  el("sidebar").classList.remove("open");
  location.hash = panel;
}
document.querySelectorAll(".nav-item").forEach(b => b.addEventListener("click", () => show(b.dataset.panel)));
el("menuBtn").addEventListener("click", () => el("sidebar").classList.toggle("open"));

// ── Health / status ────────────────────────────────────────────────────────────
async function loadHealth() {
  try {
    const h = await get("/api/health");
    const on = h.llm_enabled;
    el("sysBadge").className = "sysbadge" + (on ? " on" : "");
    el("sysBadge").innerHTML = `<i class="fas fa-circle"></i> ${on ? h.provider : "offline mode"}`;
    el("provChip").innerHTML = `<i class="fas fa-microchip"></i> ${on ? h.provider : "Offline AI"} · ${h.rag_backend.split(" ")[0]} RAG`;
    return h;
  } catch (e) {
    el("sysBadge").innerHTML = `<i class="fas fa-triangle-exclamation"></i> API offline`;
    return { counts: { medicines: 0, interactions: 0, health_topics: 0, symptoms: 0 } };
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function loadDashboard() {
  const h = await loadHealth();
  const c = h.counts || { medicines: 0, interactions: 0, health_topics: 0, symptoms: 0 };
  el("statTiles").innerHTML = [
    [c.medicines, "Medicines"], [c.interactions, "Interactions DB"],
    [c.health_topics, "Health Topics"], [7, "AI Tools"]
  ].map(([n, l]) => `<div class="tile"><div class="tile-num">${n}</div><div class="tile-lbl">${l}</div></div>`).join("");

  const quick = [
    ["assistant", "fa-robot", "AI Health Assistant", "Ask any medicine or health question"],
    ["prescription", "fa-file-prescription", "Prescription Reader", "Paste your prescription — AI explains it"],
    ["interactions", "fa-triangle-exclamation", "Drug Interactions", "Check if your medicines clash"],
    ["substitutes", "fa-pills", "Smart Substitutes", "Find cheaper generic alternatives"],
    ["refill", "fa-calendar-check", "Refill Predictor", "Never miss a medicine refill"],
    ["symptoms", "fa-stethoscope", "Symptom Guide", "Responsible OTC guidance"],
  ];
  el("quickGrid").innerHTML = quick.map(([p, i, t, d]) =>
    `<div class="quick-card" data-go="${p}"><div class="quick-ic"><i class="fas ${i}"></i></div><h4>${t}</h4><p>${d}</p></div>`).join("");
  el("quickGrid").querySelectorAll(".quick-card").forEach(x => x.addEventListener("click", () => show(x.dataset.go)));
}

// ── AI Health Assistant ────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What is Paracetamol used for?",
  "Can I take Ibuprofen and Aspirin together?",
  "What are the side effects of Metformin?",
  "How should I store Insulin?",
  "What is the maximum dose of Paracetamol per day?",
  "Explain what a PPI medicine does",
];

let sessionId = null;

function appendMsg(role, html) {
  const wrap = el("chatScroll");
  const icon = role === "ai" ? `<i class="fas fa-mortar-pestle"></i>` : `<i class="fas fa-user"></i>`;
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerHTML = `<div class="msg-ic">${icon}</div><div class="msg-body">${html}</div>`;
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
}

async function sendAssistant() {
  const input = el("assistantInput");
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  appendMsg("user", esc(msg));
  appendMsg("ai", `<span class="loading"><i class="fas fa-circle-notch fa-spin"></i> Analysing…</span>`);
  try {
    const data = await post("/api/assistant", { message: msg, session_id: sessionId });
    sessionId = data.session_id || sessionId;
    const last = el("chatScroll").lastElementChild;
    last.querySelector(".msg-body").innerHTML = md(data.reply || "No response.");
  } catch (e) {
    const last = el("chatScroll").lastElementChild;
    last.querySelector(".msg-body").innerHTML = `<span class="err">Error: ${esc(e.message)}</span>`;
  }
}
el("assistantSend").addEventListener("click", sendAssistant);
el("assistantInput").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAssistant(); } });
el("assistantSuggest").innerHTML = SUGGESTIONS.slice(0, 4).map(s =>
  `<button class="suggest-chip">${esc(s)}</button>`).join("");
el("assistantSuggest").querySelectorAll(".suggest-chip").forEach(b =>
  b.addEventListener("click", () => { el("assistantInput").value = b.textContent; sendAssistant(); }));

// ── Prescription Reader ────────────────────────────────────────────────────────
el("rxBtn").addEventListener("click", async () => {
  const text = el("rxText").value.trim();
  if (!text) return;
  el("rxResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Reading your prescription…</div>`;
  try {
    const data = await post("/api/prescription", { text });
    el("rxResults").innerHTML = `<div class="result-text">${md(data.result)}</div>`;
  } catch (e) {
    el("rxResults").innerHTML = `<div class="err">Error: ${esc(e.message)}</div>`;
  }
});

// ── Drug Interactions ──────────────────────────────────────────────────────────
const COMMON_DRUGS = ["Aspirin", "Ibuprofen", "Paracetamol", "Metformin", "Warfarin", "Omeprazole",
  "Atorvastatin", "Losartan", "Amlodipine", "Azithromycin", "Clopidogrel", "Levothyroxine"];
let drugList = [];

el("commonDrugs").innerHTML = COMMON_DRUGS.map(d =>
  `<button class="suggest-chip" data-drug="${d}">${d}</button>`).join("");
el("commonDrugs").querySelectorAll(".suggest-chip").forEach(b =>
  b.addEventListener("click", () => addDrug(b.dataset.drug)));

function addDrug(name) {
  if (!name || drugList.includes(name)) return;
  drugList.push(name);
  renderDrugChips();
}
function removeDrug(name) {
  drugList = drugList.filter(d => d !== name);
  renderDrugChips();
}
function renderDrugChips() {
  el("drugChips").innerHTML = drugList.map(d =>
    `<span class="chip">${esc(d)} <i class="fas fa-times" data-remove="${esc(d)}"></i></span>`).join("");
  el("drugChips").querySelectorAll("i").forEach(i => i.addEventListener("click", () => removeDrug(i.dataset.remove)));
}
el("drugInput").addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); addDrug(e.target.value.trim()); e.target.value = ""; }
});

el("interactBtn").addEventListener("click", async () => {
  if (drugList.length < 1) {
    el("interactResults").innerHTML = `<div class="err">Please add at least two medicine names.</div>`; return;
  }
  el("interactResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Checking interactions…</div>`;
  try {
    const data = await post("/api/interactions", { drugs: drugList });
    let html = `<div class="result-text">${md(data.result)}</div>`;
    if (data.interactions && data.interactions.length) {
      html += data.interactions.map(i => {
        const cls = i.severity === "HIGH" || i.severity === "CRITICAL" ? "sev-high" : i.severity === "MODERATE" ? "sev-moderate" : "sev-low";
        return `<div class="res-card">
          <div class="res-head"><h4><i class="fas fa-pills"></i> ${esc(i.drug_a)} + ${esc(i.drug_b)}</h4>
          <span class="sev-badge ${cls}">${esc(i.severity)}</span></div>
          <div style="font-size:13.5px;color:var(--text-2);margin-bottom:8px">${esc(i.effect)}</div>
          <div style="font-size:13px;color:var(--primary-l)"><i class="fas fa-lightbulb"></i> ${esc(i.advice)}</div>
        </div>`;
      }).join("");
    }
    el("interactResults").innerHTML = html;
  } catch (e) {
    el("interactResults").innerHTML = `<div class="err">Error: ${esc(e.message)}</div>`;
  }
});

// ── Smart Substitutes ──────────────────────────────────────────────────────────
el("subBtn").addEventListener("click", async () => {
  const med = el("subMed").value.trim();
  if (!med) return;
  el("subResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Finding substitutes…</div>`;
  try {
    const data = await post("/api/substitutes", { medicine: med });
    el("subResults").innerHTML = `<div class="result-text">${md(data.result)}</div>`;
  } catch (e) {
    el("subResults").innerHTML = `<div class="err">Error: ${esc(e.message)}</div>`;
  }
});
el("subMed").addEventListener("keydown", e => { if (e.key === "Enter") el("subBtn").click(); });

// ── Refill Predictor ──────────────────────────────────────────────────────────
// Set default date to today
el("refillDate").value = new Date().toISOString().slice(0, 10);

el("refillBtn").addEventListener("click", async () => {
  const medicine = el("refillMed").value.trim();
  const quantity = parseInt(el("refillQty").value);
  const dose_per_day = parseFloat(el("refillDose").value);
  const start_date = el("refillDate").value;
  if (!medicine || !quantity || !dose_per_day || !start_date) {
    el("refillResults").innerHTML = `<div class="err">Please fill in all fields.</div>`; return;
  }
  el("refillResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Calculating…</div>`;
  try {
    const data = await post("/api/refill", { medicine, quantity, dose_per_day, start_date });
    if (data.refill_date) {
      el("refillResults").innerHTML = `
        <div class="refill-card">
          <div><div class="label">Medicine</div><div style="font-size:16px;font-weight:700;margin-top:4px">${esc(medicine)}</div></div>
          <div><div class="label">Days supply</div><div class="big">${data.days_supply} days</div></div>
          <div><div class="label">📅 Refill date</div><div class="big">${esc(data.refill_date)}</div></div>
          <div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:10px;padding:12px;font-size:13.5px">
            🔔 <strong>Set a reminder for ${esc(data.reminder_date)}</strong> — 3 days before you run out.
          </div>
        </div>`;
    } else {
      el("refillResults").innerHTML = `<div class="result-text">${md(data.message)}</div>`;
    }
  } catch (e) {
    el("refillResults").innerHTML = `<div class="err">Error: ${esc(e.message)}</div>`;
  }
});

// ── Symptom Guide ──────────────────────────────────────────────────────────────
el("symptomBtn").addEventListener("click", async () => {
  const symptom = el("symptomInput").value.trim();
  if (!symptom) return;
  el("symptomResults").innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Looking up guidance…</div>`;
  try {
    const data = await post("/api/symptoms", { symptom });
    el("symptomResults").innerHTML = `
      <div class="result-text">${md(data.result)}</div>
      <div class="warn-note"><i class="fas fa-triangle-exclamation"></i>
        <span>This is OTC guidance only. For symptoms lasting more than 3 days or severe symptoms, see a doctor. In emergencies call <strong>108</strong>.</span>
      </div>`;
  } catch (e) {
    el("symptomResults").innerHTML = `<div class="err">Error: ${esc(e.message)}</div>`;
  }
});
el("symptomInput").addEventListener("keydown", e => { if (e.key === "Enter") el("symptomBtn").click(); });

// ── Medicine Search ────────────────────────────────────────────────────────────
function renderMeds(meds) {
  if (!meds || !meds.length) {
    el("medGrid").innerHTML = `<div class="empty" style="grid-column:1/-1">No medicines found. Try a different search term.</div>`;
    return;
  }
  el("medGrid").innerHTML = meds.map(m => `
    <div class="med-card">
      <div class="med-badge">${esc(m.category)}</div>
      <h4>${esc(m.name)}</h4>
      <div class="med-generic">Generic: ${esc(m.generic)} · Brand: ${esc(m.brand)}</div>
      <div class="med-use">${esc(m.use)}</div>
      <div style="font-size:12.5px;color:var(--text-2);margin-bottom:8px"><strong>Dose:</strong> ${esc(m.dose)}</div>
      <div class="med-meta">
        <span class="med-tag"><i class="fas fa-exclamation-circle"></i> ${esc((m.avoid || "").substring(0, 40))}…</span>
      </div>
      <div class="med-price"><i class="fas fa-indian-rupee-sign"></i> ₹${esc(m.price_inr)}</div>
    </div>`).join("");
}

async function searchMeds() {
  const q = el("medSearchInput").value.trim();
  if (!q) return;
  el("medGrid").innerHTML = `<div class="loading" style="grid-column:1/-1"><i class="fas fa-circle-notch fa-spin"></i> Searching…</div>`;
  try {
    const data = await post("/api/search", { query: q });
    renderMeds(data.results);
  } catch (e) {
    el("medGrid").innerHTML = `<div class="err" style="grid-column:1/-1">Error: ${esc(e.message)}</div>`;
  }
}
el("medSearchBtn").addEventListener("click", searchMeds);
el("medSearchInput").addEventListener("keydown", e => { if (e.key === "Enter") searchMeds(); });

// Load all medicines on panel open
async function loadAllMeds() {
  if (el("medGrid").children.length > 0) return;
  el("medGrid").innerHTML = `<div class="loading" style="grid-column:1/-1"><i class="fas fa-circle-notch fa-spin"></i> Loading medicines…</div>`;
  try {
    const data = await get("/api/medicines");
    renderMeds(data.medicines);
  } catch (e) {
    el("medGrid").innerHTML = `<div class="empty" style="grid-column:1/-1">Could not load medicines.</div>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.querySelectorAll(".nav-item").forEach(b => b.addEventListener("click", () => {
  if (b.dataset.panel === "medicines") loadAllMeds();
}));

const hash = location.hash.replace("#", "");
if (hash && META[hash]) show(hash); else show("dashboard");
loadDashboard();
