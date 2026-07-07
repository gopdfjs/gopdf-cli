import type { GopdfEngine } from "./engine.ts";
import type { CanvasPort, PdfJsRuntime } from "./render.ts";
import type { OcrPort } from "./ocr.ts";

/**
 * Capability bundle injected into env-agnostic tool functions.
 * Browser: shipped prebuilt from gopdfjs (`createBrowserRuntime`).
 * Node: built in gopdf-cli (`createNodeRuntime`).
 */
export interface GopdfRuntime {
  readonly engine: GopdfEngine;
  readonly pdfjs: PdfJsRuntime;
  readonly canvas: CanvasPort;
  /** Present on Node CLI; omit in browser-only hosts. */
  readonly ocr?: OcrPort;
}

/**
 * Single async entry — initializes WASM, pdf.js, canvas backend before use.
 * Never sync-construct runtimes; Worker/WASM/fs may all need await.
 */
export type CreateGopdfRuntime = () => Promise<GopdfRuntime>;
