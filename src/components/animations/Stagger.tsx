"use client";

import { motion, useReducedMotion, type ViewportOptions } from "framer-motion";
import { Children } from "react";
import type { PropsWithChildren } from "react";

export interface StaggerProps extends PropsWithChildren {
  className?: string;
  duration?: number;
  delay?: number;
  viewport?: ViewportOptions;
  once?: boolean;
  staggerDelay?: number;
}

/** Applies a reveal animation to every direct child in a sequence. */
export function Stagger({
  children,
  className = "",
  duration = 0.45,
  delay = 0,
  viewport,
  once = true,
  staggerDelay = 0.1,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: delay, staggerChildren: shouldReduceMotion ? 0 : staggerDelay } },
      }}
      viewport={{ amount: 0.2, once, ...viewport }}
      whileInView="visible"
    >
      {items.map((child, index) => (
        <motion.div
          key={(child as { key?: string | null }).key ?? index}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          variants={{
            hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Stagger;
