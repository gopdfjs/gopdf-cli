import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { PDF_FIXTURES } from "./lib/fixtures.ts";
import {
  readPdfTextFromFile,
  parsePdfToTextArgv,
  PDF_TO_TEXT_FORMAT,
  runPdfToText,
} from "./commands/pdfToText.ts";

describe("parsePdfToTextArgv", () => {
  it("parses defaults for stdout txt output", () => {
    const opts = parsePdfToTextArgv([PDF_FIXTURES.BMAUPIN_BASIC]);
    expect(opts).toMatchObject({
      input: PDF_FIXTURES.BMAUPIN_BASIC,
      format: PDF_TO_TEXT_FORMAT.TXT,
    });
    expect(opts?.output).toBeUndefined();
  });

  it("parses output path and html format", () => {
    const opts = parsePdfToTextArgv([
      PDF_FIXTURES.BMAUPIN_BASIC,
      "-o",
      "/tmp/out.html",
      "--format",
      "html",
    ]);
    expect(opts).toMatchObject({
      input: PDF_FIXTURES.BMAUPIN_BASIC,
      output: "/tmp/out.html",
      format: PDF_TO_TEXT_FORMAT.HTML,
    });
  });

  it("rejects unknown format", () => {
    expect(
      parsePdfToTextArgv([PDF_FIXTURES.BMAUPIN_BASIC, "--format", "md"]),
    ).toBeNull();
  });
});

describe("readPdfTextFromFile", () => {
  const tmpDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    ".tmp-pdf-to-text-test",
  );

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("extracts text from a real PDF fixture via engine", async () => {
    const text = await readPdfTextFromFile(
      PDF_FIXTURES.BMAUPIN_BASIC,
      PDF_TO_TEXT_FORMAT.TXT,
    );
    expect(text).toContain("--- Page 1 ---");
    expect(text).toContain("Hello World");
  });

  it("writes output via CLI runner", async () => {
    fs.mkdirSync(tmpDir, { recursive: true });
    const out = path.join(tmpDir, "out.txt");

    const code = await runPdfToText([
      PDF_FIXTURES.BMAUPIN_BASIC,
      "-o",
      out,
    ]);

    expect(code).toBe(0);
    expect(fs.readFileSync(out, "utf8")).toContain("Hello World");
  });
});
