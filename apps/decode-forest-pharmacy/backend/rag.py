# -*- coding: utf-8 -*-
"""
Decode Forest Pharmacy — RAG layer.

Three searchable indexes:
  1. health_index    — general medicine / pharmacy knowledge
  2. medicine_index  — medicines catalogue (search by name, symptom, category)
  3. interaction_index — drug-drug interactions

Backend priority: sentence-transformers → TF-IDF → token-overlap fallback.
"""

from __future__ import annotations
import math
import re
from typing import List, Dict, Any

_WORD = re.compile(r"[a-z0-9+#.]+")


def _tokens(text: str) -> List[str]:
    return _WORD.findall(text.lower())


# ── Backend detection ─────────────────────────────────────────────────────────
_BACKEND = "overlap"
_st_model = None
try:
    from sentence_transformers import SentenceTransformer  # type: ignore
    import numpy as _np  # noqa
    _st_model = SentenceTransformer("all-MiniLM-L6-v2")
    _BACKEND = "embeddings"
except Exception:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
        from sklearn.metrics.pairwise import linear_kernel  # type: ignore
        import numpy as _np  # noqa
        _BACKEND = "tfidf"
    except Exception:
        _BACKEND = "overlap"


def backend_name() -> str:
    return {"embeddings": "MiniLM embeddings", "tfidf": "TF-IDF", "overlap": "token-overlap"}[_BACKEND]


class Index:
    def __init__(self, docs: List[str], metas: List[Dict[str, Any]]):
        self.docs = docs
        self.metas = metas
        self._matrix = self._vectorizer = self._emb = self._tok_sets = None
        self._build()

    def _build(self):
        if _BACKEND == "embeddings":
            self._emb = _st_model.encode(self.docs, normalize_embeddings=True)
        elif _BACKEND == "tfidf":
            from sklearn.feature_extraction.text import TfidfVectorizer
            self._vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), min_df=1)
            self._matrix = self._vectorizer.fit_transform(self.docs)
        else:
            self._tok_sets = [set(_tokens(d)) for d in self.docs]

    def search(self, query: str, n: int = 5) -> List[Dict[str, Any]]:
        if not query.strip() or not self.docs:
            return []
        if _BACKEND == "embeddings":
            import numpy as np
            q = _st_model.encode([query], normalize_embeddings=True)[0]
            scores = self._emb @ q
        elif _BACKEND == "tfidf":
            from sklearn.metrics.pairwise import linear_kernel
            qv = self._vectorizer.transform([query])
            scores = linear_kernel(qv, self._matrix).ravel()
        else:
            qset = set(_tokens(query))
            scores = [
                len(qset & ts) / (math.sqrt(len(qset) * len(ts)) or 1)
                for ts in self._tok_sets
            ]
        ranked = sorted(range(len(self.docs)), key=lambda i: scores[i], reverse=True)[:n]
        return [{**self.metas[i], "score": round(max(0.0, min(1.0, float(scores[i]))) * 100, 1)} for i in ranked]


# ── Prebuilt indexes ─────────────────────────────────────────────────────────
_health_index = _medicine_index = _interaction_index = _symptom_index = None


def _load():
    global _health_index, _medicine_index, _interaction_index, _symptom_index
    if _health_index is not None:
        return
    from data import MEDICINES, INTERACTIONS, HEALTH_KNOWLEDGE, SYMPTOMS

    # Health knowledge
    kdocs = [f"{t}. {t}. {b}" for t, b in HEALTH_KNOWLEDGE]
    _health_index = Index(kdocs, [{"title": t, "body": b} for t, b in HEALTH_KNOWLEDGE])

    # Medicines
    mdocs = [
        f"{m['name']} {m['generic']} {m['brand']} {m['category']} {m['use']} {m['dose']}"
        for m in MEDICINES
    ]
    _medicine_index = Index(mdocs, list(MEDICINES))

    # Drug interactions
    idocs = [
        f"{i['drug_a']} {i['drug_b']} interaction: {i['effect']} {i['advice']}"
        for i in INTERACTIONS
    ]
    _interaction_index = Index(idocs, list(INTERACTIONS))

    # Symptoms
    sdocs = [f"{s['symptom']} {s['otc']} {s['warning']}" for s in SYMPTOMS]
    _symptom_index = Index(sdocs, list(SYMPTOMS))

    print(f"[RAG] pharmacy indexes ready via {backend_name()} — "
          f"{len(MEDICINES)} medicines / {len(INTERACTIONS)} interactions / "
          f"{len(HEALTH_KNOWLEDGE)} health topics / {len(SYMPTOMS)} symptoms")


def search_health(query: str, n: int = 4) -> List[Dict[str, Any]]:
    _load(); return _health_index.search(query, n)

def search_medicines(query: str, n: int = 5) -> List[Dict[str, Any]]:
    _load(); return _medicine_index.search(query, n)

def search_interactions(query: str, n: int = 4) -> List[Dict[str, Any]]:
    _load(); return _interaction_index.search(query, n)

def search_symptoms(query: str, n: int = 3) -> List[Dict[str, Any]]:
    _load(); return _symptom_index.search(query, n)

def counts() -> Dict[str, int]:
    from data import MEDICINES, INTERACTIONS, HEALTH_KNOWLEDGE, SYMPTOMS
    return {"medicines": len(MEDICINES), "interactions": len(INTERACTIONS),
            "health_topics": len(HEALTH_KNOWLEDGE), "symptoms": len(SYMPTOMS)}
