# -*- coding: utf-8 -*-
"""Rakshak AI API tests.

Why this file exists: apps/rakshak-ai/backend/main.py has twice been written
against functions its own modules do not define — sixteen of them at the last
count — which made /api/chat and /api/fir/generate return 500 on every request,
in production, twice. Nothing caught it because the app had no tests.

So there are two layers here:

1. `test_all_called_functions_exist` — a static check that every ai_engine.*,
   store.*, pdf_util.* and faceauth.* name main.py calls is actually defined.
   This catches the exact regression before any endpoint runs.
2. A smoke test per endpoint, because a name existing does not mean the
   arguments match — the second round of failures was all argument shapes.

There are also assertions that this app does not claim to do things it cannot:
no "dispatched" in the SOS reply, no forged FIR for an unknown complaint id.
"""

from __future__ import annotations

import os
import re
import sys
import pytest


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    tmp = tmp_path_factory.mktemp("rakshak_api")
    os.environ["DB_PATH"] = str(tmp / "rakshak_test.sqlite3")

    from conftest import load_isolated_app

    app = load_isolated_app("rakshak-ai")
    from fastapi.testclient import TestClient

    yield TestClient(app, raise_server_exceptions=False)


def _backend_dir() -> str:
    from conftest import app_backend

    return app_backend("rakshak-ai")


class TestModuleContract:
    def test_all_called_functions_exist(self, client):
        """Every module function main.py calls must actually be defined."""
        sys.path.insert(0, _backend_dir())
        import ai_engine, faceauth, pdf_util, store

        src = open(os.path.join(_backend_dir(), "main.py"), encoding="utf-8").read()
        mods = {
            "ai_engine": ai_engine,
            "store": store,
            "pdf_util": pdf_util,
            "faceauth": faceauth,
        }
        missing = [
            f"{name}.{attr}"
            for name, mod in mods.items()
            # (?!py\b) so a comment mentioning "store.py" is not read as an attribute.
            for attr in sorted(set(re.findall(rf"\b{name}\.(?!py\b)([a-zA-Z_][a-zA-Z0-9_]*)", src)))
            if not hasattr(mod, attr)
        ]
        assert not missing, f"main.py calls functions that do not exist: {missing}"


class TestHealth:
    def test_health(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"


class TestChat:
    def test_chat_answers(self, client):
        r = client.post("/api/chat", json={"message": "my bike was stolen", "language": "en"})
        assert r.status_code == 200
        assert r.json()["response"]

    def test_emergency_never_claims_dispatch(self, client):
        """The app cannot contact the police; it must not imply that it has.

        Telling someone in danger that help is on the way is the one thing that
        can stop them calling for it. This claim has been removed four times from
        four different places in this app.
        """
        r = client.post("/api/chat", json={"message": "help me someone is attacking", "language": "en"})
        assert r.status_code == 200
        reply = r.json()["response"].lower()
        for banned in ("dispatched", "units notified", "patrol", "escalating", "location shared"):
            assert banned not in reply, f"emergency reply implies help is coming: {banned!r}"
        assert "112" in reply


class TestSOS:
    def test_sos_reports_no_dispatch(self, client):
        r = client.post("/api/sos", json={"lat": 23.0, "lon": 72.5})
        assert r.status_code == 200
        body = r.json()
        assert body.get("dispatch_available") is False
        assert body["status"] != "DISPATCHED"


class TestFIR:
    def test_generate_and_download(self, client):
        r = client.post("/api/fir/generate", json={
            "complainant_name": "Test Citizen",
            "phone": "9999999999",
            "crime_category": "Vehicle Theft",
            "incident_details": "bike stolen from CG Road",
            "incident_location": "CG Road",
            "incident_time": "9pm",
        })
        assert r.status_code == 200
        cid = r.json()["complaint_id"]

        pdf = client.get(f"/api/fir/download/{cid}")
        assert pdf.status_code == 200
        assert pdf.content[:4] == b"%PDF"

    def test_unknown_fir_is_404_not_a_forgery(self, client):
        """A police document for a complaint that does not exist is not a fallback."""
        r = client.get("/api/fir/download/NOPE-12345")
        assert r.status_code == 404


class TestCybercrime:
    @pytest.mark.parametrize("scam,expect", [
        ("UPI", "UPI / Payment Scam"),
        ("OTP Fraud", "OTP Fraud"),
    ])
    def test_advice_differs_by_scam_type(self, client, scam, expect):
        r = client.post("/api/cybercrime/analyze", json={"scam_type": scam, "incident_summary": ""})
        assert r.status_code == 200
        assert r.json()["matched"] == expect

    def test_unknown_scam_says_so(self, client):
        r = client.post("/api/cybercrime/analyze", json={"scam_type": "zzz unknown", "incident_summary": ""})
        assert r.json()["recognised"] is False


class TestVision:
    def test_mask_does_not_claim_a_result(self, client):
        """The model cannot load on this tier; it must not answer COMPLIANT anyway."""
        r = client.post("/api/scan-mask", json={})
        assert r.status_code == 200
        body = r.json()
        assert body["implemented"] is False
        assert body["mask_detected"] is None

    def test_occupancy_is_labelled_as_recorded(self, client):
        r = client.post("/api/detect-occupancy", json={})
        assert r.status_code == 200
        body = r.json()
        assert body["live_inference"] is False
        assert body["sample"]["image"]

    def test_face_verify_requires_a_person_to_compare_against(self, client):
        """Defaulting the identity is how every face used to verify as one person."""
        r = client.post("/api/verify-face", json={"image_b64": "eHh4"})
        assert r.status_code in (400, 200)
        if r.status_code == 200:
            assert r.json().get("implemented") is False  # engine absent, degraded


class TestOfficerTools:
    @pytest.mark.parametrize("path,payload", [
        ("/api/internal/report", {"text": "case notes"}),
        ("/api/internal/meeting", {"text": "interrogation transcript"}),
        ("/api/internal/evidence", {"text": "seized one phone"}),
        ("/api/internal/legal-rag", {"query": "motor vehicle theft"}),
        ("/api/internal/agent", {"text": "investigate"}),
        ("/api/analyze/sentiment", {"text": "I am very angry"}),
        ("/api/internal/match_resume", {"role": "Constable", "resume": "5 years"}),
        ("/api/internal/nl_query", {"query": "how many complaints"}),
        ("/api/internal/generate_proposal", {"requirements": "AI copilot"}),
        ("/api/internal/prompt_playground", {"prompt": "summarise BNS 303"}),
        ("/api/internal/rag_upload", {"text": "legal text", "filename": "t.txt"}),
    ])
    def test_endpoint_responds(self, client, path, payload):
        assert client.post(path, json=payload).status_code == 200

    @pytest.mark.parametrize("path", ["/api/stations", "/api/telemetry", "/api/audit-trail"])
    def test_read_endpoints(self, client, path):
        assert client.get(path).status_code == 200


class TestFIRPrivacy:
    def test_fir_list_needs_the_admin_key(self, client):
        """FIR_STORE holds complainant names, phones and incident descriptions."""
        assert client.get("/api/fir/list").status_code == 404
