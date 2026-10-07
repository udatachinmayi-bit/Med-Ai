import { NextResponse } from "next/server";

const MODEL =
  process.env.GEMINI_SYMPTOM_MODEL ||
  process.env.GEMINI_MEDICINE_MODEL ||
  "gemini-2.5-flash";

type RequestBody = {
  symptoms?: string[];
  description?: string;
  duration?: string;
  severity?: string;
  age?: string;
  gender?: string;
  existingConditions?: string;
  currentMedicines?: string;
};

const RESPONSE_SCHEMA = {
  type: "object",

  properties: {
    summary: {
      type: "string",
    },

    possibleCauses: {
      type: "array",

      items: {
        type: "object",

        properties: {
          name: {
            type: "string",
          },

          likelihood: {
            type: "string",
          },

          explanation: {
            type: "string",
          },
        },

        required: [
          "name",
          "likelihood",
          "explanation",
        ],
      },
    },

    urgency: {
      type: "string",
    },

    urgencyReason: {
      type: "string",
    },

    recommendedActions: {
      type: "array",

      items: {
        type: "string",
      },
    },

    emergencySigns: {
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

    selfCare: {
      type: "array",

      items: {
        type: "string",
      },
    },

    thingsToMonitor: {
      type: "array",

      items: {
        type: "string",
      },
    },

    confidence: {
      type: "number",
    },

    disclaimer: {
      type: "string",
    },
  },

  required: [
    "summary",
    "possibleCauses",
    "urgency",
    "urgencyReason",
    "recommendedActions",
    "emergencySigns",
    "questionsForDoctor",
    "selfCare",
    "thingsToMonitor",
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

    const symptoms =
      Array.isArray(body.symptoms)
        ? body.symptoms
            .filter(
              (item) =>
                typeof item ===
                "string"
            )
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
        : [];

    const description =
      typeof body.description ===
      "string"
        ? body.description.trim()
        : "";

    const duration =
      typeof body.duration ===
      "string"
        ? body.duration.trim()
        : "";

    const severity =
      typeof body.severity ===
      "string"
        ? body.severity.trim()
        : "";

    const age =
      typeof body.age === "string"
        ? body.age.trim()
        : "";

    const gender =
      typeof body.gender ===
      "string"
        ? body.gender.trim()
        : "";

    const existingConditions =
      typeof body.existingConditions ===
      "string"
        ? body.existingConditions.trim()
        : "";

    const currentMedicines =
      typeof body.currentMedicines ===
      "string"
        ? body.currentMedicines.trim()
        : "";

    if (
      symptoms.length === 0 &&
      !description
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter at least one symptom.",
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
You are the MedAI Symptom Guidance Engine.

You provide cautious, educational symptom guidance.

IMPORTANT:
You are NOT a doctor.
You must NOT diagnose the user.
You must NOT claim certainty.
You must NOT prescribe medication.
You must NOT recommend starting, stopping, or changing medication.
You must NOT replace professional medical care.

Analyze the user's reported symptoms and provide structured guidance.

USER INFORMATION

Age:
${age || "Not provided"}

Gender:
${gender || "Not provided"}

Symptoms:
${
  symptoms.length
    ? symptoms.join(", ")
    : "Not provided"
}

Additional description:
${description || "Not provided"}

Duration:
${duration || "Not provided"}

Severity:
${severity || "Not provided"}

Existing medical conditions:
${existingConditions || "Not provided"}

Current medicines:
${currentMedicines || "Not provided"}


SAFETY REQUIREMENTS

1. Do not diagnose a disease.

2. Give possible explanations only.

3. Never state:
   "You have..."
   "This confirms..."
   "This is definitely..."

4. Use language such as:
   "Possible explanation"
   "Could be associated with"
   "May sometimes occur with"

5. Consider the symptom combination rather than treating every symptom independently.

6. Take age, duration, severity and existing conditions into account.

7. Identify red flags that may require urgent or emergency medical attention.

8. If emergency warning signs could reasonably apply, make the urgency "emergency".

9. If the situation should be evaluated promptly but does not clearly indicate an emergency, use "urgent".

10. If a healthcare professional should be contacted soon but emergency care is not indicated, use "soon".

11. Use "routine" only when the information does not indicate a need for prompt medical attention.

12. Do not provide medication prescriptions.

13. Self-care suggestions must be low-risk general measures only.

14. Do not recommend doses of medicines.

15. Do not recommend stopping prescribed medication.

16. Questions for a doctor should help the user discuss the symptoms.

17. Do not reveal hidden reasoning.

18. Return ONLY valid JSON matching the requested schema.

URGENCY VALUES:

routine
soon
urgent
emergency

POSSIBLE CAUSE LIKELIHOOD VALUES:

common
possible
less-likely

CONFIDENCE:

Use 0-100.

Confidence reflects how much useful information was provided for symptom interpretation.

It does NOT mean medical certainty.

IMPORTANT:

The result must contain a strong medical disclaimer.

Return JSON only.
`;

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;

    const response =
      await fetch(
        url,
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
                ],
              },
            ],

            generationConfig: {
              temperature: 0.15,

              responseMimeType:
                "application/json",

              responseSchema:
                RESPONSE_SCHEMA,
            },
          }),
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Gemini symptom error:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Gemini could not analyze the symptoms. Please try again.",
        },
        {
          status: 502,
        }
      );
    }

    const result =
      await response.json();

    const text =
      result?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (
      typeof text !== "string" ||
      !text.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Gemini returned an empty symptom analysis.",
        },
        {
          status: 502,
        }
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      console.error(
        "Invalid Gemini symptom JSON:",
        text
      );

      return NextResponse.json(
        {
          error:
            "The symptom analysis returned invalid data. Please try again.",
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
      "Symptom analysis error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to analyze symptoms.",
      },
      {
        status: 500,
      }
    );
  }
}