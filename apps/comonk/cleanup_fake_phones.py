"""
cleanup_fake_phones.py — Remove placeholder/fake phone numbers from COMONK_TRUE_MASTER.xlsx
Removes numbers like +91 88888 88888, +91 99999 99999, etc. that are clearly not real.
"""
import sys, re, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

EXCEL = "COMONK_TRUE_MASTER.xlsx"
SHEET = "COMPLETE_MASTER"
C_PHONE = 12

FAKE_PHONE_PATTERNS = {
    "8888888888", "9999999999", "1234567890", "0000000000",
    "1111111111", "2222222222", "9876543210", "1234512345",
    "9988776655", "9800000000", "7777777777", "6666666666",
    "5555555555", "4444444444", "3333333333",
}

def is_fake(phone_str):
    if not phone_str:
        return False
    digits = re.sub(r"[^\d]", "", str(phone_str))
    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    if len(digits) < 10:
        return False
    d = digits[-10:]
    # All same digit blocks
    if len(set(d)) <= 2:
        return True
    # Repeating halves: 88888 88888
    if d[:5] == d[5:]:
        return True
    if d in FAKE_PHONE_PATTERNS:
        return True
    return False

wb = openpyxl.load_workbook(EXCEL)
ws = wb[SHEET]

removed = 0
for r in range(2, ws.max_row + 1):
    ph = ws.cell(r, C_PHONE).value
    if ph and is_fake(str(ph)):
        company = ws.cell(r, 2).value
        print(f"  REMOVING fake phone from row {r}: '{ph}' ({company})")
        ws.cell(r, C_PHONE).value = None
        removed += 1

wb.save(EXCEL)
print(f"\n  Done! Removed {removed} fake phone numbers from {EXCEL}")
