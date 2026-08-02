import { FileText } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function RecentReports() {
  const { reports, isLoading } = useDashboard();

  return (
    <section className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <h2 className="font-bold text-slate-950">Recent reports</h2>
      <div className="mt-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-sky-50/60" />
          ))
        ) : reports.length ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-xl bg-sky-50/60 p-3"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <FileText className="size-4 text-sky-600" />
                {report.name}
              </span>
              <span
                className={`text-xs font-semibold ${
                  report.status === "Reviewed" ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {report.status}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-sky-50/60 p-4">
            <p className="text-sm text-slate-500">No reports yet.</p>
            <button className="mt-3 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700">
              Upload Report
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
