"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { FileBadge2, FolderUp } from "lucide-react";
import ClaimDrawer from "@/components/claims/ClaimDrawer";
import StatusBadge from "@/components/claims/StatusBadge";
import UploadBox from "@/components/claims/UploadBox";
import RecentActivityCard from "@/components/pages/RecentActivityCard";
import MotionCard from "@/components/ui/MotionCard";
import { SkeletonBlock, SkeletonCard } from "@/components/ui/Skeleton";
import usePageReady from "@/hooks/usePageReady";
import { getCurrentUser } from "@/lib/api/auth";
import { addClaimDocument } from "@/lib/api/claims";
import { useAppStore } from "@/store/useAppStore";
import type { AppUser, UploadedDocument } from "@/types";

export default function PatientDashboardPage() {
  const claims = useAppStore((state) => state.claims);
  const [user, setUser] = useState<AppUser | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [activeClaimId, setActiveClaimId] = useState<string>("CLM-001");
  const [files, setFiles] = useState<UploadedDocument[]>([]);
  const ready = usePageReady();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const patientClaims = useMemo(() => claims.filter((claim) => claim.patientId === (user?.patientId ?? user?.id)), [claims, user?.id, user?.patientId]);

  const handleUpload = (incoming: UploadedDocument[]) => {
    setFiles((current) => [...current, ...incoming.map((file) => ({ ...file, uploadedBy: "patient" }))]);
  };

  const removeFile = (name: string) => setFiles((current) => current.filter((file) => file.name !== name));

  const saveDocuments = async () => {
    if (!activeClaimId || files.length === 0) {
      toast.error("Choose a claim and at least one document.");
      return;
    }

    for (const file of files) {
      await addClaimDocument(activeClaimId, file, "patient");
    }

    setFiles([]);
    toast.success("Documents uploaded. Insurer has been notified.");
  };

  if (!ready || !user) {
    return (
      <div className="space-y-6">
        <div className="space-y-3"><SkeletonBlock className="h-9 w-56" /><SkeletonBlock className="h-5 w-80" /></div>
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6"><SkeletonCard lines={4} /><SkeletonCard lines={3} /></div>
          <SkeletonCard lines={4} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[1.8rem] font-bold tracking-[-0.04em] text-slate-900 sm:text-[2rem]">Patient Claim Center</h1>
            <p className="mt-2 text-sm text-[var(--ch-muted)] sm:text-base md:text-lg">Track your claims live and upload documents that appear on the insurer side instantly.</p>
          </div>
          <div className="w-fit rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-600 transition-all">{patientClaims.length} claims visible</div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <MotionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 md:text-[1.45rem]"><FileBadge2 className="h-5 w-5 text-[var(--ch-blue)]" />My Claims</h2>
                  <p className="mt-1 text-sm text-[var(--ch-muted)]">Insurer updates show up here without a refresh.</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {patientClaims.map((claim) => {
                  const hasNewDecision = ["approved", "denied"].includes(claim.status) && claim.timeline[claim.timeline.length - 1]?.actor === "insurer";
                  return (
                    <div key={claim.id} className={`rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)] ${hasNewDecision ? "border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)]" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{claim.id}</p>
                          <p className="mt-1 text-sm text-[var(--ch-muted)]">{claim.diagnosis} · {claim.hospital}</p>
                        </div>
                        <StatusBadge status={claim.status} />
                      </div>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <button type="button" onClick={() => setSelectedClaimId(claim.id)} className="min-h-10 text-left text-sm font-semibold text-[var(--ch-blue)] transition-all hover:opacity-80">Open details</button>
                        <Link href={`/dashboard/patient/claims/${claim.id}`} className="min-h-10 text-sm font-semibold text-slate-600 transition-all hover:text-slate-900">Track claim</Link>
                        {hasNewDecision ? <span className="text-sm font-semibold text-[var(--ch-blue-dark)]">New - view decision letter</span> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </MotionCard>

            <MotionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 md:text-[1.45rem]"><FolderUp className="h-5 w-5 text-[var(--ch-blue)]" />Documents</h2>
              <p className="mt-1 text-sm text-[var(--ch-muted)]">Upload claim-specific files. Insurer sees them immediately.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
                <select value={activeClaimId} onChange={(event) => setActiveClaimId(event.target.value)} className="h-10 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:border-[var(--ch-blue)] focus:shadow-[0_0_0_4px_rgba(74,142,219,0.12)] sm:h-12 sm:py-3 sm:text-base">
                  {patientClaims.map((claim) => <option key={claim.id} value={claim.id}>{claim.id} - {claim.diagnosis}</option>)}
                </select>
                <button type="button" onClick={saveDocuments} className="h-10 rounded-2xl bg-[var(--ch-blue)] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-95 active:scale-[0.98] sm:h-12 sm:py-3">Upload to Claim</button>
              </div>
              <div className="mt-5">
                <UploadBox label="Patient documents" files={files} onUpload={handleUpload} onRemove={removeFile} />
              </div>
            </MotionCard>
          </div>

          <RecentActivityCard role="patient" identity={user?.patientId ?? user?.id} />
        </section>
      </div>

      <ClaimDrawer claimId={selectedClaimId} role="patient" isOpen={selectedClaimId !== null} onClose={() => setSelectedClaimId(null)} user={user} />
    </>
  );
}
