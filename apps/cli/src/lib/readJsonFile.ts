import fs from "node:fs";

/** Load JSON config from `--flag path` (RFC 0001 §4 complex structs). */
export function readJsonFile<T>(filePath: string | undefined, flag: string): T | null {
  if (!filePath) {
    console.error(`[ERROR] ${flag} requires a JSON file path`);
    return null;
  }
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] JSON file not found: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] Invalid JSON in ${filePath}: ${message}`);
    return null;
  }
}
