# -*- coding: utf-8 -*-
"""
Python Code Interpreter / Sandboxed Executor module.
Allows AVPU students to execute Python snippets and view stdout/stderr/results.
"""
from __future__ import annotations
import sys
import subprocess
import tempfile
import os
import time

def execute_python_code(code: str, timeout: float = 5.0) -> dict:
    code = code or ""
    if not code.strip():
        return {"success": False, "error": "No code provided to execute."}
        
    # Security guard: block basic dangerous keywords to prevent local workspace compromises
    blocked_keywords = ["os.system", "subprocess.", "shutil.", "os.remove", "os.rmdir", "open("]
    for kw in blocked_keywords:
        if kw in code:
            return {
                "success": False,
                "error": f"Security Exception: Use of blocked module/keyword '{kw}' is prohibited."
            }

    # Write code to a temporary file
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w", encoding="utf-8") as temp_file:
        temp_file.write(code)
        temp_path = temp_file.name

    start_time = time.perf_counter()
    try:
        # Run code in a separate python subprocess
        res = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        elapsed = time.perf_counter() - start_time
        
        return {
            "success": res.returncode == 0,
            "stdout": res.stdout,
            "stderr": res.stderr,
            "exit_code": res.returncode,
            "execution_time_sec": round(elapsed, 4)
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": f"Execution Timed Out: Code execution exceeded the {timeout} second limit.",
            "execution_time_sec": timeout
        }
    finally:
        try:
            os.remove(temp_path)
        except Exception:
            pass
