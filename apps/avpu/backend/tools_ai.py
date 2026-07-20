# -*- coding: utf-8 -*-
"""
AVPU — additional AI study tools.
Quiz generator, AI career path, flashcards, code helper, study planner.
Each uses the LLM when a key is present and a useful offline fallback otherwise.
"""
from __future__ import annotations
import json
import random
import re

import rag
from agents import _llm_text, active_provider


def _first_sentence(text: str, limit: int = 140) -> str:
    s = re.split(r"(?<=[.!?])\s+", text.strip())[0]
    return (s[:limit] + "…") if len(s) > limit else s


# ── Quiz generator ───────────────────────────────────────────────────────────
def generate_quiz(topic: str, n: int = 5) -> dict:
    n = max(3, min(10, int(n)))
    system = ("You are an AVPU exam setter. Create a multiple-choice quiz as strict JSON: "
              '{"questions":[{"question":"...","options":["a","b","c","d"],"answer":0,"explanation":"..."}]}. '
              f"Make exactly {n} questions on the topic. answer is the 0-based index of the correct option.")
    out = _llm_text(system, f"Topic: {topic}", 0.5)
    if out:
        try:
            data = json.loads(out[out.find("{"): out.rfind("}") + 1])
            qs = data.get("questions", [])[:n]
            if qs:
                return {"topic": topic, "questions": qs, "provider": active_provider()}
        except Exception:
            pass
    # Offline: build MCQs from the knowledge base
    items = rag.search_knowledge(topic, n + 4)
    pool = [i for i in items if i.get("body")]
    questions = []
    for i, it in enumerate(pool[:n]):
        correct = _first_sentence(it["body"])
        others = [p for p in pool if p is not it] or pool
        distractors = random.sample(others, min(3, len(others)))
        opts = [correct] + [_first_sentence(d["body"]) for d in distractors]
        opts = list(dict.fromkeys(opts))[:4]
        while len(opts) < 4:
            opts.append("None of the above")
        random.shuffle(opts)
        questions.append({
            "question": f"Which statement best describes “{it['title']}”?",
            "options": opts, "answer": opts.index(correct),
            "explanation": f"{it['title']}: {it['body'][:160]}",
        })
    if not questions:
        questions = [{"question": f"What is a key concept in {topic}?",
                      "options": ["It is a core study area", "It is unrelated", "It is deprecated", "None"],
                      "answer": 0, "explanation": "Explore this topic with the AI Tutor for details."}]
    return {"topic": topic, "questions": questions, "provider": active_provider()}


# ── AI Career Path ───────────────────────────────────────────────────────────
def career_path(interests: str, skills: str = "", goal: str = "") -> dict:
    query = f"{interests} {skills} {goal}".strip()
    companies = rag.search_companies(query, 5)
    programs = rag.search_programs(query, 2)
    system = ("You are an AVPU career counsellor. Given a student's interests and skills, lay out a clear career "
              "path: target role, a program to consider, 4 milestone stages, and 3-5 skills to learn. Be concrete.")
    advice = _llm_text(system, f"Interests: {interests}\nSkills: {skills}\nGoal: {goal}\n"
                               f"Companies hiring: {[c['name'] for c in companies]}", 0.5)
    have = {s.strip().lower() for s in re.split(r"[,\s]+", skills) if s.strip()}
    gaps = []
    for c in companies:
        for s in c.get("skills", []):
            if s.lower() not in have and s not in gaps:
                gaps.append(s)
    target_role = (companies[0]["roles"][0] if companies and companies[0].get("roles") else goal or "Software Engineer")
    stages = [
        ("Foundation", f"Master the fundamentals for {target_role} and strengthen your core skills."),
        ("Build Projects", "Ship 2-3 portfolio projects that demonstrate real, job-ready ability."),
        ("Internship / Live Work", "Get industry exposure through an internship or live client project."),
        ("Land the Role", f"Apply to matched companies and interview for {target_role} positions."),
    ]
    return {
        "target_role": target_role,
        "program": programs[0]["name"] if programs else "",
        "stages": [{"title": t, "detail": d} for t, d in stages],
        "skills_to_learn": gaps[:6],
        "companies": [{"name": c["name"], "roles": c.get("roles", []), "match": c.get("score", 0)} for c in companies[:5]],
        "advice": advice or f"A strong path toward **{target_role}**: build fundamentals, ship projects, gain internship experience, then apply to matched companies.",
        "provider": active_provider(),
    }


# ── Flashcards ───────────────────────────────────────────────────────────────
def flashcards(topic: str, text: str = "", n: int = 6) -> dict:
    n = max(3, min(12, int(n)))
    src = text.strip() or topic
    system = ('Create study flashcards as strict JSON: {"cards":[{"front":"question","back":"answer"}]}. '
              f"Make {n} concise, high-yield cards.")
    out = _llm_text(system, src[:5000], 0.4)
    if out:
        try:
            data = json.loads(out[out.find("{"): out.rfind("}") + 1])
            cards = data.get("cards", [])[:n]
            if cards:
                return {"topic": topic, "cards": cards, "provider": active_provider()}
        except Exception:
            pass
    cards = []
    if text.strip():
        sents = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.split()) > 4][:n]
        for i, s in enumerate(sents):
            words = s.split()
            key = max(words, key=len)
            cards.append({"front": s.replace(key, "_____", 1), "back": key})
    else:
        for it in rag.search_knowledge(topic, n):
            cards.append({"front": f"What is {it['title']}?", "back": it["body"]})
    if not cards:
        cards = [{"front": f"Define {topic}", "back": "Ask the AI Tutor to explain this topic in depth."}]
    return {"topic": topic, "cards": cards, "provider": active_provider()}


# ── Code Helper ──────────────────────────────────────────────────────────────
_LANGS = {"python": ["def ", "import ", "print(", "elif", "self"], "javascript": ["function", "const ", "let ", "=>", "console.log"],
          "java": ["public class", "System.out", "void ", "import java"], "c++": ["#include", "std::", "cout", "int main"]}


def code_helper(code: str, question: str = "") -> dict:
    system = ("You are an AVPU programming tutor. Explain what the code does, point out bugs or improvements, "
              "and answer the student's question. Use short paragraphs and a corrected snippet if needed.")
    ans = _llm_text(system, f"Question: {question or 'Explain and review this code.'}\n\nCode:\n{code}", 0.3)
    if ans:
        return {"result": ans, "provider": active_provider()}
    lang = max(_LANGS, key=lambda l: sum(1 for kw in _LANGS[l] if kw in code)) if code.strip() else "unknown"
    lines = [ln for ln in code.splitlines() if ln.strip()]
    notes = []
    if lang == "python":
        for i, ln in enumerate(code.splitlines(), 1):
            st = ln.strip()
            if re.match(r"^(def|if|for|while|else|elif|class|try|except|with)\b", st) and not st.endswith(":") and not st.endswith("\\"):
                notes.append(f"Line {i}: looks like a block statement missing a trailing ':'")
    notes.append(f"Detected language: {lang.title()} · {len(lines)} lines of code.")
    result = ("**Code review (offline):**\n\n" + "\n".join(f"• {n}" for n in notes) +
              "\n\nAdd a free GROQ_API_KEY to unlock line-by-line explanations, bug fixes and rewrites from the AI tutor.")
    return {"result": result, "provider": active_provider()}


# ── Study Planner (daily schedule) ───────────────────────────────────────────
def study_planner(goal: str, hours_per_day: float = 3, days: int = 7) -> dict:
    days = max(3, min(30, int(days)))
    hours_per_day = max(1, min(12, float(hours_per_day)))
    system = ("You are an AVPU study coach. Build a day-by-day study schedule with time blocks. "
              f"Cover {days} days at {hours_per_day} hours/day toward the goal. Keep it practical.")
    out = _llm_text(system, f"Goal: {goal}", 0.5)
    topics = [i["title"] for i in rag.search_knowledge(goal, days)] or ["Fundamentals"]
    while len(topics) < days:
        topics.append(topics[len(topics) % len(topics)])
    plan = []
    for d in range(days):
        study_h = round(hours_per_day * 0.6, 1)
        practice_h = round(hours_per_day - study_h, 1)
        plan.append({
            "day": d + 1, "focus": topics[d],
            "blocks": [
                {"time": f"{study_h}h", "activity": f"Learn: {topics[d]} — concepts & notes"},
                {"time": f"{practice_h}h", "activity": f"Practice: exercises / a mini-project on {topics[d]}"},
            ],
        })
    plan[-1]["focus"] = "Revision & Capstone"
    plan[-1]["blocks"] = [{"time": f"{hours_per_day}h", "activity": f"Revise everything and build one capstone project for '{goal}'."}]
    return {"goal": goal, "days": days, "hours_per_day": hours_per_day,
            "plan": plan, "llm_note": out or "", "provider": active_provider()}


# ── Interview Simulator ──────────────────────────────────────────────────────
def interview_sim(role: str, n: int = 5) -> dict:
    n = max(3, min(8, int(n)))
    system = ('Create a mock interview as strict JSON: {"questions":[{"q":"...","tip":"..."}]}. '
              f"Exactly {n} realistic questions for the role, each with a one-line answering tip.")
    out = _llm_text(system, f"Role: {role}", 0.5)
    if out:
        try:
            data = json.loads(out[out.find("{"): out.rfind("}") + 1])
            qs = data.get("questions", [])[:n]
            if qs:
                return {"role": role, "questions": qs, "provider": active_provider()}
        except Exception:
            pass
    base = [("Tell me about yourself.", "Keep it 60-90s and tie it to the role."),
            (f"Why do you want this {role} role?", "Show genuine interest and a clear fit."),
            ("Describe a challenging project you worked on.", "Use STAR: Situation, Task, Action, Result."),
            ("Explain a technical concept you know well.", "Explain simply, with a real example."),
            ("Where do you see yourself in 3 years?", "Align your answer with growth in this field."),
            ("What is your biggest weakness?", "Pick a real one + how you're improving it."),
            ("Do you have any questions for us?", "Always ask 1-2 thoughtful questions.")]
    return {"role": role, "questions": [{"q": q, "tip": t} for q, t in base[:n]], "provider": active_provider()}


# ── Essay Grader ─────────────────────────────────────────────────────────────
def essay_grade(essay: str, topic: str = "") -> dict:
    system = ("You are an examiner. Grade the essay out of 100 for content, structure and clarity. Format exactly:\n"
              "SCORE: <number>\nFEEDBACK: <2-3 sentences>\nSTRENGTHS: a; b\nIMPROVE: a; b")
    out = _llm_text(system, f"Topic: {topic}\n\nEssay:\n{essay}", 0.3)
    if out:
        m = re.search(r"SCORE:\s*(\d+)", out)
        score = max(0, min(100, int(m.group(1)))) if m else 70
        fb = re.search(r"FEEDBACK:\s*(.+?)(?:\nSTRENGTHS|\nIMPROVE|$)", out, re.S)
        st = re.search(r"STRENGTHS:\s*(.+?)(?:\nIMPROVE|$)", out, re.S)
        im = re.search(r"IMPROVE:\s*(.+)$", out, re.S)
        return {"score": score, "feedback": (fb.group(1).strip() if fb else out.strip()),
                "strengths": [s.strip() for s in (st.group(1).split(";") if st else []) if s.strip()],
                "improvements": [s.strip() for s in (im.group(1).split(";") if im else []) if s.strip()],
                "provider": active_provider()}
    words = len(essay.split())
    score = max(30, min(90, 40 + words // 10))
    return {"score": score, "words": words,
            "feedback": f"Your essay is ~{words} words. Structure it with a clear introduction, well-developed body paragraphs, and a strong conclusion — and support each point with a concrete example.",
            "strengths": ["attempted the topic"], "improvements": ["add examples", "improve structure & flow"],
            "provider": active_provider()}
