import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    conditions: ["import", "node", "default"],
    alias: {
      "@gopdfjs/adapter-node": resolve(
        __dirname,
        "node_modules/@gopdfjs/adapter-node/dist/index.js",
      ),
      "@gopdfjs/extract": resolve(__dirname, "../../packages/extract/src/index.ts"),
      "@gopdfjs/engine": resolve(__dirname, "../../packages/engine/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    env: {
      GOPDF_PLAIN: "1",
    },
    server: {
      deps: {
        inline: ["@gopdfjs/adapter-node"],
      },
    },
  },
});
