import { isFilePath } from "./isFilePath.js";

export function extractFilenameFromLine(previousLine: string) {
  // Check for unquoted file path
  if (isFilePath(previousLine)) return previousLine;

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
