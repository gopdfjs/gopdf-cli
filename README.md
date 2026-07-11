# gopdf-cli

Standalone Node monorepo for **`gopdf`** / **`gopdf-cli`** (`@gopdfjs/pdf-cli`).

Engine via published **`@gopdfjs/adapter-node`** + **`@gopdfjs/engine`** — no local Rust/WASM build. **No sibling gopdfjs repo required** for CLI dev/build.

## Layout

```
gopdf-cli/
  apps/
    cli/                    @gopdfjs/pdf-cli — bin (`gopdf`, `gopdf mcp`, `gopdf install …`)
    site/                   @gopdf-cli/site — docs + MCP guide (GitHub Pages)
  packages/
    setup/                  @gopdf-cli/setup — MCP agent config installer (CLI-only, not @gopdfjs/*)
  fixtures/
    pdf/                    test PDFs
```

## Dev

```bash
pnpm install
pnpm build
pnpm test
```

```bash
node apps/cli/dist/index.mjs compress fixtures/pdf/py-pdf-libre-writer.pdf
```

## Publish

`@gopdfjs/pdf-cli` on npm. Lib packages here are workspace-private unless published separately.
