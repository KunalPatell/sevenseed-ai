# -*- coding: utf-8 -*-
"""
AVPU — Vector RAG layer.

A small, dependency-tolerant semantic search index used to ground the AI Tutor,
Placement Matcher and Smart Admissions. It prefers real embeddings and degrades
gracefully so the app runs anywhere:

    1. sentence-transformers (all-MiniLM-L6-v2)  → true dense embeddings
    2. scikit-learn TF-IDF + cosine              → solid lexical-semantic search
    3. pure-python token overlap                 → always-available fallback

The same interface (`Index.search`) is used regardless of backend, so production
can add `sentence-transformers`/`chromadb` with no code changes.
"""

from __future__ import annotations
import math
import re
from typing import List, Dict, Any

_WORD = re.compile(r"[a-z0-9+#.]+")


def _tokens(text: str) -> List[str]:
    return _WORD.findall(text.lower())


# ── Backend detection (best available) ───────────────────────────────────────
_BACKEND = "overlap"
_st_model = None
try:  # 1) dense embeddings
    from sentence_transformers import SentenceTransformer  # type: ignore
    import numpy as _np  # noqa
    _st_model = SentenceTransformer("all-MiniLM-L6-v2")
    _BACKEND = "embeddings"
except Exception:
    try:  # 2) TF-IDF
        from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
        from sklearn.metrics.pairwise import linear_kernel  # type: ignore
        import numpy as _np  # noqa
        _BACKEND = "tfidf"
    except Exception:
        _BACKEND = "overlap"


def backend_name() -> str:
    return {
        "embeddings": "MiniLM embeddings (sentence-transformers)",
        "tfidf": "TF-IDF vector search (scikit-learn)",
        "overlap": "token-overlap search",
    }[_BACKEND]


class Index:
    """A searchable index over (document, metadata) pairs."""

    def __init__(self, docs: List[str], metas: List[Dict[str, Any]]):
        self.docs = docs
        self.metas = metas
        self._matrix = None
        self._vectorizer = None
        self._emb = None
        self._tok_sets = None
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
            scores = []
            for ts in self._tok_sets:
                inter = len(qset & ts)
                denom = math.sqrt(len(qset) * len(ts)) or 1
                scores.append(inter / denom)
        ranked = sorted(range(len(self.docs)), key=lambda i: scores[i], reverse=True)[:n]
        out = []
        for i in ranked:
            s = float(scores[i])
            out.append({**self.metas[i], "score": round(max(0.0, min(1.0, s)) * 100, 1)})
        return out


# ── Prebuilt indexes over AVPU data ──────────────────────────────────────────
_knowledge_index = None
_program_index = None
_company_index = None


def _load():
    global _knowledge_index, _program_index, _company_index
    if _knowledge_index is not None:
        return
    from data import PROGRAMS, COMPANIES, KNOWLEDGE

    # Knowledge (tutor) — title repeated to weight topic keywords in retrieval
    kdocs = [f"{title}. {title}. {body}" for title, body in KNOWLEDGE]
    kmetas = [{"title": t, "body": b} for t, b in KNOWLEDGE]
    _knowledge_index = Index(kdocs, kmetas)

    # Programs (admissions)
    pdocs = [
        f"{p['name']} ({p['level']}, {p['duration']}). {p['desc']} "
        f"Skills: {', '.join(p['skills'])}. Careers: {', '.join(p['careers'])}. Eligibility: {p['eligibility']}."
        for p in PROGRAMS
    ]
    _program_index = Index(pdocs, list(PROGRAMS))

    # Companies (placement)
    cdocs = [
        f"{c['name']} — {c['sector']} in {c['city']}. Hiring for {', '.join(c['roles'])}. "
        f"Required skills: {', '.join(c['skills'])}."
        for c in COMPANIES
    ]
    _company_index = Index(cdocs, list(COMPANIES))
    print(f"[RAG] indexes ready via {backend_name()} — "
          f"{len(kdocs)} knowledge / {len(pdocs)} programs / {len(cdocs)} companies")


def search_knowledge(query: str, n: int = 4) -> List[Dict[str, Any]]:
    _load()
    return _knowledge_index.search(query, n)


def search_programs(query: str, n: int = 4) -> List[Dict[str, Any]]:
    _load()
    return _program_index.search(query, n)


def search_companies(query: str, n: int = 6) -> List[Dict[str, Any]]:
    _load()
    return _company_index.search(query, n)


def counts() -> Dict[str, int]:
    from data import PROGRAMS, COMPANIES, KNOWLEDGE
    return {"programs": len(PROGRAMS), "companies": len(COMPANIES), "knowledge": len(KNOWLEDGE)}
