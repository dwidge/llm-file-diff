import { isFilePath } from "./isFilePath.js";

export function extractFilenameFromLine(previousLine: string) {
  // Check for unquoted file path and trim surrounding symbols/whitespace
  const trimmedLine = previousLine.trim().replace(/^[^\w/]+|[^\w/]+$/g, "");
  if (isFilePath(trimmedLine)) return trimmedLine;

  // Check for first quoted file path
  for (const quotedPath of findQuoted(previousLine)) {
    if (isFilePath(quotedPath)) return quotedPath;
  }
}

function* findQuoted(line: string) {
  const regex = /['"`]([^'"`]+)['"`]/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    yield match[1];
  }
}
