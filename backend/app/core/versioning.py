from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class VersionInfo:
    version: str
    deprecated: bool = False
    sunset_date: str | None = None


SUPPORTED_VERSIONS: dict[str, VersionInfo] = {
    "v1": VersionInfo(version="1.0", deprecated=False),
    "v2": VersionInfo(version="2.0", deprecated=False),
}


def detect_version_from_path(path: str) -> VersionInfo | None:
    normalized = path.lower().strip()
    if "/api/v1" in normalized:
        return SUPPORTED_VERSIONS["v1"]
    if "/api/v2" in normalized:
        return SUPPORTED_VERSIONS["v2"]
    return None


def build_version_headers(info: VersionInfo | None) -> dict[str, str]:
    if info is None:
        return {}

    headers = {
        "API-Version": info.version,
        "API-Deprecated": str(info.deprecated).lower(),
    }
    if info.sunset_date:
        headers["API-Sunset-Date"] = info.sunset_date
    return headers

class Versioning:
    def execute(self, payload: dict | None = None) -> dict:
        data = payload or {}
        path = str(data.get("path") or "")
        info = detect_version_from_path(path)
        return {
            "module": "versioning",
            "ok": True,
            "path": path,
            "detected_version": info.version if info else None,
            "headers": build_version_headers(info),
        }
