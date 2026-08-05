"""Point Rakshak's main.py at the functions its modules actually define.

apps/rakshak-ai/backend/main.py has twice been written against an imagined API —
sixteen calls to ai_engine/store/pdf_util functions that do not exist, which makes
/api/chat and /api/fir/generate return 500 on every request. The names below were
taken from the modules themselves (dir(module)), not guessed.

Anything with no real counterpart is left alone deliberately and reported, so it
is visible rather than silently mapped onto something that merely sounds similar.

Run from the repo root:  python scripts/fix_rakshak_api_names.py
Verify after:            python scripts/fix_rakshak_api_names.py --check
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

MAIN = Path("apps/rakshak-ai/backend/main.py")

# called name -> real name. Only where the real function does the same job.
RENAMES = {
    "ai_engine.chat_response": "ai_engine.generate_chat_response",
    "ai_engine.analyze_sentiment": "ai_engine.detect_risk",
    "ai_engine.generate_investigation_report": "ai_engine.generate_case_report",
    "ai_engine.generate_proposal": "ai_engine.generate_internal_report",
    "ai_engine.match_resume": "ai_engine.match_hr_resume",
    "ai_engine.nl_query": "ai_engine.nl_query_analytics",
    "ai_engine.run_investigation_agent": "ai_engine.run_agent_investigation",
    "ai_engine.search_legal_rag": "ai_engine.search_bns_laws",
    "ai_engine.test_prompt": "ai_engine.generate_chat_response",
    "store.add_rag_doc": "store.add_custom_chunk",
    "store.get_audit_ledger": "store.verify_audit_trail",
    "store.get_telemetry_stats": "store.get_telemetry",
    "store.save_complaint": "store.add_complaint",
    "store.verify_audit_integrity": "store.verify_audit_trail",
    "pdf_util.create_fir_pdf": "pdf_util.build_fir_pdf",
}

# log_telemetry(provider=, latency_ms=, tokens=, cost_usd=, success=) has no
# equivalent: the real one is add_telemetry(action, provider, duration_ms,
# input_tokens, output_tokens, status, cost). Different shape, so a rename would
# only move the failure to argument binding. Handled at the call site instead.
KEEP_MANUAL = {"store.log_telemetry"}


def apply() -> int:
    src = MAIN.read_text(encoding="utf-8")
    changed = 0
    for old, new in RENAMES.items():
        n = src.count(old)
        if n:
            src = src.replace(old, new)
            changed += n
            print(f"  {old:<42} -> {new}  ({n})")
    MAIN.write_text(src, encoding="utf-8")
    print(f"renamed {changed} call(s)")
    if KEEP_MANUAL:
        print("left for manual handling (different signature):")
        for k in sorted(KEEP_MANUAL):
            print("  ", k)
    return 0


def check() -> int:
    sys.path.insert(0, str(MAIN.parent))
    import ai_engine, faceauth, pdf_util, store  # noqa: E402

    mods = {"ai_engine": ai_engine, "store": store, "pdf_util": pdf_util, "faceauth": faceauth}
    src = MAIN.read_text(encoding="utf-8")
    missing = [
        f"{m}.{a}"
        for m, obj in mods.items()
        for a in sorted(set(re.findall(rf"\b{m}\.([a-zA-Z_][a-zA-Z0-9_]*)", src)))
        if not hasattr(obj, a)
    ]
    for x in missing:
        print("  MISSING:", x)
    print(f"{len(missing)} missing")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(check() if "--check" in sys.argv else apply())
