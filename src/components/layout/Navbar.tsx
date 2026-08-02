"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowRight, Bell, ChevronDown, FileText, HeartPulse, Menu, Mic, ShieldCheck, X } from "lucide-react";

type NavLink = { label: string; href: string; mega?: "products" | "resources" };

const navigation: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/#services", mega: "products" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Resources", href: "/#resources", mega: "resources" },
];

const productItems = [
  { title: "Medicine scanner", description: "Understand medications in seconds.", href: "/medicine-scanner", icon: Activity },
  { title: "Report analyzer", description: "Turn complex reports into clarity.", href: "/report-analyzer", icon: FileText },
  { title: "Symptom guidance", description: "Organise symptoms before your visit.", href: "/symptom-checker", icon: HeartPulse },
  { title: "Voice AI", description: "Talk through your health questions.", href: "/voice-assistant", icon: Mic },
];

const resourceItems = [
  { title: "Privacy first", description: "Your health information, protected.", href: "/#privacy", icon: ShieldCheck },
  { title: "Health library", description: "Evidence-informed everyday guidance.", href: "/#resources", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"products" | "resources" | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (drawerOpen || openMenu !== null) {
      const id = setTimeout(() => {
        setDrawerOpen(false);
        setOpenMenu(null);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [pathname, drawerOpen, openMenu]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname !== "/" && href.startsWith(pathname);

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-sky-100/80 bg-white/80 shadow-[0_8px_30px_rgba(14,116,144,0.08)] backdrop-blur-xl" : "border-transparent bg-white/40 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link aria-label="MedAI home" className="group flex shrink-0 items-center gap-2" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200/60 transition-transform duration-200 group-hover:scale-105">
            <HeartPulse className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-[-0.04em] text-slate-950">med<span className="text-sky-600">ai</span></span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 rounded-full border border-white/80 bg-white/55 p-1 shadow-[0_8px_24px_rgba(14,116,144,0.06)] backdrop-blur-xl lg:flex">
          {navigation.map((item) => item.mega ? (
            <div key={item.label} className="relative" onMouseEnter={() => setOpenMenu(item.mega!)} onMouseLeave={() => setOpenMenu(null)}>
              <button
                aria-expanded={openMenu === item.mega}
                className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-sky-600 ${openMenu === item.mega ? "bg-white text-sky-600 shadow-sm" : "text-slate-600"}`}
                onClick={() => setOpenMenu(openMenu === item.mega ? null : item.mega!)}
                type="button"
              >
                {item.label}<ChevronDown className={`size-3.5 transition-transform ${openMenu === item.mega ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openMenu === item.mega ? <MegaMenu kind={item.mega} reduceMotion={shouldReduceMotion} /> : null}
              </AnimatePresence>
            </div>
          ) : (
            <Link key={item.label} className={`relative flex items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-sky-600 ${isActive(item.href) ? "bg-white text-sky-700 shadow-sm" : "text-slate-600"}`} href={item.href}>
              {item.label}
              {isActive(item.href) ? <motion.span layoutId="nav-active" className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" /> : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-700" type="button">
            <Bell className="size-4.5" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-500 ring-2 ring-white" />
          </button>
          <button aria-label="Open profile menu" className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 text-xs font-bold text-sky-700 ring-2 ring-white shadow-sm" type="button">GC</button>
          <Link className="ml-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(2,132,199,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_25px_rgba(2,132,199,0.28)]" href="/login">
            Get started <ArrowRight className="size-4" />
          </Link>
        </div>

        <button aria-controls="mobile-navigation" aria-expanded={drawerOpen} aria-label={drawerOpen ? "Close navigation" : "Open navigation"} className="grid size-10 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-sky-50 lg:hidden" onClick={() => setDrawerOpen((open) => !open)} type="button">
          {drawerOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.button aria-label="Close navigation" className="fixed inset-0 top-[72px] -z-10 bg-slate-950/10 backdrop-blur-[1px] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} type="button" />
            <motion.div
              id="mobile-navigation"
              className="absolute left-3 right-3 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl lg:hidden"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              <nav aria-label="Mobile navigation" className="space-y-1">
                {navigation.map((item, index) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: shouldReduceMotion ? 0 : index * 0.04 }}>
                    <Link className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold ${isActive(item.href) ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-50"}`} href={item.href} onClick={() => setDrawerOpen(false)}>
                      {item.label}{item.mega ? <ChevronDown className="size-4 -rotate-90 text-slate-400" /> : null}
                    </Link>
                    {item.mega === "products" ? <MobileProductLinks onNavigate={() => setDrawerOpen(false)} /> : null}
                  </motion.div>
                ))}
              </nav>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <Link className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white" href="/login" onClick={() => setDrawerOpen(false)}>
                  Get started <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function MegaMenu({ kind, reduceMotion }: { kind: "products" | "resources"; reduceMotion: boolean | null }) {
  const items = kind === "products" ? productItems : resourceItems;
  return (
    <motion.div
      className={`absolute left-1/2 top-[calc(100%-2px)] -translate-x-1/2 rounded-2xl border border-sky-100 bg-white/95 p-2 shadow-[0_24px_55px_rgba(15,23,42,0.12)] backdrop-blur-2xl ${kind === "products" ? "w-[570px]" : "w-[390px]"}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      <div className={kind === "products" ? "grid grid-cols-2 gap-1" : "grid gap-1"}>
        {items.map(({ title, description, href, icon: Icon }) => (
          <Link key={title} className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-sky-50" href={href}>
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-600 transition-transform group-hover:scale-105"><Icon className="size-4.5" /></span>
            <span><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span></span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function MobileProductLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mx-3 mb-2 grid grid-cols-2 gap-1 rounded-xl bg-sky-50/70 p-1.5">
      {productItems.map(({ title, href }) => <Link key={title} className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-white" href={href} onClick={onNavigate}>{title}</Link>)}
    </div>
  );
}
