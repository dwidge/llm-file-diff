/**
 * Extracts the content of the first comment (either single-line // or multi-line /* * /)
 * found in the input string.
 *
 * @param code The string potentially containing code and comments.
 * @returns The trimmed content of the first comment found, or undefined if no comment is found.
 */
export function extractCommentString(code: string): string | undefined {
  if (!code) {
    return undefined;
  }

  const commentRegex = /\/\*(.*?)\*\/|\/\/(.*)/;

  const match = code.match(commentRegex);

  if (match) {
    const content = match[1] !== undefined ? match[1] : match[2];

    if (content !== undefined) {
      return content.trim();
    }
  }

  return undefined;
}
