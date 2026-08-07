import type { MedicineAnalysis } from "@/types/medicine";

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [];
const object = (value: unknown) => value && typeof value === "object" ? value as Record<string, unknown> : {};

export async function analyzeMedicineText(extractedText: string): Promise<MedicineAnalysis> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("You appear to be offline. Reconnect to analyse the medicine label.");
  }
  const response = await fetch("/api/medicine-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ extractedText }),
  });
  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok || !body || typeof body !== "object" || !("analysis" in body)) {
    const message = body && typeof body === "object" && "error" in body && typeof body.error === "string" ? body.error : "Medicine analysis is unavailable right now.";
    throw new Error(message);
  }
  return validateAnalysis(body.analysis);
}

export function validateAnalysis(value: unknown): MedicineAnalysis {
  if (!value || typeof value !== "object") throw new Error("The medicine analysis had an unexpected format.");
  const source = object(value); const dosage = object(source.dosage); const ageRange = object(source.ageRange); const sideEffects = object(source.sideEffects); const warnings = object(source.warnings); const foodInteractions = object(source.foodInteractions); const storage = object(source.storage); const overdose = object(source.overdose); const safety = object(source.safetyIndicator);
  const status = ["Safe", "Use Carefully", "Consult Doctor"].includes(text(safety.status)) ? text(safety.status) as MedicineAnalysis["safetyIndicator"]["status"] : "Consult Doctor";
  const color = status === "Safe" ? "green" : status === "Use Carefully" ? "yellow" : "red";
  const analysis: MedicineAnalysis = { medicineName: text(source.medicineName), genericName: text(source.genericName), brand: text(source.brand), category: text(source.category), prescriptionType: text(source.prescriptionType), uses: strings(source.uses), dosage: { adult: text(dosage.adult), children: text(dosage.children), elderly: text(dosage.elderly), maximumDailyDose: text(dosage.maximumDailyDose) }, ageRange: { recommended: strings(ageRange.recommended), notRecommended: strings(ageRange.notRecommended) }, sideEffects: { common: strings(sideEffects.common), rare: strings(sideEffects.rare) }, warnings: { conditions: strings(warnings.conditions), pregnancy: text(warnings.pregnancy), breastfeeding: text(warnings.breastfeeding) }, drugInteractions: strings(source.drugInteractions), foodInteractions: { avoid: strings(foodInteractions.avoid), recommended: strings(foodInteractions.recommended) }, storage: { temperature: text(storage.temperature), keepAwayFrom: strings(storage.keepAwayFrom) }, advantages: strings(source.advantages), disadvantages: strings(source.disadvantages), precautions: strings(source.precautions), missedDose: text(source.missedDose), overdose: { symptoms: strings(overdose.symptoms), emergency: text(overdose.emergency) }, alternatives: strings(source.alternatives), summary: text(source.summary), safetyIndicator: { status, color, reason: text(safety.reason) }, confidence: Math.max(0, Math.min(100, Number.isFinite(source.confidence) ? Number(source.confidence) : 0)), medicalDisclaimer: text(source.medicalDisclaimer) || "AI-generated information does not replace professional medical advice." };
  if (!analysis.medicineName) throw new Error("We could not identify a medicine name from the label.");
  return analysis;
}
