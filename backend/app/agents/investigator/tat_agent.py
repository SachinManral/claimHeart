from __future__ import annotations

from datetime import UTC, datetime


class TatAgent:
    SLA_THRESHOLDS_SECONDS = {
        "initial_approval": 3600,
        "discharge_approval": 10800,
        "query_response": 86400,
        "final_decision": 172800,
    }

    def _resolve_threshold(self, stage: str) -> int:
        return self.SLA_THRESHOLDS_SECONDS.get(stage, 86400)

    def identify_bottleneck(self, payload: dict) -> str | None:
        if payload.get("query_pending"):
            return "awaiting_query_response"
        if payload.get("missing_documents"):
            return "missing_documents"
        if payload.get("field_verification_required"):
            return "field_verification_pending"
        if payload.get("agent_failure"):
            return "agent_execution_failure"
        return None

    def check_claim_tat(self, payload: dict | None = None) -> dict:
        data = payload or {}
        stage = str(data.get("stage") or "initial_approval")

        started_at_raw = data.get("stage_started_at")
        if isinstance(started_at_raw, str):
            started_at = datetime.fromisoformat(started_at_raw.replace("Z", "+00:00"))
        elif isinstance(started_at_raw, datetime):
            started_at = started_at_raw
        else:
            started_at = datetime.now(UTC)

        elapsed_seconds = max(0, int((datetime.now(UTC) - started_at).total_seconds()))
        threshold = self._resolve_threshold(stage)
        breach_percentage = (elapsed_seconds / threshold) * 100 if threshold else 0

        if breach_percentage >= 100:
            status = "breached"
        elif breach_percentage >= 80:
            status = "warning"
        else:
            status = "on_track"

        return {
            "stage": stage,
            "status": status,
            "elapsed_seconds": elapsed_seconds,
            "threshold_seconds": threshold,
            "breach_percentage": round(breach_percentage, 2),
            "bottleneck_reason": self.identify_bottleneck(data),
        }

    def execute(self, payload: dict | None = None) -> dict:
        return {
            "module": "tat_agent",
            "ok": True,
            "analysis": self.check_claim_tat(payload),
        }
