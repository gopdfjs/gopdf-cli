import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ENGINE_OPERATIONS, executeEngineOperation, saveOperationResult } from "./lib/engineOperation.ts";

const { getEngine } = vi.hoisted(() => ({ getEngine: vi.fn() }));
vi.mock("./lib/getEngine.ts", () => ({ getEngine: () => getEngine() }));

const tempDirs: string[] = [];
afterEach(() => {
  vi.clearAllMocks();
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("engine operation bridge", () => {
  it("maps every pending Node method to its CLI command", () => {
    expect(Object.keys(ENGINE_OPERATIONS)).toEqual([
      "merge", "split", "rotate", "organize", "crop", "protect", "unlock", "watermark",
      "sign", "halve", "n-up", "fill-form", "page-numbers", "header-footer", "native-text-edit",
      "jpg-to-pdf", "redact", "pdf-to-word", "pdf-to-excel", "pdf-to-ppt", "pdf-to-epub",
      "repair", "repair-batch", "extract-images", "extract-text-runs", "apply-edits",
    ]);
  });

  it("calls the selected engine method after resolving byte-file arguments", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gopdf-operation-"));
    tempDirs.push(dir);
    const input = path.join(dir, "input.pdf");
    fs.writeFileSync(input, Buffer.from([1, 2, 3]));
    const mergePdfs = vi.fn(async (inputs: Uint8Array[]) => inputs[0]);
    getEngine.mockResolvedValue({ mergePdfs });

    await expect(executeEngineOperation("merge", { args: [[{ file: input }]] })).resolves.toEqual(new Uint8Array([1, 2, 3]));
    expect(mergePdfs).toHaveBeenCalledWith([new Uint8Array([1, 2, 3])]);
  });

  it("writes binary engine results to the requested path", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gopdf-operation-"));
    tempDirs.push(dir);
    const output = path.join(dir, "out.pdf");
    await saveOperationResult(new Uint8Array([4, 5]), output);
    expect(fs.readFileSync(output)).toEqual(Buffer.from([4, 5]));
  });

  it("writes repaired PDF bytes while preserving the repair report", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gopdf-operation-"));
    tempDirs.push(dir);
    const output = path.join(dir, "repaired.pdf");
    const summary = await saveOperationResult({ bytes: new Uint8Array([6]), report: { validated: true } }, output);
    expect(fs.readFileSync(output)).toEqual(Buffer.from([6]));
    expect(summary).toContain('"validated": true');
  });
});
