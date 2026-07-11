import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PDF_FIXTURES } from "./lib/fixtures.ts";
import { getEngine, resetEngineForTests } from "./lib/getEngine.ts";
import { readBytes } from "./lib/io.ts";

describe("gopdf analyze via engine", () => {
  it("loads py-pdf-libre-writer fixture", async () => {
    resetEngineForTests();
    const engine = await getEngine();
    const bytes = readBytes(PDF_FIXTURES.PY_PDF_LIBRE_WRITER);
    const report = await engine.analyzePdf(bytes, {
      fileName: path.basename(PDF_FIXTURES.PY_PDF_LIBRE_WRITER),
      fileSizeBytes: bytes.byteLength,
    });
    expect(report.pages).toBeGreaterThan(0);
  });

  it("rejects missing file", () => {
    expect(() => readBytes("/no/such/file.pdf")).toThrow(/not found/i);
  });
});
