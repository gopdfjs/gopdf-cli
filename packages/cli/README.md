# @gopdfjs/pdf-cli

Local PDF CLI (`gopdf`). Reads/writes files on disk only — no upload.

## Dev (this repo only)

```bash
pnpm install
pnpm build:wasm
pnpm build:cli
pnpm test
node packages/cli/dist/index.mjs compress packages/fixtures/pdf/py-pdf-libre-writer.pdf
```

Bin: **`gopdf`** (alias **`gopdf-cli`**).
