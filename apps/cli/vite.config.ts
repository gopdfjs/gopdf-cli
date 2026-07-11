import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
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
        "@gopdfjs/adapter-node",
        "@gopdfjs/engine",
        "@gopdfjs/extract",
        "@gopdf-cli/setup",
        "@modelcontextprotocol/sdk",
        "@napi-rs/canvas",
        "ink",
        "react",
        "scheduler",
        "pdf-lib",
        "pdfjs-dist",
        "tesseract.js",
        /^@modelcontextprotocol\//,
        /^node:/,
      ],
    },
  },
  esbuild: {
    jsx: "automatic",
  },
});
