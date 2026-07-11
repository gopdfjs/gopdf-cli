import React from "react";
import { render } from "ink";
import { ByteSummary } from "./components/ByteSummary.tsx";
import { StatusLine } from "./components/StatusLine.tsx";
import { shouldUseTui } from "./shouldUseTui.ts";

export async function renderByteSummary(props: {
  inputBytes: number;
  outputBytes: number;
  outputPath: string;
}): Promise<void> {
  if (!shouldUseTui()) {
    const saved = props.inputBytes - props.outputBytes;
    const ratio =
      props.inputBytes > 0 ? ((saved / props.inputBytes) * 100).toFixed(1) : "0.0";
    console.log(`Input:  ${props.inputBytes.toLocaleString()} bytes`);
    console.log(`Output: ${props.outputBytes.toLocaleString()} bytes`);
    console.log(`Saved:  ${saved.toLocaleString()} bytes (${ratio}%)`);
    console.log(`Wrote:  ${props.outputPath}`);
    return;
  }

  const { unmount, waitUntilExit } = render(<ByteSummary {...props} />);
  unmount();
  await waitUntilExit();
}

export async function renderStatusLine(message: string, path?: string): Promise<void> {
  if (!shouldUseTui()) {
    console.log(path ? `${message} ${path}` : message);
    return;
  }

  const { unmount, waitUntilExit } = render(
    <StatusLine message={message} path={path} />,
  );
  unmount();
  await waitUntilExit();
}
