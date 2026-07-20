# -*- coding: utf-8 -*-
"""
AVP Emart — price comparison engine.

Ports the price-com scoring model (price 40% / rating 40% / reviews 20%) and
compares a product across Amazon, Flipkart, Reliance Digital and Snapdeal.

  • LIVE mode: set SERPAPI_KEY to pull real listings via SerpAPI.
  • OFFLINE mode (default): deterministic, realistic sample listings per query,
    so the app is fully functional with no keys.
"""

from __future__ import annotations
import os
import hashlib
import random
import urllib.parse
from typing import List, Dict, Any

PLATFORMS = {
    "amazon.in": "Amazon",
    "flipkart.com": "Flipkart",
    "reliancedigital.in": "Reliance Digital",
    "snapdeal.com": "Snapdeal",
}
_BUY = {
    "amazon.in": "https://www.amazon.in/s?k=",
    "flipkart.com": "https://www.flipkart.com/search?q=",
    "reliancedigital.in": "https://www.reliancedigital.in/search?q=",
    "snapdeal.com": "https://www.snapdeal.com/search?keyword=",
}

# Rough base-price buckets by keyword, for realistic offline data.
_BUCKETS = [
    (["iphone", "macbook", "laptop", "gaming", "oled", "refrigerator", "washing", "camera dslr"], (45000, 145000)),
    (["phone", "mobile", "smartphone", "tablet", "ipad", "tv", "console", "air conditioner", "ac"], (12000, 55000)),
    (["watch", "earbuds", "headphone", "speaker", "monitor", "printer", "microwave", "mixer"], (2500, 22000)),
    (["cable", "case", "cover", "charger", "mouse", "keyboard", "bottle", "book", "toy"], (200, 2500)),
]


def _seed(q: str) -> int:
    return int(hashlib.md5(q.lower().strip().encode()).hexdigest(), 16) % (2 ** 32)


def _base_price(query: str, rng: random.Random) -> int:
    ql = query.lower()
    for kws, (lo, hi) in _BUCKETS:
        if any(k in ql for k in kws):
            return rng.randint(lo, hi)
    return rng.randint(3000, 40000)


def _sample(query: str, n: int) -> List[Dict[str, Any]]:
    rng = random.Random(_seed(query))
    base = _base_price(query, rng)
    variants = ["", " (2024)", " Pro", " Plus", " Lite", " Max", " — Latest Model", " (Official)"]
    out = []
    platforms = list(PLATFORMS.keys())
    rng.shuffle(platforms)
    count = max(4, min(n, 8))
    for i in range(count):
        site = platforms[i % len(platforms)]
        # price varies per listing ±18% around base, rounded to nearest 99
        p = base * (1 + rng.uniform(-0.18, 0.18))
        price = int(round(p / 100) * 100) - 1
        rating = round(rng.uniform(3.7, 4.8), 1)
        reviews = rng.randint(80, 24000)
        name = f"{query.title()}{variants[i % len(variants)]}"
        out.append({
            "name": name, "site": site, "platform": PLATFORMS[site],
            "price": price, "rating": rating, "reviews": reviews,
            "link": _BUY[site] + urllib.parse.quote(query),
            "in_stock": rng.random() > 0.12,
        })
    return out


def _fetch_serpapi_site(query: str, n: int, key: str, site: str, label: str) -> List[Dict[str, Any]]:
    import requests
    out = []
    try:
        r = requests.get("https://serpapi.com/search", params={
            "engine": "google", "q": f"{query} site:{site}",
            "num": n, "api_key": key,
        }, timeout=5)
        data = r.json()
        for item in (data.get("shopping_results") or data.get("organic_results") or [])[:n]:
            price = _num(str(item.get("price", "")))
            rich = (item.get("rich_snippet", {}) or {}).get("top", {}).get("detected_extensions", {})
            out.append({
                "name": item.get("title", query)[:80], "site": site, "platform": label,
                "price": price or 0,
                "rating": float(item.get("rating", rich.get("rating", 0)) or 0),
                "reviews": int(item.get("reviews", rich.get("reviews", 0)) or 0),
                "link": item.get("link", _BUY[site] + urllib.parse.quote(query)),
                "in_stock": True,
            })
    except Exception as e:
        print(f"[comparator] SerpAPI error ({site}): {e}")
    return out


def _fetch_serpapi(query: str, n: int) -> List[Dict[str, Any]]:
    key = os.environ.get("SERPAPI_KEY", "").strip()
    if not key:
        return []
    from concurrent.futures import ThreadPoolExecutor, as_completed
    out: List[Dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=len(PLATFORMS)) as pool:
        futures = [pool.submit(_fetch_serpapi_site, query, n, key, site, label)
                   for site, label in PLATFORMS.items()]
        for f in as_completed(futures, timeout=8):
            try:
                out.extend(f.result())
            except Exception as e:
                print(f"[comparator] SerpAPI worker error: {e}")
    return [p for p in out if p["price"] > 0]


def _num(s: str) -> int:
    import re
    m = re.findall(r"[\d,]+", s.replace("₹", ""))
    return int(m[0].replace(",", "")) if m else 0


import math

def _score(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    priced = [p for p in products if p["price"] > 0]
    if not priced:
        return products
    max_price = max(p["price"] for p in priced)
    max_rev = max(p["reviews"] for p in priced) or 1
    
    # Calculate pricing positioning stats
    prices = [p["price"] for p in priced]
    if len(prices) > 1:
        mean_price = sum(prices) / len(prices)
        variance = sum((x - mean_price) ** 2 for x in prices) / len(prices)
        std_dev = math.sqrt(variance) or 1.0
    else:
        mean_price = prices[0] if prices else 0
        std_dev = 1.0

    for p in priced:
        price_score = (max_price - p["price"]) / max_price if max_price else 0
        rating_score = p["rating"] / 5.0
        review_score = p["reviews"] / max_rev
        final = 0.4 * price_score + 0.4 * rating_score + 0.2 * review_score
        p["value_score"] = round(final * 100, 1)
        p["price_score"] = round(price_score * 100, 1)
        
        # Calculate Z-score
        z = (p["price"] - mean_price) / std_dev
        p["z_score"] = round(z, 2)
        if z < -0.4:
            p["positioning"] = "Competitive"
        elif z > 0.4:
            p["positioning"] = "Premium"
        else:
            p["positioning"] = "Standard"

    priced.sort(key=lambda x: x["value_score"], reverse=True)
    if priced:
        priced[0]["best_value"] = True
    return priced


def forecast_trend(query: str, current_price: float, weeks_history: int = 12) -> Dict[str, Any]:
    """
    Price-trend forecast for a product query. Builds a deterministic weekly price
    history (seasonal + random-walk around the current price) and fits a simple
    linear trend to project 4 weeks ahead. Confidence is derived from how well the
    trend line actually fits the history (R^2), not a borrowed/mismatched model.
    """
    if not current_price or current_price <= 0:
        return {"success": False, "error": "No current price to forecast from."}

    rng = random.Random(_seed(query) ^ 0x5EED)
    history = []
    price = float(current_price) * rng.uniform(0.92, 1.08)
    drift = rng.uniform(-0.006, 0.006)  # weekly drift, small so trend is realistic
    for week in range(weeks_history, 0, -1):
        seasonal = 1.0 + 0.015 * math.sin(week / 2.1)
        price = max(1.0, price * (1 + drift + rng.uniform(-0.02, 0.02)) * seasonal)
        history.append({"week": weeks_history - week + 1, "price": round(price, 2)})
    history.append({"week": weeks_history + 1, "price": round(float(current_price), 2)})

    xs = [h["week"] for h in history]
    ys = [h["price"] for h in history]
    n_pts = len(xs)
    mean_x, mean_y = sum(xs) / n_pts, sum(ys) / n_pts
    ss_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    ss_xx = sum((x - mean_x) ** 2 for x in xs) or 1.0
    slope = ss_xy / ss_xx
    intercept = mean_y - slope * mean_x

    ss_tot = sum((y - mean_y) ** 2 for y in ys) or 1.0
    ss_res = sum((y - (slope * x + intercept)) ** 2 for x, y in zip(xs, ys))
    r_squared = max(0.0, 1 - ss_res / ss_tot)

    future_week = xs[-1] + 4
    predicted_price = max(1.0, slope * future_week + intercept)
    change_percent = round((predicted_price - current_price) / current_price * 100, 1)

    if change_percent <= -2:
        trend = "falling"
        advice = "Prices look likely to drop — consider waiting a few weeks if you can."
    elif change_percent >= 2:
        trend = "rising"
        advice = "Prices look likely to rise — buying now may be cheaper than waiting."
    else:
        trend = "stable"
        advice = "Prices look stable — timing your purchase won't make much difference."

    return {
        "success": True,
        "query": query,
        "current_price": round(float(current_price), 2),
        "predicted_price_4w": round(predicted_price, 2),
        "change_percent": change_percent,
        "trend": trend,
        "advice": advice,
        "confidence_score": round(r_squared * 100, 1),
        "history": history,
    }


def compare(query: str, n: int = 6) -> Dict[str, Any]:
    query = (query or "").strip()
    if not query:
        return {"query": query, "products": [], "best": None, "mode": mode()}
    products = _fetch_serpapi(query, n) or _sample(query, n)
    products = _score(products)
    best = products[0] if products else None
    cheapest = min(products, key=lambda p: p["price"]) if products else None
    top_rated = max(products, key=lambda p: p["rating"]) if products else None
    return {
        "query": query, "products": products, "best": best,
        "cheapest": cheapest, "top_rated": top_rated,
        "count": len(products), "mode": mode(),
    }


def mode() -> str:
    return "live (SerpAPI)" if os.environ.get("SERPAPI_KEY", "").strip() else "sample data"


def deal_insights(query: str, n: int = 8) -> Dict[str, Any]:
    """
    Consolidated deal analytics — ported from price-com's Streamlit insight cards,
    savings calculator, per-site-best table, and deal-quality gauge (app.py:
    show_insights/show_savings/show_per_site_best/deal_quality_gauge), rebuilt as
    plain JSON instead of Plotly figures so any frontend can render it.
    """
    result = compare(query, n)
    products = [p for p in result.get("products", []) if p.get("price", 0) > 0]
    if not products:
        return {"success": False, "error": f"No priced listings found for '{query}'.", "mode": mode()}

    cheapest = min(products, key=lambda p: p["price"])
    best_rated = max(products, key=lambda p: p["rating"])
    most_reviewed = max(products, key=lambda p: p["reviews"])
    best_score = max(products, key=lambda p: p["value_score"])

    max_p = max(p["price"] for p in products)
    min_p = min(p["price"] for p in products)
    savings_amount = max_p - min_p
    savings_percent = round((savings_amount / max_p) * 100, 1) if max_p else 0.0

    per_site: Dict[str, Dict[str, Any]] = {}
    for p in products:
        site = p["platform"]
        if site not in per_site or p["value_score"] > per_site[site]["value_score"]:
            per_site[site] = p

    avg_score = sum(p["value_score"] for p in products) / len(products)
    if avg_score >= 70:
        gauge_label, gauge_color = "Excellent Deals!", "green"
    elif avg_score >= 50:
        gauge_label, gauge_color = "Good Deals", "blue"
    elif avg_score >= 35:
        gauge_label, gauge_color = "Fair Deals", "amber"
    else:
        gauge_label, gauge_color = "Poor Deals", "red"

    return {
        "success": True, "query": query, "mode": mode(), "count": len(products),
        "insights": {
            "cheapest": {"name": cheapest["name"], "price": cheapest["price"], "site": cheapest["platform"]},
            "best_rated": {"name": best_rated["name"], "rating": best_rated["rating"], "site": best_rated["platform"]},
            "most_reviewed": {"name": most_reviewed["name"], "reviews": most_reviewed["reviews"], "site": most_reviewed["platform"]},
            "best_value": {"name": best_score["name"], "value_score": best_score["value_score"], "site": best_score["platform"]},
        },
        "savings": {"amount": round(savings_amount, 2), "percent": savings_percent,
                    "cheapest_site": cheapest["platform"], "most_expensive_price": round(max_p, 2)},
        "per_site_best": {site: {"name": p["name"], "price": p["price"], "value_score": p["value_score"]}
                           for site, p in per_site.items()},
        "deal_quality": {"score": round(avg_score, 1), "label": gauge_label, "color": gauge_color},
    }
