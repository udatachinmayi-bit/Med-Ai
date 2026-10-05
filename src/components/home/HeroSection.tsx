"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowRight, FileText, Heart, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { FadeUp } from "../animations/FadeUp";
import { Float } from "../animations/Float";
import { ZoomIn } from "../animations/ZoomIn";
import { GlowEffect } from "../background/GlowEffect";
import { GradientBackground } from "../background/GradientBackground";
import { HexagonPattern } from "../background/HexagonPattern";
import { FloatingParticles } from "../background/FloatingParticles";
import { DashboardCard } from "../ui/DashboardCard";
import { GlassCard } from "../ui/GlassCard";
import { SectionBadge } from "../ui/SectionBadge";

function CountUp({ end, suffix = "+" }: { end: number; suffix?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(() => (shouldReduceMotion ? end : 0));

  useEffect(() => {
    if (shouldReduceMotion) return;

    const duration = 1200;
    const startedAt = performance.now();
    let frameId = 0;
    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setValue(Math.round(end * (1 - (1 - progress) ** 3)));
      if (progress < 1) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [end, shouldReduceMotion]);

  return <>{value.toLocaleString()}{suffix}</>;
}

function DoctorIllustration() {
  return (
    <svg aria-label="Illustration of a doctor using an AI health assistant" className="h-auto w-full" role="img" viewBox="0 0 520 520">
      <defs>
        <linearGradient id="doctor-coat" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id="doctor-scrubs" x1="0" x2="1">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx="260" cy="260" fill="#e0f2fe" r="205" />
      <circle cx="405" cy="116" fill="#a5f3fc" opacity=".75" r="44" />
      <circle cx="94" cy="370" fill="#bfdbfe" opacity=".8" r="31" />
      <path d="M77 438c49-44 104-66 166-66 68 0 126 22 181 66" fill="#bae6fd" opacity=".7" />
      <path d="M202 247c7 17 24 28 47 28s41-11 48-28v-53h-95v53Z" fill="#f2c9af" />
      <path d="M188 212c-5-63 22-108 74-108 50 0 77 40 71 99l-8 45c-12 46-88 46-108 1l-29-37Z" fill="#f5cfb5" />
      <path d="M183 204c-11-52 7-105 76-112 52-5 85 33 78 101-19-5-33-19-39-38-22 22-56 33-104 33l-11 16Z" fill="#164e63" />
      <path d="M195 252c15 20 33 29 55 29 29 0 52-12 68-33l29 22-20 59-150-4-15-47 33-26Z" fill="url(#doctor-scrubs)" />
      <path d="M150 466c4-100 31-161 96-176l5 53 14-30 15 30 2-54c72 17 102 74 107 177H150Z" fill="url(#doctor-coat)" stroke="#bfdbfe" strokeWidth="3" />
      <path d="m251 290 14 23 15-23v52l-15 19-14-19v-52Z" fill="#0e7490" />
      <path d="M228 294c4 27 17 47 37 63-19 5-44-2-60-17l23-46Zm75 0c-4 27-17 47-38 63 21 5 45-2 61-17l-23-46Z" fill="#f8fafc" />
      <path d="M291 334c39 6 52 37 39 68-10 24-41 25-56 4" fill="none" stroke="#0e7490" strokeLinecap="round" strokeWidth="5" />
      <circle cx="276" cy="401" fill="#fff" r="11" stroke="#0e7490" strokeWidth="5" />
      <rect x="97" y="146" width="89" height="66" rx="15" fill="#fff" stroke="#bae6fd" strokeWidth="3" />
      <path d="M120 179h42m-21-21v42" stroke="#06b6d4" strokeLinecap="round" strokeWidth="7" />
      <rect x="342" y="246" width="92" height="70" rx="16" fill="#fff" stroke="#bae6fd" strokeWidth="3" />
      <path d="M360 285h12l7-13 11 27 8-15h18" fill="none" stroke="#0284c7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function MedicalWidget({ icon, label, detail, className = "" }: { icon: ReactNode; label: string; detail: string; className?: string }) {
  return (
    <GlassCard className={`flex items-center gap-3 !rounded-2xl !p-3.5 ${className}`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
      </div>
    </GlassCard>
  );
}

export default function HeroSection() {
  return (
    <GradientBackground className="isolate">
      <section className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36 lg:min-h-[800px] lg:py-32">
        <HexagonPattern className="left-auto right-0 w-[70%] opacity-70" opacity={0.14} size={64} />
        <GlowEffect className="-z-10" />
        <FloatingParticles className="-z-10" count={16} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:gap-8">
          <div className="relative z-10 max-w-2xl">
            <FadeUp>
              <SectionBadge icon={<Sparkles className="size-3.5" />}>The future of personal healthcare</SectionBadge>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="mt-6 text-5xl font-bold leading-[0.98] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                Care that thinks <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">ahead of you.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Meet your intelligent health companion. Understand reports, track what matters, and get clearer next steps—powered by clinical-grade AI.
              </p>
            </FadeUp>
            <FadeUp delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(2,132,199,0.28)] transition-shadow hover:shadow-[0_18px_36px_rgba(2,132,199,0.38)]"
                  href="#services"
                  whileHover={{ y: -2, scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Start your health journey <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </motion.a>
                <motion.a
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white/70 px-5 py-3 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
                  href="#how-it-works"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <PlayCircle className="size-4" /> See how it works
                </motion.a>
              </div>
            </FadeUp>

            <FadeUp delay={0.32}>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-y border-sky-100 py-5 sm:gap-6">
                <Stat value={<CountUp end={50} />} label="health journeys" />
                <Stat value={<CountUp end={94} suffix="%" />} label="feel more informed" />
                <Stat value="24/7" label="AI guidance" />
              </div>
            </FadeUp>
            <FadeUp delay={0.4}>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-emerald-500" /> Private by design</span>
                <span className="flex items-center gap-1.5"><Activity className="size-4 text-sky-500" /> Built for everyday care</span>
                <span className="flex items-center gap-1.5"><Heart className="size-4 text-rose-500" /> Trusted by patients</span>
              </div>
            </FadeUp>
          </div>

          <ZoomIn delay={0.2} className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
            <div className="relative aspect-[1.06] sm:aspect-[1.1]">
              <div className="absolute inset-[7%] rounded-[3rem] border border-white/80 bg-white/45 shadow-[0_30px_80px_rgba(14,116,144,0.14)] backdrop-blur-sm" />
              <motion.div className="absolute inset-[3%]" whileHover={{ scale: 1.015 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
                <DoctorIllustration />
              </motion.div>
              <div className="absolute right-[2%] top-[6%] w-[52%] sm:right-0">
                <Float duration={5.2} distance={7}>
                  <DashboardCard icon={<Activity className="size-5" />} status="excellent" title="Health intelligence" trend="+12% this month" value="92" />
                </Float>
              </div>
              <div className="absolute -left-1 top-[31%] w-[44%] sm:-left-8">
                <Float delay={0.3} duration={5.8} distance={9}>
                  <MedicalWidget detail="AI analysis complete" icon={<FileText className="size-5" />} label="Report insights" />
                </Float>
              </div>
              <div className="absolute bottom-[5%] right-0 w-[43%] sm:-right-5">
                <Float delay={0.55} duration={4.8} distance={7}>
                  <MedicalWidget detail="Within your range" icon={<Heart className="size-5" />} label="Vitals looking good" />
                </Float>
              </div>
              <motion.div
                animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.08, 1] }}
                className="absolute bottom-[18%] left-[28%] flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-xl shadow-sky-300/50"
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="size-5" />
              </motion.div>
            </div>
          </ZoomIn>
        </div>
      </section>
    </GradientBackground>
  );
}

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <p className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{value}</p>
      <p className="mt-1 text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">{label}</p>
    </div>
  );
}
