# -*- coding: utf-8 -*-
"""
Sevenseed hub - child app process supervisor + reverse proxy.

Each child app (avp-emart, avpu, breakdown-factor, avp-charitable-trust,
decode-forest-pharmacy, sevenforce) keeps running exactly as it does standalone
today: its own Python process, its own module namespace, `python main.py`,
reading PORT from the environment. Nothing in any child's code changes.

Why a subprocess instead of importing each child's FastAPI app directly into
this process: several children define same-named files (agents.py, features.py,
config.py, ...) with different content. An earlier version of this file tried to
merge them into one process by juggling sys.modules while each child's main.py
was exec'd. That works for imports done at a child's own module load time, but
several children's route handlers do `from agents import ...` *inside* the
handler function body (avpu alone does this 11 times) - a lazy import that
resolves again at real request time, long after every child has finished
loading and Python's shared module cache has settled on a single winner. In
practice that meant every child except whichever one loaded its agents.py
first would silently call a *different child's* AI logic. Booting fine while
being wrong is exactly the failure mode worth avoiding. Separate OS processes
have separate sys.modules, so this class of bug cannot happen here.

Why lazy-start instead of starting all six at hub boot: verified live on Render
(free plan, 512MB) - starting all six eagerly put four of them (avpu,
breakdown-factor, avp-charitable-trust, decode-forest-pharmacy - all import
onnxruntime/insightface/opencv/scikit-learn) mid-import at the same moment the
container's memory crossed the limit, OOM-killing the whole container roughly
every 100 seconds in a permanent crash-restart loop; only avp-emart (no heavy
ML deps) ever finished booting before the next kill. So: a child starts on its
own first request, and stops itself after IDLE_TIMEOUT_SECONDS of no traffic,
so steady-state memory is the hub plus whatever's actually in use - not all six
at once.

Comonk is also included as a child process here — it runs alongside its own
separate live Render service (comonk-ai.onrender.com) which stays untouched.
"""
from __future__ import annotations

import asyncio
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Dict

import httpx
from fastapi import Request, Response

APPS_DIR = Path(__file__).resolve().parents[2]

# prefix -> (folder name under apps/, internal port, optional overrides)
# backend_subdir: subfolder under folder/ that contains main.py (default: "backend")
# main_file: entry point filename (default: "main.py")
CHILDREN: Dict[str, Dict[str, object]] = {
    "avp-emart": {"folder": "avp-emart", "port": 8001},
    "avpu": {"folder": "avpu", "port": 8002},
    "breakdown": {"folder": "breakdown-factor", "port": 8003},
    "trust": {"folder": "avp-charitable-trust", "port": 8004},
    "pharmacy": {"folder": "decode-forest-pharmacy", "port": 8005},
    "sevenforce": {"folder": "sevenforce", "port": 8006},
    # Comonk: flat structure (no /backend/ subfolder), entry point is comonk_backend.py
    "comonk-ai": {"folder": "comonk", "port": 8007, "backend_subdir": "", "main_file": "comonk_backend.py"},
}

_HOP_BY_HOP = {"content-length", "transfer-encoding", "connection", "keep-alive"}

IDLE_TIMEOUT_SECONDS = 600  # stop a child after 10 minutes with no requests
REAPER_INTERVAL_SECONDS = 60

# Verified live on Render (free plan, 512MB): three of these children warm at
# once (each imports onnxruntime/insightface/opencv/scikit-learn/pandas) pushed
# the container over the memory limit and OOM-killed the whole process, even
# with lazy-start - lazy-start only prevents the all-six-at-boot case, it does
# not cap how many end up resident from ordinary concurrent traffic. Capping
# concurrently-running children and evicting the least-recently-used one when
# a new one is needed keeps steady-state memory bounded regardless of traffic.
MAX_CONCURRENT_CHILDREN = 2

_procs: Dict[str, subprocess.Popen] = {}
_last_used: Dict[str, float] = {}
_locks: Dict[str, asyncio.Lock] = {prefix: asyncio.Lock() for prefix in CHILDREN}
_reaper_task: asyncio.Task | None = None


def _is_running(prefix: str) -> bool:
    proc = _procs.get(prefix)
    return proc is not None and proc.poll() is None


def _spawn(prefix: str) -> None:
    info = CHILDREN[prefix]
    backend_subdir = str(info.get("backend_subdir", "backend"))
    main_file = str(info.get("main_file", "main.py"))
    if backend_subdir:
        backend_dir = APPS_DIR / str(info["folder"]) / backend_subdir
    else:
        backend_dir = APPS_DIR / str(info["folder"])
    env = dict(os.environ)
    env["PORT"] = str(info["port"])
    print(f"[hub] starting child '{prefix}' from {backend_dir} on port {info['port']}")
    _procs[prefix] = subprocess.Popen([sys.executable, main_file], cwd=str(backend_dir), env=env)


def _stop(prefix: str) -> None:
    proc = _procs.pop(prefix, None)
    if proc is None:
        return
    print(f"[hub] stopping idle child '{prefix}'")
    proc.terminate()
    try:
        proc.wait(timeout=10)
    except subprocess.TimeoutExpired:
        proc.kill()


async def ensure_child_running(prefix: str) -> None:
    """Start this child if it isn't already running (or has crashed/exited).

    If starting it would exceed MAX_CONCURRENT_CHILDREN, first stop whichever
    other running child was used longest ago - an LRU cap, not just an idle
    reaper, since idle timeout alone is too slow to prevent a memory spike from
    ordinary traffic hitting several heavy children within the same minute.
    """
    async with _locks[prefix]:
        if _is_running(prefix):
            _last_used[prefix] = time.monotonic()
            return

        running = [p for p in _procs if _is_running(p)]
        while len(running) >= MAX_CONCURRENT_CHILDREN:
            lru_prefix = min(running, key=lambda p: _last_used.get(p, 0))
            async with _locks[lru_prefix]:
                _stop(lru_prefix)
            running = [p for p in _procs if _is_running(p)]

        _spawn(prefix)
    _last_used[prefix] = time.monotonic()


async def _reap_idle_children() -> None:
    while True:
        await asyncio.sleep(REAPER_INTERVAL_SECONDS)
        now = time.monotonic()
        for prefix in list(_procs):
            if now - _last_used.get(prefix, now) > IDLE_TIMEOUT_SECONDS:
                async with _locks[prefix]:
                    _stop(prefix)


def start_children() -> None:
    """Start the idle-reaper background task. Children start lazily on first request."""
    global _reaper_task
    _reaper_task = asyncio.get_running_loop().create_task(_reap_idle_children())


def stop_children() -> None:
    """Stop the reaper and every currently-running child. Called at hub shutdown."""
    if _reaper_task is not None:
        _reaper_task.cancel()
    for prefix in list(_procs):
        _stop(prefix)


async def proxy_to_child(request: Request, prefix: str, tail: str) -> Response:
    """Forward one incoming request to a child's own /api/<tail> and relay its response.

    Starts the child on first use, then retries on connection failure for up to
    ~90s - long enough for a cold child to finish importing onnxruntime/insightface
    style dependencies. A child that's already warm answers on the first attempt,
    so this only costs time for the actual first request after an idle period.
    A genuine 4xx/5xx response from the child is returned as-is, never retried.
    """
    await ensure_child_running(prefix)
    port = int(CHILDREN[prefix]["port"])
    url = f"http://127.0.0.1:{port}/api/{tail}"
    body = await request.body()
    headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}

    last_error: Exception | None = None
    async with httpx.AsyncClient(timeout=60) as client:
        for attempt in range(45):
            try:
                resp = await client.request(
                    request.method,
                    url,
                    params=request.query_params,
                    headers=headers,
                    content=body,
                )
                _last_used[prefix] = time.monotonic()
                out_headers = {
                    k: v for k, v in resp.headers.items() if k.lower() not in _HOP_BY_HOP
                }
                return Response(
                    content=resp.content,
                    status_code=resp.status_code,
                    headers=out_headers,
                    media_type=resp.headers.get("content-type"),
                )
            except httpx.ConnectError as e:
                last_error = e
                await asyncio.sleep(2)

    return Response(
        content=f'{{"error":"child service unavailable","detail":"{last_error}"}}',
        status_code=503,
        media_type="application/json",
    )
