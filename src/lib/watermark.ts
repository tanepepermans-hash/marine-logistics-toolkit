import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";

// Stamps the buyer's email + order date into a small footer strip on every
// page of a PDF. This doesn't stop a determined buyer from cropping it out,
// but it means a copy that leaks publicly can be traced back to whoever
// bought it — the same deterrent effect as ticket/ebook watermarking.
export async function watermarkPdf(pdfBytes: Uint8Array, email: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const stamp = `Licensed to ${email} — for personal use only, do not redistribute`;
  const date = new Date().toISOString().slice(0, 10);
  const label = `${stamp} — ${date}`;

  for (const page of pdfDoc.getPages()) {
    const { width } = page.getSize();
    const fontSize = 7;
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    page.drawText(label, {
      x: Math.max(24, (width - textWidth) / 2),
      y: 14,
      size: fontSize,
      font,
      color: rgb(0.55, 0.55, 0.55),
      opacity: 0.85,
    });
  }

  return pdfDoc.save();
}

// The Premium deliverable is a .zip containing a PDF plus editable
// docx/xlsx files. We only watermark the PDF inside — re-zipping the docx
// and xlsx untouched keeps them fully editable for the buyer.
export async function watermarkZipPdf(zipBytes: Buffer, email: string): Promise<Uint8Array> {
  const zip = await JSZip.loadAsync(zipBytes);

  const pdfEntryName = Object.keys(zip.files).find((name) => name.toLowerCase().endsWith(".pdf"));
  if (pdfEntryName) {
    const original = await zip.files[pdfEntryName].async("uint8array");
    const watermarked = await watermarkPdf(original, email);
    zip.file(pdfEntryName, watermarked);
  }

  return zip.generateAsync({ type: "uint8array" });
}
