"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true, ...props }: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`rounded-2xl border border-white/70 bg-white/65 p-5 shadow-[0_12px_40px_rgba(14,116,144,0.10)] backdrop-blur-xl sm:p-6 ${className}`.trim()}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={hover && !shouldReduceMotion ? { y: -4, boxShadow: "0 20px 50px rgba(14, 116, 144, 0.16)" } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
