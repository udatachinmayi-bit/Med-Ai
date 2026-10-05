"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Brain, FileText, Mic, Pill } from "lucide-react";
import { SectionBadge } from "../ui/SectionBadge";
import { SectionHeading } from "../ui/SectionHeading";

const services = [
  { title: "Medicine intelligence", description: "Scan a label and understand purpose, precautions, and useful questions to ask.", icon: Pill, href: "/medicine-scanner", color: "from-sky-500 to-cyan-400", metric: "Instant clarity" },
  { title: "Report intelligence", description: "Translate complex lab values into a structured, approachable health summary.", icon: FileText, href: "/report-analyzer", color: "from-violet-500 to-indigo-500", metric: "Clear explanations" },
  { title: "Voice guidance", description: "Have a natural conversation when typing is the last thing you want to do.", icon: Mic, href: "/voice-assistant", color: "from-rose-500 to-pink-400", metric: "Always available" },
  { title: "Symptom guidance", description: "Capture what you are experiencing and arrive at your next care decision prepared.", icon: Brain, href: "/symptom-checker", color: "from-emerald-500 to-teal-400", metric: "Thoughtful next steps" },
];

export default function ServicesSection() {
  return <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32"><div aria-hidden="true" className="absolute left-0 top-1/3 size-72 rounded-full bg-sky-100/60 blur-3xl" /><div className="relative mx-auto max-w-7xl px-5 sm:px-6"><SectionHeading align="center" badge={<SectionBadge>Purpose-built AI services</SectionBadge>} subtitle="One calm place for care" title="Healthcare intelligence that meets you where you are." description="Every tool is designed to help you understand more, feel prepared, and move forward with confidence." className="mx-auto" /><div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:gap-6">{services.map((service, index) => <ServiceCard key={service.title} index={index} {...service} />)}</div></div></section>;
}

function ServiceCard({ title, description, icon: Icon, href, color, metric, index }: (typeof services)[number] & { index: number }) {
  const reduce = useReducedMotion();
  return <motion.article initial={{ opacity: 0, y: reduce ? 0 : 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .5, delay: index * .08 }} whileHover={reduce ? undefined : { y: -6 }} className="group relative overflow-hidden rounded-3xl border border-sky-100 bg-white/75 p-6 shadow-[0_16px_45px_rgba(14,116,144,.08)] backdrop-blur-xl sm:p-8"><div aria-hidden="true" className="absolute -right-8 -top-8 size-40 rounded-full bg-sky-100/60 blur-3xl transition-transform duration-500 group-hover:scale-125" /><div className="relative flex items-start justify-between gap-4"><span className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg shadow-sky-200/60`}><Icon className="size-6" /></span><span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">{metric}</span></div><h3 className="relative mt-7 text-2xl font-bold tracking-[-.035em] text-slate-950">{title}</h3><p className="relative mt-3 max-w-md leading-7 text-slate-600">{description}</p><a className="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-500" href={href}>Explore service <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></a></motion.article>;
}
