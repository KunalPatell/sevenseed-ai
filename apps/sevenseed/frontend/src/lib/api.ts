// In production this is a static export served by the same FastAPI process as
// the API, so a relative fetch is correct. In `npm run dev` (port 3000) the
// backend runs separately on 8000, so point there instead.
export const API_BASE =
  typeof window !== "undefined" && window.location.port === "3000"
    ? "http://localhost:8000"
    : "";

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, init);
}
