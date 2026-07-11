import React from "react";
import { render } from "ink";
import { ProgressBar } from "./components/ProgressBar.tsx";
import { shouldUseTui } from "./shouldUseTui.ts";

/** Run work with Ink progress on stderr, or plain `\r` fallback. */
export async function withProgress(
  label: string,
  run: (report: (percent: number) => void) => Promise<void>,
): Promise<void> {
  if (!shouldUseTui()) {
    await run((percent) => {
      process.stderr.write(`\r${label} ${Math.round(percent)}%`);
    });
    process.stderr.write("\n");
    return;
  }

  const { rerender, unmount } = render(
    <ProgressBar label={label} percent={0} />,
    { stdout: process.stderr, patchConsole: false },
  );

  try {
    await run((percent) => {
      rerender(<ProgressBar label={label} percent={percent} />);
    });
    rerender(<ProgressBar label={label} percent={100} done />);
  } finally {
    unmount();
  }
}
