import { NextResponse } from "next/server";
import { validateAnalysis } from "@/lib/geminiMedicine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const extractedText = body?.extractedText;

    if (
      typeof extractedText !== "string" ||
      !extractedText.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "No medicine information could be read from the image.",
        },
        { status: 400 }
      );
    }

    const cleanText = extractedText
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      return NextResponse.json(
        {
          error:
            "Could not read the medicine label. Please upload a clearer image.",
        },
        { status: 400 }
      );
    }

    if (cleanText.length > 12000) {
      return NextResponse.json(
        {
          error: "The medicine label is too long to analyse.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Medicine analysis has not been configured yet.",
        },
        { status: 503 }
      );
    }

    const model =
      process.env.GEMINI_MEDICINE_MODEL ||
      "gemini-2.5-flash";

    const prompt = `
You are a medicine-information assistant.

You are given OCR text extracted from a medicine package, medicine label, or prescription.

Your job is to identify ONLY information that is actually supported by the OCR text.

IMPORTANT SAFETY RULES:

1. NEVER invent a medicine name.
2. NEVER invent a generic name.
3. NEVER invent strength.
4. NEVER invent an expiry date.
5. NEVER invent dosage.
6. NEVER calculate a child's dosage.
7. NEVER guess an age restriction.
8. NEVER claim that a medicine is universally safe.
9. NEVER tell the patient to stop or change a prescribed medicine.
10. If information is not clearly available, return an empty string or empty array.
11. Do not use general medical knowledge to fill missing label information.
12. The result must be understandable to a normal person.
13. Keep answers short and useful.
14. Do not include the OCR text in your response.
15. Return ONLY valid JSON.

For age guidance:
- Adults: mention the label information if available.
- Children: only provide information explicitly supported by the label.
- Elderly: only provide information explicitly supported by the label.
- If no age guidance is available, say that it could not be determined.

For timing:
- Only provide time/frequency if supported by the medicine label or prescription.
- If food instructions are present, include them.
- Never invent "before food" or "after food".

For expiry:
- Extract only a clearly visible expiry date.
- If unavailable, return an empty string.

For safety:
- "Safe when used as directed" may ONLY be used when the available information clearly supports ordinary use according to the label.
- Otherwise use "Use Carefully" or "Consult Doctor".

Use this exact JSON structure:

{
  "medicineName": "",
  "genericName": "",
  "strength": "",

  "usedFor": [],

  "ageGuidance": {
    "adults": "",
    "children": "",
    "elderly": ""
  },

  "howToTake": {
    "timing": "",
    "food": "",
    "frequency": ""
  },

  "expiryDate": "",

  "sideEffects": [],

  "warnings": [],

  "benefits": [],

  "safetyIndicator": {
    "status": "Safe when used as directed",
    "color": "green",
    "reason": ""
  },

  "confidence": 0,

  "medicalDisclaimer": "This information is AI-generated and does not replace advice from a doctor or pharmacist."
}

Confidence must be a number from 0 to 100.

OCR TEXT:
${cleanText}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", payload);

      return NextResponse.json(
        {
          error:
            payload?.error?.message ||
            "Gemini could not analyse the medicine.",
        },
        { status: 502 }
      );
    }

    const responseText =
      payload?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (
      typeof responseText !== "string" ||
      !responseText.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Gemini did not return medicine information.",
        },
        { status: 502 }
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(
        responseText
          .replace(/^```json\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim()
      );
    } catch {
      console.error(
        "Invalid Gemini JSON:",
        responseText
      );

      return NextResponse.json(
        {
          error:
            "Gemini returned an invalid medicine analysis.",
        },
        { status: 502 }
      );
    }

    const analysis = validateAnalysis(parsed);

    return NextResponse.json({
      analysis,
    });
  } catch (error) {
    console.error("Medicine analysis error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to analyse this medicine.",
      },
      { status: 500 }
    );
  }
}