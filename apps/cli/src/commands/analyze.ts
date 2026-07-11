import path from "node:path";
import { printAnalyzeReport } from "../lib/analyzeReport.ts";
import { readBytes } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";
import { renderAnalyzeReport } from "../tui/renderAnalyzeReport.tsx";

export const ANALYZE_USAGE = `Usage: gopdf analyze <input.pdf>`;

export async function runAnalyze(argv: string[]): Promise<number> {
  const input = argv[0];
  if (!input) {
    console.log(ANALYZE_USAGE);
    return 1;
  }

  return runEngineCommandExit("analyze", async (engine) => {
    const bytes = readBytes(input);
    const report = await engine.analyzePdf(bytes, {
      fileName: path.basename(input),
      fileSizeBytes: bytes.byteLength,
    });
    await renderAnalyzeReport(report);
  });
}

/** Plain-text fallback export for tests / MCP. */
export { printAnalyzeReport };
