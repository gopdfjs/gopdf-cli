import { afterEach, describe, expect, it, vi } from "vitest";
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

describe("tui TTY detection", () => {
  const originalPlain = process.env.GOPDF_PLAIN;
  const originalCi = process.env.CI;
  const errDesc = Object.getOwnPropertyDescriptor(process.stderr, "isTTY");
  const outDesc = Object.getOwnPropertyDescriptor(process.stdout, "isTTY");

  function setTty(stream: NodeJS.WriteStream, value: boolean | undefined): void {
    Object.defineProperty(stream, "isTTY", {
      value,
      configurable: true,
      writable: true,
    });
  }

  afterEach(() => {
    process.env.GOPDF_PLAIN = originalPlain;
    process.env.CI = originalCi;
    restoreTty(process.stderr, errDesc);
    restoreTty(process.stdout, outDesc);
    vi.restoreAllMocks();
  });

  function restoreTty(
    stream: NodeJS.WriteStream,
    desc: PropertyDescriptor | undefined,
  ): void {
    if (desc) {
      Object.defineProperty(stream, "isTTY", desc);
    } else {
      delete (stream as { isTTY?: boolean }).isTTY;
    }
  }

  // Regression: `isTTY` is a boolean property, not a function — calling it
  // as `isTTY()` threw "isTTY is not a function" and crashed every command.
  it("reads isTTY as a property without throwing", () => {
    delete process.env.GOPDF_PLAIN;
    delete process.env.CI;
    setTty(process.stderr, true);
    setTty(process.stdout, true);
    expect(() => shouldUseTui(["compress"])).not.toThrow();
    expect(shouldUseTui(["compress"])).toBe(true);
  });

  it("returns false when a stream is not a TTY", () => {
    delete process.env.GOPDF_PLAIN;
    delete process.env.CI;
    setTty(process.stderr, true);
    setTty(process.stdout, undefined);
    expect(shouldUseTui(["compress"])).toBe(false);
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
