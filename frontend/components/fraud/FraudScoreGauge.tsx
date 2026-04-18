"use client";

import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

const severityMeta = {
  low: { tone: "text-emerald-600", icon: ShieldCheck },
  medium: { tone: "text-amber-600", icon: AlertTriangle },
  high: { tone: "text-orange-600", icon: ShieldAlert },
  critical: { tone: "text-rose-600", icon: ShieldAlert },
} as const;

export default function FraudScoreGauge({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(100, Math.round(score * 100)));
  const severity = normalized >= 85 ? "critical" : normalized >= 65 ? "high" : normalized >= 40 ? "medium" : "low";
  const stroke = 2 * Math.PI * 52;
  const offset = stroke - (normalized / 100) * stroke;
  const Icon = severityMeta[severity].icon;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(226 232 240)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={stroke}
            strokeDashoffset={offset}
            className={severityMeta[severity].tone}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-slate-900">{normalized}</p>
          <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Risk score</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Fraud severity</p>
        <p className={`mt-1 inline-flex items-center gap-2 text-lg font-bold capitalize ${severityMeta[severity].tone}`}>
          <Icon className="h-5 w-5" /> {severity}
        </p>
      </div>
    </div>
  );
}
