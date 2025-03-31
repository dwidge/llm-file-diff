import { isFilePath } from "./isFilePath.js";

export function extractFilenameFromLine(previousLine: string) {
  let lineWithoutComment = previousLine;

  if (previousLine.startsWith("// ")) {
    lineWithoutComment = previousLine.substring(3);
  } else if (previousLine.startsWith("//")) {
    lineWithoutComment = previousLine.substring(2);
  } else if (previousLine.startsWith("# ")) {
    lineWithoutComment = previousLine.substring(2);
  } else if (previousLine.startsWith("#")) {
    lineWithoutComment = previousLine.substring(1);
  }

  // Check for unquoted file path and trim surrounding symbols/whitespace
  const trimmedLine = lineWithoutComment
    .trim()
    .replace(/^[^\w/]+|[^\w/]+$/g, "");
  if (isFilePath(trimmedLine)) return trimmedLine;

  // Check for first quoted file path
  for (const quotedPath of findQuoted(previousLine)) {
    // Use original line for quoted paths
    if (isFilePath(quotedPath)) return quotedPath;
  }

  const validUnquotedPath = findFirstValidUnquotedPath(trimmedLine);
  if (validUnquotedPath) return validUnquotedPath;
}

function findFirstValidUnquotedPath(line: string) {
  // Regular expression to match potential file paths
  const regex = /[\w/.-]+/g;
  const matches = line.match(regex);
  if (matches) {
    for (const match of matches) {
      if (isFilePath(match)) {
        return match;
      }
    }
  }
  return undefined;
}

function* findQuoted(line: string) {
  const regex = /['"`]([^'"`]+)['"`]/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    yield match[1];
  }
}
