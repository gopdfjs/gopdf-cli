# RFC 0002 — `install.js` one-line installer

- **Status**: Proposed
- **Author**: gopdf-cli maintainers
- **Date**: 2026-07-11
- **Repo**: `gopdf-cli`

## 1. Objective

Ship a **zero-repo** install path for end users:

```bash
curl -fsSL https://gopdfjs.github.io/gopdf-cli/install.js | node
```

Script runs `npm install -g @gopdfjs/pdf-cli` and verifies `gopdf --help`.

## 2. Non-goals

- No bundled Node runtime (user must have Node 18+).
- No replacement for Homebrew or manual npm — complementary channels (see RFC 0003).

## 3. Source & hosting

| Location | Role |
|----------|------|
| `scripts/install.js` | **Canonical source** in repo |
| `apps/site/public/install.js` | **Copy for GitHub Pages** (`/gopdf-cli/install.js`) |

Site build does not transform the script — maintain parity when editing (copy or sync in CI later).

**URLs:**

- Pages: `https://gopdfjs.github.io/gopdf-cli/install.js`
- Raw (fallback): `https://raw.githubusercontent.com/gopdfjs/gopdf-cli/main/scripts/install.js`

## 4. Behavior

1. Require Node **≥ 18**.
2. Require `npm` on PATH.
3. `npm install -g @gopdfjs/pdf-cli` (or `@version` if `GOPDF_VERSION` set).
4. Run `gopdf --help` — warn if missing from PATH after install.

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `GOPDF_VERSION` | *(latest)* | Pin npm semver |
| `GOPDF_NPM_PACKAGE` | `@gopdfjs/pdf-cli` | Override package (testing) |

## 5. Security

- Script is plain Node — **no `eval`**, no remote code beyond npm registry.
- Docs must show **full HTTPS URL**; discourage piping unknown mirrors.
- Future: optional checksum file on release tags.

## 6. Docs

- `apps/site/public/docs/guide/installation.md` — list script first (recommended for quick start).
- Home page quick-start block includes curl one-liner.

## 7. Success criteria

- [ ] `scripts/install.js` installs published package on Node 18+
- [ ] Same file served at GitHub Pages path
- [ ] Site installation guide documents curl + env vars
- [ ] CI smoke: `node scripts/install.js` with dry-run mock *(optional follow-up)*

## 8. Related

- [RFC 0003 — Homebrew formula](0003-homebrew-formula.md)
- [RFC 0001 — Consume engine npm](0001-consume-engine-npm.md)
