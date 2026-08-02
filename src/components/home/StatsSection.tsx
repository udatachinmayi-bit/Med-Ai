"use client";

import CountUp from "react-countup";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, FileText, HeartPulse, Pill, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";
import { SectionBadge } from "../ui/SectionBadge";
import { SectionHeading } from "../ui/SectionHeading";

const metrics = [
  { icon: Users, end: 50, suffix: "K+", title: "Active members", detail: "Cared for every month", gradient: "from-sky-500 to-cyan-500" },
  { icon: FileText, end: 100, suffix: "K+", title: "Reports clarified", detail: "Plain-language insights", gradient: "from-violet-500 to-indigo-500" },
  { icon: Pill, end: 1, suffix: "M+", title: "Medicines scanned", detail: "Safer, clearer choices", gradient: "from-emerald-500 to-teal-500" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-white py-20 sm:py-24 lg:py-32">
      <div aria-hidden="true" className="absolute right-[-10%] top-1/4 size-80 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          badge={<SectionBadge icon={<Activity className="size-3.5" />}>Health, made measurable</SectionBadge>}
          description="A calmer, more informed healthcare experience—backed by a platform people return to every day."
          subtitle="Trusted intelligence"
          title="More clarity at every health decision."
          className="mx-auto"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16 lg:gap-6">
          {metrics.map((metric, index) => <MetricCard key={metric.title} index={index} {...metric} />)}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.22fr_.78fr] lg:gap-6">
          <AnalyticsCard />
          <HealthScoreCard />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon: Icon, end, suffix, title, detail, gradient, index }: { icon: typeof Users; end: number; suffix: string; title: string; detail: string; gradient: string; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.article
      className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_16px_45px_rgba(14,116,144,0.09)] backdrop-blur-xl sm:p-7"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.2, once: true }}
      whileHover={shouldReduceMotion ? undefined : { y: -6, boxShadow: "0 24px 55px rgba(14, 116, 144, 0.16)" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div aria-hidden="true" className="absolute -right-8 -top-8 size-28 rounded-full bg-sky-100/70 blur-2xl transition-transform duration-500 group-hover:scale-150" />
      <div className={`relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-sky-200/70`}><Icon className="size-5" /></div>
      <p className="relative mt-6 text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl"><CountUp duration={2.1} enableScrollSpy end={end} suffix={suffix} /></p>
      <p className="relative mt-2 text-sm font-bold text-slate-800">{title}</p>
      <p className="relative mt-1 text-sm text-slate-500">{detail}</p>
    </motion.article>
  );
}

function AnalyticsCard() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.article
      className="overflow-hidden rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-[0_16px_45px_rgba(14,116,144,0.09)] backdrop-blur-xl sm:p-7"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.15, once: true }}
      whileHover={shouldReduceMotion ? undefined : { y: -5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-sm font-semibold text-slate-500">Community health insights</p><h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Health engagement is trending up.</h3></div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">+18.4% this month</span>
      </div>
      <div className="mt-7 grid items-end gap-5 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0"><MiniChart /><div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-slate-400"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-1"><MiniWidget label="Insights delivered" value="24.8K" icon={<FileText className="size-4" />} /><MiniWidget label="Care confidence" value="96%" icon={<ShieldCheck className="size-4" />} /></div>
      </div>
    </motion.article>
  );
}

function MiniChart() {
  return <svg aria-label="Weekly health engagement chart trending upward" className="h-40 w-full" preserveAspectRatio="none" role="img" viewBox="0 0 540 150"><defs><linearGradient id="engagement-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#38bdf8" stopOpacity=".32" /><stop offset="1" stopColor="#38bdf8" stopOpacity="0" /></linearGradient><linearGradient id="engagement-line" x1="0" x2="1"><stop stopColor="#0284c7" /><stop offset="1" stopColor="#06b6d4" /></linearGradient></defs><path d="M0 118C34 110 44 98 76 105c36 8 49-50 86-36 23 9 31 38 61 26 39-15 52-80 96-57 28 15 30 48 61 33 41-20 55-72 91-54 24 12 40 23 69-9v142H0V118Z" fill="url(#engagement-fill)" /><path d="M0 118C34 110 44 98 76 105c36 8 49-50 86-36 23 9 31 38 61 26 39-15 52-80 96-57 28 15 30 48 61 33 41-20 55-72 91-54 24 12 40 23 69-9" fill="none" stroke="url(#engagement-line)" strokeLinecap="round" strokeWidth="3" /><circle cx="540" cy="62" fill="#06b6d4" r="5" stroke="white" strokeWidth="3" /></svg>;
}

function MiniWidget({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="rounded-xl border border-sky-100 bg-sky-50/55 p-3"><div className="flex items-center gap-1.5 text-sky-600">{icon}<span className="text-[11px] font-semibold">{label}</span></div><p className="mt-1 text-lg font-bold tracking-tight text-slate-900">{value}</p></div>;
}

function HealthScoreCard() {
  const shouldReduceMotion = useReducedMotion();
  const score = 94;
  return (
    <motion.article className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_16px_45px_rgba(14,116,144,0.09)] backdrop-blur-xl sm:p-7" initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }} transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} viewport={{ amount: 0.15, once: true }} whileHover={shouldReduceMotion ? undefined : { y: -5 }} whileInView={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500">Care quality index</p><h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Built for trusted care</h3></div><HeartPulse className="size-5 text-rose-500" /></div>
      <div className="mt-7 flex items-center gap-6"><div aria-label={`Health score ${score} out of 100`} className="grid size-28 shrink-0 place-items-center rounded-full p-1.5" role="img" style={{ background: `conic-gradient(#06b6d4 ${score * 3.6}deg, #e0f2fe 0deg)` }}><div className="grid size-full place-items-center rounded-full bg-white"><span className="text-3xl font-bold tracking-tight text-slate-950"><CountUp duration={2} enableScrollSpy end={score} /></span><span className="-mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">out of 100</span></div></div><div className="min-w-0 space-y-3"><Progress label="Care confidence" value={96} color="bg-cyan-500" /><Progress label="Insight accuracy" value={98} color="bg-sky-500" /><Progress label="Member satisfaction" value={94} color="bg-indigo-500" /></div></div>
    </motion.article>
  );
}

function Progress({ label, value, color }: { label: string; value: number; color: string }) {
  return <div><div className="mb-1 flex justify-between gap-3 text-[11px]"><span className="font-medium text-slate-600">{label}</span><span className="font-bold text-slate-700">{value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-sky-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div></div>;
}
