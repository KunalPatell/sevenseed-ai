# sync_to_final_master.py
# Syncs the merged data from backup/COMONK_TRUE_MASTER.xlsx into the active master sheet
# Ahmedabad_IT_AIML_FINAL_MASTER.xlsx ('All Companies' sheet) in the exact format
# expected by the backend and SQLite database loader.
# Column layout (17 columns):
# 1: No, 2: Company Name, 3: Category, 4: Roles / Skills (Target Role), 
# 5..9: Email 1..5, 10: Phone, 11: Website, 12: LinkedIn, 13: Address,
# 14: City, 15: Priority, 16: Source, 17: Email 6

import os, time, openpyxl, subprocess
from datetime import datetime

MASTER_TRUE = "backup/COMONK_TRUE_MASTER.xlsx"
FINAL_MASTER = "Ahmedabad_IT_AIML_FINAL_MASTER.xlsx"
LOG_FILE = "sync_log.txt"

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def safe_save(wb, filename):
    while True:
        try:
            wb.save(filename)
            return
        except PermissionError:
            log(f"  [⚠️ WARNING] Permission Denied: Cannot save '{filename}'. Please close it in Microsoft Excel! Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            log(f"  [❌ ERROR] Failed to save: {e}")
            raise e

def main():
    log("\n" + "="*80)
    log("  SYNC ENGINE: backup/COMONK_TRUE -> Ahmedabad_IT_AIML_FINAL_MASTER")
    log("="*80 + "\n")

    if not os.path.exists(MASTER_TRUE):
        log(f"❌ Source file {MASTER_TRUE} not found!")
        return
    if not os.path.exists(FINAL_MASTER):
        log(f"❌ Target file {FINAL_MASTER} not found!")
        return

    # 1. Load source rows
    wb_src = openpyxl.load_workbook(MASTER_TRUE, read_only=True)
    ws_src = wb_src["COMPLETE_MASTER"]
    
    src_headers = [c.value for c in next(ws_src.iter_rows(min_row=1, max_row=1))]
    hmap = {str(h).strip().lower(): i for i, h in enumerate(src_headers) if h}
    
    COL_NO = hmap.get("no.", 0)
    COL_CO = hmap.get("company name", 1)
    COL_CITY = hmap.get("city", 2)
    COL_CAT = hmap.get("category", 3)
    COL_ROLE = hmap.get("target role", 4)
    COL_PH = hmap.get("phone", 11)
    COL_WEB = hmap.get("website", 12)
    COL_LI = hmap.get("linkedin", 13)
    COL_ADDR = hmap.get("address", 14)
    COL_PRI = hmap.get("priority", 16)
    COL_SRC = hmap.get("source", 17)
    
    email_cols = [hmap.get(f"email {i}") for i in range(1, 7)] # Expect 6 email columns
    
    src_rows = []
    for row in ws_src.iter_rows(min_row=2, values_only=True):
        if not row[COL_CO]:
            continue
            
        no_val = row[COL_NO]
        name_val = row[COL_CO]
        city_val = row[COL_CITY] if COL_CITY < len(row) else "Ahmedabad"
        cat_val = row[COL_CAT]
        role_val = row[COL_ROLE]
        
        emails = [row[ec] if ec is not None and ec < len(row) else None for ec in email_cols]
        emails = (emails + [None] * 6)[:6] # e1 to e6
        
        phone_val = row[COL_PH] if COL_PH < len(row) else None
        web_val = row[COL_WEB] if COL_WEB < len(row) else None
        li_val = row[COL_LI] if COL_LI < len(row) else None
        addr_val = row[COL_ADDR] if COL_ADDR < len(row) else None
        pri_val = row[COL_PRI] if COL_PRI < len(row) else "3 - General IT / Other"
        src_val = row[COL_SRC] if COL_SRC < len(row) else "Mega Merge"
        
        # Build 17-column target tuple:
        # 1: No, 2: Company Name, 3: Category, 4: Roles / Skills (Target Role), 
        # 5..9: Email 1..5, 10: Phone, 11: Website, 12: LinkedIn, 13: Address,
        # 14: City, 15: Priority, 16: Source, 17: Email 6
        target_row = [
            no_val,
            name_val,
            cat_val,
            role_val,
            emails[0], emails[1], emails[2], emails[3], emails[4],
            phone_val,
            web_val,
            li_val,
            addr_val,
            city_val,
            pri_val,
            src_val,
            emails[5]
        ]
        src_rows.append(target_row)
        
    wb_src.close()
    log(f"Successfully loaded {len(src_rows)} rows from {MASTER_TRUE}")

    # 2. Write to Target Excel
    wb_tgt = openpyxl.load_workbook(FINAL_MASTER)
    ws_tgt = wb_tgt["All Companies"]
    
    # Write Row 3 Headers to be clean and accurate
    headers_row3 = [
        'No', 'Company Name', 'Category', 'Roles / Skills', 
        'Email 1', 'Email 2', 'Email 3', 'Email 4', 'Email 5', 
        'Phone', 'Website', 'LinkedIn', 'Address', 
        'City', 'Priority', 'Source', 'Email 6'
    ]
    for col_idx, h in enumerate(headers_row3, start=1):
        ws_tgt.cell(3, col_idx).value = h
        
    # Clear all data starting from row 4
    ws_tgt.delete_rows(4, ws_tgt.max_row+1)
    
    # Append new rows
    for r_idx, row in enumerate(src_rows, start=1):
        row[0] = r_idx
        ws_tgt.append(row)
        
    safe_save(wb_tgt, FINAL_MASTER)
    log(f"Successfully wrote {len(src_rows)} rows to {FINAL_MASTER} ('All Companies')")

    # 3. Reload SQL Database
    log("Rebuilding sqlite database (db_setup.py)...")
    try:
        res = subprocess.run(["python", "db_setup.py"], capture_output=True, text=True, encoding="utf-8")
        if res.returncode == 0:
            log("✅ SQLite database rebuilt successfully (comonk.db updated).")
        else:
            log(f"⚠️ SQLite database rebuild warning: {res.stderr}")
    except Exception as e:
        log(f"❌ Failed to rebuild SQLite database: {e}")

    log("\n" + "="*80)
    log("  SYNC ENGINE: COMPLETED")
    log("="*80 + "\n")

if __name__ == "__main__":
    main()
