import React from "react";
import { Box, Text } from "ink";

const BAR_WIDTH = 24;

export type ProgressBarProps = {
  label: string;
  percent: number;
  done?: boolean;
};

/** Terminal progress bar (RFC compress / long engine ops). */
export function ProgressBar({ label, percent, done = false }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const filled = Math.round((clamped / 100) * BAR_WIDTH);

  return (
    <Box flexDirection="column">
      <Text>
        <Text color="cyan">{label}</Text>
        {done ? <Text color="green"> ✓</Text> : null}
      </Text>
      <Box>
        <Text color="green">{"█".repeat(filled)}</Text>
        <Text dimColor>{"░".repeat(BAR_WIDTH - filled)}</Text>
        <Text> {clamped}%</Text>
      </Box>
    </Box>
  );
}
