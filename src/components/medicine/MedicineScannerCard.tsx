import { ScanLine } from "lucide-react";

export function MedicineScannerCard({ disabled, onScan }: { disabled: boolean; onScan: () => void }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <p className="text-sm font-bold text-slate-950">Ready for a clear answer?</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">We will identify the medicine and organize the important safety information for you.</p>
      <button disabled={disabled} onClick={onScan} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">
        <ScanLine className="size-5" /> Scan medicine
      </button>
    </div>
  );
}
