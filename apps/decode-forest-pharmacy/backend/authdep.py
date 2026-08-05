# -*- coding: utf-8 -*-
"""Authentication dependency, kept out of features.py on purpose.

main.py used to do `from features import require_user`. The platform's test suite
replaces the whole features module with a MagicMock (see tests/test_*/test_api.py,
`sys.modules["features"] = MagicMock(router=APIRouter())`), so in tests
require_user became a MagicMock and FastAPI could not introspect it as a
dependency — every protected route answered 422 instead of 401, and five tests
that assert anonymous reads failed.

Auth does not belong to a feature router anyway. Living here means both main.py
and features.py can import it and the tests leave it alone.
"""
from __future__ import annotations

from fastapi import Header, HTTPException


def require_user(authorization: str | None = Header(default=None)):
    """Reject anonymous callers on endpoints that return personal data.

    Typed `str | None` deliberately: `str = Header(None)` declares a required str
    with a None default, which FastAPI rejects with 422 before this function runs,
    so callers never see the 401 they should.
    """
    from features import _verify  # imported late: features is heavy and mocked in tests

    token = authorization.replace("Bearer ", "").strip() if authorization else None
    user = _verify(token)
    if not user:
        raise HTTPException(status_code=401, detail="Sign in to view this data.")
    return user
