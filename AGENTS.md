# gopdf-cli

**Standalone** Node monorepo. Spec: **`.spec/`** (this repo). npm API authority: **gopdfjs** `@gopdfjs/engine`.

| Path | Role |
|------|------|
| `.spec/rfc/` | **CLI RFCs live here** — not in gopdfjs monorepo |
| `apps/cli` | `gopdf` bin — subcommands, **`gopdf mcp`**, **`gopdf install`** |
| `packages/setup` | **`@gopdf-cli/setup`** — MCP config for Cursor/Claude/Windsurf |

**Consume published npm:**

```ts
import { createNodeGopdf } from "@gopdfjs/adapter-node";
const engine = await createNodeGopdf();
```

See [RFC 0001](.spec/rfc/0001-consume-engine-npm.md) — one `gopdf <cmd>` per Node-capable `Gopdf` method.

```bash
pnpm build:wasm && pnpm build:cli && pnpm test
```
