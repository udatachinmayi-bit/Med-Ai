"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  id?: string;
  disabled?: boolean;
}

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  id,
  disabled,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white/80
          px-4
          py-3
          pr-12
          outline-none
          transition
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 disabled:opacity-60"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p role="alert" className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
