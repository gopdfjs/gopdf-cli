#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="${HOME}/.cargo/bin:${PATH}"
wasm-pack build "$ROOT/crates/gopdf-wasm" \
  --target web \
  --out-dir "$ROOT/packages/engine/pkg" \
  --release
echo "OK: WASM -> $ROOT/packages/engine/pkg"
