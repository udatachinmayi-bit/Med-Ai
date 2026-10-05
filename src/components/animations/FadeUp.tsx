"use client";

import { motion, useReducedMotion, type ViewportOptions } from "framer-motion";
import type { PropsWithChildren } from "react";

export interface FadeUpProps extends PropsWithChildren {
  className?: string;
  duration?: number;
  delay?: number;
  viewport?: ViewportOptions;
  once?: boolean;
}

export function FadeUp({ children, className = "", duration = 0.55, delay = 0, viewport, once = true }: FadeUpProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.2, once, ...viewport }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default FadeUp;
