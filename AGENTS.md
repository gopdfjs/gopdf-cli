# gopdf-cli

**Standalone** Node monorepo. No dependency on sibling `gopdfjs` checkout.

| Path | Role |
|------|------|
| `packages/cli` | `gopdf` bin — argv, commands, MCP |
| `packages/node-adapters` | `createNodeRuntime()` |
| `packages/engine` | WASM + `GopdfEngine` |
| `packages/extract` | pdf→jpg/text/ocr |
| `crates/` | Rust source |

```bash
pnpm build:wasm && pnpm build:cli && pnpm test
```
