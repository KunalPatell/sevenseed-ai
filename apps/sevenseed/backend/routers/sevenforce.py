import sys
from pathlib import Path
import importlib.util
from fastapi import APIRouter
from starlette.routing import Mount

# Resolve absolute path to sevenforce backend directory
HERE = Path(__file__).resolve()
APPS_DIR = HERE.parents[4] / "apps"
SEVENFORCE_DIR = APPS_DIR / "sevenforce" / "backend"

if str(SEVENFORCE_DIR) not in sys.path:
    sys.path.insert(0, str(SEVENFORCE_DIR))

# Temporarily isolate conflicting modules and all their sub-modules
conflict_modules = ["app", "data", "main", "config", "db", "features", "comparator", "agents", "questions", "social_poster", "api_keys", "app_keys"]
backup = {}
for m in list(sys.modules.keys()):
    if any(m == c or m.startswith(c + ".") for c in conflict_modules):
        backup[m] = sys.modules[m]
        del sys.modules[m]

# Dynamically load main.py under unique namespace
spec = importlib.util.spec_from_file_location("sevenforce_main", str(SEVENFORCE_DIR / "main.py"))
sevenforce_main = importlib.util.module_from_spec(spec)
sys.modules["sevenforce_main"] = sevenforce_main
spec.loader.exec_module(sevenforce_main)

# Restore conflicting modules
for m, mod in backup.items():
    sys.modules[m] = mod

router = APIRouter()
for route in sevenforce_main.app.routes:
    if not isinstance(route, Mount):
        router.routes.append(route)
