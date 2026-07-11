#!/usr/bin/env node
/**
 * Install gopdf CLI globally via npm (@gopdfjs/pdf-cli).
 *
 * Usage:
 *   curl -fsSL https://gopdfjs.github.io/gopdf-cli/install.js | node
 *   node scripts/install.js
 *
 * Env:
 *   GOPDF_VERSION — pin npm version (default: latest)
 *   GOPDF_NPM_PACKAGE — override package name
 */

const { execSync, spawnSync } = require("node:child_process");

const NPM_PACKAGE = process.env.GOPDF_NPM_PACKAGE ?? "@gopdfjs/pdf-cli";
const VERSION = process.env.GOPDF_VERSION;
const MIN_NODE_MAJOR = 18;

function log(message) {
  process.stderr.write(`${message}\n`);
}

function fail(message, code = 1) {
  log(`[gopdf install] ERROR: ${message}`);
  process.exit(code);
}

function parseNodeMajor(version) {
  const match = /^v?(\d+)/.exec(version);
  return match ? Number(match[1]) : 0;
}

function ensureNode() {
  const major = parseNodeMajor(process.version);
  if (major < MIN_NODE_MAJOR) {
    fail(
      `Node.js ${MIN_NODE_MAJOR}+ required (current: ${process.version}). Install from https://nodejs.org`,
    );
  }
}

function ensureNpm() {
  const result = spawnSync("npm", ["--version"], { encoding: "utf8" });
  if (result.status !== 0) {
    fail("npm not found. Install Node.js (includes npm) from https://nodejs.org");
  }
}

function installPackage() {
  const spec = VERSION ? `${NPM_PACKAGE}@${VERSION}` : NPM_PACKAGE;
  log(`[gopdf install] Installing ${spec} globally…`);
  execSync(`npm install -g ${spec}`, { stdio: "inherit" });
}

function verifyBinary() {
  const result = spawnSync("gopdf", ["--help"], { encoding: "utf8" });
  if (result.status !== 0) {
    log("[gopdf install] WARN: gopdf installed but `gopdf --help` failed — check PATH");
    return;
  }
  log("[gopdf install] OK — run `gopdf --help`");
}

function main() {
  log("[gopdf install] gopdf CLI installer");
  ensureNode();
  ensureNpm();
  installPackage();
  verifyBinary();
}

main();
