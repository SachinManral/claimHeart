from __future__ import annotations

from datetime import UTC, datetime, timedelta

from app.agents.investigator.tat_agent import TatAgent
from app.core.versioning import build_version_headers, detect_version_from_path
from app.utils.profiler import Profiler


def test_versioning_detects_v1_and_v2_paths():
    v1 = detect_version_from_path("/api/v1/claims")
    v2 = detect_version_from_path("/api/v2/claims")

    assert v1 is not None
    assert v1.version == "1.0"
    assert v2 is not None
    assert v2.version == "2.0"


def test_version_headers_are_added_for_versioned_path():
    info = detect_version_from_path("/api/v2/templates")
    headers = build_version_headers(info)

    assert headers["API-Version"] == "2.0"
    assert headers["API-Deprecated"] == "false"


def test_tat_agent_marks_breach_after_threshold():
    agent = TatAgent()
    payload = {
        "stage": "initial_approval",
        "stage_started_at": (datetime.now(UTC) - timedelta(hours=2)).isoformat(),
    }

    result = agent.check_claim_tat(payload)

    assert result["status"] == "breached"
    assert result["breach_percentage"] >= 100


def test_profiler_returns_metrics_payload():
    result = Profiler().execute({"iterations": 1000})

    assert result["ok"] is True
    assert result["metrics"]["duration_ms"] >= 0
    assert result["metrics"]["memory_kb"] >= 0
