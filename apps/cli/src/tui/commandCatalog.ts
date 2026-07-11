import { BIN_NAME } from "../constants.ts";

export type CommandEntry = {
  name: string;
  summary: string;
};

export type CommandGroup = {
  title: string;
  commands: CommandEntry[];
};

/** Command groups for help TUI + plain-text fallback. */
export const COMMAND_GROUPS: CommandGroup[] = [
  {
    title: "Transform",
    commands: [
      { name: "compress", summary: "Shrink PDF (WASM)" },
      { name: "grayscale", summary: "Convert to grayscale" },
      { name: "linearize", summary: "Fast Web View" },
    ],
  },
  {
    title: "Extract & inspect",
    commands: [
      { name: "analyze", summary: "Diagnostic report" },
      { name: "pdf-to-jpeg", summary: "Pages → JPEG" },
      { name: "pdf-to-text", summary: "Selectable text" },
      { name: "ocr", summary: "OCR via tesseract" },
      { name: "compare-tokens", summary: "Token cost estimate" },
    ],
  },
  {
    title: "Meta",
    commands: [
      { name: "mcp", summary: "MCP stdio server" },
      { name: "install", summary: "Agent MCP config" },
    ],
  },
];

export function buildPlainHelp(): string {
  const lines = [
    `${BIN_NAME} — local PDF tools (no upload)`,
    "",
    "Usage:",
  ];

  for (const group of COMMAND_GROUPS) {
    lines.push("", `  ${group.title}:`);
    for (const cmd of group.commands) {
      lines.push(`    gopdf ${cmd.name.padEnd(16)} ${cmd.summary}`);
    }
  }

  lines.push(
    "",
    "Global flags:",
    "  --plain, --no-ui   Disable Ink TUI (plain stdout/stderr)",
    "",
    "Examples:",
    "  gopdf compress ./doc.pdf",
    "  gopdf analyze ./doc.pdf",
    "  gopdf pdf-to-jpeg ./doc.pdf -o ./images/page",
    "  gopdf install cursor --project",
  );

  return lines.join("\n");
}
