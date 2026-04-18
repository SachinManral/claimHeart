"use client";

import { useMemo, useState } from "react";
import { policies } from "@/lib/data";

type PolicyType = "all" | "group" | "individual" | "government";
type SortOrder = "newest" | "oldest";

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const derivePolicyType = (name: string): Exclude<PolicyType, "all"> => {
  const value = name.toLowerCase();
  if (value.includes("government") || value.includes("ayushman") || value.includes("cghs")) {
    return "government";
  }
  if (value.includes("group") || value.includes("corporate")) {
    return "group";
  }
  return "individual";
};

const parseLastUpdated = (raw: string): Date => {
  const match = raw.trim().toLowerCase().match(/([a-z]{3,})\s+(\d{4})/);
  if (!match) {
    return new Date(0);
  }
  const month = MONTH_INDEX[match[1].slice(0, 3)] ?? 0;
  const year = Number.parseInt(match[2], 10);
  return new Date(year, month, 1);
};

export default function PolicyLibraryPage() {
  const [activePolicyId, setActivePolicyId] = useState(policies[0]?.id ?? "");
  const [highlightedOnly, setHighlightedOnly] = useState(false);
  const [clauseSearch, setClauseSearch] = useState("");
  const [policySearch, setPolicySearch] = useState("");
  const [policyType, setPolicyType] = useState<PolicyType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filteredPolicies = useMemo(() => {
    const q = policySearch.trim().toLowerCase();

    return [...policies]
      .filter((item) => {
        const type = derivePolicyType(item.name);
        const matchesType = policyType === "all" || type === policyType;
        const matchesSearch =
          q.length === 0 ||
          item.name.toLowerCase().includes(q) ||
          item.insurer.toLowerCase().includes(q) ||
          item.version.toLowerCase().includes(q);
        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = parseLastUpdated(a.lastUpdated).getTime();
        const dateB = parseLastUpdated(b.lastUpdated).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [policySearch, policyType, sortOrder]);

  const activePolicy = filteredPolicies.find((item) => item.id === activePolicyId) ?? filteredPolicies[0] ?? policies[0];

  const clauses = useMemo(() => {
    if (!activePolicy) {
      return [];
    }

    const q = clauseSearch.toLowerCase();
    return activePolicy.clauses.filter((clause) => {
      const matchesSearch =
        q.length === 0 ||
        clause.title.toLowerCase().includes(q) ||
        clause.summary.toLowerCase().includes(q) ||
        clause.section.toLowerCase().includes(q);
      const matchesHighlight = !highlightedOnly || clause.highlighted;
      return matchesSearch && matchesHighlight;
    });
  }, [activePolicy, clauseSearch, highlightedOnly]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900 md:text-[2.1rem]">Policy Library</h1>
        <p className="mt-2 text-base text-[var(--ch-muted)] md:text-lg">RAG-indexed policy documents with AI-highlighted clauses and coverage notes</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="space-y-3 border-b border-slate-200 px-5 py-4">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Policy Documents</h2>
            <p className="text-sm text-[var(--ch-subtle)]">{filteredPolicies.length} matching documents</p>

            <input
              value={policySearch}
              onChange={(event) => setPolicySearch(event.target.value)}
              placeholder="Search policy name, insurer, version..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={policyType}
                onChange={(event) => setPolicyType(event.target.value as PolicyType)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="all">All types</option>
                <option value="group">Group</option>
                <option value="individual">Individual</option>
                <option value="government">Government</option>
              </select>

              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          <div>
            {filteredPolicies.map((item) => {
              const active = activePolicy && item.id === activePolicy.id;
              const type = derivePolicyType(item.name);
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePolicyId(item.id)}
                  className={`w-full border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 ${active ? "bg-[var(--ch-blue-light)]" : "bg-white"}`}
                >
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-[var(--ch-muted)]">{item.insurer}</p>
                  <p className="mt-2 text-xs text-[var(--ch-subtle)]">{item.version} - {item.pages} pages - {type}</p>
                </button>
              );
            })}
            {filteredPolicies.length === 0 ? (
              <div className="px-5 py-6 text-sm text-[var(--ch-muted)]">No policies match your search and filters.</div>
            ) : null}
          </div>
        </article>

        <div className="space-y-5">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.5rem]">{activePolicy?.name ?? "No policy selected"}</h2>
            {activePolicy ? (
              <p className="mt-3 text-base text-[var(--ch-muted)] md:text-lg">
                Insurer: {activePolicy.insurer} - {activePolicy.version} - Updated {activePolicy.lastUpdated}
              </p>
            ) : null}
          </article>

          {activePolicy ? (
            <article className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
              <h3 className="text-lg font-bold text-amber-700">AI Analysis Note</h3>
              <p className="mt-3 text-base leading-8 text-amber-900">{activePolicy.aiNote}</p>
            </article>
          ) : null}

          <div className="flex gap-3">
            <input
              value={clauseSearch}
              onChange={(event) => setClauseSearch(event.target.value)}
              placeholder="Search clauses, sections..."
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={() => setHighlightedOnly((value) => !value)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${highlightedOnly ? "border-[var(--ch-blue)] bg-[var(--ch-blue-light)] text-[var(--ch-blue)]" : "border-slate-200 bg-white text-slate-600"}`}
            >
              Highlighted Only
            </button>
          </div>

          <div className="space-y-4">
            {clauses.map((clause, index) => (
              <article
                key={`${clause.section}-${index}`}
                className={`rounded-[1.75rem] border bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${clause.highlighted ? "border-[var(--ch-blue)]" : "border-slate-200"}`}
              >
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-[var(--ch-blue-light)] px-3 py-1 font-semibold text-[var(--ch-blue)]">{clause.section}</span>
                  <span className="text-[var(--ch-subtle)]">Page {clause.page}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 md:text-[1.45rem]">{clause.title}</h3>
                <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-base leading-8 text-slate-800">{clause.summary}</div>
              </article>
            ))}
            {activePolicy && clauses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-8 text-sm text-[var(--ch-muted)]">
                No clauses match your current clause search/filter.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
