"""Scan COMONK_TRUE_MASTER.xlsx and list all MNC companies with their contact status."""
import sys, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

wb = openpyxl.load_workbook("COMONK_TRUE_MASTER.xlsx")
ws = wb["COMPLETE_MASTER"]

MNC_KEYWORDS = [
    "tcs","tata consultancy","infosys","wipro","accenture","ibm","capgemini",
    "deloitte","cognizant","hcl","tech mahindra","pwc","ernst","bosch","siemens",
    "oracle","ntt","fujitsu","mphasis","hexaware","persistent","kpit","ltts",
    "atos","genpact","dxc","unisys","sapient","mindtree","apexon","infostretch",
    "exl","mastech","syntel","zensar","cyient","niit","firstsource","wns","3i",
    "polaris","conduent","xerox","amazon","google","microsoft","cisco","sap",
    "salesforce","adobe","vmware","dell","hp","intel","qualcomm","nvidia",
    "capgemini","l&t","l and t","larsen","toubro","mahindra","bajaj","reliance",
    "adani","birla","godrej","hdfc","icici","axis bank","kotak","sbi",
    "samsung","lg","philips","panasonic","sony","ericsson","nokia","motorola",
    "honeywell","3m","ge ","general electric","johnson","abbott","pfizer",
    "kforce","manpower","randstad","allegis","kelly","robert half",
    "tata elxsi","tata advanced","tata digital","minda","motherson",
    "vodafone","airtel","jio","bsnl","bharti","idea","voda"
]

C_EMAILS = list(range(6, 12))
C_PHONE  = 12
C_WEB    = 13
C_LI     = 14
C_ADDR   = 15
C_PRIO   = 17

mncs = []
for r in range(2, ws.max_row + 1):
    name = str(ws.cell(r, 2).value or "").strip()
    if not name:
        continue
    name_lower = name.lower()
    if any(k in name_lower for k in MNC_KEYWORDS):
        has_em = any(ws.cell(r, c).value for c in C_EMAILS)
        has_ph = bool(ws.cell(r, C_PHONE).value)
        emails = [ws.cell(r, c).value for c in C_EMAILS if ws.cell(r, c).value]
        mncs.append({
            "row": r,
            "name": name,
            "city": ws.cell(r, 3).value or "",
            "has_email": has_em,
            "has_phone": has_ph,
            "email1": emails[0] if emails else "",
            "phone": ws.cell(r, C_PHONE).value or "",
            "website": ws.cell(r, C_WEB).value or "",
            "linkedin": ws.cell(r, C_LI).value or "",
        })

print(f"Total MNCs in sheet: {len(mncs)}")
print(f"With email : {sum(1 for m in mncs if m['has_email'])}")
print(f"No email   : {sum(1 for m in mncs if not m['has_email'])}")
print(f"With phone : {sum(1 for m in mncs if m['has_phone'])}")
print(f"No phone   : {sum(1 for m in mncs if not m['has_phone'])}")
print()
print(f"{'Row':<5} {'Company':<45} {'EM':<5} {'PH':<5} {'Email':<35} {'Phone'}")
print("-" * 130)
for m in sorted(mncs, key=lambda x: x['name']):
    print(
        f"{m['row']:<5} {m['name'][:44]:<45} "
        f"{'YES' if m['has_email'] else 'NO':<5} "
        f"{'YES' if m['has_phone'] else 'NO':<5} "
        f"{str(m['email1'])[:34]:<35} {m['phone']}"
    )
