# RFC 0001 — gopdf-cli consumes `@gopdfjs/*` npm + exposes every `Gopdf` command

- **Status**: In progress
- **Author**: GoPDF maintainers
- **Date**: 2026-07-11
- **Repo**: **this repo** (`gopdf-cli`) — **not** `gopdfjs` monorepo

## 1. Objective

`gopdf` is a thin Node CLI over published **`@gopdfjs/engine`** + **`@gopdfjs/adapter-node`**.

- **One subcommand** per **`Gopdf` method** that works on Node (see §5).
- **No** direct `import { compressPdf } from "@gopdfjs/engine"` in commands — only `createEngine` in `getEngine.ts`.
- **No** `@gopdfjs/plugin-*` imports — plugins are wired **inside** `createEngine`.
- **No** `@gopdfjs/extract`, pdf-lib, pdfjs-dist, or duplicate PDF logic in `apps/cli`.
- **Adapter** bootstraps runtime only; **all PDF work** is `engine.*()`.

Upstream API authority: **gopdfjs** [0058 §2.6](https://github.com/gopdfjs/gopdfjs/blob/main/.spec/rfc/completed/0058-engine-plugin-charter.md) (`createEngine.ts` method table).

## 2. Repo layout

| Path | Role |
|------|------|
| `apps/cli` | `@gopdfjs/pdf-cli` — `gopdf` bin, subcommands, `gopdf mcp`, Ink TUI |
| `apps/cli/src/lib/getEngine.ts` | **Only** boot site: `createEngine(await createNodeAdapter())` |
| `apps/cli/src/lib/runEngineCommand.ts` | Shared `getEngine()` + error/exit wrapper |
| `packages/setup` | `@gopdf-cli/setup` — MCP config for Cursor/Claude/Windsurf |
| `fixtures/pdf/` | Test PDFs (`pnpm fixtures:download`) |

**Removed / out of scope for CLI PDF work:** vendored `packages/engine`, `packages/node-adapters`, `packages/cli` (superseded by `apps/cli`).

## 3. Layer stack (mandatory mental model)

```
gopdf <cmd>
  → getEngine() → Gopdf
       ↓
  createEngine(adapter)          @gopdfjs/engine   ← consumer entry
       ↓ wires @gopdfjs/plugin-* internally
       ↓ createGopdfRuntime(adapter)
  createNodeAdapter()            @gopdfjs/adapter-node   ← host ports (WASM, pdf.js, canvas, OCR)
       ↓
  @gopdfjs/wasm
```

| Layer | Package | CLI uses |
|-------|---------|----------|
| **Engine** | `@gopdfjs/engine` | `createEngine(adapter)` → `Gopdf`; **`engine.*()`** in every command |
| **Adapter** | `@gopdfjs/adapter-node` | `createNodeAdapter()` only — boot once inside `getEngine.ts`, never from commands |
| **Plugins** | `@gopdfjs/plugin-*` | **Never imported** — assembled inside `createEngine` |
| **WASM** | `@gopdfjs/wasm` | **Never imported** — loaded by adapter |

## 4. Boot (mandatory)

**Canonical** (implemented in `getEngine.ts`):

```ts
import type { Gopdf } from "@gopdfjs/engine";
import { createEngine } from "@gopdfjs/engine";
import { createNodeAdapter } from "@gopdfjs/adapter-node";

const engine: Gopdf = createEngine(await createNodeAdapter());
await engine.compressPdf(bytes, "recommended");
```

**CLI singleton** (`apps/cli/src/lib/getEngine.ts`):

```ts
enginePromise ??= createNodeAdapter().then((adapter) => createEngine(adapter));
```

Commands and MCP tools **must** go through `getEngine()` → `engine.*()`. No second boot path.

**Runtime dependency:** `@gopdfjs/pdf-cli` pins `@gopdfjs/adapter-node`; `@gopdfjs/engine` is transitive. Direct `@gopdfjs/engine` import is allowed **only** in `getEngine.ts` (`createEngine`, `Gopdf` type).

## 5. Forbidden in `apps/cli`

| Forbidden | Why |
|-----------|-----|
| `import … from "@gopdfjs/plugin-*"` | Plugins are engine-internal |
| `import … from "@gopdfjs/wasm"` | Adapter loads WASM |
| `import … from "@gopdfjs/extract"` | Use `engine.*()` instead |
| `import { compressPdf } from "@gopdfjs/engine"` | Only `createEngine` + instance methods |
| pdf-lib, pdfjs-dist, tesseract.js, `@napi-rs/canvas` as CLI deps | Come transitively via adapter |
| Calling adapter port methods from commands | Adapter is input to `createEngine`, not CLI API |
| Vendored `packages/engine` for new features | npm facade only |

**Allowed CLI-local logic (not Gopdf API):** argv parsing, Ink TUI, I/O helpers, MCP wiring, token-cost heuristics for `compare-tokens` (`apps/cli/src/lib/tokenEstimate.ts`).

## 6. Command map (`Gopdf` → `gopdf <cmd>`)

Subcommand names = kebab-case of method name (drop `Pdf` suffix where redundant).

| `Gopdf` method | CLI subcommand | Node | Status |
|----------------|----------------|------|--------|
| `compressPdf` | `compress` | ✓ | **done** — `engine.compressPdf` |
| `grayscalePdf` | `grayscale` | ✓ | **done** — `engine.grayscalePdf` |
| `linearizePdf` | `linearize` | ✓ | **done** — `engine.linearizePdf` |
| `pdfToJpeg` | `pdf-to-jpeg` | ✓ | **done** — `engine.pdfToJpeg`; alias `pdf-to-jpg` |
| `pdfToText` | `pdf-to-text` | ✓ | **done** — `engine.pdfToText` |
| `ocr` | `ocr` | ✓ | **done** — `engine.ocr` |
| `analyzePdf` | `analyze` | ✓ | **done** — `engine.analyzePdf` |
| — | `compare-tokens` | ✓ | **interim** — `engine.analyzePdf` + `engine.pdfToText` + local `tokenEstimate.ts`; rename → `compare-text` when aligned with `comparePdfText` |
| `mergePdfs` | `merge` | ✓ | pending |
| `splitPdf` | `split` | ✓ | pending |
| `rotatePdf` | `rotate` | ✓ | pending |
| `organizePdf` | `organize` | ✓ | pending |
| `cropPdf` | `crop` | ✓ | pending |
| `protectPdf` | `protect` | ✓ | pending |
| `unlockPdf` | `unlock` | ✓ | pending |
| `watermarkPdf` | `watermark` | ✓ | pending |
| `signPdf` | `sign` | ✓ | pending |
| `halvePdf` | `halve` | ✓ | pending |
| `nUpPdf` | `n-up` | ✓ | pending |
| `fillPdfForm` | `fill-form` | ✓ | pending |
| `addPageNumbers` | `page-numbers` | ✓ | pending |
| `addHeaderFooter` | `header-footer` | ✓ | pending |
| `applyNativeTextEdits` | `native-text-edit` | ✓ | pending |
| `jpgToPdf` | `jpg-to-pdf` | ✓ | pending |
| `redactPdf` | `redact` | ✓ | pending |
| `pdfToWord` | `pdf-to-word` | ✓ | pending |
| `pdfToExcel` | `pdf-to-excel` | ✓ | pending |
| `pdfToPpt` | `pdf-to-ppt` | ✓ | pending |
| `pdfToEpub` | `pdf-to-epub` | ✓ | pending |
| `repairPdf` | `repair` | ✓ | pending |
| `repairPdfBatch` | `repair-batch` | ✓ | pending |
| `extractImages` | `extract-images` | ✓ | pending |
| `extractPdfTextRuns` | `extract-text-runs` | ✓ | pending |
| `applyEdits` | `apply-edits` | ✓ | pending |
| `comparePdfText` | `compare-text` | ✓ | pending (replaces `compare-tokens`) |
| `htmlToPdf` | — | ✗ | browser/DOM — CLI prints clear error |
| `markdownToHtml` | — | ✗ | browser/DOM |
| `createCompareSession` | — | ✗ | DOM session — not terminal |
| `visualDiffCanvases` | — | ✗ | canvas/DOM |

**Meta commands (not `Gopdf`):** `mcp`, `install` — implemented.

## 7. I/O contract

| Pattern | Rule |
|---------|------|
| Input PDF | positional path or `-i` / `--input` |
| Output PDF | `-o` / `--output` or stdout (binary tools: stderr for logs only) |
| Multi PDF | variadic paths or `--inputs` JSON |
| Options | flags map 1:1 to `Gopdf` method options (JSON file for complex structs) |
| Exit code | `0` success · non-zero on engine throw |
| TUI | Ink progress/spinner/help; disable with `--plain`, `--no-ui`, or `GOPDF_PLAIN=1` |

Shared helper: `runEngineCommand(name, fn)` — wraps `getEngine()` then `fn(engine)`.

## 8. MCP

`gopdf mcp` tools **must** call the same `engine.*()` paths as CLI subcommands via `getEngine()`.

**Implemented today:** `compress_pdf`, `grayscale_pdf`, `linearize_pdf`, `analyze_pdf`, `pdf_to_jpeg`, `ocr_pdf`, `pdf_to_text`, `compare_pdf_tokens`.

**Target:** mirror every §6 Node ✓ row as an MCP tool when the CLI subcommand lands.

## 9. Migration (this repo)

| Was | Now |
|-----|-----|
| `packages/cli` | `apps/cli` |
| `packages/node-adapters` | deleted — use `@gopdfjs/adapter-node` |
| `import { compressPdf } from "@gopdfjs/engine"` in commands | `engine.compressPdf` via `getEngine()` |
| `@gopdfjs/extract` in commands | `engine.*()` |
| pdf-lib `analyze.ts` | `engine.analyzePdf` |
| Direct adapter usage in commands | `getEngine()` only |
| Vendored `packages/engine` for CLI | **deprecate** — npm `@gopdfjs/engine` from registry |

**Remaining:** add §6 pending subcommands · rename `compare-tokens` → `compare-text` · remove stale `packages/*` duplicates when safe · full MCP parity.

## 10. Success criteria

- [x] Existing transform/extract cmds use `getEngine()` → `engine.*()`
- [x] `getEngine()` uses `createEngine(await createNodeAdapter())`
- [x] Zero commands import `@gopdfjs/extract` or `@gopdfjs/plugin-*`
- [x] `pnpm --filter=@gopdfjs/pdf-cli test` passes (fixture-backed integration tests)
- [ ] All §6 Node ✓ rows have `gopdf <cmd>` implemented
- [ ] `gopdf mcp` exposes same tool set as full command surface
- [ ] README lists full command table + layer stack
- [ ] Vendored `packages/engine` removed or clearly non-CLI

## 11. Related

- **gopdfjs** [`docs/PUBLISHING.md`](https://github.com/gopdfjs/gopdfjs/blob/main/docs/PUBLISHING.md) — npm publish
- **gopdfjs** [0058 §2.6](https://github.com/gopdfjs/gopdfjs/blob/main/.spec/rfc/completed/0058-engine-plugin-charter.md) — `Gopdf` method authority
- **gopdfjs** [site — Engine API](https://github.com/gopdfjs/gopdfjs/blob/main/apps/site/public/docs/api/engine.md) — public consumer docs
