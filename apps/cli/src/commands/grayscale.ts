import { parseInputOutputArgv } from "../lib/argv.ts";
import { defaultSiblingOutput, readBytes, writeBytes } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";
import { renderStatusLine } from "../tui/renderSummary.tsx";
import { withSpinner } from "../tui/withSpinner.tsx";

export const GRAYSCALE_USAGE = `Usage: gopdf grayscale <input.pdf> [-o out.pdf] [--mode grayscale|bw]

Options:
  -o, --output   Output path (default: <input>.grayscaled.pdf)
  --mode         Grayscale mode (default: grayscale)`;

export function parseGrayscaleArgv(argv: string[]) {
  const { input, output, rest } = parseInputOutputArgv(argv);
  let mode: "grayscale" | "bw" = "grayscale";

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--mode") {
      const next = rest[i + 1];
      if (next !== "grayscale" && next !== "bw") {
        console.error("[ERROR] --mode must be grayscale or bw");
        return null;
      }
      mode = next;
      i++;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    return null;
  }

  if (!input) {
    console.log(GRAYSCALE_USAGE);
    return null;
  }

  return {
    input,
    output: output ?? defaultSiblingOutput(input, ".grayscaled.pdf"),
    mode,
  };
}

export async function runGrayscale(argv: string[]): Promise<number> {
  const opts = parseGrayscaleArgv(argv);
  if (!opts) {
    return 1;
  }

  return runEngineCommandExit("grayscale", async (engine) => {
    let result!: Awaited<ReturnType<typeof engine.grayscalePdf>>;

    await withSpinner("Grayscaling PDF", async () => {
      result = await engine.grayscalePdf(readBytes(opts.input), { mode: opts.mode });
    });

    writeBytes(opts.output, result.bytes);
    await renderStatusLine("Wrote:", opts.output);
  });
}
