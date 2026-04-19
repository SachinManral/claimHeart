#!/usr/bin/env python3
from __future__ import annotations

import argparse
import cProfile
import json
import pstats
from pathlib import Path

from app.utils.profiler import Profiler


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Profile ClaimHeart agent utilities")
    parser.add_argument("--iterations", type=int, default=50000, help="Number of loop iterations")
    parser.add_argument("--top", type=int, default=15, help="Top function rows to print")
    parser.add_argument("--output", type=str, default="", help="Optional JSON output file path")
    return parser


def run_profile(iterations: int, top: int) -> dict:
    profiler = Profiler()
    pr = cProfile.Profile()
    pr.enable()
    result = profiler.execute({"iterations": iterations})
    pr.disable()

    stats = pstats.Stats(pr).sort_stats("cumtime")
    stats.print_stats(top)
    return result


def main() -> None:
    args = build_parser().parse_args()
    result = run_profile(args.iterations, args.top)
    print(json.dumps(result, indent=2, default=str))

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(result, indent=2, default=str))
        print(f"Saved profile summary to {output_path}")


if __name__ == "__main__":
    main()
