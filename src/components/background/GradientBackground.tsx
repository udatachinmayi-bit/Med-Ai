"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export interface GradientBackgroundProps extends PropsWithChildren {
  /** Additional classes for the outer full-screen container. */
  className?: string;
}

/**
 * A calm, animated medical-blue canvas for full-page experiences.
 * Children are rendered above the decorative gradient layer.
 */
export function GradientBackground({ children, className = "" }: GradientBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-white ${className}`.trim()}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 18%, rgba(186,230,253,0.72), transparent 31%), radial-gradient(circle at 84% 14%, rgba(207,250,254,0.7), transparent 28%), radial-gradient(circle at 72% 83%, rgba(219,234,254,0.88), transparent 35%), linear-gradient(135deg, #ffffff 0%, #f0f9ff 45%, #eff6ff 100%)",
          backgroundSize: "135% 135%",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                backgroundPosition: ["0% 0%", "100% 45%", "35% 100%", "0% 0%"],
              }
        }
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      {children}
    </div>
  );
}

export default GradientBackground;
