---
title: Installation
order: 2
category: guide
description: 'Install gopdf — script, npm, Homebrew, or Nix'
---

# Installation

Four ways to install **gopdf**. Script, npm, and Homebrew require **Node.js 18+** (package managers install Node as a dependency). Nix bundles Node inside the derivation.

## 1. Install script (recommended)

One line — downloads `install.js` and runs `npm install -g @gopdfjs/pdf-cli`:

```bash
curl -fsSL https://gopdfjs.github.io/gopdf-cli/install.js | node
```

Alternative (raw GitHub):

```bash
curl -fsSL https://raw.githubusercontent.com/gopdfjs/gopdf-cli/main/scripts/install.js | node
```

Pin a version:

```bash
GOPDF_VERSION=0.1.0 curl -fsSL https://gopdfjs.github.io/gopdf-cli/install.js | node
```

Spec: [RFC 0002](https://github.com/gopdfjs/gopdf-cli/blob/main/.spec/rfc/0002-install-script.md).

## 2. npm

```bash
npm install -g @gopdfjs/pdf-cli
```

Binaries: **`gopdf`** and **`gopdf-cli`** (same entry).

## 3. Homebrew (luban-homebrew tap)

**npm 发布前**（从 main 构建）：

```bash
brew install --HEAD systembugtj/luban-homebrew/gopdf
```

**npm 发布后**：

```bash
brew install systembugtj/luban-homebrew/gopdf
```

Formula lives in the **[luban-homebrew](https://github.com/systembugtj/luban-homebrew)** tap. Spec: [RFC 0003](https://github.com/gopdfjs/gopdf-cli/blob/main/.spec/rfc/0003-homebrew-formula.md).

## 4. Nix (cangjie-nix flake, Linux)

Build or install from the **[cangjie-nix](https://github.com/systembugtj/cangjie-nix)** flake (`x86_64-linux`, `aarch64-linux`):

```bash
nix profile install github:systembugtj/cangjie-nix#gopdf
```

Or build once:

```bash
nix build github:systembugtj/cangjie-nix#gopdf
./result/bin/gopdf --help
```

Until `@gopdfjs/pdf-cli` is on npm, the flake builds from a pinned `gopdf-cli` git commit. Spec: [cangjie-nix RFC 0003](https://github.com/systembugtj/cangjie-nix/blob/main/.spec/rfc/0003-gopdf-nix-package.md).

## Verify

```bash
gopdf --help
```

## From source (contributors)

```bash
git clone https://github.com/gopdfjs/gopdf-cli.git
cd gopdf-cli
pnpm install
pnpm build
node apps/cli/dist/index.mjs --help
```

## MCP install helper

After `gopdf` is on your `PATH`:

```bash
gopdf install cursor --project
gopdf install claude
gopdf install --all
```

See [MCP for AI agents](./mcp).

## Related

- [Getting started](./getting-started)
- [MCP for AI agents](./mcp)
