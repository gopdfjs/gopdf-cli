/** True when Ink TUI is allowed (interactive terminal, not CI/plain). */
export function shouldUseTui(argv: string[] = process.argv.slice(2)): boolean {
  if (process.env.GOPDF_PLAIN === "1" || process.env.CI === "true") {
    return false;
  }
  if (argv.includes("--plain") || argv.includes("--no-ui")) {
    return false;
  }
  return Boolean(process.stderr.isTTY && process.stdout.isTTY);
}

/** Strip global UI flags before command argv parsing. */
export function stripUiFlags(argv: string[]): string[] {
  return argv.filter((arg) => arg !== "--plain" && arg !== "--no-ui");
}
