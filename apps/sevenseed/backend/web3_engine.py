# -*- coding: utf-8 -*-
"""Real blockchain reads for the Web3 tools.

Sevenseed has no deployed smart contracts and never signs or sends transactions itself:
visitors sign with their own wallet in the browser. This module only reads public chain
data (latest block, gas price, a transaction's contents) from public RPC endpoints, so the
pages can show live network status and check that a proof transaction really exists.
"""

import asyncio
import re
import time
from typing import Any, Dict, List, Optional

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Several public endpoints per chain: some are blocked or rate-limited in places, so we try
# them in order and use the first that answers.
CHAINS: Dict[str, Dict[str, Any]] = {
    "ethereum": {
        "name": "Ethereum", "chain_id": 1, "symbol": "ETH", "explorer": "https://etherscan.io",
        "rpcs": ["https://eth.drpc.org", "https://1rpc.io/eth", "https://rpc.flashbots.net", "https://ethereum-rpc.publicnode.com"],
    },
    "polygon": {
        "name": "Polygon PoS", "chain_id": 137, "symbol": "POL", "explorer": "https://polygonscan.com",
        "rpcs": ["https://polygon.drpc.org", "https://1rpc.io/matic", "https://polygon-rpc.com", "https://polygon-bor-rpc.publicnode.com"],
    },
    "base": {
        "name": "Base", "chain_id": 8453, "symbol": "ETH", "explorer": "https://basescan.org",
        "rpcs": ["https://mainnet.base.org", "https://base.drpc.org", "https://base-rpc.publicnode.com"],
    },
    "arbitrum": {
        "name": "Arbitrum One", "chain_id": 42161, "symbol": "ETH", "explorer": "https://arbiscan.io",
        "rpcs": ["https://arb1.arbitrum.io/rpc", "https://arbitrum.drpc.org", "https://arbitrum-one-rpc.publicnode.com"],
    },
}
SOLANA_RPCS = ["https://api.mainnet-beta.solana.com", "https://solana-rpc.publicnode.com"]

_HEADERS = {"content-type": "application/json", "user-agent": "Sevenseed-Web3-Status/1.0"}
_CACHE: Dict[str, Any] = {"at": 0.0, "data": None}
_CACHE_SECONDS = 20


async def _rpc(client: httpx.AsyncClient, urls: List[str], method: str, params: Optional[list] = None) -> Any:
    last_error = "no endpoint answered"
    for url in urls:
        try:
            r = await client.post(url, json={"jsonrpc": "2.0", "id": 1, "method": method, "params": params or []}, headers=_HEADERS)
            body = r.json()
            if "result" in body:
                return body["result"]
            last_error = str(body.get("error", {}).get("message", "bad response"))
        except (httpx.HTTPError, ValueError) as exc:
            last_error = type(exc).__name__
    raise RuntimeError(last_error)


async def _evm_status(client: httpx.AsyncClient, key: str) -> Dict[str, Any]:
    c = CHAINS[key]
    base = {"id": key, "name": c["name"], "chain_id": c["chain_id"], "symbol": c["symbol"], "explorer": c["explorer"]}
    try:
        block_hex, gas_hex = await asyncio.gather(_rpc(client, c["rpcs"], "eth_blockNumber"), _rpc(client, c["rpcs"], "eth_gasPrice"))
        return {**base, "online": True, "block": int(block_hex, 16), "gas_gwei": round(int(gas_hex, 16) / 1e9, 4)}
    except RuntimeError as exc:
        return {**base, "online": False, "error": str(exc)}


async def _solana_status(client: httpx.AsyncClient) -> Dict[str, Any]:
    base = {"id": "solana", "name": "Solana", "chain_id": None, "symbol": "SOL", "explorer": "https://explorer.solana.com"}
    try:
        slot = await _rpc(client, SOLANA_RPCS, "getSlot")
        return {**base, "online": True, "block": int(slot)}
    except RuntimeError as exc:
        return {**base, "online": False, "error": str(exc)}


@router.get("/api/web3/telemetry")
async def api_web3_telemetry():
    """Latest block and gas price on each network, read live (cached for 20 seconds)."""
    now = time.time()
    if _CACHE["data"] and now - _CACHE["at"] < _CACHE_SECONDS:
        return _CACHE["data"]
    async with httpx.AsyncClient(timeout=6.0) as client:
        chains = await asyncio.gather(*[_evm_status(client, k) for k in CHAINS], _solana_status(client))
    data = {"status": "ok", "checked_at": int(now), "source": "public RPC endpoints, read live", "chains": list(chains)}
    _CACHE.update(at=now, data=data)
    return data


_HEX = re.compile(r"^0x[0-9a-fA-F]{64}$")


@router.get("/api/web3/tx")
async def api_web3_tx(chain: str, hash: str, expect: str = ""):
    """Look up a transaction and, if `expect` (a SHA-256 hex) is given, check it is in the tx data."""
    if chain not in CHAINS:
        raise HTTPException(400, "Unknown network. Use ethereum, polygon, base or arbitrum.")
    if not _HEX.match(hash):
        raise HTTPException(400, "A transaction hash is 0x followed by 64 hex characters.")
    c = CHAINS[chain]
    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            tx = await _rpc(client, c["rpcs"], "eth_getTransactionByHash", [hash])
            receipt = await _rpc(client, c["rpcs"], "eth_getTransactionReceipt", [hash]) if tx else None
            block = None
            if tx and tx.get("blockNumber"):
                b = await _rpc(client, c["rpcs"], "eth_getBlockByNumber", [tx["blockNumber"], False])
                block = b
        except RuntimeError as exc:
            raise HTTPException(502, f"Could not reach {c['name']} right now ({exc}). Try again in a minute.")
    if not tx:
        return {"found": False, "chain": chain, "message": f"No transaction with this hash on {c['name']}. Check the network and the hash."}
    data = (tx.get("input") or "0x").lower()
    want = expect.lower().removeprefix("0x").strip()
    result = {
        "found": True,
        "chain": chain,
        "network": c["name"],
        "from": tx.get("from"),
        "to": tx.get("to"),
        "data": data,
        "confirmed": bool(receipt and receipt.get("status") == "0x1"),
        "pending": tx.get("blockNumber") is None,
        "block": int(tx["blockNumber"], 16) if tx.get("blockNumber") else None,
        "timestamp": int(block["timestamp"], 16) if block and block.get("timestamp") else None,
        "explorer_url": f"{c['explorer']}/tx/{hash}",
    }
    if want:
        result["matches"] = bool(re.fullmatch(r"[0-9a-f]{64}", want)) and want in data
    return result


@router.post("/api/web3/execute")
async def api_web3_execute():
    """Old demo endpoint. It used to return a made-up 'confirmed' transaction; it now says so."""
    return {
        "status": "not_available",
        "message": (
            "Sevenseed has no smart contracts deployed yet, so nothing is minted or executed on a blockchain. "
            "To put a real proof on chain, use the Web3 Studio at /web3-studio/: it fingerprints your file and "
            "you sign or send the proof with your own wallet."
        ),
        "web3_studio": "/web3-studio/",
    }
