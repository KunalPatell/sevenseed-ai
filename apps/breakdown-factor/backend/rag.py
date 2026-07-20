# -*- coding: utf-8 -*-
"""Breakdown Factor Construction — RAG layer."""
from __future__ import annotations
import math, re
from typing import List, Dict, Any

_WORD = re.compile(r"[a-z0-9+#.]+")
def _tokens(text: str): return _WORD.findall(text.lower())

_BACKEND = "overlap"; _st_model = None
try:
    from sentence_transformers import SentenceTransformer  # type: ignore
    import numpy as _np
    _st_model = SentenceTransformer("all-MiniLM-L6-v2"); _BACKEND = "embeddings"
except Exception:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
        from sklearn.metrics.pairwise import linear_kernel  # type: ignore
        import numpy as _np; _BACKEND = "tfidf"
    except Exception: _BACKEND = "overlap"

def backend_name(): return {"embeddings":"MiniLM embeddings","tfidf":"TF-IDF","overlap":"token-overlap"}[_BACKEND]

class Index:
    def __init__(self, docs, metas):
        self.docs, self.metas = docs, metas
        self._matrix = self._vectorizer = self._emb = self._tok_sets = None; self._build()
    def _build(self):
        if _BACKEND == "embeddings": self._emb = _st_model.encode(self.docs, normalize_embeddings=True)
        elif _BACKEND == "tfidf":
            from sklearn.feature_extraction.text import TfidfVectorizer
            self._vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1,2), min_df=1)
            self._matrix = self._vectorizer.fit_transform(self.docs)
        else: self._tok_sets = [set(_tokens(d)) for d in self.docs]
    def search(self, query, n=5):
        if not query.strip() or not self.docs: return []
        if _BACKEND == "embeddings":
            import numpy as np; q = _st_model.encode([query], normalize_embeddings=True)[0]; scores = self._emb @ q
        elif _BACKEND == "tfidf":
            from sklearn.metrics.pairwise import linear_kernel
            scores = linear_kernel(self._vectorizer.transform([query]), self._matrix).ravel()
        else:
            qset = set(_tokens(query))
            scores = [len(qset & ts)/(math.sqrt(len(qset)*len(ts)) or 1) for ts in self._tok_sets]
        ranked = sorted(range(len(self.docs)), key=lambda i: scores[i], reverse=True)[:n]
        return [{**self.metas[i], "score": round(max(0.,min(1.,float(scores[i])))*100,1)} for i in ranked]

_knowledge_idx = _cost_idx = _safety_idx = _defect_idx = None

def _load():
    global _knowledge_idx, _cost_idx, _safety_idx, _defect_idx
    if _knowledge_idx is not None: return
    from data import CONSTRUCTION_KNOWLEDGE, COST_ITEMS, SAFETY_RISKS, DEFECT_TYPES
    _knowledge_idx = Index([f"{t}. {t}. {b}" for t,b in CONSTRUCTION_KNOWLEDGE],
                           [{"title":t,"body":b} for t,b in CONSTRUCTION_KNOWLEDGE])
    _cost_idx = Index([f"{c['item']} {c['unit']} {c['category']}" for c in COST_ITEMS], list(COST_ITEMS))
    _safety_idx = Index([f"{s['risk']} {s['severity']} {s['category']} {s['mitigation']}" for s in SAFETY_RISKS], list(SAFETY_RISKS))
    _defect_idx = Index([f"{d['defect']} {d['type']} {d['severity']} {d['description']}" for d in DEFECT_TYPES], list(DEFECT_TYPES))
    print(f"[RAG] construction indexes ready via {backend_name()}")

def search_knowledge(q, n=4): _load(); return _knowledge_idx.search(q, n)
def search_costs(q, n=6): _load(); return _cost_idx.search(q, n)
def search_safety(q, n=4): _load(); return _safety_idx.search(q, n)
def search_defects(q, n=4): _load(); return _defect_idx.search(q, n)
def counts():
    from data import CONSTRUCTION_KNOWLEDGE, COST_ITEMS, SAFETY_RISKS, DEFECT_TYPES
    return {"knowledge":len(CONSTRUCTION_KNOWLEDGE),"cost_items":len(COST_ITEMS),
            "safety_risks":len(SAFETY_RISKS),"defect_types":len(DEFECT_TYPES)}
