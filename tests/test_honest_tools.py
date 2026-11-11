# -*- coding: utf-8 -*-
"""Endpoints and redirects that used to return invented results must now be honest.

Covers the Web3 endpoints (no fake "confirmed on chain" transactions), the 80G endpoint
(no receipts or registration numbers), the breach check (never "safe"), the clinical score
(no treatment advice) and the redirects away from the demo pages with invented data.
"""
import os
import sys
import unittest

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient  # noqa: E402
from main import app  # noqa: E402
import web3_engine  # noqa: E402

client = TestClient(app)


class TestWeb3(unittest.TestCase):
    def test_execute_no_longer_fakes_a_transaction(self):
        r = client.post("/api/web3/execute", json={"venture": "avpu", "chain": "polygon"})
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertEqual(body["status"], "not_available")
        self.assertNotIn("tx_hash", body)
        self.assertIn("/web3-studio/", body["message"])

    def test_tx_lookup_validates_input_before_calling_any_network(self):
        self.assertEqual(client.get("/api/web3/tx", params={"chain": "nope", "hash": "0x" + "a" * 64}).status_code, 400)
        self.assertEqual(client.get("/api/web3/tx", params={"chain": "base", "hash": "0x123"}).status_code, 400)

    def test_tx_lookup_matches_fingerprint_in_transaction_data(self):
        fp = "ab" * 32
        tx = {"from": "0x1", "to": "0x1", "input": "0x" + fp, "blockNumber": "0x10"}

        async def fake_rpc(client_, urls, method, params=None):
            return {"eth_getTransactionByHash": tx, "eth_getTransactionReceipt": {"status": "0x1"},
                    "eth_getBlockByNumber": {"timestamp": "0x5f5e100"}}[method]

        orig = web3_engine._rpc
        web3_engine._rpc = fake_rpc
        try:
            ok = client.get("/api/web3/tx", params={"chain": "base", "hash": "0x" + "c" * 64, "expect": fp}).json()
            bad = client.get("/api/web3/tx", params={"chain": "base", "hash": "0x" + "c" * 64, "expect": "cd" * 32}).json()
        finally:
            web3_engine._rpc = orig
        self.assertTrue(ok["found"] and ok["matches"] and ok["confirmed"])
        self.assertEqual(ok["block"], 16)
        self.assertFalse(bad["matches"])

    def test_telemetry_reports_offline_instead_of_inventing_numbers(self):
        async def down(client_, urls, method, params=None):
            raise RuntimeError("blocked")

        orig, web3_engine._rpc = web3_engine._rpc, down
        web3_engine._CACHE.update(at=0.0, data=None)
        try:
            chains = client.get("/api/web3/telemetry").json()["chains"]
        finally:
            web3_engine._rpc = orig
            web3_engine._CACHE.update(at=0.0, data=None)
        self.assertTrue(chains)
        for c in chains:
            self.assertFalse(c["online"])
            self.assertNotIn("block", c)


class TestNoInventedResults(unittest.TestCase):
    def test_80g_is_an_estimate_not_a_receipt(self):
        body = client.post("/api/tax-80g", json={"amount": 50000, "pan": "ABCDE1234F"}).json()
        self.assertEqual(body["section80GDeduction"], 25000)
        self.assertNotIn("receiptId", body)
        self.assertNotIn("trustRegistration", body)

    def test_breach_scan_never_says_safe(self):
        body = client.post("/api/hibp/breach-scan", json={"email_or_url": "someone@example.com"}).json()
        self.assertFalse(body["checked_breaches"])
        self.assertNotIn("SAFE", str(body).upper().replace("SAFE.", ""))

    def test_clinical_score_gives_no_treatment_advice(self):
        body = client.post("/api/mdcalc/clinical-scores", json={"heart_rate": 95, "spo2": 92}).json()
        self.assertNotIn("anticoagulation_recommendation", body)
        self.assertEqual(body["news2_partial_score"], 1 + 2)
        self.assertIn("108", body["note"])

    def test_price_predictor_admits_it_has_no_history(self):
        body = client.post("/api/cashkaro/stacker", json={"current_price_inr": 68999}).json()
        self.assertEqual(body["status"], "not_available")
        self.assertNotIn("drop_probability_7d_pct", body)


class TestDemoRedirects(unittest.TestCase):
    def test_redirects(self):
        cases = {
            "/trust/donation-ledger.html": "/trust/ledger/",
            "/trust/tax-80g/": "/trust/tax-exemption/",
            "/langgraph-studio/": "/ventures/",
            "/pharmacy/doctor-booking.html": "/pharmacy/doctor-consultation/",
        }
        for src, dst in cases.items():
            r = client.get(src, follow_redirects=False)
            self.assertEqual(r.status_code, 301, src)
            self.assertEqual(r.headers["location"], dst, src)


class TestAppPortalHonest(unittest.TestCase):
    """The /app/ portal stays live, so its bundle must not fake a wallet, stats or clones."""

    def test_bundle_has_no_fake_wallet_stats_or_clone_badges(self):
        js = client.get("/static/vite-portal-bundle.js").text
        for fake in ("0x71C8", "0x94F2", "/api/web3/execute", "v.kpis.map", "CLONE", "64 Reference Sites", "VITE SPA ADVANTAGE"):
            self.assertNotIn(fake, js)
        self.assertIn("Fingerprint this result", js)
        self.assertIn("/web3-studio/", js)

    def test_reference_registry_names_no_companies(self):
        body = client.get("/api/reference-sites/registry").json()
        self.assertEqual(body["ventures"], {})


if __name__ == "__main__":
    unittest.main()
