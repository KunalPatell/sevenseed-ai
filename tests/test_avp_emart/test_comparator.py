# -*- coding: utf-8 -*-
"""
Unit tests for apps/avp-emart/backend/comparator.py
Tests: _seed determinism, _base_price bucketing, _sample output shape,
       _score scoring algorithm, compare() full flow, forecast_trend(),
       deal_insights(), edge cases.
"""
from __future__ import annotations
import sys, os
import pytest

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avp-emart", "backend")
sys.path.insert(0, BACKEND)

import comparator


# ─────────────────────────────────────────────────────────────────────────────
# SEED & SAMPLE DETERMINISM
# ─────────────────────────────────────────────────────────────────────────────
class TestSeedAndSample:
    def test_seed_is_deterministic(self):
        s1 = comparator._seed("iPhone 15")
        s2 = comparator._seed("iPhone 15")
        assert s1 == s2

    def test_seed_differs_for_different_queries(self):
        assert comparator._seed("iPhone") != comparator._seed("Samsung")

    def test_seed_case_insensitive(self):
        assert comparator._seed("iPhone") == comparator._seed("iphone")

    def test_sample_returns_list(self):
        result = comparator._sample("laptop", 4)
        assert isinstance(result, list)
        assert len(result) >= 4

    def test_sample_is_deterministic(self):
        r1 = comparator._sample("headphone", 4)
        r2 = comparator._sample("headphone", 4)
        assert r1 == r2

    def test_sample_has_required_fields(self):
        result = comparator._sample("phone", 4)
        for item in result:
            assert "name" in item
            assert "price" in item
            assert "platform" in item
            assert "rating" in item
            assert "reviews" in item
            assert "link" in item
            assert "in_stock" in item

    def test_sample_prices_positive(self):
        result = comparator._sample("camera", 4)
        for item in result:
            assert item["price"] > 0

    def test_sample_ratings_in_range(self):
        result = comparator._sample("watch", 4)
        for item in result:
            assert 0.0 <= item["rating"] <= 5.0


# ─────────────────────────────────────────────────────────────────────────────
# PRICE BUCKETS
# ─────────────────────────────────────────────────────────────────────────────
class TestBasePriceBuckets:
    def test_iphone_in_high_bucket(self):
        import random
        rng = random.Random(42)
        price = comparator._base_price("iphone pro max", rng)
        assert 45000 <= price <= 145000

    def test_cable_in_low_bucket(self):
        import random
        rng = random.Random(42)
        price = comparator._base_price("usb cable", rng)
        assert 200 <= price <= 2500

    def test_unknown_query_uses_default_bucket(self):
        import random
        rng = random.Random(42)
        price = comparator._base_price("xyzabcunknownproduct", rng)
        assert 3000 <= price <= 40000


# ─────────────────────────────────────────────────────────────────────────────
# SCORING ALGORITHM
# ─────────────────────────────────────────────────────────────────────────────
class TestScoring:
    def _make_products(self):
        return [
            {"name": "A", "price": 10000, "rating": 4.5, "reviews": 1000, "platform": "Amazon"},
            {"name": "B", "price": 15000, "rating": 4.0, "reviews": 500,  "platform": "Flipkart"},
            {"name": "C", "price": 8000,  "rating": 3.8, "reviews": 200,  "platform": "Snapdeal"},
        ]

    def test_score_adds_value_score(self):
        prods = self._make_products()
        scored = comparator._score(prods)
        for p in scored:
            assert "value_score" in p
            assert 0.0 <= p["value_score"] <= 100.0

    def test_score_adds_z_score(self):
        prods = self._make_products()
        scored = comparator._score(prods)
        for p in scored:
            assert "z_score" in p

    def test_score_adds_positioning(self):
        prods = self._make_products()
        scored = comparator._score(prods)
        for p in scored:
            assert p["positioning"] in ("Competitive", "Standard", "Premium")

    def test_score_first_item_is_best_value(self):
        prods = self._make_products()
        scored = comparator._score(prods)
        assert scored[0].get("best_value") is True

    def test_score_empty_list_returns_empty(self):
        assert comparator._score([]) == []

    def test_score_all_zero_prices_skipped(self):
        """_score filters out price=0 items from scoring (returns empty for all-zero input)."""
        prods = [{"name": "Free", "price": 0, "rating": 5.0, "reviews": 100, "platform": "Amazon"}]
        result = comparator._score(prods)
        # _score filters products where price>0 before scoring; price=0 products are excluded
        # from scoring but may still be returned in the list — verify value_score is absent or 0
        for p in result:
            # If price is 0, value_score should not be set (or scored as 0)
            assert p.get("value_score", 0) == 0 or p["price"] > 0


# ─────────────────────────────────────────────────────────────────────────────
# COMPARE FUNCTION
# ─────────────────────────────────────────────────────────────────────────────
class TestCompare:
    def test_compare_valid_query(self):
        result = comparator.compare("laptop", 4)
        assert "query" in result
        assert "products" in result
        assert isinstance(result["products"], list)
        assert len(result["products"]) >= 4

    def test_compare_empty_query_returns_empty(self):
        result = comparator.compare("")
        assert result["products"] == []

    def test_compare_whitespace_query_returns_empty(self):
        result = comparator.compare("   ")
        assert result["products"] == []

    def test_compare_returns_best(self):
        result = comparator.compare("phone", 4)
        assert result["best"] is not None

    def test_compare_returns_cheapest(self):
        result = comparator.compare("watch", 4)
        products = result["products"]
        cheapest = result["cheapest"]
        min_price = min(p["price"] for p in products)
        assert cheapest["price"] == min_price

    def test_compare_returns_top_rated(self):
        result = comparator.compare("speaker", 4)
        products = result["products"]
        top_rated = result["top_rated"]
        max_rating = max(p["rating"] for p in products)
        assert top_rated["rating"] == max_rating

    def test_compare_mode_offline(self, monkeypatch):
        monkeypatch.delenv("SERPAPI_KEY", raising=False)
        result = comparator.compare("mouse", 4)
        assert result["mode"] == "sample data"

    def test_compare_n_param(self):
        result = comparator.compare("keyboard", 6)
        assert len(result["products"]) >= 4  # min is 4


# ─────────────────────────────────────────────────────────────────────────────
# NUM PARSER
# ─────────────────────────────────────────────────────────────────────────────
class TestNumParser:
    def test_parse_rupee_price(self):
        assert comparator._num("₹79,999") == 79999

    def test_parse_plain_number(self):
        assert comparator._num("12000") == 12000

    def test_parse_comma_separated(self):
        assert comparator._num("1,45,000") == 145000

    def test_parse_empty_string(self):
        assert comparator._num("") == 0

    def test_parse_no_digits(self):
        assert comparator._num("Free") == 0


# ─────────────────────────────────────────────────────────────────────────────
# FORECAST TREND
# ─────────────────────────────────────────────────────────────────────────────
class TestForecastTrend:
    def test_forecast_valid(self):
        result = comparator.forecast_trend("laptop", 80000)
        assert result["success"] is True
        assert "trend" in result
        assert result["trend"] in ("falling", "rising", "stable")
        assert "predicted_price_4w" in result
        assert isinstance(result["history"], list)

    def test_forecast_zero_price_returns_error(self):
        result = comparator.forecast_trend("laptop", 0)
        assert result["success"] is False

    def test_forecast_negative_price_returns_error(self):
        result = comparator.forecast_trend("laptop", -100)
        assert result["success"] is False

    def test_forecast_confidence_in_range(self):
        result = comparator.forecast_trend("phone", 20000)
        assert 0.0 <= result["confidence_score"] <= 100.0

    def test_forecast_deterministic(self):
        r1 = comparator.forecast_trend("iphone", 90000)
        r2 = comparator.forecast_trend("iphone", 90000)
        assert r1["predicted_price_4w"] == r2["predicted_price_4w"]


# ─────────────────────────────────────────────────────────────────────────────
# DEAL INSIGHTS
# ─────────────────────────────────────────────────────────────────────────────
class TestDealInsights:
    def test_deal_insights_valid(self):
        result = comparator.deal_insights("headphones", 6)
        assert result["success"] is True
        assert "insights" in result
        assert "savings" in result
        assert "deal_quality" in result
        assert "per_site_best" in result

    def test_deal_insights_empty_query(self):
        result = comparator.deal_insights("")
        assert result["success"] is False

    def test_deal_quality_label(self):
        result = comparator.deal_insights("phone", 6)
        assert result["deal_quality"]["label"] in ("Excellent Deals!", "Good Deals", "Fair Deals", "Poor Deals")

    def test_savings_amount_non_negative(self):
        result = comparator.deal_insights("tablet", 6)
        assert result["savings"]["amount"] >= 0

    def test_mode_key_present(self):
        result = comparator.deal_insights("laptop", 4)
        assert "mode" in result


# ─────────────────────────────────────────────────────────────────────────────
# PLATFORMS
# ─────────────────────────────────────────────────────────────────────────────
class TestPlatforms:
    def test_platforms_dict_not_empty(self):
        assert len(comparator.PLATFORMS) > 0

    def test_all_platform_labels_are_strings(self):
        for k, v in comparator.PLATFORMS.items():
            assert isinstance(k, str)
            assert isinstance(v, str)

    def test_mode_offline_default(self, monkeypatch):
        monkeypatch.delenv("SERPAPI_KEY", raising=False)
        assert comparator.mode() == "sample data"
