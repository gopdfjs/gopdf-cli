import type { PdfAnalysisResult } from "@gopdfjs/engine";

export function printAnalyzeReport(report: PdfAnalysisResult): void {
  console.log(`\n=== PDF Diagnostic Report ===`);
  console.log(`File: ${report.fileName}`);
  console.log(`Size: ${report.fileSizeStr}`);
  console.log(`\n--- Basic Info ---`);
  console.log(`Pages: ${report.pages}`);
  console.log(`Version: ${report.version}`);
  console.log(`Linearized: ${report.isLinearized ? "yes" : "no"}`);
  console.log(`Encrypted: ${report.isEncrypted ? "yes" : "no"}`);
  console.log(`Title: ${report.title || "(none)"}`);
  console.log(`Author: ${report.author || "(none)"}`);
  console.log(`\n--- Internal Objects ---`);
  console.log(`Fonts: ${report.fontCount}`);
  console.log(`Form XObjects: ${report.formCount}`);
  console.log(`Image XObjects: ${report.imageCount}`);
  console.log(`Image raw size: ${report.imageRawSizeMb} MB`);
  console.log(`\n=============================\n`);
}
