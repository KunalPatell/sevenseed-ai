# -*- coding: utf-8 -*-
"""
Rakshak AI - Mock Data Store
All data here is FAKE / for demo purposes only. No real police records.
"""

# ---------------------------------------------------------------------------
# Police stations across Ahmedabad (mock coordinates + services)
# ---------------------------------------------------------------------------
POLICE_STATIONS = [
    {
        "name": "Satellite Police Station",
        "area": "Satellite",
        "address": "Jodhpur Cross Road, Satellite, Ahmedabad",
        "phone": "079-2692-1100",
        "distance_km": 1.2,
        "services": ["FIR", "Cyber Cell", "Women Help Desk"],
        "open": "24x7",
        "lat": 23.0305,
        "lng": 72.5178,
    },
    {
        "name": "SG Highway Police Station",
        "area": "SG Highway",
        "address": "Sarkhej-Gandhinagar Highway, Ahmedabad",
        "phone": "079-2970-2200",
        "distance_km": 2.8,
        "services": ["FIR", "Traffic", "Patrol Unit"],
        "open": "24x7",
        "lat": 23.0286,
        "lng": 72.5065,
    },
    {
        "name": "Navrangpura Police Station",
        "area": "Navrangpura",
        "address": "Near Law Garden, Navrangpura, Ahmedabad",
        "phone": "079-2644-3300",
        "distance_km": 3.5,
        "services": ["FIR", "Women Help Desk", "Lost & Found"],
        "open": "24x7",
        "lat": 23.0350,
        "lng": 72.5600,
    },
    {
        "name": "Maninagar Police Station",
        "area": "Maninagar",
        "address": "Maninagar Cross Road, Ahmedabad",
        "phone": "079-2546-4400",
        "distance_km": 6.1,
        "services": ["FIR", "Cyber Cell"],
        "open": "24x7",
        "lat": 22.9975,
        "lng": 72.6105,
    },
    {
        "name": "Cyber Crime Cell - Ahmedabad",
        "area": "Gaekwad Haveli",
        "address": "Police Bhavan, Gaekwad Haveli, Ahmedabad",
        "phone": "079-2563-9100",
        "distance_km": 7.4,
        "services": ["Cybercrime", "Financial Fraud", "Social Media Abuse"],
        "open": "Mon-Sat 9am-6pm",
        "lat": 23.0180,
        "lng": 72.5930,
    },
    {
        "name": "Women Help Center - Abhayam",
        "area": "Paldi",
        "address": "Abhayam 181 Center, Paldi, Ahmedabad",
        "phone": "181",
        "distance_km": 4.0,
        "services": ["Women Safety", "Counselling", "Emergency Rescue"],
        "open": "24x7",
        "lat": 23.0145,
        "lng": 72.5615,
    },
]

# ---------------------------------------------------------------------------
# Emergency contacts
# ---------------------------------------------------------------------------
EMERGENCY_CONTACTS = [
    {"label": "Police Control Room", "number": "100", "icon": "shield"},
    {"label": "Emergency (All-in-one)", "number": "112", "icon": "alert"},
    {"label": "Women Helpline (Abhayam)", "number": "181", "icon": "woman"},
    {"label": "Ambulance", "number": "108", "icon": "ambulance"},
    {"label": "Cyber Crime Helpline", "number": "1930", "icon": "laptop"},
    {"label": "Fire Brigade", "number": "101", "icon": "fire"},
    {"label": "Child Helpline", "number": "1098", "icon": "child"},
    {"label": "Traffic Helpline", "number": "1095", "icon": "traffic"},
]

# ---------------------------------------------------------------------------
# Analytics dashboard data (mock)
# ---------------------------------------------------------------------------
ANALYTICS = {
    "counters": {
        "total_complaints": 1284,
        "fir_generated": 932,
        "emergency_requests": 147,
        "cybercrime_reports": 318,
        "avg_response_min": 6.4,
        "citizen_satisfaction": 92,
    },
    "weekly_trend": [
        {"day": "Mon", "complaints": 142, "emergencies": 18},
        {"day": "Tue", "complaints": 168, "emergencies": 22},
        {"day": "Wed", "complaints": 155, "emergencies": 19},
        {"day": "Thu", "complaints": 201, "emergencies": 27},
        {"day": "Fri", "complaints": 224, "emergencies": 31},
        {"day": "Sat", "complaints": 198, "emergencies": 24},
        {"day": "Sun", "complaints": 196, "emergencies": 6},
    ],
    "crime_categories": [
        {"label": "Cybercrime", "value": 318, "color": "#38bdf8"},
        {"label": "Theft", "value": 274, "color": "#818cf8"},
        {"label": "Traffic", "value": 221, "color": "#34d399"},
        {"label": "Harassment", "value": 168, "color": "#fbbf24"},
        {"label": "Missing Person", "value": 96, "color": "#f472b6"},
        {"label": "Others", "value": 207, "color": "#94a3b8"},
    ],
    "area_hotspots": [
        {"area": "SG Highway", "level": 82},
        {"area": "Maninagar", "level": 64},
        {"area": "Satellite", "level": 58},
        {"area": "Navrangpura", "level": 47},
        {"area": "Bopal", "level": 39},
    ],
}

# ---------------------------------------------------------------------------
# Knowledge base (RAG-style FAQ snippets)
# ---------------------------------------------------------------------------
KNOWLEDGE_BASE = {
    "fir_process": (
        "To file an FIR: visit your nearest police station, provide details of the "
        "incident (what, when, where), and the duty officer will register it. You "
        "are entitled to a free copy of the FIR. You can also use Rakshak AI to "
        "auto-generate a structured FIR draft before visiting."
    ),
    "cyber_fraud": (
        "For any financial cyber fraud, call 1930 within the 'golden hour' to freeze "
        "the transaction. Also file a report at cybercrime.gov.in. Do NOT share OTPs, "
        "PINs, or passwords with anyone."
    ),
    "lost_document": (
        "For a lost document (license, Aadhaar, etc.), file a 'Lost Report' at the "
        "nearest station. This is not an FIR but an official acknowledgement used to "
        "apply for a duplicate."
    ),
    "traffic_challan": (
        "Pay e-challans online via the Gujarat Police e-challan portal or echallan.parivahan.gov.in. "
        "You will need your vehicle number and challan number."
    ),
}


# ---------------------------------------------------------------------------
# Officer Profiles (Resumes for matching)
# ---------------------------------------------------------------------------
OFFICER_PROFILES = [
    {
        "name": "Insp. R. Patel",
        "rank": "Inspector",
        "specialization": "Vehicle Theft",
        "languages": ["English", "Hindi", "Gujarati"],
        "experience_years": 12,
        "active_cases": 2,
        "solved_cases": 142,
        "station": "Satellite Police Station",
        "skills": ["Local intelligence", "Vehicle tracking", "CCTV surveillance coordination"],
        "bio": "12 years of experience in Ahmedabad City Police. Specializes in tracking stolen vehicles and dismantling local vehicle theft gangs. Expert in coordinating with local networks."
    },
    {
        "name": "SI K. Desai",
        "rank": "Sub-Inspector",
        "specialization": "Cyber Fraud",
        "languages": ["English", "Hindi", "Gujarati"],
        "experience_years": 4,
        "active_cases": 1,
        "solved_cases": 35,
        "station": "Cyber Crime Cell - Ahmedabad",
        "skills": ["Digital forensics", "UPI/Banking transaction reversal", "Phishing analysis"],
        "bio": "B.Tech in Computer Science, joined police department as specialized cyber cell sub-inspector. Expert in digital forensics, tracing financial transactions and coordinating with banks for recovery."
    },
    {
        "name": "Insp. M. Shah",
        "rank": "Inspector",
        "specialization": "Burglary / House Break-in",
        "languages": ["Hindi", "Gujarati"],
        "experience_years": 15,
        "active_cases": 5,
        "solved_cases": 210,
        "station": "Satellite Police Station",
        "skills": ["Forensics coordination", "Informant networks", "Fingerprint analysis"],
        "bio": "Senior Inspector specializing in property disputes and burglary. Strong network of local informants and high success rate in recovery of stolen jewellery/cash."
    },
    {
        "name": "SI A. Chauhan",
        "rank": "Sub-Inspector",
        "specialization": "Assault / Harassment",
        "languages": ["English", "Hindi", "Gujarati"],
        "experience_years": 5,
        "active_cases": 3,
        "solved_cases": 62,
        "station": "SG Highway Police Station",
        "skills": ["Mediation", "Conflict resolution", "Physical evidence collection"],
        "bio": "Five years in service, deals with physical disputes, street fights, and local law and order situations. Skilled in peaceful resolution and community policing."
    },
    {
        "name": "Insp. P. Solanki",
        "rank": "Inspector",
        "specialization": "Assault / Harassment",
        "languages": ["English", "Hindi", "Gujarati"],
        "experience_years": 9,
        "active_cases": 2,
        "solved_cases": 98,
        "station": "Women Help Center - Abhayam",
        "skills": ["Crisis intervention", "Victim counselling", "Legal aid coordination"],
        "bio": "Inspector leading the Women Help Desk. Expert in domestic violence mediation, harassment complaints, and cyberbullying of women. Highly rated for victim-first approach."
    },
    {
        "name": "SI N. Rathod",
        "rank": "Sub-Inspector",
        "specialization": "Missing Person",
        "languages": ["Hindi", "Gujarati"],
        "experience_years": 6,
        "active_cases": 4,
        "solved_cases": 88,
        "station": "Navrangpura Police Station",
        "skills": ["Search operations", "Inter-state police coordination", "Social media tracing"],
        "bio": "Dedicated Sub-Inspector specializing in locating missing adults and children. Works closely with rescue NGOs and coordinates inter-state search networks."
    }
]

# ---------------------------------------------------------------------------
# BNS Laws (Bharatiya Nyaya Sanhita 2023) Database for RAG
# ---------------------------------------------------------------------------
BNS_LAWS = [
    {
        "section": "BNS §303",
        "title": "Theft",
        "description": "Punishment for theft. Whoever commits theft shall be punished with imprisonment for a term which may extend to three years, or with fine, or with both, and in the case of a second or subsequent conviction, with rigorous imprisonment.",
        "ipc_equivalent": "IPC Section 379",
        "keywords": ["theft", "steal", "stolen", "took away", "purse", "wallet", "money", "bike", "cycle", "mobile", "phone", "scooter"]
    },
    {
        "section": "BNS §304",
        "title": "Snatching",
        "description": "Theft is 'snatching' if the offender, in order to commit theft, suddenly or quickly or forcibly seizes or secures or grabs or takes away from any person or from his possession any moveable property. Punishable with up to three years imprisonment.",
        "ipc_equivalent": "IPC Section 356 / 379 (Modified)",
        "keywords": ["snatch", "snatched", "chain", "purse snatching", "grabbed", "ran away with"]
    },
    {
        "section": "BNS §305",
        "title": "Theft in a dwelling house, etc.",
        "description": "Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or for the custody of property, shall be punished with imprisonment for a term which may extend to seven years and shall also be liable to fine.",
        "ipc_equivalent": "IPC Section 380",
        "keywords": ["house", "dwelling", "shop", "broke into", "burglary", "room", "home", "inside house", "lock break"]
    },
    {
        "section": "BNS §318",
        "title": "Cheating",
        "description": "Whoever cheats shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
        "ipc_equivalent": "IPC Section 420",
        "keywords": ["cheat", "cheated", "fraud", "scam", "investment", "double money", "trading", "lottery"]
    },
    {
        "section": "BNS §319",
        "title": "Cheating by personation",
        "description": "A person is said to cheat by personation if he cheats by pretending to be some other person, or by knowingly substituting one person for another, or representing that he or any other person is a person other than he or such other person really is.",
        "ipc_equivalent": "IPC Section 419",
        "keywords": ["personation", "impersonate", "fake officer", "pretending", "fake call", "bank officer", "policeman"]
    },
    {
        "section": "BNS §115",
        "title": "Voluntarily causing hurt",
        "description": "Whoever does any act with the intention of thereby causing hurt to any person, or with the knowledge that he is likely thereby to cause hurt to any person, and does thereby cause hurt to any person, is said voluntarily to cause hurt.",
        "ipc_equivalent": "IPC Section 323",
        "keywords": ["hurt", "beat", "beaten", "hit", "slap", "assault", "injure"]
    },
    {
        "section": "BNS §351",
        "title": "Criminal intimidation",
        "description": "Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, is said to commit criminal intimidation.",
        "ipc_equivalent": "IPC Section 506",
        "keywords": ["threat", "threatened", "intimidate", "kill", "harm", "blackmail"]
    },
    {
        "section": "BNS §74",
        "title": "Assault or use of criminal force to woman with intent to outrage her modesty",
        "description": "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of not less than one year but which may extend to five years, and shall also be liable to fine.",
        "ipc_equivalent": "IPC Section 354",
        "keywords": ["harass", "molest", "outrage", "modesty", "stalk", "stalker", "harassment", "women safety"]
    }
]
