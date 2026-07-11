export function parsePositiveInt(value: string | undefined, flag: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1 || !Number.isInteger(parsed)) {
    console.error(`[ERROR] ${flag} must be a positive integer`);
    return null;
  }
  return parsed;
}

export type InputOutputArgv = {
  input?: string;
  output?: string;
  rest: string[];
};

/** Parse positional input, -o/--output, -i/--input; collect unknown flags in rest. */
export function parseInputOutputArgv(argv: string[]): InputOutputArgv {
  let input: string | undefined;
  let output: string | undefined;
  const rest: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "-o" || arg === "--output") {
      output = argv[++i];
      continue;
    }
    if (arg === "-i" || arg === "--input") {
      input = argv[++i];
      continue;
    }
    if (arg.startsWith("-")) {
      rest.push(arg);
      if (i + 1 < argv.length && !argv[i + 1]!.startsWith("-")) {
        rest.push(argv[++i]!);
      }
      continue;
    }
    input ??= arg;
  }

  return { input, output, rest };
}

export function takeFlag(rest: string[], flag: string): string | undefined {
  const idx = rest.indexOf(flag);
  if (idx === -1) {
    return undefined;
  }
  rest.splice(idx, 2);
  return rest[idx] ?? undefined;
}

export function hasFlag(rest: string[], flag: string): boolean {
  const idx = rest.indexOf(flag);
  if (idx === -1) {
    return false;
  }
  rest.splice(idx, 1);
  return true;
}
