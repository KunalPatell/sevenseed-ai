# -*- coding: utf-8 -*-
"""Breakdown Factor Construction — knowledge base."""
from __future__ import annotations

CONSTRUCTION_KNOWLEDGE: list[tuple[str, str]] = [
    ("Site Safety Protocols",
     "PPE requirements: hard hat, safety boots, high-vis vest, gloves mandatory on all sites. "
     "Scaffold must be inspected by a competent person every 7 days. Excavation > 1.2m requires shoring. "
     "All electrical work requires licensed contractor. Fire extinguisher every 200 sqm. "
     "First aid kit and trained first aider required on all sites."),
    ("Cost Estimation — Foundation",
     "PCC (Plain Cement Concrete) M15 footings: ₹4,500–6,000/cum. RCC M20 isolated footing: ₹7,500–9,000/cum. "
     "Raft foundation: ₹8,000–11,000/cum. Pile foundation: ₹1,200–2,000/running metre. "
     "Soil investigation (boring test) before foundation design is mandatory for G+3 and above."),
    ("Cost Estimation — Structure",
     "RCC framed structure (columns, beams, slabs) at M20 grade: ₹10,000–14,000/cum. "
     "Load-bearing brick masonry: ₹450–650/sqm. Flat slab: ₹550–750/sqft. "
     "Steel: ₹55,000–70,000/tonne (Fe500 TMT bars, 2025 rates)."),
    ("Cost Estimation — Finishing",
     "Plastering (internal 12mm): ₹35–55/sqft. Tiles (ceramic 600x600): ₹60–100/sqft incl. labour. "
     "Vitrified tiles: ₹90–160/sqft. Painting (2-coat emulsion): ₹18–28/sqft. "
     "Wooden door frame + shutter (teak): ₹12,000–18,000/unit. UPVC window: ₹900–1,400/sqft."),
    ("Construction Schedule — Typical Phases",
     "Site preparation + foundation: 4–8 weeks. Superstructure (per floor): 3–5 weeks. "
     "Brickwork + lintel: 2–3 weeks/floor. Plastering: 2–4 weeks. MEP rough-in: concurrent. "
     "Flooring + finishing: 4–6 weeks. External works: 2–4 weeks. "
     "Rule of thumb: G+2 residential = 14–18 months with quality control."),
    ("Material Estimation — Concrete",
     "M20 concrete mix ratio: 1:1.5:3 (cement:sand:aggregate). Per cum: 8 bags cement (50kg), 0.45 cum sand, 0.9 cum aggregate. "
     "Wastage factor: add 5–10%. Thumb rule: 0.04 cum concrete per sqft of built-up area (columns + slabs + beams)."),
    ("Material Estimation — Brickwork",
     "Standard brick (230x115x75mm): 500 bricks/cum with mortar. "
     "Per 100 sqft 9-inch wall: ~500 bricks, 1.5 bags cement, 0.3 cum sand. "
     "Add 5% wastage. AAC blocks (lightweight): 30% less mortar, better thermal insulation."),
    ("Material Estimation — Steel",
     "Thumb rule for RCC structures: 80–100 kg steel per cum of concrete. "
     "Slabs: 40–60 kg/cum. Columns: 100–150 kg/cum. Beams: 80–120 kg/cum. "
     "Use IS 1786 Fe500/Fe550 grade TMT bars. Lapping length: 40× bar diameter."),
    ("Defect Detection — Structural",
     "Cracks: hairline (<0.2mm) = cosmetic; >0.3mm = structural, needs engineer assessment. "
     "Diagonal cracks at corners = settlement; horizontal cracks in walls = lateral pressure. "
     "Honeycombing in concrete = poor compaction; rebar corrosion = spalling. "
     "All structural defects must be assessed by a licensed structural engineer."),
    ("Defect Detection — Surface",
     "Efflorescence (white salt deposits) = moisture penetration; fix waterproofing. "
     "Plaster delamination = poor bonding/moisture; hack and re-plaster. "
     "Paint peeling = moisture/poor prep; sand and repaint with primer. "
     "Tile lippage > 2mm = poor installation; grouting issues = water ingress."),
    ("Quality Assurance — Concrete",
     "Slump test: workability check; target 75–125mm for structural concrete. "
     "Cube test (150mm): test at 7 days (70% strength) and 28 days (100%). "
     "M20 target mean strength: 26.6 MPa at 28 days. "
     "Core test required if 28-day cube fails. IS 456:2000 governs Indian RCC design."),
    ("Project Costing — Per Sqft Rates India 2025",
     "Economy construction (Ahmedabad/Gujarat): ₹1,400–1,800/sqft built-up. "
     "Standard residential: ₹1,800–2,500/sqft. Premium: ₹2,500–4,000/sqft. "
     "Commercial (office): ₹2,000–3,500/sqft. Industrial shed: ₹800–1,500/sqft. "
     "These exclude land, boundary wall, external development, and GST."),
    ("Legal and Compliance",
     "Building permit required before construction. Commencement certificate from local authority. "
     "Structure certificate from licensed structural engineer mandatory for G+3 and above. "
     "Occupancy certificate required before occupation. RERA registration for residential projects > 500 sqm or > 8 units. "
     "Environmental clearance for projects > 20,000 sqm built-up area."),
    ("AI in Construction",
     "Computer vision for safety monitoring: hard hat/PPE detection via YOLO real-time. "
     "Drone photogrammetry: site progress tracking, earthwork volume estimation. "
     "BIM (Building Information Modelling): clash detection, 4D scheduling. "
     "AI cost forecasting: ML models trained on historical BoQ data predict cost overruns. "
     "Defect detection: crack measurement via deep learning from site photos."),
]

COST_ITEMS: list[dict] = [
    {"item": "PCC Foundation", "unit": "cum", "rate_low": 4500, "rate_high": 6000, "category": "Foundation"},
    {"item": "RCC M20 Foundation", "unit": "cum", "rate_low": 7500, "rate_high": 9000, "category": "Foundation"},
    {"item": "RCC Frame (columns/beams/slabs)", "unit": "cum", "rate_low": 10000, "rate_high": 14000, "category": "Structure"},
    {"item": "Brickwork 9-inch wall", "unit": "cum", "rate_low": 4500, "rate_high": 6500, "category": "Structure"},
    {"item": "Brickwork 4.5-inch wall", "unit": "cum", "rate_low": 3000, "rate_high": 4200, "category": "Structure"},
    {"item": "Plastering (internal)", "unit": "sqft", "rate_low": 35, "rate_high": 55, "category": "Finishing"},
    {"item": "Ceramic Tiles 600x600", "unit": "sqft", "rate_low": 60, "rate_high": 100, "category": "Finishing"},
    {"item": "Vitrified Tiles", "unit": "sqft", "rate_low": 90, "rate_high": 160, "category": "Finishing"},
    {"item": "Painting (emulsion 2-coat)", "unit": "sqft", "rate_low": 18, "rate_high": 28, "category": "Finishing"},
    {"item": "Steel (Fe500 TMT)", "unit": "tonne", "rate_low": 55000, "rate_high": 70000, "category": "Materials"},
    {"item": "Cement (OPC 53 Grade)", "unit": "bag (50kg)", "rate_low": 380, "rate_high": 450, "category": "Materials"},
    {"item": "M-Sand (River Sand)", "unit": "cum", "rate_low": 1800, "rate_high": 2800, "category": "Materials"},
    {"item": "Aggregate (20mm)", "unit": "cum", "rate_low": 1200, "rate_high": 2000, "category": "Materials"},
    {"item": "UPVC Window", "unit": "sqft", "rate_low": 900, "rate_high": 1400, "category": "Fixtures"},
    {"item": "Teak Door Frame + Shutter", "unit": "unit", "rate_low": 12000, "rate_high": 18000, "category": "Fixtures"},
    {"item": "Sanitary + Plumbing (per unit)", "unit": "unit", "rate_low": 60000, "rate_high": 150000, "category": "MEP"},
    {"item": "Electrical Wiring (per sqft)", "unit": "sqft", "rate_low": 120, "rate_high": 200, "category": "MEP"},
    {"item": "Waterproofing (terrace)", "unit": "sqft", "rate_low": 45, "rate_high": 80, "category": "Finishing"},
]

SAFETY_RISKS: list[dict] = [
    {"risk": "Working at height without harness", "severity": "CRITICAL", "category": "Fall Protection",
     "mitigation": "Mandatory safety harness for work above 1.8m. Install scaffolding, guard rails, safety nets."},
    {"risk": "Unprotected excavation/trench", "severity": "HIGH", "category": "Excavation Safety",
     "mitigation": "Shore or batter all excavations > 1.2m. Inspect daily. Keep materials 1m from edge."},
    {"risk": "Electrical hazards (live wires)", "severity": "CRITICAL", "category": "Electrical Safety",
     "mitigation": "Licensed electrician only. ELCB/RCCB mandatory. Isolate before work. LOTO procedures."},
    {"risk": "Crane/heavy machinery operation", "severity": "HIGH", "category": "Equipment Safety",
     "mitigation": "Certified operator only. Barricade radius zone. Pre-operation inspection. Load test certificates."},
    {"risk": "Inadequate PPE on site", "severity": "HIGH", "category": "Personal Protection",
     "mitigation": "Enforce hard hat, boots, hi-vis vest, gloves as minimum PPE. STOP WORK authority for violations."},
    {"risk": "Concrete formwork failure", "severity": "CRITICAL", "category": "Structural Safety",
     "mitigation": "Design formwork for 150% of wet concrete load. Engineer inspection before concreting. Shore adequately."},
    {"risk": "Hot work without fire watch", "severity": "HIGH", "category": "Fire Safety",
     "mitigation": "Hot work permit system. Fire extinguisher within 10m. 30-min fire watch after completion."},
    {"risk": "Manual handling / heavy lifting", "severity": "MODERATE", "category": "Ergonomics",
     "mitigation": "Mechanical aids for loads > 25kg. Training on correct lifting technique. Team lift for awkward loads."},
    {"risk": "Dust and silica exposure", "severity": "MODERATE", "category": "Health Hazards",
     "mitigation": "Wet cutting methods. Dust masks (N95 minimum for silica). Medical surveillance."},
    {"risk": "Poor housekeeping / slip trip hazards", "severity": "MODERATE", "category": "Housekeeping",
     "mitigation": "Daily site cleanup. Clear walkways. Mark/cover floor openings. Adequate lighting."},
]

DEFECT_TYPES: list[dict] = [
    {"defect": "Structural Cracks", "type": "Structural", "severity": "HIGH",
     "description": "Cracks > 0.3mm width, diagonal at openings, or stepped in brickwork indicate structural distress.",
     "action": "Stop work. Engage licensed structural engineer immediately. Do not cover/patch without assessment."},
    {"defect": "Concrete Honeycombing", "type": "Structural", "severity": "HIGH",
     "description": "Voids in concrete due to poor compaction or aggregate segregation. Reduces structural capacity.",
     "action": "Hack out loose material. Get engineer assessment. Repair with non-shrink grout or concrete. Cube tests."},
    {"defect": "Rebar Corrosion / Spalling", "type": "Structural", "severity": "HIGH",
     "description": "Rust-stained concrete, spalling reveals corroded steel. Reduces structural load capacity.",
     "action": "Expose all corroded rebar. Treat with epoxy primer. Patch with polymer-modified mortar. Carbonation test."},
    {"defect": "Plaster Delamination", "type": "Surface", "severity": "MODERATE",
     "description": "Hollow sound when tapped. Plaster detaching from substrate due to moisture or poor bonding.",
     "action": "Hack all delaminated areas. Apply bonding agent. Re-plaster with correct mix. Check moisture source."},
    {"defect": "Efflorescence", "type": "Surface", "severity": "LOW",
     "description": "White salt deposits on brick/concrete surface. Indicates moisture migration through structure.",
     "action": "Dry brush surface. Apply efflorescence cleaner. Trace and fix water entry point. Apply waterproofing."},
    {"defect": "Roof/Terrace Leakage", "type": "Waterproofing", "severity": "HIGH",
     "description": "Water seeping through roof slab into structure below. Accelerates rebar corrosion.",
     "action": "Identify all cracks and gaps. Apply waterproof membrane (APP/SBS). Cover with protection screed. 24h flood test."},
    {"defect": "Settlement Cracks", "type": "Foundation", "severity": "HIGH",
     "description": "Differential settlement causing diagonal cracks from corners of openings. Foundation issue.",
     "action": "Geotechnical investigation. Structural assessment. Underpinning or grouting may be required."},
    {"defect": "Door/Window Frame Distortion", "type": "Surface", "severity": "MODERATE",
     "description": "Frames out of plumb or square. Doors/windows sticking or gaps appearing.",
     "action": "Check for settlement below. Re-plumb and re-fix frames. Seal all gaps with weatherproof sealant."},
]
