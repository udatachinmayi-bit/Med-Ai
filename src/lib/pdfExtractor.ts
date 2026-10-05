export async function extractPdfText(file: File): Promise<{ extractedText: string; confidence?: number }> {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = await Promise.all(Array.from({ length: document.numPages }, async (_, index) => {
      const page = await document.getPage(index + 1); const content = await page.getTextContent();
      return content.items.map((item) => "str" in item ? item.str : "").join(" ");
    }));
    const extractedText = pages.join("\n").replace(/\s+/g, " ").trim();
    if (!extractedText) throw new Error("This PDF has no readable text. Upload a clear image or a text-based PDF.");
    return { extractedText };
  } catch (error) { throw new Error(error instanceof Error && /password/i.test(error.message) ? "Password-protected PDFs are not supported." : error instanceof Error ? error.message : "Unable to read this PDF."); }
}
