# -*- coding: utf-8 -*-
"""
In-memory per-IP + global rate limiter for unauthenticated public endpoints
(the AI health-assistant demo). Single-process only — this app runs uvicorn
with no --workers, so an in-memory dict is authoritative. Resets on restart;
won't coordinate across multiple instances if ever horizontally scaled,
which is an acceptable limitation for a single-dyno deployment.
"""
from __future__ import annotations
import time
from collections import defaultdict, deque
from fastapi import HTTPException, Request

_hits: dict[str, deque] = defaultdict(deque)
_global_hits: dict[str, deque] = defaultdict(deque)


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_rate_limit(request: Request, bucket: str, limit: int, window_s: int, global_limit: int | None = None) -> None:
    now = time.time()
    q = _hits[f"{bucket}:{_client_ip(request)}"]
    while q and now - q[0] > window_s:
        q.popleft()
    if len(q) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests — please wait a bit and try again.")
    q.append(now)

    if global_limit:
        gq = _global_hits[bucket]
        while gq and now - gq[0] > window_s:
            gq.popleft()
        if len(gq) >= global_limit:
            raise HTTPException(status_code=429, detail="This demo is receiving unusually high traffic — please try again shortly.")
        gq.append(now)
