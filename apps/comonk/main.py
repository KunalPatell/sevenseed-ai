from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import httpx
import os
import re
import json
import pdfplumber
from typing import List, Optional, Sequence, TypedDict, Annotated
from dotenv import load_dotenv
import operator

# LangChain / LangGraph imports
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

# Simple in-memory chat history (no extra package needed)
class ChatMessageHistory:
    def __init__(self):
        self.messages = []
    def add_user_message(self, content: str):
        self.messages.append(HumanMessage(content=content))
    def add_ai_message(self, content: str):
        self.messages.append(AIMessage(content=content))

load_dotenv()

app = FastAPI(title="Comonk AI API — Advanced LangGraph Edition", version="3.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-latest")
DB_PATH = os.environ.get("COMONK_DB_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "comonk.db"))

# ─── In-memory session store for persistent chat memory ─────────────────────
_session_store: dict[str, ChatMessageHistory] = {}

def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in _session_store:
        _session_store[session_id] = ChatMessageHistory()
    return _session_store[session_id]

# ─── Pydantic models ─────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    profile: Optional[dict] = None
    session_id: Optional[str] = "default"

class EmailDraftRequest(BaseModel):
    company_id: int
    contact_id: Optional[int] = None
    user_name: str
    user_skills: List[str]
    user_experience: str
    target_role: str

class RoadmapRequest(BaseModel):
    current_skills: List[str]
    target_role: str
    experience_level: str = "fresher"

# ─── DB Helper ───────────────────────────────────────────────────────────────
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ─── LLM Helper (Groq → Mistral fallback) ───────────────────────────────────
async def call_llm(messages: list, response_format: Optional[dict] = None) -> str:
    if GROQ_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": GROQ_MODEL,
                "messages": messages,
                "temperature": 0.3 if response_format else 0.7
            }
            if response_format:
                payload["response_format"] = response_format
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                else:
                    print(f"Groq API error: {response.text}")
        except Exception as e:
            print(f"Failed to connect to Groq: {e}")

    if MISTRAL_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {MISTRAL_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": MISTRAL_MODEL,
                "messages": messages,
                "temperature": 0.3 if response_format else 0.7
            }
            if response_format:
                payload["response_format"] = response_format
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post("https://api.mistral.ai/v1/chat/completions", json=payload, headers=headers)
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                else:
                    print(f"Mistral API error: {response.text}")
        except Exception as e:
            print(f"Failed to connect to Mistral: {e}")

    raise HTTPException(status_code=500, detail="LLM execution failed on all providers.")

# ═══════════════════════════════════════════════════════════════════════════════
# LANGCHAIN TOOLS
# ═══════════════════════════════════════════════════════════════════════════════

@tool
def match_jobs_tool(skills: List[str]) -> str:
    """Matches job targets and companies from the database using candidate skills.
    Use this tool when the candidate asks for company recommendations or job matches."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM companies")
    companies = cursor.fetchall()

    matches = []
    for c in companies:
        c_dict = dict(c)
        roles_text = (c_dict["roles"] or "").lower()
        cat_text = (c_dict["category"] or "").lower()
        company_name = c_dict["name"].lower()

        score = 0
        matching_skills = []
        for s in skills:
            s_lower = s.lower()
            if s_lower in roles_text or s_lower in cat_text or s_lower in company_name:
                score += 1
                matching_skills.append(s)

        if score > 0:
            c_dict["score"] = score
            c_dict["matching_skills"] = matching_skills
            cursor.execute("SELECT COUNT(*) FROM contacts WHERE company_id = ?", (c_dict["id"],))
            c_dict["contact_count"] = cursor.fetchone()[0]
            matches.append(c_dict)

    matches.sort(key=lambda x: x["score"], reverse=True)
    conn.close()

    results = matches[:5]
    if not results:
        return "No matching companies found in our database for those skills."

    out = []
    for r in results:
        out.append(
            f"- **{r['name']}** ({r['category']}): Matches skills: {', '.join(r['matching_skills'])}. "
            f"Address: {r['address'] or 'N/A'}. Website: {r['website'] or 'N/A'}. HR Contacts: {r['contact_count']}"
        )
    return "\n".join(out)

@tool
def career_roadmap_tool(current_skills: List[str], target_role: str) -> str:
    """Generates a structured career roadmap with learning milestones for a target role.
    Use when the candidate asks for career guidance, learning path, or skill development plan."""
    skill_gaps = {
        "ai/ml engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "MLOps", "Docker", "Kubernetes", "LLMs"],
        "data scientist": ["Python", "R", "SQL", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "Statistics", "Tableau"],
        "full stack developer": ["React", "Node.js", "MongoDB", "SQL", "REST APIs", "Docker", "CI/CD", "TypeScript"],
        "backend developer": ["Python/Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
        "frontend developer": ["React", "TypeScript", "CSS3", "Figma", "Next.js", "Testing", "Performance Optimization"],
        "devops engineer": ["Linux", "Docker", "Kubernetes", "Terraform", "CI/CD", "AWS/GCP/Azure", "Monitoring"],
        "data engineer": ["Python", "Apache Spark", "Airflow", "Kafka", "SQL", "BigQuery", "dbt", "ETL pipelines"],
    }

    target_lower = target_role.lower()
    required = []
    for key in skill_gaps:
        if any(word in target_lower for word in key.split("/")):
            required = skill_gaps[key]
            break

    if not required:
        required = ["Python", "Git", "SQL", "Communication", "Problem Solving", "Cloud Fundamentals"]

    known_lower = [s.lower() for s in current_skills]
    missing = [r for r in required if r.lower() not in known_lower]
    have = [r for r in required if r.lower() in known_lower]

    roadmap = f"""
📍 Career Target: {target_role}
✅ Skills You Already Have: {', '.join(have) if have else 'None matched yet'}
🚀 Skills to Acquire: {', '.join(missing) if missing else 'You are well-equipped!'}

📅 30-Day Plan:
- Week 1-2: Focus on {missing[0] if missing else 'Advanced projects'} (free resources: YouTube, freeCodeCamp, Kaggle)
- Week 3: Build a portfolio project demonstrating {missing[1] if len(missing) > 1 else 'your key skill'}
- Week 4: Apply to 10+ companies, update LinkedIn, practice mock interviews

📅 60-Day Plan:
- Complete 1 Udemy/Coursera certification in {missing[2] if len(missing) > 2 else 'your target stack'}
- Contribute to 1 open-source project
- Network with 5+ professionals in Gujarat's AI/IT community

📅 90-Day Plan:
- Target: {target_role} role at a mid-to-senior Gujarat IT company
- Polish GitHub profile with 3+ relevant projects
- Mock interview with Comonk AI Career Counselor
    """.strip()
    return roadmap

@tool
def get_hr_contacts_tool(company_name: str) -> str:
    """Fetches HR contacts for a specific company from the database.
    Use this when the user asks for recruiter or HR contact details at a named company."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM companies WHERE name LIKE ?", (f"%{company_name}%",))
    company = cursor.fetchone()
    if not company:
        conn.close()
        return f"No company found matching '{company_name}' in our database."

    company_dict = dict(company)
    cursor.execute("SELECT name, email, phone FROM contacts WHERE company_id = ?", (company_dict["id"],))
    contacts = cursor.fetchall()
    conn.close()

    if not contacts:
        return f"Found company '{company_dict['name']}' but no HR contacts are listed. Visit: {company_dict.get('website', 'N/A')}"

    out = [f"HR Contacts at {company_dict['name']}:"]
    for c in contacts:
        c_dict = dict(c)
        out.append(f"  - {c_dict['name'] or 'HR Manager'} | Email: {c_dict['email'] or 'N/A'} | Phone: {c_dict['phone'] or 'N/A'}")
    return "\n".join(out)

@tool
def draft_outreach_email_tool(company_name: str, candidate_name: str, target_role: str,
                              matching_skills: List[str], hr_name: Optional[str] = "Hiring Manager") -> str:
    """Generates a personalized, professional cold outreach email draft to a recruiter at a target company."""
    llm = ChatGroq(model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"), api_key=os.getenv("GROQ_API_KEY"))
    prompt = (
        f"Write a highly professional, brief cold email from {candidate_name} to recruiter {hr_name} at {company_name} "
        f"for the role of {target_role}. Emphasize these skills: {', '.join(matching_skills)}. Keep it concise. "
        "Return just the Subject line and the Email Body."
    )
    res = llm.invoke(prompt)
    return res.content

# ═══════════════════════════════════════════════════════════════════════════════
# LANGGRAPH STATEFUL MULTI-AGENT GRAPH (v3)
# ═══════════════════════════════════════════════════════════════════════════════

TOOLS = [match_jobs_tool, career_roadmap_tool, get_hr_contacts_tool, draft_outreach_email_tool]

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    profile: Optional[dict]
    matched_companies: Optional[str]
    session_id: Optional[str]

def enricher_node(state: AgentState):
    """Pre-processes user query with RAG context from the database."""
    messages = state["messages"]
    profile = state.get("profile") or {}

    last_user_message = ""
    for msg in reversed(messages):
        if isinstance(msg, HumanMessage):
            last_user_message = msg.content
            break

    matched_text = ""
    skills = profile.get("skills", [])
    query_lower = last_user_message.lower()

    # --- RAG: Company Matching ---
    if skills and any(x in query_lower for x in ["match", "company", "companies", "job", "jobs", "target", "apply", "hire", "hiring"]):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM companies")
        companies = cursor.fetchall()

        matches = []
        for c in companies:
            c_dict = dict(c)
            roles_text = (c_dict["roles"] or "").lower()
            cat_text = (c_dict["category"] or "").lower()
            company_name = c_dict["name"].lower()

            score = 0
            matching_skills = []
            for s in skills:
                s_lower = s.lower()
                if s_lower in roles_text or s_lower in cat_text or s_lower in company_name:
                    score += 1
                    matching_skills.append(s)

            if score > 0:
                c_dict["score"] = score
                c_dict["matching_skills"] = matching_skills
                cursor.execute("SELECT COUNT(*) FROM contacts WHERE company_id = ?", (c_dict["id"],))
                c_dict["contact_count"] = cursor.fetchone()[0]
                matches.append(c_dict)

        matches.sort(key=lambda x: x["score"], reverse=True)
        conn.close()

        results = matches[:6]
        if results:
            matched_text = "\n\n[🗄️ RAG Matched Targets from Comonk Database]:\n"
            for r in results:
                matched_text += (
                    f"• {r['name']} ({r['category']}) — Matching: {', '.join(r['matching_skills'])}"
                    f" | HR Contacts: {r['contact_count']} | Web: {r['website'] or 'N/A'}\n"
                )

    # --- RAG: Draft Email Context ---
    draft_text = ""
    email_match = re.search(r'(draft|write|email|letter|pitch).*?(?:for|to)\s+([a-zA-Z0-9\s\.\-_]+)', last_user_message, re.IGNORECASE)
    if email_match:
        company_query = email_match.group(2).strip()
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM companies WHERE name LIKE ?", (f"%{company_query}%",))
        company = cursor.fetchone()
        if company:
            company_dict = dict(company)
            cursor.execute("SELECT * FROM contacts WHERE company_id = ?", (company_dict["id"],))
            contacts = cursor.fetchall()
            hr_name = contacts[0]["name"] if contacts else "Hiring Manager"
            draft_text = (
                f"\n\n[✉️ Email Draft Context]:\n"
                f"Target: {company_dict['name']} | HR: {hr_name} | "
                f"Candidate: {profile.get('name', 'Job Seeker')} | "
                f"Skills: {', '.join(skills)}\n"
                "Generate a professional cold email with subject and body at end of response."
            )
        conn.close()

    return {"matched_companies": matched_text + draft_text}

def chatbot_agent(state: AgentState):
    """Main AI agent — career counselor powered by Groq LLM."""
    messages = state["messages"]
    profile = state.get("profile") or {}
    matched_context = state.get("matched_companies", "")
    session_id = state.get("session_id", "default")

    # Build persistent memory summary
    session_hist = get_session_history(session_id)

    profile_str = ""
    if profile:
        skills_list = profile.get("skills", [])
        profile_str = (
            f"\n\n📋 Candidate Profile:\n"
            f"• Name: {profile.get('name', 'Job Seeker')}\n"
            f"• Skills ({len(skills_list)}): {', '.join(skills_list[:15])}\n"
            f"• Experience: {profile.get('experience', 'Not specified')}\n"
            f"• Education: {profile.get('education', 'Not specified')}\n"
            f"• Target Roles: {', '.join(profile.get('target_roles', ['AI/ML Engineer']))}"
        )

    system_msg = SystemMessage(content=(
        "You are Comonk AI — an advanced, empathetic Career Guidance Intelligence built specifically "
        "for job seekers in Gujarat's IT & AI/ML ecosystem (Ahmedabad, Gandhinagar, GIFT City).\n\n"
        "🎯 Your Mission:\n"
        "1. Analyze candidate profiles and provide deeply personalized career guidance.\n"
        "2. Recommend specific company targets from our Gujarat database with HR contacts.\n"
        "3. Build actionable 30-60-90 day career roadmaps with real resources.\n"
        "4. Draft high-impact cold outreach emails tailored to each company.\n"
        "5. Provide interview preparation tips, skill gap analysis, and market insights.\n\n"
        "🧠 Advanced Behaviors:\n"
        "- Always use structured responses with clear headers and bullet points.\n"
        "- Be motivating, warm, and practical — many users are career changers or first-time job seekers.\n"
        "- When recommending companies, always mention specific skills that match.\n"
        "- Never fabricate contact details — only reference what's in the provided database context.\n"
        "- Use emojis sparingly to make responses engaging and scannable.\n"
        "- Remember: This platform was built by the founder of 'Comonk' startup to help needy people find careers.\n"
        f"{profile_str}"
        f"{matched_context}"
    ))

    all_msgs = [system_msg] + list(session_hist.messages) + messages

    llm = ChatGroq(model=GROQ_MODEL, api_key=GROQ_API_KEY)
    response = llm.invoke(all_msgs)

    # Persist to session memory
    for msg in messages:
        if isinstance(msg, HumanMessage):
            session_hist.add_user_message(msg.content)
    session_hist.add_ai_message(response.content)

    print(f"\n[DEBUG] Agent response ({len(response.content)} chars)")
    return {"messages": [response]}

# ─── Build LangGraph ─────────────────────────────────────────────────────────
workflow = StateGraph(AgentState)
workflow.add_node("enricher", enricher_node)
workflow.add_node("agent", chatbot_agent)
workflow.add_edge(START, "enricher")
workflow.add_edge("enricher", "agent")
workflow.add_edge("agent", END)
compiled_graph = workflow.compile()

# ═══════════════════════════════════════════════════════════════════════════════
# FASTAPI ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "version": "3.0.0",
        "message": "Comonk AI Career Platform — LangGraph Multi-Agent Edition",
        "tools": [t.name for t in TOOLS]
    }

@app.get("/api/stats")
def get_stats():
    """Dashboard statistics endpoint."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM companies")
    total_companies = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM contacts")
    total_contacts = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(DISTINCT category) FROM companies")
    total_categories = cursor.fetchone()[0]
    cursor.execute("SELECT category, COUNT(*) as cnt FROM companies GROUP BY category ORDER BY cnt DESC LIMIT 5")
    top_categories = [{"category": row[0], "count": row[1]} for row in cursor.fetchall()]
    conn.close()
    return {
        "total_companies": total_companies,
        "total_hr_contacts": total_contacts,
        "total_categories": total_categories,
        "top_categories": top_categories,
        "cities_covered": ["Ahmedabad", "Gandhinagar", "GIFT City"],
        "agent_tools_active": len(TOOLS)
    }

@app.get("/api/companies")
def get_companies(q: Optional[str] = None, category: Optional[str] = None, limit: int = 20, offset: int = 0):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM companies WHERE 1=1"
    params = []

    if q:
        query += " AND (name LIKE ? OR roles LIKE ? OR address LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])
    if category:
        query += " AND category = ?"
        params.append(category)

    query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    cursor.execute(query, params)
    rows = cursor.fetchall()

    count_query = "SELECT COUNT(*) FROM companies WHERE 1=1"
    count_params = []
    if q:
        count_query += " AND (name LIKE ? OR roles LIKE ? OR address LIKE ?)"
        count_params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])
    if category:
        count_query += " AND category = ?"
        count_params.append(category)
    cursor.execute(count_query, count_params)
    total = cursor.fetchone()[0]
    conn.close()

    return {"total": total, "companies": [dict(row) for row in rows]}

@app.get("/api/companies/{company_id}")
def get_company_details(company_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM companies WHERE id = ?", (company_id,))
    company = cursor.fetchone()
    if not company:
        conn.close()
        raise HTTPException(status_code=404, detail="Company not found")
    cursor.execute("SELECT * FROM contacts WHERE company_id = ?", (company_id,))
    contacts = cursor.fetchall()
    conn.close()
    return {"company": dict(company), "contacts": [dict(c) for c in contacts]}

@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
    try:
        text = ""
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"

        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. It may be scanned.")

        system_prompt = (
            "You are an expert resume parser and career analyst. Analyze the resume and return structured JSON with: "
            "name (string), email (string), phone (string), skills (array of strings, max 20 most relevant), "
            "experience (string summary, max 100 words), education (string summary), "
            "target_roles (array of strings, 2-4 suggested roles based on background), "
            "experience_years (number, estimated), seniority_level (string: fresher/junior/mid/senior)."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Parse this resume:\n\n{text[:5000]}"}
        ]

        response_format = {"type": "json_object"}
        llm_response = await call_llm(messages, response_format=response_format)
        parsed_data = json.loads(llm_response)
        return parsed_data

    except Exception as e:
        print(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/match")
def match_companies_api(skills: List[str], category: Optional[str] = None):
    if not skills:
        return {"matches": []}
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM companies"
    params = []
    if category:
        query += " WHERE category = ?"
        params.append(category)
    cursor.execute(query, params)
    companies = cursor.fetchall()

    matches = []
    for c in companies:
        c_dict = dict(c)
        roles_text = (c_dict["roles"] or "").lower()
        cat_text = (c_dict["category"] or "").lower()
        company_name = c_dict["name"].lower()

        score = 0
        matching_skills = []
        for s in skills:
            s_lower = s.lower()
            if s_lower in roles_text or s_lower in cat_text or s_lower in company_name:
                score += 1
                matching_skills.append(s)

        if score > 0:
            c_dict["score"] = score
            c_dict["matching_skills"] = matching_skills
            cursor.execute("SELECT COUNT(*) FROM contacts WHERE company_id = ?", (c_dict["id"],))
            c_dict["contact_count"] = cursor.fetchone()[0]
            matches.append(c_dict)

    matches.sort(key=lambda x: x["score"], reverse=True)
    conn.close()
    return {"matches": matches[:30]}

@app.post("/api/career-roadmap")
async def generate_career_roadmap(req: RoadmapRequest):
    """Generates an AI-powered career roadmap for a specific target role."""
    skill_gaps = {
        "ai": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "MLOps", "Docker", "LLMs", "Prompt Engineering"],
        "ml": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "MLOps", "Docker", "LLMs", "Prompt Engineering"],
        "data scientist": ["Python", "R", "SQL", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "Statistics", "Tableau", "PowerBI"],
        "full stack": ["React", "Node.js", "MongoDB", "SQL", "REST APIs", "Docker", "CI/CD", "TypeScript", "AWS"],
        "backend": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "System Design"],
        "frontend": ["React", "TypeScript", "CSS3", "Figma", "Next.js", "Testing", "Tailwind", "Performance Optimization"],
        "devops": ["Linux", "Docker", "Kubernetes", "Terraform", "CI/CD", "AWS/GCP/Azure", "Monitoring", "Ansible"],
        "data engineer": ["Python", "Apache Spark", "Airflow", "Kafka", "SQL", "BigQuery", "dbt", "ETL pipelines"],
    }

    target_lower = req.target_role.lower()
    required = []
    for key, skills in skill_gaps.items():
        if key in target_lower:
            required = skills
            break
    if not required:
        required = ["Python", "Git", "SQL", "Communication", "Cloud Fundamentals", "System Design"]

    known_lower = [s.lower() for s in req.current_skills]
    missing = [r for r in required if r.lower() not in known_lower]
    have = [r for r in required if r.lower() in known_lower]
    match_pct = round((len(have) / len(required)) * 100) if required else 0

    system_prompt = (
        "You are a senior career strategist specializing in Gujarat's IT and AI industry. "
        "Generate a detailed, actionable career roadmap in JSON format with fields: "
        "summary (string), skill_gap_percentage (number 0-100), skills_you_have (array), "
        "skills_to_learn (array of objects with name and free_resource), "
        "week_1_2 (string action), week_3_4 (string action), "
        "month_2 (string action), month_3 (string action), "
        "certifications (array of strings), "
        "companies_to_target (array of strings, Gujarat IT/AI companies), "
        "motivational_message (string). Be specific, realistic, and encouraging."
    )

    user_prompt = (
        f"Target Role: {req.target_role}\n"
        f"Current Skills: {', '.join(req.current_skills)}\n"
        f"Experience Level: {req.experience_level}\n"
        f"Skills Already Matching: {', '.join(have)}\n"
        f"Skills to Learn: {', '.join(missing)}\n"
        f"Current Match: {match_pct}% ready for the role."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    response_format = {"type": "json_object"}
    llm_response = await call_llm(messages, response_format=response_format)
    roadmap_data = json.loads(llm_response)
    roadmap_data["skills_you_have"] = have
    roadmap_data["skills_to_learn_raw"] = missing
    roadmap_data["match_percentage"] = match_pct
    return roadmap_data

@app.post("/api/chat")
async def chat_counselor(req: ChatRequest):
    """Main LangGraph-powered career counselor chat endpoint with persistent memory."""
    lc_messages = []
    for msg in req.messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role in ["assistant", "bot"]:
            lc_messages.append(AIMessage(content=msg.content))

    initial_state = {
        "messages": lc_messages,
        "profile": req.profile,
        "matched_companies": "",
        "session_id": req.session_id or "default"
    }

    try:
        final_state = await compiled_graph.ainvoke(initial_state)
        final_response = final_state["messages"][-1].content
        return {"response": final_response}
    except Exception as e:
        print(f"Error in LangGraph execution: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/draft-email")
async def draft_outreach_email(req: EmailDraftRequest):
    """Generates a personalized cold outreach email draft."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM companies WHERE id = ?", (req.company_id,))
    company = cursor.fetchone()
    if not company:
        conn.close()
        raise HTTPException(status_code=404, detail="Company not found")
    company_dict = dict(company)
    contact_dict = None
    if req.contact_id:
        cursor.execute("SELECT * FROM contacts WHERE id = ?", (req.contact_id,))
        contact = cursor.fetchone()
        if contact:
            contact_dict = dict(contact)
    conn.close()

    hr_name = contact_dict["name"] if (contact_dict and contact_dict["name"]) else "Hiring Manager"
    company_name = company_dict["name"]

    system_prompt = (
        "You are an expert cold outreach strategist who writes emails that get responses. "
        "Write a highly professional, personalized, and concise cold email. "
        "Highlight matching skills, express genuine interest, and end with a clear call to action. "
        "Do not include placeholders — fill everything out completely."
    )

    user_prompt = (
        f"Draft a cold email from {req.user_name} to {hr_name} at {company_name}.\n\n"
        f"Candidate Skills: {', '.join(req.user_skills)}\n"
        f"Experience: {req.user_experience}\n"
        f"Target Role: {req.target_role}\n"
        f"Company Domain: {company_dict.get('roles', '')}\n\n"
        "Return JSON with fields: 'subject' (string) and 'body' (string)."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    response_format = {"type": "json_object"}
    llm_response = await call_llm(messages, response_format=response_format)
    draft_data = json.loads(llm_response)
    return draft_data

@app.delete("/api/session/{session_id}")
def clear_session(session_id: str):
    """Clear the conversation memory for a session."""
    if session_id in _session_store:
        del _session_store[session_id]
    return {"status": "cleared", "session_id": session_id}

# ═══════════════════════════════════════════════════════════════════════════════
# FREE API INTEGRATIONS — 100% FREE, NO COST TO USERS
# ═══════════════════════════════════════════════════════════════════════════════

# ─── Pydantic models for new features ────────────────────────────────────────
class MockInterviewRequest(BaseModel):
    target_role: str
    experience_level: str = "fresher"
    user_skills: List[str] = []
    question_count: int = 5

class ATSRequest(BaseModel):
    resume_text: str
    target_role: str

class LinkedInOptimizeRequest(BaseModel):
    about_section: str
    target_role: str
    skills: List[str] = []

class GitHubAnalyzeRequest(BaseModel):
    github_username: str
    target_role: str = "Software Developer"

# ─── 1. LIVE JOB LISTINGS — RemoteOK (100% FREE, No key needed) ──────────────
@app.get("/api/live-jobs")
async def get_live_jobs(skills: str = "", limit: int = 15):
    """
    Fetches real-time remote tech jobs from RemoteOK.com.
    COMPLETELY FREE — No API key required.
    Filters by skills extracted from user profile.
    """
    try:
        async with httpx.AsyncClient(timeout=15.0, headers={"User-Agent": "Comonk-AI-Career-Platform/3.0"}) as client:
            response = await client.get("https://remoteok.com/api")
            if response.status_code != 200:
                return {"jobs": [], "source": "RemoteOK", "error": "Service unavailable"}

            all_jobs = response.json()
            # Filter out the first item (it's a legal notice)
            jobs = [j for j in all_jobs if isinstance(j, dict) and j.get("position")]

            # Filter by skills if provided
            skill_list = [s.strip().lower() for s in skills.split(",") if s.strip()] if skills else []
            if skill_list:
                filtered = []
                for job in jobs:
                    job_text = " ".join([
                        job.get("position", ""),
                        job.get("description", ""),
                        " ".join(job.get("tags", []))
                    ]).lower()
                    if any(skill in job_text for skill in skill_list):
                        filtered.append(job)
                jobs = filtered if filtered else jobs[:limit]

            result = []
            for job in jobs[:limit]:
                result.append({
                    "id": job.get("id"),
                    "title": job.get("position", "Unknown Position"),
                    "company": job.get("company", "Unknown"),
                    "company_logo": job.get("company_logo", ""),
                    "location": job.get("location", "Remote"),
                    "tags": job.get("tags", [])[:6],
                    "url": job.get("url", f"https://remoteok.com/l/{job.get('slug', '')}"),
                    "salary": job.get("salary_min") and f"${job.get('salary_min')}–${job.get('salary_max', '?')}/yr" or "Not disclosed",
                    "date": job.get("date", ""),
                    "description_short": (job.get("description", "") or "")[:200].strip()
                })

            return {
                "jobs": result,
                "total": len(result),
                "source": "RemoteOK.com",
                "cost": "FREE — No API key required"
            }

    except Exception as e:
        print(f"RemoteOK error: {e}")
        return {"jobs": [], "source": "RemoteOK", "error": str(e)}


# ─── 2. LEARNING RESOURCES — Dev.to + HackerNews (100% FREE) ─────────────────
@app.get("/api/learning-resources")
async def get_learning_resources(skills: str = "python,ai,machine-learning", limit: int = 12):
    """
    Fetches free learning articles from Dev.to (no key needed) and
    top HackerNews stories for tech learning.
    COMPLETELY FREE.
    """
    articles = []
    tags = [s.strip().lower().replace(" ", "-") for s in skills.split(",") if s.strip()][:4]

    async with httpx.AsyncClient(timeout=12.0) as client:
        for tag in tags[:3]:  # Limit API calls
            try:
                url = f"https://dev.to/api/articles?tag={tag}&per_page=5&top=7"
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    for art in data:
                        articles.append({
                            "title": art.get("title"),
                            "url": art.get("url"),
                            "description": art.get("description", "")[:180],
                            "tag": tag,
                            "cover_image": art.get("cover_image", ""),
                            "reading_time": art.get("reading_time_minutes", 5),
                            "reactions": art.get("public_reactions_count", 0),
                            "source": "Dev.to",
                            "type": "article"
                        })
            except Exception as e:
                print(f"Dev.to error for tag {tag}: {e}")

        # Add HackerNews top stories about tech
        try:
            hn_res = await client.get("https://hn.algolia.com/api/v1/search?query=career+tech+india&tags=story&hitsPerPage=5")
            if hn_res.status_code == 200:
                hits = hn_res.json().get("hits", [])
                for h in hits[:5]:
                    if h.get("url") and h.get("title"):
                        articles.append({
                            "title": h.get("title"),
                            "url": h.get("url"),
                            "description": f"Points: {h.get('points', 0)} · Comments: {h.get('num_comments', 0)}",
                            "tag": "tech-news",
                            "cover_image": "",
                            "reading_time": 3,
                            "reactions": h.get("points", 0),
                            "source": "HackerNews",
                            "type": "news"
                        })
        except Exception as e:
            print(f"HN error: {e}")

    # Add curated free course links (always available, no API)
    free_courses = {
        "python": {"title": "Python for Everybody (Free)", "url": "https://www.py4e.com", "source": "Py4E"},
        "machine-learning": {"title": "ML Course by Andrew Ng (Free Audit)", "url": "https://www.coursera.org/learn/machine-learning", "source": "Coursera"},
        "ai": {"title": "Fast.ai Practical Deep Learning (100% Free)", "url": "https://course.fast.ai", "source": "fast.ai"},
        "javascript": {"title": "The Odin Project (Free Full Stack)", "url": "https://www.theodinproject.com", "source": "Odin Project"},
        "docker": {"title": "Docker Getting Started (Free Official)", "url": "https://docs.docker.com/get-started", "source": "Docker"},
        "sql": {"title": "SQLBolt — Interactive SQL (Free)", "url": "https://sqlbolt.com", "source": "SQLBolt"},
    }

    for tag in tags:
        if tag in free_courses:
            c = free_courses[tag]
            articles.append({
                "title": c["title"],
                "url": c["url"],
                "description": f"Curated free resource for {tag}",
                "tag": tag,
                "cover_image": "",
                "reading_time": 0,
                "reactions": 999,
                "source": c["source"],
                "type": "course"
            })

    return {
        "articles": articles[:limit],
        "total": len(articles[:limit]),
        "sources": ["Dev.to (free)", "HackerNews Algolia (free)", "Curated free courses"],
        "cost": "FREE — No API keys required"
    }


# ─── 3. GITHUB PORTFOLIO ANALYZER — GitHub REST API (FREE) ───────────────────
@app.get("/api/github-analyze/{username}")
async def analyze_github_profile(username: str, target_role: str = "Software Developer"):
    """
    Analyzes a GitHub profile using the free GitHub REST API.
    No key needed for public repos (60 req/hr). With token: 5000 req/hr.
    """
    github_token = os.getenv("GITHUB_TOKEN", "")
    headers = {"Accept": "application/vnd.github.v3+json"}
    if github_token:
        headers["Authorization"] = f"token {github_token}"

    try:
        async with httpx.AsyncClient(timeout=12.0, headers=headers) as client:
            # Fetch user profile
            user_res = await client.get(f"https://api.github.com/users/{username}")
            if user_res.status_code == 404:
                raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
            if user_res.status_code != 200:
                raise HTTPException(status_code=400, detail="GitHub API error")

            user = user_res.json()

            # Fetch repos
            repos_res = await client.get(
                f"https://api.github.com/users/{username}/repos?sort=updated&per_page=20"
            )
            repos = repos_res.json() if repos_res.status_code == 200 else []

            # Extract languages
            all_languages = {}
            for repo in repos[:10]:
                lang = repo.get("language")
                if lang:
                    all_languages[lang] = all_languages.get(lang, 0) + 1

            top_languages = sorted(all_languages.items(), key=lambda x: x[1], reverse=True)[:5]
            total_stars = sum(r.get("stargazers_count", 0) for r in repos)
            total_forks = sum(r.get("forks_count", 0) for r in repos)
            has_readme = any("readme" in r.get("name", "").lower() for r in repos)

            profile_summary = (
                f"GitHub user: {username}\n"
                f"Name: {user.get('name', username)}\n"
                f"Bio: {user.get('bio', 'No bio')}\n"
                f"Public repos: {user.get('public_repos', 0)}\n"
                f"Followers: {user.get('followers', 0)}\n"
                f"Total stars: {total_stars}\n"
                f"Top languages: {', '.join([l[0] for l in top_languages])}\n"
                f"Notable repos: {', '.join([r['name'] for r in repos[:5]])}\n"
                f"Target role: {target_role}"
            )

            # AI Analysis
            sys_prompt = (
                "You are a senior software engineering recruiter. Analyze this GitHub profile and return a JSON with: "
                "score (number 0-100), strengths (array of strings), improvements (array of strings), "
                "profile_grade (string: A/B/C/D), "
                "summary (string, 2 sentences), "
                "recommended_projects_to_build (array of 3 project ideas as strings), "
                "readme_tip (string), "
                "keyword_optimization (array of keywords to add to profile)."
            )

            ai_res = await call_llm([
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": f"Analyze this GitHub profile for {target_role} role:\n\n{profile_summary}"}
            ], response_format={"type": "json_object"})

            analysis = json.loads(ai_res)

            return {
                "username": username,
                "name": user.get("name", username),
                "avatar": user.get("avatar_url", ""),
                "bio": user.get("bio", ""),
                "followers": user.get("followers", 0),
                "public_repos": user.get("public_repos", 0),
                "total_stars": total_stars,
                "total_forks": total_forks,
                "top_languages": [{"name": l[0], "count": l[1]} for l in top_languages],
                "notable_repos": [
                    {
                        "name": r.get("name"),
                        "description": r.get("description", ""),
                        "stars": r.get("stargazers_count", 0),
                        "language": r.get("language", ""),
                        "url": r.get("html_url")
                    }
                    for r in repos[:6]
                ],
                "ai_analysis": analysis,
                "source": "GitHub REST API (Free)",
                "cost": "FREE — Optional token for higher rate limits"
            }

    except HTTPException:
        raise
    except Exception as e:
        print(f"GitHub analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── 4. AI MOCK INTERVIEW — Groq (FREE tier) ─────────────────────────────────
@app.post("/api/mock-interview")
async def mock_interview(req: MockInterviewRequest):
    """
    Generates role-specific interview Q&A using Groq (free tier).
    Returns questions with ideal answers, tips, and a starter evaluation.
    COMPLETELY FREE using existing Groq key.
    """
    system_prompt = (
        "You are a senior technical recruiter and interview coach. Generate realistic interview questions "
        "with detailed model answers for the given role and experience level. Return JSON with: "
        "role (string), experience_level (string), questions (array of objects each with: "
        "question (string), category (string: Technical/Behavioral/Situational/HR), "
        "ideal_answer (string, 3-5 sentences), tip (string, 1 sentence interview tip), "
        "difficulty (string: Easy/Medium/Hard)), "
        "intro_tip (string), closing_tip (string), "
        "common_mistakes (array of strings)."
    )

    user_prompt = (
        f"Generate {req.question_count} interview questions for: {req.target_role}\n"
        f"Experience level: {req.experience_level}\n"
        f"Candidate skills: {', '.join(req.user_skills[:10]) if req.user_skills else 'General'}\n"
        "Mix technical, behavioral, and HR questions. Tailor to Gujarat/India IT market."
    )

    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt},
         {"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    data["cost"] = "FREE — Powered by Groq LLaMA 3.3 70B"
    return data


# ─── 5. ATS RESUME OPTIMIZER — Groq (FREE) ───────────────────────────────────
@app.post("/api/ats-optimize")
async def ats_optimize_resume(req: ATSRequest):
    """
    Analyzes resume text for ATS (Applicant Tracking System) compatibility.
    Gives a score, rewrites bullet points, and suggests keyword improvements.
    COMPLETELY FREE using existing Groq key.
    """
    system_prompt = (
        "You are an ATS optimization expert and professional resume writer. Analyze the resume "
        "for ATS compatibility and return JSON with: "
        "ats_score (number 0-100), "
        "grade (string: A+/A/B/C/D), "
        "keyword_score (number 0-100), "
        "formatting_score (number 0-100), "
        "content_score (number 0-100), "
        "missing_keywords (array of strings to add for the target role), "
        "present_keywords (array of strings already found), "
        "improved_bullet_points (array of strings, 4-5 rewritten bullet points that are ATS-optimized), "
        "red_flags (array of strings — things hurting ATS score), "
        "quick_wins (array of strings — 5 specific changes to make TODAY), "
        "summary (string, 2 sentences overall assessment)."
    )

    user_prompt = (
        f"Analyze this resume for the role: {req.target_role}\n\n"
        f"Resume text:\n{req.resume_text[:4000]}"
    )

    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt},
         {"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    data["target_role"] = req.target_role
    data["cost"] = "FREE — Powered by Groq LLaMA 3.3 70B"
    return data


# ─── 6. LINKEDIN PROFILE OPTIMIZER — Groq (FREE) ─────────────────────────────
@app.post("/api/linkedin-optimize")
async def optimize_linkedin_profile(req: LinkedInOptimizeRequest):
    """
    Rewrites and scores a LinkedIn 'About' section for maximum recruiter impact.
    COMPLETELY FREE using existing Groq key.
    """
    system_prompt = (
        "You are a LinkedIn optimization expert who has helped 10,000+ professionals get hired. "
        "Rewrite the LinkedIn About section to be more impactful, keyword-rich, and recruiter-friendly. "
        "Return JSON with: "
        "original_score (number 0-100), "
        "rewritten_about (string — new About section, 150-250 words), "
        "headline_suggestions (array of 3 strings — LinkedIn headline options), "
        "keywords_added (array of strings), "
        "improvement_areas (array of strings), "
        "summary (string, 1-2 sentences about what changed and why)."
    )

    user_prompt = (
        f"Target Role: {req.target_role}\n"
        f"Key Skills: {', '.join(req.skills[:10]) if req.skills else 'Not provided'}\n\n"
        f"Current LinkedIn About:\n{req.about_section}"
    )

    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt},
         {"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    data["cost"] = "FREE — Powered by Groq LLaMA 3.3 70B"
    return data


# ─── 7. SALARY INSIGHTS — AI-powered (FREE) ───────────────────────────────────
@app.get("/api/salary-insights")
async def get_salary_insights(role: str = "AI/ML Engineer", city: str = "Ahmedabad", experience: str = "fresher"):
    """
    Provides AI-generated salary insights for Gujarat IT jobs.
    Based on public market data patterns. COMPLETELY FREE.
    """
    system_prompt = (
        "You are a salary data analyst specializing in India's IT market, particularly Gujarat. "
        "Provide realistic salary insights and return JSON with: "
        "role (string), city (string), experience_level (string), "
        "salary_range_lpa (object with min and max in LPA — Lakhs Per Annum), "
        "median_lpa (number), "
        "fresher_lpa (object with min and max), "
        "experienced_lpa (object with min and max), "
        "top_paying_skills (array of strings), "
        "companies_paying_most (array of strings — real company names in Gujarat), "
        "negotiation_tips (array of 4 strings), "
        "market_trend (string: Growing/Stable/Declining), "
        "demand_level (string: High/Medium/Low), "
        "note (string — data disclaimer)."
    )

    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt},
         {"role": "user", "content": f"Salary insights for {role} in {city}, India. Experience: {experience}"}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    data["cost"] = "FREE — AI-powered salary estimation"
    data["disclaimer"] = "These are AI-estimated ranges based on public market data. Actual salaries vary by company and negotiation."
    return data


# ─── 8. TELEGRAM JOB ALERT (FREE) ────────────────────────────────────────────
@app.post("/api/subscribe-telegram")
async def subscribe_telegram_alerts(chat_id: str, skills: List[str], target_role: str):
    """
    Sends a welcome message to a Telegram chat ID with job match alerts.
    Uses free Telegram Bot API. Requires TELEGRAM_BOT_TOKEN in .env.
    """
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not bot_token:
        return {
            "status": "not_configured",
            "message": "Telegram bot not configured. Add TELEGRAM_BOT_TOKEN to .env file.",
            "instructions": "1. Open Telegram → Search @BotFather → /newbot → Get token → Add to .env"
        }

    message = (
        f"🎉 *Welcome to Comonk AI Job Alerts!*\n\n"
        f"You'll receive FREE job match notifications for:\n"
        f"🎯 Role: *{target_role}*\n"
        f"💡 Skills: {', '.join(skills[:5])}\n\n"
        f"_Powered by Comonk AI — 100% free career guidance_"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(
                f"https://api.telegram.org/bot{bot_token}/sendMessage",
                json={"chat_id": chat_id, "text": message, "parse_mode": "Markdown"}
            )
            if res.status_code == 200:
                return {"status": "sent", "message": "Welcome alert sent to Telegram!", "cost": "FREE"}
            else:
                return {"status": "error", "detail": res.text}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# BATCH 2 — MORE FREE FEATURES (NO API KEY NEEDED)
# ═══════════════════════════════════════════════════════════════════════════════

# ── Pydantic models ────────────────────────────────────────────────────────────
class GrammarCheckRequest(BaseModel):
    text: str
    language: str = "en-US"

class JDAnalyzeRequest(BaseModel):
    job_description: str
    user_skills: List[str] = []
    user_experience: str = ""
    user_name: str = "Candidate"

class CoverLetterRequest(BaseModel):
    job_description: str
    company_name: str
    user_name: str = "Candidate"
    user_skills: List[str] = []
    user_experience: str = ""
    target_role: str = "Software Developer"


# ── 9. MULTI-SOURCE JOBS ── Remotive + Arbeitnow + Himalayas (ALL FREE, No key) ─
@app.get("/api/all-jobs")
async def get_all_jobs(skills: str = "", limit: int = 20):
    """
    Aggregates remote tech jobs from 3 FREE sources:
    1. Remotive.com     — No key needed
    2. Arbeitnow.com    — No key needed
    3. Himalayas.app    — No key needed
    Returns unified list sorted by relevance.
    """
    skill_list = [s.strip().lower() for s in skills.split(",") if s.strip()] if skills else []
    all_jobs = []

    async with httpx.AsyncClient(timeout=15.0, headers={"User-Agent": "Comonk-AI/3.0 career-platform"}) as client:

        # ── Source 1: Remotive ────────────────────────────────────────────────
        try:
            query = skill_list[0] if skill_list else "developer"
            r = await client.get(f"https://remotive.com/api/remote-jobs?search={query}&limit=30")
            if r.status_code == 200:
                jobs = r.json().get("jobs", [])
                for j in jobs[:10]:
                    all_jobs.append({
                        "id": f"remotive_{j.get('id')}",
                        "title": j.get("title", ""),
                        "company": j.get("company_name", ""),
                        "company_logo": j.get("company_logo", ""),
                        "location": j.get("candidate_required_location", "Remote"),
                        "tags": j.get("tags", [])[:5],
                        "url": j.get("url", ""),
                        "salary": j.get("salary", "Not disclosed"),
                        "description_short": (j.get("description", "") or "")[:200],
                        "source": "Remotive",
                        "source_color": "#8b5cf6",
                        "date": j.get("publication_date", "")
                    })
        except Exception as e:
            print(f"Remotive error: {e}")

        # ── Source 2: Arbeitnow ───────────────────────────────────────────────
        try:
            r2 = await client.get("https://www.arbeitnow.com/api/job-board-api")
            if r2.status_code == 200:
                jobs2 = r2.json().get("data", [])
                filtered = []
                for j in jobs2:
                    job_text = f"{j.get('title','')} {j.get('description','')} {' '.join(j.get('tags',[]))}".lower()
                    if not skill_list or any(s in job_text for s in skill_list):
                        filtered.append(j)
                for j in filtered[:8]:
                    all_jobs.append({
                        "id": f"arbeitnow_{j.get('slug')}",
                        "title": j.get("title", ""),
                        "company": j.get("company_name", ""),
                        "company_logo": "",
                        "location": j.get("location", "Remote") or "Remote",
                        "tags": j.get("tags", [])[:5],
                        "url": j.get("url", ""),
                        "salary": "Not disclosed",
                        "description_short": (j.get("description", "") or "")[:200],
                        "source": "Arbeitnow",
                        "source_color": "#06b6d4",
                        "date": j.get("created_at", "")
                    })
        except Exception as e:
            print(f"Arbeitnow error: {e}")

        # ── Source 3: Himalayas ───────────────────────────────────────────────
        try:
            params = {"limit": 20}
            if skill_list:
                params["search"] = skill_list[0]
            r3 = await client.get("https://himalayas.app/jobs/api", params=params)
            if r3.status_code == 200:
                jobs3 = r3.json().get("jobs", [])
                for j in jobs3[:8]:
                    all_jobs.append({
                        "id": f"himalayas_{j.get('slug','')}",
                        "title": j.get("title", ""),
                        "company": j.get("companyName", ""),
                        "company_logo": j.get("companyLogo", ""),
                        "location": "Remote",
                        "tags": j.get("skills", [])[:5],
                        "url": f"https://himalayas.app/jobs/{j.get('slug','')}",
                        "salary": (j.get("salaryCurrency","") + " " + str(j.get("salaryMin","")) + "–" + str(j.get("salaryMax",""))) if j.get("salaryMin") else "Not disclosed",
                        "description_short": (j.get("description", "") or "")[:200],
                        "source": "Himalayas",
                        "source_color": "#10b981",
                        "date": j.get("createdAt", "")
                    })
        except Exception as e:
            print(f"Himalayas error: {e}")

    # Deduplicate by title+company
    seen = set()
    unique_jobs = []
    for j in all_jobs:
        key = f"{j['title'].lower()}_{j['company'].lower()}"
        if key not in seen:
            seen.add(key)
            unique_jobs.append(j)

    return {
        "jobs": unique_jobs[:limit],
        "total": len(unique_jobs[:limit]),
        "sources": ["Remotive (free)", "Arbeitnow (free)", "Himalayas (free)"],
        "cost": "FREE — 3 sources, no API keys needed"
    }


# ── 10. COMPANY INFO — Wikipedia REST API (FREE, No key) ─────────────────────
@app.get("/api/company-info/{company_name}")
async def get_company_info(company_name: str):
    """
    Fetches company background info from Wikipedia.
    COMPLETELY FREE — No API key required.
    Returns: summary, description, founding year, HQ, employee count.
    """
    clean_name = company_name.strip().replace(" ", "_")
    try:
        async with httpx.AsyncClient(timeout=10.0, headers={
            "User-Agent": "Comonk-AI-Career-Platform/3.0 (educational; contact@comonk.ai)"
        }) as client:
            # Try exact name first
            url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{clean_name}"
            res = await client.get(url)

            if res.status_code != 200:
                # Try search fallback
                search_url = f"https://en.wikipedia.org/w/api.php?action=opensearch&search={company_name}&limit=1&format=json"
                sr = await client.get(search_url)
                if sr.status_code == 200:
                    results = sr.json()
                    if results[1]:
                        title = results[1][0].replace(" ", "_")
                        res = await client.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}")

            if res.status_code == 200:
                data = res.json()
                return {
                    "company": company_name,
                    "title": data.get("title", company_name),
                    "summary": data.get("extract", "No description available."),
                    "description": data.get("description", ""),
                    "thumbnail": data.get("thumbnail", {}).get("source", ""),
                    "wikipedia_url": data.get("content_urls", {}).get("desktop", {}).get("page", ""),
                    "source": "Wikipedia (Free)",
                    "cost": "FREE — No API key"
                }
            else:
                return {
                    "company": company_name,
                    "summary": "No Wikipedia information found for this company.",
                    "source": "Wikipedia",
                    "cost": "FREE"
                }
    except Exception as e:
        return {"company": company_name, "summary": "Information unavailable.", "error": str(e)}


# ── 11. GRAMMAR CHECKER — LanguageTool API (FREE, No key, 20 req/min) ─────────
@app.post("/api/grammar-check")
async def grammar_check(req: GrammarCheckRequest):
    """
    Checks grammar, spelling, and style using LanguageTool public API.
    COMPLETELY FREE — No API key required. Limit: 20 requests/minute.
    Perfect for checking resume text, cold emails, cover letters.
    """
    if len(req.text) > 5000:
        req.text = req.text[:5000]

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            res = await client.post(
                "https://api.languagetool.org/v2/check",
                data={"text": req.text, "language": req.language},
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            if res.status_code != 200:
                return {"error": "Grammar check service unavailable", "matches": []}

            data = res.json()
            matches = data.get("matches", [])

            # Format results clearly
            issues = []
            for m in matches:
                issue = {
                    "message": m.get("message", ""),
                    "short_message": m.get("shortMessage", ""),
                    "context": m.get("context", {}).get("text", ""),
                    "offset": m.get("offset", 0),
                    "length": m.get("length", 0),
                    "type": m.get("rule", {}).get("issueType", "other"),
                    "category": m.get("rule", {}).get("category", {}).get("name", ""),
                    "replacements": [r.get("value","") for r in m.get("replacements", [])[:3]],
                }
                issues.append(issue)

            # Categorize
            spelling_issues = [i for i in issues if i["type"] == "misspelling"]
            grammar_issues = [i for i in issues if i["type"] in ("grammar", "typographical")]
            style_issues = [i for i in issues if i["type"] not in ("misspelling","grammar","typographical")]

            score = max(0, 100 - (len(issues) * 3))

            return {
                "score": score,
                "grade": "A+" if score >= 95 else "A" if score >= 88 else "B" if score >= 75 else "C" if score >= 60 else "D",
                "total_issues": len(issues),
                "spelling_count": len(spelling_issues),
                "grammar_count": len(grammar_issues),
                "style_count": len(style_issues),
                "issues": issues[:20],
                "summary": f"Found {len(issues)} issue(s). {'Great writing!' if score >= 90 else 'Needs improvement.' if score < 70 else 'Good, minor fixes needed.'}",
                "source": "LanguageTool (Free)",
                "cost": "FREE — No API key required"
            }
    except Exception as e:
        return {"error": str(e), "matches": [], "score": 0}


# ── 12. JOB DESCRIPTION ANALYZER — Groq (FREE with existing key) ──────────────
@app.post("/api/analyze-jd")
async def analyze_job_description(req: JDAnalyzeRequest):
    """
    Paste ANY job description → AI analyzes your fit score, gaps, and strategy.
    Uses existing Groq key — COMPLETELY FREE.
    """
    system_prompt = (
        "You are an expert career coach and job application strategist. "
        "Analyze the job description against the candidate's profile. "
        "Return JSON with: "
        "match_score (number 0-100), "
        "match_grade (string: Excellent/Good/Fair/Low), "
        "matching_skills (array of strings — skills candidate already has), "
        "missing_skills (array of strings — skills to learn), "
        "role_title (string — extracted role name from JD), "
        "company_name (string — if mentioned in JD), "
        "experience_required (string — e.g. '2-4 years'), "
        "key_responsibilities (array of 4 strings — main duties), "
        "how_to_standout (array of 4 strings — specific tips for this role), "
        "application_strategy (string — 2-3 sentence advice), "
        "red_flags (array of strings — any concerns about the role), "
        "salary_estimate_lpa (string — estimated salary in LPA for India), "
        "immediate_action (string — the ONE thing to do right now to get this job)."
    )

    user_prompt = (
        f"Candidate: {req.user_name}\n"
        f"Skills: {', '.join(req.user_skills) if req.user_skills else 'Not provided'}\n"
        f"Experience: {req.user_experience or 'Not provided'}\n\n"
        f"Job Description to analyze:\n{req.job_description[:3000]}"
    )

    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt},
         {"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    data["cost"] = "FREE — Powered by Groq LLaMA 3.3 70B"
    return data


# ── 13. COVER LETTER GENERATOR — Groq (FREE with existing key) ────────────────
@app.post("/api/cover-letter")
async def generate_cover_letter(req: CoverLetterRequest):
    """
    Generates a professional, personalized cover letter.
    Different from cold email — this is a formal job application letter.
    Uses Groq — COMPLETELY FREE.
    """
    system_prompt = (
        "You are a professional resume writer who has helped 50,000+ candidates get hired. "
        "Write a compelling, ATS-friendly cover letter that tells a story and stands out. "
        "Return JSON with: "
        "cover_letter (string — full cover letter, 300-400 words, professional format), "
        "subject_line (string — email subject when sending application), "
        "key_points_used (array of strings — what makes this letter strong), "
        "personalization_tips (array of 3 strings — how to customize further), "
        "word_count (number)."
    )

    user_prompt = (
        f"Write a cover letter for:\n"
        f"Candidate Name: {req.user_name}\n"
        f"Applying for: {req.target_role} at {req.company_name}\n"
        f"Key Skills: {', '.join(req.user_skills[:10]) if req.user_skills else 'Software Development'}\n"
        f"Experience: {req.user_experience or 'Entry level / Fresher'}\n\n"
        f"Job Description:\n{req.job_description[:2000]}\n\n"
        "Make it passionate, specific to the role, and end with a strong call to action."
    )

    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt},
         {"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    data["cost"] = "FREE — Powered by Groq LLaMA 3.3 70B"
    return data


# ── 14. TECH Q&A TRENDS — StackExchange API (FREE, No key for basic) ──────────
@app.get("/api/tech-trends")
async def get_tech_trends(skills: str = "python,javascript,ai", limit: int = 10):
    """
    Fetches trending tech questions from StackOverflow related to user's skills.
    StackExchange API is FREE — 300 requests/day without key, 10,000/day with key.
    Gives insight into what tech skills are in HIGH demand right now.
    """
    tags = [s.strip().lower().replace(" ", "-") for s in skills.split(",") if s.strip()][:3]
    all_questions = []

    async with httpx.AsyncClient(timeout=12.0) as client:
        for tag in tags:
            try:
                params = {
                    "order": "desc", "sort": "votes",
                    "tagged": tag, "site": "stackoverflow",
                    "pagesize": 5, "filter": "withbody"
                }
                res = await client.get("https://api.stackexchange.com/2.3/questions", params=params)
                if res.status_code == 200:
                    items = res.json().get("items", [])
                    for q in items[:4]:
                        all_questions.append({
                            "title": q.get("title",""),
                            "url": q.get("link",""),
                            "votes": q.get("score", 0),
                            "answers": q.get("answer_count", 0),
                            "views": q.get("view_count", 0),
                            "tags": q.get("tags", [])[:4],
                            "tag": tag,
                            "is_answered": q.get("is_answered", False)
                        })
            except Exception as e:
                print(f"StackOverflow error for {tag}: {e}")

        # Also get trending tags (skills in demand)
        trending_tags = []
        try:
            tr = await client.get(
                "https://api.stackexchange.com/2.3/tags",
                params={"order":"desc","sort":"popular","site":"stackoverflow","pagesize":20}
            )
            if tr.status_code == 200:
                trending_tags = [t.get("name","") for t in tr.json().get("items", [])[:20]]
        except Exception as e:
            print(f"Tags error: {e}")

    # Match user skills against trending tags
    matched_trending = []
    for tag in tags:
        for tt in trending_tags:
            if tag in tt or tt in tag:
                matched_trending.append({"skill": tag, "trending_name": tt, "status": "In Demand 🔥"})

    return {
        "questions": all_questions[:limit],
        "trending_skills": trending_tags[:15],
        "your_skills_trending": matched_trending,
        "source": "StackExchange API (Free)",
        "cost": "FREE — 300 req/day without key, uses existing Groq key"
    }


# ── 15. TECH NEWS — HackerNews + GNews (FREE / Free with key) ─────────────────
@app.get("/api/tech-news")
async def get_tech_news(query: str = "AI jobs India tech", limit: int = 12):
    """
    Fetches tech industry news from:
    1. HackerNews Algolia API — FREE, no key
    2. GNews API — FREE 100 req/day (needs GNEWS_API_KEY in .env)
    Shows hiring trends, startup funding, India tech scene.
    """
    articles = []
    gnews_key = os.getenv("GNEWS_API_KEY", "")
    async with httpx.AsyncClient(timeout=12.0) as client:

        # ── Source 1: HackerNews (always free, no key) ───────────────────────
        try:
            hn_url = f"https://hn.algolia.com/api/v1/search?query={query}&tags=story&hitsPerPage=8&numericFilters=points>10"
            r = await client.get(hn_url)
            if r.status_code == 200:
                hits = r.json().get("hits", [])
                for h in hits:
                    if h.get("url") and h.get("title"):
                        articles.append({
                            "title": h.get("title",""),
                            "url": h.get("url",""),
                            "description": f"👍 {h.get('points',0)} points · 💬 {h.get('num_comments',0)} comments",
                            "source": "HackerNews",
                            "source_color": "#f59e0b",
                            "published": h.get("created_at",""),
                            "type": "discussion"
                        })
        except Exception as e:
            print(f"HN error: {e}")

        # ── Source 2: GNews API (free with key, skip if no key) ──────────────
        if gnews_key:
            try:
                gnews_url = "https://gnews.io/api/v4/search"
                params = {
                    "q": "India tech jobs AI hiring 2024",
                    "lang": "en", "country": "in",
                    "max": 6, "apikey": gnews_key
                }
                r2 = await client.get(gnews_url, params=params)
                if r2.status_code == 200:
                    for art in r2.json().get("articles", []):
                        articles.append({
                            "title": art.get("title",""),
                            "url": art.get("url",""),
                            "description": art.get("description","")[:180],
                            "source": art.get("source",{}).get("name","GNews"),
                            "source_color": "#06b6d4",
                            "published": art.get("publishedAt",""),
                            "type": "news",
                            "image": art.get("image","")
                        })
            except Exception as e:
                print(f"GNews error: {e}")
        else:
            # Fallback: more HN with different queries
            for hn_query in ["India startup hiring", "Gujarat tech company"]:
                try:
                    r3 = await client.get(f"https://hn.algolia.com/api/v1/search?query={hn_query}&tags=story&hitsPerPage=4")
                    if r3.status_code == 200:
                        for h in r3.json().get("hits", []):
                            if h.get("url") and h.get("title"):
                                articles.append({
                                    "title": h.get("title",""),
                                    "url": h.get("url",""),
                                    "description": f"Points: {h.get('points',0)}",
                                    "source": "HackerNews",
                                    "source_color": "#f59e0b",
                                    "published": h.get("created_at",""),
                                    "type": "discussion"
                                })
                except Exception:
                    pass

    return {
        "articles": articles[:limit],
        "total": len(articles[:limit]),
        "sources_used": ["HackerNews Algolia (free)", "GNews (free tier with key)" if gnews_key else "HackerNews only (add GNEWS_API_KEY for more)"],
        "cost": "FREE — No credit card needed",
        "tip": "Add GNEWS_API_KEY=your_key to .env for 100 more news articles/day from Google News India"
    }


# ═══════════════════════════════════════════════════════════════════════════════
# BATCH 3 - CHEAT SHEETS + VISUAL ROADMAPS + FREE RESOURCES HUB
# ═══════════════════════════════════════════════════════════════════════════════

class CheatSheetRequest(BaseModel):
    technology: str
    level: str = "beginner"

class VisualRoadmapRequest(BaseModel):
    role: str
    experience_level: str = "fresher"
    current_skills: List[str] = []
    time_available: str = "3 months"

FREE_RESOURCES_DB = {
    "python": {"official_docs": "https://docs.python.org/3/", "free_courses": [{"name": "CS50P Harvard FREE", "url": "https://cs50.harvard.edu/python/2022/", "platform": "Harvard"}, {"name": "Automate Boring Stuff FREE Book", "url": "https://automatetheboringstuff.com", "platform": "Book"}, {"name": "freeCodeCamp Python 12hr", "url": "https://youtu.be/rfscVS0vtbw", "platform": "YouTube"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=python", "practice": "https://www.hackerrank.com/domains/python", "project_ideas": ["Web scraper", "Telegram bot", "REST API"]},
    "machine-learning": {"official_docs": "https://scikit-learn.org/stable/", "free_courses": [{"name": "Google ML Crash Course FREE", "url": "https://developers.google.com/machine-learning/crash-course", "platform": "Google"}, {"name": "Kaggle ML FREE", "url": "https://www.kaggle.com/learn", "platform": "Kaggle"}, {"name": "Fast.ai Practical DL", "url": "https://course.fast.ai", "platform": "fast.ai"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=machine+learning", "practice": "https://www.kaggle.com/competitions", "project_ideas": ["Image classifier", "Sentiment analyzer", "Price predictor"]},
    "javascript": {"official_docs": "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "free_courses": [{"name": "freeCodeCamp JS FREE", "url": "https://www.freecodecamp.org/learn", "platform": "freeCodeCamp"}, {"name": "javascript.info FREE", "url": "https://javascript.info", "platform": "javascript.info"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=javascript", "practice": "https://www.codewars.com", "project_ideas": ["Portfolio", "Todo app", "Weather app"]},
    "sql": {"official_docs": "https://www.postgresql.org/docs/", "free_courses": [{"name": "SQLBolt Interactive", "url": "https://sqlbolt.com", "platform": "SQLBolt"}, {"name": "CS50 SQL Harvard FREE", "url": "https://cs50.harvard.edu/sql/2024/", "platform": "Harvard"}, {"name": "Kaggle SQL FREE", "url": "https://www.kaggle.com/learn/intro-to-sql", "platform": "Kaggle"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=sql", "practice": "https://www.hackerrank.com/domains/sql", "project_ideas": ["Library system", "Sales analytics"]},
    "docker": {"official_docs": "https://docs.docker.com/get-started/", "free_courses": [{"name": "Docker Official Docs", "url": "https://docs.docker.com/get-started/", "platform": "Docker"}, {"name": "TechWorld Nana Docker", "url": "https://youtu.be/3c-iBn73dDE", "platform": "YouTube"}, {"name": "Play with Docker", "url": "https://labs.play-with-docker.com", "platform": "PWD"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=docker", "practice": "https://labs.play-with-docker.com", "project_ideas": ["Containerize Flask", "CI/CD pipeline"]},
    "git": {"official_docs": "https://git-scm.com/doc", "free_courses": [{"name": "Learn Git Branching Interactive", "url": "https://learngitbranching.js.org", "platform": "Interactive"}, {"name": "Pro Git Book FREE", "url": "https://git-scm.com/book/en/v2", "platform": "git-scm"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=git", "practice": "https://github.com", "project_ideas": ["Open source contribution", "GitHub Pages"]},
    "langchain": {"official_docs": "https://python.langchain.com", "free_courses": [{"name": "LangChain DeepLearning.AI FREE", "url": "https://learn.deeplearning.ai/langchain", "platform": "DeepLearning.AI"}, {"name": "LangGraph Tutorial", "url": "https://langchain-ai.github.io/langgraph/tutorials/introduction/", "platform": "LangGraph"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=langchain", "practice": "https://smith.langchain.com", "project_ideas": ["RAG chatbot", "AI agent", "Multi-agent system"]},
    "data-structures": {"official_docs": "https://docs.python.org/3/tutorial/datastructures.html", "free_courses": [{"name": "NeetCode Roadmap", "url": "https://neetcode.io/roadmap", "platform": "NeetCode"}, {"name": "MIT Algorithms FREE", "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", "platform": "MIT OCW"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=data+structures", "practice": "https://leetcode.com", "project_ideas": ["Implement stack/queue", "LRU Cache", "Graph algorithms"]},
    "react": {"official_docs": "https://react.dev", "free_courses": [{"name": "React Official Tutorial FREE", "url": "https://react.dev/learn", "platform": "React.dev"}, {"name": "Full Stack Open FREE Uni Helsinki", "url": "https://fullstackopen.com/en/", "platform": "Helsinki"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=react", "practice": "https://codesandbox.io", "project_ideas": ["Dashboard", "E-commerce frontend"]},
    "fastapi": {"official_docs": "https://fastapi.tiangolo.com", "free_courses": [{"name": "FastAPI Official Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "platform": "FastAPI"}, {"name": "FastAPI Full Course YouTube", "url": "https://youtu.be/0sOvCWFmrtA", "platform": "YouTube"}], "cheat_sheet_url": "https://cheatography.com/explore/search/?q=fastapi", "practice": "https://replit.com", "project_ideas": ["REST API", "Auth system", "WebSocket chat"]},
}


@app.post("/api/cheat-sheet")
async def generate_cheat_sheet(req: CheatSheetRequest):
    """AI generates complete, practical cheat sheet for ANY technology. FREE."""
    system_prompt = (
        "You are a senior developer creating the world's best programming cheat sheets. "
        "Provide a high-quality summary of syntax, basic commands, and code snippets. "
        "Return JSON with: technology (string), tagline (string - one catchy line), level (string), "
        "sections (array of 5 objects, each with: title, emoji, items array of 5 objects with key/syntax/description/example), "
        "pro_tips (array 5 strings), common_mistakes (array 4 strings), "
        "one_liners (array 6 objects: command/does), quick_install (string), color_theme (string hex)."
    )
    user_prompt = f"Create a {req.level} cheat sheet for: {req.technology}. Practical copy-paste ready code. Include most-used commands."
    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    tech_key = req.technology.lower().replace(" ", "-")
    data["free_resources"] = FREE_RESOURCES_DB.get(tech_key, {
        "official_docs": f"https://devdocs.io/{tech_key}",
        "cheat_sheet_url": f"https://cheatography.com/explore/search/?q={req.technology}",
        "free_courses": [
            {"name": f"{req.technology} freeCodeCamp", "url": f"https://www.freecodecamp.org/news/tag/{tech_key}/", "platform": "freeCodeCamp"},
            {"name": f"{req.technology} YouTube Free Full Course", "url": f"https://www.youtube.com/results?search_query={req.technology}+full+course+free", "platform": "YouTube"},
        ]
    })
    data["cost"] = "FREE - AI Generated + Curated Free Resources"
    return data


@app.post("/api/visual-roadmap")
async def generate_visual_roadmap(req: VisualRoadmapRequest):
    """Generates detailed node-based visual career roadmap. FREE with Groq."""
    system_prompt = (
        "You are a senior software architect and career mentor. Create a detailed visual career roadmap. "
        "In the nodes, you must recommend relevant learning guides from https://roadmap.sh/ (for example: "
        "https://roadmap.sh/python, https://roadmap.sh/ai-data-scientist, https://roadmap.sh/frontend, etc.) "
        "where appropriate in the free_resource URLs. "
        "Return JSON with: role, total_duration, overview (string 2 sentences), "
        "phases (array of 4-5 objects: phase_number, phase_name, duration, emoji, color hex, description, "
        "  nodes array of 4-6 objects: id, name, type (core/optional/advanced), priority (must-know/good-to-have/bonus), "
        "    estimated_days, description, free_resource (real URL), subtopics (array 3 strings)), "
        "milestones (array 4: week/achievement/proof), "
        "final_project (object: name/description/tech_stack array/github_template string), "
        "job_ready_checklist (array 8 strings), salary_after_roadmap (string LPA India)."
    )
    skills_str = ", ".join(req.current_skills) if req.current_skills else "None / Starting fresh"
    user_prompt = (
        f"Visual roadmap for: {req.role}\n"
        f"Experience: {req.experience_level}\n"
        f"Current skills: {skills_str}\n"
        f"Time available: {req.time_available}\n"
        "Use real tools and real free URLs. Be very specific."
    )
    llm_response = await call_llm(
        [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"}
    )
    data = json.loads(llm_response)
    data["cost"] = "FREE - Groq LLaMA 3.3 70B"
    return data


@app.get("/api/free-resources")
async def get_free_resources(technology: str = "python"):
    """Curated free resources + live GitHub repos + StackOverflow. No key needed."""
    tech_key = technology.lower().replace(" ", "-")
    curated = FREE_RESOURCES_DB.get(tech_key)
    github_repos, so_questions = [], []

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            github_token = os.getenv("GITHUB_TOKEN", "")
            headers = {"Accept": "application/vnd.github.v3+json"}
            if github_token:
                headers["Authorization"] = f"token {github_token}"
            r = await client.get(
                "https://api.github.com/search/repositories",
                params={"q": f"{technology} tutorial awesome", "sort": "stars", "per_page": 6},
                headers=headers
            )
            if r.status_code == 200:
                for repo in r.json().get("items", [])[:6]:
                    github_repos.append({
                        "name": repo["full_name"],
                        "description": (repo.get("description") or "")[:120],
                        "stars": repo.get("stargazers_count", 0),
                        "url": repo["html_url"],
                        "topics": repo.get("topics", [])[:4]
                    })
        except Exception:
            pass
        try:
            r2 = await client.get(
                "https://api.stackexchange.com/2.3/questions",
                params={"order": "desc", "sort": "votes", "tagged": tech_key, "site": "stackoverflow", "pagesize": 5}
            )
            if r2.status_code == 200:
                for q in r2.json().get("items", [])[:5]:
                    so_questions.append({
                        "title": q["title"], "url": q["link"],
                        "votes": q.get("score", 0), "answers": q.get("answer_count", 0)
                    })
        except Exception:
            pass

    return {
        "technology": technology,
        "curated_resources": curated,
        "standard_free_platforms": [
            {"name": f"{technology} freeCodeCamp", "url": f"https://www.freecodecamp.org/news/tag/{tech_key}/", "platform": "freeCodeCamp"},
            {"name": f"{technology} Dev.to articles", "url": f"https://dev.to/t/{tech_key}", "platform": "Dev.to"},
            {"name": f"{technology} YouTube FREE", "url": f"https://www.youtube.com/results?search_query={technology}+full+course+free", "platform": "YouTube"},
            {"name": f"{technology} Cheatography Sheets", "url": f"https://cheatography.com/explore/search/?q={technology}", "platform": "Cheatography.com"},
            {"name": f"{technology} Roadmap.sh Guidance", "url": f"https://roadmap.sh/search?q={technology}", "platform": "Roadmap.sh"},
        ],
        "github_repos": github_repos,
        "top_stackoverflow_questions": so_questions,
        "cost": "FREE - curated DB + GitHub API + StackExchange"
    }


@app.get("/api/cheat-sheet-topics")
async def get_cheat_sheet_topics():
    """All supported cheat sheet topics."""
    return {
        "categories": {
            "AI & Machine Learning": [
                {"name": "Python", "icon": "🐍", "color": "#3776ab", "popularity": 98},
                {"name": "Machine Learning", "icon": "🤖", "color": "#ff6f00", "popularity": 95},
                {"name": "TensorFlow", "icon": "🧠", "color": "#ff6f00", "popularity": 88},
                {"name": "LangChain", "icon": "⛓️", "color": "#1c3c3c", "popularity": 82},
                {"name": "Pandas", "icon": "🐼", "color": "#130754", "popularity": 90},
                {"name": "NumPy", "icon": "🔢", "color": "#4dabcf", "popularity": 89},
                {"name": "Scikit-Learn", "icon": "📊", "color": "#f89939", "popularity": 86},
            ],
            "Web Development": [
                {"name": "JavaScript", "icon": "⚡", "color": "#f7df1e", "popularity": 96},
                {"name": "React", "icon": "⚛️", "color": "#61dafb", "popularity": 92},
                {"name": "Node.js", "icon": "🟢", "color": "#339933", "popularity": 89},
                {"name": "FastAPI", "icon": "🚀", "color": "#009688", "popularity": 84},
                {"name": "HTML", "icon": "🌐", "color": "#e34f26", "popularity": 95},
                {"name": "CSS", "icon": "🎨", "color": "#1572b6", "popularity": 93},
                {"name": "TypeScript", "icon": "📘", "color": "#3178c6", "popularity": 88},
                {"name": "Vue.js", "icon": "💚", "color": "#42b883", "popularity": 79},
            ],
            "DevOps & Tools": [
                {"name": "Docker", "icon": "🐳", "color": "#2496ed", "popularity": 88},
                {"name": "Git", "icon": "🌿", "color": "#f05032", "popularity": 97},
                {"name": "Linux", "icon": "🐧", "color": "#fcc624", "popularity": 86},
                {"name": "Kubernetes", "icon": "☸️", "color": "#326ce5", "popularity": 78},
                {"name": "AWS", "icon": "☁️", "color": "#ff9900", "popularity": 85},
            ],
            "Databases": [
                {"name": "SQL", "icon": "🗄️", "color": "#336791", "popularity": 91},
                {"name": "MongoDB", "icon": "🍃", "color": "#47a248", "popularity": 80},
                {"name": "PostgreSQL", "icon": "🐘", "color": "#336791", "popularity": 83},
                {"name": "Redis", "icon": "🔴", "color": "#dc382d", "popularity": 76},
            ],
            "Interview Prep": [
                {"name": "Data Structures", "icon": "🏗️", "color": "#8b5cf6", "popularity": 94},
                {"name": "Algorithms", "icon": "⚙️", "color": "#06b6d4", "popularity": 93},
                {"name": "System Design", "icon": "🏛️", "color": "#10b981", "popularity": 87},
                {"name": "Dynamic Programming", "icon": "🧩", "color": "#f59e0b", "popularity": 85},
            ]
        },
        "total_topics": 26,
        "cost": "FREE - AI generates fresh cheat sheet for any topic instantly"
    }
