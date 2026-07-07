import { describe, expect, it } from "vitest";
import type {
  CanvasPort,
  CreateGopdfRuntime,
  GopdfEngine,
  GopdfRuntime,
  OcrPort,
  PdfJsRuntime,
} from "./index.ts";

/** Compile-time + runtime check: factories and ports are Promise-based. */
describe("@gopdfjs/ports async contract", () => {
  it("factory resolves to runtime with async port methods", async () => {
    const engine: GopdfEngine = {
      compressPdf: async () => new Uint8Array(),
      encodeImages: async () => new Uint8Array(),
      grayscalePdf: async () => new Uint8Array(),
      linearizePdf: async () => new Uint8Array(),
    };

    const pdfjs: PdfJsRuntime = {
      loadDocument: async () => ({ numPages: 0, getPage: async () => notImplemented() }),
      getOps: async () => ({}),
    };

    const canvas: CanvasPort = {
      create: async () => ({
        width: 1,
        height: 1,
        getContext2d: () => ({}) as CanvasRenderingContext2D,
        toImageBytes: async () => new Uint8Array(),
        dispose: async () => {},
      }),
    };

    const ocr: OcrPort = {
      recognize: async () => "",
    };

    const runtime: GopdfRuntime = { engine, pdfjs, canvas, ocr };

    const createRuntime: CreateGopdfRuntime = async () => runtime;
    const loaded = await createRuntime();

    await expect(loaded.engine.compressPdf(new Uint8Array(), "recommended")).resolves.toBeInstanceOf(
      Uint8Array,
    );
    await expect(loaded.pdfjs.loadDocument(new Uint8Array())).resolves.toMatchObject({
      numPages: 0,
    });
    const surface = await loaded.canvas.create(10, 10);
    await expect(surface.toImageBytes("png")).resolves.toBeInstanceOf(Uint8Array);
    await expect(loaded.ocr!.recognize(new Uint8Array(), "eng")).resolves.toBe("");
  });
});

function notImplemented(): never {
  throw new Error("not implemented");
}
