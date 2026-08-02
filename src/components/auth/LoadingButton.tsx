"use client";

import { LoaderCircle } from "lucide-react";

interface LoadingButtonProps {
  text: string;
  loading?: boolean;
}

export default function LoadingButton({
  text,
  loading = false,
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading}
      className="
      w-full
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      to-cyan-500
      py-3
      font-semibold
      text-white
      transition
      hover:scale-[1.02]
      disabled:opacity-60"
    >
      {loading ? <span className="inline-flex items-center gap-2"><LoaderCircle className="size-4 animate-spin" />Loading...</span> : text}
    </button>
  );
}
