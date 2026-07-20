# -*- coding: utf-8 -*-
"""Bring-your-own-key: per-request context vars shared by main.py and features.py.

Set by api_key_override_middleware (main.py) from x-groq-key/x-gemini-key/
x-openai-key headers. LLM factories check these first, falling back to the
server's own env vars.
"""
from contextvars import ContextVar

groq_key_var = ContextVar("groq_key", default="")
gemini_key_var = ContextVar("gemini_key", default="")
openai_key_var = ContextVar("openai_key", default="")
