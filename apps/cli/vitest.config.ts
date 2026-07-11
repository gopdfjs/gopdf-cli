import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const CLI_DIR = fileURLToPath(new URL(".", import.meta.url));

/** Follow pnpm symlink so nested @gopdfjs/engine resolves correctly. */
function resolveGopdfEntries(): { adapterNode: string; engine: string } {
  const adapterLink = path.join(
    CLI_DIR,
    "node_modules/@gopdfjs/adapter-node",
  );
  const adapterRoot = fs.realpathSync(adapterLink);
  const gopdfScope = path.dirname(adapterRoot);
  return {
    adapterNode: path.join(adapterRoot, "dist/index.js"),
    engine: path.join(gopdfScope, "engine/dist/index.js"),
  };
}

const { adapterNode: ADAPTER_NODE_ENTRY, engine: ENGINE_ENTRY } =
  resolveGopdfEntries();

function gopdfPackageResolve(): Plugin {
  return {
    name: "gopdf-package-resolve",
    enforce: "pre",
    resolveId(source) {
      if (source === "@gopdfjs/adapter-node") {
        return ADAPTER_NODE_ENTRY;
      }
      if (source === "@gopdfjs/engine") {
        return ENGINE_ENTRY;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [gopdfPackageResolve()],
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    conditions: ["import", "node", "default"],
  },
  test: {
    environment: "node",
    globals: true,
    env: {
      GOPDF_PLAIN: "1",
    },
    server: {
      deps: {
        inline: ["@gopdfjs/adapter-node", "@gopdfjs/engine"],
      },
    },
  },
});
