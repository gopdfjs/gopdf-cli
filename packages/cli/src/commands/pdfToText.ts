import fs from "node:fs";
import path from "node:path";
import { pdfToText, TEXT_EXPORT_FORMAT } from "@gopdfjs/extract";

const USAGE = `Usage: gopdf pdf-to-text <input.pdf> [-o out.txt] [--start N] [--end N] [--format txt|md]

Options:
  -o, --output   Output path (default: stdout)
  --start        First page to include (default: 1 when slicing)
  --end          Last page to include (default: last page when --start is set)
  --format       Output format: txt or md (default: txt)`;

/** CLI output formats supported by pdf-to-text. */
export const PDF_TO_TEXT_FORMAT = {
  TXT: "txt",
  MD: "md",
} as const;

export type PdfToTextFormat =
  (typeof PDF_TO_TEXT_FORMAT)[keyof typeof PDF_TO_TEXT_FORMAT];

const PAGE_HEADER_RE = /^--- Page (\d+) ---$/;

export type PdfToTextOptions = {
  input: string;
  output?: string;
  startPage?: number;
  endPage?: number;
  format: PdfToTextFormat;
};

function parsePositiveInt(value: string | undefined, flag: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1 || !Number.isInteger(parsed)) {
    console.error(`[ERROR] ${flag} must be a positive integer`);
    return null;
  }
  return parsed;
}

function parseFormat(value: string | undefined): PdfToTextFormat | null {
  if (!value || value === PDF_TO_TEXT_FORMAT.TXT) {
    return PDF_TO_TEXT_FORMAT.TXT;
  }
  if (value === PDF_TO_TEXT_FORMAT.MD) {
    return PDF_TO_TEXT_FORMAT.MD;
  }
  console.error(`[ERROR] --format must be "txt" or "md"`);
  return null;
}

export function parsePdfToTextArgv(argv: string[]): PdfToTextOptions | null {
  let input: string | undefined;
  let output: string | undefined;
  let startPage: number | undefined;
  let endPage: number | undefined;
  let format: PdfToTextFormat = PDF_TO_TEXT_FORMAT.TXT;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;

    if (arg === "-o" || arg === "--output") {
      output = argv[++i];
      if (!output) {
        console.error("[ERROR] --output requires a path");
        return null;
      }
      continue;
    }
    if (arg === "--start") {
      const value = parsePositiveInt(argv[++i], "--start");
      if (value === null) {
        return null;
      }
      startPage = value;
      continue;
    }
    if (arg === "--end") {
      const value = parsePositiveInt(argv[++i], "--end");
      if (value === null) {
        return null;
      }
      endPage = value;
      continue;
    }
    if (arg === "--format") {
      const value = parseFormat(argv[++i]);
      if (!value) {
        return null;
      }
      format = value;
      continue;
    }
    if (arg.startsWith("-")) {
      console.error(`Unknown option: ${arg}`);
      console.log(USAGE);
      return null;
    }
    if (!input) {
      input = arg;
    }
  }

  if (!input) {
    console.log(USAGE);
    return null;
  }

  if (!fs.existsSync(input)) {
    console.error(`[ERROR] File not found: ${input}`);
    return null;
  }

  const resolvedStart = startPage ?? (endPage !== undefined ? 1 : undefined);
  const resolvedEnd = endPage ?? startPage;
  if (
    resolvedStart !== undefined &&
    resolvedEnd !== undefined &&
    resolvedEnd < resolvedStart
  ) {
    console.error("[ERROR] --end must be >= --start");
    return null;
  }

  return {
    input,
    output,
    startPage: resolvedStart,
    endPage: resolvedEnd,
    format,
  };
}

/** Highest page number present in pdfToText plain output. */
export function getLastPageNumber(plainText: string): number {
  let lastPage = 0;
  for (const line of plainText.split("\n")) {
    const match = PAGE_HEADER_RE.exec(line.trim());
    if (match) {
      lastPage = Number(match[1]);
    }
  }
  return lastPage;
}

/** Keep page markers while slicing plain-text export output. */
export function slicePlainTextWithMarkers(
  plainText: string,
  startPage: number,
  endPage: number,
): string {
  const blocks: string[] = [];
  let currentPage = 0;
  let currentBody: string[] = [];

  const flush = () => {
    if (
      currentPage >= startPage &&
      currentPage <= endPage &&
      currentBody.some((line) => line.trim())
    ) {
      blocks.push(
        `--- Page ${currentPage} ---\n${currentBody.join("\n").trim()}`,
      );
    }
    currentBody = [];
  };

  for (const line of plainText.split("\n")) {
    const match = PAGE_HEADER_RE.exec(line.trim());
    if (match) {
      flush();
      currentPage = Number(match[1]);
      continue;
    }
    if (currentPage >= startPage && currentPage <= endPage) {
      currentBody.push(line);
    }
  }

  flush();
  return blocks.join("\n\n").trim();
}

/** Convert plain-text page markers to markdown headings. */
export function plainTextToMarkdown(text: string): string {
  return text.replace(/^--- Page (\d+) ---$/gm, "## Page $1");
}

export type ExtractPdfTextOptions = {
  startPage?: number;
  endPage?: number;
  format: PdfToTextFormat;
};

/** Core extraction pipeline shared by CLI and MCP. */
export async function extractPdfTextFromFile(
  inputPath: string,
  opts: ExtractPdfTextOptions,
): Promise<string> {
  const pdfBytes = new Uint8Array(fs.readFileSync(inputPath));
  const fullText = await pdfToText(pdfBytes, { format: TEXT_EXPORT_FORMAT.TXT });

  let text = fullText;
  const hasSlice = opts.startPage !== undefined || opts.endPage !== undefined;

  if (hasSlice) {
    const startPage = opts.startPage ?? 1;
    const endPage = opts.endPage ?? getLastPageNumber(fullText);
    if (endPage < startPage) {
      throw new Error("--end must be >= --start");
    }
    text = slicePlainTextWithMarkers(fullText, startPage, endPage);
  }

  if (opts.format === PDF_TO_TEXT_FORMAT.MD) {
    text = plainTextToMarkdown(text);
  }

  return text;
}

export async function runPdfToText(argv: string[]): Promise<number> {
  const opts = parsePdfToTextArgv(argv);
  if (!opts) {
    return 1;
  }

  const text = await extractPdfTextFromFile(opts.input, {
    startPage: opts.startPage,
    endPage: opts.endPage,
    format: opts.format,
  });

  if (opts.output) {
    fs.mkdirSync(path.dirname(path.resolve(opts.output)), { recursive: true });
    fs.writeFileSync(opts.output, text, "utf8");
    console.log(`Wrote: ${opts.output}`);
    return 0;
  }

  process.stdout.write(text);
  if (!text.endsWith("\n")) {
    process.stdout.write("\n");
  }
  return 0;
}
