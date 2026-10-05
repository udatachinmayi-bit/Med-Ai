"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  /** A compact summary such as "+12.4%" or "Improving". */
  trend?: ReactNode;
  /** Status label displayed in the upper-right corner. */
  status?: "excellent" | "good" | "attention" | "stable" | string;
  className?: string;
}

const statusClasses: Record<string, string> = {
  excellent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  good: "bg-sky-50 text-sky-700 ring-sky-100",
  attention: "bg-amber-50 text-amber-700 ring-amber-100",
  stable: "bg-violet-50 text-violet-700 ring-violet-100",
};

function HeartPulseIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" className="size-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      <path d="M4.5 12h3l1.25-2.5 2.3 5 1.55-3h4.9" />
    </svg>
  );
}

function TrendChart() {
  return (
    <svg aria-hidden="true" className="h-16 w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 220 60">
      <defs>
        <linearGradient id="dashboard-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dashboard-chart-stroke" x1="0" x2="1">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path d="M0 51C16 47 21 42 36 44c17 2 20-16 38-14 14 1 18 10 33 5 17-6 20-22 37-17 15 5 16 12 30 5 19-10 24-22 46-19v56H0V51Z" fill="url(#dashboard-chart-fill)" />
      <path d="M0 51C16 47 21 42 36 44c17 2 20-16 38-14 14 1 18 10 33 5 17-6 20-22 37-17 15 5 16 12 30 5 19-10 24-22 46-19" stroke="url(#dashboard-chart-stroke)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      <circle cx="220" cy="4" fill="#06b6d4" r="3.5" stroke="white" strokeWidth="2" />
    </svg>
  );
}

function getScore(value: string | number) {
  const score = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(score) ? Math.max(0, Math.min(Math.round(score), 100)) : 86;
}

/** A reusable, data-agnostic summary card with a lightweight health visualisation. */
export function DashboardCard({
  title,
  value,
  icon,
  trend = "+8.2% this week",
  status = "excellent",
  className = "",
}: DashboardCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const healthScore = getScore(value);
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const badgeClass = statusClasses[status.toLowerCase()] ?? statusClasses.good;

  return (
    <motion.article
      className={`relative w-full overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_20px_55px_rgba(14,116,144,0.15)] backdrop-blur-2xl sm:p-6 ${className}`.trim()}
      animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      whileHover={shouldReduceMotion ? undefined : { y: -10, scale: 1.01, boxShadow: "0 28px 65px rgba(14, 116, 144, 0.2)" }}
    >
      <div aria-hidden="true" className="absolute -right-16 -top-16 size-44 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/70">
            {icon ?? <HeartPulseIcon />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${badgeClass}`}>{statusLabel}</span>
      </div>

      <div className="relative mt-5 grid grid-cols-[auto_1fr] items-center gap-4">
        <div
          aria-label={`Health score: ${healthScore} out of 100`}
          className="grid size-[74px] place-items-center rounded-full p-1"
          role="img"
          style={{ background: `conic-gradient(#06b6d4 ${healthScore * 3.6}deg, #e0f2fe 0deg)` }}
        >
          <div className="grid size-full place-items-center rounded-full bg-white/90">
            <span className="text-lg font-bold text-slate-900">{healthScore}</span>
            <span className="-mt-1 text-[9px] font-medium uppercase tracking-wider text-slate-500">score</span>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Health trend</span>
            <span className="font-semibold text-emerald-600">{trend}</span>
          </div>
          <TrendChart />
        </div>
      </div>

      <div className="relative mt-5 space-y-3 border-t border-sky-100/80 pt-4">
        <ProgressBar label="Daily wellness" value={healthScore} />
        <ProgressBar label="Healthy habits" value={Math.max(0, Math.min(100, healthScore - 12))} color="bg-cyan-500" />
      </div>
    </motion.article>
  );
}

function ProgressBar({ label, value, color = "bg-sky-500" }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-700">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-sky-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default DashboardCard;
