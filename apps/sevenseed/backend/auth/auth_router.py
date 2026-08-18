# -*- coding: utf-8 -*-
"""
Sevenseed Hub - Authentication & BYOK Vault API Router.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Header, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from db.db import get_db
from db.models import User, Workspace, WorkspaceMember, UserAPIKey
from auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    encrypt_api_key,
    decrypt_api_key,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


# Pydantic Schemas
class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class APIKeySaveRequest(BaseModel):
    provider: str  # groq, gemini, openai, anthropic
    api_key: str


def get_current_user_and_workspace(
    authorization: Optional[str] = Header(None), db: Session = Depends(get_db)
) -> tuple[User, Workspace]:
    """Dependency to extract authenticated User and Workspace from JWT Authorization Header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload["sub"]
    workspace_id = payload.get("workspace_id")
    
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
    workspace = None
    if workspace_id:
        workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
        
    if not workspace:
        # Fallback to user's first owned workspace
        workspace = db.query(Workspace).filter(Workspace.owner_id == user.id).first()
        
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active workspace found for user")
        
    return user, workspace


@router.post("/register")
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user and create their default workspace."""
    email_clean = req.email.strip().lower()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    # 1. Create User
    user = User(
        email=email_clean,
        password_hash=hash_password(req.password),
        full_name=req.full_name.strip() if req.full_name else None,
    )
    db.add(user)
    db.flush()
    
    # 2. Create Default Workspace
    ws_name = f"{user.full_name or 'User'}'s Workspace"
    ws_slug = f"ws-{user.id[:8]}"
    workspace = Workspace(
        name=ws_name,
        slug=ws_slug,
        owner_id=user.id,
        plan_tier="FREE_BYOK",
    )
    db.add(workspace)
    db.flush()
    
    # 3. Create Member relationship (OWNER)
    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=user.id,
        role="OWNER",
    )
    db.add(member)
    db.commit()
    db.refresh(user)
    db.refresh(workspace)
    
    # Issue Access Token
    token = create_access_token({"sub": user.id, "workspace_id": workspace.id, "email": user.email})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
        },
        "workspace": {
            "id": workspace.id,
            "name": workspace.name,
            "plan_tier": workspace.plan_tier,
        },
    }


@router.post("/login")
def login(req: UserLoginRequest, response: Response, db: Session = Depends(get_db)):
    """Authenticate user and issue JWT Access Token."""
    email_clean = req.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    # Find active workspace
    workspace = db.query(Workspace).filter(Workspace.owner_id == user.id).first()
    if not workspace:
        # Fallback to membership
        mem = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == user.id).first()
        if mem:
            workspace = mem.workspace

    ws_id = workspace.id if workspace else None
    token = create_access_token({"sub": user.id, "workspace_id": ws_id, "email": user.email})
    
    # Set HTTP-only Cookie for security
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
        },
        "workspace": {
            "id": workspace.id if workspace else None,
            "name": workspace.name if workspace else "Default Workspace",
            "plan_tier": workspace.plan_tier if workspace else "FREE_BYOK",
        },
    }


@router.get("/me")
def get_me(user_and_ws: tuple[User, Workspace] = Depends(get_current_user_and_workspace)):
    """Get profile of current authenticated user and workspace."""
    user, workspace = user_and_ws
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat(),
        },
        "workspace": {
            "id": workspace.id,
            "name": workspace.name,
            "slug": workspace.slug,
            "plan_tier": workspace.plan_tier,
        },
    }


@router.post("/keys")
def save_api_key(
    req: APIKeySaveRequest,
    user_and_ws: tuple[User, Workspace] = Depends(get_current_user_and_workspace),
    db: Session = Depends(get_db),
):
    """Save or update an encrypted BYOK API key in the workspace vault."""
    user, workspace = user_and_ws
    provider_clean = req.provider.strip().lower()
    
    if provider_clean not in ["groq", "gemini", "openai", "anthropic"]:
        raise HTTPException(status_code=400, detail="Unsupported API provider")
        
    encrypted = encrypt_api_key(req.api_key)
    
    existing = (
        db.query(UserAPIKey)
        .filter(UserAPIKey.workspace_id == workspace.id, UserAPIKey.provider == provider_clean)
        .first()
    )
    
    if existing:
        existing.encrypted_key = encrypted
        existing.is_valid = True
    else:
        new_key = UserAPIKey(
            workspace_id=workspace.id,
            provider=provider_clean,
            encrypted_key=encrypted,
            is_valid=True,
        )
        db.add(new_key)
        
    db.commit()
    return {"status": "success", "message": f"{provider_clean.upper()} API key saved securely in BYOK Vault"}


@router.get("/keys")
def list_api_keys(
    user_and_ws: tuple[User, Workspace] = Depends(get_current_user_and_workspace),
    db: Session = Depends(get_db),
):
    """List all stored BYOK API keys for workspace (with masked strings)."""
    user, workspace = user_and_ws
    keys = db.query(UserAPIKey).filter(UserAPIKey.workspace_id == workspace.id).all()
    
    result = []
    for k in keys:
        decrypted = decrypt_api_key(k.encrypted_key)
        masked = decrypted[:4] + "..." + decrypted[-4:] if len(decrypted) > 8 else "****"
        result.append({
            "id": k.id,
            "provider": k.provider,
            "masked_key": masked,
            "is_valid": k.is_valid,
            "created_at": k.created_at.isoformat(),
        })
        
    return {"keys": result}
