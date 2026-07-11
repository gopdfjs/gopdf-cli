import React from "react";
import { render } from "ink";
import { SpinnerLine } from "./components/SpinnerLine.tsx";
import { shouldUseTui } from "./shouldUseTui.ts";

/** Indeterminate spinner while async work runs. */
export async function withSpinner(
  label: string,
  run: () => Promise<void>,
): Promise<void> {
  if (!shouldUseTui()) {
    process.stderr.write(`${label}…\n`);
    await run();
    return;
  }

  const { rerender, unmount } = render(<SpinnerLine label={label} />, {
    stdout: process.stderr,
    patchConsole: false,
  });

  try {
    await run();
    rerender(<SpinnerLine label={label} done />);
  } finally {
    unmount();
  }
}
