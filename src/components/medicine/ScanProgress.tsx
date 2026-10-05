"use client";

import { useEffect, useState } from "react";
import { ScanLine } from "lucide-react";

export function ScanProgress({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          window.setTimeout(onComplete, 250);
          return 100;
        }
        return Math.min(current + 10, 100);
      });
    }, 180);
    return () => window.clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/75 p-6 text-center shadow-sm backdrop-blur-xl">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200"><ScanLine className="size-6 animate-pulse" /></span>
      <h2 className="mt-5 font-bold text-slate-950">Scanning your medicine</h2>
      <p className="mt-2 text-sm text-slate-500">Checking label details and safety information.</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-sky-100"><div className="h-full rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 transition-all duration-200" style={{ width: `${progress}%` }} /></div>
      <p className="mt-3 text-sm font-bold text-sky-700">{progress}%</p>
    </div>
  );
}
