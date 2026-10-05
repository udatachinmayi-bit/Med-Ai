"use client";

import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Download,
  HeartPulse,
  Info,
  Mic,
  ShieldCheck,
  Utensils,
  Users,
} from "lucide-react";

import type { MedicineAnalysis } from "@/types/medicine";

type Props = {
  analysis: MedicineAnalysis;
  onDownload?: () => void;
  onSpeak?: () => void;
  onStop?: () => void;
};

export function ScannerResult({
  analysis,
  onDownload,
  onSpeak,
  onStop,
}: Props) {
  const safetyClasses =
    analysis.safetyIndicator.color === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : analysis.safetyIndicator.color === "yellow"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-red-200 bg-red-50 text-red-700";

  return (
    <section className="space-y-4">

      {/* Medicine header */}
      <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-sky-600 to-cyan-500 p-6 text-white">
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-white/80">
                Medicine identified
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {analysis.medicineName}
              </h2>

              {(analysis.genericName ||
                analysis.strength) && (
                <p className="mt-1 text-sm text-white/80">
                  {analysis.genericName}

                  {analysis.genericName &&
                    analysis.strength &&
                    " • "}

                  {analysis.strength}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white/15 p-3">
              <HeartPulse className="size-6" />
            </div>

          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">

          {/* Used for */}
          <InfoCard
            icon={<Info className="size-5" />}
            title="What is it used for?"
          >
            {analysis.usedFor.length > 0 ? (
              <ul className="space-y-1.5">
                {analysis.usedFor.map(
                  (item, index) => (
                    <li key={index}>
                      • {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
                This could not be determined
                from the label.
              </p>
            )}
          </InfoCard>

          {/* Age */}
          <InfoCard
            icon={<Users className="size-5" />}
            title="Who can take it?"
          >
            <div className="space-y-2">

              <AgeRow
                label="Adults"
                value={
                  analysis.ageGuidance.adults
                }
              />

              <AgeRow
                label="Children"
                value={
                  analysis.ageGuidance.children
                }
              />

              <AgeRow
                label="Elderly"
                value={
                  analysis.ageGuidance.elderly
                }
              />

              {!analysis.ageGuidance.adults &&
                !analysis.ageGuidance.children &&
                !analysis.ageGuidance.elderly && (
                  <p>
                    Age guidance could not be
                    determined. Follow your
                    prescription or ask a
                    pharmacist.
                  </p>
                )}

            </div>
          </InfoCard>

          {/* How to take */}
          <InfoCard
            icon={<Clock3 className="size-5" />}
            title="When should I take it?"
          >
            <div className="space-y-2">

              {analysis.howToTake.timing && (
                <p>
                  <b>Time:</b>{" "}
                  {analysis.howToTake.timing}
                </p>
              )}

              {analysis.howToTake.frequency && (
                <p>
                  <b>Frequency:</b>{" "}
                  {analysis.howToTake.frequency}
                </p>
              )}

              {analysis.howToTake.food && (
                <p className="flex gap-2">
                  <Utensils className="mt-0.5 size-4 shrink-0" />

                  <span>
                    {analysis.howToTake.food}
                  </span>
                </p>
              )}

              {!analysis.howToTake.timing &&
                !analysis.howToTake.frequency &&
                !analysis.howToTake.food && (
                  <p>
                    Timing could not be determined
                    from the label. Follow your
                    prescription or medicine
                    package.
                  </p>
                )}

            </div>
          </InfoCard>

          {/* Expiry */}
          <InfoCard
            icon={
              <CalendarDays className="size-5" />
            }
            title="Expiry date"
          >
            <p className="font-semibold text-slate-900">
              {analysis.expiryDate ||
                "Expiry date could not be detected."}
            </p>
          </InfoCard>

        </div>
      </div>

      {/* Benefits */}
      <InfoCard
        icon={
          <ShieldCheck className="size-5" />
        }
        title="Benefits"
      >
        {analysis.benefits.length > 0 ? (
          <ul className="space-y-1.5">
            {analysis.benefits.map(
              (item, index) => (
                <li key={index}>
                  • {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>
            No specific benefits could be
            determined from the label.
          </p>
        )}
      </InfoCard>

      {/* Side effects */}
      <InfoCard
        icon={
          <AlertTriangle className="size-5" />
        }
        title="Common side effects"
      >
        {analysis.sideEffects.length > 0 ? (
          <ul className="space-y-1.5">
            {analysis.sideEffects.map(
              (item, index) => (
                <li key={index}>
                  • {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>
            No side effects were identified
            from the available information.
          </p>
        )}
      </InfoCard>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="size-5" />
            Important warnings
          </div>

          <ul className="mt-3 space-y-2 text-sm text-amber-900">
            {analysis.warnings.map(
              (item, index) => (
                <li key={index}>
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* Safety */}
      <div
        className={`rounded-2xl border p-5 ${safetyClasses}`}
      >
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="size-5" />
          {analysis.safetyIndicator.status}
        </div>

        {analysis.safetyIndicator.reason && (
          <p className="mt-2 text-sm">
            {analysis.safetyIndicator.reason}
          </p>
        )}
      </div>

      {/* Confidence */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Identification confidence
          </span>

          <span className="font-bold text-sky-700">
            {analysis.confidence}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-600 transition-all"
            style={{
              width: `${analysis.confidence}%`,
            }}
          />
        </div>

      </div>

      {/* Actions */}
      {(onDownload ||
        onSpeak ||
        onStop) && (
        <div className="flex flex-wrap gap-2">

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-50"
            >
              <Download className="size-4" />
              Download
            </button>
          )}

          {onSpeak && (
            <button
              type="button"
              onClick={onSpeak}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              <Mic className="size-4" />
              Read aloud
            </button>
          )}

          {onStop && (
            <button
              type="button"
              onClick={onStop}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Stop
            </button>
          )}

        </div>
      )}

      {/* Disclaimer */}
      <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        {analysis.medicalDisclaimer}
      </p>

    </section>
  );
}

function AgeRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) return null;

  return (
    <p>
      <b>{label}:</b> {value}
    </p>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

      <div className="flex items-center gap-2 text-sm font-bold text-sky-700">
        {icon}
        {title}
      </div>

      <div className="mt-3 text-sm leading-6 text-slate-600">
        {children}
      </div>

    </div>
  );
}