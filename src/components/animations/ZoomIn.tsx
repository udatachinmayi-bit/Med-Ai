"use client";

import { motion, useReducedMotion, type ViewportOptions } from "framer-motion";
import type { PropsWithChildren } from "react";

export interface ZoomInProps extends PropsWithChildren {
  className?: string;
  duration?: number;
  delay?: number;
  viewport?: ViewportOptions;
  once?: boolean;
}

export function ZoomIn({ children, className = "", duration = 0.5, delay = 0, viewport, once = true }: ZoomInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.2, once, ...viewport }}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      {children}
    </motion.div>
  );
}

export default ZoomIn;
