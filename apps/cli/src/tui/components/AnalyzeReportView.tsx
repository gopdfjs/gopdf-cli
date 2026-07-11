import React from "react";
import { Box, Text } from "ink";
import type { PdfAnalysisResult } from "../../lib/analyzeReport.ts";

export type AnalyzeReportViewProps = {
  report: PdfAnalysisResult;
};

export function AnalyzeReportView({ report }: AnalyzeReportViewProps) {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="cyan">
        PDF Diagnostic Report
      </Text>
      <Text>
        File: <Text color="yellow">{report.fileName}</Text>
      </Text>
      <Text>Size: {report.fileSizeStr}</Text>
      <Box flexDirection="column" marginTop={1}>
        <Text bold>Basic</Text>
        <Text>
          Pages: {report.pages} · Version: {report.version}
        </Text>
        <Text>
          Linearized: {report.isLinearized ? "yes" : "no"} · Encrypted:{" "}
          {report.isEncrypted ? "yes" : "no"}
        </Text>
      </Box>
      <Box flexDirection="column" marginTop={1}>
        <Text bold>Objects</Text>
        <Text>
          Fonts {report.fontCount} · Forms {report.formCount} · Images{" "}
          {report.imageCount}
        </Text>
      </Box>
    </Box>
  );
}
