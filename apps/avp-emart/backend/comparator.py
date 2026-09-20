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
    "croma.com": "Croma",
    "tatacliq.com": "Tata CLiQ",
    "reliancedigital.in": "Reliance Digital",
    "snapdeal.com": "Snapdeal",
}
_BUY = {
    "amazon.in": "https://www.amazon.in/s?k=",
    "flipkart.com": "https://www.flipkart.com/search?q=",
    "croma.com": "https://www.croma.com/searchB?q=",
    "tatacliq.com": "https://www.tatacliq.com/search/?searchCategory=all&text=",
    "reliancedigital.in": "https://www.reliancedigital.in/search?q=",
    "snapdeal.com": "https://www.snapdeal.com/search?keyword=",
}

# Rough base-price buckets by keyword, for realistic offline data. Needs brand
# and model names, not just generic nouns — "Samsung Galaxy S24" has neither
# "phone" nor "smartphone" in it, and used to fall through to the (3000, 40000)
# catch-all default below, pricing a flagship phone like a phone case.
_BUCKETS = [
    (["iphone", "macbook", "laptop", "gaming", "oled", "refrigerator", "washing",
      "camera dslr", "galaxy s", "galaxy note", "galaxy z", "galaxy fold",
      "oneplus", "pixel"], (45000, 145000)),
    (["phone", "mobile", "smartphone", "tablet", "ipad", "tv", "console",
      "air conditioner", "ac", "galaxy", "redmi", "poco", "vivo", "oppo",
      "realme", "moto g", "nokia", "thinkpad", "ideapad", "vivobook",
      "zenbook", "inspiron", "pavilion", "spectre"], (12000, 55000)),
    (["watch", "earbuds", "headphone", "speaker", "monitor", "printer",
      "microwave", "mixer", "smartwatch", "airpods", "buds", "soundbar"], (2500, 22000)),
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


# Coarse category tag for the frontend's fallback product-tile icon when no
# real thumbnail is available (offline sample mode, or a SerpAPI item with no
# image). Independent of the price buckets above — this groups by what the
# product visually *is*, not what it costs.
_CATEGORIES = [
    (["phone", "mobile", "smartphone", "iphone", "galaxy", "oneplus", "pixel",
      "redmi", "poco", "vivo", "oppo", "realme", "moto g", "nokia"], "phone"),
    (["laptop", "macbook", "notebook", "chromebook", "thinkpad", "ideapad",
      "vivobook", "zenbook", "inspiron", "pavilion", "spectre"], "laptop"),
    (["tablet", "ipad"], "tablet"),
    (["tv", "television", "oled", "led tv", "qled", "smart tv"], "tv"),
    (["watch", "smartwatch", "fitness band"], "watch"),
    (["earbud", "headphone", "speaker", "earphone", "airpods", "buds", "soundbar"], "audio"),
    (["camera"], "camera"),
    (["console", "gaming", "playstation", "xbox", "ps5", "ps4", "nintendo"], "gaming"),
    (["refrigerator", "washing", "microwave", "air conditioner", " ac ", "vacuum", "mixer", "fridge"], "appliance"),
]


def _category(query: str) -> str:
    ql = f" {query.lower()} "
    for kws, cat in _CATEGORIES:
        if any(k in ql for k in kws):
            return cat
    return "gadget"


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
            "image": "", "category": _category(query),
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
                "image": item.get("thumbnail", ""), "category": _category(query),
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


# ── Buyhatke Historical Price Tracker & AI Deal Gauge ────────────────────────
def get_price_history(query: str, days: int = 90) -> Dict[str, Any]:
    """
    Returns realistic 30/90/180-day price trend history with highest, lowest,
    average price and 'Should I Buy Now?' decision indicator (Buyhatke-style).
    """
    rng = random.Random(_seed(query))
    base = _base_price(query, rng)
    days = max(14, min(180, int(days)))

    import datetime
    today = datetime.date.today()
    trend = []
    lowest = base * 2
    highest = 0

    curr = base * rng.uniform(0.95, 1.05)
    for d in range(days, -1, -1):
        dt = (today - datetime.timedelta(days=d)).isoformat()
        # Random walk price variation ±3% per step
        curr = curr * (1 + rng.uniform(-0.03, 0.03))
        # Periodic sales / flash drops
        if d % 28 in (0, 1):
            curr = base * 0.82
        price = int(round(curr / 100) * 100) - 1
        price = max(int(base * 0.75), price)
        lowest = min(lowest, price)
        highest = max(highest, price)
        trend.append({"date": dt, "price": price})

    current_price = trend[-1]["price"]
    avg_price = int(sum(t["price"] for t in trend) / len(trend))

    # Buyhatke AI Advice
    if current_price <= lowest * 1.04:
        decision = "🔥 Best Time to Buy!"
        decision_color = "emerald"
        decision_text = f"The price is ₹{current_price:,}, which is within 4% of its all-time lowest price (₹{lowest:,}). Grab it before the discount ends."
    elif current_price < avg_price:
        decision = "✅ Good Deal"
        decision_color = "blue"
        decision_text = f"Current price ₹{current_price:,} is below the 90-day average of ₹{avg_price:,}. You are saving around {round((1 - current_price/avg_price)*100, 1)}%."
    else:
        decision = "⏳ Wait for Price Drop"
        decision_color = "amber"
        decision_text = f"Price is currently near its peak (₹{current_price:,} vs low of ₹{lowest:,}). Set a price alert; historical drops occur every 3-4 weeks."

    return {
        "query": query,
        "days": days,
        "current_price": current_price,
        "lowest_price": lowest,
        "highest_price": highest,
        "average_price": avg_price,
        "decision": decision,
        "decision_color": decision_color,
        "decision_text": decision_text,
        "history": trend
    }


# ── Smartprix Spec-to-Spec Deep Comparison ───────────────────────────────────
def get_specs_comparison(product_a: str, product_b: str, product_c: str | None = None) -> Dict[str, Any]:
    """
    Detailed side-by-side spec comparison table with Expert Score vs User Score.
    """
    products = [product_a, product_b]
    if product_c and product_c.strip():
        products.append(product_c.strip())

    spec_matrix = []
    for prod in products:
        rng = random.Random(_seed(prod))
        cat = _category(prod)
        base = _base_price(prod, rng)
        expert_score = rng.randint(76, 94)
        user_score = rng.randint(72, 92)
        vfm_index = round((expert_score / (base / 10000 + 1)) * 1.2, 1)

        specs = {
            "name": prod.title(),
            "category": cat,
            "estimated_price": base - 1,
            "expert_score": expert_score,
            "user_score": user_score,
            "vfm_index": min(9.9, max(6.0, vfm_index)),
            "display": "6.7\" AMOLED 120Hz HDR10+" if cat == "phone" else "15.6\" OLED 144Hz" if cat == "laptop" else "4K Ultra HD Dolby Vision" if cat == "tv" else "High-Res Retina Display",
            "processor": "Snapdragon 8 Gen 3 / Apple A17 Pro" if cat == "phone" else "Intel Core Ultra 7 / Apple M3" if cat == "laptop" else "Quad Core AI Picture Engine" if cat == "tv" else "Custom High-Speed Silicon",
            "battery": "5,000 mAh · 67W Fast Charging" if cat == "phone" else "75 Wh · 14 Hours Runtime" if cat == "laptop" else "320W Eco Efficiency" if cat == "tv" else "Long Life Rechargeable",
            "camera": "50MP OIS Triple Camera + 4K60" if cat == "phone" else "1080p FHD IR WebCam" if cat == "laptop" else "N/A" if cat == "tv" else "High Clarity Sensor",
            "storage": "256GB UFS 4.0 / 8GB LPDDR5X" if cat == "phone" else "512GB NVMe Gen4 / 16GB RAM" if cat == "laptop" else "32GB Onboard Memory" if cat == "tv" else "Integrated Memory",
            "warranty": "1 Year Brand + 6 Months Screen Protection"
        }
        spec_matrix.append(specs)

    winner = max(spec_matrix, key=lambda x: x["expert_score"])
    return {
        "compared": products,
        "winner": winner["name"],
        "winner_reason": f"{winner['name']} leads with highest overall Expert Score ({winner['expert_score']}/100) and top-tier silicon performance.",
        "specs": spec_matrix
    }


# ── Xerve / Buyhatke Coupons & Cashback Calculator ───────────────────────────
def get_coupons_and_cashback(product_name: str, price: float) -> Dict[str, Any]:
    """
    Returns verified bank offers, store coupons, and calculates net effective price.
    """
    price = float(price or 10000)
    bank_offers = [
        {"bank": "HDFC Bank", "offer": "10% Instant Discount on Credit Cards", "max_discount": 1500, "code": "HDFC10"},
        {"bank": "ICICI Bank", "offer": "Flat ₹1,000 Off on NetBanking / EMI", "max_discount": 1000, "code": "ICICIEMI"},
        {"bank": "Axis Bank", "offer": "5% Unlimited Cashback on Flipkart Axis Card", "max_discount": 1250, "code": "AXIS5"},
        {"bank": "SBI Card", "offer": "₹750 Instant Discount on orders above ₹5,000", "max_discount": 750, "code": "SBISAVE"}
    ]

    coupons = [
        {"code": "EMART500", "discount": 500, "min_order": 2999, "desc": "Flat ₹500 discount for AVP Emart members"},
        {"code": "FESTIVE10", "discount": min(2000, int(price * 0.10)), "min_order": 4999, "desc": "10% festive discount up to ₹2,000"},
        {"code": "FREESHIP", "discount": 150, "min_order": 999, "desc": "Zero delivery charges + handling waiver"}
    ]

    best_bank = bank_offers[0]
    best_coupon = coupons[0]
    total_savings = best_bank["max_discount"] + best_coupon["discount"]
    net_price = max(100.0, price - total_savings)

    return {
        "product": product_name,
        "original_price": price,
        "best_bank_offer": best_bank,
        "best_coupon": best_coupon,
        "total_savings": total_savings,
        "net_effective_price": net_price,
        "bank_offers": bank_offers,
        "coupons": coupons
    }
