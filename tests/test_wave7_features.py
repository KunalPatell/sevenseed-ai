# -*- coding: utf-8 -*-
import os
import sys
import unittest
import json

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Ensure backend path is in sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class Wave7FeaturesTests(unittest.TestCase):
    def setUp(self):
        pass

    def test_01_files_upload(self):
        files = {'file': ('test.txt', b'test content', 'text/plain')}
        r = client.post("/api/files/upload", files=files)
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('id', data)
        self.assertIn('filename', data)

    def test_02_files_list(self):
        r = client.get("/api/files/list")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('files', data)
        self.assertIsInstance(data['files'], list)

    def test_03_files_download(self):
        files = {'file': ('download_test.txt', b'hello world', 'text/plain')}
        r_up = client.post("/api/files/upload", files=files)
        self.assertEqual(r_up.status_code, 200)
        fid = r_up.json().get('id')
        r = client.get(f"/api/files/download/{fid}")
        self.assertEqual(r.status_code, 200)

    def test_04_files_delete(self):
        files = {'file': ('todelete.txt', b'delete me', 'text/plain')}
        r_up = client.post("/api/files/upload", files=files)
        self.assertEqual(r_up.status_code, 200)
        fid = r_up.json().get('id')
        r = client.delete(f"/api/files/{fid}")
        self.assertEqual(r.status_code, 200)

    def test_05_webhooks_register(self):
        r = client.post("/api/webhooks", json={"url": "http://example.com/hook", "events": ["test"]})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('id', data)

    def test_06_webhooks_list(self):
        r = client.get("/api/webhooks")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('webhooks', data)
        self.assertIsInstance(data['webhooks'], list)

    def test_07_webhooks_trigger(self):
        r_reg = client.post("/api/webhooks", json={"url": "http://127.0.0.1:9999/hook", "events": ["x"]})
        self.assertEqual(r_reg.status_code, 200)
        wid = r_reg.json().get('id')
        r = client.post(f"/api/webhooks/{wid}/trigger")
        self.assertIn(r.status_code, (200, 500))

    def test_08_webhooks_delete(self):
        r_reg = client.post("/api/webhooks", json={"url": "http://example.com/hook2", "events": []})
        self.assertEqual(r_reg.status_code, 200)
        wid = r_reg.json().get('id')
        r = client.delete(f"/api/webhooks/{wid}")
        self.assertEqual(r.status_code, 200)

    def test_09_team_members_list(self):
        r = client.get("/api/team/members")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('members', data)
        self.assertIsInstance(data['members'], list)

    def test_10_team_invite(self):
        r = client.post("/api/team/invite", json={"email": "test@example.com", "role": "member"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('id', data)

    def test_11_team_update_role(self):
        r_inv = client.post("/api/team/invite", json={"email": "role@example.com", "role": "member"})
        self.assertEqual(r_inv.status_code, 200)
        mid = r_inv.json().get('id')
        r = client.put(f"/api/team/members/{mid}/role", json={"role": "admin"})
        self.assertEqual(r.status_code, 200)

    def test_12_team_remove_member(self):
        r_inv = client.post("/api/team/invite", json={"email": "remove@example.com", "role": "member"})
        self.assertEqual(r_inv.status_code, 200)
        mid = r_inv.json().get('id')
        r = client.delete(f"/api/team/members/{mid}")
        self.assertEqual(r.status_code, 200)

    def test_13_reports_schedule(self):
        r = client.post("/api/reports/schedule", json={"report_type": "usage", "email": "user@example.com", "cron_expression": "0 9 * * *"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('id', data)

    def test_14_reports_list(self):
        r = client.get("/api/reports/list")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('reports', data)
        self.assertIsInstance(data['reports'], list)

    def test_15_reports_run(self):
        r_sched = client.post("/api/reports/schedule", json={"report_type": "daily", "email": "a@b.com"})
        self.assertEqual(r_sched.status_code, 200)
        rid = r_sched.json().get('id')
        r = client.post(f"/api/reports/{rid}/run")
        self.assertEqual(r.status_code, 200)

    def test_16_reports_delete(self):
        r_sched = client.post("/api/reports/schedule", json={"report_type": "weekly", "email": "c@d.com"})
        self.assertEqual(r_sched.status_code, 200)
        rid = r_sched.json().get('id')
        r = client.delete(f"/api/reports/{rid}")
        self.assertEqual(r.status_code, 200)

    def test_17_activity_feed(self):
        r = client.get("/api/activity/feed")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('feed', data)
        self.assertIsInstance(data['feed'], list)

    def test_18_activity_log(self):
        r = client.post("/api/activity/log", json={"actor": "test", "action": "test_action", "target": "x"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(data.get('ok') or 'id' in data)

    def test_19_rate_limit_status_with_and_without_admin_key(self):
        r1 = client.get("/api/rate-limit/status")
        self.assertEqual(r1.status_code, 200)
        data1 = r1.json()
        self.assertIn('rate_limit', data1)
        r2 = client.get("/api/rate-limit/status", headers={"X-Admin-Key": "sevenseed-admin-2026"})
        self.assertIn(r2.status_code, (200, 401, 403))

    def test_20_backup_create(self):
        r = client.post("/api/backup/create")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('id', data)

    def test_21_backup_list(self):
        r = client.get("/api/backup/list")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn('backups', data)
        self.assertIsInstance(data['backups'], list)

    def test_22_integrations_slack(self):
        r = client.post("/api/integrations/slack", json={"webhook_url": "http://127.0.0.1:9999/slack", "text": "hi"})
        self.assertIn(r.status_code, (200, 500))

    def test_23_integrations_discord(self):
        r = client.post("/api/integrations/discord", json={"webhook_url": "http://127.0.0.1:9999/discord", "content": "hi"})
        self.assertIn(r.status_code, (200, 500))

    def test_24_integrations_whatsapp(self):
        r = client.post("/api/integrations/whatsapp", json={"to": "+1234567890", "message": "hi"})
        self.assertIn(r.status_code, (200, 500))
        if r.status_code == 200:
            self.assertTrue(r.json().get('ok'))


if __name__ == "__main__":
    unittest.main()
