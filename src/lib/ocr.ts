export type OcrProgress = (progress: number) => void;

export async function extractMedicineText(file: File, onProgress?: OcrProgress): Promise<string> {
  const { recognize } = await import("tesseract.js");
  const result = await recognize(file, "eng", {
    logger: (message) => {
      if (message.status === "recognizing text" && typeof message.progress === "number") {
        onProgress?.(Math.round(message.progress * 100));
      }
    },
  });
  const text = result.data.text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) throw new Error("We could not read text from this image. Try a brighter, sharper photo of the label.");
  return text;
}
