import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ENGINE_PKG_DIR = resolve(__dirname, "../engine/pkg");
const DIST_PKG_DIR = resolve(__dirname, "dist/pkg");

function copyEnginePkgPlugin(): Plugin {
  return {
    name: "copy-engine-pkg",
    closeBundle() {
      if (!existsSync(ENGINE_PKG_DIR)) {
        throw new Error(
          `Missing ${ENGINE_PKG_DIR}. Run \`pnpm build:wasm\` from gopdf-cli root.`,
        );
      }
      cpSync(ENGINE_PKG_DIR, DIST_PKG_DIR, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [copyEnginePkgPlugin()],
  build: {
    ssr: true,
    outDir: "dist",
    emptyOutDir: true,
    target: "node18",
    rollupOptions: {
      input: resolve(__dirname, "src/index.ts"),
      output: {
        entryFileNames: "index.mjs",
        chunkFileNames: "chunks/[name]-[hash].mjs",
        format: "es",
      },
      external: [
        "@modelcontextprotocol/sdk",
        "pdf-lib",
        "@napi-rs/canvas",
        "tesseract.js",
        "pdfjs-dist",
        /^node:/,
      ],
    },
  },
  ssr: {
    noExternal: [/^@gopdfjs\//],
  },
});
