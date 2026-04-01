"use client";

import { useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, UploadCloud, X } from "lucide-react";
import type { UploadedDocument } from "@/types";

export default function UploadBox({ label, files, onUpload, onRemove }: { label: string; files: UploadedDocument[]; onUpload: (files: UploadedDocument[]) => void; onRemove?: (name: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pushFiles = (incoming: File[]) => {
    const selected = incoming.map((file) => ({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "draft",
    }));

    if (selected.length > 0) {
      onUpload(selected);
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 1200);
    }
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    pushFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }} className={`rounded-[1.75rem] border border-dashed p-6 transition-all ${isDragging ? "border-[var(--ch-blue)] bg-white shadow-[0_0_0_4px_rgba(74,142,219,0.12)]" : "border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)]"}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); pushFiles(Array.from(event.dataTransfer.files ?? [])); }}>
      <div className="flex items-start gap-4">
        <motion.div animate={{ scale: isDragging ? 1.06 : 1 }} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--ch-blue)]">
          <UploadCloud className="h-5 w-5" />
        </motion.div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold tracking-[-0.03em] text-slate-900">{label}</h3>
            <AnimatePresence>
              {showSuccess ? (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                  <Check className="h-3.5 w-3.5" />
                  Uploaded
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <p className="mt-2 text-sm text-[var(--ch-muted)]">Metadata only - no file blobs stored.</p>
          <label className="mt-4 inline-flex min-h-10 cursor-pointer items-center rounded-2xl bg-[var(--ch-blue)] px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-95 sm:min-h-12">
            Choose Files
            <input type="file" multiple className="hidden" onChange={handleFiles} />
          </label>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {files.length === 0 ? <p className="text-sm text-[var(--ch-subtle)]">No files selected yet.</p> : null}
        <AnimatePresence initial={false}>
          {files.map((file) => (
            <motion.div key={`${file.name}-${file.uploadedAt}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white px-4 py-3 text-sm shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
              <div>
                <p className="font-semibold text-slate-900">{file.name}</p>
                <p className="mt-1 text-[var(--ch-muted)]">{file.type} · {Math.max(1, Math.round(file.size / 1024))} KB</p>
              </div>
              {onRemove ? <button type="button" onClick={() => onRemove(file.name)} className="rounded-full p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"><X className="h-4 w-4" /></button> : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
