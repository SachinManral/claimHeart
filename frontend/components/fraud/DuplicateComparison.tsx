"use client";

export type DuplicateClaimSummary = {
  id: string;
  patientName: string;
  diagnosis: string;
  amount: number;
  hospital: string;
  submittedAt: string;
};

export default function DuplicateComparison({ left, right, similarity }: { left: DuplicateClaimSummary; right: DuplicateClaimSummary; similarity: number }) {
  const score = Math.max(0, Math.min(100, Math.round(similarity * 100)));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900">Duplicate Claim Comparison</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${score >= 85 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
          Similarity {score}%
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {[left, right].map((claim, index) => (
          <div key={claim.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Claim {index + 1}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{claim.id}</p>
            <p className="mt-2 text-sm text-slate-700">{claim.patientName} · {claim.diagnosis}</p>
            <p className="text-sm text-slate-700">₹{claim.amount.toLocaleString("en-IN")} · {claim.hospital}</p>
            <p className="text-xs text-slate-500">{new Date(claim.submittedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
