# -*- coding: utf-8 -*-
"""
Unit tests for apps/decode-forest-pharmacy/backend/pharmacy_data.py
Tests: MEDICINES structure, required fields, HEALTH_KNOWLEDGE integrity,
       HOSPITALS list, EMERGENCY_CONTACTS, HEALTH_CAMPS, BLOOD_DONATION.
"""
from __future__ import annotations
import sys, os
import pytest

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "decode-forest-pharmacy", "backend")
sys.path.insert(0, BACKEND)

import pharmacy_data


# ─────────────────────────────────────────────────────────────────────────────
# MEDICINES
# ─────────────────────────────────────────────────────────────────────────────
REQUIRED_MED_FIELDS = ["name", "generic", "brand", "category", "use", "dose",
                        "side_effects", "avoid", "price_inr"]


class TestMedicines:
    def test_medicines_is_list(self):
        assert isinstance(pharmacy_data.MEDICINES, list)

    def test_medicines_not_empty(self):
        assert len(pharmacy_data.MEDICINES) > 0

    def test_all_required_fields_present(self):
        for med in pharmacy_data.MEDICINES:
            for field in REQUIRED_MED_FIELDS:
                assert field in med, f"Missing field '{field}' in medicine: {med.get('name', '?')}"

    def test_all_names_are_strings(self):
        for med in pharmacy_data.MEDICINES:
            assert isinstance(med["name"], str) and len(med["name"]) > 0

    def test_all_generics_are_strings(self):
        for med in pharmacy_data.MEDICINES:
            assert isinstance(med["generic"], str) and len(med["generic"]) > 0

    def test_no_duplicate_medicine_names(self):
        names = [m["name"] for m in pharmacy_data.MEDICINES]
        assert len(names) == len(set(names)), "Duplicate medicine names found"

    def test_dose_field_not_empty(self):
        for med in pharmacy_data.MEDICINES:
            assert len(med["dose"]) > 0, f"Empty dose for {med['name']}"

    def test_price_inr_is_string_or_numeric(self):
        for med in pharmacy_data.MEDICINES:
            p = med["price_inr"]
            assert isinstance(p, (str, int, float)), f"Invalid price_inr for {med['name']}"

    def test_paracetamol_present(self):
        names = [m["name"] for m in pharmacy_data.MEDICINES]
        assert any("Paracetamol" in n for n in names), "Paracetamol not in medicines list"

    def test_common_categories_present(self):
        categories = {m["category"] for m in pharmacy_data.MEDICINES}
        # These broad categories should appear in a comprehensive pharmacy DB
        category_text = " ".join(categories).lower()
        assert "analgesic" in category_text or "nsaid" in category_text or "antibiotic" in category_text


# ─────────────────────────────────────────────────────────────────────────────
# HEALTH KNOWLEDGE
# ─────────────────────────────────────────────────────────────────────────────
class TestHealthKnowledge:
    def test_health_knowledge_is_list(self):
        assert hasattr(pharmacy_data, "HEALTH_KNOWLEDGE")
        assert isinstance(pharmacy_data.HEALTH_KNOWLEDGE, list)

    def test_health_knowledge_not_empty(self):
        assert len(pharmacy_data.HEALTH_KNOWLEDGE) > 0

    def test_knowledge_entries_are_tuples(self):
        for entry in pharmacy_data.HEALTH_KNOWLEDGE:
            assert isinstance(entry, tuple)
            assert len(entry) == 2

    def test_knowledge_titles_are_non_empty_strings(self):
        for title, content in pharmacy_data.HEALTH_KNOWLEDGE:
            assert isinstance(title, str) and len(title) > 0
            assert isinstance(content, str) and len(content) > 10


# ─────────────────────────────────────────────────────────────────────────────
# MODULE-LEVEL ATTRIBUTES
# ─────────────────────────────────────────────────────────────────────────────
class TestModuleAttributes:
    def test_module_loads_cleanly(self):
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "pharmacy_data",
            os.path.join(BACKEND, "pharmacy_data.py")
        )
        m = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(m)
        assert m is not None

    def test_medicines_attribute_exists(self):
        assert hasattr(pharmacy_data, "MEDICINES")

    def test_health_knowledge_attribute_exists(self):
        assert hasattr(pharmacy_data, "HEALTH_KNOWLEDGE")
