"use client";

import { motion } from "framer-motion";
import type { AgentStatus } from "@/types";

type AgentResultCardProps = {
  agentName: string;
  status: AgentStatus;
  reason: string;
};

export default function AgentResultCard({ agentName, status, reason }: AgentResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-4 transition-all ${status === "pass" ? "border-l-green-500" : "border-l-red-500"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-slate-900">{agentName}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${status === "pass" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--ch-muted)]">{reason}</p>
    </motion.div>
  );
}
