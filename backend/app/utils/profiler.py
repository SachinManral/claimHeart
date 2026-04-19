from __future__ import annotations

from contextlib import contextmanager
from dataclasses import asdict, dataclass
from time import perf_counter
import tracemalloc


@dataclass
class ProfileSnapshot:
    label: str
    duration_ms: float
    memory_kb: float


@contextmanager
def profile_block(label: str):
    tracemalloc.start()
    started = perf_counter()
    try:
        yield
    finally:
        duration_ms = round((perf_counter() - started) * 1000, 2)
        _, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        profile_block.last_snapshot = ProfileSnapshot(
            label=label,
            duration_ms=duration_ms,
            memory_kb=round(peak / 1024, 2),
        )


profile_block.last_snapshot = None  # type: ignore[attr-defined]

class Profiler:
    def execute(self, payload: dict | None = None) -> dict:
        data = payload or {}
        iterations = int(data.get("iterations") or 10000)

        with profile_block("noop_loop"):
            total = 0
            for i in range(iterations):
                total += i

        snapshot = profile_block.last_snapshot
        return {
            "module": "profiler",
            "ok": True,
            "iterations": iterations,
            "checksum": total,
            "metrics": asdict(snapshot) if snapshot else {},
        }
