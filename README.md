# gopdf-cli

Standalone Node monorepo for **`gopdf`** / **`gopdf-cli`** (`@gopdfjs/pdf-cli`).

Self-contained: Rust crates, WASM engine, CLI, fixtures. **No sibling gopdfjs repo required** for CLI dev/build.

`@gopdfjs/adapter-node` (`createNodeRuntime`) is owned by **gopdfjs** — not vendored here.

## Layout

```
gopdf-cli/
  crates/                 Rust → wasm-pack → packages/engine/pkg
  apps/
    cli/                    @gopdfjs/pdf-cli — bin (`gopdf`, `gopdf mcp`, `gopdf install …`)
  packages/
    setup/                  @gopdf-cli/setup — MCP agent config installer (CLI-only, not @gopdfjs/*)
    engine/ extract/ …      @gopdfjs/* libs (vendored for this repo)
    fixtures/               test PDFs
```

## Dev

```bash
pnpm install
pnpm build:wasm
pnpm build:cli
pnpm test
```

```bash
node apps/cli/dist/index.mjs compress packages/fixtures/pdf/py-pdf-libre-writer.pdf
```

## Publish

`@gopdfjs/pdf-cli` on npm. Lib packages here are workspace-private unless published separately.
