import React from "react";
import { Box, Text } from "ink";
import type { PdfAnalysisResult } from "@gopdfjs/engine";

export type AnalyzeReportViewProps = {
  report: PdfAnalysisResult;
};

/** Rich PDF diagnostic panel. */
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
        <Text dimColor>
          Title: {report.title || "(none)"} · Author: {report.author || "(none)"}
        </Text>
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text bold>Objects</Text>
        <Text>
          Fonts {report.fontCount} · Forms {report.formCount} · Images{" "}
          {report.imageCount}
        </Text>
        <Text dimColor>Image raw: {report.imageRawSizeMb} MB</Text>
      </Box>
    </Box>
  );
}
