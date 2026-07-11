import type { GopdfEngine } from "./getEngine.ts";

export type PdfAnalysisResult = Awaited<ReturnType<GopdfEngine["analyzePdf"]>>;

export function printAnalyzeReport(report: PdfAnalysisResult): void {
  console.log(formatAnalyzeReportText(report));
}

export function formatAnalyzeReportText(report: PdfAnalysisResult): string {
  return [
    "",
    "=== PDF Diagnostic Report ===",
    `File: ${report.fileName}`,
    `Size: ${report.fileSizeStr}`,
    "",
    "--- Basic Info ---",
    `Pages: ${report.pages}`,
    `Version: ${report.version}`,
    `Linearized: ${report.isLinearized ? "yes" : "no"}`,
    `Encrypted: ${report.isEncrypted ? "yes" : "no"}`,
    `Title: ${report.title || "(none)"}`,
    `Author: ${report.author || "(none)"}`,
    "",
    "--- Internal Objects ---",
    `Fonts: ${report.fontCount}`,
    `Form XObjects: ${report.formCount}`,
    `Image XObjects: ${report.imageCount}`,
    `Image raw size: ${report.imageRawSizeMb} MB`,
    "",
    "=============================",
    "",
  ].join("\n");
}
