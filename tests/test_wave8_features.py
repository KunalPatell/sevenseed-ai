# -*- coding: utf-8 -*-
import os
import sys
import unittest

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class Wave8FeaturesTests(unittest.TestCase):
    def test_01_kg_create_node(self):
        r = client.post("/api/knowledge-graph/nodes", json={"label": "Node A", "description": "d", "category": "c", "difficulty": "easy"})
        self.assertEqual(r.status_code, 200)
        self.assertIn('id', r.json())

    def test_02_kg_list_nodes(self):
        r = client.get("/api/knowledge-graph/nodes")
        self.assertEqual(r.status_code, 200)
        self.assertIn('nodes', r.json())

    def test_03_kg_create_edge(self):
        n1 = client.post("/api/knowledge-graph/nodes", json={"label": "N1"}).json()['id']
        n2 = client.post("/api/knowledge-graph/nodes", json={"label": "N2"}).json()['id']
        r = client.post("/api/knowledge-graph/edges", json={"from_node": n1, "to_node": n2})
        self.assertEqual(r.status_code, 200)
        self.assertIn('id', r.json())

    def test_04_kg_list_edges(self):
        r = client.get("/api/knowledge-graph/edges")
        self.assertEqual(r.status_code, 200)
        self.assertIn('edges', r.json())

    def test_05_kg_graph(self):
        r = client.get("/api/knowledge-graph/graph")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('nodes', data)
        self.assertIn('edges', data)

    def test_06_kg_topo_sort(self):
        r = client.get("/api/knowledge-graph/topological-sort")
        self.assertEqual(r.status_code, 200)
        self.assertIn('order', r.json())

    def test_07_kg_progress(self):
        nid = client.post("/api/knowledge-graph/nodes", json={"label": "PNode"}).json()['id']
        r = client.post("/api/knowledge-graph/progress", json={"node_id": nid, "completed": True})
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.json().get('completed'))

    def test_08_kg_unlocked(self):
        nid = client.post("/api/knowledge-graph/nodes", json={"label": "UNode"}).json()['id']
        r = client.get(f"/api/knowledge-graph/unlocked/{nid}")
        self.assertEqual(r.status_code, 200)
        self.assertIn('unlocked', r.json())

    def test_09_kg_critical_path(self):
        nid = client.post("/api/knowledge-graph/nodes", json={"label": "Goal"}).json()['id']
        r = client.get(f"/api/knowledge-graph/critical-path/{nid}")
        self.assertEqual(r.status_code, 200)
        self.assertIn('path', r.json())

    def test_10_spec_score_calculate(self):
        r = client.post("/api/spec-score/calculate", json={"product_name": "Phone", "category": "mobile", "specs": {"ram": 8, "storage": 128}, "weights": {"ram": 1, "storage": 1}})
        self.assertEqual(r.status_code, 200)
        self.assertIn('score', r.json())

    def test_11_spec_score_compare(self):
        r = client.post("/api/spec-score/compare", json={"products": [{"name": "A", "specs": {"ram": 8}}, {"name": "B", "specs": {"ram": 16}}]})
        self.assertEqual(r.status_code, 200)
        self.assertIn('comparison', r.json())

    def test_12_price_tracker_record(self):
        r = client.post("/api/price-tracker/record", json={"product_name": "Widget", "price": 10.5, "currency": "USD", "source": "s", "url": "u"})
        self.assertEqual(r.status_code, 200)
        self.assertIn('id', r.json())

    def test_13_price_tracker_history(self):
        client.post("/api/price-tracker/record", json={"product_name": "Widget2", "price": 5.0})
        r = client.get("/api/price-tracker/history/Widget2")
        self.assertEqual(r.status_code, 200)
        self.assertIn('points', r.json())

    def test_14_price_tracker_verdict(self):
        r = client.post("/api/price-tracker/verdict", json={"product_name": "Widget3", "current_price": 9.99})
        self.assertEqual(r.status_code, 200)
        self.assertIn('verdict', r.json())

    def test_15_copywriting_analyze(self):
        r = client.post("/api/copywriting/analyze", json={"text": "This amazing revolutionary product changes everything."})
        self.assertEqual(r.status_code, 200)
        self.assertIn('fluff_ratio', r.json())

    def test_16_copywriting_rewrite(self):
        r = client.post("/api/copywriting/rewrite", json={"text": "Buy now", "formula": "AIDA"})
        self.assertEqual(r.status_code, 200)
        self.assertIn('rewritten', r.json())

    def test_17_mental_models_evaluate(self):
        r = client.post("/api/mental-models/evaluate", json={"model_name": "inversion", "dilemma": "Should I launch?", "context": "ctx"})
        self.assertEqual(r.status_code, 200)
        self.assertIn('evaluation', r.json())

    def test_18_mental_models_list(self):
        r = client.get("/api/mental-models/list")
        self.assertEqual(r.status_code, 200)
        self.assertIn('models', r.json())

    def test_19_clinical_bmr(self):
        r = client.post("/api/clinical/bmr", json={"weight_kg": 70, "height_cm": 175, "age": 30, "gender": "male"})
        self.assertEqual(r.status_code, 200)
        self.assertIn('bmr', r.json())

    def test_20_clinical_tdee(self):
        r = client.post("/api/clinical/tdee", json={"bmr": 1600, "activity_level": "moderate"})
        self.assertEqual(r.status_code, 200)
        self.assertIn('tdee', r.json())

    def test_21_clinical_bsa(self):
        r = client.post("/api/clinical/bsa", json={"weight_kg": 70, "height_cm": 175})
        self.assertEqual(r.status_code, 200)
        self.assertIn('bsa', r.json())

    def test_22_wishlist_add(self):
        r = client.post("/api/wishlist/add", json={"user_email": "u@e.com", "item_name": "Thing", "item_url": "http://x", "item_price": 5.0})
        self.assertEqual(r.status_code, 200)
        self.assertIn('id', r.json())

    def test_23_wishlist_list(self):
        r = client.get("/api/wishlist/list")
        self.assertEqual(r.status_code, 200)
        self.assertIn('items', r.json())

    def test_24_wishlist_remove(self):
        iid = client.post("/api/wishlist/add", json={"item_name": "ToRemove"}).json()['id']
        r = client.delete(f"/api/wishlist/remove/{iid}")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.json().get('removed'))


if __name__ == "__main__":
    unittest.main()
