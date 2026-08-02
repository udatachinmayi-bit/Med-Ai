"use client";

import { motion, useReducedMotion, type ViewportOptions } from "framer-motion";
import type { PropsWithChildren } from "react";

export interface FloatProps extends PropsWithChildren {
  className?: string;
  duration?: number;
  delay?: number;
  viewport?: ViewportOptions;
  once?: boolean;
  distance?: number;
}

/** Reveals on entering the viewport, then gently floats to add depth to visual cards. */
export function Float({
  children,
  className = "",
  duration = 4.5,
  delay = 0,
  viewport,
  once = true,
  distance = 8,
}: FloatProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      transition={{ duration: Math.min(duration, 0.65), delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.2, once, ...viewport }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -distance, 0] }}
        transition={{ duration, delay: delay + 0.65, ease: "easeInOut", repeat: Infinity }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Float;
