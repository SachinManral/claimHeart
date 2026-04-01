"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import UploadBox from "@/components/claims/UploadBox";
import StatusBadge from "@/components/claims/StatusBadge";
import RecentActivityCard from "@/components/pages/RecentActivityCard";
import MotionCard from "@/components/ui/MotionCard";
import { SkeletonBlock, SkeletonCard } from "@/components/ui/Skeleton";
import usePageReady from "@/hooks/usePageReady";
import { getCurrentUser } from "@/lib/api/auth";
import { simulateOCR, submitClaim } from "@/lib/api/claims";
import { useAppStore } from "@/store/useAppStore";
import type { AppUser, Claim, ClaimCaseType, UploadedDocument } from "@/types";

export default function HospitalDashboardPage() {
  const claims = useAppStore((state) => state.claims);
  const [user, setUser] = useState<AppUser | null>(null);
  const [patientName, setPatientName] = useState("Priya Sharma");
  const [patientId, setPatientId] = useState("P-001");
  const [diagnosis, setDiagnosis] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [amount, setAmount] = useState("");
  const [caseType, setCaseType] = useState<ClaimCaseType>("emergency");
  const [files, setFiles] = useState<UploadedDocument[]>([]);
  const [ocrPreview, setOcrPreview] = useState<ReturnType<typeof simulateOCR> | null>(null);
  const ready = usePageReady();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const hospitalClaims = useMemo(() => claims.filter((claim) => claim.hospital === user?.name), [claims, user?.name]);

  const runOcrPreview = () => {
    const result = simulateOCR();
    setOcrPreview(result);
    setDiagnosis((value) => value || result.diagnosis);
    setIcdCode((value) => value || result.icdCode);
    setAmount((value) => value || result.totalAmount.replace(/[^\d]/g, ""));
  };

  const handleUpload = (incoming: UploadedDocument[]) => {
    setFiles((current) => [...current, ...incoming.map((file) => ({ ...file, uploadedBy: "hospital" }))]);
  };

  const removeFile = (name: string) => {
    setFiles((current) => current.filter((file) => file.name !== name));
  };

  const handleSubmit = async () => {
    if (!user || !diagnosis || !amount) {
      toast.error("Complete the diagnosis and amount before submitting.");
      return;
    }

    await submitClaim({ patientId, patientName, hospital: user.name, diagnosis, icdCode, amount: Number(amount), caseType, documents: files });
    setDiagnosis("");
    setIcdCode("");
    setAmount("");
    setFiles([]);
    setOcrPreview(null);
    toast.success("Claim submitted. Insurer and patient have been notified.");
  };

  if (!ready || !user) {
    return <div className="space-y-6"><div className="space-y-3"><SkeletonBlock className="h-9 w-56" /><SkeletonBlock className="h-5 w-80" /></div><div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><div className="space-y-6"><SkeletonCard lines={5} /><SkeletonCard lines={4} /></div><div className="space-y-6"><SkeletonCard lines={3} /><SkeletonCard lines={4} /></div></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.04em] text-slate-900 sm:text-[2rem]">Hospital Workspace</h1>
          <p className="mt-2 text-sm text-[var(--ch-muted)] sm:text-base md:text-lg">Submit claims and watch insurer decisions flow back into your history live.</p>
        </div>
        <div className="self-start rounded-full border border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)] px-4 py-2 text-sm font-semibold text-[var(--ch-blue-dark)] transition-all">{hospitalClaims.length} live claims</div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <MotionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Submit Claim</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input value={patientName} onChange={(event) => setPatientName(event.target.value)} placeholder="Patient name" className="h-10 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition-all focus:border-[var(--ch-blue)] focus:shadow-[0_0_0_4px_rgba(74,142,219,0.12)] sm:h-12 sm:text-base" />
              <input value={patientId} onChange={(event) => setPatientId(event.target.value)} placeholder="Patient ID" className="h-10 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition-all focus:border-[var(--ch-blue)] focus:shadow-[0_0_0_4px_rgba(74,142,219,0.12)] sm:h-12 sm:text-base" />
              <input value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} placeholder="Diagnosis" className="h-10 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition-all focus:border-[var(--ch-blue)] focus:shadow-[0_0_0_4px_rgba(74,142,219,0.12)] sm:h-12 sm:text-base" />
              <input value={icdCode} onChange={(event) => setIcdCode(event.target.value)} placeholder="ICD code" className="h-10 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition-all focus:border-[var(--ch-blue)] focus:shadow-[0_0_0_4px_rgba(74,142,219,0.12)] sm:h-12 sm:text-base" />
              <input value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))} placeholder="Amount" className="h-10 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition-all focus:border-[var(--ch-blue)] focus:shadow-[0_0_0_4px_rgba(74,142,219,0.12)] sm:h-12 sm:text-base" />
              <select value={caseType} onChange={(event) => setCaseType(event.target.value as ClaimCaseType)} className="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition-all focus:border-[var(--ch-blue)] focus:shadow-[0_0_0_4px_rgba(74,142,219,0.12)] sm:h-12 sm:text-base">
                <option value="emergency">Emergency</option><option value="planned">Planned</option><option value="day_care">Day Care</option>
              </select>
            </div>
            <div className="mt-6"><UploadBox label="Claim documents" files={files} onUpload={handleUpload} onRemove={removeFile} /></div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={runOcrPreview} className="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 sm:h-12">Run OCR Preview</motion.button>
              <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={handleSubmit} className="h-10 rounded-2xl bg-[var(--ch-blue)] px-4 text-sm font-semibold text-white transition-all hover:opacity-95 sm:h-12">Submit Claim</motion.button>
            </div>
          </MotionCard>

          <MotionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">Claim History</h2>
                <p className="mt-1 text-sm text-[var(--ch-muted)]">Statuses update automatically when the insurer acts in another tab.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {hospitalClaims.map((claim: Claim) => {
                const updated = claim.timeline[claim.timeline.length - 1]?.actor !== "hospital";
                return (
                  <div key={claim.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{claim.id}</p>
                        <p className="mt-1 text-sm text-[var(--ch-muted)]">{claim.patientName} · {claim.diagnosis}</p>
                      </div>
                      <div className="flex items-center gap-2">{updated ? <span className="rounded-full bg-[var(--ch-blue-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--ch-blue-dark)]">Updated</span> : null}<StatusBadge status={claim.status} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </MotionCard>
        </div>

        <div className="space-y-6">
          <MotionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 md:text-[1.45rem]">OCR Preview</h2>
            <div className="mt-5 max-h-80 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-[var(--ch-muted)] sm:text-sm">
              {ocrPreview ? (
                <div className="space-y-2">
                  {[`Diagnosis: ${ocrPreview.diagnosis}`, `ICD: ${ocrPreview.icdCode}`, `Amount: ${ocrPreview.totalAmount}`, `Note: ${ocrPreview.note}`].map((line, index) => (
                    <motion.p key={line} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: index * 0.08 }}><span className="font-semibold text-slate-900">{line.split(":")[0]}:</span>{line.substring(line.indexOf(":") + 1)}</motion.p>
                  ))}
                </div>
              ) : <p>No OCR run yet</p>}
            </div>
          </MotionCard>
          <RecentActivityCard role="hospital" identity={user?.name} />
        </div>
      </section>
    </div>
  );
}
