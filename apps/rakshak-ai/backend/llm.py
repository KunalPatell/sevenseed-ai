# -*- coding: utf-8 -*-
"""
Rakshak AI - LLM layer with multi-provider fallback chain
---------------------------------------------------------
Tries each configured provider in order until one succeeds:
    1) Groq    (free + very fast)
    2) Mistral (fallback)
    3) OpenAI  (optional)
If ALL fail (or none configured), ai_engine.py uses its offline rule-based
replies — so the chatbot is ALWAYS smooth and never goes down.

All three speak the OpenAI-compatible chat API; only key + base_url + model differ.
Configure via .env or environment variables (Hugging Face Secrets):
    GROQ_API_KEY / GROQ_MODEL
    MISTRAL_API_KEY / MISTRAL_MODEL
    OPENAI_API_KEY / OPENAI_MODEL
"""

import os


def _env(name, default=""):
    return os.environ.get(name, default).strip()


def _build_providers():
    """Build the provider chain from whichever keys are present.
    Called lazily so Hugging Face Secrets (injected as env vars at runtime)
    are always picked up, even if this module was imported before they were set.
    """
    providers = []
    if _env("GROQ_API_KEY"):
        providers.append({
            "name": "groq",
            "key": _env("GROQ_API_KEY"),
            "base_url": "https://api.groq.com/openai/v1",
            "model": _env("GROQ_MODEL", "llama-3.3-70b-versatile"),
        })
    if _env("MISTRAL_API_KEY"):
        providers.append({
            "name": "mistral",
            "key": _env("MISTRAL_API_KEY"),
            "base_url": "https://api.mistral.ai/v1",
            "model": _env("MISTRAL_MODEL", "mistral-small-latest"),
        })
    if _env("OPENAI_API_KEY"):
        providers.append({
            "name": "openai",
            "key": _env("OPENAI_API_KEY"),
            "base_url": None,  # default OpenAI endpoint
            "model": _env("OPENAI_MODEL", "gpt-4o-mini"),
        })
    return providers


# Cached provider list — built once on first is_enabled() / llm_chat_reply() call
_PROVIDERS = None


def _get_providers():
    global _PROVIDERS
    if _PROVIDERS is None:
        _PROVIDERS = _build_providers()
    return _PROVIDERS


# Friendly summary for the startup banner (read at import so banner is correct).
# These are safe to evaluate eagerly since they only show provider names.
PROVIDER = None
MODEL = None

LANG_NAME = {"en": "English", "hi": "Hindi", "gu": "Gujarati"}

SYSTEM_PROMPT = (
    "You are Rakshak AI, the official AI citizen-assistance assistant for the "
    "Ahmedabad Police (a demo/prototype). You help citizens with complaints, FIR "
    "guidance, cybercrime, emergencies, traffic, women's safety and finding police "
    "stations. Be concise, calm, accurate and supportive. Always give clear next "
    "steps and relevant Indian helpline numbers (Police 100, Emergency 112, Women "
    "181, Cyber 1930, Ambulance 108). Never ask for OTPs/passwords. If the situation "
    "sounds life-threatening, tell the user to call 112/100 immediately. Keep replies "
    "under ~120 words. You are a guidance tool, not a substitute for an official FIR."
)

_clients = {}  # cache one OpenAI client per provider


def is_enabled():
    return len(_get_providers()) > 0


def _client_for(p):
    if p["name"] not in _clients:
        from openai import OpenAI  # lazy import so demo works even without the package
        if p["base_url"]:
            _clients[p["name"]] = OpenAI(api_key=p["key"], base_url=p["base_url"])
        else:
            _clients[p["name"]] = OpenAI(api_key=p["key"])
    return _clients[p["name"]]


def llm_chat_reply(message, lang="en", intent="general", risk_level="NORMAL"):
    """Try each provider in order; return first good reply, else None."""
    import time
    import store
    providers = _get_providers()
    if not providers:
        return None
    lang_name = LANG_NAME.get(lang, "English")
    user_ctx = (
        f"Detected intent: {intent}. Risk level: {risk_level}. "
        f"Reply ONLY in {lang_name}.\n\nCitizen says: {message}"
    )
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_ctx},
    ]
    for p in providers:
        start_time = time.time()
        try:
            client = _client_for(p)
            resp = client.chat.completions.create(
                model=p["model"],
                messages=messages,
                temperature=0.4,
                max_tokens=320,
            )
            reply = resp.choices[0].message.content.strip()
            duration_ms = int((time.time() - start_time) * 1000)
            if reply:
                # Update banner info on first successful call
                global PROVIDER, MODEL
                if PROVIDER is None:
                    PROVIDER = p["name"]
                    MODEL = p["model"]
                
                # Extract tokens safely
                itok = resp.usage.prompt_tokens if (resp.usage and hasattr(resp.usage, 'prompt_tokens')) else 0
                otok = resp.usage.completion_tokens if (resp.usage and hasattr(resp.usage, 'completion_tokens')) else 0
                # Calculate cost
                cost = (itok * 0.00015 + otok * 0.0006) / 1000 if p["name"] == "openai" else (itok * 0.00005 + otok * 0.0001) / 1000
                
                store.add_telemetry("Chatbot Reply", f"{p['name'].capitalize()} ({p['model']})", duration_ms, itok, otok, "SUCCESS", cost)
                return reply
        except Exception as e:
            duration_ms = int((time.time() - start_time) * 1000)
            store.add_telemetry("Chatbot Reply", f"{p['name'].capitalize()} ({p['model']})", duration_ms, 0, 0, "FAILED", 0.0)
            print(f"[llm:{p['name']}] failed, trying next:", e)
            continue
    print("[llm] all providers failed -> using offline rule engine")
    return None


def _llm_completion(prompt, system_prompt="You are a helpful police assistant.", temperature=0.4, max_tokens=320, action="LLM Completion"):
    import time
    import store
    providers = _get_providers()
    if not providers:
        return None
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt},
    ]
    for p in providers:
        start_time = time.time()
        try:
            client = _client_for(p)
            resp = client.chat.completions.create(
                model=p["model"],
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            reply = resp.choices[0].message.content.strip()
            duration_ms = int((time.time() - start_time) * 1000)
            if reply:
                # Update banner info on first successful call
                global PROVIDER, MODEL
                if PROVIDER is None:
                    PROVIDER = p["name"]
                    MODEL = p["model"]
                
                # Extract tokens safely
                itok = resp.usage.prompt_tokens if (resp.usage and hasattr(resp.usage, 'prompt_tokens')) else 0
                otok = resp.usage.completion_tokens if (resp.usage and hasattr(resp.usage, 'completion_tokens')) else 0
                # Calculate cost
                cost = (itok * 0.00015 + otok * 0.0006) / 1000 if p["name"] == "openai" else (itok * 0.00005 + otok * 0.0001) / 1000
                
                store.add_telemetry(action, f"{p['name'].capitalize()} ({p['model']})", duration_ms, itok, otok, "SUCCESS", cost)
                return reply
        except Exception as e:
            duration_ms = int((time.time() - start_time) * 1000)
            store.add_telemetry(action, f"{p['name'].capitalize()} ({p['model']})", duration_ms, 0, 0, "FAILED", 0.0)
            print(f"[llm:{p['name']}] completion failed, trying next:", e)
            continue
    return None


def llm_generate_case_report(case_data, notes):
    """Generate a detailed, professional Investigation Report based on the case data and notes."""
    prompt = (
        f"You are a Senior Police Officer Copilot. Write a formal, detailed **Investigation Report**.\n\n"
        f"Case Data:\n"
        f"- ID: {case_data.get('id')}\n"
        f"- Type: {case_data.get('type')}\n"
        f"- Classification: {case_data.get('crime_type')}\n"
        f"- Location: {case_data.get('location')}\n"
        f"- Date/Time: {case_data.get('created_at')} (occurrence: {case_data.get('time')})\n"
        f"- Complainant: {case_data.get('name')} (Contact: {case_data.get('phone')})\n"
        f"- Statement Summary: {case_data.get('summary')}\n\n"
        f"Officer's Investigation Notes:\n"
        f"{notes or 'No additional notes.'}\n\n"
        f"Format the report using clean Markdown with sections:\n"
        f"1. **CASE PROFILE** (summarize facts)\n"
        f"2. **LEGAL ASSESSMENT** (explain BNS/IPC sections that apply and why)\n"
        f"3. **INVESTIGATION PLAN** (actions, witness lists, evidence collection steps)\n"
        f"4. **OFFICER SUMMARY** (professional synthesis)\n\n"
        f"Write in a professional, legal, and authoritative tone. Keep it structured and thorough."
    )
    return _llm_completion(prompt, system_prompt="You are an expert police inspector and legal draftsperson.", temperature=0.3, max_tokens=600, action="Report Generator")


def llm_summarize_interrogation(transcript, format_style="standard"):
    """Summarize an interrogation transcript in the requested style."""
    style_guidance = {
        "standard": "Provide a clean, structured summary highlighting key facts, dates, names, and confessions.",
        "bullet": "Provide a concise list of bullet points covering the core information.",
        "timeline": "Reconstruct a chronological timeline of events as described by the speaker.",
        "contradictions": "Analyze the transcript and list potential contradictions, suspicious statements, or gaps in logic."
    }.get(format_style, "Provide a clean, structured summary.")
    
    prompt = (
        f"You are a Police Detective Copilot. Analyze this interrogation/meeting transcript and summarize it.\n\n"
        f"Guidance:\n{style_guidance}\n\n"
        f"Transcript:\n\"\"\"\n{transcript}\n\"\"\"\n\n"
        f"Format using professional markdown. Keep it objective, focused, and highlights-oriented."
    )
    return _llm_completion(prompt, system_prompt="You are a seasoned police investigator skilled in statement analysis.", temperature=0.4, max_tokens=500, action="Meeting Summary")


def llm_match_officer(case_data, officer_profiles):
    """Match the case to the best officer and explain why in a structured format."""
    import json
    prompt = (
        f"You are an AI Police Human Resources assistant. Your task is to recommend the best officer for a case.\n\n"
        f"Case details:\n"
        f"- ID: {case_data.get('id')}\n"
        f"- Type: {case_data.get('crime_type')}\n"
        f"- Location: {case_data.get('location')}\n"
        f"- Summary: {case_data.get('summary')}\n\n"
        f"Available Officers:\n"
        f"{json.dumps(officer_profiles, indent=2)}\n\n"
        f"Analyze their specializations, workloads (lower active cases is better), years of experience, languages, and skills.\n"
        f"Produce a JSON response (no markdown block, just raw JSON) matching this schema:\n"
        f"{{\n"
        f"  \"recommended_officer\": \"Officer Name\",\n"
        f"  \"match_score\": 95,\n"
        f"  \"reasoning\": \"Detailed reasoning explaining why this officer is the best match.\",\n"
        f"  \"alternative_officer\": \"Runner-up Officer Name\",\n"
        f"  \"all_scores\": {{\n"
        f"     \"Officer Name 1\": 95,\n"
        f"     \"Officer Name 2\": 60\n"
        f"  }}\n"
        f"}}\n"
    )
    return _llm_completion(prompt, system_prompt="You are an expert HR allocator for law enforcement. Return only valid, unadorned JSON.", temperature=0.2, max_tokens=400, action="Officer Matcher")


def llm_bns_search(query, retrieved_laws):
    """Answer an officer's legal question using retrieved BNS laws as context (RAG)."""
    import json
    prompt = (
        f"You are Rakshak Legal AI, a BNS (Bharatiya Nyaya Sanhita) specialist.\n"
        f"Answer the officer's query using the following retrieved law sections as reference:\n\n"
        f"Retrieved laws:\n{json.dumps(retrieved_laws, indent=2)}\n\n"
        f"Officer Query: \"{query}\"\n\n"
        f"Draft a helpful, structured legal answer. Explain which section(s) apply and how. "
        f"Include the IPC equivalent if mentioned. Keep it concise, formal, and strictly based on the provided context."
    )
    return _llm_completion(prompt, system_prompt="You are a legal assistant specializing in the Bharatiya Nyaya Sanhita 2023.", temperature=0.3, max_tokens=450, action="Legal RAG Search")


def llm_match_resume(role, resume):
    """Evaluate candidate resume against a job role and return JSON matching data."""
    prompt = (
        f"You are an AI Police Hiring Assistant.\n"
        f"Evaluate the following candidate resume against the Job Description for the role: **{role}**.\n\n"
        f"Candidate Resume:\n\"\"\"\n{resume}\n\"\"\"\n\n"
        f"Produce a JSON response (no markdown blocks, just raw JSON) matching this schema:\n"
        f"{{\n"
        f"  \"match_score\": 85,\n"
        f"  \"summary\": \"Detailed summary of candidate match, strengths and alignment with role.\",\n"
        f"  \"missing_skills\": [\"Skill 1\", \"Skill 2\"],\n"
        f"  \"interview_questions\": [\"Question 1\", \"Question 2\"]\n"
        f"}}\n"
    )
    return _llm_completion(prompt, system_prompt="You are a professional HR evaluator for law enforcement agencies. Return only valid, unadorned JSON.", temperature=0.3, max_tokens=500, action="Resume JD Matcher")


def llm_stream_reply(message, lang="en"):
    """Generator that yields text tokens via streaming API (SSE-compatible)."""
    providers = _get_providers()
    if not providers:
        return

    lang_name = LANG_NAME.get(lang, "English")
    user_ctx = f"Reply ONLY in {lang_name}.\n\nCitizen message: {message}"
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_ctx},
    ]

    for p in providers:
        try:
            client = _client_for(p)
            stream = client.chat.completions.create(
                model=p["model"],
                messages=messages,
                temperature=0.4,
                max_tokens=320,
                stream=True,
            )
            global PROVIDER, MODEL
            if PROVIDER is None:
                PROVIDER = p["name"]
                MODEL = p["model"]
            for chunk in stream:
                delta = chunk.choices[0].delta
                if hasattr(delta, "content") and delta.content:
                    yield delta.content
            return
        except Exception as e:
            print(f"[llm:{p['name']}] streaming failed, trying next:", e)
            continue


def llm_analyze_sentiment(text):
    """Analyze text sentiment, tone, urgency, and key entities. Returns JSON dict."""
    prompt = (
        f"You are an AI text analyst. Analyze the following text and return ONLY a raw JSON object (no markdown) with this schema:\n"
        f"{{\n"
        f"  \"sentiment\": \"Positive|Negative|Neutral\",\n"
        f"  \"sentiment_score\": 85,\n"
        f"  \"tone\": \"e.g. Distressed, Calm, Urgent, Panicked, Formal\",\n"
        f"  \"urgency\": \"CRITICAL|HIGH|NORMAL\",\n"
        f"  \"urgency_score\": 72,\n"
        f"  \"intent\": \"e.g. reporting theft, seeking help, describing fraud\",\n"
        f"  \"confidence\": 91.5,\n"
        f"  \"key_entities\": [\"entity1\", \"entity2\"],\n"
        f"  \"word_count\": 24,\n"
        f"  \"escalate\": true\n"
        f"}}\n\n"
        f"Text to analyze:\n\"\"\"\n{text}\n\"\"\""
    )
    import json
    res = _llm_completion(prompt, system_prompt="You are a precise NLP analyzer. Return only valid JSON.", temperature=0.2, max_tokens=300)
    if not res:
        return None
    try:
        if "```json" in res:
            res = res.split("```json")[1].split("```")[0].strip()
        elif "```" in res:
            res = res.split("```")[1].split("```")[0].strip()
        return json.loads(res)
    except Exception:
        return None


def llm_generate_proposal(client_name, project_type, requirements, budget_range):
    """Generate a full structured AI project proposal document."""
    import datetime
    today = datetime.date.today().strftime("%B %d, %Y")
    prompt = (
        f"You are a senior AI solutions architect at a digital agency.\n"
        f"Write a professional, detailed project proposal document in Markdown.\n\n"
        f"Details:\n"
        f"- Client: {client_name}\n"
        f"- Project Type: {project_type}\n"
        f"- Date: {today}\n"
        f"- Budget Range: {budget_range}\n"
        f"- Client Requirements:\n\"\"\"\n{requirements}\n\"\"\"\n\n"
        f"Write a complete proposal with these sections:\n"
        f"1. Executive Summary\n"
        f"2. Project Scope (In Scope / Out of Scope)\n"
        f"3. Proposed Tech Stack (as a Markdown table: Layer | Technology | Reason)\n"
        f"4. Timeline (as a Markdown table: Phase | Duration | Deliverable)\n"
        f"5. Budget Estimate breakdown\n"
        f"6. Next Steps\n\n"
        f"Be specific, use real technologies (FastAPI, Next.js, Supabase, OpenAI, LangChain, etc). "
        f"Make it look like something a real digital agency would send to a client. "
        f"Use professional tone. Keep it concise but complete."
    )
    return _llm_completion(
        prompt,
        system_prompt="You are an expert AI solutions architect. Write professional proposals.",
        temperature=0.5,
        max_tokens=900,
    )


def llm_run_agent_investigation(case_data):
    """Generate a sequence of agent execution steps (Thoughts, Tool calls, Observations) and a final report in JSON format."""
    import json
    prompt = (
        f"You are an autonomous AI Police Agent Investigator.\n"
        f"Investigate the following case details:\n\n"
        f"Case Profile:\n{json.dumps(case_data, indent=2, default=str)}\n\n"
        f"Generate a sequence of 4-6 agent execution steps showing your thought process, tool calls, and results. "
        f"Finally, compile a structured Case Strategy Report.\n\n"
        f"Produce a JSON response (no markdown blocks, just raw JSON) matching this schema:\n"
        f"{{\n"
        f"  \"steps\": [\n"
        f"     {{\"type\": \"THOUGHT\", \"message\": \"Thinking about the case classification...\"}},\n"
        f"     {{\"type\": \"TOOL_CALL\", \"message\": \"Querying regional databases for X...\"}},\n"
        f"     {{\"type\": \"OBSERVATION\", \"message\": \"Found matching pattern...\"}}\n"
        f"  ],\n"
        f"  \"report\": \"Structured markdown plan detailing legal analysis, next steps, and final strategy.\"\n"
        f"}}\n"
    )
    return _llm_completion(prompt, system_prompt="You are an autonomous investigative agent. Return only valid, unadorned JSON.", temperature=0.3, max_tokens=650, action="Agent Investigator")


def llm_run_custom_prompt(system_prompt, user_message, temp=0.4, model_name=None):
    """Executes a custom prompt against a specific model with customizable temperature."""
    import time
    import store
    providers = _get_providers()
    
    p = None
    if providers:
        if model_name:
            for provider in providers:
                if provider["name"].lower() == model_name.lower() or model_name.lower() in provider["model"].lower():
                    p = provider
                    break
        if not p:
            p = providers[0]
            
    if not p:
        return None
        
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]
    
    start_time = time.time()
    try:
        client = _client_for(p)
        resp = client.chat.completions.create(
            model=p["model"],
            messages=messages,
            temperature=float(temp),
            max_tokens=450,
        )
        reply = resp.choices[0].message.content.strip()
        duration_ms = int((time.time() - start_time) * 1000)
        if reply:
            itok = resp.usage.prompt_tokens if (resp.usage and hasattr(resp.usage, 'prompt_tokens')) else 0
            otok = resp.usage.completion_tokens if (resp.usage and hasattr(resp.usage, 'completion_tokens')) else 0
            cost = (itok * 0.00015 + otok * 0.0006) / 1000 if p["name"] == "openai" else (itok * 0.00005 + otok * 0.0001) / 1000
            
            store.add_telemetry("Prompt Playground", f"{p['name'].capitalize()} ({p['model']})", duration_ms, itok, otok, "SUCCESS", cost)
            return {
                "reply": reply,
                "latency_ms": duration_ms,
                "input_tokens": itok,
                "output_tokens": otok,
                "cost": cost,
                "provider": f"{p['name'].capitalize()} ({p['model']})"
            }
    except Exception as e:
        duration_ms = int((time.time() - start_time) * 1000)
        store.add_telemetry("Prompt Playground", f"{p['name'].capitalize()} ({p['model']})", duration_ms, 0, 0, "FAILED", 0.0)
        print(f"[llm:custom_prompt] execution failed:", e)
        raise e
    return None

