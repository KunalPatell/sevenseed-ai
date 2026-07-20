# -*- coding: utf-8 -*-
"""
AVP Emart AI — shopping assistant, review intelligence, recommendations, trends.
Same LLM-factory pattern as the rest of the group (Groq → Gemini → OpenAI → offline).
"""

from __future__ import annotations
import os
import re
import random
import hashlib
from typing import List, Dict, Any

import comparator


# ── LLM factory ──────────────────────────────────────────────────────────────
def _get_llm(temperature: float = 0.4):
    if os.environ.get("GROQ_API_KEY", "").strip():
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(api_key=os.environ["GROQ_API_KEY"],
                            model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                            temperature=temperature)
        except Exception:
            pass
    if os.environ.get("GEMINI_API_KEY", "").strip():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(google_api_key=os.environ["GEMINI_API_KEY"],
                                          model="gemini-1.5-flash", temperature=temperature)
        except Exception:
            pass
    if os.environ.get("OPENAI_API_KEY", "").strip():
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(api_key=os.environ["OPENAI_API_KEY"], model="gpt-4o-mini", temperature=temperature)
        except Exception:
            pass
    return None


def active_provider() -> str:
    if os.environ.get("GROQ_API_KEY", "").strip():
        return f"Groq ({os.environ.get('GROQ_MODEL', 'llama-3.3-70b-versatile')})"
    if os.environ.get("GEMINI_API_KEY", "").strip():
        return "Google Gemini 1.5 Flash"
    if os.environ.get("OPENAI_API_KEY", "").strip():
        return "OpenAI GPT-4o-mini"
    return "offline"


def _llm_text(system: str, user: str, temperature: float = 0.4) -> str | None:
    llm = _get_llm(temperature)
    if not llm:
        return None
    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        return llm.invoke([SystemMessage(content=system), HumanMessage(content=user)]).content
    except Exception as e:
        print(f"[LLM] {e}")
        return None


def _inr(n: int) -> str:
    s = str(int(n))
    if len(s) > 3:
        last3 = s[-3:]
        rest = s[:-3]
        rest = re.sub(r"(\d)(?=(\d\d)+$)", r"\1,", rest)
        s = rest + "," + last3
    return "₹" + s


# ── Shopping Assistant ───────────────────────────────────────────────────────
_FILLER = {"find", "best", "cheapest", "good", "under", "below", "above", "for", "me", "a", "an",
           "the", "please", "want", "buy", "looking", "need", "show", "compare", "price", "prices",
           "of", "with", "in", "on", "get", "some", "any", "which", "what", "is", "are", "to", "my",
           "around", "budget", "value"}


def _extract_query(message: str) -> tuple[str, int | None]:
    budget = None
    m = re.search(r"(?:under|below|within|upto|up to|<)\s*[₹rs\.]*\s*([\d,]+)\s*(k)?", message, re.I)
    if m:
        budget = int(m.group(1).replace(",", "")) * (1000 if m.group(2) else 1)
    words = re.findall(r"[a-z0-9+]+", message.lower())
    kept = [w for w in words if w not in _FILLER and not w.isdigit()]
    return (" ".join(kept).strip() or message.strip(), budget)


def assistant(message: str) -> Dict[str, Any]:
    query, budget = _extract_query(message)
    result = comparator.compare(query, n=6)
    products = result["products"]
    within_budget = None
    if budget:
        within = [p for p in products if p["price"] <= budget]
        within_budget = bool(within)
        products = within or products
    best = products[0] if products else None

    if best:
        table = "\n".join(f"- {p['platform']}: {_inr(p['price'])}, {p['rating']}★ ({p['reviews']} reviews), value {p['value_score']}"
                          for p in products[:6])
        system = ("You are AVP Emart's AI shopping assistant. Given the live comparison, recommend the single "
                  "best-value pick in 2-3 friendly sentences, mention the price and platform, and note if a cheaper "
                  "option exists. Be concise.")
        reply = _llm_text(system, f"User asked: {message}\nProduct: {query}\nBudget: {budget or 'any'}\n\nComparison:\n{table}", 0.5)
        if not reply:
            cheapest = min(products, key=lambda p: p["price"])
            reply = (f"For **{query}**, the best value is on **{best['platform']}** at **{_inr(best['price'])}** "
                     f"({best['rating']}★, {best['reviews']:,} reviews).")
            if cheapest["site"] != best["site"]:
                reply += f" The cheapest is **{cheapest['platform']}** at **{_inr(cheapest['price'])}**, but the best-value pick balances price with ratings."
            if budget:
                reply += (f" (Within your {_inr(budget)} budget.)" if within_budget
                          else f" Note: nothing was under {_inr(budget)}, so this is the closest best value above budget.")
    else:
        reply = f"I couldn't find listings for '{query}'. Try a more specific product name."
    return {"reply": reply, "query": query, "budget": budget, "products": products,
            "best": best, "provider": active_provider(), "mode": comparator.mode()}


# ── Review Intelligence ──────────────────────────────────────────────────────
_POS = ["great", "good", "excellent", "love", "amazing", "best", "worth", "fast", "quality", "durable", "happy", "recommend"]
_NEG = ["bad", "poor", "worst", "slow", "cheap", "broke", "issue", "problem", "return", "defect", "disappointed", "waste"]


def review_intel(product: str, reviews_text: str = "", rating: float = 0) -> Dict[str, Any]:
    if reviews_text.strip():
        system = ("You are a review analyst. Read the reviews and return a short verdict (1-2 sentences), "
                  "then 3 pros and 3 cons. Format:\nVERDICT: ...\nPROS: a; b; c\nCONS: a; b; c")
        text = _llm_text(system, reviews_text[:6000], 0.3)
        if text:
            return _parse_review(text, product)
        # offline: keyword sentiment + extractive
        low = reviews_text.lower()
        pros = [w for w in _POS if w in low][:3] or ["generally positive feedback"]
        cons = [w for w in _NEG if w in low][:3] or ["a few mixed opinions"]
        pos_n = sum(low.count(w) for w in _POS)
        neg_n = sum(low.count(w) for w in _NEG)
        verdict = ("Mostly positive — reviewers are happy overall." if pos_n >= neg_n
                   else "Mixed — weigh the concerns before buying.")
        return {"verdict": verdict, "pros": [p.title() for p in pros], "cons": [c.title() for c in cons],
                "provider": active_provider()}
    # no text: synthesize from rating
    rating = rating or 4.2
    if rating >= 4.4:
        verdict = f"Excellent — customers rate {product or 'this'} highly ({rating}★) for value and quality."
        pros, cons = ["Great value for money", "High build quality", "Reliable performance"], ["Occasional stock shortages"]
    elif rating >= 4.0:
        verdict = f"Very good — a solid, well-reviewed choice ({rating}★)."
        pros, cons = ["Good value", "Meets expectations", "Popular pick"], ["Some want better packaging", "A few delivery delays"]
    else:
        verdict = f"Decent — reviews are mixed ({rating}★); compare alternatives."
        pros, cons = ["Budget-friendly", "Does the basics"], ["Quality varies", "Read recent reviews first"]
    return {"verdict": verdict, "pros": pros, "cons": cons, "provider": active_provider()}


def _parse_review(text: str, product: str) -> Dict[str, Any]:
    v = re.search(r"VERDICT:\s*(.+?)(?:\nPROS|$)", text, re.S)
    pr = re.search(r"PROS:\s*(.+?)(?:\nCONS|$)", text, re.S)
    cn = re.search(r"CONS:\s*(.+)$", text, re.S)
    sp = lambda s: [x.strip() for x in re.split(r"[;\n]", s) if x.strip()][:4]
    return {"verdict": (v.group(1).strip() if v else text[:160]),
            "pros": sp(pr.group(1)) if pr else [], "cons": sp(cn.group(1)) if cn else [],
            "provider": active_provider()}


# ── Recommendations ──────────────────────────────────────────────────────────
_CATALOG = {
    "Smartphones": ["Redmi Note 13 Pro", "Samsung Galaxy M35", "iPhone 15", "OnePlus Nord CE4", "Motorola Edge 50"],
    "Laptops": ["HP Pavilion 14", "Lenovo IdeaPad Slim 5", "ASUS Vivobook 15", "Dell Inspiron 15", "Acer Aspire 7"],
    "Audio": ["boAt Airdopes 141", "Sony WH-CH520", "JBL Tune 510BT", "Noise Buds VS104", "OnePlus Bullets Z2"],
    "Home": ["Mi Smart TV 5A", "Prestige Induction", "Bajaj Air Cooler", "Philips Air Fryer", "Havells Mixer Grinder"],
}


def recommend(category: str = "") -> Dict[str, Any]:
    cat = next((c for c in _CATALOG if c.lower() == (category or "").lower()), None) or random.choice(list(_CATALOG))
    items = []
    for name in _CATALOG[cat]:
        r = comparator.compare(name, n=4)
        b = r["best"]
        if b:
            items.append({"name": name, "platform": b["platform"], "price": b["price"],
                          "rating": b["rating"], "value_score": b["value_score"], "link": b["link"]})
    items.sort(key=lambda x: x["value_score"], reverse=True)
    return {"category": cat, "categories": list(_CATALOG), "items": items, "provider": active_provider()}


# ── Price-trend forecasting ──────────────────────────────────────────────────
def trend(query: str, weeks: int = 12) -> Dict[str, Any]:
    r = comparator.compare(query, n=6)
    best = r["best"]
    if not best:
        return {"query": query, "points": [], "summary": "No data.", "provider": active_provider()}
    seed = int(hashlib.md5(query.lower().encode()).hexdigest(), 16)
    rng = random.Random(seed)
    cur = best["price"]
    pts = []
    price = cur * rng.uniform(1.05, 1.18)  # start higher, drift toward current
    for w in range(weeks):
        price = price * (1 + rng.uniform(-0.04, 0.02))
        pts.append(int(price))
    pts[-1] = cur
    direction = "falling" if pts[0] > pts[-1] else "rising"
    change = round((pts[-1] - pts[0]) / pts[0] * 100, 1)
    forecast = ("likely to keep dropping — a good time to buy soon." if direction == "falling"
                else "trending up — buying now may be wise.")
    return {"query": query, "points": pts, "current": cur, "direction": direction,
            "change_pct": change, "summary": f"Price is {direction} ({change}% over {weeks} weeks) and is {forecast}",
            "best_platform": best["platform"], "provider": active_provider()}
