"use client";

import { Camera, FileImage, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;

export function UploadCard({ onSelect, onCamera }: { onSelect: (file: File) => void; onCamera: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const select = (file?: File) => {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) return setError("Please choose a JPG, JPEG, PNG, or WEBP image.");
    if (file.size > maxFileSize) return setError("The image must be smaller than 10 MB.");
    setError(""); onSelect(file);
  };
  return <section onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); select(event.dataTransfer.files[0]); }} className="rounded-3xl border-2 border-dashed border-sky-200 bg-white/65 p-7 text-center shadow-sm backdrop-blur-xl sm:p-10">
    <input ref={inputRef} className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => select(event.target.files?.[0])} />
    <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200"><UploadCloud className="size-7" /></span>
    <h2 className="mt-5 text-lg font-bold text-slate-950">Upload a medicine label</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Use a clear, well-lit photo of the package, label, or prescription.</p>
    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-sky-200"><FileImage className="size-4" /> Browse image</button><button onClick={onCamera} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50"><Camera className="size-4" /> Open camera</button></div>
    <p className="mt-5 text-xs text-slate-500">JPG, JPEG, PNG or WEBP · maximum 10 MB</p>{error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}
  </section>;
}
