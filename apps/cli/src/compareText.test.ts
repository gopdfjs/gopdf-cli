import { describe, expect, it } from "vitest";
import { PDF_FIXTURES } from "./lib/fixtures.ts";
import {
  formatTextDiffReport,
  parseCompareTextArgv,
} from "./commands/compareText.ts";

describe("parseCompareTextArgv", () => {
  it("parses two inputs", () => {
    const opts = parseCompareTextArgv([
      PDF_FIXTURES.BMAUPIN_BASIC,
      PDF_FIXTURES.BMAUPIN_MINIMAL,
    ]);
    expect(opts).toMatchObject({
      inputA: PDF_FIXTURES.BMAUPIN_BASIC,
      inputB: PDF_FIXTURES.BMAUPIN_MINIMAL,
      json: false,
    });
  });

  it("parses --json", () => {
    const opts = parseCompareTextArgv([
      PDF_FIXTURES.BMAUPIN_BASIC,
      PDF_FIXTURES.BMAUPIN_MINIMAL,
      "--json",
    ]);
    expect(opts?.json).toBe(true);
  });

  it("requires two PDF paths", () => {
    expect(parseCompareTextArgv([PDF_FIXTURES.BMAUPIN_BASIC])).toBeNull();
  });
});

describe("formatTextDiffReport", () => {
  it("includes summary fields", () => {
    const report = formatTextDiffReport("a.pdf", "b.pdf", {
      rectsA: [],
      rectsB: [],
      changes: [{ pageIndex: 0, kind: "insert", text: "hello" }],
      hasTextLayer: true,
    });
    expect(report).toContain("PDF Text Compare");
    expect(report).toContain("Changes: 1");
  });
});
