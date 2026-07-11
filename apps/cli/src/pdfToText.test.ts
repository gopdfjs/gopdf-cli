import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PDF_FIXTURES } from "@gopdfjs/fixtures";
import {
  extractPdfTextFromFile,
  getLastPageNumber,
  parsePdfToTextArgv,
  PDF_TO_TEXT_FORMAT,
  plainTextToMarkdown,
  runPdfToText,
  slicePlainTextWithMarkers,
} from "./commands/pdfToText.ts";

const SAMPLE_PLAIN_TEXT = `--- Page 1 ---
Alpha line

--- Page 2 ---
Beta line

--- Page 3 ---
Gamma line`;

describe("parsePdfToTextArgv", () => {
  it("parses defaults for stdout txt output", () => {
    const opts = parsePdfToTextArgv([PDF_FIXTURES.BMAUPIN_BASIC]);
    expect(opts).toMatchObject({
      input: PDF_FIXTURES.BMAUPIN_BASIC,
      format: PDF_TO_TEXT_FORMAT.TXT,
    });
    expect(opts?.output).toBeUndefined();
    expect(opts?.startPage).toBeUndefined();
    expect(opts?.endPage).toBeUndefined();
  });

  it("parses output path, page range, and markdown format", () => {
    const opts = parsePdfToTextArgv([
      PDF_FIXTURES.BMAUPIN_BASIC,
      "-o",
      "/tmp/out.md",
      "--start",
      "2",
      "--end",
      "4",
      "--format",
      "md",
    ]);
    expect(opts).toMatchObject({
      input: PDF_FIXTURES.BMAUPIN_BASIC,
      output: "/tmp/out.md",
      startPage: 2,
      endPage: 4,
      format: PDF_TO_TEXT_FORMAT.MD,
    });
  });

  it("rejects end before start", () => {
    const opts = parsePdfToTextArgv([
      PDF_FIXTURES.BMAUPIN_BASIC,
      "--start",
      "5",
      "--end",
      "2",
    ]);
    expect(opts).toBeNull();
  });
});

describe("plain text helpers", () => {
  it("detects the last page marker", () => {
    expect(getLastPageNumber(SAMPLE_PLAIN_TEXT)).toBe(3);
  });

  it("slices plain text while keeping page markers", () => {
    const slice = slicePlainTextWithMarkers(SAMPLE_PLAIN_TEXT, 2, 3);
    expect(slice).toContain("--- Page 2 ---");
    expect(slice).toContain("Beta line");
    expect(slice).toContain("--- Page 3 ---");
    expect(slice).not.toContain("--- Page 1 ---");
  });

  it("converts page markers to markdown headings", () => {
    const md = plainTextToMarkdown("--- Page 12 ---\nBody");
    expect(md).toBe("## Page 12\nBody");
  });
});

describe("extractPdfTextFromFile", () => {
  const tmpDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    ".tmp-pdf-to-text-test",
  );

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("extracts text from a real PDF fixture", async () => {
    const text = await extractPdfTextFromFile(PDF_FIXTURES.BMAUPIN_BASIC, {
      format: PDF_TO_TEXT_FORMAT.TXT,
    });
    expect(text).toContain("--- Page 1 ---");
    expect(text).toContain("Hello World");
  });

  it("slices a page range from a multi-page fixture", async () => {
    const text = await extractPdfTextFromFile(PDF_FIXTURES.PY_PDF_4_PAGES, {
      startPage: 2,
      endPage: 3,
      format: PDF_TO_TEXT_FORMAT.TXT,
    });
    expect(text).toContain("--- Page 2 ---");
    expect(text).toContain("--- Page 3 ---");
    expect(text).not.toContain("--- Page 1 ---");
    expect(text).not.toContain("--- Page 4 ---");
  });

  it("writes markdown to an output file via CLI runner", async () => {
    fs.mkdirSync(tmpDir, { recursive: true });
    const out = path.join(tmpDir, "out.md");

    const code = await runPdfToText([
      PDF_FIXTURES.BMAUPIN_BASIC,
      "-o",
      out,
      "--format",
      "md",
    ]);

    expect(code).toBe(0);
    expect(fs.readFileSync(out, "utf8")).toContain("## Page 1");
  });
});
