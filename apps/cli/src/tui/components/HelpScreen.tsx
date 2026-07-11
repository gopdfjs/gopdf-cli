import React from "react";
import { Box, Text } from "ink";
import { BIN_NAME, BUY_ME_A_COFFEE_URL } from "../../constants.ts";
import { COMMAND_GROUPS } from "../commandCatalog.ts";

/** Ink help screen — grouped commands + support link. */
export function HelpScreen() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text>
        <Text bold color="cyan">
          {BIN_NAME}
        </Text>
        <Text dimColor> — local PDF tools (no upload)</Text>
      </Text>

      {COMMAND_GROUPS.map((group) => (
        <Box key={group.title} flexDirection="column" marginTop={1}>
          <Text bold color="yellow">
            {group.title}
          </Text>
          {group.commands.map((cmd) => (
            <Box key={cmd.name} paddingLeft={2}>
              <Text color="green">{cmd.name.padEnd(18)}</Text>
              <Text dimColor>{cmd.summary}</Text>
            </Box>
          ))}
        </Box>
      ))}

      <Box flexDirection="column" marginTop={1}>
        <Text dimColor>Flags: --plain / --no-ui disable this TUI</Text>
        <Text dimColor>
          ☕ Thanks for using {BIN_NAME}! {BUY_ME_A_COFFEE_URL}
        </Text>
      </Box>
    </Box>
  );
}
