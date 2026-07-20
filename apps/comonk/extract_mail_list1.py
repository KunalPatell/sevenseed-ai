"""Extract text, emails, phones, company names from all PDFs in folder."""
import pdfplumber, re, os

PDFS = ["HR MAIL MAIN_02.pdf", "hr_mail_list.pdf", "DataScience Compeny List.pdf",
        "Mail list.pdf", "Mail list (1).pdf", "AI-Eng_JD.pdf"]

EMAIL_RE = re.compile(r'[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}')
PHONE_RE = re.compile(r'(?:\+?91[\s\-]?)?[6-9]\d{4}[\s\-]?\d{5}|\b0?79[\s\-]?\d{7,8}\b')

for pdf in PDFS:
    if not os.path.exists(pdf):
        print(f"\n### {pdf} — NOT FOUND"); continue
    try:
        with pdfplumber.open(pdf) as doc:
            npages = len(doc.pages)
            text = ""
            for pg in doc.pages:
                t = pg.extract_text() or ""
                text += t + "\n"
        emails = sorted(set(e.lower() for e in EMAIL_RE.findall(text)))
        phones = sorted(set(PHONE_RE.findall(text)))
        print(f"\n{'='*60}")
        print(f"### {pdf}  ({npages} pages, {len(text)} chars)")
        print(f"   Emails found: {len(emails)}")
        print(f"   Phones found: {len(phones)}")
        safe = re.sub(r'[^a-z0-9]', '_', pdf.lower())
        with open(f"_extract_{safe}.txt", "w", encoding="utf-8") as f:
            f.write("=== EMAILS ===\n")
            f.write("\n".join(emails))
            f.write("\n\n=== PHONES ===\n")
            f.write("\n".join(phones))
            f.write("\n\n=== FULL TEXT ===\n")
            f.write(text)
        print(f"   -> saved to _extract_{safe}.txt")
        for e in emails[:5]: print(f"     {e}")
    except Exception as ex:
        print(f"\n### {pdf} — ERROR: {ex}")
