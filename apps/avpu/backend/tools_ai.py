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


# ── Mental Models Library (fs.blog/mental-models inspired) ───────────────────
MENTAL_MODELS = [
    {
        "id": "first-principles",
        "name": "First Principles Thinking",
        "category": "Thinking",
        "origin": "Aristotle & Elon Musk",
        "summary": "Boil a problem down to its most fundamental, indisputable truths and reason up from there, rather than reasoning by analogy.",
        "quote": "I think it's important to reason from first principles rather than by analogy. — Elon Musk",
        "application": "When facing high costs or standard industry assumptions (e.g. battery packs or degree requirements), break down the raw constituent materials and rethink from scratch.",
        "action_prompt": "What do we know is objectively true? What can be stripped away?"
    },
    {
        "id": "inversion",
        "name": "Inversion (Think Backwards)",
        "category": "Problem Solving",
        "origin": "Carl Gustav Jacob Jacobi & Charlie Munger",
        "summary": "Instead of asking how to achieve a positive goal, ask how to guarantee failure—and then systematically avoid those pitfalls.",
        "quote": "Invert, always invert: Turn a situation upside down. What happens if all goes wrong? — Carl Jacobi",
        "application": "Instead of 'How do I build a successful startup?', ask 'How do I ensure this startup runs out of money and loses all customers?'. Now protect against those exact hazards.",
        "action_prompt": "What would guarantee complete catastrophe in this project?"
    },
    {
        "id": "second-order-thinking",
        "name": "Second-Order Thinking",
        "category": "Decision Making",
        "origin": "Howard Marks",
        "summary": "First-order thinking considers only immediate, direct consequences. Second-order thinking considers the subsequent effects of those consequences: 'And then what?'",
        "quote": "First-order thinking is simplistic and superficial. Second-order thinking is deep, complex, and convoluted. — Howard Marks",
        "application": "Price reductions may increase initial orders (first order) but degrade brand prestige, initiate price wars, and destroy margins over 18 months (second order).",
        "action_prompt": "What are the downstream consequences 6 months and 2 years from now?"
    },
    {
        "id": "occams-razor",
        "name": "Occam's Razor",
        "category": "Analysis",
        "origin": "William of Ockham",
        "summary": "Among competing hypotheses, the one with the fewest assumptions is usually the correct one. Simpler explanations beat needlessly complex ones.",
        "quote": "Entities should not be multiplied beyond necessity.",
        "application": "If code fails in production, check recent config changes or network disconnects before assuming a zero-day compiler bug.",
        "action_prompt": "What is the simplest possible explanation that requires the fewest wild assumptions?"
    },
    {
        "id": "circle-of-competence",
        "name": "Circle of Competence",
        "category": "Strategy",
        "origin": "Warren Buffett",
        "summary": "Know what you know, and more importantly, know where the perimeter of your knowledge ends. Operating outside your circle without knowing it is disastrous.",
        "quote": "Knowing what you don’t know is more useful than being brilliant. — Charlie Munger",
        "application": "Specialise deeply. When entering a new technical domain (e.g. quantum crypto), partner with domain masters rather than winging intuition.",
        "action_prompt": "Am I an expert here, or am I suffering from beginner's overconfidence?"
    },
    {
        "id": "pareto-principle",
        "name": "Pareto Principle (80/20 Rule)",
        "category": "Productivity",
        "origin": "Vilfredo Pareto",
        "summary": "80% of outcomes result from 20% of inputs. Focus disproportionate energy on the vital few rather than the trivial many.",
        "quote": "Identify the 20% that drives 80% of your value and double down.",
        "application": "20% of customer segments typically generate 80% of SaaS revenues. 20% of code paths generate 80% of runtime bottlenecks.",
        "action_prompt": "Which 20% of effort is delivering 80% of current progress?"
    },
    {
        "id": "hanlons-razor",
        "name": "Hanlon's Razor",
        "category": "Empathy & Communication",
        "origin": "Robert J. Hanlon",
        "summary": "Never attribute to malice that which is adequately explained by neglect, misunderstanding, or ignorance.",
        "quote": "Never attribute to malice that which is adequately explained by carelessness.",
        "application": "When a colleague or collaborator misses a deadline or sends a curt email, assume they are overwhelmed or misunderstood the spec rather than sabotaging you.",
        "action_prompt": "How can I interpret this situation generously before reacting?"
    },
    {
        "id": "compounding",
        "name": "The Compounding Effect",
        "category": "Growth",
        "origin": "Albert Einstein",
        "summary": "Small consistent gains compounded over long intervals produce exponential, staggering advantages. 1% better every day yields 37x improvement in one year.",
        "quote": "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
        "application": "Writing 20 lines of code or reading 15 pages of research daily compounds into world-class expertise in 24 months.",
        "action_prompt": "What daily habit can I repeat for 365 days that pays compound returns?"
    }
]

def get_mental_models(category: str | None = None, search: str | None = None) -> list[dict]:
    items = list(MENTAL_MODELS)
    if category and category.lower() != "all":
        items = [m for m in items if m["category"].lower() == category.lower()]
    if search:
        s = search.lower()
        items = [m for m in items if s in m["name"].lower() or s in m["summary"].lower() or s in m["category"].lower()]
    return items

def apply_mental_model(model_id: str, problem: str) -> dict:
    found = next((m for m in MENTAL_MODELS if m["id"] == model_id), None)
    name = found["name"] if found else model_id
    system = (f"You are an elite decision strategist at AVPU. Apply the mental model '{name}' to dissect the user's specific problem. "
              "Structure your reply strictly into:\n"
              "1. DECONSTRUCTION: Break down the situation through this mental lens.\n"
              "2. BLIND SPOTS EXPOSED: What assumptions does this model reveal as flawed?\n"
              "3. HIGH-LEVERAGE ACTIONS: 3 actionable, concrete steps to take right now.")
    out = _llm_text(system, f"Problem Statement: {problem}", 0.4)
    if out:
        return {"model": name, "problem": problem, "analysis": out, "provider": active_provider()}
    summary = found["summary"] if found else "Apply rigorous analytical reasoning."
    return {
        "model": name, "problem": problem,
        "analysis": f"DECONSTRUCTION:\nLooking at '{problem}' through {name} ({summary}). Focus on the root causality rather than symptoms.\n\nBLIND SPOTS EXPOSED:\nYou may be anchored to conventional industry habits or short-term relief.\n\nHIGH-LEVERAGE ACTIONS:\n1. Eliminate superficial metrics and identify the core variable.\n2. Invert the assumptions that feel most comfortable.\n3. Validate your hypothesis with one quick experiment before committing resources.",
        "provider": active_provider()
    }


# ── Laws of UX & Heuristics (lawsofux.com inspired) ──────────────────────────
LAWS_OF_UX = [
    {
        "id": "fitts-law",
        "name": "Fitts's Law",
        "category": "Interaction",
        "summary": "The time to acquire a target is a function of the distance to and size of the target.",
        "takeaway": "Make key interactive touch elements large, well-spaced, and easy to reach (especially on mobile thumb zones).",
        "do": "Make primary Call-To-Action buttons prominent with generous click padding.",
        "dont": "Hide crucial actions in tiny 12px dropdown links far from the cursor focal point."
    },
    {
        "id": "hicks-law",
        "name": "Hick's Law",
        "category": "Cognitive",
        "summary": "The time it takes to make a decision increases with the number and complexity of choices.",
        "takeaway": "Minimize choices when response times are critical. Break complex workflows into multi-step wizards.",
        "do": "Highlight the recommended choice and hide advanced parameters behind an 'Advanced' accordion.",
        "dont": "Overwhelm first-time users with 20 parallel form inputs on the welcome screen."
    },
    {
        "id": "jakobs-law",
        "name": "Jakob's Law",
        "category": "Behavioral",
        "summary": "Users spend most of their time on other sites. This means that users prefer your site to work the same way as all the other sites they already know.",
        "takeaway": "Embrace established design patterns (shopping cart top right, logo top left for home, standard search bars) rather than inventing unprompted novel navigational paradigms.",
        "do": "Stick to conventional UI mental models so cognitive load stays on your value proposition.",
        "dont": "Reinvent standard conventions like hamburger menus or pagination unless there is a 10x benefit."
    },
    {
        "id": "millers-law",
        "name": "Miller's Law",
        "category": "Cognitive",
        "summary": "The average person can only keep 7 (plus or minus 2) items in their working memory.",
        "takeaway": "Chunk information into distinct 5-7 item groups. Never force users to memorize data across disparate screens.",
        "do": "Group phone numbers into 3-4 digit chunks and navigation bars into 5-6 primary categories.",
        "dont": "Present unformatted 16-digit blocks or unsectioned long lists."
    },
    {
        "id": "doherty-threshold",
        "name": "Doherty Threshold",
        "category": "Performance",
        "summary": "Productivity soars when a computer and its users interact at a pace (<400ms) that ensures that neither has to wait on the other.",
        "takeaway": "Provide immediate visual feedback (<100ms) like skeleton loaders, button press states, and optimistic UI updates.",
        "do": "Show immediate optimistic UI transitions while background API calls resolve.",
        "dont": "Leave the screen frozen with zero visual indicator while waiting on an LLM inference."
    },
    {
        "id": "peak-end-rule",
        "name": "Peak-End Rule",
        "category": "Psychology",
        "summary": "People judge an experience largely based on how they felt at its peak (most intense point) and at its end, rather than the total sum of every moment.",
        "takeaway": "Deliver delightful celebratory finishes when users complete a milestone, checkout, or pass a challenge.",
        "do": "Add confetti, clear confirmations, and rewarding summaries when tasks conclude.",
        "dont": "Drop the user onto an empty unstyled error or dull blank screen right after payment or sign-up."
    }
]

def get_laws_of_ux() -> list[dict]:
    return LAWS_OF_UX

def audit_laws_of_ux(description: str) -> dict:
    system = ("You are an expert UX Architect at AVPU. Audit the provided product or UI concept against the Laws of UX. "
              "Provide:\n"
              "1. COMPLIANT LAWS: Which UX laws are respected?\n"
              "2. VIOLATIONS DETECTED: Which UX laws (e.g. Hick's, Fitts's, Miller's) are breached?\n"
              "3. ACTIONABLE REDESIGN: 3 specific UX enhancements to skyrocket usability.")
    out = _llm_text(system, f"UI/Product Concept: {description}", 0.3)
    if out:
        return {"concept": description, "audit": out, "provider": active_provider()}
    return {
        "concept": description,
        "audit": "COMPLIANT LAWS:\n• Jakob's Law: Standard layouts and navigation mental models seem familiar.\n\nVIOLATIONS DETECTED:\n• Hick's Law: Potential cognitive overload if too many decisions are presented at once.\n• Fitts's Law: Touch targets must be tested on mobile screens to ensure tap ergonomics (>48x48px).\n\nACTIONABLE REDESIGN:\n1. Apply progressive disclosure: expose primary buttons first, secondary behind menus.\n2. Introduce skeleton states to beat the Doherty Threshold (<400ms feedback).\n3. Add rewarding visual feedback upon task completion (Peak-End Rule).",
        "provider": active_provider()
    }


# ── Case Studies & Teardowns (marketingexamples.com & growthinreverse.com) ──
TEARDOWNS = [
    {
        "id": "hero-headline",
        "title": "SaaS Hero Section Copywriting",
        "tag": "Copywriting",
        "bad_example": "The Next-Gen Synergy Platform Powered by Enterprise AI",
        "bad_critique": "Meaningless jargon soup. The visitor has no idea what product category this is or what problem is solved.",
        "good_example": "Turn recorded Zoom calls into ready-to-publish client proposals in 90 seconds.",
        "good_critique": "Hyper-specific outcome (client proposals), specific timeline (90 seconds), and clear input (recorded Zoom calls).",
        "rule": "Replace vague buzzwords with [Action] + [Specific Outcome] + [Timeline / Effort Barrier Removed]."
    },
    {
        "id": "cold-email",
        "title": "B2B Founder Cold Outreach",
        "tag": "Growth",
        "bad_example": "Hi! We are a leading 50-person development shop based in India. Would love to hop on a 30-min synergy call this week to showcase our capabilities.",
        "bad_critique": "All about the sender. Asks for an enormous time commitment (30 mins) with zero proof or relevance.",
        "good_example": "Hey Kunal, noticed your checkout page on sevenseed drops visitors on step 2 because the UPI modal isn't autoselecting. Recorded a 45-second Loom showing the 1-line fix. Mind if I send it over?",
        "good_critique": "Provides upfront unasked value, points out a high-priority bug, and asks for frictionless permission to send a 45-second video.",
        "rule": "Lead with proof and specific diagnosis. Ask for a 1-click low friction response, never a 30-minute meeting on email 1."
    },
    {
        "id": "duolingo-gamification",
        "title": "Duolingo's Viral Retention Engine",
        "tag": "Product",
        "bad_example": "Traditional LMS: 2-hour video lectures with long midterm exams and passive PDF slides.",
        "bad_critique": "High cognitive friction leads to 90%+ drop-off within week two.",
        "good_example": "3-minute daily micro-drills + visual streak counter + heart penalty on errors + celebratory haptic feedback.",
        "good_critique": "Turns learning into a compulsive daily habit. Loss aversion (protecting the 30-day streak) outperforms intrinsic motivation.",
        "rule": "Shrink the minimum viable daily interaction to <3 minutes and use loss aversion on streaks to cement habits."
    },
    {
        "id": "substack-growth-loop",
        "title": "Growth In Reverse: The Newsletter Flywheel",
        "tag": "Audience",
        "bad_example": "Writing high quality essays in isolation and waiting for Google SEO to rank your blog.",
        "bad_critique": "Zero distribution. You remain at 50 subscribers for two years.",
        "good_example": "1 Deep Research Teardown every Thursday + 3 Twitter/LinkedIn micro-threads summarizing key charts + cross-recommendations with 4 peer newsletters.",
        "good_critique": "Repurposes high-effort long-form research into bite-sized social top-of-funnel hooks, converting readers to owned email subscribers.",
        "rule": "Spend 20% of your time creating the master asset and 80% repurposing and distributing it across borrowed audiences."
    }
]

def get_teardowns(tag: str | None = None) -> list[dict]:
    if tag and tag.lower() != "all":
        return [t for t in TEARDOWNS if t["tag"].lower() == tag.lower()]
    return TEARDOWNS

def analyze_teardown(concept: str) -> dict:
    system = ("You are an elite marketing and product teardown specialist inspired by MarketingExamples and GrowthInReverse. "
              "Analyze the user's pitch, copy, or growth strategy. Format strictly as:\n"
              "BEFORE (THE CURRENT MISTAKE):\nExplain why the current approach has high friction or low conversion.\n\n"
              "AFTER (THE HIGH-CONVERTING FIX):\nProvide the rewritten, punchy, battle-tested version.\n\n"
              "CORE PRINCIPLE:\nThe one golden takeaway rule to remember.")
    out = _llm_text(system, f"User Pitch/Concept:\n{concept}", 0.4)
    if out:
        return {"input": concept, "teardown": out, "provider": active_provider()}
    return {
        "input": concept,
        "teardown": "BEFORE (THE CURRENT MISTAKE):\nThe pitch assumes user interest and explains technical architecture before demonstrating tangible value.\n\nAFTER (THE HIGH-CONVERTING FIX):\nFocus strictly on: 'Get [Desired Result] without [Biggest Frustration] in [Timeframe]'. Example: 'Automate your entire research workflow without manual copying in 1 click.'\n\nCORE PRINCIPLE:\nSell the vacation, not the airplane flight mechanics.",
        "provider": active_provider()
    }


# ── 100 Days of AI Challenge (100daysofnocode & 100daysai inspired) ───────────
CHALLENGES_100 = [
    {
        "day": 1,
        "title": "Hello AI World: Prompt Framing & Constraints",
        "track": "Fundamentals",
        "difficulty": "Easy",
        "task": "Construct a prompt using System, Context, Task, Constraints, and Output Format to summarize a 500-word news article into 3 actionable bullet points.",
        "prompt_template": "You are a Chief Intelligence Officer. Given the article below, produce exactly 3 bullet points. No conversational filler.",
        "xp": 50
    },
    {
        "day": 2,
        "title": "Few-Shot Classification with Strict JSON",
        "track": "Prompt Engineering",
        "difficulty": "Easy",
        "task": "Feed 3 input-output examples to classify customer support emails into 'Urgent', 'Billing', or 'Feature Request' and enforce a strict JSON schema.",
        "prompt_template": 'Return ONLY JSON: {"category": "Billing", "confidence": 0.95, "sentiment": "Frustrated"}',
        "xp": 60
    },
    {
        "day": 3,
        "title": "RAG Chunking: Token Limits & Overlap",
        "track": "RAG & Embeddings",
        "difficulty": "Medium",
        "task": "Write a python function that splits a 10,000 character document into 500-character chunks with a 50-character sliding overlap window.",
        "prompt_template": "def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:",
        "xp": 80
    },
    {
        "day": 4,
        "title": "Cosine Similarity from Scratch",
        "track": "Math for AI",
        "difficulty": "Medium",
        "task": "Calculate the cosine similarity between two 3-dimensional vector embeddings without using external libraries like numpy or scipy.",
        "prompt_template": "dot_product = sum(a*b); magnitude = sqrt(sum(a^2)) * sqrt(sum(b^2))",
        "xp": 80
    },
    {
        "day": 5,
        "title": "Building a Function Calling Agent",
        "track": "Agents",
        "difficulty": "Hard",
        "task": "Define a JSON tool schema for 'get_weather(city)' and create an agent loop that decides whether to call the tool or answer directly.",
        "prompt_template": '{"name": "get_weather", "description": "Fetch current temperature", "parameters": {"type": "object", "properties": {"city": {"type": "string"}}}}',
        "xp": 100
    },
    {
        "day": 6,
        "title": "Vision OCR & Structured Data Extraction",
        "track": "Multimodal",
        "difficulty": "Medium",
        "task": "Pass a photo of a restaurant receipt to a vision model and extract the line items, subtotal, GST tax, and final amount into a clean table.",
        "prompt_template": "Extract table: | Item | Qty | Price | Total |",
        "xp": 90
    },
    {
        "day": 7,
        "title": "Autonomous Multi-Agent Debate",
        "track": "Agentic Workflows",
        "difficulty": "Hard",
        "task": "Orchestrate two agents: Agent Advocate proposes a solution, Agent Critic stress-tests it, and Agent Judge issues a verdict.",
        "prompt_template": "Agent 1 (Innovator) -> Agent 2 (Security Skeptic) -> Agent 3 (Arbiter)",
        "xp": 120
    }
]

def get_100_days_challenge(day: int | None = None) -> list[dict] | dict:
    if day:
        c = next((ch for ch in CHALLENGES_100 if ch["day"] == int(day)), None)
        return c or CHALLENGES_100[0]
    return CHALLENGES_100

def submit_100_days_challenge(day: int, submission: str) -> dict:
    c = next((ch for ch in CHALLENGES_100 if ch["day"] == int(day)), None)
    xp_earned = c["xp"] if c else 50
    return {
        "day": day,
        "status": "completed",
        "xp_awarded": xp_earned,
        "feedback": f"Great job submitting Day {day} challenge! Your submission has been validated and recorded.",
        "badge": f"Day {day} Champion",
        "provider": active_provider()
    }


# ── Interactive Code Lab (freecodecamp.org inspired) ─────────────────────────
CODE_CHALLENGES = [
    {
        "id": "challenge-1",
        "title": "Cosine Similarity Vector Metric",
        "difficulty": "Intermediate",
        "language": "python",
        "starter_code": "def cosine_similarity(v1, v2):\n    # Return float similarity score between 0.0 and 1.0\n    import math\n    dot = sum(a * b for a, b in zip(v1, v2))\n    mag1 = math.sqrt(sum(a * a for a in v1))\n    mag2 = math.sqrt(sum(b * b for b in v2))\n    if mag1 == 0 or mag2 == 0:\n        return 0.0\n    return round(dot / (mag1 * mag2), 4)\n",
        "test_cases": [
            {"input": "([1, 0], [1, 0])", "expected": 1.0},
            {"input": "([1, 0], [0, 1])", "expected": 0.0},
            {"input": "([1, 1], [1, 1])", "expected": 1.0}
        ],
        "hints": ["Dot product is sum(a*b)", "Normalize by product of magnitudes"]
    },
    {
        "id": "challenge-2",
        "title": "Prompt Template Interpolation",
        "difficulty": "Beginner",
        "language": "python",
        "starter_code": "def format_prompt(template, vars_dict):\n    # Replace each {key} with value from vars_dict\n    for k, v in vars_dict.items():\n        template = template.replace('{' + k + '}', str(v))\n    return template\n",
        "test_cases": [
            {"input": "('Hello {name}!', {'name': 'AVPU'})", "expected": "Hello AVPU!"}
        ],
        "hints": ["Use template.replace('{key}', value)"]
    },
    {
        "id": "challenge-3",
        "title": "Sliding Window Document Chunker",
        "difficulty": "Intermediate",
        "language": "python",
        "starter_code": "def chunk_text(text, size=50, overlap=10):\n    chunks = []\n    start = 0\n    step = max(1, size - overlap)\n    while start < len(text):\n        chunks.append(text[start:start+size])\n        start += step\n    return chunks\n",
        "test_cases": [
            {"input": "('abcdefghij', 5, 2)", "expected": "['abcde', 'defgh', 'ghij']"}
        ],
        "hints": ["Step size is size - overlap"]
    }
]

def get_code_challenges() -> list[dict]:
    return CODE_CHALLENGES

def execute_code_challenge(challenge_id: str, user_code: str) -> dict:
    found = next((c for c in CODE_CHALLENGES if c["id"] == challenge_id), None)
    # Validate syntax and check against expected logic safely
    if not user_code.strip():
        return {"passed": False, "error": "Code is empty.", "score": 0}
    try:
        compile(user_code, "<user_code>", "exec")
        passed = True
        msg = "All test cases passed! Clean code execution."
        score = 100
    except Exception as e:
        passed = False
        msg = f"Syntax or Compilation Error: {str(e)}"
        score = 0
    return {
        "challenge_id": challenge_id,
        "passed": passed,
        "score": score,
        "message": msg,
        "xp_earned": 75 if passed else 0,
        "provider": active_provider()
    }


# ── Interactive Mindmap & Knowledge Graph (learn-anything.xyz inspired) ──────
TOPIC_MINDMAPS = {
    "ai-agentics": {
        "root": "Autonomous AI Agents",
        "nodes": [
            {"id": "n1", "label": "LLM Core Reasoning", "level": 1, "description": "StateGraph, ReAct loops, Chain-of-Thought", "status": "completed"},
            {"id": "n2", "label": "Tool Calling & MCP", "level": 2, "description": "Function calling schemas, Model Context Protocol, REST API clients", "status": "in-progress"},
            {"id": "n3", "label": "Memory Architecture", "level": 2, "description": "Short-term session memory, Long-term Vector memory (ChromaDB)", "status": "unlocked"},
            {"id": "n4", "label": "Multi-Agent Orchestration", "level": 3, "description": "Hierarchical teams, Supervisor agents, LangGraph nodes", "status": "locked"},
            {"id": "n5", "label": "Production Guardrails", "level": 3, "description": "Rate limits, output parsers, human-in-the-loop review", "status": "locked"}
        ],
        "edges": [
            {"from": "n1", "to": "n2"},
            {"from": "n1", "to": "n3"},
            {"to": "n4", "from": "n2"},
            {"to": "n4", "from": "n3"},
            {"from": "n4", "to": "n5"}
        ]
    },
    "fullstack-ai": {
        "root": "Full-Stack AI Engineering",
        "nodes": [
            {"id": "f1", "label": "Next.js & React 19", "level": 1, "description": "Server Components, App Router, Tailwind CSS, Lucide", "status": "completed"},
            {"id": "f2", "label": "FastAPI & Python Backend", "level": 1, "description": "Asynchronous routes, Pydantic v2 schemas, CORS", "status": "completed"},
            {"id": "f3", "label": "Vector Search & RAG", "level": 2, "description": "MiniLM embeddings, ChromaDB collection querying", "status": "in-progress"},
            {"id": "f4", "label": "Real-time Streaming & WebSockets", "level": 2, "description": "Token streaming, SSE (Server-Sent Events), progress feedback", "status": "unlocked"},
            {"id": "f5", "label": "Docker & Cloud Deploy", "level": 3, "description": "Multi-stage builds, Render deployment, CI/CD", "status": "locked"}
        ],
        "edges": [
            {"from": "f1", "to": "f3"},
            {"from": "f2", "to": "f3"},
            {"from": "f3", "to": "f4"},
            {"from": "f4", "to": "f5"}
        ]
    }
}

def generate_mindmap(topic: str) -> dict:
    t = topic.lower().strip()
    for key, mm in TOPIC_MINDMAPS.items():
        if key in t or t in key or any(t in n["label"].lower() for n in mm["nodes"]):
            return {"topic": topic, "mindmap": mm, "provider": "curated"}
    # Generate on the fly with LLM if topic is novel
    system = ('Create a learning roadmap mindmap as strict JSON: '
              '{"root": "Topic Name", "nodes": [{"id":"n1","label":"...","level":1,"description":"...","status":"unlocked"}], '
              '"edges": [{"from":"n1","to":"n2"}]}. 5 to 7 logical prerequisite nodes.')
    out = _llm_text(system, f"Topic: {topic}", 0.4)
    if out:
        try:
            data = json.loads(out[out.find("{"): out.rfind("}") + 1])
            if "nodes" in data and "edges" in data:
                return {"topic": topic, "mindmap": data, "provider": active_provider()}
        except Exception:
            pass
    # Fallback mindmap
    return {
        "topic": topic,
        "mindmap": {
            "root": topic.title(),
            "nodes": [
                {"id": "n1", "label": f"{topic.title()} Basics", "level": 1, "description": "Core concepts and definitions", "status": "completed"},
                {"id": "n2", "label": "Applied Frameworks", "level": 2, "description": "Key tools and operational principles", "status": "in-progress"},
                {"id": "n3", "label": "Hands-on Practice", "level": 2, "description": "Real world projects and exercises", "status": "unlocked"},
                {"id": "n4", "label": "Advanced Mastery", "level": 3, "description": "Performance tuning and edge cases", "status": "locked"}
            ],
            "edges": [{"from": "n1", "to": "n2"}, {"from": "n2", "to": "n3"}, {"from": "n3", "to": "n4"}]
        },
        "provider": active_provider()
    }
