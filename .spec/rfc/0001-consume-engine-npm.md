# RFC 0001 — gopdf-cli consumes `@gopdfjs/*` npm + exposes every `Gopdf` command

- **Status**: Proposed
- **Author**: GoPDF maintainers
- **Date**: 2026-07-11
- **Repo**: **this repo** (`gopdf-cli`) — **not** `gopdfjs` monorepo

## 1. Objective

`gopdf` is a thin Node CLI over published **`@gopdfjs/engine`** + **`@gopdfjs/adapter-node`**.

- **One subcommand** per **`Gopdf` method** that works on Node (see §3).
- **No** direct `import { compressPdf } from "@gopdfjs/engine"`.
- **No** duplicate PDF logic in this repo — consume npm only.

Upstream API authority: `gopdfjs` [0058 §2.6](https://github.com/gopdfjs/gopdfjs/blob/main/.spec/rfc/completed/0058-engine-plugin-charter.md) (`createEngine.ts` method table).

## 2. Entry (mandatory)

```ts
import { createNodeGopdf } from "@gopdfjs/adapter-node";

const engine = await createNodeGopdf();
await engine.compressPdf(bytes, "recommended");
```

| Package | Role |
|---------|------|
| `@gopdfjs/adapter-node` | `createNodeGopdf()` |
| `@gopdfjs/engine` | types + `Gopdf` surface only |

**Forbidden in CLI commands:** `@gopdfjs/plugin-*`, `@gopdfjs/wasm`, vendored engine copies for new commands.

## 3. Command map (`Gopdf` → `gopdf <cmd>`)

Subcommand names = kebab-case of method name (drop `Pdf` suffix where redundant).

| `Gopdf` method | CLI subcommand | Node | Notes |
|----------------|----------------|------|-------|
| `compressPdf` | `compress` | ✓ | exists — migrate to `engine.compressPdf` |
| `grayscalePdf` | `grayscale` | ✓ | exists — migrate |
| `linearizePdf` | `linearize` | ✓ | exists — migrate |
| `pdfToJpeg` | `pdf-to-jpeg` | ✓ | was `pdf-to-jpg` — align name |
| `pdfToText` | `pdf-to-text` | ✓ | exists — migrate |
| `ocr` | `ocr` | ✓ | exists — migrate |
| `mergePdfs` | `merge` | ✓ | |
| `splitPdf` | `split` | ✓ | |
| `rotatePdf` | `rotate` | ✓ | |
| `organizePdf` | `organize` | ✓ | |
| `cropPdf` | `crop` | ✓ | |
| `protectPdf` | `protect` | ✓ | |
| `unlockPdf` | `unlock` | ✓ | |
| `watermarkPdf` | `watermark` | ✓ | |
| `signPdf` | `sign` | ✓ | |
| `halvePdf` | `halve` | ✓ | |
| `nUpPdf` | `n-up` | ✓ | |
| `fillPdfForm` | `fill-form` | ✓ | |
| `addPageNumbers` | `page-numbers` | ✓ | |
| `addHeaderFooter` | `header-footer` | ✓ | |
| `applyNativeTextEdits` | `native-text-edit` | ✓ | |
| `jpgToPdf` | `jpg-to-pdf` | ✓ | |
| `redactPdf` | `redact` | ✓ | |
| `repairPdf` | `repair` | ✓ | |
| `repairPdfBatch` | `repair-batch` | ✓ | |
| `extractImages` | `extract-images` | ✓ | |
| `extractPdfTextRuns` | `extract-text-runs` | ✓ | |
| `pdfToWord` | `pdf-to-word` | ✓ | |
| `pdfToExcel` | `pdf-to-excel` | ✓ | |
| `pdfToPpt` | `pdf-to-ppt` | ✓ | |
| `pdfToEpub` | `pdf-to-epub` | ✓ | |
| `analyzePdf` | `analyze` | ✓ | exists — migrate |
| `applyEdits` | `apply-edits` | ✓ | |
| `comparePdfText` | `compare-text` | ✓ | was `compare-tokens` — align |
| `htmlToPdf` | — | ✗ | browser/DOM — CLI prints clear error |
| `markdownToHtml` | — | ✗ | browser/DOM |
| `createCompareSession` | — | ✗ | DOM session — not terminal |
| `visualDiffCanvases` | — | ✗ | canvas/DOM |

**Meta commands (not `Gopdf`):** `mcp`, `install` — stay as today.

## 4. I/O contract

| Pattern | Rule |
|---------|------|
| Input PDF | positional path or `-i` / `--input` |
| Output PDF | `-o` / `--output` or stdout (binary tools: stderr for logs only) |
| Multi PDF | variadic paths or `--inputs` JSON |
| Options | flags map 1:1 to `Gopdf` method options (JSON file for complex structs) |
| Exit code | `0` success · non-zero on engine throw |

Shared helper: `runEngineCommand(name, fn)` — lazy `createNodeGopdf()` singleton per process.

## 5. MCP

`gopdf mcp` tool list **must** mirror §3 Node-capable rows (same `engine.*()` calls).

## 6. Migration (this repo)

| Today | Target |
|-------|--------|
| `import { compressPdf } from "@gopdfjs/engine"` | `engine.compressPdf` via `createNodeGopdf` |
| Vendored `packages/engine` for CLI features | **deprecate** — npm `@gopdfjs/engine` from registry |
| `@gopdfjs/pdf-cli` workspace engine | pin published `@gopdfjs/engine` + `@gopdfjs/adapter-node` versions |

Phased: ship migrated existing cmds first → add missing §3 rows → remove vendored duplicates.

## 7. Success criteria

- [ ] All §3 Node ✓ rows have `gopdf <cmd>` implemented
- [ ] Zero new commands import `@gopdfjs/plugin-*`
- [ ] `pnpm test` covers each subcommand with fixture PDF
- [ ] `gopdf mcp` exposes same tool set
- [ ] Docs in `apps/site` / README list full command table

## 8. Related

- **gopdfjs** [`docs/PUBLISHING.md`](https://github.com/gopdfjs/gopdfjs/blob/main/docs/PUBLISHING.md) — npm publish (done)
- **gopdfjs** [0058 §2.6](https://github.com/gopdfjs/gopdfjs/blob/main/.spec/rfc/completed/0058-engine-plugin-charter.md) — `Gopdf` method authority
