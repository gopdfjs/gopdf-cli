import path from "node:path";
import type { CompressionLevel } from "@gopdfjs/engine";
import {
  COMPRESSION_LEVELS,
  isCompressionLevel,
  type CompressionLevel as CliCompressionLevel,
} from "../constants.ts";
import { parseInputOutputArgv } from "../lib/argv.ts";
import { defaultSiblingOutput, readBytes, writeBytes } from "../lib/io.ts";
import { runEngineCommandExit } from "../lib/runEngineCommand.ts";
import { renderByteSummary } from "../tui/renderSummary.tsx";
import { withProgress } from "../tui/withProgress.tsx";

const DEFAULT_LEVEL: CliCompressionLevel = "recommended";

export const COMPRESS_USAGE = `Usage: gopdf compress <input.pdf> [-o out.pdf] [--level low|recommended|extreme]

Options:
  -o, --output   Output path (default: <input>-compressed.pdf)
  --level        Compression level (default: ${DEFAULT_LEVEL})`;

export type CompressOptions = {
  input: string;
  output: string;
  level: CompressionLevel;
};

export function parseCompressArgv(argv: string[]): CompressOptions | null {
  const { input, output, rest } = parseInputOutputArgv(argv);
  let level: CompressionLevel = DEFAULT_LEVEL;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]!;
    if (arg === "--level") {
      const next = rest[++i];
      if (!next || !isCompressionLevel(next)) {
        console.error(`Invalid --level. Expected: ${COMPRESSION_LEVELS.join("|")}`);
        return null;
      }
      level = next;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    return null;
  }

  if (!input) {
    console.log(COMPRESS_USAGE);
    return null;
  }

  return {
    input,
    output: output ?? defaultSiblingOutput(input, "-compressed.pdf"),
    level,
  };
}

export async function runCompress(argv: string[]): Promise<number> {
  const opts = parseCompressArgv(argv);
  if (!opts) {
    return 1;
  }

  return runEngineCommandExit("compress", async (engine) => {
    const inputBytes = readBytes(opts.input);
    const inputSize = inputBytes.byteLength;
    let outputBytes!: Uint8Array;

    await withProgress("Compressing", async (report) => {
      outputBytes = await engine.compressPdf(inputBytes, opts.level, (fraction) => {
        report(fraction * 100);
      });
    });

    writeBytes(opts.output, outputBytes);

    await renderByteSummary({
      inputBytes: inputSize,
      outputBytes: outputBytes.byteLength,
      outputPath: path.resolve(opts.output),
    });
  });
}
