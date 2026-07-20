# -*- coding: utf-8 -*-
"""
Background Scheduler Task Runner.
Simulates chronologically scheduled campaign dispatches and reminders.
Reuses background polling/scheduling logic from whatsway and socialhub.
"""
from __future__ import annotations
import threading
import time
import sqlite3
import datetime

def _c(db_path):
    c = sqlite3.connect(db_path)
    c.row_factory = sqlite3.Row
    return c

def run_scheduler(db_path, stop_event: threading.Event):
    print("[Scheduler] Background task runner thread started.")
    
    # Ensure tables have required status fields for scheduled campaigns and reminders execution
    try:
        with _c(db_path) as c:
            c.execute("ALTER TABLE campaigns ADD COLUMN scheduled_at TEXT")
            c.commit()
    except Exception:
        pass

    try:
        with _c(db_path) as c:
            c.execute("ALTER TABLE reminders ADD COLUMN executed INTEGER DEFAULT 0")
            c.commit()
    except Exception:
        pass

    while not stop_event.is_set():
        try:
            now_iso = datetime.datetime.utcnow().isoformat()
            
            with _c(db_path) as c:
                # 1. Process pending reminders
                pending_reminders = c.execute(
                    "SELECT * FROM reminders WHERE remind_at <= ? AND (executed IS NULL OR executed = 0)", 
                    (now_iso,)
                ).fetchall()
                
                for r in pending_reminders:
                    print(f"[Scheduler] Triggering reminder alert: '{r['title']}' for {r['email']}")
                    c.execute("UPDATE reminders SET executed = 1 WHERE id = ?", (r["id"],))
                    
                # 2. Process scheduled campaigns
                pending_campaigns = c.execute(
                    "SELECT * FROM campaigns WHERE scheduled_at <= ? AND status = 'Scheduled'", 
                    (now_iso,)
                ).fetchall()
                
                for camp in pending_campaigns:
                    print(f"[Scheduler] Processing pending scheduled campaign ID {camp['id']} | Subject: {camp['subject']}")
                    
                    # Fetch recipients scheduled for dispatch
                    logs = c.execute(
                        "SELECT * FROM campaign_logs WHERE campaign_id = ? AND status = 'scheduled'", 
                        (camp["id"],)
                    ).fetchall()
                    
                    sent_count = 0
                    for log in logs:
                        # Log sending action
                        print(f"[Scheduler] Dispatching outbound campaign email to {log['email']}")
                        c.execute(
                            "UPDATE campaign_logs SET status = 'sent', sent_at = ? WHERE id = ?",
                            (datetime.datetime.utcnow().isoformat(), log["id"])
                        )
                        sent_count += 1
                        
                    c.execute(
                        "UPDATE campaigns SET status = 'Sent', total_sent = ? WHERE id = ?",
                        (sent_count, camp["id"])
                    )
                
                c.commit()
                
        except Exception as e:
            print(f"[Scheduler] Background thread loop error: {e}")
            
        time.sleep(15)

def start_scheduler_thread(db_path):
    stop_event = threading.Event()
    t = threading.Thread(target=run_scheduler, args=(db_path, stop_event), daemon=True)
    t.start()
    return stop_event
