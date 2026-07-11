import React from "react";
import { Box, Text } from "ink";

export type ByteSummaryProps = {
  inputBytes: number;
  outputBytes: number;
  outputPath: string;
};

/** Post-compress size summary. */
export function ByteSummary({ inputBytes, outputBytes, outputPath }: ByteSummaryProps) {
  const saved = inputBytes - outputBytes;
  const ratio = inputBytes > 0 ? ((saved / inputBytes) * 100).toFixed(1) : "0.0";

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="green">
        Done
      </Text>
      <Text>
        Input: <Text color="cyan">{inputBytes.toLocaleString()}</Text> bytes
      </Text>
      <Text>
        Output: <Text color="cyan">{outputBytes.toLocaleString()}</Text> bytes
      </Text>
      <Text>
        Saved: <Text color="yellow">{saved.toLocaleString()}</Text> bytes ({ratio}%)
      </Text>
      <Text>
        Wrote: <Text underline>{outputPath}</Text>
      </Text>
    </Box>
  );
}
