"""
seed_top_companies.py
=====================
Seeds COMONK_TRUE_MASTER.xlsx with verified known MNCs, IT & AI/ML companies
in Ahmedabad and Gandhinagar that MUST be in the sheet.
Skips companies already present.
"""
import sys, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

EXCEL = "COMONK_TRUE_MASTER.xlsx"
SHEET = "COMPLETE_MASTER"

# ── Verified Companies to Seed ────────────────────────────────────────────────
# Format: (Company Name, City, Category, Website)
SEED_COMPANIES = [

    # ═══ TIER 1: GLOBAL MNCs ═══════════════════════════════════════════════
    ("Accenture", "Ahmedabad", "MNC - IT Consulting", "accenture.com"),
    ("Infosys", "Ahmedabad", "MNC - IT", "infosys.com"),
    ("Infosys BPM", "Gandhinagar", "MNC - IT BPO", "infosysbpm.com"),
    ("Tata Consultancy Services (TCS)", "Gandhinagar", "MNC - IT", "tcs.com"),
    ("TCS GIFT City", "Gandhinagar", "MNC - IT", "tcs.com"),
    ("Wipro", "Ahmedabad", "MNC - IT", "wipro.com"),
    ("Wipro Technologies", "Gandhinagar", "MNC - IT", "wipro.com"),
    ("Tech Mahindra", "Ahmedabad", "MNC - IT", "techmahindra.com"),
    ("HCL Technologies", "Ahmedabad", "MNC - IT", "hcltech.com"),
    ("IBM India", "Ahmedabad", "MNC - IT Consulting", "ibm.com"),
    ("Capgemini", "Ahmedabad", "MNC - IT", "capgemini.com"),
    ("Cognizant Technology Solutions", "Ahmedabad", "MNC - IT", "cognizant.com"),
    ("Oracle India", "Ahmedabad", "MNC - IT", "oracle.com"),
    ("SAP India", "Ahmedabad", "MNC - IT", "sap.com"),
    ("SAP Labs India", "Gandhinagar", "MNC - IT R&D", "sap.com"),
    ("Microsoft India", "Ahmedabad", "MNC - IT", "microsoft.com"),
    ("Amazon Web Services (AWS)", "Ahmedabad", "MNC - Cloud", "aws.amazon.com"),
    ("Google India", "Ahmedabad", "MNC - IT", "google.com"),
    ("Deloitte India", "Ahmedabad", "MNC - Consulting", "deloitte.com"),
    ("PricewaterhouseCoopers (PwC)", "Ahmedabad", "MNC - Consulting", "pwc.in"),
    ("Ernst & Young (EY)", "Ahmedabad", "MNC - Consulting", "ey.com"),
    ("KPMG India", "Ahmedabad", "MNC - Consulting", "kpmg.com"),
    ("McKinsey & Company", "Ahmedabad", "MNC - Consulting", "mckinsey.com"),
    ("Gartner India", "Ahmedabad", "MNC - Research & Consulting", "gartner.com"),
    ("NTT Data India", "Ahmedabad", "MNC - IT", "nttdata.com"),
    ("Atos India", "Ahmedabad", "MNC - IT", "atos.net"),
    ("Mphasis", "Ahmedabad", "MNC - IT", "mphasis.com"),
    ("Hexaware Technologies", "Ahmedabad", "MNC - IT", "hexaware.com"),
    ("Birlasoft", "Ahmedabad", "MNC - IT", "birlasoft.com"),
    ("L&T Technology Services", "Ahmedabad", "MNC - Engineering IT", "ltts.com"),
    ("Persistent Systems", "Ahmedabad", "MNC - IT", "persistent.com"),
    ("Zensar Technologies", "Ahmedabad", "MNC - IT", "zensar.com"),
    ("Mastech Digital", "Ahmedabad", "MNC - IT Staffing", "mastechdigital.com"),
    ("Unison Pharma", "Ahmedabad", "MNC - Pharma", "unisonpharma.com"),

    # ═══ TIER 2: GIFT CITY / GANDHINAGAR MNCs ══════════════════════════════
    ("HDFC Bank GIFT City", "Gandhinagar", "MNC - Banking", "hdfcbank.com"),
    ("ICICI Bank GIFT City", "Gandhinagar", "MNC - Banking", "icicibank.com"),
    ("Axis Bank GIFT City", "Gandhinagar", "MNC - Banking", "axisbank.com"),
    ("State Bank of India GIFT IBU", "Gandhinagar", "MNC - Banking", "sbi.co.in"),
    ("Bank of Baroda GIFT", "Gandhinagar", "MNC - Banking", "bankofbaroda.in"),
    ("HSBC India", "Gandhinagar", "MNC - Banking", "hsbc.co.in"),
    ("Deutsche Bank India", "Gandhinagar", "MNC - Banking", "db.com"),
    ("Standard Chartered India", "Gandhinagar", "MNC - Banking", "sc.com"),
    ("Citibank India", "Gandhinagar", "MNC - Banking", "citibank.co.in"),
    ("JP Morgan India", "Gandhinagar", "MNC - Finance", "jpmorgan.com"),
    ("Goldman Sachs India", "Gandhinagar", "MNC - Finance", "goldmansachs.com"),
    ("Morgan Stanley India", "Gandhinagar", "MNC - Finance", "morganstanley.com"),
    ("GIFT SEZ", "Gandhinagar", "MNC - Special Economic Zone", "giftgujarat.in"),

    # ═══ TIER 3: PHARMA MNCs (Ahmedabad = India's Pharma Capital) ══════════
    ("Zydus Lifesciences", "Ahmedabad", "MNC - Pharma", "zyduslife.com"),
    ("Torrent Pharmaceuticals", "Ahmedabad", "MNC - Pharma", "torrentpharma.com"),
    ("Intas Pharmaceuticals", "Ahmedabad", "MNC - Pharma", "intaspharma.com"),
    ("Cadila Pharmaceuticals", "Ahmedabad", "MNC - Pharma", "cadilapharma.com"),
    ("Sun Pharmaceutical Industries", "Ahmedabad", "MNC - Pharma", "sunpharma.com"),
    ("Alembic Pharmaceuticals", "Ahmedabad", "MNC - Pharma", "alembicpharmaceuticals.com"),
    ("Dishman Carbogen Amcis", "Ahmedabad", "MNC - Pharma", "dishmangroup.com"),
    ("Alkem Laboratories", "Ahmedabad", "MNC - Pharma", "alkemlabs.com"),
    ("Wockhardt", "Ahmedabad", "MNC - Pharma", "wockhardt.com"),
    ("Lincoln Pharmaceuticals", "Ahmedabad", "MNC - Pharma", "lincolnpharma.com"),
    ("Elder Pharmaceuticals", "Ahmedabad", "MNC - Pharma", "elderpharma.com"),
    ("Nirma Limited", "Ahmedabad", "MNC - FMCG/Pharma", "nirma.com"),
    ("Abbott India", "Ahmedabad", "MNC - Pharma", "abbott.co.in"),
    ("Pfizer India", "Ahmedabad", "MNC - Pharma", "pfizer.co.in"),
    ("AstraZeneca India", "Ahmedabad", "MNC - Pharma", "astrazeneca.co.in"),
    ("Novartis India", "Ahmedabad", "MNC - Pharma", "novartis.co.in"),
    ("Cipla", "Ahmedabad", "MNC - Pharma", "cipla.com"),

    # ═══ TIER 4: KEY IT COMPANIES (Ahmedabad) ═══════════════════════════════
    ("Bacancy Technology", "Ahmedabad", "IT - Product Engineering", "bacancytechnology.com"),
    ("TatvaSoft", "Ahmedabad", "IT - Custom Software", "tatvasoft.com"),
    ("Radixweb", "Ahmedabad", "IT - Software Development", "radixweb.com"),
    ("Cygnet Infotech", "Ahmedabad", "IT - Services & BPO", "cygnetinfotech.com"),
    ("OpenXcell", "Ahmedabad", "IT - Mobile & Web Dev", "openxcell.com"),
    ("Hyperlink InfoSystem", "Ahmedabad", "IT - App Development", "hyperlinkinfosystem.com"),
    ("Simform", "Ahmedabad", "IT - Product Engineering", "simform.com"),
    ("Excellarate", "Ahmedabad", "IT - Digital Transformation", "excellarate.com"),
    ("Greyamp Consulting", "Ahmedabad", "IT - Consulting", "greyamp.com"),
    ("Softvan", "Ahmedabad", "IT - Software", "softvan.in"),
    ("The NineHertz", "Ahmedabad", "IT - App Development", "theninehertz.com"),
    ("WDP Technologies", "Ahmedabad", "IT - Web Dev", "wdptechnologies.com"),
    ("Brainvire Infotech", "Ahmedabad", "IT - Software", "brainvire.com"),
    ("Vrinsoft Technology", "Ahmedabad", "IT - App Dev", "vrinsofttechnology.com"),
    ("Sphinx Solutions", "Ahmedabad", "IT - Software Dev", "sphinx-solution.com"),
    ("Elsner Technologies", "Ahmedabad", "IT - Web Dev", "elsner.com"),
    ("Aalpha Information Systems", "Ahmedabad", "IT - Software Dev", "aalpha.net"),
    ("TOPS Infosolutions", "Ahmedabad", "IT - IT Services", "topsinfosolutions.com"),
    ("iFour Technolab", "Ahmedabad", "IT - Software Dev", "ifourtechnolab.com"),
    ("Sparx IT Solutions", "Ahmedabad", "IT - Web Dev", "sparxitsolutions.com"),
    ("Space-O Technologies", "Ahmedabad", "IT - App Dev", "space-o.com"),
    ("Zestard Technologies", "Ahmedabad", "IT - eCommerce Dev", "zestard.com"),
    ("Datamatics", "Ahmedabad", "IT - BPO & IT", "datamatics.com"),
    ("EPAM Systems India", "Ahmedabad", "MNC - IT", "epam.com"),
    ("GlobalLogic India", "Ahmedabad", "MNC - IT", "globallogic.com"),
    ("Luxoft India", "Ahmedabad", "MNC - IT", "luxoft.com"),

    # ═══ TIER 5: AI / ML COMPANIES ══════════════════════════════════════════
    ("Jivox", "Ahmedabad", "AI/ML - AdTech", "jivox.com"),
    ("Inteliment Technologies", "Ahmedabad", "AI/ML - Analytics", "inteliment.com"),
    ("Ksolves India", "Ahmedabad", "AI/ML - Data Science", "ksolves.com"),
    ("Maruti Techlabs", "Ahmedabad", "AI/ML - IT Services", "marutitechlabs.com"),
    ("Minddeft Technologies", "Ahmedabad", "AI/ML - Blockchain & AI", "minddeft.com"),
    ("Innoplexus", "Ahmedabad", "AI/ML - Life Sciences AI", "innoplexus.com"),
    ("Quantiphi Analytics", "Ahmedabad", "AI/ML - Applied AI", "quantiphi.com"),
    ("Datacultr", "Ahmedabad", "AI/ML - Fintech AI", "datacultr.com"),
    ("Agiliad Technologies", "Ahmedabad", "AI/ML - Embedded AI", "agiliad.com"),
    ("Gyanwave AI", "Ahmedabad", "AI/ML - AI Training", "gyanwave.com"),
    ("Inspiren Technologies", "Ahmedabad", "AI/ML - Computer Vision", "inspiren.com"),
    ("Analytix Business Solutions", "Ahmedabad", "AI/ML - Analytics", "analytixbs.com"),
    ("eSparkBiz Technologies", "Ahmedabad", "AI/ML - Web & AI", "esparkinfo.com"),
    ("Rapidops", "Ahmedabad", "AI/ML - Digital Innovation", "rapidops.com"),
    ("BFSI Analytics", "Gandhinagar", "AI/ML - Financial Analytics", "bfsianalytics.com"),

    # ═══ TIER 6: FMCG / OTHER MNCs ═════════════════════════════════════════
    ("Amul (GCMMF)", "Anand/Ahmedabad", "MNC - FMCG", "amul.com"),
    ("Adani Group", "Ahmedabad", "MNC - Conglomerate", "adani.com"),
    ("Adani Enterprises", "Ahmedabad", "MNC - Infrastructure", "adanienterprises.com"),
    ("Adani Ports", "Ahmedabad", "MNC - Logistics", "adaniports.com"),
    ("Adani Green Energy", "Ahmedabad", "MNC - Renewable Energy", "adanigreenenergy.com"),
    ("Adani Total Gas", "Ahmedabad", "MNC - Energy", "adanitotalgas.in"),
    ("Adani Wilmar", "Ahmedabad", "MNC - FMCG", "adaniwilmar.in"),
    ("Reliance Industries", "Ahmedabad", "MNC - Conglomerate", "ril.com"),
    ("Reliance Jio", "Ahmedabad", "MNC - Telecom", "jio.com"),
    ("Reliance Retail", "Ahmedabad", "MNC - Retail", "relianceretail.com"),
    ("Vodafone Idea (Vi)", "Ahmedabad", "MNC - Telecom", "myvi.in"),
    ("Airtel Business", "Ahmedabad", "MNC - Telecom", "airtel.in"),
    ("BSNL Gujarat", "Ahmedabad", "MNC - Telecom", "bsnl.co.in"),
    ("Tata Communications", "Ahmedabad", "MNC - Telecom", "tatacommunications.com"),
    ("Tata Motors", "Ahmedabad", "MNC - Automobile", "tatamotors.com"),
    ("Maruti Suzuki India", "Ahmedabad", "MNC - Automobile", "marutisuzuki.com"),
    ("Honda Cars India", "Ahmedabad", "MNC - Automobile", "hondacarindia.com"),
    ("3M India", "Ahmedabad", "MNC - Manufacturing", "3mindia.com"),
    ("Siemens India", "Ahmedabad", "MNC - Engineering", "siemens.co.in"),
    ("ABB India", "Ahmedabad", "MNC - Engineering", "abb.com/in"),
    ("Honeywell India", "Ahmedabad", "MNC - Technology", "honeywell.com"),
    ("Schneider Electric India", "Ahmedabad", "MNC - Energy Mgmt", "se.com/in"),
    ("Larsen & Toubro (L&T)", "Ahmedabad", "MNC - Conglomerate", "larsentoubro.com"),
    ("L&T Infotech", "Ahmedabad", "MNC - IT", "lntinfotech.com"),
    ("HDFC Life", "Ahmedabad", "MNC - Insurance", "hdfclife.com"),
    ("ICICI Lombard", "Ahmedabad", "MNC - Insurance", "icicilombard.com"),
    ("Bajaj Finserv", "Ahmedabad", "MNC - Finance", "bajajfinserv.in"),
    ("Kotak Mahindra Bank", "Ahmedabad", "MNC - Banking", "kotak.com"),
    ("Yes Bank", "Ahmedabad", "MNC - Banking", "yesbank.in"),
    ("IndusInd Bank", "Ahmedabad", "MNC - Banking", "indusind.com"),
    ("IDBI Bank", "Ahmedabad", "MNC - Banking", "idbi.com"),
    ("Union Bank of India", "Ahmedabad", "MNC - Banking", "unionbankofindia.co.in"),
    ("Bosch India", "Ahmedabad", "MNC - Manufacturing", "bosch.in"),
    ("Ashok Leyland", "Ahmedabad", "MNC - Automobile", "ashokleyland.com"),
    ("Mahindra & Mahindra", "Ahmedabad", "MNC - Automobile/IT", "mahindra.com"),
    ("Tech Mahindra BPS", "Ahmedabad", "MNC - BPO", "techmahindra.com"),
    ("Genpact India", "Ahmedabad", "MNC - BPO/IT", "genpact.com"),
    ("WNS Global Services", "Ahmedabad", "MNC - BPO", "wns.com"),
    ("EXL Service", "Ahmedabad", "MNC - Analytics/BPO", "exlservice.com"),
    ("iGate (now Capgemini)", "Ahmedabad", "MNC - IT", "capgemini.com"),
    ("Fiserv India", "Ahmedabad", "MNC - FinTech", "fiserv.com"),
    ("FIS Global India", "Ahmedabad", "MNC - FinTech", "fisglobal.com"),
    ("Syntel India", "Ahmedabad", "MNC - IT", "atos-syntel.com"),
    ("Kforce India", "Ahmedabad", "MNC - IT Staffing", "kforce.com"),
    ("Mastek", "Ahmedabad", "MNC - IT", "mastek.com"),
    ("iCreate", "Ahmedabad", "IT - Product", "icreate.co.in"),
    ("Zolo (Softlogic)", "Ahmedabad", "IT - Proptech", "zolostays.com"),
    ("Sarvatra Technologies", "Ahmedabad", "IT - Fintech", "sarvatra.com"),
    ("ICICI Infotech", "Ahmedabad", "MNC - IT", "isgec.co.in"),
    ("Netpro India", "Ahmedabad", "IT - Networking", "netproindia.com"),
]

def main():
    print("\n" + "="*60)
    print("  COMONK AI — Seeding Top Companies into Master Sheet")
    print("="*60)

    wb = openpyxl.load_workbook(EXCEL)
    ws = wb[SHEET]

    # Get existing names (lowercase)
    existing = set()
    for row in range(2, ws.max_row + 1):
        n = str(ws.cell(row, 2).value or "").strip().lower()
        if n: existing.add(n)

    print(f"  Existing companies: {len(existing)}")

    added = 0
    skipped = 0
    next_row = ws.max_row + 1

    for name, city, cat, website in SEED_COMPANIES:
        if name.lower() in existing:
            skipped += 1
            continue

        ws.cell(next_row, 2).value  = name
        ws.cell(next_row, 3).value  = city
        ws.cell(next_row, 4).value  = cat
        ws.cell(next_row, 5).value  = "HR / Recruiter / Talent Acquisition"
        ws.cell(next_row, 13).value = website
        ws.cell(next_row, 17).value = "6 - Research Needed 🔍"
        ws.cell(next_row, 18).value = "Manually Seeded - High Priority"
        next_row += 1
        added += 1
        print(f"  ✅ Added: {name} ({city}) — {cat}")

    wb.save(EXCEL)
    print(f"\n  ✅ DONE!")
    print(f"  Added   : {added} new companies")
    print(f"  Skipped : {skipped} (already exist)")
    print(f"  Total   : {ws.max_row - 1} companies in sheet")
    print("="*60)

if __name__ == "__main__":
    main()
