# -*- coding: utf-8 -*-
"""
Bounce & Delivery Notice Analyzer.
Ports classification rules from EmailAutomation.
"""
from __future__ import annotations
from typing import Optional

BOUNCE_INVALID_PATTERNS = (
    "550 5.1.1",
    "551 5.1.1",
    "user unknown",
    "no such user",
    "recipient address rejected",
    "address not found",
    "unknown recipient",
    "unknown user",
    "mailbox unavailable",
    "invalid recipient",
)

BOUNCE_SPAM_PATTERNS = (
    "5.7.1",
    "blocked using",
    "message rejected",
    "rejected for policy reasons",
    "spam message rejected",
    "classified as spam",
    "due to spam",
    "unsolicited mail",
    "reputation",
    "feedback report",
    "complaint feedback loop",
    "abuse report",
)

BOUNCE_GENERAL_PATTERNS = (
    "delivery status notification",
    "mail delivery failed",
    "delivery has failed",
    "returned mail",
    "undeliverable",
    "delivery incomplete",
    "delivery failure",
    "delivery permanently failed",
)

def classify_delivery_notice(notice_text: str) -> dict:
    haystack = (notice_text or "").lower()
    
    if any(pattern in haystack for pattern in BOUNCE_INVALID_PATTERNS):
        return {
            "status": "bounced_invalid",
            "label": "Invalid Email Address",
            "is_bounce": True,
            "note": "The recipient server reported that this address does not exist or cannot receive mail."
        }
    if any(pattern in haystack for pattern in BOUNCE_SPAM_PATTERNS):
        return {
            "status": "spam_blocked",
            "label": "Blocked as Spam",
            "is_bounce": True,
            "note": "The recipient server rejected this message because of spam or sending-policy checks."
        }
    if any(pattern in haystack for pattern in BOUNCE_GENERAL_PATTERNS):
        return {
            "status": "bounced",
            "label": "General Bounce",
            "is_bounce": True,
            "note": "A delivery status notice indicates this message was not delivered successfully."
        }
        
    return {
        "status": "delivered",
        "label": "Delivered / Clear",
        "is_bounce": False,
        "note": "No standard bounce or spam patterns detected in the delivery notice text."
    }
