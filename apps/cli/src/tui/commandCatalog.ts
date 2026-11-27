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
      { name: "compress", summary: "Shrink PDF" },
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
      { name: "compare-text", summary: "Text diff between two PDFs" },
      { name: "merge", summary: "Merge PDFs" },
      { name: "split", summary: "Split PDF by page ranges" },
      { name: "rotate", summary: "Rotate pages" },
      { name: "organize", summary: "Reorder pages" },
      { name: "crop", summary: "Crop pages" },
      { name: "protect", summary: "Encrypt a PDF" },
      { name: "unlock", summary: "Remove PDF password" },
      { name: "watermark", summary: "Add a watermark" },
      { name: "sign", summary: "Place a signature image" },
      { name: "halve", summary: "Halve page layout" },
      { name: "n-up", summary: "Place pages in an N-up layout" },
      { name: "fill-form", summary: "Fill PDF form fields" },
      { name: "page-numbers", summary: "Add page numbers" },
      { name: "header-footer", summary: "Add headers and footers" },
      { name: "native-text-edit", summary: "Apply native text edits" },
      { name: "jpg-to-pdf", summary: "Convert JPEG images to PDF" },
      { name: "redact", summary: "Redact PDF regions" },
      { name: "pdf-to-word", summary: "Export PDF to Word" },
      { name: "pdf-to-excel", summary: "Export PDF to Excel or CSV" },
      { name: "pdf-to-ppt", summary: "Export PDF to PowerPoint" },
      { name: "pdf-to-epub", summary: "Export PDF to EPUB" },
      { name: "repair", summary: "Repair a PDF" },
      { name: "repair-batch", summary: "Repair multiple PDFs" },
      { name: "extract-images", summary: "Extract embedded images" },
      { name: "extract-text-runs", summary: "Extract positioned text runs" },
      { name: "apply-edits", summary: "Apply annotations" },
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
