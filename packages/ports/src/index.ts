/**
 * @gopdfjs/ports — adapter contracts only (no fs, no DOM, no WASM impl).
 *
 * ## Async by default
 * - Factories return `Promise<…>` (`CreateGopdfRuntime`, `CreateGopdfEngine`, …).
 * - Port methods that touch I/O, WASM, canvas encode, pdf.js, or OCR return `Promise`.
 * - `onProgress` callbacks stay sync (event channel).
 * - Pure byte transforms with no I/O stay sync in domain pkgs (`runners`, `splitEncodedImages`).
 *
 * ## Layout
 * - gopdfjs: agnostic tools + browser adapter impls
 * - gopdf-cli: Node adapter impls + IoPort (not in this package)
 */

export type {
  CompressionLevel,
  CreateGopdfEngine,
  GopdfEngine,
  ImageFormat,
} from "./engine.ts";

export type {
  CanvasPort,
  CanvasSurface,
  CreateCanvasPort,
  CreatePdfJsRuntime,
  PdfDocument,
  PdfPage,
  PdfJsRuntime,
  PdfTextContentItem,
  PdfViewport,
} from "./render.ts";

export type { CreateOcrPort, OcrPort } from "./ocr.ts";

export type { CreateGopdfRuntime, GopdfRuntime } from "./runtime.ts";
