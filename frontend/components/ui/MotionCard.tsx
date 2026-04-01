"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function MotionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
