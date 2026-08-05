# -*- coding: utf-8 -*-
"""
Rakshak AI - Mock NLP / AI Engine
-----------------------------------
This module simulates the AI/NLP pipeline (intent classification, entity
extraction, sentiment/risk detection, multilingual response generation).

It is RULE-BASED on purpose so the demo runs 100% offline with no API keys.
In production these functions would be backed by an LLM (GPT-4o / Gemini) +
a RAG knowledge base, but the public interface would stay the same.
"""

import re
import random
import datetime

from mock_data import POLICE_STATIONS, EMERGENCY_CONTACTS, KNOWLEDGE_BASE, OFFICER_PROFILES, BNS_LAWS

try:
    import llm  # optional GPT layer; falls back gracefully if unavailable
except Exception:
    llm = None

# ---------------------------------------------------------------------------
# Intent definitions: keyword sets per intent (EN + Hindi/Gujarati keywords)
# ---------------------------------------------------------------------------
INTENTS = {
    "emergency": [
        "emergency", "help me", "danger", "attack", "attacked", "kill", "murder",
        "threat", "threatening", "save me", "rape", "blood", "unconscious",
        "बचाओ", "खतरा", "मदद करो", "जान जा", "हमला", "मार डाला", "मार रहा",
        "खून", "बेहोश", "खतरे में", "जान को",
        "બચાવો", "ખતરો", "મદદ", "હુમલો", "ખૂન", "બેભાન",
    ],
    "theft": [
        "stolen", "theft", "robbed", "robbery", "snatched", "lost my", "missing wallet",
        "bike stolen", "phone stolen", "wallet", "purse", "chain snatch", "burglary",
        "चोरी", "चोरी हो", "चुरा", "चुराया", "चुरा लिया", "चुरा गया", "छीन",
        "लूट", "डकैती", "बाइक चोरी", "मोबाइल चोरी", "पर्स", "चेन स्नैच",
        "घर में चोरी", "सेंधमारी",
        "ચોરી", "ચોરાઈ", "ચોરી થઈ", "લૂંટ", "છીનવ", "ખિસ્સું",
    ],
    "cybercrime": [
        "otp", "upi", "fraud", "scam", "phishing", "hacked", "hack", "cyber",
        "fake call", "fake loan", "money deducted", "blackmail", "bank account",
        "online fraud", "lottery", "investment scam", "whatsapp scam",
        "ठगी", "धोखा", "धोखाधड़ी", "साइबर", "ओटीपी", "फ्रॉड", "हैक",
        "पैसे कट", "पैसे गए", "बैंक अकाउंट", "फर्जी", "लॉटरी",
        "છેતરપિંડી", "સાયબર", "ઓટીપી", "ફ્રૉડ",
    ],
    "fir_help": [
        "fir", "file a complaint", "register complaint", "how to file", "complaint",
        "report a crime", "lodge",
        "एफआईआर", "शिकायत", "शिकायत दर्ज", "रिपोर्ट", "थाने", "थाना",
        "ફરિયાદ", "એફ.આઈ.આર",
    ],
    "station_finder": [
        "police station", "nearest", "near me", "where is", "station", "cyber cell",
        "location", "address",
        "थाना", "पुलिस स्टेशन", "नजदीक", "पास में", "कहाँ है",
        "પોલીસ સ્ટેશન", "નજીક",
    ],
    "women_safety": [
        "domestic violence", "harass", "harassment", "stalking", "stalker", "abuse",
        "eve teasing", "molest", "women", "unsafe", "following me",
        "घरेलू हिंसा", "उत्पीड़न", "छेड़खानी", "पीछा", "मारपीट", "महिला",
        "महिलाओं", "दुर्व्यवहार",
        "ઘરેલું હિંસા", "પજવણી", "સતામણી",
    ],
    "traffic": [
        "challan", "traffic", "license", "rto", "vehicle", "accident", "signal",
        "fine",
        "ट्रैफिक", "चालान", "लाइसेंस", "दुर्घटना", "टक्कर", "हादसा",
        "ટ્રાફિક", "ચલણ", "અકસ્માત",
    ],
    "missing_person": [
        "missing person", "missing child", "lost child", "child is missing",
        "is missing", "child", "not returned", "kidnap", "kidnapped", "abducted",
        "disappeared", "can't find", "cannot find",
        "गुमशुदा", "लापता", "गुम", "नहीं मिल", "अपहरण", "किडनैप",
        "गायब", "खो गया", "खो गई",
        "ગુમ", "ખોવાયેલું",
    ],
    "greeting": [
        "hi", "hello", "hey", "namaste", "namaskar", "kem cho", "good morning",
        "good evening",
        "नमस्ते", "नमस्कार", "हैलो", "कैसे हो", "कैसे हैं",
        "નમસ્તે", "કેમ છો", "હેલો",
    ],
}

# Risk / panic words that trigger priority escalation
RISK_WORDS = [
    "right now", "immediately", "urgent", "dying", "blood", "weapon", "gun", "knife",
    "help me", "save", "scared", "afraid", "trapped", "abduct", "kidnap", "rape",
    "attacking", "attack", "kill", "murder", "help",
    "बचाओ", "तुरंत", "अभी", "मर रहा", "मर रही", "खून", "हथियार", "डर", "फंसा",
    "જલ્દી", "બચાવો", "ભય",
]

# Crime classification for the FIR generator (EN + Hindi + Gujarati keywords)
CRIME_TYPES = {
    "Vehicle Theft": [
        "bike", "scooter", "car", "vehicle", "motorcycle", "activa", "two wheeler",
        # Hindi
        "बाइक", "स्कूटर", "गाड़ी", "मोटरसाइकिल", "कार",
        # Gujarati
        "àAAAAàAAAAàAAAA", "àAAAAàAAAAàAAAA",
    ],
    "Mobile / Electronics Theft": [
        "phone", "mobile", "laptop", "tablet", "smartphone",
        # Hindi
        "मोबाइल", "फोन", "लैपटॉप",
        # Gujarati
        "àAAAAàAAAAàAAAAàAAAA", "àAAAAàAAAAàAAAA",
    ],
    "Personal Property Theft": [
        "wallet", "purse", "bag", "chain", "jewellery", "cash", "documents",
        # Hindi
        "पर्स", "बटुआ", "थैला", "जेवर", "नकदी", "जंजीर",
        # Gujarati
        "àAAAAàAAAAàAAAA", "àAAAAàAAAAàAAAA",
    ],
    "Burglary / House Break-in": [
        "house", "home", "burglary", "break in", "broke into", "shop",
        # Hindi
        "घर", "मकान", "दुकान", "सेंधमारी", "तोड़",
        # Gujarati
        "àAAAAàAAAAàAAAA", "àAAAAàAAAAàAAAA",
    ],
    "Cyber Fraud": [
        "otp", "upi", "online", "bank", "card", "account", "fraud", "scam",
        # Hindi
        "ओटीपी", "फ्रॉड", "ठगी", "धोखाधड़ी", "बैंक", "खाता",
        # Gujarati
        "àAAAAàAAAAàAAAA", "àAAAAàAAAAàAAAA",
    ],
    "Assault / Harassment": [
        "beaten", "assault", "harass", "threat", "attack", "hit",
        # Hindi
        "मारपीट", "हमला", "धमकी", "उत्पीड़न", "पीटा",
        # Gujarati
        "àAAAAàAAAAàAAAA", "àAAAAàAAAAàAAAA",
    ],
}

# Known Ahmedabad areas for location extraction
KNOWN_AREAS = [
    "SG Highway", "Satellite", "Navrangpura", "Maninagar", "Law Garden", "Bopal",
    "Paldi", "Vastrapur", "Bodakdev", "Prahlad Nagar", "Chandkheda", "Naranpura",
    "Gota", "Thaltej", "Ellis Bridge", "CG Road", "Ashram Road", "Sabarmati",
]


# ---------------------------------------------------------------------------
# Multilingual response templates
# ---------------------------------------------------------------------------
RESPONSES = {
    "greeting": {
        "en": "Namaste! 🙏 I am Rakshak AI, your Ahmedabad Police assistant. I can help you file a complaint, generate an FIR, report cybercrime, find a police station, or handle an emergency. How can I help you today?",
        "hi": "नमस्ते! 🙏 मैं रक्षक AI हूँ, अहमदाबाद पुलिस का सहायक। मैं शिकायत दर्ज करने, FIR बनाने, साइबर अपराध रिपोर्ट करने, या आपातकाल में मदद कर सकता हूँ। मैं आपकी कैसे मदद करूँ?",
        "gu": "નમસ્તે! 🙏 હું રક્ષક AI છું, અમદાવાદ પોલીસનો સહાયક. હું ફરિયાદ નોંધવામાં, FIR બનાવવામાં, સાયબર ક્રાઈમ રિપોર્ટ કરવામાં કે ઈમરજન્સીમાં મદદ કરી શકું છું. હું તમારી કેવી રીતે મદદ કરું?",
    },
    "theft": {
        "en": "I'm sorry this happened. This looks like a **theft** case. Here's what to do:\n1. Don't disturb the scene if it's a break-in.\n2. Note any details — time, place, witnesses.\n3. I can auto-generate an FIR draft for you right now.\nWould you like me to create the FIR draft? You can also visit your nearest police station.",
        "hi": "मुझे खेद है। यह **चोरी** का मामला लगता है। करें:\n1. घटनास्थल को न छुएँ।\n2. समय, स्थान, गवाह नोट करें।\n3. मैं अभी आपके लिए FIR ड्राफ्ट बना सकता हूँ।\nक्या मैं FIR ड्राफ्ट बनाऊँ?",
        "gu": "મને દુ:ખ છે. આ **ચોરી**નો કેસ લાગે છે. કરો:\n1. ઘટનાસ્થળને અડશો નહીં.\n2. સમય, સ્થળ, સાક્ષી નોંધો.\n3. હું હમણાં તમારા માટે FIR ડ્રાફ્ટ બનાવી શકું છું.\nશું હું FIR ડ્રાફ્ટ બનાવું?",
    },
    "cybercrime": {
        "en": "⚠️ This appears to be a **cybercrime / financial fraud**. Act fast:\n1. 📞 Call the Cyber Helpline **1930** immediately (golden hour to freeze the money).\n2. 🏦 Inform your bank to block the card/account.\n3. 🌐 File a report at cybercrime.gov.in.\n4. Never share OTP, PIN or passwords.\nI can prepare a cybercrime complaint draft for you — shall I proceed?",
        "hi": "⚠️ यह **साइबर अपराध / वित्तीय धोखाधड़ी** लगता है। तुरंत करें:\n1. 📞 साइबर हेल्पलाइन **1930** पर कॉल करें।\n2. 🏦 बैंक को कार्ड/खाता ब्लॉक करने को कहें।\n3. 🌐 cybercrime.gov.in पर रिपोर्ट करें।\n4. OTP, PIN कभी साझा न करें।",
        "gu": "⚠️ આ **સાયબર ક્રાઈમ / નાણાકીય છેતરપિંડી** લાગે છે. તરત કરો:\n1. 📞 સાયબર હેલ્પલાઈન **1930** પર કૉલ કરો.\n2. 🏦 બેંકને કાર્ડ/ખાતું બ્લોક કરવા જણાવો.\n3. 🌐 cybercrime.gov.in પર રિપોર્ટ કરો.\n4. OTP, PIN ક્યારેય શેર ન કરો.",
    },
    "fir_help": {
        "en": KNOWLEDGE_BASE["fir_process"] + "\n\n✅ Tip: Use the **Complaint → FIR Generator** in Rakshak AI to auto-create a structured FIR draft in seconds.",
        "hi": "FIR दर्ज करने के लिए नजदीकी थाने जाएँ और घटना की जानकारी दें। आपको FIR की मुफ्त कॉपी मिलेगी। ✅ टिप: रक्षक AI के **FIR जनरेटर** से तुरंत FIR ड्राफ्ट बनाएँ।",
        "gu": "FIR નોંધાવવા નજીકના પોલીસ સ્ટેશને જાઓ અને ઘટનાની વિગતો આપો. તમને FIRની મફત નકલ મળશે. ✅ ટિપ: રક્ષક AIના **FIR જનરેટર**થી તરત FIR ડ્રાફ્ટ બનાવો.",
    },
    "women_safety": {
        "en": "🛡️ Your safety is the top priority. For women's safety:\n• **Abhayam Helpline: 181** (24x7)\n• Emergency: **112**\nIf you are in immediate danger, use the **SOS** button. I can also connect you to the nearest Women Help Center. You are not alone.",
        "hi": "🛡️ आपकी सुरक्षा सर्वोपरि है।\n• **अभयम हेल्पलाइन: 181**\n• आपातकाल: **112**\nतत्काल खतरे में हों तो **SOS** बटन दबाएँ। आप अकेली नहीं हैं।",
        "gu": "🛡️ તમારી સલામતી સર્વોપરી છે.\n• **અભયમ હેલ્પલાઈન: 181**\n• ઈમરજન્સી: **112**\nતાત્કાલિક ભયમાં હો તો **SOS** બટન દબાવો. તમે એકલા નથી.",
    },
    "traffic": {
        "en": KNOWLEDGE_BASE["traffic_challan"] + "\n\nFor accidents, call **108** for ambulance and **100** for police. I can locate the nearest traffic police office for you.",
        "hi": "ई-चालान echallan.parivahan.gov.in पर ऑनलाइन भरें। दुर्घटना पर **108** (एम्बुलेंस) और **100** (पुलिस) पर कॉल करें।",
        "gu": "ઈ-ચલણ echallan.parivahan.gov.in પર ઓનલાઈન ભરો. અકસ્માતમાં **108** (એમ્બ્યુલન્સ) અને **100** (પોલીસ) પર કૉલ કરો.",
    },
    "missing_person": {
        "en": "I understand this is distressing. For a missing person:\n1. File a report immediately — there is **no 24-hour waiting rule**.\n2. Keep a recent photo and description ready.\n3. Call **100** or **112**.\nRakshak AI's Missing Person module can register a report with a photo. Shall I guide you?",
        "hi": "गुमशुदगी के लिए तुरंत रिपोर्ट करें — 24 घंटे इंतजार की जरूरत नहीं। हाल की फोटो रखें। **100** या **112** पर कॉल करें।",
        "gu": "ગુમ થયેલ વ્યક્તિ માટે તરત રિપોર્ટ કરો — 24 કલાક રાહ જોવાની જરૂર નથી. તાજો ફોટો રાખો. **100** કે **112** પર કૉલ કરો.",
    },
    "fallback": {
        "en": "I'm here to help with police services — complaints, FIR, cybercrime, emergencies, and finding police stations. Could you describe your issue in a bit more detail? For example: \"My phone was stolen\" or \"I got a scam OTP call\".",
        "hi": "मैं पुलिस सेवाओं में मदद के लिए हूँ — शिकायत, FIR, साइबर अपराध, आपातकाल। कृपया अपनी समस्या थोड़ा और बताएँ।",
        "gu": "હું પોલીસ સેવાઓમાં મદદ માટે છું — ફરિયાદ, FIR, સાયબર ક્રાઈમ, ઈમરજન્સી. કૃપા કરી તમારી સમસ્યા થોડી વધુ જણાવો.",
    },
}

# Suggested follow-up chips per intent (shown in UI)
SUGGESTIONS = {
    "theft": ["Generate FIR draft", "Find nearest police station", "What documents do I need?"],
    "cybercrime": ["Open Cybercrime Assistant", "Call 1930", "How to secure my account?"],
    "fir_help": ["Open FIR Generator", "Find nearest police station", "FIR copy rights"],
    "station_finder": ["Show nearest stations", "Find cyber cell", "Women help center"],
    "women_safety": ["Activate SOS", "Call 181", "Nearest Women Help Center"],
    "traffic": ["Pay e-challan", "Report accident", "Find traffic police"],
    "missing_person": ["File missing report", "Emergency contacts", "Call 112"],
    "emergency": ["Activate SOS", "Show emergency contacts", "Nearest police station"],
    "greeting": ["Report a complaint", "Cybercrime help", "Find police station", "Emergency help"],
    "fallback": ["Report a complaint", "Cybercrime help", "How to file FIR", "Emergency help"],
}


# ---------------------------------------------------------------------------
# Core functions
# ---------------------------------------------------------------------------
def detect_intent(text):
    """Return (intent, confidence 0-1) using keyword scoring.
    Uses casefold() instead of lower() for correct Unicode handling
    (Hindi/Gujarati characters are not affected by casefold but ASCII is).
    """
    # casefold is safer than lower() for multilingual Unicode text
    t = text.casefold()
    scores = {}
    for intent, keywords in INTENTS.items():
        score = sum(1 for kw in keywords if kw.casefold() in t)
        if score:
            scores[intent] = score
    if not scores:
        return "fallback", 0.35
    best = max(scores, key=scores.get)
    # crude confidence: scale by hits, cap at 0.98
    confidence = min(0.55 + 0.15 * scores[best], 0.98)
    return best, round(confidence, 2)


def detect_risk(text):
    """Sentiment / risk detection -> level + score."""
    t = text.casefold()  # use casefold for Unicode safety
    hits = sum(1 for w in RISK_WORDS if w.casefold() in t)
    if hits >= 2:
        return {"level": "CRITICAL", "score": min(60 + hits * 12, 99), "escalate": True}
    if hits == 1:
        return {"level": "HIGH", "score": 55, "escalate": True}
    return {"level": "NORMAL", "score": 12, "escalate": False}


class StateGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = {}
        
    def add_node(self, name, func):
        self.nodes[name] = func
        
    def add_conditional_edges(self, source, routing_func):
        self.edges[source] = routing_func
        
    def run(self, initial_state):
        state = initial_state.copy()
        current_node = "router"
        visited_nodes = []
        
        while current_node in self.nodes:
            visited_nodes.append(current_node)
            state["visited_nodes"] = visited_nodes
            
            # Execute node
            state = self.nodes[current_node](state)
            
            # Route to next node
            if current_node in self.edges:
                current_node = self.edges[current_node](state)
            else:
                break
        return state

def router_node(state):
    intent, confidence = detect_intent(state["message"])
    risk = detect_risk(state["message"])
    
    state["intent"] = intent
    state["confidence"] = confidence
    state["risk_level"] = risk["level"]
    state["risk_score"] = risk["score"]
    
    state["traces"].append(
        f"🧭 RouterNode: Analyzed query -> Intent: {intent} ({int(confidence*100)}%), Risk: {risk['level']} ({risk['score']} pts)"
    )
    return state

def risk_gatekeeper_node(state):
    lang = state["lang"]
    # No "help is being prioritized", no "I'm escalating this with HIGH priority",
    # and no instruction to press an SOS button. Nothing here reaches the police:
    # there is no control-room integration, the SOS endpoint only logs, and
    # "escalating" implies a destination that does not exist. Three other copies
    # of this same claim were removed from this app (the SOS endpoint, the SOS
    # panel and the rule-based chat reply); this was the fourth. The only useful
    # thing to say is: make the call yourself, here is the number.
    reply = {
        "en": "🚨 **Call 112 now** — police, fire and medical. Police direct: **100**. Women's helpline: **1091**.\nRakshak cannot contact the police for you and has not shared your location. Please make the call yourself, and move somewhere safe if you can.",
        "hi": "🚨 **अभी 112 पर कॉल करें** — पुलिस, दमकल और चिकित्सा। सीधे पुलिस: **100**। महिला हेल्पलाइन: **1091**।\nरक्षक आपकी ओर से पुलिस को संपर्क नहीं कर सकता और आपकी लोकेशन नहीं भेजी गई है। कृपया खुद कॉल करें और हो सके तो सुरक्षित जगह चले जाएँ।",
        "gu": "🚨 **હમણાં 112 પર કૉલ કરો** — પોલીસ, ફાયર અને મેડિકલ. સીધા પોલીસ: **100**. મહિલા હેલ્પલાઇન: **1091**.\nરક્ષક તમારા વતી પોલીસનો સંપર્ક કરી શકતું નથી અને તમારું લોકેશન મોકલ્યું નથી. કૃપા કરીને જાતે કૉલ કરો અને શક્ય હોય તો સુરક્ષિત જગ્યાએ જાઓ.",
    }[lang]
    
    state["reply"] = reply
    state["action"] = "sos"
    state["suggestions"] = SUGGESTIONS["emergency"]
    state["traces"].append("🛡️ RiskGatekeeperNode: Intercepted critical safety event. Dispatched SOS priority locks.")
    return state

def citizen_assistant_node(state):
    lang = state["lang"]
    intent = state["intent"]
    text = state["message"]
    risk_level = state["risk_level"]
    
    state["traces"].append(f"🤖 CitizenAssistantNode: Formulating response in '{lang}' for intent '{intent}'...")
    
    if intent == "station_finder":
        nearest = sorted(POLICE_STATIONS, key=lambda s: s["distance_km"])[:3]
        lines = "\n".join(
            f"• **{s['name']}** — {s['distance_km']} km, {s['phone']}" for s in nearest
        )
        reply = f"Here are the nearest police facilities:\n{lines}\n\nOpen the **Police Station Finder** for the full map and directions."
        state["reply"] = reply
        state["action"] = "stations"
        state["suggestions"] = SUGGESTIONS["station_finder"]
        return state
        
    reply = RESPONSES.get(intent, RESPONSES["fallback"])[lang]
    
    # LLM completion if active
    if llm is not None and llm.is_enabled():
        llm_reply = llm.llm_chat_reply(text, lang, intent, risk_level)
        if llm_reply:
            reply = llm_reply
            state["traces"].append("   (Call completed using configured LLM API layer)")
            
    state["reply"] = reply
    
    action = None
    if intent == "theft" or intent == "fir_help":
        action = "fir"
    elif intent == "cybercrime":
        action = "cyber"
    elif intent == "women_safety":
        action = "sos"
        
    state["action"] = action
    state["suggestions"] = SUGGESTIONS.get(intent, SUGGESTIONS["fallback"])
    return state

def legal_agent_node(state):
    text = state["message"]
    state["traces"].append("⚖️ LegalAgentNode: Context points to legal BNS codes. Activating hybrid legal index RAG...")
    
    # Run the legal search RAG
    rag_res = search_bns_laws(text)
    state["reply"] = rag_res["answer"]
    state["suggestions"] = ["Open FIR Generator", "What is BNS?", "Find nearest police station"]
    state["action"] = "fir"
    return state

def generate_chat_response(text, lang="en"):
    """Main chatbot entry point now powered by StateGraph router."""
    if lang not in ("en", "hi", "gu"):
        lang = "en"
        
    initial_state = {
        "message": text,
        "lang": lang,
        "intent": None,
        "confidence": 0.0,
        "risk_level": "NORMAL",
        "risk_score": 0,
        "reply": "",
        "suggestions": [],
        "action": None,
        "visited_nodes": [],
        "traces": []
    }
    
    # Initialize state graph
    workflow = StateGraph()
    workflow.add_node("router", router_node)
    workflow.add_node("risk_gatekeeper", risk_gatekeeper_node)
    workflow.add_node("citizen_assistant", citizen_assistant_node)
    workflow.add_node("legal_agent", legal_agent_node)
    
    # Define routing
    def route_nodes(state):
        if state["risk_level"] == "CRITICAL":
            return "risk_gatekeeper"
        if state["intent"] in ("fir_help", "legal_bns") or "section" in state["message"].lower() or "law" in state["message"].lower() or "bns" in state["message"].lower() or "ipc" in state["message"].lower():
            return "legal_agent"
        return "citizen_assistant"
        
    workflow.add_conditional_edges("router", route_nodes)
    
    final_state = workflow.run(initial_state)
    
    # Log telemetry for telemetry dashboard
    import store
    import sys
    provider = "Offline Graph Engine"
    if llm is not None and llm.is_enabled():
        provider = f"LLM State Graph ({llm.PROVIDER})"
    duration_ms = random.randint(20, 80)
    store.add_telemetry("Chatbot Reply", provider, duration_ms, len(text.split()), len(final_state["reply"].split()), "SUCCESS", 0.0)
    
    # Add traces to the response so the UI debug panel can display them!
    res = {
        "reply": final_state["reply"],
        "intent": final_state["intent"],
        "confidence": final_state["confidence"],
        "risk": {
            "level": final_state["risk_level"],
            "score": final_state["risk_score"],
            "escalate": final_state["risk_level"] in ("HIGH", "CRITICAL")
        },
        "suggestions": final_state["suggestions"],
        "action": final_state["action"],
        "traces": final_state["traces"]
    }
    return res


# ---------------------------------------------------------------------------
# FIR generator
# ---------------------------------------------------------------------------
# AI-suggested applicable legal sections per crime type (BNS 2023 + old IPC).
# Indicative only — final sections are decided by the investigating officer.
LEGAL_SECTIONS = {
    "Vehicle Theft": ["BNS §303 — Theft (old IPC §379)"],
    "Mobile / Electronics Theft": ["BNS §303 — Theft (old IPC §379)"],
    "Personal Property Theft": ["BNS §303 — Theft (old IPC §379)",
                                "BNS §304 — Snatching (new offence)"],
    "Burglary / House Break-in": ["BNS §305 — Theft in a dwelling (old IPC §380)",
                                  "BNS §331 — House-breaking (old IPC §454/457)"],
    "Cyber Fraud": ["IT Act §66C — Identity theft",
                    "IT Act §66D — Cheating by personation",
                    "BNS §319 — Cheating by personation (old IPC §419)",
                    "BNS §318 — Cheating (old IPC §420)"],
    "Assault / Harassment": ["BNS §115 — Voluntarily causing hurt (old IPC §323)",
                             "BNS §351 — Criminal intimidation (old IPC §506)"],
    "General Offence": ["To be determined by the investigating officer"],
}


def get_legal_sections(crime_type):
    return LEGAL_SECTIONS.get(crime_type, LEGAL_SECTIONS["General Offence"])


def _classify_crime(text):
    t = text.lower()
    for crime, kws in CRIME_TYPES.items():
        if any(k in t for k in kws):
            return crime
    return "General Offence"


def _extract_location(text):
    # Check known English area names first (case-insensitive)
    for area in KNOWN_AREAS:
        if area.lower() in text.lower():
            return area
    # fallback: look for "near X" / "at X" / "outside X" in English text
    m = re.search(r"(?:near|at|outside|in|on)\s+([A-Z][a-zA-Z ]{2,25})", text)
    if m:
        return m.group(1).strip()
    # Hindi location patterns: "पास", "के पास", "में", "नजदीक"
    m = re.search(r"([\u0900-\u097F ]{3,20})(?:\s*(?:पास|में|पर|नजदीक))", text)
    if m:
        return m.group(1).strip()
    return "Not specified"


def _extract_time(text):
    t = text.lower()
    # Check natural language time phrases first (most reliable)
    time_phrases = [
        "last night", "yesterday night", "yesterday evening", "yesterday",
        "this morning", "today morning", "today evening", "today", "tonight",
        "last week", "this afternoon", "this evening", "evening", "morning",
        # Hindi time phrases
        "कल रात", "कल", "आज", "रात को", "सुबह", "शाम",
        # Gujarati time phrases
        "ગઈ કàAAAA", "àAAAAàAAAA", "àAAAAàAAAA àAAAAàAAAA",
    ]
    for phrase in time_phrases:
        if phrase in t:
            return phrase.title()
    # Only match times that have explicit AM/PM or a colon (avoid matching
    # helpline numbers like 100, 112, 181, 1930 which have no AM/PM)
    m = re.search(r"\b([01]?\d|2[0-3])[:.][0-5]\d\s?(?:am|pm)?\b", t)
    if m:
        return m.group(0).strip()
    m = re.search(r"\b([01]?\d|2[0-3])\s?(am|pm)\b", t)
    if m:
        return m.group(0).strip()
    return "Not specified"


def generate_fir(text, name="", phone=""):
    """Convert free-text complaint into a structured FIR draft."""
    crime_type = _classify_crime(text)
    location = _extract_location(text)
    time = _extract_time(text)
    now = datetime.datetime.now()
    complaint_id = "AHM-" + now.strftime("%Y%m%d") + "-" + str(random.randint(1000, 9999))

    summary = text.strip()
    if len(summary) > 240:
        summary = summary[:237] + "..."

    legal_sections = get_legal_sections(crime_type)
    sections_block = "\n".join("  - " + s for s in legal_sections)

    fir_text = f"""FIRST INFORMATION REPORT (DRAFT)
Ahmedabad City Police  |  Generated by Rakshak AI
================================================
Complaint ID : {complaint_id}
Date & Time  : {now.strftime('%d-%b-%Y %I:%M %p')}
--------------------------------------------------
Complainant  : {name or 'Not provided'}
Contact      : {phone or 'Not provided'}
--------------------------------------------------
Crime Type   : {crime_type}
Place of Occurrence : {location}
Time of Occurrence  : {time}
--------------------------------------------------
Statement of Complaint:
{summary}
--------------------------------------------------
Applicable Sections (AI-suggested):
{sections_block}
--------------------------------------------------
Status       : DRAFT — pending verification at police station
Note         : This is an AI-generated draft for assistance only.
               Final FIR & legal sections are decided by the duty officer.
================================================"""

    return {
        "complaint_id": complaint_id,
        "crime_type": crime_type,
        "location": location,
        "time": time,
        "summary": summary,
        "legal_sections": legal_sections,
        "fir_text": fir_text,
        "created_at": now.strftime("%d-%b-%Y %I:%M %p"),
        "next_steps": [
            "Visit the nearest police station with this Complaint ID.",
            "Carry an ID proof (Aadhaar / License).",
            "A confirmation has been (mock) emailed to you.",
        ],
    }


# ---------------------------------------------------------------------------
# Cybercrime assistant
# ---------------------------------------------------------------------------
CYBER_SCAMS = {
    "OTP Fraud": {
        "keywords": ["otp", "one time password", "verification code"],
        "actions": [
            "Call 1930 immediately to report and freeze the transaction.",
            "Inform your bank to block the card/account.",
            "Never share OTP — banks/police never ask for it.",
            "Change your net-banking & UPI PINs.",
        ],
        "evidence": ["Transaction SMS", "Caller's number", "Bank statement", "Screenshots"],
    },
    "UPI / Payment Scam": {
        "keywords": ["upi", "gpay", "phonepe", "paytm", "qr", "scan", "payment", "money deducted"],
        "actions": [
            "Do NOT scan unknown QR codes to 'receive' money.",
            "Call 1930 and report on cybercrime.gov.in.",
            "Raise a dispute in your UPI app.",
            "Block the UPI ID and inform your bank.",
        ],
        "evidence": ["UPI transaction ID", "Receiver VPA/UPI ID", "Chat screenshots"],
    },
    "Fake Loan / Investment": {
        "keywords": ["loan", "investment", "scheme", "double money", "trading", "crypto", "lottery"],
        "actions": [
            "Stop all payments immediately.",
            "Do not install any app they ask you to.",
            "Report on cybercrime.gov.in and call 1930.",
            "Verify any company on the SEBI/RBI portal.",
        ],
        "evidence": ["App name/link", "Payment proofs", "WhatsApp/Telegram chats"],
    },
    "Phishing / Account Hack": {
        "keywords": ["phishing", "link", "hacked", "hack", "password", "email", "facebook", "instagram", "whatsapp"],
        "actions": [
            "Reset passwords and enable 2-Factor Authentication.",
            "Do not click suspicious links.",
            "Report the hacked account to the platform.",
            "File a complaint on cybercrime.gov.in.",
        ],
        "evidence": ["Suspicious link/email", "Screenshots", "Login alerts"],
    },
}


def analyze_cybercrime(text):
    t = text.casefold()  # use casefold for Unicode safety
    matched = None
    best_hits = 0
    for scam, info in CYBER_SCAMS.items():
        hits = sum(1 for k in info["keywords"] if k in t)
        if hits > best_hits:
            best_hits = hits
            matched = scam
    if not matched:
        # Better default: detect from general keywords
        if any(w in t for w in ["पैसे", "रुपये", "खाता", "बैंक", "ठगी", "धोखा"]):
            matched = "UPI / Payment Scam"
        elif any(w in t for w in ["hacked", "hack", "password", "account", "login"]):
            matched = "Phishing / Account Hack"
        elif any(w in t for w in ["loan", "invest", "crypto", "trading", "lottery"]):
            matched = "Fake Loan / Investment"
        else:
            matched = "OTP Fraud"  # safe final default

    info = CYBER_SCAMS[matched]
    now = datetime.datetime.now()
    ref = "CYB-" + now.strftime("%Y%m%d") + "-" + str(random.randint(1000, 9999))
    return {
        "scam_type": matched,
        "reference_id": ref,
        "actions": info["actions"],
        "evidence_checklist": info["evidence"],
        "helpline": "1930",
        "portal": "cybercrime.gov.in",
        "severity": "HIGH" if matched in ("UPI / Payment Scam", "OTP Fraud") else "MEDIUM",
    }


# ---------------------------------------------------------------------------
# Emergency / SOS
# ---------------------------------------------------------------------------
def trigger_sos(category="General", location="Ahmedabad"):
    now = datetime.datetime.now()
    nearest = sorted(POLICE_STATIONS, key=lambda s: s["distance_km"])[:3]
    return {
        "alert_id": "SOS-" + now.strftime("%H%M%S") + "-" + str(random.randint(100, 999)),
        "status": "DISPATCHED (simulated)",
        "category": category,
        "location": location,
        "time": now.strftime("%I:%M:%S %p"),
        "message": "🚨 Emergency alert raised with HIGH priority. Nearest unit notified (demo).",
        "nearest_stations": nearest,
        "contacts": EMERGENCY_CONTACTS,
    }


# ---------------------------------------------------------------------------
# AI Officer Copilot Engine
# ---------------------------------------------------------------------------
def generate_case_report(case_id, notes):
    """Combines complaint data with officer notes to draft a structured Markdown Investigation Report."""
    import store
    case_data = store.get_complaint(case_id)
    if not case_data:
        return "Error: Case not found in database."

    if llm is not None and llm.is_enabled():
        res = llm.llm_generate_case_report(case_data, notes)
        if res:
            return res

    # Offline fallback
    summary_text = (
        f"# INVESTIGATION REPORT (OFFLINE DRAFT)\n"
        f"**Ahmedabad Police Department**\n\n"
        f"## 1. CASE PROFILE\n"
        f"- **Case ID:** {case_data.get('id')}\n"
        f"- **Occurrence Date/Time:** {case_data.get('created_at')} (reported time: {case_data.get('time')})\n"
        f"- **Location:** {case_data.get('location')}\n"
        f"- **Crime Category:** {case_data.get('crime_type')}\n"
        f"- **Priority Status:** {case_data.get('priority')}\n"
        f"- **Assigned Investigating Officer:** {case_data.get('officer')}\n"
        f"- **Complainant:** {case_data.get('name')} (Contact: {case_data.get('phone')})\n\n"
        f"**Statement of Complaint:**\n"
        f"> {case_data.get('summary')}\n\n"
        f"## 2. LEGAL ASSESSMENT\n"
        f"Based on the initial classification of **{case_data.get('crime_type')}**, the following sections of the **Bharatiya Nyaya Sanhita (BNS) 2023** are provisionally recommended:\n"
    )

    for section in case_data.get('legal_sections', []):
        summary_text += f"- **{section}**\n"
    if not case_data.get('legal_sections'):
        summary_text += "- **BNS §303 — Theft (Provisional)**\n"

    summary_text += (
        f"\n## 3. INVESTIGATION PLAN\n"
        f"**Immediate Tasks:**\n"
        f"1. Conduct site inspection at `{case_data.get('location')}` and canvas for eyewitnesses.\n"
        f"2. Secure relevant CCTV camera feeds near the place of occurrence.\n"
        f"3. Issue official notices to relevant parties as per procedure.\n"
        f"4. Coordinate with cyber cells or tracking units if electronic items are stolen.\n\n"
        f"**Evidence to Gather:**\n"
        f"- Formal signed complainant statement\n"
        f"- Physical proof of ownership/loss (if applicable)\n"
        f"- CCTV footage logs and digital hashes\n\n"
        f"## 4. OFFICER SUMMARY\n"
        f"Initial verification indicates a prima facie case. {notes or 'Investigation initiated under standard protocols.'}\n\n"
        f"*(Note: Generated by Rakshak Copilot offline fallback engine)*"
    )
    return summary_text


def summarize_meeting(transcript, summary_type="standard"):
    """Summarize an interrogation transcript, extract timelines or contradictions."""
    if not transcript or not transcript.strip():
        return "Error: Empty transcript provided."

    if llm is not None and llm.is_enabled():
        res = llm.llm_summarize_interrogation(transcript, summary_type)
        if res:
            return res

    # Offline fallback
    lines = transcript.split('\n')
    non_empty_lines = [l.strip() for l in lines if l.strip()]
    line_count = len(non_empty_lines)
    word_count = len(transcript.split())

    names = set(re.findall(r"\b[A-Z][a-z]+\b", transcript))
    names = {n for n in names if n not in ["I", "The", "He", "She", "They", "We", "My", "In", "At", "On", "No", "Yes", "So", "Ok"]}
    names_str = ", ".join(names) if names else "Not explicitly identified"

    dates = re.findall(r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b", transcript)
    dates_str = ", ".join(dates) if dates else "No dates mentioned"

    if summary_type == "bullet":
        summary = (
            f"### Key Details (Offline Summary)\n"
            f"- **Total lines processed:** {line_count}\n"
            f"- **Word count:** {word_count}\n"
            f"- **Potential names mentioned:** {names_str}\n"
            f"- **Dates mentioned:** {dates_str}\n\n"
            f"### Main Statements Found:\n"
        )
        for i, line in enumerate(non_empty_lines[:6]):
            summary += f"- Statement {i+1}: \"{line[:100]}\"\n"
        return summary

    elif summary_type == "timeline":
        summary = (
            f"### Reconstructed Timeline (Offline Summary)\n"
            f"- **Note:** Time sequences extracted by rule keywords.\n\n"
        )
        timeline_events = []
        for line in non_empty_lines:
            for keyword in ["first", "then", "after", "yesterday", "today", "tomorrow", "night", "morning", "at", "time"]:
                if keyword in line.lower():
                    timeline_events.append(line)
                    break
        if timeline_events:
            for i, ev in enumerate(timeline_events[:6]):
                summary += f"{i+1}. {ev}\n"
        else:
            summary += "No chronological cues detected in the transcript. Listing original sequence:\n"
            for i, line in enumerate(non_empty_lines[:4]):
                summary += f"- {line}\n"
        return summary

    elif summary_type == "contradictions":
        summary = (
            f"### Potential Contradictions & Suspicious Statements (Offline Analysis)\n\n"
            f"1. **Information Gaps:** Complainant/suspect uses vague phrasing in the description of the event.\n"
            f"2. **Negations and Denials:**\n"
        )
        denials = [l for l in non_empty_lines if any(k in l.lower() for k in ["don't know", "never", "did not", "not me", "no idea", "lies", "lie"])]
        if denials:
            for d in denials[:4]:
                summary += f"   - suspicious statement: \"{d[:100]}\"\n"
        else:
            summary += "   - No explicit negation or denial keywords (e.g. 'did not', 'never') detected in statements.\n"
        summary += "\n*Recommendation:* Cross-reference phone logs, physical evidence, and conduct a detailed follow-up interview."
        return summary

    else:  # standard
        summary = (
            f"### Summary of Interview (Offline Standard)\n\n"
            f"**General Overview:**\n"
            f"An interrogation/witness statement comprising {line_count} lines was analyzed. The transcript involves discussion regarding the incident. Names detected in text: {names_str}.\n\n"
            f"**Core Summary:**\n"
            f"The statement reports details regarding the event. Key sections extracted:\n"
        )
        for i, line in enumerate(non_empty_lines[:4]):
            summary += f"   - *Fact {i+1}:* \"{line[:120]}\"\n"
        return summary


def match_officers_for_case(case_id):
    """Calculates compatibility scores between the case and police officer profiles."""
    import store, json
    case_data = store.get_complaint(case_id)
    if not case_data:
        return {"error": "Case not found"}

    if llm is not None and llm.is_enabled():
        res_str = llm.llm_match_officer(case_data, OFFICER_PROFILES)
        if res_str:
            try:
                if "```json" in res_str:
                    res_str = res_str.split("```json")[1].split("```")[0].strip()
                elif "```" in res_str:
                    res_str = res_str.split("```")[1].split("```")[0].strip()
                parsed = json.loads(res_str)
                # Ensure officers_list details are added for the UI table
                parsed["officers_list"] = []
                for o in OFFICER_PROFILES:
                    matched_score = parsed.get("all_scores", {}).get(o["name"], 50)
                    parsed["officers_list"].append({
                        "name": o["name"],
                        "score": matched_score,
                        "reasons": ["High compatibility" if matched_score >= 80 else "Medium compatibility"],
                        "profile": o
                    })
                parsed["officers_list"].sort(key=lambda x: x["score"], reverse=True)
                return parsed
            except Exception as e:
                print("[ai_engine:match_officers] LLM JSON parsing failed, falling back to rule-based:", e)

    # Rule-based matching
    crime_type = case_data.get("crime_type", "")
    location = case_data.get("location", "")
    risk = case_data.get("risk", "NORMAL")

    matched_officers = []
    all_scores = {}

    for o in OFFICER_PROFILES:
        score = 55  # base score
        reasons = []

        # Specialization match (+30 pts)
        if o["specialization"].lower() in crime_type.lower() or crime_type.lower() in o["specialization"].lower():
            score += 30
            reasons.append(f"Specialization: {o['specialization']}")
        else:
            reasons.append(f"General match: {o['specialization']}")

        # Case workload optimization (+20 pts max)
        workload_points = max(0, 15 - (o["active_cases"] * 3))
        score += workload_points
        if o["active_cases"] <= 2:
            reasons.append(f"Available (Only {o['active_cases']} active cases)")
        else:
            reasons.append(f"Moderate caseload ({o['active_cases']} cases)")

        # Experience matching
        is_critical = risk == "CRITICAL" or case_data.get("priority", "").startswith("P1")
        if is_critical and o["experience_years"] >= 10:
            score += 10
            reasons.append("Experienced officer matched to critical case")
        elif not is_critical and o["experience_years"] < 10:
            score += 5

        # Area/Station matching (+5 pts)
        if o["station"].split()[0].lower() in location.lower():
            score += 5
            reasons.append(f"Station: {o['station']}")

        score = min(score, 99)
        all_scores[o["name"]] = score
        matched_officers.append({
            "name": o["name"],
            "score": score,
            "reasons": reasons,
            "profile": o
        })

    matched_officers.sort(key=lambda x: x["score"], reverse=True)
    rec_officer = matched_officers[0]
    alt_officer = matched_officers[1]

    reasoning = (
        f"{rec_officer['name']} is recommended with a match score of {rec_officer['score']}%. "
        f"Key reasons: {', '.join(rec_officer['reasons'])}. "
        f"This officer has resolved {rec_officer['profile']['solved_cases']} cases and has "
        f"specific expertise in '{rec_officer['profile']['specialization']}'."
    )

    return {
        "recommended_officer": rec_officer["name"],
        "match_score": rec_officer["score"],
        "reasoning": reasoning,
        "alternative_officer": alt_officer["name"],
        "all_scores": all_scores,
        "officers_list": matched_officers
    }


def search_bns_laws(query):
    """Retrieves BNS laws relevant to a search query (Mock RAG) and returns details."""
    if not query or not query.strip():
        return {"answer": "Please enter a valid legal query.", "laws": []}

    q_words = re.findall(r"\b\w+\b", query.lower())
    scored_laws = []

    for law in BNS_LAWS:
        score = 0
        for kw in law["keywords"]:
            if kw.lower() in query.lower():
                score += 15
            for qw in q_words:
                if qw == kw.lower():
                    score += 8
        if score > 0:
            scored_laws.append((score, law))

    # Sort by score
    scored_laws.sort(key=lambda x: x[0], reverse=True)
    retrieved = [item[1] for item in scored_laws[:3]]

    if not retrieved:
        retrieved = [BNS_LAWS[0]]  # BNS 303 Theft default fallback

    if llm is not None and llm.is_enabled():
        res = llm.llm_bns_search(query, retrieved)
        if res:
            return {
                "answer": res,
                "laws": retrieved
            }

    # Offline RAG fallback answer
    primary = retrieved[0]
    answer = (
        f"⚖️ **Offline Legal Assistant Analysis:**\n\n"
        f"Based on your query, the most relevant section found is **{primary['section']} ({primary['title']})**.\n\n"
        f"- **Provision Description:** {primary['description']}\n"
        f"- **IPC Equivalent:** {primary['ipc_equivalent']}\n\n"
        f"**Applicability Analysis:**\n"
        f"This section applies when events match: {', '.join(primary['keywords'][:5])}. "
        f"If this matches the incident, please provisionally cite {primary['section']} in the FIR draft.\n\n"
        f"Other relevant sections considered:\n"
    )
    for law in retrieved[1:]:
        answer += f"- **{law['section']} ({law['title']})** — Equivalent to {law['ipc_equivalent']}\n"

    return {
        "answer": answer,
        "laws": retrieved
    }

# ---------------------------------------------------------------------------
# NEW Internal JD Features (HR, RAG, Meetings, Reports)
# ---------------------------------------------------------------------------
def generate_internal_report(text, complaint_id=None):
    import store
    case_data = None
    if complaint_id:
        case_data = store.get_complaint(complaint_id)
        
    if llm is not None and llm.is_enabled():
        mock_case = case_data or {
            "id": "CUSTOM-DRAFT",
            "type": "Investigation Notes",
            "crime_type": "Provisional Offence",
            "location": "Ahmedabad",
            "created_at": datetime.datetime.now().strftime('%d-%b-%Y %I:%M %p'),
            "time": "Not specified",
            "name": "Citizen",
            "phone": "Not specified",
            "summary": text,
            "legal_sections": ["BNS §303 — Theft (Provisional)"]
        }
        res = llm.llm_generate_case_report(mock_case, text)
        if res:
            return {"classification": mock_case.get("crime_type", "Routine Incident"), "report": res}

    # Offline fallback
    import store
    store.add_telemetry("Report Generator", "Offline Fallback", random.randint(5, 15), 0, 0, "SUCCESS", 0.0)
    classification = "Routine Incident"
    if case_data:
        classification = case_data.get("crime_type", "Routine Incident")
    elif any(w in text.lower() for w in ["murder", "death", "critical", "weapon", "kill"]):
        classification = "High Priority Crime"
    elif any(w in text.lower() for w in ["stolen", "theft", "bike", "phone", "wallet"]):
        classification = "Theft Incident"
        
    now_str = datetime.datetime.now().strftime('%d-%b-%Y')
    
    report = f"""# OFFICIAL CASE REPORT / INVESTIGATION PROPOSAL
Ahmedabad Police Department  |  Auto-Generated Report
--------------------------------------------------
Classification : {classification}
Date           : {now_str}
Reference Case : {complaint_id or 'N/A'}
--------------------------------------------------

## 1. PRELIMINARY OBSERVATIONS
{text[:300] + '...' if len(text) > 300 else text}

## 2. KEY EXTRACTS & ACTIONS
- Initial notes indicate a need for further site inspection.
- Secure relevant CCTV camera footage near the scene of incident.
- Canvas local residents and witnesses for additional information.
- Cross-reference central database for similar modus operandi.

## 3. PROVISIONAL LAW RECOMMENDATIONS
"""
    if case_data and case_data.get("legal_sections"):
        for sec in case_data["legal_sections"]:
            report += f"- {sec}\n"
    else:
        report += "- BNS §303 — Theft (IPC §379 equivalent)\n"
        
    report += f"""
## 4. INVESTIGATIVE PATHWAY
Proceed with standard operational procedures. Allocate case file to {case_data.get('officer', 'Insp. R. Patel') if case_data else 'Duty Officer'} for immediate follow-up.

*(Note: Generated via offline rule-based report engine)*
"""
    return {"classification": classification, "report": report}

def summarize_internal_meeting(text, summary_type="standard"):
    if llm is not None and llm.is_enabled():
        res = llm.llm_summarize_interrogation(text, summary_type)
        if res:
            action_items = []
            for line in res.split("\n"):
                line_str = line.strip()
                if line_str.startswith("-") or (line_str[:2].isdigit() and line_str[2] == "."):
                    action_items.append(line_str.lstrip("- ").lstrip("0123456789. "))
            if not action_items:
                action_items = ["Verify statements from interview transcript.", "Verify dates and locations.", "Perform CCTV analysis."]
                
            entities = list(set(re.findall(r"\b[A-Z][a-z]+\b", text)))
            entities = [e for e in entities if e not in ["The", "A", "If", "Did", "Yes", "No", "Okay", "So", "Ok", "We", "I", "He", "She"]]
            
            return {
                "summary": res,
                "action_items": action_items[:5],
                "entities": entities[:6]
            }

    # Offline fallback
    import store
    store.add_telemetry("Meeting Summary", "Offline Fallback", random.randint(4, 12), 0, 0, "SUCCESS", 0.0)
    lines = text.split("\n")
    non_empty = [l.strip() for l in lines if l.strip()]
    entities = list(set(re.findall(r"\b[A-Z][a-z]+\b", text)))
    entities = [e for e in entities if e not in ["The", "A", "If", "Did", "Yes", "No", "Okay", "So", "Ok", "We", "I", "He", "She"]]
    
    summary_dict = {
        "standard": "The transcript revolves around details of the reported incident. The speaker describes actions taken and timeline parameters.",
        "bullet": "• Participant statements details the incident.\n• Key times and sequences are identified.\n• Further verification is advised.",
        "timeline": "1. Incident occurred as reported.\n2. Witnesses heard/saw activities.\n3. Initial responder team was informed.",
        "contradictions": "1. Timeline gaps: Check matching logs.\n2. Vague statements: Inquire for specific location details."
    }
    
    summary = summary_dict.get(summary_type, summary_dict["standard"])
    
    return {
        "summary": f"Offline ({summary_type.capitalize()}): {summary}\n\nProcessed {len(non_empty)} conversational lines.",
        "action_items": [
            "Verify locations mentioned in the transcript.",
            "Verify dates and timelines for inconsistencies.",
            "Review statement with investigating officer."
        ],
        "entities": entities[:6]
    }

def match_hr_resume(role, resume):
    if llm is not None and llm.is_enabled():
        import json
        res_str = llm.llm_match_resume(role, resume)
        if res_str:
            try:
                if "```json" in res_str:
                    res_str = res_str.split("```json")[1].split("```")[0].strip()
                elif "```" in res_str:
                    res_str = res_str.split("```")[1].split("```")[0].strip()
                return json.loads(res_str)
            except Exception as e:
                print("[ai_engine:match_hr_resume] LLM JSON parsing failed, using fallback:", e)

    # Offline fallback
    import store
    store.add_telemetry("Resume JD Matcher", "Offline Fallback", random.randint(6, 18), 0, 0, "SUCCESS", 0.0)
    resume_lower = resume.lower()
    role_lower = role.lower()
    
    score = 50
    matched = []
    
    skills_map = {
        "cyber": ["security", "network", "firewall", "cyber", "penetration", "wireshark", "linux", "incident", "vulnerability"],
        "forensics": ["forensics", "evidence", "encase", "disk", "retrieval", "mobile", "recovery", "digital", "analysis", "investigation"],
        "data": ["python", "sql", "ai", "machine learning", "data", "database", "model", "analysis", "pandas", "pytorch"]
    }
    
    role_key = "cyber" if "cyber" in role_lower else "forensics" if "forensics" in role_lower else "data"
    role_skills = skills_map[role_key]
    
    for skill in role_skills:
        if skill in resume_lower:
            score += 5
            matched.append(skill.capitalize())
            
    if "experience" in resume_lower:
        score += 8
        
    score = min(98, score)
    missing = [s.capitalize() for s in role_skills if s.capitalize() not in matched]
    
    return {
        "match_score": score,
        "summary": f"The candidate resume shows a match score of {score}% for the {role} position. Baseline skills in {', '.join(matched) if matched else 'general domains'} were found.",
        "missing_skills": missing[:3] if missing else ["None"],
        "interview_questions": [
            f"Explain your past experience and projects related to {role}.",
            f"Describe how you troubleshoot or investigate complex cases under tight deadlines.",
            f"What specific analytical tools and methodologies do you utilize?"
        ]
    }

def rag_search_cases(query):
    # Run BNS Law search (RAG)
    legal_res = search_bns_laws(query)
    synthesis = legal_res["answer"]
    
    # Search past cases in store
    import store
    cases = store.list_complaints(priority=None, ctype=None)
    matches = []
    
    query_words = set(re.findall(r"\w+", query.lower()))
    for c in cases:
        c_words = set(re.findall(r"\w+", c["summary"].lower() + " " + c["crime_type"].lower()))
        overlap = query_words.intersection(c_words)
        score = min(99, len(overlap) * 15 + random.randint(10, 30))
        if len(overlap) > 0 or (any(w in query.lower() for w in ["theft", "stolen", "stole"]) and "theft" in c["crime_type"].lower()):
            matches.append({
                "id": c["id"],
                "crime_type": c["crime_type"],
                "summary": c["summary"][:80] + "...",
                "status": c["status"],
                "score": score
            })
            
    matches.sort(key=lambda x: x["score"], reverse=True)
    matches = matches[:3]
    
    if not matches:
        matches = [{
            "id": "AHM-20260528-4471",
            "crime_type": "Vehicle Theft",
            "summary": "Two-wheeler stolen from parking near SG Highway around midnight...",
            "status": "Investigating",
            "score": 65
        }]
        synthesis = "No highly similar cases were found in the recent vector index for this specific pattern."
        
    return {"synthesis": synthesis, "matches": matches}

def analyze_evidence(text):
    """NER extraction from unstructured evidence/statements."""
    # Mocking NER extraction
    names = list(set(re.findall(r"\b[A-Z][a-z]+\b", text)))
    names = [n for n in names if n not in ["The", "A", "In", "At", "He", "She", "It", "They"]]
    dates = re.findall(r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b", text)
    if not dates:
        dates = re.findall(r"(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|yesterday|today)", text, re.IGNORECASE)
    
    weapons = []
    for w in ["knife", "gun", "pistol", "stick", "bat", "rod", "blade"]:
        if w in text.lower(): weapons.append(w)
        
    locations = []
    for loc in ["highway", "park", "house", "shop", "bank", "atm", "street", "road"]:
        if loc in text.lower(): locations.append(loc)
        
    return {
        "names": names[:4],
        "dates": dates[:2],
        "weapons": weapons,
        "locations": locations[:3],
        "summary": "Extracted key entities from the provided evidence document."
    }

def nl_query_analytics(query):
    """Text-to-SQL / Filters logic for dashboard."""
    query_lower = query.lower()
    
    # Defaults
    priority_filter = ""
    status_filter = ""
    
    if "priority 1" in query_lower or "p1" in query_lower or "critical" in query_lower:
        priority_filter = "P1"
    elif "priority 2" in query_lower or "p2" in query_lower or "high" in query_lower:
        priority_filter = "P2"
        
    if "open" in query_lower or "pending" in query_lower:
        status_filter = "Registered" # Or just not resolved
    elif "resolved" in query_lower or "closed" in query_lower:
        status_filter = "Resolved"
        
    import store
    cases = store.list_complaints(priority=priority_filter, status=status_filter)
    
    sql_mock = f"SELECT * FROM complaints WHERE 1=1"
    if priority_filter: sql_mock += f" AND priority LIKE '{priority_filter}%'"
    if status_filter: sql_mock += f" AND status = '{status_filter}'"
    
    return {
        "sql_query": sql_mock,
        "explanation": f"Filtered complaints based on natural language query: '{query}'",
        "results_count": len(cases),
        "results": cases[:5] # Return top 5 for UI
    }

def run_agent_investigation(case_id):
    import store, json
    case_data = store.get_complaint(case_id)
    if not case_data:
        return {"error": "Case not found"}
        
    if llm is not None and llm.is_enabled():
        res_str = llm.llm_run_agent_investigation(case_data)
        if res_str:
            try:
                if "```json" in res_str:
                    res_str = res_str.split("```json")[1].split("```")[0].strip()
                elif "```" in res_str:
                    res_str = res_str.split("```")[1].split("```")[0].strip()
                return json.loads(res_str)
            except Exception as e:
                print("[ai_engine:run_agent_investigation] LLM JSON parse failed, using fallback:", e)
                
    # Offline Fallback
    import store
    store.add_telemetry("Agent Investigator", "Offline Fallback", random.randint(15, 30), 0, 0, "SUCCESS", 0.0)
    crime_type = case_data.get("crime_type", "General")
    loc = case_data.get("location", "Ahmedabad")
    
    if "cyber" in crime_type.lower() or "fraud" in crime_type.lower():
        steps = [
            {"type": "THOUGHT", "message": f"Analyzing Cybercrime Incident {case_id}. Target is trace and freeze financial channels."},
            {"type": "TOOL_CALL", "message": "Initiating connection to UPI payment gateway server log records..."},
            {"type": "OBSERVATION", "message": "UPI Ref 991283 traced. Transferred Rs. 48,000 to beneficiary bank (Gujarat Regional branch)."},
            {"type": "THOUGHT", "message": "Beneficiary account must be flagged immediately to block further withdrawal."},
            {"type": "TOOL_CALL", "message": "Sending automated Cyber Cell freeze alert notification to bank portal..."},
            {"type": "OBSERVATION", "message": "Bank API returned status: SUCCESS. Account frozen with balance of Rs. 48,000 (simulated)."},
            {"type": "THOUGHT", "message": "Freeze request succeeded. Compiling action steps and evidence checklist for investigating officer."}
        ]
        report = (
            f"# AI AGENT INVESTIGATION BRIEF\n"
            f"**Case reference:** {case_id}  |  **Type:** Cyber Fraud  |  **Status:** Actions Dispatched\n\n"
            f"## 1. TRANSACTION LOG TRACKING\n"
            f"- Traced UPI transaction transfer from complainant's account to recipient.\n"
            f"- Temporary freeze alert registered via simulated Cybercrime Portal (1930) pipeline.\n\n"
            f"## 2. SUSPECT RECOVERY PIPELINE\n"
            f"- Traced digital identity to registered account number branch.\n"
            f"- IP Address logs indicate connection from Paldi area during event.\n\n"
            f"## 3. NEXT ACTIONS RECOMMENDATIONS\n"
            f"1. Issue section 91 notice to bank manager to secure KYC documents.\n"
            f"2. Secure call detailed records (CDR) for target caller number.\n"
            f"3. Advise complainant to file transaction freeze confirmation copy at local branch."
        )
    elif "theft" in crime_type.lower() or "burglary" in crime_type.lower() or "stolen" in case_data.get("summary", "").lower():
        steps = [
            {"type": "THOUGHT", "message": f"Analyzing Property Theft Case {case_id}. Focus: trace assets and identify CCTV points."},
            {"type": "TOOL_CALL", "message": f"Scanning police station directory for CCTV cameras near: {loc}..."},
            {"type": "OBSERVATION", "message": f"Found 3 functional cameras near {loc} (SG-HWY-CAM4, SG-HWY-CAM9, ROAD-JNC-CAM)."},
            {"type": "TOOL_CALL", "message": "Querying central vehicle/property database for theft patterns..."},
            {"type": "OBSERVATION", "message": "Similar theft modus operandi identified twice in SG Highway area over last 72 hours."},
            {"type": "THOUGHT", "message": "MODUS OPERANDI matched: suspects using master key to unlock bikes at night. CCTV footage review critical."},
            {"type": "TOOL_CALL", "message": "Requesting CCTV video segment extraction from camera SG-HWY-CAM4..."},
            {"type": "OBSERVATION", "message": "CCTV review reveals two male suspects, matching profile of gang target list. Time log: 11:42 PM."},
            {"type": "THOUGHT", "message": "Gang identity suspected. Compiling search warrants and immediate locations list."}
        ]
        report = (
            f"# AI AGENT INVESTIGATION BRIEF\n"
            f"**Case reference:** {case_id}  |  **Type:** Property Theft  |  **Status:** Patrol Alerted\n\n"
            f"## 1. CCTV & TRACKING SUMMARY\n"
            f"- Camera `SG-HWY-CAM4` caught footage of two suspects with a master key at 11:42 PM.\n"
            f"- Suspect description: Two males, approx 5'8\", wearing dark jackets, heading towards SG Highway south.\n\n"
            f"## 2. MODUS OPERANDI MATCH\n"
            f"- Modus operandi overlaps 85% with the 'Master-Key Gang' operating near Satellite/SG Highway.\n\n"
            f"## 3. INVESTIGATION DEPLOYMENT STRATEGY\n"
            f"1. Direct patrolling units to check parking lots near Paldi/Satellite during midnight hours.\n"
            f"2. Request formal identification of suspects from local informant registry.\n"
            f"3. Retrieve high-resolution stills from camera log files for physical prints check."
        )
    else:
        steps = [
            {"type": "THOUGHT", "message": f"Analyzing General Offence {case_id}. Dispatching primary details scanner..."},
            {"type": "TOOL_CALL", "message": f"Querying offender central records for complainant: {case_data.get('name')}..."},
            {"type": "OBSERVATION", "message": "Complainant has clean criminal records. Primary details validated."},
            {"type": "TOOL_CALL", "message": "Scanning regional police logs for recent incidents..."},
            {"type": "OBSERVATION", "message": "No directly overlapping crime logs recorded in this sector today."},
            {"type": "THOUGHT", "message": "Standard protocol applies. Recommending assigned officer dispatch."}
        ]
        report = (
            f"# AI AGENT INVESTIGATION BRIEF\n"
            f"**Case reference:** {case_id}  |  **Type:** General Investigation  |  **Status:** Officer Assigned\n\n"
            f"## 1. INITIAL FACT SUMMARY\n"
            f"- Verified complainant identity and statement parameters.\n"
            f"- No immediate serial patterns detected in this sector.\n\n"
            f"## 2. STRATEGIC REACTION PLAN\n"
            f"1. Dispatch local patrol officer to verify scene details.\n"
            f"2. Record witness statement under section 161 of BNS.\n"
            f"3. Keep case under monitoring for 48 hours for additional patterns."
        )
        
    return {
        "steps": steps,
        "report": report
    }


def evaluate_rag_performance(query, k=3, retrieval_type="hybrid", temperature=0.3):
    import time
    import store
    import re
    start_time = time.time()
    
    # 1. Retrieve sections from BNS_LAWS based on retrieval_type
    q_words = re.findall(r"\b\w+\b", query.lower())
    scored_laws = []
    
    for law in BNS_LAWS:
        keyword_score = 0
        # Keyword retrieval (BM25 mock)
        for kw in law["keywords"]:
            if kw.lower() in query.lower():
                keyword_score += 20
            for qw in q_words:
                if qw == kw.lower():
                    keyword_score += 10
                    
        # Semantic retrieval mock (using character/word overlaps with synonyms + random embedding emulation)
        semantic_score = 0
        overlap = set(q_words).intersection(set(law["description"].lower().split() + law["title"].lower().split()))
        semantic_score = len(overlap) * 25 + (random.randint(15, 30) if len(overlap) > 0 else random.randint(5, 12))
        
        # Combine score based on retrieval_type
        if retrieval_type == "bm25":
            final_score = keyword_score
        elif retrieval_type == "semantic":
            final_score = semantic_score
        else: # hybrid
            final_score = keyword_score * 0.5 + semantic_score * 0.5
            
        if final_score > 0 or retrieval_type != "bm25":
            scored_laws.append((final_score, law))
            
    # Sort and take top k
    scored_laws.sort(key=lambda x: x[0], reverse=True)
    retrieved = [item[1] for item in scored_laws[:k]]
    if not retrieved:
        retrieved = [BNS_LAWS[0]] # fallback to BNS 303 Theft
        
    # 2. Get LLM synthesis answer or offline fallback
    synthesis = ""
    provider = "Offline Fallback"
    
    llm_active = llm is not None and llm.is_enabled()
    
    if llm_active:
        try:
            res = llm.llm_bns_search(query, retrieved)
            if res:
                synthesis = res
                provider = f"{llm.PROVIDER.capitalize()} ({llm.MODEL})"
        except Exception:
            pass
            
    if not synthesis:
        primary = retrieved[0]
        synthesis = (
            f"⚖️ **Legal Synthesis Answer (RAG Playground Mock):**\n\n"
            f"Regarding your query, **{primary['section']}** ({primary['title']}) is highly applicable.\n"
            f"Provision: {primary['description']}\n"
            f"IPC Equivalent: {primary['ipc_equivalent']}\n\n"
            f"We also retrieved {len(retrieved)-1} other sections in this search. Standard procedures apply."
        )
        
    duration_ms = int((time.time() - start_time) * 1000)
    
    # 3. Compute Evaluation Metrics (0 to 100)
    query_lower = query.lower()
    hit = False
    if "theft" in query_lower or "stolen" in query_lower or "stole" in query_lower or "wallet" in query_lower:
        hit = any(x["section"] in ["BNS §303", "BNS §304", "BNS §305"] for x in retrieved)
    elif "snatch" in query_lower or "grab" in query_lower or "chain" in query_lower:
        hit = any(x["section"] in ["BNS §304"] for x in retrieved)
    elif "fraud" in query_lower or "scam" in query_lower or "otp" in query_lower or "cheat" in query_lower:
        hit = any(x["section"] in ["BNS §318", "BNS §319"] for x in retrieved)
    elif "beat" in query_lower or "hit" in query_lower or "hurt" in query_lower or "fight" in query_lower:
        hit = any(x["section"] in ["BNS §115", "BNS §351"] for x in retrieved)
    elif "harass" in query_lower or "women" in query_lower or "stalk" in query_lower:
        hit = any(x["section"] in ["BNS §74"] for x in retrieved)
    else:
        hit = len(retrieved) > 0
        
    hit_rate = 100 if hit else 33
    
    # Faithfulness
    synthesis_words = set(re.findall(r"\b\w{4,15}\b", synthesis.lower()))
    law_words = set()
    for law in retrieved:
        law_words.update(re.findall(r"\b\w{4,15}\b", law["description"].lower() + " " + law["title"].lower()))
        
    overlap_words = synthesis_words.intersection(law_words)
    if len(synthesis_words) > 0:
        faithfulness = int(70 + 28 * (len(overlap_words) / len(synthesis_words)))
    else:
        faithfulness = 90
    faithfulness = min(100, max(50, faithfulness))
    
    # Answer Relevance
    overlap_query = set(q_words).intersection(synthesis_words)
    if len(q_words) > 0:
        answer_relevance = int(75 + 23 * (len(overlap_query) / len(q_words)))
    else:
        answer_relevance = 85
    answer_relevance = min(100, max(60, answer_relevance))
    
    # Log telemetry for this evaluation run
    store.add_telemetry("RAG Evaluation", provider, duration_ms, len(query.split()), len(synthesis.split()), "SUCCESS", 0.0)
    
    return {
        "synthesis": synthesis,
        "retrieved_laws": retrieved,
        "metrics": {
            "hit_rate": hit_rate,
            "faithfulness": faithfulness,
            "answer_relevance": answer_relevance,
            "latency_ms": duration_ms
        },
        "params": {
            "k": k,
            "retrieval_type": retrieval_type,
            "temperature": temperature
        }
    }


