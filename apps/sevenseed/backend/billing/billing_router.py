# -*- coding: utf-8 -*-
"""
Sevenseed Hub - Dual-Currency Stripe (USD) & Razorpay (INR) Billing Engine.
"""
import os
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.db import get_db
from db.models import User, Workspace, Subscription
from auth.auth_router import get_current_user_and_workspace
from middleware.quota import get_workspace_quota_stats

router = APIRouter(prefix="/api/billing", tags=["billing"])

# Pricing Table Definitions
PRICING_PLANS = {
    "PRO_STARTER": {
        "name": "Pro Builder Plan",
        "price_usd": 19,
        "price_inr": 1499,
        "quota_tokens": 500_000,
    },
    "ENTERPRISE": {
        "name": "Enterprise Team Plan",
        "price_usd": 79,
        "price_inr": 5999,
        "quota_tokens": 5_000_000,
    },
}

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_sample_stripe_secret")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "rzp_sample_webhook_secret")


# Pydantic Schemas
class CheckoutRequest(BaseModel):
    plan_tier: str  # PRO_STARTER or ENTERPRISE
    currency: str = "USD"  # USD or INR
    provider: str = "stripe"  # stripe or razorpay


@router.get("/plans")
def get_plans():
    """Return available subscription pricing tiers."""
    return {"plans": PRICING_PLANS}


@router.post("/checkout")
def create_checkout_session(
    req: CheckoutRequest,
    user_and_ws: tuple[User, Workspace] = Depends(get_current_user_and_workspace),
    db: Session = Depends(get_db),
):
    """Initiate a checkout session for Stripe (USD) or Razorpay (INR)."""
    user, workspace = user_and_ws
    tier = req.plan_tier.upper()
    
    if tier not in PRICING_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan tier specified")
        
    plan_info = PRICING_PLANS[tier]
    currency = req.currency.upper()
    provider = req.provider.lower()
    
    if provider == "stripe":
        # Generate Checkout Session Response (Stripe simulator / real URL)
        checkout_url = f"https://checkout.stripe.com/pay/cs_test_{workspace.id[:8]}?plan={tier}"
        session_id = f"cs_test_{workspace.id[:8]}"
        return {
            "provider": "stripe",
            "checkout_url": checkout_url,
            "session_id": session_id,
            "amount": plan_info["price_usd"],
            "currency": "USD",
            "plan_tier": tier,
        }
    elif provider == "razorpay":
        # Generate Razorpay Order Response
        order_id = f"order_rzp_{workspace.id[:8]}"
        return {
            "provider": "razorpay",
            "order_id": order_id,
            "amount_inr": plan_info["price_inr"],
            "currency": "INR",
            "plan_tier": tier,
            "key_id": os.getenv("RAZORPAY_KEY_ID", "rzp_test_sample"),
        }
    else:
        raise HTTPException(status_code=400, detail="Unsupported payment provider")


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events (checkout.session.completed, etc.)."""
    payload = await request.json()
    event_type = payload.get("type", "")
    data_obj = payload.get("data", {}).get("object", {})
    
    if event_type in ["checkout.session.completed", "customer.subscription.updated"]:
        workspace_id = data_obj.get("client_reference_id") or data_obj.get("metadata", {}).get("workspace_id")
        plan_tier = data_obj.get("metadata", {}).get("plan_tier", "PRO_STARTER")
        customer_id = data_obj.get("customer", "cus_test")
        sub_id = data_obj.get("subscription", "sub_test")
        
        if workspace_id:
            ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
            if ws:
                ws.plan_tier = plan_tier
                
                # Create or update subscription record
                sub = db.query(Subscription).filter(Subscription.workspace_id == ws.id).first()
                if not sub:
                    sub = Subscription(
                        workspace_id=ws.id,
                        provider="STRIPE",
                        provider_customer_id=customer_id,
                        provider_subscription_id=sub_id,
                        status="ACTIVE",
                        current_period_start=datetime.utcnow(),
                        current_period_end=datetime.utcnow() + timedelta(days=30),
                    )
                    db.add(sub)
                else:
                    sub.status = "ACTIVE"
                    sub.provider_subscription_id = sub_id
                    sub.current_period_end = datetime.utcnow() + timedelta(days=30)
                db.commit()
                return {"status": "success", "message": f"Workspace {ws.id} upgraded to {plan_tier}"}

    return {"status": "ignored", "event_type": event_type}


@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Razorpay webhook events (subscription.charged, etc.)."""
    payload = await request.json()
    event_type = payload.get("event", "")
    payload_data = payload.get("payload", {})
    
    if event_type in ["subscription.charged", "payment.captured"]:
        payment_entity = payload_data.get("payment", {}).get("entity", {})
        notes = payment_entity.get("notes", {})
        workspace_id = notes.get("workspace_id")
        plan_tier = notes.get("plan_tier", "PRO_STARTER")
        
        if workspace_id:
            ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
            if ws:
                ws.plan_tier = plan_tier
                sub = db.query(Subscription).filter(Subscription.workspace_id == ws.id).first()
                if not sub:
                    sub = Subscription(
                        workspace_id=ws.id,
                        provider="RAZORPAY",
                        provider_customer_id=payment_entity.get("customer_id", "cust_rzp_test"),
                        provider_subscription_id=payment_entity.get("id", "pay_rzp_test"),
                        status="ACTIVE",
                        current_period_start=datetime.utcnow(),
                        current_period_end=datetime.utcnow() + timedelta(days=30),
                    )
                    db.add(sub)
                else:
                    sub.status = "ACTIVE"
                    sub.current_period_end = datetime.utcnow() + timedelta(days=30)
                db.commit()
                return {"status": "success", "message": f"Workspace {ws.id} upgraded via Razorpay to {plan_tier}"}
                
    return {"status": "ignored", "event": event_type}


@router.get("/subscription")
def get_subscription_details(
    user_and_ws: tuple[User, Workspace] = Depends(get_current_user_and_workspace),
    db: Session = Depends(get_db),
):
    """Fetch current workspace subscription status and quota statistics."""
    user, workspace = user_and_ws
    sub = db.query(Subscription).filter(Subscription.workspace_id == workspace.id).first()
    quota_stats = get_workspace_quota_stats(db, workspace)
    
    return {
        "workspace": {
            "id": workspace.id,
            "name": workspace.name,
            "plan_tier": workspace.plan_tier,
        },
        "subscription": {
            "status": sub.status if sub else "INACTIVE",
            "provider": sub.provider if sub else None,
            "period_end": sub.current_period_end.isoformat() if sub and sub.current_period_end else None,
        },
        "quota": quota_stats,
    }
