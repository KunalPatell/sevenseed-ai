// Comonk is served under the Sevenseed hub's /comonk-ai subpath proxy (same
// pattern as the hub's other 7 children — see child_processes.py), so API
// calls in production must be prefixed with that same basePath. In `npm run
// dev` (port 3000) the backend runs separately on 8000, so point there
// instead - matches comonk_backend.py's own `PORT` default and how every
// other app in this codebase does local dev.
export const API_BASE =
  typeof window !== "undefined" && window.location.port === "3000"
    ? "http://localhost:8000"
    : "/comonk-ai";

const BYOK_HEADER_KEYS: Record<string, string> = {
  "x-api-key-groq": "byok_groq_key",
  "x-api-key-gemini": "byok_gemini_key",
  "x-api-key-openrouter": "byok_openrouter_key",
  "x-api-key-mistral": "byok_mistral_key",
  "x-api-key-youtube": "byok_youtube_key",
  "x-api-key-github": "byok_github_key",
  "x-api-key-newsapi": "byok_newsapi_key",
  "x-api-key-adzuna-id": "byok_adzuna_id",
  "x-api-key-adzuna-key": "byok_adzuna_key",
  "x-api-key-hunter": "byok_hunter_key",
  "x-api-key-twilio-sid": "byok_twilio_sid",
  "x-api-key-twilio-token": "byok_twilio_token",
};

function byokHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  for (const [header, storageKey] of Object.entries(BYOK_HEADER_KEYS)) {
    const v = localStorage.getItem(storageKey);
    if (v) out[header] = v;
  }
  return out;
}

function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("comonk_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Public (no-auth) call - still attaches BYOK headers so demo/free endpoints
 * respect a visitor's own keys, matching comonk_backend.py's
 * _get_providers_for_request precedence (header key wins over server env). */
export async function api(
  method: string,
  path: string,
  body?: unknown,
  isForm = false
): Promise<any> {
  const init: RequestInit = { method, headers: { ...byokHeaders() } };
  if (body !== undefined) {
    if (isForm) {
      init.body = body as FormData;
    } else {
      (init.headers as Record<string, string>)["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = await res.json();
      detail = j.detail || j.error || detail;
    } catch {
      // ignore - body wasn't JSON
    }
    throw new Error(detail);
  }
  return res.json();
}

/** Authenticated call - adds the Bearer token on top of api(). */
export async function authApi(method: string, path: string, body?: unknown, isForm = false): Promise<any> {
  const init: RequestInit = { method, headers: { ...byokHeaders(), ...authHeader() } };
  if (body !== undefined) {
    if (isForm) {
      init.body = body as FormData;
    } else {
      (init.headers as Record<string, string>)["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = await res.json();
      detail = j.detail || j.error || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return res.json();
}
