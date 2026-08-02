import { CheckCircle2, FileText } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function RecentActivity() {
  const { activity, isLoading } = useDashboard();

  return (
    <section className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-950">Recent activity</h2>
        <CheckCircle2 className="size-5 text-emerald-500" />
      </div>
      <div className="mt-5 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 animate-pulse">
              <span className="size-9 rounded-lg bg-sky-100/80" />
              <span className="flex-1 space-y-2">
                <span className="block h-4 w-3/4 rounded bg-sky-100/80" />
                <span className="block h-3 w-1/2 rounded bg-sky-100/80" />
              </span>
            </div>
          ))
        ) : activity.length ? (
          activity.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-sky-50 text-sky-600">
                <FileText className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-700">
                  {item.title}
                </span>
                <span className="block text-xs text-slate-500">{item.time}</span>
              </span>
            </div>
          ))
        ) : (
          <p className="py-4 text-sm text-slate-500">No activity yet.</p>
        )}
      </div>
    </section>
  );
}
