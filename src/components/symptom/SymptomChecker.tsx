"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  HeartPulse,
  Loader2,
  RotateCcw,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  analyzeSymptoms,
} from "@/lib/geminiSymptoms";

import type {
  SymptomAnalysis,
  SymptomInput,
  SymptomSeverity,
} from "@/types/symptom";

const QUICK_SYMPTOMS = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Runny nose",
  "Fatigue",
  "Nausea",
  "Vomiting",
  "Stomach pain",
  "Chest pain",
  "Back pain",
  "Dizziness",
  "Shortness of breath",
  "Body pain",
  "Diarrhea",
  "Abdominal pain",
];

export function SymptomChecker() {
  const [
    selectedSymptoms,
    setSelectedSymptoms,
  ] = useState<string[]>([]);

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    duration,
    setDuration,
  ] = useState("");

  const [
    severity,
    setSeverity,
  ] =
    useState<SymptomSeverity>(
      "mild"
    );

  const [
    age,
    setAge,
  ] = useState("");

  const [
    gender,
    setGender,
  ] = useState("");

  const [
    existingConditions,
    setExistingConditions,
  ] = useState("");

  const [
    currentMedicines,
    setCurrentMedicines,
  ] = useState("");

  const [
    analysis,
    setAnalysis,
  ] =
    useState<SymptomAnalysis | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const toggleSymptom = (
    symptom: string
  ) => {
    setSelectedSymptoms(
      (current) =>
        current.includes(symptom)
          ? current.filter(
              (item) =>
                item !== symptom
            )
          : [
              ...current,
              symptom,
            ]
    );
  };

  const submit = async () => {
    if (
      selectedSymptoms.length ===
        0 &&
      !description.trim()
    ) {
      toast.error(
        "Please enter at least one symptom."
      );

      return;
    }

    setLoading(true);

    try {
      const input: SymptomInput = {
        symptoms:
          selectedSymptoms,

        description:
          description.trim(),

        duration:
          duration.trim(),

        severity,

        age:
          age.trim(),

        gender,

        existingConditions:
          existingConditions.trim(),

        currentMedicines:
          currentMedicines.trim(),
      };

      const result =
        await analyzeSymptoms(
          input
        );

      setAnalysis(result);

      toast.success(
        "Symptom analysis completed."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to analyze symptoms."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setDescription("");
    setDuration("");
    setSeverity("mild");
    setAge("");
    setGender("");
    setExistingConditions("");
    setCurrentMedicines("");
    setAnalysis(null);
    setLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-600 to-cyan-500 p-6 text-white shadow-lg">

        <div className="flex items-start gap-4">

          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <Stethoscope className="size-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white/75">
              MedAI Health Guidance
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Symptom Checker
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
              Describe what you are experiencing
              and MedAI will organize your symptoms,
              highlight warning signs and provide
              general next-step guidance.
            </p>
          </div>

        </div>

      </section>

      {!analysis && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          {/* MAIN FORM */}
          <main className="space-y-5">

            {/* SYMPTOMS */}
            <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <HeartPulse className="size-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    What are you experiencing?
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select all symptoms that apply.
                  </p>
                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                {QUICK_SYMPTOMS.map(
                  (symptom) => {
                    const active =
                      selectedSymptoms.includes(
                        symptom
                      );

                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() =>
                          toggleSymptom(
                            symptom
                          )
                        }
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          active
                            ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                            : "border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50",
                        ].join(" ")}
                      >
                        {symptom}
                      </button>
                    );
                  }
                )}

              </div>

              {selectedSymptoms.length >
                0 && (
                <div className="mt-5 rounded-2xl bg-sky-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                    Selected symptoms
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {selectedSymptoms.join(
                      ", "
                    )}
                  </p>

                </div>
              )}

            </section>

            {/* DESCRIPTION */}
            <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

              <label className="block">

                <span className="font-bold text-slate-950">
                  Describe your symptoms
                </span>

                <span className="mt-1 block text-sm text-slate-500">
                  Include anything important that
                  the symptom buttons did not capture.
                </span>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Example: I have had a headache since yesterday. It becomes worse when I look at bright light..."
                  rows={5}
                  className="mt-4 w-full resize-none rounded-2xl border border-sky-100 bg-sky-50/30 p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />

              </label>

            </section>

            {/* DURATION + SEVERITY */}
            <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

              <div className="grid gap-5 md:grid-cols-2">

                <label>
                  <span className="block font-bold text-slate-950">
                    How long have you had it?
                  </span>

                  <input
                    value={duration}
                    onChange={(event) =>
                      setDuration(
                        event.target.value
                      )
                    }
                    placeholder="Example: 2 days"
                    className="mt-3 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <div>
                  <span className="block font-bold text-slate-950">
                    Severity
                  </span>

                  <div className="mt-3 grid grid-cols-3 gap-2">

                    {(
                      [
                        "mild",
                        "moderate",
                        "severe",
                      ] as SymptomSeverity[]
                    ).map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setSeverity(
                              value
                            )
                          }
                          className={[
                            "rounded-xl border px-3 py-3 text-sm font-semibold capitalize transition",
                            severity ===
                            value
                              ? "border-sky-600 bg-sky-600 text-white"
                              : "border-sky-100 bg-white text-slate-600 hover:bg-sky-50",
                          ].join(" ")}
                        >
                          {value}
                        </button>
                      )
                    )}

                  </div>
                </div>

              </div>

            </section>

            {/* PERSONAL CONTEXT */}
            <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <CircleAlert className="size-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Health context
                  </h2>

                  <p className="text-sm text-slate-500">
                    Optional information that can
                    make the guidance more relevant.
                  </p>
                </div>

              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <label>
                  <span className="block text-sm font-bold text-slate-800">
                    Age
                  </span>

                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={age}
                    onChange={(event) =>
                      setAge(
                        event.target.value
                      )
                    }
                    placeholder="Example: 21"
                    className="mt-2 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <label>
                  <span className="block text-sm font-bold text-slate-800">
                    Gender
                  </span>

                  <select
                    value={gender}
                    onChange={(event) =>
                      setGender(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  >
                    <option value="">
                      Prefer not to say
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </label>

                <label className="md:col-span-2">

                  <span className="block text-sm font-bold text-slate-800">
                    Existing medical conditions
                  </span>

                  <textarea
                    value={
                      existingConditions
                    }
                    onChange={(event) =>
                      setExistingConditions(
                        event.target.value
                      )
                    }
                    placeholder="Example: asthma, diabetes, high blood pressure..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-sky-100 bg-sky-50/30 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />

                </label>

                <label className="md:col-span-2">

                  <span className="block text-sm font-bold text-slate-800">
                    Current medicines
                  </span>

                  <textarea
                    value={
                      currentMedicines
                    }
                    onChange={(event) =>
                      setCurrentMedicines(
                        event.target.value
                      )
                    }
                    placeholder="Optional. List medicines you currently take."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-sky-100 bg-sky-50/30 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />

                </label>

              </div>

            </section>

            {/* ANALYZE BUTTON */}
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-600 px-6 py-4 font-bold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Analyzing symptoms...
                </>
              ) : (
                <>
                  Analyze symptoms
                  <ArrowRight className="size-5" />
                </>
              )}

            </button>

          </main>

          {/* SIDE PANEL */}
          <aside className="space-y-5">

            <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

              <div className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                <ShieldAlert className="size-6" />
              </div>

              <h3 className="mt-4 font-bold text-slate-950">
                When to seek emergency help
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Do not wait for the symptom checker
                if you have severe or rapidly worsening
                symptoms.
              </p>

              <div className="mt-5 space-y-3">

                {[
                  "Severe difficulty breathing",
                  "Severe chest pain",
                  "Loss of consciousness",
                  "Sudden severe weakness",
                  "Severe confusion",
                ].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-xl bg-rose-50 p-3"
                    >

                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" />

                      <p className="text-xs font-medium leading-5 text-rose-800">
                        {item}
                      </p>

                    </div>
                  )
                )}

              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                If symptoms are severe or life-threatening,
                contact local emergency medical services
                immediately.
              </p>

            </section>

            <section className="rounded-3xl border border-sky-100 bg-sky-50/50 p-6">

              <Clock3 className="size-6 text-sky-600" />

              <h3 className="mt-3 font-bold text-slate-950">
                Better information = better guidance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Include when the symptoms started,
                how severe they are, what makes them
                better or worse, and any existing
                conditions.
              </p>

            </section>

          </aside>

        </div>
      )}

      {/* RESULT */}
      {analysis && (
        <SymptomResult
          analysis={analysis}
          onReset={reset}
        />
      )}

    </div>
  );
}

function SymptomResult({
  analysis,
  onReset,
}: {
  analysis: SymptomAnalysis;
  onReset: () => void;
}) {
  const urgencyClass =
    analysis.urgency ===
    "emergency"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : analysis.urgency ===
          "urgent"
        ? "border-orange-200 bg-orange-50 text-orange-800"
        : analysis.urgency ===
            "soon"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <section className="space-y-5">

      {/* SUMMARY */}
      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

        <div className="flex flex-wrap items-start justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 text-sm font-bold text-sky-600">
              <CheckCircle2 className="size-4" />
              Symptom analysis complete
            </div>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              What your symptoms may indicate
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              {analysis.summary}
            </p>

          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-sky-50"
          >
            <RotateCcw className="size-4" />
            Check again
          </button>

        </div>

      </section>

      {/* URGENCY */}
      <section
        className={`rounded-3xl border p-6 ${urgencyClass}`}
      >

        <div className="flex items-start gap-4">

          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/70">

            {analysis.urgency ===
            "emergency" ? (
              <ShieldAlert className="size-6" />
            ) : (
              <CircleAlert className="size-6" />
            )}

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider">
              Recommended attention level
            </p>

            <h3 className="mt-1 text-2xl font-bold capitalize">
              {analysis.urgency}
            </h3>

            <p className="mt-2 text-sm leading-6">
              {analysis.urgencyReason}
            </p>

          </div>

        </div>

        {analysis.urgency ===
          "emergency" && (
          <div className="mt-5 rounded-2xl bg-white/70 p-4">

            <p className="font-bold">
              Please seek emergency medical
              attention now.
            </p>

            <p className="mt-1 text-sm leading-6">
              Do not rely on this symptom checker
              for an emergency.
            </p>

          </div>
        )}

      </section>

      {/* POSSIBLE CAUSES */}
      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

        <SectionTitle
          icon={
            <HeartPulse className="size-5" />
          }
          title="Possible explanations"
        />

        <p className="mt-2 text-sm text-slate-500">
          These are possibilities, not diagnoses.
        </p>

        <div className="mt-5 space-y-4">

          {analysis.possibleCauses.map(
            (cause, index) => (
              <div
                key={`${cause.name}-${index}`}
                className="rounded-2xl border border-sky-50 bg-sky-50/30 p-5"
              >

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <h3 className="font-bold text-slate-900">
                    {cause.name}
                  </h3>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-sky-700 shadow-sm">
                    {cause.likelihood.replace(
                      "-",
                      " "
                    )}
                  </span>

                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {cause.explanation}
                </p>

              </div>
            )
          )}

        </div>

      </section>

      {/* ACTIONS */}
      <ListSection
        title="Recommended next steps"
        icon={
          <ArrowRight className="size-5" />
        }
        items={
          analysis.recommendedActions
        }
        empty="No specific next steps were generated."
      />

      {/* SELF CARE */}
      <ListSection
        title="General self-care"
        icon={
          <HeartPulse className="size-5" />
        }
        items={analysis.selfCare}
        empty="No general self-care guidance was generated."
      />

      {/* MONITOR */}
      <ListSection
        title="What to monitor"
        icon={
          <Clock3 className="size-5" />
        }
        items={
          analysis.thingsToMonitor
        }
        empty="No specific monitoring points were generated."
      />

      {/* EMERGENCY SIGNS */}
      <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">

        <SectionTitle
          icon={
            <ShieldAlert className="size-5 text-rose-600" />
          }
          title="Warning signs"
        />

        <div className="mt-5 space-y-3">

          {analysis.emergencySigns.length >
          0 ? (
            analysis.emergencySigns.map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
                >

                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-600" />

                  <p className="text-sm leading-6 text-rose-900">
                    {item}
                  </p>

                </div>
              )
            )
          ) : (
            <p className="text-sm text-slate-500">
              No specific warning signs were
              identified from the information
              provided.
            </p>
          )}

        </div>

      </section>

      {/* QUESTIONS */}
      <ListSection
        title="Questions to ask your doctor"
        icon={
          <Stethoscope className="size-5" />
        }
        items={
          analysis.questionsForDoctor
        }
        empty="No specific questions were generated."
      />

      {/* CONFIDENCE */}
      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm font-bold text-slate-900">
              Information confidence
            </p>

            <p className="mt-1 text-xs text-slate-500">
              This measures how much useful
              information was provided, not
              medical certainty.
            </p>
          </div>

          <p className="text-2xl font-bold text-sky-600">
            {analysis.confidence}%
          </p>

        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-sky-500"
            style={{
              width: `${analysis.confidence}%`,
            }}
          />

        </div>

      </section>

      {/* DISCLAIMER */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

        <div className="flex items-start gap-3">

          <CircleAlert className="mt-0.5 size-5 shrink-0 text-slate-500" />

          <div>

            <h3 className="font-bold text-slate-900">
              Important medical notice
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
