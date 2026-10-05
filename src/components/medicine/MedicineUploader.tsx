"use client";

import { useRef, useState } from "react";
import { Camera, FileImage, UploadCloud } from "lucide-react";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;

export function MedicineUploader({ onSelect }: { onSelect: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function selectFile(file?: File) {
    if (!file) return;
    if (!acceptedTypes.includes(file.type) || file.size > maxFileSize) {
      setError("Please select a JPG, PNG, JPEG, or WEBP image under 10 MB.");
      return;
    }
    setError("");
    onSelect(file);
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        selectFile(event.dataTransfer.files[0]);
      }}
      className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/45 p-6 text-center sm:p-8"
    >
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200">
        <UploadCloud className="size-6" />
      </span>
      <h2 className="mt-5 font-bold text-slate-950">Upload your medicine image</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Drag and drop a clear photo of the medicine pack, label, or prescription here.</p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <button onClick={() => inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-200 transition hover:brightness-105">
          <FileImage className="size-4" /> Browse image
        </button>
        <button onClick={() => cameraRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50">
          <Camera className="size-4" /> Use camera
        </button>
      </div>
      <p className="mt-5 text-xs text-slate-500">Supported: JPG, PNG, JPEG, WEBP · Maximum size: 10 MB</p>
      {error && <p role="alert" className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
