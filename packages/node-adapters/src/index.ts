import type { GopdfRuntime } from "@gopdfjs/ports";
import { createNodeCanvasPort } from "./canvas.ts";
import { createNodeEngine } from "./engine.ts";
import { createNodeOcrPort } from "./ocr.ts";
import { createNodePdfJsRuntime } from "./pdfjs.ts";

/** Async Node runtime bundle for gopdf-cli commands. */
export async function createNodeRuntime(): Promise<GopdfRuntime> {
  const [engine, pdfjs, canvas, ocr] = await Promise.all([
    createNodeEngine(),
    createNodePdfJsRuntime(),
    createNodeCanvasPort(),
    createNodeOcrPort(),
  ]);
  return { engine, pdfjs, canvas, ocr };
}

export { createNodeEngine } from "./engine.ts";
export { createNodeCanvasPort } from "./canvas.ts";
export { createNodePdfJsRuntime } from "./pdfjs.ts";
export { createNodeOcrPort } from "./ocr.ts";
