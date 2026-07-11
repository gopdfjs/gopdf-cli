---
title: FAQ
order: 1
category: faq
description: 'Common questions about gopdf CLI and MCP'
---

# FAQ

## How do I install gopdf?

**Script:** `curl -fsSL https://gopdfjs.github.io/gopdf-cli/install.js | node`

**npm:** `npm install -g @gopdfjs/pdf-cli`

**Homebrew:** `brew install --HEAD systembugtj/luban-homebrew/gopdf` (stable after npm publish)

See [Installation](../guide/installation).

## Is gopdf the same as GoPDF.js?

**gopdf-cli** is the terminal product (`gopdf` bin). **[GoPDF.js](https://github.com/gopdfjs/gopdfjs)** is the npm engine library (`@gopdfjs/engine`, adapters, plugins). The CLI consumes the published engine — you embed GoPDF.js in apps; you install gopdf for the shell and MCP.

## Do files get uploaded?

No. All commands read and write **local paths** only.

## Do I need Rust or wasm-pack?

No. WASM ships inside `@gopdfjs/adapter-node` on npm. Contributors only run `pnpm build` in gopdf-cli.

## How do I use gopdf with Cursor / Claude?

Install globally, then:

```bash
gopdf install cursor --project
```

Restart the editor. See [MCP for AI agents](../guide/mcp).

## MCP server won't start

1. `which gopdf` — must be on PATH (or use absolute path in MCP config).
2. Run `gopdf mcp` in a terminal — stderr should show `gopdf-mcp-server connected`.
3. Validate JSON in your MCP config file.

## `--plain` / TUI

Ink UI activates on TTY stdout/stderr. Disable for CI:

```bash
gopdf --plain compress doc.pdf
GOPDF_PLAIN=1 gopdf analyze doc.pdf
```

## Where is the spec?

CLI RFCs live in the [gopdf-cli repo](https://github.com/gopdfjs/gopdf-cli) under `.spec/rfc/`.

## Related

- [Getting started](../guide/getting-started)
- [MCP for AI agents](../guide/mcp)
