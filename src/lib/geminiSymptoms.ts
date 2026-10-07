import type {
  PossibleCause,
  SymptomAnalysis,
  SymptomInput,
} from "@/types/symptom";

function cleanString(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function cleanArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : ""
    )
    .filter(Boolean);
}

function cleanPossibleCauses(
  value: unknown
): PossibleCause[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const data =
      item &&
      typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    const rawLikelihood =
      cleanString(
        data.likelihood
      ).toLowerCase();

    const likelihood =
      rawLikelihood === "common"
        ? "common"
        : rawLikelihood ===
            "less-likely"
          ? "less-likely"
          : "possible";

    return {
      name:
        cleanString(
          data.name
        ) ||
        "Possible explanation",

      likelihood,

      explanation:
        cleanString(
          data.explanation
        ) ||
        "More information is needed to interpret this possibility.",
    };
  });
}

export function validateSymptomAnalysis(
  input: unknown
): SymptomAnalysis {
  const data =
    input &&
    typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  const urgencyValues = [
    "routine",
    "soon",
    "urgent",
    "emergency",
  ] as const;

  const rawUrgency =
    cleanString(
      data.urgency
    ).toLowerCase();

  const urgency =
    urgencyValues.includes(
      rawUrgency as (typeof urgencyValues)[number]
    )
      ? (rawUrgency as SymptomAnalysis["urgency"])
      : "routine";

  const confidence =
    Number(data.confidence);

  return {
    summary:
      cleanString(
        data.summary
      ) ||
      "The available symptom information is not sufficient for a useful interpretation.",

    possibleCauses:
      cleanPossibleCauses(
        data.possibleCauses
      ),

    urgency,

    urgencyReason:
      cleanString(
        data.urgencyReason
      ) ||
      "No specific urgency could be determined from the information provided.",

    recommendedActions:
      cleanArray(
        data.recommendedActions
      ),

    emergencySigns:
      cleanArray(
        data.emergencySigns
      ),

    questionsForDoctor:
      cleanArray(
        data.questionsForDoctor
      ),

    selfCare:
      cleanArray(
        data.selfCare
      ),

    thingsToMonitor:
      cleanArray(
        data.thingsToMonitor
      ),

    confidence:
      Number.isFinite(confidence)
        ? Math.min(
            100,
            Math.max(0, confidence)
          )
        : 0,

    disclaimer:
      cleanString(
        data.disclaimer
      ) ||
      "This symptom checker provides educational guidance only and does not diagnose medical conditions. Seek professional medical care when needed.",
  };
}

export async function analyzeSymptoms(
  input: SymptomInput
): Promise<SymptomAnalysis> {
  const response =
    await fetch(
      "/api/symptom-analysis",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(input),
      }
    );

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Unable to analyze the symptoms."
    );
  }

  return validateSymptomAnalysis(
    data
  );
}