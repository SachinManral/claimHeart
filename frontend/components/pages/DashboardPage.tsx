"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FileText, ShieldAlert } from "lucide-react";
import MotionCard from "@/components/ui/MotionCard";
import { SkeletonBlock, SkeletonCard } from "@/components/ui/Skeleton";
import usePageReady from "@/hooks/usePageReady";
import { useAppStore } from "@/store/useAppStore";
import StatusBadge from "@/components/claims/StatusBadge";
import RecentActivityCard from "@/components/pages/RecentActivityCard";

export default function DashboardPage() {
  const claims = useAppStore((state) => state.claims);
  const notifications = useAppStore((state) => state.notifications);
  const ready = usePageReady();
  const pending = claims.filter((claim) => claim.status === "pending").length;
  const underReview = claims.filter((claim) => claim.status === "under_review").length;
  const approved = claims.filter((claim) => claim.status === "approved").length;
  const denied = claims.filter((claim) => claim.status === "denied").length;
  const totalValue = claims.reduce((sum, claim) => sum + claim.amount, 0);
  const latestClaims = useMemo(() => [...claims].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5), [claims]);

  const cards = [
    { label: "Live Queue", value: pending, helper: "Pending claims", icon: FileText },
    { label: "Manual Review", value: underReview, helper: "Awaiting adjudication", icon: ShieldAlert },
    { label: "Approved", value: approved, helper: "Cleared claims", icon: FileText },
    { label: "Denied", value: denied, helper: "Needs follow-up", icon: ShieldAlert },
    { label: "Claim Value", value: `Rs ${totalValue.toLocaleString("en-IN")}`, helper: "Across all claims", icon: FileText },
  ];

  if (!ready) {
    return (
      <div className="space-y-6">
        <div className="space-y-3"><SkeletonBlock className="h-9 w-56" /><SkeletonBlock className="h-5 w-80" /></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} lines={2} />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-bold tracking-[-0.04em] text-slate-900 md:text-[2rem]">Insurer Overview</h1>
          <p className="mt-2 text-base text-[var(--ch-muted)] md:text-lg">Every hospital submission, patient upload, and insurer action is visible here in real time.</p>
        </div>
        <div className="rounded-full border border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)] px-4 py-2 text-sm font-semibold text-[var(--ch-blue-dark)] transition-all">{notifications.filter((notification) => notification.targetRole === "insurer" && !notification.read).length} unread alerts</div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((item) => (
          <MotionCard key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--ch-subtle)]">{item.label}</p>
                <p className="mt-4 text-[2.2rem] font-bold tracking-[-0.04em] text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-[var(--ch-muted)]">{item.helper}</p>
              </div>
              <item.icon className="h-5 w-5 text-[var(--ch-blue)] transition-all" />
            </div>
          </MotionCard>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <MotionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Latest Claims</h2>
              <p className="mt-1 text-sm text-[var(--ch-muted)]">New claims appear here automatically when hospitals submit from another tab.</p>
            </div>
            <Link href="/claims" className="text-sm font-semibold text-[var(--ch-blue)] transition-all hover:opacity-80">Open queue</Link>
          </div>
          <div className="mt-6 space-y-4">
            {latestClaims.map((claim) => (
              <Link key={claim.id} href={`/dashboard/insurer/review/${claim.id}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{claim.id}</p>
                    <p className="mt-1 text-sm text-[var(--ch-muted)]">{claim.patientName} · {claim.hospital}</p>
                  </div>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="mt-3 text-sm text-[var(--ch-subtle)]">Rs {claim.amount.toLocaleString("en-IN")} · Risk {claim.riskScore}/100</p>
              </Link>
            ))}
          </div>
        </MotionCard>

        <RecentActivityCard role="insurer" />
      </section>
    </div>
  );
}
