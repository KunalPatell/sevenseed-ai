# -*- coding: utf-8 -*-
"""
Sevenseed Hub - Dual-Engine Quota & BYOK Proxy Middleware.

Handles:
1. BYOK Key Decryption for FREE_BYOK users.
2. Monthly Token Quota enforcement for PRO_STARTER / ENTERPRISE users.
3. Token usage accounting & logging into token_usage_logs table.
"""
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Tuple, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from db.models import Workspace, UserAPIKey, TokenUsageLog
from auth.security import decrypt_api_key

# Plan Token Quotas (Monthly)
PLAN_TOKEN_QUOTAS = {
    "FREE_BYOK": 0,             # Unlimited, but requires user BYOK key
    "PRO_STARTER": 500_000,      # 500k tokens / month
    "ENTERPRISE": 5_000_000,    # 5M tokens / month
}

# Platform Master Keys from Environment (for Managed SaaS Tier)
PLATFORM_MASTER_KEYS = {
    "groq": os.getenv("GROQ_API_KEY", ""),
    "gemini": os.getenv("GEMINI_API_KEY", ""),
    "openai": os.getenv("OPENAI_API_KEY", ""),
}


def get_current_month_token_usage(db: Session, workspace_id: str) -> int:
    """Calculate total tokens consumed by workspace in the current calendar month."""
    now = datetime.utcnow()
    start_of_month = datetime(now.year, now.month, 1)
    
    total = (
        db.query(func.sum(TokenUsageLog.total_tokens))
        .filter(
            TokenUsageLog.workspace_id == workspace_id,
            TokenUsageLog.is_byok == False,
            TokenUsageLog.timestamp >= start_of_month,
        )
        .scalar()
    )
    return total or 0


def resolve_ai_credentials(
    db: Session, workspace: Workspace, provider: str = "groq"
) -> Tuple[str, bool]:
    """
    Resolve API key and BYOK flag for an AI request based on workspace plan.
    
    Returns:
        Tuple[api_key, is_byok]
    
    Raises:
        HTTPException 402 if BYOK key is missing on Free plan.
        HTTPException 429 if Managed monthly quota is exceeded.
    """
    provider_clean = provider.strip().lower()
    plan = workspace.plan_tier or "FREE_BYOK"
    
    # 1. FREE_BYOK Plan: Must use user's encrypted key from UserAPIKey table
    if plan == "FREE_BYOK":
        user_key_record = (
            db.query(UserAPIKey)
            .filter(
                UserAPIKey.workspace_id == workspace.id,
                UserAPIKey.provider == provider_clean,
                UserAPIKey.is_valid == True,
            )
            .first()
        )
        if not user_key_record or not user_key_record.encrypted_key:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"No active {provider_clean.upper()} API key found in BYOK Vault. Please add your API key in Settings or upgrade to Pro.",
            )
        decrypted_key = decrypt_api_key(user_key_record.encrypted_key)
        if not decrypted_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to decrypt {provider_clean.upper()} API key from vault.",
            )
        return decrypted_key, True

    # 2. Managed SaaS Plan (PRO_STARTER / ENTERPRISE): Check monthly quota
    quota_limit = PLAN_TOKEN_QUOTAS.get(plan, 500_000)
    current_usage = get_current_month_token_usage(db, workspace.id)
    
    if current_usage >= quota_limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Monthly token quota exceeded ({current_usage:,} / {quota_limit:,} tokens used). Please upgrade plan or switch to BYOK mode.",
        )
        
    master_key = PLATFORM_MASTER_KEYS.get(provider_clean) or os.getenv(f"{provider_clean.upper()}_API_KEY", "")
    if not master_key:
        # Fallback to checking if user provided a BYOK key anyway
        user_key_record = (
            db.query(UserAPIKey)
            .filter(UserAPIKey.workspace_id == workspace.id, UserAPIKey.provider == provider_clean)
            .first()
        )
        if user_key_record and user_key_record.encrypted_key:
            return decrypt_api_key(user_key_record.encrypted_key), True
            
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Platform master API key for {provider_clean.upper()} is not configured.",
        )
        
    return master_key, False


def log_token_usage(
    db: Session,
    workspace_id: str,
    user_id: Optional[str],
    app_slug: str,
    model_name: str,
    prompt_tokens: int = 0,
    completion_tokens: int = 0,
    is_byok: bool = False,
) -> TokenUsageLog:
    """Log an AI request's token usage into the audit database."""
    total = prompt_tokens + completion_tokens
    log_entry = TokenUsageLog(
        workspace_id=workspace_id,
        user_id=user_id,
        app_slug=app_slug,
        model_name=model_name,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=total,
        is_byok=is_byok,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry


def get_workspace_quota_stats(db: Session, workspace: Workspace) -> Dict[str, Any]:
    """Get monthly usage stats and percentage consumed for a workspace."""
    plan = workspace.plan_tier or "FREE_BYOK"
    limit = PLAN_TOKEN_QUOTAS.get(plan, 0)
    current_usage = get_current_month_token_usage(db, workspace.id)
    
    percentage = 0.0
    if limit > 0:
        percentage = round((current_usage / limit) * 100, 2)
        
    return {
        "plan_tier": plan,
        "monthly_limit": limit,
        "current_usage": current_usage,
        "percentage_used": min(percentage, 100.0),
        "is_byok_mode": plan == "FREE_BYOK",
    }
