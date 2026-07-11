import React from "react";
import { render } from "ink";
import { buildPlainHelp } from "./commandCatalog.ts";
import { HelpScreen } from "./components/HelpScreen.tsx";
import { shouldUseTui } from "./shouldUseTui.ts";
import { printWelcomeMessage, shouldShowWelcomeMessage } from "../welcome.ts";

/** Help output — Ink when TTY, plain text otherwise. */
export async function renderHelp(argv: string[]): Promise<void> {
  if (!shouldUseTui(argv)) {
    if (shouldShowWelcomeMessage(argv)) {
      printWelcomeMessage();
    }
    console.log(buildPlainHelp());
    return;
  }

  const { unmount, waitUntilExit } = render(<HelpScreen />);
  unmount();
  await waitUntilExit();
}
