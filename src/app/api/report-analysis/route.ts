import { NextResponse } from "next/server";

const MODEL =
  process.env.GEMINI_REPORT_MODEL ||
  process.env.GEMINI_MEDICINE_MODEL ||
  "gemini-2.5-flash";

type RequestBody = {
  file?: string;
  mimeType?: string;
  fileName?: string;
};

const REPORT_SCHEMA = {
  type: "object",

  properties: {
    reportType: {
      type: "string",
    },

    patient: {
      type: "object",

      properties: {
        name: {
          type: "string",
        },

        age: {
          type: "string",
        },

        gender: {
          type: "string",
        },

        reportDate: {
          type: "string",
        },

        labName: {
          type: "string",
        },
      },

      required: [
        "name",
        "age",
        "gender",
        "reportDate",
        "labName",
      ],
    },

    summary: {
      type: "string",
    },

    keyFindings: {
      type: "array",
      items: {
        type: "string",
      },
    },

    normalResults: {
      type: "array",

      items: {
        type: "object",

        properties: {
          name: {
            type: "string",
          },

          value: {
            type: "string",
          },

          unit: {
            type: "string",
          },

          referenceRange: {
            type: "string",
          },

          status: {
            type: "string",
          },

          explanation: {
            type: "string",
          },
        },

        required: [
          "name",
          "value",
          "unit",
          "referenceRange",
          "status",
          "explanation",
        ],
      },
    },

    abnormalResults: {
      type: "array",

      items: {
        type: "object",

        properties: {
          name: {
            type: "string",
          },

          value: {
            type: "string",
          },

          unit: {
            type: "string",
          },

          referenceRange: {
            type: "string",
          },

          status: {
            type: "string",
          },

          explanation: {
            type: "string",
          },
        },

        required: [
          "name",
          "value",
          "unit",
          "referenceRange",
          "status",
          "explanation",
        ],
      },
    },

    allResults: {
      type: "array",

      items: {
        type: "object",

        properties: {
          name: {
            type: "string",
          },

          value: {
            type: "string",
          },

          unit: {
            type: "string",
          },

          referenceRange: {
            type: "string",
          },

          status: {
            type: "string",
          },

          explanation: {
            type: "string",
          },
        },

        required: [
          "name",
          "value",
          "unit",
          "referenceRange",
          "status",
          "explanation",
        ],
      },
    },

    possibleInterpretations: {
      type: "array",
      items: {
        type: "string",
      },
    },

    recommendations: {
      type: "array",
      items: {
        type: "string",
      },
    },

    questionsForDoctor: {
      type: "array",
      items: {
        type: "string",
      },
    },

    healthScore: {
      type: "number",
    },

    urgency: {
      type: "string",
    },

    urgencyReason: {
      type: "string",
    },

    confidence: {
      type: "number",
    },

    disclaimer: {
      type: "string",
    },
  },

  required: [
    "reportType",
    "patient",
    "summary",
    "keyFindings",
    "normalResults",
    "abnormalResults",
    "allResults",
    "possibleInterpretations",
    "recommendations",
    "questionsForDoctor",
    "healthScore",
    "urgency",
    "urgencyReason",
    "confidence",
    "disclaimer",
  ],
};

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const file =
      typeof body.file === "string"
        ? body.file
        : "";

    const mimeType =
      typeof body.mimeType === "string"
        ? body.mimeType
        : "";

    const fileName =
      typeof body.fileName === "string"
        ? body.fileName
        : "medical-report";

    if (!file) {
      return NextResponse.json(
        {
          error:
            "No report file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        mimeType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please upload a PDF, JPG, PNG or WebP medical report.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.length >
      20 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          error:
            "The report is too large. Please upload a file below 20 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured on the server.",
        },
        {
          status: 503,
        }
      );
    }

    const prompt = `
You are MedAI's medical-report analysis engine.

Analyze the attached medical report carefully.

The original uploaded document is the PRIMARY SOURCE.

Your job is to extract and explain the information that is actually present in the report.

IMPORTANT SAFETY RULES:

1. Do not invent patient information.
2. Do not invent test values.
3. Do not invent reference ranges.
4. Do not invent diagnoses.
5. Do not assume a condition only because one value is abnormal.
6. Preserve the units shown in the report.
7. Preserve the reference range shown in the report.
8. Use the laboratory's own reference range when available.
9. Do not replace the laboratory reference range with a generic range.
10. Clearly distinguish abnormal results from normal results.
11. If a result cannot be confidently read, mark its status as "unknown".
12. If information is missing, return an empty string or empty array.
13. Do not provide medication prescriptions.
14. Do not tell the user to start, stop or change medication.
15. Recommendations should be general discussion points for a healthcare professional.
16. Questions for the doctor should help the user understand the report.
17. Do not claim that this analysis is a diagnosis.
18. Do not reveal hidden reasoning.
19. Return ONLY valid JSON matching the requested schema.

For healthScore:

This is NOT a medical diagnosis score.

Use 0-100 only as a simple report-status indicator based on the number and severity of clearly abnormal findings.

If the report does not contain enough information to reasonably estimate it, use 0.

For confidence:

Estimate how confidently the uploaded report was successfully interpreted.

For urgency:

Use:
- "routine" when there are no clearly urgent findings
- "attention" when findings should reasonably be discussed with a healthcare professional
- "urgent" only when the report itself contains a clearly concerning result that warrants prompt medical attention

Do not use "urgent" merely because the report is medical.

File name:
${fileName}
`;

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;

    const geminiResponse =
      await fetch(
        geminiUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                role: "user",

                parts: [
                  {
                    text: prompt,
                  },

                  {
                    inline_data: {
                      mime_type:
                        mimeType,

                      data: file,
                    },
                  },
                ],
              },
            ],

            generationConfig: {
              temperature: 0.1,

              responseMimeType:
                "application/json",

              responseSchema:
                REPORT_SCHEMA,
            },
          }),
        }
      );

    if (!geminiResponse.ok) {
      const errorText =
        await geminiResponse.text();

      console.error(
        "Gemini report error:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Gemini could not analyze this report. Please try again with a clearer file.",
        },
        {
          status: 502,
        }
      );
    }

    const geminiData =
      await geminiResponse.json();

    const text =
      geminiData?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (
      typeof text !== "string" ||
      !text.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Gemini returned an empty analysis.",
        },
        {
          status: 502,
        }
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.error(
        "Invalid Gemini JSON:",
        text
      );

      return NextResponse.json(
        {
          error:
            "The report analysis returned invalid data. Please try again.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json(
      parsed,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Report analysis error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to analyze the report.",
      },
      {
        status: 500,
      }
    );
  }
}