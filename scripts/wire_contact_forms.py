"""Wire the venture contact forms to the hub's real /api/contact endpoint.

Every site shipped a form that faked success: it slept 900ms and printed a
thank-you without sending anything anywhere. The hub already has a working
endpoint (validation + honeypot + rate limit + SQLite persist) and every child
is served from the hub's origin, so they can all post to it.

This rewrites, per app: the import, the state, the submit handler, and the
button/status JSX. One-shot migration — kept in-repo as the record of it.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "apps"

# app dir -> (subject line stored with the message, success text, accent hex)
APPS = {
    "breakdown-factor": (
        "Construction project request",
        "Message received! Our team replies within 1 business day.",
        "#f59e0b",
    ),
    "avpu": (
        "AVPU course / admission enquiry",
        "Thank you! Your query has been logged with the AVPU team.",
        "#f59e0b",
    ),
    "avp-emart": (
        "AVP Emart enquiry",
        "Message received! We'll be in touch.",
        "#6366f1",
    ),
    "decode-forest-pharmacy": (
        "Decode Pharmacy enquiry",
        "Message received! A volunteer will respond shortly.",
        "#10b981",
    ),
    "avp-charitable-trust": (
        "Donation / 80G enquiry",
        "Thank you! Your donation enquiry has been logged.",
        "#f59e0b",
    ),
}

HANDLER = '''  const onContact = async (e: React.FormEvent) => {{
    e.preventDefault();
    setContactStatus("sending");
    setFeedbackMsg("Sending…");
    try {{
      await submitContact({{
        name: contactName,
        email: contactEmail,
        subject: "{subject}",
        message: contactMsg,
        website: honeypot,
      }});
      setContactStatus("sent");
      setFeedbackMsg("{success}");
      setContactName(""); setContactEmail(""); setContactMsg("");
    }} catch (err) {{
      setContactStatus("error");
      setFeedbackMsg(err instanceof Error ? err.message : "Something went wrong.");
    }}
  }};'''

JSX = '''                {{/* Honeypot — visually hidden, never focusable. Bots fill it, users don't. */}}
                <input
                  type="text" tabIndex={{-1}} autoComplete="off" aria-hidden="true"
                  value={{honeypot}} onChange={{e => setHoneypot(e.target.value)}}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <button
                  type="submit"
                  disabled={{contactStatus === "sending"}}
                  className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{contactStatus === "sending" ? "Sending…" : "{label}"}}
                </button>
                {{feedbackMsg && (
                  <p
                    role="status"
                    className={{`text-xs font-semibold text-center ${{
                      contactStatus === "error" ? "text-red-400"
                        : contactStatus === "sent" ? "text-emerald-400"
                        : "text-[{accent}]"
                    }}`}}
                  >
                    {{feedbackMsg}}
                  </p>
                )}}'''

STATE = '''  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [contactStatus, setContactStatus] = useState<ContactStatus>("idle");
  const [honeypot, setHoneypot] = useState("");'''


def patch(app: str, subject: str, success: str, accent: str) -> None:
    path = ROOT / app / "frontend" / "src" / "app" / "page.tsx"
    src = original = path.read_text(encoding="utf-8")

    # 1. import, right after the last "@/components/..." import
    comp_imports = list(re.finditer(r'^import .*? from "@/components/.*?";$', src, re.M))
    if not comp_imports:
        raise SystemExit(f"{app}: no @/components import to anchor onto")
    end = comp_imports[-1].end()
    src = src[:end] + '\nimport { submitContact, type ContactStatus } from "@/lib/contact";' + src[end:]

    # 2. state
    old_state = '  const [feedbackMsg, setFeedbackMsg] = useState("");'
    if src.count(old_state) != 1:
        raise SystemExit(f"{app}: expected exactly one feedbackMsg declaration")
    src = src.replace(old_state, STATE)

    # 3. handler — match the whole faked body
    handler_re = re.compile(
        r"  const onContact = async \(e: React\.FormEvent\) => \{\n"
        r"    e\.preventDefault\(\);\n"
        r'    setFeedbackMsg\("Sending…"\);\n'
        r"    await new Promise\(r => setTimeout\(r, 900\)\);\n"
        r"    setFeedbackMsg\(.*?\);\n"
        r'    setContactName\(""\); setContactEmail\(""\); setContactMsg\(""\);\n'
        r"  \};"
    )
    src, n = handler_re.subn(
        lambda _: HANDLER.format(subject=subject, success=success), src
    )
    if n != 1:
        raise SystemExit(f"{app}: faked onContact handler not found (matched {n})")

    # 4. button + status line
    jsx_re = re.compile(
        r'                <button type="submit" className="btn-primary w-full text-base">\n'
        r"                  (?P<label>.*?)\n"
        r"                </button>\n"
        r"(?P<gap>\s*)"
        r'\{feedbackMsg && <p className="text-xs text-\[#[0-9a-fA-F]{6}\] font-semibold text-center">\{feedbackMsg\}</p>\}'
    )
    match = jsx_re.search(src)
    if not match:
        raise SystemExit(f"{app}: submit button / feedback JSX not found")
    src = src[: match.start()] + JSX.format(label=match["label"].strip(), accent=accent) + src[match.end():]

    if src == original:
        raise SystemExit(f"{app}: nothing changed")
    path.write_text(src, encoding="utf-8")
    print(f"  patched {app}")


def main() -> int:
    print("Wiring contact forms to /api/contact:")
    for app, (subject, success, accent) in APPS.items():
        patch(app, subject, success, accent)
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
