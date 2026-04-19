from __future__ import annotations

from app.agents.investigator.tat_agent import TatAgent
from app.tasks.worker import celery_app


@celery_app.task(name="app.tasks.tat_monitor.run")
def run(payload: dict | None = None) -> dict:
    agent = TatAgent()
    data = payload or {}
    claims = data.get("claims")

    if isinstance(claims, list):
        results = [agent.check_claim_tat(item if isinstance(item, dict) else {}) for item in claims]
    else:
        results = [agent.check_claim_tat(data)]

    return {
        "task": "tat_monitor",
        "status": "completed",
        "checked": len(results),
        "results": results,
    }
