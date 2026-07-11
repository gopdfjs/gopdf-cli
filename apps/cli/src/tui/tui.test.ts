import { describe, expect, it } from "vitest";
import { buildPlainHelp } from "./commandCatalog.ts";
import { shouldUseTui, stripUiFlags } from "./shouldUseTui.ts";

describe("tui shouldUseTui", () => {
  it("disables when GOPDF_PLAIN=1", () => {
    expect(shouldUseTui(["compress"])).toBe(false);
  });

  it("strips --plain and --no-ui", () => {
    expect(stripUiFlags(["compress", "--plain", "a.pdf"])).toEqual([
      "compress",
      "a.pdf",
    ]);
    expect(stripUiFlags(["--no-ui", "help"])).toEqual(["help"]);
  });
});

describe("commandCatalog", () => {
  it("buildPlainHelp lists core commands", () => {
    const help = buildPlainHelp();
    expect(help).toContain("gopdf compress");
    expect(help).toContain("gopdf analyze");
    expect(help).toContain("--plain");
  });
});
