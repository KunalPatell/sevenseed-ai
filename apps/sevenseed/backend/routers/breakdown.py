import sys
from pathlib import Path
import importlib.util
from fastapi import APIRouter
from starlette.routing import Mount

# Resolve absolute path to breakdown-factor backend directory
HERE = Path(__file__).resolve()
APPS_DIR = HERE.parents[4] / "apps"
BREAKDOWN_DIR = APPS_DIR / "breakdown-factor" / "backend"

if str(BREAKDOWN_DIR) not in sys.path:
    sys.path.insert(0, str(BREAKDOWN_DIR))

# Temporarily isolate conflicting modules and all their sub-modules
conflict_modules = ["app", "data", "main", "config", "db", "features", "comparator", "agents", "questions", "social_poster", "api_keys", "app_keys"]
backup = {}
for m in list(sys.modules.keys()):
    if any(m == c or m.startswith(c + ".") for c in conflict_modules):
        backup[m] = sys.modules[m]
        del sys.modules[m]

# Dynamically load main.py under unique namespace
spec = importlib.util.spec_from_file_location("breakdown_main", str(BREAKDOWN_DIR / "main.py"))
breakdown_main = importlib.util.module_from_spec(spec)
sys.modules["breakdown_main"] = breakdown_main
spec.loader.exec_module(breakdown_main)

# Restore conflicting modules
for m, mod in backup.items():
    sys.modules[m] = mod

router = APIRouter()
for route in breakdown_main.app.routes:
    if not isinstance(route, Mount):
        router.routes.append(route)
