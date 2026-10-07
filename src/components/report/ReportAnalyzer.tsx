"use client";

import {
  CheckCircle2,
  FileText,
  Loader2,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  DragEvent,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  analyzeReport,
} from "@/lib/geminiReport";

import type {
  ReportAnalysis,
} from "@/types/report";

import {
  ReportResult,
} from "./ReportResult";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_SIZE =
  20 * 1024 * 1024;

export function ReportAnalyzer() {
  const [file, setFile] =
    useState<File | null>(null);

  const [analysis, setAnalysis] =
    useState<ReportAnalysis | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const [error, setError] =
    useState("");

  const validateFile = (
    selected: File
  ) => {
    if (
      !ACCEPTED_TYPES.includes(
        selected.type
      )
    ) {
      throw new Error(
        "Please upload a PDF, JPG, PNG or WebP medical report."
      );
    }

    if (selected.size > MAX_SIZE) {
      throw new Error(
        "File size must be below 20 MB."
      );
    }
  };

  const selectFile = (
    selected: File
  ) => {
    try {
      validateFile(selected);

      setFile(selected);
      setAnalysis(null);
      setError("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Invalid file."
      );
    }
  };

  const handleInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      event.target.files?.[0];

    if (selected) {
      selectFile(selected);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setDragging(false);

    const selected =
      event.dataTransfer.files?.[0];

    if (selected) {
      selectFile(selected);
    }
  };

  const analyze = async () => {
    if (!file) {
      toast.error(
        "Please upload a report first."
      );

      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const result =
        await analyzeReport(file);

      setAnalysis(result);

      toast.success(
        "Report analyzed successfully."
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze the report.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
  };

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-600 to-cyan-500 p-6 text-white shadow-lg">

        <div className="flex items-start gap-4">

          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <FileText className="size-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Medical Report Analyzer
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
              Upload a medical report and
              MedAI will organize the results,
              highlight abnormal findings and
              explain the report in simpler
              language.
            </p>
          </div>

        </div>

      </section>

      {/* UPLOAD */}
      {!analysis && (
        <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={handleDrop}
            className={[
              "rounded-3xl border-2 border-dashed p-8 text-center transition",
              dragging
                ? "border-sky-500 bg-sky-50"
                : "border-sky-100 bg-sky-50/30",
            ].join(" ")}
          >

            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-sky-100 text-sky-600">
              <Upload className="size-7" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Upload your medical report
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Drag and drop a PDF or image
              here, or choose a file from
              your computer.
            </p>

            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700">

              <Upload className="size-4" />

              Choose report

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleInput}
              />

            </label>

            <p className="mt-4 text-xs text-slate-400">
              Supported: PDF, JPG, PNG,
              WebP · Maximum 20 MB
            </p>

          </div>

        </section>
      )}

      {/* SELECTED FILE */}
      {file && !analysis && (
        <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <FileText className="size-5" />
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate font-semibold text-slate-900">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatFileSize(
                  file.size
                )}
              </p>

            </div>

            <button
              type="button"
              onClick={removeFile}
              disabled={loading}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Remove report"
            >
              <X className="size-5" />
            </button>

          </div>

          <button
            type="button"
            onClick={analyze}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Analyzing report...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-5" />
                Analyze report
              </>
            )}

          </button>

        </section>
      )}

      {/* ERROR */}
      {error && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">

          <p className="font-semibold text-rose-800">
            Report analysis failed
          </p>

          <p className="mt-1 text-sm leading-6 text-rose-700">
            {error}
          </p>

          <button
            type="button"
            onClick={analyze}
            disabled={loading || !file}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            <RotateCcw className="size-4" />
            Try again
          </button>

        </section>
      )}

      {/* RESULT */}
      {analysis && (
        <ReportResult
          analysis={analysis}
          fileName={file?.name}
          onNewReport={reset}
        />
      )}

    </div>
  );
}

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}