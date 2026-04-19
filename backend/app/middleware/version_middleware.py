from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.versioning import build_version_headers, detect_version_from_path


class VersionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        version_info = detect_version_from_path(request.url.path)
        response = await call_next(request)
        for key, value in build_version_headers(version_info).items():
            response.headers.setdefault(key, value)
        return response
