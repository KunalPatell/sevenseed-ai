# -*- coding: utf-8 -*-
"""
AVP Charitable Trust — SMTP Donor Campaign Manager & Reply Thread Tracker.
"""
import os
import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
import datetime
import logging

logger = logging.getLogger("charitable_trust.campaign_manager")

DB_PATH = os.getenv("DB_PATH", "db.sqlite3")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")

IMAP_SERVER = os.getenv("IMAP_SERVER", "imap.gmail.com")
IMAP_PORT = int(os.getenv("IMAP_PORT", "993"))

def init_campaign_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
    CREATE TABLE IF NOT EXISTS donor_campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT,
        body TEXT,
        created_at TEXT
    )""")
    conn.execute("""
    CREATE TABLE IF NOT EXISTS campaign_sent_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER,
        email TEXT,
        message_id TEXT,
        status TEXT,
        replied INTEGER DEFAULT 0,
        last_checked TEXT,
        created_at TEXT
    )""")
    conn.commit()
    conn.close()

def send_donor_email(to_email: str, subject: str, body: str) -> str:
    """Send personalized email via SMTP and return Message-ID."""
    if not SMTP_USER or not SMTP_PASS:
        logger.warning("SMTP credentials missing. Simulating send.")
        return f"<simulated-{datetime.datetime.utcnow().timestamp()}@charitable.org>"
        
    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['To'] = to_email
    msg['Subject'] = subject
    
    # Inject unique tracking headers
    msg_id = f"<campaign-{datetime.datetime.utcnow().timestamp()}@{SMTP_SERVER.split('.')[-2]}.org>"
    msg['Message-ID'] = msg_id
    
    msg.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        return msg_id
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to_email, e)
        raise

def track_donor_replies():
    """Poll IMAP folder for replies in threads matching our sent campaigns."""
    if not SMTP_USER or not SMTP_PASS:
        logger.warning("SMTP/IMAP credentials missing. Skipping email polling.")
        return
        
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(SMTP_USER, SMTP_PASS)
        mail.select("inbox")
        
        # Connect sqlite
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        
        # Find sent logs that haven't received a reply yet
        logs = conn.execute("SELECT * FROM campaign_sent_logs WHERE replied = 0").fetchall()
        
        for log in logs:
            msg_id = log["message_id"]
            # Search for emails referencing this Message-ID in In-Reply-To header
            status, data = mail.search(None, f'(HEADER In-Reply-To "{msg_id}")')
            if status == "OK" and data[0]:
                conn.execute(
                    "UPDATE campaign_sent_logs SET replied = 1, last_checked = ? WHERE id = ?",
                    (datetime.datetime.utcnow().isoformat(), log["id"])
                )
                logger.info("Detected reply for thread Message-ID: %s", msg_id)
                
        conn.commit()
        conn.close()
        mail.logout()
    except Exception as e:
        logger.error("Error during reply tracking: %s", e)
