import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const;

export type SpinnerLineProps = {
  label: string;
  done?: boolean;
};

/** Indeterminate spinner for ops without progress callbacks. */
export function SpinnerLine({ label, done = false }: SpinnerLineProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (done) {
      return;
    }
    const timer = setInterval(() => {
      setFrame((value) => (value + 1) % FRAMES.length);
    }, 80);
    return () => clearInterval(timer);
  }, [done]);

  return (
    <Box>
      {done ? (
        <Text color="green">✓ </Text>
      ) : (
        <Text color="cyan">{FRAMES[frame]} </Text>
      )}
      <Text>{label}</Text>
    </Box>
  );
}
