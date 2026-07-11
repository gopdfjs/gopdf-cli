import type { Gopdf } from "@gopdfjs/engine";
import { createEngine } from "@gopdfjs/engine";
import { createNodeAdapter } from "@gopdfjs/adapter-node";

/** Lazy singleton — adapter boot ONLY here; commands call `engine.*()`. */
export type GopdfEngine = Gopdf;

let enginePromise: Promise<GopdfEngine> | undefined;

export function getEngine(): Promise<GopdfEngine> {
  enginePromise ??= createNodeAdapter().then((adapter) => createEngine(adapter));
  return enginePromise;
}

export function resetEngineForTests(): void {
  enginePromise = undefined;
}
