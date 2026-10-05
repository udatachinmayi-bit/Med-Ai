function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-sky-100/80 ${className}`} />;
}

export function StatsSkeleton() {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <SkeletonLine className="h-4 w-24" />
      <SkeletonLine className="mt-4 h-8 w-20" />
      <SkeletonLine className="mt-3 h-3 w-28" />
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4">
      <SkeletonLine className="size-9" />
      <SkeletonLine className="mt-4 h-4 w-28" />
      <SkeletonLine className="mt-2 h-3 w-full" />
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <SkeletonLine className="size-10" />
      <SkeletonLine className="mt-5 h-5 w-32" />
      <SkeletonLine className="mt-3 h-3 w-full" />
      <SkeletonLine className="mt-2 h-3 w-4/5" />
    </div>
  );
}
