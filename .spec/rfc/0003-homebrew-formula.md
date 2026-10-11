# RFC 0003 — Homebrew formula (`luban-homebrew` tap)

- **Status**: Proposed
- **Author**: gopdf-cli maintainers
- **Date**: 2026-07-11
- **Repo**: formula in **[luban-homebrew](https://github.com/systembugtj/luban-homebrew)** tap; spec in `gopdf-cli`

## 1. Objective

macOS / Linux users install via Homebrew:

```bash
# Until @gopdfjs/pdf-cli is on npm
brew install --HEAD systembugtj/luban-homebrew/gopdf

# After npm publish (formula switches to npm tarball)
brew install systembugtj/luban-homebrew/gopdf
```

## 2. Tap

| Item | Value |
|------|-------|
| GitHub repo | `systembugtj/luban-homebrew` |
| Tap id | `systembugtj/luban-homebrew` |
| GitHub repo | [`luban-homebrew`](https://github.com/systembugtj/luban-homebrew) (local: `/Volumes/ORICO/ws/prj/systembug/luban-homebrew`) |
| Formula file | `Formula/gopdf.rb` |
| Binary names | `gopdf`, `gopdf-cli` |

Tap conventions follow existing [luban-homebrew RFC](https://github.com/systembugtj/luban-homebrew/blob/main/docs/rfc/001-linglong-homebrew-tap.md) (CI, `Formula/` layout, bottle workflow).

## 3. Formula strategy (v1)

**HEAD (until npm publish):** build from `gopdf-cli` git — `pnpm install`, vite build, `pnpm deploy --legacy --prod` into `libexec` (removes `apps/site` first so deploy does not pull site deps). Vite externalizes `@gopdfjs/*`; deploy ships runtime `node_modules`.

**Stable (after npm publish):** Node-dependent npm global install inside the formula — matches how the CLI ships (`@gopdfjs/pdf-cli`).

```ruby
class Gopdf < Formula
  desc "Local PDF CLI — compress, analyze, OCR (gopdf-cli)"
  homepage "https://github.com/gopdfjs/gopdf-cli"
  url "https://registry.npmjs.org/@gopdfjs/pdf-cli/-/pdf-cli-VERSION.tgz"
  sha256 "…"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec.glob("bin/*")
  end

  test do
    assert_match "gopdf", shell_output("#{bin}/gopdf --help")
  end
end
```

Exact `url` / `sha256` track **npm publish** of `@gopdfjs/pdf-cli`. Bump formula when CLI version bumps.

### Alternative (future)

Prebuilt standalone binaries from GitHub Releases — only if we ship release tarballs without requiring global npm (RFC follow-up).

## 4. Version sync

| Event | Action |
|-------|--------|
| `@gopdfjs/pdf-cli` npm publish | PR to `luban-homebrew` bumping `gopdf.rb` url + sha256 |
| CLI breaking rename | Rename formula or add `gopdf-cli` alias in formula |

## 5. Docs

Site installation guide order:

1. **Script** — `curl … install.js | node`
2. **npm** — `npm install -g @gopdfjs/pdf-cli`
3. **Homebrew** — `brew install systembugtj/luban-homebrew/gopdf`
4. **Nix (Linux)** — `nix profile install github:systembugtj/cangjie-nix#gopdf` via [cangjie-nix](https://github.com/systembugtj/cangjie-nix)

## 6. Out of scope (this RFC)

- Automating formula bump from gopdf-cli CI (manual PR to tap for v1).
- Windows (use npm / install.js).

## 7. Success criteria

- [ ] `Formula/gopdf.rb` merged in `systembugtj/luban-homebrew`
- [ ] `brew install systembugtj/luban-homebrew/gopdf` yields working `gopdf --help`
- [ ] luban-homebrew README lists `gopdf` formula
- [ ] gopdf-cli site documents Homebrew one-liner

## 8. Related

- [RFC 0002 — install.js](0002-install-script.md)
- [luban-homebrew tap RFC](https://github.com/systembugtj/luban-homebrew/blob/main/docs/rfc/001-linglong-homebrew-tap.md)
