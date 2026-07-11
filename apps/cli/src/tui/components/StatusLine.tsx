import React from "react";
import { Text } from "ink";

export type StatusLineProps = {
  message: string;
  path?: string;
};

/** Single success line (e.g. Wrote: path). */
export function StatusLine({ message, path }: StatusLineProps) {
  return (
    <Text>
      <Text color="green">✓ </Text>
      {message}
      {path ? <Text underline> {path}</Text> : null}
    </Text>
  );
}
