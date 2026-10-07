"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  HeartPulse,
  Loader2,
  Pill,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthContext";
import {
  deleteHealthHistory,
  getHealthHistory,
} from "@/lib/healthHistory";
import type {
  HealthHistoryRecord,
  HealthHistoryType,
} from "@/types/healthHistory";

type FilterType = "all" | HealthHistoryType;

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "medicine", label: "Medicine" },
  { id: "symptom", label: "Symptoms" },
  { id: "report", label: "Reports" },
  { id: "voice", label: "Voice AI" },
];

function getTypeIcon(type: HealthHistoryType) {
  switch (type) {
    case "medicine":
      return <Pill className="h-5 w-5" />;
    case "symptom":
      return <Stethoscope className="h-5 w-5" />;
    case "report":
      return <FileText className="h-5 w-5" />;
    case "voice":
      return <Activity className="h-5 w-5" />;
    default:
      return <HeartPulse className="h-5 w-5" />;
  }
}

function getTypeLabel(type: HealthHistoryType) {
  switch (type) {
    case "medicine":
      return "Medicine";
    case "symptom":
      return "Symptom Check";
    case "report":
      return "Medical Report";
    case "voice":
      return "Voice AI";
    default:
      return "Health";
  }
}

function getTypeStyles(type: HealthHistoryType) {
  switch (type) {
    case "medicine":
      return {
        icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        badge:
          "bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
      };

    case "symptom":
      return {
        icon: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        badge:
          "bg-orange-500/10 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
      };

    case "report":
      return {
        icon: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        badge:
          "bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
      };

    case "voice":
      return {
        icon: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        badge:
          "bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
      };

    default:
      return {
        icon: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
        badge:
          "bg-gray-500/10 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300",
      };
  }
}

function formatDate(value: unknown) {
  if (!value) return "Unknown date";

  try {
    // Firestore Timestamp
    if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (value as { toDate?: unknown }).toDate === "function"
    ) {
      const date = (value as { toDate: () => Date }).toDate();
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // JS Date
    if (value instanceof Date) {
      return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // Timestamp-like object
    if (
      typeof value === "object" &&
      value !== null &&
      "seconds" in value
    ) {
      const seconds = Number(
        (value as { seconds: number }).seconds
      );

      if (!Number.isNaN(seconds)) {
        return new Date(seconds * 1000).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }

    const date = new Date(value as string | number);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

function formatTime(value: unknown) {
  if (!value) return "";

  try {
    if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (value as { toDate?: unknown }).toDate === "function"
    ) {
      return (value as { toDate: () => Date })
        .toDate()
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
    }

    const date = new Date(value as string | number);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getUrgencyStyles(urgency?: string) {
  switch (urgency) {
    case "emergency":
      return "bg-red-500/10 text-red-700 dark:text-red-300";

    case "urgent":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-300";

    case "soon":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";

    default:
      return "bg-green-500/10 text-green-700 dark:text-green-300";
  }
}

export function HealthHistory() {
  const { user } = useAuth();

  const [history, setHistory] = useState<HealthHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const loadHistory = useCallback(
    async (showRefreshLoader = false) => {
      if (!user?.uid) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        setError("");

        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getHealthHistory(user.uid);

        setHistory(data);
      } catch (err) {
        console.error("Failed to load health history:", err);

        setError(
          "Unable to load your health history. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.uid]
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return history.filter((item) => {
      const matchesType =
        filter === "all" || item.type === filter;

      if (!matchesType) return false;

      if (!query) return true;

      const searchableText = [
        item.title,
        item.summary,
        item.type,
        item.metadata?.medicineName,
        item.metadata?.genericName,
        item.metadata?.reportName,
        item.metadata?.question,
        ...(item.metadata?.symptoms || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [history, search, filter]);

  const stats = useMemo(() => {
    return {
      total: history.length,
      medicines: history.filter(
        (item) => item.type === "medicine"
      ).length,
      symptoms: history.filter(
        (item) => item.type === "symptom"
      ).length,
      reports: history.filter(
        (item) => item.type === "report"
      ).length,
    };
  }, [history]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this health history record?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteHealthHistory(id);

      setHistory((current) =>
        current.filter((item) => item.id !== id)
      );

      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (err) {
      console.error("Failed to delete history:", err);

      setError(
        "Unable to delete this record. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>

            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Loading your health history...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20">
                <HeartPulse className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  MedAI
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Health History
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Review your previous medicine scans, symptom checks,
              medical reports, and Voice AI conversations in one
              place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadHistory(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Records"
            value={stats.total}
            icon={<HeartPulse className="h-5 w-5" />}
          />

          <StatCard
            label="Medicine Scans"
            value={stats.medicines}
            icon={<Pill className="h-5 w-5" />}
          />

          <StatCard
            label="Symptom Checks"
            value={stats.symptoms}
            icon={<Stethoscope className="h-5 w-5" />}
          />

          <StatCard
            label="Reports"
            value={stats.reports}
            icon={<FileText className="h-5 w-5" />}
          />
        </div>

        {/* SEARCH + FILTER */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your health history..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => {
                const active = filter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* RESULTS COUNT */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {filteredHistory.length}{" "}
            {filteredHistory.length === 1 ? "record" : "records"}
          </p>

          {(search || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {filteredHistory.length === 0 ? (
          <EmptyState
            hasFilters={Boolean(search) || filter !== "all"}
            onClear={() => {
              setSearch("");
              setFilter("all");
            }}
          />
        ) : (
          /* TIMELINE */
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute bottom-0 left-[27px] top-0 hidden w-px bg-slate-200 dark:bg-slate-800 sm:block" />

            <div className="space-y-5">
              {filteredHistory.map((item) => {
                const expanded = expandedId === item.id;
                const styles = getTypeStyles(item.type);

                return (
                  <article
                    key={item.id}
                    className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:ml-14"
                  >
                    {/* TIMELINE ICON */}
                    <div
                      className={`absolute -left-[58px] top-6 hidden h-12 w-12 items-center justify-center rounded-2xl border-4 border-slate-50 dark:border-slate-950 sm:flex ${styles.icon}`}
                    >
                      {getTypeIcon(item.type)}
                    </div>

                    {/* HEADER */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        {/* Mobile icon */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:hidden ${styles.icon}`}
                        >
                          {getTypeIcon(item.type)}
                        </div>

                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${styles.badge}`}
                            >
                              {getTypeLabel(item.type)}
                            </span>

                            {item.metadata?.urgency && (
                              <span
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${getUrgencyStyles(
                                  item.metadata.urgency
                                )}`}
                              >
                                {item.metadata.urgency}
                              </span>
                            )}
                          </div>

                          <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h2>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(item.createdAt)}
                            </span>

                            {formatTime(item.createdAt) && (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTime(item.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(
                              expanded ? null : item.id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          {expanded ? (
                            <>
                              Hide
                              <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Details
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          disabled={deletingId === item.id}
                          aria-label="Delete history record"
                          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* SUMMARY */}
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {item.summary}
                    </p>

                    {/* EXPANDED DETAILS */}
                    {expanded && (
                      <HistoryDetails item={item} />
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* PRIVACY NOTE */}
        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="rounded-lg bg-blue-600/10 p-2 text-blue-600 dark:text-blue-400">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              Your health data
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-800/80 dark:text-blue-300/80">
              Your health history is linked to your account.
              Only your account can access these records through
              the application.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------------------------------------------------
   STAT CARD
--------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------
   DETAILS
--------------------------------------------------------- */

function HistoryDetails({
  item,
}: {
  item: HealthHistoryRecord;
}) {
  const metadata = item.metadata;

  return (
    <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Medicine */}
        {metadata?.medicineName && (
          <DetailBox
            label="Medicine"
            value={metadata.medicineName}
          />
        )}

        {metadata?.genericName && (
          <DetailBox
            label="Generic Name"
            value={metadata.genericName}
          />
        )}

        {/* Report */}
        {metadata?.reportName && (
          <DetailBox
            label="Report"
            value={metadata.reportName}
          />
        )}

        {/* Symptoms */}
        {metadata?.symptoms &&
          metadata.symptoms.length > 0 && (
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                Symptoms
              </p>

              <div className="flex flex-wrap gap-2">
                {metadata.symptoms.map(
                  (symptom, index) => (
                    <span
                      key={`${symptom}-${index}`}
                      className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300"
                    >
                      {symptom}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

        {/* Urgency */}
        {metadata?.urgency && (
          <DetailBox
            label="Urgency"
            value={metadata.urgency}
          />
        )}

        {/* Confidence */}
        {typeof metadata?.confidence === "number" && (
          <DetailBox
            label="AI Confidence"
            value={`${Math.round(
              metadata.confidence <= 1
                ? metadata.confidence * 100
                : metadata.confidence
            )}%`}
          />
        )}

        {/* Question */}
        {metadata?.question && (
          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2 lg:col-span-3 dark:bg-slate-950">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              Question
            </p>

            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
              {metadata.question}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DETAIL BOX
--------------------------------------------------------- */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------
   EMPTY STATE
--------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
        {hasFilters ? (
          <Search className="h-7 w-7" />
        ) : (
          <HeartPulse className="h-7 w-7" />
        )}
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {hasFilters
          ? "No matching records"
          : "No health history yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {hasFilters
          ? "Try changing your search or filter to find the record you are looking for."
          : "Your medicine scans, symptom checks, medical reports, and Voice AI activity will appear here."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}