import openpyxl
wb=openpyxl.load_workbook("Ahmedabad_IT_AIML_FINAL_MASTER.xlsx", read_only=True)
ws=wb["All Companies"]
n=0
for idx,row in enumerate(ws.iter_rows(min_row=2, values_only=True)):
    if not row[1]: continue
    r=tuple(row)+(None,)*28
    name,cat,city,roles=r[1],r[2],r[3],r[4]
    phone,website,address,linkedin=r[5],r[6],r[7],r[8]
    emails=[str(e).strip() for e in r[11:28] if e and "@" in str(e)]
    if n<6:
        print(f"{name} | city={city} | phone={phone} | web={str(website)[:30]} | emails={emails[:2]} ({len(emails)})")
    n+=1
print(f"\nTotal parsed: {n} companies")
print("SANITY: name should be a company, phone should be a number, emails should have @")
