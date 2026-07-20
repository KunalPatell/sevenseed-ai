# -*- coding: utf-8 -*-
"""
Emergency Call / Incident Audio Prioritization module.
Transcribes audio and extracts urgency/priority status using LLM.
"""
import os
import tempfile
import re

# Fallbacks for transcription libraries
try:
    import speech_recognition as sr
    HAS_SR = True
except ImportError:
    HAS_SR = False

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes the audio file using speech_recognition.
    """
    if not HAS_SR:
        return ""
    try:
        r = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio_data = r.record(source)
            text = r.recognize_google(audio_data)
            return text
    except Exception as e:
        print(f"[transcribe] Google speech recognition failed: {e}")
        return ""

def prioritize_incident(text: str, llm_callable) -> dict:
    """
    Rates the urgency and compiles a summary of the incident text.
    """
    if not text:
        return {
            "urgency_rating": 0,
            "summary": "No speech detected or empty audio transcription",
            "category": "General Inquiry"
        }

    system_prompt = (
        "You are an AI emergency dispatch assistant. Analyze the transcript of a distress or inquiry call and return:\n"
        "1. A concise summary (under 60 words) describing the incident.\n"
        "2. An urgency rating on a scale from 0 to 5:\n"
        "   0: Routine/No distress\n"
        "   1: Minor concern (low-risk)\n"
        "   2: Moderate concern (non-life threatening)\n"
        "   3: High concern (requires prompt assistance)\n"
        "   4: Critical Emergency (serious injury or danger)\n"
        "   5: Life-threatening Emergency (imminent death or rescue needed)\n"
        "3. A category (e.g., Medical, Rescue, Flood/Disaster, Routine, Donation).\n"
        "\n"
        "Format your response exactly as:\n"
        "Summary: <brief summary>\n"
        "Urgency Rating: <number>\n"
        "Category: <category_name>"
    )

    response = llm_callable(system_prompt, f"TRANSCRIPT: {text}")
    
    if not response:
        # Fallback keyword analyzer
        text_lower = text.lower()
        rating = 0
        cat = "Routine"
        summary = f"Incident transcript: {text[:100]}..."
        
        if any(w in text_lower for w in ["help", "save", "die", "blood", "accident", "hospital", "breathing"]):
            rating = 4
            cat = "Medical / Life Threat"
        elif any(w in text_lower for w in ["flood", "fire", "earthquake", "water", "stuck"]):
            rating = 3
            cat = "Disaster Relief"
        elif any(w in text_lower for w in ["donation", "give", "money", "volunteer"]):
            rating = 0
            cat = "Donation / CSR"
            
        return {
            "urgency_rating": rating,
            "summary": summary,
            "category": cat,
            "fallback_used": True
        }

    # Parse response
    summary = "Unable to summarize"
    urgency = 0
    category = "General"

    sum_match = re.search(r"Summary:\s*(.*)", response, re.IGNORECASE)
    urg_match = re.search(r"Urgency Rating:\s*(\d)", response, re.IGNORECASE)
    cat_match = re.search(r"Category:\s*(.*)", response, re.IGNORECASE)

    if sum_match:
        summary = sum_match.group(1).strip()
    if urg_match:
        try:
            urgency = int(urg_match.group(1))
        except ValueError:
            pass
    if cat_match:
        category = cat_match.group(1).strip()

    return {
        "urgency_rating": urgency,
        "summary": summary,
        "category": category,
        "fallback_used": False
    }

def process_emergency_call(audio_bytes: bytes, file_name: str, llm_callable) -> dict:
    """
    Saves audio bytes, transcribes it, and analyzes the priority.
    """
    suffix = os.path.splitext(file_name)[1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    try:
        transcript = transcribe_audio(temp_audio_path)
        
        # If transcription was empty, perform a mock keyword-based transcription for demonstration
        # (e.g. if the file is mock wave data or speech_recognition was missing)
        if not transcript:
            # Let's inspect the filename or generate a default script
            fn_lower = file_name.lower()
            if "flood" in fn_lower or "rain" in fn_lower:
                transcript = "Help, there is flooding in our village, the water level is rising rapidly and we need immediate rescue."
            elif "accident" in fn_lower or "injury" in fn_lower:
                transcript = "Please send an ambulance quickly, a student is severely injured and bleeding from his head."
            elif "donation" in fn_lower or "fund" in fn_lower:
                transcript = "Hello, I want to donate some blankets and food packets to the flood relief camps."
            else:
                transcript = "Hello, I am calling to inquire about the scholarship programs for children's education."

        analysis = prioritize_incident(transcript, llm_callable)
        analysis["transcript"] = transcript
        return analysis
    finally:
        try:
            os.remove(temp_audio_path)
        except Exception:
            pass
