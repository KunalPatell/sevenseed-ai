import requests
import json
import os

API_BASE = "http://localhost:8000"
CV_PATH = r"c:\Users\Capermint\Project\Portfolio\Kunal_Patell_CV2.pdf"

def run_tests():
    print("=== Testing FastAPI & LangGraph Endpoints ===")
    
    # 1. Test Parse Resume
    print(f"\n1. Testing /api/parse-resume with: {CV_PATH}")
    if not os.path.exists(CV_PATH):
        print(f"Error: {CV_PATH} does not exist. Skipping parse test.")
        profile = {
            "name": "Kunal Patel",
            "skills": ["Python", "Machine Learning", "Data Analysis", "FastAPI"],
            "experience": "1 year as ML Intern",
            "education": "B.Tech in Computer Science"
        }
    else:
        with open(CV_PATH, "rb") as f:
            files = {"file": ("Kunal_Patell_CV2.pdf", f, "application/pdf")}
            response = requests.post(f"{API_BASE}/api/parse-resume", files=files)
        
        if response.status_code == 200:
            profile = response.json()
            print("Successfully parsed resume!")
            print(json.dumps(profile, indent=2))
        else:
            print(f"Failed to parse resume: {response.status_code} - {response.text}")
            return

    # 2. Test LangGraph Chatbot with matching tool
    print("\n2. Testing /api/chat (LangGraph Agent Guidance & RAG Matching)")
    chat_payload = {
        "messages": [
            {"role": "user", "content": "Hello, I want to find AI/ML jobs in Ahmedabad. Which companies match my Python skills?"}
        ],
        "profile": profile
    }
    
    response = requests.post(f"{API_BASE}/api/chat", json=chat_payload)
    if response.status_code == 200:
        print("Successfully received LangGraph response:")
        print("-" * 60)
        print(response.json()["response"])
        print("-" * 60)
    else:
        print(f"Chatbot failed: {response.status_code} - {response.text}")
        return

    # 3. Test Email Outreach Draft
    print("\n3. Testing /api/draft-email")
    email_payload = {
        "company_id": 1, # First company in DB
        "user_name": profile.get("name", "Kunal Patel"),
        "user_skills": profile.get("skills", []),
        "user_experience": profile.get("experience", ""),
        "target_role": "AI/ML Engineer"
    }
    
    response = requests.post(f"{API_BASE}/api/draft-email", json=email_payload)
    if response.status_code == 200:
        print("Successfully generated email draft:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Email draft failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    run_tests()
