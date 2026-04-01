"use client";

import { motion } from "framer-motion";
import { actorDotClasses, formatRelativeTime } from "@/lib/claimUi";
import type { TimelineEntry } from "@/types";

export default function TimelineView({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <div className="space-y-4">
      {timeline.map((entry, index) => (
        <motion.div
          key={`${entry.time}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.06, ease: "easeOut" }}
          className="flex gap-3"
        >
          <div className="flex flex-col items-center">
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.06 }}
              className={`mt-1 h-3 w-3 rounded-full ${actorDotClasses[entry.actor]}`}
            />
            {index < timeline.length - 1 ? <motion.span initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.22, delay: index * 0.06 }} className="mt-2 h-full w-px origin-top bg-slate-200" /> : null}
          </div>
          <div className="pb-3">
            <p className="font-medium text-slate-900">{entry.label}</p>
            <p className="mt-1 text-sm capitalize text-[var(--ch-muted)]">{entry.actor} · {formatRelativeTime(entry.time)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
