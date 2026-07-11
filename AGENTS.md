# gopdf-cli

**Standalone** Node monorepo. Spec: **`.spec/`** (this repo). npm API authority: **gopdfjs** `@gopdfjs/engine`.

| Path | Role |
|------|------|
| `.spec/rfc/` | **CLI RFCs live here** — not in gopdfjs monorepo |
| `apps/cli` | `gopdf` bin — subcommands, **`gopdf mcp`**, **`gopdf install`** |
| `packages/setup` | **`@gopdf-cli/setup`** — MCP config for Cursor/Claude/Windsurf |

## Layer stack

```
gopdf <cmd>  →  getEngine()  →  Gopdf  →  engine.*()
                    ↓
              createEngine(adapter)     @gopdfjs/engine
                    ↓ wires plugin-* internally
              createNodeAdapter()       @gopdfjs/adapter-node
                    ↓
              @gopdfjs/wasm
```

**Canonical boot:**

```ts
import { createEngine } from "@gopdfjs/engine";
import { createNodeAdapter } from "@gopdfjs/adapter-node";

const engine = createEngine(await createNodeAdapter());
await engine.compressPdf(bytes, "recommended");
```

**CLI:** lazy singleton in `apps/cli/src/lib/getEngine.ts` — commands **never** boot adapter themselves.

| Package | Role |
|---------|------|
| `@gopdfjs/engine` | `createEngine(adapter)` → `Gopdf`; every subcommand calls `engine.*()` |
| `@gopdfjs/adapter-node` | `createNodeAdapter()` — boot **only** inside `getEngine()` |
| `@gopdfjs/plugin-*` | **Forbidden** in CLI — wired inside `createEngine` |

**Forbidden in `apps/cli` commands:** `@gopdfjs/plugin-*`, `@gopdfjs/wasm`, direct `import { compressPdf } from "@gopdfjs/engine"`, pdf-lib, pdfjs-dist, or any adapter API beyond the `getEngine()` boot.

See [RFC 0001](.spec/rfc/0001-consume-engine-npm.md) — one `gopdf <cmd>` per Node-capable `Gopdf` method.

```bash
pnpm build && pnpm test
```
