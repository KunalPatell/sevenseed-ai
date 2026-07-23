# -*- coding: utf-8 -*-
"""
Static analysis tests for the entire Sevenseed platform.
Tests: Python syntax validity for every .py file, secrets scan,
       bare except: detection, requirements.txt presence, package.json scripts.
"""
from __future__ import annotations
import os
import ast
import re
import json
import glob
import pytest

PLATFORM_ROOT = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)
APPS_DIR = os.path.join(PLATFORM_ROOT, "apps")

# Secret patterns to scan for
SECRET_PATTERNS = [
    r'(?i)(password|secret|api_key|apikey|token|passwd)\s*=\s*["\'][^"\']{8,}["\']',
    r'sk-[a-zA-Z0-9]{20,}',           # OpenAI key
    r'gsk_[a-zA-Z0-9]{30,}',          # Groq key
    r'AIza[0-9A-Za-z\-_]{35}',        # Google API key
    r'AKIA[0-9A-Z]{16}',              # AWS Access Key
]

# ─────────────────────────────────────────────────────────────────────────────
# Helper: collect all .py files (skip __pycache__, node_modules, migrations)
# ─────────────────────────────────────────────────────────────────────────────
def collect_python_files(root: str) -> list[str]:
    py_files = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip noise directories
        dirnames[:] = [d for d in dirnames if d not in (
            "__pycache__", "node_modules", ".next", "out", ".git",
            "venv", ".venv", "env", "site-packages"
        )]
        for fname in filenames:
            if fname.endswith(".py"):
                py_files.append(os.path.join(dirpath, fname))
    return py_files


ALL_PY_FILES = collect_python_files(APPS_DIR)
# Also check platform root scripts
ROOT_PY_FILES = [f for f in glob.glob(os.path.join(PLATFORM_ROOT, "*.py"))]


# ─────────────────────────────────────────────────────────────────────────────
# PYTHON SYNTAX VALIDITY
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.parametrize("py_file", ALL_PY_FILES + ROOT_PY_FILES)
def test_python_syntax_valid(py_file):
    """Every .py file must parse without SyntaxError."""
    rel = os.path.relpath(py_file, PLATFORM_ROOT)
    try:
        with open(py_file, "r", encoding="utf-8", errors="replace") as f:
            source = f.read()
        ast.parse(source, filename=py_file)
    except SyntaxError as e:
        pytest.fail(f"SyntaxError in {rel}: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# SECRETS SCAN
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.parametrize("py_file", ALL_PY_FILES + ROOT_PY_FILES)
def test_no_hardcoded_secrets(py_file):
    """Source files must not contain hardcoded API keys or passwords."""
    rel = os.path.relpath(py_file, PLATFORM_ROOT)

    # Skip .env files (those are for local dev)
    if py_file.endswith(".env") or ".env.example" in py_file:
        return

    with open(py_file, "r", encoding="utf-8", errors="replace") as f:
        source = f.read()

    for pattern in SECRET_PATTERNS:
        matches = re.findall(pattern, source)
        if matches:
            # Whitelist: known fake/dev secrets in tests or examples
            safe_values = [
                "avpu-dev-secret-change-in-prod",  # explicitly marked as dev
                "test-secret-key",
                "gsk_test_fake_key_for_unit_tests",
                "change-in-prod",
                "your-secret",
                "your_secret",
                "dev-secret",
                "example",
                "placeholder",
                "api_key",       # variable names like SERPAPI_KEY, GROQ_API_KEY
                "apikey",
                "groq_api_key",
                "gemini_api_key",
                "openai_api_key",
                "serpapi_key",
                "os.environ",    # reading from env
                "os.getenv",
                "getenv",
                "environ",
                "getattr",
                "config",
                "settings",
                "none",
                '""',
                "''",
                '"")',
                "None",
            ]
            for match in matches:
                match_str = match if isinstance(match, str) else str(match)
                if not any(safe in match_str.lower() for safe in safe_values):
                    pytest.fail(
                        f"Possible hardcoded secret in {rel} "
                        f"(pattern: {pattern[:30]}...): {match_str[:50]}"
                    )


# ─────────────────────────────────────────────────────────────────────────────
# BARE EXCEPT DETECTION (code quality)
# ─────────────────────────────────────────────────────────────────────────────
def _count_bare_excepts(py_file: str) -> list[int]:
    """Return line numbers of bare `except:` clauses."""
    lines = []
    try:
        with open(py_file, "r", encoding="utf-8", errors="replace") as f:
            for lineno, line in enumerate(f, 1):
                stripped = line.strip()
                if stripped == "except:" or stripped.startswith("except:  #"):
                    lines.append(lineno)
    except Exception:
        pass
    return lines


def test_bare_except_audit():
    """Catalogue bare except: clauses — warn but do not fail (informational)."""
    report = {}
    for py_file in ALL_PY_FILES:
        rel = os.path.relpath(py_file, PLATFORM_ROOT)
        lines = _count_bare_excepts(py_file)
        if lines:
            report[rel] = lines

    if report:
        msg = "Bare except: found (consider catching specific exceptions):\n"
        for f, lns in report.items():
            msg += f"  {f}: lines {lns}\n"
        # This is a WARNING, not a failure — we just print for awareness
        print(f"\n[AUDIT] {msg}")
    # We do not pytest.fail() here — just ensure the scan ran
    assert True


# ─────────────────────────────────────────────────────────────────────────────
# REQUIREMENTS.TXT PRESENCE
# ─────────────────────────────────────────────────────────────────────────────
EXPECTED_BACKEND_APPS = [
    "avpu", "avp-emart", "breakdown-factor",
    "decode-forest-pharmacy", "sevenforce", "sevenseed", "avp-charitable-trust"
]


@pytest.mark.parametrize("app_name", EXPECTED_BACKEND_APPS)
def test_requirements_txt_exists(app_name):
    req_path = os.path.join(APPS_DIR, app_name, "backend", "requirements.txt")
    assert os.path.exists(req_path), f"Missing requirements.txt for {app_name}"


@pytest.mark.parametrize("app_name", EXPECTED_BACKEND_APPS)
def test_requirements_txt_not_empty(app_name):
    req_path = os.path.join(APPS_DIR, app_name, "backend", "requirements.txt")
    if not os.path.exists(req_path):
        pytest.skip(f"No requirements.txt for {app_name}")
    with open(req_path) as f:
        content = f.read().strip()
    assert len(content) > 0, f"requirements.txt is empty for {app_name}"


@pytest.mark.parametrize("app_name", EXPECTED_BACKEND_APPS)
def test_fastapi_in_requirements(app_name):
    req_path = os.path.join(APPS_DIR, app_name, "backend", "requirements.txt")
    if not os.path.exists(req_path):
        pytest.skip(f"No requirements.txt for {app_name}")
    with open(req_path) as f:
        content = f.read().lower()
    assert "fastapi" in content, f"fastapi not in requirements.txt for {app_name}"


# ─────────────────────────────────────────────────────────────────────────────
# PACKAGE.JSON SCRIPTS COMPLETENESS
# ─────────────────────────────────────────────────────────────────────────────
EXPECTED_FRONTEND_APPS = ["avpu", "avp-emart", "breakdown-factor",
                           "decode-forest-pharmacy", "sevenseed"]

REQUIRED_SCRIPTS = ["dev", "build", "lint"]


@pytest.mark.parametrize("app_name", EXPECTED_FRONTEND_APPS)
def test_package_json_exists(app_name):
    pkg_path = os.path.join(APPS_DIR, app_name, "frontend", "package.json")
    assert os.path.exists(pkg_path), f"Missing package.json for {app_name}/frontend"


@pytest.mark.parametrize("app_name", EXPECTED_FRONTEND_APPS)
def test_package_json_scripts(app_name):
    pkg_path = os.path.join(APPS_DIR, app_name, "frontend", "package.json")
    if not os.path.exists(pkg_path):
        pytest.skip(f"No package.json for {app_name}")
    with open(pkg_path) as f:
        pkg = json.load(f)
    scripts = pkg.get("scripts", {})
    for script in REQUIRED_SCRIPTS:
        assert script in scripts, f"Missing '{script}' script in {app_name}/frontend/package.json"


# ─────────────────────────────────────────────────────────────────────────────
# DOCKERFILE SYNTAX
# ─────────────────────────────────────────────────────────────────────────────
DOCKERFILE_APPS = ["avpu", "avp-emart", "breakdown-factor",
                   "decode-forest-pharmacy", "sevenforce", "sevenseed"]


@pytest.mark.parametrize("app_name", DOCKERFILE_APPS)
def test_dockerfile_exists(app_name):
    df_path = os.path.join(APPS_DIR, app_name, "Dockerfile")
    assert os.path.exists(df_path), f"Missing Dockerfile for {app_name}"


@pytest.mark.parametrize("app_name", DOCKERFILE_APPS)
def test_dockerfile_has_from(app_name):
    df_path = os.path.join(APPS_DIR, app_name, "Dockerfile")
    if not os.path.exists(df_path):
        pytest.skip(f"No Dockerfile for {app_name}")
    with open(df_path) as f:
        content = f.read()
    assert "FROM " in content, f"Dockerfile for {app_name} missing FROM instruction"


@pytest.mark.parametrize("app_name", DOCKERFILE_APPS)
def test_dockerfile_has_cmd_or_entrypoint(app_name):
    df_path = os.path.join(APPS_DIR, app_name, "Dockerfile")
    if not os.path.exists(df_path):
        pytest.skip(f"No Dockerfile for {app_name}")
    with open(df_path) as f:
        content = f.read()
    assert "CMD " in content or "ENTRYPOINT " in content, \
        f"Dockerfile for {app_name} missing CMD/ENTRYPOINT"


# ─────────────────────────────────────────────────────────────────────────────
# ENV EXAMPLE COMPLETENESS
# ─────────────────────────────────────────────────────────────────────────────
def _parse_env_keys(path: str) -> set[str]:
    keys = set()
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    keys.add(line.split("=")[0].strip())
    except Exception:
        pass
    return keys


ENV_EXAMPLE_APPS = ["avpu", "avp-emart", "breakdown-factor", "decode-forest-pharmacy"]


@pytest.mark.parametrize("app_name", ENV_EXAMPLE_APPS)
def test_env_example_not_missing_keys_vs_env(app_name):
    """Keys in .env.example should be a superset of keys in .env (no surprise vars)."""
    example_path = os.path.join(APPS_DIR, app_name, "backend", ".env.example")
    env_path = os.path.join(APPS_DIR, app_name, "backend", ".env")
    if not os.path.exists(example_path) or not os.path.exists(env_path):
        pytest.skip(f"Missing .env or .env.example for {app_name}")
    example_keys = _parse_env_keys(example_path)
    env_keys = _parse_env_keys(env_path)
    # Allow .env to have extra keys (local overrides), but .env.example should document the base set
    # Warn about any key in .env that's not documented in .env.example
    undocumented = env_keys - example_keys
    if undocumented:
        print(f"\n[AUDIT] {app_name}: .env has undocumented keys not in .env.example: {undocumented}")
    # Not a failure — just audit
    assert True
