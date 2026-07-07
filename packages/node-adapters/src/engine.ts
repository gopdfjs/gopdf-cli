import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GopdfEngine, ImageFormat } from "@gopdfjs/ports/engine";

const here = path.dirname(fileURLToPath(import.meta.url));
const ENGINE_ROOT = path.resolve(here, "../engine");
const WASM_JS = path.join(ENGINE_ROOT, "pkg/gopdf_wasm.js");

const WASM_BG_CANDIDATES = [
  path.resolve(here, "../../cli/dist/pkg/gopdf_wasm_bg.wasm"),
  path.join(ENGINE_ROOT, "pkg/gopdf_wasm_bg.wasm"),
];

function resolveWasmPath(): string {
  for (const candidate of WASM_BG_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `WASM not found. Run \`pnpm build:wasm\` then \`pnpm build:cli\`.\nChecked:\n${WASM_BG_CANDIDATES.join("\n")}`,
  );
}

let initialized = false;

async function loadWasmModule() {
  if (!fs.existsSync(WASM_JS)) {
    throw new Error(`Missing ${WASM_JS}. Run \`pnpm build:wasm\`.`);
  }
  const { compress_pdf, encode_images, grayscale_pdf, linearize_pdf, initSync } =
    await import(WASM_JS);

  if (!initialized) {
    initSync({ module: new Uint8Array(fs.readFileSync(resolveWasmPath())) });
    initialized = true;
  }

  return { compress_pdf, encode_images, grayscale_pdf, linearize_pdf };
}

/** Node adapter: sync WASM behind async GopdfEngine contract. */
export async function createNodeEngine(): Promise<GopdfEngine> {
  const wasm = await loadWasmModule();
  return {
    async compressPdf(bytes, level, onProgress) {
      return wasm.compress_pdf(
        bytes,
        level,
        onProgress ? (p: number) => onProgress(p) : undefined,
      );
    },
    async encodeImages(pixelsFlat, widths, heights, format: ImageFormat, quality = 92) {
      return wasm.encode_images(
        pixelsFlat,
        new Uint32Array(widths),
        new Uint32Array(heights),
        format,
        quality,
      );
    },
    async grayscalePdf(bytes) {
      return wasm.grayscale_pdf(bytes);
    },
    async linearizePdf(bytes) {
      return wasm.linearize_pdf(bytes);
    },
  };
}
