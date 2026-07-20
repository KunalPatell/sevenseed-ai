# -*- coding: utf-8 -*-
"""
Comonk AI — LangGraph Multi-Agent Career Guidance System
StateGraph with 5 specialized nodes:
  intent_classifier → (conditional routing) →
    rag_retriever     → career_advisor  → END
    salary_advisor                      → END
    career_advisor                      → END

Session memory is handled by LangGraph MemorySaver (thread_id = session_id).
"""

from __future__ import annotations
import os
from typing import TypedDict, Annotated, List, Optional
import operator
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage


# ── State definition ──────────────────────────────────────────────────────────

class CareerState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]   # accumulates across turns
    profile: dict
    intent: str           # companies | salary | general | resume | learning
    rag_results: List[dict]
    final_response: str
    traces: List[str]


# ── LLM factory — tries Groq → Gemini → OpenAI ───────────────────────────────

def _get_llm(temperature: float = 0.5):
    if os.environ.get("GROQ_API_KEY", "").strip():
        from langchain_groq import ChatGroq
        return ChatGroq(
            api_key=os.environ["GROQ_API_KEY"],
            model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
            temperature=temperature,
        )
    if os.environ.get("GEMINI_API_KEY", "").strip():
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(
                google_api_key=os.environ["GEMINI_API_KEY"],
                model="gemini-1.5-flash",
                temperature=temperature,
            )
        except ImportError:
            pass
    if os.environ.get("OPENAI_API_KEY", "").strip():
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            api_key=os.environ["OPENAI_API_KEY"],
            model="gpt-4o-mini",
            temperature=temperature,
        )
    return None


def _active_provider() -> str:
    if os.environ.get("GROQ_API_KEY", "").strip():
        return f"Groq ({os.environ.get('GROQ_MODEL','llama-3.3-70b-versatile')})"
    if os.environ.get("GEMINI_API_KEY", "").strip():
        return "Google Gemini 1.5 Flash"
    if os.environ.get("OPENAI_API_KEY", "").strip():
        return "OpenAI GPT-4o-mini"
    return "offline"


def _build_system_prompt(profile: dict) -> str:
    profile_ctx = ""
    if profile:
        profile_ctx = (
            f"\n\nActive User Profile:"
            f"\n- Name: {profile.get('name', 'Job Seeker')}"
            f"\n- Skills: {', '.join((profile.get('skills') or [])[:12])}"
            f"\n- Experience: {profile.get('experience_years', 0)} yrs ({profile.get('seniority_level', 'fresher')})"
            f"\n- Target Roles: {', '.join((profile.get('target_roles') or ['Software Developer'])[:3])}"
            f"\n- Education: {profile.get('education', 'Not specified')}"
        )
    return (
        "You are Comonk AI, a FREE career guidance counselor specializing in Gujarat's IT and AI/ML job market. "
        "You help job seekers in Ahmedabad and Gandhinagar with: company matching, resume improvement, "
        "interview preparation, career roadmaps, salary negotiation, and skill development. "
        "You have a live database of 541 IT/AI companies in Gujarat with direct HR contacts. "
        "Be warm, encouraging, specific, and actionable. Keep responses concise (under 200 words). "
        "Always recommend next concrete steps. "
        "Ahmedabad IT salary benchmarks: Fresher ₹3-6 LPA, Junior ₹5-10 LPA, Mid ₹10-20 LPA, Senior ₹20-40 LPA."
        + profile_ctx
    )


# ── Node 1: Intent Classifier ─────────────────────────────────────────────────

def intent_classifier_node(state: CareerState) -> dict:
    last = state["messages"][-1].content.lower() if state["messages"] else ""

    if any(w in last for w in ["compan", "where to apply", "which firm", "job target", "who hire", "match", "organization"]):
        intent = "companies"
    elif any(w in last for w in ["salary", "pay", "ctc", "lpa", "package", "hike", "negotiate", "offer"]):
        intent = "salary"
    elif any(w in last for w in ["resume", "cv", "ats", "bullet point", "format my", "update resume", "improve cv"]):
        intent = "resume"
    elif any(w in last for w in ["course", "learn", "tutorial", "resource", "youtube", "study", "certif"]):
        intent = "learning"
    else:
        intent = "general"

    return {
        "intent": intent,
        "traces": [f"🧭 IntentClassifier → intent='{intent}'"],
    }


# ── Node 2: RAG Retriever ─────────────────────────────────────────────────────

def rag_retriever_node(state: CareerState) -> dict:
    try:
        from comonk_rag import search_companies
        profile = state.get("profile", {})
        skills = " ".join((profile.get("skills") or [])[:10])
        user_msg = state["messages"][-1].content if state["messages"] else ""
        query = f"{skills} {user_msg}".strip()
        results = search_companies(query, n=8)
        return {
            "rag_results": results,
            "traces": [f"🔍 RAGRetriever → {len(results)} companies found (semantic search)"],
        }
    except Exception as e:
        return {"rag_results": [], "traces": [f"🔍 RAGRetriever error: {e}"]}


# ── Node 3: Career Advisor (main LLM node) ────────────────────────────────────

def career_advisor_node(state: CareerState) -> dict:
    llm = _get_llm(temperature=0.5)
    if not llm:
        reply = (
            "Add your free GROQ_API_KEY to the .env file to enable AI responses. "
            "Get it free at console.groq.com — takes 30 seconds!"
        )
        return {
            "final_response": reply,
            "messages": [AIMessage(content=reply)],
            "traces": ["🤖 CareerAdvisor: no LLM configured"],
        }

    profile = state.get("profile", {})
    system_content = _build_system_prompt(profile)
    lc_messages = [SystemMessage(content=system_content)]

    # Add RAG-retrieved companies as context
    rag = state.get("rag_results", [])
    if rag:
        company_lines = "\n".join(
            f"• {c['name']} ({c['category']}) | Roles: {c['roles'][:70]} | {c.get('address','')[:50]}"
            f"{' | Email: ' + c['emails'][0] if c.get('emails') else ''}"
            for c in rag[:6]
        )
        lc_messages.append(SystemMessage(
            content=f"Relevant companies from the Comonk database (use these in your answer):\n{company_lines}"
        ))

    # Add conversation history (last 8 messages to stay within context)
    lc_messages.extend(state["messages"][-8:])

    try:
        resp = llm.invoke(lc_messages)
        reply = resp.content
        return {
            "final_response": reply,
            "messages": [AIMessage(content=reply)],
            "traces": [f"🤖 CareerAdvisor: generated {len(reply)} chars via {_active_provider()}"],
        }
    except Exception as e:
        fallback = "I'm ready to help with your career! Ask me about companies to apply to, resume tips, or interview questions."
        return {
            "final_response": fallback,
            "messages": [AIMessage(content=fallback)],
            "traces": [f"🤖 CareerAdvisor error: {e}"],
        }


# ── Node 4: Salary Advisor ────────────────────────────────────────────────────

def salary_advisor_node(state: CareerState) -> dict:
    llm = _get_llm(temperature=0.3)
    if not llm:
        return {
            "final_response": "Fresher ₹3-6L, Junior ₹5-10L, Mid ₹10-20L, Senior ₹20-40L (Ahmedabad IT market).",
            "traces": ["💰 SalaryAdvisor: no LLM — returned static ranges"],
        }

    profile = state.get("profile", {})
    system_content = (
        "You are a salary negotiation expert for India's tech market (specifically Ahmedabad/Gujarat). "
        "Give specific, realistic salary ranges, negotiation tactics, and market context. "
        "Be practical and honest about expectations."
    )

    lc_messages = [
        SystemMessage(content=system_content),
        SystemMessage(content=_build_system_prompt(profile)),
        *state["messages"][-6:],
    ]

    try:
        resp = llm.invoke(lc_messages)
        reply = resp.content
        return {
            "final_response": reply,
            "messages": [AIMessage(content=reply)],
            "traces": [f"💰 SalaryAdvisor: generated via {_active_provider()}"],
        }
    except Exception as e:
        fallback = "Ahmedabad IT salaries — Fresher: ₹3-6L, Junior (0-2yr): ₹5-10L, Mid (2-5yr): ₹10-20L, Senior (5+yr): ₹20-40L. AI/ML roles typically pay 20-30% premium."
        return {
            "final_response": fallback,
            "messages": [AIMessage(content=fallback)],
            "traces": [f"💰 SalaryAdvisor error: {e}"],
        }


# ── Routing functions ─────────────────────────────────────────────────────────

def route_after_intent(state: CareerState) -> str:
    intent = state.get("intent", "general")
    if intent == "companies":
        return "rag_retriever"
    if intent == "salary":
        return "salary_advisor"
    return "career_advisor"


# ── Build & compile the graph ─────────────────────────────────────────────────

def build_career_graph():
    graph = StateGraph(CareerState)

    graph.add_node("intent_classifier", intent_classifier_node)
    graph.add_node("rag_retriever", rag_retriever_node)
    graph.add_node("career_advisor", career_advisor_node)
    graph.add_node("salary_advisor", salary_advisor_node)

    graph.set_entry_point("intent_classifier")

    graph.add_conditional_edges(
        "intent_classifier",
        route_after_intent,
        {
            "rag_retriever": "rag_retriever",
            "career_advisor": "career_advisor",
            "salary_advisor": "salary_advisor",
        },
    )

    graph.add_edge("rag_retriever", "career_advisor")
    graph.add_edge("career_advisor", END)
    graph.add_edge("salary_advisor", END)

    memory = MemorySaver()   # in-memory session persistence keyed by thread_id
    compiled = graph.compile(checkpointer=memory)
    print("[LangGraph] Career graph compiled — nodes: intent_classifier -> rag_retriever / salary_advisor / career_advisor")
    return compiled


_graph = None

def get_graph():
    global _graph
    if _graph is None:
        _graph = build_career_graph()
    return _graph


def run_career_chat(message: str, session_id: str, profile: dict) -> dict:
    """Main entry point. session_id → LangGraph thread_id (persistent memory across calls)."""
    graph = get_graph()

    initial = {
        "messages": [HumanMessage(content=message)],
        "profile": profile,
        "intent": "general",
        "rag_results": [],
        "final_response": "",
        "traces": [],
    }

    config = {"configurable": {"thread_id": session_id}}

    try:
        result = graph.invoke(initial, config=config)
        return {
            "reply": result.get("final_response", ""),
            "intent": result.get("intent", "general"),
            "companies_found": len(result.get("rag_results", [])),
            "matched_companies": result.get("rag_results", [])[:4],
            "traces": result.get("traces", []),
            "provider": _active_provider(),
        }
    except Exception as e:
        print(f"[LangGraph] invoke error: {e}")
        return {
            "reply": "I'm ready to help with your career! What would you like to know?",
            "intent": "general",
            "companies_found": 0,
            "matched_companies": [],
            "traces": [str(e)],
            "provider": "offline",
        }
