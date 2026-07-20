/* ════════════════════════════════════════════════════════════════
   COMONK AI — Enterprise Frontend v4
   ════════════════════════════════════════════════════════════════ */

const API = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';
const SESSION_ID = 'comonk_' + Math.random().toString(36).slice(2, 9);

/* ── State ─────────────────────────────────────────────────────── */
const S = {
  profile: null,
  companies: [],
  allJobs: [],
  chatHistory: [],
  ivTimer: null,
  ivSeconds: 0,
  ivQuestions: [],
  ivIdx: 0,
  atsChart: null,
  cityChart: null,
  activePanel: 'overview',
  notifications: [],
  apps: JSON.parse(localStorage.getItem('comonk_apps') || '[]'),
  stats: {},
  learnTab: 'articles',
  jobSrc: 'all',
};

/* ── Utils ─────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 100000) return Math.round(n / 1000) + 'K';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'L';
  return n;
}
function fmtINR(n) {
  if (!n) return '—';
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + ' L';
  return '₹' + n.toLocaleString('en-IN');
}
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr), now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}
function initials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function mdToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (_, row) => `<tr>${row.split(' | ').map(c => `<td>${c}</td>`).join('')}</tr>`)
    .replace(/(<tr>[\s\S]+?<\/tr>)/g, '<table>$1</table>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^([^<\n].+)$/gm, (line) => line.startsWith('<') ? line : `<p>${line}</p>`);
}
function saveApps() {
  localStorage.setItem('comonk_apps', JSON.stringify(S.apps));
}

/* ── Toast ─────────────────────────────────────────────────────── */
function toast(msg, type = 'info', dur = 3500) {
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type]}"></i><span>${escHtml(msg)}</span><button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  $('toasts').prepend(t);
  setTimeout(() => t.remove(), dur);
}

/* ── Modal ─────────────────────────────────────────────────────── */
function openModal(title, bodyHtml, footerHtml = '') {
  $('modal-title').textContent = title;
  $('modal-body').innerHTML = bodyHtml;
  $('modal-foot').innerHTML = footerHtml;
  $('modal-wrap').style.display = 'flex';
}
function closeModal() { $('modal-wrap').style.display = 'none'; }

/* ── Notifications ─────────────────────────────────────────────── */
function addNotif(title, msg, type = 'info') {
  S.notifications.unshift({ title, msg, type, time: new Date().toISOString() });
  $('notif-dot').style.display = 'flex';
  renderNotifs();
}
function renderNotifs() {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  $('nd-list').innerHTML = S.notifications.length
    ? S.notifications.map(n => `
      <div class="notif-item">
        <div class="ni-title">${icons[n.type] || 'ℹ️'} ${escHtml(n.title)}</div>
        <div class="ni-msg">${escHtml(n.msg)}</div>
        <div class="ni-time">${timeAgo(n.time)}</div>
      </div>`).join('')
    : '<div class="empty-state sm"><i class="fas fa-bell"></i><p>No notifications</p></div>';
}

/* ── Panel navigation ──────────────────────────────────────────── */
function openPanel(id) {
  $$('.panel').forEach(p => p.classList.remove('active'));
  $$('.sb-item').forEach(b => b.classList.remove('active'));
  const panel = $(`panel-${id}`);
  if (panel) panel.classList.add('active');
  const btn = document.querySelector(`.sb-item[data-panel="${id}"]`);
  if (btn) btn.classList.add('active');
  S.activePanel = id;
  $('content').scrollTo(0, 0);

  if (id === 'livejobs' && S.allJobs.length === 0) loadJobs();
  if (id === 'learning') loadLearning(S.learnTab);
  if (id === 'tracker') loadKanban();
  if (id === 'autopilot') loadAutopilot();
  if (id === 'roadmap') loadRoadmapShCards();
  if (id === 'trending') initTrendingPanel();
  if (id === 'stackoverflow') initSOPanel();
  if (id === 'pomodoro') initPomodoro();
  if (id === 'alerts') { initAlertsPanel(); wireAlertsExtra(); }
  if (id === 'codingstats') initCodingStats();
  if (id === 'flashcards') initFlashcards();
  if (id === 'network') initNetworkLog();
  if (id === 'heatmap') initHeatmap();
  if (id === 'test') initTestPanel();
  if (id === 'admin') initAdminPanel();
  if (id === 'mockvoice') initMockVoice();
  if (id === 'resumestudio') initResumeStudio();
  if (id === 'calendar') initCalendar();
  // Enterprise panels
  if (id === 'briefing') loadDailyBriefing();
  if (id === 'outreach') loadOutreachAnalytics();
  if (id === 'offers' && !$('offers-grid').children.length) addOfferSlot();
  trackActivity();
  if (id === 'cheatsheets') {
    if ($('cs-categories').children.length === 0) loadCheatSheetTopics();
    $('cs-out').style.display = 'none';
    $('cs-browse-wrap').style.display = 'block';
  }
  if (id === 'resources') {
    if ($('res-dashboard').style.display === 'none') {
      searchResources($('res-search-input').value.trim() || 'Python');
    }
  }
}

/* ── API helpers ───────────────────────────────────────────────── */
async function api(method, path, body, isForm = false) {
  const opts = { method, headers: {} };
  if (body && !isForm) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  if (body && isForm) { opts.body = body; }
  const res = await fetch(API + path, opts);
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `HTTP ${res.status}`); }
  return res.json();
}

/* ════════════════════════════════════════════════════════════════ */
/*  LANDING PAGE                                                    */
/* ════════════════════════════════════════════════════════════════ */
async function initLanding() {
  try {
    const stats = await api('GET', '/api/stats');
    S.stats = stats;
    animCount('h-companies', 0, stats.total_companies, 1200);
    animCount('h-contacts', 0, stats.total_hr_contacts, 1400);
    animCount('h-tools', 0, stats.agent_tools_active, 800);
  } catch (e) {
    ['h-companies','h-contacts','h-tools'].forEach(id => { const el = $(id); if (el) el.textContent = '—'; });
  }

  const zone = $('upload-zone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); const f = e.dataTransfer.files[0]; if (f) landingResume(f); });
  $('resume-file').addEventListener('change', e => { if (e.target.files[0]) landingResume(e.target.files[0]); });
  $('demo-btn').addEventListener('click', landingDemo);

  // Auth + onboarding (wired before app launch)
  initAuth();
  initOnboarding();
  // Particles
  initParticles();
  // If already logged in with a saved profile, offer to jump back in
  if (Auth.isLoggedIn()) {
    updateAuthUI();
    if (Auth.user?.profile) { S.profile = Auth.user.profile; finishOnboardingDirect(); }
  }
}

// Landing upload is gated behind account creation
function landingResume(file) {
  if (Auth.isLoggedIn()) { handleFile(file); }
  else { obState.stashFile = file; startOnboarding(); }
}
function landingDemo() {
  if (Auth.isLoggedIn()) { loadDemo(); }
  else { obState.stashDemo = true; startOnboarding(); }
}

function animCount(id, from, to, dur) {
  const el = $(id); if (!el) return;
  const step = (to - from) / (dur / 16);
  let cur = from;
  const t = setInterval(() => {
    cur = Math.min(cur + step, to);
    el.textContent = Math.round(cur).toLocaleString('en-IN');
    if (cur >= to) clearInterval(t);
  }, 16);
}

async function handleFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { toast('Please upload a PDF file', 'error'); return; }
  showParsing('Reading your resume…', 'AI extracting skills and experience…');
  animateBar();
  try {
    const fd = new FormData(); fd.append('file', file);
    const profile = await api('POST', '/api/parse-resume', fd, true);
    await launchApp(profile);
  } catch (e) {
    hideParsing();
    toast('Could not parse PDF: ' + e.message, 'error');
  }
}

function showParsing(headline, sub) {
  $('upload-idle').style.display = 'none';
  $('upload-parsing').style.display = 'block';
  $('parse-headline').textContent = headline;
  $('parse-sub').textContent = sub;
}
function hideParsing() {
  $('upload-idle').style.display = 'block';
  $('upload-parsing').style.display = 'none';
}

function animateBar() {
  let w = 0;
  const msgs = ['Reading structure…','Extracting skills…','Analyzing experience…','Matching companies…','Finalizing…'];
  let mi = 0;
  const t = setInterval(() => {
    w = Math.min(w + Math.random() * 12 + 3, 92);
    $('parse-prog-bar').style.width = w + '%';
    if (w > mi * 18 + 18) { $('parse-sub').textContent = msgs[mi] || msgs[msgs.length-1]; mi++; }
    if (w >= 92) clearInterval(t);
  }, 250);
}

async function loadDemo() {
  showParsing('Loading demo profile…', 'Generating sample AI Engineer profile');
  animateBar();
  await new Promise(r => setTimeout(r, 1800));
  await launchApp({
    name: 'Arjun Sharma', email: 'arjun@example.com', phone: '+91 98765 43210',
    skills: ['Python', 'Machine Learning', 'LangChain', 'FastAPI', 'TensorFlow', 'PyTorch', 'NLP', 'SQL', 'Docker', 'Git'],
    experience: 'AI/ML developer with 2 years experience building production ML models and LLM applications.',
    education: 'B.Tech Computer Science, Gujarat University, 2022',
    target_roles: ['AI/ML Engineer', 'Machine Learning Engineer', 'AI Developer'],
    experience_years: 2, seniority_level: 'junior',
  });
}

async function launchApp(profile) {
  $('parse-prog-bar').style.width = '100%';
  await new Promise(r => setTimeout(r, 300));
  S.profile = profile;
  $('landing').style.display = 'none';
  $('app').style.display = 'grid';
  initApp();
  if (profile?.name) setDiceBearAvatar(profile.name);
}

/* ════════════════════════════════════════════════════════════════ */
/*  APP INIT                                                        */
/* ════════════════════════════════════════════════════════════════ */
function initApp() {
  const p = S.profile;

  // Top bar
  const av = initials(p.name);
  $('tb-avatar').textContent = av;
  $('tb-name').textContent = p.name || 'Job Seeker';
  $('tb-level').textContent = (p.seniority_level || 'fresher').charAt(0).toUpperCase() + (p.seniority_level || 'fresher').slice(1);

  // Sidebar
  $('su-avatar').textContent = av;
  $('su-name').textContent = p.name || 'Job Seeker';

  // LLM badge
  const llm = S.stats.llm_provider || 'Groq';
  $('llm-pill-text').textContent = llm.charAt(0).toUpperCase() + llm.slice(1);
  $('chat-prov-badge').textContent = llm;

  // Sidebar nav
  $$('.sb-item').forEach(btn => btn.addEventListener('click', () => { openPanel(btn.dataset.panel); if (window.innerWidth <= 768) closeSidebar(); }));

  // Topbar
  $('sidebar-toggle').addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      $('sidebar').classList.toggle('mobile-open');
      $('sidebar-overlay').classList.toggle('visible');
    } else {
      $('sidebar').classList.toggle('collapsed');
    }
  });
  $('notif-btn').addEventListener('click', () => {
    const d = $('notif-drawer'), b = $('nd-backdrop');
    const vis = d.style.display !== 'none';
    d.style.display = vis ? 'none' : 'flex';
    b.style.display = vis ? 'none' : 'block';
    if (!vis) { $('notif-dot').style.display = 'none'; renderNotifs(); }
  });
  $('nd-close').addEventListener('click', () => { $('notif-drawer').style.display = 'none'; $('nd-backdrop').style.display = 'none'; });
  $('nd-backdrop').addEventListener('click', () => { $('notif-drawer').style.display = 'none'; $('nd-backdrop').style.display = 'none'; });
  $('modal-close-btn').addEventListener('click', closeModal);
  $('modal-wrap').addEventListener('click', e => { if (e.target === $('modal-wrap')) closeModal(); });
  $('reset-btn').addEventListener('click', () => { if (confirm('Start over with a new resume?')) location.reload(); });

  // Keyboard shortcut ⌘K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); $('global-search').focus(); }
    if (e.key === 'Escape') closeModal();
  });

  // Global search
  $('global-search').addEventListener('input', debounce(handleGlobalSearch, 400));

  // Overview
  loadOverview();

  // Greeting
  const hr = new Date().getHours();
  $('ov-greeting').textContent = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';

  // Match companies
  matchCompanies();

  // Chat
  initChat();

  // Trackers
  loadKanban();
  initAutopilot();

  // Live jobs
  loadJobs();

  // Interview
  initInterview();

  // ATS
  $('ats-btn').addEventListener('click', runATS);

  // LinkedIn
  $('li-btn').addEventListener('click', runLinkedIn);

  // Learning tabs
  $$('.ltab').forEach(btn => btn.addEventListener('click', () => {
    $$('.ltab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    S.learnTab = btn.dataset.lt;
    loadLearning(S.learnTab);
  }));

  // Roadmap
  $('gen-rm-btn').addEventListener('click', generateRoadmap);
  if (p.target_roles && p.target_roles[0]) $('rm-role').value = p.target_roles[0];
  if (p.seniority_level) $('rm-level').value = p.seniority_level;

  // Salary
  $('sal-btn').addEventListener('click', getSalary);
  if (p.target_roles && p.target_roles[0]) $('sal-role').value = p.target_roles[0];
  if (p.seniority_level) $('sal-level').value = p.seniority_level;
  if (p.experience_years) $('sal-years').value = p.experience_years;

  // GitHub
  $('gh-analyze-btn').addEventListener('click', analyzeGitHub);

  // Language Select
  const langSel = $('lang-select');
  if (langSel) {
    langSel.addEventListener('change', (e) => {
      if (!S.profile) S.profile = {};
      S.profile.pref_lang = e.target.value;
      toast(`Language switched to ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });
  }

  // Tracker
  $('add-app-btn').addEventListener('click', openAddApp);

  // Job source tabs
  $$('.src-tab').forEach(btn => btn.addEventListener('click', () => {
    $$('.src-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const src = btn.dataset.src;
    if (src === 'greenhouse') { loadGreenhouseJobs(); return; }
    if (src === 'internshala') { loadIndiaBoardsJobs(); return; }
    S.jobSrc = src;
    renderJobs();
  }));
  $('refresh-jobs-btn').addEventListener('click', loadJobs);

  // ATS fill from parsed resume
  if (p.experience) $('ats-resume').value = `${p.name}\n${p.email} | ${p.phone}\n\nSkills: ${(p.skills||[]).join(', ')}\n\nExperience:\n${p.experience}\n\nEducation:\n${p.education || ''}`;
  if (p.target_roles && p.target_roles[0]) {
    $('ats-role').value = p.target_roles[0];
    $('li-role').value = p.target_roles[0];
    $('iv-role').value = p.target_roles[0];
  }
  if (p.seniority_level) $('iv-level').value = p.seniority_level;

  // Notifications: welcome
  setTimeout(() => addNotif('Profile loaded', `Welcome ${p.name || 'there'}! Your profile is ready.`, 'success'), 800);

  // Candidates for LinkedIn fill
  if (p.experience) $('li-about').value = p.experience;

  // Cheat Sheets
  $('cs-custom-btn').addEventListener('click', () => loadCheatSheet($('cs-custom-topic').value.trim()));
  $('cs-custom-topic').addEventListener('keypress', e => { if (e.key === 'Enter') loadCheatSheet(e.target.value.trim()); });

  // Resources
  $('res-search-btn').addEventListener('click', () => searchResources($('res-search-input').value.trim()));
  $('res-search-input').addEventListener('keypress', e => { if (e.key === 'Enter') searchResources(e.target.value.trim()); });

  // Visual Roadmap Tabs
  $('rm-tab-visual').addEventListener('click', () => {
    $('rm-tab-visual').classList.add('active');
    $('rm-tab-text').classList.remove('active');
    $('rm-visual-out').style.display = 'block';
    $('rm-out').style.display = 'none';
  });
  $('rm-tab-text').addEventListener('click', () => {
    $('rm-tab-text').classList.add('active');
    $('rm-tab-visual').classList.remove('active');
    $('rm-out').style.display = 'block';
    $('rm-visual-out').style.display = 'none';
  });

  // Wire new feature buttons (grammar check, PDF export, HN/Reddit job tabs)
  wireNewFeatureButtons();
  // Wire all new panels and features
  initAllNewFeatures();
  wireAlertsExtra();
}

/* ── Overview ─────────────────────────────────────────────────── */
function loadOverview() {
  const p = S.profile, stats = S.stats;

  // Time-based greeting
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const greetEl = $('ov-greeting');
  if (greetEl) greetEl.textContent = `${greet}, ${p.name?.split(' ')[0] || 'there'} 👋`;

  $('ov-name').textContent = p.name || '—';
  $('ov-level').textContent = (p.seniority_level || 'fresher').charAt(0).toUpperCase() + (p.seniority_level || 'fresher').slice(1);
  $('ov-exp').textContent = p.experience_years ? `${p.experience_years} year${p.experience_years > 1 ? 's' : ''}` : 'Fresher';

  const chips = $('ov-skills');
  chips.innerHTML = (p.skills || []).slice(0, 12).map(s => `<span class="skill-chip">${escHtml(s)}</span>`).join('');

  $('ms-total').textContent = stats.total_companies?.toLocaleString('en-IN') || '—';
  $('ms-aiml').textContent = stats.ai_ml_companies || '—';
  $('ms-hr').textContent = stats.total_hr_contacts?.toLocaleString('en-IN') || '—';
  $('ms-llm').textContent = (stats.llm_provider || '—').toUpperCase();

  updateKPIs();
  setTimeout(() => {
    renderSkillsRadar();
    renderProgressChart();
    renderScoreRing();
    renderDailyTip();
    renderActivityHeatmap();
    renderAchievements();
  }, 200);
}

function updateKPIs() {
  $('kpi-matches').textContent = S.companies.length;
  const trackerTotal = S.apps.length;
  $('kpi-applied').textContent = trackerTotal;
  $('kpi-interviews').textContent = parseInt(localStorage.getItem('comonk_iv_count') || '0');
}

/* ── Company matching ─────────────────────────────────────────── */
async function matchCompanies() {
  const skills = S.profile?.skills || [];
  try {
    const res = await api('POST', '/api/match', { skills });
    S.companies = res.matches || [];
    renderCompanies();
    $('sb-targets-count').textContent = S.companies.length;
    $('kpi-matches').textContent = S.companies.length;

    const companySelect = $('iv-company');
    if (companySelect && S.companies && S.companies.length) {
      companySelect.innerHTML = '<option value="-1">General Technical Interview</option>' + 
        S.companies.map(c => `<option value="${c.id}">${escHtml(c.name)}</option>`).join('');
    }

    // Score for sidebar match bar
    const aiCount = S.companies.filter(c => c.category?.includes('AI')).length;
    const pct = Math.min(100, Math.round((aiCount / Math.max(1, S.companies.length)) * 200));
    $('su-match-fill').style.width = pct + '%';
    $('su-match-pct').textContent = pct + '%';

    if (S.companies.length > 0) addNotif('Companies matched', `Found ${S.companies.length} companies matching your skills.`, 'success');
  } catch (e) {
    toast('Company match failed: ' + e.message, 'error');
  }
}

function renderCompanies() {
  const search = ($('targets-search').value || '').toLowerCase();
  const cat = $('targets-cat').value || '';
  let list = S.companies;
  if (search) list = list.filter(c => c.name.toLowerCase().includes(search) || (c.roles||'').toLowerCase().includes(search));
  if (cat) list = list.filter(c => c.category === cat);

  $('targets-count-label').textContent = `${list.length} companies`;
  const grid = $('companies-grid');
  if (!list.length) { grid.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>No companies match your filter</p></div>`; return; }

  grid.innerHTML = list.map(c => {
    const scoreClass = (c.score || 0) >= 3 ? 'co-score-high' : (c.score || 0) >= 1 ? 'co-score-med' : 'co-score-low';
    const fitScoreClass = c.fit_score && c.fit_score.score >= 70 ? 'co-score-high' : c.fit_score && c.fit_score.score >= 45 ? 'co-score-med' : 'co-score-low';
    const letter = (c.name || '?')[0].toUpperCase();
    return `
    <div class="co-card" onclick="openCompanyModal(${c.id})">
      <div class="co-card-top">
        <div class="co-avatar">${getCompanyLogoHTML(c)}</div>
        <div class="co-title">
          <div class="co-name">${escHtml(c.name)}</div>
          <div class="co-cat">${escHtml(c.category || '')}</div>
        </div>
        ${c.fit_score ? `
          <div class="co-score-badge ${fitScoreClass}" onclick="event.stopPropagation();openFitScoreModal(${c.id})" style="cursor:pointer;display:flex;align-items:center;gap:3px">
            <i class="fas fa-bullseye"></i> ${c.fit_score.score}%
          </div>
        ` : c.score ? `<div class="co-score-badge ${scoreClass}">★ ${c.score}</div>` : ''}
      </div>
      ${c.roles ? `<div class="co-roles"><i class="fas fa-briefcase" style="color:var(--c-purple-l);font-size:11px;margin-right:4px"></i>${escHtml(c.roles.slice(0,120))}</div>` : ''}
      ${c.address ? `<div class="co-addr"><i class="fas fa-map-marker-alt"></i>${escHtml(c.address.slice(0,80))}</div>` : ''}
      ${c.emails?.length ? `<div class="co-emails">${c.emails.slice(0,2).map(e => `<div class="co-email-item"><i class="fas fa-envelope"></i>${escHtml(e)}</div>`).join('')}</div>` : ''}
      <div class="co-actions">
        <button class="co-action-btn email" onclick="event.stopPropagation();draftEmail(${c.id})"><i class="fas fa-envelope"></i> Draft Email</button>
        <button class="co-action-btn track" onclick="event.stopPropagation();quickAddApp(${c.id})"><i class="fas fa-plus"></i> Track</button>
      </div>
    </div>`;
  }).join('');

  $('targets-search').addEventListener('input', debounce(renderCompanies, 300));
  $('targets-cat').addEventListener('change', renderCompanies);
}

function openFitScoreModal(id) {
  const c = S.companies.find(x => x.id === id);
  if (!c || !c.fit_score) return;
  const fs = c.fit_score;
  const b = fs.breakdown;
  
  openModal(`Fit Score Analysis — ${c.name}`, `
    <div style="display:flex;flex-direction:column;gap:18px">
      <div style="display:flex;align-items:center;gap:16px;background:rgba(124,58,237,0.06);border:1px solid rgba(124,58,237,0.15);border-radius:12px;padding:16px">
        <div style="position:relative;width:72px;height:72px;border-radius:50%;background:conic-gradient(var(--c-purple) ${fs.score * 3.6}deg, var(--bg-3) 0deg);display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(124,58,237,0.2)">
          <div style="position:absolute;width:60px;height:60px;border-radius:50%;background:var(--bg-2);display:flex;flex-direction:column;align-items:center;justify-content:center">
            <span style="font-size:18px;font-weight:900;color:white">${fs.score}%</span>
          </div>
        </div>
        <div>
          <h4 style="font-weight:bold;font-size:14px;color:white">Match Quality</h4>
          <p class="muted" style="font-size:12px;margin-top:2px">Calculated across 4 parameters based on your uploaded resume.</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="font-weight:600;color:var(--text-2)"><i class="fas fa-brain" style="width:16px;color:var(--c-purple-l)"></i> Semantic Alignment</span>
            <span style="font-weight:bold;color:white">${Math.round(b.semantic * 2)}% / 50%</span>
          </div>
          <div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${(b.semantic/50)*100}%;background:var(--c-purple)"></div>
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="font-weight:600;color:var(--text-2)"><i class="fas fa-tasks" style="width:16px;color:var(--c-blue-l)"></i> Skills Match</span>
            <span style="font-weight:bold;color:white">${Math.round(b.skills * 10/3)}% / 30%</span>
          </div>
          <div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${(b.skills/30)*100}%;background:var(--c-blue)"></div>
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="font-weight:600;color:var(--text-2)"><i class="fas fa-map-marker-alt" style="width:16px;color:var(--c-gold-l)"></i> Target Location Match</span>
            <span style="font-weight:bold;color:white">${b.location * 10}% / 10%</span>
          </div>
          <div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${(b.location/10)*100}%;background:var(--c-gold)"></div>
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="font-weight:600;color:var(--text-2)"><i class="fas fa-address-book" style="width:16px;color:var(--c-green-l)"></i> HR Contacts Available</span>
            <span style="font-weight:bold;color:white">${b.contact * 10}% / 10%</span>
          </div>
          <div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${(b.contact/10)*100}%;background:var(--c-green)"></div>
          </div>
        </div>
      </div>

      <div style="padding-top:10px;border-top:1px solid var(--border)">
        <h5 style="font-size:12px;font-weight:bold;color:white;margin-bottom:8px">Score Breakdown Details</h5>
        <ul style="padding-left:16px;font-size:12px;color:var(--text-2);display:flex;flex-direction:column;gap:6px;list-style:disc">
          ${fs.reasons.map(r => `<li>${escHtml(r)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `, `
    <button class="btn-primary" onclick="closeModal()">Got it</button>
  `);
}
window.openFitScoreModal = openFitScoreModal;

function openCompanyModal(id) {
  const c = S.companies.find(x => x.id === id);
  if (!c) return;
  openModal(c.name, `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="prof-row"><span class="pr-lbl">Category</span><span>${escHtml(c.category||'')}</span></div>
      <div class="prof-row"><span class="pr-lbl">Address</span><span>${escHtml(c.address||'')}</span></div>
      <div class="prof-row"><span class="pr-lbl">Roles</span><span>${escHtml(c.roles||'')}</span></div>
      ${c.emails?.length ? `<div class="prof-row"><span class="pr-lbl">Emails</span><span>${c.emails.map(e=>`<a href="mailto:${e}">${e}</a>`).join('<br>')}</span></div>` : ''}
      ${c.phone ? `<div class="prof-row"><span class="pr-lbl">Phone</span><span>${escHtml(c.phone)}</span></div>` : ''}
      ${c.website ? `<div class="prof-row"><span class="pr-lbl">Website</span><span><a href="${escHtml(c.website)}" target="_blank">${escHtml(c.website)}</a></span></div>` : ''}
      ${c.fit_score ? `
        <div style="margin-top:10px;padding:12px;background:rgba(124,58,237,0.06);border:1px solid rgba(124,58,237,0.15);border-radius:12px">
          <h5 style="color:var(--c-purple-l);margin-bottom:6px;font-size:13px;font-weight:bold;display:flex;align-items:center;gap:6px">
            <i class="fas fa-bullseye"></i> Fit Score Analysis: ${c.fit_score.score}%
          </h5>
          <ul style="padding-left:16px;font-size:12px;color:var(--text-2);display:flex;flex-direction:column;gap:4px;list-style:disc">
            ${c.fit_score.reasons.map(r => `<li>${escHtml(r)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>`,
    `<button class="btn-primary" onclick="draftEmail(${id});closeModal()"><i class="fas fa-envelope"></i> Draft Email</button>
     <button class="btn-ghost" onclick="quickAddApp(${id});closeModal()"><i class="fas fa-plus"></i> Track Application</button>
     <button class="btn-ghost" onclick="findReferralRecruiter(${id})" style="color:var(--c-purple-l)"><i class="fab fa-linkedin"></i> Find Referral</button>
     <button class="btn-ghost" onclick="closeModal();setTimeout(()=>loadCompanyIntel(${id}),100)" style="color:var(--c-blue-l)"><i class="fas fa-brain"></i> Company Intel</button>`
  );
}

async function draftEmail(id) {
  const c = S.companies.find(x => x.id === id);
  if (!c) return;
  toast('Drafting email…', 'info');
  try {
    const res = await api('POST', '/api/draft-email', {
      company_id: id,
      user_name: S.profile.name || '',
      user_email: S.profile.email || '',
      skills: S.profile.skills || [],
      target_role: S.profile.target_roles?.[0] || '',
    });
    openModal(`Email to ${c.name}`, `
      <div class="fg" style="margin-bottom:12px"><label>To</label><input class="inp" value="${escHtml(res.to || '')}" id="email-to" readonly></div>
      <div class="fg" style="margin-bottom:12px"><label>Subject</label><input class="inp" id="email-subject" value="${escHtml(res.subject || '')}"></div>
      <div class="fg"><label>Body</label><textarea class="inp ta-md" id="email-body" rows="10">${escHtml(res.body || '')}</textarea></div>`,
      `<button class="btn-primary" onclick="copyEmail()"><i class="fas fa-copy"></i> Copy Email</button>
       <button class="btn-ghost" onclick="closeModal()">Close</button>`
    );
  } catch (e) {
    toast('Draft failed: ' + e.message, 'error');
  }
}

function copyEmail() {
  const subj = $('email-subject')?.value || '';
  const body = $('email-body')?.value || '';
  navigator.clipboard.writeText(`Subject: ${subj}\n\n${body}`).then(() => toast('Email copied to clipboard!', 'success'));
}

async function quickAddApp(cid) {
  const c = S.companies.find(x => x.id === cid);
  if (!c) return;
  const exists = S.apps.find(a => a.company === c.name);
  if (exists) { toast(`${c.name} already in tracker`, 'warning'); return; }

  if (Auth.isLoggedIn()) {
    try {
      const res = await api('POST', '/api/applications', {
        company_id: cid,
        custom_company_name: "",
        status: 'saved',
        notes: '',
        fit_score: c.fit_score ? c.fit_score.score : 0
      });
      if (res.success) {
        toast(`${c.name} added to tracker`, 'success');
        loadKanban();
      } else {
        toast(res.error || 'Failed to add to tracker', 'error');
      }
    } catch (e) {
      toast('Connection error: ' + e.message, 'error');
    }
  } else {
    S.apps.push({
      id: Date.now(), company: c.name, role: c.roles?.split(',')[0]?.trim() || 'Software Engineer',
      status: 'saved', date: new Date().toISOString().slice(0, 10), notes: '', email: c.emails?.[0] || ''
    });
    saveApps();
    renderKanban();
    $('kpi-applied').textContent = S.apps.length;
    $('sb-tracker-count').textContent = S.apps.length;
    toast(`${c.name} added to tracker`, 'success');
  }
}

/* ── Chat ─────────────────────────────────────────────────────── */
function initChat() {
  const input = $('chat-input');
  $('chat-send-btn').addEventListener('click', sendChat);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });
  $$('.chip[data-msg]').forEach(chip => chip.addEventListener('click', () => { input.value = chip.dataset.msg; sendChat(); }));
  $('chat-clear-btn').addEventListener('click', () => {
    if (confirm('Clear chat history?')) {
      $('chat-msgs').innerHTML = `<div class="chat-welcome"><div class="cw-avatar"><i class="fas fa-robot"></i></div><h3>Chat cleared.</h3><p>Ask me anything about your job search.</p></div>`;
      S.chatHistory = [];
      api('DELETE', `/api/session/${SESSION_ID}`).catch(() => {});
    }
  });
}

async function sendChat() {
  const input = $('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = ''; input.style.height = 'auto';
  $('chat-chips').style.display = 'none';

  appendMsg('user', msg);
  $('chat-typing').style.display = 'flex';
  $('chat-send-btn').disabled = true;

  try {
    const res = await api('POST', '/api/chat', {
      message: msg, session_id: SESSION_ID, profile: S.profile,
    });
    $('chat-typing').style.display = 'none';
    appendMsg('bot', res.reply || "I'm here to help. Ask me anything!");
    S.chatHistory.push({ user: msg, bot: res.reply });
    if (res.matched_companies?.length) {
      addNotif('Companies found', `${res.companies_found} companies matched your query.`, 'info');
    }
  } catch (e) {
    $('chat-typing').style.display = 'none';
    appendMsg('bot', 'Sorry, I had trouble responding. Check your internet connection.');
    toast(e.message, 'error');
  }
  $('chat-send-btn').disabled = false;
}

function appendMsg(role, text) {
  const msgs = $('chat-msgs');
  const welcome = msgs.querySelector('.chat-welcome');
  if (welcome) welcome.remove();
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  const icon = role === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
  div.innerHTML = `<div class="msg-avatar">${icon}</div><div class="msg-bubble">${escHtml(text).replace(/\n/g,'<br>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ── Live Jobs ────────────────────────────────────────────────── */
async function loadJobs() {
  const skills = (S.profile?.skills || ['python']).slice(0, 5).join(',');
  $('jobs-grid').innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading live jobs…</p></div>`;
  try {
    const [r1, r2] = await Promise.allSettled([
      api('GET', `/api/live-jobs?skills=${encodeURIComponent(skills)}&limit=20`),
      api('GET', `/api/more-jobs?skills=${encodeURIComponent(skills)}&limit=20`),
    ]);
    const jobs1 = r1.status === 'fulfilled' ? (r1.value.jobs || []) : [];
    const jobs2 = r2.status === 'fulfilled' ? (r2.value.jobs || []) : [];
    S.allJobs = [...jobs1, ...jobs2].filter(j => j.title);
    renderJobs();
    if (S.allJobs.length) addNotif('Live jobs loaded', `Found ${S.allJobs.length} jobs matching your skills.`, 'success');
  } catch (e) {
    $('jobs-grid').innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>Could not load jobs: ${escHtml(e.message)}</p></div>`;
  }
}

function renderJobs() {
  const src = S.jobSrc;
  let list = S.allJobs;
  if (src === 'remoteok') list = list.filter(j => j.source === 'RemoteOK');
  else if (src === 'remotive') list = list.filter(j => j.source === 'Remotive');
  else if (src === 'india') list = list.filter(j => j.source?.includes('Adzuna'));

  if (!list.length) { $('jobs-grid').innerHTML = `<div class="empty-state"><i class="fas fa-briefcase"></i><p>No jobs found for this source</p></div>`; return; }

  $('jobs-grid').innerHTML = list.map(j => `
    <div class="job-card">
      <div class="job-card-top">
        <div class="job-logo">${j.logo ? `<img src="${escHtml(j.logo)}" onerror="this.parentElement.innerHTML='<span class=job-logo-placeholder><i class=fas\\ fa-building></i></span>'">` : `<span class="job-logo-placeholder"><i class="fas fa-building"></i></span>`}</div>
        <div style="flex:1">
          <div class="job-title">${escHtml(j.title || '')}</div>
          <div class="job-company">${escHtml(j.company || '')}</div>
        </div>
        <span class="job-source-badge">${escHtml(j.source || '')}</span>
      </div>
      ${(j.tags||[]).length ? `<div class="job-tags">${j.tags.slice(0,6).map(t=>`<span class="job-tag">${escHtml(t)}</span>`).join('')}</div>` : ''}
      <div class="job-meta">
        ${j.location ? `<span><i class="fas fa-map-marker-alt"></i> ${escHtml(j.location)}</span>` : ''}
        ${j.salary ? `<span><i class="fas fa-rupee-sign"></i> ${escHtml(String(j.salary))}</span>` : ''}
        ${j.date ? `<span><i class="fas fa-clock"></i> ${timeAgo(j.date)}</span>` : ''}
      </div>
      <div class="job-actions">
        <a href="${escHtml(j.url || '#')}" target="_blank" class="job-apply-btn"><i class="fas fa-external-link-alt"></i> Apply Now</a>
        <button class="job-save-btn" onclick="saveJob(this,'${escHtml(j.title||'')}','${escHtml(j.company||'')}')"><i class="fas fa-bookmark"></i> Save</button>
      </div>
    </div>`).join('');
}

async function saveJob(btn, title, company) {
  if (Auth.isLoggedIn()) {
    let company_id = -1;
    const match = S.companies.find(c => c.name.toLowerCase() === (company || '').toLowerCase());
    if (match) company_id = match.id;

    try {
      const res = await api('POST', '/api/applications', {
        company_id: company_id,
        custom_company_name: company_id === -1 ? (company || 'Unknown') : "",
        status: 'saved',
        notes: `Saved job: ${title}`,
        fit_score: 0
      });
      if (res.success) {
        btn.innerHTML = '<i class="fas fa-check"></i> Saved'; btn.style.color = 'var(--c-green)';
        toast(`${title} saved to tracker`, 'success');
        loadKanban();
      } else {
        toast(res.error || 'Failed to save job', 'error');
      }
    } catch (e) {
      toast('Connection error: ' + e.message, 'error');
    }
  } else {
    S.apps.push({ id: Date.now(), company: company || 'Unknown', role: title || 'Role', status: 'saved', date: new Date().toISOString().slice(0,10), notes: '', email: '' });
    saveApps();
    renderKanban();
    $('sb-tracker-count').textContent = S.apps.length;
    btn.innerHTML = '<i class="fas fa-check"></i> Saved'; btn.style.color = 'var(--c-green)';
    toast(`${title} saved to tracker`, 'success');
  }
}

/* ── Application Tracker ─────────────────────────────────────── */
function renderKanban() {
  const cols = ['saved','applied','interview','offer','rejected'];
  const counts = {};
  cols.forEach(s => { counts[s] = S.apps.filter(a => a.status === s).length; });

  $('tk-saved').textContent = counts.saved;
  $('tk-applied').textContent = counts.applied;
  $('tk-interview').textContent = counts.interview;
  $('tk-offer').textContent = counts.offer;
  $('tk-rejected').textContent = counts.rejected;

  cols.forEach(status => {
    const el = $(`kc-${status}`); if (el) el.textContent = counts[status];
    const col = $(`col-${status}`);
    const apps = S.apps.filter(a => a.status === status);
    col.innerHTML = apps.length
      ? apps.map(a => renderAppCard(a, status)).join('')
      : `<div class="k-empty">No applications</div>`;
  });

  $('sb-tracker-count').textContent = S.apps.length;
  $('kpi-applied').textContent = S.apps.length;
}

function renderAppCard(a, status) {
  const next = { saved: 'applied', applied: 'interview', interview: 'offer' };
  const nextLabel = { saved: '→ Applied', applied: '→ Interview', interview: '→ Offer' };
  return `
  <div class="app-card" id="app-${a.id}">
    <div class="app-card-name">${escHtml(a.company)}</div>
    <div class="app-card-role">${escHtml(a.role)}</div>
    <div class="app-card-date"><i class="fas fa-calendar" style="font-size:10px;margin-right:3px"></i>${a.date}</div>
    ${a.notes ? `<div style="font-size:11px;color:var(--text-3);margin-top:4px">${escHtml(a.notes)}</div>` : ''}
    <div class="app-card-actions" style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap">
      ${next[status] ? `<button class="app-card-move-btn" onclick="moveApp(${a.id},'${next[status]}')">${nextLabel[status]}</button>` : ''}
      ${status === 'applied' ? `
        <button class="app-card-move-btn" style="color:var(--c-gold-l)" onclick="openSmartFollowup(${a.id})"><i class="fas fa-envelope"></i> Followup</button>
        <button class="app-card-move-btn" style="color:var(--c-green-l)" onclick="markAppReplied(${a.id})"><i class="fas fa-check"></i> Replied</button>
      ` : ''}
      ${status === 'offer' ? `<button class="app-card-move-btn" style="color:var(--c-green-l)" onclick="moveApp(${a.id},'saved')">← Back</button>` : ''}
      <button class="app-card-del-btn" onclick="deleteApp(${a.id})" title="Delete"><i class="fas fa-trash"></i></button>
    </div>
  </div>`;
}

async function openSmartFollowup(appId) {
  if (!Auth.isLoggedIn()) { toast('Please log in to generate followups', 'warning'); return; }
  toast('Generating followup email template...', 'info');
  try {
    const res = await api('POST', `/api/applications/${appId}/followup`);
    if (res.success && res.followup_email) {
      openModal('Smart Follow-up Draft', `
        <div class="fg">
          <label style="font-size:11px;font-weight:bold;color:var(--c-purple-l)">AI Drafted Follow-up</label>
          <textarea class="inp ta-md" id="smart-followup-text" style="font-size:12px;line-height:1.5">${escHtml(res.followup_email)}</textarea>
        </div>
      `, `
        <button class="btn-primary" onclick="navigator.clipboard.writeText($('smart-followup-text').value);toast('Message copied to clipboard!','success')"><i class="fas fa-copy"></i> Copy Follow-up</button>
        <button class="btn-ghost" onclick="closeModal()">Close</button>
      `);
    }
  } catch (e) {
    toast('Failed to generate follow-up: ' + e.message, 'error');
  }
}

async function markAppReplied(appId) {
  if (!Auth.isLoggedIn()) return;
  toast('Processing response context...', 'info');
  try {
    const res = await api('POST', `/api/applications/${appId}/mark-replied`);
    if (res.success) {
      toast('Application moved to Replied stage!', 'success');
      loadKanban();
      if (res.suggested_reply) {
        openModal('Suggested Response Draft', `
          <div class="fg">
            <p class="muted" style="font-size:12px;margin-bottom:8px">HR has contacted you. Here is a suggested response template to coordinate next steps:</p>
            <textarea class="inp ta-md" id="suggested-reply-text" style="font-size:12px;line-height:1.5">${escHtml(res.suggested_reply)}</textarea>
          </div>
        `, `
          <button class="btn-primary" onclick="navigator.clipboard.writeText($('suggested-reply-text').value);toast('Message copied to clipboard!','success')"><i class="fas fa-copy"></i> Copy Response</button>
          <button class="btn-ghost" onclick="closeModal()">Close</button>
        `);
      }
    }
  } catch (e) {
    toast('Failed to mark replied: ' + e.message, 'error');
  }
}
window.openSmartFollowup = openSmartFollowup;
window.markAppReplied = markAppReplied;

async function loadKanban() {
  if (Auth.isLoggedIn()) {
    try {
      const res = await api('GET', '/api/applications/board');
      if (res.success) {
        const apps = [];
        Object.keys(res.board).forEach(status => {
          res.board[status].forEach(item => {
            apps.push({
              id: item.id,
              company_id: item.company_id,
              company: item.company_name,
              role: item.company_roles ? item.company_roles.split(',')[0].trim() : 'Software Developer',
              status: item.status,
              date: item.applied_at ? new Date(item.applied_at * 1000).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
              notes: item.notes,
              fit_score: item.fit_score
            });
          });
        });
        S.apps = apps;
      }
    } catch (e) {
      console.error("Failed to load applications board: " + e.message);
    }
  }
  renderKanban();
}

async function moveApp(id, newStatus) {
  if (Auth.isLoggedIn()) {
    try {
      const res = await api('PATCH', `/api/applications/${id}`, { status: newStatus });
      if (res.success) {
        toast(`Moved to ${newStatus}`, 'success');
        loadKanban();
      } else {
        toast(res.error || 'Failed to move application', 'error');
      }
    } catch (e) {
      toast('Connection error: ' + e.message, 'error');
    }
  } else {
    const app = S.apps.find(a => a.id === id);
    if (app) { app.status = newStatus; saveApps(); renderKanban(); toast(`Moved to ${newStatus}`, 'success'); }
  }
}

async function deleteApp(id) {
  if (Auth.isLoggedIn()) {
    try {
      const res = await api('DELETE', `/api/applications/${id}`);
      if (res.success) {
        toast('Application deleted', 'success');
        loadKanban();
      } else {
        toast(res.error || 'Failed to delete application', 'error');
      }
    } catch (e) {
      toast('Connection error: ' + e.message, 'error');
    }
  } else {
    S.apps = S.apps.filter(a => a.id !== id);
    saveApps(); renderKanban();
  }
}

function openAddApp() {
  openModal('Add Application', `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="fg"><label>Company Name</label><input class="inp" id="na-company" placeholder="e.g. Infocusp Innovations"></div>
      <div class="fg"><label>Role</label><input class="inp" id="na-role" placeholder="e.g. AI/ML Engineer"></div>
      <div class="fg"><label>Status</label>
        <select class="inp" id="na-status"><option value="saved">Saved</option><option value="applied">Applied</option><option value="interview">Interview</option><option value="offer">Offer</option></select>
      </div>
      <div class="fg"><label>Date</label><input class="inp" type="date" id="na-date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="fg"><label>Notes (optional)</label><textarea class="inp" id="na-notes" rows="3" placeholder="Any notes…"></textarea></div>
    </div>`,
    `<button class="btn-primary" onclick="confirmAddApp()"><i class="fas fa-plus"></i> Add Application</button>
     <button class="btn-ghost" onclick="closeModal()">Cancel</button>`
  );
}

async function confirmAddApp() {
  const company = $('na-company').value.trim();
  if (!company) { toast('Company name is required', 'error'); return; }
  const role = $('na-role').value.trim() || 'Software Developer';
  const status = $('na-status').value;
  const notes = $('na-notes').value.trim();

  if (Auth.isLoggedIn()) {
    let company_id = -1;
    const match = S.companies.find(c => c.name.toLowerCase() === company.toLowerCase());
    if (match) company_id = match.id;

    try {
      const res = await api('POST', '/api/applications', {
        company_id: company_id,
        custom_company_name: company_id === -1 ? company : "",
        status: status,
        notes: notes,
        fit_score: 0
      });
      if (res.success) {
        toast(`${company} added to tracker`, 'success');
        closeModal();
        loadKanban();
      } else {
        toast(res.error || 'Failed to add application', 'error');
      }
    } catch (e) {
      toast('Connection error: ' + e.message, 'error');
    }
  } else {
    S.apps.push({
      id: Date.now(), company, role, status, date: $('na-date').value, notes, email: ''
    });
    saveApps(); renderKanban(); closeModal();
    toast(`${company} added to tracker`, 'success');
  }
}

/* ── Job-Hunt Autopilot & Referral Finder ───────────────────── */
let autopilotState = { currentRun: null, drafts: [] };

function initAutopilot() {
  const range = $('ap-count');
  if (range) {
    range.addEventListener('input', () => { $('ap-count-val').textContent = range.value; });
  }
  const runBtn = $('ap-run-btn');
  if (runBtn) {
    runBtn.addEventListener('click', startAutopilotRun);
  }
}

async function loadAutopilot() {
  if (!Auth.isLoggedIn()) {
    toast('Please log in to use Autopilot Agent', 'warning');
    openAuthModal();
    return;
  }
  
  if (S.profile && S.profile.target_roles && S.profile.target_roles.length) {
    $('ap-role').value = S.profile.target_roles[0];
  }
  
  apGetHistory();
}

async function apGetHistory() {
  try {
    const res = await api('GET', '/api/autopilot/history');
    if (res.success && res.runs) {
      const tbody = $('ap-history-tbody');
      if (res.runs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-3)">No runs registered yet</td></tr>`;
      } else {
        tbody.innerHTML = res.runs.map(run => {
          const params = JSON.parse(run.params || '{}');
          const summary = JSON.parse(run.summary || '{}');
          const dateStr = new Date(run.created_at * 1000).toLocaleString();
          let outcome = '—';
          if (run.status === 'completed') {
            outcome = `Sent: ${summary.sent || 0} | Rejected: ${summary.rejected || 0}`;
          }
          return `
            <tr style="border-bottom:1px solid var(--border)">
              <td style="padding:12px 0;color:var(--text-2)">${dateStr}</td>
              <td style="color:var(--text)">${escHtml(params.target_role || '')}</td>
              <td><span class="badge ${run.status === 'completed' ? 'green' : 'purple'}">${run.status}</span></td>
              <td style="color:var(--text-2)">${outcome}</td>
            </tr>
          `;
        }).join('');
      }
    }
  } catch (e) {
    console.error("Failed to load autopilot history: " + e.message);
  }
}

async function startAutopilotRun() {
  const role = $('ap-role').value.trim();
  if (!role) { toast('Target role is required', 'error'); return; }
  const count = parseInt($('ap-count').value);
  const tone = $('ap-tone').value;

  const btn = $('ap-run-btn');
  btn.disabled = true;
  btn.innerHTML = '<div class="parse-spinner" style="width:14px;height:14px;margin:0 5px 0 0;display:inline-block;vertical-align:middle"></div> Generating drafts...';

  try {
    const res = await api('POST', '/api/autopilot/run', { target_role: role, num_companies: count, tone: tone });
    if (res.success) {
      autopilotState.currentRun = res.run_id;
      autopilotState.drafts = res.drafts;
      renderAutopilotQueue();
      $('ap-status-badge').textContent = 'Awaiting Approval';
      toast('Autopilot generated outreach drafts!', 'success');
    } else {
      toast(res.error || 'Failed to start autopilot run', 'error');
    }
  } catch (e) {
    toast(e.message || 'Connection error', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-play"></i> Start Autopilot Run';
  }
}

function renderAutopilotQueue() {
  const container = $('ap-queue-container');
  if (autopilotState.drafts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle" style="font-size:48px;color:var(--c-green)"></i>
        <p>All drafts processed for this run.</p>
      </div>`;
    $('ap-status-badge').textContent = 'Completed';
    apGetHistory();
    return;
  }

  container.innerHTML = autopilotState.drafts.map(d => {
    return `
      <div class="card" id="ap-draft-card-${d.id}" style="border-left: 4px solid var(--c-purple);padding:14px;background:var(--bg-3);margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <h5 style="font-weight:bold;font-size:14px;color:var(--text)">${escHtml(d.company_name)}</h5>
            <span class="badge blue" style="font-size:10px;margin-top:4px"><i class="fas fa-bullseye"></i> Fit Score: ${d.fit_score}%</span>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn-xs primary" onclick="approveDraft(${d.id})" style="background:var(--c-green);color:white"><i class="fas fa-check"></i> Send</button>
            <button class="btn-xs ghost" onclick="rejectDraft(${d.id})" style="color:var(--c-red);border-color:rgba(239,68,68,0.3)"><i class="fas fa-times"></i> Discard</button>
          </div>
        </div>
        <div class="fg" style="margin-bottom:8px">
          <label style="font-size:10px">Subject</label>
          <input class="inp" value="${escHtml(d.subject)}" id="ap-subj-${d.id}" style="font-size:12px;padding:6px 10px;background:var(--bg-2)">
        </div>
        <div class="fg">
          <label style="font-size:10px">Body</label>
          <textarea class="inp" rows="4" id="ap-body-${d.id}" style="font-size:12px;padding:8px 10px;background:var(--bg-2);line-height:1.5">${escHtml(d.body)}</textarea>
        </div>
      </div>
    `;
  }).join('');
}

async function approveDraft(draftId) {
  const subj = $(`ap-subj-${draftId}`).value.trim();
  const body = $(`ap-body-${draftId}`).value.trim();
  if (!subj || !body) { toast('Subject and Body cannot be empty', 'error'); return; }

  const d = autopilotState.drafts.find(x => x.id === draftId);
  if (d) { d.subject = subj; d.body = body; }

  try {
    const res = await api('POST', `/api/autopilot/${autopilotState.currentRun}/approve`, {
      approved_drafts: [draftId],
      rejected_drafts: []
    });
    if (res.success) {
      toast('Email sent and logged to Tracker!', 'success');
      autopilotState.drafts = autopilotState.drafts.filter(x => x.id !== draftId);
      renderAutopilotQueue();
    }
  } catch (e) {
    toast('Approval failed: ' + e.message, 'error');
  }
}

async function rejectDraft(draftId) {
  try {
    const res = await api('POST', `/api/autopilot/${autopilotState.currentRun}/approve`, {
      approved_drafts: [],
      rejected_drafts: [draftId]
    });
    if (res.success) {
      toast('Draft discarded', 'info');
      autopilotState.drafts = autopilotState.drafts.filter(x => x.id !== draftId);
      renderAutopilotQueue();
    }
  } catch (e) {
    toast('Discard failed: ' + e.message, 'error');
  }
}

async function findReferralRecruiter(companyId) {
  if (!Auth.isLoggedIn()) {
    toast('Please log in to query referral contacts', 'warning');
    openAuthModal();
    return;
  }
  toast('Searching database for recruiter...', 'info');
  try {
    const res = await api('GET', `/api/referrals/${companyId}`);
    if (res.success && res.recruiter) {
      const rec = res.recruiter;
      openModal(`Referral Recruiter for Company`, `
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
            <div class="su-avatar" style="width:48px;height:48px;font-size:18px;background:var(--c-purple);color:white;display:flex;align-items:center;justify-content:center;border-radius:50%">${escHtml(rec.name[0])}</div>
            <div>
              <h4 style="font-weight:bold;font-size:15px;color:var(--text)">${escHtml(rec.name)}</h4>
              <span class="badge purple" style="font-size:10px">${escHtml(rec.category)}</span>
            </div>
          </div>
          <div class="prof-row"><span class="pr-lbl">Location</span><span>${escHtml(rec.city)}</span></div>
          <div class="prof-row"><span class="pr-lbl">LinkedIn</span><span><a href="${escHtml(rec.linkedin)}" target="_blank" style="color:var(--c-blue-l);text-decoration:underline"><i class="fab fa-linkedin"></i> View HR Profile</a></span></div>
          
          <div class="fg" style="margin-top:10px">
            <label style="font-size:11px;font-weight:bold;color:var(--c-purple-l)">Suggested Connection Request Message</label>
            <textarea class="inp ta-md" id="referral-intro-text" style="font-size:12px;line-height:1.5">${escHtml(res.suggested_message)}</textarea>
          </div>
        </div>
      `, `
        <button class="btn-primary" onclick="navigator.clipboard.writeText($('referral-intro-text').value);toast('Message copied to clipboard!','success')"><i class="fas fa-copy"></i> Copy Message</button>
        <button class="btn-ghost" onclick="closeModal()">Close</button>
      `);
    } else {
      toast(res.error || 'No recruiters found', 'error');
    }
  } catch (e) {
    toast('Referral search failed: ' + e.message, 'error');
  }
}

window.approveDraft = approveDraft;
window.rejectDraft = rejectDraft;
window.findReferralRecruiter = findReferralRecruiter;

/* ── Mock Interview ──────────────────────────────────────────── */
function initInterview() {
  $('start-iv-btn').addEventListener('click', startInterview);
  $('iv-end-btn').addEventListener('click', endVoiceInterview);
}

/* ── Company-Specific Voice Mock Interview ──────────────────── */
let voiceSessionState = { sessionId: null, currentQuestion: "", totalQuestions: 3, qIdx: 1 };
let recognition = null;
let isRecording = false;

function initSTT() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech Recognition API not supported in this browser.");
    return;
  }
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    const txtArea = $('iv-answer-transcript');
    if (txtArea) {
      txtArea.value = (txtArea.dataset.prevVal || '') + finalTranscript + interimTranscript;
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error: " + event.error);
    stopRecording();
  };
}

function startRecording() {
  if (!recognition) {
    toast("Speech Recognition is not supported or initialized", "error");
    return;
  }
  const txtArea = $('iv-answer-transcript');
  txtArea.dataset.prevVal = txtArea.value;
  recognition.start();
  isRecording = true;
  const btn = $('iv-record-btn');
  btn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording Answer';
  btn.style.background = 'var(--c-red)';
  toast("Microphone listening... Speak now!", "info");
}

function stopRecording() {
  if (recognition && isRecording) {
    recognition.stop();
    isRecording = false;
    const btn = $('iv-record-btn');
    btn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording Answer';
    btn.style.background = 'var(--c-purple)';
    toast("Recording stopped", "success");
  }
}

function speakQuestion(text) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const indVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('en-IN'));
  if (indVoice) utterance.voice = indVoice;
  window.speechSynthesis.speak(utterance);
}

function initInterview() {
  // Populate company list
  const companySelect = $('iv-company');
  if (companySelect && S.companies && S.companies.length) {
    companySelect.innerHTML = '<option value="-1">General Technical Interview</option>' + 
      S.companies.map(c => `<option value="${c.id}">${escHtml(c.name)}</option>`).join('');
  }

  // Setup listeners
  const startBtn = $('start-iv-btn');
  if (startBtn) startBtn.addEventListener('click', startVoiceInterview);

  const recBtn = $('iv-record-btn');
  if (recBtn) {
    recBtn.addEventListener('click', () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    });
  }

  const speakBtn = $('iv-speak-btn');
  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      speakQuestion(voiceSessionState.currentQuestion);
    });
  }

  const submitBtn = $('iv-submit-answer-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitVoiceAnswer);
  }

  const endBtn = $('iv-end-btn');
  if (endBtn) {
    endBtn.addEventListener('click', endVoiceInterview);
  }

  initSTT();
}

async function startVoiceInterview() {
  if (!Auth.isLoggedIn()) {
    toast('Please log in to start Mock Interview', 'warning');
    openAuthModal();
    return;
  }

  const role = $('iv-role').value.trim() || 'Software Engineer';
  const companyId = parseInt($('iv-company').value);
  const difficulty = $('iv-difficulty').value;

  const btn = $('start-iv-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing session…';

  try {
    const res = await api('POST', '/api/mock-interview/voice/start', {
      company_id: companyId,
      role: role,
      difficulty: difficulty
    });

    if (res.success) {
      voiceSessionState.sessionId = res.session_id;
      voiceSessionState.currentQuestion = res.first_question;
      voiceSessionState.totalQuestions = res.total_questions;
      voiceSessionState.qIdx = 1;

      $('iv-setup').style.display = 'none';
      $('iv-session').style.display = 'block';

      $('iv-q-label').textContent = `Question 1 / ${res.total_questions}`;
      $('iv-q-text').textContent = res.first_question;
      $('iv-prog-fill').style.width = `${(1 / res.total_questions) * 100}%`;
      $('iv-answer-transcript').value = "";
      $('iv-feedback-section').style.display = 'none';

      speakQuestion(res.first_question);
      toast('Interview started! Listen to the question and record your answer.', 'success');
      startIVTimer();
    }
  } catch (e) {
    toast('Failed to start interview: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-play"></i> Start Interview';
  }
}

function markdownToHtml(md) {
  if (!md) return "";
  return md
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/- (.*)/g, '<li>$1</li>')
    .replace(/\n/g, '<br>');
}

async function submitVoiceAnswer() {
  const ans = $('iv-answer-transcript').value.trim();
  if (!ans) { toast('Please record or type your answer before submitting', 'error'); return; }

  stopRecording();

  const submitBtn = $('iv-submit-answer-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Evaluating…';

  try {
    const res = await api('POST', '/api/mock-interview/voice/answer', {
      session_id: voiceSessionState.sessionId,
      answer_text: ans
    });

    if (res.success) {
      if (res.done) {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        stopIVTimer();
        openModal('Interview Evaluation Report', `
          <div class="md-body" style="line-height:1.6;font-size:14px;max-height:450px;overflow-y:auto">
            ${markdownToHtml(res.report)}
          </div>
        `, `<button class="btn-primary" onclick="closeModal();endVoiceInterview()"><i class="fas fa-check"></i> Complete</button>`);
      } else {
        voiceSessionState.qIdx += 1;
        voiceSessionState.currentQuestion = res.next_question;

        $('iv-feedback-text').textContent = `Score: ${res.score}/100. ${res.feedback}`;
        $('iv-feedback-section').style.display = 'block';

        setTimeout(() => {
          $('iv-q-label').textContent = `Question ${voiceSessionState.qIdx} / ${voiceSessionState.totalQuestions}`;
          $('iv-q-text').textContent = voiceSessionState.currentQuestion;
          $('iv-prog-fill').style.width = `${(voiceSessionState.qIdx / voiceSessionState.totalQuestions) * 100}%`;
          $('iv-answer-transcript').value = "";
          $('iv-feedback-section').style.display = 'none';

          speakQuestion(voiceSessionState.currentQuestion);
        }, 3000);
      }
    }
  } catch (e) {
    toast('Answer evaluation failed: ' + e.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Answer';
  }
}

function endVoiceInterview() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  stopRecording();
  stopIVTimer();
  $('iv-session').style.display = 'none';
  $('iv-setup').style.display = 'block';
}

function toggleAnswer(btn) {
  const body = btn.nextElementSibling;
  const isVis = body.classList.contains('visible');
  body.classList.toggle('visible');
  btn.innerHTML = isVis ? '<i class="fas fa-eye"></i> Reveal Answer' : '<i class="fas fa-eye-slash"></i> Hide Answer';
}

function startIVTimer() {
  S.ivSeconds = 0;
  if (S.ivTimer) clearInterval(S.ivTimer);
  S.ivTimer = setInterval(() => {
    S.ivSeconds++;
    const m = Math.floor(S.ivSeconds / 60), s = S.ivSeconds % 60;
    $('iv-time').textContent = `${m}:${String(s).padStart(2,'0')}`;
  }, 1000);
}

function endInterview() {
  if (S.ivTimer) clearInterval(S.ivTimer);
  $('iv-setup').style.display = 'block';
  $('iv-session').style.display = 'none';
  $('iv-time').textContent = '0:00';
  toast('Interview session ended. Great practice!', 'success');
}

/* ── ATS Optimizer ──────────────────────────────────────────── */
async function runATS() {
  const role = $('ats-role').value.trim() || 'Software Engineer';
  const text = $('ats-resume').value.trim();
  if (!text) { toast('Paste your resume text first', 'warning'); return; }

  $('ats-btn').disabled = true;
  $('ats-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing…';

  try {
    const res = await api('POST', '/api/ats-optimize', { resume_text: text, target_role: role });
    $('ats-out').style.display = 'flex';
    $('ats-out').style.flexDirection = 'column';
    $('ats-out').style.gap = '14px';

    // Score gauge
    const score = res.ats_score || 0;
    $('kpi-ats').textContent = score;
    localStorage.setItem('comonk_ats_score', score);
    renderATSGauge(score);
    $('ats-score-num').textContent = score;
    $('ats-grade').textContent = res.grade || 'C';
    $('ats-grade').className = `ats-grade-badge ${score>=80?'green':score>=60?'gold':'red'}`;
    $('ats-grade').style.background = score>=80?'rgba(16,185,129,0.15)':score>=60?'rgba(245,158,11,0.15)':'rgba(239,68,68,0.15)';
    $('ats-grade').style.color = score>=80?'var(--c-green)':score>=60?'var(--c-gold-l)':'var(--c-red)';
    $('ats-sum').textContent = res.summary || '';

    // Keywords
    const found = res.keywords_found || [];
    const missing = res.keywords_missing || [];
    $('kf-count').textContent = found.length;
    $('km-count').textContent = missing.length;
    $('kw-found').innerHTML = found.map(k => `<span class="chip-item">${escHtml(k)}</span>`).join('');
    $('kw-missing').innerHTML = missing.map(k => `<span class="chip-item">${escHtml(k)}</span>`).join('');

    // Quick wins
    $('ats-wins').innerHTML = (res.quick_wins || []).map(w => `
      <div class="ats-wins-item">
        <div class="ats-wins-section">${escHtml(w.section||'')}</div>
        <div class="ats-wins-issue">${escHtml(w.issue||'')}</div>
        <div class="ats-wins-fix">${escHtml(w.fix||'')}</div>
      </div>`).join('');

    addNotif('ATS analysis complete', `Your resume scored ${score}/100 for ${role}.`, score>=70?'success':'warning');
  } catch(e) {
    toast('ATS analysis failed: ' + e.message, 'error');
  }
  $('ats-btn').disabled = false;
  $('ats-btn').innerHTML = '<i class="fas fa-search"></i> Analyze ATS Score';
}

function renderATSGauge(score) {
  if (S.atsChart) { S.atsChart.destroy(); S.atsChart = null; }
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const canvas = $('ats-gauge');
  if (!canvas) return;
  S.atsChart = new Chart(canvas, {
    type: 'doughnut',
    data: { datasets: [{ data: [score, 100 - score], backgroundColor: [color, 'rgba(255,255,255,0.05)'], borderWidth: 0, circumference: 270, rotation: 225 }] },
    options: { cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { duration: 800 } },
  });
}

/* ── LinkedIn Optimizer ─────────────────────────────────────── */
async function runLinkedIn() {
  const role = $('li-role').value.trim() || 'Software Engineer';
  const about = $('li-about').value.trim();
  $('li-btn').disabled = true;
  $('li-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing…';
  try {
    const res = await api('POST', '/api/linkedin-optimize', {
      about_text: about, target_role: role, skills: S.profile?.skills || [],
    });
    $('li-out').style.display = 'flex';
    $('li-out').style.flexDirection = 'column';
    $('li-out').style.gap = '14px';

    $('li-headlines').innerHTML = (res.headlines || []).map((h, i) => `
      <div class="headline-option" onclick="navigator.clipboard.writeText(this.textContent.trim()).then(()=>toast('Copied!','success'))">
        <span style="color:var(--text-3);font-size:11px;margin-right:6px">#${i+1}</span>${escHtml(h)}
      </div>`).join('');
    $('li-about-out').textContent = res.rewritten_about || '';
    $('li-tips').innerHTML = (res.tips || []).map(t => `<li>${escHtml(t)}</li>`).join('');
    $('li-copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText($('li-about-out').textContent).then(() => toast('About section copied!', 'success'));
    });
    toast('LinkedIn optimization ready!', 'success');
  } catch(e) {
    toast('LinkedIn optimization failed: ' + e.message, 'error');
  }
  $('li-btn').disabled = false;
  $('li-btn').innerHTML = '<i class="fab fa-linkedin"></i> Generate Optimization';
}

/* ── Learning Hub ────────────────────────────────────────────── */
async function loadLearning(tab) {
  const skills = (S.profile?.skills || ['python']).slice(0, 5).join(',');
  const el = $('learn-content');
  el.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading…</p></div>`;

  try {
    if (tab === 'articles') {
      const res = await api('GET', `/api/learning-resources?skills=${encodeURIComponent(skills)}&limit=15`);
      const items = res.resources || [];
      if (!items.length) { el.innerHTML = `<div class="empty-state"><i class="fas fa-newspaper"></i><p>No articles found</p></div>`; return; }
      el.innerHTML = items.map(a => `
        <a href="${escHtml(a.url||'#')}" target="_blank" class="resource-card" style="text-decoration:none;display:block">
          ${a.cover ? `<img class="rc-img" src="${escHtml(a.cover)}" onerror="this.style.display='none'" loading="lazy">` : ''}
          <div class="rc-body">
            <div class="rc-source" style="color:${a.source==='Dev.to'?'var(--c-blue-l)':'var(--c-gold-l)'}">${escHtml(a.source||'')}</div>
            <div class="rc-title">${escHtml(a.title||'')}</div>
            <div class="rc-meta">${a.reading_time ? a.reading_time + ' min read' : ''}</div>
          </div>
        </a>`).join('');

    } else if (tab === 'youtube') {
      const query = (S.profile?.skills?.[0] || 'python') + ' tutorial';
      const res = await api('GET', `/api/youtube-tutorials?query=${encodeURIComponent(query)}&max_results=12`);
      if (res.message) { el.innerHTML = `<div class="empty-state"><i class="fab fa-youtube"></i><p>${escHtml(res.message)}</p><a href="${escHtml(res.fallback_url||'#')}" target="_blank" class="btn-primary" style="margin-top:12px;display:inline-flex"><i class="fab fa-youtube"></i> Search YouTube</a></div>`; return; }
      const videos = res.videos || [];
      if (!videos.length) { el.innerHTML = `<div class="empty-state"><i class="fab fa-youtube"></i><p>No videos found. Add YOUTUBE_API_KEY to .env</p></div>`; return; }
      el.innerHTML = videos.map(v => `
        <a href="${escHtml(v.url||'#')}" target="_blank" class="resource-card" style="text-decoration:none;display:block">
          <div class="rc-thumb"><img src="${escHtml(v.thumbnail||'')}" alt="" onerror="this.parentElement.innerHTML='<span class=rc-play-icon><i class=fab\\ fa-youtube></i></span>'"></div>
          <div class="rc-body">
            <div class="rc-source" style="color:#ff0000"><i class="fab fa-youtube"></i> ${escHtml(v.channel||'')}</div>
            <div class="rc-title">${escHtml(v.title||'')}</div>
            <div class="rc-meta">${v.published||''}</div>
          </div>
        </a>`).join('');

    } else if (tab === 'news') {
      const res = await api('GET', `/api/tech-news?skills=${encodeURIComponent(skills)}&limit=15`);
      const articles = res.articles || [];
      if (!articles.length) { el.innerHTML = `<div class="empty-state"><i class="fas fa-rss"></i><p>No news found. Add GNEWS_API_KEY to .env for richer news.</p></div>`; return; }
      el.innerHTML = articles.map(a => `
        <a href="${escHtml(a.url||'#')}" target="_blank" class="resource-card" style="text-decoration:none;display:block">
          ${a.image ? `<img class="rc-img" src="${escHtml(a.image)}" onerror="this.style.display='none'" loading="lazy">` : ''}
          <div class="rc-body">
            <div class="rc-source" style="color:var(--c-gold-l)">${escHtml(a.source||'')}</div>
            <div class="rc-title">${escHtml(a.title||'')}</div>
            <div class="rc-meta">${a.published||''} · ${escHtml(a.description?.slice(0,80)||'')}</div>
          </div>
        </a>`).join('');

    } else if (tab === 'cheatsheets') {
      await loadCheatsheets(el, skills);

    } else if (tab === 'roadmaps') {
      await loadRoadmapShTab(el, skills);

    } else if (tab === 'github-trending') {
      await loadGitHubTrendingTab(el);

    } else if (tab === 'producthunt') {
      await loadProductHuntTab(el);
    } else if (tab === 'studyplan') {
      await loadStudyPlan(el);
    }
  } catch(e) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>Could not load: ${escHtml(e.message)}</p></div>`;
  }
}

/* ── GitHub Trending Tab in Learning Hub ────────────────────────── */
async function loadGitHubTrendingTab(el) {
  const lang = S.profile?.skills?.[0]?.toLowerCase().replace(/\s+/g,'') || 'python';
  const langMap = { 'machine learning':'python','ml':'python','deep learning':'python','data science':'python','react':'javascript','nodejs':'javascript','node':'javascript','typescript':'typescript','java':'java','spring':'java','golang':'go','go':'go','flutter':'dart','android':'kotlin','ios':'swift' };
  const finalLang = langMap[lang] || lang;
  el.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading trending ${finalLang} repos…</p></div>`;
  const res = await api('GET', `/api/github-trending?language=${encodeURIComponent(finalLang)}&period=weekly`);
  const repos = res.repos || [];
  if (!repos.length) { el.innerHTML = `<div class="empty-state"><i class="fab fa-github"></i><p>No trending repos found</p></div>`; return; }
  el.innerHTML = `<div class="trend-grid">${repos.map(r => `
    <a href="${escHtml(r.url)}" target="_blank" class="trend-card">
      <div class="trend-card-top">
        <img class="trend-owner-av" src="${escHtml(r.owner_avatar)}" alt="" onerror="this.style.display='none'">
        <div><div class="trend-name">${escHtml(r.name)}</div><div class="trend-lang"><span class="lang-dot"></span>${escHtml(r.language)}</div></div>
      </div>
      <p class="trend-desc">${escHtml(r.description?.slice(0,100)||'No description')}</p>
      <div class="trend-stats">
        <span><i class="fas fa-star" style="color:var(--c-gold)"></i> ${r.stars.toLocaleString()}</span>
        <span><i class="fas fa-code-branch" style="color:var(--c-blue-l)"></i> ${r.forks.toLocaleString()}</span>
        ${r.topics.slice(0,2).map(t=>`<span class="skill-chip" style="font-size:10px;padding:2px 6px">${escHtml(t)}</span>`).join('')}
      </div>
    </a>`).join('')}</div>`;
}

/* ── Product Hunt Tab in Learning Hub ────────────────────────────── */
async function loadProductHuntTab(el) {
  el.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading trending products…</p></div>`;
  const res = await api('GET', '/api/product-hunt');
  const products = res.products || [];
  if (!products.length) { el.innerHTML = `<div class="empty-state"><i class="fas fa-rocket"></i><p>Could not load Product Hunt feed</p></div>`; return; }
  el.innerHTML = `<div class="ph-grid">${products.map((p,i) => `
    <a href="${escHtml(p.url||'https://producthunt.com')}" target="_blank" class="ph-card">
      <div class="ph-rank">${i+1}</div>
      <div class="ph-body">
        <div class="ph-name">${escHtml(p.name)}</div>
        <div class="ph-desc">${escHtml(p.description?.slice(0,120)||'')}</div>
      </div>
      <span class="btn-xs ghost">View <i class="fas fa-external-link-alt"></i></span>
    </a>`).join('')}</div>`;
}

async function loadStudyPlan(el) {
  el.innerHTML = '<div class="empty-state"><div class="parse-spinner"></div><p>Fetching study plan...</p></div>';
  try {
    const res = await api('GET', '/api/learning/plan');
    const prog = await api('GET', '/api/learning/progress');
    
    if (res.success && res.tasks) {
      const todo = res.tasks.filter(t => t.status === 'todo');
      const doing = res.tasks.filter(t => t.status === 'doing');
      const done = res.tasks.filter(t => t.status === 'done');
      const pct = prog.percentage || 0;
      
      el.innerHTML = `
        <div style="grid-column: 1 / -1; display:flex; justify-content:space-between; align-items:center; padding:12px; background:var(--bg-2); border:1px solid var(--border); border-radius:12px; margin-bottom:12px">
          <span style="font-weight:bold;color:var(--text)">Study Progress:</span>
          <div style="display:flex;align-items:center;gap:12px;flex:1;max-width:300px;margin-left:14px">
            <div style="height:8px;background:var(--bg-3);border-radius:4px;flex:1;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--c-purple),var(--c-green))"></div>
            </div>
            <span style="font-weight:bold;font-size:13px">${pct}%</span>
          </div>
        </div>
        <div class="kanban" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width:100%">
          <div class="k-col" style="min-height:300px">
            <div class="k-col-hdr"><span class="k-dot purple"></span>To Learn (${todo.length})</div>
            <div class="k-cards" style="padding:10px;display:flex;flex-direction:column;gap:8px">
              ${todo.length ? todo.map(t => renderStudyTaskCard(t)).join('') : '<div class="k-empty">No tasks</div>'}
            </div>
          </div>
          <div class="k-col" style="min-height:300px">
            <div class="k-col-hdr"><span class="k-dot gold"></span>Learning (${doing.length})</div>
            <div class="k-cards" style="padding:10px;display:flex;flex-direction:column;gap:8px">
              ${doing.length ? doing.map(t => renderStudyTaskCard(t)).join('') : '<div class="k-empty">No tasks</div>'}
            </div>
          </div>
          <div class="k-col" style="min-height:300px">
            <div class="k-col-hdr"><span class="k-dot green"></span>Mastered (${done.length})</div>
            <div class="k-cards" style="padding:10px;display:flex;flex-direction:column;gap:8px">
              ${done.length ? done.map(t => renderStudyTaskCard(t)).join('') : '<div class="k-empty">No tasks</div>'}
            </div>
          </div>
        </div>
      `;
    }
  } catch (e) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load study plan: ${e.message}</p></div>`;
  }
}

function renderStudyTaskCard(t) {
  const nextStatus = t.status === 'todo' ? 'doing' : t.status === 'doing' ? 'done' : null;
  const nextLabel = t.status === 'todo' ? 'Start Learning' : t.status === 'doing' ? 'Mark Completed' : null;
  const backStatus = t.status === 'doing' ? 'todo' : t.status === 'done' ? 'doing' : null;
  
  return `
    <div class="app-card" style="padding:12px;background:var(--bg-1);border:1px solid var(--border)">
      <div style="font-weight:bold;font-size:13px;color:var(--text);margin-bottom:4px;text-transform:capitalize">${escHtml(t.skill)}</div>
      <a href="${escHtml(t.resource_url)}" target="_blank" style="font-size:11px;color:var(--c-blue-l);display:block;margin-bottom:8px">
        <i class="fab fa-youtube"></i> Search Tutorials
      </a>
      <div style="display:flex;gap:6px">
        ${nextStatus ? `<button class="btn-xs primary" onclick="updateStudyTask(${t.id}, '${nextStatus}')" style="flex:1;background:var(--c-purple);color:white;font-weight:600">${nextLabel}</button>` : ''}
        ${backStatus ? `<button class="btn-xs ghost" onclick="updateStudyTask(${t.id}, '${backStatus}')"><i class="fas fa-undo"></i></button>` : ''}
      </div>
    </div>
  `;
}

async function updateStudyTask(taskId, newStatus) {
  try {
    const res = await api('PATCH', `/api/learning/${taskId}`, { status: newStatus });
    if (res.success) {
      toast('Planner updated!', 'success');
      loadLearning('studyplan');
    }
  } catch (e) {
    toast('Failed to update task: ' + e.message, 'error');
  }
}
window.updateStudyTask = updateStudyTask;

/* ── Cheat Sheets (cheatography.com) ──────────────────────────── */
async function loadCheatsheets(el, skills) {
  const skill = (S.profile?.skills?.[0] || skills?.split(',')?.[0] || 'python').trim();
  const res = await api('GET', `/api/cheatsheets?skill=${encodeURIComponent(skill)}&limit=12`);
  const sheets = res.cheatsheets || [];

  const searchUrl = res.search_url || `https://cheatography.com/search/?q=${encodeURIComponent(skill)}`;
  const topBar = `
    <div class="cs-topbar">
      <div>
        <span class="cs-source-badge"><i class="fas fa-scroll"></i> cheatography.com</span>
        <span class="muted" style="font-size:12px;margin-left:8px;">Showing cheat sheets for "<b>${escHtml(skill)}</b>"</span>
        ${res.source === 'curated' ? '<span class="badge blue" style="margin-left:8px;font-size:10px;">Curated</span>' : ''}
      </div>
      <a href="${escHtml(searchUrl)}" target="_blank" class="btn-xs ghost"><i class="fas fa-search"></i> Search More</a>
    </div>`;

  if (!sheets.length) {
    el.innerHTML = topBar + `<div class="empty-state"><i class="fas fa-scroll"></i><p>No cheat sheets found for "${escHtml(skill)}"</p><a href="${escHtml(searchUrl)}" target="_blank" class="btn-primary" style="margin-top:12px;display:inline-flex"><i class="fas fa-external-link-alt"></i> Browse cheatography.com</a></div>`;
    return;
  }

  el.innerHTML = topBar + `<div class="cheatsheet-grid">${
    sheets.map(s => `
      <a href="${escHtml(s.url||'https://cheatography.com')}" target="_blank" class="cs-card">
        <div class="cs-icon"><i class="fas fa-scroll"></i></div>
        <div class="cs-body">
          <div class="cs-title">${escHtml(s.name||'Cheat Sheet')}</div>
          ${s.author ? `<div class="cs-author"><i class="fas fa-user"></i> ${escHtml(s.author)}</div>` : ''}
          ${s.description ? `<div class="cs-desc">${escHtml(s.description.slice(0,80))}…</div>` : ''}
        </div>
        <div class="cs-actions">
          <span class="btn-xs ghost"><i class="fas fa-external-link-alt"></i> Open</span>
        </div>
      </a>`).join('')
  }</div>
  <div class="cs-footer">
    <a href="https://cheatography.com" target="_blank" class="btn-ghost btn-sm"><i class="fas fa-globe"></i> Browse All on cheatography.com</a>
    <span class="muted" style="font-size:12px">2,000+ free cheat sheets · No account needed</span>
  </div>`;
}

/* ── Official Roadmaps Tab (roadmap.sh) ───────────────────────── */
async function loadRoadmapShTab(el, skills) {
  const role = S.profile?.target_role || '';
  const res = await api('GET', `/api/roadmaps?skills=${encodeURIComponent(skills)}&role=${encodeURIComponent(role)}`);
  const roadmaps = res.roadmaps || [];

  el.innerHTML = `
    <div class="cs-topbar">
      <div>
        <span class="cs-source-badge roadmap-badge"><i class="fas fa-map-signs"></i> roadmap.sh</span>
        <span class="muted" style="font-size:12px;margin-left:8px;">Official community-maintained roadmaps · Open source</span>
      </div>
      <a href="https://roadmap.sh" target="_blank" class="btn-xs ghost"><i class="fas fa-external-link-alt"></i> View All ${res.total||30}+</a>
    </div>
    <div class="roadmap-sh-grid">${
      roadmaps.map(rm => `
        <div class="rm-sh-card">
          <div class="rm-sh-icon">${rm.icon}</div>
          <div class="rm-sh-body">
            <div class="rm-sh-title">${escHtml(rm.title)}</div>
            <div class="rm-sh-tags">${(rm.tags||[]).slice(0,3).map(t=>`<span class="skill-chip" style="font-size:10px;padding:2px 7px">${escHtml(t)}</span>`).join('')}</div>
          </div>
          <div class="rm-sh-btns">
            <a href="${escHtml(rm.url)}" target="_blank" class="btn-xs ghost"><i class="fas fa-eye"></i> View</a>
            <a href="${escHtml(rm.pdf_url)}" target="_blank" class="btn-xs ghost" style="color:var(--c-red-l)"><i class="fas fa-file-pdf"></i> PDF</a>
          </div>
        </div>`).join('')
    }</div>
    <div class="cs-footer">
      <a href="https://roadmap.sh" target="_blank" class="btn-ghost btn-sm"><i class="fas fa-map-signs"></i> All Roadmaps on roadmap.sh</a>
      <span class="muted" style="font-size:12px">100% free · GitHub open source · Updated regularly</span>
    </div>`;
}

/* ── Load roadmap.sh cards in Career Roadmap panel ───────────── */
async function loadRoadmapShCards() {
  const el = $('roadmap-sh-cards');
  if (!el) return;
  try {
    const skills = (S.profile?.skills || []).join(',');
    const role = S.profile?.target_role || '';
    const res = await api('GET', `/api/roadmaps?skills=${encodeURIComponent(skills)}&role=${encodeURIComponent(role)}`);
    const roadmaps = (res.roadmaps || []).slice(0, 8);
    if (!roadmaps.length) { el.innerHTML = `<div class="empty-state sm"><p>No roadmaps found</p></div>`; return; }
    el.innerHTML = `<div class="roadmap-sh-grid">${
      roadmaps.map(rm => `
        <div class="rm-sh-card">
          <div class="rm-sh-icon">${rm.icon}</div>
          <div class="rm-sh-body">
            <div class="rm-sh-title">${escHtml(rm.title)}</div>
          </div>
          <div class="rm-sh-btns">
            <a href="${escHtml(rm.url)}" target="_blank" class="btn-xs ghost"><i class="fas fa-eye"></i> View</a>
            <a href="${escHtml(rm.pdf_url)}" target="_blank" class="btn-xs ghost" style="color:var(--c-red-l)"><i class="fas fa-file-pdf"></i> PDF</a>
          </div>
        </div>`).join('')
    }</div>`;
  } catch(e) {
    el.innerHTML = `<div class="empty-state sm"><p>Could not load roadmaps</p></div>`;
  }
}

/* ── Career Roadmap ─────────────────────────────────────────── */
async function generateRoadmap() {
  const role = $('rm-role').value.trim() || 'Software Engineer';
  const level = $('rm-level').value;
  const btn = $('gen-rm-btn');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
  try {
    const [resText, resVisual] = await Promise.all([
      api('POST', '/api/career-roadmap', { target_role: role, experience_level: level, skills: S.profile?.skills || [] }),
      api('POST', '/api/visual-roadmap', { role, experience_level: level, current_skills: S.profile?.skills || [] })
    ]);

    // Set text roadmap
    $('rm-content').innerHTML = mdToHtml(resText.roadmap || '');

    // Render visual roadmap
    renderVisualRoadmap(resVisual);

    // Show toggle and content
    $('rm-tabs-wrap').style.display = 'flex';
    $('rm-tab-visual').classList.add('active');
    $('rm-tab-text').classList.remove('active');
    $('rm-visual-out').style.display = 'block';
    $('rm-out').style.display = 'none';

    $('rm-tabs-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast('90-day interactive roadmap generated!', 'success');
  } catch(e) {
    toast('Roadmap generation failed: ' + e.message, 'error');
  }
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-magic"></i> Generate My 90-Day Roadmap';
}

/* ── Salary Insights ─────────────────────────────────────────── */
async function getSalary() {
  const role = $('sal-role').value.trim() || 'Software Engineer';
  const level = $('sal-level').value;
  const years = parseInt($('sal-years').value) || 0;
  const btn = $('sal-btn');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching…';
  try {
    const res = await api('POST', '/api/salary-insights', { role, experience_level: level, experience_years: years, skills: S.profile?.skills || [] });
    $('sal-out').style.display = 'flex';
    $('sal-out').style.flexDirection = 'column';
    $('sal-out').style.gap = '14px';

    const r = res.salary_range || {};
    $('sal-min').textContent = fmtINR(r.min);
    $('sal-typ').textContent = fmtINR(r.typical);
    $('sal-max').textContent = fmtINR(r.max);
    setTimeout(() => { $('sal-bar').style.width = '100%'; }, 100);

    $('sal-tips').innerHTML = (res.negotiation_tips || []).map(t => `<li>${escHtml(t)}</li>`).join('');

    renderCityChart(res.comparison || {});
    // Load live exchange rates for global salary comparison
    loadExchangeRates((r.typical || 600000) / 12);  // monthly to annual
    toast('Salary data loaded for ' + role, 'success');
  } catch(e) {
    toast('Salary fetch failed: ' + e.message, 'error');
  }
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-search"></i> Get Salary Data';
}

function renderCityChart(comp) {
  if (S.cityChart) { S.cityChart.destroy(); S.cityChart = null; }
  const cities = Object.keys(comp);
  const labels = cities.map(c => c.charAt(0).toUpperCase() + c.slice(1));
  const values = cities.map(c => {
    const v = comp[c];
    if (v === 'base') return 100;
    const m = String(v).match(/(\d+)/);
    return m ? 100 + parseInt(m[1]) : 100;
  });
  const colors = ['#7c3aed','#3b82f6','#10b981','#f59e0b','#ef4444'];
  S.cityChart = new Chart($('city-chart'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Salary Index (Ahmedabad = 100)', data: values, backgroundColor: colors.slice(0, cities.length), borderRadius: 8, borderSkipped: false }] },
    options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8080a0' } }, y: { grid: { display: false }, ticks: { color: '#8080a0' } } }, animation: { duration: 600 } },
  });
}

/* ── GitHub Analyzer ─────────────────────────────────────────── */
async function analyzeGitHub() {
  const username = $('gh-username').value.trim();
  if (!username) { toast('Enter a GitHub username', 'warning'); return; }
  const btn = $('gh-analyze-btn');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing…';
  try {
    const res = await api('GET', `/api/github-profile?username=${encodeURIComponent(username)}`);
    $('gh-out').style.display = 'block';

    $('gh-avatar').src = res.avatar || '';
    $('gh-name').textContent = res.name || res.username || '';
    $('gh-bio').textContent = res.bio || '';
    $('gh-repos-cnt').textContent = res.public_repos || 0;
    $('gh-stars-cnt').textContent = res.total_stars || 0;
    $('gh-followers-cnt').textContent = res.followers || 0;
    $('gh-langs').innerHTML = (res.top_languages || []).map(l => `<span class="lang-chip">${escHtml(l)}</span>`).join('');

    $('gh-repos-grid').innerHTML = (res.best_repos || []).map(r => `
      <div class="gh-repo-card">
        <a href="${escHtml(r.url||'#')}" target="_blank" class="gh-repo-name"><i class="fas fa-code-branch" style="margin-right:4px;font-size:12px"></i>${escHtml(r.name||'')}</a>
        <div class="gh-repo-desc">${escHtml(r.description||'No description')}</div>
        <div class="gh-repo-meta">
          ${r.language ? `<span><i class="fas fa-circle" style="color:var(--c-purple-l)"></i> ${escHtml(r.language)}</span>` : ''}
          <span><i class="fas fa-star"></i> ${r.stars || 0}</span>
          <span><i class="fas fa-code-branch"></i> ${r.forks || 0}</span>
        </div>
      </div>`).join('');

    if (res.ai_analysis) {
      const a = res.ai_analysis;
      $('gh-score-box').style.display = 'block';
      $('gh-score-val').textContent = a.score || '—';
      $('gh-analysis-card').style.display = 'block';
      $('gh-strengths').innerHTML = `<div class="strengths-list">${(a.strengths||[]).map(s=>`<div class="str-item">${escHtml(s)}</div>`).join('')}</div>`;
      $('gh-improvements').innerHTML = `<div class="improvements-list">${(a.improvements||[]).map(s=>`<div class="imp-item">${escHtml(s)}</div>`).join('')}</div>`;
      $('gh-ai-sum').textContent = a.summary || '';
    }
    toast(`GitHub profile analyzed for @${username}`, 'success');
  } catch(e) {
    toast('GitHub analysis failed: ' + e.message, 'error');
  }
  btn.disabled = false; btn.innerHTML = '<i class="fab fa-github"></i> Analyze Profile';
}

/* ── Global Search ───────────────────────────────────────────── */
function handleGlobalSearch(e) {
  const q = e.target.value.trim().toLowerCase();
  if (!q) return;
  const result = S.companies.filter(c =>
    c.name.toLowerCase().includes(q) || (c.roles||'').toLowerCase().includes(q) || (c.category||'').toLowerCase().includes(q)
  ).slice(0, 5);
  if (result.length) {
    openPanel('targets');
    $('targets-search').value = e.target.value;
    renderCompanies();
    $('global-search').value = '';
  }
}

/* ── Debounce ────────────────────────────────────────────────── */
function debounce(fn, wait) {
  let t; return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
}

/* ── INIT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initLanding);

/* ═══════════════════════════════════════════════════════════════
   BATCH 3 - NEW CONTROLLERS: ROADMAPS, CHEAT SHEETS, RESOURCES
   ═══════════════════════════════════════════════════════════════ */

/* ── Visual Career Roadmap Renderer ─────────────────────────── */
function renderVisualRoadmap(data) {
  const container = $('rm-visual-out');
  container.innerHTML = '';
  
  let html = `
    <div class="card" style="margin-bottom: 20px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--c-purple), var(--c-blue));"></div>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3>${escHtml(data.role)} Visual Roadmap</h3>
          <p class="muted" style="margin-top: 4px;">Duration: <strong>${escHtml(data.total_duration)}</strong> · Target Salary: <strong class="green">${escHtml(data.salary_after_roadmap || '—')}</strong></p>
        </div>
        <span class="badge purple">90-Day Guide</span>
      </div>
      <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-2);">${escHtml(data.overview || '')}</p>
    </div>
  `;

  if (data.phases && data.phases.length) {
    html += '<div class="rm-visual-container">';
    data.phases.forEach(p => {
      const color = p.color || '#7c3aed';
      html += `
        <div class="rm-phase-block">
          <div class="rm-phase-accent" style="background: ${color};"></div>
          <div class="rm-phase-hdr">
            <div class="rm-phase-title-group">
              <div class="rm-phase-num" style="border: 1px solid ${color}; color: ${color}; font-weight: 700;">${p.phase_number}</div>
              <div class="rm-phase-name">${escHtml(p.emoji || '📅')} ${escHtml(p.phase_name)}</div>
            </div>
            <span class="rm-phase-dur"><i class="fas fa-clock"></i> ${escHtml(p.duration)}</span>
          </div>
          <p class="rm-phase-desc">${escHtml(p.description || '')}</p>
          
          <div class="rm-nodes-grid">
      `;
      
      if (p.nodes && p.nodes.length) {
        p.nodes.forEach(node => {
          const typeClass = (node.type || 'core').toLowerCase();
          const priority = node.priority || 'must-know';
          
          html += `
            <div class="rm-node-card">
              <div>
                <div class="rm-node-hdr">
                  <div class="rm-node-title">${escHtml(node.name)}</div>
                  <div class="rm-node-tags">
                    <span class="rm-node-badge ${typeClass}">${escHtml(node.type || 'core')}</span>
                    <span class="rm-priority-badge">${escHtml(priority)}</span>
                  </div>
                </div>
                <p class="rm-node-desc" style="margin-top: 8px;">${escHtml(node.description || '')}</p>
          `;
          
          if (node.subtopics && node.subtopics.length) {
            html += `
              <div class="rm-node-subtopics">
                <div class="rm-subtopics-title">Subtopics</div>
                ${node.subtopics.map(sub => `<span class="rm-subtopic-tag">${escHtml(sub)}</span>`).join('')}
              </div>
            `;
          }
          
          html += `
              </div>
              <div class="rm-node-footer">
                <span class="rm-node-days"><i class="fas fa-calendar-alt"></i> ~${node.estimated_days || 5} days</span>
                ${node.free_resource ? `<a href="${escHtml(node.free_resource)}" target="_blank" class="rm-node-link"><i class="fas fa-external-link-alt"></i> Learn Free</a>` : ''}
              </div>
            </div>
          `;
        });
      }
      
      html += `
          </div>
        </div>
      `;
    });
    html += '</div>';
  }

  html += `
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-top: 20px;" class="rm-milestones-layout">
  `;

  if (data.milestones && data.milestones.length) {
    html += `
      <div class="card">
        <h4 style="margin-bottom: 12px;"><i class="fas fa-flag text-purple"></i> Milestones Timeline</h4>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${data.milestones.map(m => `
            <div style="border-left: 2px solid var(--border-hi); padding-left: 14px; position: relative;">
              <div style="position: absolute; left: -6px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--c-purple);"></div>
              <div style="font-size: 11px; font-weight: 700; color: var(--c-purple-l); text-transform: uppercase;">${escHtml(m.week)}</div>
              <div style="font-weight: 600; font-size: 13px; margin: 2px 0;">${escHtml(m.achievement)}</div>
              <div style="font-size: 12px; color: var(--text-2);">Proof: <em>${escHtml(m.proof)}</em></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (data.final_project) {
    const proj = data.final_project;
    html += `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="card">
          <h4 style="margin-bottom: 8px;"><i class="fas fa-code text-blue"></i> Capstone Project</h4>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${escHtml(proj.name)}</div>
          <p class="muted" style="font-size: 12.5px; line-height: 1.4; margin-bottom: 10px;">${escHtml(proj.description)}</p>
          ${proj.tech_stack ? `
            <div style="margin-bottom: 10px;">
              ${proj.tech_stack.map(t => `<span class="rm-subtopic-tag" style="background:rgba(59,130,246,0.08); border-color:rgba(59,130,246,0.15); color:var(--c-blue-l);">${escHtml(t)}</span>`).join('')}
            </div>
          ` : ''}
          ${proj.github_template ? `<a href="${escHtml(proj.github_template)}" target="_blank" class="btn-xs ghost" style="display: inline-flex;"><i class="fab fa-github"></i> Template Repo</a>` : ''}
        </div>
    `;
  }

  if (data.job_ready_checklist && data.job_ready_checklist.length) {
    html += `
      <div class="card">
        <h4 style="margin-bottom: 10px;"><i class="fas fa-check-double text-green"></i> Job-Ready Checklist</h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${data.job_ready_checklist.map((item, idx) => `
            <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; cursor: pointer;">
              <input type="checkbox" style="margin-top: 4px; accent-color: var(--c-green);" id="rm-chk-${idx}">
              <span>${escHtml(item)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
    `;
  } else {
    html += `</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

/* ── Free Cheat Sheets ───────────────────────────────────────── */
async function loadCheatSheetTopics() {
  const container = $('cs-categories');
  container.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div><p>Loading categories…</p></div>`;
  try {
    const data = await api('GET', '/api/cheat-sheet-topics');
    const cats = data.categories || {};
    container.innerHTML = Object.keys(cats).map(catName => {
      const topics = cats[catName] || [];
      return `
        <div class="cs-cat-card">
          <div class="cs-cat-hdr">
            <span>${escHtml(catName)}</span>
          </div>
          <div class="cs-topics-list">
            ${topics.map(t => `
              <button class="cs-topic-btn" onclick="loadCheatSheet('${escHtml(t.name)}')">
                ${escHtml(t.icon || '⚡')} ${escHtml(t.name)}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  } catch(e) {
    container.innerHTML = `<div class="empty-state sm"><i class="fas fa-exclamation-triangle"></i><p>Failed to load categories: ${escHtml(e.message)}</p></div>`;
  }
}

async function loadCheatSheet(technology) {
  if (!technology) return;
  const level = S.profile?.seniority_level || 'beginner';
  $('cs-out').style.display = 'none';
  $('cs-browse-wrap').style.display = 'none';
  
  const mainPanel = $('panel-cheatsheets');
  const loader = document.createElement('div');
  loader.className = 'empty-state';
  loader.id = 'cs-loading';
  loader.innerHTML = `<div class="parse-spinner"></div><p>AI is generating a custom <strong>${escHtml(technology)}</strong> cheat sheet...</p>`;
  mainPanel.appendChild(loader);
  
  try {
    const res = await api('POST', '/api/cheat-sheet', { technology, level });
    loader.remove();
    $('cs-out').style.display = 'block';
    
    $('cs-title').textContent = res.technology || technology;
    $('cs-tagline').textContent = res.tagline || '';
    $('cs-level').textContent = (res.level || level).toUpperCase();
    
    const color = res.color_theme || '#7c3aed';
    $('cs-accent-bar').style.background = color;
    
    if (res.quick_install) {
      $('cs-install-wrap').style.display = 'flex';
      $('cs-install-cmd').textContent = res.quick_install;
      $('cs-install-copy').onclick = () => {
        navigator.clipboard.writeText(res.quick_install).then(() => toast('Install command copied!', 'success'));
      };
    } else {
      $('cs-install-wrap').style.display = 'none';
    }
    
    const secGrid = $('cs-sections-grid');
    secGrid.innerHTML = '';
    if (res.sections && res.sections.length) {
      res.sections.forEach(sec => {
        const secCard = document.createElement('div');
        secCard.className = 'card cs-syntax-card';
        secCard.innerHTML = `
          <h3>${escHtml(sec.emoji || '📝')} ${escHtml(sec.title)}</h3>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${(sec.items || []).map(item => `
              <div class="cs-syntax-item">
                <div class="cs-syntax-item-hdr">
                  <span class="cs-syntax-key">${escHtml(item.key)}</span>
                  <span class="cs-syntax-desc">${escHtml(item.description)}</span>
                </div>
                <div class="cs-cmd-box">
                  <code>${escHtml(item.syntax || item.example || '')}</code>
                  <button class="icon-btn xs" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent).then(()=>toast('Copied!','success'))" style="width:24px; height:24px;">
                    <i class="fas fa-copy" style="font-size:10px;"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        secGrid.appendChild(secCard);
      });
    }
    
    const olContainer = $('cs-oneliners');
    olContainer.innerHTML = '';
    if (res.one_liners && res.one_liners.length) {
      olContainer.parentElement.style.display = 'block';
      olContainer.innerHTML = res.one_liners.map(ol => `
        <div class="cs-list-item">
          <div style="font-weight:600; font-family:'JetBrains Mono',monospace; color:var(--c-purple-l); margin-bottom:2px; display:flex; align-items:center; justify-content:space-between;">
            <code>${escHtml(ol.command)}</code>
            <button class="icon-btn xs" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent).then(()=>toast('Copied!','success'))" style="width:18px; height:18px; margin-left:6px;">
              <i class="fas fa-copy" style="font-size:9px;"></i>
            </button>
          </div>
          <div style="font-size:11px; color:var(--text-2);">${escHtml(ol.does)}</div>
        </div>
      `).join('');
    } else {
      olContainer.parentElement.style.display = 'none';
    }
    
    const ptContainer = $('cs-protips');
    if (res.pro_tips && res.pro_tips.length) {
      ptContainer.parentElement.style.display = 'block';
      ptContainer.innerHTML = res.pro_tips.map(tip => `
        <div class="cs-list-item">${escHtml(tip)}</div>
      `).join('');
    } else {
      ptContainer.parentElement.style.display = 'none';
    }
    
    const mContainer = $('cs-mistakes');
    if (res.common_mistakes && res.common_mistakes.length) {
      mContainer.parentElement.style.display = 'block';
      mContainer.innerHTML = res.common_mistakes.map(m => `
        <div class="cs-list-item">${escHtml(m)}</div>
      `).join('');
    } else {
      mContainer.parentElement.style.display = 'none';
    }
    
    const resContainer = $('cs-resources');
    resContainer.innerHTML = '';
    if (res.free_resources) {
      const fr = res.free_resources;
      let linksHtml = '';
      if (fr.official_docs) {
        linksHtml += `<a href="${escHtml(fr.official_docs)}" target="_blank" class="cs-res-link"><span>📖 Official Docs</span> <i class="fas fa-external-link-alt"></i></a>`;
      }
      if (fr.cheat_sheet_url) {
        linksHtml += `<a href="${escHtml(fr.cheat_sheet_url)}" target="_blank" class="cs-res-link"><span>📄 QuickRef Sheet</span> <i class="fas fa-external-link-alt"></i></a>`;
      }
      if (fr.free_courses && fr.free_courses.length) {
        fr.free_courses.forEach(c => {
          linksHtml += `<a href="${escHtml(c.url)}" target="_blank" class="cs-res-link"><span>🎓 ${escHtml(c.name)} (${escHtml(c.platform)})</span> <i class="fas fa-external-link-alt"></i></a>`;
        });
      }
      resContainer.innerHTML = linksHtml;
    }
    
    toast(`${technology} Cheat Sheet Loaded!`, 'success');
  } catch(e) {
    if (document.getElementById('cs-loading')) document.getElementById('cs-loading').remove();
    $('cs-browse-wrap').style.display = 'block';
    toast('Failed to generate cheat sheet: ' + e.message, 'error');
  }
}

/* ── Free Resources Hub ──────────────────────────────────────── */
async function searchResources(technology) {
  if (!technology) return;
  const dashboard = $('res-dashboard');
  dashboard.style.display = 'none';
  
  const loader = document.createElement('div');
  loader.className = 'empty-state';
  loader.id = 'res-loading';
  loader.innerHTML = `<div class="parse-spinner"></div><p>Searching live resources for <strong>${escHtml(technology)}</strong>...</p>`;
  $('panel-resources').appendChild(loader);
  
  try {
    const res = await api('GET', `/api/free-resources?technology=${encodeURIComponent(technology)}`);
    loader.remove();
    dashboard.style.display = 'flex';
    
    $('res-tech-title').textContent = `${res.technology || technology} Learning Hub`;
    
    const curatedList = $('res-curated-list');
    curatedList.innerHTML = '';
    const cur = res.curated_resources || {};
    let curHtml = '';
    if (cur.official_docs) {
      curHtml += `
        <div class="res-item-box">
          <div class="res-item-title"><a href="${escHtml(cur.official_docs)}" target="_blank">📖 Official Reference Documentation</a> <span class="badge blue">docs</span></div>
          <p class="res-item-desc">Primary technical guide and API reference source.</p>
        </div>
      `;
    }
    if (cur.practice) {
      curHtml += `
        <div class="res-item-box">
          <div class="res-item-title"><a href="${escHtml(cur.practice)}" target="_blank">💻 Practice Coding Challenges</a> <span class="badge green">practice</span></div>
          <p class="res-item-desc">Hands-on exercises and programming problems.</p>
        </div>
      `;
    }
    if (cur.free_courses && cur.free_courses.length) {
      cur.free_courses.forEach(c => {
        curHtml += `
          <div class="res-item-box">
            <div class="res-item-title"><a href="${escHtml(c.url)}" target="_blank">🎓 ${escHtml(c.name)}</a> <span class="badge purple">${escHtml(c.platform)}</span></div>
            <p class="res-item-desc">Comprehensive tutorial course completely free.</p>
          </div>
        `;
      });
    }
    curatedList.innerHTML = curHtml || '<p class="muted">No curated resources found for this topic.</p>';
    
    const platformsList = $('res-platforms-list');
    platformsList.innerHTML = (res.standard_free_platforms || []).map(p => `
      <div class="res-item-box">
        <div class="res-item-title"><a href="${escHtml(p.url)}" target="_blank">${escHtml(p.name)}</a> <span class="badge">${escHtml(p.platform)}</span></div>
      </div>
    `).join('');
    
    const githubList = $('res-github-list');
    githubList.innerHTML = '';
    if (res.github_repos && res.github_repos.length) {
      githubList.innerHTML = res.github_repos.map(repo => `
        <div class="res-item-box">
          <div class="res-item-title">
            <a href="${escHtml(repo.url)}" target="_blank"><i class="fab fa-github"></i> ${escHtml(repo.name)}</a>
            <span class="res-item-badge"><i class="fas fa-star" style="color:var(--c-gold)"></i> ${repo.stars.toLocaleString()}</span>
          </div>
          <p class="res-item-desc">${escHtml(repo.description)}</p>
          ${repo.topics && repo.topics.length ? `
            <div style="margin-top:8px;">
              ${repo.topics.map(t => `<span class="rm-subtopic-tag" style="font-size:9px; padding:1px 4px;">${escHtml(t)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('');
    } else {
      githubList.innerHTML = '<p class="muted">No GitHub repositories found.</p>';
    }
    
    const soList = $('res-stackoverflow-list');
    soList.innerHTML = '';
    if (res.top_stackoverflow_questions && res.top_stackoverflow_questions.length) {
      soList.innerHTML = res.top_stackoverflow_questions.map(q => `
        <div class="res-item-box">
          <div class="res-item-title"><a href="${escHtml(q.url)}" target="_blank">${escHtml(q.title)}</a></div>
          <div class="res-item-meta">
            <span>Votes: <b>${q.votes}</b></span>
            <span>Answers: <b>${q.answers}</b></span>
          </div>
        </div>
      `).join('');
    } else {
      soList.innerHTML = '<p class="muted">No top questions found on StackOverflow.</p>';
    }
    
    toast(`Resources loaded for ${technology}`, 'success');
  } catch(e) {
    if (document.getElementById('res-loading')) document.getElementById('res-loading').remove();
    toast('Resources search failed: ' + e.message, 'error');
  }
}

/* ════════════════════════════════════════════════════════════════
   GITHUB TRENDING PANEL
   ════════════════════════════════════════════════════════════════ */
function initTrendingPanel() {
  const btn = $('trend-load-btn');
  if (!btn || btn.dataset.wired) return;
  btn.dataset.wired = '1';
  btn.addEventListener('click', loadTrending);
  // Pre-fill language from profile
  const lang = S.profile?.skills?.[0]?.toLowerCase();
  if (lang) {
    const sel = $('trend-lang');
    [...sel.options].forEach(o => { if (o.value === lang) sel.value = lang; });
  }
  loadTrending();
}

async function loadTrending() {
  const lang   = $('trend-lang')?.value || 'python';
  const period = $('trend-period')?.value || 'weekly';
  const grid   = $('trend-grid');
  grid.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading ${lang} trending repos…</p></div>`;
  try {
    const res = await api('GET', `/api/github-trending?language=${encodeURIComponent(lang)}&period=${period}`);
    const repos = res.repos || [];
    if (!repos.length) { grid.innerHTML = `<div class="empty-state"><i class="fab fa-github"></i><p>No repos found — try a different language</p></div>`; return; }
    grid.innerHTML = repos.map(r => `
      <a href="${escHtml(r.url)}" target="_blank" class="trend-card">
        <div class="trend-card-top">
          <img class="trend-owner-av" src="${escHtml(r.owner_avatar)}" alt="" onerror="this.style.display='none'">
          <div class="trend-name-wrap">
            <div class="trend-name">${escHtml(r.name)}</div>
            <div class="trend-lang"><span class="lang-dot" style="background:${langColor(r.language)}"></span>${escHtml(r.language||lang)}</div>
          </div>
        </div>
        <p class="trend-desc">${escHtml(r.description?.slice(0,120)||'No description')}</p>
        <div class="trend-stats">
          <span><i class="fas fa-star" style="color:var(--c-gold)"></i> ${r.stars.toLocaleString()}</span>
          <span><i class="fas fa-code-branch" style="color:var(--c-blue-l)"></i> ${r.forks.toLocaleString()}</span>
          ${r.topics.slice(0,3).map(t=>`<span class="skill-chip" style="font-size:10px;padding:2px 6px">${escHtml(t)}</span>`).join('')}
        </div>
      </a>`).join('');
  } catch(e) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>${escHtml(e.message)}</p></div>`;
  }
}

function langColor(lang) {
  const map = {Python:'#3572A5',JavaScript:'#f1e05a',TypeScript:'#3178c6',Go:'#00ADD8',Rust:'#dea584',Java:'#b07219','Jupyter Notebook':'#DA5B0B',Swift:'#F05138',Kotlin:'#A97BFF',Dart:'#00B4AB',Ruby:'#701516',PHP:'#4F5D95',C:'#555555','C++':'#f34b7d','C#':'#178600'};
  return map[lang] || '#7c3aed';
}

/* ════════════════════════════════════════════════════════════════
   STACK OVERFLOW PANEL
   ════════════════════════════════════════════════════════════════ */
function initSOPanel() {
  const btn = $('so-search-btn');
  if (!btn || btn.dataset.wired) return;
  btn.dataset.wired = '1';
  // Pre-fill skill
  const skill = S.profile?.skills?.[0] || 'python';
  $('so-skill').value = skill;
  btn.addEventListener('click', loadSOQuestions);
  loadSOQuestions();
}

async function loadSOQuestions() {
  const skill = ($('so-skill')?.value || 'python').trim();
  const grid = $('so-grid');
  grid.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Searching Stack Overflow for "${escHtml(skill)}"…</p></div>`;
  try {
    const res = await api('GET', `/api/stackoverflow?skill=${encodeURIComponent(skill)}&limit=15`);
    const qs = res.questions || [];
    if (!qs.length) { grid.innerHTML = `<div class="empty-state"><i class="fab fa-stack-overflow"></i><p>No questions found</p></div>`; return; }
    grid.innerHTML = `<div class="so-list">${qs.map(q => `
      <a href="${escHtml(q.url)}" target="_blank" class="so-item">
        <div class="so-votes"><div class="so-vote-num">${q.score}</div><div class="so-vote-lbl">votes</div></div>
        <div class="so-answers ${q.is_answered ? 'answered':''}" title="${q.is_answered?'Answered':'No accepted answer'}">
          <div class="so-ans-num">${q.answers}</div><div class="so-ans-lbl">ans</div>
        </div>
        <div class="so-body">
          <div class="so-title">${escHtml(q.title)}</div>
          <div class="so-tags">${q.tags.map(t=>`<span class="so-tag">${escHtml(t)}</span>`).join('')}</div>
        </div>
        <div class="so-views">${(q.views/1000).toFixed(1)}k views</div>
      </a>`).join('')}</div>
      <div style="margin-top:12px;text-align:center">
        <a href="https://stackoverflow.com/questions/tagged/${encodeURIComponent(skill)}" target="_blank" class="btn-ghost btn-sm"><i class="fab fa-stack-overflow"></i> All Questions on Stack Overflow</a>
      </div>`;
  } catch(e) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>${escHtml(e.message)}</p></div>`;
  }
}

/* ════════════════════════════════════════════════════════════════
   GRAMMAR CHECK
   ════════════════════════════════════════════════════════════════ */
async function grammarCheck(text, outEl) {
  if (!text?.trim()) { toast('No text to check', 'error'); return; }
  outEl.style.display = 'block';
  outEl.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div><p>Checking grammar…</p></div>`;
  try {
    const res = await api('POST', '/api/grammar-check', { text });
    const score = res.score ?? 100;
    const matches = res.matches || [];
    const color = score >= 80 ? 'var(--c-green)' : score >= 60 ? 'var(--c-gold)' : 'var(--c-red)';
    outEl.innerHTML = `
      <div class="grammar-hdr">
        <div><span class="grammar-score" style="color:${color}">${score}</span><span class="grammar-score-lbl">/100 grammar score</span></div>
        <span class="muted">${res.word_count||0} words · ${matches.length} issue${matches.length!==1?'s':''} found</span>
      </div>
      ${matches.length === 0
        ? `<div class="grammar-ok"><i class="fas fa-check-circle" style="color:var(--c-green)"></i> Excellent! No grammar or spelling issues found.</div>`
        : `<div class="grammar-issues">${matches.map(m=>`
          <div class="grammar-issue ${m.type}">
            <div class="gi-badge ${m.type}">${m.rule_category||m.type}</div>
            <div class="gi-msg">${escHtml(m.message)}</div>
            ${m.replacements.length ? `<div class="gi-fix">Fix: ${m.replacements.map(r=>`<span class="gi-suggestion">${escHtml(r)}</span>`).join(' ')}</div>` : ''}
            <div class="gi-ctx muted">"…${escHtml(m.context)}…"</div>
          </div>`).join('')}</div>`
      }`;
  } catch(e) {
    outEl.innerHTML = `<div class="empty-state sm"><i class="fas fa-wifi"></i><p>Grammar check failed: ${escHtml(e.message)}</p></div>`;
  }
}

/* ════════════════════════════════════════════════════════════════
   EXPORT RESUME AS PDF (jsPDF)
   ════════════════════════════════════════════════════════════════ */
async function exportResumePDF() {
  if (!S.profile?.name) { toast('No resume loaded — upload your resume first', 'error'); return; }
  const btn = $('export-resume-btn');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const p = S.profile;
    const W = 210, M = 18;
    let y = 20;

    // Header
    doc.setFillColor(7, 7, 20);
    doc.rect(0, 0, W, 38, 'F');
    doc.setTextColor(238, 238, 248);
    doc.setFontSize(22); doc.setFont('helvetica','bold');
    doc.text(p.name || 'Resume', M, 16);
    doc.setFontSize(11); doc.setFont('helvetica','normal');
    doc.setTextColor(160, 160, 200);
    doc.text((p.target_role||'Software Engineer') + '  ·  ' + (p.experience||'Fresher'), M, 26);
    if (p.email) doc.text(p.email, M, 33);
    y = 48;

    // Skills
    doc.setTextColor(30,30,50);
    doc.setFontSize(12); doc.setFont('helvetica','bold');
    doc.setTextColor(124,58,237); doc.text('SKILLS', M, y); y+=6;
    doc.setDrawColor(124,58,237); doc.setLineWidth(0.4); doc.line(M, y, W-M, y); y+=5;
    doc.setTextColor(60,60,80); doc.setFontSize(10); doc.setFont('helvetica','normal');
    const skills = (p.skills || []).join('  ·  ');
    const skillLines = doc.splitTextToSize(skills, W - M*2);
    doc.text(skillLines, M, y); y += skillLines.length * 5 + 4;

    // Summary
    if (p.summary) {
      doc.setFontSize(12); doc.setFont('helvetica','bold');
      doc.setTextColor(124,58,237); doc.text('SUMMARY', M, y); y+=6;
      doc.setDrawColor(124,58,237); doc.line(M, y, W-M, y); y+=5;
      doc.setTextColor(60,60,80); doc.setFontSize(10); doc.setFont('helvetica','normal');
      const sumLines = doc.splitTextToSize(p.summary.slice(0,400), W - M*2);
      doc.text(sumLines, M, y); y += sumLines.length * 5 + 4;
    }

    // Experience
    if (p.experience) {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFontSize(12); doc.setFont('helvetica','bold');
      doc.setTextColor(124,58,237); doc.text('EXPERIENCE', M, y); y+=6;
      doc.setDrawColor(124,58,237); doc.setLineWidth(0.4); doc.line(M, y, W-M, y); y+=5;
      doc.setTextColor(60,60,80); doc.setFontSize(10); doc.setFont('helvetica','normal');
      const expLines = doc.splitTextToSize(p.experience.slice(0,600), W - M*2);
      doc.text(expLines, M, y); y += expLines.length * 5 + 4;
    }

    // Education
    if (p.education) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(12); doc.setFont('helvetica','bold');
      doc.setTextColor(124,58,237); doc.text('EDUCATION', M, y); y+=6;
      doc.setDrawColor(124,58,237); doc.line(M, y, W-M, y); y+=5;
      doc.setTextColor(60,60,80); doc.setFontSize(10); doc.setFont('helvetica','normal');
      const eduLines = doc.splitTextToSize(p.education, W - M*2);
      doc.text(eduLines, M, y); y += eduLines.length * 5 + 4;
    }

    // Certifications
    if (p.certifications?.length) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(12); doc.setFont('helvetica','bold');
      doc.setTextColor(124,58,237); doc.text('CERTIFICATIONS', M, y); y+=6;
      doc.setDrawColor(124,58,237); doc.line(M, y, W-M, y); y+=5;
      doc.setTextColor(60,60,80); doc.setFontSize(10); doc.setFont('helvetica','normal');
      p.certifications.forEach(c => { doc.text(`• ${c}`, M+2, y); y+=5; });
      y+=4;
    }

    // Contact footer box
    doc.setFillColor(245,245,252);
    doc.rect(M, y, W-M*2, p.phone ? 18 : 12, 'F');
    doc.setFontSize(9); doc.setTextColor(80,80,120); doc.setFont('helvetica','normal');
    const contactParts = [p.email, p.phone, p.linkedin].filter(Boolean);
    doc.text(contactParts.join('   |   '), W/2, y+8, {align:'center'});
    if (p.github) doc.text(`GitHub: ${p.github}`, W/2, y+13, {align:'center'});

    // Footer
    doc.setFontSize(8); doc.setTextColor(160,160,180);
    doc.text('Generated by Comonk AI — comonk.ai — 100% Free Career Platform', M, 285);
    doc.text(new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'}), W-M, 285, {align:'right'});

    doc.save(`${(p.name||'Resume').replace(/\s+/g,'_')}_Comonk.pdf`);
    toast('Resume PDF downloaded!', 'success');
  } catch(e) {
    toast('PDF export failed: ' + e.message, 'error');
  }
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-pdf"></i> Export PDF';
}

/* ════════════════════════════════════════════════════════════════
   EXCHANGE RATES in Salary panel
   ════════════════════════════════════════════════════════════════ */
async function loadExchangeRates(inrAmount) {
  try {
    const res = await api('GET', '/api/exchange-rates');
    const card = $('fx-card');
    if (!card) return;
    card.style.display = 'block';
    const fmt = (rate) => {
      const v = inrAmount * rate;
      return v >= 1000 ? `$${(v/1000).toFixed(1)}K` : `$${v.toFixed(0)}`;
    };
    $('fx-usd').textContent = `${fmt(res.usd)} / yr`;
    $('fx-eur').textContent = `${(inrAmount * res.eur / 1000).toFixed(1)}K EUR / yr`;
    $('fx-gbp').textContent = `£${(inrAmount * res.gbp / 1000).toFixed(1)}K / yr`;
  } catch(e) { /* silent */ }
}

/* ════════════════════════════════════════════════════════════════
   HN JOBS — HackerNews tab in Live Jobs
   ════════════════════════════════════════════════════════════════ */
async function loadHNJobs() {
  const grid = $('jobs-grid');
  const skill = (S.profile?.skills || ['python']).slice(0,2).join(' ');
  grid.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading HackerNews "Who is Hiring"…</p></div>`;
  try {
    const res = await api('GET', `/api/hn-jobs?skill=${encodeURIComponent(skill)}`);
    const jobs = res.jobs || [];
    if (!jobs.length) {
      grid.innerHTML = `<div class="empty-state"><i class="fab fa-hacker-news"></i><p>No HN jobs found — <a href="${escHtml(res.thread_url||'https://news.ycombinator.com')}" target="_blank" class="purple">View thread</a></p></div>`;
      return;
    }
    grid.innerHTML = `
      <div class="hn-jobs-banner"><i class="fab fa-hacker-news"></i> From HN: <b>${escHtml(res.thread_title||'Who is Hiring')}</b> &nbsp;—&nbsp; <a href="${escHtml(res.thread_url||'#')}" target="_blank" class="purple">View full thread ↗</a></div>
      ${jobs.map(j => `
        <div class="hn-job-card">
          <div class="hn-job-company">${escHtml(j.company?.slice(0,80)||'Company')}</div>
          <p class="hn-job-text">${escHtml(j.text?.replace(/<[^>]+>/g,'').slice(0,280)||'')}…</p>
          <div class="hn-job-foot">
            <span class="muted">${j.author} · ${j.posted ? new Date(j.posted).toLocaleDateString('en-IN') : ''}</span>
            <a href="${escHtml(j.url)}" target="_blank" class="btn-xs ghost"><i class="fas fa-external-link-alt"></i> Full Post</a>
          </div>
        </div>`).join('')}`;
  } catch(e) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>${escHtml(e.message)}</p></div>`;
  }
}

async function loadRedditJobs() {
  const grid = $('jobs-grid');
  const skill = (S.profile?.skills || ['python']).slice(0,2).join(' ');
  grid.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading Reddit career posts…</p></div>`;
  try {
    const res = await api('GET', `/api/reddit-feed?skill=${encodeURIComponent(skill)}&subreddit=cscareerquestions`);
    const posts = res.posts || [];
    if (!posts.length) {
      grid.innerHTML = `<div class="empty-state"><i class="fab fa-reddit"></i><p>No posts found</p></div>`;
      return;
    }
    grid.innerHTML = `
      <div class="hn-jobs-banner"><i class="fab fa-reddit" style="color:#ff4500"></i> r/cscareerquestions — "${escHtml(skill)}"</div>
      ${posts.map(p => `
        <div class="hn-job-card">
          <div class="hn-job-company" style="color:var(--c-purple-l)">${escHtml(p.flair||'Post')}</div>
          <div class="hn-job-title">${escHtml(p.title)}</div>
          ${p.self_text ? `<p class="hn-job-text">${escHtml(p.self_text.slice(0,200))}…</p>` : ''}
          <div class="hn-job-foot">
            <span class="muted">↑ ${p.score} · ${p.comments} comments</span>
            <a href="${escHtml(p.url)}" target="_blank" class="btn-xs ghost"><i class="fab fa-reddit"></i> Open</a>
          </div>
        </div>`).join('')}`;
  } catch(e) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>${escHtml(e.message)}</p></div>`;
  }
}

/* ════════════════════════════════════════════════════════════════
   POMODORO TIMER
   ════════════════════════════════════════════════════════════════ */
const POMO = { interval: null, remaining: 25*60, total: 25*60, mode: 'work', sessions: 0, totalMins: 0, running: false };
const POMO_DURATIONS = { work: 25*60, short: 5*60, long: 15*60 };
let pomoDomReady = false;

function initPomodoro() {
  if (pomoDomReady) return;
  pomoDomReady = true;

  $$('.pomo-mode').forEach(btn => btn.addEventListener('click', () => {
    $$('.pomo-mode').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    POMO.mode = btn.dataset.mode;
    pomoStop();
    POMO.remaining = POMO.total = POMO_DURATIONS[POMO.mode];
    updatePomoDisplay();
  }));

  $('pomo-start-btn').addEventListener('click', () => {
    POMO.running ? pomoStop() : pomoStart();
  });
  $('pomo-reset-btn').addEventListener('click', () => {
    pomoStop();
    POMO.remaining = POMO.total = POMO_DURATIONS[POMO.mode];
    updatePomoDisplay();
    $('pomo-label').textContent = 'Ready to focus';
  });
  $('pomo-refresh-quote').addEventListener('click', fetchPomoQuote);
  $('pomo-add-task').addEventListener('click', addPomoTask);
  $('pomo-task-input').addEventListener('keydown', e => { if (e.key === 'Enter') addPomoTask(); });

  fetchPomoQuote();
  updatePomoDisplay();
  loadWakaInPomo();
}

function pomoStart() {
  POMO.running = true;
  $('pomo-start-btn').innerHTML = '<i class="fas fa-pause"></i> Pause';
  $('pomo-label').textContent = POMO.mode === 'work' ? 'Stay focused! You got this.' : 'Rest — you earned it.';
  POMO.interval = setInterval(() => {
    POMO.remaining--;
    if (POMO.remaining <= 0) {
      clearInterval(POMO.interval);
      POMO.running = false;
      pomoComplete();
    }
    updatePomoDisplay();
  }, 1000);
}

function pomoStop() {
  clearInterval(POMO.interval);
  POMO.running = false;
  $('pomo-start-btn').innerHTML = '<i class="fas fa-play"></i> Start';
}

function pomoComplete() {
  if (POMO.mode === 'work') {
    POMO.sessions++;
    POMO.totalMins += 25;
    $('pomo-count').textContent = POMO.sessions;
    $('pomo-total-time').textContent = POMO.totalMins + 'm';
    toast('🎉 Pomodoro complete! Take a 5-min break.', 'success');
  } else {
    toast('Break over — back to work!', 'info');
  }
  $('pomo-start-btn').innerHTML = '<i class="fas fa-play"></i> Start';
  $('pomo-label').textContent = POMO.mode === 'work' ? 'Session complete!' : 'Break done!';
  // Auto-switch mode suggestion
  if (POMO.mode === 'work') {
    $$('.pomo-mode').forEach(b => { if(b.dataset.mode==='short') b.click(); });
  }
}

function updatePomoDisplay() {
  const m = Math.floor(POMO.remaining / 60).toString().padStart(2,'0');
  const s = (POMO.remaining % 60).toString().padStart(2,'0');
  $('pomo-display').textContent = `${m}:${s}`;
  // Update SVG arc
  const arc = $('pomo-arc');
  if (arc) {
    const r = 88, circ = 2 * Math.PI * r;
    const pct = POMO.remaining / POMO.total;
    arc.style.strokeDasharray = `${circ * pct} ${circ * (1-pct)}`;
    arc.style.strokeDashoffset = circ * 0.25;
    const hue = POMO.mode === 'work' ? '#7c3aed' : POMO.mode === 'short' ? '#10b981' : '#3b82f6';
    arc.style.stroke = hue;
  }
  // Update page title
  if (POMO.running) document.title = `⏱ ${m}:${s} — Comonk AI`;
  else document.title = 'Comonk AI — Enterprise Career Intelligence Platform';
}

async function fetchPomoQuote() {
  try {
    const res = await api('GET', '/api/study-quote');
    if (res.text) {
      $('pomo-quote-text').textContent = `"${res.text}"`;
      $('pomo-quote-author').textContent = `— ${res.author}`;
    }
  } catch(e) { /* silent */ }
}

function addPomoTask() {
  const inp = $('pomo-task-input');
  const text = inp.value.trim();
  if (!text) return;
  const list = $('pomo-task-list');
  const id = 'pt_' + Date.now();
  const div = document.createElement('div');
  div.className = 'pomo-task-item';
  div.id = id;
  div.innerHTML = `<input type="checkbox" onchange="this.closest('.pomo-task-item').classList.toggle('done',this.checked)"><span>${escHtml(text)}</span><button class="btn-xs ghost" style="padding:2px 6px;margin-left:auto" onclick="document.getElementById('${id}').remove()"><i class="fas fa-times"></i></button>`;
  list.appendChild(div);
  inp.value = '';
}

async function loadWakaInPomo() {
  try {
    const res = await api('GET', '/api/wakatime-stats');
    if (!res.configured || res.error) return;
    const card = $('pomo-waka-card');
    const out = $('pomo-waka-stats');
    if (!card || !out) return;
    card.style.display = 'block';
    out.innerHTML = `
      <div class="waka-stat"><i class="fas fa-clock" style="color:var(--c-purple-l)"></i> <b>${res.human_readable_total||'—'}</b> this week</div>
      <div class="waka-stat"><i class="fas fa-calendar-day" style="color:var(--c-gold)"></i> Daily avg: <b>${res.daily_average||'—'}</b></div>
      ${res.best_day ? `<div class="waka-stat"><i class="fas fa-trophy" style="color:var(--c-gold)"></i> Best day: <b>${res.best_day}</b></div>` : ''}
      <div class="waka-langs">${(res.languages||[]).slice(0,5).map(l=>`
        <div class="waka-lang-row">
          <span class="waka-lang-name">${escHtml(l.name)}</span>
          <div class="waka-bar-track"><div class="waka-bar-fill" style="width:${l.percent}%;background:${langColor(l.name)}"></div></div>
          <span class="waka-lang-pct">${l.percent.toFixed(0)}%</span>
        </div>`).join('')}
      </div>`;
  } catch(e) { /* silent */ }
}

/* ════════════════════════════════════════════════════════════════
   ALERTS SETUP PANEL
   ════════════════════════════════════════════════════════════════ */
async function initAlertsPanel() {
  if ($('tg-test-btn').dataset.wired) return;
  $('tg-test-btn').dataset.wired = '1';

  // Check Telegram status
  try {
    const tg = await api('GET', '/api/telegram-status');
    const badge = $('tg-status-badge');
    if (tg.configured) {
      badge.textContent = 'Connected ✓';
      badge.style.background = 'rgba(16,185,129,0.15)';
      badge.style.color = 'var(--c-green)';
      $('tg-setup-steps').style.display = 'none';
    }
  } catch(e) { /* silent */ }

  // Telegram test
  $('tg-test-btn').addEventListener('click', async () => {
    const btn = $('tg-test-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    const res = await api('POST', '/api/telegram-alert', { message: `✅ Comonk AI test alert!\n\nYour job alerts are working.\n\nProfile: ${S.profile?.name||'Job Seeker'}\nSkills: ${(S.profile?.skills||[]).slice(0,3).join(', ')}` });
    const out = $('tg-test-result');
    if (res.sent) {
      out.innerHTML = `<div class="alert-success"><i class="fas fa-check-circle"></i> Message sent successfully to Telegram!</div>`;
    } else if (res.missing) {
      out.innerHTML = `<div class="alert-warn"><i class="fas fa-info-circle"></i> Missing: ${res.missing.join(', ')} — add to .env</div>`;
    } else {
      out.innerHTML = `<div class="alert-error"><i class="fas fa-times"></i> ${escHtml(res.error||'Failed')}</div>`;
    }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Test Message';
  });

  // Brevo test
  $('brevo-test-btn').addEventListener('click', async () => {
    const email = $('brevo-test-email').value.trim();
    if (!email) { toast('Enter your email first', 'error'); return; }
    const btn = $('brevo-test-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    const res = await api('POST', '/api/send-email', {
      to_email: email,
      to_name: S.profile?.name || 'Job Seeker',
      subject: 'Comonk AI — Job Alert Test ✓',
      html_content: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#060609;color:#eeeef8;padding:30px;border-radius:12px"><h2 style="color:#a78bfa">🤖 Comonk AI Alert</h2><p>This is a test email from your Comonk AI career platform.</p><p><strong>Profile:</strong> ${S.profile?.name||'Job Seeker'}<br><strong>Skills:</strong> ${(S.profile?.skills||[]).slice(0,5).join(', ')}</p><p style="color:#9090b0;font-size:12px">Email alerts powered by Brevo · 300 free/day</p></div>`,
    });
    const out = $('brevo-test-result');
    if (res.sent) {
      out.innerHTML = `<div class="alert-success"><i class="fas fa-check-circle"></i> Email sent to ${escHtml(email)}!</div>`;
    } else if (res.missing) {
      out.innerHTML = `<div class="alert-warn"><i class="fas fa-info-circle"></i> Add BREVO_API_KEY to .env · Get it free at <a href="https://app.brevo.com" target="_blank">app.brevo.com</a></div>`;
    } else {
      out.innerHTML = `<div class="alert-error"><i class="fas fa-times"></i> ${escHtml(res.error||'Failed')}</div>`;
    }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Test';
  });

  // WakaTime load
  $('waka-load-btn').addEventListener('click', async () => {
    const out = $('waka-stats-out');
    out.style.display = 'block';
    out.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div><p>Loading WakaTime stats…</p></div>`;
    const res = await api('GET', '/api/wakatime-stats');
    if (!res.configured) {
      out.innerHTML = `<div class="alert-warn"><i class="fas fa-info-circle"></i> Add WAKATIME_API_KEY to .env · <a href="https://wakatime.com/settings/api-key" target="_blank">Get free key</a></div>`;
      return;
    }
    if (res.error) { out.innerHTML = `<div class="alert-error">${escHtml(res.error)}</div>`; return; }
    const badge = $('waka-status-badge');
    badge.textContent = 'Connected ✓'; badge.style.background = 'rgba(16,185,129,0.15)'; badge.style.color = 'var(--c-green)';
    out.innerHTML = `
      <div class="waka-stat"><i class="fas fa-clock" style="color:var(--c-purple-l)"></i> <b>${res.human_readable_total||'—'}</b> coded this week</div>
      <div class="waka-stat"><i class="fas fa-sun" style="color:var(--c-gold)"></i> Daily avg: <b>${res.daily_average||'—'}</b></div>
      ${res.best_day ? `<div class="waka-stat"><i class="fas fa-trophy" style="color:var(--c-gold)"></i> Best day: <b>${res.best_day}</b></div>` : ''}
      <div class="waka-langs" style="margin-top:12px">${(res.languages||[]).slice(0,6).map(l=>`
        <div class="waka-lang-row">
          <span class="waka-lang-name">${escHtml(l.name)}</span>
          <div class="waka-bar-track"><div class="waka-bar-fill" style="width:${Math.max(l.percent,2)}%;background:${langColor(l.name)}"></div></div>
          <span class="waka-lang-pct">${l.percent.toFixed(0)}%</span>
        </div>`).join('')}
      </div>`;
  });

  // QR code
  $('qr-gen-btn').addEventListener('click', async () => {
    const data = $('qr-input').value.trim();
    if (!data) { toast('Enter a URL or text first', 'error'); return; }
    const res = await api('GET', `/api/qrcode?data=${encodeURIComponent(data)}&size=240`);
    $('qr-img').src = res.qr_url;
    $('qr-download').href = res.qr_url;
    $('qr-out').style.display = 'block';
    toast('QR code generated!', 'success');
  });

  // Product Hunt
  $('ph-load-btn').addEventListener('click', async () => {
    const btn = $('ph-load-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading…';
    const out = $('ph-out');
    try {
      const res = await api('GET', '/api/product-hunt');
      const products = res.products || [];
      out.innerHTML = products.length ? `<div class="ph-grid">${products.map((p,i)=>`
        <a href="${escHtml(p.url||'https://producthunt.com')}" target="_blank" class="ph-card">
          <div class="ph-rank">${i+1}</div>
          <div class="ph-body"><div class="ph-name">${escHtml(p.name)}</div><div class="ph-desc">${escHtml(p.description?.slice(0,100)||'')}</div></div>
          <span class="btn-xs ghost">View ↗</span>
        </a>`).join('')}</div>` : `<div class="empty-state sm"><p>Could not load Product Hunt feed</p></div>`;
    } catch(e) { out.innerHTML = `<div class="empty-state sm"><p>${escHtml(e.message)}</p></div>`; }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-rocket"></i> Load Today\'s Products';
  });

  // Gemini status check
  try {
    const res = await api('POST', '/api/gemini-chat', { prompt: 'hi' });
    if (!res.missing) {
      const badge = $('gemini-status-badge');
      badge.textContent = 'Connected ✓'; badge.style.background = 'rgba(16,185,129,0.15)'; badge.style.color = 'var(--c-green)';
    }
  } catch(e) { /* silent */ }
}

/* ════════════════════════════════════════════════════════════════
   COMPANY LOGOS — Clearbit (no key)
   ════════════════════════════════════════════════════════════════ */
function getCompanyLogoHTML(company) {
  const domain = company.website?.replace(/https?:\/\//,'').split('/')[0] || '';
  if (!domain) return `<div class="co-logo-placeholder">${escHtml((company.name||'C')[0].toUpperCase())}</div>`;
  return `<img class="co-logo-img" src="https://logo.clearbit.com/${encodeURIComponent(domain)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=co-logo-placeholder>${escHtml((company.name||'C')[0].toUpperCase())}</div>'">`;
}

/* ════════════════════════════════════════════════════════════════
   Wire grammar buttons and export PDF button (called from initApp)
   ════════════════════════════════════════════════════════════════ */
function wireNewFeatureButtons() {
  // Grammar check in ATS
  const atsGrammarBtn = $('grammar-ats-btn');
  if (atsGrammarBtn && !atsGrammarBtn.dataset.wired) {
    atsGrammarBtn.dataset.wired = '1';
    atsGrammarBtn.addEventListener('click', () => {
      const text = $('ats-resume')?.value || '';
      grammarCheck(text, $('grammar-ats-out'));
    });
  }
  // Grammar check in LinkedIn
  const liGrammarBtn = $('grammar-li-btn');
  if (liGrammarBtn && !liGrammarBtn.dataset.wired) {
    liGrammarBtn.dataset.wired = '1';
    liGrammarBtn.addEventListener('click', () => {
      const text = $('li-about')?.value || '';
      grammarCheck(text, $('grammar-li-out'));
    });
  }
  // Export PDF
  const pdfBtn = $('export-resume-btn');
  if (pdfBtn && !pdfBtn.dataset.wired) {
    pdfBtn.dataset.wired = '1';
    pdfBtn.addEventListener('click', exportResumePDF);
  }
  // HN + Reddit job tabs
  $$('[data-src]').forEach(btn => {
    if (!btn.dataset.wiredHn) {
      btn.dataset.wiredHn = '1';
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        if (src === 'hn') loadHNJobs();
        else if (src === 'reddit') loadRedditJobs();
      });
    }
  });
}

/* ════════════════════════════════════════════════════════════════
   Hook exchange rates into salary panel
   ════════════════════════════════════════════════════════════════ */
function hookSalaryFX() {
  const orig = window.getSalary;
  if (!orig || orig._fxHooked) return;
  orig._fxHooked = true;
}

/* ════════════════════════════════════════════════════════════════
   SHOWPANEL — wire new panels
   ════════════════════════════════════════════════════════════════ */
const _origShowPanel = window.showPanel;
function showPanel(id) { /* intentionally empty — handled inline in openPanel */ }

/* ════════════════════════════════════════════════════════════════
   WEATHER WIDGET
   ════════════════════════════════════════════════════════════════ */
async function loadWeatherWidget() {
  try {
    const res = await api('GET', '/api/weather?city=ahmedabad');
    $('wp-emoji').textContent = res.emoji || '☀️';
    $('wp-temp').textContent  = `${res.temp}°C`;
    const card = $('ov-weather-card');
    if (card) {
      card.style.display = 'block';
      $('ov-w-emoji').textContent = res.emoji || '☀️';
      $('ov-w-temp').textContent  = `${res.temp}°C`;
      $('ov-w-desc').textContent  = res.description || '';
      $('ov-w-tip').textContent   = res.productivity_tip || '';
      const fc = $('ov-w-forecast');
      if (fc) fc.innerHTML = (res.forecast||[]).map(d=>`<div class="w-fc-day"><div>${d.emoji}</div><div style="font-size:11px;color:var(--text-3)">${d.date?.slice(5)||''}</div><div style="font-size:12px">${d.max}°/${d.min}°</div></div>`).join('');
    }
    $('weather-pill').style.display = 'flex';
  } catch(e) { /* silent */ }
}

/* ════════════════════════════════════════════════════════════════
   SKILLS RADAR CHART
   ════════════════════════════════════════════════════════════════ */
let radarChartInst = null;
function renderSkillsRadar() {
  const canvas = $('skills-radar');
  if (!canvas || !S.profile?.skills?.length) return;
  const skills = S.profile.skills.slice(0, 7);
  const scores = skills.map(() => 50 + Math.floor(Math.random() * 45));
  if (radarChartInst) radarChartInst.destroy();
  radarChartInst = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: skills,
      datasets: [{ label: 'Skill Level', data: scores, backgroundColor: 'rgba(124,58,237,0.2)', borderColor: '#7c3aed', pointBackgroundColor: '#a78bfa', pointRadius: 4 }],
    },
    options: {
      responsive: true,
      scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.07)' }, pointLabels: { color: '#9090b0', font: { size: 11 } } } },
      plugins: { legend: { display: false } },
    },
  });
}

/* ════════════════════════════════════════════════════════════════
   PROGRESS ANALYTICS CHART
   ════════════════════════════════════════════════════════════════ */
let progressChartInst = null;
function renderProgressChart() {
  const canvas = $('progress-chart');
  if (!canvas) return;
  const apps = JSON.parse(localStorage.getItem('comonk_apps') || '[]');
  const statusColors = { saved:'#7c3aed', applied:'#3b82f6', interview:'#f59e0b', offer:'#10b981', rejected:'#ef4444' };
  const counts = { saved:0, applied:0, interview:0, offer:0, rejected:0 };
  apps.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
  if (progressChartInst) progressChartInst.destroy();
  progressChartInst = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Saved','Applied','Interview','Offer','Rejected'],
      datasets: [{ data: Object.values(counts), backgroundColor: Object.values(statusColors), borderRadius: 6 }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { color:'#9090b0', stepSize:1 }, grid: { color:'rgba(255,255,255,0.05)' } }, x: { ticks: { color:'#9090b0' }, grid: { display:false } } },
    },
  });
  // Interview countdown
  const nextInterview = apps.find(a => a.status === 'interview' && a.date);
  if (nextInterview) {
    const days = Math.ceil((new Date(nextInterview.date) - new Date()) / 86400000);
    if (days >= 0) {
      $('countdown-days').textContent = days === 0 ? 'Today!' : days;
      $('ov-interview-countdown').style.display = 'flex';
    }
  }
}

/* ════════════════════════════════════════════════════════════════
   DARK / LIGHT MODE
   ════════════════════════════════════════════════════════════════ */
let isDark = true;
function closeSidebar() {
  $('sidebar').classList.remove('mobile-open');
  $('sidebar-overlay').classList.remove('visible');
}

function initThemeToggle() {
  const btn = $('theme-toggle');
  if (!btn || btn.dataset.wired) return;
  btn.dataset.wired = '1';
  btn.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('light-mode', !isDark);
    $('theme-icon').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('comonk_theme', isDark ? 'dark' : 'light');
  });
  const saved = localStorage.getItem('comonk_theme');
  if (saved === 'light') { isDark = false; document.body.classList.add('light-mode'); $('theme-icon').className = 'fas fa-sun'; }
}

/* ════════════════════════════════════════════════════════════════
   CODING STATS PANEL
   ════════════════════════════════════════════════════════════════ */
function initCodingStats() {
  const lcBtn = $('lc-btn'), cfBtn = $('cf-btn'), npmBtn = $('npm-btn'), wikiBtn = $('wiki-btn');
  if (!lcBtn || lcBtn.dataset.wired) return;
  lcBtn.dataset.wired = '1';

  lcBtn.addEventListener('click', async () => {
    const u = $('lc-username').value.trim(); if (!u) return;
    const out = $('lc-out');
    out.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div></div>`;
    const res = await api('GET', `/api/leetcode-stats/${encodeURIComponent(u)}`);
    if (!res.found) { out.innerHTML = `<div class="alert-error">${escHtml(res.error||'Not found')}</div>`; return; }
    out.innerHTML = `
      <div class="lc-grid">
        <div class="lc-stat"><div class="lc-num">${res.total_solved}</div><div class="lc-lbl">Solved</div></div>
        <div class="lc-stat"><div class="lc-num" style="color:var(--c-green)">${res.easy_solved}</div><div class="lc-lbl">Easy</div></div>
        <div class="lc-stat"><div class="lc-num" style="color:var(--c-gold)">${res.medium_solved}</div><div class="lc-lbl">Medium</div></div>
        <div class="lc-stat"><div class="lc-num" style="color:var(--c-red)">${res.hard_solved}</div><div class="lc-lbl">Hard</div></div>
      </div>
      <div class="muted" style="font-size:12px;margin-top:8px">Global Rank: <b>#${(res.rank||0).toLocaleString()}</b> · Acceptance: <b>${res.acceptance_rate}%</b></div>
      <a href="${escHtml(res.profile_url)}" target="_blank" class="btn-xs ghost" style="margin-top:8px"><i class="fas fa-external-link-alt"></i> View Profile</a>`;
  });

  cfBtn.addEventListener('click', async () => {
    const h = $('cf-handle').value.trim(); if (!h) return;
    const out = $('cf-out');
    out.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div></div>`;
    const res = await api('GET', `/api/codeforces/${encodeURIComponent(h)}`);
    if (!res.found) { out.innerHTML = `<div class="alert-error">${escHtml(res.error||'Not found')}</div>`; return; }
    const rankColor = { grandmaster:'var(--c-red)', master:'var(--c-red-l)', expert:'var(--c-purple-l)', specialist:'var(--c-blue-l)' };
    const col = rankColor[res.rank] || 'var(--c-green)';
    out.innerHTML = `
      <div class="lc-grid">
        <div class="lc-stat"><div class="lc-num" style="color:${col}">${res.rating}</div><div class="lc-lbl">Rating</div></div>
        <div class="lc-stat"><div class="lc-num">${res.max_rating}</div><div class="lc-lbl">Max Rating</div></div>
      </div>
      <div class="muted" style="font-size:12px;margin-top:8px">Rank: <b style="color:${col}">${res.rank}</b>${res.country ? ` · ${res.country}` : ''}</div>
      <a href="${escHtml(res.profile_url)}" target="_blank" class="btn-xs ghost" style="margin-top:8px"><i class="fas fa-external-link-alt"></i> View Profile</a>`;
  });

  npmBtn.addEventListener('click', async () => {
    const p = $('npm-pkg').value.trim(); if (!p) return;
    const out = $('npm-out');
    out.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div></div>`;
    const res = await api('GET', `/api/npm-stats?pkg=${encodeURIComponent(p)}`);
    if (res.error) { out.innerHTML = `<div class="alert-error">${escHtml(res.error)}</div>`; return; }
    out.innerHTML = `
      <div class="lc-grid">
        <div class="lc-stat"><div class="lc-num">${(res.weekly_downloads/1000).toFixed(0)}K</div><div class="lc-lbl">Weekly DLs</div></div>
        <div class="lc-stat"><div class="lc-num">${(res.monthly_downloads/1000).toFixed(0)}K</div><div class="lc-lbl">Monthly DLs</div></div>
      </div>
      <div class="muted" style="font-size:12px;margin-top:8px">v${res.version} · ${res.license}</div>
      <a href="${escHtml(res.npm_url)}" target="_blank" class="btn-xs ghost" style="margin-top:8px"><i class="fab fa-npm"></i> View on npm</a>`;
  });

  const ghBtn = $('gh-profile-btn');
  if (ghBtn && !ghBtn.dataset.wired) {
    ghBtn.dataset.wired = '1';
    ghBtn.addEventListener('click', async () => {
      const u = $('gh-username').value.trim(); if (!u) return;
      const out = $('gh-profile-out');
      out.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div></div>`;
      const res = await api('GET', `/api/github-profile?username=${encodeURIComponent(u)}`);
      if (!res.found) { out.innerHTML = `<div class="alert-error">${escHtml(res.error||'Not found')}</div>`; return; }
      out.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          ${res.avatar_url?`<img src="${escHtml(res.avatar_url)}" style="width:48px;height:48px;border-radius:50%;border:2px solid var(--b1)">`:'' }
          <div><div style="font-weight:700">${escHtml(res.name||res.login)}</div>
          ${res.bio?`<div class="muted" style="font-size:12px">${escHtml(res.bio)}</div>`:''}
          ${res.location?`<div class="muted" style="font-size:12px"><i class="fas fa-map-marker-alt"></i> ${escHtml(res.location)}</div>`:''}
          </div>
        </div>
        <div class="lc-grid">
          <div class="lc-stat"><div class="lc-num">${res.public_repos}</div><div class="lc-lbl">Repos</div></div>
          <div class="lc-stat"><div class="lc-num">${res.followers}</div><div class="lc-lbl">Followers</div></div>
          <div class="lc-stat"><div class="lc-num">${res.following}</div><div class="lc-lbl">Following</div></div>
        </div>
        ${res.top_repos?.length?`<div style="margin-top:10px"><div class="muted" style="font-size:12px;margin-bottom:6px">TOP REPOS</div>${res.top_repos.map(r=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--b0)">
            <a href="${escHtml(r.url)}" target="_blank" style="color:var(--c-purple-l);font-weight:600;font-size:13px">${escHtml(r.name)}</a>
            <span class="muted" style="font-size:12px">★ ${r.stars} ${r.language?`· ${escHtml(r.language)}`:''}</span>
          </div>`).join('')}</div>`:''}
        <a href="${escHtml(res.profile_url)}" target="_blank" class="btn-xs ghost" style="margin-top:8px"><i class="fab fa-github"></i> View Profile</a>`;
    });
  }

  wikiBtn.addEventListener('click', async () => {
    const q = $('wiki-query').value.trim(); if (!q) return;
    const out = $('wiki-out');
    out.innerHTML = `<div class="empty-state sm"><div class="parse-spinner"></div></div>`;
    const res = await api('GET', `/api/wikipedia-info?query=${encodeURIComponent(q)}`);
    if (res.error) { out.innerHTML = `<div class="alert-error">${escHtml(res.error)}</div>`; return; }
    out.innerHTML = `
      <div style="display:flex;gap:12px;align-items:flex-start">
        ${res.thumbnail ? `<img src="${escHtml(res.thumbnail)}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;flex-shrink:0">` : ''}
        <div><div style="font-weight:700;margin-bottom:4px">${escHtml(res.title||q)}</div>${res.description?`<div class="muted" style="font-size:12px;margin-bottom:6px">${escHtml(res.description)}</div>`:''}
        <p style="font-size:13px;color:var(--text-2);line-height:1.6">${escHtml(res.extract||'')}</p>
        ${res.url?`<a href="${escHtml(res.url)}" target="_blank" class="btn-xs ghost" style="margin-top:8px"><i class="fab fa-wikipedia-w"></i> Read More</a>`:''}
        </div></div>`;
  });
}

/* ════════════════════════════════════════════════════════════════
   FLASHCARDS
   ════════════════════════════════════════════════════════════════ */
const FLASHCARDS = {
  python: [
    {q:"What is a Python decorator?", a:"A function that wraps another function to add behavior without modifying it. Uses @syntax. Example: @staticmethod, @property, custom logging decorators."},
    {q:"Difference: list vs tuple", a:"List is mutable [], tuple is immutable (). Tuples are faster, hashable (can be dict keys). Lists for dynamic data, tuples for fixed records."},
    {q:"What is GIL in Python?", a:"Global Interpreter Lock — allows only one thread to execute Python bytecode at a time. Affects CPU-bound multithreading. Use multiprocessing for parallelism."},
    {q:"Explain list comprehension", a:"[expr for item in iterable if condition] — creates list in one line. Faster than for-loop. Example: [x**2 for x in range(10) if x%2==0]"},
    {q:"What is __init__ vs __new__?", a:"__new__ creates the object (allocates memory). __init__ initializes it (sets attributes). __new__ runs first, __init__ runs after."},
    {q:"What are *args and **kwargs?", a:"*args: variable positional arguments (tuple). **kwargs: variable keyword arguments (dict). Use when number of arguments is unknown."},
  ],
  ml: [
    {q:"Explain bias-variance tradeoff", a:"High bias = underfitting (too simple). High variance = overfitting (too complex). Goal: find balance. Regularization, more data, or cross-validation helps."},
    {q:"What is gradient descent?", a:"Optimization algorithm that minimizes loss by moving in direction of steepest descent. Update: θ = θ - α∇J(θ). α = learning rate."},
    {q:"Precision vs Recall", a:"Precision = TP/(TP+FP) — of predicted positives, how many are correct. Recall = TP/(TP+FN) — of actual positives, how many found. F1 = harmonic mean."},
    {q:"What is overfitting? How to prevent?", a:"Model memorizes training data, fails on new data. Fix: regularization (L1/L2), dropout, more data, cross-validation, early stopping, simpler model."},
    {q:"Explain CNN architecture", a:"Conv layers (feature extraction) → Pooling layers (dimension reduction) → Flatten → Dense layers (classification). Used for images, spatial data."},
    {q:"What is attention mechanism?", a:"Allows model to focus on relevant parts of input. Query, Key, Value matrices. Attention(Q,K,V) = softmax(QKᵀ/√d)V. Foundation of Transformers."},
  ],
  sql: [
    {q:"INNER JOIN vs LEFT JOIN", a:"INNER JOIN: only matching rows from both tables. LEFT JOIN: all rows from left + matching from right (NULL if no match). RIGHT JOIN = mirror."},
    {q:"What is a database index?", a:"Data structure (B-tree) that speeds up SELECT queries. Trade-off: faster reads, slower writes/inserts. Create on frequently queried columns."},
    {q:"Explain GROUP BY + HAVING", a:"GROUP BY aggregates rows by column value. HAVING filters groups (like WHERE but for aggregated data). Example: GROUP BY dept HAVING COUNT(*) > 5"},
    {q:"What is a transaction? ACID?", a:"Group of operations that execute atomically. ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safe), Durability (persists after commit)."},
    {q:"Difference: WHERE vs HAVING", a:"WHERE filters rows BEFORE grouping. HAVING filters groups AFTER GROUP BY. WHERE can't use aggregate functions; HAVING can."},
    {q:"What is normalization?", a:"Organizing DB to reduce redundancy. 1NF: atomic values. 2NF: no partial dependency. 3NF: no transitive dependency. Trades storage for consistency."},
  ],
  'system-design': [
    {q:"How to design a URL shortener?", a:"Hash URL → base62 encode → store in DB (longURL, shortCode). Use Redis cache for reads. Handle collisions. Load balancer + CDN for scale."},
    {q:"SQL vs NoSQL — when to choose?", a:"SQL: structured data, ACID, complex queries (banking, ERP). NoSQL: flexible schema, high scale, simple access (social feed, IoT, sessions)."},
    {q:"What is consistent hashing?", a:"Maps nodes and data to a ring. Adding/removing nodes only affects adjacent data. Used in distributed caches (Redis, Cassandra) to minimize redistribution."},
    {q:"Explain CAP theorem", a:"Distributed system can guarantee only 2 of 3: Consistency, Availability, Partition tolerance. Network partitions always happen → choose CP or AP."},
    {q:"How does a CDN work?", a:"Content cached at edge servers near users. Request routes to nearest PoP. Origin server only hit on cache miss. Reduces latency by 50-90%."},
    {q:"What is rate limiting?", a:"Control request rate to prevent abuse. Algorithms: token bucket, leaky bucket, sliding window. Implement with Redis INCR + TTL. Return 429 Too Many Requests."},
  ],
  git: [
    {q:"git rebase vs git merge", a:"Merge: creates merge commit, preserves history. Rebase: replays commits on top of branch, linear history. Rule: rebase local, merge public branches."},
    {q:"What is git stash?", a:"Temporarily saves uncommitted changes to a stack. git stash push, git stash pop. Useful to switch branches with a clean working tree."},
    {q:"Explain git cherry-pick", a:"Applies a specific commit from another branch onto current branch. git cherry-pick <commit-hash>. Useful for hotfixes without merging entire branch."},
    {q:"git reset vs git revert", a:"reset: moves HEAD back, rewrites history (dangerous on shared branches). revert: creates new commit undoing changes — safe for shared branches."},
  ],
  docker: [
    {q:"Docker image vs container", a:"Image: read-only template with instructions (like a class). Container: running instance of image (like an object). Multiple containers from one image."},
    {q:"What is Docker Compose?", a:"Tool to define and run multi-container apps with YAML. docker-compose up spins everything. Manages networking, volumes, dependencies between services."},
    {q:"Explain Docker layers", a:"Each Dockerfile instruction creates a layer. Layers are cached — unchanged layers reuse cache. Order matters: put frequently changing instructions last."},
    {q:"What is a Docker volume?", a:"Persistent storage that survives container removal. Stored on host, mounted into container. Types: named volumes, bind mounts, tmpfs."},
  ],
  javascript: [
    {q:"== vs === in JavaScript", a:"== coerces types before comparing. === checks value AND type. Always prefer ===. Example: 0 == false (true) but 0 === false (false)."},
    {q:"What is closure?", a:"Function that retains access to its outer scope even after outer function returns. Used for data privacy, factory functions, module pattern."},
    {q:"Explain event loop", a:"JS is single-threaded. Call stack runs sync code. Web APIs handle async. Callback queue waits. Event loop moves callbacks to stack when stack is empty."},
    {q:"Promise vs async/await", a:"Both handle async. async/await is syntactic sugar over Promises. async function returns Promise. await pauses execution until Promise resolves. Cleaner code."},
    {q:"What is the prototype chain?", a:"Objects inherit from other objects via __proto__. Property lookup walks the chain until found or null. Object.create() sets prototype. Basis of JS inheritance."},
  ],
  os: [
    {q:"Process vs Thread", a:"Process: independent program with own memory space. Thread: lightweight unit within process, shares memory. Context switch is cheaper for threads."},
    {q:"What is deadlock?", a:"Two+ processes wait for each other's resources forever. Conditions: mutual exclusion, hold&wait, no preemption, circular wait. Prevention: break any condition."},
    {q:"Explain virtual memory", a:"OS abstraction that gives each process its own address space. Physical RAM + disk swap. Enables more processes than physical RAM. Page tables map virtual→physical."},
    {q:"What is a semaphore?", a:"Synchronization primitive. Binary semaphore = mutex (0 or 1). Counting semaphore tracks resource count. P(wait) decrements, V(signal) increments."},
  ],
  dsa: [
    {q:"Time complexity of binary search?", a:"O(log n). Works on sorted array. Each step halves the search space. Space: O(1) iterative, O(log n) recursive. Key: array must be sorted first."},
    {q:"Explain BFS vs DFS", a:"BFS: queue, level-by-level, shortest path in unweighted graph. DFS: stack/recursion, depth-first, good for cycle detection, topological sort, path existence."},
    {q:"What is dynamic programming?", a:"Optimization: break problem into overlapping subproblems, memoize results. Two approaches: top-down (memoization) and bottom-up (tabulation). Examples: Fibonacci, LCS, Knapsack."},
    {q:"Explain quicksort", a:"Divide & conquer. Pick pivot, partition (smaller left, bigger right), recurse. Average O(n log n), worst O(n²). In-place. Unstable. Fastest in practice for most arrays."},
    {q:"Stack vs Queue", a:"Stack: LIFO — push/pop from same end. Queue: FIFO — enqueue at back, dequeue from front. Stack uses: recursion, undo. Queue uses: BFS, task scheduling."},
    {q:"What is a hash table?", a:"Key-value store with O(1) average lookup, insert, delete. Uses hash function to map key → index. Handles collisions via chaining (linked list) or open addressing."},
    {q:"Explain merge sort", a:"Divide array in half, sort each half, merge. Always O(n log n). Stable sort. Requires O(n) extra space. Best for linked lists and external sorting."},
    {q:"What is a trie?", a:"Tree for string prefix operations. Each node = one character. O(L) insert/search (L=word length). Used for autocomplete, spell check, IP routing. Space-heavy but fast."},
  ],
  react: [
    {q:"Virtual DOM — how does it work?", a:"React keeps lightweight copy of real DOM. On state change, it creates new virtual DOM, diffs with previous (reconciliation), and updates only changed real DOM nodes."},
    {q:"useState vs useReducer", a:"useState: simple state (single value). useReducer: complex state with multiple sub-values or when next state depends on previous. Redux-style pattern: (state, action) => newState."},
    {q:"What is useEffect?", a:"Runs side effects after render. Deps array controls when it re-runs: [] = once, [val] = when val changes, omit = every render. Return cleanup function for subscriptions/timers."},
    {q:"Explain React Context", a:"Avoids prop drilling. Create context → Provider wraps tree with value → useContext(ctx) reads value. Re-renders all consumers when value changes — use memo for optimization."},
    {q:"useMemo vs useCallback", a:"useMemo: memoizes computed value — recomputes only when deps change. useCallback: memoizes function reference — prevents child re-renders when passing callbacks as props."},
    {q:"What is React.memo?", a:"HOC that prevents re-render if props haven't changed. Use for expensive components that receive same props often. Only does shallow comparison — use useMemo for objects."},
    {q:"Controlled vs Uncontrolled components", a:"Controlled: form value in React state (value + onChange). Uncontrolled: DOM manages state, accessed via ref. Controlled = more control + validation. Uncontrolled = simpler for simple cases."},
  ],
  kubernetes: [
    {q:"Pod vs Deployment vs Service", a:"Pod: smallest unit, runs containers. Deployment: manages replica set of pods, handles rolling updates. Service: stable endpoint (IP/DNS) that routes to pods — abstracts pod IP changes."},
    {q:"What is a ConfigMap?", a:"Stores non-sensitive config data as key-value pairs. Mounted as env vars or volume files. Decouples config from container image. Use Secret for sensitive data."},
    {q:"Explain rolling update", a:"Gradually replaces old pods with new ones. Zero downtime. Controlled by maxSurge (extra pods) and maxUnavailable (pods that can go down). Rollback with kubectl rollout undo."},
    {q:"What is a Namespace?", a:"Logical isolation within a cluster. Different teams/environments share the same cluster. Resource quotas per namespace. Default namespaces: default, kube-system, kube-public."},
    {q:"NodePort vs LoadBalancer vs ClusterIP", a:"ClusterIP: internal only (default). NodePort: exposes on each node's IP:port. LoadBalancer: cloud provider creates external LB (AWS ELB etc.). Ingress: L7 routing rules."},
    {q:"What is a PersistentVolume?", a:"Storage resource in cluster. PV = storage pool. PVC = request for storage. Pod mounts PVC. StorageClass = dynamic provisioning. Survives pod restarts/rescheduling."},
  ],
  aws: [
    {q:"EC2 vs Lambda vs ECS", a:"EC2: VMs, full control, always-on. Lambda: serverless, event-driven, pay-per-ms, max 15min. ECS/EKS: containerized workloads. Choose by: invocation pattern + duration + control needs."},
    {q:"S3 storage classes", a:"Standard: frequent access. Intelligent-Tiering: auto moves. Standard-IA: infrequent, cheaper. Glacier: archival, minutes-hours retrieval. Lifecycle policies automate transitions."},
    {q:"What is IAM?", a:"Identity and Access Management. Users, Groups, Roles, Policies. Principle of least privilege. Roles for EC2/Lambda to access other services. MFA for root account. Never use root for daily work."},
    {q:"RDS vs DynamoDB", a:"RDS: managed relational (MySQL, PostgreSQL, Aurora). DynamoDB: serverless NoSQL, single-digit ms, auto-scale, event streams. RDS for complex queries; DynamoDB for high-scale key-value."},
    {q:"What is a VPC?", a:"Virtual Private Cloud — your isolated network in AWS. Subnets (public/private), route tables, IGW (internet gateway), NAT gateway, security groups, NACLs. Peering for VPC-to-VPC."},
    {q:"CloudFront vs S3 hosting", a:"S3 static hosting: simple, regional. CloudFront CDN: global edge locations, HTTPS, caching, WAF, lower latency worldwide. Use both: S3 as origin, CloudFront as CDN in front."},
  ],
};

let fcCards = [], fcIndex = 0, fcFlipped = false;

function initFlashcards() {
  const btn = $('fc-start-btn');
  if (!btn || btn.dataset.wired) return;
  btn.dataset.wired = '1';
  btn.addEventListener('click', startFlashcards);
}

function startFlashcards() {
  const skill = $('fc-skill-sel').value;
  fcCards = FLASHCARDS[skill] || FLASHCARDS.python;
  fcIndex = 0; fcFlipped = false;
  renderFlashcard();
}

function renderFlashcard() {
  const area = $('fc-area');
  if (!fcCards.length) { area.innerHTML = `<div class="empty-state"><p>No cards for this topic</p></div>`; return; }
  const card = fcCards[fcIndex];
  area.innerHTML = `
    <div class="fc-progress-row">
      <span class="muted">${fcIndex+1} / ${fcCards.length}</span>
      <div class="fc-prog-track"><div class="fc-prog-fill" style="width:${((fcIndex+1)/fcCards.length)*100}%"></div></div>
    </div>
    <div class="fc-card-wrap" id="fc-card-wrap" onclick="flipFlashcard()">
      <div class="fc-card ${fcFlipped?'flipped':''}">
        <div class="fc-front"><div class="fc-label">QUESTION</div><div class="fc-text">${escHtml(card.q)}</div><div class="fc-hint muted">Click to reveal answer</div></div>
        <div class="fc-back"><div class="fc-label green">ANSWER</div><div class="fc-text">${escHtml(card.a)}</div></div>
      </div>
    </div>
    <div class="fc-nav">
      <button class="btn-ghost" id="fc-prev" ${fcIndex===0?'disabled':''} onclick="fcNav(-1)"><i class="fas fa-arrow-left"></i> Prev</button>
      <div class="fc-dots">${fcCards.map((_,i)=>`<div class="fc-dot${i===fcIndex?' active':''}"></div>`).join('')}</div>
      <button class="btn-primary" id="fc-next" onclick="fcNav(1)">${fcIndex===fcCards.length-1?'Restart <i class=fas\\ fa-redo></i>':'Next <i class=fas\\ fa-arrow-right></i>'}</button>
    </div>`;
}

function flipFlashcard() {
  fcFlipped = !fcFlipped;
  const card = document.querySelector('#fc-card-wrap .fc-card');
  if (card) card.classList.toggle('flipped', fcFlipped);
}

function fcNav(dir) {
  fcFlipped = false;
  if (dir === 1 && fcIndex >= fcCards.length - 1) { fcIndex = 0; }
  else { fcIndex = Math.max(0, Math.min(fcCards.length-1, fcIndex+dir)); }
  renderFlashcard();
}

/* ════════════════════════════════════════════════════════════════
   NETWORK CONTACT LOG
   ════════════════════════════════════════════════════════════════ */
function initNetworkLog() {
  const addBtn = $('add-contact-btn');
  if (!addBtn || addBtn.dataset.wired) return;
  addBtn.dataset.wired = '1';
  addBtn.addEventListener('click', () => {
    $('network-add-form').style.display = 'block';
    $('nc-name').focus();
  });
  $('nc-cancel-btn').addEventListener('click', () => { $('network-add-form').style.display = 'none'; });
  $('nc-save-btn').addEventListener('click', saveContact);
  renderContacts();
}

function saveContact() {
  const name = $('nc-name').value.trim();
  if (!name) { toast('Enter a name', 'error'); return; }
  const contacts = JSON.parse(localStorage.getItem('comonk_contacts') || '[]');
  contacts.unshift({
    id: Date.now(),
    name, company: $('nc-company').value.trim(),
    role: $('nc-role').value.trim(),
    link: $('nc-link').value.trim(),
    notes: $('nc-notes').value.trim(),
    date: new Date().toISOString().slice(0,10),
  });
  localStorage.setItem('comonk_contacts', JSON.stringify(contacts));
  ['nc-name','nc-company','nc-role','nc-link','nc-notes'].forEach(id => { $(`${id}`).value = ''; });
  $('network-add-form').style.display = 'none';
  renderContacts();
  toast('Contact saved!', 'success');
}

function renderContacts() {
  const contacts = JSON.parse(localStorage.getItem('comonk_contacts') || '[]');
  const grid = $('network-grid');
  if (!grid) return;
  if (!contacts.length) { grid.innerHTML = `<div class="empty-state"><i class="fas fa-user-friends"></i><p>No contacts yet</p></div>`; return; }
  grid.innerHTML = contacts.map(c => `
    <div class="nc-card">
      <div class="nc-av">${escHtml(c.name[0].toUpperCase())}</div>
      <div class="nc-info">
        <div class="nc-name">${escHtml(c.name)}</div>
        <div class="nc-meta">${escHtml(c.role||'')}${c.company?` @ ${escHtml(c.company)}`:''}</div>
        ${c.notes?`<div class="nc-notes muted">${escHtml(c.notes)}</div>`:''}
      </div>
      <div class="nc-actions">
        ${c.link?`<a href="${escHtml(c.link.startsWith('http')?c.link:'https://'+c.link)}" target="_blank" class="btn-xs ghost"><i class="fab fa-linkedin"></i></a>`:''}
        <button class="btn-xs ghost" onclick="deleteContact(${c.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function deleteContact(id) {
  const contacts = JSON.parse(localStorage.getItem('comonk_contacts') || '[]').filter(c => c.id !== id);
  localStorage.setItem('comonk_contacts', JSON.stringify(contacts));
  renderContacts();
}

/* ════════════════════════════════════════════════════════════════
   SKILL DEMAND HEATMAP
   ════════════════════════════════════════════════════════════════ */
function initHeatmap() {
  const btn = $('heatmap-load-btn');
  if (!btn || btn.dataset.wired) return;
  btn.dataset.wired = '1';
  btn.addEventListener('click', loadHeatmap);
  loadHeatmap();
}

async function loadHeatmap() {
  const area = $('heatmap-area');
  area.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Analyzing job listings…</p></div>`;
  try {
    const res = await api('GET', '/api/skill-demand');
    const skills = res.skills || [];
    const max = skills[0]?.count || 1;
    area.innerHTML = `
      <p class="muted" style="margin-bottom:16px">Based on live Adzuna India job listings — top 25 in-demand skills</p>
      <div class="heatmap-grid">${skills.map(s => {
        const pct = Math.round((s.count/max)*100);
        const bg = pct>80?'var(--c-purple)':pct>60?'rgba(124,58,237,0.7)':pct>40?'rgba(124,58,237,0.4)':pct>20?'rgba(124,58,237,0.2)':'rgba(124,58,237,0.08)';
        return `<div class="hm-cell" style="background:${bg}" title="${s.count} jobs mention this skill"><span class="hm-name">${escHtml(s.name)}</span><span class="hm-count">${s.count}</span></div>`;
      }).join('')}</div>
      <div class="hm-legend"><span class="muted" style="font-size:12px">Less demand</span><div class="hm-leg-bar"></div><span class="muted" style="font-size:12px">More demand</span></div>`;
  } catch(e) {
    area.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>${escHtml(e.message)}</p></div>`;
  }
}

/* ════════════════════════════════════════════════════════════════
   GREENHOUSE + INTERNSHALA JOBS
   ════════════════════════════════════════════════════════════════ */
async function loadGreenhouseJobs() {
  const grid = $('jobs-grid');
  const skill = (S.profile?.skills||['python']).slice(0,1).join('');
  grid.innerHTML = `<div class="empty-state"><div class="parse-spinner"></div><p>Loading Greenhouse job boards…</p></div>`;
  // Try a few known companies on Greenhouse
  const companies = ['netflix','stripe','airbnb','shopify','gitlab','hashicorp','mongodb'];
  try {
    const results = await Promise.allSettled(
      companies.map(c => api('GET', `/api/greenhouse-jobs?company=${c}`))
    );
    let allJobs = [];
    results.forEach(r => { if (r.status==='fulfilled' && r.value.jobs?.length) allJobs.push(...r.value.jobs.map(j=>({...j,company:r.value.company}))); });
    if (!allJobs.length) { grid.innerHTML = `<div class="empty-state"><i class="fas fa-briefcase"></i><p>No Greenhouse jobs found right now</p></div>`; return; }
    grid.innerHTML = allJobs.slice(0,20).map(j => `
      <a href="${escHtml(j.url||'#')}" target="_blank" class="job-card" style="text-decoration:none;color:inherit">
        <div class="jc-top"><div class="jc-co">${escHtml(j.company?.toUpperCase()||'')}</div><span class="badge green">Greenhouse</span></div>
        <div class="jc-title">${escHtml(j.title||'')}</div>
        <div class="jc-meta"><i class="fas fa-map-marker-alt"></i> ${escHtml(j.location||'Remote')}</div>
      </a>`).join('');
  } catch(e) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>${escHtml(e.message)}</p></div>`;
  }
}

async function loadIndiaBoardsJobs() {
  const grid = $('jobs-grid');
  const skills = (S.profile?.skills||['python']).slice(0,2).join(',');
  try {
    const res = await api('GET', `/api/internshala?skills=${encodeURIComponent(skills)}`);
    const boards = res.boards || [];
    grid.innerHTML = `
      <div class="india-boards-intro muted" style="margin-bottom:16px"><i class="fas fa-info-circle"></i> Direct links to India's top job boards filtered for your skills</div>
      <div class="india-boards-grid">${boards.map(b=>`
        <a href="${escHtml(b.url)}" target="_blank" class="india-board-card">
          <div class="ib-icon">${b.icon}</div>
          <div class="ib-info"><div class="ib-name">${escHtml(b.name)}</div><div class="ib-type badge ${b.type==='Internship'?'purple':'blue'}">${escHtml(b.type)}</div></div>
          <i class="fas fa-external-link-alt muted"></i>
        </a>`).join('')}
      </div>`;
  } catch(e) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-wifi"></i><p>${escHtml(e.message)}</p></div>`;
  }
}

/* ════════════════════════════════════════════════════════════════
   CSV EXPORT
   ════════════════════════════════════════════════════════════════ */
function exportCSV() {
  const apps = JSON.parse(localStorage.getItem('comonk_apps') || '[]');
  if (!apps.length) { toast('No applications to export', 'error'); return; }
  const headers = ['Company','Role','Status','Date Applied','Notes'];
  const rows = apps.map(a => [a.company||'', a.role||'', a.status||'', a.date||'', (a.notes||'').replace(/,/g,';')]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'comonk_applications.csv';
  link.click(); URL.revokeObjectURL(url);
  toast('CSV exported!', 'success');
}

/* ════════════════════════════════════════════════════════════════
   DICEBEAR AVATAR (auto-set profile avatar from name)
   ════════════════════════════════════════════════════════════════ */
function setDiceBearAvatar(name) {
  const seed = encodeURIComponent(name || 'User');
  const url = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=7c3aed&fontFamily=Arial&fontSize=40&bold=true`;
  const avEls = [$('tb-avatar'), $('su-avatar')];
  avEls.forEach(el => {
    if (!el) return;
    el.style.cssText = 'background:none;padding:0;overflow:hidden;width:32px;height:32px;border-radius:50%';
    el.innerHTML = `<img src="${url}" style="width:100%;height:100%">`;
  });
}

/* ════════════════════════════════════════════════════════════════
   DISCORD TEST + ABSTRACT EMAIL VALIDATION (Alerts Panel)
   ════════════════════════════════════════════════════════════════ */
function wireAlertsExtra() {
  const dc = $('dc-test-btn');
  if (dc && !dc.dataset.wired) {
    dc.dataset.wired = '1';
    dc.addEventListener('click', async () => {
      dc.disabled = true; dc.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      const res = await api('POST', '/api/discord-alert', { message: `✅ Comonk AI test!\n\nProfile: ${S.profile?.name||'Job Seeker'}\nSkills: ${(S.profile?.skills||[]).slice(0,3).join(', ')}` });
      const out = $('dc-test-result');
      if (res.sent) {
        out.innerHTML = `<div class="alert-success"><i class="fas fa-check-circle"></i> Sent to Discord!</div>`;
        const badge = $('dc-status-badge'); if(badge){badge.textContent='Connected ✓';badge.style.background='rgba(16,185,129,0.15)';badge.style.color='var(--c-green)';}
      } else if (res.missing) {
        out.innerHTML = `<div class="alert-warn">Add DISCORD_WEBHOOK_URL to .env</div>`;
      } else {
        out.innerHTML = `<div class="alert-error">${escHtml(res.error||'Failed')}</div>`;
      }
      dc.disabled = false; dc.innerHTML = '<i class="fas fa-paper-plane"></i> Send Test';
    });
  }
  // Notion button in Roadmap panel
  const notionRmBtn = $('notion-roadmap-btn');
  if (notionRmBtn && !notionRmBtn.dataset.wired) {
    notionRmBtn.dataset.wired = '1';
    notionRmBtn.addEventListener('click', async () => {
      notionRmBtn.disabled = true; notionRmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      const content = $('rm-out')?.textContent?.trim() || '';
      if (!content) { toast('Generate a roadmap first', 'error'); notionRmBtn.disabled=false; notionRmBtn.innerHTML='<i class="fas fa-book-open"></i> Export to Notion'; return; }
      const res = await api('POST', '/api/notion-export', { title: `Career Roadmap — ${S.profile?.name||''}`, content, page_type: 'roadmap' });
      if (res.success) toast('Exported to Notion!', 'success');
      else if (res.missing) toast('Add NOTION_TOKEN to .env — notion.so/my-integrations', 'warn');
      else toast(res.error||'Failed', 'error');
      notionRmBtn.disabled=false; notionRmBtn.innerHTML='<i class="fas fa-book-open"></i> Export to Notion';
    });
  }

  const notionBtn = $('notion-export-btn');
  if (notionBtn && !notionBtn.dataset.wired) {
    notionBtn.dataset.wired = '1';
    notionBtn.addEventListener('click', async () => {
      notionBtn.disabled = true; notionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      const roadmapText = $('rm-out')?.textContent || $('ats-result')?.textContent || `Career Roadmap for ${S.profile?.name||'Job Seeker'}\nSkills: ${(S.profile?.skills||[]).join(', ')}\nTarget: ${(S.profile?.target_roles||[]).join(', ')}`;
      const res = await api('POST', '/api/notion-export', { title: `Comonk Roadmap — ${S.profile?.name||''}`, content: roadmapText.slice(0, 3000), page_type: 'roadmap' });
      const out = $('notion-result');
      if (res.success) {
        out.innerHTML = `<div class="alert-success"><i class="fas fa-check-circle"></i> Exported! <a href="${escHtml(res.page_url)}" target="_blank" style="color:inherit;text-decoration:underline">Open in Notion</a></div>`;
      } else if (res.missing) {
        out.innerHTML = `<div class="alert-warn">Add NOTION_TOKEN to .env · <a href="https://www.notion.so/my-integrations" target="_blank">Create integration</a></div>`;
      } else {
        out.innerHTML = `<div class="alert-error">${escHtml(res.error||'Failed')}</div>`;
      }
      notionBtn.disabled = false; notionBtn.innerHTML = '<i class="fas fa-upload"></i> Export Roadmap';
    });
  }

  const resendBtn = $('resend-test-btn');
  if (resendBtn && !resendBtn.dataset.wired) {
    resendBtn.dataset.wired = '1';
    resendBtn.addEventListener('click', async () => {
      resendBtn.disabled = true;
      const res = await api('POST', '/api/resend-email', { to: 'kunalpatel8702@gmail.com', subject: '✅ Comonk AI Test Email', body: `Hi ${S.profile?.name||'there'},\n\nComonk AI job alerts are now connected via Resend!\n\nYour skills: ${(S.profile?.skills||[]).slice(0,5).join(', ')}\n\n— Comonk AI Team` });
      const out = $('resend-result');
      if (res.sent) {
        out.innerHTML = `<div class="alert-success"><i class="fas fa-check-circle"></i> Email sent via Resend!</div>`;
      } else if (res.missing) {
        out.innerHTML = `<div class="alert-warn">Add RESEND_API_KEY to .env · <a href="https://resend.com" target="_blank">Get free</a></div>`;
      } else {
        out.innerHTML = `<div class="alert-error">${escHtml(res.error||'Failed')}</div>`;
      }
      resendBtn.disabled = false;
    });
  }

  const ab = $('abstract-test-btn');
  if (ab && !ab.dataset.wired) {
    ab.dataset.wired = '1';
    ab.addEventListener('click', async () => {
      const email = $('abstract-email-inp')?.value.trim();
      if (!email) return;
      ab.disabled = true;
      const res = await api('GET', `/api/validate-email?email=${encodeURIComponent(email)}`);
      const out = $('abstract-result');
      if (res.missing) {
        out.innerHTML = `<div class="alert-warn">Add ABSTRACT_API_KEY to .env · <a href="https://app.abstractapi.com/api/email-validation" target="_blank">Get free</a></div>`;
      } else if (res.valid === null) {
        out.innerHTML = `<div class="alert-error">${escHtml(res.error||'Error')}</div>`;
      } else {
        const color = res.valid ? 'var(--c-green)' : 'var(--c-red)';
        out.innerHTML = `<div style="color:${color};font-weight:600">${res.valid?'✅ Valid & Deliverable':'❌ Invalid / Undeliverable'}</div>
          <div class="muted" style="font-size:12px;margin-top:4px">Free email: ${res.is_free_email?'Yes':'No'} · Disposable: ${res.is_disposable?'⚠️ Yes':'No'} · Score: ${res.score||'—'}</div>`;
      }
      ab.disabled = false;
    });
  }

  // SMS / WhatsApp Twilio card
  const smsTestBtn = $('sms-test-btn');
  if (smsTestBtn && !smsTestBtn.dataset.wired) {
    smsTestBtn.dataset.wired = '1';
    let smsChannel = 'sms';

    // Channel toggle buttons
    $$('.sms-channel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.sms-channel-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        smsChannel = btn.dataset.ch;
      });
    });

    smsTestBtn.addEventListener('click', async () => {
      const phone = $('sms-phone-inp')?.value.trim();
      if (!phone) { toast('Enter your phone number first', 'warn'); return; }
      smsTestBtn.disabled = true; smsTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      const res = await api('POST', '/api/sms-alert', {
        to: phone,
        channel: smsChannel,
        message: `✅ Comonk AI test ${smsChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}!\n\nYour job alerts are active.\nProfile: ${S.profile?.name || 'Job Seeker'}\nSkills: ${(S.profile?.skills || []).slice(0, 3).join(', ')}`
      });
      const out = $('sms-test-result');
      const badge = $('sms-status-badge');
      if (res.sent) {
        out.innerHTML = `<div class="alert-success"><i class="fas fa-check-circle"></i> ${smsChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'} sent to ${escHtml(phone)}!</div>`;
        if (badge) { badge.textContent = 'Connected ✓'; badge.style.background = 'rgba(16,185,129,0.15)'; badge.style.color = 'var(--c-green)'; }
      } else if (res.not_configured) {
        out.innerHTML = `<div class="alert-warn"><i class="fas fa-exclamation-triangle"></i> Add <code>TWILIO_AUTH_TOKEN</code> + <code>TWILIO_FROM_NUMBER</code> to .env and restart</div>`;
      } else {
        out.innerHTML = `<div class="alert-error"><i class="fas fa-times-circle"></i> ${escHtml(res.error || 'Failed to send')}</div>`;
      }
      smsTestBtn.disabled = false; smsTestBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Test Message';
    });
  }
}

/* Wire everything when initApp runs */
const _origInitApp = window.initApp;

/* Call all new inits after profile loads — hooked via initApp */
function initAllNewFeatures() {
  initThemeToggle();
  loadWeatherWidget();
  renderSkillsRadar();
  renderProgressChart();
  if (S.profile?.name) setDiceBearAvatar(S.profile.name);
  const csvBtn = $('export-csv-btn');
  if (csvBtn && !csvBtn.dataset.wired) { csvBtn.dataset.wired='1'; csvBtn.addEventListener('click', exportCSV); }
  // Auth UI
  updateAuthUI();
  initAuth();
  initGlobalSearch();
  // Extra job src tabs
  $$('[data-src]').forEach(btn => {
    if (!btn.dataset.wiredExtra) {
      btn.dataset.wiredExtra = '1';
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        if (src === 'greenhouse') { $$('.src-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); loadGreenhouseJobs(); }
        if (src === 'internshala') { $$('.src-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); loadIndiaBoardsJobs(); }
      });
    }
  });
}

/* ════════════════════════════════════════════════════════════════
   HERO PARTICLES
   ════════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = $('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.5, dy: (Math.random() - 0.5) * 0.5,
    op: Math.random() * 0.45 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${p.op})`; ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.18 * (1 - dist / 110)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ════════════════════════════════════════════════════════════════
   AI CAREER SCORE
   ════════════════════════════════════════════════════════════════ */
function computeCareerScore() {
  const p = S.profile || {};
  const breakdown = [];

  const skillCount = (p.skills || []).length;
  const profilePts = Math.min(25, (p.name?5:0) + (p.email?4:0) + (skillCount>=3?8:skillCount*2) + (p.experience?4:0) + (p.education?4:0));
  breakdown.push({ label: 'Profile', pts: profilePts, max: 25, color: '#a78bfa' });

  const skillPts = Math.min(25, Math.round(skillCount * 3.2));
  breakdown.push({ label: 'Skills', pts: skillPts, max: 25, color: '#93c5fd' });

  const appPts = Math.min(25, S.apps.length * 5);
  breakdown.push({ label: 'Applications', pts: appPts, max: 25, color: '#6ee7b7' });

  const ivPts = Math.min(25, parseInt(localStorage.getItem('comonk_iv_count') || '0') * 6);
  breakdown.push({ label: 'Interview Prep', pts: ivPts, max: 25, color: '#fcd34d' });

  return { total: Math.min(100, profilePts + skillPts + appPts + ivPts), breakdown };
}

function renderScoreRing() {
  const canvas = $('score-canvas');
  if (!canvas) return;
  const { total, breakdown } = computeCareerScore();
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 64, lw = 11;
  const start = -Math.PI / 2;
  const grade = total >= 80 ? 'Excellent' : total >= 60 ? 'Good' : total >= 40 ? 'Building' : 'Starting';
  const gradeEl = $('score-grade');
  if (gradeEl) { gradeEl.textContent = grade; }

  const grad = ctx.createLinearGradient(0, 0, 160, 160);
  grad.addColorStop(0, '#a78bfa'); grad.addColorStop(1, '#60a5fa');

  let progress = 0;
  const target = total / 100;
  function anim() {
    progress = Math.min(target, progress + target / 45);
    ctx.clearRect(0, 0, 160, 160);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = lw; ctx.stroke();
    if (progress > 0) {
      ctx.beginPath(); ctx.arc(cx, cy, r, start, start + progress * Math.PI * 2);
      ctx.strokeStyle = grad; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
    }
    if (progress < target) requestAnimationFrame(anim);
  }
  anim();

  // Animate score number
  const valEl = $('score-val');
  if (valEl) {
    let cur = 0;
    const step = () => { cur = Math.min(total, cur + Math.ceil(total / 40)); valEl.textContent = cur; if (cur < total) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // Breakdown bars
  const bdEl = $('score-breakdown');
  if (bdEl) {
    bdEl.innerHTML = breakdown.map(b => `
      <div class="score-bd-row">
        <span style="width:90px;font-size:11px;color:var(--text-2)">${b.label}</span>
        <div class="score-bd-bar-wrap"><div class="score-bd-bar" style="width:0%;background:${b.color}" data-pct="${Math.round(b.pts/b.max*100)}"></div></div>
        <span style="font-size:11px;font-weight:700;color:${b.color};width:28px;text-align:right">${b.pts}</span>
      </div>`).join('');
    setTimeout(() => bdEl.querySelectorAll('.score-bd-bar').forEach(bar => { bar.style.width = bar.dataset.pct + '%'; }), 100);
  }
}

/* ════════════════════════════════════════════════════════════════
   DAILY CAREER TIP
   ════════════════════════════════════════════════════════════════ */
function renderDailyTip() {
  const tips = [
    { icon: 'fa-building', text: 'Apply to at least 3 Ahmedabad companies today. Consistency beats perfection — send that application even if the resume isn\'t perfect yet.', panel: 'targets', cta: 'Find Companies' },
    { icon: 'fa-microphone', text: 'Practice one mock interview question out loud. Verbal rehearsal improves real interview performance by up to 40%.', panel: 'mockvoice', cta: 'Start Mock Interview' },
    { icon: 'fa-linkedin', text: 'Update your LinkedIn headline with your top 3 skills and target role. Recruiters spend just 6 seconds on a profile — make every word count.', panel: 'linkedin', cta: 'Optimize LinkedIn' },
    { icon: 'fa-file-alt', text: 'Tailor your resume for the specific job role. ATS systems reject 75% of resumes before a human ever sees them.', panel: 'ats', cta: 'ATS Check' },
    { icon: 'fa-map', text: 'Review your 90-day career roadmap and check off completed milestones. Tracking progress multiplies motivation.', panel: 'roadmap', cta: 'View Roadmap' },
    { icon: 'fa-envelope', text: 'Send one personalized cold email to an HR contact today. Personalized emails get 6× more replies than generic ones.', panel: 'targets', cta: 'Find HR Contacts' },
    { icon: 'fa-code', text: 'Solve one LeetCode problem today. Many Ahmedabad IT companies use coding tests — build the habit now.', panel: 'codingstats', cta: 'Coding Stats' },
    { icon: 'fa-star', text: 'Ask the AI counselor to review your profile and suggest 3 specific improvements. Free, instant, and fully personalized.', panel: 'chat', cta: 'Ask AI Counselor' },
    { icon: 'fa-rupee-sign', text: 'Research salary ranges before your next interview. Knowing the Ahmedabad market rate gives you real negotiation power.', panel: 'salary', cta: 'Salary Intelligence' },
    { icon: 'fa-graduation-cap', text: 'Spend 30 minutes on a skill from your learning hub. Small consistent improvements compound dramatically over weeks.', panel: 'learning', cta: 'Learning Hub' },
    { icon: 'fa-wand-magic-sparkles', text: 'Rewrite your resume bullets with power verbs and quantified results. "Improved performance by 30%" beats "Worked on performance" every time.', panel: 'resumestudio', cta: 'Resume Studio' },
    { icon: 'fa-calendar', text: 'Schedule your next application deadline and interview slot on the calendar so nothing slips through the cracks.', panel: 'calendar', cta: 'Open Calendar' },
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const tip = tips[dayOfYear % tips.length];
  const icon = $('tip-icon'), text = $('tip-text'), action = $('tip-action'), badge = $('tip-date-badge');
  if (icon) icon.className = `fas ${tip.icon}`;
  if (text) text.textContent = tip.text;
  if (badge) badge.textContent = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  if (action) action.innerHTML = `<button class="btn-primary sm" onclick="openPanel('${tip.panel}')"><i class="fas fa-arrow-right"></i> ${tip.cta}</button>`;
}

/* ════════════════════════════════════════════════════════════════
   ACTIVITY HEATMAP
   ════════════════════════════════════════════════════════════════ */
function trackActivity() {
  const today = new Date().toISOString().slice(0, 10);
  const a = JSON.parse(localStorage.getItem('comonk_activity') || '{}');
  a[today] = (a[today] || 0) + 1;
  localStorage.setItem('comonk_activity', JSON.stringify(a));
}

function renderActivityHeatmap() {
  const el = $('activity-heatmap');
  if (!el) return;
  const activity = JSON.parse(localStorage.getItem('comonk_activity') || '{}');
  const cells = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ key, count: activity[key] || 0, label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) });
  }
  const maxC = Math.max(1, ...cells.map(c => c.count));
  const colors = ['var(--bg-3)', 'rgba(124,58,237,0.22)', 'rgba(124,58,237,0.46)', 'rgba(124,58,237,0.72)', 'var(--c-purple)'];
  el.innerHTML = cells.map(c => {
    const lvl = c.count === 0 ? 0 : c.count / maxC < 0.33 ? 1 : c.count / maxC < 0.66 ? 2 : c.count / maxC < 0.9 ? 3 : 4;
    return `<div class="hm-cell" style="background:${colors[lvl]}" title="${c.label}: ${c.count} action${c.count!==1?'s':''}"></div>`;
  }).join('');
  let streak = 0;
  for (let i = cells.length - 1; i >= 0; i--) { if (cells[i].count > 0) streak++; else break; }
  const sEl = $('heatmap-streak');
  if (sEl) sEl.textContent = streak > 1 ? `🔥 ${streak}-day streak` : streak === 1 ? '🔥 1-day streak — keep going!' : 'Start your streak today!';
}

/* ════════════════════════════════════════════════════════════════
   ACHIEVEMENT BADGES
   ════════════════════════════════════════════════════════════════ */
const ACHIEVEMENTS = [
  { id: 'first_load',      icon: 'fa-rocket',      label: 'Launch Ready', desc: 'Opened Comonk AI',                    color: '#a78bfa', check: () => true },
  { id: 'profile_done',    icon: 'fa-user-check',   label: 'Profile Pro',  desc: 'Uploaded your resume',               color: '#93c5fd', check: () => !!(S.profile?.skills?.length) },
  { id: 'first_match',     icon: 'fa-building',     label: 'Scout',        desc: 'Matched with companies',             color: '#6ee7b7', check: () => S.companies.length > 0 },
  { id: 'first_app',       icon: 'fa-paper-plane',  label: 'Applicant',    desc: 'Tracked first application',         color: '#fcd34d', check: () => S.apps.length >= 1 },
  { id: 'five_apps',       icon: 'fa-medal',        label: 'Hustler',      desc: '5+ applications tracked',           color: '#fb923c', check: () => S.apps.length >= 5 },
  { id: 'first_interview', icon: 'fa-microphone',   label: 'Interviewer',  desc: 'Practiced mock interview',           color: '#f87171', check: () => parseInt(localStorage.getItem('comonk_iv_count') || '0') >= 1 },
  { id: 'verified',        icon: 'fa-shield-alt',   label: 'Verified',     desc: 'Passed aptitude test',               color: '#34d399', check: () => !!(Auth.user?.is_verified) },
  { id: 'score_70',        icon: 'fa-trophy',       label: 'High Scorer',  desc: 'Career score reached 70+',          color: '#fbbf24', check: () => computeCareerScore().total >= 70 },
];

function renderAchievements() {
  const el = $('ach-grid');
  if (!el) return;
  const unlocked = JSON.parse(localStorage.getItem('comonk_ach') || '[]');
  const newUnlocks = [];
  ACHIEVEMENTS.forEach(a => { if (!unlocked.includes(a.id) && a.check()) { unlocked.push(a.id); newUnlocks.push(a); } });
  if (newUnlocks.length) {
    localStorage.setItem('comonk_ach', JSON.stringify(unlocked));
    newUnlocks.forEach((a, i) => setTimeout(() => toast(`🏆 Achievement: ${a.label}!`, 'success', 4000), i * 600));
  }
  const badge = $('ach-count-badge');
  if (badge) badge.textContent = `${unlocked.length}/8`;
  el.innerHTML = ACHIEVEMENTS.map(a => {
    const earned = unlocked.includes(a.id);
    return `<div class="ach-badge ${earned ? 'earned' : 'locked'}" title="${a.label}: ${a.desc}">
      <div class="ach-icon" style="${earned ? `color:${a.color};background:${a.color}22` : ''}"><i class="fas ${a.icon}"></i></div>
      <div class="ach-label">${a.label}</div>
    </div>`;
  }).join('');
}

/* ════════════════════════════════════════════════════════════════
   GLOBAL SEARCH  (Cmd+K)
   ════════════════════════════════════════════════════════════════ */
const SEARCH_INDEX = [
  { label: 'Overview Dashboard',        panel: 'overview',     icon: 'fa-th-large',          desc: 'Career score, achievements, heatmap' },
  { label: 'AI Career Counselor',        panel: 'chat',         icon: 'fa-comments',           desc: 'LangGraph multi-agent chat' },
  { label: 'Company Targets',           panel: 'targets',      icon: 'fa-building',           desc: '541 Gujarat IT/AI companies' },
  { label: 'Live Jobs',                  panel: 'livejobs',     icon: 'fa-briefcase',          desc: 'RemoteOK, Adzuna, HN Hiring' },
  { label: 'Application Tracker',        panel: 'tracker',      icon: 'fa-columns',            desc: 'Kanban pipeline for applications' },
  { label: 'AI Mock Interview (Voice)',  panel: 'mockvoice',    icon: 'fa-headset',            desc: 'Voice-powered interview simulation' },
  { label: 'Resume Studio',             panel: 'resumestudio', icon: 'fa-wand-magic-sparkles', desc: 'AI resume rewriter + cover letter' },
  { label: 'Calendar & Scheduler',      panel: 'calendar',     icon: 'fa-calendar-days',      desc: 'Interview dates and deadlines' },
  { label: 'ATS Optimizer',             panel: 'ats',          icon: 'fa-chart-bar',          desc: 'Score and optimize resume' },
  { label: 'LinkedIn Optimizer',        panel: 'linkedin',     icon: 'fa-linkedin',           desc: 'Rewrite LinkedIn profile' },
  { label: 'Salary Intelligence',       panel: 'salary',       icon: 'fa-rupee-sign',         desc: 'Ahmedabad market salary data' },
  { label: 'Career Roadmap',            panel: 'roadmap',      icon: 'fa-map',                desc: '90-day AI-generated plan' },
  { label: 'Learning Hub',              panel: 'learning',     icon: 'fa-graduation-cap',     desc: 'Articles, videos, cheatsheets' },
  { label: 'Interview Q&A',             panel: 'interview',    icon: 'fa-microphone',         desc: 'AI questions + STAR templates' },
  { label: 'Job Alerts Setup',          panel: 'alerts',       icon: 'fa-bell',               desc: 'Telegram, SMS, WhatsApp, Discord' },
  { label: 'Flashcards',                panel: 'flashcards',   icon: 'fa-layer-group',        desc: 'Python, ML, SQL, System Design…' },
  { label: 'Network Log',               panel: 'network',      icon: 'fa-user-friends',       desc: 'LinkedIn connection tracker' },
  { label: 'Skill Heatmap',             panel: 'heatmap',      icon: 'fa-th',                 desc: 'Live demand visualization' },
  { label: 'Focus Timer',               panel: 'pomodoro',     icon: 'fa-clock',              desc: 'Pomodoro with WakaTime' },
  { label: 'GitHub Trending',           panel: 'trending',     icon: 'fa-fire',               desc: 'Trending repositories' },
  { label: 'Stack Overflow',            panel: 'stackoverflow', icon: 'fa-stack-overflow',    desc: 'Top questions by skill' },
  { label: 'Coding Stats',              panel: 'codingstats',  icon: 'fa-code',               desc: 'LeetCode, Codeforces, npm' },
  { label: 'Cheat Sheets',              panel: 'cheatsheets',  icon: 'fa-file-code',          desc: 'Quick reference cards' },
  { label: 'Resources Hub',             panel: 'resources',    icon: 'fa-cubes',              desc: 'Curated learning resources' },
];

let _gsActive = false, _gsIdx = -1;

function initGlobalSearch() {
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); _gsActive ? closeGSearch() : openGSearch(); }
    if (!_gsActive) return;
    if (e.key === 'Escape') closeGSearch();
    if (e.key === 'ArrowDown') { e.preventDefault(); _gsMoveIdx(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); _gsMoveIdx(-1); }
    if (e.key === 'Enter') { e.preventDefault(); _gsSelect(); }
  });
  const overlay = $('gsearch');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeGSearch(); });
  const inp = $('gsearch-input');
  if (inp) inp.addEventListener('input', e => _gsRender(e.target.value));
}

function openGSearch() {
  _gsActive = true;
  const el = $('gsearch'); if (!el) return;
  el.classList.add('open');
  const inp = $('gsearch-input'); if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 50); }
  _gsRender('');
}

function closeGSearch() {
  _gsActive = false;
  $('gsearch')?.classList.remove('open');
}

function _gsRender(q) {
  const query = q.toLowerCase().trim();
  const results = query
    ? SEARCH_INDEX.filter(r => r.label.toLowerCase().includes(query) || r.desc.toLowerCase().includes(query))
    : SEARCH_INDEX.slice(0, 9);
  _gsIdx = -1;
  const el = $('gsearch-results'); if (!el) return;
  el.innerHTML = results.length
    ? results.map(r => `<div class="gsr-item" data-panel="${r.panel}" onclick="selectGSearchItem('${r.panel}')">
        <div class="gsr-ic"><i class="fas ${r.icon}"></i></div>
        <div class="gsr-text"><div class="gsr-label">${escHtml(r.label)}</div><div class="gsr-desc">${escHtml(r.desc)}</div></div>
        <div class="gsr-arrow"><i class="fas fa-arrow-right"></i></div>
      </div>`).join('')
    : `<div class="gsr-empty"><i class="fas fa-search"></i> No results for "${escHtml(q)}"</div>`;
}

function _gsMoveIdx(dir) {
  const items = $$('.gsr-item'); if (!items.length) return;
  items[_gsIdx]?.classList.remove('active');
  _gsIdx = Math.max(0, Math.min(items.length - 1, _gsIdx + dir));
  items[_gsIdx]?.classList.add('active');
  items[_gsIdx]?.scrollIntoView({ block: 'nearest' });
}

function _gsSelect() {
  const active = $$('.gsr-item')[_gsIdx];
  if (active) selectGSearchItem(active.dataset.panel);
}

function selectGSearchItem(panel) {
  closeGSearch();
  openPanel(panel);
}

/* AUTH SYSTEM */
const Auth = {
  token: localStorage.getItem('comonk_token') || '',
  user: JSON.parse(localStorage.getItem('comonk_user') || 'null'),
  save(token, user) { this.token=token; this.user=user; localStorage.setItem('comonk_token',token); localStorage.setItem('comonk_user',JSON.stringify(user)); },
  clear() { this.token=''; this.user=null; localStorage.removeItem('comonk_token'); localStorage.removeItem('comonk_user'); },
  headers() { return {'Authorization':`Bearer ${this.token}`,'Content-Type':'application/json'}; },
  isLoggedIn() { return !!this.token && !!this.user; },
};

async function authApi(method, path, body) {
  const opts = {method, headers: Auth.headers()};
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(API+path, opts);
  return r.json();
}

function openAuthModal() { const m=$('auth-modal'); m.style.display='flex'; switchAuthTab('login'); }
function closeAuthModal() { $('auth-modal').style.display='none'; }
function switchAuthTab(tab) {
  $('auth-login-form').style.display = tab==='login'?'block':'none';
  $('auth-register-form').style.display = tab==='register'?'block':'none';
  $('auth-otp-form').style.display = 'none';
  $('tab-login').classList.toggle('active', tab==='login');
  $('tab-register').classList.toggle('active', tab==='register');
}

function initAuth() {
  const lb=$('login-btn'); if(!lb||lb.dataset.wired) return; lb.dataset.wired='1';
  lb.addEventListener('click', async()=>{
    const email=$('login-email').value.trim(), pw=$('login-password').value;
    if(!email||!pw){$('login-err').innerHTML='<div class="alert-error">Fill all fields</div>';return;}
    lb.disabled=true; lb.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
    const res=await authApi('POST','/api/auth/login',{email,password:pw});
    if(res.success){Auth.save(res.token,res);closeAuthModal();updateAuthUI();toast('Welcome back, '+res.name+'!','success');afterLogin(res);}
    else if(res.need_verify){$('auth-otp-form').style.display='block';$('auth-login-form').style.display='none';localStorage.setItem('comonk_pending_email',email);$('login-err').innerHTML='<div class="alert-warn">'+escHtml(res.error)+'</div>';}
    else{$('login-err').innerHTML='<div class="alert-error">'+escHtml(res.error)+'</div>';}
    lb.disabled=false; lb.innerHTML='<i class="fas fa-sign-in-alt"></i> Login';
  });
  $('register-btn').addEventListener('click', async()=>{
    const name=$('reg-name').value.trim(),email=$('reg-email').value.trim(),pw=$('reg-password').value,phone=$('reg-phone').value.trim(),role=$('reg-role').value,city=$('reg-city').value.trim()||'Ahmedabad';
    if(!name||!email||!pw){$('reg-err').innerHTML='<div class="alert-error">Fill required fields</div>';return;}
    const rb=$('register-btn'); rb.disabled=true; rb.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
    const res=await authApi('POST','/api/auth/register',{name,email,password:pw,phone,target_role:role,city});
    if(res.success){localStorage.setItem('comonk_pending_email',email);$('auth-register-form').style.display='none';$('auth-otp-form').style.display='block';if(res.dev_otp)$('otp-err').innerHTML='<div class="alert-warn" style="font-size:12px">Dev OTP: <b>'+res.dev_otp+'</b></div>';}
    else{$('reg-err').innerHTML='<div class="alert-error">'+escHtml(res.error)+'</div>';}
    rb.disabled=false; rb.innerHTML='<i class="fas fa-user-plus"></i> Create Account';
  });
  $('otp-btn').addEventListener('click', async()=>{
    const email=localStorage.getItem('comonk_pending_email')||'', otp=$('otp-inp').value.trim(); if(!otp)return;
    const ob=$('otp-btn'); ob.disabled=true;
    const res=await authApi('POST','/api/auth/verify-otp',{email,otp});
    if(res.success){Auth.save(res.token,res);closeAuthModal();updateAuthUI();toast('Welcome, '+res.name+'!','success');afterLogin(res);}
    else{$('otp-err').innerHTML='<div class="alert-error">'+escHtml(res.error)+'</div>';}
    ob.disabled=false;
  });
}

function updateAuthUI() {
  const u=Auth.user;
  const btn=$('tb-login-btn'); if(btn) btn.style.display=u?'none':'flex';
  if(!u)return;
  const chip=$('tb-verified-chip'); if(u.is_verified&&chip) chip.style.display='inline';
  const badge=$('sb-verified-badge'); if(u.is_verified&&badge) badge.style.display='inline';
  if(u.email==='kunalpatel8702@gmail.com'||u.email==='ai@capermint.com'){const ab=$('sb-admin-btn');if(ab)ab.style.display='flex';}
}

/* ANTI-CHEAT ENGINE */
const AntiCheat={
  strikes:0,active:false,maxStrikes:3,onStrike:null,_bound:{},_devInterval:null,
  start(onStrike){
    this.strikes=0;this.active=true;this.onStrike=onStrike;
    this._bound.vis=()=>{if(document.hidden)this._strike('Tab switch');};
    this._bound.blur=()=>this._strike('Window focus lost');
    this._bound.ctx=e=>e.preventDefault();
    this._bound.key=e=>{if((e.ctrlKey&&'cvausp'.includes(e.key.toLowerCase()))||e.key==='F12'||(e.ctrlKey&&e.shiftKey&&'ij'.includes(e.key.toLowerCase()))){e.preventDefault();e.stopPropagation();}};
    this._bound.fs=()=>{if(!document.fullscreenElement&&this.active)this._strike('Fullscreen exited');};
    document.addEventListener('visibilitychange',this._bound.vis);
    window.addEventListener('blur',this._bound.blur);
    document.addEventListener('contextmenu',this._bound.ctx);
    document.addEventListener('keydown',this._bound.key);
    document.addEventListener('fullscreenchange',this._bound.fs);
    document.addEventListener('copy',e=>{if(this.active)e.preventDefault();});
    document.addEventListener('paste',e=>{if(this.active)e.preventDefault();});
    this._devInterval=setInterval(()=>{if(!this.active)return;if(window.outerWidth-window.innerWidth>200||window.outerHeight-window.innerHeight>200)this._strike('DevTools');},2000);
    try{document.documentElement.requestFullscreen();}catch(e){}
  },
  stop(){
    this.active=false;
    document.removeEventListener('visibilitychange',this._bound.vis);
    window.removeEventListener('blur',this._bound.blur);
    document.removeEventListener('contextmenu',this._bound.ctx);
    document.removeEventListener('keydown',this._bound.key);
    document.removeEventListener('fullscreenchange',this._bound.fs);
    clearInterval(this._devInterval);
    try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}
  },
  _strike(reason){if(!this.active)return;this.strikes++;if(this.onStrike)this.onStrike(this.strikes,reason);if(this.strikes>=this.maxStrikes)this.active=false;}
};

/* TEST PANEL */
let testState={questions:[],current:0,answers:{},answerKey:{},startTime:0,qTimer:null};

function initTestPanel(){
  const area=$('test-area'); if(!area)return;
  if(!Auth.isLoggedIn()){
    area.innerHTML='<div class="empty-state" style="padding:60px"><i class="fas fa-lock" style="font-size:48px;color:var(--c-purple)"></i><p style="margin-top:16px;font-size:16px">Login to take the aptitude test</p><button class="btn-primary" style="margin-top:16px" onclick="openAuthModal()"><i class="fas fa-sign-in-alt"></i> Login / Register</button></div>';
    return;
  }
  if(Auth.user?.is_verified){
    area.innerHTML='<div class="empty-state" style="padding:60px"><i class="fas fa-check-circle" style="font-size:64px;color:var(--c-green)"></i><h3 style="margin-top:16px">You are Comonk Verified!</h3><p class="muted">HR contacts unlocked · 5 free/month</p><button class="btn-primary" style="margin-top:16px" onclick="openPanel(\'targets\')"><i class="fas fa-building"></i> View Companies</button></div>';
    return;
  }
  area.innerHTML=`<div class="test-intro card" style="max-width:640px;margin:0 auto">
    <div style="text-align:center;padding:20px 0"><div style="font-size:56px">🎓</div><h2 style="margin-top:12px">Comonk Verified Aptitude Test</h2><p class="muted" style="margin-top:8px;line-height:1.7">20 hard questions · 45 seconds each · 70% (14/20) to pass</p></div>
    <div class="test-rules">
      <div class="rule-item"><i class="fas fa-eye-slash" style="color:var(--c-red)"></i> Tab switching = Strike (3 strikes = auto fail)</div>
      <div class="rule-item"><i class="fas fa-ban" style="color:var(--c-red)"></i> Copy/paste, right-click, DevTools blocked</div>
      <div class="rule-item"><i class="fas fa-expand" style="color:var(--c-gold)"></i> Fullscreen required throughout test</div>
      <div class="rule-item"><i class="fas fa-clock" style="color:var(--c-blue-l)"></i> 45 seconds per question — auto-advances</div>
      <div class="rule-item"><i class="fas fa-redo" style="color:var(--c-purple-l)"></i> Failed? Retry after 24 hours</div>
    </div>
    <button class="btn-primary" style="width:100%;margin-top:20px;padding:14px;font-size:16px" id="start-test-btn"><i class="fas fa-play"></i> Start Test — Enter Fullscreen</button>
  </div>`;
  $('start-test-btn').addEventListener('click',startTest);
}

async function startTest(){
  const area=$('test-area');
  area.innerHTML='<div class="empty-state"><div class="parse-spinner"></div><p>Loading questions…</p></div>';
  const res=await authApi('GET','/api/test/questions');
  if(res.cooldown){area.innerHTML=`<div class="empty-state"><i class="fas fa-clock" style="font-size:48px;color:var(--c-gold)"></i><h3>Cooldown Active</h3><p class="muted">${escHtml(res.message)}</p></div>`;return;}
  if(res.already_verified){initTestPanel();return;}
  if(!res.questions?.length){area.innerHTML=`<div class="alert-error">${escHtml(res.message||'Failed to load')}</div>`;return;}
  testState={questions:res.questions,current:0,answers:{},answerKey:res.answer_key,startTime:Date.now(),qTimer:null};
  AntiCheat.start((strikes,reason)=>{showStrikeWarning(strikes,reason);if(strikes>=3)autoFailTest();});
  renderQuestion();
}

function renderQuestion(){
  const {questions,current}=testState;
  if(current>=questions.length){submitTest();return;}
  const q=questions[current];
  const pct=((current)/questions.length)*100;
  $('test-area').innerHTML=`<div class="test-wrap">
    <div class="test-hdr">
      <div class="test-meta"><span class="muted">Q${current+1}/${questions.length}</span><span class="badge" id="strike-badge" style="background:rgba(239,68,68,0.15);color:var(--c-red)">Strikes: ${AntiCheat.strikes}/3</span></div>
      <div class="test-prog-track"><div class="test-prog-fill" style="width:${pct}%"></div></div>
      <div class="test-timer" id="q-timer">45</div>
    </div>
    <div class="test-question-card card">
      <pre class="test-q-text">${escHtml(q.q)}</pre>
      <div class="test-opts">${q.opts.map((o,i)=>`<button class="test-opt" data-i="${i}" onclick="selectOpt(${i})">${String.fromCharCode(65+i)}. ${escHtml(o)}</button>`).join('')}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:20px">
        <button class="btn-primary" id="next-btn" disabled onclick="nextQuestion()">Next <i class="fas fa-arrow-right"></i></button>
      </div>
    </div>
  </div>`;
  startQTimer(45);
}

function startQTimer(secs){
  clearInterval(testState.qTimer); let left=secs;
  const el=$('q-timer');
  testState.qTimer=setInterval(()=>{left--;if(el){el.textContent=left;el.style.color=left<=10?'var(--c-red)':'';}if(left<=0){clearInterval(testState.qTimer);nextQuestion();}},1000);
}

function selectOpt(i){
  const q=testState.questions[testState.current]; testState.answers[q.id]=i;
  $$('.test-opt').forEach((b,idx)=>{b.classList.toggle('selected',idx===i);b.disabled=true;});
  const nb=$('next-btn'); if(nb)nb.disabled=false;
}
function nextQuestion(){clearInterval(testState.qTimer);testState.current++;renderQuestion();}

function showStrikeWarning(strikes,reason){
  const b=$('strike-badge'); if(b)b.textContent=`Strikes: ${strikes}/3`;
  toast(`Strike ${strikes}/3: ${reason}`,'error');
}
function autoFailTest(){
  clearInterval(testState.qTimer); AntiCheat.stop();
  $('test-area').innerHTML='<div class="empty-state"><i class="fas fa-ban" style="font-size:64px;color:var(--c-red)"></i><h3 style="color:var(--c-red)">Auto-Failed</h3><p class="muted">3 violations detected. Retry after 24 hours.</p></div>';
  authApi('POST','/api/test/submit',{answers:testState.answers,answer_key:testState.answerKey,tab_switches:AntiCheat.strikes,time_taken:Math.floor((Date.now()-testState.startTime)/1000)});
}

async function submitTest(){
  AntiCheat.stop();
  const timeTaken=Math.floor((Date.now()-testState.startTime)/1000);
  $('test-area').innerHTML='<div class="empty-state"><div class="parse-spinner"></div><p>Evaluating…</p></div>';
  const res=await authApi('POST','/api/test/submit',{answers:testState.answers,answer_key:testState.answerKey,tab_switches:AntiCheat.strikes,time_taken:timeTaken});
  const pct=Math.round((res.score/res.total)*100);
  const color=res.passed?'var(--c-green)':'var(--c-red)';
  $('test-area').innerHTML=`<div class="test-result card" style="max-width:480px;margin:40px auto;text-align:center">
    <div style="font-size:64px">${res.passed?'🎉':'😔'}</div>
    <h2 style="margin-top:12px;color:${color}">${res.passed?'Congratulations! Verified!':'Not Passed'}</h2>
    <div style="font-size:48px;font-weight:800;color:${color};margin:16px 0">${res.score}/${res.total}</div>
    <div class="muted">${pct}% · Need 70%</div>
    ${res.suspicious?'<div class="alert-warn" style="margin-top:16px">Suspicious activity flagged for admin review.</div>':''}
    <p class="muted" style="margin-top:12px">${escHtml(res.message)}</p>
    ${res.passed?'<button class="btn-primary" style="margin-top:20px;width:100%" onclick="initTestPanel()"><i class="fas fa-check-circle"></i> Done</button>':'<button class="btn-ghost" style="margin-top:16px;width:100%" onclick="initTestPanel()"><i class="fas fa-arrow-left"></i> Back</button>'}
  </div>`;
  if(res.passed&&Auth.user){Auth.user.is_verified=1;Auth.save(Auth.token,Auth.user);updateAuthUI();}
}

/* ADMIN PANEL */
const adminPW=()=>sessionStorage.getItem('comonk_admin_pw')||'';

function initAdminPanel(){
  const dash=$('admin-dashboard'),wall=$('admin-login-wall');
  if(!dash||!wall)return;
  if(sessionStorage.getItem('comonk_admin_ok')==='1'){wall.style.display='none';dash.style.display='block';loadAdminStats();loadAdminRequests();}
  const alb=$('admin-login-btn'); if(alb&&!alb.dataset.wired){alb.dataset.wired='1';
    alb.addEventListener('click',async()=>{
      const pw=$('admin-pw-inp').value;
      const r=await fetch(API+'/api/admin/stats',{headers:{'Authorization':`Admin ${pw}`}});
      if(r.status===200){sessionStorage.setItem('comonk_admin_ok','1');sessionStorage.setItem('comonk_admin_pw',pw);wall.style.display='none';dash.style.display='block';loadAdminStats();loadAdminRequests();}
      else{$('admin-login-err').innerHTML='<div class="alert-error">Wrong password</div>';}
    });
  }
  $('admin-logout-btn')?.addEventListener('click',()=>{sessionStorage.removeItem('comonk_admin_ok');sessionStorage.removeItem('comonk_admin_pw');wall.style.display='block';dash.style.display='none';});
  $$('.admin-tab').forEach(t=>t.addEventListener('click',()=>{
    $$('.admin-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');
    $$('.admin-tab-content').forEach(x=>x.style.display='none');
    $('admin-tab-'+t.dataset.tab).style.display='block';
    if(t.dataset.tab==='users')loadAdminUsers();
    if(t.dataset.tab==='attempts')loadAdminAttempts();
  }));
}

async function adminFetch(path){const r=await fetch(API+path,{headers:{'Authorization':`Admin ${adminPW()}`}});return r.json();}

async function loadAdminStats(){
  const d=await adminFetch('/api/admin/stats');
  $('admin-stats-row').innerHTML=[
    {label:'Total Users',val:d.total_users,icon:'fa-users'},
    {label:'Verified',val:d.verified_users,icon:'fa-check-circle',color:'var(--c-green)'},
    {label:'Pending Requests',val:d.pending_contact_requests,icon:'fa-clock',color:'var(--c-gold)'},
    {label:'Test Attempts',val:d.total_test_attempts,icon:'fa-pen'},
    {label:'Passed',val:d.passed_tests,icon:'fa-trophy',color:'var(--c-green)'},
    {label:'Suspicious',val:d.suspicious_attempts,icon:'fa-flag',color:'var(--c-red)'},
  ].map(k=>`<div class="kpi-card"><div class="kpi-icon"><i class="fas ${k.icon}" style="color:${k.color||'var(--c-purple)'}"></i></div><div class="kpi-val" style="color:${k.color||''}">${k.val??'—'}</div><div class="kpi-label">${k.label}</div></div>`).join('');
}

async function loadAdminRequests(){
  const d=await adminFetch('/api/admin/requests');
  const el=$('admin-tab-requests');
  if(!d.requests?.length){el.innerHTML='<div class="empty-state"><i class="fas fa-check-double"></i><p>No pending requests</p></div>';return;}
  el.innerHTML='<div class="admin-table"><div class="admin-tr hdr"><span>User</span><span>Role</span><span>Companies</span><span>Date</span><span>Actions</span></div>'+
    d.requests.map(r=>`<div class="admin-tr"><span><b>${escHtml(r.name)}</b><br><span class="muted">${escHtml(r.email)}</span></span><span>${escHtml(r.target_role)}</span><span>${JSON.parse(r.company_ids||'[]').length} cos</span><span class="muted">${new Date(r.created_at*1000).toLocaleDateString('en-IN')}</span><span style="display:flex;gap:6px"><button class="btn-sm primary" onclick="adminApprove(${r.id})"><i class="fas fa-check"></i> Approve</button><button class="btn-ghost btn-sm" onclick="adminReject(${r.id})"><i class="fas fa-times"></i></button></span></div>`).join('')+'</div>';
}

async function loadAdminUsers(){
  const d=await adminFetch('/api/admin/users?limit=100');
  $('admin-tab-users').innerHTML='<div class="admin-table"><div class="admin-tr hdr"><span>Name</span><span>Email</span><span>Role</span><span>Verified</span><span>Contacts</span><span></span></div>'+
    (d.users||[]).map(u=>`<div class="admin-tr"><span>${escHtml(u.name)}</span><span class="muted">${escHtml(u.email)}</span><span>${escHtml(u.target_role)}</span><span>${u.is_verified?'<span style="color:var(--c-green)">✓</span>':'<span class="muted">—</span>'}</span><span>${u.contacts_used}</span><span><button class="btn-xs ghost" onclick="adminDeleteUser(${u.id},'${escHtml(u.name)}')"><i class="fas fa-trash"></i></button></span></div>`).join('')+'</div>';
}

async function loadAdminAttempts(){
  const d=await adminFetch('/api/admin/test-attempts');
  $('admin-tab-attempts').innerHTML='<div class="admin-table"><div class="admin-tr hdr"><span>User</span><span>Score</span><span>Pass</span><span>Strikes</span><span>Time</span><span>Flag</span></div>'+
    (d.attempts||[]).map(a=>`<div class="admin-tr ${a.suspicious?'suspicious-row':''}"><span>${escHtml(a.name)}</span><span>${a.score}/${a.total}</span><span>${a.passed?'<span style="color:var(--c-green)">✓</span>':'<span style="color:var(--c-red)">✗</span>'}</span><span style="color:${a.tab_switches>0?'var(--c-red)':''}">${a.tab_switches}</span><span>${Math.floor(a.time_taken/60)}m${a.time_taken%60}s</span><span>${a.suspicious?'⚠️':'—'}</span></div>`).join('')+'</div>';
}

async function adminApprove(reqId){
  if(!confirm('Approve and send contacts via email?'))return;
  const r=await fetch(API+'/api/admin/approve',{method:'POST',headers:{'Authorization':`Admin ${adminPW()}`,'Content-Type':'application/json'},body:JSON.stringify({request_id:reqId,admin_note:'Approved'})});
  const d=await r.json();
  toast(d.success?`Approved! Email sent: ${d.email_sent}`:d.error,d.success?'success':'error');
  if(d.success)loadAdminRequests();
}

async function adminReject(reqId){
  if(!confirm('Reject this request?'))return;
  await fetch(API+'/api/admin/reject',{method:'POST',headers:{'Authorization':`Admin ${adminPW()}`,'Content-Type':'application/json'},body:JSON.stringify({request_id:reqId})});
  toast('Rejected','warn'); loadAdminRequests();
}

async function adminDeleteUser(userId,name){
  if(!confirm('Delete user "'+name+'"?'))return;
  await fetch(API+'/api/admin/user/'+userId,{method:'DELETE',headers:{'Authorization':`Admin ${adminPW()}`}});
  toast('Deleted '+name,'success'); loadAdminUsers();
}

/* ════════════════════════════════════════════════════════════════
   ONBOARDING FLOW  (Account → Verify → Resume → Ready → Dashboard)
   ════════════════════════════════════════════════════════════════ */
const DEMO_PROFILE = {
  name: 'Arjun Sharma', email: 'arjun@example.com', phone: '+91 98765 43210',
  skills: ['Python','Machine Learning','LangChain','FastAPI','TensorFlow','PyTorch','NLP','SQL','Docker','Git'],
  experience: 'AI/ML developer with 2 years experience building production ML models and LLM applications.',
  education: 'B.Tech Computer Science, Gujarat University, 2022',
  target_roles: ['AI/ML Engineer','Machine Learning Engineer','AI Developer'],
  experience_years: 2, seniority_level: 'junior',
};

let obState = { step:1, email:'', stashFile:null, stashDemo:false };

function openLogin(){ closeOnboarding(); openAuthModal(); switchAuthTab('login'); }
function startOnboarding(){ closeAuthModal(); const o=$('onboarding'); if(o){ o.style.display='flex'; obGoStep(1); } }
function closeOnboarding(){ const o=$('onboarding'); if(o) o.style.display='none'; }

function obGoStep(n){
  obState.step = n;
  for(let i=1;i<=4;i++){ const p=$('ob-pane-'+i); if(p) p.style.display = (i===n)?'block':'none'; }
  $$('.ob-step').forEach(s=>{ const sn=+s.dataset.step; s.classList.toggle('active', sn===n); s.classList.toggle('done', sn<n); });
}

function obErr(id,msg){ const el=$(id); if(el) el.innerHTML='<div class="alert-error">'+escHtml(msg||'Something went wrong')+'</div>'; }
function obOtpValue(){ return Array.from(document.querySelectorAll('#ob-otp-boxes .otp-box')).map(b=>b.value).join(''); }

function initOnboarding(){
  const reg=$('ob-register-btn');
  if(!reg || reg.dataset.wired) return;
  reg.dataset.wired='1';

  reg.addEventListener('click', async()=>{
    const name=$('ob-name').value.trim(), email=$('ob-email').value.trim(), pw=$('ob-password').value,
          phone=$('ob-phone').value.trim(), role=$('ob-role').value, city=$('ob-city').value;
    if(!name||!email||!pw){ obErr('ob-reg-err','Please fill name, email, and password'); return; }
    if(pw.length<6){ obErr('ob-reg-err','Password must be at least 6 characters'); return; }
    reg.disabled=true; reg.innerHTML='<i class="fas fa-spinner fa-spin"></i> Creating…';
    const res=await authApi('POST','/api/auth/register',{name,email,password:pw,phone,target_role:role,city});
    if(res.success){
      obState.email=email; localStorage.setItem('comonk_pending_email',email);
      $('ob-otp-email').textContent=email; $('ob-reg-err').innerHTML='';
      if(res.dev_otp) toast('Dev OTP: '+res.dev_otp,'info');
      obGoStep(2);
      document.querySelector('#ob-otp-boxes .otp-box')?.focus();
    } else obErr('ob-reg-err', res.error);
    reg.disabled=false; reg.innerHTML='<i class="fas fa-arrow-right"></i> Continue';
  });

  // OTP box auto-advance / backspace / paste
  const boxes=Array.from(document.querySelectorAll('#ob-otp-boxes .otp-box'));
  boxes.forEach((box,i)=>{
    box.addEventListener('input',()=>{ box.value=box.value.replace(/\D/g,''); if(box.value&&i<boxes.length-1) boxes[i+1].focus(); });
    box.addEventListener('keydown',e=>{ if(e.key==='Backspace'&&!box.value&&i>0) boxes[i-1].focus(); });
    box.addEventListener('paste',e=>{ e.preventDefault(); const d=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6); d.split('').forEach((ch,j)=>{ if(boxes[j]) boxes[j].value=ch; }); if(boxes[Math.min(d.length,5)]) boxes[Math.min(d.length,5)].focus(); });
  });

  $('ob-otp-btn').addEventListener('click', async()=>{
    const otp=obOtpValue();
    if(otp.length<6){ obErr('ob-otp-err','Enter all 6 digits'); return; }
    const btn=$('ob-otp-btn'); btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Verifying…';
    const res=await authApi('POST','/api/auth/verify-otp',{email:obState.email,otp});
    if(res.success){
      Auth.save(res.token,res); updateAuthUI(); $('ob-otp-err').innerHTML='';
      obGoStep(3);
      if(obState.stashFile){ const f=obState.stashFile; obState.stashFile=null; obHandleResume(f); }
      else if(obState.stashDemo){ obState.stashDemo=false; obLoadDemo(); }
    } else obErr('ob-otp-err', res.error);
    btn.disabled=false; btn.innerHTML='<i class="fas fa-circle-check"></i> Verify & Continue';
  });

  $('ob-resume-file').addEventListener('change', e=>{ if(e.target.files[0]) obHandleResume(e.target.files[0]); });
  $('ob-demo-btn').addEventListener('click', obLoadDemo);
  const oz=$('ob-upload-zone');
  oz.addEventListener('dragover', e=>{ e.preventDefault(); oz.classList.add('drag-over'); });
  oz.addEventListener('dragleave', ()=> oz.classList.remove('drag-over'));
  oz.addEventListener('drop', e=>{ e.preventDefault(); oz.classList.remove('drag-over'); const f=e.dataTransfer.files[0]; if(f) obHandleResume(f); });
}

function obShowParsing(h,s){ $('ob-upload-idle').style.display='none'; $('ob-upload-parsing').style.display='block'; $('ob-parse-headline').textContent=h; $('ob-parse-sub').textContent=s; }
function obAnimateBar(){ let w=0; const msgs=['Reading structure…','Extracting skills…','Analyzing experience…','Matching companies…','Finalizing…']; let mi=0;
  const t=setInterval(()=>{ w=Math.min(w+Math.random()*12+3,92); const b=$('ob-parse-prog-bar'); if(b)b.style.width=w+'%'; if(w>mi*18+18){ $('ob-parse-sub').textContent=msgs[mi]||msgs[msgs.length-1]; mi++; } if(w>=92)clearInterval(t); },250); }

async function obHandleResume(file){
  if(!file.name.toLowerCase().endsWith('.pdf')){ toast('Please upload a PDF file','error'); return; }
  obShowParsing('Reading your resume…','AI extracting skills and experience…'); obAnimateBar();
  try{ const fd=new FormData(); fd.append('file',file); const profile=await api('POST','/api/parse-resume',fd,true); await obAfterProfile(profile); }
  catch(e){ $('ob-upload-idle').style.display='block'; $('ob-upload-parsing').style.display='none'; toast('Could not parse PDF: '+e.message,'error'); }
}
async function obLoadDemo(){ obShowParsing('Loading demo profile…','Generating sample AI Engineer profile'); obAnimateBar(); await new Promise(r=>setTimeout(r,1500)); await obAfterProfile(JSON.parse(JSON.stringify(DEMO_PROFILE))); }

async function obAfterProfile(profile){
  const b=$('ob-parse-prog-bar'); if(b) b.style.width='100%';
  S.profile=profile;
  try{ await authApi('POST','/api/auth/save-profile',{profile}); }catch(e){}
  if(Auth.user){ Auth.user.profile=profile; Auth.save(Auth.token,Auth.user); }
  $('ob-ready-name').textContent=(profile.name||'there').split(' ')[0];
  const roles=(profile.target_roles&&profile.target_roles.length)?profile.target_roles.length:1;
  $('ob-ready-stats').innerHTML=`
    <div class="ob-rstat"><b>${(profile.skills||[]).length}</b><span>Skills</span></div>
    <div class="ob-rstat"><b>${profile.experience_years??0}</b><span>Yrs Exp</span></div>
    <div class="ob-rstat"><b>${roles}</b><span>Target Roles</span></div>`;
  await new Promise(r=>setTimeout(r,450));
  obGoStep(4);
}

function finishOnboarding(){
  closeOnboarding();
  $('landing').style.display='none';
  $('app').style.display='grid';
  initApp();
  if(S.profile?.name) setDiceBearAvatar(S.profile.name);
}

// Called after a successful LOGIN (modal). Route by saved profile.
function afterLogin(res){
  if(res.profile){ S.profile=res.profile; finishOnboardingDirect(); }
  else { startOnboarding(); obGoStep(3); }
}
function finishOnboardingDirect(){
  closeOnboarding(); closeAuthModal();
  $('landing').style.display='none';
  $('app').style.display='grid';
  initApp();
  if(S.profile?.name) setDiceBearAvatar(S.profile.name);
}

/* ════════════════════════════════════════════════════════════════
   PROMISED FEATURE 1 — AI MOCK INTERVIEW (voice via Web Speech API)
   ════════════════════════════════════════════════════════════════ */
let mockState = { questions:[], current:0, recognizing:false, recog:null, transcript:'' };

function initMockVoice(){
  const area=$('mockvoice-area'); if(!area) return;
  area.innerHTML=`
    <div class="mv-intro card" style="max-width:620px;margin:0 auto">
      <div style="text-align:center;padding:14px 0">
        <div style="font-size:52px">🎤</div>
        <h2 style="margin-top:10px">AI Mock Interview</h2>
        <p class="muted" style="margin-top:6px;line-height:1.7">Role-specific questions. Answer out loud (we transcribe in your browser — nothing is uploaded) or type. AI scores you on clarity, structure, relevance & confidence.</p>
      </div>
      <div class="form-row-2" style="margin-top:10px">
        <div class="fg"><label>Target Role</label><input type="text" id="mv-role" class="inp" value="${escHtml((S.profile?.target_roles&&S.profile.target_roles[0])||S.profile?.target_role||'AI/ML Engineer')}"></div>
        <div class="fg"><label>Difficulty</label><select id="mv-diff" class="inp"><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option></select></div>
      </div>
      <button class="btn-primary lg" style="width:100%;margin-top:8px" id="mv-start-btn"><i class="fas fa-play"></i> Start Interview</button>
      ${!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? '<p class="muted" style="margin-top:10px;font-size:12px;text-align:center"><i class="fas fa-circle-info"></i> Voice not supported in this browser — you can still type your answers. (Chrome/Edge recommended.)</p>' : ''}
    </div>`;
  $('mv-start-btn').addEventListener('click', mvStart);
}

async function mvStart(){
  const role=$('mv-role').value.trim()||'AI/ML Engineer';
  const diff=$('mv-diff').value;
  const area=$('mockvoice-area');
  area.innerHTML='<div class="empty-state"><div class="parse-spinner"></div><p>Generating your interview questions…</p></div>';
  const res=await api('POST','/api/mock-interview/questions',{target_role:role,difficulty:diff,count:5});
  if(!res.success||!res.questions?.length){ area.innerHTML=`<div class="alert-error">${escHtml(res.error||'Failed to load questions')}</div>`; return; }
  mockState={questions:res.questions,current:0,recognizing:false,recog:null,transcript:'',role,scores:[]};
  mvRenderQuestion();
}

window.mvSpeakQuestion = function() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const q = mockState.questions[mockState.current];
    const u = new SpeechSynthesisUtterance(q.q);
    u.lang = 'en-IN';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } else {
    toast('Text-to-speech not supported in this browser', 'warning');
  }
};

function mvRenderQuestion(){
  const {questions,current}=mockState;
  if(current>=questions.length){ mvFinish(); return; }
  const q=questions[current];
  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  $('mockvoice-area').innerHTML=`
    <div class="mv-wrap">
      <div class="mv-progress"><span>Question ${current+1} of ${questions.length}</span><div class="mv-prog-track"><div class="mv-prog-fill" style="width:${(current/questions.length)*100}%"></div></div></div>
      <div class="card mv-qcard">
        <span class="badge ${q.type==='technical'?'blue':'purple'}">${q.type}</span>
        <h3 class="mv-question" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <span>${escHtml(q.q)}</span>
          <button class="btn-xs ghost" onclick="mvSpeakQuestion()" title="Listen to question" style="margin-left:auto;white-space:nowrap"><i class="fas fa-volume-up"></i> Listen</button>
        </h3>
        <div class="mv-mic-row">
          ${supported?`<button class="mv-mic" id="mv-mic-btn"><i class="fas fa-microphone"></i></button><span class="mv-mic-hint" id="mv-mic-hint">Tap to speak</span>`:''}
        </div>
        <textarea id="mv-answer" class="inp" rows="6" placeholder="${supported?'Your spoken answer appears here — or type directly…':'Type your answer here…'}" style="resize:vertical;margin-top:14px;font-family:inherit"></textarea>
        <div style="display:flex;gap:10px;margin-top:14px">
          <button class="btn-primary" style="flex:1" id="mv-submit-btn"><i class="fas fa-star"></i> Score My Answer</button>
          <button class="btn-ghost" id="mv-skip-btn">Skip</button>
        </div>
        <div id="mv-feedback"></div>
      </div>
    </div>`;
  if(supported) mvWireMic();
  $('mv-submit-btn').addEventListener('click', mvScore);
  $('mv-skip-btn').addEventListener('click', ()=>{ 
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    mockState.current++; 
    mvRenderQuestion(); 
  });
}

function mvWireMic(){
  const btn=$('mv-mic-btn'), hint=$('mv-mic-hint'), ta=$('mv-answer');
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  btn.addEventListener('click', ()=>{
    if(mockState.recognizing){ mockState.recog?.stop(); return; }
    const recog=new SR();
    recog.lang='en-IN'; recog.continuous=true; recog.interimResults=true;
    mockState.recog=recog; mockState.baseText=ta.value;
    recog.onstart=()=>{ mockState.recognizing=true; btn.classList.add('recording'); hint.textContent='Listening… tap to stop'; };
    recog.onresult=e=>{
      let txt='';
      for(let i=0;i<e.results.length;i++) txt+=e.results[i][0].transcript;
      ta.value=(mockState.baseText?mockState.baseText+' ':'')+txt;
    };
    recog.onerror=ev=>{ hint.textContent='Mic error: '+ev.error+'. You can type instead.'; };
    recog.onend=()=>{ mockState.recognizing=false; btn.classList.remove('recording'); hint.textContent='Tap to speak'; };
    recog.start();
  });
}

async function mvScore(){
  const ta=$('mv-answer'); const answer=ta.value.trim();
  if(answer.length<10){ toast('Answer is too short to score','error'); return; }
  if(mockState.recognizing) mockState.recog?.stop();
  const q=mockState.questions[mockState.current];
  const fb=$('mv-feedback'); fb.innerHTML='<div class="empty-state" style="padding:20px"><div class="parse-spinner"></div><p>AI is evaluating your answer…</p></div>';
  const res=await api('POST','/api/mock-interview/score',{question:q.q,answer,target_role:mockState.role,qtype:q.type});
  if(!res.success){ fb.innerHTML=`<div class="alert-error">${escHtml(res.error||'Scoring failed')}</div>`; return; }
  if(!mockState.scores) mockState.scores=[];
  mockState.scores.push(res.overall||0);
  const s=res.scores||{};
  fb.innerHTML=`
    <div class="mv-result">
      <div class="mv-overall"><div class="mv-overall-num" style="color:${res.overall>=70?'var(--c-green)':res.overall>=45?'var(--c-gold)':'var(--c-red)'}">${res.overall??0}</div><div class="mv-overall-lbl">/ 100<br><b>${escHtml(res.verdict||'')}</b></div></div>
      <div class="mv-bars">
        ${['clarity','relevance','structure','confidence'].map(k=>`<div class="mv-bar-row"><span>${k}</span><div class="mv-bar"><div class="mv-bar-fill" style="width:${(s[k]||0)*10}%"></div></div><b>${s[k]??0}</b></div>`).join('')}
      </div>
      <div class="mv-fb-cols">
        <div><h5 class="green"><i class="fas fa-circle-check"></i> Strengths</h5><ul>${(res.strengths||[]).map(x=>`<li>${escHtml(x)}</li>`).join('')||'<li>—</li>'}</ul></div>
        <div><h5 class="gold"><i class="fas fa-lightbulb"></i> Improve</h5><ul>${(res.improvements||[]).map(x=>`<li>${escHtml(x)}</li>`).join('')||'<li>—</li>'}</ul></div>
      </div>
      ${res.model_answer?`<div class="mv-model"><h5 class="purple"><i class="fas fa-wand-magic-sparkles"></i> Model answer</h5><p>${escHtml(res.model_answer)}</p></div>`:''}
      <button class="btn-primary" style="width:100%;margin-top:14px" id="mv-next-btn">${mockState.current+1>=mockState.questions.length?'<i class="fas fa-flag-checkered"></i> Finish & See Summary':'<i class="fas fa-arrow-right"></i> Next Question'}</button>
    </div>`;
  $('mv-next-btn').addEventListener('click', ()=>{ 
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    mockState.current++; 
    mvRenderQuestion(); 
  });
}

function mvFinish(){
  const scores=mockState.scores||[];
  const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
  $('mockvoice-area').innerHTML=`
    <div class="card" style="max-width:480px;margin:40px auto;text-align:center">
      <div style="font-size:60px">${avg>=70?'🏆':avg>=45?'💪':'📚'}</div>
      <h2 style="margin-top:10px">Interview Complete</h2>
      <div style="font-size:46px;font-weight:800;color:${avg>=70?'var(--c-green)':avg>=45?'var(--c-gold)':'var(--c-red)'};margin:12px 0">${avg}<span style="font-size:20px;color:var(--text-3)">/100 avg</span></div>
      <p class="muted">${scores.length} answers scored. ${avg>=70?"Strong performance — you're interview-ready!":avg>=45?'Solid base. Practice the improvement areas and retry.':'Keep practicing — review model answers and try again.'}</p>
      <button class="btn-primary" style="margin-top:18px;width:100%" onclick="initMockVoice()"><i class="fas fa-redo"></i> New Interview</button>
    </div>`;
}

/* ════════════════════════════════════════════════════════════════
   PROMISED FEATURE 2 — RESUME STUDIO (rewriter + cover letter)
   ════════════════════════════════════════════════════════════════ */
function initResumeStudio(){
  $$('.rs-tab').forEach(t=>{ if(t.dataset.wired) return; t.dataset.wired='1';
    t.addEventListener('click', ()=>{
      $$('.rs-tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
      $('rs-pane-rewrite').style.display = t.dataset.rs==='rewrite'?'block':'none';
      $('rs-pane-cover').style.display = t.dataset.rs==='cover'?'block':'none';
      $('rs-pane-jdgap').style.display = t.dataset.rs==='jdgap'?'block':'none';
    });
  });
  const role=(S.profile?.target_roles&&S.profile.target_roles[0])||S.profile?.target_role||'AI/ML Engineer';
  const rr=$('rs-role'); if(rr&&!rr.value) rr.value=role;
  const cr=$('cl-role'); if(cr&&!cr.value) cr.value=role;
  const rt=$('rs-resume-text');
  if(rt&&!rt.value&&S.profile){
    const p=S.profile;
    rt.value=[p.experience||'', (p.skills||[]).length?('Skills: '+p.skills.join(', ')):'', p.education?('Education: '+p.education):''].filter(Boolean).join('\n\n');
  }
  const rb=$('rs-rewrite-btn'); if(rb&&!rb.dataset.wired){ rb.dataset.wired='1'; rb.addEventListener('click', rsRewrite); }
  const cb=$('cl-gen-btn'); if(cb&&!cb.dataset.wired){ cb.dataset.wired='1'; cb.addEventListener('click', clGenerate); }

  const jdb=$('rs-jd-analyze-btn'); 
  if(jdb && !jdb.dataset.wired){ 
    jdb.dataset.wired='1'; 
    jdb.addEventListener('click', rsJdAnalyze); 
  }
}

async function rsJdAnalyze() {
  const jdText = $('rs-jd-text').value.trim();
  if (jdText.length < 30) { toast('Please paste a target Job Description first', 'error'); return; }
  
  const out = $('rs-jd-out');
  out.innerHTML = '<div class="empty-state"><div class="parse-spinner"></div><p>Analyzing skill gaps & tailoring resume...</p></div>';
  
  try {
    const gapRes = await api('POST', '/api/jd-gap', { jd_text: jdText });
    const tailorRes = await api('POST', '/api/tailor-resume', { jd_text: jdText });
    
    if (gapRes.success && tailorRes.success) {
      out.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:16px;max-height:480px;overflow-y:auto;padding-right:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:rgba(124,58,237,0.06);border:1px solid rgba(124,58,237,0.15);border-radius:12px">
            <span style="font-weight:bold;color:var(--text)">ATS Match Percentage:</span>
            <span class="badge ${gapRes.match_pct >= 75 ? 'green' : gapRes.match_pct >= 45 ? 'purple' : 'red'}" style="font-size:14px;padding:4px 12px">${gapRes.match_pct}%</span>
          </div>
          
          <div class="form-row-2">
            <div>
              <h5 style="font-weight:bold;margin-bottom:6px;color:var(--c-green-l)"><i class="fas fa-check"></i> Present Skills</h5>
              <div class="skill-chips">
                ${gapRes.present_skills.map(s => `<span class="skill-chip" style="background:rgba(16,185,129,0.12);color:var(--c-green);border-color:rgba(16,185,129,0.25)">${escHtml(s)}</span>`).join('')}
              </div>
            </div>
            <div>
              <h5 style="font-weight:bold;margin-bottom:6px;color:var(--c-gold-l)"><i class="fas fa-triangle-exclamation"></i> Gaps Detected</h5>
              <div class="skill-chips">
                ${gapRes.missing_skills.map(s => `<span class="skill-chip" style="background:rgba(245,158,11,0.12);color:var(--c-gold-l);border-color:rgba(245,158,11,0.25)">${escHtml(s)}</span>`).join('')}
              </div>
            </div>
          </div>

          <div>
            <h5 style="font-weight:bold;margin-bottom:6px;color:var(--c-purple-l)"><i class="fas fa-sparkles"></i> Suggested Tailored Bullets</h5>
            <pre class="inp ta-md" style="font-size:12px;background:var(--bg-1);line-height:1.5;white-space:pre-wrap;padding:10px">${escHtml(tailorRes.tailored_bullets)}</pre>
          </div>

          <div>
            <h5 style="font-weight:bold;margin-bottom:6px;color:var(--c-blue-l)"><i class="fas fa-envelope-open-text"></i> Tailored Cover Letter</h5>
            <pre class="inp ta-md" style="font-size:12px;background:var(--bg-1);line-height:1.5;white-space:pre-wrap;padding:10px">${escHtml(tailorRes.cover_letter)}</pre>
          </div>
        </div>
      `;
      toast('Analysis complete and learning planner updated!', 'success');
    }
  } catch (e) {
    out.innerHTML = `<div class="empty-state" style="color:var(--c-red)"><i class="fas fa-triangle-exclamation"></i><p>Failed to analyze: ${e.message}</p></div>`;
  }
}

async function rsRewrite(){
  const text=$('rs-resume-text').value.trim();
  if(text.length<30){ toast('Paste more of your resume first','error'); return; }
  const out=$('rs-rewrite-out');
  out.innerHTML='<div class="empty-state"><div class="parse-spinner"></div><p>AI is rewriting for ATS…</p></div>';
  const res=await api('POST','/api/resume-rewrite',{resume_text:text,target_role:$('rs-role').value.trim()||'AI/ML Engineer'});
  if(!res.success){ out.innerHTML=`<div class="alert-error">${escHtml(res.error||'Failed')}</div>`; return; }
  out.innerHTML=`
    <div class="card-hdr"><h4><i class="fas fa-circle-check green"></i> ATS-Optimized</h4><button class="btn-xs ghost" onclick="copyText(window._rsRewriteText)"><i class="fas fa-copy"></i> Copy</button></div>
    <div class="rs-section"><h5>Professional Summary</h5><p>${escHtml(res.summary||'')}</p></div>
    <div class="rs-section"><h5>Achievement Bullets</h5><ul>${(res.bullets||[]).map(b=>`<li>${escHtml(b)}</li>`).join('')}</ul></div>
    <div class="rs-section"><h5>Skills to Add</h5><div class="chip-row">${(res.skills_to_add||[]).map(s=>`<span class="chip">${escHtml(s)}</span>`).join('')||'—'}</div></div>
    <div class="rs-section"><h5>ATS Keywords</h5><div class="chip-row">${(res.keywords||[]).map(s=>`<span class="chip blue">${escHtml(s)}</span>`).join('')||'—'}</div></div>
    <div class="rs-section"><h5>Quick Wins</h5><ul>${(res.ats_tips||[]).map(t=>`<li>${escHtml(t)}</li>`).join('')}</ul></div>`;
  window._rsRewriteText=`PROFESSIONAL SUMMARY\n${res.summary}\n\nEXPERIENCE\n`+(res.bullets||[]).map(b=>'• '+b).join('\n')+`\n\nSKILLS TO ADD: ${(res.skills_to_add||[]).join(', ')}\nATS KEYWORDS: ${(res.keywords||[]).join(', ')}`;
}

async function clGenerate(){
  const company=$('cl-company').value.trim();
  if(!company){ toast('Enter a company name','error'); return; }
  const out=$('cl-out');
  out.innerHTML='<div class="empty-state"><div class="parse-spinner"></div><p>Writing your cover letter…</p></div>';
  const p=S.profile||{};
  const res=await api('POST','/api/cover-letter',{
    name:p.name||'', target_role:$('cl-role').value.trim()||'AI/ML Engineer', company,
    skills:p.skills||[], experience:p.experience||'', tone:$('cl-tone').value
  });
  if(!res.success){ out.innerHTML=`<div class="alert-error">${escHtml(res.error||'Failed')}</div>`; return; }
  window._clText=res.letter;
  out.innerHTML=`
    <div class="card-hdr"><h4><i class="fas fa-envelope-open-text green"></i> Cover Letter — ${escHtml(company)}</h4><button class="btn-xs ghost" onclick="copyText(window._clText)"><i class="fas fa-copy"></i> Copy</button></div>
    <pre class="cl-letter">${escHtml(res.letter)}</pre>`;
}

function copyText(t){ if(!t) return; navigator.clipboard.writeText(t).then(()=>toast('Copied to clipboard','success')).catch(()=>toast('Copy failed','error')); }

/* ════════════════════════════════════════════════════════════════
   PROMISED FEATURE 3 — CALENDAR / SCHEDULER
   ════════════════════════════════════════════════════════════════ */
const CAL_KEY='comonk_cal_events';
let calView={ y:0, m:0 };
function calEvents(){ try{ return JSON.parse(localStorage.getItem(CAL_KEY)||'[]'); }catch(e){ return []; } }
function calSave(evs){ localStorage.setItem(CAL_KEY, JSON.stringify(evs)); }
const CAL_TYPE_COLOR={interview:'var(--c-purple)',deadline:'var(--c-red)',followup:'var(--c-blue)',test:'var(--c-gold)',other:'var(--text-2)'};

function initCalendar(){
  if(!calView.y){ const n=new Date(); calView.y=n.getFullYear(); calView.m=n.getMonth(); }
  const wire=(id,fn)=>{ const el=$(id); if(el&&!el.dataset.wired){ el.dataset.wired='1'; el.addEventListener('click',fn); } };
  wire('cal-prev',()=>{ calView.m--; if(calView.m<0){calView.m=11;calView.y--;} renderCalendar(); });
  wire('cal-next',()=>{ calView.m++; if(calView.m>11){calView.m=0;calView.y++;} renderCalendar(); });
  wire('cal-today',()=>{ const n=new Date(); calView.y=n.getFullYear(); calView.m=n.getMonth(); renderCalendar(); });
  wire('cal-add-btn',()=>openCalModal());
  wire('cal-save-btn',calSaveEvent);
  wire('cal-delete-btn',calDeleteEvent);
  renderCalendar();
}

function renderCalendar(){
  const {y,m}=calView;
  $('cal-month-label').textContent=new Date(y,m,1).toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  const evs=calEvents();
  const today=new Date(); const todayStr=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  let cells='';
  for(let i=0;i<first;i++) cells+='<div class="cal-cell empty"></div>';
  for(let d=1;d<=days;d++){
    const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEvs=evs.filter(e=>e.date===ds);
    cells+=`<div class="cal-cell ${ds===todayStr?'today':''}" onclick="openCalModal(null,'${ds}')">
      <span class="cal-daynum">${d}</span>
      ${dayEvs.slice(0,3).map(e=>`<div class="cal-ev" style="background:${CAL_TYPE_COLOR[e.type]||'var(--text-2)'}" onclick="event.stopPropagation();openCalModal('${e.id}')" title="${escHtml(e.title)}">${escHtml(e.title)}</div>`).join('')}
      ${dayEvs.length>3?`<div class="cal-more">+${dayEvs.length-3} more</div>`:''}
    </div>`;
  }
  $('cal-grid').innerHTML=cells;
  const up=evs.filter(e=>e.date>=todayStr).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,8);
  $('cal-upcoming').innerHTML = up.length? up.map(e=>`
    <div class="cal-up-item" onclick="openCalModal('${e.id}')">
      <div class="cal-up-dot" style="background:${CAL_TYPE_COLOR[e.type]||'var(--text-2)'}"></div>
      <div><div class="cal-up-title">${escHtml(e.title)}</div><div class="cal-up-date">${new Date(e.date+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}${e.time?' · '+e.time:''} · ${e.type}</div></div>
    </div>`).join('') : '<p class="muted" style="font-size:13px">No upcoming events. Click a date to add one.</p>';
}

function openCalModal(id,presetDate){
  $('cal-ev-id').value=id||'';
  $('cal-delete-btn').style.display=id?'flex':'none';
  $('cal-modal-title').innerHTML=id?'<i class="fas fa-pen"></i> Edit Event':'<i class="fas fa-calendar-plus"></i> Add Event';
  if(id){
    const e=calEvents().find(x=>x.id===id)||{};
    $('cal-ev-title').value=e.title||''; $('cal-ev-date').value=e.date||''; $('cal-ev-time').value=e.time||'';
    $('cal-ev-type').value=e.type||'interview'; $('cal-ev-notes').value=e.notes||'';
  } else {
    $('cal-ev-title').value=''; $('cal-ev-date').value=presetDate||''; $('cal-ev-time').value='';
    $('cal-ev-type').value='interview'; $('cal-ev-notes').value='';
  }
  $('cal-modal').style.display='flex';
}
function closeCalModal(){ $('cal-modal').style.display='none'; }

function calSaveEvent(){
  const title=$('cal-ev-title').value.trim(), date=$('cal-ev-date').value;
  if(!title||!date){ toast('Title and date are required','error'); return; }
  const evs=calEvents(); const id=$('cal-ev-id').value;
  const ev={ id:id||('e'+Date.now()), title, date, time:$('cal-ev-time').value, type:$('cal-ev-type').value, notes:$('cal-ev-notes').value.trim() };
  if(id){ const i=evs.findIndex(x=>x.id===id); if(i>=0) evs[i]=ev; } else evs.push(ev);
  calSave(evs); closeCalModal(); renderCalendar(); toast('Event saved','success');
}
function calDeleteEvent(){
  const id=$('cal-ev-id').value; if(!id) return;
  calSave(calEvents().filter(x=>x.id!==id)); closeCalModal(); renderCalendar(); toast('Event deleted','warn');
}

/* ═══════════════════════════════════════════════════════════════════
   ENTERPRISE FEATURES — Phase 3
   ══════════════════════════════════════════════════════════════════ */

/* ── Feature 1: Company Intelligence Deep Dive ──────────────────── */
async function loadCompanyIntel(companyId) {
  try {
    const data = await api('GET', `/api/company-intel/${companyId}`);
    const intel = data.intel || {};
    const recruiters = data.recruiters || [];
    const techBadges = (intel.tech_stack || []).map(t =>
      `<span style="background:rgba(124,58,237,0.12);color:var(--c-purple-l);padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600">${escHtml(t)}</span>`
    ).join(' ');
    const cultureBadges = (intel.culture_signals || []).map(s =>
      `<span style="background:rgba(16,185,129,0.1);color:var(--c-green-l);padding:3px 8px;border-radius:6px;font-size:11px">${escHtml(s)}</span>`
    ).join(' ');
    const recRows = recruiters.length
      ? recruiters.map(r => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--c-purple),var(--c-blue));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:white;flex-shrink:0">${escHtml(initials(r.name))}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:13px;color:white">${escHtml(r.name)}</div>
              ${r.title ? `<div style="font-size:11px;color:var(--text-2)">${escHtml(r.title)}</div>` : ''}
            </div>
            ${r.linkedin_url ? `<a href="${escHtml(r.linkedin_url)}" target="_blank" class="btn-primary sm" style="flex-shrink:0;font-size:11px"><i class="fab fa-linkedin"></i> Connect</a>` : ''}
          </div>`).join('')
      : `<p class="muted" style="font-size:12px">No recruiters indexed for this company yet.</p>`;

    openModal(`🏢 ${data.name} — Company Intel`, `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${intel.growth_stage ? `<span style="background:rgba(245,158,11,0.1);color:var(--c-gold-l);border:1px solid rgba(245,158,11,0.2);padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700">${escHtml(intel.growth_stage)}</span>` : ''}
          ${intel.work_mode ? `<span style="background:rgba(59,130,246,0.1);color:var(--c-blue-l);border:1px solid rgba(59,130,246,0.2);padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700"><i class="fas fa-map-marker-alt"></i> ${escHtml(intel.work_mode)}</span>` : ''}
          ${intel.founded && intel.founded !== 'Unknown' ? `<span style="background:var(--bg-3);padding:4px 10px;border-radius:20px;font-size:11px">Est. ${escHtml(intel.founded)}</span>` : ''}
          ${intel.size ? `<span style="background:var(--bg-3);padding:4px 10px;border-radius:20px;font-size:11px"><i class="fas fa-users"></i> ${escHtml(intel.size)}</span>` : ''}
        </div>
        ${intel.why_apply ? `<div style="background:rgba(124,58,237,0.06);border:1px solid rgba(124,58,237,0.15);border-radius:10px;padding:12px;font-size:13px;color:var(--text-1)"><i class="fas fa-lightbulb" style="color:var(--c-gold)"></i> <strong>Why apply?</strong> ${escHtml(intel.why_apply)}</div>` : ''}
        ${intel.recent_news ? `<div style="font-size:12px;color:var(--text-2)"><i class="fas fa-newspaper" style="color:var(--c-blue)"></i> ${escHtml(intel.recent_news)}</div>` : ''}
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text-2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Tech Stack</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${techBadges || '<span class="muted" style="font-size:12px">Not available</span>'}</div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text-2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Culture Signals</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${cultureBadges || '<span class="muted" style="font-size:12px">Not available</span>'}</div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text-2);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Top HR Contacts</div>
          <div>${recRows}</div>
        </div>
      </div>
    `, `<button class="btn-primary" onclick="closeModal()">Close</button>`);
  } catch (e) {
    toast('Could not load company intel: ' + e.message, 'error');
  }
}
window.loadCompanyIntel = loadCompanyIntel;

/* ── Feature 2: Daily Briefing Panel ────────────────────────────── */
async function loadDailyBriefing() {
  const body = $('briefing-body');
  const dateEl = $('briefing-date');
  if (!body) return;
  if (!Auth.isLoggedIn()) {
    body.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px">
      <i class="fas fa-lock" style="font-size:40px;color:var(--c-purple);opacity:0.5"></i>
      <p class="muted" style="margin-top:12px">Please log in to see your personalized daily briefing</p>
      <button class="btn-primary" style="margin-top:12px" onclick="openAuthModal()">Login</button>
    </div>`;
    return;
  }
  body.innerHTML = `<div class="card" style="grid-column:1/-1"><div class="loading-spinner" style="margin:40px auto"></div></div>`;
  try {
    const d = await authApi('GET', '/api/daily-briefing');
    if (dateEl) dateEl.textContent = `${d.weekday}, ${d.date}`;

    const weekdayIcons = { Monday:'🌅', Tuesday:'🚀', Wednesday:'⚡', Thursday:'🎯', Friday:'🔥', Saturday:'☀️', Sunday:'🌟' };
    const wIcon = weekdayIcons[d.weekday] || '🌞';
    const statsCards = [
      { label: 'Total Applications', val: d.stats.total, icon: 'fa-file-alt', color: 'var(--c-purple)' },
      { label: 'Interview Calls', val: d.stats.interviews, icon: 'fa-handshake', color: 'var(--c-blue)' },
      { label: 'Positive Replies', val: d.stats.replies, icon: 'fa-reply', color: 'var(--c-green)' },
      { label: 'Offers Received', val: d.stats.offers, icon: 'fa-trophy', color: 'var(--c-gold)' },
    ];

    const priorityItems = (d.priorities || []).map(p =>
      `<li style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <i class="fas fa-chevron-right" style="color:var(--c-purple);margin-top:3px;flex-shrink:0"></i>
        <span style="font-size:13px;color:var(--text-1)">${escHtml(p)}</span>
      </li>`
    ).join('');

    const followupItems = (d.followups_due || []).length
      ? d.followups_due.map(f =>
          `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:13px;font-weight:600;color:var(--text-1)">${escHtml(f.company)}</span>
            <span style="font-size:11px;color:var(--c-gold-l);background:rgba(245,158,11,0.1);padding:2px 8px;border-radius:10px">${f.days_since}d overdue</span>
          </div>`
        ).join('')
      : `<p class="muted" style="font-size:12px;padding:12px 0">No overdue follow-ups! 🎉 Keep it up.</p>`;

    body.innerHTML = `
      <!-- AI greeting -->
      <div class="card" style="grid-column:1/-1;background:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(59,130,246,0.08));border:1px solid rgba(124,58,237,0.2)">
        <div style="font-size:28px;margin-bottom:8px">${wIcon}</div>
        <div style="font-size:14px;color:var(--text-1);line-height:1.6">${d.ai_insight ? escHtml(d.ai_insight) : escHtml(d.motivation)}</div>
      </div>

      <!-- Stats row -->
      ${statsCards.map(s => `
        <div class="card" style="display:flex;align-items:center;gap:14px;padding:16px">
          <div style="width:44px;height:44px;border-radius:12px;background:${s.color}22;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="fas ${s.icon}" style="font-size:18px;color:${s.color}"></i>
          </div>
          <div>
            <div style="font-size:24px;font-weight:900;color:white">${s.val}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:2px">${s.label}</div>
          </div>
        </div>`).join('')}

      <!-- Today's priorities -->
      <div class="card" style="grid-column:1/-1">
        <div style="font-size:13px;font-weight:700;color:white;margin-bottom:10px"><i class="fas fa-tasks" style="color:var(--c-purple)"></i> Today's Priority Actions</div>
        <ul style="list-style:none;padding:0;margin:0">${priorityItems}</ul>
      </div>

      <!-- Follow-ups due -->
      <div class="card">
        <div style="font-size:13px;font-weight:700;color:white;margin-bottom:10px"><i class="fas fa-bell" style="color:var(--c-gold)"></i> Follow-Ups Due</div>
        <div>${followupItems}</div>
        ${d.followups_due.length ? `<button class="btn-primary sm" style="margin-top:10px;width:100%" onclick="openPanel('tracker')">Go to App Tracker</button>` : ''}
      </div>

      <!-- Skill of the day -->
      <div class="card" style="background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(59,130,246,0.05));border:1px solid rgba(16,185,129,0.15)">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--c-green-l);margin-bottom:6px">Skill of the Day</div>
        <div style="font-size:15px;font-weight:800;color:white;margin-bottom:6px">${escHtml(d.skill_of_day.skill)}</div>
        <div style="font-size:12px;color:var(--text-2);line-height:1.5">${escHtml(d.skill_of_day.tip)}</div>
      </div>
    `;
  } catch (e) {
    body.innerHTML = `<div class="card" style="grid-column:1/-1"><p class="muted">Could not load briefing: ${escHtml(e.message)}</p></div>`;
  }
}
window.loadDailyBriefing = loadDailyBriefing;

/* ── Feature 3: Outreach Analytics Dashboard ────────────────────── */
async function loadOutreachAnalytics() {
  const body = $('outreach-body');
  if (!body) return;
  if (!Auth.isLoggedIn()) {
    body.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px">
      <i class="fas fa-lock" style="font-size:40px;color:var(--c-purple);opacity:0.5"></i>
      <p class="muted" style="margin-top:12px">Please log in to view your outreach analytics</p>
      <button class="btn-primary" style="margin-top:12px" onclick="openAuthModal()">Login</button>
    </div>`;
    return;
  }
  body.innerHTML = `<div class="card"><div class="loading-spinner" style="margin:40px auto"></div></div>`;
  try {
    const d = await authApi('GET', '/api/analytics/outreach');
    const f = d.funnel;
    const maxFunnel = f.total || 1;

    // Funnel bars
    const funnelSteps = [
      { label: 'Saved / Discovered', val: f.total, color: 'var(--c-purple)', icon: 'fa-bookmark' },
      { label: 'Applied / Emailed', val: f.applied, color: 'var(--c-blue)', icon: 'fa-paper-plane' },
      { label: 'Replied', val: f.replied, color: 'var(--c-teal)', icon: 'fa-reply' },
      { label: 'Interview', val: f.interview, color: 'var(--c-gold)', icon: 'fa-handshake' },
      { label: 'Offer', val: f.offer, color: 'var(--c-green)', icon: 'fa-trophy' },
    ];
    const funnelHtml = funnelSteps.map(step => {
      const pct = maxFunnel ? Math.max(3, Math.round((step.val / maxFunnel) * 100)) : 3;
      return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <i class="fas ${step.icon}" style="width:16px;color:${step.color}"></i>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
            <span style="color:var(--text-2);font-weight:600">${step.label}</span>
            <span style="color:white;font-weight:bold">${step.val}</span>
          </div>
          <div style="height:8px;background:var(--bg-3);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${step.color};border-radius:4px;transition:width .8s ease"></div>
          </div>
        </div>
      </div>`;
    }).join('');

    // Weekly chart bars
    const maxW = Math.max(...d.weekly_chart.map(w => w.count), 1);
    const weeklyHtml = d.weekly_chart.map(w => {
      const h = maxW ? Math.max(4, Math.round((w.count / maxW) * 80)) : 4;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
        <span style="font-size:11px;font-weight:bold;color:var(--text-2)">${w.count || ''}</span>
        <div style="width:28px;height:${h}px;background:var(--c-purple);border-radius:4px 4px 0 0;min-height:4px"></div>
        <span style="font-size:10px;color:var(--text-2)">${w.day}</span>
      </div>`;
    }).join('');

    // Top categories
    const catHtml = (d.top_categories || []).map((c, i) => {
      const colors = ['var(--c-purple)', 'var(--c-blue)', 'var(--c-green)', 'var(--c-gold)', 'var(--c-teal)'];
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:8px;height:8px;border-radius:50%;background:${colors[i]}"></div>
          <span style="font-size:12px;color:var(--text-1)">${escHtml(c.category)}</span>
        </div>
        <span style="font-size:12px;font-weight:bold;color:white">${c.count}</span>
      </div>`;
    }).join('');

    body.innerHTML = `
      <!-- KPI row -->
      <div class="card" style="display:flex;flex-direction:column;gap:14px">
        <div style="font-size:13px;font-weight:700;color:white"><i class="fas fa-fire" style="color:var(--c-gold)"></i> Hunt Stats</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="text-align:center;padding:10px;background:var(--bg-3);border-radius:10px">
            <div style="font-size:28px;font-weight:900;color:var(--c-purple)">${d.streak_days}</div>
            <div style="font-size:10px;color:var(--text-2)">Day Streak 🔥</div>
          </div>
          <div style="text-align:center;padding:10px;background:var(--bg-3);border-radius:10px">
            <div style="font-size:28px;font-weight:900;color:var(--c-blue)">${d.conversion_rate}%</div>
            <div style="font-size:10px;color:var(--text-2)">Reply Rate</div>
          </div>
          <div style="text-align:center;padding:10px;background:var(--bg-3);border-radius:10px">
            <div style="font-size:28px;font-weight:900;color:var(--c-green)">${d.avg_response_days !== null ? d.avg_response_days + 'd' : '—'}</div>
            <div style="font-size:10px;color:var(--text-2)">Avg. Response</div>
          </div>
          <div style="text-align:center;padding:10px;background:var(--bg-3);border-radius:10px">
            <div style="font-size:28px;font-weight:900;color:var(--c-gold)">${d.avg_fit_score !== null ? d.avg_fit_score + '%' : '—'}</div>
            <div style="font-size:10px;color:var(--text-2)">Avg. Fit Score</div>
          </div>
        </div>
      </div>

      <!-- Funnel -->
      <div class="card">
        <div style="font-size:13px;font-weight:700;color:white;margin-bottom:14px"><i class="fas fa-chart-funnel" style="color:var(--c-purple)"></i> Conversion Funnel</div>
        ${funnelHtml}
        ${f.rejected ? `<div style="font-size:11px;color:var(--text-2);margin-top:6px"><i class="fas fa-times-circle" style="color:#ef4444"></i> ${f.rejected} rejected</div>` : ''}
      </div>

      <!-- Weekly activity -->
      <div class="card">
        <div style="font-size:13px;font-weight:700;color:white;margin-bottom:14px"><i class="fas fa-chart-bar" style="color:var(--c-blue)"></i> This Week's Activity</div>
        <div style="display:flex;justify-content:space-around;align-items:flex-end;height:90px;padding-top:10px">${weeklyHtml}</div>
      </div>

      <!-- Top categories -->
      <div class="card">
        <div style="font-size:13px;font-weight:700;color:white;margin-bottom:12px"><i class="fas fa-tag" style="color:var(--c-gold)"></i> Top Sectors Applied</div>
        ${catHtml || '<p class="muted" style="font-size:12px">Apply to companies to see sector breakdown.</p>'}
      </div>
    `;
  } catch (e) {
    body.innerHTML = `<div class="card"><p class="muted">Could not load analytics: ${escHtml(e.message)}</p></div>`;
  }
}
window.loadOutreachAnalytics = loadOutreachAnalytics;

/* ── Feature 4: Cold Email Scorer ───────────────────────────────── */
async function scoreEmail() {
  const text = ($('email-scorer-text') || {}).value?.trim();
  const company = ($('email-scorer-company') || {}).value?.trim();
  const recipient = ($('email-scorer-recipient') || {}).value?.trim();
  const btn = $('score-email-btn');
  const results = $('email-score-results');
  if (!text || text.length < 30) { toast('Please write at least 30 characters', 'warning'); return; }
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scoring...'; }
  results.innerHTML = '<div class="loading-spinner" style="margin:40px auto"></div>';
  try {
    const d = await api('POST', '/api/score-email', { text, company_name: company || '', recipient_name: recipient || '' });
    const overall = d.overall_score || 0;
    const scoreColor = overall >= 80 ? 'var(--c-green)' : overall >= 60 ? 'var(--c-gold)' : 'var(--c-red, #ef4444)';
    const scoreLabel = overall >= 80 ? 'Excellent' : overall >= 65 ? 'Good' : overall >= 50 ? 'Average' : 'Needs Work';
    const dims = [
      { label: 'Personalization', score: d.personalization_score, feedback: d.personalization_feedback, color: 'var(--c-purple)' },
      { label: 'Clarity', score: d.clarity_score, feedback: d.clarity_feedback, color: 'var(--c-blue)' },
      { label: 'Call-to-Action', score: d.cta_score, feedback: d.cta_feedback, color: 'var(--c-green)' },
      { label: 'Tone', score: d.tone_score, feedback: d.tone_feedback, color: 'var(--c-gold)' },
    ];
    const dimHtml = dims.map(dim => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span style="font-weight:600;color:var(--text-2)">${dim.label}</span>
          <span style="font-weight:bold;color:white">${dim.score}/100</span>
        </div>
        <div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden;margin-bottom:4px">
          <div style="height:100%;width:${dim.score}%;background:${dim.color};border-radius:3px"></div>
        </div>
        <div style="font-size:11px;color:var(--text-2)">${escHtml(dim.feedback || '')}</div>
      </div>`).join('');

    results.innerHTML = `
      <div style="text-align:center;padding:16px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:48px;font-weight:900;color:${scoreColor}">${overall}</div>
        <div style="font-size:13px;font-weight:bold;color:${scoreColor}">${scoreLabel}</div>
        <div style="font-size:11px;color:var(--text-2);margin-top:4px">Overall Email Score</div>
      </div>

      <div style="padding:12px 0">${dimHtml}</div>

      <div style="padding:10px;background:var(--bg-3);border-radius:8px;margin-bottom:10px">
        <div style="font-size:11px;font-weight:700;color:var(--c-green-l);margin-bottom:4px">✅ Strength</div>
        <div style="font-size:12px;color:var(--text-1)">${escHtml(d.top_strength || '')}</div>
      </div>
      <div style="padding:10px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);border-radius:8px;margin-bottom:10px">
        <div style="font-size:11px;font-weight:700;color:#f87171;margin-bottom:4px">⚠️ Top Issue</div>
        <div style="font-size:12px;color:var(--text-1)">${escHtml(d.top_weakness || '')}</div>
      </div>

      ${d.rewritten && d.rewritten !== text ? `
        <div style="margin-top:4px">
          <div style="font-size:11px;font-weight:700;color:var(--c-blue-l);margin-bottom:6px">✨ AI-Rewritten Version</div>
          <div style="font-size:12px;background:var(--bg-3);padding:10px;border-radius:8px;white-space:pre-wrap;line-height:1.6;color:var(--text-1);max-height:160px;overflow-y:auto">${escHtml(d.rewritten)}</div>
          <button class="btn-primary sm" style="margin-top:8px;width:100%" onclick="document.getElementById('email-scorer-text').value=${JSON.stringify(d.rewritten || '')};toast('Email replaced with AI version','success')"><i class='fas fa-magic'></i> Use AI Version</button>
        </div>` : ''}
    `;
  } catch (e) {
    results.innerHTML = `<div class="empty-state"><p class="muted">${escHtml(e.message)}</p></div>`;
    toast(e.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Score My Email'; }
  }
}
window.scoreEmail = scoreEmail;

/* ── Feature 5: Offer Comparator ─────────────────────────────────── */
let _offerSlots = [];

function addOfferSlot() {
  if (_offerSlots.length >= 3) { toast('Maximum 3 offers can be compared', 'warning'); return; }
  const idx = _offerSlots.length;
  _offerSlots.push({});
  renderOfferSlots();
}
window.addOfferSlot = addOfferSlot;

function removeOfferSlot(idx) {
  _offerSlots.splice(idx, 1);
  renderOfferSlots();
}
window.removeOfferSlot = removeOfferSlot;

function renderOfferSlots() {
  const grid = $('offers-grid');
  const addBtn = $('add-offer-btn');
  const compareBtn = $('compare-btn');
  const aiResult = $('offers-ai-result');
  if (!grid) return;
  if (aiResult) { aiResult.style.display = 'none'; aiResult.innerHTML = ''; }
  if (addBtn) addBtn.style.display = _offerSlots.length >= 3 ? 'none' : '';
  if (compareBtn) compareBtn.style.display = _offerSlots.length >= 1 ? '' : 'none';

  const perksOptions = [
    { id: 'health_insurance', label: '🏥 Health Insurance' },
    { id: 'remote', label: '🏠 Remote Work' },
    { id: 'hybrid', label: '🏢 Hybrid' },
    { id: 'flexible_hours', label: '⏰ Flexible Hours' },
    { id: 'meal', label: '🍱 Meal Benefits' },
    { id: 'learning_budget', label: '📚 L&D Budget' },
    { id: 'gym', label: '💪 Gym / Wellness' },
    { id: 'stock', label: '📈 Stock / ESOP' },
  ];

  grid.innerHTML = _offerSlots.map((_, i) => `
    <div class="card" style="position:relative;display:flex;flex-direction:column;gap:12px">
      <button onclick="removeOfferSlot(${i})" style="position:absolute;top:12px;right:12px;background:none;border:none;cursor:pointer;color:var(--text-2)"><i class="fas fa-times"></i></button>
      <div style="font-size:13px;font-weight:700;color:white">Offer ${i+1}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><label class="form-label" style="font-size:11px">Company</label><input class="form-input" id="offer-company-${i}" placeholder="e.g. Infosys"></div>
        <div><label class="form-label" style="font-size:11px">Role</label><input class="form-input" id="offer-role-${i}" placeholder="e.g. SDE-2"></div>
        <div><label class="form-label" style="font-size:11px">CTC (LPA)</label><input class="form-input" id="offer-ctc-${i}" type="number" placeholder="12"></div>
        <div><label class="form-label" style="font-size:11px">Annual Bonus (LPA)</label><input class="form-input" id="offer-bonus-${i}" type="number" placeholder="1"></div>
        <div><label class="form-label" style="font-size:11px">ESOP Value (LPA)</label><input class="form-input" id="offer-esop-${i}" type="number" placeholder="0"></div>
        <div><label class="form-label" style="font-size:11px">Company Type</label>
          <select class="form-input" id="offer-type-${i}">
            <option value="product">Product</option>
            <option value="service">Service</option>
            <option value="startup">Startup</option>
            <option value="mnc">MNC</option>
          </select>
        </div>
      </div>
      <div>
        <label class="form-label" style="font-size:11px">Perks & Benefits</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${perksOptions.map(p =>
          `<label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;color:var(--text-2)">
            <input type="checkbox" id="offer-perk-${i}-${p.id}" value="${p.id}"> ${p.label}
          </label>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

async function compareOffers() {
  const btn = $('compare-btn');
  const aiResult = $('offers-ai-result');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...'; }
  const perksIds = ['health_insurance','remote','hybrid','flexible_hours','meal','learning_budget','gym','stock'];
  const offers = _offerSlots.map((_, i) => ({
    company: ($(`offer-company-${i}`) || {}).value || '',
    role: ($(`offer-role-${i}`) || {}).value || '',
    ctc: parseFloat(($(`offer-ctc-${i}`) || {}).value) || 0,
    bonus: parseFloat(($(`offer-bonus-${i}`) || {}).value) || 0,
    esop: parseFloat(($(`offer-esop-${i}`) || {}).value) || 0,
    company_type: ($(`offer-type-${i}`) || {}).value || 'service',
    perks: perksIds.filter(pid => ($(`offer-perk-${i}-${pid}`) || {}).checked),
  }));

  try {
    const d = await api('POST', '/api/compare-offers', { offers });
    const cols = d.offers.map((o, i) => {
      const pick = d.ai_pick === (i + 1);
      const ih = o.inhand || {};
      return `
        <div class="card" style="${pick ? 'border:2px solid var(--c-green);background:rgba(16,185,129,0.04)' : ''}position:relative;flex:1;min-width:220px">
          ${pick ? `<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--c-green);color:#000;font-size:10px;font-weight:700;padding:2px 10px;border-radius:10px">⭐ AI PICK</div>` : ''}
          <div style="font-size:14px;font-weight:800;color:white;margin-bottom:2px">${escHtml(o.company || 'Offer ' + (i+1))}</div>
          <div style="font-size:11px;color:var(--text-2);margin-bottom:12px">${escHtml(o.role || '')}</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;justify-content:space-between;font-size:12px">
              <span class="muted">CTC</span><span style="font-weight:bold;color:white">${o.ctc ? o.ctc.toFixed(1) + ' LPA' : '—'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px">
              <span class="muted">Monthly In-Hand</span><span style="font-weight:bold;color:var(--c-green)">₹${ih.monthly_inhand ? (ih.monthly_inhand/1000).toFixed(0) + 'K' : '—'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px">
              <span class="muted">Annual Tax (est.)</span><span style="font-weight:bold;color:var(--c-gold)">₹${ih.estimated_tax ? Math.round(ih.estimated_tax/1000) + 'K' : '—'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px">
              <span class="muted">Growth Potential</span>
              <span style="font-weight:bold;color:${o.growth_score >= 80 ? 'var(--c-green)' : 'var(--c-gold)'}">${o.growth_score}/100</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px">
              <span class="muted">Perks Score</span>
              <span style="font-weight:bold;color:var(--c-blue)">${o.perk_score}/100</span>
            </div>
          </div>
        </div>`;
    });

    if (aiResult) {
      aiResult.style.display = 'block';
      aiResult.innerHTML = `
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px">${cols.join('')}</div>
        <div class="card" style="background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(59,130,246,0.05));border:1px solid rgba(16,185,129,0.2)">
          <div style="font-size:13px;font-weight:700;color:white;margin-bottom:8px"><i class="fas fa-robot" style="color:var(--c-green)"></i> AI Recommendation</div>
          <div style="font-size:13px;color:var(--text-1);line-height:1.6">${escHtml(d.ai_reason)}</div>
        </div>`;
    }
    $('offers-grid').scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    toast('Compare failed: ' + e.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-scale-balanced"></i> Compare & Get AI Pick'; }
  }
}
window.compareOffers = compareOffers;
