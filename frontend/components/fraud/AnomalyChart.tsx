"use client";

export type AnomalyPoint = {
  id: string;
  claimAmount: number;
  fraudScore: number;
  label?: string;
};

export default function AnomalyChart({ points }: { points: AnomalyPoint[] }) {
  const maxAmount = Math.max(1, ...points.map((point) => point.claimAmount));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Anomaly Distribution</h3>
      <div className="mt-4 h-56 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="relative h-full w-full">
          {points.map((point) => (
            <div
              key={point.id}
              title={`${point.label || point.id} · score ${(point.fraudScore * 100).toFixed(0)}%`}
              className="absolute h-3.5 w-3.5 rounded-full bg-rose-500/80 ring-2 ring-white"
              style={{
                left: `${(point.claimAmount / maxAmount) * 90}%`,
                bottom: `${Math.max(4, Math.min(92, point.fraudScore * 100))}%`,
              }}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">X-axis: claim amount · Y-axis: anomaly score</p>
    </article>
  );
}
