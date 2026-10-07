"use client";

import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  CircleAlert,
  Download,
  FileText,
  HeartPulse,
  Info,
  RotateCcw,
  ShieldAlert,
  UserRound,
} from "lucide-react";

import type {
  ReportAnalysis,
  ReportTestResult,
} from "@/types/report";

type Props = {
  analysis: ReportAnalysis;
  fileName?: string;
  onNewReport: () => void;
};

export function ReportResult({
  analysis,
  fileName,
  onNewReport,
}: Props) {
  const downloadReport =
    async () => {
      try {
        const { jsPDF } =
          await import("jspdf");

        const pdf = new jsPDF();

        let y = 20;

        pdf.setFontSize(20);
        pdf.text(
          "MedAI Medical Report Analysis",
          20,
          y
        );

        y += 12;

        pdf.setFontSize(10);
        pdf.text(
          `Source: ${fileName || "Medical report"}`,
          20,
          y
        );

        y += 12;

        const sections = [
          [
            "Report type",
            analysis.reportType,
          ],

          [
            "Patient",
            analysis.patient.name,
          ],

          [
            "Age",
            analysis.patient.age,
          ],

          [
            "Gender",
            analysis.patient.gender,
          ],

          [
            "Report date",
            analysis.patient.reportDate,
          ],

          [
            "Summary",
            analysis.summary,
          ],

          [
            "Urgency",
            `${analysis.urgency} - ${analysis.urgencyReason}`,
          ],

          [
            "Health status indicator",
            `${analysis.healthScore}/100`,
          ],

          [
            "Confidence",
            `${analysis.confidence}%`,
          ],
        ];

        for (const [
          title,
          value,
        ] of sections) {
          y = writePdfSection(
            pdf,
            title,
            value,
            y
          );
        }

        y = writePdfList(
          pdf,
          "Key findings",
          analysis.keyFindings,
          y
        );

        y = writePdfResults(
          pdf,
          "Abnormal results",
          analysis.abnormalResults,
          y
        );

        y = writePdfResults(
          pdf,
          "Normal results",
          analysis.normalResults,
          y
        );

        y = writePdfList(
          pdf,
          "Possible interpretations",
          analysis.possibleInterpretations,
          y
        );

        y = writePdfList(
          pdf,
          "Recommendations",
          analysis.recommendations,
          y
        );

        y = writePdfList(
          pdf,
          "Questions for doctor",
          analysis.questionsForDoctor,
          y
        );

        writePdfSection(
          pdf,
          "Disclaimer",
          analysis.disclaimer,
          y
        );

        pdf.save(
          "medai-report-analysis.pdf"
        );
      } catch {
        // Keep download failures silent here.
        // The user can try again.
      }
    };

  const urgencyClass =
    analysis.urgency ===
    "urgent"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : analysis.urgency ===
          "attention"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <section className="space-y-5">

      {/* TOP RESULT */}
      <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

        <div className="flex flex-wrap items-start justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 text-sm font-bold text-sky-600">
              <FileText className="size-4" />
              Report analysis complete
            </div>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {analysis.reportType}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {analysis.summary}
            </p>

          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-700"
            >
              <Download className="size-4" />
              Download
            </button>

            <button
              type="button"
              onClick={onNewReport}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-sky-50"
            >
              <RotateCcw className="size-4" />
              New report
            </button>

          </div>

        </div>

      </div>

      {/* PATIENT INFORMATION */}
      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

        <SectionTitle
          icon={
            <UserRound className="size-5" />
          }
          title="Patient information"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <MiniCard
            label="Name"
            value={
              analysis.patient.name
            }
          />

          <MiniCard
            label="Age"
            value={
              analysis.patient.age
            }
          />

          <MiniCard
            label="Gender"
            value={
              analysis.patient.gender
            }
          />

          <MiniCard
            label="Report date"
            value={
              analysis.patient.reportDate
            }
          />

          <MiniCard
            label="Laboratory"
            value={
              analysis.patient.labName
            }
          />

        </div>

      </section>

      {/* STATUS */}
      <div className="grid gap-5 lg:grid-cols-3">

        <section
          className={`rounded-3xl border p-6 ${urgencyClass}`}
        >

          <div className="flex items-center gap-3">

            {analysis.urgency ===
            "urgent" ? (
              <ShieldAlert className="size-6" />
            ) : analysis.urgency ===
              "attention" ? (
              <AlertTriangle className="size-6" />
            ) : (
              <CheckCircle2 className="size-6" />
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Attention level
              </p>

              <p className="mt-1 text-lg font-bold capitalize">
                {analysis.urgency}
              </p>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6">
            {analysis.urgencyReason}
          </p>

        </section>

        <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <HeartPulse className="size-6 text-sky-600" />

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Report status
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950">
                {analysis.healthScore}
                <span className="text-base text-slate-400">
                  /100
                </span>
              </p>
            </div>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-sky-500"
              style={{
                width: `${analysis.healthScore}%`,
              }}
            />

          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            This is a report-status indicator,
            not a medical diagnosis or clinical
            health score.
          </p>

        </section>

        <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <CircleAlert className="size-6 text-sky-600" />

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Analysis confidence
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950">
                {analysis.confidence}%
              </p>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Confidence reflects how clearly
            the uploaded report could be
            interpreted. It does not indicate
            medical certainty.
          </p>

        </section>

      </div>

      {/* KEY FINDINGS */}
      <ListSection
        title="Key findings"
        icon={
          <Info className="size-5" />
        }
        items={analysis.keyFindings}
        empty="No specific key findings were identified."
      />

      {/* ABNORMAL RESULTS */}
      <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">

        <SectionTitle
          icon={
            <AlertTriangle className="size-5 text-amber-600" />
          }
          title="Abnormal results"
        />

        {analysis.abnormalResults
          .length > 0 ? (
          <div className="mt-5 space-y-3">

            {analysis.abnormalResults.map(
              (result, index) => (
                <ResultCard
                  key={`${result.name}-${index}`}
                  result={result}
                  abnormal
                />
              )
            )}

          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No clearly abnormal results were
            identified.
          </p>
        )}

      </section>

      {/* NORMAL RESULTS */}
      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

        <SectionTitle
          icon={
            <CheckCircle2 className="size-5 text-emerald-600" />
          }
          title="Normal results"
        />

        {analysis.normalResults
          .length > 0 ? (
          <div className="mt-5 space-y-3">

            {analysis.normalResults.map(
              (result, index) => (
                <ResultCard
                  key={`${result.name}-${index}`}
                  result={result}
                />
              )
            )}

          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No normal results were identified
            from the available information.
          </p>
        )}

      </section>

      {/* INTERPRETATION */}
      <ListSection
        title="Possible interpretations"
        icon={
          <Info className="size-5" />
        }
        items={
          analysis.possibleInterpretations
        }
        empty="No interpretation could be safely provided from the available information."
      />

      {/* RECOMMENDATIONS */}
      <ListSection
        title="What to discuss with your doctor"
        icon={
          <HeartPulse className="size-5" />
        }
        items={
          analysis.recommendations
        }
        empty="No specific discussion points were identified."
      />

      {/* QUESTIONS */}
      <ListSection
        title="Questions you can ask your doctor"
        icon={
          <FileText className="size-5" />
        }
        items={
          analysis.questionsForDoctor
        }
        empty="No specific questions were generated."
      />

      {/* DISCLAIMER */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

        <div className="flex items-start gap-3">

          <Info className="mt-0.5 size-5 shrink-0 text-slate-500" />

          <div>

            <h3 className="font-bold text-slate-900">
              Important
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {analysis.disclaimer}
            </p>

          </div>

        </div>

      </section>

    </section>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
        {icon}
      </span>

      <h3 className="text-lg font-bold text-slate-950">
        {title}
      </h3>

    </div>
  );
}

function MiniCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-50 bg-sky-50/40 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value || "Not provided"}
      </p>

    </div>
  );
}

function ResultCard({
  result,
  abnormal = false,
}: {
  result: ReportTestResult;
  abnormal?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        abnormal
          ? "border-amber-100 bg-amber-50/40"
          : "border-emerald-100 bg-emerald-50/30",
      ].join(" ")}
    >

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="font-bold text-slate-900">
            {result.name ||
              "Unnamed test"}
          </p>

          {result.explanation && (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {result.explanation}
            </p>
          )}

        </div>

        <div className="text-right">

          <p className="font-bold text-slate-950">
            {result.value || "—"}
            {result.unit
              ? ` ${result.unit}`
              : ""}
          </p>

          {result.status !==
            "unknown" && (
            <span className="mt-1 inline-block text-xs font-semibold capitalize text-slate-500">
              {result.status}
            </span>
          )}

        </div>

      </div>

      {result.referenceRange && (
        <div className="mt-3 border-t border-slate-200/70 pt-3 text-xs text-slate-500">
          Reference range:{" "}
          <span className="font-semibold">
            {result.referenceRange}
          </span>
        </div>
      )}

    </div>
  );
}

function ListSection({
  title,
  icon,
  items,
  empty,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  empty: string;
}) {
  return (
    <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

      <SectionTitle
        icon={icon}
        title={title}
      />

      {items.length > 0 ? (
        <div className="mt-5 space-y-3">

          {items.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex gap-3 rounded-2xl border border-sky-50 bg-sky-50/30 p-4"
              >

                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sky-600" />

                <p className="text-sm leading-6 text-slate-700">
                  {item}
                </p>

              </div>
            )
          )}

        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          {empty}
        </p>
      )}

    </section>
  );
}

function writePdfSection(
  pdf: any,
  title: string,
  value: string,
  y: number
) {
  if (y > 265) {
    pdf.addPage();
    y = 20;
  }

  pdf.setFontSize(12);
  pdf.text(title, 20, y);

  y += 7;

  pdf.setFontSize(10);

  const lines =
    pdf.splitTextToSize(
      value || "Not provided",
      170
    );

  pdf.text(lines, 20, y);

  return (
    y +
    lines.length * 5 +
    8
  );
}

function writePdfList(
  pdf: any,
  title: string,
  items: string[],
  y: number
) {
  if (y > 250) {
    pdf.addPage();
    y = 20;
  }

  pdf.setFontSize(12);
  pdf.text(title, 20, y);

  y += 7;

  pdf.setFontSize(10);

  if (!items.length) {
    pdf.text(
      "None identified.",
      20,
      y
    );

    return y + 12;
  }

  for (const item of items) {
    const lines =
      pdf.splitTextToSize(
        `- ${item}`,
        170
      );

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(
      lines,
      20,
      y
    );

    y +=
      lines.length * 5 +
      3;
  }

  return y + 5;
}

function writePdfResults(
  pdf: any,
  title: string,
  results: ReportTestResult[],
  y: number
) {
  if (y > 250) {
    pdf.addPage();
    y = 20;
  }

  pdf.setFontSize(12);
  pdf.text(title, 20, y);

  y += 7;

  pdf.setFontSize(10);

  if (!results.length) {
    pdf.text(
      "None identified.",
      20,
      y
    );

    return y + 12;
  }

  for (const result of results) {
    const text =
      `${result.name}: ${result.value}` +
      `${result.unit ? ` ${result.unit}` : ""}` +
      `${result.referenceRange ? ` | Reference: ${result.referenceRange}` : ""}`;

    const lines =
      pdf.splitTextToSize(
        `- ${text}`,
        170
      );

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(
      lines,
      20,
      y
    );

    y +=
      lines.length * 5 +
      3;
  }

  return y + 5;
}