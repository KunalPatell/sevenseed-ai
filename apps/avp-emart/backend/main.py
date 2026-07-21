# -*- coding: utf-8 -*-
"""
AVP Emart — AI Smart Shopping Platform FastAPI backend.
Serves the Next.js static site and price comparator APIs with SQLite storage.
"""
from __future__ import annotations
import os, sys

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import config, db
from app.ratelimit import check_rate_limit
import comparator
import agents

try:
    from dotenv import load_dotenv; load_dotenv()
except Exception:
    pass

app = FastAPI(title="AVP Emart — AI Smart Shopping", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api_keys import groq_key_var, gemini_key_var, openai_key_var

@app.middleware("http")
async def api_key_override_middleware(request, call_next):
    groq_key_var.set(request.headers.get("x-groq-api-key", ""))
    gemini_key_var.set(request.headers.get("x-gemini-api-key", ""))
    openai_key_var.set(request.headers.get("x-openai-api-key", ""))
    return await call_next(request)

# Initialize SQLite database
db.init()


# ── Request models ────────────────────────────────────────────────────────────
class CompareReq(BaseModel):
    query: str
    n: int | None = 6

class AssistantReq(BaseModel):
    message: str

class AssistantDemoReq(BaseModel):
    message: str

class ReviewReq(BaseModel):
    product: str | None = ""
    reviews_text: str | None = ""
    rating: float | None = 0

class TrendReq(BaseModel):
    query: str
    weeks: int | None = 12

class WishlistReq(BaseModel):
    title: str
    price: float
    platform: str
    url: str

class AlertReq(BaseModel):
    title: str
    target_price: float
    current_price: float
    platform: str


# ── API ───────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "provider": agents.active_provider(),
        "mode": comparator.mode(),
        "platforms": list(comparator.PLATFORMS.values()),
        "llm_enabled": agents.active_provider() != "offline"
    }

@app.post("/api/compare")
def compare(req: CompareReq):
    data = comparator.compare(req.query, req.n or 6)
    products = data.get("products", [])
    mapped = []
    import random
    for p in products:
        mapped.append({
            "title": p.get("name", ""),
            "price": p.get("price", 0),
            "platform": p.get("platform", ""),
            "url": p.get("link", ""),
            "rating": p.get("rating", 0.0),
            "reviews_count": p.get("reviews", 0),
            "in_stock": p.get("in_stock", True),
            "delivery_days": random.randint(1, 5),
            "best_value_score": p.get("value_score", 0),
            "positioning": p.get("positioning", "Standard"),
            "z_score": p.get("z_score", 0.0),
        })
    if mapped:
        sorted_results = sorted(mapped, key=lambda x: x.get("price", 9999999))
        best = sorted_results[0]
        db.save_search(req.query, best.get("price", 0), best.get("platform", "Unknown"), mapped)
    return mapped

@app.post("/api/assistant")
def assistant(req: AssistantReq):
    return agents.assistant(req.message)

@app.post("/api/assistant/demo")
def assistant_demo(req: AssistantDemoReq, request: Request):
    # Public, unauthenticated teaser widget on the landing page — stricter limits,
    # cheaper/faster model, no BYOK headers honored (see agents._demo_llm), and
    # deliberately stateless: never touches wishlist/alerts/search history.
    check_rate_limit(request, bucket="assistant_demo", limit=5, window_s=3600, global_limit=200)
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Please enter a product or question.")
    if len(req.message) > 200:
        raise HTTPException(status_code=400, detail="Input too long.")
    return agents.assistant_demo(req.message)

@app.post("/api/reviews")
def reviews(req: ReviewReq):
    res = agents.review_intel(req.product or "", req.reviews_text or "", req.rating or 0)
    verdict = res.get("verdict", "")
    pros = "\n".join(f"- {p}" for p in res.get("pros", []))
    cons = "\n".join(f"- {c}" for c in res.get("cons", []))
    summary = f"### 📊 Review Analysis for {req.product or 'Product'}\n\n**Verdict:** {verdict}\n\n**👍 Pros:**\n{pros}\n\n**👎 Cons:**\n{cons}"
    return {"summary": summary}

@app.get("/api/recommend")
def recommend(category: str = ""):
    return agents.recommend(category)

@app.post("/api/trend")
def trend(req: TrendReq):
    res = agents.trend(req.query, req.weeks or 12)
    pts = res.get("points", [])
    if not pts:
        return {"trend": None, "message": "No price trend data found for this keyword."}
    return {
        "trend": "downward" if res.get("direction") == "falling" else "upward",
        "message": res.get("summary", ""),
        "low": min(pts),
        "high": max(pts),
        "points": pts,
    }


# ── Wishlist & Alerts History API ─────────────────────────────────────────────
@app.get("/api/wishlist")
def get_wishlist(limit: int = 50):
    return {"wishlist": db.list_wishlist(limit)}

@app.post("/api/wishlist")
def add_wishlist(req: WishlistReq):
    item_id = db.add_to_wishlist(req.title, req.price, req.platform, req.url)
    return {"success": True, "id": item_id}

@app.delete("/api/wishlist/{item_id}")
def delete_wishlist(item_id: int):
    success = db.delete_wishlist_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"success": True}

@app.get("/api/alerts")
def get_alerts(limit: int = 50):
    return {"alerts": db.list_price_alerts(limit)}

@app.post("/api/alerts")
def add_alert(req: AlertReq):
    alert_id = db.add_price_alert(req.title, req.target_price, req.current_price, req.platform)
    return {"success": True, "id": alert_id}

@app.delete("/api/alerts/{alert_id}")
def delete_alert(alert_id: int):
    success = db.delete_price_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"success": True}

@app.get("/api/searches")
def get_searches(limit: int = 50):
    return {"searches": db.list_searches(limit)}


# ── Static frontend mounting ──────────────────────────────────────────────────
# Enterprise features: auth, AI tools, analytics, export, alerts
from features import router as _feat_router
app.include_router(_feat_router)

if config.STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(config.STATIC_DIR), html=True), name="frontend")
else:
    @app.get("/")
    def _nf():
        return JSONResponse({
            "status": "API running",
            "frontend": "Next.js frontend not built yet. Build with 'npm run build' inside frontend/",
            "docs": "/docs"
        })

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[AVP Emart] provider={agents.active_provider()} | mode={comparator.mode()} | db={config.DB_PATH}")
    uvicorn.run(app, host="0.0.0.0", port=port)
