import type {
  ReportAnalysis,
  ReportTestResult,
} from "@/types/report";

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

function cleanTestResults(
  value: unknown
): ReportTestResult[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const data =
      item &&
      typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    const allowedStatuses = [
      "normal",
      "high",
      "low",
      "critical",
      "unknown",
    ] as const;

    const rawStatus =
      cleanString(data.status).toLowerCase();

    const status = allowedStatuses.includes(
      rawStatus as (typeof allowedStatuses)[number]
    )
      ? (rawStatus as ReportTestResult["status"])
      : "unknown";

    return {
      name: cleanString(data.name),

      value: cleanString(data.value),

      unit: cleanString(data.unit),

      referenceRange:
        cleanString(
          data.referenceRange
        ),

      status,

      explanation:
        cleanString(
          data.explanation
        ),
    };
  });
}

export function validateReportAnalysis(
  input: unknown
): ReportAnalysis {
  const data =
    input &&
    typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  const patientData =
    data.patient &&
    typeof data.patient === "object"
      ? (data.patient as Record<
          string,
          unknown
        >)
      : {};

  const urgencyValues = [
    "routine",
    "attention",
    "urgent",
  ] as const;

  const rawUrgency =
    cleanString(
      data.urgency
    ).toLowerCase();

  const urgency =
    urgencyValues.includes(
      rawUrgency as (typeof urgencyValues)[number]
    )
      ? (rawUrgency as ReportAnalysis["urgency"])
      : "routine";

  const healthScore = Number(
    data.healthScore
  );

  const confidence = Number(
    data.confidence
  );

  return {
    reportType:
      cleanString(
        data.reportType
      ) ||
      "Medical report",

    patient: {
      name:
        cleanString(
          patientData.name
        ) || "Not provided",

      age:
        cleanString(
          patientData.age
        ) || "Not provided",

      gender:
        cleanString(
          patientData.gender
        ) || "Not provided",

      reportDate:
        cleanString(
          patientData.reportDate
        ) || "Not provided",

      labName:
        cleanString(
          patientData.labName
        ) || "Not provided",
    },

    summary:
      cleanString(
        data.summary
      ) ||
      "The report could not be summarized from the available information.",

    keyFindings:
      cleanArray(
        data.keyFindings
      ),

    normalResults:
      cleanTestResults(
        data.normalResults
      ),

    abnormalResults:
      cleanTestResults(
        data.abnormalResults
      ),

    allResults:
      cleanTestResults(
        data.allResults
      ),

    possibleInterpretations:
      cleanArray(
        data.possibleInterpretations
      ),

    recommendations:
      cleanArray(
        data.recommendations
      ),

    questionsForDoctor:
      cleanArray(
        data.questionsForDoctor
      ),

    healthScore:
      Number.isFinite(healthScore)
        ? Math.min(
            100,
            Math.max(0, healthScore)
          )
        : 0,

    urgency,

    urgencyReason:
      cleanString(
        data.urgencyReason
      ) ||
      "No urgency could be determined from the available report.",

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
      "This analysis is for educational purposes only and is not a diagnosis. Discuss medical concerns and treatment decisions with a qualified healthcare professional.",
  };
}

export async function analyzeReport(
  file: File
): Promise<ReportAnalysis> {
  const base64 = await fileToBase64(
    file
  );

  const response = await fetch(
    "/api/report-analysis",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        file: base64,

        mimeType:
          file.type ||
          "application/octet-stream",

        fileName: file.name,
      }),
    }
  );

  const data =
    await response.json().catch(
      () => ({})
    );

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Unable to analyze the report."
    );
  }

  return validateReportAnalysis(
    data
  );
}

function fileToBase64(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result !==
          "string"
        ) {
          reject(
            new Error(
              "Unable to read the uploaded file."
            )
          );

          return;
        }

        const commaIndex =
          reader.result.indexOf(",");

        resolve(
          commaIndex >= 0
            ? reader.result.slice(
                commaIndex + 1
              )
            : reader.result
        );
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read the uploaded file."
          )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}