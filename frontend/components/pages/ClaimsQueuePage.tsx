"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { claims, type ClaimStatus } from "@/lib/data";

const filters: { label: string; value: "all" | ClaimStatus }[] = [
  { label: "All Claims", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Denied", value: "denied" },
  { label: "Fraud Flagged", value: "fraud" },
  { label: "Pending", value: "pending" },
  { label: "Escalated", value: "escalated" },
];

const statusTone: Record<ClaimStatus, string> = {
  approved: "bg-green-50 text-green-600 border-green-200",
  denied: "bg-red-50 text-red-500 border-red-200",
  pending: "bg-amber-50 text-amber-500 border-amber-200",
  fraud: "bg-red-50 text-red-500 border-red-200",
  escalated: "bg-orange-50 text-orange-500 border-orange-200",
};

export default function ClaimsQueuePage() {
  const [activeFilter, setActiveFilter] = useState<"all" | ClaimStatus>("all");
  const [search, setSearch] = useState("");

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesFilter = activeFilter === "all" || claim.status === activeFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        claim.id.toLowerCase().includes(q) ||
        claim.patient.toLowerCase().includes(q) ||
        claim.provider.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900 md:text-[2.1rem]">Claims Queue</h1>
        <p className="mt-2 text-base text-[var(--ch-muted)] md:text-lg">Review, filter, and act on all incoming claims</p>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;
            const count = filter.value === "all" ? claims.length : claims.filter((claim) => claim.status === filter.value).length;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-[var(--ch-blue)] bg-[var(--ch-blue)] text-white" : "border-slate-200 bg-white text-slate-600"}`}
              >
                {filter.label} <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/20 text-white" : "bg-slate-100 text-[var(--ch-blue)]"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search claims, patients..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none xl:max-w-xs"
        />
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          <span>Claim ID</span>
          <span>Patient</span>
          <span>Provider</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        <div>
          {filteredClaims.map((claim) => (
            <div key={claim.id} className="grid grid-cols-[1.1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-slate-100 px-6 py-5 text-sm last:border-b-0">
              <div>
                <p className="font-semibold text-[var(--ch-blue)]">{claim.id}</p>
                <p className="mt-1 text-[var(--ch-subtle)]">{claim.date}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{claim.patient}</p>
                <p className="mt-1 text-[var(--ch-subtle)]">{claim.patientId}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">{claim.provider}</p>
                <p className="mt-1 text-[var(--ch-subtle)]">{claim.city}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Rs {claim.amount.toLocaleString("en-IN")}</p>
                {claim.amountApproved > 0 && <p className="mt-1 text-green-600">Rs {claim.amountApproved.toLocaleString("en-IN")}</p>}
              </div>
              <div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[claim.status]}`}>{claim.status}</span>
              </div>
              <div>
                <Link href={`/claims/${claim.id}`} className="text-sm font-semibold text-[var(--ch-blue)]">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
