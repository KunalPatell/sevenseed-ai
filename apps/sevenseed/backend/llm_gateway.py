# -*- coding: utf-8 -*-
"""
Sevenseed hub - minimal, BYOK-aware LLM gateway for the static feature pages.

Why: ten static feature pages (product writer, quiz generator, resume analyzer,
interview coach, body map, threat radar, cyber complaint, pitch deck, site-visit
report, news summarizer) called a *local developer* proxy at http://localhost:4000
via vertex_client.js, so every one of their AI features was dead in production.
They now call these same-origin endpoints instead.

Key policy (the founder's model: everything is free, bring your own key):
  * If the visitor sends their own key (X-Groq-API-Key / X-Gemini-API-Key /
    X-OpenAI-API-Key, stored only in their browser), it is used for that request
    and never stored or logged here. Generous per-IP limit.
  * Otherwise the studio's server key is used with a strict per-IP + global cap
    and a small max_tokens, so the public pages can't drain the shared quota.
"""
from __future__ import annotations

import os
from typing import List, Optional

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from app.ratelimit import check_rate_limit

router = APIRouter(prefix="/api/llm", tags=["LLM Gateway"])

_OPENAI_COMPAT = {
    "groq": ("https://api.groq.com/openai/v1/chat/completions", "GROQ_MODEL", "llama-3.3-70b-versatile"),
    "openai": ("https://api.openai.com/v1/chat/completions", "OPENAI_MODEL", "gpt-4o-mini"),
    "mistral": ("https://api.mistral.ai/v1/chat/completions", "MISTRAL_MODEL", "mistral-small-latest"),
}
_MAX_PROMPT_CHARS = 8000


class Msg(BaseModel):
    role: str = "user"
    content: str = ""


class AskReq(BaseModel):
    prompt: str
    system: Optional[str] = None
    temperature: float = 0.6
    maxTokens: Optional[int] = Field(default=None, ge=16, le=4000)


class ChatReq(BaseModel):
    messages: List[Msg]
    system: Optional[str] = None
    temperature: float = 0.6
    maxTokens: Optional[int] = Field(default=None, ge=16, le=4000)


def _user_keys(request: Request) -> list[tuple[str, str]]:
    h = request.headers
    keys = [("groq", h.get("x-groq-api-key", "")), ("gemini", h.get("x-gemini-api-key", "")),
            ("openai", h.get("x-openai-api-key", ""))]
    return [(p, k.strip()) for p, k in keys if k and k.strip()]


def _server_keys() -> list[tuple[str, str]]:
    order = [("groq", "GROQ_API_KEY"), ("gemini", "GEMINI_API_KEY"), ("mistral", "MISTRAL_API_KEY"), ("openai", "OPENAI_API_KEY")]
    return [(p, os.environ[e].strip()) for p, e in order if os.environ.get(e, "").strip()]


def _call(provider: str, key: str, messages: list[dict], temperature: float, max_tokens: int, user_key: bool) -> str:
    if provider == "gemini":
        model = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
        system = "\n".join(m["content"] for m in messages if m["role"] == "system")
        contents = [{"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]}
                    for m in messages if m["role"] != "system"]
        body = {"contents": contents, "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens}}
        if system:
            body["systemInstruction"] = {"parts": [{"text": system}]}
        r = httpx.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                       params={"key": key}, json=body, timeout=45)
        r.raise_for_status()
        return r.json()["candidates"][0]["content"]["parts"][0]["text"]
    url, model_env, default_model = _OPENAI_COMPAT[provider]
    model = os.environ.get(model_env, default_model)
    if provider == "groq" and not user_key:
        model = os.environ.get("GROQ_DEMO_MODEL", "llama-3.1-8b-instant")  # cheaper model on the shared key
    r = httpx.post(url, headers={"Authorization": f"Bearer {key}"}, timeout=45,
                   json={"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens})
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"]


def _complete(request: Request, messages: list[dict], temperature: float, max_tokens: Optional[int]) -> dict:
    if sum(len(m["content"]) for m in messages) > _MAX_PROMPT_CHARS:
        raise HTTPException(status_code=400, detail=f"Input too long ({_MAX_PROMPT_CHARS} character limit).")
    user = _user_keys(request)
    if user:
        check_rate_limit(request, bucket="llm_byok", limit=120, window_s=3600)
        candidates, cap = user, max_tokens or 2000
    else:
        check_rate_limit(request, bucket="llm_shared", limit=15, window_s=3600, global_limit=400)
        candidates, cap = _server_keys(), min(max_tokens or 700, 900)
    temperature = max(0.0, min(1.5, temperature))
    errors = []
    for provider, key in candidates:
        try:
            text = _call(provider, key, messages, temperature, cap, bool(user))
            return {"text": text, "provider": provider, "byok": bool(user)}
        except httpx.HTTPStatusError as e:
            errors.append(f"{provider}: HTTP {e.response.status_code}")
        except Exception as e:  # network / parse
            errors.append(f"{provider}: {type(e).__name__}")
    if user:
        raise HTTPException(status_code=502, detail="Your API key was rejected or the provider is unavailable (" + "; ".join(errors) + ").")
    raise HTTPException(status_code=503, detail="AI is temporarily unavailable. Add your own free Groq/Gemini key in BYOK settings to keep going.")


@router.get("/health")
def llm_health(request: Request):
    return {"ok": bool(_user_keys(request) or _server_keys()), "byok": bool(_user_keys(request)),
            "providers": [p for p, _ in (_user_keys(request) or _server_keys())]}


@router.post("/ask")
def llm_ask(req: AskReq, request: Request):
    msgs = ([{"role": "system", "content": req.system}] if req.system else []) + [{"role": "user", "content": req.prompt}]
    return _complete(request, msgs, req.temperature, req.maxTokens)


@router.post("/chat")
def llm_chat(req: ChatReq, request: Request):
    msgs = [{"role": "system", "content": req.system}] if req.system else []
    msgs += [{"role": m.role if m.role in ("user", "assistant", "system") else "user", "content": m.content} for m in req.messages[-20:]]
    return _complete(request, msgs, req.temperature, req.maxTokens)
