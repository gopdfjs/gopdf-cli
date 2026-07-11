import fs from "node:fs";
import path from "node:path";
import type { GopdfEngine } from "../lib/getEngine.ts";
import { readBytes } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";

export const COMPARE_TEXT_USAGE = `Usage: gopdf compare-text <a.pdf> <b.pdf> [--json]

Options:
  --json   Emit machine-readable JSON`;

export type CompareTextOptions = {
  inputA: string;
  inputB: string;
  json: boolean;
};

export type TextDiffResult = Awaited<
  ReturnType<GopdfEngine["comparePdfText"]>
>;

export function parseCompareTextArgv(argv: string[]): CompareTextOptions | null {
  let inputA: string | undefined;
  let inputB: string | undefined;
  let json = false;

  for (const arg of argv) {
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg.startsWith("-")) {
      console.error(`Unknown option: ${arg}`);
      console.log(COMPARE_TEXT_USAGE);
      return null;
    }
    if (!inputA) {
      inputA = arg;
      continue;
    }
    if (!inputB) {
      inputB = arg;
      continue;
    }
    console.error("[ERROR] Too many positional arguments");
    console.log(COMPARE_TEXT_USAGE);
    return null;
  }

  if (!inputA || !inputB) {
    console.log(COMPARE_TEXT_USAGE);
    return null;
  }

  for (const input of [inputA, inputB]) {
    if (!fs.existsSync(input)) {
      console.error(`[ERROR] File not found: ${input}`);
      return null;
    }
  }

  return { inputA, inputB, json };
}

/** Format engine TextDiffResult for terminal output. */
export function formatTextDiffReport(
  fileA: string,
  fileB: string,
  result: TextDiffResult,
): string {
  const lines = [
    "",
    "=== PDF Text Compare ===",
    `A: ${fileA}`,
    `B: ${fileB}`,
    `Has text layer: ${result.hasTextLayer ? "yes" : "no"}`,
    `Changes: ${result.changes.length}`,
    `Highlight rects (A): ${result.rectsA.length}`,
    `Highlight rects (B): ${result.rectsB.length}`,
    "",
  ];

  if (result.changes.length > 0) {
    lines.push("--- Changes ---");
    for (const change of result.changes) {
      lines.push(
        `  page ${change.pageIndex + 1} [${change.kind}]: ${change.text}`,
      );
    }
    lines.push("");
  }

  lines.push("========================", "");
  return lines.join("\n");
}

export async function runCompareText(argv: string[]): Promise<number> {
  const opts = parseCompareTextArgv(argv);
  if (!opts) {
    return 1;
  }

  return runEngineCommandExit("compare-text", async (engine) => {
    const bytesA = readBytes(opts.inputA);
    const bytesB = readBytes(opts.inputB);
    const result = await engine.comparePdfText(bytesA, bytesB);

    if (opts.json) {
      console.log(
        JSON.stringify(
          {
            fileA: path.basename(opts.inputA),
            fileB: path.basename(opts.inputB),
            ...result,
          },
          null,
          2,
        ),
      );
      return;
    }

    console.log(
      formatTextDiffReport(
        path.basename(opts.inputA),
        path.basename(opts.inputB),
        result,
      ),
    );
  });
}
