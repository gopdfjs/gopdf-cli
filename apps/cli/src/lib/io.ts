import fs from "node:fs";
import path from "node:path";

export function readBytes(filePath: string): Uint8Array {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return new Uint8Array(fs.readFileSync(filePath));
}

export function writeBytes(filePath: string, bytes: Uint8Array): void {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  fs.writeFileSync(filePath, bytes);
}

export async function writeBlob(filePath: string, blob: Blob): Promise<void> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeBytes(filePath, new Uint8Array(buffer));
}

export function writeText(filePath: string, text: string): void {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}

export function defaultSiblingOutput(input: string, suffix: string): string {
  const parsed = path.parse(input);
  const base = parsed.name || "output";
  return path.join(parsed.dir, `${base}${suffix}`);
}
