import React from "react";
import { render } from "ink";
import { formatAnalyzeReportText, type PdfAnalysisResult } from "../lib/analyzeReport.ts";
import { AnalyzeReportView } from "./components/AnalyzeReportView.tsx";
import { shouldUseTui } from "./shouldUseTui.ts";

export async function renderAnalyzeReport(report: PdfAnalysisResult): Promise<void> {
  if (!shouldUseTui()) {
    console.log(formatAnalyzeReportText(report));
    return;
  }

  const { unmount, waitUntilExit } = render(<AnalyzeReportView report={report} />);
  unmount();
  await waitUntilExit();
}
