import fs from "node:fs";
import path from "node:path";
import { getEngine } from "./getEngine.ts";
import { readBytes, writeBytes } from "./io.ts";

/** Node-capable engine methods that have a corresponding CLI command. */
export const ENGINE_OPERATIONS = {
  merge: "mergePdfs",
  split: "splitPdf",
  rotate: "rotatePdf",
  organize: "organizePdf",
  crop: "cropPdf",
  protect: "protectPdf",
  unlock: "unlockPdf",
  watermark: "watermarkPdf",
  sign: "signPdf",
  halve: "halvePdf",
  "n-up": "nUpPdf",
  "fill-form": "fillPdfForm",
  "page-numbers": "addPageNumbers",
  "header-footer": "addHeaderFooter",
  "native-text-edit": "applyNativeTextEdits",
  "jpg-to-pdf": "jpgToPdf",
  redact: "redactPdf",
  "pdf-to-word": "pdfToWord",
  "pdf-to-excel": "pdfToExcel",
  "pdf-to-ppt": "pdfToPpt",
  "pdf-to-epub": "pdfToEpub",
  repair: "repairPdf",
  "repair-batch": "repairPdfBatch",
  "extract-images": "extractImages",
  "extract-text-runs": "extractPdfTextRuns",
  "apply-edits": "applyEdits",
} as const;

export type EngineOperation = keyof typeof ENGINE_OPERATIONS;

export type OperationRequest = {
  /** Method arguments in order. Use {"file": "path"} for Uint8Array inputs. */
  args: unknown[];
  /** Output path; required when the result contains binary data. */
  output?: string;
};

function resolveArgument(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveArgument);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.file === "string") return readBytes(record.file);
    if (typeof record.base64 === "string") return Uint8Array.from(Buffer.from(record.base64, "base64"));
    return Object.fromEntries(Object.entries(record).map(([key, child]) => [key, resolveArgument(child)]));
  }
  return value;
}

export async function executeEngineOperation(
  operation: EngineOperation,
  request: OperationRequest,
): Promise<unknown> {
  const engine = await getEngine();
  const method = ENGINE_OPERATIONS[operation];
  const fn = (engine as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>)[method];
  if (typeof fn !== "function") throw new Error(`Engine method unavailable: ${method}`);
  return fn.apply(engine, request.args.map(resolveArgument));
}

export async function saveOperationResult(result: unknown, output?: string): Promise<string> {
  if (result instanceof Uint8Array) {
    if (!output) throw new Error("This operation returns a file; set output in the request.");
    writeBytes(output, result);
    return output;
  }
  if (result instanceof Blob) {
    if (!output) throw new Error("This operation returns a file; set output in the request.");
    writeBytes(output, new Uint8Array(await result.arrayBuffer()));
    return output;
  }
  if (result && typeof result === "object" && (result as { bytes?: unknown }).bytes instanceof Uint8Array) {
    if (!output) throw new Error("This operation returns a file; set output in the request.");
    const value = result as { bytes: Uint8Array; report?: unknown };
    writeBytes(output, value.bytes);
    return JSON.stringify({ output, report: value.report }, null, 2);
  }
  if (Array.isArray(result) && result.every((item) => item && typeof item === "object" && (item as { blob?: unknown }).blob instanceof Blob)) {
    if (!output) throw new Error("This operation returns files; set output to a directory in the request.");
    fs.mkdirSync(output, { recursive: true });
    for (const item of result as Array<{ blob: Blob; name: string; page: number }>) {
      const safeName = path.basename(item.name || `page-${item.page}.bin`);
      writeBytes(path.join(output, safeName), new Uint8Array(await item.blob.arrayBuffer()));
    }
    return `${result.length} image(s) written to ${output}`;
  }
  if (result && typeof result === "object" && (result as { blob?: unknown }).blob instanceof Blob) {
    if (!output) throw new Error("This operation returns a file; set output in the request.");
    const value = result as { blob: Blob; analysis?: unknown };
    writeBytes(output, new Uint8Array(await value.blob.arrayBuffer()));
    return JSON.stringify({ output, analysis: value.analysis }, null, 2);
  }
  if (Array.isArray(result) && result.every((item) => item instanceof Uint8Array)) {
    if (!output) throw new Error("This operation returns files; set output in the request.");
    const ext = path.extname(output);
    const stem = ext ? output.slice(0, -ext.length) : output;
    result.forEach((bytes, index) => writeBytes(`${stem}-${index + 1}${ext || ".pdf"}`, bytes));
    return `${result.length} files written from ${output}`;
  }
  if (result && typeof result === "object" && Array.isArray((result as { items?: unknown }).items)) {
    const items = (result as { items: Array<{ fileName: string; ok: boolean; result?: { bytes: Uint8Array } }> }).items;
    if (output) {
      fs.mkdirSync(output, { recursive: true });
      for (const item of items) if (item.ok && item.result?.bytes) writeBytes(path.join(output, item.fileName), item.result.bytes);
    }
  }
  return JSON.stringify(result, (_key, value) => value instanceof Uint8Array ? { byteLength: value.byteLength } : value, 2);
}
