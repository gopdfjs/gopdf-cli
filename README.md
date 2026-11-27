# gopdf-cli

Standalone Node monorepo for **`gopdf`** / **`gopdf-cli`** (`@gopdfjs/pdf-cli`).

Engine via published **`@gopdfjs/adapter-node`** + **`@gopdfjs/engine`** — no local Rust/WASM build. **No sibling gopdfjs repo required** for CLI dev/build.

## Runtime layers

```text
gopdf <command> → getEngine() → Gopdf.engineMethod()
                         ↓
     createEngine(adapter)      @gopdfjs/engine
                         ↓ wires plugin-* internally
     createNodeAdapter()        @gopdfjs/adapter-node
                         ↓ loads
                    @gopdfjs/wasm
```

`getEngine()` is the only CLI boot site: it creates `@gopdfjs/adapter-node` and passes it to `createEngine()` from `@gopdfjs/engine`. Every PDF command calls an `engine.*()` method. Plugins are wired inside the engine; commands never import `@gopdfjs/plugin-*`, `@gopdfjs/wasm`, or adapter APIs.

## Commands

| Command | Engine method / purpose |
| --- | --- |
| `compress` | `compressPdf` |
| `grayscale` | `grayscalePdf` |
| `linearize` | `linearizePdf` |
| `pdf-to-jpeg` (`pdf-to-jpg`) | `pdfToJpeg` |
| `pdf-to-text` | `pdfToText` |
| `ocr` | `ocr` |
| `analyze` | `analyzePdf` |
| `compare-text` | `comparePdfText` |
| `merge`, `split`, `rotate`, `organize`, `crop` | Matching `Gopdf` methods |
| `protect`, `unlock`, `watermark`, `sign`, `halve`, `n-up` | Matching `Gopdf` methods |
| `fill-form`, `page-numbers`, `header-footer`, `native-text-edit` | Matching `Gopdf` methods |
| `jpg-to-pdf`, `redact`, `pdf-to-word`, `pdf-to-excel`, `pdf-to-ppt`, `pdf-to-epub` | Matching `Gopdf` methods |
| `repair`, `repair-batch`, `extract-images`, `extract-text-runs`, `apply-edits` | Matching `Gopdf` methods |
| `mcp`, `install` | MCP stdio server and agent configuration |

The engine methods added after `compare-text` accept `--request request.json`. The request contains the method arguments in order; represent byte inputs as `{"file":"input.pdf"}` or `{"base64":"..."}` and set `output` for binary results. Example for rotation:

```json
{"args":[{"file":"input.pdf"},90,"all"],"output":"rotated.pdf"}
```

The matching MCP tools are named `gopdf_<command>` (hyphens become underscores) and accept the same `args` and `output` fields. The existing MCP tools remain available for the original command set.

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

There is no vendored `packages/engine`; the CLI runtime uses the published npm packages.

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
