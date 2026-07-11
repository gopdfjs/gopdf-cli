import { createNodeGopdf } from "@gopdfjs/adapter-node";
import type { Gopdf } from "@gopdfjs/engine";

/** Lazy singleton — one WASM/pdf.js init per CLI process (RFC 0001 §4). */
let enginePromise: Promise<Gopdf> | undefined;

export function getEngine(): Promise<Gopdf> {
  enginePromise ??= createNodeGopdf();
  return enginePromise;
}

/** Test hook — reset cached engine between cases. */
export function resetEngineForTests(): void {
  enginePromise = undefined;
}
