/**
 * vertex_client.js
 * Drop this <script> into any HTML feature page to get easy Vertex AI access.
 *
 * Usage in HTML:
 *   <script src="../vertex_client.js"></script>
 *
 * Then in your page JS:
 *   const result = await Vertex.ask("Explain photosynthesis in 2 lines");
 *   const chat   = await Vertex.chat([{role:"user", content:"Hello!"}]);
 */

const Vertex = (() => {
  const BASE_URL = 'http://localhost:4000';

  /** Simple health check — call on page load to verify server is up */
  async function isOnline() {
    try {
      const r = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      return r.ok;
    } catch { return false; }
  }

  /**
   * Single prompt → text response
   * @param {string} prompt
   * @param {{ model?, system?, temperature?, maxTokens? }} [opts]
   * @returns {Promise<string>}
   */
  async function ask(prompt, opts = {}) {
    const res = await fetch(`${BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ...opts }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Vertex AI error');
    return data.text;
  }

  /**
   * Multi-turn chat
   * @param {{ role: 'user'|'assistant', content: string }[]} messages
   * @param {{ model?, system? }} [opts]
   * @returns {Promise<string>}
   */
  async function chat(messages, opts = {}) {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, ...opts }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Vertex AI error');
    return data.text;
  }

  /**
   * Show a status indicator element on the page
   * @param {string} elementId — id of element to inject status into
   */
  async function showStatus(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const online = await isOnline();
    el.innerHTML = online
      ? `<span style="color:#34d399;font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:6px;">
           <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;"></span>
           Vertex AI (Gemini 3.8 Flash) — Ready
         </span>`
      : `<span style="color:#f87171;font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:6px;">
           <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;"></span>
           Vertex AI Offline — run: <code>cd vertex_dev && node server.js</code>
         </span>`;
  }

  /**
   * Typing animation helper — fast chunked text rendering
   * @param {HTMLElement} el
   * @param {string} text
   * @param {number} [speed=1] ms per step
   */
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
