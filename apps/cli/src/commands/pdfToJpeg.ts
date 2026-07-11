import path from "node:path";
import { parseInputOutputArgv } from "../lib/argv.ts";
import { defaultSiblingOutput, readBytes, writeBytes } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";
import { renderStatusLine } from "../tui/renderSummary.tsx";
import { withProgress } from "../tui/withProgress.tsx";

export const PDF_TO_JPEG_USAGE = `Usage: gopdf pdf-to-jpeg <input.pdf> [-o out_prefix] [--quality 0.92] [--scale 2]

Options:
  -o, --output    Output base name or folder (default: <input>-page-<num>.jpg)
  --quality       JPEG quality from 0.0 to 1.0 (default: 0.92)
  --scale         Render scale (default: 2)`;

export function parsePdfToJpegArgv(argv: string[]) {
  const { input, output, rest } = parseInputOutputArgv(argv);
  let quality = 0.92;
  let scale = 2;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--quality") {
      quality = Number(rest[++i]);
      if (!Number.isFinite(quality) || quality < 0 || quality > 1) {
        console.error("[ERROR] --quality must be between 0 and 1");
        return null;
      }
      continue;
    }
    if (arg === "--scale") {
      scale = Number(rest[++i]);
      if (!Number.isFinite(scale) || scale <= 0) {
        console.error("[ERROR] --scale must be a positive number");
        return null;
      }
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    return null;
  }

  if (!input) {
    console.log(PDF_TO_JPEG_USAGE);
    return null;
  }

  return {
    input,
    outputPrefix: output ?? defaultSiblingOutput(input, ""),
    quality,
    scale,
  };
}

export async function runPdfToJpeg(argv: string[]): Promise<number> {
  const opts = parsePdfToJpegArgv(argv);
  if (!opts) {
    return 1;
  }

  return runEngineCommandExit("pdf-to-jpeg", async (engine) => {
    let pages!: Awaited<ReturnType<typeof engine.pdfToJpeg>>;

    await withProgress("Rendering JPEG pages", async (report) => {
      pages = await engine.pdfToJpeg(readBytes(opts.input), {
        quality: opts.quality,
        scale: opts.scale,
      });
      report(100);
    });

    for (const { bytes, page } of pages) {
      const lower = opts.outputPrefix.toLowerCase();
      const pagePath =
        lower.endsWith(".jpg") || lower.endsWith(".jpeg")
          ? `${opts.outputPrefix.slice(0, -path.extname(opts.outputPrefix).length)}-page-${page}${path.extname(opts.outputPrefix)}`
          : `${opts.outputPrefix}-page-${page}.jpg`;
      writeBytes(pagePath, bytes);
      await renderStatusLine("Wrote:", pagePath);
    }
  });
}

/** @deprecated alias — RFC 0001 renamed pdf-to-jpg → pdf-to-jpeg */
export const runPdfToJpg = runPdfToJpeg;
