import { extractCommentString } from "./extractCommentString.js";
import { extractFilenameFromLine } from "./extractFilenameFromLine.js";

export function extractFilenameFromCodeBlock(
  content: string
): string | undefined {
  const firstLine = content.trim().split("\n")[0];
  if (!firstLine) return;

  const commentContent = extractCommentString(firstLine);
  if (!commentContent) return;

  return extractFilenameFromLine(commentContent);
}
