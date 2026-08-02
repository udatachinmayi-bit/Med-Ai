"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type GradientButtonVariant = "primary" | "secondary" | "outline";

export interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: ReactNode;
  variant?: GradientButtonVariant;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<GradientButtonVariant, string> = {
  primary:
    "border border-transparent bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 text-white shadow-[0_10px_24px_rgba(2,132,199,0.26)] hover:from-sky-500 hover:via-cyan-500 hover:to-blue-500",
  secondary:
    "border border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-700 shadow-sm hover:border-sky-200 hover:from-sky-100 hover:to-cyan-100",
  outline:
    "border border-sky-200 bg-white/60 text-sky-700 shadow-sm backdrop-blur-sm hover:border-sky-400 hover:bg-sky-50/80",
};

function LoadingSpinner() {
  return <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />;
}

export function GradientButton({
  children,
  className = "",
  disabled,
  leftIcon,
  loading = false,
  rightIcon,
  type = "button",
  variant = "primary",
  ...props
}: GradientButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 sm:px-5 ${variantClasses[variant]} ${className}`.trim()}
      disabled={isDisabled}
      type={type}
      whileHover={!isDisabled && !shouldReduceMotion ? { y: -2, scale: 1.015 } : undefined}
      whileTap={!isDisabled && !shouldReduceMotion ? { scale: 0.985 } : undefined}
      {...props}
    >
      {loading ? <LoadingSpinner /> : leftIcon ? <span className="flex size-4 items-center justify-center">{leftIcon}</span> : null}
      <span>{children}</span>
      {!loading && rightIcon ? <span className="flex size-4 items-center justify-center">{rightIcon}</span> : null}
    </motion.button>
  );
}

export default GradientButton;
