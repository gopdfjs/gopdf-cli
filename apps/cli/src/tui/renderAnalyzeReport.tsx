import React from "react";
import { render } from "ink";
import type { PdfAnalysisResult } from "@gopdfjs/engine";
import { printAnalyzeReport } from "../lib/analyzeReport.ts";
import { AnalyzeReportView } from "./components/AnalyzeReportView.tsx";
import { shouldUseTui } from "./shouldUseTui.ts";

export async function renderAnalyzeReport(report: PdfAnalysisResult): Promise<void> {
  if (!shouldUseTui()) {
    printAnalyzeReport(report);
    return;
  }

  const { unmount, waitUntilExit } = render(<AnalyzeReportView report={report} />);
  unmount();
  await waitUntilExit();
}
