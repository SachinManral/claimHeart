import Link from "next/link";
import { claims, claimsTimelineData, denialReasonsData, fraudTypeData, kpiData, agentStatus, formatCurrency } from "@/lib/data";
import { AlertTriangle, CheckCircle2, Clock3, TrendingDown, TrendingUp } from "lucide-react";

const kpis = [
  {
    label: "Claims Processed",
    value: kpiData.claimsProcessed.toLocaleString("en-IN"),
    delta: kpiData.claimsProcessedDelta,
    icon: Clock3,
    tone: "text-[var(--ch-blue)]",
    bg: "bg-[var(--ch-blue-light)]",
  },
  {
    label: "Approval Rate",
    value: `${kpiData.approvalRate}%`,
    delta: kpiData.approvalRateDelta,
    icon: CheckCircle2,
    tone: "text-[var(--ch-green)]",
    bg: "bg-green-50",
  },
  {
    label: "Fraud Flags",
    value: `${kpiData.fraudFlags}`,
    delta: kpiData.fraudFlagsDelta,
    icon: AlertTriangle,
    tone: "text-[var(--ch-red)]",
    bg: "bg-red-50",
  },
  {
    label: "Avg Processing Time",
    value: `${kpiData.avgProcessingTime}s`,
    delta: kpiData.processingTimeDelta,
    icon: Clock3,
    tone: "text-[var(--ch-amber)]",
    bg: "bg-amber-50",
  },
  {
    label: "Revenue Saved",
    value: formatCurrency(kpiData.revenueSaved, "Rs"),
    delta: kpiData.revenueSavedDelta,
    icon: TrendingUp,
    tone: "text-[var(--ch-blue-dark)]",
    bg: "bg-[var(--ch-blue-light)]",
  },
];

export default function DashboardPage() {
  const maxClaims = Math.max(...claimsTimelineData.map((item) => item.claims));
  const maxDenials = Math.max(...denialReasonsData.map((item) => item.count));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold tracking-[-0.04em] text-slate-900 md:text-[2rem]">Claims Command Center</h1>
          <p className="mt-2 text-base text-[var(--ch-muted)] md:text-lg">Real-time intelligence across all active claims - Today, March 31, 2026</p>
        </div>
        <div className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">All 4 Agents Active</div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => (
          <article key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.tone}`} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-semibold ${item.delta.startsWith("-") ? "text-green-600" : item.label === "Fraud Flags" ? "text-red-500" : "text-green-600"}`}>
                {item.delta.startsWith("-") ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {item.delta}
              </span>
            </div>
            <p className={`mt-6 text-[2.6rem] font-bold tracking-[-0.04em] xl:text-[2.75rem] ${item.tone}`}>{item.value}</p>
            <p className="mt-2 text-base text-[var(--ch-muted)] md:text-lg">{item.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <h2 className="text-[1.55rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[1.65rem]">Claims Volume - Last 6 Months</h2>
          <p className="mt-1 text-base text-[var(--ch-subtle)]">Approved vs denied trend</p>
          <div className="mt-8 space-y-5">
            {claimsTimelineData.map((item) => (
              <div key={item.month}>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-500">
                  <span>{item.month}</span>
                  <span>{item.claims}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-[var(--ch-blue)]" style={{ width: `${(item.claims / maxClaims) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <h2 className="text-[1.55rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[1.65rem]">Fraud Type Distribution</h2>
          <p className="mt-1 text-base text-[var(--ch-subtle)]">Current month</p>
          <div className="mt-8 space-y-4">
            {fraudTypeData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <h2 className="text-[1.55rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[1.65rem]">Top Denial Reasons</h2>
          <p className="mt-1 text-base text-[var(--ch-subtle)]">This month</p>
          <div className="mt-8 space-y-5">
            {denialReasonsData.map((item) => (
              <div key={item.reason}>
                <div className="mb-2 flex items-center justify-between text-sm md:text-base">
                  <span className="text-slate-700">{item.reason}</span>
                  <span className="font-semibold text-slate-900">{item.count}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-[var(--ch-blue)]" style={{ width: `${(item.count / maxDenials) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[1.55rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[1.65rem]">Agent Status Panel</h2>
              <p className="mt-1 text-base text-[var(--ch-subtle)]">Live performance</p>
            </div>
            <span className="text-sm font-semibold text-green-600">All Systems Go</span>
          </div>
          <div className="mt-6 space-y-4">
            {agentStatus.map((agent) => (
              <div key={agent.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{agent.name}</p>
                  <span className="text-sm text-[var(--ch-muted)]">{agent.latency}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-[var(--ch-muted)]">
                  <span>Accuracy</span>
                  <span className="font-semibold text-slate-900">{agent.accuracy}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-[var(--ch-blue)]" style={{ width: `${agent.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[1.55rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[1.65rem]">Recent Claims</h2>
              <p className="mt-1 text-base text-[var(--ch-subtle)]">Latest activity</p>
            </div>
            <Link href="/claims" className="text-sm font-semibold text-[var(--ch-blue)]">View all</Link>
          </div>
          <div className="mt-6 space-y-3">
            {claims.slice(0, 5).map((claim) => (
              <div key={claim.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{claim.id}</p>
                    <p className="mt-1 text-sm text-[var(--ch-muted)]">{claim.patient}</p>
                  </div>
                  <p className="font-semibold text-slate-900">Rs {claim.amount.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
