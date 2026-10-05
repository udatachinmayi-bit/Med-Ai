"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface FloatingParticlesProps {
  className?: string;
  /** Caps at 40 to keep this decorative component inexpensive to render. */
  count?: number;
  color?: string;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

const createParticle = (id: number): Particle => {
  // Deterministic values avoid reflowing/re-randomising particles on rerenders.
  const seed = (id + 1) * 9301 + 49297;
  const value = (multiplier: number, modulo: number) => ((seed * multiplier) % modulo) / modulo;

  return {
    id,
    left: value(17, 100),
    top: value(31, 100),
    size: 2 + value(47, 5),
    duration: 12 + value(59, 9),
    delay: value(71, 6),
  };
};

/** A restrained, low-count particle field with GPU-friendly transform animation. */
export function FloatingParticles({
  className = "",
  count = 18,
  color = "#38bdf8",
}: FloatingParticlesProps) {
  const shouldReduceMotion = useReducedMotion();
  const particleCount = Math.max(1, Math.min(Math.floor(count), 40));
  const particles = Array.from({ length: particleCount }, (_, id) => createParticle(id));

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full will-change-transform"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 ${particle.size * 3}px ${color}`,
            height: particle.size,
            left: `${particle.left}%`,
            opacity: 0.28,
            top: `${particle.top}%`,
            width: particle.size,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 18, -8, 0],
                  y: [0, -34, -62, 0],
                  opacity: [0.16, 0.38, 0.2, 0.16],
                }
          }
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingParticles;
