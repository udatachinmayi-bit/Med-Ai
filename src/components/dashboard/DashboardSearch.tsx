"use client";

import { useMemo, useState } from "react";
import { FileText, History, Pill, Search, Zap } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

type SearchResult = {
  id: string;
  label: string;
  category: "Medicines" | "Reports" | "Health History" | "Quick Actions";
};

const categoryIcons = {
  Medicines: Pill,
  Reports: FileText,
  "Health History": History,
  "Quick Actions": Zap,
};

export function DashboardSearch() {
  const [query, setQuery] = useState("");
  const { actions, reports, tools } = useDashboard();
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) return [];

    const searchableItems: SearchResult[] = [
      ...tools
        .filter((tool) => tool.title.toLowerCase().includes("medicine"))
        .map((tool) => ({ id: `medicine-${tool.title}`, label: tool.title, category: "Medicines" as const })),
      ...reports.map((report) => ({ id: `report-${report.id}`, label: report.name, category: "Reports" as const })),
      ...tools
        .filter((tool) => tool.title.toLowerCase().includes("history"))
        .map((tool) => ({ id: `history-${tool.title}`, label: tool.title, category: "Health History" as const })),
      ...actions.map((action) => ({ id: `action-${action.label}`, label: action.label, category: "Quick Actions" as const })),
    ];

    return searchableItems.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
  }, [actions, normalizedQuery, reports, tools]);

  return (
    <div className="relative hidden max-w-md flex-1 sm:block">
      <Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
      <input
        aria-label="Search medicines, reports, health history, or quick actions"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-xl border border-sky-100 bg-sky-50/60 py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
        placeholder="Search your health records"
      />
      {normalizedQuery && (
        <div className="absolute top-12 z-50 w-full overflow-hidden rounded-2xl border border-sky-100 bg-white p-2 shadow-xl">
          {results.length ? (
            results.map((result) => {
              const Icon = categoryIcons[result.category];
              return (
                <div key={result.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sky-50">
                  <Icon className="size-4 text-sky-600" />
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-700">{result.label}</span>
                  <span className="text-xs text-slate-400">{result.category}</span>
                </div>
              );
            })
          ) : (
            <p className="px-3 py-4 text-center text-sm text-slate-500">No matching records found.</p>
          )}
        </div>
      )}
    </div>
  );
}
