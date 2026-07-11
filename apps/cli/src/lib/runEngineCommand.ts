import { getEngine } from "./getEngine.ts";

/** Shared wrapper — lazy engine init + uniform error exit (RFC 0001 §4). */
export async function runEngineCommand<T>(
  name: string,
  fn: (engine: Awaited<ReturnType<typeof getEngine>>) => Promise<T>,
): Promise<T> {
  try {
    const engine = await getEngine();
    return await fn(engine);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] ${name}: ${message}`);
    throw error;
  }
}

export async function runEngineCommandExit(
  name: string,
  fn: (engine: Awaited<ReturnType<typeof getEngine>>) => Promise<void>,
): Promise<number> {
  try {
    await runEngineCommand(name, fn);
    return 0;
  } catch {
    return 1;
  }
}
