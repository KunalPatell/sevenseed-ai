# -*- coding: utf-8 -*-
"""
Decode Forest Pharmacy — AI agents.

Features (all fall back to curated offline logic when no API key is present):
  1. AI Health Assistant — LangGraph 3-node (intent → rag_retrieval → response)
  2. Prescription Reader  — parse & explain prescription text
  3. Drug Interaction Checker — check any two+ drugs for interactions
  4. Smart Substitutes        — find generic/cheaper substitutes for a medicine
  5. Refill Prediction        — predict next refill date from dose/qty
  6. AI Symptom Guide         — symptom → OTC recommendation
"""

from __future__ import annotations
import os
import re
from typing import TypedDict, Annotated, List, Any
import operator

import rag


# ── LLM factory ──────────────────────────────────────────────────────────────
from app.api_keys import groq_key_var, gemini_key_var, openai_key_var


def _groq_key(): return groq_key_var.get().strip() or os.environ.get("GROQ_API_KEY", "").strip()
def _gemini_key(): return gemini_key_var.get().strip() or os.environ.get("GEMINI_API_KEY", "").strip()
def _openai_key(): return openai_key_var.get().strip() or os.environ.get("OPENAI_API_KEY", "").strip()


def _get_llm(temperature: float = 0.3):
    if _groq_key():
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(api_key=_groq_key(),
                            model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                            temperature=temperature)
        except Exception:
            pass
    if _gemini_key():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(google_api_key=_gemini_key(),
                                          model="gemini-1.5-flash", temperature=temperature)
        except Exception:
            pass
    if _openai_key():
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(api_key=_openai_key(),
                              model="gpt-4o-mini", temperature=temperature)
        except Exception:
            pass
    return None


def active_provider() -> str:
    if _groq_key():
        return f"Groq ({os.environ.get('GROQ_MODEL', 'llama-3.3-70b-versatile')})"
    if _gemini_key():
        return "Google Gemini 1.5 Flash"
    if _openai_key():
        return "OpenAI GPT-4o-mini"
    return "offline"


def _llm_text(system: str, user: str, temperature: float = 0.3) -> str | None:
    llm = _get_llm(temperature)
    if not llm:
        return None
    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        resp = llm.invoke([SystemMessage(content=system), HumanMessage(content=user)])
        return resp.content
    except Exception as e:
        print(f"[LLM] error: {e}")
        return None


# ── LangGraph health assistant: intent → retrieval → response ──────────────
class AssistantState(TypedDict):
    messages: Annotated[List[Any], operator.add]
    intent: str
    rag_results: List[dict]
    final_response: str
    traces: List[str]
    language: str


_SYSTEM_ASSISTANT = """You are the Decode Forest Pharmacy AI Health Assistant.
You give accurate, responsible, and easy-to-understand pharmacy and health information.

IMPORTANT RULES:
- Always recommend consulting a doctor or pharmacist for personal medical decisions.
- Never recommend stopping prescribed medications without medical advice.
- For emergencies: always say "Call 108 (India) immediately."
- Ground answers in the provided context. Do not fabricate medicine names or dosages.
- Format clearly using ** bold ** for medicine names and key terms.
- Keep responses under 250 words. If more detail is needed, offer to elaborate.
"""


def _node_intent(state: AssistantState) -> dict:
    last = state["messages"][-1].content if state["messages"] else ""
    lo = last.lower()
    if any(w in lo for w in ["interact", "together", "combine", "mix", "both"]):
        intent = "interactions"
    elif any(w in lo for w in ["symptom", "fever", "pain", "cold", "cough", "headache", "allergy"]):
        intent = "symptoms"
    elif any(w in lo for w in ["substitute", "generic", "cheaper", "alternative", "replace"]):
        intent = "substitutes"
    elif any(w in lo for w in ["dose", "dosage", "how much", "how many", "frequency"]):
        intent = "dosage"
    else:
        intent = "general"
    return {"intent": intent, "traces": [f"intent:{intent}"]}


def _node_retrieval(state: AssistantState) -> dict:
    query = state["messages"][-1].content if state["messages"] else ""
    intent = state.get("intent", "general")
    results = []
    if intent == "interactions":
        results = rag.search_interactions(query, 3)
    elif intent == "symptoms":
        results += rag.search_symptoms(query, 2)
        results += rag.search_health(query, 2)
    else:
        results += rag.search_medicines(query, 2)
        results += rag.search_health(query, 3)
    return {"rag_results": results, "traces": state.get("traces", []) + [f"retrieved:{len(results)}"]}


def _node_response(state: AssistantState) -> dict:
    query = state["messages"][-1].content if state["messages"] else ""
    ctx = "\n\n".join(
        f"[{r.get('title', r.get('name', r.get('drug_a', '')))}]\n{r.get('body', r.get('use', r.get('effect', '')))}"
        for r in state.get("rag_results", [])[:4]
    )
    language = (state.get("language") or "English").strip()
    system = _SYSTEM_ASSISTANT
    if language.lower() not in ("english", "en", ""):
        system += f"\n- Respond entirely in {language}. Keep medicine/drug names in their original script alongside the {language} explanation."
    llm_answer = _llm_text(
        system,
        f"Context:\n{ctx}\n\nUser question: {query}"
    )
    if llm_answer:
        return {"final_response": llm_answer, "traces": state.get("traces", []) + ["llm:ok"]}

    # ── Offline fallback ──────────────────────────────────────────────────
    if state.get("rag_results"):
        r = state["rag_results"][0]
        title = r.get("title") or r.get("name") or r.get("drug_a") or r.get("symptom", "")
        body = r.get("body") or r.get("use") or r.get("effect", "")
        if not body and r.get("otc"):
            body = f"Suggested OTC relief: {r['otc']}\n\n⚠️ {r.get('warning', '')}"
        reply = f"**{title}**\n\n{body}"
        if len(state["rag_results"]) > 1:
            extra = [r2.get("title") or r2.get("name") or r2.get("symptom") or "" for r2 in state["rag_results"][1:3]]
            reply += f"\n\nRelated topics: {', '.join(e for e in extra if e)}"
        reply += "\n\n⚕️ *Always consult a pharmacist or doctor before changing your medicines.*"
        return {"final_response": reply, "traces": state.get("traces", []) + ["offline:rag"]}

    return {"final_response": (
        "I'm here to help with medicine information, drug interactions, and health guidance. "
        "Please ask a specific question such as:\n"
        "• 'What is Paracetamol used for?'\n"
        "• 'Can I take Ibuprofen and Aspirin together?'\n"
        "• 'What are the side effects of Metformin?'\n\n"
        "⚕️ *For urgent health issues, please consult your doctor or call 108.*"
    ), "traces": state.get("traces", []) + ["offline:default"]}


def _build_assistant_graph():
    try:
        from langgraph.graph import StateGraph, END
        g = StateGraph(AssistantState)
        g.add_node("intent", _node_intent)
        g.add_node("retrieval", _node_retrieval)
        g.add_node("response", _node_response)
        g.set_entry_point("intent")
        g.add_edge("intent", "retrieval")
        g.add_edge("retrieval", "response")
        g.add_edge("response", END)
        return g.compile()
    except Exception:
        return None


_assistant_graph = None


def _get_graph():
    global _assistant_graph
    if _assistant_graph is None:
        _assistant_graph = _build_assistant_graph()
    return _assistant_graph


def run_assistant(message: str, session_id: str = "", language: str = "English") -> dict:
    try:
        from langchain_core.messages import HumanMessage
        graph = _get_graph()
        if graph:
            state = graph.invoke({
                "messages": [HumanMessage(content=message)],
                "intent": "", "rag_results": [], "final_response": "", "traces": [], "language": language
            })
            return {"reply": state["final_response"], "intent": state.get("intent", ""),
                    "traces": state.get("traces", []), "source": "langgraph"}
    except Exception as e:
        print(f"[Graph] error: {e}")
    # plain fallback
    results = rag.search_health(message, 3) + rag.search_medicines(message, 2)
    state = _node_response({"messages": [type("M", (), {"content": message})()],
                            "intent": "general", "rag_results": results, "traces": [], "final_response": "",
                            "language": language})
    return {"reply": state["final_response"], "source": "fallback"}


# ── Prescription Reader ───────────────────────────────────────────────────────
_SYSTEM_RX = """You are an expert clinical pharmacist.
Given a typed/pasted prescription or drug list, you will:
1. Identify each medicine, its dose, and frequency.
2. Explain what each medicine is for in simple language.
3. Highlight any potential interactions between the listed medicines.
4. Add a brief note on general safety (storage, timing, food interactions).

Format your response as a structured list. Keep it clear and concise (under 400 words).
Always end with: "⚕️ Follow your doctor's instructions and complete the full course."
"""

def read_prescription(text: str) -> dict:
    llm_answer = _llm_text(_SYSTEM_RX, f"Prescription/Drug list:\n{text}")
    if llm_answer:
        return {"result": llm_answer, "source": "llm"}
    # Offline: search each word that looks like a drug name (incl. short brand names)
    words = [w for w in (t.strip(".,;:()") for t in text.split()) if len(w) >= 3 and not w.isdigit()]
    hits = []
    seen = set()
    for w in words[:10]:
        results = rag.search_medicines(w, 1)
        if results and results[0]["score"] > 20:
            med = results[0]
            key = med["name"]
            if key not in seen:
                seen.add(key)
                hits.append(f"**{med['name']}** ({med['category']})\n→ {med['use']}\n→ Dose: {med['dose']}")
    if hits:
        result = "**Medicines identified:**\n\n" + "\n\n".join(hits)
        result += "\n\n⚕️ Follow your doctor's instructions and complete the full course."
        return {"result": result, "source": "offline"}
    return {"result": (
        "I couldn't identify specific medicines. Please paste the full text of your prescription "
        "including medicine names, doses and frequencies. Example:\n"
        "Metformin 500mg BD, Atorvastatin 10mg HS, Omeprazole 20mg OD\n\n"
        "⚕️ For prescription queries, always consult your pharmacist."
    ), "source": "offline"}


# ── Drug Interaction Checker ───────────────────────────────────────────────────
_SYSTEM_INTERACT = """You are a clinical pharmacist checking for drug-drug interactions.
Given a list of medicines, check for all relevant interactions.
For each interaction found:
- State the two drugs involved
- Rate severity: LOW / MODERATE / HIGH / CRITICAL
- Explain the effect simply
- Give clinical advice

If no significant interactions exist, say so clearly.
Always end with: "⚕️ Always tell your doctor ALL medicines you take, including OTC and supplements."
"""

def check_interactions(drugs: list[str]) -> dict:
    if not drugs:
        return {"result": "Please provide at least two medicine names.", "interactions": []}
    query = " ".join(drugs)
    db_hits = rag.search_interactions(query, 5)
    relevant = [h for h in db_hits if h["score"] > 15]
    llm_answer = _llm_text(_SYSTEM_INTERACT, f"Check interactions between: {', '.join(drugs)}")
    if llm_answer:
        return {"result": llm_answer, "interactions": relevant, "source": "llm"}
    # Offline
    if relevant:
        parts = []
        for h in relevant:
            sev_icon = {"HIGH": "🔴", "CRITICAL": "🚨", "MODERATE": "🟡", "LOW": "🟢"}.get(h.get("severity", ""), "⚠️")
            parts.append(
                f"{sev_icon} **{h['drug_a']} + {h['drug_b']}** [{h['severity']}]\n"
                f"Effect: {h['effect']}\n"
                f"Advice: {h['advice']}"
            )
        result = "**Potential interactions found:**\n\n" + "\n\n".join(parts)
        result += "\n\n⚕️ Always tell your doctor ALL medicines you take, including OTC and supplements."
        return {"result": result, "interactions": relevant, "source": "offline"}
    return {
        "result": (
            f"No significant interactions found in our database for: {', '.join(drugs)}.\n\n"
            "Note: This does not guarantee safety. Our database covers common interactions only. "
            "Always consult your pharmacist for a complete interaction check.\n\n"
            "⚕️ Always tell your doctor ALL medicines you take."
        ),
        "interactions": [], "source": "offline"
    }


# ── Smart Substitutes ─────────────────────────────────────────────────────────
_SYSTEM_SUB = """You are a pharmacy expert helping patients find safe, affordable medicine substitutes.
Given a medicine name:
1. Identify the active ingredient (generic name).
2. List 2-3 Indian brand substitutes at different price points.
3. Confirm they are bioequivalent (same dose, same route).
4. Note any important differences (formulation, excipients).
5. Advise to show substitute to doctor before switching if prescription medicine.

Keep response under 250 words. Format as a clear list.
"""

def find_substitutes(medicine: str) -> dict:
    results = rag.search_medicines(medicine, 3)
    llm_answer = _llm_text(_SYSTEM_SUB, f"Find substitutes for: {medicine}")
    if llm_answer:
        return {"result": llm_answer, "source": "llm"}
    if results and results[0]["score"] > 20:
        med = results[0]
        result = (
            f"**{med['name']}** — Generic: **{med['generic']}**\n\n"
            f"Category: {med['category']}\n"
            f"Brand alternatives: {med['brand']}\n"
            f"Approximate price: ₹{med['price_inr']}\n\n"
            f"💡 Generic medicines with the same active ingredient (**{med['generic']}**) "
            f"are bioequivalent and regulated by CDSCO. Ask your pharmacist for generic options.\n\n"
            f"⚕️ Always confirm substitutes with your doctor for prescription medicines."
        )
        return {"result": result, "similar": results[1:], "source": "offline"}
    return {
        "result": (
            f"I couldn't find '{medicine}' in our database. "
            "Please try the generic name (e.g., 'Paracetamol' instead of 'Crocin'). "
            "Your pharmacist can always suggest safe, cost-effective alternatives.\n\n"
            "⚕️ Never switch prescription medicines without consulting your doctor."
        ),
        "source": "offline"
    }


# ── Refill Prediction ─────────────────────────────────────────────────────────
def predict_refill(medicine: str, quantity: int, dose_per_day: float, start_date: str) -> dict:
    try:
        from datetime import datetime, timedelta
        start = datetime.strptime(start_date, "%Y-%m-%d")
        days_supply = int(quantity / dose_per_day) if dose_per_day > 0 else 30
        refill_date = start + timedelta(days=days_supply)
        reminder_date = refill_date - timedelta(days=3)
        return {
            "medicine": medicine,
            "days_supply": days_supply,
            "refill_date": refill_date.strftime("%d %B %Y"),
            "reminder_date": reminder_date.strftime("%d %B %Y"),
            "message": (
                f"**{medicine}** supply of **{quantity} units** at **{dose_per_day}/day** "
                f"will last **{days_supply} days**.\n\n"
                f"📅 Next refill: **{refill_date.strftime('%d %B %Y')}**\n"
                f"🔔 Reminder: **{reminder_date.strftime('%d %B %Y')}** (3 days before)"
            )
        }
    except Exception as e:
        return {"message": f"Could not calculate: {e}. Please check the date format (YYYY-MM-DD)."}


# ── Symptom Guide ──────────────────────────────────────────────────────────────
_SYSTEM_SYMPTOM = """You are a responsible AI pharmacist providing OTC (over-the-counter) guidance.
Given a symptom:
1. Suggest safe OTC medicines available in India.
2. Mention important warnings (when to see a doctor immediately).
3. Add non-medicine advice (rest, hydration, etc.) where relevant.
4. NEVER prescribe. NEVER recommend prescription-only medicines without noting they need a prescription.
Always end with: "⚕️ If symptoms persist > 3 days or worsen, consult a doctor."
"""

def symptom_guide(symptom: str) -> dict:
    hits = rag.search_symptoms(symptom, 2) + rag.search_medicines(symptom, 2)
    llm_answer = _llm_text(_SYSTEM_SYMPTOM, f"OTC guidance for: {symptom}")
    if llm_answer:
        return {"result": llm_answer, "source": "llm"}
    if hits:
        s = hits[0]
        if "otc" in s:
            result = (
                f"**{s['symptom']}**\n\n"
                f"💊 OTC options: {s['otc']}\n\n"
                f"⚠️ Warning: {s['warning']}\n\n"
                "⚕️ If symptoms persist > 3 days or worsen, consult a doctor."
            )
        else:
            result = (
                f"**{s.get('name', symptom)}**\n\n"
                f"Used for: {s.get('use', '')}\n"
                f"Dose: {s.get('dose', '')}\n\n"
                "⚕️ If symptoms persist > 3 days or worsen, consult a doctor."
            )
        return {"result": result, "source": "offline"}
    return {
        "result": (
            f"For '{symptom}', please provide more detail (e.g., 'mild fever', 'runny nose', 'stomach pain'). "
            "Common OTC options I can guide you on: fever, headache, cold, heartburn, allergy, diarrhoea.\n\n"
            "⚕️ If symptoms persist > 3 days or worsen, consult a doctor."
        ),
        "source": "offline"
    }
