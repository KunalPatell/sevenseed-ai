# -*- coding: utf-8 -*-
"""
Decode Forest Pharmacy — Advanced Clinical & Savings Tools
Inspired by Tata 1mg, PharmEasy, GoodRx, and Drugs.com:
1. Generic Medicine Substitute & Cost Saver Calculator (Jan Aushadhi / bioequivalent generic pricing vs Big Pharma brands)
2. Smart Pill Identifier & Food-Drug Interaction Matrix (visual shape, color, imprint search + dietary cautions)
3. Forest Ayurvedic & Herbal Remedies Guide (evidence-backed botanical alternatives with modern clinical contraindications)
"""
from __future__ import annotations
from typing import Dict, List, Any, Optional

GENERIC_SAVINGS_CATALOGUE = [
    {
        "id": "gen-1",
        "brand_name": "Augmentin 625 Duo",
        "brand_mfr": "GSK (GlaxoSmithKline)",
        "brand_price": 223.50,
        "generic_salt": "Amoxycillin (500mg) + Clavulanic Acid (125mg)",
        "generic_name": "Amoxycillin & Pot. Clavulanate Tablets IP 625mg",
        "generic_price": 62.00,
        "jan_aushadhi_price": 45.00,
        "savings_pct": 79.8,
        "savings_inr": 178.50,
        "bioequivalence": "CDSCO & US-FDA Bioequivalent Standard compliant",
        "category": "Antibiotic",
        "dosage_form": "Tablet",
        "use": "Bacterial respiratory, ear, and soft tissue infections"
    },
    {
        "id": "gen-2",
        "brand_name": "Lipitor 20mg / Atorva 20",
        "brand_mfr": "Pfizer / Zydus",
        "brand_price": 285.00,
        "generic_salt": "Atorvastatin Calcium (20mg)",
        "generic_name": "Atorvastatin Tablets IP 20mg",
        "generic_price": 42.00,
        "jan_aushadhi_price": 25.00,
        "savings_pct": 91.2,
        "savings_inr": 260.00,
        "bioequivalence": "Pharmacopoeia IP/USP Certified",
        "category": "Cardiovascular / Statin",
        "dosage_form": "Film-coated Tablet",
        "use": "LDL cholesterol lowering and cardiovascular prophylaxis"
    },
    {
        "id": "gen-3",
        "brand_name": "Glycomet-GP 2 Forte",
        "brand_mfr": "USV Ltd",
        "brand_price": 148.00,
        "generic_salt": "Metformin (1000mg) + Glimepiride (2mg)",
        "generic_name": "Metformin SR & Glimepiride Tablets IP",
        "generic_price": 38.50,
        "jan_aushadhi_price": 28.00,
        "savings_pct": 81.0,
        "savings_inr": 120.00,
        "bioequivalence": "Sustained-Release In-Vitro Dissolution Validated",
        "category": "Antidiabetic",
        "dosage_form": "Bilayered Tablet",
        "use": "Type 2 Diabetes Mellitus glycemic control"
    },
    {
        "id": "gen-4",
        "brand_name": "Pan-D / Pantocid-DSR",
        "brand_mfr": "Alkem Laboratories / Sun Pharma",
        "brand_price": 198.00,
        "generic_salt": "Pantoprazole (40mg) + Domperidone (30mg SR)",
        "generic_name": "Pantoprazole Gastro-resistant & Domperidone Prolonged-Release",
        "generic_price": 45.00,
        "jan_aushadhi_price": 32.00,
        "savings_pct": 83.8,
        "savings_inr": 166.00,
        "bioequivalence": "Enteric Coated Bioequivalent to Reference Listed Drug",
        "category": "Gastroenterology / Antacid",
        "dosage_form": "Capsule",
        "use": "Severe GERD, hyperacidity, and reflux esophagitis"
    },
    {
        "id": "gen-5",
        "brand_name": "Telma 40 / Micardis",
        "brand_mfr": "Glenmark Pharmaceuticals / Boehringer Ingelheim",
        "brand_price": 155.00,
        "generic_salt": "Telmisartan (40mg)",
        "generic_name": "Telmisartan Tablets IP 40mg",
        "generic_price": 34.00,
        "jan_aushadhi_price": 22.00,
        "savings_pct": 85.8,
        "savings_inr": 133.00,
        "bioequivalence": "Angiotensin II Receptor Antagonist Certified",
        "category": "Antihypertensive",
        "dosage_form": "Tablet",
        "use": "Essential hypertension and stroke prevention"
    },
    {
        "id": "gen-6",
        "brand_name": "Allegra 120mg",
        "brand_mfr": "Sanofi India",
        "brand_price": 218.00,
        "generic_salt": "Fexofenadine HCl (120mg)",
        "generic_name": "Fexofenadine Hydrochloride Tablets IP",
        "generic_price": 48.00,
        "jan_aushadhi_price": 35.00,
        "savings_pct": 83.9,
        "savings_inr": 183.00,
        "bioequivalence": "Non-sedating Antihistamine Formulation Standard",
        "category": "Allergy / Antihistamine",
        "dosage_form": "Tablet",
        "use": "Seasonal allergic rhinitis and chronic idiopathic urticaria"
    },
    {
        "id": "gen-7",
        "brand_name": "Thyronorm 50mcg / Eltroxin",
        "brand_mfr": "Abbott Healthcare / GSK",
        "brand_price": 162.00,
        "generic_salt": "Thyroxine Sodium (50mcg)",
        "generic_name": "Levothyroxine Sodium Tablets IP 50 mcg",
        "generic_price": 42.00,
        "jan_aushadhi_price": 30.00,
        "savings_pct": 81.4,
        "savings_inr": 132.00,
        "bioequivalence": "Narrow Therapeutic Index Certified & Batch-Assayed",
        "category": "Endocrinology",
        "dosage_form": "Tablet",
        "use": "Hypothyroidism replacement therapy"
    },
    {
        "id": "gen-8",
        "brand_name": "Shelcal 500",
        "brand_mfr": "Torrent Pharmaceuticals",
        "brand_price": 131.00,
        "generic_salt": "Calcium Carbonate (1250mg eq to 500mg elemental Ca) + Vitamin D3 (250 IU)",
        "generic_name": "Calcium with Vitamin D3 Tablets IP",
        "generic_price": 32.00,
        "jan_aushadhi_price": 20.00,
        "savings_pct": 84.7,
        "savings_inr": 111.00,
        "bioequivalence": "USP Elemental Mineral & Cholecalciferol Assayed",
        "category": "Nutraceutical / Bone Health",
        "dosage_form": "Tablet",
        "use": "Osteopenia, osteoporosis, calcium deficiency prophylaxis"
    }
]

PILL_IDENTIFIER_CATALOGUE = [
    {
        "id": "pill-1",
        "name": "Dolo 650",
        "shape": "Capsule-shaped (Caplet)",
        "color": "White",
        "imprint": "DOLO 650",
        "scoring": "Single bisect line",
        "active_ingredient": "Paracetamol 650mg",
        "category": "Antipyretic / Analgesic",
        "dose_instruction": "Take with half glass of water. Interval of at least 4-6 hours.",
        "food_caution": "Can be taken with or without food. Avoid alcohol completely (hepatotoxicity risk).",
        "grapefruit_safe": True
    },
    {
        "id": "pill-2",
        "name": "Atorva 10 / Lipitor",
        "shape": "Round",
        "color": "White",
        "imprint": "AT 10",
        "scoring": "Unscored",
        "active_ingredient": "Atorvastatin Calcium 10mg",
        "category": "HMG-CoA Reductase Inhibitor",
        "dose_instruction": "Take once daily, preferably at night before sleep.",
        "food_caution": "CRITICAL: Do NOT consume Grapefruit or grapefruit juice (inhibits CYP3A4, causing 3x toxic blood levels).",
        "grapefruit_safe": False
    },
    {
        "id": "pill-3",
        "name": "Omez 20",
        "shape": "Capsule",
        "color": "Pink / White",
        "imprint": "OMEZ 20",
        "scoring": "Hard gelatin shell with enteric coated pellets",
        "active_ingredient": "Omeprazole 20mg",
        "category": "Proton Pump Inhibitor (PPI)",
        "dose_instruction": "Take strictly 30 to 45 minutes BEFORE the first meal/breakfast of the day.",
        "food_caution": "Do not chew or crush pellets inside capsule. Swallow whole with plain water.",
        "grapefruit_safe": True
    },
    {
        "id": "pill-4",
        "name": "Combiflam",
        "shape": "Oval",
        "color": "White",
        "imprint": "CF",
        "scoring": "Scored on reverse",
        "active_ingredient": "Ibuprofen 400mg + Paracetamol 325mg",
        "category": "NSAID Combination",
        "dose_instruction": "Take immediately after a substantial meal.",
        "food_caution": "NEVER take on an empty stomach (causes gastric mucosal bleeding/ulcers). Avoid dairy within 30 min.",
        "grapefruit_safe": True
    },
    {
        "id": "pill-5",
        "name": "Azee 500",
        "shape": "Oblong",
        "color": "Blue / Light Sky Blue",
        "imprint": "AZ 500",
        "scoring": "Film-coated",
        "active_ingredient": "Azithromycin Dihydrate 500mg",
        "category": "Macrolide Antibiotic",
        "dose_instruction": "Take once daily for exactly 3 to 5 days as prescribed.",
        "food_caution": "Take 1 hour before food or 2 hours after food for optimal absorption. Avoid antacids within 2 hours.",
        "grapefruit_safe": True
    },
    {
        "id": "pill-6",
        "name": "Thyronorm 50",
        "shape": "Small Round",
        "color": "Pale Yellow / Cream",
        "imprint": "50",
        "scoring": "Scored",
        "active_ingredient": "Thyroxine Sodium 50mcg",
        "category": "Thyroid Hormone",
        "dose_instruction": "Take first thing in the morning with plain water.",
        "food_caution": "Wait at least 30-45 minutes before tea, coffee, breakfast, or calcium/iron supplements (binding hazard).",
        "grapefruit_safe": True
    }
]

HERBAL_AYURVEDIC_CATALOGUE = [
    {
        "id": "herb-1",
        "remedy_name": "Ashwagandha (Indian Ginseng)",
        "botanical_name": "Withania somnifera",
        "category": "Adaptogen & Stress / Vitality",
        "active_compounds": "Withanolides, Withaferin A, Alkaloids",
        "evidence_rating": "Strong Clinical Evidence (Double-Blind RCTs)",
        "benefits": "Reduces cortisol by up to 30%, improves sleep architecture, supports cognitive focus and athletic VO2 max.",
        "contraindications": "Caution with thyroid medications (stimulates T3/T4) and autoimmune conditions. Avoid during pregnancy.",
        "recommended_form": "KSM-66 or Shoden standardized root extract (300-600mg daily with warm milk/water)"
    },
    {
        "id": "herb-2",
        "remedy_name": "Curcumin 95% + Piperine (Turmeric Extract)",
        "botanical_name": "Curcuma longa + Piper nigrum",
        "category": "Anti-inflammatory & Joint Mobility",
        "active_compounds": "Curcuminoids (Curcumin, Demethoxycurcumin), Piperine",
        "evidence_rating": "Extensive Global Clinical Trial Validation",
        "benefits": "Potent NF-kB pathway inhibition; reduces joint pain equivalent to 400mg Ibuprofen without gastric erosion.",
        "contraindications": "Mild blood thinning action. Stop 2 weeks prior to elective surgery. Caution with gallstones.",
        "recommended_form": "Standardized 95% curcuminoids paired with 5mg Piperine for 2000% increased bioavailability"
    },
    {
        "id": "herb-3",
        "remedy_name": "Triphala (Forest Digestive Triad)",
        "botanical_name": "Emblica officinalis, Terminalia bellirica, Terminalia chebula",
        "category": "Gastrointestinal & Colon Cleanse",
        "active_compounds": "Tannins, Gallic acid, Chebulagic acid, Ascorbic acid",
        "evidence_rating": "Traditional Ayurvedic Classic + Microbiome Studies",
        "benefits": "Gentle peristalsis stimulation, healthy gut microbiome modulation, non-habit forming bowel regularity.",
        "contraindications": "Avoid in acute diarrhoea or severe dysentery. Safe for long-term gut support.",
        "recommended_form": "Churna powder or tablet (1-2g at bedtime with lukewarm water)"
    },
    {
        "id": "herb-4",
        "remedy_name": "Giloy / Guduchi (Amrita)",
        "botanical_name": "Tinospora cordifolia",
        "category": "Immunomodulator & Platelet Booster",
        "active_compounds": "Tinosporine, Cordifolioside A, Berberine",
        "evidence_rating": "Clinically validated for seasonal fevers and viral convalescence",
        "benefits": "Enhances macrophage phagocytic activity, supports liver enzyme detoxification, supports platelet recovery.",
        "contraindications": "Can lower blood sugar; diabetics should monitor blood glucose levels closely.",
        "recommended_form": "Stem juice extract (Ghanvati) 500mg twice daily with meals"
    },
    {
        "id": "herb-5",
        "remedy_name": "Brahmi (Bacopa Monnieri)",
        "botanical_name": "Bacopa monnieri",
        "category": "Nootropic & Memory Enhancement",
        "active_compounds": "Bacosides A & B, Herpestine",
        "evidence_rating": "Strong Neuropharmacology Evidence",
        "benefits": "Enhances synaptic nerve transmission, improves synaptic plasticity, boosts memory retention & calm alertness.",
        "contraindications": "Take with dietary fats to prevent minor nausea. Do not combine with high-dose anticholinergics.",
        "recommended_form": "Synapsa or Bacomind standardized extract (300mg daily with breakfast)"
    },
    {
        "id": "herb-6",
        "remedy_name": "Tulsi (Holy Basil)",
        "botanical_name": "Ocimum sanctum",
        "category": "Respiratory Health & Anti-viral",
        "active_compounds": "Eugenol, Ursolic acid, Rosmarinic acid",
        "evidence_rating": "Broad spectrum antimicrobial and adaptogenic",
        "benefits": "Clears bronchial congestion, liquefies mucus, calms stress-induced bronchial spasms, relieves allergic cough.",
        "contraindications": "May mildly thin blood; safe for all age groups in customary tea or extract forms.",
        "recommended_form": "Organic leaf infusion tea or 5-drop aqueous liquid extract in warm water"
    }
]

def search_generic_savings(query: str = "") -> Dict[str, Any]:
    q = query.strip().lower()
    if not q:
        items = GENERIC_SAVINGS_CATALOGUE
    else:
        items = [
            m for m in GENERIC_SAVINGS_CATALOGUE
            if q in m["brand_name"].lower()
            or q in m["generic_salt"].lower()
            or q in m["generic_name"].lower()
            or q in m["category"].lower()
        ]
    total_savings_inr = sum(item["savings_inr"] for item in items)
    avg_savings_pct = round(sum(item["savings_pct"] for item in items) / (len(items) or 1), 1)
    return {
        "query": query,
        "count": len(items),
        "results": items,
        "summary": {
            "avg_savings_pct": avg_savings_pct,
            "max_possible_savings_inr": total_savings_inr
        }
    }

def identify_pill(shape: Optional[str] = None, color: Optional[str] = None, query: Optional[str] = None) -> Dict[str, Any]:
    results = PILL_IDENTIFIER_CATALOGUE
    if shape and shape != "all":
        results = [p for p in results if shape.lower() in p["shape"].lower()]
    if color and color != "all":
        results = [p for p in results if color.lower() in p["color"].lower()]
    if query:
        q = query.strip().lower()
        results = [
            p for p in results
            if q in p["name"].lower() or q in p["imprint"].lower() or q in p["active_ingredient"].lower()
        ]
    return {
        "matched_count": len(results),
        "results": results,
        "disclaimer": "Visual pill identification is an assistive aid. Always verify with a licensed pharmacist or prescribing physician before consumption."
    }

def get_herbal_remedies(category: Optional[str] = None) -> Dict[str, Any]:
    remedies = HERBAL_AYURVEDIC_CATALOGUE
    if category and category != "all":
        remedies = [r for r in remedies if category.lower() in r["category"].lower()]
    return {
        "count": len(remedies),
        "remedies": remedies,
        "philosophy": "Decode Forest Pharmacy bridges ancient Vedic botanical science with modern bio-assays and safety contraindications."
    }
