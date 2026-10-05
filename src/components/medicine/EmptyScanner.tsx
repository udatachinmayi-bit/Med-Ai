import { ScanSearch } from "lucide-react";

export function EmptyScanner() {
  return (
    <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/45 p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-sky-600 shadow-sm"><ScanSearch className="size-5" /></span>
      <h2 className="mt-4 font-bold text-slate-900">Your scan result will appear here</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Upload a clear medicine image, then start a scan to view identification, usage, and safety guidance.</p>
    </div>
  );
}
