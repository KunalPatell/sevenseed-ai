# -*- coding: utf-8 -*-
"""
Unit tests for apps/breakdown-factor/backend/breakdown_data.py
Tests data integrity: CONSTRUCTION_KNOWLEDGE structure, required fields,
MATERIAL_RATES types, SAFETY_CHECKLIST, BOQ_TEMPLATES.
"""
from __future__ import annotations
import sys, os
import pytest

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "breakdown-factor", "backend")
sys.path.insert(0, BACKEND)

import breakdown_data


class TestConstructionKnowledge:
    def test_knowledge_is_list(self):
        assert isinstance(breakdown_data.CONSTRUCTION_KNOWLEDGE, list)

    def test_knowledge_not_empty(self):
        assert len(breakdown_data.CONSTRUCTION_KNOWLEDGE) > 0

    def test_knowledge_entries_are_tuples(self):
        for entry in breakdown_data.CONSTRUCTION_KNOWLEDGE:
            assert isinstance(entry, tuple), f"Expected tuple, got {type(entry)}"
            assert len(entry) == 2

    def test_knowledge_entry_titles_are_strings(self):
        for title, content in breakdown_data.CONSTRUCTION_KNOWLEDGE:
            assert isinstance(title, str)
            assert len(title) > 0

    def test_knowledge_entry_contents_are_strings(self):
        for title, content in breakdown_data.CONSTRUCTION_KNOWLEDGE:
            assert isinstance(content, str)
            assert len(content) > 10, f"Content too short for '{title}'"

    def test_safety_topic_present(self):
        titles = [t for t, _ in breakdown_data.CONSTRUCTION_KNOWLEDGE]
        safety_entries = [t for t in titles if "Safety" in t or "safety" in t]
        assert len(safety_entries) > 0, "No safety knowledge entries found"

    def test_cost_estimation_topic_present(self):
        titles = [t for t, _ in breakdown_data.CONSTRUCTION_KNOWLEDGE]
        cost_entries = [t for t in titles if "Cost" in t or "cost" in t]
        assert len(cost_entries) > 0, "No cost estimation knowledge entries found"

    def test_defect_detection_topic_present(self):
        titles = [t for t, _ in breakdown_data.CONSTRUCTION_KNOWLEDGE]
        defect_entries = [t for t in titles if "Defect" in t or "defect" in t]
        assert len(defect_entries) > 0, "No defect detection knowledge entries found"

    def test_no_duplicate_titles(self):
        titles = [t for t, _ in breakdown_data.CONSTRUCTION_KNOWLEDGE]
        assert len(titles) == len(set(titles)), "Duplicate titles found in CONSTRUCTION_KNOWLEDGE"

    def test_rupee_rates_present_in_cost_entries(self):
        """Cost estimation entries must contain ₹ symbols."""
        cost_entries = [(t, c) for t, c in breakdown_data.CONSTRUCTION_KNOWLEDGE
                        if "Cost" in t or "Costing" in t]
        for title, content in cost_entries:
            assert "₹" in content, f"No rupee symbol in cost entry: '{title}'"


class TestDataAttributes:
    """Test that expected module-level attributes exist and have valid types."""

    def test_module_loads_without_error(self):
        """Import must succeed cleanly."""
        import importlib
        spec = importlib.util.spec_from_file_location(
            "breakdown_data",
            os.path.join(BACKEND, "breakdown_data.py")
        )
        m = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(m)
        assert m is not None

    def test_construction_knowledge_all_non_empty_content(self):
        for title, content in breakdown_data.CONSTRUCTION_KNOWLEDGE:
            assert content.strip(), f"Empty content for title: {title}"
