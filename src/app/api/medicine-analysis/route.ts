import { NextResponse } from "next/server";
import { validateAnalysis } from "@/lib/geminiMedicine";

export async function POST(request: Request) {
  const { extractedText } = await request.json().catch(() => ({}));
  if (typeof extractedText !== "string" || !extractedText.trim()) return NextResponse.json({ error: "No label text was provided." }, { status: 400 });
  const cleanText = extractedText.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleanText || cleanText.length > 12000) return NextResponse.json({ error: "The extracted label text is invalid or too long." }, { status: 400 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Medicine analysis has not been configured yet." }, { status: 503 });
  const prompt = `You are a licensed clinical medicine knowledge assistant. Analyze OCR text from a medicine label or prescription. Return ONLY valid JSON: no markdown, no explanation, no code fences. Never invent information. Unknown strings must be empty and unknown lists must be empty; confidence must reflect uncertainty. Use exactly this schema: {"medicineName":"","genericName":"","brand":"","category":"","prescriptionType":"","uses":[],"dosage":{"adult":"","children":"","elderly":"","maximumDailyDose":""},"ageRange":{"recommended":[],"notRecommended":[]},"sideEffects":{"common":[],"rare":[]},"warnings":{"conditions":[],"pregnancy":"","breastfeeding":""},"drugInteractions":[],"foodInteractions":{"avoid":[],"recommended":[]},"storage":{"temperature":"","keepAwayFrom":[]},"advantages":[],"disadvantages":[],"precautions":[],"missedDose":"","overdose":{"symptoms":[],"emergency":""},"alternatives":[],"summary":"","safetyIndicator":{"status":"Safe | Use Carefully | Consult Doctor","color":"green | yellow | red","reason":""},"confidence":0,"medicalDisclaimer":"AI-generated information does not replace professional medical advice."}. OCR text: ${cleanText}`;
  try {
    const model = process.env.GEMINI_MEDICINE_MODEL ?? "gemini-2.5-flash";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1 } }),
    });
    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!response.ok || typeof text !== "string") throw new Error("Gemini did not return an analysis.");
    const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
    return NextResponse.json({ analysis: validateAnalysis(parsed) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to analyse this medicine label." }, { status: 502 });
  }
}
