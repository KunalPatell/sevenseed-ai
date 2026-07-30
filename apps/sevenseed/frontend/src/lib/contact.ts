// Contact form submission.
//
// Every venture site is served from the Sevenseed hub's origin (children are
// mounted at /<prefix>/ by the FastAPI orchestrator), and only the hub exposes
// a contact endpoint — the child backends have none. So this absolute path is
// correct from all 8 sites and must NOT be prefixed with a basePath.
//
// The hub validates, rate-limits (5/hour/IP), and persists to SQLite.

export type ContactStatus = "idle" | "sending" | "sent" | "error";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot. Real users leave this empty; bots fill it and get dropped. */
  website?: string;
}

const FALLBACK_EMAIL = "hello@sevenseed.in";

export async function submitContact(payload: ContactPayload): Promise<void> {
  let res: Response;
  try {
    res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website: "", ...payload }),
    });
  } catch {
    // Network failure, offline, or the service is asleep on Render's free tier.
    throw new Error(`Network error — please email ${FALLBACK_EMAIL} instead.`);
  }

  if (res.ok) return;

  let detail = "";
  try {
    detail = (await res.json())?.detail ?? "";
  } catch {
    // Error body was not JSON; fall through to the generic message.
  }
  if (detail) throw new Error(detail);
  throw new Error(
    res.status === 429
      ? "Too many messages sent recently. Please try again in an hour."
      : `Could not send your message — please email ${FALLBACK_EMAIL} instead.`,
  );
}
