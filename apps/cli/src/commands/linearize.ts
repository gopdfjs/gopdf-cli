import { parseInputOutputArgv } from "../lib/argv.ts";
import { defaultSiblingOutput, readBytes, writeBytes } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";
import { renderStatusLine } from "../tui/renderSummary.tsx";
import { withSpinner } from "../tui/withSpinner.tsx";

export const LINEARIZE_USAGE = `Usage: gopdf linearize <input.pdf> [-o out.pdf]

Options:
  -o, --output   Output path (default: <input>.linearized.pdf)`;

export function parseLinearizeArgv(argv: string[]) {
  const { input, output, rest } = parseInputOutputArgv(argv);
  if (rest.length > 0) {
    console.error(`Unknown option: ${rest[0]}`);
    return null;
  }
  if (!input) {
    console.log(LINEARIZE_USAGE);
    return null;
  }
  return {
    input,
    output: output ?? defaultSiblingOutput(input, ".linearized.pdf"),
  };
}

export async function runLinearize(argv: string[]): Promise<number> {
  const opts = parseLinearizeArgv(argv);
  if (!opts) {
    return 1;
  }

  return runEngineCommandExit("linearize", async (engine) => {
    let outputBytes!: Uint8Array;

    await withSpinner("Linearizing PDF", async () => {
      outputBytes = await engine.linearizePdf(readBytes(opts.input));
    });

    writeBytes(opts.output, outputBytes);
    await renderStatusLine("Wrote:", opts.output);
  });
}
