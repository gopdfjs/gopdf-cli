---
title: Getting started
order: 1
category: guide
description: 'Install gopdf and run your first local PDF command'
---

# Getting started

**gopdf** (`@gopdfjs/pdf-cli`) is a terminal tool for local PDF work — compress, analyze, OCR, and more. Files stay on your machine; nothing is uploaded.

## Install

Pick one:

```bash
# 1. Script (recommended)
curl -fsSL https://gopdfjs.github.io/gopdf-cli/install.js | node

# 2. npm
npm install -g @gopdfjs/pdf-cli

# 3. Homebrew (luban-homebrew tap)
brew install --HEAD systembugtj/luban-homebrew/gopdf
```

Verify:

```bash
gopdf --help
```

Full details: [Installation](./installation).

## First command

```bash
gopdf compress ./document.pdf -o ./document-smaller.pdf
```

Other common commands:

```bash
gopdf analyze ./document.pdf
gopdf pdf-to-text ./document.pdf
gopdf grayscale ./document.pdf -o ./gray.pdf
```

## Use with AI (MCP)

```bash
gopdf install cursor --project   # Cursor in this repo
gopdf install claude             # Claude Desktop (user scope)
gopdf install --all              # All supported user-scope agents
```

Then restart the agent host and ask it to compress or analyze a **local file path**.

See [MCP for AI agents](./mcp) for full setup, tool list, and copy-paste context for LLMs.

## Engine

gopdf uses published **`@gopdfjs/engine`** + **`@gopdfjs/adapter-node`** from the [gopdfjs](https://github.com/gopdfjs/gopdfjs) monorepo. You do **not** build Rust/WASM in gopdf-cli — npm ships the engine.

## Related

- [Installation](./installation)
- [MCP for AI agents](./mcp)
- [Command reference](../reference/commands)
