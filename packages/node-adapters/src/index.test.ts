import { describe, expect, it } from "vitest";
import {
  createNodeCanvasPort,
  createNodeEngine,
  createNodeOcrPort,
  createNodePdfJsRuntime,
  createNodeRuntime,
} from "./index.ts";

describe("@gopdfjs/node-adapters exports", () => {
  it("exposes async factory functions", () => {
    expect(typeof createNodeRuntime).toBe("function");
    expect(typeof createNodeEngine).toBe("function");
    expect(typeof createNodeCanvasPort).toBe("function");
    expect(typeof createNodePdfJsRuntime).toBe("function");
    expect(typeof createNodeOcrPort).toBe("function");
  });
});
