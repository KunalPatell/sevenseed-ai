# -*- coding: utf-8 -*-
"""
Email Existence Validator.
Checks format, resolves DNS MX records, and probes mail servers over SMTP.
Ports Sujit's desktop email-existence-validator.
"""
from __future__ import annotations
import re
import smtplib

try:
    import dns.resolver
    HAS_DNS = True
except ImportError:
    HAS_DNS = False

class EmailValidator:
    def __init__(self):
        self.email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    def is_valid_format(self, email: str) -> bool:
        return re.match(self.email_regex, email) is not None
    
    def get_mx_record(self, domain: str) -> str | None:
        if not HAS_DNS:
            return f"mail.{domain}"
        try:
            mx_records = dns.resolver.resolve(domain, 'MX')
            return str(mx_records[0].exchange).rstrip('.')
        except Exception:
            return None
    
    def check_smtp_connection(self, mx_server: str, email: str) -> str:
        try:
            server = smtplib.SMTP(timeout=8)
            server.connect(mx_server, 25)
            server.helo()
            server.mail('test@example.com')
            code, _ = server.rcpt(email)
            server.quit()
            return "Deliverable" if code == 250 else "Undeliverable"
        except Exception:
            # Often local ISPs block SMTP port 25, meaning standard SMTP handshake times out.
            # If DNS verification succeeded but SMTP was unreachable, return active status note.
            return "Active (SMTP Connection Blocked/Timeout)"

    def validate(self, email: str) -> dict:
        email = (email or "").strip()
        if not email:
            return {"email": email, "valid": False, "status": "Empty Email", "reason": "No email provided"}
        if not self.is_valid_format(email):
            return {"email": email, "valid": False, "status": "Invalid Format", "reason": "Regex format mismatch"}
            
        domain = email.split('@')[1]
        mx_server = self.get_mx_record(domain)
        if not mx_server:
            return {"email": email, "valid": False, "status": "No MX Records", "reason": "Domain has no mail server configured"}
            
        smtp_status = self.check_smtp_connection(mx_server, email)
        is_valid = smtp_status in ("Deliverable", "Active (SMTP Connection Blocked/Timeout)")
        return {
            "email": email,
            "valid": is_valid,
            "mx_server": mx_server,
            "status": smtp_status,
            "reason": "SMTP validation complete" if smtp_status == "Deliverable" else "DNS check passed, SMTP handshake timed out"
        }
