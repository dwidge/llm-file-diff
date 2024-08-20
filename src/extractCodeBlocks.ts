/**
 * Generator function that yields the file type and content from code blocks
 * in a given response string.
 *
 * @param {string} response - The response string containing code blocks.
 * @yield {string} fileType - The type of the file (e.g., TypeScript, JavaScript).
 * @yield {string} content - The content of the code block.
 */
export function* extractCodeBlocks(
  response: string
): Generator<{ fileType: string; content: string }> {
  const regex = /```([a-z]*?)\n([\s\S]*?)\n```/g;
  let match;

  while ((match = regex.exec(response)) !== null) {
    const fileType = match[1].trim();
    const content = match[2].trim();
    yield { fileType, content };
  }
}
