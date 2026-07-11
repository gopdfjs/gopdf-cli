import fs from "node:fs";
import path from "node:path";
import type { GopdfEngine } from "../lib/getEngine.ts";
import { parseInputOutputArgv } from "../lib/argv.ts";
import { getEngine } from "../lib/getEngine.ts";
import { readBytes, writeText } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";
import { renderStatusLine } from "../tui/renderSummary.tsx";
import { withSpinner } from "../tui/withSpinner.tsx";

export const PDF_TO_TEXT_USAGE = `Usage: gopdf pdf-to-text <input.pdf> [-o out.txt] [--format txt|html|rtf]

Options:
  -o, --output   Output path (default: stdout)
  --format       Output format (default: txt)`;

/** Engine-supported text export formats. */
export const PDF_TO_TEXT_FORMAT = {
  TXT: "txt",
  HTML: "html",
  RTF: "rtf",
} as const;

export type PdfToTextFormat =
  (typeof PDF_TO_TEXT_FORMAT)[keyof typeof PDF_TO_TEXT_FORMAT];

export type PdfToTextOptions = {
  input: string;
  output?: string;
  format: PdfToTextFormat;
};

type EnginePdfToTextFormat = NonNullable<
  Parameters<GopdfEngine["pdfToText"]>[1]
>["format"];

function parseFormat(value: string | undefined): PdfToTextFormat | null {
  if (!value || value === PDF_TO_TEXT_FORMAT.TXT) {
    return PDF_TO_TEXT_FORMAT.TXT;
  }
  if (value === PDF_TO_TEXT_FORMAT.HTML) {
    return PDF_TO_TEXT_FORMAT.HTML;
  }
  if (value === PDF_TO_TEXT_FORMAT.RTF) {
    return PDF_TO_TEXT_FORMAT.RTF;
  }
  console.error('[ERROR] --format must be "txt", "html", or "rtf"');
  return null;
}

export function parsePdfToTextArgv(argv: string[]): PdfToTextOptions | null {
  const { input, output, rest } = parseInputOutputArgv(argv);
  let format: PdfToTextFormat = PDF_TO_TEXT_FORMAT.TXT;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--format") {
      const value = parseFormat(rest[++i]);
      if (!value) return null;
      format = value;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    console.log(PDF_TO_TEXT_USAGE);
    return null;
  }

  if (!input) {
    console.log(PDF_TO_TEXT_USAGE);
    return null;
  }

  if (!fs.existsSync(input)) {
    console.error(`[ERROR] File not found: ${input}`);
    return null;
  }

  return { input, output, format };
}

/** Read text via engine.pdfToText (CLI + MCP). */
export async function readPdfTextFromFile(
  inputPath: string,
  format: PdfToTextFormat = PDF_TO_TEXT_FORMAT.TXT,
): Promise<string> {
  const engine = await getEngine();
  return engine.pdfToText(readBytes(inputPath), {
    format: format as EnginePdfToTextFormat,
  });
}

export async function runPdfToText(argv: string[]): Promise<number> {
  const opts = parsePdfToTextArgv(argv);
  if (!opts) {
    return 1;
  }

  return runEngineCommandExit("pdf-to-text", async (engine) => {
    let text!: string;
    await withSpinner("Extracting text", async () => {
      text = await engine.pdfToText(readBytes(path.resolve(opts.input)), {
        format: opts.format as EnginePdfToTextFormat,
      });
    });

    if (opts.output) {
      writeText(opts.output, text);
      await renderStatusLine("Wrote:", opts.output);
      return;
    }

    process.stdout.write(text);
    if (!text.endsWith("\n")) {
      process.stdout.write("\n");
    }
  });
}
