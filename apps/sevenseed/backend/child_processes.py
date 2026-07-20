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

Comonk is deliberately not in this list - see main.py for why.
"""
from __future__ import annotations

import asyncio
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict

import httpx
from fastapi import Request, Response

APPS_DIR = Path(__file__).resolve().parents[2]

# prefix -> (folder name under apps/, internal port)
CHILDREN: Dict[str, Dict[str, object]] = {
    "avp-emart": {"folder": "avp-emart", "port": 8001},
    "avpu": {"folder": "avpu", "port": 8002},
    "breakdown": {"folder": "breakdown-factor", "port": 8003},
    "trust": {"folder": "avp-charitable-trust", "port": 8004},
    "pharmacy": {"folder": "decode-forest-pharmacy", "port": 8005},
    "sevenforce": {"folder": "sevenforce", "port": 8006},
}

_HOP_BY_HOP = {"content-length", "transfer-encoding", "connection", "keep-alive"}

_procs: list[subprocess.Popen] = []


def start_children() -> None:
    """Launch every child backend as its own subprocess. Called once at hub startup."""
    for prefix, info in CHILDREN.items():
        backend_dir = APPS_DIR / str(info["folder"]) / "backend"
        env = dict(os.environ)
        env["PORT"] = str(info["port"])
        print(f"[hub] starting child '{prefix}' from {backend_dir} on port {info['port']}")
        proc = subprocess.Popen(
            [sys.executable, "main.py"],
            cwd=str(backend_dir),
            env=env,
        )
        _procs.append(proc)


def stop_children() -> None:
    """Terminate every child subprocess. Called once at hub shutdown."""
    for proc in _procs:
        proc.terminate()
    for proc in _procs:
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()
    _procs.clear()


async def proxy_to_child(request: Request, port: int, tail: str) -> Response:
    """Forward one incoming request to a child's own /api/<tail> and relay its response.

    Children take a few seconds to finish their (often heavy) imports on boot, so a
    request arriving before a child is ready gets a short retry loop rather than an
    immediate 502 - this only retries on connection failure, never on a real
    response from the child (a genuine 4xx/5xx is returned as-is).
    """
    url = f"http://127.0.0.1:{port}/api/{tail}"
    body = await request.body()
    headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}

    last_error: Exception | None = None
    async with httpx.AsyncClient(timeout=60) as client:
        for attempt in range(6):
            try:
                resp = await client.request(
                    request.method,
                    url,
                    params=request.query_params,
                    headers=headers,
                    content=body,
                )
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
                await asyncio.sleep(1)

    return Response(
        content=f'{{"error":"child service unavailable","detail":"{last_error}"}}',
        status_code=503,
        media_type="application/json",
    )
