"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface GlowEffectProps {
  className?: string;
  /** CSS color used by the glow, e.g. `#0ea5e9` or `rgb(34 211 238)`. */
  color?: string;
  /** Diameter of each glow in pixels. */
  size?: number;
  /** Number of soft overlapping glow circles. */
  count?: number;
}

/** Soft radial light blooms for glassmorphism surfaces and page backgrounds. */
export function GlowEffect({
  className = "",
  color,
  size = 420,
  count = 3,
}: GlowEffectProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeCount = Math.max(1, Math.min(Math.floor(count), 6));

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}>
      {Array.from({ length: safeCount }, (_, index) => {
        const offset = index * 18;
        const glowColor = color ?? ["#38bdf8", "#22d3ee", "#60a5fa"][index % 3];
        return (
          <motion.span
            key={index}
            className="absolute rounded-full will-change-transform"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
              filter: "blur(18px)",
              left: `${12 + offset}%`,
              top: `${8 + ((index * 29) % 58)}%`,
            }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.18 }
                : {
                    opacity: [0.1, 0.25, 0.13],
                    scale: [0.88, 1.08, 0.94],
                    x: [0, index % 2 === 0 ? 28 : -28, 0],
                    y: [0, index % 2 === 0 ? -18 : 18, 0],
                  }
            }
            transition={{
              duration: 9 + index * 2,
              delay: index * 0.75,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        );
      })}
    </div>
  );
}

export default GlowEffect;
