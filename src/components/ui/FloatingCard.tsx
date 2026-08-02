"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export interface FloatingCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  floatDistance?: number;
}

export function FloatingCard({ children, className = "", floatDistance = 8, ...props }: FloatingCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(14,116,144,0.15)] backdrop-blur-xl sm:p-6 ${className}`.trim()}
      animate={shouldReduceMotion ? undefined : { y: [0, -floatDistance, 0] }}
      transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
      whileHover={shouldReduceMotion ? undefined : { y: -floatDistance - 5, scale: 1.015, boxShadow: "0 24px 55px rgba(14, 116, 144, 0.20)" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default FloatingCard;
