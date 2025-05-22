/**
 * Builds a string from an array of lines.
 *
 * @param {string[]} lines Array of strings to join into a single string.
 * @returns {string} The built string with lines separated by a newline character.
 */
export default function textBuilder(lines: string[]): string {
  return lines.join("\n");
}
