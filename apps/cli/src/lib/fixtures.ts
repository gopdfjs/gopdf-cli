import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../");

/** Repo-root PDF fixtures for tests and demos. */
export const PDF_FIXTURES = {
  PY_PDF_LIBRE_WRITER: path.join(ROOT, "fixtures/pdf/py-pdf-libre-writer.pdf"),
  PY_PDF_4_PAGES: path.join(ROOT, "fixtures/pdf/py-pdf-4-pages.pdf"),
  BMAUPIN_MINIMAL: path.join(ROOT, "fixtures/pdf/bmaupin-minimal.pdf"),
  BMAUPIN_BASIC: path.join(ROOT, "fixtures/pdf/bmaupin-basic.pdf"),
} as const;
