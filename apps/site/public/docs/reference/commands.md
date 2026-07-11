---
title: Commands
order: 1
category: reference
description: 'Full gopdf subcommand and MCP tool reference'
---

# Command reference

All subcommands process **local files only**. Global flags:

| Flag | Description |
|------|-------------|
| `--plain`, `--no-ui` | Disable Ink TUI (CI / scripts) |
| `GOPDF_PLAIN=1` | Same as `--plain` |

## Transform

### `gopdf compress`

Shrink PDF size.

```bash
gopdf compress input.pdf -o output.pdf
gopdf compress input.pdf -o output.pdf --level extreme
```

Levels: `low`, `recommended` (default), `extreme`.

**MCP:** `compress_pdf` — `inputPath`, `outputPath`, optional `level`.

### `gopdf grayscale`

Convert color PDF to grayscale.

```bash
gopdf grayscale input.pdf -o output.pdf
```

**MCP:** `grayscale_pdf`.

### `gopdf linearize`

Linearize for Fast Web View (optimized for streaming).

```bash
gopdf linearize input.pdf -o output.pdf
```

**MCP:** `linearize_pdf`.

## Extract & inspect

### `gopdf analyze`

Print a diagnostic report (structure, fonts, images, size breakdown).

```bash
gopdf analyze input.pdf
```

**MCP:** `analyze_pdf`.

### `gopdf pdf-to-jpeg`

Render pages to JPEG.

```bash
gopdf pdf-to-jpeg input.pdf -o ./pages/page
```

**MCP:** `pdf_to_jpeg` — optional `quality`, `scale`.

### `gopdf pdf-to-text`

Extract selectable text (`engine.pdfToText`).

```bash
gopdf pdf-to-text input.pdf
gopdf pdf-to-text input.pdf --format html -o output.html
```

Formats: `txt` (default), `html`, `rtf`.

**MCP:** `pdf_to_text`.

### `gopdf ocr`

OCR scanned pages to text (Tesseract).

```bash
gopdf ocr input.pdf -o output.txt
gopdf ocr input.pdf -o output.txt --lang eng
```

**MCP:** `ocr_pdf`.

### `gopdf compare-text`

Text-level diff between two PDFs (`engine.comparePdfText`).

```bash
gopdf compare-text a.pdf b.pdf
gopdf compare-text a.pdf b.pdf --json
```

**MCP:** `compare_pdf_text`.

## Meta

### `gopdf mcp`

Start the **stdio MCP server** for AI agent hosts. Not run directly by users — configured via `gopdf install`.

```bash
gopdf mcp
```

### `gopdf install`

Write or merge MCP config for supported agents.

```bash
gopdf install                        # list agents
gopdf install cursor --project
gopdf install claude
gopdf install claude-code
gopdf install windsurf
gopdf install --all
gopdf install cursor --dry-run
```

Agents: `claude`, `claude-desktop`, `cursor`, `claude-code`, `code`, `windsurf`.

See [MCP for AI agents](../guide/mcp).

## Related

- [Getting started](../guide/getting-started)
- [MCP for AI agents](../guide/mcp)
