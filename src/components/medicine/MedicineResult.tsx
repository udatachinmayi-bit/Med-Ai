import { BadgeCheck, Pill, ShieldCheck } from "lucide-react";
import type { Medicine } from "@/types/medicine";

export function MedicineResult({ medicine }: { medicine: Medicine }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/80 bg-white/75 shadow-sm backdrop-blur-xl">
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 p-5 text-white">
        <div className="flex items-start gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white/15"><Pill className="size-5" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-sky-100">Medicine identified</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">{medicine.name}</h2>
            <p className="mt-1 text-sm text-sky-100">{medicine.brandName} · {medicine.type}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <ResultField label="Brand name" value={medicine.brandName} />
        <ResultField label="Generic name" value={medicine.genericName} />
        <ResultField label="Medicine type" value={medicine.type} />
        <ResultField label="Prescription" value={medicine.prescriptionRequired ? "Required" : "Not required"} />
      </div>
      <div className="border-t border-sky-100 bg-sky-50/50 p-4 text-sm leading-6 text-slate-600"><span className="mr-2 inline-flex align-middle text-emerald-600"><BadgeCheck className="size-4" /></span>{medicine.overview}</div>
      <div className="flex items-center gap-2 border-t border-sky-100 px-5 py-3 text-xs font-medium text-slate-500"><ShieldCheck className="size-4 text-sky-600" /> This information is for awareness, not a diagnosis or prescription.</div>
    </article>
  );
}

function ResultField({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-medium text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-700">{value}</p></div>;
}
