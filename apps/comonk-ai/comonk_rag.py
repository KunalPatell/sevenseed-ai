# -*- coding: utf-8 -*-
"""
Comonk AI — RAG System (ChromaDB)
Loads 541 Ahmedabad/Gandhinagar IT companies into a local vector store.
Uses ChromaDB's built-in ONNX embeddings — no extra API key needed.
"""

import os
from typing import List, Dict
import openpyxl
import chromadb
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

_DATA_DIR = "/data" if os.path.exists("/data") and os.access("/data", os.W_OK) else os.path.dirname(os.path.abspath(__file__))
CHROMA_DIR = os.path.join(_DATA_DIR, "chroma_db")
EXCEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Ahmedabad_IT_AIML_FINAL_MASTER.xlsx")

_client = None
_collection = None


def _get_collection():
    global _client, _collection
    if _collection is not None:
        return _collection

    _client = chromadb.PersistentClient(path=CHROMA_DIR)
    emb = DefaultEmbeddingFunction()          # all-MiniLM-L6-v2 via ONNX, auto-downloaded once

    _collection = _client.get_or_create_collection(
        name="comonk_companies_v2",
        embedding_function=emb,
        metadata={"hnsw:space": "cosine"},
    )

    if _collection.count() == 0:
        _index_companies()
    else:
        print(f"[RAG] ChromaDB ready — {_collection.count()} companies indexed")

    return _collection


def _index_companies():
    if not os.path.exists(EXCEL_PATH):
        print(f"[RAG] Excel not found: {EXCEL_PATH}")
        return

    wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True)
    ws = wb["All Companies"]
    docs, ids, metas = [], [], []

    for idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True)):
        if not row[1]:
            continue
        # New sheet layout: No, Company, Category, City, Roles, Phone, Website,
        # Address, LinkedIn, Priority, Source, Email 1..17
        r = tuple(row) + (None,) * 28
        name, cat, city, roles = r[1], r[2], r[3], r[4]
        phone, website, address, linkedin = r[5], r[6], r[7], r[8]
        emails = [str(e).strip() for e in r[11:28] if e and "@" in str(e)]

        # Rich natural-language document for semantic embedding
        doc = (
            f"{name} is a {cat or 'software'} company located in {address or 'Ahmedabad, Gujarat, India'}. "
            f"They recruit for: {roles or 'software development, programming'}. "
            f"Technologies and domains: {cat or 'IT services'}."
        )

        docs.append(doc)
        ids.append(str(idx))
        metas.append({
            "db_id": idx,
            "name": str(name).strip(),
            "category": str(cat or "").strip(),
            "roles": str(roles or "").strip(),
            "primary_email": emails[0] if emails else "",
            "all_emails": "|".join(emails),
            "phone": str(phone or "").strip(),
            "website": str(website or "").strip(),
            "linkedin": str(linkedin or "").strip(),
            "address": str(address or "").strip(),
            "has_email": 1 if emails else 0,
            "has_phone": 1 if phone else 0,
            "is_aiml": 1 if "AI" in str(cat) else 0,
        })

    wb.close()

    for i in range(0, len(docs), 50):
        _collection.add(
            documents=docs[i:i + 50],
            ids=ids[i:i + 50],
            metadatas=metas[i:i + 50],
        )

    print(f"[RAG] Indexed {len(docs)} companies into ChromaDB at {CHROMA_DIR}")


def search_companies(query: str, n: int = 10, ai_only: bool = False) -> List[Dict]:
    """Semantic search over the company database. Returns list of company dicts with match_score (0-100)."""
    col = _get_collection()
    where = {"is_aiml": 1} if ai_only else None

    try:
        results = col.query(
            query_texts=[query],
            n_results=min(n, col.count()),
            where=where,
            include=["metadatas", "distances"],
        )
        out = []
        for meta, dist in zip(results["metadatas"][0], results["distances"][0]):
            emails = [e for e in meta.get("all_emails", "").split("|") if e]
            out.append({
                "id": meta["db_id"],
                "name": meta["name"],
                "category": meta["category"],
                "roles": meta["roles"],
                "emails": emails,
                "phone": meta["phone"],
                "website": meta["website"],
                "linkedin": meta["linkedin"],
                "address": meta["address"],
                "score": round(max(0, 1 - dist) * 100, 1),
            })
        return out
    except Exception as e:
        print(f"[RAG] query error: {e}")
        return []


def get_company_count() -> int:
    return _get_collection().count()
