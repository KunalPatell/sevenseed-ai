/**
 * vertex_client.js
 * Drop this <script> into any HTML feature page to get easy AI access.
 *
 * Usage in HTML:
 *   <script src="../vertex_client.js"></script>
 *
 * Then in your page JS:
 *   const result = await Vertex.ask("Explain photosynthesis in 2 lines");
 *   const chat   = await Vertex.chat([{role:"user", content:"Hello!"}]);
 *
 * Calls the hub's same-origin LLM gateway (/api/llm/*). This file previously
 * pointed at a developer-only proxy on http://localhost:4000, so every page
 * using it was broken in production. If the visitor saved their own key on the
 * BYOK page it is sent per request (it never leaves their browser otherwise).
 */

const Vertex = (() => {
  const BASE_URL = '';

  const KEY_SOURCES = {
    'X-Groq-API-Key': ['user_groq_key', 'ss_key_groq', 'groq_api_key'],
    'X-Gemini-API-Key': ['user_gemini_key', 'ss_key_gemini', 'ss_apikey_gemini'],
    'X-OpenAI-API-Key': ['user_openai_key', 'ss_key_openai'],
  };

  function byokHeaders() {
    const h = { 'Content-Type': 'application/json' };
    try {
      for (const [header, names] of Object.entries(KEY_SOURCES)) {
        for (const n of names) {
          const v = (localStorage.getItem(n) || '').trim();
          if (v) { h[header] = v; break; }
        }
      }
    } catch (_) { /* storage blocked: fall back to shared key */ }
    return h;
  }

  async function post(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers: byokHeaders(), body: JSON.stringify(body) });
    let data = {};
    try { data = await res.json(); } catch (_) { /* non-JSON error */ }
    if (!res.ok) throw new Error(data.detail || data.error || `AI request failed (${res.status})`);
    return data.text;
  }

  /** Health check — true when an AI provider is reachable (server key or BYOK). */
  async function isOnline() {
    try {
      const r = await fetch(`${BASE_URL}/api/llm/health`, { headers: byokHeaders(), signal: AbortSignal.timeout(4000) });
      return r.ok && (await r.json()).ok === true;
    } catch { return false; }
  }

  /**
   * Single prompt → text response
   * @param {string} prompt
   * @param {{ system?, temperature?, maxTokens? }} [opts]
   */
  function ask(prompt, opts = {}) {
    const { system, temperature, maxTokens } = opts;
    return post('/api/llm/ask', { prompt, system, temperature, maxTokens });
  }

  /**
   * Multi-turn chat
   * @param {{ role: 'user'|'assistant', content: string }[]} messages
   * @param {{ system?, temperature?, maxTokens? }} [opts]
   */
  function chat(messages, opts = {}) {
    const { system, temperature, maxTokens } = opts;
    return post('/api/llm/chat', { messages, system, temperature, maxTokens });
  }

  /** Show a status indicator element on the page. */
  async function showStatus(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const online = await isOnline();
    const own = Object.keys(byokHeaders()).length > 1;
    el.innerHTML = online
      ? `<span style="color:#34d399;font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:6px;">
           <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;"></span>
           AI ready${own ? ' — using your own key' : ''}
         </span>`
      : `<span style="color:#f87171;font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:6px;">
           <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;"></span>
           AI unavailable — add a free key on the <a href="/byok.html" style="color:inherit;text-decoration:underline;">BYOK page</a>
         </span>`;
  }

  /** Typing animation helper — fast chunked text rendering. */
  async function typeInto(el, text, speed = 1) {
    if (!el) return;
    if (speed <= 0 || text.length > 1500) {
      el.textContent = text;
      return;
    }
    el.textContent = '';
    const chunkSize = Math.max(3, Math.floor(text.length / 60));
    for (let i = 0; i < text.length; i += chunkSize) {
      el.textContent += text.slice(i, i + chunkSize);
      await new Promise(r => setTimeout(r, speed));
    }
    el.textContent = text;
  }

  return { ask, chat, isOnline, showStatus, typeInto, BASE_URL };
})();
