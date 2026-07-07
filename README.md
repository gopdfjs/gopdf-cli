# gopdf-cli

Standalone Node monorepo for **`gopdf`** / **`gopdf-cli`** (`@gopdfjs/pdf-cli`).

Self-contained: Rust crates, WASM engine, CLI, Node adapters, fixtures. **No sibling gopdfjs repo required.**

## Layout

```
gopdf-cli/
  crates/                 Rust → wasm-pack → packages/engine/pkg
  packages/
    cli/                    @gopdfjs/pdf-cli — bin
    node-adapters/          createNodeRuntime()
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
node packages/cli/dist/index.mjs compress packages/fixtures/pdf/py-pdf-libre-writer.pdf
```

## Publish

`@gopdfjs/pdf-cli` on npm. Lib packages here are workspace-private unless published separately.
