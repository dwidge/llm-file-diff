/**
 * Generator function that yields the file type, content, and the line just above the code block
 * in a given response string.
 *
 * @param {string} response - The response string containing code blocks.
 * @yield {string} fileType - The type of the file (e.g., TypeScript, JavaScript).
 * @yield {string} content - The content of the code block.
 * @yield {string} previousLine - The line just above the code block.
 */
export function* extractCodeBlocks(
  response: string
): Generator<{ fileType: string; content: string; previousLine: string }> {
  const regex = /([^\n]*?)?\n?\n?```([a-z]*?)\n([\s\S]*?)\n```/g;
  let match;

  while ((match = regex.exec(response)) !== null) {
    const previousLine = (match[1] || "").trim();
    const fileType = (match[2] || "").trim();
    const content = (match[3] || "").trim();
    yield { fileType, content, previousLine };
  }
}
