import { strict as assert } from "assert";

/**
 * Extracts the content of the first comment found in a string.
 * Supports various common comment styles:
 * - Multiline: `/* ... ` (JavaScript, CSS, Java, etc.)
 * - Single-line: `// ...` (JavaScript, C++, Java, etc.)
 * - Single-line: `# ...` (Shell, Python, Ruby, etc.)
 * - Multiline: `<!-- ... -->` (HTML, XML)
 * - Single-line: `-- ...` (Lua, SQL)
 * - Single-line: `rem ...` or `REM ...` (Batch)
 * - Single-line: `:: ...` (Batch)
 *
 * The function finds the first comment marker that appears in the string
 * and returns its content, trimmed of leading/trailing whitespace.
 * If multiple comment types are present, the one starting earliest is chosen.
 *
 * @param text The input string potentially containing comments.
 * @returns The trimmed content of the first comment found, or undefined if no comment is found.
 */
export function extractCommentString(text: string): string | undefined {
  if (!text) {
    return undefined;
  }

  const commentPatterns = [
    {
      regex: /\/\*(.*?)\*\//s,
      extractor: (match: RegExpExecArray): string | undefined => match[1],
    },
    {
      regex: /\/\/(.*)/,
      extractor: (match: RegExpExecArray): string | undefined => match[1],
    },
    {
      regex: /<!--(.*?)-->/s,
      extractor: (match: RegExpExecArray): string | undefined => match[1],
    },
    {
      regex: /#(.*)/,
      extractor: (match: RegExpExecArray): string | undefined => match[1],
    },
    {
      regex: /--(.*)/,
      extractor: (match: RegExpExecArray): string | undefined => match[1],
    },
    {
      regex: /(?:^|\s)(?:rem|REM)\s+(.*)/i,
      extractor: (match: RegExpExecArray): string | undefined => match[1],
    },
    {
      regex: /::(.*)/,
      extractor: (match: RegExpExecArray): string | undefined => match[1],
    },
  ];

  let earliestMatch: { index: number; content: string } | null = null;

  for (const { regex, extractor } of commentPatterns) {
    regex.lastIndex = 0;
    const match = regex.exec(text);

    if (match) {
      const index = match.index;

      if (earliestMatch === null || index < earliestMatch.index) {
        const rawContent = extractor(match);

        const content =
          typeof rawContent === "string" ? rawContent.trim() : undefined;

        if (content !== undefined) {
          earliestMatch = { index, content };
        }
      }
    }
  }

  return earliestMatch?.content;
}
