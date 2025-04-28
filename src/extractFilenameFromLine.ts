import { isFilePath } from "./isFilePath.js";

/**
 * Extracts the first valid file path found in a line of text.
 * It prioritizes paths enclosed in double quotes ("), single quotes ('), or backticks (`).
 * If no quoted path is found, it looks for unquoted paths separated by whitespace,
 * attempting to clean common trailing punctuation before validation.
 *
 * @param line The string line to search within.
 * @returns The first valid file path found, or undefined if none is found.
 */
export function extractFilenameFromLine(line: string): string | undefined {
  if (!line || line.trim() === "") {
    return undefined;
  }

  const quoteRegex = /(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;

  const quoteMatches = line.matchAll(quoteRegex);

  for (const match of quoteMatches) {
    const potentialPath = match[1] ?? match[2] ?? match[3];

    if (potentialPath && isFilePath(potentialPath)) {
      return potentialPath;
    }
  }

  const tokens = line.split(/\s+/);

  for (const token of tokens) {
    if (!token) continue;

    if (isFilePath(token)) {
      return token;
    }

    const trailingPunctuationRegex = /[.,;:!?]+$/;
    const cleanedToken = token.replace(trailingPunctuationRegex, "");

    if (cleanedToken !== token && isFilePath(cleanedToken)) {
      return cleanedToken;
    }
  }

  return undefined;
}
