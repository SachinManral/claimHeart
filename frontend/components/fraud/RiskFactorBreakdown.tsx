"use client";

export type RiskFactor = {
  name: string;
  contribution: number;
  severity: "low" | "medium" | "high";
  detail?: string;
};

export default function RiskFactorBreakdown({ factors }: { factors: RiskFactor[] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Risk Factor Breakdown</h3>
      <div className="mt-4 space-y-3">
        {factors.map((factor) => (
          <div key={factor.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <p className="font-semibold text-slate-800">{factor.name}</p>
              <p className="text-slate-500">{Math.round(factor.contribution * 100)}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${factor.severity === "high" ? "bg-rose-500" : factor.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.max(4, Math.min(100, factor.contribution * 100))}%` }}
              />
            </div>
            {factor.detail ? <p className="mt-1 text-xs text-slate-500">{factor.detail}</p> : null}
          </div>
        ))}
      </div>
    </article>
  );
}
