# -*- coding: utf-8 -*-
"""
Rakshak AI - FIR PDF builder (fpdf2)
Generates a clean, printable FIR draft PDF from a complaint record.

Note: core PDF fonts are latin-1; non-latin text (Hindi/Gujarati) is
transliterated to '?' to avoid crashes. The demo samples are in English.
"""

from fpdf import FPDF
from fpdf.enums import XPos, YPos


def _safe(text):
    """Make any string safe for the latin-1 core fonts."""
    if text is None:
        return ""
    return str(text).encode("latin-1", "replace").decode("latin-1")


class _FIRDoc(FPDF):
    def header(self):
        self.set_fill_color(10, 18, 40)
        self.rect(0, 0, 210, 26, "F")
        self.set_text_color(255, 255, 255)
        self.set_font("Helvetica", "B", 16)
        self.set_xy(12, 7)
        self.cell(0, 8, "RAKSHAK AI  -  Ahmedabad City Police", ln=1)
        self.set_font("Helvetica", "", 9)
        self.set_x(12)
        self.cell(0, 5, "First Information Report (AI-Generated Draft)")
        self.ln(14)
        self.set_text_color(0, 0, 0)

    def footer(self):
        self.set_y(-16)
        self.set_font("Helvetica", "I", 7.5)
        self.set_text_color(120, 120, 120)
        self.multi_cell(0, 4,
            "DEMO / PROOF-OF-CONCEPT. This is an AI-generated draft for assistance only and is "
            "not an officially registered FIR. Final FIR is registered by the duty officer.",
            align="C")


def build_fir_pdf(rec):
    """rec: a complaint record dict from store.py. Returns PDF bytes."""
    pdf = _FIRDoc()
    pdf.set_margins(14, 14, 14)
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    def row(label, value):
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(40, 70, 140)
        pdf.cell(46, 8, _safe(label), new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_text_color(0, 0, 0)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 8, _safe(value), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    row("Complaint ID:", rec.get("id", "-"))
    row("Date & Time:", rec.get("created_at", "-"))
    row("Type:", rec.get("type", "-"))
    row("Crime Category:", rec.get("crime_type", "-"))
    row("Place of Occurrence:", rec.get("location", "-"))
    row("Time of Occurrence:", rec.get("time", "-"))
    row("Priority:", rec.get("priority", "-"))
    pdf.ln(2)
    row("Complainant:", rec.get("name", "-"))
    row("Contact:", rec.get("phone", "-"))

    pdf.ln(4)
    pdf.set_draw_color(200, 200, 200)
    pdf.line(12, pdf.get_y(), 198, pdf.get_y())
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(40, 70, 140)
    pdf.cell(0, 8, "Statement of Complaint", ln=1)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 10.5)
    pdf.multi_cell(0, 6, _safe(rec.get("summary", "")))

    sections = rec.get("legal_sections") or []
    if sections:
        pdf.ln(4)
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(40, 70, 140)
        pdf.cell(0, 8, "Applicable Sections (AI-suggested)", ln=1)
        pdf.set_text_color(0, 0, 0)
        pdf.set_font("Helvetica", "", 10.5)
        for s in sections:
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 6, _safe("- " + s))

    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(40, 70, 140)
    pdf.cell(0, 8, "Status", ln=1)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 10.5)
    pdf.multi_cell(0, 6, _safe(f"{rec.get('status','Registered')}  |  Officer: {rec.get('officer','Pending assignment')}"))

    out = pdf.output()  # fpdf2 returns a bytearray
    return bytes(out)
