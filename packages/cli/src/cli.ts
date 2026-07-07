import { BIN_NAME } from "./constants.ts";
import { printWelcomeMessage, shouldShowWelcomeMessage } from "./welcome.ts";

const HELP = `${BIN_NAME} — local PDF tools (no upload)

Usage:
  gopdf compress <input.pdf> [-o out.pdf] [--level low|recommended|extreme]
  gopdf grayscale <input.pdf> [-o out.pdf]
  gopdf linearize <input.pdf> [-o out.pdf]
  gopdf analyze <input.pdf>
  gopdf pdf-to-jpg <input.pdf> [-o out_prefix] [--quality 0.92] [--scale 2]
  gopdf pdf-to-text <input.pdf> [-o out.txt] [--start N] [--end N] [--format txt|md]
  gopdf ocr <input.pdf> [-o out.txt] [--lang eng]
  gopdf compare-tokens <input.pdf> [--target-pages 2] [--start 1] [--end N] [--json]
  gopdf mcp
  gopdf install [agent] [--project] [--dry-run] [--all]

Examples:
  gopdf compress ./doc.pdf
  gopdf compress ./doc.pdf -o ./doc.small.pdf --level extreme
  gopdf grayscale ./doc.pdf
  gopdf linearize ./doc.pdf
  gopdf analyze ./doc.pdf
  gopdf pdf-to-jpg ./doc.pdf -o ./images/page
  gopdf pdf-to-text ./doc.pdf --start 12 --end 15
  gopdf ocr ./doc.pdf -o ./output.txt --lang eng
  gopdf compare-tokens ./doc.pdf --target-pages 2 --json
  gopdf mcp
  gopdf install claude
  gopdf install cursor --project`;

export async function runCli(argv: string[]): Promise<number> {
  const [cmd, ...rest] = argv;

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    if (shouldShowWelcomeMessage(argv)) {
      printWelcomeMessage();
    }
    console.log(HELP);
    return 0;
  }

  switch (cmd) {
    case "compress": {
      const { runCompress } = await import("./commands/compress.ts");
      return runCompress(rest);
    }
    case "grayscale": {
      const { runGrayscale } = await import("./commands/grayscale.ts");
      return runGrayscale(rest);
    }
    case "linearize": {
      const { runLinearize } = await import("./commands/linearize.ts");
      return runLinearize(rest);
    }
    case "analyze": {
      const { runAnalyze } = await import("./commands/analyze.ts");
      return runAnalyze(rest);
    }
    case "pdf-to-jpg": {
      const { runPdfToJpg } = await import("./commands/pdfToJpg.ts");
      return runPdfToJpg(rest);
    }
    case "pdf-to-text": {
      const { runPdfToText } = await import("./commands/pdfToText.ts");
      return runPdfToText(rest);
    }
    case "ocr": {
      const { runOcr } = await import("./commands/ocr.ts");
      return runOcr(rest);
    }
    case "compare-tokens": {
      const { runCompareTokens } = await import("./commands/compareTokens.ts");
      return runCompareTokens(rest);
    }
    case "mcp": {
      const { runMcpServer } = await import("./commands/mcp.ts");
      return runMcpServer();
    }
    case "install": {
      const { runInstall } = await import("./commands/install.ts");
      return runInstall(rest);
    }
    default:
      console.error(`Unknown command: ${cmd}\n`);
      console.log(HELP);
      return 1;
  }
}
