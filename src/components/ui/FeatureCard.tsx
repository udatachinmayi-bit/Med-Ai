"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedBorder } from "./AnimatedBorder";

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  className?: string;
  /** Tailwind gradient classes used for the feature icon. */
  iconGradient?: string;
}

/** A premium, reusable product feature card for marketing and product surfaces. */
export function FeatureCard({
  title,
  description,
  icon,
  href,
  className = "",
  iconGradient = "from-sky-500 to-cyan-500",
}: FeatureCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`group relative h-full ${className}`.trim()}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.15, once: true }}
      whileHover={shouldReduceMotion ? undefined : { y: -7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] bg-sky-300/0 blur-2xl transition-colors duration-300 group-hover:bg-sky-300/25" />
      <AnimatedBorder className="h-full shadow-[0_14px_40px_rgba(14,116,144,0.08)]" contentClassName="h-full !rounded-[15px] bg-white/75 backdrop-blur-xl">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] p-6 sm:p-7">
          <div aria-hidden="true" className="absolute -right-10 -top-10 size-28 rounded-full bg-cyan-100/60 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <motion.div
            className={`relative mb-6 grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${iconGradient} text-white shadow-lg shadow-sky-200/60`}
            animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 3, ease: "easeInOut", repeat: Infinity }}
            whileHover={shouldReduceMotion ? undefined : { rotate: -7, scale: 1.08 }}
          >
            <span className="flex size-6 items-center justify-center">{icon}</span>
          </motion.div>
          <h3 className="relative text-xl font-bold tracking-[-0.025em] text-slate-900 sm:text-2xl">{title}</h3>
          <p className="relative mt-3 flex-1 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
          <Link className="relative mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2" href={href}>
            Learn more <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimatedBorder>
    </motion.article>
  );
}

export default FeatureCard;
