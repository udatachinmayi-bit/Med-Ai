"use client";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  id?: string;
  disabled?: boolean;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  id,
  disabled,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        id={id}
        type={type}
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
        outline-none
        transition
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100"
      />
      {error && <p role="alert" className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
