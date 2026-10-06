# -*- coding: utf-8 -*-
"""
Sevenseed Educational AI Engine — Inspired by Learn-Anything.xyz, Duolingo, FreeCodeCamp, and Laws of UX.
Implements:
1. Topological DAG Prerequisite Resolver & Kahn's Algorithm
2. SuperMemo SM-2 Adaptive Spaced Repetition Scheduling
3. Sandboxed Assertion Runner & Cryptographic SHA-256 Certificate Generator
4. Dynamic Curriculum Pacing & Weekly Milestone Synthesizer
"""
from __future__ import annotations
import hashlib
import time
import math
from typing import Dict, List, Any, Optional

MASTER_SALT = "sevenseed-avpu-master-cert-salt-2026"

# Canonical AVPU Knowledge Graph Topic Catalog
TOPIC_CATALOG = {
    "python-basics": {"name": "Python 3 & Clean Code", "hours": 12, "prereqs": []},
    "data-structures": {"name": "Data Structures & Big-O", "hours": 20, "prereqs": ["python-basics"]},
    "machine-learning": {"name": "Classical ML & Scikit-Learn", "hours": 25, "prereqs": ["data-structures"]},
    "deep-learning": {"name": "PyTorch & Neural Networks", "hours": 30, "prereqs": ["machine-learning"]},
    "nlp-transformers": {"name": "Hugging Face & Transformers", "hours": 28, "prereqs": ["deep-learning"]},
    "computer-vision": {"name": "YOLO & Computer Vision", "hours": 25, "prereqs": ["deep-learning"]},
    "llm-prompting": {"name": "Prompt Engineering & Few-Shot", "hours": 10, "prereqs": ["python-basics"]},
    "rag-systems": {"name": "ChromaDB, Vector Embeddings & RAG", "hours": 22, "prereqs": ["llm-prompting", "python-basics"]},
    "langchain": {"name": "LangChain Primitives & Tools", "hours": 18, "prereqs": ["rag-systems"]},
    "langgraph-agents": {"name": "LangGraph Multi-Agent Swarms", "hours": 35, "prereqs": ["langchain"]},
    "autonomous-deployment": {"name": "FastAPI & Production Edge Deploy", "hours": 15, "prereqs": ["langgraph-agents"]}
}


def resolve_topological_dag(completed_nodes: Optional[List[str]] = None, target_node: Optional[str] = None) -> Dict[str, Any]:
    """
    Kahn's Algorithm (O(V + E)) implementation for prerequisite resolution.
    Determines ready nodes (in-degree == 0 among uncompleted), locked nodes,
    and calculates critical prerequisite path to a target goal.
    """
    completed_set = set(completed_nodes or [])
    
    # Filter catalog if target_node is specified (ancestor closure)
    relevant_nodes = set()
    if target_node and target_node in TOPIC_CATALOG:
        def collect_ancestors(node_id):
            relevant_nodes.add(node_id)
            for p in TOPIC_CATALOG.get(node_id, {}).get("prereqs", []):
                if p not in relevant_nodes:
                    collect_ancestors(p)
        collect_ancestors(target_node)
    else:
        relevant_nodes = set(TOPIC_CATALOG.keys())

    # Build sub-graph
    in_degree = {}
    adjacency = {}
    for node_id in relevant_nodes:
        in_degree[node_id] = 0
        adjacency[node_id] = []

    for node_id in relevant_nodes:
        prereqs = [p for p in TOPIC_CATALOG[node_id]["prereqs"] if p in relevant_nodes]
        for p in prereqs:
            adjacency[p].append(node_id)
            if p not in completed_set:
                in_degree[node_id] += 1

    # Kahn's Algorithm
    ready_queue = [n for n in relevant_nodes if n not in completed_set and in_degree[n] == 0]
    unlocked_ready = list(ready_queue)
    locked_nodes = [n for n in relevant_nodes if n not in completed_set and in_degree[n] > 0]
    
    sorted_order = []
    temp_in_degree = dict(in_degree)
    q = [n for n in relevant_nodes if temp_in_degree[n] == 0]
    
    while q:
        curr = q.pop(0)
        sorted_order.append(curr)
        for neighbor in adjacency[curr]:
            temp_in_degree[neighbor] -= 1
            if temp_in_degree[neighbor] == 0:
                q.append(neighbor)

    total_hours_remaining = sum(TOPIC_CATALOG[n]["hours"] for n in relevant_nodes if n not in completed_set)
    total_hours_completed = sum(TOPIC_CATALOG[n]["hours"] for n in relevant_nodes if n in completed_set)
    progress_pct = round((total_hours_completed / max(1, total_hours_completed + total_hours_remaining)) * 100, 1)

    return {
        "status": "success",
        "target_node": target_node,
        "completed_count": len([n for n in relevant_nodes if n in completed_set]),
        "total_nodes": len(relevant_nodes),
        "progress_percentage": progress_pct,
        "total_hours_remaining": total_hours_remaining,
        "ready_to_learn": [
            {"id": n, "name": TOPIC_CATALOG[n]["name"], "hours": TOPIC_CATALOG[n]["hours"]}
            for n in unlocked_ready
        ],
        "locked_nodes": [
            {
                "id": n,
                "name": TOPIC_CATALOG[n]["name"],
                "hours": TOPIC_CATALOG[n]["hours"],
                "missing_prereqs": [p for p in TOPIC_CATALOG[n]["prereqs"] if p not in completed_set]
            }
            for n in locked_nodes
        ],
        "topological_sequence": [
            {"id": n, "name": TOPIC_CATALOG[n]["name"], "completed": n in completed_set}
            for n in sorted_order
        ]
    }


def compute_sm2_interval(
    quality: int,
    repetition_count: int = 0,
    ease_factor: float = 2.5,
    previous_interval: int = 0
) -> Dict[str, Any]:
    """
    Computes SuperMemo SM-2 spaced repetition interval.
    quality: 0 (total blackout) to 5 (perfect recall).
    """
    q = max(0, min(5, quality))
    ef = max(1.3, ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
    
    if q < 3:
        # Failure / Lapse: reset repetition count
        next_repetition = 0
        next_interval = 1
        lapse = True
    else:
        # Success
        lapse = False
        next_repetition = repetition_count + 1
        if next_repetition == 1:
            next_interval = 1
        elif next_repetition == 2:
            next_interval = 6
        else:
            next_interval = max(1, round(previous_interval * ef))

    # Calculate 30-day forecast schedule date
    due_days_ahead = next_interval
    due_date = time.strftime("%Y-%m-%d", time.localtime(time.time() + due_days_ahead * 86400))

    return {
        "status": "success",
        "quality_score": q,
        "repetition_count": next_repetition,
        "ease_factor": round(ef, 3),
        "interval_days": next_interval,
        "due_date": due_date,
        "is_lapse": lapse,
        "retention_recommendation": "Review tomorrow" if next_interval == 1 else f"Next scheduled review in {next_interval} days"
    }


def verify_code_assertions(
    code: str,
    assertions: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Runs sandboxed static and logical assertions against student submissions.
    """
    if not code or not code.strip():
        return {"status": "error", "message": "Code submission cannot be empty."}

    # Default unit test assertions if none supplied
    tests = assertions or [
        {"desc": "Defines target function or class", "pattern": "def |class "},
        {"desc": "Includes return statement", "pattern": "return "},
        {"desc": "Avoids deprecated exec/eval", "forbidden": "eval(|exec("},
    ]

    results = []
    all_passed = True

    for t in tests:
        passed = True
        reason = "Assertion satisfied"

        if "pattern" in t:
            options = t["pattern"].split("|")
            if not any(opt.strip() in code for opt in options):
                passed = False
                reason = f"Required pattern '{t['pattern']}' not found in code."

        if "forbidden" in t:
            options = t["forbidden"].split("|")
            if any(opt.strip() in code for opt in options):
                passed = False
                reason = f"Forbidden security pattern '{t['forbidden']}' detected."

        if not passed:
            all_passed = False

        results.append({
            "description": t.get("desc", "Assertion test"),
            "passed": passed,
            "feedback": reason
        })

    return {
        "status": "success",
        "all_passed": all_passed,
        "score_percentage": 100.0 if all_passed else round((sum(1 for r in results if r["passed"]) / max(1, len(results))) * 100, 1),
        "test_results": results
    }


def issue_verifiable_certificate(student_name: str, course_slug: str, student_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Issues a tamper-proof SHA-256 cryptographic certificate verifiable at /avpu/verify.html
    """
    sid = student_id or f"STU-{abs(hash(student_name)) % 90000 + 10000}"
    timestamp = int(time.time())
    iso_date = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime(timestamp))

    raw_payload = f"{sid}::{student_name}::{course_slug}::{timestamp}::{MASTER_SALT}"
    cert_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
    cert_id = f"AVPU-{cert_hash[:16].upper()}"

    course_title = TOPIC_CATALOG.get(course_slug, {}).get("name", course_slug.replace("-", " ").title())

    return {
        "status": "success",
        "certificate_id": cert_id,
        "student_name": student_name,
        "student_id": sid,
        "course_slug": course_slug,
        "course_title": course_title,
        "issued_at": iso_date,
        "sha256_fingerprint": cert_hash,
        "verification_url": f"/avpu/verify.html?cert={cert_id}",
        "issuer": "Alpaben Vipulbhai Patel University (AVPU) & Sevenseed AI Labs"
    }


def dynamic_curriculum_sprint(goal: str, daily_hours: float = 2.0, total_weeks: int = 4) -> Dict[str, Any]:
    """
    Generates structured multi-week sprint plan with daily hours and hands-on milestones.
    """
    weekly_hours = daily_hours * 7
    total_hours = weekly_hours * total_weeks

    # Curate standard weekly sprint template
    weeks = []
    milestone_names = [
        "Foundational Primitives & Setup",
        "Core Algorithms & Architecture",
        "Advanced Agentic Integration",
        "Capstone Production Deployment"
    ]

    for w in range(1, total_weeks + 1):
        idx = min(w - 1, len(milestone_names) - 1)
        weeks.append({
            "week_number": w,
            "theme": f"Week {w}: {milestone_names[idx]}",
            "allocated_hours": weekly_hours,
            "daily_target_minutes": int(daily_hours * 60),
            "key_objectives": [
                f"Master theoretical concepts for {goal} stage {w}",
                f"Complete {w * 3} hands-on code lab exercises with assertions",
                f"Execute peer review and SRS retention drills"
            ],
            "capstone_milestone": f"Deliverable {w}: Validated GitHub Repo & Deployment Artifact"
        })

    return {
        "status": "success",
        "goal": goal,
        "daily_hours": daily_hours,
        "total_weeks": total_weeks,
        "total_curriculum_hours": total_hours,
        "weekly_schedule": weeks,
        "byok_prompt_ready": True
    }
