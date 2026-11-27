import fs from "node:fs";
import { ENGINE_OPERATIONS, executeEngineOperation, saveOperationResult, type EngineOperation, type OperationRequest } from "../lib/engineOperation.ts";

export const OPERATION_REQUEST_USAGE = `Usage: gopdf <operation> --request request.json

The JSON request has an args array in engine method argument order. Use {"file":"path.pdf"}
for byte inputs, and set output for binary results. See README for examples.`;

export async function runEngineOperation(operation: EngineOperation, argv: string[]): Promise<number> {
  const index = argv.indexOf("--request");
  if (index < 0 || !argv[index + 1] || argv.length !== 2) {
    console.error(OPERATION_REQUEST_USAGE);
    return 1;
  }
  try {
    const request = JSON.parse(fs.readFileSync(argv[index + 1]!, "utf8")) as OperationRequest;
    if (!Array.isArray(request.args)) throw new Error("Request must include an args array.");
    const result = await executeEngineOperation(operation, request);
    console.log(await saveOperationResult(result, request.output));
    return 0;
  } catch (error) {
    console.error(`[ERROR] ${operation}: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}

export const ENGINE_OPERATION_NAMES = Object.keys(ENGINE_OPERATIONS) as EngineOperation[];
