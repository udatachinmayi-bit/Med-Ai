import type { MedicineAnalysis } from "@/types/medicine";

export async function analyzeMedicineText(
  extractedText: string
): Promise<MedicineAnalysis> {
  const cleanText = extractedText
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanText) {
    throw new Error(
      "No medicine information could be read from the image."
    );
  }

  const response = await fetch(
    "/api/medicine-analysis",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extractedText: cleanText,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : "Unable to analyse the medicine."
    );
  }

  if (!data?.analysis) {
    throw new Error(
      "Medicine analysis was not returned."
    );
  }

  return validateAnalysis(data.analysis);
}

export function validateAnalysis(
  value: unknown
): MedicineAnalysis {
  const data =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const ageGuidance =
    data.ageGuidance &&
    typeof data.ageGuidance === "object"
      ? (data.ageGuidance as Record<string, unknown>)
      : {};

  const howToTake =
    data.howToTake &&
    typeof data.howToTake === "object"
      ? (data.howToTake as Record<string, unknown>)
      : {};

  const safetyIndicator =
    data.safetyIndicator &&
    typeof data.safetyIndicator === "object"
      ? (data.safetyIndicator as Record<string, unknown>)
      : {};

  const safeString = (value: unknown): string =>
    typeof value === "string"
      ? value.trim()
      : "";

  const stringArray = (
    value: unknown
  ): string[] => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        (item): item is string =>
          typeof item === "string"
      )
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  };

  const status =
    safetyIndicator.status ===
    "Consult Doctor"
      ? "Consult Doctor"
      : safetyIndicator.status ===
          "Use Carefully"
        ? "Use Carefully"
        : "Safe when used as directed";

  const color =
    safetyIndicator.color === "red"
      ? "red"
      : safetyIndicator.color === "yellow"
        ? "yellow"
        : "green";

  let confidence = 0;

  if (
    typeof data.confidence === "number" &&
    Number.isFinite(data.confidence)
  ) {
    confidence = Math.round(
      Math.max(
        0,
        Math.min(100, data.confidence)
      )
    );
  }

  return {
    medicineName:
      safeString(data.medicineName) ||
      "Medicine not identified",

    genericName:
      safeString(data.genericName),

    strength:
      safeString(data.strength),

    usedFor:
      stringArray(data.usedFor),

    ageGuidance: {
      adults:
        safeString(ageGuidance.adults),

      children:
        safeString(ageGuidance.children),

      elderly:
        safeString(ageGuidance.elderly),
    },

    howToTake: {
      timing:
        safeString(howToTake.timing),

      food:
        safeString(howToTake.food),

      frequency:
        safeString(howToTake.frequency),
    },

    expiryDate:
      safeString(data.expiryDate),

    sideEffects:
      stringArray(data.sideEffects),

    warnings:
      stringArray(data.warnings),

    benefits:
      stringArray(data.benefits),

    safetyIndicator: {
      status,

      color,

      reason:
        safeString(
          safetyIndicator.reason
        ),
    },

    confidence,

    medicalDisclaimer:
      safeString(
        data.medicalDisclaimer
      ) ||
      "This information is AI-generated and does not replace advice from a doctor or pharmacist.",
  };
}
