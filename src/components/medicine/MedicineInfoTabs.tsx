"use client";

import { useState } from "react";
import type { Medicine } from "@/types/medicine";

const tabs = ["Overview", "Uses", "Safety", "Interactions", "Alternatives"] as const;
type Tab = (typeof tabs)[number];

export function MedicineInfoTabs({ medicine }: { medicine: Medicine }) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <section className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-sky-100 px-1">
        {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition ${activeTab === tab ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-sky-600"}`}>{tab}</button>)}
      </div>
      <div className="pt-5"><TabContent tab={activeTab} medicine={medicine} /></div>
    </section>
  );
}

function TabContent({ tab, medicine }: { tab: Tab; medicine: Medicine }) {
  if (tab === "Overview") return <DetailList details={[{ label: "Dosage guidance", value: medicine.dosage }, { label: "Storage", value: medicine.storage }]} />;
  if (tab === "Uses") return <BulletList title="Common uses" items={medicine.uses} />;
  if (tab === "Safety") return <><BulletList title="Warnings" items={medicine.warnings} /><BulletList title="Possible side effects" items={medicine.sideEffects} /><DetailList details={[{ label: "Pregnancy safety", value: medicine.pregnancySafety }, { label: "Driving safety", value: medicine.drivingSafety }]} /></>;
  if (tab === "Interactions") return <DetailList details={[{ label: "Food interaction", value: medicine.foodInteraction }, { label: "Alcohol interaction", value: medicine.alcoholInteraction }]} />;
  return <BulletList title="Possible alternatives" items={medicine.alternatives} />;
}

function DetailList({ details }: { details: { label: string; value: string }[] }) {
  return <div className="space-y-4">{details.map((detail) => <div key={detail.label}><h3 className="text-sm font-bold text-slate-800">{detail.label}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{detail.value}</p></div>)}</div>;
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return <div className="mb-5 last:mb-0"><h3 className="text-sm font-bold text-slate-800">{title}</h3><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-500" />{item}</li>)}</ul></div>;
}
