import { notFound } from "next/navigation";
import { claims } from "@/lib/data";

export default function ClaimDetailPage({ claimId }: { claimId: string }) {
  const claim = claims.find((item) => item.id === claimId);

  if (!claim) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--ch-blue)]">{claim.id}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-900 md:text-[2.1rem]">{claim.diagnosis}</h1>
          <p className="mt-2 text-base text-[var(--ch-muted)] md:text-lg">{claim.provider}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-right shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <p className="text-sm text-[var(--ch-subtle)]">Claim Amount</p>
          <p className="mt-1 text-lg font-bold text-slate-900 md:text-[1.45rem]">Rs {claim.amount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Claim Information</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-[var(--ch-subtle)]">Patient</p>
                <p className="mt-1 font-semibold text-slate-900">{claim.patient}</p>
                <p className="text-sm text-[var(--ch-muted)]">{claim.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--ch-subtle)]">Doctor</p>
                <p className="mt-1 font-semibold text-slate-900">{claim.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--ch-subtle)]">Policy</p>
                <p className="mt-1 font-semibold text-slate-900">{claim.policyNumber}</p>
                <p className="text-sm text-[var(--ch-muted)]">{claim.policyType}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--ch-subtle)]">Hospitalization</p>
                <p className="mt-1 font-semibold text-slate-900">{claim.hospitalizationDays} days</p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Policy Citations</h2>
            <div className="mt-5 space-y-3">
              {claim.policyMatches.map((match, index) => (
                <div key={`${match.section}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[var(--ch-blue-light)] px-3 py-1 text-xs font-semibold text-[var(--ch-blue)]">{match.section}</span>
                    <span className="text-sm text-[var(--ch-subtle)]">Page {match.page}</span>
                  </div>
                  <p className="mt-3 text-base text-slate-900">{match.clause}</p>
                  <p className="mt-3 text-sm font-semibold text-[var(--ch-muted)]">{match.match}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Fraud Findings</h2>
            <div className="mt-5 space-y-3">
              {claim.fraudFindings.length ? claim.fraudFindings.map((item, index) => (
                <div key={index} className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{item}</div>
              )) : <p className="text-sm text-[var(--ch-muted)]">No fraud findings for this claim.</p>}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Timeline</h2>
            <div className="mt-5 space-y-4">
              {claim.timeline.map((item, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-900">{item.event}</p>
                  <p className="mt-1 text-sm text-[var(--ch-muted)]">{item.time}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-[var(--ch-blue-dark)] md:text-[1.45rem]">Mediator Explanation</h2>
            <p className="mt-4 text-base leading-8 text-slate-800">{claim.mediatorNote}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
