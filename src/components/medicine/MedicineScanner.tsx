
"use client";

import {
  Camera,
  CheckCircle2,
  RotateCcw,
  Save,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import { analyzeMedicineText } from "@/lib/geminiMedicine";
import { extractMedicineText } from "@/lib/ocr";

import {
  deleteMedicineReminder,
  deleteMedicineScan,
  saveMedicineReminder,
  saveMedicineScan,
  subscribeToMedicineScans,
  subscribeToReminders,
} from "@/services/medicineHistory";

import type {
  MedicineAnalysis,
  MedicineReminder,
  MedicineScan,
} from "@/types/medicine";

import { EmptyState } from "./EmptyState";
import { ImagePreview } from "./ImagePreview";
import { ScanButton } from "./ScanButton";
import { ScannerHistory } from "./ScannerHistory";
import { ScannerResult } from "./ScannerResult";
import { UploadCard } from "./UploadCard";

type Status = "idle" | "ocr" | "analysis";

const button =
  "inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50";

export function MedicineScanner() {
  const { user } = useAuth();

  const picker = useRef<HTMLInputElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);

  const [analysis, setAnalysis] =
    useState<MedicineAnalysis | null>(null);

  const [camera, setCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [scans, setScans] = useState<MedicineScan[]>([]);

  const [reminders, setReminders] =
    useState<MedicineReminder[]>([]);

  const [reminderTime, setReminderTime] =
    useState("08:00");

  const [frequency, setFrequency] =
    useState("Daily");

  // Load scan history from Firebase.
  useEffect(() => {
    if (!user) {
      setScans([]);
      return;
    }

    return subscribeToMedicineScans(
      user.uid,
      setScans
    );
  }, [user]);

  // Load medicine reminders from Firebase.
  useEffect(() => {
    if (!user) {
      setReminders([]);
      return;
    }

    return subscribeToReminders(
      user.uid,
      setReminders
    );
  }, [user]);

  // Stop the camera when the component unmounts.
  useEffect(() => {
    return () => {
      stream.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  // Select or replace an image.
  const choose = (next: File) => {
    if (!next.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setFile(next);
    setAnalysis(null);
    setStatus("idle");
    setProgress(0);
    setCameraError("");
  };

  // Stop the camera.
  const closeCamera = () => {
    stream.current
      ?.getTracks()
      .forEach((track) => track.stop());

    stream.current = null;
    setCamera(false);
  };

  // Open the device camera.
  const openCamera = async () => {
    setCameraError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is not supported by this browser."
        );
      }

      const next =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
        });

      stream.current = next;
      setCamera(true);

      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = next;

          video.current
            .play()
            .catch(() => undefined);
        }
      });
    } catch (error) {
      setCameraError(
        error instanceof Error &&
          error.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access and try again."
          : error instanceof Error
            ? error.message
            : "Unable to start the camera."
      );
    }
  };

  // Capture an image from the camera.
  const capture = () => {
    const element = video.current;

    if (!element) {
      toast.error("Camera is not ready.");
      return;
    }

    if (
      !element.videoWidth ||
      !element.videoHeight
    ) {
      toast.error(
        "Please wait for the camera to load."
      );
      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Unable to capture the image.");
      return;
    }

    context.drawImage(element, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error(
            "Unable to capture the image."
          );
          return;
        }

        const capturedFile = new File(
          [blob],
          `medicine-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        choose(capturedFile);
        closeCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  // OCR runs internally.
  // Only the structured Gemini result is displayed.
  const scan = async () => {
    if (!file || status !== "idle") {
      return;
    }

    setAnalysis(null);

    try {
      setStatus("ocr");
      setProgress(0);

      const extracted =
        await extractMedicineText(
          file,
          setProgress
        );

      if (!extracted?.trim()) {
        throw new Error(
          "Could not read the medicine label. Please upload a clearer image."
        );
      }

      setStatus("analysis");

      const result =
        await analyzeMedicineText(
          extracted
        );

      setAnalysis(result);
      setStatus("idle");

      // Keep the existing Firebase history API.
      // OCR text is not displayed in the UI.
      if (user) {
        try {
          await saveMedicineScan(
            user.uid,
            file,
            extracted,
            result
          );

          toast.success(
            "Medicine analysis saved to history."
          );
        } catch {
          toast.error(
            "Analysis is ready, but it could not be saved to history."
          );
        }
      }
    } catch (error) {
      setStatus("idle");

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to scan this medicine."
      );
    }
  };

  // Create a readable report from the structured result.
  const report = () => {
    if (!analysis) return "";

    const lines: string[] = [
      "MedAI Medicine Report",
      "",
      `Medicine: ${analysis.medicineName}`,
    ];

    if (analysis.genericName) {
      lines.push(
        `Generic name: ${analysis.genericName}`
      );
    }

    if (analysis.strength) {
      lines.push(
        `Strength: ${analysis.strength}`
      );
    }

    if (analysis.usedFor.length > 0) {
      lines.push(
        "",
        "Used for:",
        ...analysis.usedFor.map(
          (item) => `- ${item}`
        )
      );
    }

    const {
      adults,
      children,
      elderly,
    } = analysis.ageGuidance;

    if (adults || children || elderly) {
      lines.push(
        "",
        "Age guidance:"
      );

      if (adults) {
        lines.push(`Adults: ${adults}`);
      }

      if (children) {
        lines.push(
          `Children: ${children}`
        );
      }

      if (elderly) {
        lines.push(
          `Elderly: ${elderly}`
        );
      }
    }

    const {
      timing,
      frequency: medicineFrequency,
      food,
    } = analysis.howToTake;

    if (
      timing ||
      medicineFrequency ||
      food
    ) {
      lines.push(
        "",
        "How to take:"
      );

      if (timing) {
        lines.push(
          `Time: ${timing}`
        );
      }

      if (medicineFrequency) {
        lines.push(
          `Frequency: ${medicineFrequency}`
        );
      }

      if (food) {
        lines.push(
          `Food instructions: ${food}`
        );
      }
    }

    if (analysis.expiryDate) {
      lines.push(
        "",
        `Expiry date: ${analysis.expiryDate}`
      );
    }

    if (analysis.benefits.length > 0) {
      lines.push(
        "",
        "Benefits:",
        ...analysis.benefits.map(
          (item) => `- ${item}`
        )
      );
    }

    if (analysis.sideEffects.length > 0) {
      lines.push(
        "",
        "Common side effects:",
        ...analysis.sideEffects.map(
          (item) => `- ${item}`
        )
      );
    }

    if (analysis.warnings.length > 0) {
      lines.push(
        "",
        "Important warnings:",
        ...analysis.warnings.map(
          (item) => `- ${item}`
        )
      );
    }

    lines.push(
      "",
      `Safety guidance: ${analysis.safetyIndicator.status}`
    );

    if (analysis.safetyIndicator.reason) {
      lines.push(
        analysis.safetyIndicator.reason
      );
    }

    lines.push(
      "",
      `Identification confidence: ${analysis.confidence}%`,
      "",
      analysis.medicalDisclaimer
    );

    return lines.join("\n");
  };

  // Download the medicine report as a PDF.
  const download = async () => {
    if (!analysis) return;

    try {
      const { jsPDF } =
        await import("jspdf");

      const pdf = new jsPDF();

      pdf.setFontSize(18);
      pdf.text(
        "MedAI Medicine Report",
        20,
        20
      );

      pdf.setFontSize(11);

      // Use ASCII list markers for PDF compatibility.
      const content = report()
        .replace(
          /^MedAI Medicine Report\n\n/,
          ""
        );

      const lines =
        pdf.splitTextToSize(
          content,
          170
        );

      let y = 34;

      for (const line of lines) {
        if (y > 275) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(
          String(line),
          20,
          y
        );

        y += 6;
      }

      const filename =
        analysis.medicineName
          .replace(
            /[^a-zA-Z0-9-]+/g,
            "-"
          )
          .toLowerCase();

      pdf.save(
        `${filename || "medicine"}-report.pdf`
      );

      toast.success(
        "Medicine report downloaded."
      );
    } catch {
      toast.error(
        "Unable to download the report."
      );
    }
  };

  // Save a medicine reminder.
  const saveReminder = async () => {
    if (!user || !analysis) {
      toast.error(
        "Sign in to save a reminder."
      );
      return;
    }

    if (
      analysis.medicineName ===
      "Medicine not identified"
    ) {
      toast.error(
        "Identify the medicine before saving a reminder."
      );
      return;
    }

    try {
      await saveMedicineReminder(
        user.uid,
        {
          medicineName:
            analysis.medicineName,

          time:
            reminderTime,

          frequency,
        }
      );

      toast.success(
        "Medicine reminder saved."
      );
    } catch {
      toast.error(
        "Unable to save the reminder."
      );
    }
  };

  // Remove a reminder.
  const removeReminder = async (
    id: string
  ) => {
    if (!user) return;

    try {
      await deleteMedicineReminder(
        user.uid,
        id
      );

      toast.success(
        "Reminder removed."
      );
    } catch {
      toast.error(
        "Unable to remove the reminder."
      );
    }
  };

  // Remove a scan from history.
  const removeScan = async (
    id: string
  ) => {
    if (!user) return;

    try {
      await deleteMedicineScan(
        user.uid,
        id
      );

      toast.success(
        "Scan removed."
      );
    } catch {
      toast.error(
        "Unable to remove the scan."
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Hidden file picker for replacing images */}
      <input
        ref={picker}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(event) => {
          const selected =
            event.target.files?.[0];

          if (selected) {
            choose(selected);
          }

          event.target.value = "";
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

        {/* MAIN SCANNER */}
        <main className="space-y-5">

          {!file ? (
            <UploadCard
              onSelect={choose}
              onCamera={openCamera}
            />
          ) : (
            <>
              <ImagePreview
                key={`${file.name}-${file.lastModified}`}
                file={file}
                onReplace={() =>
                  picker.current?.click()
                }
                onRemove={() => {
                  setFile(null);
                  setAnalysis(null);
                  setStatus("idle");
                  setProgress(0);
                }}
              />

              {!analysis && (
                <ScanButton
                  disabled={
                    status !== "idle"
                  }
                  onClick={scan}
                />
              )}
            </>
          )}

          {/* SCANNING PROGRESS */}
          {status !== "idle" && (
            <section className="rounded-2xl border border-sky-100 bg-white/75 p-6 text-center shadow-sm">

              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sky-600 text-white">
                <RotateCcw className="size-5 animate-spin" />
              </span>

              <h2 className="mt-4 font-bold text-slate-950">
                {status === "ocr"
                  ? "Reading medicine label"
                  : "Understanding the medicine"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {status === "ocr"
                  ? `${progress}% complete`
                  : "Preparing simple medicine information for you."}
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-sky-100">

                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-cyan-500 transition-all"
                  style={{
                    width: `${
                      status === "ocr"
                        ? progress
                        : 100
                    }%`,
                  }}
                />

              </div>
            </section>
          )}

          {/* MEDICINE ANALYSIS */}
          {analysis && (
            <>
              <ScannerResult
                analysis={analysis}
                onDownload={download}
              />

              {/* MEDICINE REMINDER */}
              <section className="rounded-2xl border border-sky-100 bg-white/75 p-5 shadow-sm">

                <h2 className="font-bold text-slate-900">
                  Medicine reminder
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Set a reminder using the
                  schedule provided by your
                  doctor or pharmacist.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  <input
                    aria-label="Reminder time"
                    type="time"
                    value={reminderTime}
                    onChange={(event) =>
                      setReminderTime(
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
                  />

                  <select
                    aria-label="Reminder frequency"
                    value={frequency}
                    onChange={(event) =>
                      setFrequency(
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
                  >
                    <option value="Daily">
                      Daily
                    </option>

                    <option value="Twice daily">
                      Twice daily
                    </option>

                    <option value="Three times daily">
                      Three times daily
                    </option>

                    <option value="Weekly">
                      Weekly
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={saveReminder}
                    className={button}
                  >
                    <Save className="size-4" />
                    Save reminder
                  </button>

                </div>
              </section>
            </>
          )}

          {!file && <EmptyState />}

        </main>

        {/* SIDEBAR */}
        <aside className="space-y-4">

          {/* FIREBASE SCAN HISTORY */}
          <ScannerHistory
            scans={scans}
            onOpen={(selectedScan) => {
              setAnalysis(
                selectedScan.analysis
              );

              setFile(null);
              setStatus("idle");
              setProgress(0);
            }}
            onDelete={removeScan}
          />

          {/* SAVED REMINDERS */}
          {reminders.length > 0 && (
            <section className="rounded-2xl border border-sky-100 bg-white/75 p-5 shadow-sm">

              <h2 className="font-bold text-slate-900">
                Upcoming reminders
              </h2>

              <div className="mt-4 space-y-3">

                {reminders.map(
                  (reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-sky-100 bg-sky-50/40 p-3"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-900">
                          {reminder.medicineName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {reminder.time}
                          {" · "}
                          {reminder.frequency}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeReminder(
                            reminder.id
                          )
                        }
                        className="shrink-0 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>
            </section>
          )}

          <Tip />

        </aside>

      </div>

      {/* CAMERA MODAL */}
      {camera && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">

          <section className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">

            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="font-bold text-slate-950">
                  Capture medicine label
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep the medicine name
                  and expiry section inside
                  the frame.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close camera"
                onClick={closeCamera}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>

            </div>

            <video
              ref={video}
              muted
              playsInline
              className="mt-4 aspect-video w-full rounded-2xl bg-slate-900 object-cover"
            />

            <div className="mt-4 flex gap-3">

              <button
                type="button"
                onClick={capture}
                className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                <Camera className="mr-2 inline size-4" />
                Capture
              </button>

              <button
                type="button"
                onClick={closeCamera}
                className={button}
              >
                Cancel
              </button>

            </div>

          </section>

        </div>
      )}

      {/* CAMERA ERROR */}
      {cameraError && (
        <p
          role="alert"
          className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700"
        >
          {cameraError}
        </p>
      )}

    </div>
  );
}

function Tip() {
  return (
    <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5">

      <CheckCircle2 className="size-5 text-sky-600" />

      <h2 className="mt-3 font-bold text-slate-900">
        For a better scan
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Use a clear, well-lit photo showing
        the medicine name, strength and
        expiry section.
      </p>

    </section>
  );
}
