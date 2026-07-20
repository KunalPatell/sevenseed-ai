# -*- coding: utf-8 -*-
"""
AVPU WhatsApp Tutor Webhook Integration
========================================
Handles WhatsApp Cloud API subscribe/verify validation and incoming message routing.
"""
import os
import requests
from fastapi import APIRouter, Request, Query, HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse
from app import db
import agents

router = APIRouter()

WA_PHONE_NUMBER_ID = os.getenv("WA_PHONE_NUMBER_ID", "")
WA_ACCESS_TOKEN = os.getenv("WA_ACCESS_TOKEN", "")
WA_VERIFY_TOKEN = os.getenv("WA_VERIFY_TOKEN", "avpu-verify-token-123")

@router.get("/api/whatsapp/webhook")
def whatsapp_verify(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    """WhatsApp webhook verification."""
    if hub_mode == "subscribe" and hub_verify_token == WA_VERIFY_TOKEN:
        return PlainTextResponse(content=hub_challenge)
    raise HTTPException(status_code=403, detail="Verification token mismatch")

@router.post("/api/whatsapp/webhook")
async def whatsapp_webhook(request: Request):
    """WhatsApp incoming message receiver."""
    try:
        body = await request.json()
    except Exception:
        return JSONResponse({"status": "invalid_json"}, status_code=400)

    entry = body.get("entry", [])
    if not entry:
        return {"status": "no_entry"}
        
    changes = entry[0].get("changes", [])
    if not changes:
        return {"status": "no_changes"}
        
    value = changes[0].get("value", {})
    messages = value.get("messages", [])
    if not messages:
        return {"status": "no_messages"}
        
    msg = messages[0]
    from_number = msg.get("from")
    text_obj = msg.get("text", {})
    message_text = text_obj.get("body", "").strip()
    
    if not message_text:
        return {"status": "empty_text"}
        
    session_id = f"wa_{from_number}"
    
    # Run query through the AI Tutor agent loop
    response_data = agents.run_tutor(message_text, session_id, subject="")
    reply_text = response_data.get("reply", "I'm sorry, I could not process your query.")
    
    # Dispath message back via Meta Graph API if credentials exist
    if WA_PHONE_NUMBER_ID and WA_ACCESS_TOKEN:
        url = f"https://graph.facebook.com/v18.0/{WA_PHONE_NUMBER_ID}/messages"
        headers = {
            "Authorization": f"Bearer {WA_ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": from_number,
            "type": "text",
            "text": {
                "body": reply_text
            }
        }
        try:
            r = requests.post(url, json=payload, headers=headers, timeout=10)
            r.raise_for_status()
        except Exception as err:
            print(f"[WhatsApp Webhook] Send message error: {err}")
            
    return {"status": "success", "session_id": session_id, "reply": reply_text}
