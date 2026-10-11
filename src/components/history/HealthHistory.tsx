
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Calendar,
  FileText,
  HeartPulse,
  Loader2,
  Pill,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  deleteHealthHistory,
  getHealthHistory,
} from "@/lib/healthHistory";
import type {
  HealthHistoryRecord,
  HealthHistoryType,
} from "@/types/healthHistory";

const FILTERS: {
  label: string;
  value: "all" | HealthHistoryType;
}[] = [
  { label: "All records", value: "all" },
  { label: "Medicine scans", value: "medicine" },
  { label: "Symptom checks", value: "symptom" },
  { label: "Medical reports", value: "report" },
  { label: "Voice assistant", value: "voice" },
];

function getDate(value: unknown): Date | null {
  if (!value) return null;

  try {
    const date =
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof value.toDate === "function"
        ? value.toDate()
        : new Date(value as string | number);

    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function formatDate(value: unknown): string {
  const date = getDate(value);

  if (!date) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getIcon(type: HealthHistoryType) {
  switch (type) {
    case "medicine":
      return Pill;
    case "symptom":
      return Stethoscope;
    case "report":
      return FileText;
    case "voice":
      return Activity;
    default:
      return HeartPulse;
  }
}

function getTypeLabel(type: HealthHistoryType) {
  switch (type) {
    case "medicine":
      return "Medicine scan";
    case "symptom":
      return "Symptom check";
    case "report":
      return "Medical report";
    case "voice":
      return "Voice assistant";
    default:
      return "Health record";
  }
}

export function HealthHistory() {
  const { user, loading: authLoading } = useAuth();

  const [records, setRecords] = useState<HealthHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | HealthHistoryType>("all");
  const [selected, setSelected] = useState<HealthHistoryRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = useCallback(
    async (isRefresh = false) => {
      if (!user) {
        setRecords([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const result = await getHealthHistory(user.uid);
        setRecords(result);
      } catch (err) {
        console.error("Failed to load health history:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your health history."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (authLoading) return;
    void loadHistory();
  }, [authLoading, loadHistory]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesType = filter === "all" || record.type === filter;

      const searchableText = [
        record.title,
        record.summary,
        record.metadata?.medicineName,
        record.metadata?.genericName,
        record.metadata?.reportName,
        record.metadata?.question,
        ...(record.metadata?.symptoms ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesType && searchableText.includes(term);
    });
  }, [records, search, filter]);

  const counts = useMemo(
    () => ({
      total: records.length,
      medicine: records.filter((r) => r.type === "medicine").length,
      symptom: records.filter((r) => r.type === "symptom").length,
      report: records.filter((r) => r.type === "report").length,
      voice: records.filter((r) => r.type === "voice").length,
    }),
    [records]
  );

  const handleDelete = async (record: HealthHistoryRecord) => {
    if (!user) return;

    const confirmed = window.confirm(
      `Delete "${record.title}" from your health history? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(record.id);
    setError("");

    try {
      await deleteHealthHistory(user.uid, record.id);

      setRecords((current) =>
        current.filter((item) => item.id !== record.id)
      );

      if (selected?.id === record.id) {
        setSelected(null);
      }
    } catch (err) {
      console.error("Failed to delete health record:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="flex min-h-[50vh] items-center justify-center gap-3">
          <Loader2 className="animate-spin text-sky-600" />
          <span>Loading your health history...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <h1 className="text-3xl font-bold">Health History</h1>
        <p className="mt-3 text-slate-600">
          Please sign in to view your health records.
        </p>
      </main>
    );
  }

  const statCards = [
    { label: "Total records", value: counts.total, icon: HeartPulse },
    { label: "Medicine scans", value: counts.medicine, icon: Pill },
    { label: "Symptom checks", value: counts.symptom, icon: Stethoscope },
    { label: "Medical reports", value: counts.report, icon: FileText },
    { label: "Voice activity", value: counts.voice, icon: Activity },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              MedAI
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Health History
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Review your saved medicine scans, symptom checks, medical
              reports, and Voice AI activity in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadHistory(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1 break-words text-sm">{error}</p>
            <button
              type="button"
              onClick={() => void loadHistory(true)}
              className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm transition hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
                    <Icon size={22} />
                  </div>
                  <span className="text-3xl font-bold text-slate-900">
                    {item.value}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{item.label}</p>
              </div>
            );
          })}
        </section>

        <section className="space-y-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your health records"
              aria-label="Search health records"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  filter === item.value
                    ? "border-sky-300 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {filteredRecords.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-14 text-center">
              <Calendar
                className="mx-auto text-slate-400"
                size={34}
              />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {records.length === 0
                  ? "No health records yet"
                  : "No matching records"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                {records.length === 0
                  ? "Your saved activity will appear here when your health features save records automatically."
                  : "Try another search term or select a different filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const Icon = getIcon(record.type);

                return (
                  <article
                    key={record.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words font-semibold text-slate-900">
                            {record.title}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            {getTypeLabel(record.type)}
                          </span>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                          {record.summary}
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                          {formatDate(record.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(record)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        View details
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(record)}
                        disabled={deletingId === record.id}
                        aria-label={`Delete ${record.title}`}
                        className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === record.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="text-xs leading-6 text-slate-500">
          Your health history contains sensitive information. Sign out on
          shared devices and use appropriate Firestore security rules to
          protect your records. This history is for reference and is not a
          substitute for professional medical advice.
        </p>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-detail-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-sky-600">
                  {getTypeLabel(selected.type)}
                </p>
                <h2
                  id="history-detail-title"
                  className="mt-2 break-words text-2xl font-bold"
                >
                  {selected.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {formatDate(selected.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700">
              {selected.summary || "No summary is available."}
            </div>

            {selected.metadata &&
              Object.entries(selected.metadata).map(([key, value]) => {
                if (
                  value === undefined ||
                  value === null ||
                  value === "" ||
                  (Array.isArray(value) && value.length === 0)
                ) {
                  return null;
                }

                return (
                  <div
                    key={key}
                    className="mt-4 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="mt-1 break-words text-slate-700">
                      {Array.isArray(value)
                        ? value.join(", ")
                        : String(value)}
                    </p>
                  </div>
                );
              })}

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Close details
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default HealthHistory;
