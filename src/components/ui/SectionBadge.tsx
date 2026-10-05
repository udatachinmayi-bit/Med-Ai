"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

export interface SectionBadgeProps extends PropsWithChildren {
  className?: string;
  icon?: ReactNode;
}

export function SectionBadge({ children, className = "", icon }: SectionBadgeProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-gradient-to-r from-sky-50 to-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-sky-700 shadow-sm ${className}`.trim()}
      animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
      transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
    >
      {icon ? <span className="flex size-3.5 items-center justify-center">{icon}</span> : null}
      {children}
    </motion.span>
  );
}

export default SectionBadge;
