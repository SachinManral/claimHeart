from __future__ import annotations

from time import perf_counter

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class ProfilingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        started = perf_counter()
        response = await call_next(request)
        duration_ms = round((perf_counter() - started) * 1000, 2)
        response.headers.setdefault("X-Process-Time-Ms", str(duration_ms))
        response.headers.setdefault("X-Slow-Request", "true" if duration_ms > 1000 else "false")
        return response
