"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, CircleAlert, CircleCheck, Clock3, LoaderCircle, UserRoundCog } from "lucide-react";

export type TimelineStatus = "completed" | "in_progress" | "pending" | "failed";

export type TimelineItem = {
  id: string;
  stage: string;
  status: TimelineStatus;
  timestamp?: string;
  durationMs?: number;
  actor?: "system" | "agent" | "human";
  actorName?: string;
  description: string;
  details?: {
    agentOutput?: string;
    documents?: string[];
    reasoning?: string;
    confidence?: number;
  };
  slaMs?: number;
};

const statusStyle: Record<TimelineStatus, string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  pending: "border-slate-200 bg-slate-50 text-slate-600",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusIcon = {
  completed: CircleCheck,
  in_progress: LoaderCircle,
  pending: Clock3,
  failed: CircleAlert,
};

const formatDuration = (durationMs?: number) => {
  if (!durationMs || durationMs <= 0) return "-";
  const minutes = Math.floor(durationMs / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

export default function ClaimTimeline({ items }: { items: TimelineItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ordered = useMemo(() => {
    return [...items].sort((a, b) => {
      const at = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bt = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return at - bt;
    });
  }, [items]);

  if (ordered.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">No timeline events yet.</div>;
  }

  return (
    <div className="space-y-4">
      {ordered.map((item, index) => {
        const Icon = statusIcon[item.status];
        const expanded = expandedId === item.id;
        const isDelayed = Boolean(item.slaMs && item.durationMs && item.durationMs > item.slaMs);

        return (
          <article key={item.id} className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {index < ordered.length - 1 ? <div className="absolute left-[1.02rem] top-[2.9rem] h-[calc(100%-1.5rem)] w-px bg-slate-200" /> : null}

            <div className="flex gap-3">
              <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${statusStyle[item.status]}`}>
                <Icon className={`h-3.5 w-3.5 ${item.status === "in_progress" ? "animate-spin" : ""}`} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.stage}</h4>
                    <p className="text-xs text-slate-500">{item.timestamp ? new Date(item.timestamp).toLocaleString() : "Timestamp pending"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    Details {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <p className="mt-2 text-sm text-slate-700">{item.description}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">Duration: {formatDuration(item.durationMs)}</span>
                  {item.actor ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
                      <UserRoundCog className="h-3 w-3" /> {(item.actorName || item.actor).toString()}
                    </span>
                  ) : null}
                  {isDelayed ? <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">Delay warning</span> : null}
                </div>

                {expanded ? (
                  <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                    {item.details?.reasoning ? <p><span className="font-semibold text-slate-800">Reasoning:</span> {item.details.reasoning}</p> : null}
                    {item.details?.confidence !== undefined ? <p><span className="font-semibold text-slate-800">Confidence:</span> {Math.round(item.details.confidence * 100)}%</p> : null}
                    {item.details?.agentOutput ? <p><span className="font-semibold text-slate-800">Agent output:</span> {item.details.agentOutput}</p> : null}
                    {item.details?.documents?.length ? (
                      <div>
                        <p className="font-semibold text-slate-800">Documents</p>
                        <ul className="mt-1 space-y-1">
                          {item.details.documents.map((doc) => (
                            <li key={doc} className="truncate">• {doc}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
