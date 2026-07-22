// Sevenforce portal API layer.
//
// BYOK: visitors can supply their own provider keys so nobody has to pay for
// their usage. Keys live only in this browser's localStorage under the same
// `user_*_key` names the rest of the Sevenseed portfolio uses, and are sent as
// per-request headers — they are never persisted server-side.

export const API_BASE = "/sevenforce";

export const TOKEN_KEY = "sevenforce_token";

/** localStorage key -> request header, matching the backend's middleware. */
export const BYOK_KEYS: Record<string, string> = {
  user_groq_key: "X-Groq-API-Key",
  user_gemini_key: "X-Gemini-API-Key",
  user_openai_key: "X-OpenAI-API-Key",
  user_serpapi_key: "X-SerpAPI-Key",
  user_mistral_key: "X-Mistral-API-Key",
};

export const PROVIDERS = [
  { key: "user_groq_key", label: "Groq", hint: "console.groq.com/keys" },
  { key: "user_gemini_key", label: "Gemini", hint: "aistudio.google.com/apikey" },
  { key: "user_openai_key", label: "OpenAI", hint: "platform.openai.com/api-keys" },
  { key: "user_mistral_key", label: "Mistral", hint: "console.mistral.ai" },
  { key: "user_serpapi_key", label: "SerpAPI", hint: "serpapi.com/manage-api-key" },
] as const;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("sevenforce_offline_mode");
  localStorage.removeItem("sevenforce_offline_username");
}

function buildHeaders(json = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (typeof window !== "undefined") {
    for (const [storageKey, header] of Object.entries(BYOK_KEYS)) {
      const v = localStorage.getItem(storageKey);
      if (v) headers[header] = v;
    }
  }
  return headers;
}

/** POST JSON to a portal endpoint, returning parsed JSON. */
export async function post<T = unknown>(endpoint: string, payload: unknown): Promise<T> {
  const res = await fetch(API_BASE + endpoint, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      (data && ((data as Record<string, string>).detail || (data as Record<string, string>).error)) ||
        `Request failed (HTTP ${res.status})`
    );
  }
  return res.json();
}

/** POST for endpoints that stream back a file (e.g. the .docx exporter). */
export async function postBlob(endpoint: string, payload: unknown): Promise<Blob> {
  const res = await fetch(API_BASE + endpoint, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Request failed (HTTP ${res.status})`);
  return res.blob();
}

export async function login(email: string, password: string) {
  return post<{ token: string; name?: string }>("/api/auth/login", { email, password });
}

export async function signup(name: string, email: string, password: string) {
  return post<{ token: string; name?: string }>("/api/auth/signup", { name, email, password });
}
