---
title: MCP for AI agents
order: 3
category: guide
description: 'Wire gopdf into Cursor, Claude, Windsurf — local PDF tools for LLMs'
---

# MCP for AI agents

**Give this page to coding agents.** gopdf exposes a **stdio MCP server** so AI assistants can compress, analyze, OCR, and extract text from **local PDF paths** — no upload.

## How it works

```
AI host (Cursor / Claude / …)
    ↓ stdio MCP
gopdf mcp
    ↓
@gopdfjs/adapter-node → @gopdfjs/engine
    ↓
local PDF files on disk
```

Golden rules for agents:

1. **Use MCP tools** — do not shell out random PDF libraries when gopdf is configured.
2. **Paths must be absolute or cwd-relative** — tools read/write local files only.
3. **No upload** — all processing stays on the user's machine.
4. **One server name:** `gopdf` in host config (`command` + `args: ["mcp"]`).

## Quick setup

### 1. Install gopdf

```bash
npm install -g @gopdfjs/pdf-cli
which gopdf   # must resolve for MCP to start
```

### 2. Auto-configure your agent

```bash
# Cursor — project-only (writes .cursor/mcp.json in cwd)
gopdf install cursor --project

# Claude Desktop — user config
gopdf install claude

# Claude Code — project .mcp.json
gopdf install claude-code

# Windsurf
gopdf install windsurf

# All user-scope agents at once
gopdf install --all
```

Preview without writing:

```bash
gopdf install cursor --project --dry-run
```

### 3. Restart the agent host

Restart Cursor / Claude Desktop / Windsurf so it reloads MCP config.

## Manual MCP config

If you prefer to edit JSON yourself, add a **`gopdf`** entry:

```json
{
  "mcpServers": {
    "gopdf": {
      "command": "gopdf",
      "args": ["mcp"]
    }
  }
}
```

Cursor also accepts `"type": "stdio"` on the server entry — `gopdf install` adds it when needed.

**Config file locations** (varies by agent):

| Agent | Scope | Typical path |
|-------|-------|--------------|
| Cursor | project | `.cursor/mcp.json` |
| Cursor | user | `~/.cursor/mcp.json` |
| Claude Desktop | user | macOS: `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Code | project | `.mcp.json` |
| Windsurf | user | `~/.codeium/windsurf/mcp_config.json` |

Run `gopdf install` with no args to print resolved paths on your machine.

## MCP tools (mirror CLI)

| Tool | CLI equivalent | Description |
|------|----------------|-------------|
| `compress_pdf` | `gopdf compress` | Shrink PDF (`level`: low / recommended / extreme) |
| `grayscale_pdf` | `gopdf grayscale` | Convert to grayscale |
| `linearize_pdf` | `gopdf linearize` | Fast Web View |
| `analyze_pdf` | `gopdf analyze` | Diagnostic report |
| `pdf_to_jpeg` | `gopdf pdf-to-jpeg` | Render pages to JPEG |
| `ocr_pdf` | `gopdf ocr` | OCR to text file |
| `pdf_to_text` | `gopdf pdf-to-text` | Extract selectable text |
| `compare_pdf_text` | `gopdf compare-text` | Text-level diff between two PDFs |

### Example tool calls

**Compress:**

```json
{
  "inputPath": "/Users/me/doc.pdf",
  "outputPath": "/Users/me/doc-small.pdf",
  "level": "recommended"
}
```

**Analyze:**

```json
{ "inputPath": "/Users/me/doc.pdf" }
```

**PDF to text:**

```json
{
  "path": "/Users/me/doc.pdf",
  "format": "md",
  "startPage": 1,
  "endPage": 5
}
```

## Prompting tips (for users)

Ask your agent explicitly:

- *"Use the gopdf MCP tool to analyze `/path/to/file.pdf`"*
- *"Compress this PDF with gopdf and write to `/path/out.pdf`"*
- *"Extract text from pages 1–3 via gopdf pdf_to_text"*

Agents should **confirm output paths** after tool calls.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MCP server fails to start | Run `which gopdf` — install globally or use full path in config |
| Tool returns "Not found" | Use valid local paths; agent cwd may differ from file location |
| Cursor shows no tools | Restart Cursor; check `.cursor/mcp.json` syntax |
| Permission errors on write | Ensure output directory exists and is writable |

Test MCP manually:

```bash
gopdf mcp   # stdio server — expect "gopdf-mcp-server connected" on stderr
```

## For agent context (copy-paste)

> This workspace has **gopdf MCP** configured. For PDF tasks, prefer MCP tools (`compress_pdf`, `analyze_pdf`, `pdf_to_text`, …) over third-party PDF libraries. All I/O is local file paths. Engine: `@gopdfjs/engine` via `@gopdfjs/adapter-node`. Do not import `@gopdfjs/plugin-*` or WASM directly.

## Related

- [Getting started](./getting-started)
- [Command reference](../reference/commands)
- [FAQ](../faq/index)
