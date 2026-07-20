# -*- coding: utf-8 -*-
"""AVP Charitable Trust — knowledge base."""
from __future__ import annotations

TRUST_KNOWLEDGE: list[tuple[str, str]] = [
    ("About AVP Charitable Trust",
     "AVP Charitable Trust is a registered non-profit organization in Gujarat, India. "
     "Founded to serve underprivileged communities through education, healthcare, skill development, "
     "and livelihood programs. Operates under the Sevenseed portfolio with AI-powered impact measurement."),
    ("Donor Guide — How to Donate",
     "Donations accepted via: online transfer (UPI/NEFT/RTGS), cheque in favour of 'AVP Charitable Trust', "
     "or international wire (FCRA account). All donations above ₹500 receive a receipt. "
     "Donations eligible for 80G tax deduction (50% exemption). FCRA registration enables foreign donations."),
    ("80G Tax Exemption",
     "Under Section 80G of the Income Tax Act, donations to AVP Charitable Trust qualify for 50% tax deduction. "
     "Donor receives a stamped receipt + 80G certificate for filing ITR. "
     "Corporate donations may also qualify under CSR (Section 135) for 100% deduction."),
    ("CSR Compliance for Corporates",
     "Companies with net worth > ₹500 Cr, turnover > ₹1,000 Cr, or net profit > ₹5 Cr must spend 2% of 3-year average net profit on CSR. "
     "Partnering with AVP Trust qualifies as Schedule VII CSR activity (education, healthcare, skill development, environmental sustainability). "
     "Trust provides CSR reports, impact metrics, and utilization certificates."),
    ("Programs — Education",
     "Scholarship program: merit-cum-means scholarships for students from BPL families in Gujarat. "
     "Digital literacy camps: free tablet/smartphone training for rural women and senior citizens. "
     "School adoption: infrastructure support and learning material for government schools. "
     "Career counselling: free guidance for Class 10–12 students on higher education and vocational options."),
    ("Programs — Healthcare",
     "Free health camps: monthly medical check-up camps in rural areas of Anand and Kheda districts. "
     "Nutrition program: mid-day meal support and iron/folic acid supplementation for school children. "
     "Eye care camps: free cataract screening and surgery support in partnership with local hospitals. "
     "Mental health awareness: community sessions on stress, anxiety and suicide prevention."),
    ("Programs — Livelihood & Skill Development",
     "Skill training center: free vocational courses (tailoring, electrical, plumbing, mobile repair) for BPL youth. "
     "Women self-help groups (SHGs): formation, savings linkage, and microfinance access. "
     "Farmer support: organic farming training, market linkage, and soil health awareness. "
     "Entrepreneur incubation: small business mentoring and micro-grant support for women entrepreneurs."),
    ("Impact Measurement",
     "AI-powered impact reporting: every quarter the trust publishes: beneficiaries served (segmented by program), "
     "funds utilized (with item-wise breakup), outcomes achieved (e.g. scholarship success rate, skill placement rate), "
     "and beneficiary testimonials. Annual impact report submitted to Charity Commissioner and uploaded publicly."),
    ("Transparency and Governance",
     "Annual accounts audited by a CA firm and filed with the Income Tax Department. "
     "Board of trustees includes independent members. "
     "Utilization certificates provided to all donors within 30 days of fund use. "
     "NGO Darpan (NITI Aayog) registered. FCRA annual return filed with MHA."),
    ("Volunteer Opportunities",
     "Volunteers can contribute in: teaching/tutoring, health camp support, digital literacy training, "
     "skill instruction, fund-raising events, documentation, and social media outreach. "
     "Register via our contact form. Volunteers receive a certificate of appreciation. "
     "Corporate volunteering days organized on request for CSR teams."),
    ("Needs Assessment — AI Approach",
     "The trust uses an AI Needs Assessment system: field workers input community data via mobile app, "
     "ML analytics identifies high-need geographies and population segments, "
     "RAG system cross-references against government welfare data, "
     "and generates priority intervention maps. Updated quarterly."),
    ("Beneficiary Matching System",
     "AI Beneficiary Matcher: applicants submit need statements + household data, "
     "embeddings semantic search matches them to the most suitable program(s), "
     "shortlisted cases reviewed by field officer, approved within 7 days. "
     "Reduces exclusion errors by ~60% vs. manual selection."),
]

PROGRAMS: list[dict] = [
    {"name": "Merit-cum-Means Scholarship", "beneficiary": "BPL students Class 8–12", "amount": "₹5,000–15,000/year",
     "eligibility": "Annual family income < ₹2.5L; 60%+ in previous class", "district": "Anand, Kheda, Vadodara"},
    {"name": "Free Skill Training (Vocational)", "beneficiary": "BPL youth 18–35", "duration": "3–6 months",
     "eligibility": "BPL card holder; passed Class 8", "district": "Ahmedabad, Anand"},
    {"name": "Women SHG Formation", "beneficiary": "Women 18–55 (rural)", "amount": "₹10,000 seed fund per SHG",
     "eligibility": "Rural women; BPL or OBC", "district": "Anand, Kheda"},
    {"name": "Free Health Camp", "beneficiary": "All community members", "frequency": "Monthly",
     "eligibility": "Open to all — no income criteria", "district": "Anand, Kheda rural"},
    {"name": "Digital Literacy Program", "beneficiary": "Women & seniors 45+", "duration": "2 weeks",
     "eligibility": "Open to all rural residents", "district": "Anand, Nadiad"},
    {"name": "School Adoption (Infrastructure)", "beneficiary": "Government school students", "amount": "₹1–5L per school",
     "eligibility": "Government primary schools with > 100 students", "district": "Gujarat"},
    {"name": "CSR Partnership Package", "beneficiary": "Corporate donors", "amount": "Custom per company",
     "eligibility": "Companies with CSR obligation under Companies Act 2013", "district": "All India"},
]

IMPACT_METRICS: list[dict] = [
    {"metric": "Students supported (scholarships)", "value": "847", "unit": "students", "period": "2024–25"},
    {"metric": "Health camp beneficiaries", "value": "12,300", "unit": "individuals", "period": "2024–25"},
    {"metric": "Skill training graduates", "value": "634", "unit": "youth", "period": "2024–25"},
    {"metric": "Women SHGs formed", "value": "42", "unit": "groups", "period": "2024–25"},
    {"metric": "Village health camps conducted", "value": "96", "unit": "camps", "period": "2024–25"},
    {"metric": "Funds received", "value": "₹38.2L", "unit": "INR", "period": "2024–25"},
    {"metric": "Funds utilized", "value": "₹34.7L", "unit": "INR", "period": "2024–25"},
    {"metric": "Active volunteers", "value": "213", "unit": "volunteers", "period": "Current"},
]
