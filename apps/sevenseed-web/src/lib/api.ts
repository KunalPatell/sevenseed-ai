// Super-Suite API layer.
//
// Same-origin by default: the FastAPI backend (apps/comonk) serves this static
// dashboard AND the APIs, so relative "/api/*" just works in production. For
// local dev you can point elsewhere with NEXT_PUBLIC_API_URL.
//
// BYOK: visitors bring their own provider keys (stored only in this browser)
// so nobody pays for their usage. Sent as per-request headers, never persisted.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const BYOK: Record<string, string> = {
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
  { key: "user_serpapi_key", label: "SerpAPI", hint: "serpapi.com" },
] as const;

function headers(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    for (const [k, header] of Object.entries(BYOK)) {
      const v = localStorage.getItem(k);
      if (v) h[header] = v;
    }
  }
  return h;
}

export async function callTool(
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(API_BASE + path, {
    method,
    headers: headers(),
    ...(method === "POST" ? { body: JSON.stringify(body ?? {}) } : {}),
  });
  const text = await res.text();
  let data: unknown = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* leave as text */
  }
  if (!res.ok) {
    const detail =
      (data as { detail?: unknown })?.detail ??
      (data as { error?: unknown })?.error ??
      `Request failed (HTTP ${res.status})`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data;
}

export async function fetchOpenApi(): Promise<OpenApiDoc> {
  const res = await fetch(API_BASE + "/openapi.json");
  if (!res.ok) throw new Error("Could not load the API schema.");
  return res.json();
}

// ── minimal OpenAPI typing we rely on ──────────────────────────────
export interface OpenApiDoc {
  paths: Record<string, Record<string, unknown>>;
  components?: { schemas?: Record<string, OpenApiSchema> };
}
export interface OpenApiSchema {
  properties?: Record<string, OpenApiProp>;
  required?: string[];
}
export interface OpenApiProp {
  type?: string;
  title?: string;
  default?: unknown;
  enum?: string[];
  anyOf?: OpenApiProp[];
  items?: OpenApiProp;
}
