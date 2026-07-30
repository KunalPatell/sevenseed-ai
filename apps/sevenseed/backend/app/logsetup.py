"""Make the app's own INFO logging actually appear.

Uvicorn configures only its own loggers ("uvicorn", "uvicorn.access"). Anything
this app logs goes to the "sevenseed" tree, which propagates to the root logger —
and the root logger's default level is WARNING with no handler. So every
`log.info(...)` in this codebase was being discarded, verified by running the
server and watching a contact submission produce no log line at all.

That mattered because notify.log_submission treats the log as the durable copy of
a contact message (SQLite here is wiped on every Render redeploy). A silent
logger meant that fallback did nothing.

We attach our own handler and stop propagation rather than calling
logging.basicConfig(), so this cannot fight uvicorn's configuration or duplicate
its output.
"""

from __future__ import annotations

import logging
import os
import sys

_ROOT_NAME = "sevenseed"
_configured = False


def setup() -> logging.Logger:
    """Idempotent. Returns the configured root app logger."""
    global _configured
    logger = logging.getLogger(_ROOT_NAME)
    if _configured:
        return logger

    level_name = os.environ.get("LOG_LEVEL", "INFO").strip().upper()
    level = getattr(logging, level_name, logging.INFO)
    if not isinstance(level, int):
        level = logging.INFO

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S%z",
        )
    )
    handler.setLevel(level)

    logger.setLevel(level)
    logger.handlers = [handler]
    logger.propagate = False  # our handler is the only one; no duplicate lines

    _configured = True
    return logger
