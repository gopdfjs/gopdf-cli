import { parseInputOutputArgv } from "../lib/argv.ts";
import { readBytes, writeText } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";
import { renderStatusLine } from "../tui/renderSummary.tsx";
import { withProgress } from "../tui/withProgress.tsx";

export const OCR_USAGE = `Usage: gopdf ocr <input.pdf> [-o out.txt] [--lang eng]

Options:
  -o, --output   Output path (default: stdout)
  --lang         OCR language (default: eng)`;

export function parseOcrArgv(argv: string[]) {
  const { input, output, rest } = parseInputOutputArgv(argv);
  let lang = "eng";

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--lang") {
      lang = rest[++i] ?? lang;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    return null;
  }

  if (!input) {
    console.log(OCR_USAGE);
    return null;
  }

  return { input, output, lang };
}

export async function runOcr(argv: string[]): Promise<number> {
  const opts = parseOcrArgv(argv);
  if (!opts) {
    return 1;
  }

  return runEngineCommandExit("ocr", async (engine) => {
    let text!: string;

    await withProgress("OCR", async (report) => {
      text = await engine.ocr(readBytes(opts.input), opts.lang, (fraction) => {
        report(fraction * 100);
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
