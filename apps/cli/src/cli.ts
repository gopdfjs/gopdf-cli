import { renderHelp } from "./tui/renderHelp.tsx";
import { shouldUseTui, stripUiFlags } from "./tui/shouldUseTui.ts";

export async function runCli(argv: string[]): Promise<number> {
  const plainForced = argv.includes("--plain") || argv.includes("--no-ui");
  const args = stripUiFlags(argv);
  const [cmd, ...rest] = args;

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    await renderHelp(argv);
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
    case "pdf-to-jpeg":
    case "pdf-to-jpg": {
      const { runPdfToJpeg } = await import("./commands/pdfToJpeg.ts");
      return runPdfToJpeg(rest);
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
      if (plainForced || !shouldUseTui()) {
        const { buildPlainHelp } = await import("./tui/commandCatalog.ts");
        console.log(buildPlainHelp());
      } else {
        await renderHelp([cmd]);
      }
      return 1;
  }
}
