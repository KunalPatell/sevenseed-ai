"""Delivery of public contact-form submissions.

WHY THIS EXISTS: /api/contact writes to SQLite at config.DB_PATH, which on Render
defaults to a path *inside the container*. That filesystem is ephemeral — every
deploy and every restart wipes it. So a message could be accepted, stored, and
then silently lost before anyone read it, which is barely better than the fake
forms this replaced.

Two independent paths, so a submission survives even with zero configuration:

1. `log_submission` — always runs. Writes the full message to the application
   log at INFO. Render retains logs beyond the container's lifetime, so this is
   a recoverable trail after the database is gone. It logs the sender's name,
   email and message: that is the founder's own inbound lead data in their own
   logs, which is the point, but it does mean the logs hold personal data and
   should be treated accordingly.

2. `send_email` — runs only when SMTP is configured. Off by default and a no-op
   (with one clear startup line) when the env vars are absent.

Neither path may break the request. A submission that was persisted is a success
even if the notification fails, so both swallow their exceptions and log them.
`log_submission` runs inline (it is cheap); `send_email` is dispatched as a
FastAPI background task, because SMTP can block for its full timeout and the
visitor must not wait on it.

Configure forwarding with:
    SMTP_HOST       e.g. smtp.gmail.com
    SMTP_PORT       default 587 (STARTTLS); use 465 for implicit TLS
    SMTP_USER       login, also the From address unless SMTP_FROM is set
    SMTP_PASSWORD   app password, never the account password
    SMTP_FROM       optional explicit From
    CONTACT_TO      where to deliver; defaults to SMTP_USER
"""

from __future__ import annotations

import logging
import os
import smtplib
from email.message import EmailMessage

log = logging.getLogger("sevenseed.notify")

_TRUNCATE = 4000


def _cfg() -> dict[str, str]:
    return {
        "host": os.environ.get("SMTP_HOST", "").strip(),
        "port": os.environ.get("SMTP_PORT", "587").strip(),
        "user": os.environ.get("SMTP_USER", "").strip(),
        "password": os.environ.get("SMTP_PASSWORD", "").strip(),
        "sender": os.environ.get("SMTP_FROM", "").strip(),
        "to": os.environ.get("CONTACT_TO", "").strip(),
    }


def email_enabled() -> bool:
    c = _cfg()
    return bool(c["host"] and c["user"] and c["password"])


def describe_config() -> str:
    """One line for the startup log, so the operator knows which paths are live."""
    if email_enabled():
        c = _cfg()
        return f"contact email forwarding ON -> {c['to'] or c['user']} via {c['host']}:{c['port']}"
    # ASCII only: this goes to a log that may be read through a cp1252 console,
    # where an em dash arrives as a replacement character.
    return (
        "contact email forwarding OFF (set SMTP_HOST/SMTP_USER/SMTP_PASSWORD to enable). "
        "Submissions are still logged at INFO and written to SQLite, but SQLite here is "
        "wiped on every redeploy, so the log is the durable copy."
    )


def log_submission(name: str, email: str, subject: str, message: str, ip: str = "") -> None:
    """Always-on fallback: put the message somewhere that outlives the container."""
    try:
        log.info(
            "CONTACT_SUBMISSION | name=%r | email=%r | subject=%r | ip=%s | message=%r",
            name, email, subject, ip or "-", message[:_TRUNCATE],
        )
    except Exception:
        log.exception("failed to log a contact submission")


def send_email(name: str, email: str, subject: str, message: str, ip: str = "") -> bool:
    """Forward the submission. Returns True only if the server accepted it.

    Never raises: the caller has already persisted the message and must still
    report success to the visitor.
    """
    if not email_enabled():
        return False

    c = _cfg()
    sender = c["sender"] or c["user"]
    recipient = c["to"] or c["user"]

    msg = EmailMessage()
    msg["Subject"] = f"[Sevenseed] {subject or 'Contact form'} — {name}"
    msg["From"] = sender
    msg["To"] = recipient
    # So a reply in the mail client goes to the person who wrote in, not to self.
    msg["Reply-To"] = email
    msg.set_content(
        f"New submission from the Sevenseed contact form.\n\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Subject: {subject}\n"
        f"IP:      {ip or '-'}\n\n"
        f"{message}\n"
    )

    try:
        port = int(c["port"] or "587")
    except ValueError:
        log.error("SMTP_PORT is not a number: %r — not sending", c["port"])
        return False

    try:
        if port == 465:
            with smtplib.SMTP_SSL(c["host"], port, timeout=15) as s:
                s.login(c["user"], c["password"])
                s.send_message(msg)
        else:
            with smtplib.SMTP(c["host"], port, timeout=15) as s:
                s.starttls()
                s.login(c["user"], c["password"])
                s.send_message(msg)
        log.info("forwarded contact submission from %s to %s", email, recipient)
        return True
    except Exception:
        # Deliberately broad: DNS, auth, TLS and timeout failures all end here,
        # and none of them should turn a saved message into an error for the user.
        log.exception("could not forward contact submission from %s", email)
        return False
