import type { ReactNode } from "react";

export interface SectionHeadingProps {
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  align = "left",
  badge,
  className = "",
  description,
  subtitle,
  title,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <header className={`flex max-w-3xl flex-col ${alignment} ${className}`.trim()}>
      {badge ? <div className="mb-4">{badge}</div> : null}
      {subtitle ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-sky-600">{subtitle}</p> : null}
      <h2 className="text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p> : null}
    </header>
  );
}

export default SectionHeading;
