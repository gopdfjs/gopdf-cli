# @gopdf-cli/site

Static docs site for **gopdf CLI** — install, commands, and **MCP setup for AI agents** (Cursor, Claude, Windsurf).

Built with [WSX](https://www.wsxjs.dev) + [wsx-press](https://www.wsxjs.dev) for markdown docs. Deploy target: **GitHub Pages** (`/gopdf-cli/` base).

## Commands

```bash
pnpm --filter=@gopdf-cli/site dev
pnpm --filter=@gopdf-cli/site build
pnpm --filter=@gopdf-cli/site preview
```

## Content

| Path | Purpose |
|------|---------|
| `src/` | WSX pages (home, commands, shell) |
| `public/docs/` | Markdown — getting started, MCP, command reference |
| `public/locales/` | i18next JSON (en, zh) |

## Key docs

- `public/docs/guide/mcp.md` — **primary AI/agent page** (MCP tools, install, troubleshooting)
- `public/docs/guide/installation.md` — script / npm / Homebrew
- `public/docs/reference/commands.md` — full CLI + MCP tool map
- `public/install.js` — curl installer (mirror of `scripts/install.js`)

Engine library docs live in the [gopdfjs](https://github.com/gopdfjs/gopdfjs) monorepo.
