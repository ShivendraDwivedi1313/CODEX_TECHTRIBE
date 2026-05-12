/**
 * Normalize and compare program output against expected output.
 * - Trims trailing whitespace per line
 * - Removes trailing empty lines
 * - Compares line-by-line
 */
export function normalizeOutput(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')        // normalize CRLF
    .split('\n')
    .map((line) => line.trimEnd())  // trim trailing spaces per line
    .join('\n')
    .replace(/\n+$/, '')            // remove trailing empty lines
}

export function compareOutput(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected)
}
