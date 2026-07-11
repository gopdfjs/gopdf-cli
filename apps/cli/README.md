# @gopdfjs/pdf-cli

Local PDF CLI (`gopdf`). Reads/writes files on disk only — no upload.

## Dev (this repo only)

```bash
pnpm install
pnpm build:wasm
pnpm build:cli
pnpm test
node apps/cli/dist/index.mjs compress packages/fixtures/pdf/py-pdf-libre-writer.pdf
```

Bin: **`gopdf`** (alias **`gopdf-cli`**).

## TUI (Ink)

Interactive terminal when stdout/stderr are TTYs:

- **Help** — grouped command catalog + colors
- **Progress** — compress / OCR / pdf-to-jpeg
- **Spinner** — grayscale / linearize
- **Summaries** — compress stats, analyze report

Disable for CI/scripts:

```bash
gopdf --plain compress doc.pdf
GOPDF_PLAIN=1 gopdf analyze doc.pdf
```
