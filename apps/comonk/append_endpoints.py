"""Script to append cheat sheet / roadmap / free resources endpoints to main.py"""
import os

new_code = r'''

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
    "python": {"official_docs": "https://docs.python.org/3/", "free_courses": [{"name": "CS50P Harvard FREE", "url": "https://cs50.harvard.edu/python/2022/", "platform": "Harvard"}, {"name": "Automate Boring Stuff FREE Book", "url": "https://automatetheboringstuff.com", "platform": "Book"}, {"name": "freeCodeCamp Python 12hr", "url": "https://youtu.be/rfscVS0vtbw", "platform": "YouTube"}], "cheat_sheet_url": "https://quickref.me/python", "practice": "https://www.hackerrank.com/domains/python", "project_ideas": ["Web scraper", "Telegram bot", "REST API"]},
    "machine-learning": {"official_docs": "https://scikit-learn.org/stable/", "free_courses": [{"name": "Google ML Crash Course FREE", "url": "https://developers.google.com/machine-learning/crash-course", "platform": "Google"}, {"name": "Kaggle ML FREE", "url": "https://www.kaggle.com/learn", "platform": "Kaggle"}, {"name": "Fast.ai Practical DL", "url": "https://course.fast.ai", "platform": "fast.ai"}], "cheat_sheet_url": "https://ml-cheatsheet.readthedocs.io", "practice": "https://www.kaggle.com/competitions", "project_ideas": ["Image classifier", "Sentiment analyzer", "Price predictor"]},
    "javascript": {"official_docs": "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "free_courses": [{"name": "freeCodeCamp JS FREE", "url": "https://www.freecodecamp.org/learn", "platform": "freeCodeCamp"}, {"name": "javascript.info FREE", "url": "https://javascript.info", "platform": "javascript.info"}], "cheat_sheet_url": "https://quickref.me/javascript", "practice": "https://www.codewars.com", "project_ideas": ["Portfolio", "Todo app", "Weather app"]},
    "sql": {"official_docs": "https://www.postgresql.org/docs/", "free_courses": [{"name": "SQLBolt Interactive", "url": "https://sqlbolt.com", "platform": "SQLBolt"}, {"name": "CS50 SQL Harvard FREE", "url": "https://cs50.harvard.edu/sql/2024/", "platform": "Harvard"}, {"name": "Kaggle SQL FREE", "url": "https://www.kaggle.com/learn/intro-to-sql", "platform": "Kaggle"}], "cheat_sheet_url": "https://quickref.me/mysql", "practice": "https://www.hackerrank.com/domains/sql", "project_ideas": ["Library system", "Sales analytics"]},
    "docker": {"official_docs": "https://docs.docker.com/get-started/", "free_courses": [{"name": "Docker Official Docs", "url": "https://docs.docker.com/get-started/", "platform": "Docker"}, {"name": "TechWorld Nana Docker", "url": "https://youtu.be/3c-iBn73dDE", "platform": "YouTube"}, {"name": "Play with Docker", "url": "https://labs.play-with-docker.com", "platform": "PWD"}], "cheat_sheet_url": "https://quickref.me/docker", "practice": "https://labs.play-with-docker.com", "project_ideas": ["Containerize Flask", "CI/CD pipeline"]},
    "git": {"official_docs": "https://git-scm.com/doc", "free_courses": [{"name": "Learn Git Branching Interactive", "url": "https://learngitbranching.js.org", "platform": "Interactive"}, {"name": "Pro Git Book FREE", "url": "https://git-scm.com/book/en/v2", "platform": "git-scm"}], "cheat_sheet_url": "https://quickref.me/git", "practice": "https://github.com", "project_ideas": ["Open source contribution", "GitHub Pages"]},
    "langchain": {"official_docs": "https://python.langchain.com", "free_courses": [{"name": "LangChain DeepLearning.AI FREE", "url": "https://learn.deeplearning.ai/langchain", "platform": "DeepLearning.AI"}, {"name": "LangGraph Tutorial", "url": "https://langchain-ai.github.io/langgraph/tutorials/introduction/", "platform": "LangGraph"}], "cheat_sheet_url": "https://python.langchain.com/docs", "practice": "https://smith.langchain.com", "project_ideas": ["RAG chatbot", "AI agent", "Multi-agent system"]},
    "data-structures": {"official_docs": "https://docs.python.org/3/tutorial/datastructures.html", "free_courses": [{"name": "NeetCode Roadmap", "url": "https://neetcode.io/roadmap", "platform": "NeetCode"}, {"name": "MIT Algorithms FREE", "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", "platform": "MIT OCW"}], "cheat_sheet_url": "https://www.bigocheatsheet.com", "practice": "https://leetcode.com", "project_ideas": ["Implement stack/queue", "LRU Cache", "Graph algorithms"]},
    "react": {"official_docs": "https://react.dev", "free_courses": [{"name": "React Official Tutorial FREE", "url": "https://react.dev/learn", "platform": "React.dev"}, {"name": "Full Stack Open FREE Uni Helsinki", "url": "https://fullstackopen.com/en/", "platform": "Helsinki"}], "cheat_sheet_url": "https://devhints.io/react", "practice": "https://codesandbox.io", "project_ideas": ["Dashboard", "E-commerce frontend"]},
    "fastapi": {"official_docs": "https://fastapi.tiangolo.com", "free_courses": [{"name": "FastAPI Official Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "platform": "FastAPI"}, {"name": "FastAPI Full Course YouTube", "url": "https://youtu.be/0sOvCWFmrtA", "platform": "YouTube"}], "cheat_sheet_url": "https://devhints.io/python", "practice": "https://replit.com", "project_ideas": ["REST API", "Auth system", "WebSocket chat"]},
}


@app.post("/api/cheat-sheet")
async def generate_cheat_sheet(req: CheatSheetRequest):
    """AI generates complete, practical cheat sheet for ANY technology. FREE."""
    system_prompt = (
        "You are a senior developer creating the world's best programming cheat sheets. "
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
        "cheat_sheet_url": f"https://quickref.me/{tech_key}",
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
            {"name": f"{technology} QuickRef Cheatsheet", "url": f"https://quickref.me/{tech_key}", "platform": "QuickRef.me"},
            {"name": f"{technology} Kaggle Learn", "url": "https://www.kaggle.com/learn", "platform": "Kaggle"},
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
'''

with open('main.py', 'a', encoding='utf-8') as f:
    f.write(new_code)

print('SUCCESS: 4 new endpoints added to main.py')
print('Endpoints: /api/cheat-sheet, /api/visual-roadmap, /api/free-resources, /api/cheat-sheet-topics')
