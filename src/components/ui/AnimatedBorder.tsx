"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export interface AnimatedBorderProps extends PropsWithChildren {
  className?: string;
  contentClassName?: string;
}

/** Wraps content in a softly animated blue-to-cyan gradient border. */
export function AnimatedBorder({ children, className = "", contentClassName = "" }: AnimatedBorderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-px ${className}`.trim()}
      style={{ background: "linear-gradient(115deg, #0ea5e9, #22d3ee, #a5f3fc, #3b82f6, #0ea5e9)", backgroundSize: "300% 300%" }}
      animate={shouldReduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 7, ease: "linear", repeat: Infinity }}
    >
      <div className={`relative rounded-[15px] bg-white ${contentClassName}`.trim()}>{children}</div>
    </motion.div>
  );
}

export default AnimatedBorder;
