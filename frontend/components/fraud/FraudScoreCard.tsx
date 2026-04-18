"use client";

import FraudScoreGauge from "@/components/fraud/FraudScoreGauge";

export type FraudScore = {
  overall_score: number;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  recommendation: string;
};

export default function FraudScoreCard({ data }: { data: FraudScore }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Fraud Risk Overview</h3>
      <p className="mt-1 text-sm text-slate-500">Confidence {Math.round(data.confidence * 100)}%</p>
      <div className="mt-4">
        <FraudScoreGauge score={data.overall_score} />
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Recommendation:</span> {data.recommendation}
      </div>
    </article>
  );
}
