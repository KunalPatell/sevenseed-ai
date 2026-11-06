import contextvars
import os

request_keys = contextvars.ContextVar("request_keys", default={})

def get_key(name: str) -> str:
    try:
        ctx_keys = request_keys.get()
        if name in ctx_keys and ctx_keys[name]:
            return ctx_keys[name]
    except Exception:
        pass
    return os.environ.get(name, "").strip()
