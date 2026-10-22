# -*- coding: utf-8 -*-
"""
AVP Emart - honest live price engine for the hub's comparison endpoints.

Previously the hub's /api/emart/compare* endpoints invented store prices (from a
fixed base price, or from an MD5 hash of the search text) and drew a sine-wave
"30-day history", all presented as live data. This module replaces that with:

  * LIVE listings from Google Shopping (India) via SerpAPI, using the visitor's
    own key (X-SerpAPI-Key header, saved on the BYOK page as user_serpapi_key)
    or the server's SERPAPI_KEY env var; and
  * when no key is available, NO numbers at all - just real deep links that open
    each store's own search results for the query.

Price history is only ever built from prices this platform actually observed for
the same query in earlier searches (stored in SQLite), never synthesised.
"""
from __future__ import annotations

import os
import re
import urllib.parse
from typing import Any, Dict, List, Optional

import httpx
from fastapi import Request

STORE_SEARCH = {
    "Amazon India": ("amazon", "https://www.amazon.in/s?k={q}", "#ff9900"),
    "Flipkart": ("flipkart", "https://www.flipkart.com/search?q={q}", "#2874f0"),
    "Reliance Digital": ("reliance", "https://www.reliancedigital.in/search?q={q}", "#e11d48"),
    "Croma": ("croma", "https://www.croma.com/searchB?q={q}", "#14b8a6"),
    "JioMart": ("jiomart", "https://www.jiomart.com/search/{q}", "#0ea5e9"),
    "Blinkit": ("blinkit", "https://blinkit.com/s/?q={q}", "#facc15"),
    "Zepto": ("zepto", "https://www.zeptonow.com/search?query={q}", "#8b5cf6"),
    "Tata CLiQ": ("tatacliq", "https://www.tatacliq.com/search/?searchCategory=all&text={q}", "#a855f7"),
}


def serpapi_key(request: Optional[Request]) -> str:
    user = (request.headers.get("x-serpapi-key", "") if request is not None else "").strip()
    return user or os.environ.get("SERPAPI_KEY", "").strip()


def store_search_links(query: str) -> List[Dict[str, str]]:
    q = urllib.parse.quote_plus(query.strip())
    return [{"store": name, "store_id": sid, "url": tpl.format(q=q), "badge_color": color}
            for name, (sid, tpl, color) in STORE_SEARCH.items()]


def _store_id(source: str) -> str:
    s = (source or "").lower()
    for name, (sid, _, _) in STORE_SEARCH.items():
        if sid in s.replace(" ", "") or name.lower() in s:
            return sid
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-") or "store"


def _color(sid: str) -> str:
    for _, (s, _, c) in STORE_SEARCH.items():
        if s == sid:
            return c
    return "#94a3b8"


def fetch_listings(query: str, key: str, n: int = 30) -> List[Dict[str, Any]]:
    """Live Google Shopping (India) listings. Returns [] on any failure."""
    if not key or not query.strip():
        return []
    try:
        r = httpx.get("https://serpapi.com/search.json", timeout=25, params={
            "engine": "google_shopping", "q": query, "gl": "in", "hl": "en", "location": "India",
            "num": n, "api_key": key,
        })
        r.raise_for_status()
        items = r.json().get("shopping_results", []) or []
    except Exception as e:
        print(f"[price_engine] SerpAPI error: {type(e).__name__}")
        return []
    out = []
    for it in items:
        price = it.get("extracted_price")
        if not isinstance(price, (int, float)) or price <= 0:
            continue
        old = it.get("extracted_old_price")
        source = it.get("source") or "Online store"
        out.append({
            "store": source,
            "store_id": _store_id(source),
            "title": it.get("title", query),
            "price": round(float(price)),
            "old_price": round(float(old)) if isinstance(old, (int, float)) and old > price else None,
            "rating": it.get("rating"),
            "reviews": it.get("reviews"),
            "delivery": it.get("delivery") or "See store for delivery",
            "link": it.get("product_link") or it.get("link") or "",
            "thumbnail": it.get("thumbnail", ""),
        })
    return out


def cheapest_per_store(listings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    best: Dict[str, Dict[str, Any]] = {}
    for l in listings:
        cur = best.get(l["store_id"])
        if cur is None or l["price"] < cur["price"]:
            best[l["store_id"]] = l
    return sorted(best.values(), key=lambda x: x["price"])


def to_store_card(l: Dict[str, Any]) -> Dict[str, Any]:
    mrp = l["old_price"] or l["price"]
    disc = round((mrp - l["price"]) / mrp * 100) if mrp > l["price"] else 0
    return {
        "store_id": l["store_id"], "name": l["store"], "title": l["title"],
        "price": l["price"], "mrp": mrp, "discount_pct": disc,
        "delivery_time": l["delivery"], "rating": l["rating"] if l["rating"] is not None else "—",
        "reviews_count": l["reviews"] or 0, "badge": "Live price", "badge_color": _color(l["store_id"]),
        "in_stock": True, "url": l["link"] or store_search_links(l["title"])[0]["url"],
        "thumbnail": l["thumbnail"],
    }


def deal_score(cards: List[Dict[str, Any]]) -> int:
    """0-100 from real signals only: price spread across stores, listed discount, rating."""
    if not cards:
        return 0
    best, worst = cards[0]["price"], cards[-1]["price"]
    spread = (worst - best) / worst if worst else 0
    rating = cards[0]["rating"] if isinstance(cards[0]["rating"], (int, float)) else 4.0
    return max(0, min(99, round(40 + spread * 120 + cards[0]["discount_pct"] * 0.8 + (rating - 4.0) * 15)))


def no_live_data_message(has_key: bool) -> str:
    if has_key:
        return "No live listings were found for this search. Try a more specific product name, or open the stores directly."
    return ("Live price comparison needs a free SerpAPI key (100 searches/month). Add yours on the BYOK page "
            "to see real prices from every store here. Meanwhile, open each store's results directly:")
