"use client";

import Marquee from "react-fast-marquee";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { SectionBadge } from "../ui/SectionBadge";
import { SectionHeading } from "../ui/SectionHeading";

const partners = [
  { name: "Asteria", descriptor: "HEALTH", mark: "A", colors: "from-sky-500 to-cyan-400" },
  { name: "Northstar", descriptor: "CLINIC", mark: "N", colors: "from-violet-500 to-indigo-500" },
  { name: "Cura", descriptor: "CARE", mark: "+", colors: "from-emerald-500 to-teal-400" },
  { name: "Veridian", descriptor: "HEALTH", mark: "V", colors: "from-blue-600 to-sky-400" },
  { name: "Luma", descriptor: "MEDICAL", mark: "L", colors: "from-rose-500 to-pink-400" },
  { name: "Horizon", descriptor: "WELLNESS", mark: "H", colors: "from-amber-500 to-orange-400" },
  { name: "Nexora", descriptor: "HEALTH", mark: "N", colors: "from-cyan-600 to-blue-500" },
];

export default function TrustedSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-40 w-[60%] -translate-x-1/2 rounded-full bg-sky-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }} transition={{ duration: 0.5 }} viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }}>
          <SectionHeading
            align="center"
            badge={<SectionBadge icon={<BadgeCheck className="size-3.5" />}>Trusted healthcare ecosystem</SectionBadge>}
            description="Designed to support better conversations and clearer care across modern healthcare teams."
            subtitle="Growing with care teams"
            title="Built for the people moving healthcare forward."
            className="mx-auto"
          />
        </motion.div>

        <motion.div className="relative mt-12 sm:mt-16" initial={{ opacity: 0 }} transition={{ delay: 0.15, duration: 0.5 }} viewport={{ once: true }} whileInView={{ opacity: 1 }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white to-transparent sm:w-28" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white to-transparent sm:w-28" />
          <Marquee autoFill gradient={false} pauseOnHover={!shouldReduceMotion} speed={shouldReduceMotion ? 0 : 35}>
            {partners.map((partner) => <PartnerCard key={partner.name} {...partner} />)}
          </Marquee>
        </motion.div>

        <div className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-4 py-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="size-4" /> Privacy-led technology for every care journey
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ name, descriptor, mark, colors }: (typeof partners)[number]) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div className="group mx-2 flex w-[198px] items-center gap-3 rounded-2xl border border-sky-100/80 bg-white/70 px-4 py-3.5 shadow-[0_10px_30px_rgba(14,116,144,0.06)] backdrop-blur-xl sm:mx-3 sm:w-[220px] sm:px-5" whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02, boxShadow: "0 18px 35px rgba(14,116,144,0.13)" }}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${colors} text-base font-bold text-white shadow-md shadow-sky-100`}>{mark}</span>
      <span className="min-w-0"><span className="block truncate text-base font-bold tracking-[-0.04em] text-slate-800">{name}</span><span className="block text-[9px] font-bold tracking-[0.18em] text-slate-400">{descriptor}</span></span>
    </motion.div>
  );
}
