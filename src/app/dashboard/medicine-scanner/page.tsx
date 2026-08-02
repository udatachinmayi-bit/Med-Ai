"use client";

import { useRef, useState } from "react";
import { BellRing, HeartPulse, ShieldAlert } from "lucide-react";
import { EmptyScanner } from "@/components/medicine/EmptyScanner";
import { MedicineInfoTabs } from "@/components/medicine/MedicineInfoTabs";
import { MedicinePreview } from "@/components/medicine/MedicinePreview";
import { MedicineResult } from "@/components/medicine/MedicineResult";
import { MedicineScannerCard } from "@/components/medicine/MedicineScannerCard";
import { MedicineUploader } from "@/components/medicine/MedicineUploader";
import { ScanProgress } from "@/components/medicine/ScanProgress";
import { scanMedicineImage } from "@/services/medicineService";
import type { Medicine } from "@/types/medicine";

type ScanState = "idle" | "scanning" | "complete";

export default function MedicineScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const changeInputRef = useRef<HTMLInputElement>(null);

  function selectImage(nextFile: File) {
    setFile(nextFile);
    setScanState("idle");
    setMedicine(null);
  }

  function removeImage() {
    setFile(null);
    setScanState("idle");
    setMedicine(null);
  }

  async function completeScan() {
    const result = await scanMedicineImage();
    setMedicine(result);
    setScanState("complete");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-sky-700">Medicine tools</p>
        <h1 className="mt-1 text-3xl font-bold tracking-[-.05em] text-slate-950 sm:text-4xl">Medicine Scanner</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Upload a medicine image to see clear, organized information about its use and safety.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <input ref={changeInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => event.target.files?.[0] && selectImage(event.target.files[0])} />
          {!file ? <MedicineUploader onSelect={selectImage} /> : <><MedicinePreview file={file} onChange={() => changeInputRef.current?.click()} onRemove={removeImage} />{scanState === "idle" && <MedicineScannerCard disabled={!file} onScan={() => setScanState("scanning")} />}</>}
          {scanState === "scanning" && <ScanProgress onComplete={completeScan} />}
          {scanState === "complete" && medicine ? <><MedicineResult medicine={medicine} /><MedicineInfoTabs medicine={medicine} /></> : !file && <EmptyScanner />}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <InfoCard icon={<HeartPulse className="size-5" />} title="Health tip" text="Use the original medicine package whenever possible so the label is easy to read." />
          <InfoCard icon={<BellRing className="size-5" />} title="Daily reminder" text="Set a reminder after confirming your medicine schedule with your clinician." />
          <InfoCard icon={<ShieldAlert className="size-5" />} title="Emergency note" text="For severe reactions, breathing difficulty, or suspected overdose, seek emergency medical care immediately." emergency />
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text, emergency = false }: { icon: React.ReactNode; title: string; text: string; emergency?: boolean }) {
  return <section className={`rounded-2xl border p-5 shadow-sm ${emergency ? "border-rose-100 bg-rose-50/70" : "border-white/80 bg-white/75 backdrop-blur-xl"}`}><span className={`grid size-10 place-items-center rounded-xl ${emergency ? "bg-rose-100 text-rose-600" : "bg-sky-50 text-sky-600"}`}>{icon}</span><h2 className="mt-4 font-bold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></section>;
}
