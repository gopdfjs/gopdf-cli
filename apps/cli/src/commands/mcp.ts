import fs from "node:fs";
import path from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { getEngine } from "../lib/getEngine.ts";
import { readBytes, writeBytes, writeText } from "../lib/io.ts";
import { formatAnalyzeReportText } from "../lib/analyzeReport.ts";
import { formatTextDiffReport } from "./compareText.ts";
import { readPdfTextFromFile, PDF_TO_TEXT_FORMAT } from "./pdfToText.ts";

/** MCP stdio server — all tools call `engine.*()` via getEngine() (RFC 0001). */
export async function runMcpServer(): Promise<number> {
  console.error("Starting gopdf-mcp-server...");

  const server = new Server(
    { name: "gopdf-mcp-server", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "compress_pdf",
        description: "Compress a local PDF file.",
        inputSchema: {
          type: "object",
          properties: {
            inputPath: { type: "string" },
            outputPath: { type: "string" },
            level: {
              type: "string",
              enum: ["low", "recommended", "extreme"],
            },
          },
          required: ["inputPath", "outputPath"],
        },
      },
      {
        name: "grayscale_pdf",
        description: "Convert a PDF to grayscale.",
        inputSchema: {
          type: "object",
          properties: {
            inputPath: { type: "string" },
            outputPath: { type: "string" },
          },
          required: ["inputPath", "outputPath"],
        },
      },
      {
        name: "linearize_pdf",
        description: "Linearize a PDF for Fast Web View.",
        inputSchema: {
          type: "object",
          properties: {
            inputPath: { type: "string" },
            outputPath: { type: "string" },
          },
          required: ["inputPath", "outputPath"],
        },
      },
      {
        name: "analyze_pdf",
        description: "Diagnostic report for a PDF.",
        inputSchema: {
          type: "object",
          properties: { inputPath: { type: "string" } },
          required: ["inputPath"],
        },
      },
      {
        name: "pdf_to_jpeg",
        description: "Render PDF pages to JPEG files.",
        inputSchema: {
          type: "object",
          properties: {
            inputPath: { type: "string" },
            outputPath: { type: "string" },
            quality: { type: "number" },
            scale: { type: "number" },
          },
          required: ["inputPath", "outputPath"],
        },
      },
      {
        name: "ocr_pdf",
        description: "OCR a PDF to text.",
        inputSchema: {
          type: "object",
          properties: {
            inputPath: { type: "string" },
            outputPath: { type: "string" },
            lang: { type: "string" },
          },
          required: ["inputPath", "outputPath"],
        },
      },
      {
        name: "pdf_to_text",
        description: "Extract selectable text from a PDF.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string" },
            startPage: { type: "number" },
            endPage: { type: "number" },
            format: { type: "string", enum: ["txt", "html", "rtf"] },
          },
          required: ["path"],
        },
      },
      {
        name: "compare_pdf_text",
        description: "Text-level diff between two PDF files.",
        inputSchema: {
          type: "object",
          properties: {
            pathA: { type: "string" },
            pathB: { type: "string" },
          },
          required: ["pathA", "pathB"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const engine = await getEngine();

    try {
      switch (name) {
        case "compress_pdf": {
          const { inputPath, outputPath, level = "recommended" } = args as {
            inputPath: string;
            outputPath: string;
            level?: "low" | "recommended" | "extreme";
          };
          const bytes = readBytes(inputPath);
          const compressed = await engine.compressPdf(bytes, level);
          writeBytes(outputPath, compressed);
          return {
            content: [
              {
                type: "text",
                text: `Compressed ${inputPath} → ${outputPath} (${compressed.byteLength} bytes)`,
              },
            ],
          };
        }

        case "grayscale_pdf": {
          const { inputPath, outputPath } = args as {
            inputPath: string;
            outputPath: string;
          };
          const result = await engine.grayscalePdf(readBytes(inputPath), {
            mode: "grayscale",
          });
          writeBytes(outputPath, result.bytes);
          return {
            content: [{ type: "text", text: `Grayscaled → ${outputPath}` }],
          };
        }

        case "linearize_pdf": {
          const { inputPath, outputPath } = args as {
            inputPath: string;
            outputPath: string;
          };
          const out = await engine.linearizePdf(readBytes(inputPath));
          writeBytes(outputPath, out);
          return {
            content: [{ type: "text", text: `Linearized → ${outputPath}` }],
          };
        }

        case "analyze_pdf": {
          const { inputPath } = args as { inputPath: string };
          const bytes = readBytes(inputPath);
          const report = await engine.analyzePdf(bytes, {
            fileName: path.basename(inputPath),
            fileSizeBytes: bytes.byteLength,
          });
          return {
            content: [{ type: "text", text: formatAnalyzeReportText(report) }],
          };
        }

        case "pdf_to_jpeg": {
          const {
            inputPath,
            outputPath,
            quality = 0.92,
            scale = 2,
          } = args as {
            inputPath: string;
            outputPath: string;
            quality?: number;
            scale?: number;
          };
          const pages = await engine.pdfToJpeg(readBytes(inputPath), {
            quality,
            scale,
          });
          const created: string[] = [];
          for (const { bytes, page } of pages) {
            const lower = outputPath.toLowerCase();
            const pagePath =
              lower.endsWith(".jpg") || lower.endsWith(".jpeg")
                ? `${outputPath.slice(0, -path.extname(outputPath).length)}-page-${page}${path.extname(outputPath)}`
                : `${outputPath}-page-${page}.jpg`;
            writeBytes(pagePath, bytes);
            created.push(pagePath);
          }
          return {
            content: [
              {
                type: "text",
                text: `Rendered ${pages.length} page(s):\n${created.join("\n")}`,
              },
            ],
          };
        }

        case "ocr_pdf": {
          const {
            inputPath,
            outputPath,
            lang = "eng",
          } = args as { inputPath: string; outputPath: string; lang?: string };
          const text = await engine.ocr(readBytes(inputPath), lang);
          writeText(outputPath, text);
          return {
            content: [{ type: "text", text: `OCR → ${outputPath}` }],
          };
        }

        case "pdf_to_text": {
          const { path: inputPath, format = PDF_TO_TEXT_FORMAT.TXT } = args as {
            path: string;
            format?: "txt" | "html" | "rtf";
          };
          if (!fs.existsSync(inputPath)) {
            throw new McpError(ErrorCode.InvalidParams, `Not found: ${inputPath}`);
          }
          const text = await readPdfTextFromFile(inputPath, format);
          return { content: [{ type: "text", text }] };
        }

        case "compare_pdf_text": {
          const { pathA, pathB } = args as { pathA: string; pathB: string };
          for (const p of [pathA, pathB]) {
            if (!fs.existsSync(p)) {
              throw new McpError(ErrorCode.InvalidParams, `Not found: ${p}`);
            }
          }
          const result = await engine.comparePdfText(
            readBytes(pathA),
            readBytes(pathB),
          );
          return {
            content: [
              {
                type: "text",
                text: formatTextDiffReport(
                  path.basename(pathA),
                  path.basename(pathB),
                  result,
                ),
              },
            ],
          };
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`MCP tool ${name} failed:`, error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("gopdf-mcp-server connected.");
  return new Promise(() => {});
}
