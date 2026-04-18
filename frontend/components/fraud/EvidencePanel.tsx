"use client";

export type EvidenceItem = {
  title: string;
  description: string;
  reference?: string;
};

export default function EvidencePanel({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Evidence Panel</h3>
      <ul className="mt-4 space-y-3">
        {evidence.map((item, index) => (
          <li key={`${item.title}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-sm text-slate-700">{item.description}</p>
            {item.reference ? <p className="mt-1 text-xs text-slate-500">Ref: {item.reference}</p> : null}
          </li>
        ))}
      </ul>
    </article>
  );
}
