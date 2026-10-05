"use client";

import Image from "next/image";
import { ImageIcon, RefreshCw, Trash2 } from "lucide-react";

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function MedicinePreview({ file, onChange, onRemove }: { file: File; onChange: () => void; onRemove: () => void }) {
  const imageUrl = URL.createObjectURL(file);

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/75 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sky-50">
          <Image src={imageUrl} alt="Selected medicine" fill unoptimized className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-800"><ImageIcon className="size-4 text-sky-600" /> Image ready to scan</p>
          <p className="mt-2 truncate text-sm text-slate-600">{file.name}</p>
          <p className="mt-1 text-xs text-slate-500">{formatFileSize(file.size)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={onChange} className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-500"><RefreshCw className="size-3.5" /> Change image</button>
            <button onClick={onRemove} className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-500"><Trash2 className="size-3.5" /> Remove image</button>
          </div>
        </div>
      </div>
    </div>
  );
}
