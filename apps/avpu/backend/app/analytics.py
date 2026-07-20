# -*- coding: utf-8 -*-
"""
AVPU — analytics for the student dashboard.
Aggregates the SQLite history (sessions, roadmaps, assessments, quizzes) into
overview stats, an activity timeline, and a score trend.
"""
from __future__ import annotations
import datetime
import json
import sqlite3

from . import config


def _conn() -> sqlite3.Connection:
    c = sqlite3.connect(config.DB_PATH)
    c.row_factory = sqlite3.Row
    return c


def _count(c: sqlite3.Connection, table: str) -> int:
    try:
        return c.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    except Exception:
        return 0


def _created_dates(c: sqlite3.Connection, table: str) -> list[str]:
    try:
        return [r[0][:10] for r in c.execute(f"SELECT created_at FROM {table}").fetchall() if r[0]]
    except Exception:
        return []


def overview() -> dict:
    with _conn() as c:
        sessions = _count(c, "learning_sessions")
        roadmaps = _count(c, "study_roadmaps")
        assessments = _count(c, "assessments")
        quizzes = _count(c, "quiz_attempts")
        users = _count(c, "users")

        # average assessment score
        scores: list[int] = []
        try:
            for r in c.execute("SELECT feedback_json FROM assessments ORDER BY id DESC LIMIT 50").fetchall():
                try:
                    s = json.loads(r[0]).get("score")
                    if isinstance(s, (int, float)):
                        scores.append(int(s))
                except Exception:
                    pass
        except Exception:
            pass
        avg_score = round(sum(scores) / len(scores)) if scores else 0

        # activity timeline (last 14 days)
        all_dates = (_created_dates(c, "learning_sessions") + _created_dates(c, "study_roadmaps") +
                     _created_dates(c, "assessments") + _created_dates(c, "quiz_attempts"))
        today = datetime.date.today()
        timeline = []
        for i in range(13, -1, -1):
            d = (today - datetime.timedelta(days=i)).isoformat()
            timeline.append({"date": d, "count": all_dates.count(d)})

        # recent activity feed
        recent = []
        for table, typ, col in [("assessments", "Assessment", "question"),
                                ("study_roadmaps", "Roadmap", "goal"),
                                ("learning_sessions", "Tutor chat", "subject"),
                                ("quiz_attempts", "Quiz", "topic")]:
            try:
                for r in c.execute(f"SELECT created_at, {col} FROM {table} ORDER BY id DESC LIMIT 5").fetchall():
                    recent.append({"type": typ, "label": (r[1] or "")[:60], "at": r[0]})
            except Exception:
                pass
        recent.sort(key=lambda x: x["at"] or "", reverse=True)

    total_activity = sessions + roadmaps + assessments + quizzes
    streak = _streak(timeline)
    return {
        "stats": {
            "users": users, "tutor_chats": sessions, "roadmaps": roadmaps,
            "assessments": assessments, "quizzes": quizzes,
            "avg_score": avg_score, "total_activity": total_activity, "streak_days": streak,
        },
        "timeline": timeline,
        "score_trend": scores[::-1][-10:],
        "recent": recent[:8],
    }


def _streak(timeline: list[dict]) -> int:
    streak = 0
    for day in reversed(timeline):
        if day["count"] > 0:
            streak += 1
        else:
            break
    return streak
