# -*- coding: utf-8 -*-
import os
import sys
import unittest

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BACKEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend")
)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class Wave14CRMAndDiscoveryTests(unittest.TestCase):
    """Comprehensive tests for Universal CRM, Smart Commerce Discovery Lab, Competitor Feature Upgrades & Hub integrity."""

    def test_01_crm_dashboard_seeded_and_healthy(self):
        r = client.get("/api/crm/dashboard")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("contacts", data)
        self.assertIn("companies", data)
        self.assertIn("deals", data)
        self.assertIn("tasks", data)
        self.assertIn("total_value", data)
        self.assertIn("pipeline", data)
        self.assertIsInstance(data["pipeline"], list)

    def test_02_crm_contacts_crud_and_dedup(self):
        r = client.post(
            "/api/crm/contacts",
            json={
                "first_name": "Aarav",
                "last_name": "Mehta",
                "email": "aarav.wave14@sevenseed.in",
                "phone": "+91-9876543210",
                "job_title": "VP Product",
                "status": "qualified",
                "tags": "sevenforce,enterprise",
            },
        )
        self.assertEqual(r.status_code, 200)
        cid = r.json()["id"]
        self.assertTrue(r.json()["ok"])

        # Re-posting same email updates gracefully without 500
        r_dup = client.post(
            "/api/crm/contacts",
            json={
                "first_name": "Aarav",
                "last_name": "Mehta Updated",
                "email": "aarav.wave14@sevenseed.in",
                "job_title": "Chief Product Officer",
            },
        )
        self.assertEqual(r_dup.status_code, 200)
        self.assertEqual(r_dup.json()["id"], cid)

        r_list = client.get("/api/crm/contacts")
        self.assertEqual(r_list.status_code, 200)
        self.assertTrue(any(c["id"] == cid for c in r_list.json()))

        r_del = client.delete(f"/api/crm/contacts/{cid}")
        self.assertEqual(r_del.status_code, 200)
        self.assertTrue(r_del.json()["deleted"])

    def test_03_crm_companies_crud(self):
        r = client.post(
            "/api/crm/companies",
            json={
                "name": "Wave14 BioLabs",
                "domain": "wave14biolabs.in",
                "industry": "Biotech",
                "size": "200-500",
            },
        )
        self.assertEqual(r.status_code, 200)
        comp_id = r.json()["id"]

        r_list = client.get("/api/crm/companies")
        self.assertEqual(r_list.status_code, 200)
        self.assertTrue(any(c["id"] == comp_id for c in r_list.json()))

        r_del = client.delete(f"/api/crm/companies/{comp_id}")
        self.assertEqual(r_del.status_code, 200)
        self.assertTrue(r_del.json()["deleted"])

    def test_04_crm_deals_crud_and_stage_progression(self):
        r = client.post(
            "/api/crm/deals",
            json={
                "title": "Wave14 Enterprise AI Deal",
                "amount": 65000,
                "stage": "prospect",
                "probability": 20,
                "tags": "comonk",
            },
        )
        self.assertEqual(r.status_code, 200)
        deal_id = r.json()["id"]

        r_patch = client.patch(
            f"/api/crm/deals/{deal_id}",
            json={"stage": "negotiation", "amount": 72000},
        )
        self.assertEqual(r_patch.status_code, 200)
        updated = r_patch.json()["deal"]
        self.assertEqual(updated["stage"], "negotiation")
        self.assertEqual(updated["amount"], 72000)
        self.assertEqual(updated["probability"], 85)

        r_del = client.delete(f"/api/crm/deals/{deal_id}")
        self.assertEqual(r_del.status_code, 200)
        self.assertTrue(r_del.json()["deleted"])

    def test_05_crm_tasks_crud_and_toggle(self):
        r = client.post(
            "/api/crm/tasks",
            json={
                "title": "Follow up on Wave14 pilot",
                "description": "Send architecture deck",
                "priority": "high",
                "status": "todo",
            },
        )
        self.assertEqual(r.status_code, 200)
        tid = r.json()["id"]

        r_patch = client.patch(f"/api/crm/tasks/{tid}", json={"status": "done"})
        self.assertEqual(r_patch.status_code, 200)
        self.assertEqual(r_patch.json()["task"]["status"], "done")
        self.assertIsNotNone(r_patch.json()["task"]["completed_at"])

        r_del = client.delete(f"/api/crm/tasks/{tid}")
        self.assertEqual(r_del.status_code, 200)
        self.assertTrue(r_del.json()["deleted"])

    def test_06_crm_activities_log(self):
        r = client.post(
            "/api/crm/activities",
            json={
                "type": "call",
                "subject": "Discovery call with CTO",
                "description": "Discussed BYOK deployment topology",
            },
        )
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.json()["ok"])

        r_list = client.get("/api/crm/activities")
        self.assertEqual(r_list.status_code, 200)
        self.assertIsInstance(r_list.json(), list)

    def test_07_static_pages_and_pwa_assets_served(self):
        paths = [
            "/universal-crm.html",
            "/avp-emart/shopping-discovery.html",
            "/avp-emart/spec-compare.html",
            "/avp-emart/coupon-tester.html",
            "/avp-emart/deals-radar.html",
            "/avp-charitable-trust/health-camps.html",
            "/trust/health-camps.html",
            "/avpu/marketing-teardowns.html",
            "/decode-forest-pharmacy/drug-interaction.html",
            "/pharmacy/drug-interaction.html",
            "/breakdown-factor/crack-forensics.html",
            "/breakdown/crack-forensics.html",
            "/sevenforce/pricing.html",
            "/manifest.json",
            "/sw.js",
        ]
        for p in paths:
            r = client.get(p)
            self.assertEqual(r.status_code, 200, f"Expected 200 for {p}, got {r.status_code}")
            self.assertGreater(len(r.content), 50)

    def test_08_smartprix_buyhatke_xerve_google_shopping_features(self):
        r_spec = client.get("/avp-emart/spec-compare.html")
        self.assertIn("slotSelect0", r_spec.text)
        self.assertIn("prosConsGrid", r_spec.text)
        self.assertIn("aiVerdictBox", r_spec.text)

        r_cp = client.get("/avp-emart/coupon-tester.html")
        self.assertIn("bankCardSelect", r_cp.text)
        self.assertIn("upiLedgerList", r_cp.text)
        self.assertNotIn("alert(", r_cp.text)

        r_deals = client.get("/avp-emart/deals-radar.html")
        self.assertIn("udmBriefHeadline", r_deals.text)
        self.assertIn("typical-gauge-box", r_deals.text)

    def test_09_competitor_upgrades_across_trust_pharmacy_breakdown_sevenforce(self):
        r_camps = client.get("/avp-charitable-trust/health-camps.html")
        self.assertIn("matchedSchemesList", r_camps.text)
        self.assertIn("volunteerPassCard", r_camps.text)
        self.assertNotIn("alert(", r_camps.text)

        r_pharm = client.get("/decode-forest-pharmacy/drug-interaction.html")
        self.assertIn("PMBJP", r_pharm.text)
        self.assertIn("foodInteractionText", r_pharm.text)
        self.assertNotIn("alert(", r_pharm.text)

        r_crack = client.get("/breakdown-factor/crack-forensics.html")
        self.assertIn("crackVisualCanvas", r_crack.text)
        self.assertIn("boqRepairTableBody", r_crack.text)

        r_sf = client.get("/sevenforce/pricing.html")
        self.assertIn("roiTeamSizeSlider", r_sf.text)
        self.assertIn("roiAnnualSavings", r_sf.text)
        self.assertNotIn("alert(", r_sf.text)

    def test_10_wave15_workstations_and_hybrid_ai_engine(self):
        # 1. Hybrid Edge + Cloud Vertex AI Client
        r_vc = client.get("/vertex_client.js")
        self.assertEqual(r_vc.status_code, 200)
        self.assertIn("synthesizeDomainFallback", r_vc.text)

        # 2. AVPU Verify & Scholarships
        r_ver = client.get("/avpu/verify.html")
        self.assertEqual(r_ver.status_code, 200)
        self.assertIn("verifySearchInput", r_ver.text)
        self.assertIn("jsonLdPayload", r_ver.text)

        r_sch = client.get("/avpu/scholarships.html")
        self.assertEqual(r_sch.status_code, 200)
        self.assertIn("githubContributions", r_sch.text)
        self.assertIn("disbursementTableBody", r_sch.text)
        self.assertIn("awardLetterCard", r_sch.text)
        self.assertNotIn("alert(", r_sch.text)

        # 3. AVP Charitable Trust 80G & Impact Tracker
        r_tax = client.get("/avp-charitable-trust/tax-exemption.html")
        self.assertEqual(r_tax.status_code, 200)
        self.assertIn("donorTaxSlab", r_tax.text)
        self.assertIn("taxSavedVal", r_tax.text)
        self.assertIn("downloadForm10BEJson", r_tax.text)

        r_imp = client.get("/avp-charitable-trust/impact-tracker.html")
        self.assertEqual(r_imp.status_code, 200)
        self.assertIn("simDonationSlider", r_imp.text)
        self.assertIn("merkleInspectorBanner", r_imp.text)

        # 4. Decode Forest Pharmacy 10-Zone Body Map & NEWS2
        r_bm = client.get("/decode-forest-pharmacy/body-map.html")
        self.assertEqual(r_bm.status_code, 200)
        self.assertIn("news2RiskBadge", r_bm.text)
        self.assertIn("zone_vascular", r_bm.text)
        self.assertIn("otcLabStrip", r_bm.text)

        # 5. Breakdown Factor Site Visit CAPA & 3D BIM Digital Twin
        r_svr = client.get("/breakdown-factor/site-visit-report.html")
        self.assertEqual(r_svr.status_code, 200)
        self.assertIn("rpnSev", r_svr.text)
        self.assertIn("codeChecklistGrid", r_svr.text)
        self.assertNotIn("alert(", r_svr.text)

        r_bim = client.get("/breakdown-factor/bim-viewer.html")
        self.assertEqual(r_bim.status_code, 200)
        self.assertIn("seismicZoneSelect", r_bim.text)
        self.assertIn("fosValue", r_bim.text)
        self.assertIn("exportBimTakeoffCsv", r_bim.text)

        # 6. Rakshak AI Missing Person Amber Radar & BNS 2023 FIR Crosswalk
        r_mp = client.get("/rakshak-ai/missing-person.html")
        self.assertEqual(r_mp.status_code, 200)
        self.assertIn("amberRadiusSlider", r_mp.text)
        self.assertIn("sightingDrawer", r_mp.text)
        self.assertNotIn("alert(", r_mp.text)

        r_fir = client.get("/rakshak-ai/fir-generator.html")
        self.assertEqual(r_fir.status_code, 200)
        self.assertIn("ipcBnsSearchInput", r_fir.text)
        self.assertIn("includeBsa63Toggle", r_fir.text)

        # 7. AVP Emart Wishlist & Product Copywriter A9 LQS Grader
        r_wl = client.get("/avp-emart/wishlist.html")
        self.assertEqual(r_wl.status_code, 200)
        self.assertIn("webhookChannelSelect", r_wl.text)
        self.assertIn("exportWishlistJson", r_wl.text)
        self.assertNotIn("alert(", r_wl.text)

        r_pw = client.get("/avp-emart/product-writer.html")
        self.assertEqual(r_pw.status_code, 200)
        self.assertIn("lqsTotalScore", r_pw.text)
        self.assertNotIn("alert(", r_pw.text)

        # 8. Comonk Interview Coach, Behavioral Coach & Sevenforce WhatsApp Studio
        r_ic = client.get("/comonk/interview-coach.html")
        self.assertEqual(r_ic.status_code, 200)
        self.assertIn("evaluateStarRubricLive", r_ic.text)
        self.assertIn("insertSampleStarAnswer", r_ic.text)

        r_bc = client.get("/comonk/behavioral-coach.html")
        self.assertEqual(r_bc.status_code, 200)
        self.assertIn("runStarRewrite", r_bc.text)
        self.assertNotIn("alert(", r_bc.text)

        r_wa = client.get("/sevenforce/whatsapp-studio.html")
        self.assertEqual(r_wa.status_code, 200)
        self.assertIn("waRecipientsSlider", r_wa.text)
        self.assertIn("simulateButtonTap", r_wa.text)
        self.assertNotIn("alert(", r_wa.text)


if __name__ == "__main__":
    unittest.main()
