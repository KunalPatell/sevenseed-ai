// In production this app is served under the Sevenseed hub at the /breakdown
// prefix (see apps/sevenseed/backend/child_processes.py), and the hub proxies
// /breakdown/api/* to this app's own backend - so the prefix must be included,
// not just a bare "/api/...". In `npm run dev` (port 3000) the backend runs
// standalone on 8000 with no prefix, so point there instead.
export const API_BASE =
  typeof window !== "undefined" && window.location.port === "3000"
    ? "http://localhost:8000"
    : "/breakdown";

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, init);
}
